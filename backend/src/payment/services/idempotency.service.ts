import { getRedisClient } from "../../config/redis.js";

/**
 * Service for managing idempotency keys in Redis to prevent duplicate payment operations.
 */
export const idempotencyService = {
  /**
   * Stores an idempotency key with a value and TTL in Redis.
   *
   * @param key - The Redis key
   * @param value - String value to associate with the key
   * @param ttlSeconds - Time-to-live in seconds
   */
  async setKey(key: string, value: string, ttlSeconds: number): Promise<void> {
    const redis = getRedisClient();
    await redis.set(key, value, "EX", ttlSeconds);
  },

  /**
   * Retrieves the value of an idempotency key from Redis.
   *
   * @param key - The Redis key to look up
   * @returns The stored value, or null if not found / expired
   */
  async getKey(key: string): Promise<string | null> {
    const redis = getRedisClient();
    return redis.get(key);
  },

  /**
   * Deletes an idempotency key from Redis (e.g., after successful payment confirmation).
   *
   * @param key - The Redis key to delete
   */
  async deleteKey(key: string): Promise<void> {
    const redis = getRedisClient();
    await redis.del(key);
  },

  /**
   * Constructs the standard idempotency key for a payment initiation attempt.
   *
   * @param orderId - The order being paid for
   * @param userId - The authenticated user initiating payment
   * @returns Redis key string: "idempotency:payment:<orderId>:<userId>"
   */
  buildPaymentKey(orderId: string, userId: string): string {
    return `idempotency:payment:${orderId}:${userId}`;
  },

  /**
   * Constructs the key used to track a pending wallet top-up Stripe PaymentIntent.
   *
   * @param paymentIntentId - The Stripe PaymentIntent ID
   * @returns Redis key string: "wallet:topup:<paymentIntentId>"
   */
  buildTopUpKey(paymentIntentId: string): string {
    return `wallet:topup:${paymentIntentId}`;
  },
};
