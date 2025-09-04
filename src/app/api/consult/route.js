import { NextResponse } from 'next/server.js';
import { getConsultantResponse } from '@/lib/gemini';
import dbConnect from '@/lib/mongodb';
import ChatSession from '@/lib/models/chatModel';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input: message is required and must be a string' }, 
        { status: 400 }
      );
    }

    await dbConnect();
    
    let chatSession;
    let actualSessionId = sessionId;
    

    if (!sessionId) {
      actualSessionId = uuidv4();
      chatSession = new ChatSession({
        sessionId: actualSessionId,
        messages: [{
          role: 'system',
          parts: 'Conversation started',
          timestamp: new Date()
        }]
      });
      await chatSession.save();
    } else {

      chatSession = await ChatSession.findOne({ sessionId });
      if (!chatSession) {
        return NextResponse.json(
          { error: 'Chat session not found' }, 
          { status: 404 }
        );
      }
    }

    chatSession.messages.push({
      role: 'user',
      parts: message,
      timestamp: new Date()
    });
    
    const recentMessages = chatSession.messages.slice(-10);
    const history = recentMessages.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));
    
    const response = await getConsultantResponse(history, message);
    
    chatSession.messages.push({
      role: 'model',
      parts: response,
      timestamp: new Date()
    });
    
    await chatSession.save();
    
    return NextResponse.json({
      response,
      sessionId: actualSessionId
    }, { status: 200 });

  } catch (error) {
    console.error('Consult API error:', error);
    
    if (error.message.includes('Failed to generate consultant response')) {
      return NextResponse.json(
        { error: 'Consultant service temporarily unavailable' }, 
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}