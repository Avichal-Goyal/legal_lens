import { OpenAI } from "openai";

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

const geminiClient = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper function to pause execution during busy spikes
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const PROVIDER_CHAIN = [
  { client: geminiClient, model: "gemini-3.5-flash-lite" },       // primary: generous no-card daily reset
  { client: client, model: "Qwen/Qwen3.8-Flash-Next" },       // hfClient — your existing HF fallbacks
  { client: client, model: "deepseek-ai/DeepSeek-R1" },
  { client: client, model: "meta-llama/Meta-Llama-3-8B-Instruct" },
];

const PROMPTS = {
  documentAnalysis: `You are a meticulous document analysis assistant. Your task is to analyze the provided text and return a single, valid JSON object with a comprehensive breakdown.

CRITICAL INSTRUCTIONS:
1. Your ENTIRE response MUST be a single, valid JSON object.
2. DO NOT include any text or explanations outside of the JSON structure.
3. The JSON object must have the exact following structure:
{
  "notice": "IMPORTANT NOTICE: I am an AI assistant educator and cannot provide legal advice. The information provided is for educational purposes only and is based solely on the document you have provided. I am not a substitute for a qualified legal professional. Please consult with a licensed attorney for all your legal needs.",
  "summary": "A detailed 3-4 sentence summary of the document's purpose, key parties, and primary points.",
  "keyClauses": [
    { "title": "Clause/Point name", "explanation": "Plain-language meaning" }
  ],
  "jargonBuster": [
    { "term": "Technical term", "definition": "Simple explanation" }
  ]
}
4. For the 'keyClauses' array, identify and explain the 3-5 most important statements, commitments, or findings in the document.
5. For the 'jargonBuster' array, identify and define at least 3-5 technical, industry-specific, or potentially confusing terms from the text.
6. Only analyze the document provided. Never suggest actions or opinions.`,

  consultant: `You are a legal information assistant.

  STRICT PROTOCOL:
  1. Begin every response with: "IMPORTANT NOTICE: I am an AI assistant educator and cannot provide legal advice. The information provided is for educational purposes only and is based solely on the document you have provided. I am not a substitute for a qualified legal professional. Please consult with a licensed attorney for all your legal needs."
  2. Never suggest strategies or actions.
  3. Only answer questions about specific documents provided by the user.
  4. If asked general legal questions (like "what is a trust?"), respond: "I specialize in analyzing specific legal documents. For general legal information, please consult with a qualified attorney who can advise you based on your specific situation."
  5. Never provide comparisons, recommendations, or general legal education.
  6. Always redirect users to licensed attorneys for legal advice.`,

  proofreading: `You are a document proofreading assistant educator. Return JSON:
  {
    "originalText": "...",
    "correctedText": "...",
    "corrections": [
      { "type": "spelling|grammar|clarity", "original": "...", "suggestion": "...", "explanation": "..." }
    ],
    "summary": "Brief overview of corrections made."
  }

  CRITICAL RULES:
  1. Begin every response with: "IMPORTANT NOTICE: I am an AI assistant educator and cannot provide legal advice. The information provided is for educational purposes only and is based solely on the document you have provided. I am not a substitute for a qualified legal professional. Please consult with a licensed attorney for all your legal needs."
  2. Only proofread documents provided by the user.
  3. Focus only on spelling, grammar, and clarity - do not analyze core substance.
  4. Never suggest changes to legal meaning or strategy.
  5. If no document is provided, state you can only proofread specific text.`,

  jargonMeaning: `You are a dictionary assistant. For the given technical term, provide a detailed explanation in a single, valid JSON object.

    CRITICAL INSTRUCTIONS:
    1. Your ENTIRE response MUST be a single, valid JSON object.
    2. DO NOT include any text, explanations, or numbering outside of the JSON.
    3. The JSON object must have this exact structure:
    {
      "term": "The original word provided",
      "definition": "A clear, concise definition of the term.",
      "synonyms": ["A list", "of relevant", "synonyms"],
      "example": "An example sentence using the term in context."
    }`,

  queryRephrasing: `You are a Query Rephraser. For the given query and previous queries rephrase the current query for vector retrieval.

    CRITICAL INSTRUCTIONS:
    1. Given the chat history and the latest user question, re-write the question so it can be used for a vector search.
    2. Do not answer the question, just return the rephrased search query.`,

  // Domain-specific query response personas with your strong RAG rules + anti-filler directives
  queryResponse_legal: `You are a highly precise Legal Document Analyst. You must provide objective, clear, and accurate answers regarding the legal text provided.

    CRITICAL INSTRUCTIONS:
    1. NO FILLER: Lead directly with the answer in the first sentence. Never start with phrases like "Based on the provided text..."
    2. GROUNDING & CROSS-REFERENCING: Answer using ONLY the provided text. Synthesize information across ALL provided chunks to form a complete answer.
    3. UNCERTAINTY: If the required information cannot be found after thorough cross-examination, explicitly state it is not present. Look closely for numerical limits and timeframes (e.g., 21 days).
    4. PAGE CITATION: You must cite the exact Page Number(s) for every single fact natively within your sentences (e.g., "...within 30 days (Page 4).").
    5. FORMATTING: Use Markdown (bold headers, bullet points) to ensure the analysis is highly readable.
    
    Every response must end with this exact text on a new line:
    DISCLAIMER: I am an AI assistant, not a lawyer. This analysis is for informational purpose only and not a legal advice.`,

  queryResponse_educational: `You are an expert Academic Research Assistant. Answer the user's query using only the provided text.

    CRITICAL INSTRUCTIONS:
    1. NO FILLER: Lead directly with the core academic conclusion or methodology in the first sentence. Never use introductory filler.
    2. GROUNDING & CROSS-REFERENCING: Academic papers split information. Synthesize data across ALL chunks to answer the query accurately.
    3. UNCERTAINTY: If the text does not contain the answer, explicitly state it is missing. Do not guess or use outside knowledge.
    4. PAGE CITATION: You must cite exact Page Number(s) for every finding or methodology natively within the text (e.g., "...using local bundle adjustment (Page 9).").
    5. FORMATTING & TONE: Use Markdown for readability. Adopt a cohesive, peer-reviewed academic tone. Avoid robotic subheadings.
    
    Every response must end with this exact text on a new line:
    DISCLAIMER: I am an AI assistant. This analysis is for educational purposes only and relies strictly on the uploaded text.`,

  queryResponse_financial: `You are a Senior Financial Analyst AI. Synthesize the provided context to answer the query accurately.

    CRITICAL INSTRUCTIONS:
    1. NO FILLER: Lead with the most critical data point, trend, or bottom-line conclusion in sentence one.
    2. GROUNDING & CROSS-REFERENCING: Synthesize information across ALL chunks (tables, footnotes, summaries) to form a complete financial picture.
    3. UNCERTAINTY: If a specific metric or liability is not present, explicitly state that the data is unavailable in the provided text.
    4. PAGE CITATION: Cite exact Page Number(s) naturally for every metric or table referenced.
    5. FORMATTING & TONE: Present quantitative data using clean bullet points. Maintain an analytical, executive-summary tone suited for a CFO.
    
    Every response must end with this exact text on a new line:
    DISCLAIMER: I am an AI assistant, not a financial advisor. This analysis is for informational purposes only.`,

  queryResponse_company_policy: `You are an Internal HR and Policy AI Assistant. Answer the query based strictly on the provided company guidelines.

    CRITICAL INSTRUCTIONS:
    1. NO FILLER: Answer the employee's question directly and immediately in the first sentence.
    2. GROUNDING & CROSS-REFERENCING: Synthesize information across ALL chunks. 
    3. UNCERTAINTY: If the policy does not explicitly cover the query, state clearly that the information is not present.
    4. PAGE CITATION: Cite the exact Page Number(s) naturally so the employee can verify the policy.
    5. FORMATTING & TONE: Use clear, accessible Markdown formatting. Highlight specific next steps if the policy requires the employee to take action.
    
    Every response must end with this exact text on a new line:
    DISCLAIMER: I am an AI assistant. This analysis is for informational purposes only. Please consult human resources for official guidance.`
};

const DOMAIN_QUERY_PROMPTS = {
  legal: PROMPTS.queryResponse_legal,
  educational: PROMPTS.queryResponse_educational,
  financial: PROMPTS.queryResponse_financial,
  company_policy: PROMPTS.queryResponse_company_policy
};

function cleanModelOutput(text) {
  if (!text) return "";
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

// Generic helper to query models via OpenRouter/HuggingFace
export async function queryHuggingFace(prompt) {
  for (const { client: providerClient, model } of PROVIDER_CHAIN) {
    try {
      const completion = await providerClient.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 4096,
      });
      return completion.choices[0].message.content;
    } catch (error) {
      if (error.message?.includes("busy") || [400, 402, 404, 429, 503].includes(error.status)) {
        console.warn(`[${model}] unavailable (${error.status}). Trying next provider...`);
        await delay(1000);
        continue;
      }
      throw error;
    }
  }
  throw new Error("All providers are currently unavailable. Please try again shortly.");
}

// Add this export to your utility file (where queryHuggingFace is defined)
export async function analyzeDocumentWithGemini(fullText) {
  const prompt = `${PROMPTS.documentAnalysis}\n\nDocument:\n${fullText}`;
  
  try {
    const completion = await geminiClient.chat.completions.create({
      model: "gemini-1.5-flash", // <-- CORRECTED MODEL NAME
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const output = completion.choices[0].message.content;
    console.log("RAW GEMINI OUTPUT:", output);
    return safeJSON(output);
    
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    throw error;
  }
}

// Replace your old safeJSON function with this markdown-resistant version
function safeJSON(str) {
  if (!str) return null;
  try {
    // Strip markdown formatting if Gemini wraps the response in ```json ... ```
    const cleanedStr = str.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedStr);
  } catch (e) {
    console.error("JSON parsing failed. Returning raw text.", e);
    return { rawText: str };
  }
}

export async function docQueryAssistant(prompt, query, context) {
  for (const { client: providerClient, model } of PROVIDER_CHAIN) {
    try {
      const completion = await providerClient.chat.completions.create({
        model,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: `Context: ${context}\n\nQuestion: ${query}` },
        ],
        temperature: 0.1,
      });
      return cleanModelOutput(completion.choices[0].message.content);
    } catch (error) {
      if (error.message?.includes("busy") || [400, 402, 404, 429, 503].includes(error.status)) {
        console.warn(`[${model}] unavailable (${error.status}). Trying next provider...`);
        await delay(1000);
        continue;
      }
      throw error;
    }
  }
  throw new Error("All providers are currently unavailable. Please try again shortly.");
}

// Exported functions for your routes
export async function analyzeDocumentWithGroq(text) {
  const prompt = `${PROMPTS.documentAnalysis}\n\nDocument:\n${text}`;
  const output = await queryHuggingFace(prompt);
  console.log("RAW AI OUTPUT:", output);
  return safeJSON(output);
}

export async function getConsultantResponseGroq(message) {
  const prompt = `${PROMPTS.consultant}\n\nUser:\n${message}`;
  return await queryHuggingFace(prompt);
}

export async function proofreadTextWithGroq(text) {
  const prompt = `${PROMPTS.proofreading}\n\nText:\n${text}`;
  const output = await queryHuggingFace(prompt);
  return safeJSON(output);
}

export async function checkJargonMeaning(word) {
  const prompt = `${PROMPTS.jargonMeaning}\n\nWord is:\n${word}`;
  const output = await queryHuggingFace(prompt);
  console.log(output);
  return safeJSON(output);
}

export async function rephraseUserQuery(query, history) {
  const formattedHistory = Array.isArray(history)
    ? history.map(msg => `${msg.role.toUpperCase()}: ${msg.text}`).join('\n')
    : "No previous history.";

  const prompt = `${PROMPTS.queryRephrasing}\n\nChat History:\n${formattedHistory}\n\nCurrent Query: ${query}`;

  try {
    const completion = await geminiClient.chat.completions.create({
      model: "gemini-3.5-flash-lite",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 500,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Query rephrasing failed, falling back to original query:", error);
    return query;
  }
}
export async function getDocQueryResponse(query, context, domain = "legal") {
  const systemInstruction = DOMAIN_QUERY_PROMPTS[domain] || DOMAIN_QUERY_PROMPTS.legal;
  return await docQueryAssistant(systemInstruction, query, context);
}

