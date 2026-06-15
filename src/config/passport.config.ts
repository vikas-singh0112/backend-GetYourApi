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
				const userEmail = profile.emails?.[0]?.value;

				if (!userEmail) {
					return done(
						new Error("No email associated with this Google account"),
						false,
					);
				}
				let user = await Consumer.findOne({ googleId: profile.id });
				if (!user) {
					user = await Consumer.create({
						googleId: profile.id,
						displayName: profile.displayName,
						email: userEmail,
						avatar: (profile as any).photos?.[0]?.value || "",
					});
				}
				return done(null, user);
			} catch (err) {
				return done(err, false);
			}
		},
	),
);

// Serialize and deserialize user (required by Passport)
passport.serializeUser((user: any, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
	try {
		const user = await Consumer.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

export default passport;
