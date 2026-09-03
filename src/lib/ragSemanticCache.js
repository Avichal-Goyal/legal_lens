import { Index } from "@upstash/vector";
import crypto from "crypto";

// Initialize the Upstash Vector client
const index = new Index({
  url: process.env.UPSTASH_VECTOR_REST_URL,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

const CACHE_PREFIX = "ragcache:";

export async function cacheRagResponse({ userId, documentId, queryEmbedding, response }) {
    const cacheId = `${CACHE_PREFIX}${crypto.randomUUID()}`;

    // Upstash accepts your raw array natively (no Float32Array conversion needed)
    await index.upsert({
        id: cacheId,
        vector: queryEmbedding,
        metadata: {
            userId: String(userId),
            documentId: String(documentId),
            response: JSON.stringify(response),
            createdAt: new Date().toISOString(),
        }
    });

    console.log("Cached response in Upstash Vector:", cacheId);
    return cacheId;
}

export async function findSimilarCachedResponse({ userId, documentId, queryEmbedding, similarityThreshold = 0.98 }) {
    // Query Upstash Vector
    const results = await index.query({
        vector: queryEmbedding,
        topK: 1,
        includeMetadata: true,
        filter: `userId = '${userId}' AND documentId = '${documentId}'`
    });

    if (!results || results.length === 0) {
        return null; // Cache miss
    }

    const bestMatch = results[0];

    // Upstash returns score where 1 is an exact match (Cosine Similarity)
    if (bestMatch.score < similarityThreshold) {
        return null; // Not similar enough
    }

    try {
        return {
            response: JSON.parse(bestMatch.metadata.response),
            similarity: bestMatch.score,
            cacheId: bestMatch.id,
            createdAt: bestMatch.metadata.createdAt,
        };
    } catch (error) {
        console.error("Failed to parse cached response from Upstash", error);
        return null;
    }
}