import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    email: string;
    passwordHash: string;
    role: "admin" | "hr";
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["admin", "hr"], default: "hr" },
    },
    { timestamps: true }
);

userSchema.pre("save", async function () {
    if (!this.isModified("passwordHash")) return;
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
    return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.set("toJSON", {
    transform: (_doc, ret) => {
        ret.passwordHash = undefined as any;
        return ret;
    },
});

export const User = mongoose.model<IUser>("User", userSchema);