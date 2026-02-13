import { NextResponse } from "next/server";
import { analyzeDocumentWithGroq } from "@/lib/huggingFace";

// export async function analyze_doc_using_groq(chunks) {
//     try {
//         const allChunks = chunks;

//         if (!allChunks || allChunks.length === 0) {
//             return { data: null, message: "Empty input" };
//         }

//         // Logic: Process in batches of 10 chunks to ensure the AI has enough
//         // focus to catch jargons and clauses in detail.
//         const batch_size = 10;
//         let batchResults = [];

//         for (let i = 0; i < allChunks.length; i += batch_size) {
//             const batch = allChunks.slice(i, i + batch_size);
//             const batchText = batch.map(c => c.content).join("\n");

//             console.log(`Analyzing Batch ${Math.floor(i / batch_size) + 1}...`);

//             try {
//                 // Each call now returns { summary, keyClauses, jargonBuster }
//                 const result = await analyzeDocumentWithGroq(batchText);
//                 if (result) batchResults.push(result);
//             } catch (error) {
//                 console.error(`Error in batch starting at chunk ${i}:`, error);
//             }
//         }

//         // REDUCE STEP: Consolidate all batch results into one
//         const finalAnalysis = {
//             //notice: batchResults[0]?.notice || "Educational analysis only.",
//             // Combine all partial summaries into one text block for the final merge
//             summary: batchResults.map(r => r.summary).join("\n"),
//             // Flatten all clause and jargon arrays into single lists
//             keyClauses: batchResults.flatMap(r => r.keyClauses || []),
//             jargonBuster: batchResults.flatMap(r => r.jargonBuster || [])
//         };

//         // Optional: Perform a final "clean" summary of the combined summaries
//         // This ensures the summary doesn't sound repetitive.
//         // finalAnalysis.summary = await summarizeTheSummaries(finalAnalysis.summary);

//         return finalAnalysis;

//     } catch (error) {
//         console.error("Analysis Pipeline Error:", error);
//         return NextResponse.json({ success: false, error: "Analysis failed" }, { status: 500 });
//     }
// }

export async function analyze_doc_using_groq(chunks) {
    try {
        // Ensure we handle different chunk structures
        const allChunks = Array.isArray(chunks) ? chunks : [];
        
        // FIX 1: Extract the first 2-3 chunks to get the "Global Context" (Title/Parties)
        // const globalContext = allChunks.slice(0, 2).map(c => c.content || c.pageContent || c).join(" ");

        let batchResults = [];
        const batch_size = 10;

        for (let i = 0; i < allChunks.length; i += batch_size) {
            const batch = allChunks.slice(i, i + batch_size);
            
            // FIX 2: Prepend the Global Context to every batch so the AI knows the document identity
            const batchText = `CHUNK TO ANALYZE:\n` + batch.map(c => c.content || c.pageContent || c).join("\n");

            console.log(`Analyzing Batch ${Math.floor(i / batch_size) + 1}...`);
            const result = await analyzeDocumentWithGroq(batchText);
            if (result) batchResults.push(result);
        }

        // REDUCE STEP
        const finalAnalysis = {
            // Only use the summary from the FIRST batch (where the title is)
            // or join them and send for a final "merge" summary
            summary: batchResults.map((r, i) => `Part ${i + 1}: ${r.summary}`).join("\n\n"),
            keyClauses: batchResults.flatMap(r => r.keyClauses || []),
            jargonBuster: batchResults.flatMap(r => r.jargonBuster || [])
        };

        return finalAnalysis;
    } catch (error) {
        console.error("Analysis Pipeline Error:", error);
        return { error: "Analysis failed" };
    }
}