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
    if (!existingUser) {
      throw new ConflictError("Change Password", "User does not exist");
    }

    if (!existingUser.isActive) {
      throw new ConflictError(
        "Change Password",
        `User ${existingUser.email} is not actived`
      );
    }

    const newPasswordEncrypted = await createHashedPassword(newPassword);

    const userPasswordUpdated = await this.userRepository.updateCredentials(
      userId,
      {
        password: newPasswordEncrypted,
        passwordChangedAt: new Date("YYYY-mm-dd H:i:s"),
      }
    );

    if (!userPasswordUpdated.id || !userPasswordUpdated.password) {
      throw new ConflictError(
        "Change Password",
        `Error trying to change password for user ${existingUser.email}`
      );
    }

    return await compareHashedPassword(
      newPassword,
      userPasswordUpdated.password
    );
  }
}
