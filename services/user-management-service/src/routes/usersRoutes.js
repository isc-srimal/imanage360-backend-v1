const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  filterUsers,
  exportFilteredUsersToCSV,
  exportFilteredUsersToPDF,
} = require("../../controllers/user-security-management/usersController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/users/createUser:
 *   post:
 *     tags:
 *       - Manage User Data
 *     summary: Create a new user
 *     description: Creates a new user record based on the provided user data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - user_type_uid
 *               - group_uid
 *               - organization_uid
 *               - tenant_uid
 *               - branch_uid
 *               - is_superadmin
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *                 example: john_doe
 *               email:
 *                 type: string
 *                 description: Unique email address for the user
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: securepassword123
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: User status
 *                 default: Active
 *               user_type_uid:
 *                 type: integer
 *                 description: Foreign key referencing UserTypesModel
 *                 example: 1
 *               group_uid:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of group IDs the user belongs to
 *                 example: [1, 2]
 *               organization_uid:
 *                 type: integer
 *                 description: Foreign key referencing OrganizationModel
 *                 example: 1
 *               tenant_uid:
 *                 type: integer
 *                 description: Foreign key referencing TenantsModel
 *                 example: 1
 *               branch_uid:
 *                 type: integer
 *                 description: Foreign key referencing BranchModel
 *                 example: 1
 *               employeeId:
 *                 type: integer
 *               is_superadmin:
 *                 type: boolean
 *                 description: Indicates if the user is a superadmin
 *                 example: false
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Server error
 */
router.post("/createUser", verifyToken, createUser);

/**
 * @swagger
 * /api/users/updateUser/{id}:
 *   put:
 *     tags:
 *       - Manage User Data
 *     summary: Update an existing user
 *     description: Updates a user record by ID with the provided data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Updated username
 *                 example: john_doe_updated
 *               email:
 *                 type: string
 *                 description: Updated email address
 *                 example: john.doe.updated@example.com
 *               password:
 *                 type: string
 *                 description: Updated password
 *                 example: newpassword123
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: Updated user status
 *               user_type_uid:
 *                 type: integer
 *                 description: Updated foreign key for UserTypesModel
 *                 example: 2
 *               group_uid:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Updated array of group IDs
 *                 example: [1, 3]
 *               organization_uid:
 *                 type: integer
 *                 description: Updated foreign key for OrganizationModel
 *                 example: 2
 *               tenant_uid:
 *                 type: integer
 *                 description: Updated foreign key for TenantsModel
 *                 example: 2
 *               branch_uid:
 *                 type: integer
 *                 description: Updated foreign key for BranchModel
 *                 example: 2
 *               employeeId:
 *                 type: integer
 *               is_superadmin:
 *                 type: boolean
 *                 description: Updated superadmin status
 *                 example: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.put("/updateUser/:id", verifyToken, updateUser);

/**
 * @swagger
 * /api/users/deleteUser/{id}:
 *   delete:
 *     tags:
 *       - Manage User Data
 *     summary: Delete a user
 *     description: Deletes a user record by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteUser/:id", verifyToken, deleteUser);

/**
 * @swagger
 * /api/users/user/{id}:
 *   get:
 *     tags:
 *       - Manage User Data
 *     summary: Get a single user by ID
 *     description: Retrieves a specific user record by its ID, including associated data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 status:
 *                   type: string
 *                   enum: [Active, Inactive]
 *                 user_type_uid:
 *                   type: integer
 *                 group_uid:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 organization_uid:
 *                   type: integer
 *                 tenant_uid:
 *                   type: integer
 *                 branch_uid:
 *                   type: integer
 *                 employeeId:
 *                   type: integer
 *                 is_superadmin:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/user/:id", verifyToken, getUserById);

/**
 * @swagger
 * /api/users/users:
 *   get:
 *     tags:
 *       - Manage User Data
 *     summary: Get all users with pagination
 *     description: Retrieves all users with pagination, including associated data.
 *     parameters:
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
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       status:
 *                         type: string
 *                       user_type_uid:
 *                         type: integer
 *                       group_uid:
 *                         type: array
 *                         items:
 *                           type: integer
 *                       organization_uid:
 *                         type: integer
 *                       tenant_uid:
 *                         type: integer
 *                       branch_uid:
 *                         type: integer
 *                       employeeId:
 *                         type: integer
 *                       is_superadmin:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get("/users", verifyToken, getAllUsers);

/**
 * @swagger
 * /api/users/filterUsers:
 *   get:
 *     tags:
 *       - Manage User Data
 *     summary: Filter users by status
 *     description: Retrieves users filtered by status with pagination support.
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
 *         description: Filtered users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       uid:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       status:
 *                         type: string
 *                       user_type_uid:
 *                         type: integer
 *                       group_uid:
 *                         type: array
 *                         items:
 *                           type: integer
 *                       organization_uid:
 *                         type: integer
 *                       tenant_uid:
 *                         type: integer
 *                       branch_uid:
 *                         type: integer
 *                       employeeId:
 *                         type: integer
 *                       is_superadmin:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.get("/filterUsers", verifyToken, filterUsers);

/**
 * @swagger
 * /api/users/exportFilteredUsersCSV:
 *   get:
 *     tags:
 *       - Manage User Data
 *     summary: Export filtered users to CSV
 *     description: Exports users filtered by status as a CSV file.
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
 *         description: CSV file generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredUsersCSV", verifyToken, exportFilteredUsersToCSV);

/**
 * @swagger
 * /api/users/exportFilteredUsersPDF:
 *   get:
 *     tags:
 *       - Manage User Data
 *     summary: Export filtered users to PDF
 *     description: Exports users filtered by status as a PDF file.
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
 *         description: PDF file generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredUsersPDF", verifyToken, exportFilteredUsersToPDF);

module.exports = router;