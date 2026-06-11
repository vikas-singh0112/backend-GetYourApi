export class ApiError extends Error {
	public statusCode: number;
	public success: boolean;
	public errors?: unknown;

	constructor({
		statusCode,
		message = "Something went wrong",
		errors,
	}: {
		statusCode: number;
		message?: string;
		errors?: unknown;
	}) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.success = false;
		this.errors = errors;

		Object.setPrototypeOf(this, ApiError.prototype);
	}
}
