const express = require("express");
const {
  createCertificationName,
  updateCertificationName,
  deleteCertificationName,
  getCertificationNameById,
  getAllCertificationNames,
  filterCertificationNames,
  exportFilteredCertificationNamesToCSV,
  exportFilteredCertificationNamesToPDF,
} = require("../../controllers/hr/certificationNameController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/certifications-names/createCertificationName:
 *   post:
 *     tags:
 *       - Manage Certification Names
 *     summary: Create a new certification name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificationName:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Certification name created successfully
 *       500:
 *         description: Error creating certification name
 */
router.post("/createCertificationName", verifyToken, createCertificationName);

/**
 * @swagger
 * /api/certifications-names/updateCertificationName/{id}:
 *   put:
 *     tags:
 *       - Manage Certification Names
 *     summary: Update an existing certification name
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification name to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               certificationName:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Certification name updated successfully
 *       404:
 *         description: Certification name not found
 *       500:
 *         description: Error updating certification name
 */
router.put("/updateCertificationName/:id", verifyToken, updateCertificationName);

/**
 * @swagger
 * /api/certifications-names/deleteCertificationName/{id}:
 *   delete:
 *     tags:
 *       - Manage Certification Names
 *     summary: Delete a certification name by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification name to delete
 *     responses:
 *       200:
 *         description: Certification name deleted successfully
 *       404:
 *         description: Certification name not found
 *       500:
 *         description: Error deleting certification name
 */
router.delete("/deleteCertificationName/:id", verifyToken, deleteCertificationName);

/**
 * @swagger
 * /api/certifications-names/certificationName/{id}:
 *   get:
 *     tags:
 *       - Manage Certification Names
 *     summary: Get a single certification name by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification name
 *     responses:
 *       200:
 *         description: Certification name retrieved successfully
 *       404:
 *         description: Certification name not found
 */
router.get("/certificationName/:id", verifyToken, getCertificationNameById);

/**
 * @swagger
 * /api/certifications-names/certificationNames:
 *   get:
 *     tags:
 *       - Manage Certification Names
 *     summary: Get all certification names with pagination
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
 *         description: Certification names retrieved successfully
 *       500:
 *         description: Error retrieving certification names
 */
router.get("/certificationNames", verifyToken, getAllCertificationNames);

/**
 * @swagger
 * /api/certifications-names/filterCertificationNames:
 *   get:
 *     tags:
 *       - Manage Certification Names
 *     summary: Filter certification names by status
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
 *         description: Filtered certification names retrieved successfully
 *       500:
 *         description: Error filtering certification names
 */
router.get("/filterCertificationNames", verifyToken, filterCertificationNames);

/**
 * @swagger
 * /api/certifications-names/exportFilteredCertificationNamesToCSV:
 *   get:
 *     tags:
 *       - Manage Certification Names
 *     summary: Export filtered certification names to CSV
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
router.get("/exportFilteredCertificationNamesToCSV", verifyToken, exportFilteredCertificationNamesToCSV);

/**
 * @swagger
 * /api/certifications-names/exportFilteredCertificationNamesToPDF:
 *   get:
 *     tags:
 *       - Manage Certification Names
 *     summary: Export filtered certification names to PDF
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
router.get("/exportFilteredCertificationNamesToPDF", verifyToken, exportFilteredCertificationNamesToPDF);

module.exports = router;