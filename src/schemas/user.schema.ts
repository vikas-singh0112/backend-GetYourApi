import z from "zod";

export const getUserSchema = z.object({
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

export const findByIdSchema = z.object({
	query: z.object({
		id: z
			.string("Id must be a hexadecimal string")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const searchUserSchema = z.object({
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

export const createUserSchema = z.object({
	body: z.object({
		fullName: z.string().min(1, "Name is required").max(50),
		userName: z.string().min(1, "Username is required").max(50),
		email: z.email("Invalid email address").max(30),
		phoneNumber: z.string({ message: "Phone number is required" }),
		role: z.string().max(10),
		birthDate: z.coerce.date(),
		address: z.string().max(300),
		city: z.string().max(30),
		state: z.string().max(30),
		country: z.string().max(30),
		zipCode: z.string().max(6),
	}),
});

// export type CreateUserBody = z.infer<typeof createUserSchema>["body"];

export const deleteUserSchema = z.object({
	query: z.object({
		id: z
			.string("Id is required to delete a user")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});
