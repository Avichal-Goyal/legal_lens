import PDFParser from "pdf2json";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { NextResponse } from "next/server";

function cleanLegalChunk(text) {
    return String(text)
        .replace(/\s+/g, ' ')
        // Allow common legal symbols like $, §, and license number markers
        .replace(/[^a-zA-Z0-9\s,.\-\[\]#§$☆*]/g, '') 
        .trim();
}



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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    // Start of pdf2json Replacement Logic
    const chunkArray = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      // Event handler for when the parser encounters an error
      pdfParser.on("pdfParser_dataError", (errData) => {
        console.error("PDF Parsing Error:", errData.parserError);
        reject(new Error("Failed to parse PDF content."));
      });

      // Event handler for when the parser has successfully read the PDF
      pdfParser.on("pdfParser_dataReady",async (pdfData) => {

        let allChunks = [];

        for (let index=0; index < pdfData.Pages.length; index++) {
          const page = pdfData.Pages[index];
          const pageNum = index + 1;

          const textItems = page.Texts.map(textItem => ({
            x : textItem.x,
            y : textItem.y,
            text : textItem.R.map(run => decodeURIComponent(run.T)).join("")
          })).sort((a,b) => a.y - b.y || a.x - b.x);

          const fullPageText = textItems.map(item => item.text).join(" ");

          const pageSubChunks = await splitter.createDocuments([fullPageText]);

          pageSubChunks.forEach((doc, subIndex) => {
            const isContinuation = subIndex > 0;
            const header = `--- PAGE ${pageNum}${isContinuation ? 'contd.' : ''} ---`;

            const cleanText = cleanLegalChunk(`${header} ${doc.pageContent}`);

            if (cleanText.length > 50) {
              allChunks.push({
                content: cleanText,
                metadata: {
                  page_number: pageNum,
                  is_continuation: isContinuation
                }
              });
            }
          })
        }

        console.log(`Number of Chunks: ${allChunks.length}`)

        resolve(allChunks);
      });

      // Load the PDF from the buffer in memory
      pdfParser.parseBuffer(buffer);
    });
    // --- End of pdf2json Replacement Logic ---

    if (!chunkArray || chunkArray.length === 0) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF" },
        { status: 400 }
      );
    }

    return NextResponse.json({
        data: chunkArray,
        message: "Chunks created successfully",
        count: chunkArray.length
    });

  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}