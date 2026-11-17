import { User, UserWithCredentials } from "../entities/User.js";

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryCode: number;
  phoneNumber: number;
  password: string;
  isActive: boolean;
  profilePicture?: Buffer;
}

export interface UserCredentialsData {
  email?: string;
  password?: string;
  passwordChangedAt?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpiration?: Date;
  resetPasswordTokenIssuedAt?: Date;
}

export interface UserRepository {
  create(data: CreateUserData): Promise<User>;
  update(userId: string, data: Partial<CreateUserData>): Promise<User>;
  updateCredentials(
    userId: string,
    data: Partial<UserCredentialsData>
  ): Promise<UserWithCredentials>;
  getById(
    userId: string,
    withCredentials?: boolean
  ): Promise<User | UserWithCredentials | null>;
  getByEmail(
    email: string,
    withCredentials?: boolean
  ): Promise<User | UserWithCredentials | null>;
  delete(userId: string): Promise<boolean>;
}
