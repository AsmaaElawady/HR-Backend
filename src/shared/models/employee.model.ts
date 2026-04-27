import mongoose from "mongoose";

export interface IEmployee extends mongoose.Document {
    name: string;
    email: string;
    address: string;
    phone: string;
    gender: 'male' | 'female';
    maritalStatus: 'single' | 'married' | 'divorced';
    availableVacationDays: number;
    approvedVacationDays: number;
    salary: number;
    dateOfBirth: Date;
    profilePhoto?: string;
    // role: 'employee' | 'admin';
    // token: string;
    // refreshToken: string;
}


const employeeSchema = new mongoose.Schema<IEmployee>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    address: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ['male', 'female'], 
        required: true 
    },
    maritalStatus: { 
        type: String, 
        enum: ['single', 'married', 'divorced', 'widowed'], 
        required: true 
    },
    availableVacationDays: { 
        type: Number, 
        default: 21 
    },
    approvedVacationDays: { 
        type: Number, 
        default: 0 
    },
    salary: { 
        type: Number, required: true 
    },
    dateOfBirth: { 
        type: Date, 
        required: true 
    },
    profilePhoto:{
        type: String,
    },
    // role:{
    //     type: String,
    //     enum: ['employee', 'admin'],
    //     default: 'employee'
    // },
    // token:{
    //     type: String,
    //     required: true
    // },
    // refreshToken:{
    //     type: String,
    //     required: true
    // }
},
    { timestamps: true }
)

employeeSchema.index({ name: 'text' });
employeeSchema.index({ email: 1 }, { unique: true });

export const Employee = mongoose.model<IEmployee>('Employee', employeeSchema);
