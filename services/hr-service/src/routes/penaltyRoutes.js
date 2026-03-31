const express = require("express");
const {
  createPenalty,
  updatePenalty,
  deletePenalty,
  getPenaltyById,
  getAllPenalties,
  setPenaltyDeduction,
  filterPenalties,
  exportFilteredPenaltiesToCSV,
  exportFilteredPenaltiesToPDF,
} = require("../controllers/penaltyController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/penalty/createPenalty:
 *   post:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Create a new penalty
 *     description: This endpoint allows you to create a new penalty record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               penaltyType:
 *                 type: string
 *               description:
 *                 type: string
 *               penaltyAmount:
 *                 type: float
 *               monthlyDeduction:
 *                 type: float
 *               deductionStartMonth:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Penalty created successfully
 *       500:
 *         description: Server error
 */
router.post("/createPenalty", verifyToken, createPenalty);

/**
 * @swagger
 * /api/penalty/updatePenalty/{id}:
 *   put:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Update an existing penalty
 *     description: This endpoint allows you to update an existing penalty record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the penalty to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               penaltyType:
 *                 type: string
 *               description:
 *                 type: string
 *               penaltyAmount:
 *                 type: float
 *               monthlyDeduction:
 *                 type: float
 *               deductionStartMonth:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Penalty updated successfully
 *       404:
 *         description: Penalty not found
 *       500:
 *         description: Server error
 */
router.put("/updatePenalty/:id", verifyToken, updatePenalty);

/**
 * @swagger
 * /api/penalty/deletePenalty/{id}:
 *   delete:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Delete a penalty
 *     description: This endpoint allows you to delete a penalty by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the penalty to delete
 *     responses:
 *       200:
 *         description: Penalty deleted successfully
 *       404:
 *         description: Penalty not found
 */
router.delete("/deletePenalty/:id", verifyToken, deletePenalty);

/**
 * @swagger
 * /api/penalty/penalty/{id}:
 *   get:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Get a single penalty by ID
 *     description: This endpoint allows you to retrieve a specific penalty record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the penalty to retrieve
 *     responses:
 *       200:
 *         description: Penalty retrieved successfully
 *       404:
 *         description: Penalty not found
 */
router.get("/penalty/:id", verifyToken, getPenaltyById);

/**
 * @swagger
 * /api/penalty/penalties:
 *   get:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Get all penalties with pagination
 *     description: This endpoint retrieves all penalties with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: Penalties retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/penalties", verifyToken, getAllPenalties);

/**
 * @swagger
 * /api/penalty/setDeduction/{id}:
 *   patch:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Set or update monthly deduction details for a penalty
 *     description: Update only the monthly deduction amount and deduction start month.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the penalty
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monthlyDeduction:
 *                 type: float
 *               deductionStartMonth:
 *                 type: string
 *     responses:
 *       200:
 *         description: Penalty deduction updated successfully
 *       404:
 *         description: Penalty not found
 *       500:
 *         description: Server error
 */
router.patch("/setDeduction/:id", verifyToken, setPenaltyDeduction);

/**
 * @swagger
 * /api/penalty/filterPenalties:
 *   get:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Filter penalties based on creator
 *     parameters:
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *           enum: [All, Admin, HR, Manager, Employee]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: Filtered penalties retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/filterPenalties", verifyToken, filterPenalties);

/**
 * @swagger
 * /api/penalty/exportFilteredPenaltiesCSV:
 *   get:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Export filtered penalties to CSV
 *     description: Exports penalties filtered by 'createdBy' as a CSV file.
 *     parameters:
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *           enum: [All, Admin, HR, Manager, Employee]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredPenaltiesCSV", verifyToken, exportFilteredPenaltiesToCSV);

/**
 * @swagger
 * /api/penalty/exportFilteredPenaltiesPDF:
 *   get:
 *     tags:
 *       - Manage Penalty Data
 *     summary: Export filtered penalties to PDF
 *     description: Exports penalties filtered by 'createdBy' as a PDF file.
 *     parameters:
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *           enum: [All, Admin, HR, Manager, Employee]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: PDF file generated successfully
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredPenaltiesPDF", verifyToken, exportFilteredPenaltiesToPDF);

module.exports = router;