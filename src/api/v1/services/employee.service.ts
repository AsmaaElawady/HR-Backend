import { Employee, IEmployee } from '../../../shared/models/employee.model';
import { CreateEmployeeInput, UpdateEmployeeInput } from '../validators/employee.validator';
import AppError from '../../../shared/utils/appError';
import { email } from 'zod';


export const createEmployee = async (data: CreateEmployeeInput): Promise<IEmployee> => {
    const existingEmployee = await Employee.findOne({ email: data.email });
    if (existingEmployee) {
        throw new AppError('Employee with this email already exists', 409);
    }

    // dateOfBirth comes in as a string (from JSON/form input) but needs to be stored as a Date object. 
    // The spread lets you pass everything through while transforming just that one field
    const employee = await new Employee({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth)
    });
    await employee.save();
    return employee;
}

interface ListOptions {
    page?: string;
    limit?: string;
    gender?: string;
    maritalStatus?: string;
    sortBy?: string;
    order?: string;
}

export const getAllEmployees = async (options: ListOptions) => {
    const page = parseInt(options.page || '1');
    const limit = parseInt(options.limit || '10');
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (options.gender) filter.gender = options.gender;
    if (options.maritalStatus) filter.maritalStatus = options.maritalStatus;

    let sort: Record<string, 1 | -1> = {};
    if (options.sortBy) {
        const order = options.order === 'desc' ? -1 : 1;
        sort[options.sortBy] = order;
    } else {
        sort.createdAt = -1;
    }

    const employees = await Employee.find(filter).sort(sort).skip(skip).limit(limit).lean();
    const total = await Employee.countDocuments(filter);
    return {
        data: employees,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}


export const searchEmployeeByName = async (name: string) => {
    const employees = await Employee.find({ $text: { $search: name } }).lean();
    return employees;
}

export const getEmployeeById = async (id: string) => {
    const employee = await Employee.findById(id).lean();
    if (!employee) {
        throw new AppError('Employee not found', 404);
    }
    return employee;
}

export const updateEmployee = async (id: string, data: UpdateEmployeeInput): Promise<IEmployee> => {
    if (data.email) {
        const existing = await Employee.findOne({ email: data.email, _id: { $ne: id } });
        if (existing) {
            throw new AppError("Email already in use by another employee", 409);
        }
    }

    const updated = await Employee.findByIdAndUpdate(
        id,
        { ...data, ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }) },
        //returnDocument: "after" => Return updated document, not old one
        // runValidators: true => Apply schema validation on update
        { returnDocument: "after", runValidators: true }
    );

    if (!updated) {
        throw new AppError("Employee not found", 404);
    }
    return updated;
}


export const deleteEmployee = async (id: string): Promise<void> => {
    const deleted = await Employee.findByIdAndDelete(id);
    if (!deleted) {
        throw new AppError("Employee not found", 404);
    }
}


export const updateProfilePhoto = async (id: string, url: string): Promise<IEmployee> => {
    const employee = await Employee.findByIdAndUpdate(
        id,
        { profilePhoto: url },
        { returnDocument: "after" }
    )
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }
    return employee;
}