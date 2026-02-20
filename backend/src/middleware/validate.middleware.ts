import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import AppError from "../utils/AppError";

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        const appError = new AppError("Validation failed", 400);
        (appError as any).errors = errors;
        return next(appError);
      }
      return next(error);
    }
  };
};
