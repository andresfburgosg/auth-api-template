import { redisClient } from "./../client.js";
import { CacheRepository } from "./../../../../domain/cache/repositories/CacheRepository.js";

export class RedisCacheRepository implements CacheRepository {
  constructor(private readonly redisCli: typeof redisClient) {}

  async get(key: string): Promise<string | null> {
    const result = await this.redisCli.get(key);
    return result === null ? null : String(result);
  }
  async set(
    key: string,
    value: string,
    ttlSeconds: number
  ): Promise<string | null> {
    const result = await this.redisCli.set(key, value, {
      EX: ttlSeconds,
    });

    return result === null ? null : String(result);
  }
  async delete(key: string): Promise<number> {
    return await this.redisCli.del(key);
  }
}
