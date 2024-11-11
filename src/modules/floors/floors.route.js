import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import FloorsController from "./floors.controller.js";


const router = Router();

router.get("/", userMiddleware, adminMiddleware, FloorsController.getAllFloors);

router.get("/:slug", userMiddleware, adminMiddleware, FloorsController.getFloorBySlug);

router.post("/", userMiddleware, adminMiddleware, FloorsController.createFloor);

router.patch("/:id", userMiddleware, adminMiddleware, FloorsController.updateFloor);

router.delete("/:id", userMiddleware, adminMiddleware, FloorsController.deleteFloor);

export default router;