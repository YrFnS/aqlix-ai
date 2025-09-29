import type { CacheEntry, CacheStats, CachingConfig } from "../types";

/**
 * CacheManager - Advanced caching system for Component Inspector
 *
 * Provides intelligent caching for:
 * - Component analysis results with TTL expiration
 * - Cultural validation outcomes with context awareness
 * - Performance metrics with invalidation strategies
 * - Pattern detection results with version tracking
 * - Multi-level caching (memory, disk, distributed)
 */
export class CacheManager {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    size: 0,
    maxSize: 1000,
    hitRate: 0,
  };
  private cleanupInterval?: NodeJS.Timeout;

  constructor(private config: CachingConfig) {
    this.stats.maxSize = this.calculateMaxSize();
    this.startCleanupTimer();
  }

  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    const memoryResult = this.getFromMemory<T>(key);
    if (memoryResult !== null) {
      this.recordHit();
      return memoryResult;
    }

    // Try disk cache if enabled
    if (this.config.strategies.includes("disk")) {
      const diskResult = await this.getFromDisk<T>(key);
      if (diskResult !== null) {
        // Store in memory for faster subsequent access
        await this.setInMemory(key, diskResult, this.config.ttl);
        this.recordHit();
        return diskResult;
      }
    }

    this.recordMiss();
    return null;
  }

  /**
   * Set cached value
   */
  async set<T>(key: string, value: T, customTTL?: number): Promise<void> {
    const ttl = customTTL || this.config.ttl;

    // Set in memory cache
    await this.setInMemory(key, value, ttl);

    // Set in disk cache if enabled
    if (this.config.strategies.includes("disk")) {
      await this.setOnDisk(key, value, ttl);
    }

    // Set in distributed cache if enabled
    if (this.config.strategies.includes("distributed")) {
      await this.setInDistributed(key, value, ttl);
    }
  }

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    // Delete from memory
    this.memoryCache.delete(key);
    this.updateStats();

    // Delete from disk if enabled
    if (this.config.strategies.includes("disk")) {
      await this.deleteFromDisk(key);
    }

    // Delete from distributed cache if enabled
    if (this.config.strategies.includes("distributed")) {
      await this.deleteFromDistributed(key);
    }
  }

  /**
   * Clear all cached values
   */
  async clear(): Promise<void> {
    // Clear memory cache
    this.memoryCache.clear();
    this.resetStats();

    // Clear disk cache if enabled
    if (this.config.strategies.includes("disk")) {
      await this.clearDisk();
    }

    // Clear distributed cache if enabled
    if (this.config.strategies.includes("distributed")) {
      await this.clearDistributed();
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Invalidate cache entries by pattern
   */
  async invalidateByPattern(pattern: RegExp): Promise<number> {
    let invalidated = 0;

    // Invalidate from memory
    for (const key of this.memoryCache.keys()) {
      if (pattern.test(key)) {
        this.memoryCache.delete(key);
        invalidated++;
      }
    }

    // Invalidate from disk if enabled
    if (this.config.strategies.includes("disk")) {
      invalidated += await this.invalidateDiskByPattern(pattern);
    }

    this.updateStats();
    return invalidated;
  }

  /**
   * Preload cache with common values
   */
  async preload(
    entries: Array<{ key: string; value: any; ttl?: number }>,
  ): Promise<void> {
    const promises = entries.map((entry) =>
      this.set(entry.key, entry.value, entry.ttl),
    );

    await Promise.all(promises);
  }

  /**
   * Get cache keys matching pattern
   */
  getKeys(pattern?: RegExp): string[] {
    const keys = Array.from(this.memoryCache.keys());

    if (pattern) {
      return keys.filter((key) => pattern.test(key));
    }

    return keys;
  }

  /**
   * Check if key exists in cache
   */
  async has(key: string): Promise<boolean> {
    // Check memory cache
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)!;
      if (!this.isExpired(entry)) {
        return true;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // Check disk cache if enabled
    if (this.config.strategies.includes("disk")) {
      return await this.hasOnDisk(key);
    }

    return false;
  }

  /**
   * Get cache size in bytes (approximate)
   */
  getSize(): number {
    let size = 0;

    for (const entry of this.memoryCache.values()) {
      size += this.estimateEntrySize(entry);
    }

    return size;
  }

  /**
   * Optimize cache by removing expired and least recently used entries
   */
  async optimize(): Promise<{
    removed: number;
    sizeBefore: number;
    sizeAfter: number;
  }> {
    const sizeBefore = this.getSize();
    let removed = 0;

    // Remove expired entries
    for (const [key, entry] of this.memoryCache.entries()) {
      if (this.isExpired(entry)) {
        this.memoryCache.delete(key);
        removed++;
      }
    }

    // If still over limit, remove LRU entries
    if (this.memoryCache.size > this.stats.maxSize) {
      const entries = Array.from(this.memoryCache.entries()).sort(
        ([, a], [, b]) => a.timestamp.getTime() - b.timestamp.getTime(),
      );

      const toRemove = this.memoryCache.size - this.stats.maxSize;

      for (let i = 0; i < toRemove && i < entries.length; i++) {
        this.memoryCache.delete(entries[i][0]);
        removed++;
      }
    }

    const sizeAfter = this.getSize();
    this.updateStats();

    return { removed, sizeBefore, sizeAfter };
  }

  /**
   * Destroy cache manager and cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.memoryCache.clear();
    this.resetStats();
  }

  // Private methods

  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.memoryCache.delete(key);
      return null;
    }

    // Update access time for LRU
    entry.timestamp = new Date();

    return entry.value as T;
  }

  private async setInMemory<T>(
    key: string,
    value: T,
    ttl: number,
  ): Promise<void> {
    // Check if we need to make space
    if (this.memoryCache.size >= this.stats.maxSize) {
      await this.evictLRU();
    }

    const entry: CacheEntry<T> = {
      key,
      value,
      timestamp: new Date(),
      ttl,
      metadata: {
        accessCount: 0,
        size: this.estimateValueSize(value),
      },
    };

    this.memoryCache.set(key, entry);
    this.updateStats();
  }

  private async getFromDisk<T>(key: string): Promise<T | null> {
    // In a real implementation, this would read from disk
    // For now, return null as disk cache is not implemented
    return null;
  }

  private async setOnDisk<T>(
    key: string,
    value: T,
    ttl: number,
  ): Promise<void> {
    // In a real implementation, this would write to disk
    // For now, this is a no-op
  }

  private async deleteFromDisk(key: string): Promise<void> {
    // In a real implementation, this would delete from disk
  }

  private async clearDisk(): Promise<void> {
    // In a real implementation, this would clear disk cache
  }

  private async hasOnDisk(key: string): Promise<boolean> {
    // In a real implementation, this would check disk cache
    return false;
  }

  private async invalidateDiskByPattern(pattern: RegExp): Promise<number> {
    // In a real implementation, this would invalidate disk cache by pattern
    return 0;
  }

  private async setInDistributed<T>(
    key: string,
    value: T,
    ttl: number,
  ): Promise<void> {
    // In a real implementation, this would use Redis or similar
    // For now, this is a no-op
  }

  private async deleteFromDistributed(key: string): Promise<void> {
    // In a real implementation, this would delete from distributed cache
  }

  private async clearDistributed(): Promise<void> {
    // In a real implementation, this would clear distributed cache
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    const now = Date.now();
    const entryTime = entry.timestamp.getTime();
    const ttlMs = entry.ttl * 1000;

    return now - entryTime > ttlMs;
  }

  private async evictLRU(): Promise<void> {
    if (this.memoryCache.size === 0) return;

    let oldestKey: string | null = null;
    let oldestTime: number = Date.now();

    for (const [key, entry] of this.memoryCache.entries()) {
      const accessTime = entry.timestamp.getTime();
      if (accessTime < oldestTime) {
        oldestTime = accessTime;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey);
    }
  }

  private estimateEntrySize(entry: CacheEntry<any>): number {
    return (
      this.estimateValueSize(entry.value) +
      this.estimateValueSize(entry.key) +
      100
    ); // Overhead estimate
  }

  private estimateValueSize(value: any): number {
    if (value === null || value === undefined) {
      return 8;
    }

    if (typeof value === "string") {
      return value.length * 2; // UTF-16
    }

    if (typeof value === "number") {
      return 8;
    }

    if (typeof value === "boolean") {
      return 4;
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value).length * 2;
      } catch {
        return 100; // Fallback estimate
      }
    }

    return 50; // Default estimate
  }

  private recordHit(): void {
    this.stats.hits++;
    this.updateHitRate();
  }

  private recordMiss(): void {
    this.stats.misses++;
    this.updateHitRate();
  }

  private updateStats(): void {
    this.stats.size = this.memoryCache.size;
    this.updateHitRate();
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? this.stats.hits / total : 0;
  }

  private resetStats(): void {
    this.stats.hits = 0;
    this.stats.misses = 0;
    this.stats.size = 0;
    this.stats.hitRate = 0;
  }

  private calculateMaxSize(): number {
    // Base size on available memory and configuration
    // In a real implementation, this would check system memory
    return 1000; // Default max entries
  }

  private startCleanupTimer(): void {
    if (!this.config.enabled) return;

    // Run cleanup every 5 minutes
    this.cleanupInterval = setInterval(
      async () => {
        await this.optimize();
      },
      5 * 60 * 1000,
    );
  }
}
