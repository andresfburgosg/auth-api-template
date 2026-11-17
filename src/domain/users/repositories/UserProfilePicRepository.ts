import { UserProfilePic } from "../entities/UserProfilePic.js";

export interface UserProfilePicRepository {
  create(data: UserProfilePic): Promise<UserProfilePic>;
  updateByUserId(
    userId: string,
    data: Exclude<Partial<UserProfilePic>, "id" | "userId">
  ): Promise<UserProfilePic>;
  deleteByUserId(userId: string): Promise<boolean>;
  getById(id: string): Promise<UserProfilePic | null>;
  getByUserId(userId: string): Promise<UserProfilePic | null>;
}
