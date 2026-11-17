import multer from "multer";
import { AppError } from "./../../../lib/errors.js";
import {
  imagesMaxFileSize,
  imagesAllowedMimeTypes,
} from "./../../../lib/constants.js";

const storage = multer.memoryStorage();

export const uploadImagesValidator = multer({
  storage,
  limits: { fileSize: imagesMaxFileSize },
  fileFilter: (_req, file, cb) => {
    if (!imagesAllowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new AppError(
          "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.",
          400
        )
      );
    }
    cb(null, true);
  },
});
