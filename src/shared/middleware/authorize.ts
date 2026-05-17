import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

export const authorize = (...roles: string[]) =>
    (req: Request, _res: Response, next: NextFunction): void => {
        const user = (req as any).user;
        if (!user) return next(new AppError("Not authenticated", 401));
        if (!roles.includes(user.role)) {
            return next(new AppError("You do not have permission to perform this action", 403));
        }
        next();
    };