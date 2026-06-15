import { Router } from "express";
import passport from "../config/passport.config.js";
import {
	googleCallback,
	getCurrentConsumer,
	logoutConsumer,
	getSecretToken,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	}),
);

// Target endpoint for Google's redirect URI
authRouter.get(
	"/google/callback",
	(req, res, next) => {
		const failureRedirect = `${process.env.FRONTEND_ORIGINS || "http://localhost:5173"}/signin`;
		passport.authenticate("google", {
			failureRedirect,
			session: false,
		})(req, res, next);
	},
	googleCallback,
);

// Profile and logout endpoints
authRouter.get("/user", getCurrentConsumer);
authRouter.get("/logout", logoutConsumer);
authRouter.get("/secret", getSecretToken);

export default authRouter;
