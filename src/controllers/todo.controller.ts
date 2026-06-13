import Todo from "../models/api.models/todo.model";
import { verifyJwtSecret } from "../models/api.models/user.model";
import {
	createTodoSchema,
	deleteTodoSchema,
	findTodoByIdSchema,
	findTodoBySlugSchema,
	getTodoSchema,
	searchTodoSchema,
} from "../schemas/todo.schema";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import factoryFun from "../utils/factory";

const todoService = factoryFun({
	Model: Todo,
	ModelName: "Todo",
	SearchField: "slug",
});

export const getTodos = asyncHandler(async (req, res) => {
	const { limit, scope, page } = getTodoSchema.shape.query.parse(req.query);
	const authHeader = req.headers.authorization;

	const data = await todoService.getData(
		limit,
		authHeader as string,
		scope,
		page,
	);

	return res.status(200).json(data);
});

export const findTodoById = asyncHandler(async (req, res) => {
	const { id } = findTodoByIdSchema.shape.query.parse(req.query);

	const data = await todoService.findById(id);

	return res.status(200).json(data);
});

export const findTodoBySlug = asyncHandler(async (req, res) => {
	const { slug } = findTodoBySlugSchema.shape.params.parse(req.params);

	const data = await todoService.findBySlug(slug);

	return res.status(200).json(data);
});

export const searchTodo = asyncHandler(async (req, res) => {
	const { q, limit, scope, page } = searchTodoSchema.shape.query.parse(
		req.query,
	);
	const authHeader = req.headers.authorization;

	const data = await todoService.search(
		limit,
		authHeader as string,
		scope,
		q,
		page,
	);

	return res.status(200).json(data);
});

export const deleteTodo = asyncHandler(async (req, res) => {
	const { id } = deleteTodoSchema.shape.query.parse(req.query);

	const authHeader = req.headers.authorization;
	const data = await todoService.delete(authHeader as string, id);

	return res.status(200).json(data);
});

export const createTodo = asyncHandler(async (req, res) => {
	const todoData = createTodoSchema.shape.body.parse(req.body);
	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.split(" ")[1];
		const id = await verifyJwtSecret(token as string);
		if (!id) {
			throw new ApiError({
				statusCode: 401,
				message: "Unauthorized: Invalid or missing token",
			});
		}
		const alreadyCreated = await Todo.find({
			developerId: id,
		});

		if (alreadyCreated.length >= 10) {
			throw new ApiError({
				statusCode: 400,
				message: "already created 10 users ",
			});
		}

		const newTodo = await Todo.create({
			...todoData,
			developerId: id,
			isGlobal: false,
		});

		const todoObject = newTodo.toObject();
		const { developerId, isGlobal, __v, ...safeData } = todoObject;

		const data = ApiResponse({
			data: safeData,
			statusCode: 201,
			message: "todo created successfully",
		});

		return res.status(201).json(data);
	}

	// fake response and send the user data
	const data = ApiResponse({
		data: todoData,
		statusCode: 201,
		message:
			"todo created, its a mock response for actually creating a todo signin and copy the secret token and send the token as authorization header along with data",
	});

	return res.status(201).json(data);
});
