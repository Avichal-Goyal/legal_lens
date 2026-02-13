import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { analyze_doc_using_groq } from "@/helper/analyzeDoc";

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

    const fileName = file ? file.name : "unknown_legal_doc.pdf";

    const text = await axios.post("http://localhost:3000/api/analyze/doc_parsing", formData).then(res => res.data.data);

    // Now, we have the extracted text from the PDF.
    // Next, we can analyze it using the Groq model.

    const chunks = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunking", { text : text }).then(res => res.data.data);

    //Now we will convert those chunks into vectors
    const vectors = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunk_embedding", { chunks : chunks }).then(res => res.data.data);

    const vector_storing = await axios.post("http://localhost:3000/api/analyze/doc_vector_storing/chunk_vector_store", { chunks : chunks, vectors : vectors, fileName : fileName });

    if (vector_storing.status !== 200) {
        throw new Error("Vector storage returned an error status");
    }

    // let currentActualPage = 1;
    // const rows = chunks.map((chunkText, index) => {
    //   // Look for the "--- PAGE X ---" stamp in the text
    //   const match = chunkText.match(/--- PAGE (\d+) ---/);
    //   if (match) currentActualPage = parseInt(match[1]);

    //   return {
    //     file_name: fileName,
    //     content: chunkText,
    //     embedding: vectors[index], // The vector from your Embedding route
    //     metadata: { page_number: currentActualPage }
    //   };
    // });


    // // Save to the 'legal_docs' table
    // const { data, error } = await supabase
    //   .from('legal_docs')
    //   .insert(rows);

    // if (error) throw error;

    // console.log(`Successfully saved ${rows.length} chunks to Supabase.`)
    const aiAnalysis = await analyze_doc_using_groq(chunks);


    return NextResponse.json(aiAnalysis, {
        success: true,
        message: "Legal document processed successfully!"
    });

  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}