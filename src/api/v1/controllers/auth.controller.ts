import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import * as httpStatusText from "../../../shared/utils/httpStatusText";

export const register = async (req: Request, res: Response) => {
    const requestingRole = (req as any).user?.role ?? "admin";
    const user = await authService.register(req.body, requestingRole);
    res.status(201).json({ status: httpStatusText.SUCCESS, data: user });
};

export const login = async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.status(200).json({
        status: httpStatusText.SUCCESS,
        data: { accessToken, refreshToken, user },
    });
};

export const refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const result = await authService.refreshAccessToken(refreshToken);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: result });
};

export const getMe = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const user = await authService.getMe(userId);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: user });
};

export const changePassword = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const result = await authService.changePassword(userId, req.body);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: result });
};