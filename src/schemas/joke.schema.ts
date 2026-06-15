import z from "zod";

export const getJokeSchema = z.object({
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

export const findJokeByIdSchema = z.object({
	params: z.object({
		jokeid: z
			.string("Id must be a hexadecimal string")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const findJokeBySlugSchema = z.object({
	params: z.object({
		slug: z.string().min(1),
	}),
});
export const findJokeByCategorySchema = z.object({
	query: z.object({
		scope: z.enum(["global", "user"]).default("global"),

		limit: z.coerce
			.number("limit must be a valid number")
			.int("limit must be a whole number")
			.positive("limit must be a positive number")
			.max(50, "limit cannot exceed 50 items per page")
			.default(20),

		page: z.coerce
			.number("page number must be a valid number")
			.int("page number must be a whole number")
			.positive("age number must be a positive number")
			.default(1),
	}),
	params: z.object({
		category: z
			.string({ message: "Category text must be a string" })
			.min(1, "Category text must be at least 1 letter"),
	}),
});

export const searchJokeSchema = z.object({
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

export const createJokeSchema = z.object({
	body: z.object({
		setup: z
			.string()
			.min(1, "Joke setup is required")
			.max(200, "Joke setup cannot exceed 200 characters")
			.toLowerCase()
			.trim(),

		punchline: z
			.string()
			.min(1, "punchline is required")
			.max(200, "punchline cannot exceed 200 characters")
			.toLowerCase()
			.trim(),

		category: z
			.string()
			.min(1, "category is required")
			.max(50, "category cannot exceed 50 characters")
			.toLowerCase()
			.trim(),
	}),
});

export const deleteJokeSchema = z.object({
	query: z.object({
		id: z
			.string("Id is required to delete a product")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});
