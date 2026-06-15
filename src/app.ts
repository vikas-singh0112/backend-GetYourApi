import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalError";

const app = express();

const frontendOrigins = (process.env.FRONTEND_ORIGINS || "")
	.split(",")
	.map((o) => o.trim())
	.filter(Boolean);

const authCors: CorsOptions = {
	origin: (origin, cb) => {
		// allow non-browser clients (no Origin header)
		if (!origin) return cb(null, true);
		if (frontendOrigins.includes(origin)) return cb(null, true);
		return cb(new Error("CORS blocked"), false);
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	maxAge: 86400,
};

const publicCors: CorsOptions = {
	origin: "*",
	credentials: false,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	maxAge: 86400,
};

app.use(cookieParser());

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// route imports
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import todoRouter from "./routes/todo.route";
import productRouter from "./routes/product.route";
import jokeRouter from "./routes/joke.route";

// route initialize
// auth
app.use("/api/auth", cors(authCors), authRouter);

// non auth routes
app.use("/api/users", cors(publicCors), userRouter);
app.use("/api/todos", cors(publicCors), todoRouter);
app.use("/api/products", cors(publicCors), productRouter);
app.use("/api/jokes", cors(publicCors), jokeRouter);

// global error handler
app.use(globalErrorHandler);

export { app };
