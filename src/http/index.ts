import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import { CustomError } from "../types";
import { router } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);

const httpsServer = createServer(app);
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

export { httpsServer };
