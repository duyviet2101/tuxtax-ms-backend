import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import OrdersController from "./orders.controller.js";

const router = Router();

router.get("/", userMiddleware, adminMiddleware, OrdersController.getOrders);

router.get("/:id", userMiddleware, adminMiddleware, OrdersController.getOrderById);

router.post("/", OrdersController.createOrder);

router.patch("/:id/status", userMiddleware, adminMiddleware, OrdersController.updateStatusOrder);

router.patch("/:id/products", userMiddleware, adminMiddleware, OrdersController.updateQuantityProduct);

router.delete("/:id/products/:productId", userMiddleware, adminMiddleware, OrdersController.deleteProductInOrder);

router.delete("/:id", userMiddleware, adminMiddleware, OrdersController.deleteOrder);

export default router;