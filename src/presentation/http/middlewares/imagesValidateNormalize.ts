import { RequestHandler, NextFunction, Request, Response } from "express";
import { fileTypeFromBuffer } from "file-type";
import {
  imagesAllowedExtensions,
  imagesMaxHeight,
  imagesMaxPixels,
  imagesMaxWidth,
} from "../../../lib/constants.js";
import { AppError } from "../../../lib/errors.js";
import sharp from "sharp";

export const imagesValidateNormalize: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.file) {
    next();
    return;
  }

  try {
    const detected = await fileTypeFromBuffer(req.file.buffer);
    if (!detected || !imagesAllowedExtensions.includes(detected.ext)) {
      next(new AppError("Unsupported image format", 400, true));
    }

    const image = sharp(req.file.buffer, {
      limitInputPixels: imagesMaxPixels,
      animated: false,
    });
    const metadata = await image.metadata();

    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width > imagesMaxWidth ||
      metadata.height > imagesMaxHeight ||
      metadata.width * metadata.height > imagesMaxPixels
    ) {
      next(new AppError("Image dimensions are not allowed", 400, true));
    }

    const { data, info } = await image
      .rotate()
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer({ resolveWithObject: true });

    req.file.buffer = data;
    req.file.mimetype = "image/jpeg";
    req.file.size = info.size;

    next();
  } catch (error) {
    next(new AppError("Invalid or unsupported image", 400, true, { error }));
  }
};
