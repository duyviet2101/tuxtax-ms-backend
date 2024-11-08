import express from "express";
import HelloWorldRoute from "../modules/helloWorld/helloWorld.route.js";
import productRoute from "../modules/product/product.route.js";
import UsersRoute from "../modules/users/users.route.js";
import AuthRoute from "../modules/auth/auth.route.js";

const router = express.Router();

router.use("/hello-world", HelloWorldRoute);

router.use("/product", productRoute);

router.use('/users', UsersRoute);

router.use('/auth', AuthRoute);

export default router;
