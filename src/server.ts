import app from './app';
import http from "http";
import { config } from './shared/config/env';
import { connectDB } from './shared/config/db';
import { initSocket } from "./sockets";
import { initVacationSocket } from "./sockets/vacation.socket";


const start = async () => {
  await connectDB();

  const httpServer = http.createServer(app);

  const io = initSocket(httpServer);

  initVacationSocket(io);

  httpServer.listen(config.PORT, () => {
    console.log(`Server running on http://localhost:${config.PORT}`);
  });
}

start();
