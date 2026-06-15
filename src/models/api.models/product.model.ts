import mongoose, { Document, Types, Schema, Model, model } from "mongoose";
import crypto from "crypto";

export interface IImageProp  {
	url: string;
	publicId: string;
}
export interface IProduct extends Document {
	name: string;
	slug: string;
	category: string;
	description: string;
	price: number;
	salePrice: number;
	stock: number;
	images: IImageProp[];
	isActive: boolean;
	isGlobal: boolean;
	developerId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			maxLength: [150, "name cannot exceed 150 characters"],
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
			maxLength: [150, "category cannot exceed 150 characters"],
			index: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
			maxLength: [1000, "description cannot exceed 1000 characters"],
		},
		price: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		salePrice: {
			type: Number,
			min: 0,
			default: 0,
		},
		stock: {
			type: Number,
			min: 0,
			default: 0,
			required: true,
		},
		images: {
			type: [
				{
					url: { type: String, required: true },
					publicId: { type: String, required: true },
				},
			],
			_id: false,

			validate: {
				validator: function (v: IImageProp[]) {
					return Array.isArray(v) && v.length > 0;
				},
				message: "A product must have at least one image.",
			},
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
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

productSchema.pre("save", async function () {
	if (!this.isModified("name")) return;

	const generatedSlug = this.name
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

	const shortHash = crypto.randomBytes(3).toString("hex");
	this.slug = `${generatedSlug}-${shortHash}`;
});

const Product: Model<IProduct> =
	mongoose.models.Product || model<IProduct>("Product", productSchema);

export default Product;
