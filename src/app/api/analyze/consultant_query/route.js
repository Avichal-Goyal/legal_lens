import { query_to_vector } from "@/helper/convert_to_vector";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { getDocQueryResponse, rephraseUserQuery } from "@/lib/huggingFace";
import { startRagTrace } from "@/lib/ragMonitoring";
import { findSimilarCachedResponse, cacheRagResponse } from "@/lib/ragSemanticCache";
import { initRagSemanticCache } from "@/lib/initRagCache";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(request) {
    let trace;
    try {
        const { query, history, documentId } = await request.json();

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = String(session.user.id);

        trace = startRagTrace(
            "rag_query",
            {
                userId,
                documentId,
                queryLength: query.length,
            }
        );

        const documentCheckStartedAt = Date.now();

        // 1. Fetch document and include 'domain' for dynamic routing
        const {
            data: document,
            error: documentError,
        } = await supabase
            .from("documents")
            .select("id, user_id, file_name, status, domain")
            .eq("id", documentId)
            .eq("user_id", userId)
            .single();

        trace.stage(
            "document_authorization",
            {
                durationMs: Date.now() - documentCheckStartedAt,
                authorized: !documentError && !!document,
            }
        );

        if (documentError || !document) {
            trace.failure(
                new Error("Document not found or user is not authorized")
            );

            return NextResponse.json(
                {
                    error: "Document not found",
                    traceId: trace.traceId,
                },
                { status: 404 }
            );
        }

        if (document.status !== "ready") {
            trace.failure(
                new Error("Document is not ready")
            );

            return NextResponse.json(
                {
                    error: "Document is still being processed",
                    traceId: trace.traceId,
                },
                { status: 409 }
            );
        }

        // 2. Query Rephrasing
        const rephraseStartedAt = Date.now();
        const rephrasedQuery = await rephraseUserQuery(query, history);
        trace.stage(
            "query_rephrasing",
            {
                durationMs: Date.now() - rephraseStartedAt,
                originalQueryLength: query.length,
                rephrasedQueryLength: rephrasedQuery.length,
            }
        );

        // 3. Dense Vector Embedding Generation
        const embeddingStartedAt = Date.now();
        const queryVector = await query_to_vector(rephrasedQuery);
        trace.stage(
            "query_embedding",
            {
                durationMs: Date.now() - embeddingStartedAt,
                embeddingDimension: queryVector.length,
            }
        );

        console.log("DEBUG: Query Vector Sample:", queryVector);

        // 4. Semantic Cache Check (Isolated by Vertical/Domain)
        await initRagSemanticCache();
        const cacheStartedAt = Date.now();

        const cachedResult = await findSimilarCachedResponse({
            userId,
            documentId,
            queryEmbedding: queryVector,
            similarityThreshold: 0.9,
            domain: document.domain || "legal",
        });

        const cacheLookupDurationMs = Date.now() - cacheStartedAt;

        if (cachedResult) {
            trace.stage(
                "semantic_cache",
                {
                    hit: true,
                    similarity: cachedResult.similarity,
                    distance: cachedResult.distance,
                    lookupDurationMs: cacheLookupDurationMs,
                    cacheId: cachedResult.cacheId,
                }
            );

            trace.success({
                cacheHit: true,
                cacheSimilarity: cachedResult.similarity,
                retrievedChunkCount: 0,
                llmCalled: false,
            });

            return NextResponse.json({
                ...cachedResult.response,
                cached: true,
                cacheSimilarity: cachedResult.similarity,
                traceId: trace.traceId,
            });
        }

        // Cache miss
        trace.stage(
            "semantic_cache",
            {
                hit: false,
                lookupDurationMs: cacheLookupDurationMs,
            }
        );

        // 5. Dynamic Vector Retrieval via match_documents_dynamic
        const retrievalStartedAt = Date.now();
        const { data: documents, error } = await supabase.rpc("match_documents_dynamic", {
            query_embedding: queryVector,
            match_threshold: 0.5,
            match_count: 8,
            user_uuid: userId,
            doc_domain: document.domain || "legal",
            target_doc_id: documentId, // Restricts retrieval strictly to this active document
        });

        if (error) console.error("Supabase RPC match_documents_dynamic error:", error);
        console.log("Retrieved chunks count:", documents?.length);

        trace.stage(
            "vector_retrieval",
            {
                durationMs: Date.now() - retrievalStartedAt,
                retrievedChunkCount: documents?.length ?? 0,
                matchThreshold: 0.4,
                matchCount: 8,
            }
        );

        if (!documents || documents.length === 0) {
            console.log("NO CHUNK RETRIEVED BY SUPABASE");

            const llmStartedAt = Date.now();
            const aiGeneratedAnswer = await getDocQueryResponse(
                query,
                "",
                document.domain || "legal"
            );

            trace.stage(
                "llm_generation",
                {
                    durationMs: Date.now() - llmStartedAt,
                    usedContext: false,
                    retrievedChunkCount: 0,
                }
            );

            trace.success({
                cacheHit: false,
                retrievedChunkCount: 0,
                llmCalled: true,
                cachedResponse: false,
            });

            return NextResponse.json({
                answer: aiGeneratedAnswer,
                sources: [],
                uniquePages: [],
                cached: false,
                traceId: trace.traceId,
            });
        } else {
            console.log(documents);
        }

        // 6. Context Assembly with Page Metadata
        const contextFromSupabase = documents
            .map((doc, index) => `[Source ${index + 1} - Page ${doc.metadata?.page_number}]: ${doc.content}`)
            .join("\n\n");

        const sources = documents.map((doc) => ({
            content: doc.content,
            pageNumber: doc.metadata?.page_number,
        }));

        const uniquePages = [...new Set(documents.map((doc) => doc.metadata?.page_number))];

        // 7. Domain-Specific LLM Answer Generation
        const llmStartedAt = Date.now();
        const aiGeneratedAnswer = await getDocQueryResponse(
            rephrasedQuery,
            contextFromSupabase,
            document.domain || "legal"
        );

        trace.stage(
            "llm_generation",
            {
                durationMs: Date.now() - llmStartedAt,
                retrievedChunkCount: documents.length,
                usedContext: true,
            }
        );

        console.log("AI Generated Answer using context:", aiGeneratedAnswer);

        const responseData = {
            answer: aiGeneratedAnswer,
            sources,
            uniquePages,
        };

        // 8. Persist Answer to Semantic Cache
        const cacheStoreStartedAt = Date.now();
        const cacheId = await cacheRagResponse({
            userId,
            documentId,
            queryEmbedding: queryVector,
            response: responseData,
            domain: document.domain || "legal",
        });

        trace.stage(
            "semantic_cache_store",
            {
                durationMs: Date.now() - cacheStoreStartedAt,
                stored: true,
                cacheId,
            }
        );

        trace.success({
            cacheHit: false,
            retrievedChunkCount: documents.length,
            uniquePageCount: uniquePages.length,
            llmCalled: true,
            cacheStored: true,
        });

        return NextResponse.json({
            ...responseData,
            cached: false,
            traceId: trace.traceId,
        });
    } catch (error) {
        console.error("Error in fetching consultant answer: ", error);
        trace?.failure(error);

        return NextResponse.json(
            {
                error: "Failed to process consultant query.",
                traceId: trace?.traceId,
            },
            { status: 500 }
        );
    }
}