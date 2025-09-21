import { GoogleGenerativeAI,HarmCategory,HarmBlockThreshold } from "@google/generative-ai";
const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DOCUMENT_ANALYSIS_PROMPT = `You are a legal document analysis assistant. Analyze the provided legal document and return a JSON object with the following structure:
{
  "summary": "A concise 2-3 sentence summary of the document's purpose and main points.",
  "keyClauses": [
    {
      "title": "Name of the clause",
      "explanation": "Plain language explanation of what this clause means and its implications"
    }
  ],
  "jargonBuster": [
    {
      "term": "Legal term found in the document",
      "definition": "Simple, easy-to-understand definition"
    }
  ]
}

Focus on identifying the most important clauses such as Parties Involved, Term Length, Termination Conditions, Liability, Confidentiality, Payment Terms, etc.`;

const CONSULTANT_SYSTEM_PROMPT = `You are a legal information assistant designed to provide educational information about legal concepts, terminology, and general legal knowledge. 

CRITICAL CONSTRAINTS:
1. You MUST begin every response with this exact disclaimer: "DISCLAIMER: I am an AI assistant and cannot provide legal advice. The information provided is for educational purposes only. Please consult with a qualified legal professional for your specific situation."
2. You must NEVER suggest specific legal strategies or courses of action.
3. You must clarify that you are not a substitute for a licensed attorney.
4. If a user describes a specific legal situation, redirect them to consult with a qualified attorney.

Your role is to explain legal concepts in plain language, provide definitions of legal terms, and offer general educational information about how the legal system works.`;

const PROOFREADING_PROMPT = `You are a legal document proofreading assistant. Analyze the provided text and return a JSON object with the following structure:
{
  "originalText": "The original text that was submitted",
  "correctedText": "The text with all corrections applied",
  "corrections": [
    {
      "type": "spelling|grammar|punctuation|clarity",
      "original": "The original text segment",
      "suggestion": "The suggested correction",
      "explanation": "Brief explanation of the issue"
    }
  ],
  "summary": "A brief summary of the types and number of corrections made (e.g., 'Fixed 3 spelling errors, improved 2 sentences for clarity')"
}

Focus on:
1. Correcting spelling, grammar, and punctuation errors
2. Improving clarity and readability while maintaining legal precision
3. Identifying ambiguous language that could be misinterpreted
4. Ensuring consistency in terminology`;

export async function analyzeDocumentWithGemini(documentText) {
  let lastError;
  let maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model=genAI.getGenerativeModel({
        model:"gemini-1.5-flash",
        generationConfig:{
        temperature:0.1,
        topK:1,
        topP:0.95,
        maxOutputTokens:2048,
        responseMimeType:'application/json',
      }
    });
    const prompt=`${DOCUMENT_ANALYSIS_PROMPT}\n\nDocument to analayze:\n${documentText.substring(0,30000)}`;
    const result=await model.generateContent(prompt);
    const response= result.response;
    const text=response.text();
    const cleanText = text.replace(/```json\s*|\s*```/g, '');
    return JSON.parse(cleanText);
  } catch (error) {
      lastError = error;

      // if it's a 503, retry with exponential backoff
      if (error.status === 503 || error.message?.includes("503")) {
        console.warn(`Gemini overloaded (attempt ${attempt}/${maxRetries})`);
        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 1000 * attempt));
          continue;
        }
      }

      // for non-503 errors or after max retries, stop
      console.error("Error in document analysis:", error);
      throw new Error("Failed to analyze document");
    }
  }

  throw lastError;
}
export async function getConsultantResponse(history, userMessage) {
  let lastError;
  let maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: CONSULTANT_SYSTEM_PROMPT,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          // responseMimeType: 'application/json',
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          },
        ],
      });
      const chat = model.startChat({
        history: history
          .filter(msg => msg.role !== 'system') // ✅ remove system messages
          .map(msg => ({
            role: msg.role,
            parts: [{ text: msg.parts }],
          })),
      });

      const result = await chat.sendMessage(userMessage);
      const response = result.response;
      return response.text();
    } catch (error) {
      lastError = error;

      // Retry on 503 errors with exponential backoff
      if (error.status === 503 || error.message?.includes("503")) {
        console.warn(`Gemini overloaded (attempt ${attempt}/${maxRetries})`);
        if (attempt < maxRetries) {
          await new Promise((res) => setTimeout(res, 1000 * attempt));
          continue;
        }
      }

      // For non-503 errors or after max retries, stop
      console.error('Error in consultant response:', error);
      throw new Error('Failed to generate consultant response');
    }
  }
  throw lastError;
}
export async function proofreadTextWithGemini(text) {
  try {
      const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 0.95,
        maxOutputTokens: 2048,
        responseMimeType: 'application/json',
      },
    });
    const prompt = `${PROOFREADING_PROMPT}\n\nText to proofread:\n${text}`;

    const result = await model.generateContent(prompt);
    const response =  result.response;
    const resultText = response.text();
    const cleanText = resultText.replace(/```json\s*|\s*```/g, '');

    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error in text proofreading:', error);
    throw new Error('Failed to proofread text');
  }
}