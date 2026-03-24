const express = require('express');
const router = express.Router();
const prospectController = require('../../controllers/crm/prospectController');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /api/crm/prospects:
 *   post:
 *     tags:
 *       - Prospects
 *     summary: Create a new prospect
 *     description: Create a new prospect in the CRM system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: number
 *               email:
 *                 type: string
 *               city:
 *                 type: string
 *               country_id:
 *                 type: integer
 *               industry_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Prospect created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', verifyToken, prospectController.createProspect);

/**
 * @swagger
 * /api/crm/prospects:
 *   get:
 *     tags:
 *       - Prospects
 *     summary: Get all prospects
 *     description: Retrieve a list of all prospects.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of prospects
 *       400:
 *         description: Bad request
 */
router.get('/', verifyToken, prospectController.getProspects);

/**
 * @swagger
 * /api/crm/prospects/{id}:
 *   get:
 *     tags:
 *       - Prospects
 *     summary: Get a prospect by ID
 *     description: Retrieve a prospect by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Prospect retrieved successfully
 *       404:
 *         description: Prospect not found
 */
router.get('/:id', verifyToken, prospectController.getProspectById);

/**
 * @swagger
 * /api/crm/prospects/{id}:
 *   put:
 *     tags:
 *       - Prospects
 *     summary: Update a prospect
 *     description: Update a prospect by its ID.
 *     security:
 *       - bearerAuth: []
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
 *               name:
 *                 type: string
 *               phone:
 *                 type: number
 *               email:
 *                 type: string
 *               city:
 *                 type: string
 *               country_id:
 *                 type: integer
 *               industry_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Prospect updated successfully
 *       404:
 *         description: Prospect not found
 */
router.put('/:id', verifyToken, prospectController.updateProspect);

/**
 * @swagger
 * /api/crm/prospects/{id}:
 *   delete:
 *     tags:
 *       - Prospects
 *     summary: Delete a prospect
 *     description: Delete a prospect by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Prospect deleted successfully
 *       404:
 *         description: Prospect not found
 */
router.delete('/:id', verifyToken, prospectController.deleteProspect);

module.exports = router;