import {Router} from "express";
import AuthController from "./auth.controller.js";
import {userMiddleware} from "../../middlewares/authMiddleware.js";

const router = Router();

router.post('/login', AuthController.login);

router.post('/change-password', userMiddleware, AuthController.changePassword);

export default router;