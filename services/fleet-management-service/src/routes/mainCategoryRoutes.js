const express = require("express");
const {
  createMainCategory,
  updateMainCategory,
  deleteMainCategory,
  getMainCategoryById,
  getAllMainCategories,
  filterMainCategories,
  exportFilteredMainCategoriesToCSV,
  exportFilteredMainCategoriesToPDF,
} = require("../controllers/mainCategoryController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/main-categories/createMainCategory:
 *   post:
 *     tags:
 *       - Manage Main Categories
 *     summary: Create a new main category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_provider_id:
 *                 type: integer
 *               reported_by:
 *                 type: string
 *               main_category:
 *                 type: string
 *               service_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Main category created successfully
 *       500:
 *         description: Error creating main category
 */
router.post("/createMainCategory", verifyToken, createMainCategory);

/**
 * @swagger
 * /api/main-categories/updateMainCategory/{main_category_id}:
 *   put:
 *     tags:
 *       - Manage Main Categories
 *     summary: Update an existing main category
 *     parameters:
 *       - in: path
 *         name: main_category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the main category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_provider_id:
 *                 type: integer
 *               reported_by:
 *                 type: string
 *               main_category:
 *                 type: string
 *               service_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Main category updated successfully
 *       404:
 *         description: Main category not found
 *       500:
 *         description: Error updating main category
 */
router.put("/updateMainCategory/:main_category_id", verifyToken, updateMainCategory);

/**
 * @swagger
 * /api/main-categories/deleteMainCategory/{main_category_id}:
 *   delete:
 *     tags:
 *       - Manage Main Categories
 *     summary: Delete a main category by ID
 *     parameters:
 *       - in: path
 *         name: main_category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the main category to delete
 *     responses:
 *       200:
 *         description: Main category deleted successfully
 *       404:
 *         description: Main category not found
 *       500:
 *         description: Error deleting main category
 */
router.delete("/deleteMainCategory/:main_category_id", verifyToken, deleteMainCategory);

/**
 * @swagger
 * /api/main-categories/mainCategory/{main_category_id}:
 *   get:
 *     tags:
 *       - Manage Main Categories
 *     summary: Get a single main category by ID
 *     parameters:
 *       - in: path
 *         name: main_category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the main category
 *     responses:
 *       200:
 *         description: Main category retrieved successfully
 *       404:
 *         description: Main category not found
 */
router.get("/mainCategory/:main_category_id", verifyToken, getMainCategoryById);

/**
 * @swagger
 * /api/main-categories/mainCategories:
 *   get:
 *     tags:
 *       - Manage Main Categories
 *     summary: Get all main categories with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Main categories retrieved successfully
 *       500:
 *         description: Error retrieving main categories
 */
router.get("/mainCategories", verifyToken, getAllMainCategories);

/**
 * @swagger
 * /api/main-categories/filterMainCategories:
 *   get:
 *     tags:
 *       - Manage Main Categories
 *     summary: Filter main categories by status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Filtered main categories retrieved successfully
 *       500:
 *         description: Error filtering main categories
 */
router.get("/filterMainCategories", verifyToken, filterMainCategories);

/**
 * @swagger
 * /api/main-categories/exportFilteredMainCategoriesToCSV:
 *   get:
 *     tags:
 *       - Manage Main Categories
 *     summary: Export filtered main categories to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file download
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportFilteredMainCategoriesToCSV", verifyToken, exportFilteredMainCategoriesToCSV);

/**
 * @swagger
 * /api/main-categories/exportFilteredMainCategoriesToPDF:
 *   get:
 *     tags:
 *       - Manage Main Categories
 *     summary: Export filtered main categories to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file download
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportFilteredMainCategoriesToPDF", verifyToken, exportFilteredMainCategoriesToPDF);

module.exports = router;