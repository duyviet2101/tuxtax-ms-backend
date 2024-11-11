import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import CategoriesController from "./categories.controller.js";

const router = Router();

router.get("/", CategoriesController.getAllCategories);

router.get("/:slug", CategoriesController.getCategoryByIdOrSlug);

router.post("/", userMiddleware, adminMiddleware, CategoriesController.createCategory);

router.patch("/:id", userMiddleware, adminMiddleware, CategoriesController.updateCategory);

router.delete("/:id", userMiddleware, adminMiddleware, CategoriesController.deleteCategory);

export default router;