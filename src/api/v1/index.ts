import { Router } from "express";
import employeeRouter from "./routes/employee.routes";
import authRouter from "./routes/auth.routes";
import vacationRouter from "./routes/vacation.routes";


const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/employees",employeeRouter);
v1Router.use("/vacations", vacationRouter);


export default v1Router;