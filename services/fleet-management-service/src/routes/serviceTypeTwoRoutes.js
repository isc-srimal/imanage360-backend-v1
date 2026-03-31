const express = require("express");
const {
  createServiceTypeTwo,
  updateServiceTypeTwo,
  deleteServiceTypeTwo,
  getServiceTypeTwoById,
  getAllServiceTypeTwos,
  filterServiceTypeTwos,
  exportFilteredServiceTypeTwosToCSV,
  exportFilteredServiceTypeTwosToPDF,
} = require("../controllers/serviceTypeTwoController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/servicetypetwos/createServiceTypeTwo:
 *   post:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Create a new service type two
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_type_one_id:
 *                 type: integer
 *               service_type_two:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Service type two created successfully
 *       500:
 *         description: Error creating service type two
 */
router.post("/createServiceTypeTwo", verifyToken, createServiceTypeTwo);

/**
 * @swagger
 * /api/servicetypetwos/updateServiceTypeTwo/{service_type_two_id}:
 *   put:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Update an existing service type two
 *     parameters:
 *       - in: path
 *         name: service_type_two_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service type two to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_type_one_id:
 *                 type: integer
 *               service_type_two:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Service type two updated successfully
 *       404:
 *         description: Service type two not found
 *       500:
 *         description: Error updating service type two
 */
router.put("/updateServiceTypeTwo/:service_type_two_id", verifyToken, updateServiceTypeTwo);

/**
 * @swagger
 * /api/servicetypetwos/deleteServiceTypeTwo/{service_type_two_id}:
 *   delete:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Delete a service type two by ID
 *     parameters:
 *       - in: path
 *         name: service_type_two_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service type two to delete
 *     responses:
 *       200:
 *         description: Service type two deleted successfully
 *       404:
 *         description: Service type two not found
 *       500:
 *         description: Error deleting service type two
 */
router.delete("/deleteServiceTypeTwo/:service_type_two_id", verifyToken, deleteServiceTypeTwo);

/**
 * @swagger
 * /api/servicetypetwos/serviceTypeTwo/{service_type_two_id}:
 *   get:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Get a single service type two by ID
 *     parameters:
 *       - in: path
 *         name: service_type_two_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service type two
 *     responses:
 *       200:
 *         description: Service type two retrieved successfully
 *       404:
 *         description: Service type two not found
 */
router.get("/serviceTypeTwo/:service_type_two_id", verifyToken, getServiceTypeTwoById);

/**
 * @swagger
 * /api/servicetypetwos/serviceTypeTwos:
 *   get:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Get all service type twos with pagination
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
 *         description: Service type twos retrieved successfully
 *       500:
 *         description: Error retrieving service type twos
 */
router.get("/serviceTypeTwos", verifyToken, getAllServiceTypeTwos);

/**
 * @swagger
 * /api/servicetypetwos/filterServiceTypeTwos:
 *   get:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Filter service type twos by status
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
 *         description: Filtered service type twos retrieved successfully
 *       500:
 *         description: Error filtering service type twos
 */
router.get("/filterServiceTypeTwos", verifyToken, filterServiceTypeTwos);

/**
 * @swagger
 * /api/servicetypetwos/exportFilteredServiceTypeTwosToCSV:
 *   get:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Export filtered service type twos to CSV
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
router.get("/exportFilteredServiceTypeTwosToCSV", verifyToken, exportFilteredServiceTypeTwosToCSV);

/**
 * @swagger
 * /api/servicetypetwos/exportFilteredServiceTypeTwosToPDF:
 *   get:
 *     tags:
 *       - Manage Service Type Twos
 *     summary: Export filtered service type twos to PDF
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
router.get("/exportFilteredServiceTypeTwosToPDF", verifyToken, exportFilteredServiceTypeTwosToPDF);

module.exports = router;