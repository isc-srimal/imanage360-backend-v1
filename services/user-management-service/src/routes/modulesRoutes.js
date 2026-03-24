const express = require("express");
const {
  createModule,
  updateModule,
  deleteModule,
  getModuleById,
  getAllModules,
} = require("../../controllers/subscription/modulesController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/modules/createModule:
 *   post:
 *     tags:
 *       - Manage Modules
 *     summary: Create a new module
 *     description: This endpoint allows you to create a new module record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *               description:
 *                 type: string
 *               permission_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Module created successfully
 *       500:
 *         description: Server error
 */
router.post("/createModule", verifyToken, createModule);

/**
 * @swagger
 * /api/modules/updateModule/{id}:
 *   put:
 *     tags:
 *       - Manage Modules
 *     summary: Update an existing module
 *     description: This endpoint allows you to update an existing module record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the module to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *               description:
 *                 type: string
 *               permission_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Module updated successfully
 *       404:
 *         description: Module not found
 *       500:
 *         description: Server error
 */
router.put("/updateModule/:id", verifyToken, updateModule);

/**
 * @swagger
 * /api/modules/deleteModule/{id}:
 *   delete:
 *     tags:
 *       - Manage Modules
 *     summary: Delete a module
 *     description: This endpoint allows you to delete a module by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the module to delete
 *     responses:
 *       200:
 *         description: Module deleted successfully
 *       404:
 *         description: Module not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteModule/:id", verifyToken, deleteModule);

/**
 * @swagger
 * /api/modules/module/{id}:
 *   get:
 *     tags:
 *       - Manage Modules
 *     summary: Get a single module by ID
 *     description: This endpoint allows you to retrieve a specific module record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the module to retrieve
 *     responses:
 *       200:
 *         description: Module retrieved successfully
 *       404:
 *         description: Module not found
 *       500:
 *         description: Server error
 */
router.get("/module/:id", verifyToken, getModuleById);

/**
 * @swagger
 * /api/modules/modules:
 *   get:
 *     tags:
 *       - Manage Modules
 *     summary: Get all modules with pagination
 *     description: This endpoint retrieves all modules with pagination support.
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
 *         description: Modules retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/modules", verifyToken, getAllModules);

module.exports = router;