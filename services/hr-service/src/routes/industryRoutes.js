const express = require("express");
const {
  createIndustry,
  updateIndustry,
  deleteIndustry,
  getIndustryById,
  getAllIndustries,
  filterIndustries,
  exportFilteredIndustriesToCSV,
  exportFilteredIndustriesToPDF,
} = require("../../controllers/hr/industryController"); 

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/industries/createIndustry:
 *   post:
 *     tags:
 *       - Manage Industries
 *     summary: Create a new industry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               industry:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Industry created successfully
 *       500:
 *         description: Error creating industry
 */
router.post("/createIndustry", verifyToken, createIndustry);

/**
 * @swagger
 * /api/industries/updateIndustry/{id}:
 *   put:
 *     tags:
 *       - Manage Industries
 *     summary: Update an existing industry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the industry to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               industry:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Industry updated successfully
 *       404:
 *         description: Industry not found
 *       500:
 *         description: Error updating industry
 */
router.put("/updateIndustry/:id", verifyToken, updateIndustry);

/**
 * @swagger
 * /api/industries/deleteIndustry/{id}:
 *   delete:
 *     tags:
 *       - Manage Industries
 *     summary: Delete an industry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the industry to delete
 *     responses:
 *       200:
 *         description: Industry deleted successfully
 *       404:
 *         description: Industry not found
 *       500:
 *         description: Error deleting industry
 */
router.delete("/deleteIndustry/:id", verifyToken, deleteIndustry);

/**
 * @swagger
 * /api/industries/industry/{id}:
 *   get:
 *     tags:
 *       - Manage Industries
 *     summary: Get a single industry by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the industry
 *     responses:
 *       200:
 *         description: Industry retrieved successfully
 *       404:
 *         description: Industry not found
 */
router.get("/industry/:id", verifyToken, getIndustryById);

/**
 * @swagger
 * /api/industries/industries:
 *   get:
 *     tags:
 *       - Manage Industries
 *     summary: Get all industries with pagination
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
 *         description: Industries retrieved successfully
 *       500:
 *         description: Error retrieving industries
 */
router.get("/industries", verifyToken, getAllIndustries);

/**
 * @swagger
 * /api/industries/filterIndustries:
 *   get:
 *     tags:
 *       - Manage Industries
 *     summary: Filter industries by status
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
 *         description: Filtered industries retrieved successfully
 *       500:
 *         description: Error filtering industries
 */
router.get("/filterIndustries", verifyToken, filterIndustries);

/**
 * @swagger
 * /api/industries/exportFilteredIndustriesToCSV:
 *   get:
 *     tags:
 *       - Manage Industries
 *     summary: Export filtered industries to CSV
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
router.get("/exportFilteredIndustriesToCSV", verifyToken, exportFilteredIndustriesToCSV);

/**
 * @swagger
 * /api/industries/exportFilteredIndustriesToPDF:
 *   get:
 *     tags:
 *       - Manage Industries
 *     summary: Export filtered industries to PDF
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
router.get("/exportFilteredIndustriesToPDF", verifyToken, exportFilteredIndustriesToPDF);

module.exports = router;