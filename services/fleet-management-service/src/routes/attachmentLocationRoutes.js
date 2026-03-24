const express = require("express");
const {
  createAttachmentLocation,
  updateAttachmentLocation,
  deleteAttachmentLocation,
  getAttachmentLocationById,
  getAllAttachmentLocations,
  filterAttachmentLocations,
  exportFilteredAttachmentLocationsToCSV,
  exportFilteredAttachmentLocationsToPDF,
} = require("../../controllers/fleet-management/attachmentLocationController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/attachment-locations/createAttachmentLocation:
 *   post:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Create a new attachment location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment_location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Attachment location created successfully
 *       500:
 *         description: Error creating attachment location
 */
router.post("/createAttachmentLocation", verifyToken, createAttachmentLocation);

/**
 * @swagger
 * /api/attachment-locations/updateAttachmentLocation/{id}:
 *   put:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Update an existing attachment location
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment location to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               attachment_location:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Attachment location updated successfully
 *       404:
 *         description: Attachment location not found
 *       500:
 *         description: Error updating attachment location
 */
router.put("/updateAttachmentLocation/:id", verifyToken, updateAttachmentLocation);

/**
 * @swagger
 * /api/attachment-locations/deleteAttachmentLocation/{id}:
 *   delete:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Delete an attachment location by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment location to delete
 *     responses:
 *       200:
 *         description: Attachment location deleted successfully
 *       404:
 *         description: Attachment location not found
 *       500:
 *         description: Error deleting attachment location
 */
router.delete("/deleteAttachmentLocation/:id", verifyToken, deleteAttachmentLocation);

/**
 * @swagger
 * /api/attachment-locations/attachmentLocation/{id}:
 *   get:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Get a single attachment location by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the attachment location
 *     responses:
 *       200:
 *         description: Attachment location retrieved successfully
 *       404:
 *         description: Attachment location not found
 */
router.get("/attachmentLocation/:id", verifyToken, getAttachmentLocationById);

/**
 * @swagger
 * /api/attachment-locations/attachmentLocations:
 *   get:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Get all attachment locations with pagination
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
 *         description: Attachment locations retrieved successfully
 *       500:
 *         description: Error retrieving attachment locations
 */
router.get("/attachmentLocations", verifyToken, getAllAttachmentLocations);

/**
 * @swagger
 * /api/attachment-locations/filterAttachmentLocations:
 *   get:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Filter attachment locations by status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
 *         description: Filtered attachment locations retrieved successfully
 *       500:
 *         description: Error filtering attachment locations
 */
router.get("/filterAttachmentLocations", verifyToken, filterAttachmentLocations);

/**
 * @swagger
 * /api/attachment-locations/exportFilteredAttachmentLocationsToCSV:
 *   get:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Export filtered attachment locations to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredAttachmentLocationsToCSV", verifyToken, exportFilteredAttachmentLocationsToCSV);

/**
 * @swagger
 * /api/attachment-locations/exportFilteredAttachmentLocationsToPDF:
 *   get:
 *     tags:
 *       - Manage Attachment Locations
 *     summary: Export filtered attachment locations to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredAttachmentLocationsToPDF", verifyToken, exportFilteredAttachmentLocationsToPDF);

module.exports = router;