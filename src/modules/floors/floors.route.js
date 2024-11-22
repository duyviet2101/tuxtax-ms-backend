import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import FloorsController from "./floors.controller.js";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Floors
 *   description: Floor management
 */

/**
 * @swagger
 * /floors:
 *   get:
 *     summary: Retrieve a list of floors
 *     tags: [Floors]
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
 *         description: Search term for floor names
 *     responses:
 *       '200':
 *         description: List of floors retrieved successfully
 */
router.get("/", userMiddleware, FloorsController.getAllFloors);

/**
 * @swagger
 * /floors/{slug}:
 *   get:
 *     summary: Retrieve a floor by slug
 *     tags: [Floors]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Floor slug
 *     responses:
 *       '200':
 *         description: Floor retrieved successfully
 *       '400':
 *         description: floor_not_existed
 */
router.get("/:slug", userMiddleware, FloorsController.getFloorBySlug);

/**
 * @swagger
 * /floors:
 *   post:
 *     summary: Create a new floor
 *     tags: [Floors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Floor created successfully
 */
router.post("/", userMiddleware, adminMiddleware, FloorsController.createFloor);

/**
 * @swagger
 * /floors/{id}:
 *   patch:
 *     summary: Update an existing floor
 *     tags: [Floors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Floor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Floor updated successfully
 *       '400':
 *         description: floor_not_existed
 */
router.patch("/:id", userMiddleware, adminMiddleware, FloorsController.updateFloor);

/**
 * @swagger
 * /floors/{id}:
 *   delete:
 *     summary: Delete a floor
 *     tags: [Floors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Floor ID
 *     responses:
 *       '200':
 *         description: Floor deleted successfully
 *       '400':
 *         description: floor_not_existed
 */
router.delete("/:id", userMiddleware, adminMiddleware, FloorsController.deleteFloor);

export default router;