import { Request, Response } from "express";
import asyncHandler from "../../../shared/utils/asyncHandler";
import * as employeeService from "../services/employee.service";
import * as httpStatusText from '../../../shared/utils/httpStatusText';


export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json({ status: httpStatusText.SUCCESS, data: employee });
});

export const getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
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
    const employee = await employeeService.updateEmployee(id, req.body);
    res.status(200).json({ status: "success", data: employee });
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as { id: string };
    await employeeService.deleteEmployee(id);
    res.status(204).send();
});

export const uploadPhoto = asyncHandler(async (req: Request, res: Response) => {
    const url = (req as any).fileUrl;
    const { id } = req.params as { id: string };
    const employee = await employeeService.updateProfilePhoto(id, url);
    res.status(200).json({ status: "success", data: employee });
});
