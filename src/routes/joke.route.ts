import { Router } from "express";
import {
	createJoke,
	deleteJoke,
	findJokeByCategory,
	findJokeById,
	findJokeBySlug,
	getJokes,
	searchJoke,
} from "../controllers/joke.controller";

const jokeRouter = Router();

jokeRouter.get("", getJokes);
jokeRouter.get("/id/:jokeid", findJokeById);
jokeRouter.get("/search", searchJoke);
jokeRouter.get("/setup/:slug", findJokeBySlug);
jokeRouter.get("/category/:category", findJokeByCategory);
jokeRouter.post("/create", createJoke);
jokeRouter.delete("/delete", deleteJoke);

export default jokeRouter;
