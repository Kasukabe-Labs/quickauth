import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(morgan("tiny"));

const PORT = process.env.PORT;

app.get("/health", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Server is up 🚀",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server is down 🚨",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server litsening on PORT ${PORT}`);
});
