import { getIO } from "./index";

export const notifyAdminsNewVacation = (data: {
    employeeName: string;
    employeeId: string;
    vacationId: unknown;
    fromDate: string;
    toDate: string;
    requestedDays: number;
}): void => {
    getIO().to("admins").emit("vacation:new", {
        message: `New vacation request from ${data.employeeName}`,
        ...data,
    });
};

export const notifyEmployeeApproved = (data: {
    employeeId: string;
    vacationId: unknown;
    fromDate: Date;
    toDate: Date;
    days: number;
}): void => {
    getIO().to(`employee_${data.employeeId}`).emit("vacation:approved", {
        message: "Your vacation request has been approved",
        ...data,
    });
};

export const notifyEmployeeRejected = (data: {
    employeeId: string;
    vacationId: unknown;
    fromDate: Date;
    toDate: Date;
}): void => {
    getIO().to(`employee_${data.employeeId}`).emit("vacation:rejected", {
        message: "Your vacation request has been rejected",
        ...data,
    });
};