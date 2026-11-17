export interface UploadImageInput {
  buffer: Buffer;
  folder: string;
  publicId?: string;
}

export interface UploadedImage {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface ImageStorageRepository {
  upload(input: UploadImageInput): Promise<UploadedImage>;
  delete(publicId: string): Promise<void>;
}
