const express = require('express');
const {register, updateUser, deleteUser, getUserById, getAllUsers } = require('../controllers/manageUserController');
const { verifyToken } = require('../../../../api-gateway/src/middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/manageUser/register:
 *   post:
 *     tags:
 *       - Manage User  
 *     summary: Register a new user (admin only)
 *     description: This endpoint allows an admin user to register a new user in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: The role of the user (user/admin).
 *     responses:
 *       201:
 *         description: User registered successfully
 *       403:
 *         description: You must be an admin to register a new user
 */
router.post('/register', verifyToken, register);

/**
 * @swagger
 * /api/manageUser/update/{id}:
 *   put:
 *     tags:
 *       - Manage User
 *     summary: Update an existing user (admin only)
 *     description: This endpoint allows an admin to update an existing user's details, including username, email, role, and password.
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
 *                 example: "john_doe"
 *               email:
 *                 type: string
 *                 example: "john_doe@example.com"
 *               roleId:
 *                 type: integer
 *                 description: The role ID of the user (e.g., 1 for Super Admin, 2 for Admin).
 *                 example: 2
 *               password:
 *                 type: string
 *                 description: The new password for the user.
 *                 example: "new_password123"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       example: "john_doe@example.com"
 *                     roleId:
 *                       type: integer
 *                       example: 2
 *       404:
 *         description: User not found
 *       500:
 *         description: Error updating user
 */
router.put('/update/:id', verifyToken, updateUser);

/**
 * @swagger
 * /api/manageUser/delete/{id}:
 *   delete:
 *     tags:
 *       - Manage User
 *     summary: Delete an existing user (admin only)
 *     description: This endpoint allows an admin to delete a user from the system.
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
 */
router.delete('/delete/:id', verifyToken, deleteUser); 

/**
 * @swagger
 * /api/manageUser/user/{id}:
 *   get:
 *     tags:
 *       - Manage User
 *     summary: Get a single user by ID
 *     description: This endpoint allows an admin to retrieve a specific user by their ID.
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
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 email:
 *                   type: string
 *                   example: "john_doe@example.com"
 *                 role:
 *                   type: string
 *                   example: "user"
 *       404:
 *         description: User not found
 */
router.get('/user/:id', verifyToken, getUserById);

/**
 * @swagger
 * /api/manageUser/users:
 *   get:
 *     tags:
 *       - Manage User
 *     summary: Get all users with pagination
 *     description: This endpoint allows an admin to retrieve all users in the system with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users per page (default is 10)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "john_doe"
 *                   email:
 *                     type: string
 *                     example: "john_doe@example.com"
 *                   role:
 *                     type: string
 *                     example: "user"
 *       500:
 *         description: Error retrieving users
 */
router.get('/users', verifyToken, getAllUsers);

module.exports = router;