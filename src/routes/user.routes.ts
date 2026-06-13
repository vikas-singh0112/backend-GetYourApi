import { Router } from "express";
import {
	createUser,
	deleteUser,
	findUsersById,
	findUsersBySlug,
	getUsers,
	searchUser,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("", getUsers);
userRouter.get("/id/:userid", findUsersById);
userRouter.get("/search", searchUser);
userRouter.get("/name/:slug", findUsersBySlug);
userRouter.post("/create", createUser);
userRouter.delete("/delete", deleteUser);

export default userRouter;
