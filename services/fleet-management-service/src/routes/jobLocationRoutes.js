const express = require("express");
const {
  createJobLocation,
  updateJobLocation,
  deleteJobLocation,
  getJobLocationById,
  getAllJobLocations,
  filterJobLocations,
  exportFilteredJobLocationsToCSV,
  exportFilteredJobLocationsToPDF,
} = require("../../controllers/fleet-management/jobLocationController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/joblocations/createJobLocation:
 *   post:
 *     tags:
 *       - Manage Job Locations
 *     summary: Create a new job location
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_location_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Job location created successfully
 *       500:
 *         description: Error creating job location
 */
router.post("/createJobLocation", verifyToken, createJobLocation);

/**
 * @swagger
 * /api/joblocations/updateJobLocation/{job_location_id}:
 *   put:
 *     tags:
 *       - Manage Job Locations
 *     summary: Update an existing job location
 *     parameters:
 *       - in: path
 *         name: job_location_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job location to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               job_location_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Job location updated successfully
 *       404:
 *         description: Job location not found
 *       500:
 *         description: Error updating job location
 */
router.put("/updateJobLocation/:job_location_id", verifyToken, updateJobLocation);

/**
 * @swagger
 * /api/joblocations/deleteJobLocation/{job_location_id}:
 *   delete:
 *     tags:
 *       - Manage Job Locations
 *     summary: Delete a job location by ID
 *     parameters:
 *       - in: path
 *         name: job_location_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job location to delete
 *     responses:
 *       200:
 *         description: Job location deleted successfully
 *       404:
 *         description: Job location not found
 *       500:
 *         description: Error deleting job location
 */
router.delete("/deleteJobLocation/:job_location_id", verifyToken, deleteJobLocation);

/**
 * @swagger
 * /api/joblocations/jobLocation/{job_location_id}:
 *   get:
 *     tags:
 *       - Manage Job Locations
 *     summary: Get a single job location by ID
 *     parameters:
 *       - in: path
 *         name: job_location_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job location
 *     responses:
 *       200:
 *         description: Job location retrieved successfully
 *       404:
 *         description: Job location not found
 */
router.get("/jobLocation/:job_location_id", verifyToken, getJobLocationById);

/**
 * @swagger
 * /api/joblocations/jobLocations:
 *   get:
 *     tags:
 *       - Manage Job Locations
 *     summary: Get all job locations with pagination
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
 *         description: Job locations retrieved successfully
 *       500:
 *         description: Error retrieving job locations
 */
router.get("/jobLocations", verifyToken, getAllJobLocations);

/**
 * @swagger
 * /api/joblocations/filterJobLocations:
 *   get:
 *     tags:
 *       - Manage Job Locations
 *     summary: Filter job locations by status
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
 *         description: Filtered job locations retrieved successfully
 *       500:
 *         description: Error filtering job locations
 */
router.get("/filterJobLocations", verifyToken, filterJobLocations);

/**
 * @swagger
 * /api/joblocations/exportFilteredJobLocationsToCSV:
 *   get:
 *     tags:
 *       - Manage Job Locations
 *     summary: Export filtered job locations to CSV
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
router.get("/exportFilteredJobLocationsToCSV", verifyToken, exportFilteredJobLocationsToCSV);

/**
 * @swagger
 * /api/joblocations/exportFilteredJobLocationsToPDF:
 *   get:
 *     tags:
 *       - Manage Job Locations
 *     summary: Export filtered job locations to PDF
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
router.get("/exportFilteredJobLocationsToPDF", verifyToken, exportFilteredJobLocationsToPDF);

module.exports = router;