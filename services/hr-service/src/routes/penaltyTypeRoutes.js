const express = require("express");
const {
  createPenaltyType,
  updatePenaltyTypes,
  deletePenaltyType,
  getPenaltyTypeById,
  getAllPenaltyTypes,
  filterPenaltyTypes,
  exportFilteredPenaltyTypesToCSV,
  exportFilteredPenaltyTypesToPDF,
} = require("../controllers/penaltyTypeController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/penalties/createPenaltyType:
 *   post:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Create a new penalty type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               penaltyType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Penalty type created successfully
 *       500:
 *         description: Error creating penalty type
 */
router.post("/createPenaltyType", verifyToken, createPenaltyType);

/**
 * @swagger
 * /api/penalties/updatePenaltyType/{id}:
 *   put:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Update an existing penalty type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the penalty type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               penaltyType:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Penalty type updated successfully
 *       404:
 *         description: Penalty type not found
 *       500:
 *         description: Error updating penalty type
 */
router.put("/updatePenaltyType/:id", verifyToken, updatePenaltyTypes);

/**
 * @swagger
 * /api/penalties/deletePenaltyType/{id}:
 *   delete:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Delete a penalty type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the penalty type to delete
 *     responses:
 *       200:
 *         description: Penalty type deleted successfully
 *       404:
 *         description: Penalty type not found
 *       500:
 *         description: Error deleting penalty type
 */
router.delete("/deletePenaltyType/:id", verifyToken, deletePenaltyType);

/**
 * @swagger
 * /api/penalties/penaltyType/{id}:
 *   get:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Get a single penalty type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the penalty type
 *     responses:
 *       200:
 *         description: Penalty type retrieved successfully
 *       404:
 *         description: Penalty type not found
 */
router.get("/penaltyType/:id", verifyToken, getPenaltyTypeById);

/**
 * @swagger
 * /api/penalties/penaltyTypes:
 *   get:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Get all penalty types with pagination
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
 *         description: Penalty types retrieved successfully
 *       500:
 *         description: Error retrieving penalty types
 */
router.get("/penaltyTypes", verifyToken, getAllPenaltyTypes);

/**
 * @swagger
 * /api/penalties/filterPenaltyTypes:
 *   get:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Filter penalty types by status
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
 *         description: Filtered penalty types retrieved successfully
 *       500:
 *         description: Error filtering penalty types
 */
router.get("/filterPenaltyTypes", verifyToken, filterPenaltyTypes);

/**
 * @swagger
 * /api/penalties/exportFilteredPenaltyTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Export filtered penalty types to CSV
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
router.get("/exportFilteredPenaltyTypesToCSV", verifyToken, exportFilteredPenaltyTypesToCSV);

/**
 * @swagger
 * /api/penalties/exportFilteredPenaltyTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Penalty Types
 *     summary: Export filtered penalty types to PDF
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
router.get("/exportFilteredPenaltyTypesToPDF", verifyToken, exportFilteredPenaltyTypesToPDF);

module.exports = router;
