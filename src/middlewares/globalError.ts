import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/apiError.js";

export const globalErrorHandler = (
	error: Error,
	req: Request,
	res: Response,
	next: NextFunction,
): Response => {
	// Check if the error came from Zod validation
	if (error instanceof ZodError) {
		return res.status(400).json({
			success: false,
			message: "Validation Error",
			statusCode: 400,
			timestamp: new Date().toISOString(),
			errors: error.issues.map((issue) => ({
				field: issue.path.join(".").replace(/^(body|query|params)\./, ""),
				message: issue.message,
			})),
		});
	}

	if (error instanceof ApiError) {
		return res.status(error.statusCode).json({
			success: false,
			message: error.message,
			statusCode: error.statusCode,
			timestamp: new Date().toISOString(),
			errors: error.errors,
		});
	}

	console.error("Unhandled Error:", error);
	return res.status(500).json({
		success: false,
		message: "Internal Server Error",
		statusCode: 500,
		timestamp: new Date().toISOString(),
	});
};
