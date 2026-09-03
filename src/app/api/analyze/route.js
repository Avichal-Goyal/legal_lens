import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyze_doc_using_groq } from "@/helper/analyzeDoc";
import { startRagTrace } from "@/lib/ragMonitoring";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import axios from 'axios';


// Note: fs, path, and os are no longer needed for this logic
// as we will process the file in memory.

export const runtime = "nodejs";

export async function POST(request) {
  let trace;
  let documentId = null;
  let userId = null;
  try {
    const session = await getServerSession(
      authOptions
    );
    if (!session?.user?.id) {
      return NextResponse.json(
        {error: "Unauthorized"},
        {status: 401}
      );
    }

    const userId = String(session.user.id);

    // Reading File
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    const fileName = file.name;
    documentId = crypto.randomUUID();

    trace = startRagTrace("document_ingestion", {
      fileSizeBytes: file.size,
      mimeType: file.type || "unknown",
    });

    // Uploading this doc to supabase
    const fileBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    const storagePath = `${userId}/${documentId}/${fileName}`;
    const storageStartedAt = Date.now();

    const {
      error: storageError
    } = await supabase.storage.from("documents").upload(
      storagePath,
      fileBuffer,
      {
        contentType: file.type || "application/pdf",
        upsert: false,
      }
    );

    if (storageError) {
      throw storageError;
    }

    trace.stage("document_storage", {
        durationMs:
            Date.now() - storageStartedAt,

        storagePath,
    });

    const { error : documentError } = await supabase
    .from("documents")
    .insert({
      id: documentId,
      user_id: userId,
      file_name: fileName,
      storage_path: storagePath,
      mime_type: file.type || "application/pdf",
      file_size: file.size,
      status: "processing",
    });

    if (documentError) {
      throw documentError;
    }

    const parsingStartedAt = Date.now();

    const parsingResponse = await axios.post(
      "http://localhost:3000/api/analyze/parsing_chunking",
      formData
    );

    const chunks = parsingResponse.data.data;

    trace.stage("parsing", {
      durationMs: Date.now() - parsingStartedAt,
      chunkCount: chunks.length,
    });

    // Now, we have the extracted text from the PDF.
    // Next, we can analyze it using the Groq model.

    // const chunks = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunking", { text : text }).then(res => res.data.data);

    //Now we will convert those chunks into vectors
    const embeddingStartedAt = Date.now();

    const embeddingResponse = await axios.post(
      "http://localhost:3000/api/analyze/doc_vector_storing/chunk_embedding",
      { chunks }
    );

    const vectors = embeddingResponse.data.data;

    trace.stage("embedding", {
      durationMs: Date.now() - embeddingStartedAt,
      requestedVectorCount: chunks.length,
      receivedVectorCount: vectors.length,
    });

    if (vectors.length !== chunks.length) {
      throw new Error(
        `Embedding count mismatch: expected ${chunks.length}, received ${vectors.length}`
      );
    }

    //const vector_storing = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunk_vector_store", { chunks : chunks, vectors : vectors, fileName : fileName }).then(res => res.data);

    let currentActualPage = 1;
    const rows = chunks.map((chunk, index) => ({
        document_id: documentId,
        content: chunk.content,
        embedding: vectors[index],
        metadata: chunk.metadata,
    }));


    // Save to the 'legal_docs' table
    const storageVecChunksStartedAt = Date.now();

    const { error } = await supabase.from("legal_docs").insert(rows);

    if (error) {
      throw error;
    }

    trace.stage("vector_storage", {
      durationMs: Date.now() - storageVecChunksStartedAt,
      storedChunkCount: rows.length,
    });

    // AI Analysis

    let aiAnalysis = null;

    const analysisStartedAt = Date.now();

    try {
        aiAnalysis = await analyze_doc_using_groq(chunks);

        trace.stage("ai_analysis", {
            durationMs: Date.now() - analysisStartedAt,
            status: "success",
        });

    } catch (analysisError) {

        console.error(
            "AI analysis failed, continuing document processing:",
            analysisError
        );

        trace.stage("ai_analysis", {
            durationMs: Date.now() - analysisStartedAt,
            status: "failed",
            error: analysisError?.message || "Unknown AI analysis error",
        });

        // Keep the ingestion pipeline running.
        aiAnalysis = null;
    }

    const {
      error: updateError
    } = await supabase
      .from("documents")
      .update({
          status: "ready",
          updated_at: new Date().toISOString(),
      })
      .eq("id", documentId)
      .eq("user_id", userId);

    if (updateError) {
      throw updateError;
    }

    trace.success({
      documentId,
      chunkCount: chunks.length,
    });

    return NextResponse.json(
        {
            analysis: aiAnalysis,
            message:
                "Legal document processed successfully.",
            documentId,
            fileName,
            chunkCount: chunks.length,
            traceId: trace.traceId,
        },
        { status: 200 }
    );

  } catch (error) {
    trace?.failure(error);

    if (documentId) {
      await supabase
      .from("documents")
      .update({
          status: "failed",
          updated_at:
              new Date().toISOString(),
      })
      .eq("id", documentId);
    }

    console.error(
      "Document ingestion failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Document analysis failed.",
        traceId: trace?.traceId,
      },
      { status: 500 }
    );
  }
}