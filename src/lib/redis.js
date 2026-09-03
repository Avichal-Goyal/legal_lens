import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
    throw new Error("REDIS_URL is not defined");
}

const globalForRedis = globalThis;

// Initialize the client if it doesn't exist
export const redis = globalForRedis.redis ?? createClient({
    url: redisUrl,
    // Add socket configuration to handle serverless timeouts
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) return new Error('Max retries reached');
            return Math.min(retries * 50, 2000);
        },
        connectTimeout: 10000
    }
});

// VERY IMPORTANT: Prevent multiple connect() calls in Next.js API routes
export async function connectRedis() {
    if (!redis.isOpen) {
        try {
            await redis.connect();
        } catch (error) {
            console.error("Failed to connect to Redis:", error);
            // Handle gracefully so the whole app doesn't crash
        }
    }
    return redis;
}

redis.on("error", (error) => {
    console.error("Redis client error:", error);
});

globalForRedis.redis = redis;