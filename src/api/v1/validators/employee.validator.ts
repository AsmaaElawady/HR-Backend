import { z } from "zod";

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").trim(),
    email: z.string().email("Invalid email address"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    phone: z.string().min(7, "Phone must be at least 7 characters"),
    gender: z.enum(["male", "female"]),
    maritalStatus: z.enum(["single", "married", "divorced", "widowed"]),
    availableVacationDays: z.number().int().min(0).optional(),
    salary: z.number().positive("Salary must be a positive number"),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  }),
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

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>["body"];
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>["body"];