import { CacheRepository } from "./../../domain/cache/repositories/CacheRepository.js";

export interface UserRefreshTokenPayload {
  userId: string;
  sessionId: string;
}

export class UserCacheService {
  #prefix: string;
  constructor(private readonly cache: CacheRepository) {
    this.#prefix = "user:";
  }

  async setUserRefreshToken(
    sessionId: string,
    payload: UserRefreshTokenPayload
  ) {
    return await this.cache.set(
      `${this.#prefix}refresh:${sessionId}`,
      JSON.stringify(payload),
      60 * 60 * 24 * 7
    );
  }

  async getUserRefreshToken(sessionId: string) {
    return await this.cache.get(`${this.#prefix}refresh:${sessionId}`);
  }

  async deleteUserRefreshToken(sessionId: string) {
    return await this.cache.delete(`${this.#prefix}refresh:${sessionId}`);
  }
}
