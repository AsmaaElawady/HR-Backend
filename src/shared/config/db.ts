import mongoose from "mongoose"
import { config } from "./env"

let isConnected = false;

export const connectDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);
    if (isConnected) {
        return;
    }
    
    try {
        const db = await mongoose.connect(config.MONGO_URI, {
            serverSelectionTimeoutMS: 9000,
            socketTimeoutMS: 9000,
        });
        
        isConnected = db.connections[0].readyState === 1;
        console.log("MongoDB connected");
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        throw error;
    }
}