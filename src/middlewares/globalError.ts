import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const globalErrorHandler = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction,
): any => {
	// Check if the error came from Zod validation
	if (error instanceof ZodError) {
		return res.status(400).json({
			status: "fail",
			message: "Validation Error",
			errors: error.issues.map((issue) => ({
				field: issue.path.join(".").replace(/^(body|query|params)\./, ""),
				message: issue.message,
			})),
		});
	}

	console.error("Unhandled Error:", error);
	return res.status(500).json({
		status: "error",
		message: "Something went completely wrong on our end.",
	});
};
