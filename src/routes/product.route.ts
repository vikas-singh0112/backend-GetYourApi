import { Router } from "express";

import {
	createProduct,
	deleteProduct,
	findProductById,
	findProductBySlug,
	getProducts,
	searchProduct,
} from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("", getProducts);
productRouter.get("/id/:productid", findProductById);
productRouter.get("/search", searchProduct);
productRouter.get("/name/:slug", findProductBySlug);
productRouter.post("/create", createProduct);
productRouter.delete("/delete", deleteProduct);

export default productRouter;
