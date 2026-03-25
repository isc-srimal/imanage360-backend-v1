const express = require("express");
const {
  createUserType,
  updateUserType,
  deleteUserType,
  getUserTypeById,
  getAllUserTypes,
  exportUserTypesToCSV,
  exportUserTypesToPDF,
} = require("../controllers/userTypesController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/user-types/createUserType:
 *   post:
 *     tags:
 *       - Manage User Types
 *     summary: Create a new user type
 *     description: This endpoint allows you to create a new user type record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: User type created successfully
 *       500:
 *         description: Server error
 */
router.post("/createUserType", verifyToken, createUserType);

/**
 * @swagger
 * /api/user-types/updateUserType/{id}:
 *   put:
 *     tags:
 *       - Manage User Types
 *     summary: Update an existing user type
 *     description: This endpoint allows you to update an existing user type record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_type:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: User type updated successfully
 *       404:
 *         description: User type not found
 *       500:
 *         description: Server error
 */
router.put("/updateUserType/:id", verifyToken, updateUserType);

/**
 * @swagger
 * /api/user-types/deleteUserType/{id}:
 *   delete:
 *     tags:
 *       - Manage User Types
 *     summary: Delete a user type
 *     description: This endpoint allows you to delete a user type by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user type to delete
 *     responses:
 *       200:
 *         description: User type deleted successfully
 *       404:
 *         description: User type not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteUserType/:id", verifyToken, deleteUserType);

/**
 * @swagger
 * /api/user-types/userType/{id}:
 *   get:
 *     tags:
 *       - Manage User Types
 *     summary: Get a single user type by ID
 *     description: This endpoint allows you to retrieve a specific user type record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user type to retrieve
 *     responses:
 *       200:
 *         description: User type retrieved successfully
 *       404:
 *         description: User type not found
 *       500:
 *         description: Server error
 */
router.get("/userType/:id", verifyToken, getUserTypeById);

/**
 * @swagger
 * /api/user-types/userTypes:
 *   get:
 *     tags:
 *       - Manage User Types
 *     summary: Get all user types with pagination
 *     description: This endpoint retrieves all user types with pagination support.
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
 *         description: User types retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/userTypes", verifyToken, getAllUserTypes);

/**
 * @swagger
 * /api/user-types/exportUserTypesCSV:
 *   get:
 *     tags:
 *       - Manage User Types
 *     summary: Export user types to CSV
 *     description: Exports user types as a CSV file.
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
 *         description: No user types found
 *       500:
 *         description: Server error
 */
router.get("/exportUserTypesCSV", verifyToken, exportUserTypesToCSV);

/**
 * @swagger
 * /api/user-types/exportUserTypesPDF:
 *   get:
 *     tags:
 *       - Manage User Types
 *     summary: Export user types to PDF
 *     description: Exports user types as a PDF file.
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
 *         description: No user types found
 *       500:
 *         description: Server error
 */
router.get("/exportUserTypesPDF", verifyToken, exportUserTypesToPDF);

module.exports = router;