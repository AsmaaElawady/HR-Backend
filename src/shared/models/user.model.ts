import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    employeeId: mongoose.Types.ObjectId;
    email: string;
    passwordHash: string;
    role: "admin" | "hr" | "employee";
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["admin", "hr", "employee"], default: "hr" },

    },
    { timestamps: true }
);


export const User = mongoose.model<IUser>("User", userSchema);