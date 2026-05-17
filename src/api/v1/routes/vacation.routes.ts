import { Router } from "express";
import * as vacationController from "../controllers/vacation.controller";
import { validate } from "../../../shared/middleware/validate";
import { createVacationSchema, vacationIdSchema } from "../validators/vacation.validator";
import { authenticate } from "../../../shared/middleware/authenticate";
import { authorize } from "../../../shared/middleware/authorize";

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /vacations/stats:
 *   get:
 *     summary: Get vacation statistics
 *     tags: [Vacations]
 *     responses:
 *       200:
 *         description: Vacation stats and top employees
 */
router.get("/stats", authorize("admin", "hr"), vacationController.getVacationStats);

/**
 * @swagger
 * /vacations/submitted:
 *   get:
 *     summary: Get all submitted vacations
 *     tags: [Vacations]
 *     responses:
 *       200:
 *         description: List of submitted vacations with employee info
 */
router.get("/submitted", authorize("admin", "hr"), vacationController.getSubmittedVacations);

/**
 * @swagger
 * /vacations:
 *   post:
 *     summary: Submit a vacation request
 *     tags: [Vacations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVacationInput'
 *     responses:
 *       201:
 *         description: Vacation submitted
 *       400:
 *         description: Not enough vacation days or invalid dates
 */
router.post("/", authorize("admin", "hr"), validate(createVacationSchema), vacationController.submitVacation);

/**
 * @swagger
 * /vacations/{id}/approve:
 *   patch:
 *     summary: Approve a vacation (admin only)
 *     tags: [Vacations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vacation approved and employee days updated atomically
 *       400:
 *         description: Already approved or rejected
 */
router.patch("/:id/approve", authorize("admin"), validate(vacationIdSchema), vacationController.approveVacation);

/**
 * @swagger
 * /vacations/{id}/reject:
 *   patch:
 *     summary: Reject a vacation (admin only)
 *     tags: [Vacations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Vacation rejected
 *       400:
 *         description: Already approved or rejected
 */
router.patch("/:id/reject", authorize("admin"), validate(vacationIdSchema), vacationController.rejectVacation);

export default router;