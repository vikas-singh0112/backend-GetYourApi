import z from "zod";

export const getUserSchema = z.object({
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
});

export const findUserByIdSchema = z.object({
	params: z.object({
		userid: z
			.string("Id must be a hexadecimal string")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});

export const findUserBySlugSchema = z.object({
	params: z.object({
		slug: z.string().min(1),
	}),
});

export const searchUserSchema = z.object({
	query: z.object({
		scope: z.enum(["global", "user"]).default("global"),

		limit: z.coerce
			.number({ message: "limit must be a valid number" })
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

export const createUserSchema = z.object({
	body: z.object({
		fullName: z
			.string()
			.min(1, "Name is required")
			.max(50, "Name cannot exceed 50 characters")
			.toLowerCase()
			.trim(),

		userName: z
			.string()
			.min(1, "Username is required")
			.max(50, "username cannot exceed 50 characters")
			.toLowerCase()
			.trim(),

		email: z
			.email("Invalid email address")
			.max(100, "email cannot exceed 100 characters")
			.toLowerCase()
			.trim(),

		phoneNumber: z
			.string("Phone number is required")
			.min(7, "phone no cannot be less than 7 numbers")
			.max(13, "phone no cannot exceed 13 numbers")
			.trim(),

		role: z
			.string()
			.min(4, "role is required")
			.max(20, "role cannot exceed 20characters")
			.toLowerCase()
			.trim(),

		birthDate: z.coerce.date(),

		address: z
			.string("address is required")
			.min(10, "address cannot be less than 10 characters")
			.max(300)
			.toLowerCase()
			.trim(),

		city: z
			.string()
			.min(1, "city is required")
			.max(50, "city cannot exceed 50 characters")
			.toLowerCase()
			.trim(),

		state: z
			.string()
			.min(1, "state is required")
			.max(50, "state cannot exceed 50 characters")
			.toLowerCase()
			.trim(),

		country: z
			.string()
			.min(1, "country is required")
			.max(50, "country cannot exceed 50 characters")
			.toLowerCase()
			.trim(),

		zipCode: z
			.string()
			.min(4, "zip code is required")
			.max(8, "cannot exceed 8 characters")
			.trim(),
	}),
});

export const deleteUserSchema = z.object({
	query: z.object({
		id: z
			.string("Id is required to delete a user")
			.min(24, "Id must be 24 long hexadecimal string"),
	}),
});
