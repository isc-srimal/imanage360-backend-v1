const express = require("express");
const {
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  getServiceProviderById,
  getAllServiceProviders,
  filterServiceProviders,
  exportFilteredServiceProvidersToCSV,
  exportFilteredServiceProvidersToPDF,
} = require("../controllers/serviceProviderController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/serviceproviders/createServiceProvider:
 *   post:
 *     tags:
 *       - Manage Service Providers
 *     summary: Create a new service provider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_provider:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Service provider created successfully
 *       500:
 *         description: Error creating service provider
 */
router.post("/createServiceProvider", verifyToken, createServiceProvider);

/**
 * @swagger
 * /api/serviceproviders/updateServiceProvider/{service_provider_id}:
 *   put:
 *     tags:
 *       - Manage Service Providers
 *     summary: Update an existing service provider
 *     parameters:
 *       - in: path
 *         name: service_provider_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service provider to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_provider:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Service provider updated successfully
 *       404:
 *         description: Service provider not found
 *       500:
 *         description: Error updating service provider
 */
router.put("/updateServiceProvider/:service_provider_id", verifyToken, updateServiceProvider);

/**
 * @swagger
 * /api/serviceproviders/deleteServiceProvider/{service_provider_id}:
 *   delete:
 *     tags:
 *       - Manage Service Providers
 *     summary: Delete a service provider by ID
 *     parameters:
 *       - in: path
 *         name: service_provider_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service provider to delete
 *     responses:
 *       200:
 *         description: Service provider deleted successfully
 *       404:
 *         description: Service provider not found
 *       500:
 *         description: Error deleting service provider
 */
router.delete("/deleteServiceProvider/:service_provider_id", verifyToken, deleteServiceProvider);

/**
 * @swagger
 * /api/serviceproviders/serviceProvider/{service_provider_id}:
 *   get:
 *     tags:
 *       - Manage Service Providers
 *     summary: Get a single service provider by ID
 *     parameters:
 *       - in: path
 *         name: service_provider_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service provider
 *     responses:
 *       200:
 *         description: Service provider retrieved successfully
 *       404:
 *         description: Service provider not found
 */
router.get("/serviceProvider/:service_provider_id", verifyToken, getServiceProviderById);

/**
 * @swagger
 * /api/serviceproviders/serviceProviders:
 *   get:
 *     tags:
 *       - Manage Service Providers
 *     summary: Get all service providers with pagination
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
 *         description: Service providers retrieved successfully
 *       500:
 *         description: Error retrieving service providers
 */
router.get("/serviceProviders", verifyToken, getAllServiceProviders);

/**
 * @swagger
 * /api/serviceproviders/filterServiceProviders:
 *   get:
 *     tags:
 *       - Manage Service Providers
 *     summary: Filter service providers by status
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
 *         description: Filtered service providers retrieved successfully
 *       500:
 *         description: Error filtering service providers
 */
router.get("/filterServiceProviders", verifyToken, filterServiceProviders);

/**
 * @swagger
 * /api/serviceproviders/exportFilteredServiceProvidersToCSV:
 *   get:
 *     tags:
 *       - Manage Service Providers
 *     summary: Export filtered service providers to CSV
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
router.get("/exportFilteredServiceProvidersToCSV", verifyToken, exportFilteredServiceProvidersToCSV);

/**
 * @swagger
 * /api/serviceproviders/exportFilteredServiceProvidersToPDF:
 *   get:
 *     tags:
 *       - Manage Service Providers
 *     summary: Export filtered service providers to PDF
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
router.get("/exportFilteredServiceProvidersToPDF", verifyToken, exportFilteredServiceProvidersToPDF);

module.exports = router;