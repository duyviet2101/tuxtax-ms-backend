import express from "express";
import HelloWorldController from "./helloWorld.controller.js";

const router = express.Router();

router.get('/', HelloWorldController.getHelloWorld);

router.get('/error', HelloWorldController.getError);

export default router;

/**
 * @swagger
 * tags:
 *   name: HelloWorld
 *   description: HelloWorld management
 */

/**
 * @swagger
 * /hello-world:
 *   get:
 *     summary: Get hello world
 *     tags: [HelloWorld]
 *     responses:
 *       200:
 *         description: Get hello world success
 *       400:
 *         description: Bad request
 */