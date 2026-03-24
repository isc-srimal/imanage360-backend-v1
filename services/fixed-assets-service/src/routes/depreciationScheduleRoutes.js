const express = require('express');
const {
  calculateDepreciationForAllEmployeesHandler,
  approveDepreciationSchedule,
  rejectDepreciationSchedule,
  updateDepreciationSchedule,
  deleteDepreciationSchedule,
  getDepreciationScheduleById,
  getAllDepreciationSchedules,
  exportDepreciationSchedulesToCSV,
  exportDepreciationSchedulesToPDF,
} = require('../controllers/depreciationScheduleController');
const { verifyToken } = require('../../../../api-gateway/src/middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/depreciation-schedules/calculateDepreciationForAllAssets:
 *   post:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Calculate depreciation for all assets
 *     description: Calculates depreciation for all active assets, including monthly and yearly provisions, and updates schedules.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 5
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Depreciation calculated successfully
 *       400:
 *         description: Missing required input data
 *       500:
 *         description: Internal server error
 */
router.post('/calculateDepreciationForAllAssets', verifyToken, calculateDepreciationForAllEmployeesHandler);

/**
 * @swagger
 * /api/depreciation-schedules/update/{schedule_id}:
 *   put:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Update an existing depreciation schedule
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the depreciation schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dep_method:
 *                 type: string
 *                 enum: [straight_line, declining_balance, units_of_production]
 *               dep_rate:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               original_cost:
 *                 type: number
 *               residual_value:
 *                 type: number
 *               fiscal_year:
 *                 type: integer
 *               book_type:
 *                 type: string
 *                 enum: [corporate, tax, ifrs]
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Depreciation schedule updated successfully
 *       404:
 *         description: Depreciation schedule not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating depreciation schedule
 */
router.put('/update/:schedule_id', verifyToken, updateDepreciationSchedule);

/**
 * @swagger
 * /api/depreciation-schedules/approve/{schedule_id}:
 *   put:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Approve a depreciation schedule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Depreciation schedule approved successfully
 *       404:
 *         description: Depreciation schedule not found
 *       500:
 *         description: Error approving depreciation schedule
 */
router.put('/approve/:schedule_id', verifyToken, approveDepreciationSchedule);

/**
 * @swagger
 * /api/depreciation-schedules/reject/{schedule_id}:
 *   put:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Reject a depreciation schedule
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Depreciation schedule rejected successfully
 *       404:
 *         description: Depreciation schedule not found
 *       500:
 *         description: Error rejecting depreciation schedule
 */
router.put('/reject/:schedule_id', verifyToken, rejectDepreciationSchedule);

/**
 * @swagger
 * /api/depreciation-schedules/delete/{schedule_id}:
 *   delete:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Delete a depreciation schedule by ID
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the depreciation schedule to delete
 *     responses:
 *       200:
 *         description: Depreciation schedule deleted successfully
 *       404:
 *         description: Depreciation schedule not found
 *       500:
 *         description: Error deleting depreciation schedule
 */
router.delete('/delete/:schedule_id', verifyToken, deleteDepreciationSchedule);

/**
 * @swagger
 * /api/depreciation-schedules/{schedule_id}:
 *   get:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Get a single depreciation schedule by ID
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the depreciation schedule
 *     responses:
 *       200:
 *         description: Depreciation schedule retrieved successfully
 *       404:
 *         description: Depreciation schedule not found
 *       500:
 *         description: Error retrieving depreciation schedule
 */
router.get('/:schedule_id', verifyToken, getDepreciationScheduleById);

/**
 * @swagger
 * /api/depreciation-schedules:
 *   get:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Get all depreciation schedules with pagination
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
 *         description: Depreciation schedules retrieved successfully
 *       500:
 *         description: Error retrieving depreciation schedules
 */
router.get('/', verifyToken, getAllDepreciationSchedules);

/**
 * @swagger
 * /api/depreciation-schedules/export/csv:
 *   get:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Export depreciation schedules to CSV
 *     parameters:
 *       - in: query
 *         name: fiscal_year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: asset_category
 *         schema:
 *           type: integer
 *       - in: query
 *         name: cost_center
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
 *       404:
 *         description: No depreciation schedules found
 *       500:
 *         description: Error exporting CSV
 */
router.get('/export/csv', verifyToken, exportDepreciationSchedulesToCSV);

/**
 * @swagger
 * /api/depreciation-schedules/export/pdf:
 *   get:
 *     tags:
 *       - Depreciation Schedules
 *     summary: Export depreciation schedules to PDF
 *     parameters:
 *       - in: query
 *         name: fiscal_year
 *         schema:
 *           type: integer
 *       - in: query
 *         name: asset_category
 *         schema:
 *           type: integer
 *       - in: query
 *         name: cost_center
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
 *       404:
 *         description: No depreciation schedules found
 *       500:
 *         description: Error exporting PDF
 */
router.get('/export/pdf', verifyToken, exportDepreciationSchedulesToPDF);

module.exports = router;