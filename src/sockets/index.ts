import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (httpServer: http.Server): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",   // in production i will replace with myfrontend URL
            methods: ["GET", "POST"],
        },
    });
    return io;
};

export const getIO = (): Server => {
    if (!io) throw new Error("Socket.IO not initialized");
    return io;
};