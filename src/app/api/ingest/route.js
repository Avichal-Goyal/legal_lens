// app/api/ingest/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // 1. Receive the file from the Next.js frontend upload form
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log(`Forwarding ${file.name} to local Python parser...`);
    
    // 2. Define the Python service URL
    // Defaults to localhost:8000 for local development
    const pythonServiceUrl = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
    
    // 3. Forward the exact FormData directly to the FastAPI server
    const response = await fetch(`${pythonServiceUrl}/api/extract`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Python microservice error: ${response.statusText}`);
    }

    // 4. Extract the Markdown string returned by PyMuPDF4LLM
    const data = await response.json();

    if (data.error) {
       throw new Error(data.error);
    }

    // Output the formatted Markdown so we can verify table retention
    return NextResponse.json({ 
      message: "PyMuPDF4LLM Parsing successful", 
      markdownPreview: data.markdown.substring(0, 1500) // Preview first 1500 chars 
    });

  } catch (error) {
    console.error("Ingestion Error:", error.message);
    return NextResponse.json({ error: "Failed to parse document" }, { status: 500 });
  }
}