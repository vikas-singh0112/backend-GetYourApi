import { Model as mongooseModel } from "mongoose";
import { ApiResponse } from "./apiResponse";
import { ApiError } from "./apiError";
import { CreateUserBody } from "../schemas/user.schema";

type Props<T> = {
	Model: mongooseModel<T>;
	ModelName: string;
	SearchField: keyof T;
};

const factoryFun = <T>({ Model, ModelName, SearchField }: Props<T>) => {
	return {
		getData: async (limit: number) => {
			const data = await Model.find({}).limit(limit);
			console.log(data);

			if (!data || data.length === 0) {
				throw new ApiError(404, `${ModelName}  not found`);
			}

			const response = ApiResponse({
				data: data,
				statusCode: 200,
				message: `${ModelName} fetched successfully`,
			});

			return response;
		},

		findById: async (id: string) => {
			const data = await Model.findById(id);

			if (!data) {
				throw new ApiError(404, `${ModelName} not found`);
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
				throw new ApiError(404, `${ModelName} not found`);
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
				throw new ApiError(404, `${ModelName} not found`);
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
