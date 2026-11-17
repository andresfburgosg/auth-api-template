import { UserProfilePicRepository } from "./../../domain/users/repositories/UserProfilePicRepository.js";
import { User } from "../../domain/users/entities/User.js";
import {
  CreateUserData,
  UserRepository,
} from "../../domain/users/repositories/UserRepository.js";
import {
  UploadedImage,
  ImageStorageRepository,
} from "./../../domain/storage/repositories/ImageStorageRepository.js";
import { ConflictError } from "../../lib/errors.js";
import { env } from "../../config/env.js";
import bcrypt from "bcryptjs";
import logger from "./../../lib/logger.js";
import { UserProfilePic } from "./../../domain/users/entities/UserProfilePic.js";

export class CreateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfilePicRepository: UserProfilePicRepository,
    private readonly imageStorageRepository: ImageStorageRepository
  ) {}

  async execute(data: CreateUserData): Promise<User> {
    if (!data?.email || data?.email.trim() === "") {
      throw new ConflictError("Create User", "Email is required");
    }

    const existingUser = await this.userRepository.getByEmail(data.email);
    if (existingUser) {
      throw new ConflictError(
        "Create User",
        `Email ${data.email} already exists`
      );
    }

    let profilePictureData: UploadedImage | undefined = undefined;
    if (data.profilePicture) {
      try {
        profilePictureData = await this.imageStorageRepository.upload({
          buffer: data.profilePicture,
          folder: `${env.IMAGE_STORAGE_FOLDER}/${env.USER_PROFILE_PICTURES_FOLDER}`,
        });
      } catch (error) {
        logger.info("Error uploading profile picture:", error);
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const {
      profilePicture: _profilePiecture,
      ...userDataWithoutProfilePicture
    } = data;

    const newUserData: CreateUserData = {
      ...userDataWithoutProfilePicture,
      password: hashedPassword,
    };

    const newUser = await this.userRepository.create(newUserData);
    let newUserProfilePic: UserProfilePic | undefined = undefined;

    if (profilePictureData) {
      newUserProfilePic = await this.userProfilePicRepository.create({
        userId: newUser.id,
        publicId: profilePictureData.publicId,
        secureUrl: profilePictureData.secureUrl,
        width: profilePictureData.width,
        height: profilePictureData.height,
        format: profilePictureData.format,
        bytes: profilePictureData.bytes,
      });
    }

    return newUserProfilePic
      ? { ...newUser, profilePicture: newUserProfilePic }
      : newUser;
  }
}
