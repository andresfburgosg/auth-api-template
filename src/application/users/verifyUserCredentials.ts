import { UserWithLoginToken } from "../../domain/users/entities/User.js";
import { UserRepository } from "../../domain/users/repositories/UserRepository.js";
import { ConflictError } from "../../lib/errors.js";
import {
  createRandomUUID,
  compareHashedPassword,
  generateAccessToken,
  generateRefreshToken,
  checkRefreshToken,
} from "../../lib/authUtilities.js";
import { refreshTokenType } from "./../../lib/constants.js";
import {
  UserCacheService,
  UserRefreshTokenPayload,
} from "./userCacheService.js";

interface RefreshTokenPayload {
  id: string;
  sid: string;
  type: string;
}

export class VerifyUserCredentials {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userCacheService: UserCacheService,
  ) {}

  async execute(email: string, password: string): Promise<UserWithLoginToken> {
    const existingUser = await this.userRepository.getByEmail(email, true);
    if (!existingUser || !existingUser.isActive) {
      throw new ConflictError("Login", "Invalid User Credentials");
    }

    //TODO: bycript password input and db password
    if (!("password" in existingUser)) {
      throw new ConflictError("Login", "Invalid User Credentials");
    }

    const comparePassword = await compareHashedPassword(
      password,
      existingUser.password,
    );
    if (!comparePassword) {
      throw new ConflictError("Login", "Invalid User Credentials");
    }

    const refreshTokenPayload: RefreshTokenPayload = {
      id: existingUser.id,
      sid: createRandomUUID(),
      type: refreshTokenType,
    };
    const userAccessToken = generateAccessToken(existingUser, ["id", "email"]);
    const userRefreshToken = generateRefreshToken(refreshTokenPayload, [
      "id",
      "sid",
      "type",
    ]);

    if (!userAccessToken || !userRefreshToken) {
      throw new ConflictError("Login", "Error trying to login the user");
    }

    await this.userCacheService.setUserRefreshToken(refreshTokenPayload.sid, {
      userId: refreshTokenPayload.id,
      sessionId: refreshTokenPayload.sid,
    });

    const userLogged: UserWithLoginToken = {
      ...existingUser,
      accessToken: userAccessToken,
      refreshToken: userRefreshToken,
    };

    return userLogged;
  }
}

export class verifyRefreshToken {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userCacheService: UserCacheService,
  ) {}

  async execute(refreshToken: string): Promise<UserWithLoginToken> {
    let payload;

    try {
      payload = checkRefreshToken(refreshToken) as RefreshTokenPayload;
    } catch (_) {
      throw new ConflictError("Refresh Token", "Invalid refresh token");
    }

    if (payload?.type === undefined || payload?.type !== refreshTokenType) {
      throw new ConflictError("Refresh Token", "Invalid refresh token");
    }

    const refreshSession = await this.userCacheService.getUserRefreshToken(
      payload.sid,
    );
    if (!refreshSession) {
      throw new ConflictError("Refresh Token", "Session expired or revoked");
    }

    const refreshSessionData = JSON.parse(
      refreshSession,
    ) as UserRefreshTokenPayload;
    await this.userCacheService.deleteUserRefreshToken(
      refreshSessionData.sessionId,
    );
    if (refreshSessionData.userId !== payload.id) {
      throw new ConflictError("Refresh Token", "Invalid Session");
    }

    const existingUser = await this.userRepository.getById(
      refreshSessionData.userId,
    );
    if (
      !existingUser ||
      (existingUser !== undefined && !existingUser.isActive)
    ) {
      throw new ConflictError("Refresh Token", "Invalid User");
    }

    const refreshTokenPayload: RefreshTokenPayload = {
      id: existingUser.id,
      sid: createRandomUUID(),
      type: refreshTokenType,
    };
    const userAccessToken = generateAccessToken(existingUser, ["id", "email"]);
    const userRefreshToken = generateRefreshToken(refreshTokenPayload, [
      "id",
      "sid",
      "type",
    ]);

    if (!userAccessToken || !userRefreshToken) {
      throw new ConflictError(
        "Refresh Token",
        "Error trying to create access token",
      );
    }

    await this.userCacheService.setUserRefreshToken(refreshTokenPayload.sid, {
      userId: refreshTokenPayload.id,
      sessionId: refreshTokenPayload.sid,
    });

    const userLogged: UserWithLoginToken = {
      ...existingUser,
      accessToken: userAccessToken,
      refreshToken: userRefreshToken,
    };

    return userLogged;
  }
}
