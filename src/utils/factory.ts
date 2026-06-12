import { Model as mongooseModel, Types } from "mongoose";
import { ApiResponse } from "./apiResponse";
import { ApiError } from "./apiError";
import { verifyJwtSecret } from "../models/api.models/user.model";

type Props<T> = {
	Model: mongooseModel<T>;
	ModelName: string;
	SearchField: keyof T;
};

const factoryFun = <T>({ Model, ModelName, SearchField }: Props<T>) => {
	return {
		getData: async (limit: number, authHeader: string, scope: string) => {
			let developerId: Types.ObjectId | null = null;

			if (scope === "user") {
				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					throw new ApiError({
						statusCode: 401,
						message: "Unauthorized: User scope requires a valid secret token",
					});
				}

				const token = authHeader.split(" ")[1];

				developerId = await verifyJwtSecret(token as string);
			}

			const data = await Model.find({
				developerId,
			})
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
			const data = await Model.findById(id).select(
				"-isGlobal -developerId -__v",
			);

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

		search: async (
			limit: number,
			authHeader: string,
			scope: string,
			q: string,
		) => {
			let developerId: Types.ObjectId | null = null;
			if (scope === "user") {
				if (!authHeader || !authHeader.startsWith("Bearer ")) {
					throw new ApiError({
						statusCode: 401,
						message: "Unauthorized: User scope requires a valid secret token",
					});
				}

				const token = authHeader.split(" ")[1];

				developerId = await verifyJwtSecret(token as string);
			}

			const data = await Model.find({
				developerId,
				[SearchField]: {
					$regex: q,
					$options: "i",
				},
			})
				.limit(limit)
				.select("-isGlobal -developerId -__v");

			if (!data || data.length === 0) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName} not found`,
				});
			}

			const response = ApiResponse({
				data: data,
				statusCode: 200,
				message: `${ModelName}s search success`,
			});

			return response;
		},

		delete: async (authHeader: string, id: string) => {
			const data = await Model.findById(id);
			if (!data) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName} not found`,
				});
			}
			if (authHeader && authHeader.startsWith("Bearer ")) {
				const token = authHeader.split(" ")[1];

				const developerId = await verifyJwtSecret(token as string);

				if (data.developerId.equals(developerId)) {
					await Model.findByIdAndDelete(id);
				}
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
