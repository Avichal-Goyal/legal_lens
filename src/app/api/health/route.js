import { NextResponse } from 'next/server.js';
import dbConnect from '@/lib/mongodb';

export async function GET() {
  try {

    await dbConnect();

    return NextResponse.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'Connected'
    }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      database: 'Disconnected',
      error: error.message
    }, { status: 500 });
  }
}