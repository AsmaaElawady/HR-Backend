import mongoose from "mongoose";

export interface IVacation extends mongoose.Document {
    employeeId: mongoose.Types.ObjectId;
    fromDate: Date;
    toDate: Date;
    reason: string;
    status: "submitted" | "approved" | "rejected";
}

const vacationSchema = new mongoose.Schema<IVacation>(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
            required: true,
        },
        fromDate: { type: Date, required: true },
        toDate: { type: Date, required: true },
        reason: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ["submitted", "approved", "rejected"],
            default: "submitted",
        },
    },
    { timestamps: true }
);

export const Vacation = mongoose.model<IVacation>("Vacation", vacationSchema);