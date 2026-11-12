import PDFParser from "pdf2json";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextResponse } from "next/server";
import { cleanLegalChunk } from "@/lib/cleanLegalText";

export const runtime = "nodejs";

export async function POST(request) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const allChunks = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on("pdfParser_dataError", (errData) => {
        console.error("PDF Parsing Error:", errData.parserError);
        reject(new Error("Failed to parse PDF content."));
      });

      pdfParser.on("pdfParser_dataReady", async (pdfData) => {
        try {
          const chunks = [];

          for (let index = 0; index < pdfData.Pages.length; index++) {
            const page = pdfData.Pages[index];
            const pageNum = index + 1;

            const textItems = page.Texts.map((textItem) => ({
              x: textItem.x,
              y: textItem.y,
              text: textItem.R.map((run) => decodeURIComponent(run.T)).join(""),
            })).sort((a, b) => a.y - b.y || a.x - b.x);

            const fullPageText = textItems.map((item) => item.text).join(" ");
            if (!fullPageText.trim()) continue;

            const pageSubChunks = await splitter.createDocuments([fullPageText]);

            pageSubChunks.forEach((doc, subIndex) => {
              const cleanText = cleanLegalChunk(doc.pageContent);
              if (cleanText.length > 50) {
                chunks.push({
                  content: cleanText,
                  metadata: {
                    page_number: pageNum,
                    is_continuation: subIndex > 0,
                  },
                });
              }
            });
          }

          console.log(`Number of Chunks: ${chunks.length}`);
          resolve(chunks);
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.parseBuffer(buffer);
    });

    if (!allChunks || allChunks.length === 0) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF" },
        { status: 400 }
      );
    }

    console.log()
    return NextResponse.json({
      data: allChunks,
      message: "Chunks created successfully",
      count: allChunks.length,
    });
  } catch (error) {
    console.error("Parsing/Chunking API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}