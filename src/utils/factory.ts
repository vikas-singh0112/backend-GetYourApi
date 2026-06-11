import { Model as mongooseModel, Types } from "mongoose";
import { ApiResponse } from "./apiResponse";
import { ApiError } from "./apiError";
import jwt from "jsonwebtoken";
import { verifyJwtSecret } from "../models/api.models/user.model";

type Props<T> = {
	Model: mongooseModel<T>;
	ModelName: string;
	SearchField: keyof T;
};

const factoryFun = <T>({ Model, ModelName, SearchField }: Props<T>) => {
	return {
		getData: async (limit: number, authHeader: string, scope: string) => {
			console.log("one");
			let query: Record<string, any> = {};

			if (scope === "user") {
				console.log("two");

				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					console.log("three");
					throw new ApiError({
						statusCode: 401,
						message: "Unauthorized: User scope requires a valid secret token",
					});
				}

				const token = authHeader.split(" ")[1];
				console.log("four");

				const id = await verifyJwtSecret(token as string);

				query.developerId = id;
			}
			console.log("five");

			const data = await Model.find(query)
				.limit(limit)
				.select("-isGlobal -developerId -__v");

			if (!data || data.length === 0) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName}s not found`,
				});
			}

			return ApiResponse({
				data,
				statusCode: 200,
				message: `${ModelName} fetched successfully`,
			});
		},

		findById: async (id: string) => {
			const data = await Model.findById(id);

			if (!data) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName} not found`,
				});
			}

			const response = ApiResponse({
				data: data,
				statusCode: 200,
				message: `${ModelName} fetched successfully`,
			});

			return response;
		},

		search: async (q: string, limit: number) => {
			const data = await Model.find({
				[SearchField]: {
					$regex: q,
					$options: "i",
				},
			}).limit(limit);

			if (!data || data.length === 0) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName} not found`,
				});
			}

			const response = ApiResponse({
				data: data,
				statusCode: 200,
				message: `${ModelName} search success`,
			});

			return response;
		},

		// fake delete for global data
		delete: async (id: string) => {
			const data = Model.findById(id);
			if (!data) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName} not found`,
				});
			}

			const response = ApiResponse({
				data: null,
				statusCode: 200,
				message: `${ModelName} with ID ${id} deleted successfully`,
			});

			return response;
		},
	};
};

export default factoryFun;
