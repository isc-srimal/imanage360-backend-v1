const express = require("express");
const {
  createService,
  updateService,
  deleteService,
  getServiceById,
  getAllServices,
  filterServices,
  exportFilteredServicesToCSV,
  exportFilteredServicesToPDF,
} = require("../../controllers/fleet-management/servicesController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/services/createService:
 *   post:
 *     tags:
 *       - Manage Services
 *     summary: Create a new service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_category_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               service_type_one_id:
 *                 type: integer
 *               service_type_two_id:
 *                 type: integer
 *               engine_hours:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Service created successfully
 *       500:
 *         description: Error creating service
 */
router.post("/createService", verifyToken, createService);

/**
 * @swagger
 * /api/services/updateService/{service_id}:
 *   put:
 *     tags:
 *       - Manage Services
 *     summary: Update an existing service
 *     parameters:
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_category_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               service_type_one_id:
 *                 type: integer
 *               service_type_two_id:
 *                 type: integer
 *               engine_hours:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Error updating service
 */
router.put("/updateService/:service_id", verifyToken, updateService);

/**
 * @swagger
 * /api/services/deleteService/{service_id}:
 *   delete:
 *     tags:
 *       - Manage Services
 *     summary: Delete a service by ID
 *     parameters:
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service to delete
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       404:
 *         description: Service not found
 *       500:
 *         description: Error deleting service
 */
router.delete("/deleteService/:service_id", verifyToken, deleteService);

/**
 * @swagger
 * /api/services/service/{service_id}:
 *   get:
 *     tags:
 *       - Manage Services
 *     summary: Get a single service by ID
 *     parameters:
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service
 *     responses:
 *       200:
 *         description: Service retrieved successfully
 *       404:
 *         description: Service not found
 */
router.get("/service/:service_id", verifyToken, getServiceById);

/**
 * @swagger
 * /api/services/services:
 *   get:
 *     tags:
 *       - Manage Services
 *     summary: Get all services with pagination
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
 *         description: Services retrieved successfully
 *       500:
 *         description: Error retrieving services
 */
router.get("/services", verifyToken, getAllServices);

/**
 * @swagger
 * /api/services/filterServices:
 *   get:
 *     tags:
 *       - Manage Services
 *     summary: Filter services by status
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
 *         description: Filtered services retrieved successfully
 *       500:
 *         description: Error filtering services
 */
router.get("/filterServices", verifyToken, filterServices);

/**
 * @swagger
 * /api/services/exportFilteredServicesToCSV:
 *   get:
 *     tags:
 *       - Manage Services
 *     summary: Export filtered services to CSV
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
router.get("/exportFilteredServicesToCSV", verifyToken, exportFilteredServicesToCSV);

/**
 * @swagger
 * /api/services/exportFilteredServicesToPDF:
 *   get:
 *     tags:
 *       - Manage Services
 *     summary: Export filtered services to PDF
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
router.get("/exportFilteredServicesToPDF", verifyToken, exportFilteredServicesToPDF);

module.exports = router;