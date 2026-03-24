const express = require('express');
const {
  createAssetTransfer,
  updateAssetTransfer,
  deleteAssetTransfer,
  approveAssetTransfer,
  rejectAssetTransfer,
  getAssetTransferById,
  getAllAssetTransfers,
  exportAssetTransfersToCSV,
  exportAssetTransfersToPDF,
} = require('../controllers/assetTransferController');
const { verifyToken } = require('../../../../api-gateway/src/middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/asset-transfers/create:
 *   post:
 *     tags:
 *       - Asset Transfers
 *     summary: Create a new asset transfer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_number:
 *                 type: string
 *                 maxLength: 50
 *               sub_asset_descriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *               to_location_name:
 *                 type: string
 *                 maxLength: 50
 *               to_department_name:
 *                 type: string
 *                 maxLength: 50
 *               to_cost_center_name:
 *                 type: string
 *                 maxLength: 50
 *               transfer_date:
 *                 type: string
 *                 format: date
 *               transfer_reason:
 *                 type: string
 *                 maxLength: 255
 *               initiated_by:
 *                 type: integer
 *               approved_by:
 *                 type: integer
 *               finance_approved_by:
 *                 type: integer
 *               approval_date:
 *                 type: string
 *                 format: date
 *               finance_approval_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, manager_approved, finance_approved, rejected]
 *     responses:
 *       201:
 *         description: Asset transfer created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating asset transfer
 */
router.post('/create', verifyToken, createAssetTransfer);

/**
 * @swagger
 * /api/asset-transfers/update/{transfer_id}:
 *   put:
 *     tags:
 *       - Asset Transfers
 *     summary: Update an existing asset transfer
 *     parameters:
 *       - in: path
 *         name: transfer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset transfer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to_location_name:
 *                 type: string
 *                 maxLength: 50
 *               to_department_name:
 *                 type: string
 *                 maxLength: 50
 *               to_cost_center_name:
 *                 type: string
 *                 maxLength: 50
 *               transfer_date:
 *                 type: string
 *                 format: date
 *               transfer_reason:
 *                 type: string
 *                 maxLength: 255
 *               initiated_by:
 *                 type: integer
 *               approved_by:
 *                 type: integer
 *               finance_approved_by:
 *                 type: integer
 *               approval_date:
 *                 type: string
 *                 format: date
 *               finance_approval_date:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [pending, manager_approved, finance_approved, rejected]
 *     responses:
 *       200:
 *         description: Asset transfer updated successfully
 *       404:
 *         description: Asset transfer not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating asset transfer
 */
router.put('/update/:transfer_id', verifyToken, updateAssetTransfer);

/**
 * @swagger
 * /api/asset-transfers/delete/{transfer_id}:
 *   delete:
 *     tags:
 *       - Asset Transfers
 *     summary: Delete an asset transfer by ID
 *     parameters:
 *       - in: path
 *         name: transfer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset transfer to delete
 *     responses:
 *       200:
 *         description: Asset transfer deleted successfully
 *       404:
 *         description: Asset transfer not found
 *       500:
 *         description: Error deleting asset transfer
 */
router.delete('/delete/:transfer_id', verifyToken, deleteAssetTransfer);

/**
 * @swagger
 * /api/asset-transfers/approve/{transfer_id}:
 *   put:
 *     tags:
 *       - Asset Transfers
 *     summary: Approve an asset transfer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset transfer approved successfully
 *       404:
 *         description: Asset transfer not found
 *       500:
 *         description: Error approving asset transfer
 */
router.put('/approve/:transfer_id', verifyToken, approveAssetTransfer);



/**
 * @swagger
 * /api/asset-transfers/reject/{transfer_id}:
 *   put:
 *     tags:
 *       - Asset Transfers
 *     summary: Reject an asset transfer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset transfer rejected successfully
 *       404:
 *         description: Asset transfer not found
 *       500:
 *         description: Error rejecting asset transfer
 */
router.put('/reject/:transfer_id', verifyToken, rejectAssetTransfer);


/**
 * @swagger
 * /api/asset-transfers/{transfer_id}:
 *   get:
 *     tags:
 *       - Asset Transfers
 *     summary: Get a single asset transfer by ID
 *     parameters:
 *       - in: path
 *         name: transfer_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the asset transfer
 *     responses:
 *       200:
 *         description: Asset transfer retrieved successfully
 *       404:
 *         description: Asset transfer not found
 *       500:
 *         description: Error retrieving asset transfer
 */
router.get('/:transfer_id', verifyToken, getAssetTransferById);

/**
 * @swagger
 * /api/asset-transfers:
 *   get:
 *     tags:
 *       - Asset Transfers
 *     summary: Get all asset transfers with pagination
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
 *         description: Asset transfers retrieved successfully
 *       500:
 *         description: Error retrieving asset transfers
 */
router.get('/', verifyToken, getAllAssetTransfers);

/**
 * @swagger
 * /api/asset-transfers/export/csv:
 *   get:
 *     tags:
 *       - Asset Transfers
 *     summary: Export asset transfers to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, pending, manager_approved, finance_approved, rejected]
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
 *         description: No asset transfers found
 *       500:
 *         description: Error exporting CSV
 */
router.get('/export/csv', verifyToken, exportAssetTransfersToCSV);

/**
 * @swagger
 * /api/asset-transfers/export/pdf:
 *   get:
 *     tags:
 *       - Asset Transfers
 *     summary: Export asset transfers to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, pending, manager_approved, finance_approved, rejected]
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
 *         description: No asset transfers found
 *       500:
 *         description: Error exporting PDF
 */
router.get('/export/pdf', verifyToken, exportAssetTransfersToPDF);

module.exports = router;