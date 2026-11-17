import { CreateUser } from "./../../../application/users/createUser.js";
import { prisma } from "./../../../infrastructure/database/prisma/client.js";
import { PrismaUserProfilePicRepository } from "./../../../infrastructure/database/prisma/repositories/PrismaUserProfilePicRepository.js";
import { PrismaUserRepository } from "./../../../infrastructure/database/prisma/repositories/PrismaUserRepository.js";
import { CloudImageRepository } from "./../../../infrastructure/storage/repositories/CloudImageRepository.js";
import { UserController } from "../controllers/UserController.js";

const userRepository = new PrismaUserRepository(prisma);
const userProfilePicRepository = new PrismaUserProfilePicRepository(prisma);
const imageStorageRepository = new CloudImageRepository();

const createUser = new CreateUser(
  userRepository,
  userProfilePicRepository,
  imageStorageRepository
);

export const userController = new UserController({ createUser });
