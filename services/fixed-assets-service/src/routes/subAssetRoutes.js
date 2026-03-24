const express = require('express');
const {
  createSubAsset,
  updateSubAsset,
  deleteSubAsset,
  getSubAssetById,
  getAllSubAssets,
  filterSubAssets,
  exportSubAssetRegisterToCSV,
  exportSubAssetRegisterToPDF,
} = require('../controllers/subAssetController');
const { verifyToken } = require('../../../../api-gateway/src/middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/sub-assets/create:
 *   post:
 *     tags:
 *       - Sub-Assets
 *     summary: Create a new sub-asset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *               tag_numbers:
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
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               classification_id:
 *                 type: integer
 *               asset_number:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               capacity_id:
 *                 type: integer
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *               acquisition_cost:
 *                 type: number
 *               supplier_name:
 *                 type: string
 *               purchase_order_id:
 *                 type: integer
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
 *     responses:
 *       201:
 *         description: Sub-asset created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating sub-asset
 */
router.post('/create', verifyToken, createSubAsset);

/**
 * @swagger
 * /api/sub-assets/update/{sub_asset_id}:
 *   put:
 *     tags:
 *       - Sub-Assets
 *     summary: Update an existing sub-asset
 *     parameters:
 *       - in: path
 *         name: sub_asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sub-asset to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *               tag_numbers:
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
 *               description:
 *                 type: string
 *                 maxLength: 255
 *               classification_id:
 *                 type: integer
 *               asset_number:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               capacity_id:
 *                 type: integer
 *               acquisition_date:
 *                 type: string
 *                 format: date
 *               acquisition_cost:
 *                 type: number
 *               supplier_name:
 *                 type: string
 *               purchase_order_id:
 *                 type: integer
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
 *     responses:
 *       200:
 *         description: Sub-asset updated successfully
 *       404:
 *         description: Sub-asset not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating sub-asset
 */
router.put('/update/:sub_asset_id', verifyToken, updateSubAsset);

/**
 * @swagger
 * /api/sub-assets/delete/{sub_asset_id}:
 *   delete:
 *     tags:
 *       - Sub-Assets
 *     summary: Delete a sub-asset by ID
 *     parameters:
 *       - in: path
 *         name: sub_asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sub-asset to delete
 *     responses:
 *       200:
 *         description: Sub-asset deleted successfully
 *       404:
 *         description: Sub-asset not found
 *       500:
 *         description: Error deleting sub-asset
 */
router.delete('/delete/:sub_asset_id', verifyToken, deleteSubAsset);

/**
 * @swagger
 * /api/sub-assets/{sub_asset_id}:
 *   get:
 *     tags:
 *       - Sub-Assets
 *     summary: Get a single sub-asset by ID
 *     parameters:
 *       - in: path
 *         name: sub_asset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sub-asset
 *     responses:
 *       200:
 *         description: Sub-asset retrieved successfully
 *       404:
 *         description: Sub-asset not found
 *       500:
 *         description: Error retrieving sub-asset
 */
router.get('/:sub_asset_id', verifyToken, getSubAssetById);

/**
 * @swagger
 * /api/sub-assets:
 *   get:
 *     tags:
 *       - Sub-Assets
 *     summary: Get all sub-assets with pagination
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
 *         description: Sub-assets retrieved successfully
 *       500:
 *         description: Error retrieving sub-assets
 */
router.get('/', verifyToken, getAllSubAssets);

/**
 * @swagger
 * /api/sub-assets/filter:
 *   get:
 *     tags:
 *       - Sub-Assets
 *     summary: Filter sub-assets by status, asset_id, or supplier_id
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, active, inactive, disposed, transferred, in_construction]
 *       - in: query
 *         name: asset_id
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: supplier_name
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
 *         description: Filtered sub-assets retrieved successfully
 *       500:
 *         description: Error filtering sub-assets
 */
router.get('/filter', verifyToken, filterSubAssets);

/**
 * @swagger
 * /api/sub-assets/export/csv:
 *   get:
 *     tags:
 *       - Sub-Assets
 *     summary: Export filtered sub-assets to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, active, inactive, disposed, transferred, in_construction]
 *       - in: query
 *         name: asset_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: supplier_name
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
 *         description: No sub-assets found
 *       500:
 *         description: Error exporting CSV
 */
router.get('/export/csv', verifyToken, exportSubAssetRegisterToCSV);

/**
 * @swagger
 * /api/sub-assets/export/pdf:
 *   get:
 *     tags:
 *       - Sub-Assets
 *     summary: Export filtered sub-assets to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, active, inactive, disposed, transferred, in_construction]
 *       - in: query
 *         name: asset_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: supplier_name
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
 *         description: No sub-assets found
 *       500:
 *         description: Error exporting PDF
 */
router.get('/export/pdf', verifyToken, exportSubAssetRegisterToPDF);

module.exports = router;