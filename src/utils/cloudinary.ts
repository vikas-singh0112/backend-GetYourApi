import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadToCloudinary = async (
	localFilePath: string,
	folder: string,
) => {
	try {
		if (!localFilePath || !folder) return null;

		const uploadedFile = await cloudinary.uploader.upload(localFilePath, {
			folder: folder,
			resource_type: "image",
			allowed_formats: ["jpeg", "png", "jpg", "webp"],
		});

		if (fs.existsSync(localFilePath)) {
			fs.unlinkSync(localFilePath);
		}

		return {
			url: uploadedFile.url,
			publicId: uploadedFile.public_id,
		};
	} catch (error) {
		if (localFilePath && fs.existsSync(localFilePath)) {
			fs.unlinkSync(localFilePath);
		}
		return null;
	}
};
