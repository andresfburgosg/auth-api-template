import { UserRepository } from "../../domain/users/repositories/UserRepository.js";
import { ConflictError } from "../../lib/errors.js";

export class ActiveUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<boolean> {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw new ConflictError("Activating User", "User does not exist");
    }

    const payload = { isActive: true };
    const activatedUser = await this.userRepository.update(userId, payload);

    return activatedUser.isActive === true;
  }
}

export class InactiveUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<boolean> {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser) {
      throw new ConflictError("Deactivating User", "User does not exist");
    }

    const payload = { isActive: false };
    const deactivatedUser = await this.userRepository.update(userId, payload);

    return deactivatedUser.isActive === false;
  }
}
