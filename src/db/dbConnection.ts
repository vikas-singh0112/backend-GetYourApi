import mongoose from "mongoose";

export default async function connectDb() {
	try {
		const connectionResponse = await mongoose.connect(
			`${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
		);
		console.log(`\n🛢️ MONGODB Connected`);
	} catch (error) {
		console.log("MONGODB Connection Error", error);
		process.exit(1);
	}
}
