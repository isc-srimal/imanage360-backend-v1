const express = require("express");
const {
  createCommission,
  updateCommissions,
  deleteCommission,
  getCommissionById,
  getAllCommissions,
  filterCommissions,
  exportFilteredCommissionsToCSV,
  exportFilteredCommissionsToPDF,
} = require("../../controllers/hr/commissionController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/commissions/createCommission:
 *   post:
 *     tags:
 *       - Manage Commissions
 *     summary: Create a new commission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *               reason:
 *                 type: string
 *               amount:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               employeeName:
 *                 type: string
 *               payrollId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Commission created successfully
 *       500:
 *         description: Error creating commission
 */
router.post("/createCommission", verifyToken, createCommission);

/**
 * @swagger
 * /api/commissions/updateCommissions/{id}:
 *   put:
 *     tags:
 *       - Manage Commissions
 *     summary: Update a commission by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the commission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               month:
 *                 type: string
 *               reason:
 *                 type: string
 *               amount:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               employeeName:
 *                 type: string
 *               payrollId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Commission updated successfully
 *       404:
 *         description: Commission not found
 *       500:
 *         description: Error updating commission
 */
router.put("/updateCommissions/:id", verifyToken, updateCommissions);

/**
 * @swagger
 * /api/commissions/deleteCommission/{id}:
 *   delete:
 *     tags:
 *       - Manage Commissions
 *     summary: Delete a commission by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the commission to delete
 *     responses:
 *       200:
 *         description: Commission deleted successfully
 *       404:
 *         description: Commission not found
 *       500:
 *         description: Error deleting commission
 */
router.delete("/deleteCommission/:id", verifyToken, deleteCommission);

/**
 * @swagger
 * /api/commissions/commission/{id}:
 *   get:
 *     tags:
 *       - Manage Commissions
 *     summary: Get a commission by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the commission
 *     responses:
 *       200:
 *         description: Commission retrieved successfully
 *       404:
 *         description: Commission not found
 */
router.get("/commission/:id", verifyToken, getCommissionById);

/**
 * @swagger
 * /api/commissions/commissions:
 *   get:
 *     tags:
 *       - Manage Commissions
 *     summary: Get all commissions with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Commissions retrieved successfully
 *       500:
 *         description: Error retrieving commissions
 */
router.get("/commissions", verifyToken, getAllCommissions);

/**
 * @swagger
 * /api/commissions/filterCommissions:
 *   get:
 *     tags:
 *       - Manage Commissions
 *     summary: Filter commissions by various criteria
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           enum: [All, January, February, March, April, May, June, July, August, September, October, November, December]
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *       - in: query
 *         name: qidNumber
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Filtered commissions retrieved successfully
 *       500:
 *         description: Error filtering commissions
 */
router.get("/filterCommissions", verifyToken, filterCommissions);

/**
 * @swagger
 * /api/commissions/exportFilteredCommissionsToCSV:
 *   get:
 *     tags:
 *       - Manage Commissions
 *     summary: Export filtered commissions to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           enum: [All, January, February, March, April, May, June, July, August, September, October, November, December]
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *       - in: query
 *         name: qidNumber
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: CSV exported successfully
 *       404:
 *         description: No commissions found
 *       500:
 *         description: Error exporting commissions to CSV
 */
router.get(
  "/exportFilteredCommissionsToCSV",
  verifyToken,
  exportFilteredCommissionsToCSV
);

/**
 * @swagger
 * /api/commissions/exportFilteredCommissionsToPDF:
 *   get:
 *     tags:
 *       - Manage Commissions
 *     summary: Export filtered commissions to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: month
 *         schema:
 *           type: string
 *           enum: [All, January, February, March, April, May, June, July, August, September, October, November, December]
 *       - in: query
 *         name: designation
 *         schema:
 *           type: string
 *       - in: query
 *         name: qidNumber
 *         schema:
 *           type: number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: PDF exported successfully
 *       404:
 *         description: No commissions found
 *       500:
 *         description: Error exporting commissions to PDF
 */
router.get(
  "/exportFilteredCommissionsToPDF",
  verifyToken,
  exportFilteredCommissionsToPDF
);

module.exports = router;
