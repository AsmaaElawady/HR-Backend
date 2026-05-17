import { User } from "../../../shared/models/user.model";
import AppError from "../../../shared/utils/appError";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../../../shared/utils/generateToken";
import { RegisterInput, LoginInput } from "../validators/auth.validator";


export const register = async (data: RegisterInput, requestingRole: string) => {
    // Only admins can create other admin accounts
    if (data.role === "admin" && requestingRole !== "admin") {
        throw new AppError("Only admins can create admin accounts", 403);
    }

    const existing = await User.findOne({ email: data.email });
    if (existing){
        throw new AppError("Email already registered", 409);
    }

    const user = await User.create({
        email: data.email,
        passwordHash: data.password,
        role: data.role ?? "hr",
    });

    return user;
};


export const login = async (data: LoginInput) => {
    const user = await User.findOne({ email: data.email });
    if (!user){
        throw new AppError("Invalid credentials", 401);
    } 
    const isMatch = await user.comparePassword(data.password);
    if (!isMatch){
        throw new AppError("Invalid credentials", 401);
    } 

    const payload = { userId: user._id.toString(), role: user.role };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { accessToken, refreshToken, user };
};


export const refreshAccessToken = async (token: string) => {
    let payload;
    try {
        payload = verifyRefreshToken(token);
    } catch {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await User.findById(payload.userId);
    if (!user){
        throw new AppError("User no longer exists", 401);
    } 

    const accessToken = signAccessToken({
        userId: user._id.toString(),
        role: user.role,
    });

    return { accessToken };
};


export const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-passwordHash");
    if (!user){
        throw new AppError("User not found", 404);
    } 
    return user;
};