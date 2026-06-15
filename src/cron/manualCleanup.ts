import { Model } from "mongoose";
import Product from "../models/api.models/product.model.js";
import User from "../models/api.models/user.model.js";
import Todo from "../models/api.models/todo.model.js";
import cron from "node-cron";
import { v2 as cloudinary } from "cloudinary";

interface CleanupTarget {
	name: string;
	model: Model<any>;
	hasImages: boolean;
}

const cleanupTargets: CleanupTarget[] = [
	{ name: "Users", model: User, hasImages: false },
	{ name: "Todos", model: Todo, hasImages: false },
	{ name: "Products", model: Product, hasImages: true },
];

export const manualCleanupCronJob = () => {
	cron.schedule("0 * * * *", async () => {
		console.log("[Cron Task] Starting manual cleanup");

		try {
			const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

			for (const target of cleanupTargets) {
				const expiredDocs = await target.model.find({
					isGlobal: false,
					createdAt: { $lte: twentyFourHoursAgo },
				});

				if (expiredDocs.length === 0) {
					console.log(`${target.name} No expired items found.`);
					continue;
				}

				console.log(
					`${target.name} Processing ${expiredDocs.length} expired records.`,
				);

				if (target.hasImages) {
					const publicIdsToDelete: string[] = [];

					for (const doc of expiredDocs) {
						if (doc.images && Array.isArray(doc.images)) {
							doc.images.forEach((img: any) => {
								if (img.publicId) publicIdsToDelete.push(img.publicId);
							});
						}
					}

					// Batch delete the images from Cloudinary
					if (publicIdsToDelete.length > 0) {
						console.log(
							` -> Removing ${publicIdsToDelete.length} images from Cloudinary...`,
						);
						await cloudinary.api.delete_resources(publicIdsToDelete);
					}
				}
				const deleteResult = await target.model.deleteMany({
					isGlobal: false,
					createdAt: { $lte: twentyFourHoursAgo },
				});
				console.log(
					` -> Deleted ${deleteResult.deletedCount} documents from the ${target.name} collection.`,
				);
			}
			console.log("Cron Task - database and asset cleanup cycle complete!");
		} catch (error) {
			console.error(" Master cron cleanup encountered an error:", error);
		}
	});

	console.log("multi-model cleanup cron job running successfully.");
};
