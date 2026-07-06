import { Express } from "express";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary";

export const uploadImage = (
    file: Express.Multer.File,
    folder: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
};