import { UserRepository } from "../../domain/users/repositories/UserRepository.js";
import { ConflictError } from "../../lib/errors.js";
import {
  createHashedPassword,
  compareHashedPassword,
} from "../../lib/authUtilities.js";

export class ChangePassword {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string, newPassword: string): Promise<boolean> {
    const existingUser = await this.userRepository.getById(userId);
    if (!existingUser || !existingUser.isActive) {
      throw new ConflictError("Change Password", "Invalid Request");
    }

    const newPasswordEncrypted = await createHashedPassword(newPassword);

    const userPasswordUpdated = await this.userRepository.updateCredentials(
      userId,
      {
        password: newPasswordEncrypted,
        passwordChangedAt: new Date(),
      },
    );

    if (!userPasswordUpdated.id || !userPasswordUpdated.password) {
      throw new ConflictError(
        "Change Password",
        `Error trying to change password for user ${existingUser.email}`,
      );
    }

    return await compareHashedPassword(
      newPassword,
      userPasswordUpdated.password,
    );
  }
}
