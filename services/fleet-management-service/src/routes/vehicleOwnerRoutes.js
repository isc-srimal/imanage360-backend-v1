const express = require("express");
const {
  createVehicleOwner,
  updateVehicleOwner,
  deleteVehicleOwner,
  getVehicleOwnerById,
  getAllVehicleOwners,
  filterVehicleOwners,
  exportFilteredVehicleOwnersToCSV,
  exportFilteredVehicleOwnersToPDF,
  getAvailableVehicleOwners, 
} = require("../../controllers/fleet-management/vehicleOwnerController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/vehicle-owners/createVehicleOwner:
 *   post:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Create a new vehicle owner
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               own_vehicle:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Vehicle owner created successfully
 *       500:
 *         description: Error creating vehicle owner
 */
router.post("/createVehicleOwner", verifyToken, createVehicleOwner);

/**
 * @swagger
 * /api/vehicle-owners/updateVehicleOwner/{vehicle_owner_id}:
 *   put:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Update an existing vehicle owner
 *     parameters:
 *       - in: path
 *         name: vehicle_owner_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle owner to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               own_vehicle:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Vehicle owner updated successfully
 *       404:
 *         description: Vehicle owner not found
 *       500:
 *         description: Error updating vehicle owner
 */
router.put("/updateVehicleOwner/:vehicle_owner_id", verifyToken, updateVehicleOwner);

/**
 * @swagger
 * /api/vehicle-owners/deleteVehicleOwner/{vehicle_owner_id}:
 *   delete:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Delete a vehicle owner by ID
 *     parameters:
 *       - in: path
 *         name: vehicle_owner_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle owner to delete
 *     responses:
 *       200:
 *         description: Vehicle owner deleted successfully
 *       404:
 *         description: Vehicle owner not found
 *       500:
 *         description: Error deleting vehicle owner
 */
router.delete("/deleteVehicleOwner/:vehicle_owner_id", verifyToken, deleteVehicleOwner);

/**
 * @swagger
 * /api/vehicle-owners/vehicleOwner/{vehicle_owner_id}:
 *   get:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Get a single vehicle owner by ID
 *     parameters:
 *       - in: path
 *         name: vehicle_owner_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle owner
 *     responses:
 *       200:
 *         description: Vehicle owner retrieved successfully
 *       404:
 *         description: Vehicle owner not found
 */
router.get("/vehicleOwner/:vehicle_owner_id", verifyToken, getVehicleOwnerById);

/**
 * @swagger
 * /api/vehicle-owners/vehicleOwners:
 *   get:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Get all vehicle owners with pagination
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
 *         description: Vehicle owners retrieved successfully
 *       500:
 *         description: Error retrieving vehicle owners
 */
router.get("/vehicleOwners", verifyToken, getAllVehicleOwners);

/**
 * @swagger
 * /api/vehicle-owners/filterVehicleOwners:
 *   get:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Filter vehicle owners by status
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
 *         description: Filtered vehicle owners retrieved successfully
 *       500:
 *         description: Error filtering vehicle owners
 */
router.get("/filterVehicleOwners", verifyToken, filterVehicleOwners);

/**
 * @swagger
 * /api/vehicle-owners/exportFilteredVehicleOwnersToCSV:
 *   get:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Export filtered vehicle owners to CSV
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
router.get("/exportFilteredVehicleOwnersToCSV", verifyToken, exportFilteredVehicleOwnersToCSV);

/**
 * @swagger
 * /api/vehicle-owners/exportFilteredVehicleOwnersToPDF:
 *   get:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Export filtered vehicle owners to PDF
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
router.get("/exportFilteredVehicleOwnersToPDF", verifyToken, exportFilteredVehicleOwnersToPDF);

/**
 * @swagger
 * /api/vehicle-owners/availableOwners:
 *   get:
 *     tags:
 *       - Manage Vehicle Owners
 *     summary: Get available vehicle owners (own_vehicle = false)
 *     responses:
 *       200:
 *         description: Available vehicle owners retrieved successfully
 *       500:
 *         description: Error retrieving vehicle owners
 */
router.get("/availableOwners", verifyToken, getAvailableVehicleOwners);

module.exports = router;