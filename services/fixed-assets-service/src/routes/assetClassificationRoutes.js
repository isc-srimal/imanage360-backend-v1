const express = require('express');
const {
  createAssetClassification,
  updateAssetClassification,
  deleteAssetClassification,
  getAssetClassificationById,
  getAllAssetClassifications,
  exportAssetClassificationsToCSV,
  exportAssetClassificationsToPDF,
} = require('../controllers/assetClassificationController');
const { verifyToken } = require('../../../../api-gateway/src/middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/asset-classifications/create:
 *   post:
 *     tags:
 *       - Asset Classifications
 *     summary: Create a new asset classification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classification_name
 *               - category_id
 *               - subcategory_id
 *               - capacity_id
 *               - default_dep_method
 *               - gl_account_id
 *             properties:
 *               classification_name:
 *                 type: string
 *                 maxLength: 250
 *                 description: Name of the asset classification
 *               category_id:
 *                 type: integer
 *                 description: ID of the parent category
 *               subcategory_id:
 *                 type: integer
 *                 description: ID of the parent subcategory
 *               capacity_id:
 *                 type: integer
 *                 description: ID of the capacity
 *               default_dep_method:
 *                 type: string
 *                 enum: [straight_line, declining_balance, units_of_production]
 *                 description: Depreciation method for the asset classification
 *               default_dep_rate:
 *                 type: number
 *                 minimum: 0
 *                 description: Depreciation rate percentage (not applicable for units_of_production)
 *               default_useful_life:
 *                 type: integer
 *                 minimum: 1
 *                 description: Useful life in years (not applicable for units_of_production)
 *               units_of_measurement:
 *                 type: string
 *                 enum: [Km, Hrs, Units]
 *                 description: Units of measurement (required for units_of_production method)
 *               total_output:
 *                 type: integer
 *                 minimum: 1
 *                 description: Total expected output over asset's life (required for units_of_production method)
 *               gl_account_id:
 *                 type: string
 *                 maxLength: 20
 *                 description: General Ledger account ID
 *           examples:
 *             straight_line:
 *               summary: Straight Line Depreciation
 *               value:
 *                 classification_name: "Office Computers"
 *                 category_id: 1
 *                 subcategory_id: 2
 *                 capacity_id: 3
 *                 default_dep_method: "straight_line"
 *                 default_dep_rate: 20
 *                 default_useful_life: 5
 *                 gl_account_id: "ACC004"
 *             units_of_production:
 *               summary: Units of Production Depreciation
 *               value:
 *                 classification_name: "Production Machine"
 *                 category_id: 1
 *                 subcategory_id: 2
 *                 capacity_id: 3
 *                 default_dep_method: "units_of_production"
 *                 units_of_measurement: "Units"
 *                 total_output: 100000
 *                 gl_account_id: "ACC005"
 *             declining_balance:
 *               summary: Declining Balance Depreciation
 *               value:
 *                 classification_name: "Delivery Vehicles"
 *                 category_id: 1
 *                 subcategory_id: 2
 *                 capacity_id: 3
 *                 default_dep_method: "declining_balance"
 *                 default_dep_rate: 30
 *                 gl_account_id: "ACC006"
 *     responses:
 *       201:
 *         description: Asset classification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 classification:
 *                   type: object
 *                   properties:
 *                     classification_id:
 *                       type: integer
 *                     classification_name:
 *                       type: string
 *                     category_id:
 *                       type: integer
 *                     subcategory_id:
 *                       type: integer
 *                     capacity_id:
 *                       type: integer
 *                     default_dep_method:
 *                       type: string
 *                     default_dep_rate:
 *                       type: number
 *                       nullable: true
 *                     default_useful_life:
 *                       type: integer
 *                       nullable: true
 *                     units_of_measurement:
 *                       type: string
 *                       nullable: true
 *                     total_output:
 *                       type: integer
 *                       nullable: true
 *                     gl_account_id:
 *                       type: string
 *                 calculated_values:
 *                   type: object
 *                   properties:
 *                     final_dep_rate:
 *                       type: number
 *                       nullable: true
 *                     final_useful_life:
 *                       type: integer
 *                       nullable: true
 *                     units_of_measurement:
 *                       type: string
 *                       nullable: true
 *                     total_output:
 *                       type: integer
 *                       nullable: true
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Referenced category, subcategory, or capacity not found
 *       500:
 *         description: Error creating asset classification
 */
router.post('/create', verifyToken, createAssetClassification);

/**
 * @swagger
 * /api/asset-classifications/update/{classification_id}:
 *   put:
 *     tags:
 *       - Asset Classifications
 *     summary: Update an existing asset classification
 *     parameters:
 *       - in: path
 *         name: classification_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset classification to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classification_name:
 *                 type: string
 *                 maxLength: 250
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               capacity_id:
 *                 type: integer
 *               default_dep_method:
 *                 type: string
 *                 enum: [straight_line, declining_balance, units_of_production]
 *               default_dep_rate:
 *                 type: number
 *                 minimum: 0
 *               default_useful_life:
 *                 type: integer
 *                 minimum: 1
 *               units_of_measurement:
 *                 type: string
 *                 enum: [Km, Hrs, Units]
 *               total_output:
 *                 type: integer
 *                 minimum: 1
 *               gl_account_id:
 *                 type: string
 *                 maxLength: 20
 *           examples:
 *             update_to_units_of_production:
 *               summary: Update to Units of Production
 *               value:
 *                 classification_name: "Updated Production Machine"
 *                 default_dep_method: "units_of_production"
 *                 units_of_measurement: "Hrs"
 *                 total_output: 50000
 *     responses:
 *       200:
 *         description: Asset classification updated successfully
 *       404:
 *         description: Asset classification or referenced records not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating asset classification
 */
router.put('/update/:classification_id', verifyToken, updateAssetClassification);

/**
 * @swagger
 * /api/asset-classifications/delete/{classification_id}:
 *   delete:
 *     tags:
 *       - Asset Classifications
 *     summary: Delete an asset classification by ID
 *     parameters:
 *       - in: path
 *         name: classification_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset classification to delete
 *     responses:
 *       200:
 *         description: Asset classification deleted successfully
 *       404:
 *         description: Asset classification not found
 *       500:
 *         description: Error deleting asset classification
 */
router.delete('/delete/:classification_id', verifyToken, deleteAssetClassification);

/**
 * @swagger
 * /api/asset-classifications/{classification_id}:
 *   get:
 *     tags:
 *       - Asset Classifications
 *     summary: Get a single asset classification by ID
 *     parameters:
 *       - in: path
 *         name: classification_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset classification
 *     responses:
 *       200:
 *         description: Asset classification retrieved successfully
 *       404:
 *         description: Asset classification not found
 *       500:
 *         description: Error retrieving asset classification
 */
router.get('/:classification_id', verifyToken, getAssetClassificationById);

/**
 * @swagger
 * /api/asset-classifications:
 *   get:
 *     tags:
 *       - Asset Classifications
 *     summary: Get all asset classifications with pagination
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
 *         description: Asset classifications retrieved successfully
 *       500:
 *         description: Error retrieving asset classifications
 */
router.get('/', verifyToken, getAllAssetClassifications);

/**
 * @swagger
 * /api/asset-classifications/export/csv:
 *   get:
 *     tags:
 *       - Asset Classifications
 *     summary: Export asset classifications to CSV
 *     parameters:
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
 *         description: No asset classifications found
 *       500:
 *         description: Error exporting CSV
 */
router.get('/export/csv', verifyToken, exportAssetClassificationsToCSV);

/**
 * @swagger
 * /api/asset-classifications/export/pdf:
 *   get:
 *     tags:
 *       - Asset Classifications
 *     summary: Export asset classifications to PDF
 *     parameters:
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
 *         description: No asset classifications found
 *       500:
 *         description: Error exporting PDF
 */
router.get('/export/pdf', verifyToken, exportAssetClassificationsToPDF);

module.exports = router;