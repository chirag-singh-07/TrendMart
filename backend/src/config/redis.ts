import Redis from "ioredis";

let redisClient: Redis | null = null;

/**
 * Returns a singleton Redis client.
 * Connects lazily on first call.
 */
export const getRedisClient = (): Redis => {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL || "redis://127.0.0.1:6379";

  redisClient = new Redis(url, {
    maxRetriesPerRequest: 3,
    lazyConnect: false,
    enableReadyCheck: true,
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis connected successfully");
  });

  redisClient.on("error", (err: Error) => {
    console.error("❌ Redis connection error:", err.message);
  });

  redisClient.on("reconnecting", () => {
    console.warn("⚠️  Redis reconnecting...");
  });

  return redisClient;
};

export default getRedisClient;
