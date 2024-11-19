import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import DashboardController from "./dashboard.controller.js";

const router = Router();

router.get("/income", userMiddleware, adminMiddleware, DashboardController.getIncome);

router.get("/best-seller", DashboardController.getBestSeller);

export default router;