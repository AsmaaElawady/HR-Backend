import { Router } from "express";
import * as employeeController from "../controllers/employee.controller";
import { validate } from "../../../shared/middleware/validate";
import {
    createEmployeeSchema,
    updateEmployeeSchema,
    getEmployeeSchema,
    listEmployeesSchema,
    searchEmployeeSchema,
} from "../validators/employee.validator";
import { authenticate } from "../../../shared/middleware/authenticate";
import { authorize } from "../../../shared/middleware/authorize";
import upload from "../../../shared/middleware/upload";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /employees/search:
 *   get:
 *     summary: Search employees by name
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matched employees
 */
router.get("/search", validate(searchEmployeeSchema), employeeController.searchEmployees);

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees (paginated, filtered, sorted)
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: gender
 *         schema: { type: string, enum: [male, female] }
 *       - in: query
 *         name: maritalStatus
 *         schema: { type: string, enum: [single, married, divorced, widowed] }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, enum: [name, salary, createdAt] }
 *       - in: query
 *         name: order
 *         schema: { type: string, enum: [asc, desc] }
 *     responses:
 *       200:
 *         description: Paginated employee list
 */
router.get("/", validate(listEmployeesSchema), employeeController.getAllEmployees);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee (admin only)
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeInput'
 *     responses:
 *       201:
 *         description: Employee created
 *       409:
 *         description: Email already exists
 */
router.post("/", authorize("admin"), upload.single("photo"), validate(createEmployeeSchema), employeeController.createEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get a single employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Employee data
 *       404:
 *         description: Employee not found
 */
router.get("/:id", validate(getEmployeeSchema), employeeController.getEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Update an employee (admin, hr, or self)
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEmployeeInput'
 *     responses:
 *       200:
 *         description: Employee updated
 *       404:
 *         description: Employee not found
 */
router.patch("/:id", authorize("admin", "hr", "employee"), validate(updateEmployeeSchema), employeeController.updateEmployee);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee (admin only)
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Employee deleted
 *       404:
 *         description: Employee not found
 */
router.delete("/:id", authorize("admin"), validate(getEmployeeSchema), employeeController.deleteEmployee);

/**
 * @swagger
 * /employees/{id}/photo:
 *   patch:
 *     summary: Upload or replace an employee's profile photo
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [photo]
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Photo uploaded and Cloudinary URL saved
 *       400:
 *         description: No file provided
 *       404:
 *         description: Employee not found
 */
router.patch("/:id/photo", authorize("admin", "hr", "employee"), upload.single("photo"), employeeController.uploadPhoto);

export default router;