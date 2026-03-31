const express = require("express");
const {
  createManpowerStage,
  updateManpowerStage,
  deleteManpowerStage,
  getManpowerStageById,
  getAllManpowerStages,
  filterManpowerStages,
  getManpowerStagesBySalesOrder,
  exportFilteredManpowerStagesToCSV,
  exportFilteredManpowerStagesToPDF,
  getManopowerStagesByManpowerId,
} = require("../controllers/manpowerStageController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/manpower-stages/createManpowerStage:
 *   post:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Create a new manpower stage
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
 *                 description: Name of the manpower stage
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
 *         description: Manpower stage created successfully
 *       500:
 *         description: Error creating manpower stage
 */
router.post("/createManpowerStage", verifyToken, createManpowerStage);

/**
 * @swagger
 * /api/manpower-stages/updateManpowerStage/{manpower_stage_id}:
 *   put:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Update an existing manpower stage
 *     parameters:
 *       - in: path
 *         name: manpower_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the manpower stage to update
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
 *                 description: Name of the manpower stage
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
 *         description: Manpower stage updated successfully
 *       404:
 *         description: Manpower stage not found
 *       500:
 *         description: Error updating manpower stage
 */
router.put("/updateManpowerStage/:manpower_stage_id", verifyToken, updateManpowerStage);

/**
 * @swagger
 * /api/manpower-stages/deleteManpowerStage/{manpower_stage_id}:
 *   delete:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Delete a manpower stage by ID
 *     parameters:
 *       - in: path
 *         name: manpower_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the manpower stage to delete
 *     responses:
 *       200:
 *         description: Manpower stage deleted successfully
 *       404:
 *         description: Manpower stage not found
 *       500:
 *         description: Error deleting manpower stage
 */
router.delete("/deleteManpowerStage/:manpower_stage_id", verifyToken, deleteManpowerStage);

/**
 * @swagger
 * /api/manpower-stages/manpowerStage/{manpower_stage_id}:
 *   get:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Get a single manpower stage by ID
 *     parameters:
 *       - in: path
 *         name: manpower_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the manpower stage
 *     responses:
 *       200:
 *         description: Manpower stage retrieved successfully
 *       404:
 *         description: Manpower stage not found
 */
router.get("/manpowerStage/:manpower_stage_id", verifyToken, getManpowerStageById);

/**
 * @swagger
 * /api/manpower-stages/manpowerStages:
 *   get:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Get all manpower stages with pagination
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
 *         description: Manpower stages retrieved successfully
 *       500:
 *         description: Error retrieving manpower stages
 */
router.get("/manpowerStages", verifyToken, getAllManpowerStages);

/**
 * @swagger
 * /api/manpower-stages/filterManpowerStages:
 *   get:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Filter manpower stages by closure status and sales order
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
 *         description: Filtered manpower stages retrieved successfully
 *       500:
 *         description: Error filtering manpower stages
 */
router.get("/filterManpowerStages", verifyToken, filterManpowerStages);

/**
 * @swagger
 * /api/manpower-stages/salesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Get all manpower stages for a specific sales order
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
 *         description: Manpower stages for sales order retrieved successfully
 *       500:
 *         description: Error retrieving manpower stages for sales order
 */
router.get("/salesOrder/:so_id", verifyToken, getManpowerStagesBySalesOrder);

/**
 * @swagger
 * /api/manpower-stages/exportFilteredManpowerStagesToCSV:
 *   get:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Export filtered manpower stages to CSV
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
router.get("/exportFilteredManpowerStagesToCSV", verifyToken, exportFilteredManpowerStagesToCSV);

/**
 * @swagger
 * /api/manpower-stages/exportFilteredManpowerStagesToPDF:
 *   get:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Export filtered manpower stages to PDF
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
router.get("/exportFilteredManpowerStagesToPDF", verifyToken, exportFilteredManpowerStagesToPDF);

/**
 * @swagger
 * /api/manpower-stages/manpower/{manpower_id}:
 *   get:
 *     tags:
 *       - Manage Manpower Stages
 *     summary: Get all manpower stages for a specific manpower ID
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
 *         description: Manpower stages for manpower ID retrieved successfully
 *       500:
 *         description: Error retrieving manpower stages for manpower ID
 */
router.get("/manpower/:manpower_id", verifyToken, getManopowerStagesByManpowerId);

module.exports = router;