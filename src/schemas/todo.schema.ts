import z from "zod";

export const getTodoSchema = z.object({
	query: z.object({
		limit: z.coerce.number().int().positive().max(50).default(20),
		scope: z.enum(["global", "user"]).default("global"),
		page: z.coerce.number().int().positive().default(1),
	}),
});

export const findTodoByIdSchema = z.object({
	query: z.object({
		id: z
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
		limit: z.coerce.number().int().positive().max(50).default(20),
		q: z
			.string({ message: "Search text must be a string" })
			.min(1, "Search text must be at least 1 letter"),
		scope: z.enum(["global", "user"]).default("global"),
		page: z.coerce.number().int().positive().default(1),
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
		title: z.string().min(1, "title is required").max(50),
		content: z.string().min(1, "content is required").max(1000),
	}),
});
