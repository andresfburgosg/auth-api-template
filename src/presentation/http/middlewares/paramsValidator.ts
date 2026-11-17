import { NextFunction, Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { z, ZodError } from "zod";
import { AppError, ValidationError } from "../../../lib/errors.js";

type RequestSchema = {
  body?: z.ZodType;
  query?: z.ZodType;
  params?: z.ZodType;
  file?: z.ZodType;
};

export function validateRequestParams(schema: RequestSchema) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = (await schema.query.parseAsync(req.query)) as ParsedQs;
      }
      if (schema.params) {
        req.params = (await schema.params.parseAsync(
          req.params
        )) as ParamsDictionary;
      }
      if (schema.file) {
        req.file = (await schema.file.parseAsync(
          req.file
        )) as Express.Multer.File;
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors = z.flattenError(error).fieldErrors;
        const errors = Object.entries(fieldErrors).map(
          ([fieldName, messages]) => ({
            field: fieldName,
            reasons:
              Array.isArray(messages) &&
              messages.every(
                (message): message is string => typeof message === "string"
              )
                ? messages
                : [`Error with value of ${fieldName}`],
          })
        );
        next(
          new ValidationError(
            JSON.stringify(errors.map((error) => error.field)),
            JSON.stringify(errors)
          )
        );
      } else {
        next(
          new AppError("Error with parameters validation", 400, true, { error })
        );
      }
    }
  };
}
