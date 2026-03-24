const express = require("express");
const {
  uploadAttachments,
  createAttachment,
  updateAttachment,
  getAttachmentPhotos,
  deleteAttachment,
  getAttachmentById,
  getAllAttachments,
  filterAttachments,
  serveAttachmentFile,
  exportFilteredAttachmentsToCSV,
  exportFilteredAttachmentsToPDF,
  getAttachmentStatusHistory,
  createStatusHistory,
  updateStatusHistory,
  getVehicleTypeByPlateNumber,
} = require("../../controllers/fleet-management/attachmentController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/attachments/{id}/status-history:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Get status history for an attachment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Status history retrieved successfully
 */
router.get("/:id/status-history", verifyToken, getAttachmentStatusHistory);

/**
 * @swagger
 * /api/attachments/status-history:
 *   post:
 *     tags:
 *       - Manage Attachments
 *     summary: Create status history entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment_id:
 *                 type: integer
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Status history created successfully
 */
router.post("/status-history", verifyToken, createStatusHistory);

/**
 * @swagger
 * /api/attachments/status-history/{id}:
 *   put:
 *     tags:
 *       - Manage Attachments
 *     summary: Update status history entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status history updated successfully
 */
router.put("/status-history/:id", verifyToken, updateStatusHistory);

/**
 * @swagger
 * /api/attachments/{attachment_id}/photos:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Get photos for a attachment
 *     parameters:
 *       - in: path
 *         name: attachment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the attachment
 *     responses:
 *       200:
 *         description: Attachment photos retrieved successfully
 *       404:
 *         description: Attachment not found
 *       500:
 *         description: Error retrieving photos
 */
router.get("/:attachment_id/photos", verifyToken, getAttachmentPhotos);

/**
 * @swagger
 * /api/attachments/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Serve an manpower file
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [supportDocuments, attachments]
 *         description: Folder containing the file
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/msword:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.ms-excel:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", verifyToken, serveAttachmentFile);

/**
 * @swagger
 * /api/attachments/createAttachment:
 *   post:
 *     tags:
 *       - Manage Attachments
 *     summary: Create a new attachment
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing attachment details
 *               supportDocument:
 *                 type: string
 *                 format: binary
 *                 description: Support document file (optional)
 *               photos:
 *                 type: array
 *                 maxItems: 4  
 *                 items:
 *                   type: string
 *                   format: binary
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       201:
 *         description: Attachment created successfully
 *       400:
 *         description: File upload error or validation error
 *       500:
 *         description: Error creating attachment
 */
router.post("/createAttachment", verifyToken, uploadAttachments, createAttachment);

/**
 * @swagger
 * /api/attachments/updateAttachment/{id}:
 *   put:
 *     tags:
 *       - Manage Attachments
 *     summary: Update an existing attachment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing attachment details
 *               supportDocument:
 *                 type: string
 *                 format: binary
 *                 description: Support document file (optional)
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       200:
 *         description: Attachment updated successfully
 *       400:
 *         description: File upload error or validation error
 *       404:
 *         description: Attachment not found
 *       500:
 *         description: Error updating attachment
 */
router.put("/updateAttachment/:id", verifyToken, uploadAttachments, updateAttachment);

/**
 * @swagger
 * /api/attachments/deleteAttachment/{id}:
 *   delete:
 *     tags:
 *       - Manage Attachments
 *     summary: Delete an attachment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment to delete
 *     responses:
 *       200:
 *         description: Attachment deleted successfully
 *       404:
 *         description: Attachment not found
 *       500:
 *         description: Error deleting attachment
 */
router.delete("/deleteAttachment/:id", verifyToken, deleteAttachment);

/**
 * @swagger
 * /api/attachments/attachment/{id}:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Get a single attachment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment
 *     responses:
 *       200:
 *         description: Attachment retrieved successfully
 *       404:
 *         description: Attachment not found
 */
router.get("/attachment/:id", verifyToken, getAttachmentById);

/**
 * @swagger
 * /api/attachments/attachments:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Get all attachments with pagination
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
 *         description: Attachments retrieved successfully
 *       500:
 *         description: Error retrieving attachments
 */
router.get("/attachments", verifyToken, getAllAttachments);

/**
 * @swagger
 * /api/attachments/filterAttachments:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Filter attachments by status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Retired, Repaired, Lost]
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
 *         description: Filtered attachments retrieved successfully
 *       500:
 *         description: Error filtering attachments
 */
router.get("/filterAttachments", verifyToken, filterAttachments);

/**
 * @swagger
 * /api/attachments/exportFilteredAttachmentsToCSV:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Export filtered attachments to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Retired, Repaired, Lost]
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
 *         description: No attachments found
 *       500:
 *         description: Error exporting CSV
 */
router.get(
  "/exportFilteredAttachmentsToCSV",
  verifyToken,
  exportFilteredAttachmentsToCSV
);

/**
 * @swagger
 * /api/attachments/exportFilteredAttachmentsToPDF:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Export filtered attachments to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Retired, Repaired, Lost]
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
 *         description: No attachments found
 *       500:
 *         description: Error exporting PDF
 */
router.get(
  "/exportFilteredAttachmentsToPDF",
  verifyToken,
  exportFilteredAttachmentsToPDF
);

/**
 * @swagger
 * /api/attachments/vehicle-type/{plate_number}:
 *   get:
 *     tags:
 *       - Manage Attachments
 *     summary: Get vehicle type by plate number
 *     parameters:
 *       - in: path
 *         name: plate_number
 *         required: true
 *         schema:
 *           type: string
 *         description: Plate number (reg_number from equipment)
 *     responses:
 *       200:
 *         description: Vehicle type retrieved successfully
 *       404:
 *         description: No equipment found with this plate number
 *       500:
 *         description: Error fetching vehicle type
 */
router.get("/vehicle-type/:plate_number", verifyToken, getVehicleTypeByPlateNumber);

module.exports = router;