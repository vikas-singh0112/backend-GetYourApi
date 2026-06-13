import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalError";

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
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import todoRouter from "./routes/todo.route";

// route initialize
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/todos", todoRouter);


// global error handler
app.use(globalErrorHandler);

export { app };
