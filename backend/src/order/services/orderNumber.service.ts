import { getRedisClient } from "../../config/redis.js";

/**
 * Service for generating unique, sequential order numbers
 */
export const orderNumberService = {
  /**
   * Generates a unique order number in the format: ORD-YYYYMMDD-XXXXX
   * Uses Redis INCR for atomicity and uniqueness even under high concurrency.
   *
   * @returns {Promise<string>} The generated order number
   */
  async generateOrderNumber(): Promise<string> {
    const redis = getRedisClient();

    // Get current date parts
    const now = new Date();
    const YYYY = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const DD = String(now.getDate()).padStart(2, "0");
    const dateStr = `${YYYY}${MM}${DD}`;

    // Redis key for today's counter
    const key = `order:counter:${dateStr}`;

    // Increment atomically
    const counter = await redis.incr(key);

    // If it's a new key (counter is 1), set expiration (48 hours)
    if (counter === 1) {
      await redis.expire(key, 48 * 3600);
    }

    // Pad counter to 5 digits
    const paddedCounter = String(counter).padStart(5, "0");

    return `ORD-${dateStr}-${paddedCounter}`;
  },
};
