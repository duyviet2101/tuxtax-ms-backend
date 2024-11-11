import express from "express";
import productController from "./product.controller.js";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", userMiddleware, adminMiddleware, productController.createProduct);

router.get("/", productController.getAllProducts);

router.get("/:slug", productController.getProductBySlug);

router.patch("/:id", userMiddleware, adminMiddleware, productController.updateProduct);

router.delete("/:id", userMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
