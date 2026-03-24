const express = require("express");
const {
  createCustodianID,
  updateCustodianID,
  deleteCustodianID,
  getCustodianIDById,
  getAllCustodianIDs,
  filterCustodianIDs,
  exportFilteredCustodianIDsToCSV,
  exportFilteredCustodianIDsToPDF,
} = require("../controllers/custodianIdController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/custodians/createCustodianID:
 *   post:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Create a new custodian ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               custodian_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Custodian ID created successfully
 *       500:
 *         description: Error creating custodian ID
 */
router.post("/createCustodianID", verifyToken, createCustodianID);

/**
 * @swagger
 * /api/custodians/updateCustodianID/{id}:
 *   put:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Update an existing custodian ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the custodian ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               custodian_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Custodian ID updated successfully
 *       404:
 *         description: Custodian ID not found
 *       500:
 *         description: Error updating custodian ID
 */
router.put("/updateCustodianID/:id", verifyToken, updateCustodianID);

/**
 * @swagger
 * /api/custodians/deleteCustodianID/{id}:
 *   delete:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Delete a custodian ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the custodian ID to delete
 *     responses:
 *       200:
 *         description: Custodian ID deleted successfully
 *       404:
 *         description: Custodian ID not found
 *       500:
 *         description: Error deleting custodian ID
 */
router.delete("/deleteCustodianID/:id", verifyToken, deleteCustodianID);

/**
 * @swagger
 * /api/custodians/custodianID/{id}:
 *   get:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Get a single custodian ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the custodian ID
 *     responses:
 *       200:
 *         description: Custodian ID retrieved successfully
 *       404:
 *         description: Custodian ID not found
 */
router.get("/custodianID/:id", verifyToken, getCustodianIDById);

/**
 * @swagger
 * /api/custodians/custodianIDs:
 *   get:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Get all custodian IDs with pagination
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
 *         description: Custodian IDs retrieved successfully
 *       500:
 *         description: Error retrieving custodian IDs
 */
router.get("/custodianIDs", verifyToken, getAllCustodianIDs);

/**
 * @swagger
 * /api/custodians/filterCustodianIDs:
 *   get:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Filter custodian IDs by status
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
 *         description: Filtered custodian IDs retrieved successfully
 *       500:
 *         description: Error filtering custodian IDs
 */
router.get("/filterCustodianIDs", verifyToken, filterCustodianIDs);

/**
 * @swagger
 * /api/custodians/exportFilteredCustodianIDsToCSV:
 *   get:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Export filtered custodian IDs to CSV
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
router.get("/exportFilteredCustodianIDsToCSV", verifyToken, exportFilteredCustodianIDsToCSV);

/**
 * @swagger
 * /api/custodians/exportFilteredCustodianIDsToPDF:
 *   get:
 *     tags:
 *       - Manage Custodian IDs
 *     summary: Export filtered custodian IDs to PDF
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
router.get("/exportFilteredCustodianIDsToPDF", verifyToken, exportFilteredCustodianIDsToPDF);

module.exports = router;