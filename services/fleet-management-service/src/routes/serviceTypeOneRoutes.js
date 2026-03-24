const express = require("express");
const {
  createServiceTypeOne,
  updateServiceTypeOne,
  deleteServiceTypeOne,
  getServiceTypeOneById,
  getAllServiceTypeOnes,
  filterServiceTypeOnes,
  exportFilteredServiceTypeOnesToCSV,
  exportFilteredServiceTypeOnesToPDF,
} = require("../../controllers/fleet-management/serviceTypeOneController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/servicetypeones/createServiceTypeOne:
 *   post:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Create a new service type one
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_type_one:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Service type one created successfully
 *       500:
 *         description: Error creating service type one
 */
router.post("/createServiceTypeOne", verifyToken, createServiceTypeOne);

/**
 * @swagger
 * /api/servicetypeones/updateServiceTypeOne/{service_type_one_id}:
 *   put:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Update an existing service type one
 *     parameters:
 *       - in: path
 *         name: service_type_one_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service type one to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_type_one:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Service type one updated successfully
 *       404:
 *         description: Service type one not found
 *       500:
 *         description: Error updating service type one
 */
router.put("/updateServiceTypeOne/:service_type_one_id", verifyToken, updateServiceTypeOne);

/**
 * @swagger
 * /api/servicetypeones/deleteServiceTypeOne/{service_type_one_id}:
 *   delete:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Delete a service type one by ID
 *     parameters:
 *       - in: path
 *         name: service_type_one_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service type one to delete
 *     responses:
 *       200:
 *         description: Service type one deleted successfully
 *       404:
 *         description: Service type one not found
 *       500:
 *         description: Error deleting service type one
 */
router.delete("/deleteServiceTypeOne/:service_type_one_id", verifyToken, deleteServiceTypeOne);

/**
 * @swagger
 * /api/servicetypeones/serviceTypeOne/{service_type_one_id}:
 *   get:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Get a single service type one by ID
 *     parameters:
 *       - in: path
 *         name: service_type_one_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service type one
 *     responses:
 *       200:
 *         description: Service type one retrieved successfully
 *       404:
 *         description: Service type one not found
 */
router.get("/serviceTypeOne/:service_type_one_id", verifyToken, getServiceTypeOneById);

/**
 * @swagger
 * /api/servicetypeones/serviceTypeOnes:
 *   get:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Get all service type ones with pagination
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
 *         description: Service type ones retrieved successfully
 *       500:
 *         description: Error retrieving service type ones
 */
router.get("/serviceTypeOnes", verifyToken, getAllServiceTypeOnes);

/**
 * @swagger
 * /api/servicetypeones/filterServiceTypeOnes:
 *   get:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Filter service type ones by status
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
 *         description: Filtered service type ones retrieved successfully
 *       500:
 *         description: Error filtering service type ones
 */
router.get("/filterServiceTypeOnes", verifyToken, filterServiceTypeOnes);

/**
 * @swagger
 * /api/servicetypeones/exportFilteredServiceTypeOnesToCSV:
 *   get:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Export filtered service type ones to CSV
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
router.get("/exportFilteredServiceTypeOnesToCSV", verifyToken, exportFilteredServiceTypeOnesToCSV);

/**
 * @swagger
 * /api/servicetypeones/exportFilteredServiceTypeOnesToPDF:
 *   get:
 *     tags:
 *       - Manage Service Type Ones
 *     summary: Export filtered service type ones to PDF
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
router.get("/exportFilteredServiceTypeOnesToPDF", verifyToken, exportFilteredServiceTypeOnesToPDF);

module.exports = router;