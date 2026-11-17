import logger from "../../../lib/logger.js";
import { cloudinary } from "./../../../config/cloudinary.js";
import {
  UploadImageInput,
  UploadedImage,
  ImageStorageRepository,
} from "./../../../domain/storage/repositories/ImageStorageRepository.js";
import { AppError } from "./../../../lib/errors.js";

export class CloudImageRepository implements ImageStorageRepository {
  async upload(input: UploadImageInput): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: input.folder,
          transformation: [{ width: 1600, height: 1600, crop: "limit" }],
        },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload error", { error });
            return reject(
              new AppError(
                "Storage service failed to upload image",
                500,
                false,
                error
              )
            );
          }

          if (!result) {
            logger.error("Cloudinary upload error: No result returned");
            return reject(
              new AppError(
                "Storage service could not return a result",
                500,
                false
              )
            );
          }

          resolve({
            publicId: result.public_id,
            secureUrl: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );

      uploadStream.end(input.buffer);
    });
  }
  async delete(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
    } catch (error) {
      logger.error("Cloudinary delete error", { error });
      throw new AppError("Storage service failed to delete image", 500, false);
    }
  }
}
