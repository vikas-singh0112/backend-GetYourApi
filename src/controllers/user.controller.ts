import User, { verifyJwtSecret } from "../models/api.models/user.model";
import {
	createUserSchema,
	deleteUserSchema,
	findUserByIdSchema,
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
	const { limit, scope } = getUserSchema.shape.query.parse(req.query);
	const authHeader = req.headers.authorization;

	const data = await userService.getData(limit, authHeader as string, scope);

	return res.status(200).json(data);
});

export const findUsersById = asyncHandler(async (req, res) => {
	const { id } = findUserByIdSchema.shape.query.parse(req.query);

	const data = await userService.findById(id);

	return res.status(200).json(data);
});

export const searchUser = asyncHandler(async (req, res) => {
	const { q, limit, scope } = searchUserSchema.shape.query.parse(req.query);
	const authHeader = req.headers.authorization;

	const data = await userService.search(limit, authHeader as string, scope, q);

	return res.status(200).json(data);
});

export const deleteUser = asyncHandler(async (req, res) => {
	const { id } = deleteUserSchema.shape.query.parse(req.query);

	const authHeader = req.headers.authorization;
	const data = await userService.delete(authHeader as string, id);

	return res.status(200).json(data);
});

export const createUser = asyncHandler(async (req, res) => {
	const userData = createUserSchema.shape.body.parse(req.body);
	const authHeader = req.headers.authorization;

	const existingUser = await User.findOne({
		$or: [{ email: userData.email }, { userName: userData.userName }],
	});

	if (existingUser) {
		if (existingUser.email === userData.email) {
			throw new ApiError({
				statusCode: 400,
				message: "A user with this email already exists",
			});
		}
		if (existingUser.userName === userData.userName) {
			throw new ApiError({
				statusCode: 400,
				message: "This username is already taken",
			});
		}
	}

	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.split(" ")[1];
		const id = await verifyJwtSecret(token as string);
		if (!id) {
			throw new ApiError({
				statusCode: 401,
				message: "Unauthorized: Invalid or missing token",
			});
		}
		const alreadyCreated = await User.find({
			developerId: id,
		});

		if (alreadyCreated.length >= 10) {
			throw new ApiError({
				statusCode: 400,
				message: "already created 10 users ",
			});
		}

		const newUser = await User.create({
			...userData,
			developerId: id,
			isGlobal: false,
		});

		const userObject = newUser.toObject();
		const { developerId, isGlobal, __v, ...safeData } = userObject;

		const data = ApiResponse({
			data: safeData,
			statusCode: 201,
			message: "user created successfully",
		});

		return res.status(201).json(data);
	}

	// fake response and send the user data
	const data = ApiResponse({
		data: userData,
		statusCode: 201,
		message:
			"user created, its a mock response for actually creating user signin and copy the secret token and send the token as authorization header along with data",
	});

	return res.status(201).json(data);
});
