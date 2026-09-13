import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextResponse } from "next/server";

function cleanLegalChunk(text) {
    return String(text)
        .replace(/\s+/g, ' ') // Normalize spaces and newlines
        // Removed the aggressive regex that destroyed math and punctuation
        .trim();
}

export async function POST(request) {
    const text = await request.json().then(data => data.text);
    console.log("Raw parser [output:", text.substring(0, 500));

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    // 1. Split text into pages, keeping the "--- PAGE X ---" marker attached using a lookahead
    const pages = text.split(/(?=--- PAGE \d+ ---)/).filter(p => p.trim().length > 0);

    let finalChunks = [];
    let lastSeenPage = "Unknown";

    // 2. Process chunking page-by-page to accurately preserve metadata boundaries
    for (let i = 0; i < pages.length; i++) {
        let pageContent = pages[i];

        // Track the current page number
        const pageNumMatch = pageContent.match(/--- PAGE (\d+) ---/);
        if (pageNumMatch) {
            lastSeenPage = pageNumMatch[1];
        }

        // Chunk this specific page
        const subChunks = await splitter.createDocuments([pageContent]);

        subChunks.forEach((doc) => {
            let chunkText = cleanLegalChunk(doc.pageContent);

            // Filter out fragmented noise chunks
            if (chunkText.length < 50) return;

            // Prepend page context if the chunk doesn't already have it
            if (!chunkText.includes(`--- PAGE ${lastSeenPage}`)) {
                chunkText = `--- PAGE ${lastSeenPage} (cont.) --- ${chunkText}`;
            }

            finalChunks.push(chunkText);
        });
    }

    console.log(`Original Text Length: ${text.length}`);
    console.log(`Number of Chunks: ${finalChunks.length}`);

    return NextResponse.json({
        data: finalChunks,
        message: "Chunks created successfully",
        count: finalChunks.length
    });
}