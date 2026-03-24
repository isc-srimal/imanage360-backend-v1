const express = require("express");
const {
  createLocationID,
  updateLocationID,
  deleteLocationID,
  getLocationIDById,
  getAllLocationIDs,
  filterLocationIDs,
  exportFilteredLocationIDsToCSV,
  exportFilteredLocationIDsToPDF,
} = require("../controllers/locationIDController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/locations/createLocationID:
 *   post:
 *     tags:
 *       - Manage Location IDs
 *     summary: Create a new location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Location ID created successfully
 *       500:
 *         description: Error creating location ID
 */
router.post("/createLocationID", verifyToken, createLocationID);

/**
 * @swagger
 * /api/locations/updateLocationID/{id}:
 *   put:
 *     tags:
 *       - Manage Location IDs
 *     summary: Update an existing location ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the location ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Location ID updated successfully
 *       404:
 *         description: Location ID not found
 *       500:
 *         description: Error updating location ID
 */
router.put("/updateLocationID/:id", verifyToken, updateLocationID);

/**
 * @swagger
 * /api/locations/deleteLocationID/{id}:
 *   delete:
 *     tags:
 *       - Manage Location IDs
 *     summary: Delete a location ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the location ID to delete
 *     responses:
 *       200:
 *         description: Location ID deleted successfully
 *       404:
 *         description: Location ID not found
 *       500:
 *         description: Error deleting location ID
 */
router.delete("/deleteLocationID/:id", verifyToken, deleteLocationID);

/**
 * @swagger
 * /api/locations/locationID/{id}:
 *   get:
 *     tags:
 *       - Manage Location IDs
 *     summary: Get a single location ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the location ID
 *     responses:
 *       200:
 *         description: Location ID retrieved successfully
 *       404:
 *         description: Location ID not found
 */
router.get("/locationID/:id", verifyToken, getLocationIDById);

/**
 * @swagger
 * /api/locations/locationIDs:
 *   get:
 *     tags:
 *       - Manage Location IDs
 *     summary: Get all location IDs with pagination
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
 *         description: Location IDs retrieved successfully
 *       500:
 *         description: Error retrieving location IDs
 */
router.get("/locationIDs", verifyToken, getAllLocationIDs);

/**
 * @swagger
 * /api/locations/filterLocationIDs:
 *   get:
 *     tags:
 *       - Manage Location IDs
 *     summary: Filter location IDs by status
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
 *           Makesure type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Filtered location IDs retrieved successfully
 *       500:
 *         description: Error filtering location IDs
 */
router.get("/filterLocationIDs", verifyToken, filterLocationIDs);

/**
 * @swagger
 * /api/locations/exportFilteredLocationIDsToCSV:
 *   get:
 *     tags:
 *       - Manage Location IDs
 *     summary: Export filtered location IDs to CSV
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
router.get("/exportFilteredLocationIDsToCSV", verifyToken, exportFilteredLocationIDsToCSV);

/**
 * @swagger
 * /api/locations/exportFilteredLocationIDsToPDF:
 *   get:
 *     tags:
 *       - Manage Location IDs
 *     summary: Export filtered location IDs to PDF
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
router.get("/exportFilteredLocationIDsToPDF", verifyToken, exportFilteredLocationIDsToPDF);

module.exports = router;