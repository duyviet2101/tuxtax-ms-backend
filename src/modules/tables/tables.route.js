import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import TableController from "./table.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tables
 *   description: Table management
 */

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: Retrieve a list of tables
 *     tags: [Tables]
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
 *         description: Search term for table names
 *       - in: query
 *         name: floor
 *         schema:
 *           type: string
 *         description: Filter by floor ID
 *     responses:
 *       '200':
 *         description: List of tables retrieved successfully
 */
router.get("/", userMiddleware, TableController.getAllTables);

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Retrieve a table by ID
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Table ID
 *     responses:
 *       '200':
 *         description: Table retrieved successfully
 *       '400':
 *         description: table_not_existed
 */
router.get("/:id", userMiddleware, TableController.getTableById);

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Create a new table
 *     tags: [Tables]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               floor:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       '201':
 *         description: Table created successfully
 *       '400':
 *         description: floor_not_existed
 */
router.post("/", userMiddleware, adminMiddleware, TableController.createTable);

/**
 * @swagger
 * /tables/{id}:
 *   patch:
 *     summary: Update an existing table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Table ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               floor:
 *                 type: string
 *               capacity:
 *                 type: integer
 *     responses:
 *       '200':
 *         description: Table updated successfully
 *       '400':
 *         description: table_not_existed, floor_not_existed
 */
router.patch("/:id", userMiddleware, adminMiddleware, TableController.updateTable);

/**
 * @swagger
 * /tables/{id}:
 *   delete:
 *     summary: Delete a table
 *     tags: [Tables]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Table ID
 *     responses:
 *       '200':
 *         description: Table deleted successfully
 *       '400':
 *         description: table_not_existed
 */
router.delete("/:id", userMiddleware, adminMiddleware, TableController.deleteTable);

export default router;