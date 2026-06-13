import fs from "fs";
import multer from "multer";
import path from "path";
import { Request, Response } from "express";

const tempDir = path.join(process.cwd(), "public", "temp");
if (!fs.existsSync(tempDir)) {
	fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, tempDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
		);
	},
});

export const upload = multer({ storage });

export const parseMultipartData = (req: Request, res: Response) => {
	return new Promise<void>((resolve, reject) => {
		upload.array("images", 5)(req, res, (err: any) => {
			if (err) return reject(err);
			resolve();
		});
	});
};
