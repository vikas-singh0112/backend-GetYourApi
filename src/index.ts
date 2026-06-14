import "dotenv/config";
import { app } from "./app";
import connectDb from "./db/dbConnection";
import { manualCleanupCronJob } from "./cron/manualCleanup";

const PORT = process.env.SERVER_PORT || 7000;

connectDb()
	.then(() => {

		manualCleanupCronJob();
		const server = app.listen(PORT, () => {
			console.log(`⚡️Server is running at PORT: ${PORT}`);
		});
		server.on("error", (error) => {
			console.error("Express App Error: ", error);
		});
	})
	.catch((error) => {
		console.log("MONGODB Connection Error", error);
	});
