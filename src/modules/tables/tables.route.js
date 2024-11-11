import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import TableController from "./table.controller.js";

const router = Router();

router.get("/", userMiddleware, TableController.getAllTables);

router.get("/:id", userMiddleware, TableController.getTableById);

router.post("/", userMiddleware, adminMiddleware, TableController.createTable);

router.patch("/:id", userMiddleware, adminMiddleware, TableController.updateTable);

router.delete("/:id", userMiddleware, adminMiddleware, TableController.deleteTable);

export default router;