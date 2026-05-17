import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import logger from "../utils/logger";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        return res.status(400).json({ status: "error", statusCode: 400, message: "Invalid ID format" });
    }

    // Mongoose duplicate key
    if ((err as any).code === 11000) {
        const field = Object.keys((err as any).keyValue || {})[0];
        return res.status(409).json({
            status: "error",
            statusCode: 409,
            message: `${field} already exists`,
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const messages = Object.values((err as any).errors).map((e: any) => e.message);
        return res.status(400).json({ status: "error", statusCode: 400, message: messages.join(", ") });
    }

    // Operational (AppError)
    if (err instanceof AppError) {
        logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl}`);
        return res.status(err.statusCode).json({
            status: "error",
            statusCode: err.statusCode,
            message: err.message,
        });
    }

    // Unknown errors
    logger.error(`UNHANDLED ERROR: ${err.message} - ${req.originalUrl}`, { stack: err.stack });
    res.status(500).json({ status: "error", statusCode: 500, message: "Internal server error" });
};