const express = require("express");
const {
  createRole,
  updateRole,
  deleteRole,
  getRoleById,
  getAllRoles,
  filterRoles,
  exportFilteredRolesToCSV,
  exportFilteredRolesToPDF,
  getPermissionCountForRole,
  getRolePermissions,
} = require("../controllers/rolesController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/roles/createRole:
 *   post:
 *     tags:
 *       - Manage Role Data
 *     summary: Create a new role
 *     description: This endpoint allows you to create a new role record with permissions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               is_business_role:
 *                 type: boolean
 *               tenant_uid:
 *                 type: integer
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of permission UIDs to assign to the role
 *     responses:
 *       201:
 *         description: Role created successfully
 *       500:
 *         description: Server error
 */
router.post("/createRole", verifyToken, createRole);

/**
 * @swagger
 * /api/roles/updateRole/{id}:
 *   put:
 *     tags:
 *       - Manage Role Data
 *     summary: Update an existing role
 *     description: This endpoint allows you to update an existing role record with permissions.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_name:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               is_business_role:
 *                 type: boolean
 *               tenant_uid:
 *                 type: integer
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of permission UIDs to assign to the role
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.put("/updateRole/:id", verifyToken, updateRole);

/**
 * @swagger
 * /api/roles/deleteRole/{id}:
 *   delete:
 *     tags:
 *       - Manage Role Data
 *     summary: Delete a role
 *     description: This endpoint allows you to delete a role by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteRole/:id", verifyToken, deleteRole);

/**
 * @swagger
 * /api/roles/role/{id}:
 *   get:
 *     tags:
 *       - Manage Role Data
 *     summary: Get a single role by ID
 *     description: This endpoint allows you to retrieve a specific role record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to retrieve
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.get("/role/:id", verifyToken, getRoleById);

/**
 * @swagger
 * /api/roles/roles:
 *   get:
 *     tags:
 *       - Manage Role Data
 *     summary: Get all roles with pagination
 *     description: This endpoint retrieves all roles with pagination support.
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
 *         description: Roles retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/roles", verifyToken, getAllRoles);

/**
 * @swagger
 * /api/roles/filterRoles:
 *   get:
 *     tags:
 *       - Manage Role Data
 *     summary: Filter roles based on status
 *     description: This endpoint retrieves roles filtered by status with pagination support.
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
 *         description: Filtered roles retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/filterRoles", verifyToken, filterRoles);

/**
 * @swagger
 * /api/roles/exportFilteredRolesCSV:
 *   get:
 *     tags:
 *       - Manage Role Data
 *     summary: Export filtered roles to CSV
 *     description: Exports roles filtered by status as a CSV file.
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
 *         description: No roles found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredRolesCSV", verifyToken, exportFilteredRolesToCSV);

/**
 * @swagger
 * /api/roles/exportFilteredRolesPDF:
 *   get:
 *     tags:
 *       - Manage Role Data
 *     summary: Export filtered roles to PDF
 *     description: Exports roles filtered by status as a PDF file.
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
 *         description: No roles found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredRolesPDF", verifyToken, exportFilteredRolesToPDF);

/**
 * @swagger
 * /api/roles/permissionCount/{id}:
 *   get:
 *     tags:
 *       - Manage Role Data
 *     summary: Get permission count for a role
 *     description: This endpoint retrieves the count of active permissions associated with a specific role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to retrieve permission count for
 *     responses:
 *       200:
 *         description: Permission count retrieved successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.get("/permissionCount/:id", verifyToken, getPermissionCountForRole);

/**
 * @swagger
 * /api/roles/rolePermissions/{id}:
 *   get:
 *     tags:
 *       - Manage Role Data
 *     summary: Get permissions for a role
 *     description: This endpoint retrieves the permissions associated with a specific role.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role to retrieve permissions for
 *     responses:
 *       200:
 *         description: Role permissions retrieved successfully
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
router.get("/rolePermissions/:id", verifyToken, getRolePermissions);

module.exports = router;