import { Request, Response } from "express";
import * as employeeService from "../services/employee.service";
import * as httpStatusText from '../../../shared/utils/httpStatusText';
import AppError from "../../../shared/utils/appError";
import { uploadImage } from "../../../shared/utils/cloudinary";
import asyncHandler from "@shared/utils/asyncHandler";


export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
    let profilePhoto: string | undefined = undefined;
    if (req.file) {
        profilePhoto = await uploadImage(req.file, "hr-system/employees");
    }

    const employee = await employeeService.createEmployee({
        ...req.body,
        profilePhoto,
    });
    res.status(201).json({ status: httpStatusText.SUCCESS, data: employee });
});

export const getAllEmployees = asyncHandler( async (req: Request, res: Response) => {
    const result = await employeeService.getAllEmployees(req.query as Record<string, string>);
    res.status(200).json({ status: httpStatusText.SUCCESS, ...result });
});


export const searchEmployees = asyncHandler(async (req: Request, res: Response) => {
    const { name } = req.query as { name: string };
    const employees = await employeeService.searchEmployeeByName(name);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: employees });
});


export const getEmployee = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const employee = await employeeService.getEmployeeById(id);
    res.status(200).json({ status: httpStatusText.SUCCESS, data: employee });
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    const user = (req as any).user;

    if (user.role === 'employee') {
        if (id !== user.employeeId?.toString()) {
            throw new AppError("You do not have permission to update someone else's profile", 403);
        }
        // Prevent employee from updating sensitive fields
        delete req.body.salary;
        delete req.body.availableVacationDays;
        delete req.body.approvedVacationDays;
    }

    const employee = await employeeService.updateEmployee(id, req.body);
    res.status(200).json({ status: "success", data: employee });
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await employeeService.deleteEmployee(id);
    res.status(204).send();
});

export const uploadPhoto = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new AppError("Please upload an image file", 400);
    }
    
    const { id } = req.params as { id: string };
    const user = (req as any).user;

    if (user.role === 'employee') {
        if (id !== user.employeeId?.toString()) {
            throw new AppError("You do not have permission to update someone else's profile photo", 403);
        }
    }

    const imageUrl = await uploadImage(req.file, "hr-system/employees");

    const employee = await employeeService.updateProfilePhoto(id, imageUrl);
    
    res.status(200).json({ status: "success", data: employee });
});
