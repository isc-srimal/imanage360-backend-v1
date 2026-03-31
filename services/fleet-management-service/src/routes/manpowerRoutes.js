const express = require("express");
const {
  updateManpower,
  deleteManpower,
  getManpowerById,
  getAllManpower,
  serveManpowerFile,
  filterManpower,
  exportFilteredManpowerToCSV,
  exportFilteredManpowerToPDF,
} = require("../controllers/manpowerController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/manpower/updateManpower/{manpower_id}:
 *   put:
 *     tags:
 *       - Manage Manpower
 *     summary: Update an existing manpower record
 *     parameters:
 *       - in: path
 *         name: manpower_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the manpower to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing manpower details
 *                 example: '{"employeeId":1,"employeeNo":"EMP123","contractNo":"CON123","employeeFullName":"John Doe","operator_type_id":1,"contractType":"Permanent","employeeType":"Operator","employeeStatus":"Active","serial_number":1001,"equipmentDetails":"Crane","month":10,"gatePassNumber":"GP123456","gatePassIssueDate":"2025-01-01","gatePassExpiryDate":"2026-01-01","gatePassExpiryStatus":"Valid","status":"Active"}'
 *               gatePassAttachment:
 *                 type: string
 *                 format: binary
 *                 description: Gate pass attachment file (optional)
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       200:
 *         description: Manpower updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Manpower updated successfully
 *                 manpower:
 *                   type: object
 *                   properties:
 *                     manpower_id:
 *                       type: integer
 *                     employeeId:
 *                       type: integer
 *                     employeeNo:
 *                       type: string
 *                     contractNo:
 *                       type: string
 *                     employeeFullName:
 *                       type: string
 *                     operator_type_id:
 *                       type: integer
 *                     contractType:
 *                       type: string
 *                     employeeType:
 *                       type: string
 *                     employeeStatus:
 *                       type: string
 *                     serial_number:
 *                       type: integer
 *                     equipmentDetails:
 *                       type: string
 *                     month:
 *                       type: integer
 *                     gatePassNumber:
 *                       type: string
 *                     gatePassIssueDate:
 *                       type: string
 *                       format: date
 *                     gatePassExpiryDate:
 *                       type: string
 *                       format: date
 *                     gatePassAttachment:
 *                       type: string
 *                     gatePassExpiryStatus:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: File upload error or missing/invalid data format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       404:
 *         description: Manpower not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Manpower not found
 *       500:
 *         description: Error updating manpower
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put("/updateManpower/:manpower_id", verifyToken, updateManpower);

/**
 * @swagger
 * /api/manpower/deleteManpower/{manpower_id}:
 *   delete:
 *     tags:
 *       - Manage Manpower
 *     summary: Delete a manpower record by ID
 *     parameters:
 *       - in: path
 *         name: manpower_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the manpower to delete
 *     responses:
 *       200:
 *         description: Manpower deleted successfully
 *       404:
 *         description: Manpower not found
 *       500:
 *         description: Error deleting manpower
 */
router.delete("/deleteManpower/:manpower_id", verifyToken, deleteManpower);

/**
 * @swagger
 * /api/manpower/manpower/{manpower_id}:
 *   get:
 *     tags:
 *       - Manage Manpower
 *     summary: Get a single manpower record by ID
 *     parameters:
 *       - in: path
 *         name: manpower_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the manpower
 *     responses:
 *       200:
 *         description: Manpower retrieved successfully
 *       404:
 *         description: Manpower not found
 */
router.get("/manpower/:manpower_id", verifyToken, getManpowerById);

/**
 * @swagger
 * /api/manpower/manpower:
 *   get:
 *     tags:
 *       - Manage Manpower
 *     summary: Get all manpower records with pagination
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
 *         description: Manpower records retrieved successfully
 *       500:
 *         description: Error retrieving manpower
 */
router.get("/manpower", verifyToken, getAllManpower);

/**
 * @swagger
 * /api/manpower/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Manage Manpower
 *     summary: Serve an manpower file
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [gatePassAttachmentDocuments]
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
 *       400:
 *         description: Invalid folder
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", verifyToken, serveManpowerFile);

/**
 * @swagger
 * /api/manpower/filterManpower:
 *   get:
 *     tags:
 *       - Manage Manpower
 *     summary: Filter manpower records by status
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
 *         description: Filtered manpower retrieved successfully
 *       500:
 *         description: Error filtering manpower
 */
router.get("/filterManpower", verifyToken, filterManpower);

/**
 * @swagger
 * /api/manpower/exportFilteredManpowerToCSV:
 *   get:
 *     tags:
 *       - Manage Manpower
 *     summary: Export filtered manpower to CSV
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
router.get("/exportFilteredManpowerToCSV", verifyToken, exportFilteredManpowerToCSV);

/**
 * @swagger
 * /api/manpower/exportFilteredManpowerToPDF:
 *   get:
 *     tags:
 *       - Manage Manpower
 *     summary: Export filtered manpower to PDF
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
router.get("/exportFilteredManpowerToPDF", verifyToken, exportFilteredManpowerToPDF);

module.exports = router;