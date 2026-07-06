import z from "zod";

export const createVacationSchema = z.object({
    body: z.object({
        employeeId: z.string().length(24, "Invalid employee ID").optional(),
        fromDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid fromDate"),
        toDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid toDate"),
        reason: z.string().min(5, "Reason must be at least 5 characters"),
    }),
});

export const vacationIdSchema = z.object({
    params: z.object({
        id: z.string().length(24, "Invalid vacation ID"),
    }),
});

export type CreateVacationInput = z.infer<typeof createVacationSchema>["body"];