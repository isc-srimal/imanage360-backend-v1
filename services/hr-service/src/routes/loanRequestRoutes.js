const express = require("express");
const {
    createLoan,
    updateLoan,
    deleteLoan,
    getLoanById,
    getAllLoans,
    filterLoans,
    exportFilteredLoansToCSV,
    exportFilteredLoansToPDF,
} = require("../../controllers/hr/loanRequestController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/loan/createLoan:
 *   post:
 *     tags:
 *       - Manage Loan Data
 *     summary: Create a new loan request
 *     description: This endpoint allows to create a new loan request in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanAmount:
 *                 type: float
 *               loanType:
 *                 type: string
 *                 enum: [personal, home, education, vehicle, emergency]
 *               loanTerm:
 *                 type: integer
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *               monthlyDeduction:
 *                 type: float
 *               deductionStartMonth:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Loan request created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createLoan", verifyToken, createLoan);

/**
 * @swagger
 * /api/loan/updateLoan/{id}:
 *   put:
 *     tags:
 *       - Manage Loan Data
 *     summary: Update an existing loan data
 *     description: This endpoint allows to update an existing loan's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the loan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loanAmount:
 *                 type: float
 *               loanType:
 *                 type: string
 *                 enum: [personal, home, education, vehicle, emergency]
 *               loanTerm:
 *                 type: integer
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *               monthlyDeduction:
 *                 type: float
 *               deductionStartMonth:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Loan updated successfully
 *       404:
 *         description: Loan data not found
 *       500:
 *         description: Error updating loan data
 */
router.put("/updateLoan/:id", verifyToken, updateLoan);

/**
 * @swagger
 * /api/loan/deleteLoan/{id}:
 *   delete:
 *     tags:
 *       - Manage Loan Data
 *     summary: Delete an existing loan
 *     description: This endpoint allows to delete a loan from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the loan to delete
 *     responses:
 *       200:
 *         description: Loan data deleted successfully
 *       404:
 *         description: Loan data not found
 */
router.delete("/deleteLoan/:id", verifyToken, deleteLoan);

/**
 * @swagger
 * /api/loan/loan/{id}:
 *   get:
 *     tags:
 *       - Manage Loan Data
 *     summary: Get a single loan by ID
 *     description: This endpoint allows to retrieve a specific loan by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the loan to retrieve
 *     responses:
 *       200:
 *         description: Loan data retrieved successfully
 *       404:
 *         description: Loan data not found
 */
router.get("/loan/:id", verifyToken, getLoanById);

/**
 * @swagger
 * /api/loan/loans:
 *   get:
 *     tags:
 *       - Manage Loan Data
 *     summary: Get all loans with pagination
 *     description: This endpoint allows to retrieve all loans in the system with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Loan data retrieved successfully
 */
router.get("/loans", verifyToken, getAllLoans);

/**
 * @swagger
 * /api/loan/filterLoans:
 *   get:
 *     tags:
 *       - Manage Loan Data
 *     summary: Filter loans
 *     description: Filter loans by status and loan type.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, approved, pending, rejected]
 *         description: Loan status filter
 *       - in: query
 *         name: loanType
 *         schema:
 *           type: string
 *           enum: [All, personal, home, education, vehicle, emergency]
 *         description: Loan type filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Records per page
 *     responses:
 *       200:
 *         description: Filtered loans retrieved successfully
 */
router.get("/filterLoans", verifyToken, filterLoans);

/**
 * @swagger
 * /api/loan/exportFilteredLoansToCSV:
 *   get:
 *     tags:
 *       - Manage Loan Data
 *     summary: Export filtered loans to CSV
 *     description: Export loans based on filters to a CSV file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, approved, pending, rejected]
 *         description: Loan status filter
 *       - in: query
 *         name: loanType
 *         schema:
 *           type: string
 *           enum: [All, personal, home, education, vehicle, emergency]
 *         description: Loan type filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Records per page
 *     responses:
 *       200:
 *         description: CSV exported successfully
 */
router.get("/exportFilteredLoansToCSV", verifyToken, exportFilteredLoansToCSV);

/**
 * @swagger
 * /api/loan/exportFilteredLoansToPDF:
 *   get:
 *     tags:
 *       - Manage Loan Data
 *     summary: Export filtered loans to PDF
 *     description: Export loans based on filters to a PDF file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, approved, pending, rejected]
 *         description: Loan status filter
 *       - in: query
 *         name: loanType
 *         schema:
 *           type: string
 *           enum: [All, personal, home, education, vehicle, emergency]
 *         description: Loan type filter
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Records per page
 *     responses:
 *       200:
 *         description: PDF exported successfully
 */
router.get("/exportFilteredLoansToPDF", verifyToken, exportFilteredLoansToPDF);

module.exports = router;