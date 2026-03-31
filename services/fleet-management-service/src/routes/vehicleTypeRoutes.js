const express = require("express");
const {
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
  getVehicleTypeById,
  getAllVehicleTypes,
  filterVehicleTypes,
  exportFilteredVehicleTypesToCSV,
  exportFilteredVehicleTypesToPDF,
} = require("../controllers/vehicleTypeController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/vehicle-types/vehicleTypes:
 *   get:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Get all vehicle types with pagination
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
 *         description: Vehicle types retrieved successfully
 *       500:
 *         description: Error retrieving vehicle types
 */
router.get("/vehicleTypes", verifyToken, getAllVehicleTypes);

/**
 * @swagger
 * /api/vehicle-types/filterVehicleTypes:
 *   get:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Filter vehicle types by status
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
 *         description: Filtered vehicle types retrieved successfully
 *       500:
 *         description: Error filtering vehicle types
 */
router.get("/filterVehicleTypes", verifyToken, filterVehicleTypes);

/**
 * @swagger
 * /api/vehicle-types/createVehicleType:
 *   post:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Create a new vehicle type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               capacity_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Vehicle type created successfully
 *       500:
 *         description: Error creating vehicle type
 */
router.post("/createVehicleType", verifyToken, createVehicleType);

/**
 * @swagger
 * /api/vehicle-types/updateVehicleType/{vehicle_type_id}:
 *   put:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Update an existing vehicle type
 *     parameters:
 *       - in: path
 *         name: vehicle_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               capacity_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Vehicle type updated successfully
 *       404:
 *         description: Vehicle type not found
 *       500:
 *         description: Error updating vehicle type
 */
router.put("/updateVehicleType/:vehicle_type_id", verifyToken, updateVehicleType);

/**
 * @swagger
 * /api/vehicle-types/deleteVehicleType/{vehicle_type_id}:
 *   delete:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Delete a vehicle type by ID
 *     parameters:
 *       - in: path
 *         name: vehicle_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle type to delete
 *     responses:
 *       200:
 *         description: Vehicle type deleted successfully
 *       404:
 *         description: Vehicle type not found
 *       500:
 *         description: Error deleting vehicle type
 */
router.delete("/deleteVehicleType/:vehicle_type_id", verifyToken, deleteVehicleType);

/**
 * @swagger
 * /api/vehicle-types/vehicleType/{vehicle_type_id}:
 *   get:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Get a single vehicle type by ID
 *     parameters:
 *       - in: path
 *         name: vehicle_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the vehicle type
 *     responses:
 *       200:
 *         description: Vehicle type retrieved successfully
 *       404:
 *         description: Vehicle type not found
 */
router.get("/vehicleType/:vehicle_type_id", verifyToken, getVehicleTypeById);

/**
 * @swagger
 * /api/vehicle-types/exportFilteredVehicleTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Export filtered vehicle types to CSV
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
router.get("/exportFilteredVehicleTypesToCSV", verifyToken, exportFilteredVehicleTypesToCSV);

/**
 * @swagger
 * /api/vehicle-types/exportFilteredVehicleTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Vehicle Types
 *     summary: Export filtered vehicle types to PDF
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
router.get("/exportFilteredVehicleTypesToPDF", verifyToken, exportFilteredVehicleTypesToPDF);

module.exports = router;