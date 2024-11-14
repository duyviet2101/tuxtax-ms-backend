import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import OrdersController from "./orders.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve a list of orders
 *     tags: [Orders]
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
 *         description: Order of sorting (ascending or descending)
 *     responses:
 *       '200':
 *         description: List of orders retrieved successfully
 *       '400':
 *         description: table_not_existed, product_not_existed
 *       '401':
 *         description: Unauthorized access
 */
router.get("/", userMiddleware, adminMiddleware, OrdersController.getOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retrieve an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       '200':
 *         description: Order retrieved successfully
 *       '400':
 *         description: order_not_existed
 *       '404':
 *         description: Order not found
 */
router.get("/:id", userMiddleware, adminMiddleware, OrdersController.getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               table:
 *                 type: integer
 *                 description: Table number
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: integer
 *     responses:
 *       '201':
 *         description: Order created successfully
 *       '400':
 *         description: table_not_existed, product_not_existed
 */
router.post("/", OrdersController.createOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: New status of the order
 *     responses:
 *       '200':
 *         description: Order status updated successfully
 *       '400':
 *         description: order_not_existed
 */
router.patch("/:id/status", userMiddleware, adminMiddleware, OrdersController.updateStatusOrder);

/**
 * @swagger
 * /orders/{id}/products:
 *   patch:
 *     summary: Update the quantity of a product in an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product quantity updated successfully
 *       '400':
 *         description: order_not_existed, product_not_existed
 */
router.patch("/:id/products", userMiddleware, adminMiddleware, OrdersController.updateQuantityProduct);

/**
 * @swagger
 * /orders/{id}/products/{productId}:
 *   delete:
 *     summary: Remove a product from an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove
 *     responses:
 *       '200':
 *         description: Product removed from order successfully
 *       '400':
 *         description: order_not_existed, product_not_existed
 */
router.delete("/:id/products/:productId", userMiddleware, adminMiddleware, OrdersController.deleteProductInOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       '200':
 *         description: Order deleted successfully
 *       '400':
 *         description: order_not_existed
 */
router.delete("/:id", userMiddleware, adminMiddleware, OrdersController.deleteOrder);

/**
 * @swagger
 * /orders/{id}/products:
 *   post:
 *     summary: Add a product to an existing order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Product added to order successfully
 *       '400':
 *         description: order_not_existed, product_not_existed
 */
router.post("/:id/products", userMiddleware, adminMiddleware, OrdersController.addProductToOrder);

/**
 * @swagger
 * /orders/{id}/is-paid:
 *   patch:
 *     summary: Update payment status of an order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Order payment status updated successfully
 *       '400':
 *         description: order_not_existed
 */
router.patch("/:id/is-paid", userMiddleware, adminMiddleware, OrdersController.updateIsPaidOrder);

export default router;