import { NextResponse } from "next/server";
import { analyzeDocumentWithGroq } from "@/lib/huggingFace";

import axios from 'axios';


// Note: fs, path, and os are no longer needed for this logic
// as we will process the file in memory.

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await axios.post("http://localhost:3000/api/analyze/doc_parsing", formData).then(res => res.data.data);

    // Now, we have the extracted text from the PDF.
    // Next, we can analyze it using the Groq model.

    const chunks = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunking", { text : text }).then(res => res.data.data);

    //Now we will convert those chunks into vectors
    const vectors = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunk_embedding", { chunks : chunks }).then(res => res.data.data);


    return NextResponse.json({
        success: true,
        message: "Legal document processed successfully!",
        data: {
            chunkCount: chunks.length,
            vectorCount: vectors.length,
            // You can even return a small preview of the first vector to verify
            preview: vectors.slice(0, 1)
        }
    });

  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}