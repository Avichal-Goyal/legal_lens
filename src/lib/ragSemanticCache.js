import { Index } from "@upstash/vector";
import crypto from "crypto";

// Initialize the Upstash Vector client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

const CACHE_PREFIX = "ragcache:";

export async function cacheRagResponse({
    userId,
    documentId,
    queryEmbedding,
    response,
    domain = 'legal' // <-- 1. Accept the new domain parameter
}) {
    try {
        const cacheId = `cache_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const targetDoc = documentId ? documentId : 'GLOBAL';

        await index.upsert({
            id: cacheId,
            vector: queryEmbedding,
            metadata: {
                userId: String(userId),
                documentId: String(targetDoc),
                domain: String(domain), // <-- 2. Save the domain into Upstash metadata
                response: JSON.stringify(response)
            }
        });

        return cacheId;
    } catch (error) {
        console.error("Cache Storage Error:", error);
        return null;
    }
}

export async function findSimilarCachedResponse({
    userId,
    documentId,
    queryEmbedding,
    similarityThreshold = 0.90,
    domain = 'legal' // <-- 1. Accept the new domain parameter
}) {
    try {
        const targetDoc = documentId ? documentId : 'GLOBAL';
        const result = await index.query({
            vector: queryEmbedding,
            topK: 1,
            includeMetadata: true,
            // 2. Append the domain to your Upstash filter string
            filter: `userId = '${userId}' AND documentId = '${targetDoc}' AND domain = '${domain}'`
        });

        if (result.length > 0 && result[0].score >= similarityThreshold) {
            return {
                similarity: result[0].score,
                cacheId: result[0].id,
                response: typeof result[0].metadata.response === 'string' 
                            ? JSON.parse(result[0].metadata.response) 
                            : result[0].metadata.response
            };
        }
        return null;
    } catch (error) {
        console.error("Cache Lookup Error:", error);
        return null;
    }
}