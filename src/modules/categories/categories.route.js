import {Router} from "express";
import {adminMiddleware, userMiddleware} from "../../middlewares/authMiddleware.js";
import CategoriesController from "./categories.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve a list of categories
 *     tags: [Categories]
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
 *         description: Search term for category names
 *     responses:
 *       '200':
 *         description: List of categories retrieved successfully
 */
router.get("/", CategoriesController.getAllCategories);

/**
 * @swagger
 * /categories/{slug}:
 *   get:
 *     summary: Retrieve a category by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       '200':
 *         description: Category retrieved successfully
 *       '400':
 *         description: category_not_existed
 */
router.get("/:slug", CategoriesController.getCategoryByIdOrSlug);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               parent:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Category created successfully
 */
router.post("/", userMiddleware, adminMiddleware, CategoriesController.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update an existing category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *               parent:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Category updated successfully
 *       '400':
 *         description: category_not_existed
 */
router.patch("/:id", userMiddleware, adminMiddleware, CategoriesController.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       '200':
 *         description: Category deleted successfully
 *       '400':
 *         description: category_not_existed
 */
router.delete("/:id", userMiddleware, adminMiddleware, CategoriesController.deleteCategory);

export default router;