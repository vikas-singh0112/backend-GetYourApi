import { Model as mongooseModel, Types } from "mongoose";
import { ApiResponse } from "./apiResponse";
import { ApiError } from "./apiError";
import { verifyJwtSecret } from "../models/api.models/user.model";
import { v2 as cloudinary } from "cloudinary";

type Props<T> = {
	Model: mongooseModel<T>;
	ModelName: string;
	SearchField: keyof T;
	Category?: keyof T;
};

type DeleteProps = {
	images: [{ url: string; publicId: string }];
	developerId: Types.ObjectId;
};

const factoryFun = <T>({
	Model,
	ModelName,
	SearchField,
	Category,
}: Props<T>) => {
	return {
		getData: async (
			limit: number,
			authHeader: string,
			scope: string,
			page: number,
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

			const skip = (page - 1) * limit;

			const [data, totalItems] = await Promise.all([
				Model.find({
					developerId,
				})
					.skip(skip)
					.limit(limit)
					.select("-isGlobal -developerId -__v"),
				Model.countDocuments({ developerId }),
			]);

			if (!data || data.length === 0) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName}s not found`,
				});
			}

			const totalPages = Math.ceil(totalItems / limit);
			const hasNextPage = page < totalPages;
			const hasPrevPage = page > 1;

			return ApiResponse({
				data: {
					[`${ModelName.toLowerCase()}s`]: data,
					pagination: {
						totalItems,
						totalPages,
						currentPage: page,
						limit,
						hasNextPage,
						hasPrevPage,
						nextPage: hasNextPage ? page + 1 : null,
						prevPage: hasPrevPage ? page - 1 : null,
					},
				},
				statusCode: 200,
				message: `${ModelName}s fetched successfully`,
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

		findBySlug: async (slug: string) => {
			const data = await Model.findOne({ slug: slug }).select(
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

		...(Category && {
			findByCategory: async (
				limit: number,
				authHeader: string,
				scope: string,
				category: string,
				page: number,
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

				// pagination
				const skip = (page - 1) * limit;

				const sanitizedQuery = category.replace(" ", "-");

				const filter = {
					developerId,
					[Category]: {
						$regex: sanitizedQuery,
						$options: "i",
					},
				};

				const [data, totalItems] = await Promise.all([
					Model.find(filter)
						.skip(skip)
						.limit(limit)
						.select("-isGlobal -developerId -__v"),

					Model.countDocuments(filter),
				]);

				if (!data || data.length === 0) {
					throw new ApiError({
						statusCode: 404,
						message: `${ModelName} not found`,
					});
				}

				const totalPages = Math.ceil(totalItems / limit);
				const hasNextPage = page < totalPages;
				const hasPrevPage = page > 1;

				const response = ApiResponse({
					data: {
						[`${ModelName.toLowerCase()}s`]: data,
						pagination: {
							totalItems,
							totalPages,
							currentPage: page,
							limit,
							hasNextPage,
							hasPrevPage,
							nextPage: hasNextPage ? page + 1 : null,
							prevPage: hasPrevPage ? page - 1 : null,
						},
					},
					statusCode: 200,
					message: `${ModelName}s search success`,
				});

				return response;
			},
		}),

		search: async (
			limit: number,
			authHeader: string,
			scope: string,
			q: string,
			page: number,
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

			// pagination
			const skip = (page - 1) * limit;

			const sanitizedQuery = q.replace(" ", "-");

			const filter = {
				developerId,
				[SearchField]: {
					$regex: sanitizedQuery,
					$options: "i",
				},
			};

			const [data, totalItems] = await Promise.all([
				Model.find(filter)
					.skip(skip)
					.limit(limit)
					.select("-isGlobal -developerId -__v"),

				Model.countDocuments(filter),
			]);

			if (!data || data.length === 0) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName} not found`,
				});
			}

			const totalPages = Math.ceil(totalItems / limit);
			const hasNextPage = page < totalPages;
			const hasPrevPage = page > 1;

			const response = ApiResponse({
				data: {
					[`${ModelName.toLowerCase()}s`]: data,
					pagination: {
						totalItems,
						totalPages,
						currentPage: page,
						limit,
						hasNextPage,
						hasPrevPage,
						nextPage: hasNextPage ? page + 1 : null,
						prevPage: hasPrevPage ? page - 1 : null,
					},
				},
				statusCode: 200,
				message: `${ModelName}s search success`,
			});

			return response;
		},

		delete: async (authHeader: string, id: string) => {
			const data: DeleteProps | null = await Model.findById(id);
			if (!data) {
				throw new ApiError({
					statusCode: 404,
					message: `${ModelName} not found`,
				});
			}

			if (authHeader && authHeader.startsWith("Bearer ")) {
				const token = authHeader.split(" ")[1];

				const developerId = await verifyJwtSecret(token as string);


				const publicIdsToDelete: string[] = [];

				if (data.images) {
					if (data.images && Array.isArray(data.images)) {
						data.images.forEach((img: any) => {
							if (img.publicId) publicIdsToDelete.push(img.publicId);
						});
					}
				}


				// .only delete if data.developer is equal to developer id from auth header
				if (data.developerId.equals(developerId)) {
					// Batch delete the images from Cloudinary
					if (publicIdsToDelete.length > 0) {
						console.log(
							` -> Removing ${publicIdsToDelete.length} images from Cloudinary...`,
						);
						await cloudinary.api.delete_resources(publicIdsToDelete);
					}
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
