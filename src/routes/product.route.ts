import { Router } from "express";

import {
	createProduct,
	deleteProduct,
	findProductByCategory,
	findProductById,
	findProductBySlug,
	getProducts,
	searchProduct,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter.get("", getProducts);
productRouter.get("/id/:productid", findProductById);
productRouter.get("/search", searchProduct);
productRouter.get("/name/:slug", findProductBySlug);
productRouter.get("/category/:category", findProductByCategory);
productRouter.post("/create", createProduct);
productRouter.delete("/delete", deleteProduct);

export default productRouter;
