import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./env";

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "HR Management System API",
            version: "1.0.0",
            description: "API documentation for the HR Management System",
        },
        servers: [
            {
                url: "https://hr-backend-lake.vercel.app/api/v1",
                description: "Production server",
            },
            {
                url: `http://localhost:${config.PORT}/api/v1`,
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                LoginInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "admin@hr.com" },
                        password: { type: "string", example: "Admin@1234" },
                    },
                },
                RegisterInput: {
                    type: "object",
                    required: ["email", "password"],
                    properties: {
                        email: { type: "string", example: "hr@company.com" },
                        password: { type: "string", example: "Hr@12345" },
                        role: { type: "string", enum: ["admin", "hr"], example: "hr" },
                    },
                },
                CreateEmployeeInput: {
                    type: "object",
                    required: ["name", "email", "address", "phone", "gender", "maritalStatus", "salary", "dateOfBirth"],
                    properties: {
                        name: { type: "string", example: "John Doe" },
                        email: { type: "string", example: "john.doe@company.com" },
                        address: { type: "string", example: "123 Main Street, Cairo" },
                        phone: { type: "string", example: "01012345678" },
                        gender: { type: "string", enum: ["male", "female"] },
                        maritalStatus: { type: "string", enum: ["single", "married", "divorced", "widowed"] },
                        salary: { type: "number", example: 8000 },
                        dateOfBirth: { type: "string", example: "1995-06-15" },
                        availableVacationDays: { type: "number", example: 21 },
                    },
                },
                UpdateEmployeeInput: {
                    type: "object",
                    properties: {
                        name: { type: "string", example: "John Doe" },
                        salary: { type: "number", example: 10000 },
                        maritalStatus: { type: "string", enum: ["single", "married", "divorced", "widowed"] },
                    },
                },
                CreateVacationInput: {
                    type: "object",
                    required: ["employeeId", "fromDate", "toDate", "reason"],
                    properties: {
                        employeeId: { type: "string", example: "664f1c2e8a1b2c3d4e5f6a7b" },
                        fromDate: { type: "string", example: "2025-06-01" },
                        toDate: { type: "string", example: "2025-06-05" },
                        reason: { type: "string", example: "Annual family vacation" },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        path.join(__dirname, "../../api/v1/routes/auth.routes.ts"),
        path.join(__dirname, "../../api/v1/routes/employee.routes.ts"),
        path.join(__dirname, "../../api/v1/routes/vacation.routes.ts"),
    ],
};

export const swaggerSpec = swaggerJsdoc(options);