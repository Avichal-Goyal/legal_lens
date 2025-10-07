// import { NextResponse } from 'next/server.js';
// import { getConsultantResponseGroq } from '@/lib/huggingFace.js';
// import dbConnect from '@/lib/mongodb';
// import ChatSession from '@/lib/models/chatModel';
// import { v4 as uuidv4 } from 'uuid';

// export async function POST(request) {
//   try {
//     const { message, sessionId } = await request.json();

//     if (!message || typeof message !== 'string') {
//       return NextResponse.json(
//         { error: 'Invalid input: message is required and must be a string' }, 
//         { status: 400 }
//       );
//     }

//     await dbConnect();
    
//     let chatSession;
//     let actualSessionId = sessionId;
    
//     // Create new session if no sessionId provided
//     if (!sessionId) {
//       actualSessionId = uuidv4();
//       chatSession = new ChatSession({
//         sessionId: actualSessionId,
//         messages: [{
//           role: 'system',
//           parts: 'Conversation started',
//           timestamp: new Date()
//         }]
//       });
//       await chatSession.save();
//     } else {
//       // Find existing session
//       chatSession = await ChatSession.findOne({ sessionId });
//       if (!chatSession) {
//         return NextResponse.json(
//           { error: 'Chat session not found' }, 
//           { status: 404 }
//         );
//       }
//     }

//     // Add user message to session
//     chatSession.messages.push({
//       role: 'user',
//       parts: message,
//       timestamp: new Date()
//     });
    
//     // Get response from Groq
//     const response = await getConsultantResponseGroq(message);
    
//     // Add AI response to session
//     chatSession.messages.push({
//       role: 'model',
//       parts: response,
//       timestamp: new Date()
//     });
    
//     // Save updated session
//     await chatSession.save();
    
//     return NextResponse.json({
//       response,
//       sessionId: actualSessionId
//     }, { status: 200 });

//   } catch (error) {
//     console.error('Consult API error:', error);
    
//     if (error.message.includes('Failed to generate consultant response')) {
//       return NextResponse.json(
//         { error: 'Consultant service temporarily unavailable' }, 
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
import { getConsultantResponseGroq } from '@/lib/huggingFace';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/lib/models/chatModel';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { message, sessionId } = await request.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    await dbConnect();

    let chatSession;
    let actualSessionId = sessionId;

    if (!sessionId) {
      actualSessionId = uuidv4();
      chatSession = new ChatSession({
        sessionId: actualSessionId,
        messages: [{ role: 'system', parts: 'Conversation started', timestamp: new Date() }],
      });
      await chatSession.save();
    } else {
      chatSession = await ChatSession.findOne({ sessionId });
      if (!chatSession) return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
    }

    chatSession.messages.push({ role: 'user', parts: message, timestamp: new Date() });

    const responseText = await getConsultantResponseGroq(message);

    chatSession.messages.push({ role: 'model', parts: responseText, timestamp: new Date() });
    await chatSession.save();

    return NextResponse.json({ response: responseText, sessionId: actualSessionId }, { status: 200 });
  } catch (error) {
    console.error('Consult API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
