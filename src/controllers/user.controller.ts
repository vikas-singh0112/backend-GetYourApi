import User from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import factoryFun from "../utils/factory";

const userService = factoryFun({
	Model: User,
	ModelName: "User",
});

export const getUsers = asyncHandler(async (req, res) => {
	let limit = Number(req.query.limit) || 20;

	const data = await userService.getData(limit);

	return res.status(200).json(data);
});
