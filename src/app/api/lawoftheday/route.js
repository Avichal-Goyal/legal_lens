import { NextResponse } from "next/server.js";
import dbConnect from "@/lib/mongodb.js";
import Law from '@/lib/models/lawModel.js';
export async function GET(request) {
  try {
    await dbConnect();
    const {searchParams} = new URL(request.url);
    const category = searchParams.get('category');
    let law;
    if(category && ['Historical', 'Modern', 'Contract Law', 'Fun Fact'].includes(category)){
      law = await Law.getRandomLaw(category);
    }
    else{
      law = await Law.getRandomLaw(category);
    }
    if (!law) {
      return NextResponse.json(
        { error: 'No laws found in the database' }, 
        { status: 404 }
      );
    }
    return NextResponse.json(law, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch law of the day:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}