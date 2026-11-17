import { env } from "../config/env.js";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, json, errors, colorize, simple } = winston.format;

const currentLogLevel = env.NODE_ENV === "production" ? "info" : "debug";

const fileRotateTransport = new DailyRotateFile({
  filename: "logs/application-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
});

const errorFileRotateTransport = new DailyRotateFile({
  filename: "logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "30d",
  level: "error",
});

const logger = winston.createLogger({
  level: currentLogLevel,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss UTC" }),
    json(),
    errors({ stack: true })
  ),
  transports: [
    new winston.transports.Console(),
    fileRotateTransport,
    errorFileRotateTransport,
  ],
});

if (env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), simple()),
    })
  );
}

export default logger;
