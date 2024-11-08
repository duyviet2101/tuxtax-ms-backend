import express from "express";
import productController from "./product.controller.js";

const router = express.Router();

router.get("/error", productController.getError);

router.post("/", productController.createProduct);

router.get("/", productController.getAllProducts);

router.get("/:slug", productController.getProductBySlug);

router.put("/:slug", productController.updateProduct);

router.delete("/:slug", productController.deleteProduct);

export default router;
