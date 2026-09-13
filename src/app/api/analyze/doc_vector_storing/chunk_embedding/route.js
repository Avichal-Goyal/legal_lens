import { query_to_vector } from "@/helper/convert_to_vector";
import { NextResponse } from "next/server";

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedBatchWithRetry(batch, batchIndex, maxRetries = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await query_to_vector(batch);
    } catch (error) {
      lastError = error;
      console.error(`Batch ${batchIndex} failed (attempt ${attempt}/${maxRetries}):`, error.message);
      if (attempt < maxRetries) await sleep(1000 * attempt);
    }
  }
  // Fail loudly instead of silently desyncing chunks<->vectors.
  throw new Error(`Embedding batch ${batchIndex} failed after ${maxRetries} attempts: ${lastError.message}`);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const allChunks = body.chunks;

    console.log("Embedding Route received:", allChunks ? `${allChunks.length} chunks` : "nothing");

    if (!allChunks || allChunks.length === 0) {
      return NextResponse.json({ data: [], message: "Empty input" });
    }

    const batch_size = 20;
    let allVectors = [];

    for (let i = 0; i < allChunks.length; i += batch_size) {
      const batch = allChunks.slice(i, i + batch_size);
      const batchIndex = i / batch_size + 1;
      console.log(`Processing Batch: ${batchIndex}`);

      const vectorsForBatch = await embedBatchWithRetry(batch, batchIndex);
      allVectors.push(...vectorsForBatch);

      await sleep(1000);
    }

    console.log(`Total Vectors Generated: ${allVectors.length}`);

    return NextResponse.json({
      data: allVectors,
      message: "Embeddings generated successfully",
      count: allVectors.length,
    });
  } catch (error) {
    console.error("Error in embedding route:", error);
    return NextResponse.json(
      { error: "Embedding generation failed", details: error.message },
      { status: 500 }
    );
  }
}