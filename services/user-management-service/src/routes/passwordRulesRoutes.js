const express = require("express");
const {
  createPasswordRule,
  updatePasswordRule,
  deletePasswordRule,
  getPasswordRuleById,
  getAllPasswordRules,
} = require("../../controllers/user-security-management/passwordRulesController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/password-rules/createPasswordRule:
 *   post:
 *     tags:
 *       - Manage Password Rules
 *     summary: Create a new password rule
 *     description: This endpoint allows you to create a new password rule record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_type_uid:
 *                 type: integer
 *               min_length:
 *                 type: integer
 *               complexity_requirements:
 *                 type: string
 *               expiration_days:
 *                 type: integer
 *               max_attempt:
 *                 type: string
 *     responses:
 *       201:
 *         description: Password rule created successfully
 *       500:
 *         description: Server error
 */
router.post("/createPasswordRule", verifyToken, createPasswordRule);

/**
 * @swagger
 * /api/password-rules/updatePasswordRule/{id}:
 *   put:
 *     tags:
 *       - Manage Password Rules
 *     summary: Update an existing password rule
 *     description: This endpoint allows you to update an existing password rule record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the password rule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_type_uid:
 *                 type: integer
 *               min_length:
 *                 type: integer
 *               complexity_requirements:
 *                 type: string
 *               expiration_days:
 *                 type: integer
 *               max_attempt:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password rule updated successfully
 *       404:
 *         description: Password rule not found
 *       500:
 *         description: Server error
 */
router.put("/updatePasswordRule/:id", verifyToken, updatePasswordRule);

/**
 * @swagger
 * /api/password-rules/deletePasswordRule/{id}:
 *   delete:
 *     tags:
 *       - Manage Password Rules
 *     summary: Delete a password rule
 *     description: This endpoint allows you to delete a password rule by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the password rule to delete
 *     responses:
 *       200:
 *         description: Password rule deleted successfully
 *       404:
 *         description: Password rule not found
 *       500:
 *         description: Server error
 */
router.delete("/deletePasswordRule/:id", verifyToken, deletePasswordRule);

/**
 * @swagger
 * /api/password-rules/passwordRule/{id}:
 *   get:
 *     tags:
 *       - Manage Password Rules
 *     summary: Get a single password rule by ID
 *     description: This endpoint allows you to retrieve a specific password rule record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the password rule to retrieve
 *     responses:
 *       200:
 *         description: Password rule retrieved successfully
 *       404:
 *         description: Password rule not found
 *       500:
 *         description: Server error
 */
router.get("/passwordRule/:id", verifyToken, getPasswordRuleById);

/**
 * @swagger
 * /api/password-rules/passwordRules:
 *   get:
 *     tags:
 *       - Manage Password Rules
 *     summary: Get all password rules with pagination
 *     description: This endpoint retrieves all password rules with pagination support.
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
 *         description: Password rules retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/passwordRules", verifyToken, getAllPasswordRules);

module.exports = router;