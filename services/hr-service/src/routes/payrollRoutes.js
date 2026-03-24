const express = require("express");
const {
  createPayroll,
  deletePayroll,
  getPayrollById,
  getAllPayrolls,
  updatePayrollDeduction,
  approvePayroll,
  rejectPayroll,
  calculatePayrollForAllEmployeesHandler,
  setSalaryCalculationDate,
  generatePaySlip,
  downloadPaySlip,
  filterPayroll,
  exportFilteredPayrollToCSV,
  exportFilteredPayrollToPDF,
} = require("../../controllers/hr/payrollController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/payroll/createPayroll:
 *   post:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Create a new payroll
 *     description: This endpoint allows to create a new payroll in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               salaryAmount:
 *                 type: decimal
 *               accommodationAllowance:
 *                 type: decimal
 *               foodAllowance:
 *                 type: decimal
 *               transportationAllowance:
 *                 type: decimal
 *               nationalAccreditationBonus:
 *                 type: decimal
 *               natureOfWorkAllowance:
 *                 type: decimal
 *               socialBonus:
 *                 type: decimal
 *               relocationAllowance:
 *                 type: decimal
 *               otherBonuses:
 *                 type: decimal
 *               deductions:
 *                 type: decimal
 *               totalSalary:
 *                 type: decimal
 *               paymentMethod:
 *                 type: string
 *               paymentDate:
 *                 type: date
 *               isApproved:
 *                 type: string
 *                 enum: [approved, rejected]
 *               approvedBy:
 *                 type: integer
 *               approvalDate:
 *                 type: date
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Payroll created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createpayroll", verifyToken, createPayroll);

/**
 * @swagger
 * /api/payroll/deletePayroll/{id}:
 *   delete:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Delete an existing payroll data
 *     description: This endpoint allows to delete a payroll data from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the payroll data to delete
 *     responses:
 *       200:
 *         description: Payroll data deleted successfully
 *       404:
 *         description: Payroll data not found
 */
router.delete("/deletePayroll/:id", verifyToken, deletePayroll);

/**
 * @swagger
 * /api/payroll/payroll/{id}:
 *   get:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Get a single payroll data by ID
 *     description: This endpoint allows to retrieve a specific payroll data by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the payroll data to retrieve
 *     responses:
 *       200:
 *         description: Payroll data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     salaryAmount:
 *                       type: decimal
 *                     accommodationAllowance:
 *                       type: decimal
 *                     foodAllowance:
 *                       type: decimal
 *                     transportationAllowance:
 *                       type: decimal
 *                     nationalAccreditationBonus:
 *                       type: decimal
 *                     natureOfWorkAllowance:
 *                       type: decimal
 *                     socialBonus:
 *                       type: decimal
 *                     relocationAllowance:
 *                       type: decimal
 *                     otherBonuses:
 *                       type: decimal
 *                     deductions:
 *                       type: decimal
 *                     totalSalary:
 *                       type: decimal
 *                     paymentMethod:
 *                       type: string
 *                     paymentDate:
 *                       type: date
 *                     isApproved:
 *                       type: string
 *                       enum: [approved, rejected]
 *                     approvedBy:
 *                       type: integer
 *                     approvalDate:
 *                       type: date
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Payroll data not found
 */
router.get("/payroll/:id", verifyToken, getPayrollById);

/**
 * @swagger
 * /api/payroll/payrolls:
 *   get:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Get all payrolls with pagination
 *     description: This endpoint allows to retrieve all payrolls in the system with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users per page (default is 10)
 *     responses:
 *       200:
 *         description: Payroll data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     salaryAmount:
 *                       type: decimal
 *                     accommodationAllowance:
 *                       type: decimal
 *                     foodAllowance:
 *                       type: decimal
 *                     transportationAllowance:
 *                       type: decimal
 *                     nationalAccreditationBonus:
 *                       type: decimal
 *                     natureOfWorkAllowance:
 *                       type: decimal
 *                     socialBonus:
 *                       type: decimal
 *                     relocationAllowance:
 *                       type: decimal
 *                     otherBonuses:
 *                       type: decimal
 *                     deductions:
 *                       type: decimal
 *                     totalSalary:
 *                       type: decimal
 *                     paymentMethod:
 *                       type: string
 *                     paymentDate:
 *                       type: date
 *                     isApproved:
 *                       type: string
 *                       enum: [approved, rejected]
 *                     approvedBy:
 *                       type: integer
 *                     approvalDate:
 *                       type: date
 *                     employeeId:
 *                       type: integer
 *       500:
 *         description: Error retrieving payroll data
 */
router.get("/payrolls", verifyToken, getAllPayrolls);

/**
 * @swagger
 * /api/payroll/{id}/deduction:
 *   put:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Update payroll details
 *     description: Update deductions, payment method, payment date, and total salary for a specific payroll record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payroll ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deductions
 *               - paymentMethod
 *               - paymentDate
 *               - totalSalary
 *             properties:
 *               deductions:
 *                 type: number
 *                 description: Amount of deductions
 *               paymentMethod:
 *                 type: string
 *                 enum: [cash, cheque, debit]
 *                 description: Method of payment
 *               paymentDate:
 *                 type: string
 *                 format: date
 *                 description: Date of payment
 *               totalSalary:
 *                 type: number
 *                 description: Total salary after deductions
 *     responses:
 *       200:
 *         description: Payroll updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payroll:
 *                   type: object
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Payroll not found
 *       500:
 *         description: Error updating payroll
 */
router.put("/:id/deduction", verifyToken, updatePayrollDeduction);

/**
 * @swagger
 * /api/payroll/approve/{id}:
 *   patch:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Approve a payroll entry
 *     description: Approves a payroll entry by setting the status to 'approved'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the payroll entry to approve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approverId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Payroll approved successfully
 *       404:
 *         description: Payroll not found
 *       400:
 *         description: Payroll is already processed
 */
router.patch("/approve/:id", verifyToken, approvePayroll);

/**
 * @swagger
 * /api/payroll/reject/{id}:
 *   patch:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Reject a payroll entry
 *     description: Rejects a payroll entry by setting the status to 'rejected'.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the payroll entry to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approverId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Payroll rejected successfully
 *       404:
 *         description: Payroll not found
 *       400:
 *         description: Payroll is already processed
 */
router.patch("/reject/:id", verifyToken, rejectPayroll);

/**
 * @swagger
 * /api/payroll/calculatePayrollForAllEmployees:
 *   post:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Calculate payroll for all employees
 *     description: Calculates payroll for all active employees.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 5
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Payroll calculated successfully.
 *       400:
 *         description: Missing required input data.
 *       500:
 *         description: Internal server error.
 */
router.post("/calculatePayrollForAllEmployees", verifyToken, calculatePayrollForAllEmployeesHandler);

/**
 * @swagger
 * /api/payroll/setSalaryCalculationDate:
 *   post:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Set the salary calculation date
 *     description: This endpoint sets the salary calculation date in the settings for payroll calculation.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Salary calculation date updated successfully
 *       400:
 *         description: Error updating salary calculation date
 */
router.post("/setSalaryCalculationDate", verifyToken, setSalaryCalculationDate);

/**
 * @swagger
 * /api/payroll/paySlip/{id}:
 *   get:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Generate a pay slip for the employee
 *     description: This endpoint generates a PDF pay slip for a given payroll ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the payroll to generate the pay slip for
 *     responses:
 *       200:
 *         description: Pay slip generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pay slip generated successfully"
 *                 filePath:
 *                   type: string
 *                   example: "/api/payroll/paySlip/download/pay_slip_1_2025_03_12T00_00_00_000Z.pdf"
 *       404:
 *         description: Payroll data not found
 *       500:
 *         description: Error generating pay slip
 */
router.get("/paySlip/:id", verifyToken, generatePaySlip);

/**
 * @swagger
 * /api/payroll/paySlip/download/{filename}:
 *   get:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Download a generated pay slip
 *     description: Downloads the previously generated PDF payslip file using token-based authentication.
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The filename of the generated payslip.
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer token to authenticate the download request
 *     responses:
 *       200:
 *         description: PDF file stream
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       404:
 *         description: File not found
 */
router.get("/paySlip/download/:filename", downloadPaySlip);

/**
 * @swagger
 * /api/payroll/filterPayroll:
 *   get:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Get filtered payroll data
 *     description: This endpoint allows filtering payroll data based on payment method, approval status, and date range with pagination.
 *     parameters:
 *       - in: query
 *         name: paymentMethod
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, cash, bank, cheque]
 *         description: The payment method to filter by.
 *       - in: query
 *         name: paymentDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The payment date or date range to filter by (e.g., "2025-01-01" or "2025-01-01 to 2025-12-31").
 *       - in: query
 *         name: isApproved
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
 *         description: The approval status to filter by.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A list of filtered payroll records.
 *       500:
 *         description: Internal server error.
 */
router.get("/filterPayroll", verifyToken, filterPayroll);

/**
 * @swagger
 * /api/payroll/exportFilteredPayrollToCSV:
 *   get:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Export filtered payroll data to CSV
 *     description: This endpoint allows exporting filtered payroll data as a CSV file.
 *     parameters:
 *       - in: query
 *         name: paymentMethod
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, cash, bank, cheque]
 *         description: The payment method to filter by.
 *       - in: query
 *         name: paymentDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The payment date or date range to filter by.
 *       - in: query
 *         name: isApproved
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
 *         description: The approval status to filter by.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A CSV file containing filtered payroll data.
 *       500:
 *         description: Error exporting payrolls to CSV.
 */
router.get("/exportFilteredPayrollToCSV", verifyToken, exportFilteredPayrollToCSV);

/**
 * @swagger
 * /api/payroll/exportFilteredPayrollToPDF:
 *   get:
 *     tags:
 *       - Manage Payroll Data
 *     summary: Export filtered payroll data to PDF
 *     description: This endpoint allows exporting filtered payroll data as a PDF file.
 *     parameters:
 *       - in: query
 *         name: paymentMethod
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, cash, bank, cheque]
 *         description: The payment method to filter by.
 *       - in: query
 *         name: paymentDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The payment date or date range to filter by.
 *       - in: query
 *         name: isApproved
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
 *         description: The approval status to filter by.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A PDF file with filtered payroll data.
 *       500:
 *         description: Error exporting payrolls to PDF.
 */
router.get("/exportFilteredPayrollToPDF", verifyToken, exportFilteredPayrollToPDF);

module.exports = router;