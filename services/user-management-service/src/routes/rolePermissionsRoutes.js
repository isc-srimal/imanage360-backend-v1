const express = require("express");
const {
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
  getRolePermissionById,
  getAllRolePermissions,
  getRolePermissionsByUserId,
  exportRolePermissionsToCSV,
  exportRolePermissionsToPDF,
} = require("../../controllers/user-security-management/rolePermissionsController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/role-permissions/createRolePermission:
 *   post:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Create a new role permission mapping
 *     description: This endpoint allows you to create a new role permission mapping record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_uid:
 *                 type: integer
 *                 description: The UID of the role
 *               permission_uid:
 *                 type: integer
 *                 description: The UID of the permission
 *     responses:
 *       201:
 *         description: Role permission created successfully
 *       500:
 *         description: Server error
 */
router.post("/createRolePermission", verifyToken, createRolePermission);

/**
 * @swagger
 * /api/role-permissions/updateRolePermission/{id}:
 *   put:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Update an existing role permission mapping
 *     description: This endpoint allows you to update an existing role permission mapping record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role_uid:
 *                 type: integer
 *                 description: The UID of the role
 *               permission_uid:
 *                 type: integer
 *                 description: The UID of the permission
 *     responses:
 *       200:
 *         description: Role permission updated successfully
 *       404:
 *         description: Role permission not found
 *       500:
 *         description: Server error
 */
router.put("/updateRolePermission/:id", verifyToken, updateRolePermission);

/**
 * @swagger
 * /api/role-permissions/deleteRolePermission/{id}:
 *   delete:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Delete a role permission mapping
 *     description: This endpoint allows you to delete a role permission mapping by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role permission to delete
 *     responses:
 *       200:
 *         description: Role permission deleted successfully
 *       404:
 *         description: Role permission not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteRolePermission/:id", verifyToken, deleteRolePermission);

/**
 * @swagger
 * /api/role-permissions/rolePermission/{id}:
 *   get:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Get a single role permission by ID
 *     description: This endpoint allows you to retrieve a specific role permission record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the role permission to retrieve
 *     responses:
 *       200:
 *         description: Role permission retrieved successfully
 *       404:
 *         description: Role permission not found
 *       500:
 *         description: Server error
 */
router.get("/rolePermission/:id", verifyToken, getRolePermissionById);

/**
 * @swagger
 * /api/role-permissions/rolePermissions:
 *   get:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Get all role permissions with super admin logic
 *     description: |
 *       This endpoint retrieves role permissions based on user access level:
 *       - If user is super admin (is_superadmin = 1): Returns empty arrays for roles and permissions
 *       - If user is not super admin: Returns all available role names and permission names
 *       
 *       Response format for super admin:
 *       ```json
 *       {
 *         "roles": [],
 *         "permissions": []
 *       }
 *       ```
 *       
 *       Response format for non-super admin:
 *       ```json
 *       {
 *         "roles": ["Admin", "User", "Manager"],
 *         "permissions": ["sales-crm.all-pipelines.create", "sales-crm.all-pipelines.edit"],
 *         "isSuperAdmin": false
 *       }
 *       ```
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional, ignored for super admin)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional, ignored for super admin)
 *     responses:
 *       200:
 *         description: Role permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Super admin response (empty arrays)
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                       description: Empty array for super admin
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                       description: Empty array for super admin
 *                 - type: object
 *                   description: Non-super admin response
 *                   properties:
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of all available role names
 *                       example: ["Super Admin", "Admin", "Staff"]
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of all available permission names
 *                       example: ["sales-crm.all-pipelines.create", "sales-crm.all-pipelines.edit", "sales-crm.all-pipelines.delete"]
 *                     isSuperAdmin:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/rolePermissions", verifyToken, getAllRolePermissions);

/**
 * @swagger
 * /api/role-permissions/rolePermissions/{id}:
 *   get:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Get all role permissions for a user by ID
 *     description: |
 *       This endpoint retrieves role permissions for a specific user based on their ID:
 *       - If user is super admin (is_superadmin = true): Returns empty arrays for roles and permissions
 *       - If user is not super admin: Returns user's actual assigned role names and permission names based on their group_uid
 *         
 *       Response format for super admin:
 *       ```json
 *       {
 *         "is_superadmin": true,
 *         "roles": [],
 *         "permissions": []
 *       }
 *       ```
 *         
 *       Response format for non-super admin:
 *       ```json
 *       {
 *         "is_superadmin": false,
 *         "roles": ["Admin", "User"],
 *         "permissions": ["sales-crm.all-pipelines.create", "sales-crm.all-pipelines.edit"],
 *         "permissionCount": 2
 *       }
 *       ```
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve role permissions for
 *     responses:
 *       200:
 *         description: Role permissions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Super admin response (empty arrays)
 *                   properties:
 *                     is_superadmin:
 *                       type: boolean
 *                       example: true
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                       description: Empty array for super admin
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                       description: Empty array for super admin
 *                 - type: object
 *                   description: Non-super admin response
 *                   properties:
 *                     is_superadmin:
 *                       type: boolean
 *                       example: false
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of user's assigned role names
 *                       example: ["Admin", "Staff"]
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: Array of user's assigned permission names
 *                       example: ["sales-crm.all-pipelines.create", "sales-crm.all-pipelines.edit", "sales-crm.all-pipelines.delete"]
 *                     permissionCount:
 *                       type: integer
 *                       example: 3
 *                       description: Total count of permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/rolePermissions/:id", verifyToken, getRolePermissionsByUserId);

/**
 * @swagger
 * /api/role-permissions/exportRolePermissionsCSV:
 *   get:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Export role permissions to CSV
 *     description: Exports role permissions as a CSV file with role names and permission names.
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
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       404:
 *         description: No role permissions found
 *       500:
 *         description: Server error
 */
router.get("/exportRolePermissionsCSV", verifyToken, exportRolePermissionsToCSV);

/**
 * @swagger
 * /api/role-permissions/exportRolePermissionsPDF:
 *   get:
 *     tags:
 *       - Manage Role Permissions
 *     summary: Export role permissions to PDF
 *     description: Exports role permissions as a PDF file with role names and permission names.
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
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No role permissions found
 *       500:
 *         description: Server error
 */
router.get("/exportRolePermissionsPDF", verifyToken, exportRolePermissionsToPDF);

module.exports = router;