import mongoose from "mongoose";
import { Vacation } from "../../../shared/models/vacation.model";
import { Employee } from "../../../shared/models/employee.model";
import AppError from "../../../shared/utils/appError";
import { CreateVacationInput } from "../validators/vacation.validator";
import { notifyAdminsNewVacation, notifyEmployeeApproved, notifyEmployeeRejected } from "../../../sockets/vacation.events";
import { approvedVacationEmail, rejectedVacationEmail } from "../../../shared/utils/emailTemplates";
import sendEmail from "../../../shared/utils/sendEmail";


export const submitVacation = async (data: CreateVacationInput, tokenEmployeeId?: string) => {
    const employeeId = tokenEmployeeId ?? data.employeeId;
    if (!employeeId) {
        throw new AppError("employeeId is required", 400);
    }
    const employee = await Employee.findById(employeeId);
    if (!employee)
        {
            throw new AppError("Employee not found", 404);
        } 
    
    const from = new Date(data.fromDate);
    const to = new Date(data.toDate);

    if (to <= from){
        throw new AppError("toDate must be after fromDate", 400);
    } 

    const diffMs = to.getTime() - from.getTime();
    const requestedDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (requestedDays > employee.availableVacationDays) {
        throw new AppError(
            `Not enough vacation days. Available: ${employee.availableVacationDays}`,
            400
        );
    }

    const vacation = await Vacation.create({
        ...data,
        employeeId,
        fromDate: from,
        toDate: to,
    });

    notifyAdminsNewVacation({
        employeeName: employee.name,
        employeeId: employee._id.toString(),
        vacationId: vacation._id,
        fromDate: from.toDateString(),
        toDate: to.toDateString(),
        requestedDays,
    });

    return vacation;
};


export const getSubmittedVacations = async () => {
    const vacations = await Vacation.find({ status: "submitted" })
        .populate("employeeId", "name email")
        .sort({ createdAt: -1 })
        .lean();
    return vacations;
};

export const getMyVacations = async (employeeId: string) => {
    const vacations = await Vacation.find({ employeeId })
        .sort({ createdAt: -1 })
        .lean();
    return vacations;
};


export const approveVacation = async (id: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const vacation = await Vacation.findById(id).session(session);
        if (!vacation){
            throw new AppError("Vacation not found", 404);
        } 
        if (vacation.status !== "submitted"){
            throw new AppError("Only submitted vacations can be approved", 400);
        }

        const diffMs = vacation.toDate.getTime() - vacation.fromDate.getTime();
        const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

        const employee = await Employee.findById(vacation.employeeId).session(session);
        if (!employee) {
            throw new AppError("Employee not found", 404);
        }

        if (days > employee.availableVacationDays) {
            throw new AppError("Employee no longer has enough vacation days", 400);
        }
            
        vacation.status = "approved";
        await vacation.save({ session });

        await Employee.findByIdAndUpdate(
            vacation.employeeId,
            {
                $inc: {
                    approvedVacationDays: days,
                    availableVacationDays: -days,
                },
            },
            { session }
        );

        await session.commitTransaction();

        notifyEmployeeApproved({
            employeeId: vacation.employeeId.toString(),
            vacationId: vacation._id,
            fromDate: vacation.fromDate,
            toDate: vacation.toDate,
            days,
        });

        await sendEmail({
            to: employee.email,
            subject: "Vacation Request Approved",
            html: approvedVacationEmail({
                employeeName: employee.name,
                fromDate: vacation.fromDate.toDateString(),
                toDate: vacation.toDate.toDateString(),
                days,
                remainingDays: employee.availableVacationDays - days,
            }),
        });
        return vacation;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};


export const rejectVacation = async (id: string) => {
    const vacation = await Vacation.findById(id);
    if (!vacation) {
        throw new AppError("Vacation not found", 404);
    }
    if (vacation.status !== "submitted"){
        throw new AppError("Only submitted vacations can be rejected", 400);
    }

    vacation.status = "rejected";
    await vacation.save();

    const employee = await Employee.findById(vacation.employeeId);
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    notifyEmployeeRejected({
        employeeId: vacation.employeeId.toString(),
        vacationId: vacation._id,
        fromDate: vacation.fromDate,
        toDate: vacation.toDate,
    });

    await sendEmail({
        to: employee.email,
        subject: "Vacation Request Rejected",
        html: rejectedVacationEmail({
            employeeName: employee.name,
            fromDate: vacation.fromDate.toDateString(),
            toDate: vacation.toDate.toDateString(),
        }),
    });
    return vacation;
};


export const getVacationStats = async () => {
    const stats = await Vacation.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const topEmployees = await Employee.find()
        .sort({ approvedVacationDays: -1 })
        .limit(5)
        .select("name approvedVacationDays availableVacationDays")
        .lean();

    return { stats, topEmployees };
};