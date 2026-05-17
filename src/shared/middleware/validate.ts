
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import AppError from "../utils/appError";

export const validate =
    (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const message = err.issues.map((e) => e.message).join(", ");
                return next(new AppError(message, 400));
            }
            next(err);
        }
    };