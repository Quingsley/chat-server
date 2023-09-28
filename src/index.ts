import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { router } from "./routes";
import { socketHandler } from "./socket";
import { CustomError } from "./types";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const httpsServer = createServer(app);
const io = new Server(httpsServer, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

io.on("connection", socket => socketHandler(socket, io));

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  let message = "Internal server error";
  let status = 500;
  if (err instanceof CustomError) {
    message = err.message;
    status = err.status;
  }
  res.status(status).json({ data: message });
});

httpsServer.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
