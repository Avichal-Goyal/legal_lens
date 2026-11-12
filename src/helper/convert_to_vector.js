import OpenAI from "openai";

// Initialize the OpenAI SDK specifically for Gemini's endpoint
const geminiClient = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
  apiKey: process.env.GEMINI_API_KEY,
});

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function query_to_vector(queries, attempt = 0) {
    const MAX_RETRIES = 3;
    
    try {
        const response = await geminiClient.embeddings.create({
            model: "gemini-embedding-001", // Gemini's embedding model
            input: queries,
            dimensions: 384
        });

        if (typeof queries === "string") {
            return response.data[0].embedding;
        }

        // Returns the actual vector array directly
        return response.data.map(item => item.embedding);
        
    } catch (error) {
        if (attempt >= MAX_RETRIES) {
            console.error(`Failed to generate embedding after ${MAX_RETRIES} attempts:`, error.message);
            throw error;
        }

        // Exponential Backoff Logic
        const backOffTime = Math.pow(2, attempt) * 1000;

        // Jitter to prevent rate-limit bottlenecks
        const jitter = Math.random() * 1000;
        const totalWait = backOffTime + jitter;

        console.log(`Retrying in ${Math.round(totalWait)}ms...`);

        // Wait before calling the AI model again using your custom sleep function
        await sleep(totalWait);
        return query_to_vector(queries, attempt + 1);
    }
}