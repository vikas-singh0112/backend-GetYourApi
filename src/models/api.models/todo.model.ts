import mongoose, { Model, Schema } from "mongoose";
import { model } from "mongoose";
import { Types } from "mongoose";

export interface ITodo extends Document {
	title: string;
	content: string;
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
			index: true,
		},
		content: {
			type: String,
			required: [true, "title is required"],
			trim: true,
			lowercase: true,
			maxLength: [1000, "content cannot exceed 1000 characters"],
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

const Todo: Model<ITodo> =
	mongoose.models.Todo || model<ITodo>("Todo", todoSchema);

export default Todo;
