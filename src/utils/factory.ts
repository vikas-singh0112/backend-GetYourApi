import { Model as mongooseModel } from "mongoose";
import { ApiResponse } from "./apiResponse";
import { ApiError } from "./apiError";

type Props<T> = {
	Model: mongooseModel<T>;
	ModelName: string;
};

const factoryFun = <T>({ Model, ModelName }: Props<T>) => {
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
	};
};

export default factoryFun;
