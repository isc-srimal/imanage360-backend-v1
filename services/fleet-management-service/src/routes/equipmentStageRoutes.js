const express = require("express");
const {
  createEquipmentStage,
  updateEquipmentStage,
  deleteEquipmentStage,
  getEquipmentStageById,
  getAllEquipmentStages,
  filterEquipmentStages,
  getEquipmentStagesBySalesOrder,
  exportFilteredEquipmentStagesToCSV,
  exportFilteredEquipmentStagesToPDF,
  getEquipmentStagesByEquipmentId,
} = require("../controllers/equipmentStageController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/equipment-stages/createEquipmentStage:
 *   post:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Create a new equipment stage
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
 *                 description: Name of the equipment stage
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
 *         description: Equipment stage created successfully
 *       500:
 *         description: Error creating equipment stage
 */
router.post("/createEquipmentStage", verifyToken, createEquipmentStage);

/**
 * @swagger
 * /api/equipment-stages/updateEquipmentStage/{equipment_stage_id}:
 *   put:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Update an existing equipment stage
 *     parameters:
 *       - in: path
 *         name: equipment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the equipment stage to update
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
 *                 description: Name of the equipment stage
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
 *         description: Equipment stage updated successfully
 *       404:
 *         description: Equipment stage not found
 *       500:
 *         description: Error updating equipment stage
 */
router.put("/updateEquipmentStage/:equipment_stage_id", verifyToken, updateEquipmentStage);

/**
 * @swagger
 * /api/equipment-stages/deleteEquipmentStage/{equipment_stage_id}:
 *   delete:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Delete an equipment stage by ID
 *     parameters:
 *       - in: path
 *         name: equipment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the equipment stage to delete
 *     responses:
 *       200:
 *         description: Equipment stage deleted successfully
 *       404:
 *         description: Equipment stage not found
 *       500:
 *         description: Error deleting equipment stage
 */
router.delete("/deleteEquipmentStage/:equipment_stage_id", verifyToken, deleteEquipmentStage);

/**
 * @swagger
 * /api/equipment-stages/equipmentStage/{equipment_stage_id}:
 *   get:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Get a single equipment stage by ID
 *     parameters:
 *       - in: path
 *         name: equipment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the equipment stage
 *     responses:
 *       200:
 *         description: Equipment stage retrieved successfully
 *       404:
 *         description: Equipment stage not found
 */
router.get("/equipmentStage/:equipment_stage_id", verifyToken, getEquipmentStageById);

/**
 * @swagger
 * /api/equipment-stages/equipmentStages:
 *   get:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Get all equipment stages with pagination
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
 *         description: Equipment stages retrieved successfully
 *       500:
 *         description: Error retrieving equipment stages
 */
router.get("/equipmentStages", verifyToken, getAllEquipmentStages);

/**
 * @swagger
 * /api/equipment-stages/filterEquipmentStages:
 *   get:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Filter equipment stages by closure status and sales order
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
 *         description: Filtered equipment stages retrieved successfully
 *       500:
 *         description: Error filtering equipment stages
 */
router.get("/filterEquipmentStages", verifyToken, filterEquipmentStages);

/**
 * @swagger
 * /api/equipment-stages/salesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Get all equipment stages for a specific sales order
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
 *         description: Equipment stages for sales order retrieved successfully
 *       500:
 *         description: Error retrieving equipment stages for sales order
 */
router.get("/salesOrder/:so_id", verifyToken, getEquipmentStagesBySalesOrder);

/**
 * @swagger
 * /api/equipment-stages/exportFilteredEquipmentStagesToCSV:
 *   get:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Export filtered equipment stages to CSV
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
router.get("/exportFilteredEquipmentStagesToCSV", verifyToken, exportFilteredEquipmentStagesToCSV);

/**
 * @swagger
 * /api/equipment-stages/exportFilteredEquipmentStagesToPDF:
 *   get:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Export filtered equipment stages to PDF
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
router.get("/exportFilteredEquipmentStagesToPDF", verifyToken, exportFilteredEquipmentStagesToPDF);

/**
 * @swagger
 * /api/equipment-stages/equipment/{serial_number}:
 *   get:
 *     tags:
 *       - Manage Equipment Stages
 *     summary: Get all equipment stages for a specific equipment ID
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
 *         description: Equipment stages for equipment ID retrieved successfully
 *       500:
 *         description: Error retrieving equipment stages for equipment ID
 */
router.get("/equipment/:serial_number", verifyToken, getEquipmentStagesByEquipmentId);

module.exports = router;