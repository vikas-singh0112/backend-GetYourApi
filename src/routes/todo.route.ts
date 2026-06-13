import { Router } from "express";
import {
	createTodo,
	deleteTodo,
	findTodoById,
	findTodoBySlug,
	getTodos,
	searchTodo,
} from "../controllers/todo.controller";

const todoRouter = Router();
todoRouter.get("", getTodos);
todoRouter.get("/find-by-id", findTodoById);
todoRouter.get("/search", searchTodo);
todoRouter.get("/title/:slug", findTodoBySlug);
todoRouter.post("/create", createTodo);
todoRouter.delete("/delete", deleteTodo);

export default todoRouter;
