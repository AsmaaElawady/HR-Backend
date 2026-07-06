import express, { Application } from 'express';
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import v1Router from "./api/v1";
import { errorHandler } from "./shared/middleware/errorHandler";
import { notFound } from "./shared/middleware/notFound";
import httpLogger from "./shared/middleware/httpLogger";
import { globalLimiter, authLimiter } from "./shared/middleware/rateLimiter";
import swaggerRouter from "./shared/config/swaggerUi";

const app: Application = express();

app.use("/api/docs", swaggerRouter);

// Security & parsing
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(httpLogger);

app.use("/api", globalLimiter);
app.use("/api/v1/auth", authLimiter);

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "HR API is running" });
});

app.use("/api/v1", v1Router);

app.use(notFound);
app.use(errorHandler);

export default app;