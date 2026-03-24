const express = require("express");
const {
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  getUserGroupById,
  getAllUserGroups,
  filterUserGroups,
  exportFilteredUserGroupsToCSV,
  exportFilteredUserGroupsToPDF,
} = require("../../controllers/user-security-management/userGroupsController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/user-groups/createUserGroup:
 *   post:
 *     tags:
 *       - Manage User Groups
 *     summary: Create a new user group
 *     description: Creates a new user group record with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_name
 *               - description
 *             properties:
 *               group_name:
 *                 type: string
 *                 maxLength: 255
 *                 description: Unique name of the user group
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: Description of the user group
 *               user_uid:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of user IDs associated with the group
 *               role_uid:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of role IDs associated with the group
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 default: Active
 *                 description: Status of the user group
 *     responses:
 *       201:
 *         description: User group created successfully
 *       400:
 *         description: Invalid input or group_name already exists
 *       500:
 *         description: Server error
 */
router.post("/createUserGroup", verifyToken, createUserGroup);

/**
 * @swagger
 * /api/user-groups/updateUserGroup/{id}:
 *   put:
 *     tags:
 *       - Manage User Groups
 *     summary: Update an existing user group
 *     description: Updates an existing user group record by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user group to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_name:
 *                 type: string
 *                 maxLength: 255
 *                 description: Unique name of the user group
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: Description of the user group
 *               user_uid:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of user IDs associated with the group
 *               role_uid:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of role IDs associated with the group
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *                 description: Status of the user group
 *     responses:
 *       200:
 *         description: User group updated successfully
 *       400:
 *         description: Invalid input or group_name already exists
 *       404:
 *         description: User group not found
 *       500:
 *         description: Server error
 */
router.put("/updateUserGroup/:id", verifyToken, updateUserGroup);

/**
 * @swagger
 * /api/user-groups/deleteUserGroup/{id}:
 *   delete:
 *     tags:
 *       - Manage User Groups
 *     summary: Delete a user group
 *     description: Deletes a user group by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user group to delete
 *     responses:
 *       200:
 *         description: User group deleted successfully
 *       404:
 *         description: User group not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteUserGroup/:id", verifyToken, deleteUserGroup);

/**
 * @swagger
 * /api/user-groups/userGroup/{id}:
 *   get:
 *     tags:
 *       - Manage User Groups
 *     summary: Get a single user group by ID
 *     description: Retrieves a specific user group record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user group to retrieve
 *     responses:
 *       200:
 *         description: User group retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uid:
 *                   type: integer
 *                 group_name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 user_uid:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 role_uid:
 *                   type: array
 *                   items:
 *                     type: integer
 *                 status:
 *                   type: string
 *                   enum: [Active, Inactive]
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: User group not found
 *       500:
 *         description: Server error
 */
router.get("/userGroup/:id", verifyToken, getUserGroupById);

/**
 * @swagger
 * /api/user-groups/userGroups:
 *   get:
 *     tags:
 *       - Manage User Groups
 *     summary: Get all user groups with pagination
 *     description: Retrieves all user groups with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: User groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uid:
 *                     type: integer
 *                   group_name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   user_uid:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   role_uid:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   status:
 *                     type: string
 *                     enum: [Active, Inactive]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get("/userGroups", verifyToken, getAllUserGroups);

/**
 * @swagger
 * /api/user-groups/filterUserGroups:
 *   get:
 *     tags:
 *       - Manage User Groups
 *     summary: Filter user groups based on status
 *     description: Retrieves user groups filtered by status with pagination support.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *           default: All
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Filtered user groups retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   uid:
 *                     type: integer
 *                   group_name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   user_uid:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   role_uid:
 *                     type: array
 *                     items:
 *                       type: integer
 *                   status:
 *                     type: string
 *                     enum: [Active, Inactive]
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error
 */
router.get("/filterUserGroups", verifyToken, filterUserGroups);

/**
 * @swagger
 * /api/user-groups/exportFilteredUserGroupsCSV:
 *   get:
 *     tags:
 *       - Manage User Groups
 *     summary: Export filtered user groups to CSV
 *     description: Exports user groups filtered by status as a CSV file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *           default: All
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
 *         description: No user groups found
 *       500:
 *         description: Server error
 */
router.get(
  "/exportFilteredUserGroupsCSV",
  verifyToken,
  exportFilteredUserGroupsToCSV
);

/**
 * @swagger
 * /api/user-groups/exportFilteredUserGroupsPDF:
 *   get:
 *     tags:
 *       - Manage User Groups
 *     summary: Export filtered user groups to PDF
 *     description: Exports user groups filtered by status as a PDF file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *           default: All
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
 *         description: No user groups found
 *       500:
 *         description: Server error
 */
router.get(
  "/exportFilteredUserGroupsPDF",
  verifyToken,
  exportFilteredUserGroupsToPDF
);

module.exports = router;