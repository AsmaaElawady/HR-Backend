import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import * as vacationService from "../services/vacation.service";
import * as httpStatusText from "../../../shared/utils/httpStatusText";

export const submitVacation = asyncHandler(async (req: Request, res: Response) => {
    const vacation = await vacationService.submitVacation(req.body);
    res.status(201).json({ status: httpStatusText.SUCCESS, data: vacation });
});

export const getSubmittedVacations = asyncHandler(async (_req: Request, res: Response) => {
    const vacations = await vacationService.getSubmittedVacations();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: vacations });
});

export const approveVacation = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const vacation = await vacationService.approveVacation(id);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: vacation });
});

export const rejectVacation = asyncHandler(async (req: Request, res: Response) => {
    const id  = req.params.id as string;
    const vacation = await vacationService.rejectVacation(id);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: vacation });
});

export const getVacationStats = asyncHandler(async (_req: Request, res: Response) => {
    const stats = await vacationService.getVacationStats();
    res.status(200).json({ status: httpStatusText.SUCCESS, data: stats });
});