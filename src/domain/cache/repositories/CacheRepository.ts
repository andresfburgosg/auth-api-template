export interface CacheRepository {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds: number): Promise<string | null>;
  delete(key: string): Promise<number>;
}
