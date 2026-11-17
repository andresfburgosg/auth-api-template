export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneCountryCode: number;
  phoneNumber: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profilePicture: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}

export interface UserWithCredentials extends User {
  password: string;
  passwordChangedAt?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiration?: Date | null;
  resetPasswordTokenIssuedAt?: Date | null;
}

export interface UserWithLoginToken extends User {
  accessToken: string;
  refreshToken: string;
}
