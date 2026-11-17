import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import {
  cryptoDigestEncoding,
  cryptoHashingAlgorithm,
  saltDefault,
  accessTokenAlgorithm,
} from "./constants.js";
import { env } from "./../config/env.js";

export const createRandomUUID = () => {
  return crypto.randomUUID();
};

export const createRandomToken = (numberBytes = 32) => {
  return crypto.randomBytes(numberBytes).toString(cryptoDigestEncoding);
};

export const createHashedToken = (
  token: string,
  algorithm = cryptoHashingAlgorithm
) => {
  return crypto
    .createHash(algorithm)
    .update(token)
    .digest(cryptoDigestEncoding);
};

export const createHashedPassword = async (password: string) => {
  return await bcrypt.hash(password, saltDefault);
};

export const compareHashedPassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const generateAccessToken = <T, K extends keyof T>(
  payload: T,
  properties: K[]
) => {
  const accessTokenPayload: Partial<T> = {};
  properties.forEach((prop) => {
    const value = payload[prop];
    if (value) {
      accessTokenPayload[prop] = value;
    }
  });

  if (!(properties[0] in accessTokenPayload)) {
    return false;
  }

  return jwt.sign(accessTokenPayload, env.ACCESS_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRE_IN as SignOptions["expiresIn"],
    algorithm: accessTokenAlgorithm,
  });
};

export const generateRefreshToken = <T, K extends keyof T>(
  payload: T,
  properties: K[]
) => {
  const refreshTokenPayload: Partial<T> = {};
  properties.forEach((prop) => {
    const value = payload[prop];
    if (value) {
      refreshTokenPayload[prop] = value;
    }
  });

  if (!(properties[0] in refreshTokenPayload)) {
    return false;
  }

  return jwt.sign(refreshTokenPayload, env.REFRESH_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRE_IN as SignOptions["expiresIn"],
    algorithm: accessTokenAlgorithm,
  });
};

export const checkRefreshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_SECRET);
};
