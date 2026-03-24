const express = require("express");
const {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationById,
  getAllOrganizations,
  exportOrganizationsToCSV,
  exportOrganizationsToPDF,
} = require("../../controllers/subscription/organizationsController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/organizations/createOrganization:
 *   post:
 *     tags:
 *       - Manage Organizations
 *     summary: Create a new organization
 *     description: This endpoint allows you to create a new organization record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               description:
 *                 type: string
 *               country_uid:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Organization created successfully
 *       500:
 *         description: Server error
 */
router.post("/createOrganization", verifyToken, createOrganization);

/**
 * @swagger
 * /api/organizations/updateOrganization/{id}:
 *   put:
 *     tags:
 *       - Manage Organizations
 *     summary: Update an existing organization
 *     description: This endpoint allows you to update an existing organization record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the organization to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               description:
 *                 type: string
 *               country_uid:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
router.put("/updateOrganization/:id", verifyToken, updateOrganization);

/**
 * @swagger
 * /api/organizations/deleteOrganization/{id}:
 *   delete:
 *     tags:
 *       - Manage Organizations
 *     summary: Delete an organization
 *     description: This endpoint allows you to delete an organization by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the organization to delete
 *     responses:
 *       200:
 *         description: Organization deleted successfully
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteOrganization/:id", verifyToken, deleteOrganization);

/**
 * @swagger
 * /api/organizations/organization/{id}:
 *   get:
 *     tags:
 *       - Manage Organizations
 *     summary: Get a single organization by ID
 *     description: This endpoint allows you to retrieve a specific organization record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the organization to retrieve
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 *       404:
 *         description: Organization not found
 *       500:
 *         description: Server error
 */
router.get("/organization/:id", verifyToken, getOrganizationById);

/**
 * @swagger
 * /api/organizations/organizations:
 *   get:
 *     tags:
 *       - Manage Organizations
 *     summary: Get all organizations with pagination
 *     description: This endpoint retrieves all organizations with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/organizations", verifyToken, getAllOrganizations);

/**
 * @swagger
 * /api/organizations/exportOrganizationsCSV:
 *   get:
 *     tags:
 *       - Manage Organizations
 *     summary: Export organizations to CSV
 *     description: Exports organizations as a CSV file.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 *       404:
 *         description: No organizations found
 *       500:
 *         description: Server error
 */
router.get("/exportOrganizationsCSV", verifyToken, exportOrganizationsToCSV);

/**
 * @swagger
 * /api/organizations/exportOrganizationsPDF:
 *   get:
 *     tags:
 *       - Manage Organizations
 *     summary: Export organizations to PDF
 *     description: Exports organizations as a PDF file.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: PDF file generated successfully
 *       404:
 *         description: No organizations found
 *       500:
 *         description: Server error
 */
router.get("/exportOrganizationsPDF", verifyToken, exportOrganizationsToPDF);

module.exports = router;