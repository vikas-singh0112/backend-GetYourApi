import { Router } from "express";
import passport from "../config/passport";
import {
	googleCallback,
    getCurrentConsumer,
    logoutConsumer,
	getSecretToken,
} from "../controllers/auth.controller";

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
	passport.authenticate("google", {
		failureRedirect: "http://localhost:5173/signin",
		session: false,
	}),
	googleCallback,
);

// Profile and logout endpoints
authRouter.get("/user", getCurrentConsumer);
authRouter.get("/logout", logoutConsumer);
authRouter.get("/secret", getSecretToken);

export default authRouter;
