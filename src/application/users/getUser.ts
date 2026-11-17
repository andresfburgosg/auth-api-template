import { User, UserWithCredentials } from "../../domain/users/entities/User.js";
import { UserRepository } from "../../domain/users/repositories/UserRepository.js";
import { ConflictError } from "../../lib/errors.js";

export class GetUserById {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    userId: string,
    withCredentials = false
  ): Promise<User | UserWithCredentials | null> {
    const existingUser = await this.userRepository.getById(
      userId,
      withCredentials
    );
    if (!existingUser) {
      throw new ConflictError("Get User By Id", "User does not exist");
    }

    return existingUser;
  }
}

export class GetUserByEmail {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    email: string,
    withCredentials = false
  ): Promise<User | UserWithCredentials | null> {
    const existingUser = await this.userRepository.getByEmail(
      email,
      withCredentials
    );
    if (!existingUser) {
      throw new ConflictError("Get User By Email", "User does not exist");
    }

    return existingUser;
  }
}
