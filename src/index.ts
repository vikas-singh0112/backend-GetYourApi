import "dotenv/config";
import { app } from "./app";
import connectDb from "./db/dbConnection";

const PORT = process.env.SERVER_PORT || 7000;

connectDb()
	.then(() => {
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
