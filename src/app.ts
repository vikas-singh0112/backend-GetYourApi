import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// route imports

import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import { globalErrorHandler } from "./middlewares/globalError";

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

app.use(globalErrorHandler);

export { app };
