const express = require("express");
const {
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  getAssetCategoryById,
  getAllAssetCategories,
  filterAssetCategories,
  exportFilteredAssetCategoriesToCSV,
  exportFilteredAssetCategoriesToPDF,
} = require("../controllers/assetCategoryController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/asset-categories/createAssetCategory:
 *   post:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Create a new asset category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Asset category created successfully
 *       500:
 *         description: Error creating asset category
 */
router.post("/createAssetCategory", verifyToken, createAssetCategory);

/**
 * @swagger
 * /api/asset-categories/updateAssetCategory/{category_id}:
 *   put:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Update an existing asset category
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Asset category updated successfully
 *       404:
 *         description: Asset category not found
 *       500:
 *         description: Error updating asset category
 */
router.put("/updateAssetCategory/:category_id", verifyToken, updateAssetCategory);

/**
 * @swagger
 * /api/asset-categories/deleteAssetCategory/{category_id}:
 *   delete:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Delete an asset category by ID
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset category to delete
 *     responses:
 *       200:
 *         description: Asset category deleted successfully
 *       404:
 *         description: Asset category not found
 *       500:
 *         description: Error deleting asset category
 */
router.delete("/deleteAssetCategory/:category_id", verifyToken, deleteAssetCategory);

/**
 * @swagger
 * /api/asset-categories/assetCategory/{category_id}:
 *   get:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Get a single asset category by ID
 *     parameters:
 *       - in: path
 *         name: category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset category
 *     responses:
 *       200:
 *         description: Asset category retrieved successfully
 *       404:
 *         description: Asset category not found
 */
router.get("/assetCategory/:category_id", verifyToken, getAssetCategoryById);

/**
 * @swagger
 * /api/asset-categories/assetCategories:
 *   get:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Get all asset categories with pagination
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
 *         description: Asset categories retrieved successfully
 *       500:
 *         description: Error retrieving asset categories
 */
router.get("/assetCategories", verifyToken, getAllAssetCategories);

/**
 * @swagger
 * /api/asset-categories/filterAssetCategories:
 *   get:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Filter asset categories by status
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
 *         description: Filtered asset categories retrieved successfully
 *       500:
 *         description: Error filtering asset categories
 */
router.get("/filterAssetCategories", verifyToken, filterAssetCategories);

/**
 * @swagger
 * /api/asset-categories/exportFilteredAssetCategoriesToCSV:
 *   get:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Export filtered asset categories to CSV
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
router.get("/exportFilteredAssetCategoriesToCSV", verifyToken, exportFilteredAssetCategoriesToCSV);

/**
 * @swagger
 * /api/asset-categories/exportFilteredAssetCategoriesToPDF:
 *   get:
 *     tags:
 *       - Manage Asset Categories
 *     summary: Export filtered asset categories to PDF
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
router.get("/exportFilteredAssetCategoriesToPDF", verifyToken, exportFilteredAssetCategoriesToPDF);

module.exports = router;