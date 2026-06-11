import { Router } from "express";
import {
	createUser,
	deleteUser,
	findUsersById,
	getUsers,
	searchUser,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("", getUsers);
userRouter.get("/find-by-id", findUsersById);
userRouter.get("/search", searchUser);
userRouter.post("/create", createUser);
userRouter.delete("/delete", deleteUser);

export default userRouter;
