const express = require('express');
const router = express.Router();
const salesPipelineController = require('../../controllers/crm/salesPipelineController');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /api/crm/sales-pipelines:
 *   post:
 *     tags:
 *       - Sales Pipelines
 *     summary: Create a new sales pipeline with stages
 *     description: Create a new sales pipeline along with its pipeline stages in the CRM system.
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
 *               description:
 *                 type: string
 *               stages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stage_name:
 *                       type: string
 *                     closure_percentage:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Sales pipeline and stages created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', verifyToken, salesPipelineController.createSalesPipeline);

/**
 * @swagger
 * /api/crm/sales-pipelines:
 *   get:
 *     tags:
 *       - Sales Pipelines
 *     summary: Get all sales pipelines with stages
 *     description: Retrieve a list of all sales pipelines along with their stages.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of sales pipelines with stages
 *       400:
 *         description: Bad request
 */
router.get('/', verifyToken, salesPipelineController.getSalesPipelines);

/**
 * @swagger
 * /api/crm/sales-pipelines/{id}:
 *   get:
 *     tags:
 *       - Sales Pipelines
 *     summary: Get a sales pipeline by ID with stages
 *     description: Retrieve a sales pipeline by its ID along with its stages.
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
 *         description: Sales pipeline with stages retrieved successfully
 *       404:
 *         description: Sales pipeline not found
 */
router.get('/:id', verifyToken, salesPipelineController.getSalesPipelineById);

/**
 * @swagger
 * /api/crm/sales-pipelines/{id}:
 *   put:
 *     tags:
 *       - Sales Pipelines
 *     summary: Update a sales pipeline
 *     description: Update a sales pipeline by its ID.
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
 *               description:
 *                 type: string
 *               stages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stage_name:
 *                       type: string
 *                     closure_percentage:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Sales pipeline updated successfully
 *       404:
 *         description: Sales pipeline not found
 */
router.put('/:id', verifyToken, salesPipelineController.updateSalesPipeline);

/**
 * @swagger
 * /api/crm/sales-pipelines/{id}:
 *   delete:
 *     tags:
 *       - Sales Pipelines
 *     summary: Delete a sales pipeline
 *     description: Delete a sales pipeline by its ID along with its stages.
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
 *         description: Sales pipeline deleted successfully
 *       404:
 *         description: Sales pipeline not found
 */
router.delete('/:id', verifyToken, salesPipelineController.deleteSalesPipeline);

module.exports = router;
