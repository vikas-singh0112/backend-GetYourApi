import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalError.js";
import axios from "axios";
import passport from "./config/passport.config.js";

// route imports
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import todoRouter from "./routes/todo.route.js";
import productRouter from "./routes/product.route.js";
import jokeRouter from "./routes/joke.route.js";
import { ApiError } from "./utils/apiError.js";

const app = express();

const frontendOrigins = (process.env.FRONTEND_ORIGINS || "")
	.split(",")
	.map((o) => o.trim())
	.filter(Boolean);

// cors config
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

// ping to own backend to keep it alive
const BACKEND_URL = process.env.BACKEND_URL!;

app.get("/ping", (req, res) => {
	res.status(200).send("Awake");
});

setInterval(async () => {
	try {
		await axios.get(BACKEND_URL);
		console.log("Self-ping successful: Staying awake!");
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			console.error("Self-ping failed:", error.message);
		} else {
			console.error("Self-ping failed:", error);
		}
	}
}, 600000);

// config
app.use(
	cors({
		credentials: true,
		origin: process.env.FRONTEND_ORIGINS,
	}),
);
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// route initialize

// auth route
app.use("/api/auth", cors(authCors), authRouter);

// non auth routes
app.use("/api/users", cors(publicCors), userRouter);
app.use("/api/todos", cors(publicCors), todoRouter);
app.use("/api/products", cors(publicCors), productRouter);
app.use("/api/jokes", cors(publicCors), jokeRouter);

// catch wildcard routes
app.all("/*splat", cors(publicCors), (req, res, next) => {
	const error = new ApiError({
		statusCode: 404,
		message: `Route '${req.originalUrl}' not found on this server with method [${req.method}]`,
	});
	next(error);
});

// global error handler
app.use(globalErrorHandler);

export { app };
