const express = require("express");
const {
  createRecoveryStage,
  updateRecoveryStage,
  deleteRecoveryStage,
  getRecoveryStageById,
  getAllRecoveryStages,
  filterRecoveryStages,
  getRecoveryStagesBySalesOrder,
  exportFilteredRecoveryStagesToCSV,
  exportFilteredRecoveryStagesToPDF,
  getRecoveryStagesByRecoveryId,
} = require("../controllers/recoveryStageController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/recovery-stages/createRecoveryStage:
 *   post:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Create a new recovery stage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               so_id:
 *                 type: integer
 *                 description: Sales Order ID
 *               stage_name:
 *                 type: string
 *                 description: Name of the recovery stage
 *               closure_status:
 *                 type: string
 *                 description: Closure status of the stage
 *               completion_date:
 *                 type: string
 *                 format: date
 *                 description: Completion date of the stage
 *               remarks:
 *                 type: string
 *                 description: Additional remarks
 *     responses:
 *       201:
 *         description: Recovery stage created successfully
 *       500:
 *         description: Error creating recovery stage
 */
router.post("/createRecoveryStage", verifyToken, createRecoveryStage);

/**
 * @swagger
 * /api/recovery-stages/updateRecoveryStage/{recovery_stage_id}:
 *   put:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Update an existing recovery stage
 *     parameters:
 *       - in: path
 *         name: recovery_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recovery stage to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               so_id:
 *                 type: integer
 *                 description: Sales Order ID
 *               stage_name:
 *                 type: string
 *                 description: Name of the recovery stage
 *               closure_status:
 *                 type: string
 *                 description: Closure status of the stage
 *               completion_date:
 *                 type: string
 *                 format: date
 *                 description: Completion date of the stage
 *               remarks:
 *                 type: string
 *                 description: Additional remarks
 *     responses:
 *       200:
 *         description: Recovery stage updated successfully
 *       404:
 *         description: Recovery stage not found
 *       500:
 *         description: Error updating recovery stage
 */
router.put("/updateRecoveryStage/:recovery_stage_id", verifyToken, updateRecoveryStage);

/**
 * @swagger
 * /api/recovery-stages/deleteRecoveryStage/{recovery_stage_id}:
 *   delete:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Delete a recovery stage by ID
 *     parameters:
 *       - in: path
 *         name: recovery_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recovery stage to delete
 *     responses:
 *       200:
 *         description: Recovery stage deleted successfully
 *       404:
 *         description: Recovery stage not found
 *       500:
 *         description: Error deleting recovery stage
 */
router.delete("/deleteRecoveryStage/:recovery_stage_id", verifyToken, deleteRecoveryStage);

/**
 * @swagger
 * /api/recovery-stages/recoveryStage/{recovery_stage_id}:
 *   get:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Get a single recovery stage by ID
 *     parameters:
 *       - in: path
 *         name: recovery_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the recovery stage
 *     responses:
 *       200:
 *         description: Recovery stage retrieved successfully
 *       404:
 *         description: Recovery stage not found
 */
router.get("/recoveryStage/:recovery_stage_id", verifyToken, getRecoveryStageById);

/**
 * @swagger
 * /api/recovery-stages/recoveryStages:
 *   get:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Get all recovery stages with pagination
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
 *         description: Recovery stages retrieved successfully
 *       500:
 *         description: Error retrieving recovery stages
 */
router.get("/recoveryStages", verifyToken, getAllRecoveryStages);

/**
 * @swagger
 * /api/recovery-stages/filterRecoveryStages:
 *   get:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Filter recovery stages by closure status and sales order
 *     parameters:
 *       - in: query
 *         name: closure_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Completed, Pending, In Progress]
 *       - in: query
 *         name: so_id
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
 *         description: Filtered recovery stages retrieved successfully
 *       500:
 *         description: Error filtering recovery stages
 */
router.get("/filterRecoveryStages", verifyToken, filterRecoveryStages);

/**
 * @swagger
 * /api/recovery-stages/salesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Get all recovery stages for a specific sales order
 *     parameters:
 *       - in: path
 *         name: so_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order ID
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
 *         description: Recovery stages for sales order retrieved successfully
 *       500:
 *         description: Error retrieving recovery stages for sales order
 */
router.get("/salesOrder/:so_id", verifyToken, getRecoveryStagesBySalesOrder);

/**
 * @swagger
 * /api/recovery-stages/exportFilteredRecoveryStagesToCSV:
 *   get:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Export filtered recovery stages to CSV
 *     parameters:
 *       - in: query
 *         name: closure_status
 *         schema:
 *           type: string
 *           enum: [All, Completed, Pending, In Progress]
 *       - in: query
 *         name: so_id
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
router.get("/exportFilteredRecoveryStagesToCSV", verifyToken, exportFilteredRecoveryStagesToCSV);

/**
 * @swagger
 * /api/recovery-stages/exportFilteredRecoveryStagesToPDF:
 *   get:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Export filtered recovery stages to PDF
 *     parameters:
 *       - in: query
 *         name: closure_status
 *         schema:
 *           type: string
 *           enum: [All, Completed, Pending, In Progress]
 *       - in: query
 *         name: so_id
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
router.get("/exportFilteredRecoveryStagesToPDF", verifyToken, exportFilteredRecoveryStagesToPDF);

/**
 * @swagger
 * /api/recovery-stages/recovery/{so_recovery_id}:
 *   get:
 *     tags:
 *       - Manage Recovery Stages
 *     summary: Get all recovery stages for a specific recovery ID
 *     parameters:
 *       - in: path
 *         name: so_recovery_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order Recovery ID
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
 *           default: 100
 *     responses:
 *       200:
 *         description: Recovery stages for recovery ID retrieved successfully
 *       500:
 *         description: Error retrieving recovery stages for recovery ID
 */
router.get("/recovery/:so_recovery_id", verifyToken, getRecoveryStagesByRecoveryId);

module.exports = router;