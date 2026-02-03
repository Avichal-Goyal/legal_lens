import { NextResponse } from "next/server";

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchWithRetry(chunks, attempt = 0) {
    const MAX_RETRIES = 3;

    try {
        const response = await fetch("https://router.huggingface.co/hf-inference/models/BAAI/bge-small-en-v1.5/pipeline/feature-extraction",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
                method: "POST",
                body: JSON.stringify(
                    {
                        inputs: chunks,
                        options: { wait_for_model: true }
                    }
                )
            }
        );

        if ( response.status === 503 || response.status === 429 ) {
            throw new Error("Server Busy")
        }

        return await response.json()
    } catch (error) {
        if ( attempt >= MAX_RETRIES ) throw error;

        // Exponential Backoff Logic
        const backOffTime = Math.pow(2, attempt) * 1000;

        // Jitter
        const jitter = Math.random() * 1000;

        const totalWait = backOffTime + jitter;

        console.log(`Retrying in ${Math.round(totalWait)}ms...`);

        // Now waiting before calling the AI model again
        await new Promise(res => setTimeout(res, totalWait));
        return fetchWithRetry(chunks, attempt + 1);
    }
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
                const vectors_for_cur_batch = await fetchWithRetry(batch);
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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }


}