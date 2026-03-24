const express = require("express");
const {
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantById,
  getAllTenants,
  exportTenantsToCSV,
  exportTenantsToPDF,
} = require("../../controllers/subscription/tenantsController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/tenants/createTenant:
 *   post:
 *     tags:
 *       - Manage Tenants
 *     summary: Create a new tenant
 *     description: This endpoint allows you to create a new tenant record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization_uid:
 *                 type: integer
 *               tenant:
 *                 type: string
 *               domain:
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
 *         description: Tenant created successfully
 *       500:
 *         description: Server error
 */
router.post("/createTenant", verifyToken, createTenant);

/**
 * @swagger
 * /api/tenants/updateTenant/{id}:
 *   put:
 *     tags:
 *       - Manage Tenants
 *     summary: Update an existing tenant
 *     description: This endpoint allows you to update an existing tenant record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tenant to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization_uid:
 *                 type: integer
 *               tenant:
 *                 type: string
 *               domain:
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
 *         description: Tenant updated successfully
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Server error
 */
router.put("/updateTenant/:id", verifyToken, updateTenant);

/**
 * @swagger
 * /api/tenants/deleteTenant/{id}:
 *   delete:
 *     tags:
 *       - Manage Tenants
 *     summary: Delete a tenant
 *     description: This endpoint allows you to delete a tenant by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tenant to delete
 *     responses:
 *       200:
 *         description: Tenant deleted successfully
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteTenant/:id", verifyToken, deleteTenant);

/**
 * @swagger
 * /api/tenants/tenant/{id}:
 *   get:
 *     tags:
 *       - Manage Tenants
 *     summary: Get a single tenant by ID
 *     description: This endpoint allows you to retrieve a specific tenant record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the tenant to retrieve
 *     responses:
 *       200:
 *         description: Tenant retrieved successfully
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Server error
 */
router.get("/tenant/:id", verifyToken, getTenantById);

/**
 * @swagger
 * /api/tenants/tenants:
 *   get:
 *     tags:
 *       - Manage Tenants
 *     summary: Get all tenants with pagination
 *     description: This endpoint retrieves all tenants with pagination support.
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
 *         description: Tenants retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/tenants", verifyToken, getAllTenants);

/**
 * @swagger
 * /api/tenants/exportTenantsCSV:
 *   get:
 *     tags:
 *       - Manage Tenants
 *     summary: Export tenants to CSV
 *     description: Exports tenants as a CSV file.
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
 *         description: No tenants found
 *       500:
 *         description: Server error
 */
router.get("/exportTenantsCSV", verifyToken, exportTenantsToCSV);

/**
 * @swagger
 * /api/tenants/exportTenantsPDF:
 *   get:
 *     tags:
 *       - Manage Tenants
 *     summary: Export tenants to PDF
 *     description: Exports tenants as a PDF file.
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
 *         description: No tenants found
 *       500:
 *         description: Server error
 */
router.get("/exportTenantsPDF", verifyToken, exportTenantsToPDF);

module.exports = router;