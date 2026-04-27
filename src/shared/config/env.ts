import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "",
    NODE_ENV: process.env.NODE_ENV || "development",
}

if(!config.MONGO_URI){
    console.error("MONGO_URI is missing from .env file");
    process.exit(1);
}

