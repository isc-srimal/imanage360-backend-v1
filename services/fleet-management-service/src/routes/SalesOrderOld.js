const express = require('express');
const {
    createSalesOrder,
    updateSalesOrder,
    deleteSalesOrder,
    getSalesOrderById,
    getAllSalesOrders,
    filterSalesOrders,
    exportFilteredSalesOrdersToCSV,
    exportFilteredSalesOrdersToPDF,
} = require('../../controllers/fleet-management/salesOrderOldController');
const { verifyToken } = require('../../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/sales-order-old/createSalesOrder:
 *   post:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Create a new sales order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client:
 *                 type: string
 *               projectSite:
 *                 type: string
 *               factors:
 *                 type: string
 *               mobilizationDate:
 *                 type: string
 *                 format: date
 *               workStartDate:
 *                 type: string
 *                 format: date
 *               workEndDate:
 *                 type: string
 *                 format: date
 *               billingModel:
 *                 type: string
 *               serviceOptions:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialInstructions:
 *                 type: string
 *               estimatedValue:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Active, Inactive]
 *     responses:
 *       201:
 *         description: Sales order created successfully
 *       500:
 *         description: Error creating sales order
 */
router.post('/createSalesOrder', verifyToken, createSalesOrder);

/**
 * @swagger
 * /api/sales-order-old/updateSalesOrder/{id}:
 *   put:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Update an existing sales order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               client:
 *                 type: string
 *               projectSite:
 *                 type: string
 *               factors:
 *                 type: string
 *               mobilizationDate:
 *                 type: string
 *                 format: date
 *               workStartDate:
 *                 type: string
 *                 format: date
 *               workEndDate:
 *                 type: string
 *                 format: date
 *               billingModel:
 *                 type: string
 *               serviceOptions:
 *                 type: array
 *                 items:
 *                   type: string
 *               specialInstructions:
 *                 type: string
 *               estimatedValue:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Pending, Confirmed, Active, Inactive]
 *     responses:
 *       200:
 *         description: Sales order updated successfully
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error updating sales order
 */
router.put('/updateSalesOrder/:id', verifyToken, updateSalesOrder);

/**
 * @swagger
 * /api/sales-order-old/deleteSalesOrder/{id}:
 *   delete:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Delete a sales order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order to delete
 *     responses:
 *       200:
 *         description: Sales order deleted successfully
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error deleting sales order
 */
router.delete('/deleteSalesOrder/:id', verifyToken, deleteSalesOrder);

/**
 * @swagger
 * /api/sales-order-old/salesOrder/{id}:
 *   get:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Get a single sales order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *     responses:
 *       200:
 *         description: Sales order retrieved successfully
 *       404:
 *         description: Sales order not found
 */
router.get('/salesOrder/:id', verifyToken, getSalesOrderById);

/**
 * @swagger
 * /api/sales-order-old/salesOrders:
 *   get:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Get all sales orders with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Sales orders retrieved successfully
 *       500:
 *         description: Error retrieving sales orders
 */
router.get('/salesOrders', verifyToken, getAllSalesOrders);

/**
 * @swagger
 * /api/sales-order-old/filterSalesOrders:
 *   get:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Filter sales orders by status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Pending, Confirmed, Active, Inactive]
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Filtered sales orders retrieved successfully
 *       500:
 *         description: Error filtering sales orders
 */
router.get('/filterSalesOrders', verifyToken, filterSalesOrders);

/**
 * @swagger
 * /api/sales-order-old/exportFilteredSalesOrdersToCSV:
 *   get:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Export filtered sales orders to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Pending, Confirmed, Active, Inactive]
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
 *         description: CSV file download
 *       500:
 *         description: Error exporting CSV
 */
router.get('/exportFilteredSalesOrdersToCSV', verifyToken, exportFilteredSalesOrdersToCSV);

/**
 * @swagger
 * /api/sales-order-old/exportFilteredSalesOrdersToPDF:
 *   get:
 *     tags:
 *       - Manage Sales Orders Old
 *     summary: Export filtered sales orders to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Pending, Confirmed, Active, Inactive]
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
 *         description: PDF file download
 *       500:
 *         description: Error exporting PDF
 */
router.get('/exportFilteredSalesOrdersToPDF', verifyToken, exportFilteredSalesOrdersToPDF);

module.exports = router;