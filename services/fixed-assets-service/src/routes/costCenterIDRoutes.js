const express = require("express");
const {
  createCostCenterID,
  updateCostCenterID,
  deleteCostCenterID,
  getCostCenterIDById,
  getAllCostCenterIDs,
  filterCostCenterIDs,
  exportFilteredCostCenterIDsToCSV,
  exportFilteredCostCenterIDsToPDF,
} = require("../controllers/costCenterIDController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/costcenters/createCostCenterID:
 *   post:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Create a new cost center ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cost_center_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Cost center ID created successfully
 *       500:
 *         description: Error creating cost center ID
 */
router.post("/createCostCenterID", verifyToken, createCostCenterID);

/**
 * @swagger
 * /api/costcenters/updateCostCenterID/{id}:
 *   put:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Update an existing cost center ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cost center ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cost_center_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Cost center ID updated successfully
 *       404:
 *         description: Cost center ID not found
 *       500:
 *         description: Error updating cost center ID
 */
router.put("/updateCostCenterID/:id", verifyToken, updateCostCenterID);

/**
 * @swagger
 * /api/costcenters/deleteCostCenterID/{id}:
 *   delete:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Delete a cost center ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cost center ID to delete
 *     responses:
 *       200:
 *         description: Cost center ID deleted successfully
 *       404:
 *         description: Cost center ID not found
 *       500:
 *         description: Error deleting cost center ID
 */
router.delete("/deleteCostCenterID/:id", verifyToken, deleteCostCenterID);

/**
 * @swagger
 * /api/costcenters/costCenterID/{id}:
 *   get:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Get a single cost center ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the cost center ID
 *     responses:
 *       200:
 *         description: Cost center ID retrieved successfully
 *       404:
 *         description: Cost center ID not found
 */
router.get("/costCenterID/:id", verifyToken, getCostCenterIDById);

/**
 * @swagger
 * /api/costcenters/costCenterIDs:
 *   get:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Get all cost center IDs with pagination
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
 *         description: Cost center IDs retrieved successfully
 *       500:
 *         description: Error retrieving cost center IDs
 */
router.get("/costCenterIDs", verifyToken, getAllCostCenterIDs);

/**
 * @swagger
 * /api/costcenters/filterCostCenterIDs:
 *   get:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Filter cost center IDs by status
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
 *         description: Filtered cost center IDs retrieved successfully
 *       500:
 *         description: Error filtering cost center IDs
 */
router.get("/filterCostCenterIDs", verifyToken, filterCostCenterIDs);

/**
 * @swagger
 * /api/costcenters/exportFilteredCostCenterIDsToCSV:
 *   get:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Export filtered cost center IDs to CSV
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
router.get("/exportFilteredCostCenterIDsToCSV", verifyToken, exportFilteredCostCenterIDsToCSV);

/**
 * @swagger
 * /api/costcenters/exportFilteredCostCenterIDsToPDF:
 *   get:
 *     tags:
 *       - Manage Cost Center IDs
 *     summary: Export filtered cost center IDs to PDF
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
router.get("/exportFilteredCostCenterIDsToPDF", verifyToken, exportFilteredCostCenterIDsToPDF);

module.exports = router;