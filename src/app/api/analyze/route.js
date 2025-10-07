// import { NextResponse } from 'next/server.js';
// import { analyzeDocumentWithGroq } from '@/lib/huggingFace.js';

// export async function POST(request) {
//   try {
//     const { text } = await request.json();

//     if (!text || typeof text !== 'string') {
//       return NextResponse.json(
//         { error: 'Invalid input: text is required and must be a string' }, 
//         { status: 400 }
//       );
//     }

//     if (text.length > 30000) {
//       return NextResponse.json(
//         { error: 'Document text exceeds maximum length of 30,000 characters' }, 
//         { status: 400 }
//       );
//     }

//     const analysis = await analyzeDocumentWithGroq(text);
//     return NextResponse.json(analysis, { status: 200 });

//   } catch (error) {
//     console.error('Analysis API error:', error);
    
//     if (error.message.includes('Failed to analyze document')) {
//       return NextResponse.json(
//         { error: 'Document analysis service temporarily unavailable' }, 
//         { status: 503 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Internal Server Error' }, 
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import { analyzeDocumentWithGroq } from '@/lib/huggingFace';

export async function POST(request) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const analysis = await analyzeDocumentWithGroq(text);
    return NextResponse.json(analysis, { status: 200 });
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
