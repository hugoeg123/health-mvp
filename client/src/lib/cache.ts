import type { AxiosResponse } from 'axios';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

class CacheManager {
  private cache: Map<string, CacheItem<any>>;
  private readonly defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) {
    // 5 minutes default TTL
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, expiresIn = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiresIn,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const isExpired = Date.now() - item.timestamp > item.expiresIn;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

export const cacheManager = new CacheManager();

export function withCache<T>(
  key: string,
  fetchFn: () => Promise<AxiosResponse<T>>,
  ttl?: number,
): Promise<T> {
  const cachedData = cacheManager.get<T>(key);
  if (cachedData) return Promise.resolve(cachedData);

  return fetchFn().then((response) => {
    cacheManager.set(key, response.data, ttl);
    return response.data;
  });
}
