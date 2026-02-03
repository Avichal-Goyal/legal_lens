import PDFParser from "pdf2json";
import { NextResponse } from "next/server";



export const runtime = "nodejs";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // --- Start of pdf2json Replacement Logic ---
    // This part is completely new and replaces the temp file and extract logic.
    const text = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      // Event handler for when the parser encounters an error
      pdfParser.on("pdfParser_dataError", (errData) => {
        console.error("PDF Parsing Error:", errData.parserError);
        reject(new Error("Failed to parse PDF content."));
      });

      // Event handler for when the parser has successfully read the PDF
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        // pdf2json provides a structured JSON. We need to extract the text.
        // The actual text is in pdfData.Pages -> page.Texts -> textItem.R[0].T
        // It's also URI-encoded, so we need to decode it.
        const rawText = pdfData.Pages
          .map((page, index) => {
            const pageText = page.Texts
              .map(textItem => decodeURIComponent(textItem.R[0].T))
              .join(" "); // Join text blocks on a page with a space

              return `--- PAGE ${index + 1} --- ${pageText}`;
          })
          .join("\n\n"); // Join different pages with a double newline

        resolve(rawText);
      });

      // Load the PDF from the buffer in memory
      pdfParser.parseBuffer(buffer);
    });
    // --- End of pdf2json Replacement Logic ---

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "No text could be extracted from the PDF" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        data: text,
        message: "Text extracted successfully"
      }
    )
  } catch (error) {
    console.error("Analysis API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}