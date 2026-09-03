import { supabase } from "@/lib/supabase";
import { query_to_vector } from "@/helper/convert_to_vector";
import { docQueryAssistant } from "@/lib/huggingFace";
import { findSimilarCachedResponse, cacheRagResponse } from "@/lib/ragSemanticCache";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = String(session.user.id);

    const { query, domain = 'educational' } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Generate embedding using your project's actual helper
    const queryVector = await query_to_vector(query);

    // 2. Check Semantic Cache FIRST (Pass null for documentId to trigger 'GLOBAL' search)
    const cachedResult = await findSimilarCachedResponse({
        userId,
        documentId: null, 
        queryEmbedding: queryVector,
        similarityThreshold: 0.90,
        domain: domain, 
    });

    if (cachedResult) {
        return NextResponse.json({ ...cachedResult.response, cached: true });
    }

    // 3. Cache Miss: Execute the multi-doc global search via Supabase RPC
    const { data: retrievedChunks, error } = await supabase.rpc('match_documents_dynamic', {
      query_embedding: queryVector,
      match_threshold: 0.4,
      match_count: 15,
      user_uuid: userId,
      doc_domain: domain,
      target_doc_id: null // Explicitly null to search all documents in this domain
    });

    if (error) {
      console.error("Supabase Global RPC Error:", error);
      throw error;
    }

    // 4. Build context and invoke the multi-domain AI assistant
    const context = (retrievedChunks || []).map(c => `[Source - Page ${c.metadata?.page_number}]: ${c.content}`).join("\n\n");
    const aiGeneratedAnswer = await docQueryAssistant(query, context, domain);

    const responseData = {
        answer: aiGeneratedAnswer,
        sources: retrievedChunks || []
    };

    // 5. Store the synthesized result in the global cache
    await cacheRagResponse({
        userId,
        documentId: null, 
        queryEmbedding: queryVector,
        response: responseData,
        domain: domain,
    });

    return NextResponse.json({ ...responseData, cached: false });

  } catch (error) {
    console.error("Global Query Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}