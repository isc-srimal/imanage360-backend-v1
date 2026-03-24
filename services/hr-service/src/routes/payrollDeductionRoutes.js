const express = require("express");
const {
  createDeduction,
  updateDeduction,
  getDeductionsByPayrollId,
} = require("../../controllers/hr/payrollDeductionController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/payroll-deductions/createDeduction:
 *   post:
 *     tags:
 *       - Payroll Deductions
 *     summary: Create a new payroll deduction (loan/penalty)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [loan, penalty]
 *               amount:
 *                 type: number
 *               reason:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [deduct_now, carry_forward]
 *     responses:
 *       201:
 *         description: Deduction created successfully
 *       404:
 *         description: Payroll not found
 *       500:
 *         description: Server error
 */
router.post("/createDeduction", verifyToken, createDeduction);

/**
 * @swagger
 * /api/payroll-deductions/updateDeduction/{id}:
 *   put:
 *     tags:
 *       - Payroll Deductions
 *     summary: Update deduction during approval (change amount or action)
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
 *               amount:
 *                 type: number
 *               action:
 *                 type: string
 *                 enum: [deduct_now, carry_forward]
 *     responses:
 *       200:
 *         description: Deduction updated
 *       404:
 *         description: Deduction not found
 *       500:
 *         description: Server error
 */
router.put("/updateDeduction/:id", verifyToken, updateDeduction);

/**
 * @swagger
 * /api/payroll-deductions/byPayroll/{id}:
 *   get:
 *     tags:
 *       - Payroll Deductions
 *     summary: Get all deductions for a payroll (for approval display)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deductions fetched successfully
 *       500:
 *         description: Server error
 */
router.get("/byPayroll/:id", verifyToken, getDeductionsByPayrollId);

module.exports = router;
