const express = require('express');
const {
  createAssetDisposal,
  updateAssetDisposal,
  deleteAssetDisposal,
  getAssetDisposalById,
  getAllAssetDisposals,
  exportAssetDisposalsToCSV,
  exportAssetDisposalsToPDF,
} = require('../controllers//assetDisposalController');
const { verifyToken } = require('../../../../api-gateway/src/middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'services/fixed-assets-service/public/uploads/assetDisposalDocuments');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

/**
 * @swagger
 * /api/asset-disposals/create:
 *   post:
 *     tags:
 *       - Asset Disposals
 *     summary: Create a new asset disposal
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *               sub_asset_descriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *               disposal_date:
 *                 type: string
 *                 format: date
 *               disposal_type:
 *                 type: string
 *                 enum: [sale, scrap, donation, write_off]
 *               disposal_amount:
 *                 type: number
 *               disposal_reason:
 *                 type: string
 *                 maxLength: 255
 *               approved_by_gm:
 *                 type: integer
 *               approved_by_fm:
 *                 type: integer
 *               invoice_number:
 *                 type: string
 *                 maxLength: 50
 *               document_proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Asset disposal created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating asset disposal
 */
router.post('/create', verifyToken, upload.single('document_proof'), createAssetDisposal);

/**
 * @swagger
 * /api/asset-disposals/update/{disposal_id}:
 *   put:
 *     tags:
 *       - Asset Disposals
 *     summary: Update an existing asset disposal
 *     parameters:
 *       - in: path
 *         name: disposal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset disposal to update
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *               sub_asset_descriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *               disposal_date:
 *                 type: string
 *                 format: date
 *               disposal_type:
 *                 type: string
 *                 enum: [sale, scrap, donation, write_off]
 *               disposal_amount:
 *                 type: number
 *               disposal_reason:
 *                 type: string
 *                 maxLength: 255
 *               approved_by_gm:
 *                 type: integer
 *               approved_by_fm:
 *                 type: integer
 *               invoice_number:
 *                 type: string
 *                 maxLength: 50
 *               document_proof:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Asset disposal updated successfully
 *       404:
 *         description: Asset disposal not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating asset disposal
 */
router.put('/update/:disposal_id', verifyToken, upload.single('document_proof'), updateAssetDisposal);

/**
 * @swagger
 * /api/asset-disposals/delete/{disposal_id}:
 *   delete:
 *     tags:
 *       - Asset Disposals
 *     summary: Delete an asset disposal by ID
 *     parameters:
 *       - in: path
 *         name: disposal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset disposal to delete
 *     responses:
 *       200:
 *         description: Asset disposal deleted successfully
 *       404:
 *         description: Asset disposal not found
 *       500:
 *         description: Error deleting asset disposal
 */
router.delete('/delete/:disposal_id', verifyToken, deleteAssetDisposal);

/**
 * @swagger
 * /api/asset-disposals/{disposal_id}:
 *   get:
 *     tags:
 *       - Asset Disposals
 *     summary: Get a single asset disposal by ID
 *     parameters:
 *       - in: path
 *         name: disposal_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset disposal
 *     responses:
 *       200:
 *         description: Asset disposal retrieved successfully
 *       404:
 *         description: Asset disposal not found
 *       500:
 *         description: Error retrieving asset disposal
 */
router.get('/:disposal_id', verifyToken, getAssetDisposalById);

/**
 * @swagger
 * /api/asset-disposals:
 *   get:
 *     tags:
 *       - Asset Disposals
 *     summary: Get all asset disposals with pagination
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
 *         description: Asset disposals retrieved successfully
 *       500:
 *         description: Error retrieving asset disposals
 */
router.get('/', verifyToken, getAllAssetDisposals);

/**
 * @swagger
 * /api/asset-disposals/export/csv:
 *   get:
 *     tags:
 *       - Asset Disposals
 *     summary: Export asset disposals to CSV
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
 *         description: No asset disposals found
 *       500:
 *         description: Error exporting CSV
 */
router.get('/export/csv', verifyToken, exportAssetDisposalsToCSV);

/**
 * @swagger
 * /api/asset-disposals/export/pdf:
 *   get:
 *     tags:
 *       - Asset Disposals
 *     summary: Export asset disposals to PDF
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
 *         description: No asset disposals found
 *       500:
 *         description: Error exporting PDF
 */
router.get('/export/pdf', verifyToken, exportAssetDisposalsToPDF);

module.exports = router;