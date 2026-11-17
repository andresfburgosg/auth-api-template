import http from "http";
import dotenv from "dotenv";
import { env } from "./config/env.js";
import { app } from "./app.js";
import logger from "./lib/logger.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./infrastructure/database/prisma/client.js";
import {
  redisClient,
  connectRedis,
} from "./infrastructure/database/redis/client.js";

dotenv.config();

let isShuttingDown = false;

await connectDatabase();
await connectRedis();

const server = http.createServer(app);

const gracefulShutdown = async (errStr: string, exitCode = 0) => {
  if (isShuttingDown) {
    return;
  }
  isShuttingDown = true;

  logger.info("Graceful shutdown initiated", { error: errStr, exitCode });

  const shutdownTimeout = setTimeout(() => {
    logger.error("Graceful shutdown timed out - forced");
    process.exit(1);
  }, 10000);

  try {
    server.close();

    //TODO: Disconnect other services
    await disconnectDatabase();
    await redisClient.quit();

    logger.info("Graceful shutdown completed");
    clearTimeout(shutdownTimeout);
    process.exit(exitCode);
  } catch (error) {
    logger.error("Graceful shutdown failed", { error });
    clearTimeout(shutdownTimeout);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled promise rejection", {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
  void gracefulShutdown("unhandledRejection", 1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught exception", {
    error: err.message,
    stack: err.stack,
  });
  void gracefulShutdown(`uncaughtException: ${err.message}`, 1);
});

process.on("SIGTERM", () => void gracefulShutdown("SIGTERM received", 0));
process.on("SIGINT", () => void gracefulShutdown("SIGINT received", 0));

const serverPort = env.PORT;
server.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});
