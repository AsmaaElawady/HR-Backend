import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        status: "error",
        statusCode: 429,
        message: "Too many requests, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        status: "error",
        statusCode: 429,
        message: "Too many login attempts, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
});