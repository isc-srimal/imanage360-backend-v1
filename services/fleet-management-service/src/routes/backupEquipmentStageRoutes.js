const express = require("express");
const {
  createBackupEquipmentStage,
  updateBackupEquipmentStage,
  deleteBackupEquipmentStage,
  getBackupEquipmentStageById,
  getAllBackupEquipmentStages,
  filterBackupEquipmentStages,
  getBackupEquipmentStagesBySalesOrder,
  exportFilteredBackupEquipmentStagesToCSV,
  exportFilteredBackupEquipmentStagesToPDF,
  getBackupEquipmentStagesByEquipmentId,
} = require("../controllers/backupEquipmentStageController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/backup-equipment-stages/createBackupEquipmentStage:
 *   post:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Create a new backup equipment stage
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
 *                 description: Name of the backup equipment stage
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
 *         description: Backup equipment stage created successfully
 *       500:
 *         description: Error creating backup equipment stage
 */
router.post("/createBackupEquipmentStage", verifyToken, createBackupEquipmentStage);

/**
 * @swagger
 * /api/backup-equipment-stages/updateBackupEquipmentStage/{backup_equipment_stage_id}:
 *   put:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Update an existing backup equipment stage
 *     parameters:
 *       - in: path
 *         name: backup_equipment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the backup equipment stage to update
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
 *                 description: Name of the backup equipment stage
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
 *         description: Backup equipment stage updated successfully
 *       404:
 *         description: Backup equipment stage not found
 *       500:
 *         description: Error updating backup equipment stage
 */
router.put("/updateBackupEquipmentStage/:backup_equipment_stage_id", verifyToken, updateBackupEquipmentStage);

/**
 * @swagger
 * /api/backup-equipment-stages/deleteBackupEquipmentStage/{backup_equipment_stage_id}:
 *   delete:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Delete a backup equipment stage by ID
 *     parameters:
 *       - in: path
 *         name: backup_equipment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the backup equipment stage to delete
 *     responses:
 *       200:
 *         description: Backup equipment stage deleted successfully
 *       404:
 *         description: Backup equipment stage not found
 *       500:
 *         description: Error deleting backup equipment stage
 */
router.delete("/deleteBackupEquipmentStage/:backup_equipment_stage_id", verifyToken, deleteBackupEquipmentStage);

/**
 * @swagger
 * /api/backup-equipment-stages/backupEquipmentStage/{backup_equipment_stage_id}:
 *   get:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Get a single backup equipment stage by ID
 *     parameters:
 *       - in: path
 *         name: backup_equipment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the backup equipment stage
 *     responses:
 *       200:
 *         description: Backup equipment stage retrieved successfully
 *       404:
 *         description: Backup equipment stage not found
 */
router.get("/backupEquipmentStage/:backup_equipment_stage_id", verifyToken, getBackupEquipmentStageById);

/**
 * @swagger
 * /api/backup-equipment-stages/backupEquipmentStages:
 *   get:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Get all backup equipment stages with pagination
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
 *         description: Backup equipment stages retrieved successfully
 *       500:
 *         description: Error retrieving backup equipment stages
 */
router.get("/backupEquipmentStages", verifyToken, getAllBackupEquipmentStages);

/**
 * @swagger
 * /api/backup-equipment-stages/filterBackupEquipmentStages:
 *   get:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Filter backup equipment stages by closure status and sales order
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
 *         description: Filtered backup equipment stages retrieved successfully
 *       500:
 *         description: Error filtering backup equipment stages
 */
router.get("/filterBackupEquipmentStages", verifyToken, filterBackupEquipmentStages);

/**
 * @swagger
 * /api/backup-equipment-stages/salesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Get all backup equipment stages for a specific sales order
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
 *         description: Backup equipment stages for sales order retrieved successfully
 *       500:
 *         description: Error retrieving backup equipment stages for sales order
 */
router.get("/salesOrder/:so_id", verifyToken, getBackupEquipmentStagesBySalesOrder);

/**
 * @swagger
 * /api/backup-equipment-stages/exportFilteredBackupEquipmentStagesToCSV:
 *   get:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Export filtered backup equipment stages to CSV
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
router.get("/exportFilteredBackupEquipmentStagesToCSV", verifyToken, exportFilteredBackupEquipmentStagesToCSV);

/**
 * @swagger
 * /api/backup-equipment-stages/exportFilteredBackupEquipmentStagesToPDF:
 *   get:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Export filtered backup equipment stages to PDF
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
router.get("/exportFilteredBackupEquipmentStagesToPDF", verifyToken, exportFilteredBackupEquipmentStagesToPDF);

/**
 * @swagger
 * /api/backup-equipment-stages/backup-equipment/{serial_number}:
 *   get:
 *     tags:
 *       - Manage Backup Equipment Stages
 *     summary: Get all backup equipment stages for a specific equipment ID
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
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
 *         description: Equipment stages for backup equipment ID retrieved successfully
 *       500:
 *         description: Error retrieving backup equipment stages for equipment ID
 */
router.get("/backup-equipment/:serial_number", verifyToken, getBackupEquipmentStagesByEquipmentId);

module.exports = router;