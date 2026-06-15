import mongoose, { Document, model, Model, Schema, Types } from "mongoose";
import jwt from "jsonwebtoken";
import { ApiError } from "../../utils/apiError.js";
import crypto from "crypto";

export interface IUser extends Document {
	fullName: string;
	userName: string;
	slug: string;
	email: string;
	phoneNumber: string;
	role: string;
	birthDate: Date;
	address: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
	isGlobal: boolean;
	developerId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const userSchema = new Schema<IUser>(
	{
		fullName: {
			type: String,
			required: [true, "name is required"],
			trim: true,
			lowercase: true,
			maxlength: [50, "name cannot exceed 50 characters"],
		},
		userName: {
			type: String,
			required: [true, "username is required"],
			unique: true,
			trim: true,
			lowercase: true,
			maxlength: [50, "username cannot exceed 50 characters"],
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},

		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			maxlength: [100, "Email cannot exceed 100 characters"],
			match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
		},
		phoneNumber: {
			type: String,
			required: [true, "phone no is required"],
			maxlength: [20, "Phone number cannot exceed 20 numbers"],
		},
		role: {
			type: String,
			required: [true, "role is required"],
			lowercase: true,
			maxlength: [10, "Role cannot exceed 10 characters"],
		},
		birthDate: {
			type: Date,
			required: [true, "Birth date is required"],
		},
		address: {
			type: String,
			required: [true, "Address is required"],
			lowercase: true,
			maxlength: 300,
		},
		city: {
			type: String,
			required: [true, "City is required"],
			maxlength: [100, "City cannot exceed 100 characters"],
			lowercase: true,
		},
		state: {
			type: String,
			required: [true, "State is required"],
			maxlength: [100, "State cannot exceed 100 characters"],
			lowercase: true,
		},
		country: {
			type: String,
			required: [true, "Country is required"],
			maxlength: [100, "Country cannot exceed 100 characters"],
			lowercase: true,
		},
		zipCode: {
			type: String,
			required: [true, "Zip code is required"],
			maxlength: [6, "Zip code cannot exceed 6 characters"],
		},
		isGlobal: {
			type: Boolean,
			default: true,
			required: true,
		},
		developerId: {
			type: Schema.Types.ObjectId,
			ref: "Consumer",
			required: true,
			default: null,
		},
	},
	{ timestamps: true },
);



userSchema.pre("save", async function () {
	if (!this.isModified("fullName")) return;

	let generatedSlug = this.fullName
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

	const shortHash = crypto.randomBytes(3).toString("hex");
	this.slug = `${generatedSlug}-${shortHash}`;
});

const User: Model<IUser> =
	mongoose.models.User || model<IUser>("User", userSchema);
export default User;

// jwt for developerId
export const verifyJwtSecret = async (token: string) => {
	if (!token || token.trim() === "") {
		return null;
	}

	try {
		const decoded = jwt.verify(token, process.env.SECRET_TOKEN as string) as {
			id: string;
		};

		return new Types.ObjectId(decoded.id);
	} catch (error) {
		throw new ApiError({
			statusCode: 401,
			message: "Unauthorized: Invalid or expired token",
		});
	}
};
