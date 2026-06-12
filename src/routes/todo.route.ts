import { Router } from "express";
import {
	createTodo,
	deleteTodo,
	findTodoById,
	getTodos,
	searchTodo,
} from "../controllers/todo.controller";

const todoRouter = Router();
todoRouter.get("", getTodos);
todoRouter.get("/find-by-id", findTodoById);
todoRouter.get("/search", searchTodo);
todoRouter.post("/create", createTodo);
todoRouter.delete("/delete", deleteTodo);
