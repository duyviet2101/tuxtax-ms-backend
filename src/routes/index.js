import express from "express";
import HelloWorldRoute from "../modules/helloWorld/helloWorld.route.js";
import productRoute from "../modules/product/product.route.js";
import UsersRoute from "../modules/users/users.route.js";
import AuthRoute from "../modules/auth/auth.route.js";
import CategoriesRoute from "../modules/categories/categories.route.js";
import FloorsRoute from "../modules/floors/floors.route.js";
import TablesRoute from "../modules/tables/tables.route.js";

const router = express.Router();

router.use("/hello-world", HelloWorldRoute);

router.use("/products", productRoute);

router.use('/users', UsersRoute);

router.use('/auth', AuthRoute);

router.use('/categories', CategoriesRoute);

router.use('/floors', FloorsRoute);

router.use('/tables', TablesRoute);

export default router;
