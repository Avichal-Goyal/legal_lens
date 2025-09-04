// test-gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function testGemini() {
  try {
    // test-env.js
console.log('GEMINI_API_KEY from env:', process.env.GEMINI_API_KEY);
console.log('MONGODB_URI from env:', process.env.MONGODB_URI);
    console.log('Testing Gemini API connection...');
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Hello, how are you?');
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ SUCCESS: Gemini API is working!');
    console.log('Response:', text);
    
  } catch (error) {
    console.error('❌ ERROR: Gemini API test failed');
    console.error('Error message:', error.message);
    
    // Check for specific error types
    if (error.message.includes('API key not valid')) {
      console.error('Please check your Gemini API key');
    } else if (error.message.includes('quota')) {
      console.error('You may have exceeded your API quota');
    } else if (error.message.includes('permission')) {
      console.error('API permission denied - check Google Cloud Console');
    }
  }
}

testGemini();