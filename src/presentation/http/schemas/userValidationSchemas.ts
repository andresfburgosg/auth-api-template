import { z } from "zod";
import {
  imagesAllowedMimeTypes,
  imagesMaxFileSize,
  schemaValidationErrorMessages,
} from "./../../../lib/constants.js";

const { required, email, number } = schemaValidationErrorMessages;

export const loginSchema = {
  body: z.object({
    email: z.email(),
    password: z.string(),
  }),
};

const imageFileSchema = z
  .object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.enum(imagesAllowedMimeTypes),
    size: z.number().max(imagesMaxFileSize), // 5MB
    destination: z.string().optional(),
    filename: z.string().optional(),
    path: z.string().optional(),
    buffer: z.instanceof(Buffer),
  })
  .optional();

export const registerSchema = {
  body: z.object({
    firstName: z.string({ error: required }).min(3),
    lastName: z.string({ error: required }).min(3),
    email: z.string({ error: required }).email({ error: email }),
    phoneCountryCode: z
      .string({ error: required })
      .regex(/^\d+$/, number)
      .transform(Number)
      .superRefine((value, ctx) => {
        if (value < 1 || value > 998) {
          ctx.addIssue({
            code: "custom",
            message: "Phone country code must be between 1 and 998",
          });
        }
      }),
    phoneNumber: z.coerce
      .number({ error: required })
      .int()
      .refine((num) => Math.abs(num).toString().length >= 7, {
        error: "Phone number must be at least 7 digits long",
      }),
    password: z
      .string({ error: required })
      .min(8)
      .max(20)
      .refine(
        (password) => /[A-Z]/.test(password),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (password) => /[0-9]/.test(password),
        "Password must contain at least one number"
      )
      .refine(
        (password) => /[!@#$%^&*]/.test(password),
        "Password must contain at least one special character"
      ),
  }),
  file: imageFileSchema,
};

export type RegisterSchemaRequestBody = z.infer<typeof registerSchema.body>;
