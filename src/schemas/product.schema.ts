import z from "zod";

export const getProductSchema = z.object({
	query: z.object({
		scope: z.enum(["global", "user"]).default("global"),

		limit: z.coerce
			.number("limit must be a valid number")
			.int("limit must be a whole number")
			.positive("Limit must be a positive number")
			.max(50, "limit cannot exceed 50 items per page")
			.default(20),

		page: z.coerce
			.number("page number must be a valid number")
			.int("page number must be a whole number")
			.positive("age number must be a positive number")
			.default(1),
	}),
});

export const findProductByIdSchema = z.object({
	params: z.object({
		productid: z
			.string("Id must be a hexadecimal string")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const findProductBySlugSchema = z.object({
	params: z.object({
		slug: z.string().min(1),
	}),
});

export const searchProductSchema = z.object({
	query: z.object({
		scope: z.enum(["global", "user"]).default("global"),

		limit: z.coerce
			.number("limit must be a valid number")
			.int("limit must be a whole number")
			.positive("limit must be a positive number")
			.max(50, "limit cannot exceed 50 items per page")
			.default(20),

		q: z
			.string({ message: "Search text must be a string" })
			.min(1, "Search text must be at least 1 letter"),

		page: z.coerce
			.number("page number must be a valid number")
			.int("page number must be a whole number")
			.positive("age number must be a positive number")
			.default(1),
	}),
});

export const createProductSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(1, "Name is required")
			.max(150, "Name cannot exceed 150 characters"),

		category: z
			.string()
			.min(1, "Category is required")
			.max(150, "Category cannot exceed 150 characters"),

		description: z
			.string()
			.min(1, "description is required")
			.max(1000, "description cannot exceed 1000 characters"),

		// Coerce string fields from form-data safely into numerical types
		price: z.coerce
			.number("Price must be a valid number")
			.int("Price must be an integer")
			.nonnegative("Price cannot be negative")
			.default(0),

		salePrice: z.coerce
			.number("Sale price must be a valid number")
			.int("Sale price must be an integer")
			.nonnegative("Sale price cannot be negative")
			.optional()
			.default(0),

		stock: z.coerce
			.number("Stock must be a valid number")
			.int("Stock must be an integer")
			.nonnegative("Stock cannot be negative")
			.default(0),

		images: z
			.array(
				z.object({
					url: z.string().url("Invalid image URL"),
					publicId: z.string().min(1, "Cloudinary asset public id is required"),
				}),
			)
			.min(1, "A product must have at least one image."),

		isActive: z
			.preprocess((val) => val === "true" || val === true, z.boolean())
			.optional()
			.default(true),
	}),
});

export const deleteProductSchema = z.object({
	query: z.object({
		id: z
			.string("Id is required to delete a product")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});
