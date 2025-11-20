// File: app/api/readers/getJargonMeaning/route.js

import { NextResponse } from 'next/server';
import { checkJargonMeaning } from '@/lib/huggingFace'; // Your core AI function

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json();
    const { term } = body; // Extract the 'term' property we sent from the client

    if (!term || typeof term !== 'string' || term.trim() === '') {
      return NextResponse.json({ error: "A valid term must be provided." }, { status: 400 });
    }

    // Call the function that communicates with the Hugging Face API
    const meaningData = await checkJargonMeaning(term);
    
    if (meaningData.error) {
      return NextResponse.json(meaningData, { status: 500 });
    }
    
    // Send the successful response back to the client
    return NextResponse.json(meaningData, { status: 200 });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}