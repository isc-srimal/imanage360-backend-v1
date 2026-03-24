const express = require("express");
const {
  createBankDetail,
  updateBankDetails,
  deleteBankDetail,
  getBankDetailById,
  getAllBankDetails,
  filterBankDetails,
  exportFilteredBankDetailsToCSV,
  exportFilteredBankDetailsToPDF,
} = require("../../controllers/hr/bankDetailsController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/bank/createBankDetail:
 *   post:
 *     tags:
 *       - Manage Bank Details
 *     summary: Create a new bank detail
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Bank detail created successfully
 *       500:
 *         description: Error creating bank detail
 */
router.post("/createBankDetail", verifyToken, createBankDetail);

/**
 * @swagger
 * /api/bank/updateBankDetail/{id}:
 *   put:
 *     tags:
 *       - Manage Bank Details
 *     summary: Update an existing bank detail
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the bank detail to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bankName:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Bank detail updated successfully
 *       404:
 *         description: Bank detail not found
 *       500:
 *         description: Error updating bank detail
 */
router.put("/updateBankDetail/:id", verifyToken, updateBankDetails);

/**
 * @swagger
 * /api/bank/deleteBankDetail/{id}:
 *   delete:
 *     tags:
 *       - Manage Bank Details
 *     summary: Delete a bank detail by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the bank detail to delete
 *     responses:
 *       200:
 *         description: Bank detail deleted successfully
 *       404:
 *         description: Bank detail not found
 *       500:
 *         description: Error deleting bank detail
 */
router.delete("/deleteBankDetail/:id", verifyToken, deleteBankDetail);

/**
 * @swagger
 * /api/bank/bankDetail/{id}:
 *   get:
 *     tags:
 *       - Manage Bank Details
 *     summary: Get a single bank detail by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the bank detail
 *     responses:
 *       200:
 *         description: Bank detail retrieved successfully
 *       404:
 *         description: Bank detail not found
 */
router.get("/bankDetail/:id", verifyToken, getBankDetailById);

/**
 * @swagger
 * /api/bank/bankDetails:
 *   get:
 *     tags:
 *       - Manage Bank Details
 *     summary: Get all bank details with pagination
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
 *         description: Bank details retrieved successfully
 *       500:
 *         description: Error retrieving bank details
 */
router.get("/bankDetails", verifyToken, getAllBankDetails);

/**
 * @swagger
 * /api/bank/filterBankDetails:
 *   get:
 *     tags:
 *       - Manage Bank Details
 *     summary: Filter bank details by status
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
 *         description: Filtered bank details retrieved successfully
 *       500:
 *         description: Error filtering bank details
 */
router.get("/filterBankDetails", verifyToken, filterBankDetails);

/**
 * @swagger
 * /api/bank/exportFilteredBankDetailsToCSV:
 *   get:
 *     tags:
 *       - Manage Bank Details
 *     summary: Export filtered bank details to CSV
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
router.get("/exportFilteredBankDetailsToCSV", verifyToken, exportFilteredBankDetailsToCSV);

/**
 * @swagger
 * /api/bank/exportFilteredBankDetailsToPDF:
 *   get:
 *     tags:
 *       - Manage Bank Details
 *     summary: Export filtered bank details to PDF
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
router.get("/exportFilteredBankDetailsToPDF", verifyToken, exportFilteredBankDetailsToPDF);

module.exports = router;
