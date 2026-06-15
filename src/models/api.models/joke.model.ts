import mongoose, { Document, model, Model, Schema, Types } from "mongoose";
import crypto from "crypto";

export interface IJoke extends Document {
	setup: string;
	punchline: string;
	slug: string;
	category: string;
	isGlobal: boolean;
	developerId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const jokeSchema = new Schema<IJoke>(
	{
		setup: {
			type: String,
			required: [true, "joke setup is required"],
			trim: true,
			lowercase: true,
			maxlength: [200, "Keep the setup short and punchy."],
		},
		punchline: {
			type: String,
			required: [true, "punchline is required"],
			trim: true,
			lowercase: true,
			maxlength: 200,
		},
		slug: {
			type: String,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		category: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			default: "misc",
			maxLength: [50, "category cannot exceed 50 characters"],
			index: true,
		},
		isGlobal: {
			type: Boolean,
			required: true,
			default: false,
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

jokeSchema.pre("save", async function () {
	if (!this.isModified("setup")) return;

	const generatedSlug = this.setup
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

	const shortHash = crypto.randomBytes(3).toString("hex");
	this.slug = `${generatedSlug}-${shortHash}`;
});

const Joke: Model<IJoke> =
	mongoose.models.Joke || model<IJoke>("Joke", jokeSchema);

export default Joke;
