import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { router } from "./routes";
import { CustomError } from "./types";

const app = express();
app.use(express.json());
app.use(router);

const httpsServer = createServer(app);
const io = new Server(httpsServer, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  },
});

io.on("connection", socket => {
  console.log(`a user connected with id ${socket.id}`);

  socket.on("typing", data => {
    console.log(data);
    io.emit("typing", data);
  });

  socket.on("message", data => {
    console.log(data);
    io.emit("message", data);
  });
  socket.on("disconnect", () => {
    console.log("client disconnect...", socket.id);
  });

  socket.on("error", err => {
    console.log("received error from client:", socket.id);
    console.log(err);
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err);
  res.status(err.status || 500).json({ data: err.message });
});

httpsServer.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});
