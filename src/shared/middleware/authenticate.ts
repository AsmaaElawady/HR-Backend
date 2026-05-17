import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/generateToken";
import AppError from "../utils/appError";
import { User } from "../models/user.model";

export const authenticate = async (
    req: Request,
    _res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith("Bearer ")) {
            return next(new AppError("No token provided", 401));
        }

        const token = authHeader.split(" ")[1];
        const payload = verifyAccessToken(token);

        // Confirm user still exists in DB
        const user = await User.findById(payload.userId).select("_id role");
        if (!user) return next(new AppError("User no longer exists", 401));

        // Attach to request — accessible via (req as any).user in controllers
        (req as any).user = { userId: payload.userId, role: payload.role };
        next();
    } catch (err: any) {
        if (err.name === "JsonWebTokenError")
            return next(new AppError("Invalid token", 401));
        if (err.name === "TokenExpiredError")
            return next(new AppError("Token has expired", 401));
        next(err);
    }
};