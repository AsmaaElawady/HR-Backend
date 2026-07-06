import { Server, Socket } from "socket.io";

export const initVacationSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`Socket connected: ${socket.id}`);

        socket.on("join", (data: { role: string; employeeId?: string }) => {
            if (data.role === "admin" || data.role === "hr") {
                socket.join("admins");
                console.log(`Admin/HR joined room: admins`);
            }

            if (data.role === "employee" && data.employeeId) {
                socket.join(`employee_${data.employeeId}`);
                console.log(`Employee joined room: employee_${data.employeeId}`);
            }
        });

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });
};