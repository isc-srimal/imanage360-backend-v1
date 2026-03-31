const express = require("express");
const {
  createNextServiceType,
  updateNextServiceType,
  deleteNextServiceType,
  getNextServiceTypeById,
  getAllNextServiceTypes,
  filterNextServiceTypes,
  exportFilteredNextServiceTypesToCSV,
  exportFilteredNextServiceTypesToPDF,
} = require("../controllers/nextServiceTypeController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/nextservicetypes/createNextServiceType:
 *   post:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Create a new next service type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               next_service_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Next service type created successfully
 *       500:
 *         description: Error creating next service type
 */
router.post("/createNextServiceType", verifyToken, createNextServiceType);

/**
 * @swagger
 * /api/nextservicetypes/updateNextServiceType/{next_service_type_id}:
 *   put:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Update an existing next service type
 *     parameters:
 *       - in: path
 *         name: next_service_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the next service type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               next_service_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Next service type updated successfully
 *       404:
 *         description: Next service type not found
 *       500:
 *         description: Error updating next service type
 */
router.put("/updateNextServiceType/:next_service_type_id", verifyToken, updateNextServiceType);

/**
 * @swagger
 * /api/nextservicetypes/deleteNextServiceType/{next_service_type_id}:
 *   delete:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Delete a next service type by ID
 *     parameters:
 *       - in: path
 *         name: next_service_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the next service type to delete
 *     responses:
 *       200:
 *         description: Next service type deleted successfully
 *       404:
 *         description: Next service type not found
 *       500:
 *         description: Error deleting next service type
 */
router.delete("/deleteNextServiceType/:next_service_type_id", verifyToken, deleteNextServiceType);

/**
 * @swagger
 * /api/nextservicetypes/nextServiceType/{next_service_type_id}:
 *   get:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Get a single next service type by ID
 *     parameters:
 *       - in: path
 *         name: next_service_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the next service type
 *     responses:
 *       200:
 *         description: Next service type retrieved successfully
 *       404:
 *         description: Next service type not found
 */
router.get("/nextServiceType/:next_service_type_id", verifyToken, getNextServiceTypeById);

/**
 * @swagger
 * /api/nextservicetypes/nextServiceTypes:
 *   get:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Get all next service types with pagination
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
 *         description: Next service types retrieved successfully
 *       500:
 *         description: Error retrieving next service types
 */
router.get("/nextServiceTypes", verifyToken, getAllNextServiceTypes);

/**
 * @swagger
 * /api/nextservicetypes/filterNextServiceTypes:
 *   get:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Filter next service types by status
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
 *         description: Filtered next service types retrieved successfully
 *       500:
 *         description: Error filtering next service types
 */
router.get("/filterNextServiceTypes", verifyToken, filterNextServiceTypes);

/**
 * @swagger
 * /api/nextservicetypes/exportFilteredNextServiceTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Export filtered next service types to CSV
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
router.get("/exportFilteredNextServiceTypesToCSV", verifyToken, exportFilteredNextServiceTypesToCSV);

/**
 * @swagger
 * /api/nextservicetypes/exportFilteredNextServiceTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Next Service Types
 *     summary: Export filtered next service types to PDF
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
router.get("/exportFilteredNextServiceTypesToPDF", verifyToken, exportFilteredNextServiceTypesToPDF);

module.exports = router;