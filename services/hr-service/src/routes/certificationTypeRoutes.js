const express = require("express");
const {
  createCertificationType,
  updateCertificationType,
  deleteCertificationType,
  getCertificationTypeById,
  getAllCertificationTypes,
  filterCertificationTypes,
  exportFilteredCertificationTypesToCSV,
  exportFilteredCertificationTypesToPDF,
} = require("../controllers/certificationTypeController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/certifications-types/createCertificationType:
 *   post:
 *     tags:
 *       - Manage Certification Types
 *     summary: Create a new certification type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificationType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Certification type created successfully
 *       500:
 *         description: Error creating certification type
 */
router.post("/createCertificationType", verifyToken, createCertificationType);

/**
 * @swagger
 * /api/certifications-types/updateCertificationType/{id}:
 *   put:
 *     tags:
 *       - Manage Certification Types
 *     summary: Update an existing certification type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificationType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Certification type updated successfully
 *       404:
 *         description: Certification type not found
 *       500:
 *         description: Error updating certification type
 */
router.put("/updateCertificationType/:id", verifyToken, updateCertificationType);

/**
 * @swagger
 * /api/certifications-types/deleteCertificationType/{id}:
 *   delete:
 *     tags:
 *       - Manage Certification Types
 *     summary: Delete a certification type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification type to delete
 *     responses:
 *       200:
 *         description: Certification type deleted successfully
 *       404:
 *         description: Certification type not found
 *       500:
 *         description: Error deleting certification type
 */
router.delete("/deleteCertificationType/:id", verifyToken, deleteCertificationType);

/**
 * @swagger
 * /api/certifications-types/certificationType/{id}:
 *   get:
 *     tags:
 *       - Manage Certification Types
 *     summary: Get a single certification type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification type
 *     responses:
 *       200:
 *         description: Certification type retrieved successfully
 *       404:
 *         description: Certification type not found
 */
router.get("/certificationType/:id", verifyToken, getCertificationTypeById);

/**
 * @swagger
 * /api/certifications-types/certificationTypes:
 *   get:
 *     tags:
 *       - Manage Certification Types
 *     summary: Get all certification types with pagination
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
 *         description: Certification types retrieved successfully
 *       500:
 *         description: Error retrieving certification types
 */
router.get("/certificationTypes", verifyToken, getAllCertificationTypes);

/**
 * @swagger
 * /api/certifications-types/filterCertificationTypes:
 *   get:
 *     tags:
 *       - Manage Certification Types
 *     summary: Filter certification types by status
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
 *         description: Filtered certification types retrieved successfully
 *       500:
 *         description: Error filtering certification types
 */
router.get("/filterCertificationTypes", verifyToken, filterCertificationTypes);

/**
 * @swagger
 * /api/certifications-types/exportFilteredCertificationTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Certification Types
 *     summary: Export filtered certification types to CSV
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
router.get("/exportFilteredCertificationTypesToCSV", verifyToken, exportFilteredCertificationTypesToCSV);

/**
 * @swagger
 * /api/certifications-types/exportFilteredCertificationTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Certification Types
 *     summary: Export filtered certification types to PDF
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
router.get("/exportFilteredCertificationTypesToPDF", verifyToken, exportFilteredCertificationTypesToPDF);

module.exports = router;