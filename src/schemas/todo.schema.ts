import z from "zod";

export const getTodoSchema = z.object({
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

export const findTodoByIdSchema = z.object({
	params: z.object({
		todoid: z
			.string("Id must be a hexadecimal string")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const findTodoBySlugSchema = z.object({
	params: z.object({
		slug: z.string().min(1),
	}),
});

export const searchTodoSchema = z.object({
	query: z.object({
		scope: z.enum(["global", "user"]).default("global"),

		limit: z.coerce
			.number("limit must be a valid number")
			.int("limit must be a whole number")
			.positive("Limit must be a positive number")
			.max(50, "limit cannot exceed 50 items per page")
			.default(20),

		q: z
			.string()
			.min(1, "Search text must be at least 1 letter"),

		page: z.coerce
			.number("page number must be a valid number")
			.int("page number must be a whole number")
			.positive("age number must be a positive number")
			.default(1),
	}),
});

export const deleteTodoSchema = z.object({
	query: z.object({
		id: z
			.string("Id is required to delete a todo")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const createTodoSchema = z.object({
	body: z.object({
		title: z
			.string()
			.min(1, "title is required")
			.max(100, "title cannot exceed 100 characters")
			.toLowerCase()
			.trim(),

		content: z
			.string()
			.min(1, "content is required")
			.max(1000, "content cannot exceed 100 characters")
			.toLowerCase()
			.trim(),
	}),
});
