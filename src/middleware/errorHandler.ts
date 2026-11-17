import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";
import logger from "../lib/logger.js";
import multer from "multer";
import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  const statusCode: number = 500;
  const message: string = "Internal Server Error";

  if (err instanceof ZodError) {
    logger.error("Validation Error", {
      error: err.name,
      message: err.message,
      statusCode: 400,
      details: err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
    res.status(400).json({
      error: err.name,
      message: "Validation Error",
      details: err.issues.map((issue) => ({
        path: issue.path,
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      logger.error("File Size Limit Error", {
        error: err.name,
        message: err.message,
        statusCode: 400,
      });
      res.status(400).json({
        error: err.name,
        message: "File size limit exceeded",
      });
      return;
    }

    logger.error("Upload Error", {
      error: err.name,
      message: err.message,
      statusCode: 400,
    });
    res.status(400).json({
      error: "File upload error",
      message: err,
    });
    return;
  }

  if (err instanceof AppError) {
    logger.error("Operational Error", {
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
      details: err.details,
      path: req.path,
    });
    res.status(err.statusCode).json({
      error: err.name,
      message: err.isOperational ? err.message : "Internal Server Error",
    });
    return;
  }

  logger.error("Unexpected Error", {
    error: "Unknown",
    message,
    statusCode,
    path: req.path,
  });
  res.status(statusCode).json({
    error: {
      message,
    },
  });
};

export default errorHandler;
