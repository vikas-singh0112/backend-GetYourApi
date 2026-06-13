import mongoose, { Model, Schema } from "mongoose";
import { model } from "mongoose";
import { Types } from "mongoose";
import crypto from "crypto";

export interface ITodo extends Document {
	title: string;
	content: string;
	slug: string;
	completed: boolean;
	isGlobal: boolean;
	developerId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const todoSchema = new Schema<ITodo>(
	{
		title: {
			type: String,
			required: [true, "title is required"],
			trim: true,
			lowercase: true,
			maxLength: [50, "title cannot exceed 50 characters"],
		},
		content: {
			type: String,
			required: [true, "title is required"],
			trim: true,
			lowercase: true,
			maxLength: [1000, "content cannot exceed 1000 characters"],
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		completed: {
			type: Boolean,
			required: true,
			default: false,
		},
		isGlobal: {
			type: Boolean,
			required: true,
			default: true,
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


todoSchema.pre("save", async function () {
	if (!this.isModified("title")) return;

	let generatedSlug = this.title
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

	const shortHash = crypto.randomBytes(3).toString("hex");
	this.slug = `${generatedSlug}-${shortHash}`;
});

const Todo: Model<ITodo> =
	mongoose.models.Todo || model<ITodo>("Todo", todoSchema);

export default Todo;
