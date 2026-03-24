const express = require("express");
const {
  createBackupManpowerStage,
  updateBackupManpowerStage,
  deleteBackupManpowerStage,
  getBackupManpowerStageById,
  getAllBackupManpowerStages,
  filterBackupManpowerStages,
  getBackupManpowerStagesBySalesOrder,
  exportFilteredBackupManpowerStagesToCSV,
  exportFilteredBackupManpowerStagesToPDF,
  getBackupManopowerStagesByManpowerId,
} = require("../../controllers/fleet-management/backupManpowerStageController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/backup-manpower-stages/createBackupManpowerStage:
 *   post:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Create a new backup manpower stage
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
 *                 description: Name of the backup manpower stage
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
 *         description: Backup manpower stage created successfully
 *       500:
 *         description: Error creating backup manpower stage
 */
router.post("/createBackupManpowerStage", verifyToken, createBackupManpowerStage);

/**
 * @swagger
 * /api/backup-manpower-stages/updateBackupManpowerStage/{backup_manpower_stage_id}:
 *   put:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Update an existing backup manpower stage
 *     parameters:
 *       - in: path
 *         name: backup_manpower_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the backup manpower stage to update
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
 *                 description: Name of the backup manpower stage
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
 *         description: Backup manpower stage updated successfully
 *       404:
 *         description: Backup manpower stage not found
 *       500:
 *         description: Error updating backup manpower stage
 */
router.put("/updateBackupManpowerStage/:backup_manpower_stage_id", verifyToken, updateBackupManpowerStage);

/**
 * @swagger
 * /api/backup-manpower-stages/deleteBackupManpowerStage/{backup_manpower_stage_id}:
 *   delete:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Delete a backup manpower stage by ID
 *     parameters:
 *       - in: path
 *         name: backup_manpower_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the backup manpower stage to delete
 *     responses:
 *       200:
 *         description: Backup manpower stage deleted successfully
 *       404:
 *         description: Backup manpower stage not found
 *       500:
 *         description: Error deleting backup manpower stage
 */
router.delete("/deleteBackupManpowerStage/:backup_manpower_stage_id", verifyToken, deleteBackupManpowerStage);

/**
 * @swagger
 * /api/backup-manpower-stages/backupManpowerStage/{backup_manpower_stage_id}:
 *   get:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Get a single backup manpower stage by ID
 *     parameters:
 *       - in: path
 *         name: backup_manpower_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the backup manpower stage
 *     responses:
 *       200:
 *         description: Backup manpower stage retrieved successfully
 *       404:
 *         description: Backup manpower stage not found
 */
router.get("/backupManpowerStage/:backup_manpower_stage_id", verifyToken, getBackupManpowerStageById);

/**
 * @swagger
 * /api/backup-manpower-stages/backupManpowerStages:
 *   get:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Get all backup manpower stages with pagination
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
 *         description: Backup manpower stages retrieved successfully
 *       500:
 *         description: Error retrieving backup manpower stages
 */
router.get("/backupManpowerStages", verifyToken, getAllBackupManpowerStages);

/**
 * @swagger
 * /api/backup-manpower-stages/filterBackupManpowerStages:
 *   get:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Filter backup manpower stages by closure status and sales order
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
 *         description: Filtered backup manpower stages retrieved successfully
 *       500:
 *         description: Error filtering backup manpower stages
 */
router.get("/filterBackupManpowerStages", verifyToken, filterBackupManpowerStages);

/**
 * @swagger
 * /api/backup-manpower-stages/salesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Get all backup manpower stages for a specific sales order
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
 *         description: Backup manpower stages for sales order retrieved successfully
 *       500:
 *         description: Error retrieving backup manpower stages for sales order
 */
router.get("/salesOrder/:so_id", verifyToken, getBackupManpowerStagesBySalesOrder);

/**
 * @swagger
 * /api/backup-manpower-stages/exportFilteredBackupManpowerStagesToCSV:
 *   get:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Export filtered backup manpower stages to CSV
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
router.get("/exportFilteredBackupManpowerStagesToCSV", verifyToken, exportFilteredBackupManpowerStagesToCSV);

/**
 * @swagger
 * /api/backup-manpower-stages/exportFilteredBackupManpowerStagesToPDF:
 *   get:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Export filtered backup manpower stages to PDF
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
router.get("/exportFilteredBackupManpowerStagesToPDF", verifyToken, exportFilteredBackupManpowerStagesToPDF);

/**
 * @swagger
 * /api/backup-manpower-stages/backup-manpower/{manpower_id}:
 *   get:
 *     tags:
 *       - Manage Backup Manpower Stages
 *     summary: Get all backup manpower stages for a specific manpower ID
 *     parameters:
 *       - in: path
 *         name: manpower_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Manpower ID
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
 *         description: Manpower stages for backup manpower ID retrieved successfully
 *       500:
 *         description: Error retrieving backup manpower stages for manpower ID
 */
router.get("/backup-manpower/:manpower_id", verifyToken, getBackupManopowerStagesByManpowerId);

module.exports = router;