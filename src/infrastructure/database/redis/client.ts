import { createClient } from "redis";
import { env } from "./../../../config/env.js";
import logger from "./../../../lib/logger.js";

const reconnectStrategy = (retries: number) => {
  const delay = Math.min(retries * 100, 3000);
  logger.info("Redis reconnect attempt", { retries, delay });
  return delay;
};

export const redisClient = createClient({
  socket: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    reconnectStrategy,
  },
  password: env.REDIS_PASSWORD,
  database: Number(env.REDIS_DB || 0),
});

redisClient.on("connect", () => {
  logger.info("Redis connecting...");
});

redisClient.on("ready", () => {
  logger.info("Redis ready");
});

redisClient.on("reconnecting", () => {
  logger.info("Redis reconnecting...");
});

redisClient.on("error", (error: Error) => {
  logger.error("Redis error", { error });
});

redisClient.on("end", () => {
  logger.info("Redis connection closed");
});

export async function connectRedis() {
  if (redisClient.isOpen) {
    return;
  }

  await redisClient.connect();
  await redisClient.ping();

  logger.info("Redis connected");
}
