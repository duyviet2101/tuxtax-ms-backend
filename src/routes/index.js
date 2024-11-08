import express from "express";
import HelloWorldRoute from "../modules/helloWorld/helloWorld.route.js";
import productRoute from "../modules/product/product.route.js";

const router = express.Router();

router.use("/hello-world", HelloWorldRoute);

router.use("/product", productRoute);

export default router;
