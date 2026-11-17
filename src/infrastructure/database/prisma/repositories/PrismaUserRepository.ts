import {
  User,
  UserWithCredentials,
} from "./../../../../domain/users/entities/User.js";
import {
  CreateUserData,
  UserCredentialsData,
  UserRepository,
} from "./../../../../domain/users/repositories/UserRepository.js";
import { PrismaClient } from "./../../../../generated/prisma/client.js";
import {
  createUserDataToUserCreateInput,
  toUserUpdateInput,
  toUserCredentialsUpdateInput,
  prismaUserToUser,
  prismaUserToUserWithCredentials,
} from "../mappers/UserMappers.js";

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUserData): Promise<User> {
    const prismaUserMapper = createUserDataToUserCreateInput(data);
    const createdUser = await this.prisma.user.create({
      data: prismaUserMapper,
    });

    return prismaUserToUser(createdUser);
  }
  async update(userId: string, data: Partial<CreateUserData>): Promise<User> {
    const prismaUserMapper = toUserUpdateInput(data);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: prismaUserMapper,
    });

    return prismaUserToUser(updatedUser);
  }
  async updateCredentials(
    userId: string,
    data: Partial<UserCredentialsData>
  ): Promise<UserWithCredentials> {
    const prismaUserMapper = toUserCredentialsUpdateInput(data);
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: prismaUserMapper,
    });

    return prismaUserToUserWithCredentials(updatedUser);
  }
  async getById(
    userId: string,
    withCredentials?: boolean
  ): Promise<User | UserWithCredentials | null> {
    const userById = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userById) {
      return null;
    }

    if (withCredentials) {
      return prismaUserToUserWithCredentials(userById);
    } else {
      return prismaUserToUser(userById);
    }
  }
  async getByEmail(
    email: string,
    withCredentials?: boolean
  ): Promise<User | UserWithCredentials | null> {
    const userByEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!userByEmail) {
      return null;
    }

    if (withCredentials) {
      return prismaUserToUserWithCredentials(userByEmail);
    } else {
      return prismaUserToUser(userByEmail);
    }
  }
  async delete(userId: string): Promise<boolean> {
    const deletedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false, deletedAt: new Date("YYYY-mm-dd H:i:s") },
    });

    return deletedUser.id === userId && !deletedUser.isActive;
  }
}
