import {Router} from "express";
import UsersController from "./users.controller.js";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";

const router = Router();

router.use(userMiddleware);
router.use(adminMiddleware);

router.get('/', UsersController.getUsers);

router.post('/', UsersController.createUser);

router.get('/:id', UsersController.getUserById);

router.patch('/:id', UsersController.updateUser);

router.delete('/:id', UsersController.deleteUser);

export default router;