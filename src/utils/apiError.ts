export class ApiError extends Error {
	public statusCode: number;
	public success: boolean;

	constructor(
		statusCode: number,
		message: string = "Something went wrong",
	) {
		super(message);
        this.statusCode = statusCode;
		this.success = false;
	}
}
