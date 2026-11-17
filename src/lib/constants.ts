export const cryptoDigestEncoding = "hex";
export const cryptoHashingAlgorithm = "sha256";
export const saltDefault = 10;
export const accessTokenAlgorithm = "HS256";
export const refreshTokenType = "refreshToken";
export const imagesMaxFileSize = 5 * 1024 * 1024; // 5MB
export const imagesAllowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
export const schemaValidationErrorMessages = Object.freeze({
  required: "this field is required",
  invalidType: "invalid type",
  minLength: "minimum length is {min} characters",
  maxLength: "maximum length is {max} characters",
  email: "invalid email address",
  number: "this field must be a number",
  url: "invalid URL",
  uuid: "invalid UUID",
  date: "invalid date",
  time: "invalid time",
  dateTime: "invalid date and time",
});
