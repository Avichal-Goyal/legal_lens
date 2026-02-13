import { query_to_vector } from "@/helper/convert_to_vector";
import { NextResponse } from "next/server";

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function POST(request) {

    try {
        const body =  await request.json();
        console.log("FULL BODY ARRIVED:", body);
        const allChunks = body.chunks;

        console.log("Embedding Route received:", allChunks ? `${allChunks.length} chunks` : "nothing");

        if (allChunks.length === 0) {
            console.log("No chunks received in embedding route!");
            return NextResponse.json({ data: [], message: "Empty input" });
        }


        const batch_size = 20;
        let allVectors = [];

        // Sliding Window Loop
        for (let i = 0; i < allChunks.length; i += batch_size) {
            const batch = allChunks.slice(i, i + batch_size);

            console.log(`Processing Batch: ${i / batch_size + 1}`);

            try {
                const vectors_for_cur_batch = await query_to_vector(batch);
                allVectors.push(...vectors_for_cur_batch);

                await sleep(1000);
            } catch (error) {
                console.error("Batch failed after all retries. Moving to next.");
            }
        }

        console.log(`Total Vectors Generated: ${allVectors.length}`);

        return NextResponse.json({
            data: allVectors,
            message: "Embeddings generated successfully",
            count: allVectors.length
        });
    } catch (error) {
        console.error("Error in embedding route:", error);
        throw error;
    }


}