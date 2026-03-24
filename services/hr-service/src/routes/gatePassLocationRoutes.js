// routes/gatePass/gatePassLocationRoutes.js
const express = require("express");
const {
  createGatePassLocation,
  updateGatePassLocation,
  deleteGatePassLocation,
  getGatePassLocationById,
  getAllGatePassLocations,
  filterGatePassLocations,
  exportFilteredLocationsToCSV,
  exportFilteredLocationsToPDF,
} = require("../../controllers/hr/gatePassLocationController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/gatepass/location/filter:
 *   get:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Filter gate pass locations by status
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *           default: All
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
 *         description: Filtered gate pass locations
 *       500:
 *         description: Server error
 */
router.get("/location/filter", verifyToken, filterGatePassLocations);

/**
 * @swagger
 * /api/gatepass/location:
 *   get:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Get all gate pass locations with pagination
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
 *         description: List of gate pass locations with pagination info
 *       500:
 *         description: Server error
 */
router.get("/location", verifyToken, getAllGatePassLocations);

/**
 * @swagger
 * /api/gatepass/location/export/csv:
 *   get:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Export filtered gate pass locations to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *           default: All
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No records found
 *       500:
 *         description: Server error
 */
router.get("/location/export/csv", verifyToken, exportFilteredLocationsToCSV);

/**
 * @swagger
 * /api/gatepass/location/export/pdf:
 *   get:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Export filtered gate pass locations to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *           default: All
 *     responses:
 *       200:
 *         description: PDF file downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No records found
 *       500:
 *         description: Server error
 */
router.get("/location/export/pdf", verifyToken, exportFilteredLocationsToPDF);

/**
 * @swagger
 * /api/gatepass/location/create:
 *   post:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Create a new gate pass location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gatePassLocation
 *             properties:
 *               gatePassLocation:
 *                 type: string
 *                 example: "Main Gate"
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 default: Active
 *     responses:
 *       201:
 *         description: Gate pass location created successfully
 *       500:
 *         description: Server error
 */
router.post("/location/create", verifyToken, createGatePassLocation);

/**
 * @swagger
 * /api/gatepass/location/update/{id}:
 *   put:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Update an existing gate pass location
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gate pass location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gatePassLocation:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Gate pass location updated successfully
 *       404:
 *         description: Gate pass location not found
 *       500:
 *         description: Server error
 */
router.put("/location/update/:id", verifyToken, updateGatePassLocation);

/**
 * @swagger
 * /api/gatepass/location/delete/{id}:
 *   delete:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Delete a gate pass location
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gate pass location ID
 *     responses:
 *       200:
 *         description: Gate pass location deleted successfully
 *       404:
 *         description: Gate pass location not found
 *       500:
 *         description: Server error
 */
router.delete("/location/delete/:id", verifyToken, deleteGatePassLocation);

/**
 * @swagger
 * /api/gatepass/location/{id}:
 *   get:
 *     tags:
 *       - Manage Gate Pass Locations
 *     summary: Get a single gate pass location by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gate pass location ID
 *     responses:
 *       200:
 *         description: Gate pass location retrieved successfully
 *       404:
 *         description: Gate pass location not found
 *       500:
 *         description: Server error
 */
router.get("/location/:id", verifyToken, getGatePassLocationById);

module.exports = router;