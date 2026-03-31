const express = require("express");
const {
  createSwapReason,
  updateSwapReason,
  deleteSwapReason,
  getSwapReasonById,
  getAllSwapReasons,
  filterSwapReasons,
  exportFilteredSwapReasonsToCSV,
  exportFilteredSwapReasonsToPDF,
  getSwapReasonsByCategory,
} = require("../controllers/swapReasonController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/swapreasons/filterByCategory:
 *   get:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Get swap reasons by category
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Operator, Attachment, Equipment]
 *     responses:
 *       200:
 *         description: Swap reasons retrieved successfully
 *       500:
 *         description: Error retrieving swap reasons
 */
router.get("/filterByCategory", verifyToken, getSwapReasonsByCategory);

/**
 * @swagger
 * /api/swapreasons/createSwapReason:
 *   post:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Create a new swap reason
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               swap_reason_name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Operator, Attachment, Equipment]
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Swap reason created successfully
 *       500:
 *         description: Error creating swap reason
 */
router.post("/createSwapReason", verifyToken, createSwapReason);

/**
 * @swagger
 * /api/swapreasons/updateSwapReason/{id}:
 *   put:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Update an existing swap reason
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the swap reason to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               swap_reason_name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Operator, Attachment, Equipment]
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Swap reason updated successfully
 *       404:
 *         description: Swap reason not found
 *       500:
 *         description: Error updating swap reason
 */
router.put("/updateSwapReason/:id", verifyToken, updateSwapReason);

/**
 * @swagger
 * /api/swapreasons/deleteSwapReason/{id}:
 *   delete:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Delete a swap reason by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the swap reason to delete
 *     responses:
 *       200:
 *         description: Swap reason deleted successfully
 *       404:
 *         description: Swap reason not found
 *       500:
 *         description: Error deleting swap reason
 */
router.delete("/deleteSwapReason/:id", verifyToken, deleteSwapReason);

/**
 * @swagger
 * /api/swapreasons/swapReason/{id}:
 *   get:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Get a single swap reason by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the swap reason
 *     responses:
 *       200:
 *         description: Swap reason retrieved successfully
 *       404:
 *         description: Swap reason not found
 */
router.get("/swapReason/:id", verifyToken, getSwapReasonById);

/**
 * @swagger
 * /api/swapreasons/swapReasons:
 *   get:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Get all swap reasons with pagination
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
 *         description: Swap reasons retrieved successfully
 *       500:
 *         description: Error retrieving swap reasons
 */
router.get("/swapReasons", verifyToken, getAllSwapReasons);

/**
 * @swagger
 * /api/swapreasons/filterSwapReasons:
 *   get:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Filter swap reasons by status and category
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: category
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Operator, Attachment, Equipment]
 *       - in: query
 *         name: searchTerm
 *         required: false
 *         schema:
 *           type: string
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
 *         description: Filtered swap reasons retrieved successfully
 *       500:
 *         description: Error filtering swap reasons
 */
router.get("/filterSwapReasons", verifyToken, filterSwapReasons);

/**
 * @swagger
 * /api/swapreasons/exportFilteredSwapReasonsToCSV:
 *   get:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Export filtered swap reasons to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Operator, Attachment, Equipment]
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file download
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportFilteredSwapReasonsToCSV", verifyToken, exportFilteredSwapReasonsToCSV);

/**
 * @swagger
 * /api/swapreasons/exportFilteredSwapReasonsToPDF:
 *   get:
 *     tags:
 *       - Manage Swap Reasons
 *     summary: Export filtered swap reasons to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Operator, Attachment, Equipment]
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: PDF file download
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportFilteredSwapReasonsToPDF", verifyToken, exportFilteredSwapReasonsToPDF);

module.exports = router;