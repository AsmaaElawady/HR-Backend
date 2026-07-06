import bcrypt from 'bcryptjs';
import { User } from "../../../shared/models/user.model";
import { Employee } from "../../../shared/models/employee.model";
import AppError from "../../../shared/utils/appError";
import {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} from "../../../shared/utils/generateToken";
import sendEmail from "../../../shared/utils/sendEmail";
import generatePassword from "../../../shared/utils/generatePassword";
import { RegisterInput, LoginInput, ChangePasswordInput } from "../validators/auth.validator";
import { welcomeEmail } from "@shared/utils/emailTemplates";


export const register = async (data: RegisterInput, requestingRole: string) => {
    if (data.role === "admin" && requestingRole !== "admin") {
        throw new AppError("Only admins can create admin accounts", 403);
    }

    if (data.role === "employee" && !data.employeeId) {
        throw new AppError("employeeId is required when registering an employee", 400);
    }

    if (data.role === "employee" && data.employeeId) {
        const employee = await Employee.findById(data.employeeId);
        if (!employee) {
            throw new AppError("Employee not found", 404);
        }
    }

    const existing = await User.findOne({ email: data.email });
    if (existing){
        throw new AppError("Email already registered", 409);
    }

    const plainPassword = data.role === "employee" ? generatePassword() : data.password!;

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = await User.create({
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role ?? "hr",
        employeeId: data.employeeId
    });

    if (data.role === "employee") {
        await sendEmail({
            to: data.email,
            subject: "Welcome to HR System — Your Login Credentials",
            html: welcomeEmail({ email: data.email, password: plainPassword }),
        });
    }

    return user;
};


export const login = async (data: LoginInput) => {
    const user = await User.findOne({ email: data.email });
    if (!user){
        throw new AppError("Invalid credentials", 401);
    } 
    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch){
        throw new AppError("Invalid credentials", 401);
    } 

    const payload = { 
        userId: user._id.toString(), 
        role: user.role,
        employeeId: user.employeeId?.toString()
    };

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
        employeeId: user.employeeId?.toString()
    });

    return { accessToken };
};


export const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-passwordHash").populate("employeeId");
    if (!user){
        throw new AppError("User not found", 404);
    } 
    return user;
};

export const changePassword = async (userId: string, data: ChangePasswordInput) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isMatch = await user.comparePassword(data.currentPassword);
    if (!isMatch) {
        throw new AppError("Current password is incorrect", 401);
    } 

    user.passwordHash = await bcrypt.hash(data.newPassword, 12);
    await user.save();

    return { message: "Password changed successfully" };
};