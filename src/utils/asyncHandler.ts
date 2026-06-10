import { NextFunction, Request, Response, RequestHandler } from "express";

const asyncHandler = (
	reqHandler: (req: Request, res: Response, next: NextFunction) => any,
): RequestHandler => {
	return (req: Request, res: Response, next: NextFunction): void => {
		Promise.resolve(reqHandler(req, res, next)).catch((next));
	};
};

export default asyncHandler;
