import { UserRepository } from "../../domain/users/repositories/UserRepository.js";
import { ConflictError } from "../../lib/errors.js";
import { createHashedToken } from "../../lib/authUtilities.js";

export class VerifyPasswordResetToken {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string, token: string): Promise<boolean> {
    const existingUser = await this.userRepository.getByEmail(email, true);
    if (!existingUser) {
      throw new ConflictError("Verify Password Reset", "User does not exist");
    }

    if (!existingUser.isActive) {
      throw new ConflictError(
        "Verify Password Reset",
        `User ${existingUser.email} is not actived`
      );
    }

    if (
      !("resetPasswordTokenIssuedAt" in existingUser) ||
      !("resetPasswordTokenExpiration" in existingUser)
    ) {
      throw new ConflictError(
        "Verify Password Reset",
        `User ${existingUser.email} has no valid token to restore the password`
      );
    }

    if (
      existingUser.resetPasswordTokenIssuedAt === undefined ||
      existingUser.resetPasswordTokenExpiration === undefined ||
      existingUser.resetPasswordTokenIssuedAt === null ||
      existingUser.resetPasswordTokenExpiration === null
    ) {
      throw new ConflictError(
        "Verify Password Reset",
        `User ${existingUser.email} has no valid token to restore the password`
      );
    }

    const currentDate = new Date("YYYY-mm-dd H:i:s");
    if (
      currentDate < existingUser.resetPasswordTokenIssuedAt ||
      currentDate > existingUser.resetPasswordTokenExpiration ||
      !existingUser.resetPasswordToken ||
      existingUser.resetPasswordToken === ""
    ) {
      throw new ConflictError(
        "Verify Password Reset",
        `User ${existingUser.email} has no valid token to restore the password`
      );
    }

    const hashedToken = createHashedToken(token);
    if (existingUser.resetPasswordToken !== hashedToken) {
      throw new ConflictError(
        "Verify Password Reset",
        `User ${existingUser.email} has no valid token to restore the password`
      );
    }

    return true;
  }
}
