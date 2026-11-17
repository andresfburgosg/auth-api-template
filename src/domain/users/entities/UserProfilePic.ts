export interface UserProfilePic {
  id?: string;
  userId: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  createdAt?: Date;
  updatedAt?: Date;
}
