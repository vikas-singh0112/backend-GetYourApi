import z from "zod";

export const getTodoSchema = z.object({
	query: z.object({
		limit: z.coerce
			.number("Limit must be a valid number")
			.int("Limit must be a whole number")
			.positive("Limit must be a positive number")
			.max(100, "Limit cannot exceed 100 items per page")
			.default(10),
		scope: z.enum(["global", "user"]).default("global"),
	}),
});

export const findTodoByIdSchema = z.object({
	query: z.object({
		id: z
			.string("Id must be a hexadecimal string")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const searchTodoSchema = z.object({
	query: z.object({
		limit: z.coerce
			.number({ message: "Limit must be a valid number" })
			.int("Limit must be a whole number")
			.positive("Limit must be a positive number")
			.max(100, "Limit cannot exceed 100 items per page")
			.default(10),

		q: z
			.string({ message: "Search text must be a string" })
			.min(1, "Search text must be at least 1 letter"),
		scope: z.enum(["global", "user"]).default("global"),
	}),
});

export const deleteTodoSchema = z.object({
	query: z.object({
		id: z
			.string("Id is required to delete a user")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const createTodoSchema = z.object({
	body: z.object({
		title: z.string().min(1, "title is required").max(50),
		content: z.string().min(1, "content is required").max(1000),
	}),
});
