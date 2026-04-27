import z from 'zod';


export const createEmployeeSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters long"),
        email: z.string().email("Invalid email address").min(1, "Email is required"),
        address: z.string().min(5, "Address must be at least 5 characters long"),
        phone: z.string().min(10, "Phone number must be at least 10 characters long").max(15, "Phone number must be at most 15 characters long"),
        gender: z.enum(['male', 'female'], "Gender must be either 'male' or 'female'"),
        maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], "Marital status must be one of 'single', 'married', 'divorced', or 'widowed'"),
        availableVacationDays: z.number().int().nonnegative().default(21),
        approvedVacationDays: z.number().int().nonnegative().default(0),
        salary: z.number().positive("Salary must be a positive number"),
        dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
        profilePhoto: z.string().optional(),
        // role: z.enum(['employee', 'admin'], "Role must be either 'employee' or 'admin'"),
        // token: z.string().min(1, "Token is required"),
        // refreshToken: z.string().min(1, "Refresh token is required"),
    })
});

export const updateEmployeeSchema = z.object({
    body: z.object({
        name: z.string().min(2).trim().optional(),
        email: z.string().email().optional(),
        address: z.string().min(5).optional(),
        phone: z.string().min(7).optional(),
        gender: z.enum(["male", "female"]).optional(),
        maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
        availableVacationDays: z.number().int().min(0).optional(),
        salary: z.number().positive().optional(),
        dateOfBirth: z
            .string()
            .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
            .optional(),
    }),
    params: z.object({
        id: z.string().length(24, "Invalid employee ID"),
    }),
});

export const getEmployeeSchema = z.object({
    params: z.object({
        id: z.string().length(24, "Invalid employee ID"),
    }),
});

export const listEmployeesSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        gender: z.enum(["male", "female"]).optional(),
        maritalStatus: z.enum(["single", "married", "divorced", "widowed"]).optional(),
        sortBy: z.enum(["name", "salary", "createdAt"]).optional(),
        order: z.enum(["asc", "desc"]).optional(),
    }),
});

export const searchEmployeeSchema = z.object({
    query: z.object({
        name: z.string().min(1, "Search name is required"),
    }),
});


export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>['body'];
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>['body'] & z.infer<typeof updateEmployeeSchema>['params'];