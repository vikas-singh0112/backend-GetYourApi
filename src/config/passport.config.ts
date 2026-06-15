import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Consumer } from "../models/consumer.model.js";

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: process.env.GOOGLE_CALLBACK_URL!,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				console.log("Google Strategy - Profile:", {
					id: profile.id,
					displayName: profile.displayName,
					emails: profile.emails,
				});

				const userEmail = profile.emails?.[0]?.value;

				if (!userEmail) {
					console.error("No email found in Google profile");
					return done(
						new Error("No email associated with this Google account"),
						false,
					);
				}

				let user = await Consumer.findOne({ googleId: profile.id });
				if (!user) {
					console.log("Creating new user:", userEmail);
					user = await Consumer.create({
						googleId: profile.id,
						displayName: profile.displayName,
						email: userEmail,
						avatar: (profile as any).photos?.[0]?.value || "",
					});
					console.log("User created:", user._id);
				} else {
					console.log("User found:", user._id);
				}
				return done(null, user);
			} catch (err) {
				console.error("Passport Strategy Error:", err);
				return done(err, false);
			}
		},
	),
);

// Serialize and deserialize user (required by Passport)
passport.serializeUser((user: any, done) => {
	console.log("Serializing user:", user._id);
	done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		console.log("Deserializing user:", id);
		const user = await Consumer.findById(id);
		done(null, user);
	} catch (err) {
		console.error("Deserialize error:", err);
		done(err, null);
	}
});

export default passport;
