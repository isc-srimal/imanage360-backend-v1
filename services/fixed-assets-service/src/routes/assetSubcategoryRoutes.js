const express = require("express");
const {
  createAssetSubcategory,
  updateAssetSubcategory,
  deleteAssetSubcategory,
  getAssetSubcategoryById,
  getAllAssetSubcategories,
  filterAssetSubcategories,
  exportFilteredAssetSubcategoriesToCSV,
  exportFilteredAssetSubcategoriesToPDF,
} = require("../controllers/assetSubcategoryController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/asset-subcategories/createAssetSubcategory:
 *   post:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Create a new asset subcategory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcategory_name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Asset subcategory created successfully
 *       404:
 *         description: Asset category not found
 *       500:
 *         description: Error creating asset subcategory
 */
router.post("/createAssetSubcategory", verifyToken, createAssetSubcategory);

/**
 * @swagger
 * /api/asset-subcategories/updateAssetSubcategory/{subcategory_id}:
 *   put:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Update an existing asset subcategory
 *     parameters:
 *       - in: path
 *         name: subcategory_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset subcategory to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcategory_name:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Asset subcategory updated successfully
 *       404:
 *         description: Asset subcategory or category not found
 *       500:
 *         description: Error updating asset subcategory
 */
router.put("/updateAssetSubcategory/:subcategory_id", verifyToken, updateAssetSubcategory);

/**
 * @swagger
 * /api/asset-subcategories/deleteAssetSubcategory/{subcategory_id}:
 *   delete:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Delete an asset subcategory by ID
 *     parameters:
 *       - in: path
 *         name: subcategory_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset subcategory to delete
 *     responses:
 *       200:
 *         description: Asset subcategory deleted successfully
 *       404:
 *         description: Asset subcategory not found
 *       500:
 *         description: Error deleting asset subcategory
 */
router.delete("/deleteAssetSubcategory/:subcategory_id", verifyToken, deleteAssetSubcategory);

/**
 * @swagger
 * /api/asset-subcategories/assetSubcategory/{subcategory_id}:
 *   get:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Get a single asset subcategory by ID
 *     parameters:
 *       - in: path
 *         name: subcategory_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset subcategory
 *     responses:
 *       200:
 *         description: Asset subcategory retrieved successfully
 *       404:
 *         description: Asset subcategory not found
 */
router.get("/assetSubcategory/:subcategory_id", verifyToken, getAssetSubcategoryById);

/**
 * @swagger
 * /api/asset-subcategories/assetSubcategories:
 *   get:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Get all asset subcategories with pagination
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
 *         description: Asset subcategories retrieved successfully
 *       500:
 *         description: Error retrieving asset subcategories
 */
router.get("/assetSubcategories", verifyToken, getAllAssetSubcategories);

/**
 * @swagger
 * /api/asset-subcategories/filterAssetSubcategories:
 *   get:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Filter asset subcategories by status or category
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: category_id
 *         required: false
 *         schema:
 *           type: integer
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
 *         description: Filtered asset subcategories retrieved successfully
 *       500:
 *         description: Error filtering asset subcategories
 */
router.get("/filterAssetSubcategories", verifyToken, filterAssetSubcategories);

/**
 * @swagger
 * /api/asset-subcategories/exportFilteredAssetSubcategoriesToCSV:
 *   get:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Export filtered asset subcategories to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
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
router.get("/exportFilteredAssetSubcategoriesToCSV", verifyToken, exportFilteredAssetSubcategoriesToCSV);

/**
 * @swagger
 * /api/asset-subcategories/exportFilteredAssetSubcategoriesToPDF:
 *   get:
 *     tags:
 *       - Manage Asset Subcategories
 *     summary: Export filtered asset subcategories to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
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
router.get("/exportFilteredAssetSubcategoriesToPDF", verifyToken, exportFilteredAssetSubcategoriesToPDF);

module.exports = router;