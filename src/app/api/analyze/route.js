// import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";
// import { analyze_doc_using_groq } from "@/helper/analyzeDoc";
// import { startRagTrace } from "@/lib/ragMonitoring";
// import { authOptions } from "@/lib/auth";
// import { getServerSession } from "next-auth";
// import axios from 'axios';
// import { analyzeDocumentWithGemini } from "@/lib/huggingFace";

// export const runtime = "nodejs";
// const baseUrl = "https://legal-lens-wine-mu.vercel.app";
// export async function POST(request) {
//   let trace;
//   let documentId = null;
//   let userId = null;
//   try {
//     const session = await getServerSession(
//       authOptions
//     );
//     if (!session?.user?.id) {
//       return NextResponse.json(
//         {error: "Unauthorized"},
//         {status: 401}
//       );
//     }

//     userId = String(session.user.id);

//     // Reading File
//     const formData = await request.formData();
//     const file = formData.get("file");
//     const domain = formData.get("domain") || "legal";

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }
//     const fileName = file.name;
//     documentId = crypto.randomUUID();

//     trace = startRagTrace("document_ingestion", {
//       fileSizeBytes: file.size,
//       mimeType: file.type || "unknown",
//     });

//     // Uploading this doc to supabase
//     const fileBuffer = Buffer.from(
//       await file.arrayBuffer()
//     );

//     const storagePath = `${userId}/${documentId}/${fileName}`;
//     const storageStartedAt = Date.now();

//     const {
//       error: storageError
//     } = await supabase.storage.from("documents").upload(
//       storagePath,
//       fileBuffer,
//       {
//         contentType: file.type || "application/pdf",
//         upsert: false,
//       }
//     );

//     if (storageError) {
//       throw storageError;
//     }

//     trace.stage("document_storage", {
//         durationMs:
//             Date.now() - storageStartedAt,

//         storagePath,
//     });

//     const { error : documentError } = await supabase
//     .from("documents")
//     .insert({
//       id: documentId,
//       user_id: userId,
//       file_name: fileName,
//       storage_path: storagePath,
//       mime_type: file.type || "application/pdf",
//       file_size: file.size,
//       status: "processing",
//       domain: domain, // <-- ADD THIS line
//     });

//     if (documentError) {
//       throw documentError;
//     }

//     const parsingStartedAt = Date.now();

//     const parsingResponse = await axios.post(
//       `${baseUrl}/api/analyze/parsing_chunking`,
//       formData
//     );

//     const chunks = parsingResponse.data.data;

//     trace.stage("parsing", {
//       durationMs: Date.now() - parsingStartedAt,
//       chunkCount: chunks.length,
//     });

//     // Now, we have the extracted text from the PDF.
//     // Next, we can analyze it using the Groq model.

//     // const chunks = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunking", { text : text }).then(res => res.data.data);

//     //Now we will convert those chunks into vectors
//     const embeddingStartedAt = Date.now();

//     const embeddingResponse = await axios.post(
//       `${baseUrl}/api/analyze/doc_vector_storing/chunk_embedding`,
//       { chunks }
//     );

//     const vectors = embeddingResponse.data.data;

//     trace.stage("embedding", {
//       durationMs: Date.now() - embeddingStartedAt,
//       requestedVectorCount: chunks.length,
//       receivedVectorCount: vectors.length,
//     });

//     if (vectors.length !== chunks.length) {
//       throw new Error(
//         `Embedding count mismatch: expected ${chunks.length}, received ${vectors.length}`
//       );
//     }

//     //const vector_storing = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunk_vector_store", { chunks : chunks, vectors : vectors, fileName : fileName }).then(res => res.data);

//     let currentActualPage = 1;
//     const rows = chunks.map((chunk, index) => ({
//         document_id: documentId,
//         content: chunk.content,
//         embedding: vectors[index],
//         metadata: chunk.metadata,
//     }));


//     // Save to the 'legal_docs' table
//     const storageVecChunksStartedAt = Date.now();

//     const { error } = await supabase.from("legal_docs").insert(rows);

//     if (error) {
//       throw error;
//     }

//     trace.stage("vector_storage", {
//       durationMs: Date.now() - storageVecChunksStartedAt,
//       storedChunkCount: rows.length,
//     });

//     // AI Analysis
//     let aiAnalysis = null;
//     const analysisStartedAt = Date.now();

//     try {
//         // 1. Reconstruct the full document string from your array of chunk objects
//         const fullDocumentText = chunks.map(chunk => chunk.content).join("\n\n");
        
//         // 2. Pass the full text string to Gemini (gemini-1.5-flash handles up to 1M tokens easily)
//         aiAnalysis = await analyzeDocumentWithGemini(fullDocumentText);

//         trace.stage("ai_analysis", {
//             durationMs: Date.now() - analysisStartedAt,
//             status: "success",
//         });

//     } catch (analysisError) {
//         console.error("AI analysis failed, continuing document processing:", analysisError);

//         trace.stage("ai_analysis", {
//             durationMs: Date.now() - analysisStartedAt,
//             status: "failed",
//             error: analysisError?.message || "Unknown AI analysis error",
//         });

//         // Keep the ingestion pipeline running even if analysis fails
//         aiAnalysis = null;
//     }
//     // ------------------------------------------------

//     // const analysisStartedAt = Date.now();

//     // try {
//     //     aiAnalysis = await analyze_doc_using_groq(chunks);

//     //     trace.stage("ai_analysis", {
//     //         durationMs: Date.now() - analysisStartedAt,
//     //         status: "success",
//     //     });

//     // } catch (analysisError) {

//     //     console.error(
//     //         "AI analysis failed, continuing document processing:",
//     //         analysisError
//     //     );

//     //     trace.stage("ai_analysis", {
//     //         durationMs: Date.now() - analysisStartedAt,
//     //         status: "failed",
//     //         error: analysisError?.message || "Unknown AI analysis error",
//     //     });

//     //     // Keep the ingestion pipeline running.
//     //     aiAnalysis = null;
//     // }

//     const {
//       error: updateError
//     } = await supabase
//       .from("documents")
//       .update({
//           status: "ready",
//           updated_at: new Date().toISOString(),
//       })
//       .eq("id", documentId)
//       .eq("user_id", userId);

//     if (updateError) {
//       throw updateError;
//     }

//     trace.success({
//       documentId,
//       chunkCount: chunks.length,
//     });

//     return NextResponse.json(
//         {
//             analysis: aiAnalysis,
//             message:
//                 "Legal document processed successfully.",
//             documentId,
//             fileName,
//             chunkCount: chunks.length,
//             traceId: trace.traceId,
//         },
//         { status: 200 }
//     );

//   } catch (error) {
//     trace?.failure(error);

//     if (documentId) {
//       await supabase
//       .from("documents")
//       .update({
//           status: "failed",
//           updated_at:
//               new Date().toISOString(),
//       })
//       .eq("id", documentId);
//     }

//     console.error(
//       "Document ingestion failed:",
//       error
//     );

//     return NextResponse.json(
//       {
//         error: "Document analysis failed.",
//         traceId: trace?.traceId,
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { startRagTrace } from "@/lib/ragMonitoring";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { analyzeDocumentWithGemini } from "@/lib/huggingFace";
import { MarkdownTextSplitter } from "@langchain/textsplitters";
// 1. Import your custom embedding function instead of LangChain's
import { query_to_vector } from "@/helper/convert_to_vector";

export const runtime = "nodejs";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 2. Add your custom batching logic directly into the route to avoid Axios overhead
async function embedBatchWithRetry(batch, batchIndex, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const textArray = batch.map(chunk => chunk.content);
      const vectorsForBatch = await query_to_vector(textArray);
      return vectorsForBatch;
    } catch (error) {
      lastError = error;
      console.error(`Batch ${batchIndex} failed (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt < maxRetries) await sleep(1000 * attempt);
    }
  }
  throw new Error(`Embedding batch ${batchIndex} failed after ${maxRetries} attempts: ${lastError.message}`);
}

export async function POST(request) {
  let trace;
  let documentId = null;
  let userId = null;
  
  try {
    // 1. Auth & Initialization
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    userId = String(session.user.id);

    const formData = await request.formData();
    const file = formData.get("file");
    const domain = formData.get("domain") || "legal";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    
    const fileName = file.name;
    documentId = crypto.randomUUID();

    trace = startRagTrace("document_ingestion", {
      fileSizeBytes: file.size,
      mimeType: file.type || "unknown",
    });

    // 2. Upload to Supabase Storage
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const storagePath = `${userId}/${documentId}/${fileName}`;
    const storageStartedAt = Date.now();

    const { error: storageError } = await supabase.storage.from("documents").upload(
      storagePath, fileBuffer, { contentType: file.type || "application/pdf", upsert: false }
    );
    if (storageError) throw storageError;

    trace.stage("document_storage", {
        durationMs: Date.now() - storageStartedAt,
        storagePath,
    });

    // 3. Document Metadata DB Entry
    const { error: documentError } = await supabase.from("documents").insert({
      id: documentId,
      user_id: userId,
      file_name: fileName,
      storage_path: storagePath,
      mime_type: file.type || "application/pdf",
      file_size: file.size,
      status: "processing",
      domain: domain,
    });
    if (documentError) throw documentError;

    // ==========================================
    // PIPELINE: Parsing -> Chunking -> Custom Embedding
    // ==========================================
    
    // A. Parse via Python Microservice
    const parsingStartedAt = Date.now();
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
    
    const parsingResponse = await fetch(`${pythonServiceUrl}/api/extract`, {
      method: 'POST',
      body: formData,
    });
    
    if (!parsingResponse.ok) throw new Error(`Python error: ${parsingResponse.statusText}`);
    
    const parsedData = await parsingResponse.json();
    if (parsedData.error) throw new Error(parsedData.error);
    
    // B. Chunk with LangChain Markdown Splitter
    const splitter = new MarkdownTextSplitter({ chunkSize: 1000, chunkOverlap: 150 });
    const langChainDocs = await splitter.createDocuments([parsedData.markdown]);
    
    const chunks = langChainDocs.map(doc => ({
      content: doc.pageContent,
      metadata: doc.metadata 
    }));

    trace.stage("parsing", {
      durationMs: Date.now() - parsingStartedAt,
      chunkCount: chunks.length,
    });

    // C. Generate Vectors using your Custom Gemini SDK logic
    const embeddingStartedAt = Date.now();
    const batch_size = 20;
    let allVectors = [];

    for (let i = 0; i < chunks.length; i += batch_size) {
      const batch = chunks.slice(i, i + batch_size);
      const batchIndex = Math.floor(i / batch_size) + 1;
      
      const vectorsForBatch = await embedBatchWithRetry(batch, batchIndex);
      allVectors.push(...vectorsForBatch);

      // Your required rate limit pacing
      if (batchIndex % 5 === 0) {
          console.log("Approaching quota limit. Sleeping for 60 seconds...");
          await sleep(60000);
      } else {
          await sleep(1000);
      }
    }

    trace.stage("embedding", {
      durationMs: Date.now() - embeddingStartedAt,
      requestedVectorCount: chunks.length,
      receivedVectorCount: allVectors.length,
    });

    if (allVectors.length !== chunks.length) {
      throw new Error(`Embedding mismatch: expected ${chunks.length}, received ${allVectors.length}`);
    }

    // D. Save Vectors to your custom 'legal_docs' table
    const storageVecChunksStartedAt = Date.now();
    const rows = chunks.map((chunk, index) => ({
        document_id: documentId,
        content: chunk.content,
        embedding: allVectors[index],
        metadata: chunk.metadata,
    }));

    const { error } = await supabase.from("legal_docs").insert(rows);
    if (error) throw error;

    trace.stage("vector_storage", {
      durationMs: Date.now() - storageVecChunksStartedAt,
      storedChunkCount: rows.length,
    });
    // ==========================================

    // 4. AI Document Analysis (Gemini Summary)
    let aiAnalysis = null;
    const analysisStartedAt = Date.now();

    try {
        const fullDocumentText = parsedData.markdown; 
        aiAnalysis = await analyzeDocumentWithGemini(fullDocumentText);

        trace.stage("ai_analysis", {
            durationMs: Date.now() - analysisStartedAt,
            status: "success",
        });
    } catch (analysisError) {
        console.error("AI analysis failed:", analysisError);
        trace.stage("ai_analysis", {
            durationMs: Date.now() - analysisStartedAt,
            status: "failed",
            error: analysisError?.message || "Unknown error",
        });
    }

    // 5. Finalize Document Status
    const { error: updateError } = await supabase.from("documents")
      .update({ status: "ready", updated_at: new Date().toISOString() })
      .eq("id", documentId)
      .eq("user_id", userId);

    if (updateError) throw updateError;

    trace.success({ documentId, chunkCount: chunks.length });

    return NextResponse.json({
        analysis: aiAnalysis,
        message: "Legal document processed successfully.",
        documentId,
        fileName,
        chunkCount: chunks.length,
        traceId: trace.traceId,
    }, { status: 200 });

  } catch (error) {
    trace?.failure(error);

    if (documentId) {
      await supabase.from("documents")
        .update({ status: "failed", updated_at: new Date().toISOString() })
        .eq("id", documentId);
    }
    console.error("Document ingestion failed:", error);
    return NextResponse.json({ error: "Document analysis failed.", traceId: trace?.traceId }, { status: 500 });
  }
}