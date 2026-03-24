const express = require("express");
const {
    createLoanApproval,
    updateLoanApproval,
    deleteLoanApproval,
    getLoanApprovalById,
    getAllLoanApprovals,
    approveLoan,
    rejectLoan,
    filterLoanApproval,
    exportFilteredLoanApprovalToCSV,
    exportFilteredLoanApprovalToPDF,
} = require("../../controllers/hr/loanApprovalController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/loanApproval/createLoanApproval:
 *   post:
 *     tags:
 *       - Approval Loan Data
 *     summary: Create a new loan approval
 *     description: This endpoint allows to create a new loan approval in the ERP system.
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
 *               approvedBy:
 *                 type: integer
 *               approvalDate:
 *                 type: string
 *                 format: date
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
router.post("/createLoanApproval", verifyToken, createLoanApproval);

/**
 * @swagger
 * /api/loanApproval/updateLoanApproval/{id}:
 *   put:
 *     tags:
 *       - Approval Loan Data
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
 *               approvedBy:
 *                 type: integer
 *               approvalDate:
 *                 type: string
 *                 format: date
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
router.put("/updateLoanApproval/:id", verifyToken, updateLoanApproval);

/**
 * @swagger
 * /api/loanApproval/deleteLoanApproval/{id}:
 *   delete:
 *     tags:
 *       - Approval Loan Data
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
router.delete("/deleteLoanApproval/:id", verifyToken, deleteLoanApproval);

/**
 * @swagger
 * /api/loanApproval/loanApproval/{id}:
 *   get:
 *     tags:
 *       - Approval Loan Data
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
router.get("/loanApproval/:id", verifyToken, getLoanApprovalById);

/**
 * @swagger
 * /api/loanApproval/loanApprovals:
 *   get:
 *     tags:
 *       - Approval Loan Data
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
router.get("/loanApprovals", verifyToken, getAllLoanApprovals);

/**
 * @swagger
 * /api/loanApproval/approveLoan/{id}:
 *   patch:
 *     tags:
 *       - Approval Loan Data
 *     summary: Approve a loan request
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
 *               approvedBy:
 *                 type: integer
 *               approvalDate:
 *                 type: string
 *                 format: date
 *               monthlyDeduction:
 *                 type: float
 *               deductionStartMonth:
 *                 type: string
 *     responses:
 *       200:
 *         description: Loan approved successfully
 */
router.patch("/approveLoan/:id", verifyToken, approveLoan);

/**
 * @swagger
 * /api/loanApproval/rejectLoan/{id}:
 *   patch:
 *     tags:
 *       - Approval Loan Data
 *     summary: Reject a loan request
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
 *               approvedBy:
 *                 type: integer
 *               approvalDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Loan rejected successfully
 */
router.patch("/rejectLoan/:id", verifyToken, rejectLoan);

/**
 * @swagger
 * /api/loanApproval/filterLoanApproval:
 *   get:
 *     tags:
 *       - Approval Loan Data
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
router.get("/filterLoanApproval", verifyToken, filterLoanApproval);

/**
 * @swagger
 * /api/loanApproval/exportFilteredLoanApprovalToCSV:
 *   get:
 *     tags:
 *       - Approval Loan Data
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
router.get("/exportFilteredLoanApprovalToCSV", verifyToken, exportFilteredLoanApprovalToCSV);

/**
 * @swagger
 * /api/loanApproval/exportFilteredLoanApprovalToPDF:
 *   get:
 *     tags:
 *       - Approval Loan Data
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
router.get("/exportFilteredLoanApprovalToPDF", verifyToken, exportFilteredLoanApprovalToPDF);

module.exports = router;