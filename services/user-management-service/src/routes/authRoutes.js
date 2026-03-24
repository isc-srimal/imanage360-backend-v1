const express = require('express');
const { login, logout } = require('../../controllers/user/authController');
const { verifyToken } = require('../../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth 
 *     summary: Login a user and get a JWT token
 *     description: This endpoint allows users to log in and receive a JWT token for accessing protected routes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: super-admin@iteqsolution.com
 *               password:
 *                 type: string
 *                 example: Pa$$word123
 *     responses:
 *       200:
 *         description: Login successful, JWT token returned
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout a user
 *     description: This endpoint allows users to log out by invalidating their session token.
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', verifyToken, logout);



// verifying token and redirecting to login page
router.post('/verify-token', verifyToken, (req, res) => {
    return res.status(200).send('Token is valid');
  });



module.exports = router;
