import Joke from "../models/api.models/joke.model.js";
import factoryFun from "../utils/factory.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyJwtSecret } from "../models/api.models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
	createJokeSchema,
	deleteJokeSchema,
	findJokeByCategorySchema,
	findJokeByIdSchema,
	findJokeBySlugSchema,
	getJokeSchema,
	searchJokeSchema,
} from "../schemas/joke.schema.js";


const jokeService = factoryFun({
	Model: Joke,
	ModelName: "Joke",
	SearchField: "slug",
	Category: "category",
});

export const getJokes = asyncHandler(async (req, res) => {
	const { limit, scope, page } = getJokeSchema.shape.query.parse(req.query);
	const authHeader = req.headers.authorization;

	const data = await jokeService.getData(
		limit,
		authHeader as string,
		scope,
		page,
	);

	return res.status(200).json(data);
});

export const findJokeById = asyncHandler(async (req, res) => {
	const { jokeid } = findJokeByIdSchema.shape.params.parse(req.params);

	const data = await jokeService.findById(jokeid);

	return res.status(200).json(data);
});

export const findJokeBySlug = asyncHandler(async (req, res) => {
	const { slug } = findJokeBySlugSchema.shape.params.parse(req.params);

	const data = await jokeService.findBySlug(slug);

	return res.status(200).json(data);
});
export const findJokeByCategory = asyncHandler(async (req, res) => {
	const { limit, page, scope } = findJokeByCategorySchema.shape.query.parse(
		req.query,
	);
	const { category } = findJokeByCategorySchema.shape.params.parse(req.params);

	const authHeader = req.headers.authorization;

	const data = await jokeService.findByCategory!(
		limit,
		authHeader as string,
		scope,
		category,
		page,
	);

	return res.status(200).json(data);
});

export const searchJoke = asyncHandler(async (req, res) => {
	const { q, limit, scope, page } = searchJokeSchema.shape.query.parse(
		req.query,
	);
	const authHeader = req.headers.authorization;

	const data = await jokeService.search(
		limit,
		authHeader as string,
		scope,
		q,
		page,
	);

	return res.status(200).json(data);
});

export const deleteJoke = asyncHandler(async (req, res) => {
	const { id } = deleteJokeSchema.shape.query.parse(req.query);

	const authHeader = req.headers.authorization;
	const data = await jokeService.delete(authHeader as string, id);

	return res.status(200).json(data);
});

export const createJoke = asyncHandler(async (req, res) => {
	const authHeader = req.headers.authorization;
	const jokeData = createJokeSchema.shape.body.parse(req.body);

	if (authHeader && authHeader.startsWith("Bearer ")) {
		const token = authHeader.split(" ")[1];
		const id = await verifyJwtSecret(token as string);
		if (!id) {
			throw new ApiError({
				statusCode: 401,
				message: "Unauthorized: Invalid or missing token",
			});
		}
		const alreadyCreated = await Joke.find({
			developerId: id,
		});

		if (alreadyCreated.length >= 10) {
			throw new ApiError({
				statusCode: 400,
				message: "already created 10 users ",
			});
		}

		const newJoke = await Joke.create({
			...jokeData,
			developerId: id,
			isGlobal: false,
		});

		const jokeObject = newJoke.toObject();
		const { developerId, isGlobal, __v, ...safeData } = jokeObject;

		const data = ApiResponse({
			data: safeData,
			statusCode: 201,
			message: "joke created successfully",
		});

		return res.status(201).json(data);
	}

	// fake response and send the joke data
	const data = ApiResponse({
		data: jokeData,
		statusCode: 201,
		message:
			"joke created, its a mock response for actually creating joke signin and copy the secret token and send the token as authorization header along with data",
	});

	return res.status(201).json(data);
});
