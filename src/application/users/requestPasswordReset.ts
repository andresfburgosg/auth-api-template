import { UserRepository } from "../../domain/users/repositories/UserRepository.js";
import { ConflictError } from "../../lib/errors.js";
import {
  createRandomToken,
  createHashedToken,
} from "./../../lib/authUtilities.js";

export class RequestPasswordReset {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(email: string): Promise<void> {
    const existingUser = await this.userRepository.getByEmail(email);
    if (!existingUser) {
      throw new ConflictError("Request Password Reset", "User does not exist");
    }

    if (!existingUser.isActive) {
      throw new ConflictError(
        "Request Password Reset",
        `User ${existingUser.email} is not actived`
      );
    }

    const rawToken = createRandomToken();
    const hashedToken = createHashedToken(rawToken);
    const resetIssueDate = new Date("YYYY-mm-dd H:i:s");
    const resetExpirationDate = new Date(resetIssueDate);
    resetExpirationDate.setHours(resetExpirationDate.getHours() + 2);
    const resetPasswordInfo = {
      resetPasswordToken: hashedToken,
      resetPasswordTokenIssuedAt: resetIssueDate,
      resetPasswordTokenExpiration: resetExpirationDate,
    };

    const userPasswordRequestUpdated =
      await this.userRepository.updateCredentials(
        existingUser.id,
        resetPasswordInfo
      );

    if (
      !userPasswordRequestUpdated.id ||
      !userPasswordRequestUpdated.resetPasswordToken ||
      userPasswordRequestUpdated.resetPasswordToken !==
        resetPasswordInfo.resetPasswordToken
    ) {
      throw new ConflictError(
        "Request Password Reset",
        `Error trying to request password resetting for user ${existingUser.email}`
      );
    }

    //TODO: create job to send email with new token
  }
}
