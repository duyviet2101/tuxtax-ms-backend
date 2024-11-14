import express from "express";
import productController from "./product.controller.js";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Product created successfully
 *       '400':
 *         description: category_not_existed
 */
router.post("/", userMiddleware, adminMiddleware, productController.createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve a list of products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Order of sorting
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product names
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       '200':
 *         description: List of products retrieved successfully
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /products/{slug}:
 *   get:
 *     summary: Retrieve a product by slug (or id)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Product slug
 *     responses:
 *       '200':
 *         description: Product retrieved successfully
 *       '400':
 *         description: product_not_existed
 */
router.get("/:slug", productController.getProductBySlug);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Update an existing product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *       '400':
 *         description: product_not_existed, data_required
 */
router.patch("/:id", userMiddleware, adminMiddleware, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '400':
 *         description: product_not_existed
 */
router.delete("/:id", userMiddleware, adminMiddleware, productController.deleteProduct);

export default router;
