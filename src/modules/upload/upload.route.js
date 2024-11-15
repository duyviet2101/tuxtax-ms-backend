import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import UploadController from "./upload.controller.js";
import {multerUploadArrayMiddleware} from "../../middlewares/uploadMiddleware.js";


const router = Router();

router.post('/images',
  userMiddleware,
  adminMiddleware,
  multerUploadArrayMiddleware('images', 5),
  UploadController.uploadImages
)

export default router;