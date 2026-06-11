import { Schema, model, Document } from "mongoose";

export interface IConsumer extends Document {
	googleId: string;
	displayName: string;
	email: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
}

const consumerSchema = new Schema<IConsumer>(
	{
		googleId: { type: String, required: true, unique: true },
		displayName: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		avatar: { type: String },
	},
	{ timestamps: true },
);

export const Consumer = model<IConsumer>("Consumer", consumerSchema);
