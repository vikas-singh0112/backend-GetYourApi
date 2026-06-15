import { Request, Response } from "express";
import { Consumer, IConsumer } from "../models/consumer.model.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

interface JwtPayload {
	id: string;
}

export const googleCallback = (req: Request, res: Response): void => {
	const consumer = req.user as IConsumer;

	if (!consumer) {
		const failureUrl = process.env.FRONTEND_ORIGINS;
		res.redirect(`${failureUrl}/signin`);
		return;
	}

	const token = jwt.sign(
		{ id: consumer._id },
		process.env.JWT_SECRET as string,
		{ expiresIn: "24h" },
	);

	res.cookie("auth_token", token, {
		httpOnly: true,
		secure: true,
		maxAge: 24 * 60 * 60 * 1000, // 24 hours
		sameSite: "none",
		path: "/",
	});

	const successUrl = process.env.FRONTEND_ORIGINS;

	res.redirect(`${successUrl}/dashboard?token=${token}`);
};

export const getCurrentConsumer = async (
	req: Request,
	res: Response,
): Promise<Response> => {
	const token = req.cookies?.auth_token;

	if (!token) {
		return res.status(401).json({ loggedIn: false, message: "No token found" });
	}

	try {
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as JwtPayload;
		const user = await Consumer.findById(decoded.id).select("-googleId");

		if (!user) {
			return res
				.status(401)
				.json({ loggedIn: false, message: "User not found" });
		}

		return res.json({ loggedIn: true, user });
	} catch (error) {
		return res.status(401).json({ loggedIn: false, message: "Invalid token" });
	}
};

export const logoutConsumer = (req: Request, res: Response): void => {
	res.clearCookie("auth_token", {
		httpOnly: true,
		secure: true,
		sameSite: "none",
		path: "/",
	});
	res.json({ success: true, message: "Logged out successfully" });
};

export const getSecretToken = asyncHandler(async (req, res) => {
	const token = req.cookies?.auth_token;
	if (!token) {
		return res.status(401).json({ loggedIn: false, message: "No token found" });
	}
	const decoded = jwt.verify(
		token,
		process.env.JWT_SECRET as string,
	) as JwtPayload;

	const user = await Consumer.findById(decoded.id);
	if (!user) {
		return res.status(401).json({ loggedIn: false, message: "User not found" });
	}

	const secretToken = jwt.sign(
		{ id: user._id },
		process.env.SECRET_TOKEN as string,
		{ expiresIn: "72h" },
	);
	const response = ApiResponse({
		data: secretToken,
		statusCode: 201,
		message: "secret token created successfully",
	});

	res.status(201).json(response);
});
