const express = require("express");
const {
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionById,
  getAllPermissions,
  filterPermissions,
  exportFilteredPermissionsToCSV,
  exportFilteredPermissionsToPDF,
} = require("../controllers/permissionsController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/permissions/createPermission:
 *   post:
 *     tags:
 *       - Manage Permissions
 *     summary: Create a new permission
 *     description: This endpoint allows you to create a new permission record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_uid:
 *                 type: integer
 *               permission:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       500:
 *         description: Server error
 */
router.post("/createPermission", verifyToken, createPermission);

/**
 * @swagger
 * /api/permissions/updatePermission/{id}:
 *   put:
 *     tags:
 *       - Manage Permissions
 *     summary: Update an existing permission
 *     description: This endpoint allows you to update an existing permission record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_uid:
 *                 type: integer
 *               permission:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.put("/updatePermission/:id", verifyToken, updatePermission);

/**
 * @swagger
 * /api/permissions/deletePermission/{id}:
 *   delete:
 *     tags:
 *       - Manage Permissions
 *     summary: Delete a permission
 *     description: This endpoint allows you to delete a permission by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the permission to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.delete("/deletePermission/:id", verifyToken, deletePermission);

/**
 * @swagger
 * /api/permissions/permission/{id}:
 *   get:
 *     tags:
 *       - Manage Permissions
 *     summary: Get a single permission by ID
 *     description: This endpoint allows you to retrieve a specific permission record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the permission to retrieve
 *     responses:
 *       200:
 *         description: Permission retrieved successfully
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Server error
 */
router.get("/permission/:id", verifyToken, getPermissionById);

/**
 * @swagger
 * /api/permissions/permissions:
 *   get:
 *     tags:
 *       - Manage Permissions
 *     summary: Get all permissions with pagination
 *     description: This endpoint retrieves all permissions with pagination support.
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
 *         description: Permissions retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/permissions", verifyToken, getAllPermissions);

/**
 * @swagger
 * /api/permissions/filterPermissions:
 *   get:
 *     tags:
 *       - Manage Permissions
 *     summary: Filter permissions based on status
 *     description: This endpoint retrieves permissions filtered by status with pagination support.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         enum: [All, Active, Inactive]
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
 *         description: Filtered permissions retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/filterPermissions", verifyToken, filterPermissions);

/**
 * @swagger
 * /api/permissions/exportFilteredPermissionsCSV:
 *   get:
 *     tags:
 *       - Manage Permissions
 *     summary: Export filtered permissions to CSV
 *     description: Exports permissions filtered by status as a CSV file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         enum: [All, Active, Inactive]
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
 *         description: No permissions found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredPermissionsCSV", verifyToken, exportFilteredPermissionsToCSV);

/**
 * @swagger
 * /api/permissions/exportFilteredPermissionsPDF:
 *   get:
 *     tags:
 *       - Manage Permissions
 *     summary: Export filtered permissions to PDF
 *     description: Exports permissions filtered by status as a PDF file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         enum: [All, Active, Inactive]
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
 *         description: No permissions found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredPermissionsPDF", verifyToken, exportFilteredPermissionsToPDF);

module.exports = router;