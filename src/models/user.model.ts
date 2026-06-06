import mongoose, { Document, model, Model,  Schema } from "mongoose";

export interface IUser extends Document {
	fullName: string;
	userName: string;
	email: string;
	phoneNumber: Number;
	role: string;
	birthDate: Date;
	address: string;
	city: string;
	state: string;
	country: string;
	zipCode: string;
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
			maxlength: [50, "full name cannot exceed 50 characters"],
			index: true,
		},
		userName: {
			type: String,
			required: [true, "username is required"],
			trim: true,
			lowercase: true,
			maxlength: [50, "username cannot exceed 50 characters"],
			index: true,
		},

		email: {
			type: String,
			required: [true, "email is required"],
			unique: true,
			trim: true,
			lowercase: true,
			maxlength: [30, "Email cannot exceed 30 characters"],
			match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
		},
		phoneNumber: {
			type: Number,
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
			maxlength: [30, "City cannot exceed 30 characters"],
		},
		state: {
			type: String,
			required: [true, "State is required"],
			maxlength: [30, "State cannot exceed 30 characters"],
		},
		country: {
			type: String,
			required: [true, "Country is required"],
			maxlength: [30, "Country cannot exceed 30 characters"],
		},
		zipCode: {
			type: String,
			required: [true, "Zip code is required"],
			maxlength: [6, "Zip code cannot exceed 6 characters"],
		},
	},
	{ timestamps: true },
);

const User: Model<IUser> = mongoose.models.User || model<IUser>("User", userSchema);
export default User;
