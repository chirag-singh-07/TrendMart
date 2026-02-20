import { getRedisClient } from "../../config/redis";

const redis = getRedisClient();

/**
 * Product cache helpers
 */
export const productCacheService = {
  /**
   * Get product data from cache
   */
  async getProductCache(productId: string) {
    const data = await redis.get(`cache:product:${productId}`);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Set product data to cache (TTL 30 min)
   */
  async setProductCache(productId: string, data: any) {
    await redis.set(
      `cache:product:${productId}`,
      JSON.stringify(data),
      "EX",
      1800,
    );
  },

  /**
   * Invalidate product cache
   */
  async invalidateProductCache(productId: string) {
    await redis.del(`cache:product:${productId}`);
  },

  /**
   * Get category tree from cache
   */
  async getCategoryTreeCache() {
    const data = await redis.get("cache:category:tree");
    return data ? JSON.parse(data) : null;
  },

  /**
   * Set category tree to cache (TTL 1 hour)
   */
  async setCategoryTreeCache(data: any) {
    await redis.set("cache:category:tree", JSON.stringify(data), "EX", 3600);
  },

  /**
   * Invalidate category tree cache
   */
  async invalidateCategoryTreeCache() {
    await redis.del("cache:category:tree");
  },

  /**
   * Get featured/arrivals/bestsellers from cache
   */
  async getFeaturedCache(key: string) {
    const data = await redis.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  },

  /**
   * Set featured/arrivals/bestsellers to cache (TTL 15 min)
   */
  async setFeaturedCache(key: string, data: any) {
    await redis.set(`cache:${key}`, JSON.stringify(data), "EX", 900);
  },

  /**
   * Invalidate all featured caches
   */
  async invalidateAllFeaturedCaches() {
    const keys = await redis.keys("cache:featured:*");
    const arrivals = await redis.keys("cache:new:arrivals");
    const bestsellers = await redis.keys("cache:bestsellers");
    const allKeys = [...keys, ...arrivals, ...bestsellers];
    if (allKeys.length > 0) {
      await redis.del(...allKeys);
    }
  },
};
