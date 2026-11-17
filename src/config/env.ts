import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(8080),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  ACCESS_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRE_IN: z.string(),
  REFRESH_SECRET: z.string(),
  REFRESH_TOKEN_EXPIRE_IN: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default(6379),
  REDIS_PASSWORD: z.string(),
  REDIS_DB: z.coerce.number(),
  REDIS_TLS: z.string(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  IMAGE_STORAGE_FOLDER: z.string(),
  USER_PROFILE_PICTURES_FOLDER: z.string(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
