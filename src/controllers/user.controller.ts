import User from "../models/api.models/user.model";
import {
	createUserSchema,
	deleteUserSchema,
	findByIdSchema,
	getUserSchema,
	searchUserSchema,
} from "../schemas/user.schema";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import factoryFun from "../utils/factory";

const userService = factoryFun({
	Model: User,
	ModelName: "User",
	SearchField: "fullName",
});

export const getUsers = asyncHandler(async (req, res) => {
	const { limit } = getUserSchema.shape.query.parse(req.query);

	const data = await userService.getData(limit);

	return res.status(200).json(data);
});

export const findUsersById = asyncHandler(async (req, res) => {
	const { id } = findByIdSchema.shape.query.parse(req.query);

	const data = await userService.findById(id);

	return res.status(200).json(data);
});

export const searchUser = asyncHandler(async (req, res) => {
	const { q, limit } = searchUserSchema.shape.query.parse(req.query);

	const data = await userService.search(q, limit);

	return res.status(200).json(data);
});

export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = deleteUserSchema.shape.query.parse(req.query);

	const data = await userService.delete(id);

	return res.status(200).json(data);
});

export const createUser = asyncHandler(async (req, res) => {
	const userData = createUserSchema.shape.body.parse(req.body);

	const existingUser = await User.findOne({
		$or: [{ email: userData.email }, { userName: userData.userName }],
	});

	if (existingUser) {
		if (existingUser.email === userData.email) {
			throw new ApiError(400, "A user with this email already exists");
		}
		if (existingUser.userName === userData.userName) {
			throw new ApiError(400, "This username is already taken");
		}
	}

	// if not existing user create a fake response and send the user data
	const data = ApiResponse({
		data: userData,
		statusCode: 201,
		message: "user created successfully",
	});

	return res.status(201).json(data);
});
