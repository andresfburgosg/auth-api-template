import { UserProfilePic } from "./../../../../domain/users/entities/UserProfilePic.js";
import { UserProfilePicRepository } from "./../../../../domain/users/repositories/UserProfilePicRepository.js";
import { PrismaClient } from "./../../../../generated/prisma/client.js";
import { prismaUserProfilePicToUserProfilePic } from "../mappers/UserMappers.js";

export class PrismaUserProfilePicRepository
  implements UserProfilePicRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: UserProfilePic): Promise<UserProfilePic> {
    const createUserProfilePic = await this.prisma.userProfilePic.create({
      data,
    });
    return prismaUserProfilePicToUserProfilePic(createUserProfilePic);
  }

  async updateByUserId(
    userId: string,
    data: Exclude<Partial<UserProfilePic>, "id" | "userId">
  ): Promise<UserProfilePic> {
    const updatedUserProfilePic = await this.prisma.userProfilePic.update({
      where: { userId: userId },
      data,
    });

    return prismaUserProfilePicToUserProfilePic(updatedUserProfilePic);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    const deletedUserProfilePic = await this.prisma.userProfilePic.delete({
      where: { userId: userId },
    });
    return !!deletedUserProfilePic;
  }

  async getById(id: string): Promise<UserProfilePic | null> {
    const userProfilePic = await this.prisma.userProfilePic.findUnique({
      where: { id },
    });
    return userProfilePic
      ? prismaUserProfilePicToUserProfilePic(userProfilePic)
      : null;
  }

  async getByUserId(userId: string): Promise<UserProfilePic | null> {
    const userProfilePic = await this.prisma.userProfilePic.findUnique({
      where: { userId },
    });
    return userProfilePic
      ? prismaUserProfilePicToUserProfilePic(userProfilePic)
      : null;
  }
}
