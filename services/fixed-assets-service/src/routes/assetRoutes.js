const express = require("express");
const {
  uploadAssets,
  createAsset,
  updateAsset,
  getAssetPhotos,
  getAssetDocuments,
  serveAssetFile,
  deleteAsset,
  getAssetById,
  getAssetByTagNumber,
  getAllAssets,
  filterAssets,
  exportAssetRegisterToCSV,
  exportAssetRegisterToPDF,
} = require("../controllers/assetController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/assets/create:
 *   post:
 *     tags:
 *       - Assets
 *     summary: Create a new asset
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               asset_number:
 *                 type: string
 *                 maxLength: 10
 *                 description: System-generated unique asset number (e.g., AX-FA-00001)
 *                 readOnly: true
 *               tag_number:
 *                 type: string
 *                 maxLength: 50
 *               serial_number:
 *                 type: string
 *                 maxLength: 50
 *               engine_number:
 *                 type: string
 *                 maxLength: 50
 *               year_of_manufacture:
 *                 type: integer
 *               manufacturer:
 *                 type: string
 *                 maxLength: 100
 *               model:
 *                 type: string
 *                 maxLength: 100
 *               vehicle_type:
 *                 type: string
 *                 maxLength: 100
 *               VIN:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               classification_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               capacity_id:
 *                 type: integer
 *               location_name:
 *                 type: string
 *               cost_center_name:
 *                 type: string
 *               departmentName:
 *                 type: string
 *               custodian_name:
 *                 type: string
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *               acquisition_cost:
 *                 type: number
 *               supplier_name:
 *                 type: string
 *               purchase_order_id:
 *                 type: string
 *                 maxLength: 20
 *               useful_life:
 *                 type: integer
 *               residual_value:
 *                 type: number
 *               current_value:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive, disposed, transferred, in_construction]
 *               barcode:
 *                 type: string
 *                 maxLength: 100
 *               rfid_tag:
 *                 type: string
 *                 maxLength: 100
 *               journal_entry_id:
 *                 type: string
 *                 maxLength: 20
 *               is_cwip:
 *                 type: boolean
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               warranty_details:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating asset
 */
router.post("/create", verifyToken, uploadAssets, createAsset);

/**
 * @swagger
 * /api/assets/update/{asset_id}:
 *   put:
 *     tags:
 *       - Assets
 *     summary: Update an existing asset
 *     parameters:
 *       - in: path
 *         name: asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tag_number:
 *                 type: string
 *                 maxLength: 50
 *               serial_number:
 *                 type: string
 *                 maxLength: 50
 *               engine_number:
 *                 type: string
 *                 maxLength: 50
 *               year_of_manufacture:
 *                 type: integer
 *               manufacturer:
 *                 type: string
 *                 maxLength: 100
 *               model:
 *                 type: string
 *                 maxLength: 100
 *               vehicle_type:
 *                 type: string
 *                 maxLength: 100
 *               VIN:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               classification_id:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               capacity_id:
 *                 type: integer
 *               location_name:
 *                 type: string
 *               cost_center_name:
 *                 type: string
 *               departmentName:
 *                 type: string
 *               custodian_name:
 *                 type: string
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *               acquisition_cost:
 *                 type: number
 *               supplier_name:
 *                 type: string
 *               purchase_order_id:
 *                 type: string
 *                 maxLength: 20
 *               useful_life:
 *                 type: integer
 *               residual_value:
 *                 type: number
 *               current_value:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive, disposed, transferred, in_construction]
 *               barcode:
 *                 type: string
 *                 maxLength: 100
 *               rfid_tag:
 *                 type: string
 *                 maxLength: 100
 *               journal_entry_id:
 *                 type: string
 *                 maxLength: 20
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               existing_photos:
 *                 type: string
 *               existing_documents:
 *                 type: string
 *               warranty_details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset updated successfully
 *       404:
 *         description: Asset not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating asset
 */
router.put("/update/:asset_id", verifyToken, uploadAssets, updateAsset);

/**
 * @swagger
 * /api/assets/{asset_id}/photos:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Get photos for an asset
 *     parameters:
 *       - in: path
 *         name: asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset
 *     responses:
 *       200:
 *         description: Asset photos retrieved successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error retrieving photos
 */
router.get("/:asset_id/photos", verifyToken, getAssetPhotos);

/**
 * @swagger
 * /api/assets/{asset_id}/documents:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Get documents for an asset
 *     parameters:
 *       - in: path
 *         name: asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset
 *     responses:
 *       200:
 *         description: Asset documents retrieved successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error retrieving documents
 */
router.get("/:asset_id/documents", verifyToken, getAssetDocuments);

/**
 * @swagger
 * /api/assets/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Serve an asset file
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [assetsImages, assetsDocs]
 *         description: Folder containing the file (assetsImages or assetsDocs)
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/msword:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid folder
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", verifyToken, serveAssetFile);

/**
 * @swagger
 * /api/assets/delete/{asset_id}:
 *   delete:
 *     tags:
 *       - Assets
 *     summary: Delete an asset by ID
 *     parameters:
 *       - in: path
 *         name: asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset to delete
 *     responses:
 *       200:
 *         description: Asset deleted successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error deleting asset
 */
router.delete("/delete/:asset_id", verifyToken, deleteAsset);

/**
 * @swagger
 * /api/assets/{asset_id}:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Get a single asset by ID
 *     parameters:
 *       - in: path
 *         name: asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the asset
 *     responses:
 *       200:
 *         description: Asset retrieved successfully
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error retrieving asset
 */
router.get("/:asset_id", verifyToken, getAssetById);

/**
 * @swagger
 * /api/assets/{tag_number}:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Get a single asset by tag number
 *     parameters:
 *       - in: path
 *         name: tag_number
 *         required: true
 *         schema:
 *           type: string
 *         description: Tag number of the asset
 *     responses:
 *       200:
 *         description: Asset retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tag_number:
 *                   type: string
 *                 location_name:
 *                   type: string
 *                   nullable: true
 *                 departmentName:
 *                   type: string
 *                   nullable: true
 *                 cost_center_name:
 *                   type: string
 *                   nullable: true
 *                 custodian_name:
 *                   type: string
 *                   nullable: true
 *       404:
 *         description: Asset not found
 *       500:
 *         description: Error retrieving asset
 */
router.get('/:tag_number', verifyToken, getAssetByTagNumber);

/**
 * @swagger
 * /api/assets:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Get all assets with pagination
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
 *         description: Assets retrieved successfully
 *       500:
 *         description: Error retrieving assets
 */
router.get("/", verifyToken, getAllAssets);

/**
 * @swagger
 * /api/assets/filter:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Filter assets by status, category, location, or department
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, active, inactive, disposed, transferred, in_construction]
 *       - in: query
 *         name: category_id
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: location_name
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: departmentName
 *         required: false
 *         schema:
 *           type: string
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
 *         description: Filtered assets retrieved successfully
 *       500:
 *         description: Error filtering assets
 */
router.get("/filter", verifyToken, filterAssets);

/**
 * @swagger
 * /api/assets/export/csv:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Export filtered assets to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, active, inactive, disposed, transferred, in_construction]
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: location_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: departmentName
 *         schema:
 *           type: string
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
 *       404:
 *         description: No assets found
 *       500:
 *         description: Error exporting CSV
 */
router.get("/export/csv", verifyToken, exportAssetRegisterToCSV);

/**
 * @swagger
 * /api/assets/export/pdf:
 *   get:
 *     tags:
 *       - Assets
 *     summary: Export filtered assets to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, active, inactive, disposed, transferred, in_construction]
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: location_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: departmentName
 *         schema:
 *           type: string
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
 *       404:
 *         description: No assets found
 *       500:
 *         description: Error exporting PDF
 */
router.get("/export/pdf", verifyToken, exportAssetRegisterToPDF);

module.exports = router;