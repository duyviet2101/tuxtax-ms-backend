import express from "express";
import productController from "./product.controller.js";

const router = express.Router();

router.post("/", productController.createProduct);

router.get("/", productController.getAllProducts);

router.get("/:slug", productController.getProductBySlug);

router.put("/:id", productController.updateProduct);

router.delete("/:id", productController.deleteProduct);

export default router;
