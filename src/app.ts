import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}),
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// route imports

import userRouter from "./routes/user.routes";


app.use("/api/users", userRouter);

export { app };
