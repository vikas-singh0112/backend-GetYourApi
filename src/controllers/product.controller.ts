import fs from "fs";
import { parseMultipartData } from "../config/multer.config";
import Product from "../models/api.models/product.model";
import { verifyJwtSecret } from "../models/api.models/user.model";
import {
	createProductSchema,
	deleteProductSchema,
	findProductByCategorySchema,
	findProductByIdSchema,
	findProductBySlugSchema,
	getProductSchema,
	searchProductSchema,
} from "../schemas/product.schema";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import asyncHandler from "../utils/asyncHandler";
import { uploadToCloudinary } from "../utils/cloudinary";
import factoryFun from "../utils/factory";

const productService = factoryFun({
	Model: Product,
	ModelName: "Product",
	SearchField: "slug",
	Category: "category",
});

export const getProducts = asyncHandler(async (req, res) => {
	const { limit, scope, page } = getProductSchema.shape.query.parse(req.query);
	const authHeader = req.headers.authorization;

	const data = await productService.getData(
		limit,
		authHeader as string,
		scope,
		page,
	);

	return res.status(200).json(data);
});

export const findProductById = asyncHandler(async (req, res) => {
	const { productid } = findProductByIdSchema.shape.params.parse(req.params);

	const data = await productService.findById(productid);

	return res.status(200).json(data);
});

export const findProductBySlug = asyncHandler(async (req, res) => {
	const { slug } = findProductBySlugSchema.shape.params.parse(req.params);

	const data = await productService.findBySlug(slug);

	return res.status(200).json(data);
});
export const findProductByCategory = asyncHandler(async (req, res) => {
	const { limit, page, scope } = findProductByCategorySchema.shape.query.parse(
		req.query,
	);
	const { category } = findProductByCategorySchema.shape.params.parse(
		req.params,
	);
	const authHeader = req.headers.authorization;

	const data = await productService.findByCategory!(
		limit,
		authHeader as string,
		scope,
		category,
		page,
	);

	return res.status(200).json(data);
});

export const searchProduct = asyncHandler(async (req, res) => {
	const { q, limit, scope, page } = searchProductSchema.shape.query.parse(
		req.query,
	);
	const authHeader = req.headers.authorization;

	const data = await productService.search(
		limit,
		authHeader as string,
		scope,
		q,
		page,
	);

	return res.status(200).json(data);
});

export const deleteProduct = asyncHandler(async (req, res) => {
	const { id } = deleteProductSchema.shape.query.parse(req.query);

	const authHeader = req.headers.authorization;
	const data = await productService.delete(authHeader as string, id);

	return res.status(200).json(data);
});

export const createProduct = asyncHandler(async (req, res) => {
	const contentType = req.headers["content-type"] || "";

	if (contentType.includes("multipart/form-data")) {
		try {
			await parseMultipartData(req, res);
		} catch (multerError) {
			throw new ApiError({
				statusCode: 400,
				message: "Failed parsing multi-part form data files.",
			});
		}
	}
	const files = (req.files as Express.Multer.File[]) || [];

	const authHeader = req.headers.authorization;

	if (authHeader && authHeader.startsWith("Bearer ")) {
		try {
			const token = authHeader.split(" ")[1];
			const id = await verifyJwtSecret(token as string);
			if (!id) {
				throw new ApiError({
					statusCode: 401,
					message: "Unauthorized: Invalid or missing token",
				});
			}
			const alreadyCreated = await Product.find({
				developerId: id,
			});

			if (alreadyCreated.length >= 10) {
				throw new ApiError({
					statusCode: 400,
					message: "already created 10 users ",
				});
			}

			const uploadedImages = [];

			if (files && files.length > 0) {
				for (const file of files) {
					const uploadResult = await uploadToCloudinary(
						file.path,
						`products/${id}`,
					);

					if (uploadResult) {
						uploadedImages.push({
							url: uploadResult.url,
							publicId: uploadResult.publicId,
						});
					}
				}
			}

			const rawData = {
				...req.body,
				images: uploadedImages,
			};

			const productData = createProductSchema.shape.body.parse(rawData);

			const newProduct = await Product.create({
				...productData,
				developerId: id,
				isGlobal: false,
			});

			const productObject = newProduct.toObject();
			const { developerId, isGlobal, __v, ...safeData } = productObject;

			const data = ApiResponse({
				data: safeData,
				statusCode: 201,
				message: "product created successfully",
			});

			return res.status(201).json(data);
		} catch (error) {
			for (const file of files) {
				if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
			}
			throw error;
		}
	}

	// fake response and send the product data
	if (files.length > 0) {
		req.body.images = files.map(() => ({
			url: "https://example.com/mock-placeholder-image.png",
			publicId: "123example-id",
		}));

		for (const file of files) {
			if (fs.existsSync(file.path)) {
				fs.unlinkSync(file.path);
			}
		}
	}
	const productData = createProductSchema.shape.body.parse(req.body);
	const data = ApiResponse({
		data: productData,
		statusCode: 201,
		message:
			"product created, its a mock response for actually creating product signin and copy the secret token and send the token as authorization header along with data",
	});

	return res.status(201).json(data);
});
