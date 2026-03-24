const express = require("express");
const {
  createAssetCapacity,
  updateAssetCapacity,
  deleteAssetCapacity,
  getAssetCapacityById,
  getAllAssetCapacities,
  filterAssetCapacities,
  exportFilteredAssetCapacitiesToCSV,
  exportFilteredAssetCapacitiesToPDF,
} = require("../controllers/assetCapacityController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/asset-capacities/createAssetCapacity:
 *   post:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Create a new asset capacity
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capacity_value:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Asset capacity created successfully
 *       404:
 *         description: Asset category or subcategory not found
 *       500:
 *         description: Error creating asset capacity
 */
router.post("/createAssetCapacity", verifyToken, createAssetCapacity);

/**
 * @swagger
 * /api/asset-capacities/updateAssetCapacity/{capacity_id}:
 *   put:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Update an existing asset capacity
 *     parameters:
 *       - in: path
 *         name: capacity_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset capacity to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               capacity_value:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Asset capacity updated successfully
 *       404:
 *         description: Asset capacity, category, or subcategory not found
 *       500:
 *         description: Error updating asset capacity
 */
router.put("/updateAssetCapacity/:capacity_id", verifyToken, updateAssetCapacity);

/**
 * @swagger
 * /api/asset-capacities/deleteAssetCapacity/{capacity_id}:
 *   delete:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Delete an asset capacity by ID
 *     parameters:
 *       - in: path
 *         name: capacity_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset capacity to delete
 *     responses:
 *       200:
 *         description: Asset capacity deleted successfully
 *       404:
 *         description: Asset capacity not found
 *       500:
 *         description: Error deleting asset capacity
 */
router.delete("/deleteAssetCapacity/:capacity_id", verifyToken, deleteAssetCapacity);

/**
 * @swagger
 * /api/asset-capacities/assetCapacity/{capacity_id}:
 *   get:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Get a single asset capacity by ID
 *     parameters:
 *       - in: path
 *         name: capacity_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset capacity
 *     responses:
 *       200:
 *         description: Asset capacity retrieved successfully
 *       404:
 *         description: Asset capacity not found
 */
router.get("/assetCapacity/:capacity_id", verifyToken, getAssetCapacityById);

/**
 * @swagger
 * /api/asset-capacities/assetCapacities:
 *   get:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Get all asset capacities with pagination
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
 *         description: Asset capacities retrieved successfully
 *       500:
 *         description: Error retrieving asset capacities
 */
router.get("/assetCapacities", verifyToken, getAllAssetCapacities);

/**
 * @swagger
 * /api/asset-capacities/filterAssetCapacities:
 *   get:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Filter asset capacities by status, category, or subcategory
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
 *         name: subcategory_id
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
 *         description: Filtered asset capacities retrieved successfully
 *       500:
 *         description: Error filtering asset capacities
 */
router.get("/filterAssetCapacities", verifyToken, filterAssetCapacities);

/**
 * @swagger
 * /api/asset-capacities/exportFilteredAssetCapacitiesToCSV:
 *   get:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Export filtered asset capacities to CSV
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
 *         name: subcategory_id
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
router.get("/exportFilteredAssetCapacitiesToCSV", verifyToken, exportFilteredAssetCapacitiesToCSV);

/**
 * @swagger
 * /api/asset-capacities/exportFilteredAssetCapacitiesToPDF:
 *   get:
 *     tags:
 *       - Manage Asset Capacities
 *     summary: Export filtered asset capacities to PDF
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
 *         name: subcategory_id
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
router.get("/exportFilteredAssetCapacitiesToPDF", verifyToken, exportFilteredAssetCapacitiesToPDF);

module.exports = router;