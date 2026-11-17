import {
  User,
  UserWithCredentials,
} from "./../../../../domain/users/entities/User.js";
import { UserProfilePic } from "./../../../../domain/users/entities/UserProfilePic.js";
import {
  UserCreateInput,
  UserUpdateInput,
} from "./../../../../generated/prisma/models/User.js";
import {
  CreateUserData,
  UserCredentialsData,
} from "./../../../../domain/users/repositories/UserRepository.js";
import { prisma } from "../client.js";

type UserCreatedType = Awaited<ReturnType<typeof prisma.user.create>>;
type UserProfilePicCreatedType = Awaited<
  ReturnType<typeof prisma.userProfilePic.create>
>;

export function createUserDataToUserCreateInput(
  data: CreateUserData
): UserCreateInput {
  return {
    firstname: data.firstName,
    lastname: data.lastName,
    email: data.email,
    mobileCountryCode: Number(data.phoneCountryCode),
    mobilePhoneNumber: Number(data.phoneNumber),
    password: data.password,
    isActive: false,
  };
}

export function toUserUpdateInput(
  data: Partial<CreateUserData>
): UserUpdateInput {
  const userUpdateInput: UserUpdateInput = {};
  if (typeof data?.firstName === "string") {
    userUpdateInput.firstname = data?.firstName;
  }
  if (typeof data?.lastName === "string") {
    userUpdateInput.lastname = data?.lastName;
  }
  if (typeof data?.isActive === "boolean") {
    userUpdateInput.isActive = data?.isActive;
  }
  /*if (typeof data?.profilePicture === "string") {
    userUpdateInput.profilePic = data?.profilePicture;
  }*/
  if (data?.phoneCountryCode) {
    userUpdateInput.mobileCountryCode = Number(data?.phoneCountryCode);
  }
  if (data?.phoneNumber) {
    userUpdateInput.mobilePhoneNumber = Number(data?.phoneNumber);
  }

  return userUpdateInput;
}

export function toUserCredentialsUpdateInput(
  data: Partial<UserCredentialsData>
): UserUpdateInput {
  const userUpdateInput: UserUpdateInput = {};
  if (typeof data?.password === "string") {
    userUpdateInput.password = data?.password;
  }
  if (data?.passwordChangedAt !== undefined) {
    userUpdateInput.passwordChangedAt = data?.passwordChangedAt;
  }
  if (typeof data?.resetPasswordToken === "string") {
    userUpdateInput.resetPasswordToken = data?.resetPasswordToken;
  }
  if (data?.resetPasswordTokenExpiration !== undefined) {
    userUpdateInput.resetPasswordExpireAt = data?.resetPasswordTokenExpiration;
  }
  if (data?.resetPasswordTokenIssuedAt !== undefined) {
    userUpdateInput.resetPasswordIssueAt = data?.resetPasswordTokenIssuedAt;
  }

  return userUpdateInput;
}

export function prismaUserToUser(data: UserCreatedType): User {
  return {
    id: data.id,
    firstName: data.firstname,
    lastName: data.lastname,
    fullName: `${data.firstname} ${data.lastname}`,
    email: data.email,
    phoneCountryCode: data.mobileCountryCode,
    phoneNumber: data.mobilePhoneNumber,
    //profilePicture: data.profilePic,
    profilePicture: null, //todo check how to attach profile pic
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastLoginAt: data.lastLogin,
  };
}

export function prismaUserToUserWithCredentials(
  data: UserCreatedType
): UserWithCredentials {
  return {
    id: data.id,
    firstName: data.firstname,
    lastName: data.lastname,
    fullName: `${data.firstname} ${data.lastname}`,
    email: data.email,
    phoneCountryCode: data.mobileCountryCode,
    phoneNumber: data.mobilePhoneNumber,
    //profilePicture: data.profilePic,
    profilePicture: null, //todo check how to attach profile pic
    isActive: data.isActive,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    lastLoginAt: data.lastLogin,
    password: data.password,
    passwordChangedAt: data.passwordChangedAt,
    resetPasswordToken: data.resetPasswordToken,
    resetPasswordTokenExpiration: data.resetPasswordExpireAt,
    resetPasswordTokenIssuedAt: data.resetPasswordIssueAt,
  };
}

export function prismaUserProfilePicToUserProfilePic(
  data: UserProfilePicCreatedType
): UserProfilePic {
  return {
    id: data.id,
    userId: data.userId,
    publicId: data.publicId,
    secureUrl: data.secureUrl,
    width: data.width,
    height: data.height,
    format: data.format,
    bytes: data.bytes,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}
