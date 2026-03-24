const express = require("express");
const {
  createModelAsset,
  updateModelAsset,
  deleteModelAsset,
  getModelAssetById,
  getAllModelAssets,
  filterModelAssets,
  exportFilteredModelAssetsToCSV,
  exportFilteredModelAssetsToPDF,
} = require("../controllers/modelAssetController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/model-assets/filter:
 *   get:
 *     tags: [Manage Asset Models]
 *     summary: Filter by status (paginated)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Filtered list }
 */
router.get("/filter", verifyToken, filterModelAssets);

/**
 * @swagger
 * /api/model-assets/create:
 *   post:
 *     tags: [Manage Asset Models]
 *     summary: Create a new asset model
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturer_id: { type: integer }
 *               model:          { type: string }
 *               status:         { type: string, enum: [Active, Inactive] }
 *     responses:
 *       201: { description: Asset model created }
 *       500: { description: Server error }
 */
router.post("/create", verifyToken, createModelAsset);

/**
 * @swagger
 * /api/model-assets/update/{id}:
 *   put:
 *     tags: [Manage Asset Models]
 *     summary: Update an asset model
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturer_id: { type: integer }
 *               model:          { type: string }
 *               status:         { type: string, enum: [Active, Inactive] }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 *       500: { description: Server error }
 */
router.put("/update/:id", verifyToken, updateModelAsset);

/**
 * @swagger
 * /api/model-assets/delete/{id}:
 *   delete:
 *     tags: [Manage Asset Models]
 *     summary: Delete an asset model
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 *       500: { description: Server error }
 */
router.delete("/delete/:id", verifyToken, deleteModelAsset);

/**
 * @swagger
 * /api/model-assets/{id}:
 *   get:
 *     tags: [Manage Asset Models]
 *     summary: Get asset model by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Model details }
 *       404: { description: Not found }
 */
router.get("/:id", verifyToken, getModelAssetById);

/**
 * @swagger
 * /api/model-assets:
 *   get:
 *     tags: [Manage Asset Models]
 *     summary: Get all asset models (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: List with pagination }
 */
router.get("/", verifyToken, getAllModelAssets);

/**
 * @swagger
 * /api/model-assets/filter:
 *   get:
 *     tags: [Manage Asset Models]
 *     summary: Filter by status (paginated)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Filtered list }
 */
router.get("/filter", verifyToken, filterModelAssets);

/**
 * @swagger
 * /api/model-assets/export/csv:
 *   get:
 *     tags: [Manage Asset Models]
 *     summary: Export filtered models to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: CSV file }
 */
router.get("/export/csv", verifyToken, exportFilteredModelAssetsToCSV);

/**
 * @swagger
 * /api/model-assets/export/pdf:
 *   get:
 *     tags: [Manage Asset Models]
 *     summary: Export filtered models to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: PDF file }
 */
router.get("/export/pdf", verifyToken, exportFilteredModelAssetsToPDF);

module.exports = router;