const express = require("express");
const {
  createAttachmentStage,
  updateAttachmentStage,
  deleteAttachmentStage,
  getAttachmentStageById,
  getAllAttachmentStages,
  filterAttachmentStages,
  getAttachmentStagesBySalesOrder,
  exportFilteredAttachmentStagesToCSV,
  exportFilteredAttachmentStagesToPDF,
  getAttachmentStagesByAttcahmentId,
} = require("../controllers/attachmentStageController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/attachment-stages/createAttachmentStage:
 *   post:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Create a new attachment stage
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
 *                 description: Name of the attachment stage
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
 *         description: Attachment stage created successfully
 *       500:
 *         description: Error creating attachment stage
 */
router.post("/createAttachmentStage", verifyToken, createAttachmentStage);

/**
 * @swagger
 * /api/attachment-stages/updateAttachmentStage/{attachment_stage_id}:
 *   put:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Update an existing attachment stage
 *     parameters:
 *       - in: path
 *         name: attachment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment stage to update
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
 *                 description: Name of the attachment stage
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
 *         description: Attachment stage updated successfully
 *       404:
 *         description: Attachment stage not found
 *       500:
 *         description: Error updating attachment stage
 */
router.put("/updateAttachmentStage/:attachment_stage_id", verifyToken, updateAttachmentStage);

/**
 * @swagger
 * /api/attachment-stages/deleteAttachmentStage/{attachment_stage_id}:
 *   delete:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Delete an attachment stage by ID
 *     parameters:
 *       - in: path
 *         name: attachment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment stage to delete
 *     responses:
 *       200:
 *         description: Attachment stage deleted successfully
 *       404:
 *         description: Attachment stage not found
 *       500:
 *         description: Error deleting attachment stage
 */
router.delete("/deleteAttachmentStage/:attachment_stage_id", verifyToken, deleteAttachmentStage);

/**
 * @swagger
 * /api/attachment-stages/attachmentStage/{attachment_stage_id}:
 *   get:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Get a single attachment stage by ID
 *     parameters:
 *       - in: path
 *         name: attachment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment stage
 *     responses:
 *       200:
 *         description: Attachment stage retrieved successfully
 *       404:
 *         description: Attachment stage not found
 */
router.get("/attachmentStage/:attachment_stage_id", verifyToken, getAttachmentStageById);

/**
 * @swagger
 * /api/attachment-stages/attachmentStages:
 *   get:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Get all attachment stages with pagination
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
 *         description: Attachment stages retrieved successfully
 *       500:
 *         description: Error retrieving attachment stages
 */
router.get("/attachmentStages", verifyToken, getAllAttachmentStages);

/**
 * @swagger
 * /api/attachment-stages/filterAttachmentStages:
 *   get:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Filter attachment stages by closure status and sales order
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
 *         description: Filtered attachment stages retrieved successfully
 *       500:
 *         description: Error filtering attachment stages
 */
router.get("/filterAttachmentStages", verifyToken, filterAttachmentStages);

/**
 * @swagger
 * /api/attachment-stages/salesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Get all attachment stages for a specific sales order
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
 *         description: Attachment stages for sales order retrieved successfully
 *       500:
 *         description: Error retrieving attachment stages for sales order
 */
router.get("/salesOrder/:so_id", verifyToken, getAttachmentStagesBySalesOrder);

/**
 * @swagger
 * /api/attachment-stages/exportFilteredAttachmentStagesToCSV:
 *   get:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Export filtered attachment stages to CSV
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
router.get("/exportFilteredAttachmentStagesToCSV", verifyToken, exportFilteredAttachmentStagesToCSV);

/**
 * @swagger
 * /api/attachment-stages/exportFilteredAttachmentStagesToPDF:
 *   get:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Export filtered attachment stages to PDF
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
router.get("/exportFilteredAttachmentStagesToPDF", verifyToken, exportFilteredAttachmentStagesToPDF);

/**
 * @swagger
 * /api/attachment-stages/attachment/{attachment_id}:
 *   get:
 *     tags:
 *       - Manage Attachment Stages
 *     summary: Get all attachment stages for a specific attachment ID
 *     parameters:
 *       - in: path
 *         name: attachment_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment ID
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
 *         description: Attachment stages for attachment ID retrieved successfully
 *       500:
 *         description: Error retrieving attachment stages for attachment ID
 */
router.get("/attachment/:attachment_id", verifyToken, getAttachmentStagesByAttcahmentId);

module.exports = router;