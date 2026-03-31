const express = require('express');
const {
  calculateGratuityProvisionForAllEmployeesHandler,
  getAllGratuities,
  getGratuityById,
  updateGratuity,
  deleteGratuity,
} = require('../controllers/gratuityController');

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Gratuity
 *   description: Endpoints for managing gratuity records
 */

/**
 * @swagger
 * /api/gratuity/calculateGratuityProvisionForAllEmployees:
 *   post:
 *     summary: Calculate gratuity provisions for all employees
 *     tags: [Gratuity]
 *     description: Calculates gratuity provisions for all active employees, including accumulated and monthly provisions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 5
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Gratuity provisions calculated successfully.
 *       400:
 *         description: Missing required input data.
 *       500:
 *         description: Internal server error.
 */
router.post("/calculateGratuityProvisionForAllEmployees", verifyToken, calculateGratuityProvisionForAllEmployeesHandler);

/**
 * @swagger
 * /api/gratuity/gratuities:
 *   get:
 *     summary: Get all gratuity records
 *     tags: [Gratuity]
 *     responses:
 *       200:
 *         description: List of gratuity records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   employeeId:
 *                     type: integer
 *                   employeeName:
 *                     type: string
 *                   basicSalary:
 *                     type: number
 *                   yearsOfService:
 *                     type: number
 *                   calculatedGratuity:
 *                     type: number
 *                   status:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 */
router.get('/gratuities', verifyToken, getAllGratuities);

/**
 * @swagger
 * /api/gratuity/gratuity/{id}:
 *   get:
 *     summary: Get a gratuity record by ID
 *     tags: [Gratuity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gratuity record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 employeeId:
 *                   type: integer
 *                 employeeName:
 *                   type: string
 *                 basicSalary:
 *                   type: number
 *                 yearsOfService:
 *                   type: number
 *                 calculatedGratuity:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                 updatedAt:
 *                   type: string
 *       404:
 *         description: Gratuity not found
 */
router.get('/gratuity/:id', verifyToken, getGratuityById);

/**
 * @swagger
 * /api/gratuity/updateGratuity/{id}:
 *   put:
 *     summary: Update a gratuity record
 *     tags: [Gratuity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               employeeName:
 *                 type: string
 *               basicSalary:
 *                 type: number
 *               yearsOfService:
 *                 type: number
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gratuity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 gratuity:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     employeeId:
 *                       type: integer
 *                     employeeName:
 *                       type: string
 *                     basicSalary:
 *                       type: number
 *                     yearsOfService:
 *                       type: number
 *                     calculatedGratuity:
 *                       type: number
 *                     status:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       404:
 *         description: Gratuity not found
 */
router.put('/updateGratuity/:id', verifyToken, updateGratuity);

/**
 * @swagger
 * /api/gratuity/deleteGratuity/{id}:
 *   delete:
 *     summary: Delete a gratuity record
 *     tags: [Gratuity]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gratuity deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Gratuity not found
 */
router.delete('/deleteGratuity/:id', verifyToken, deleteGratuity);

module.exports = router;
