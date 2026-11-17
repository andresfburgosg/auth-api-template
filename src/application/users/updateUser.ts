import { User } from "../../domain/users/entities/User.js";
import {
  CreateUserData,
  UserRepository,
} from "../../domain/users/repositories/UserRepository.js";
import { ConflictError } from "../../lib/errors.js";

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    data: Omit<Partial<CreateUserData>, "email" | "password">
  ): Promise<User> {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw new ConflictError("Update User", "User does not exist");
    }

    if (!existingUser.isActive) {
      throw new ConflictError(
        "Update User",
        `User ${existingUser.email} is not actived`
      );
    }

    return this.userRepository.update(userId, data);
  }
}
