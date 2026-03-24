const express = require("express");
const {
  createCertificationBody,
  updateCertificationBody,
  deleteCertificationBody,
  getCertificationBodyById,
  getAllCertificationBodies,
  filterCertificationBodies,
  exportFilteredCertificationBodiesToCSV,
  exportFilteredCertificationBodiesToPDF,
} = require("../../controllers/hr/certificationBodyController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/certifications-bodies/createCertificationBody:
 *   post:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Create a new certification body
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificationBody:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Certification body created successfully
 *       500:
 *         description: Error creating certification body
 */
router.post("/createCertificationBody", verifyToken, createCertificationBody);

/**
 * @swagger
 * /api/certifications-bodies/updateCertificationBody/{id}:
 *   put:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Update an existing certification body
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification body to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificationBody:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Certification body updated successfully
 *       404:
 *         description: Certification body not found
 *       500:
 *         description: Error updating certification body
 */
router.put("/updateCertificationBody/:id", verifyToken, updateCertificationBody);

/**
 * @swagger
 * /api/certifications-bodies/deleteCertificationBody/{id}:
 *   delete:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Delete a certification body by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification body to delete
 *     responses:
 *       200:
 *         description: Certification body deleted successfully
 *       404:
 *         description: Certification body not found
 *       500:
 *         description: Error deleting certification body
 */
router.delete("/deleteCertificationBody/:id", verifyToken, deleteCertificationBody);

/**
 * @swagger
 * /api/certifications-bodies/certificationBody/{id}:
 *   get:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Get a single certification body by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification body
 *     responses:
 *       200:
 *         description: Certification body retrieved successfully
 *       404:
 *         description: Certification body not found
 */
router.get("/certificationBody/:id", verifyToken, getCertificationBodyById);

/**
 * @swagger
 * /api/certifications-bodies/certificationBodies:
 *   get:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Get all certification bodies with pagination
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
 *         description: Certification bodies retrieved successfully
 *       500:
 *         description: Error retrieving certification bodies
 */
router.get("/certificationBodies", verifyToken, getAllCertificationBodies);

/**
 * @swagger
 * /api/certifications-bodies/filterCertificationBodies:
 *   get:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Filter certification bodies by status
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
 *         description: Filtered certification bodies retrieved successfully
 *       500:
 *         description: Error filtering certification bodies
 */
router.get("/filterCertificationBodies", verifyToken, filterCertificationBodies);

/**
 * @swagger
 * /api/certifications-bodies/exportFilteredCertificationBodiesToCSV:
 *   get:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Export filtered certification bodies to CSV
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
router.get("/exportFilteredCertificationBodiesToCSV", verifyToken, exportFilteredCertificationBodiesToCSV);

/**
 * @swagger
 * /api/certifications-bodies/exportFilteredCertificationBodiesToPDF:
 *   get:
 *     tags:
 *       - Manage Certification Bodies
 *     summary: Export filtered certification bodies to PDF
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
router.get("/exportFilteredCertificationBodiesToPDF", verifyToken, exportFilteredCertificationBodiesToPDF);

module.exports = router;