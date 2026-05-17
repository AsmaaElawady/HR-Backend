import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
}

if(!config.MONGO_URI){
    console.error("MONGO_URI is missing from .env file");
    process.exit(1);
}

if (!config.JWT_SECRET) {
    console.error("JWT_SECRET is missing from .env file");
    process.exit(1);
}

if (!config.JWT_REFRESH_SECRET) {
    console.error("JWT_REFRESH_SECRET is missing from .env file");
    process.exit(1);
}

