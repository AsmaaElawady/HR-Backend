import { Request, Response } from "express";
import * as vacationService from "../services/vacation.service";
import * as httpStatusText from "../../../shared/utils/httpStatusText";
import AppError from "@shared/utils/appError";

export const submitVacation = async (req: Request, res: Response) => {
    const user = (req as any).user;
    const tokenEmployeeId = (req as any).user.role === "employee"
    ? (req as any).user.employeeId
    : undefined;

        console.log("role:", (req as any).user.role);
    console.log("tokenEmployeeId:", tokenEmployeeId);
    console.log("body:", req.body);
    
    const vacation = await vacationService.submitVacation(req.body, tokenEmployeeId);
    res.status(201).json({ status: httpStatusText.SUCCESS, data: vacation });
};

export const getSubmittedVacations = async (_req: Request, res: Response) => {
    const vacations = await vacationService.getSubmittedVacations();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: vacations });
};

export const approveVacation = async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const vacation = await vacationService.approveVacation(id);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: vacation });
};

export const rejectVacation = async (req: Request, res: Response) => {
    const id  = req.params.id as string;
    const vacation = await vacationService.rejectVacation(id);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: vacation });
};

export const getVacationStats = async (_req: Request, res: Response) => {
    const stats = await vacationService.getVacationStats();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: stats });
};


export const getMyVacations = async (req: Request, res: Response) => {
    const employeeId = (req as any).user.employeeId;
    if (!employeeId) throw new AppError("Not linked to an employee record", 400);
    const vacations = await vacationService.getMyVacations(employeeId);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: vacations });
};