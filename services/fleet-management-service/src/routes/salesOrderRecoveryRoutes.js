const express = require("express");
const {
  createSalesOrderRecovery,
  updateSalesOrderRecovery,
  deleteSalesOrderRecovery,
  getSalesOrderRecoveryById,
  getAllSalesOrderRecoveries,
  filterSalesOrderRecoveries,
  exportFilteredSalesOrderRecoveriesToCSV,
  exportFilteredSalesOrderRecoveriesToPDF,
  createBulkSalesOrderRecoveries,
  getRecoveriesBySalesOrder,
} = require("../controllers//salesOrderRecoveryController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/sales-order-recoveries/createBulkRecoveries:
 *   post:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Create multiple recovery entries at once
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recoveries
 *               - so_id
 *             properties:
 *               so_id:
 *                 type: integer
 *               recoveries:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     recovery_supplier:
 *                       type: string
 *                     recovery_vehicle_type:
 *                       type: string
 *                     no_of_trips:
 *                       type: integer
 *                     estimated_cost:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Recovery entries created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Error creating recoveries
 */
router.post("/createBulkRecoveries", verifyToken, createBulkSalesOrderRecoveries);

/**
 * @swagger
 * /api/sales-order-recoveries/bySalesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Get all recoveries for a specific sales order
 *     parameters:
 *       - in: path
 *         name: so_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recoveries retrieved successfully
 *       500:
 *         description: Error retrieving recoveries
 */
router.get("/bySalesOrder/:so_id", verifyToken, getRecoveriesBySalesOrder);

/**
 * @swagger
 * /api/sales-order-recoveries/createSalesOrderRecovery:
 *   post:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Create a new sales order recovery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recovery_supplier
 *               - recovery_vehicle_type
 *               - no_of_trips
 *               - estimated_cost
 *             properties:
 *               recovery_supplier:
 *                 type: string
 *               recovery_vehicle_type:
 *                 type: string
 *               no_of_trips:
 *                 type: integer
 *               estimated_cost:
 *                 type: integer
 *               so_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Sales order recovery created successfully
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error creating sales order recovery
 */
router.post("/createSalesOrderRecovery", verifyToken, createSalesOrderRecovery);

/**
 * @swagger
 * /api/sales-order-recoveries/updateSalesOrderRecovery/{id}:
 *   put:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Update an existing sales order recovery
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order recovery to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recovery_supplier:
 *                 type: string
 *               recovery_vehicle_type:
 *                 type: string
 *               no_of_trips:
 *                 type: integer
 *               estimated_cost:
 *                 type: integer
 *               so_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sales order recovery updated successfully
 *       404:
 *         description: Sales order recovery or sales order not found
 *       500:
 *         description: Error updating sales order recovery
 */
router.put("/updateSalesOrderRecovery/:id", verifyToken, updateSalesOrderRecovery);

/**
 * @swagger
 * /api/sales-order-recoveries/deleteSalesOrderRecovery/{id}:
 *   delete:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Delete a sales order recovery by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order recovery to delete
 *     responses:
 *       200:
 *         description: Sales order recovery deleted successfully
 *       404:
 *         description: Sales order recovery not found
 *       500:
 *         description: Error deleting sales order recovery
 */
router.delete("/deleteSalesOrderRecovery/:id", verifyToken, deleteSalesOrderRecovery);

/**
 * @swagger
 * /api/sales-order-recoveries/salesOrderRecovery/{id}:
 *   get:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Get a single sales order recovery by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order recovery
 *     responses:
 *       200:
 *         description: Sales order recovery retrieved successfully
 *       404:
 *         description: Sales order recovery not found
 *       500:
 *         description: Error retrieving sales order recovery
 */
router.get("/salesOrderRecovery/:id", verifyToken, getSalesOrderRecoveryById);

/**
 * @swagger
 * /api/sales-order-recoveries/salesOrderRecoveries:
 *   get:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Get all sales order recoveries with pagination
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
 *         description: Sales order recoveries retrieved successfully
 *       500:
 *         description: Error retrieving sales order recoveries
 */
router.get("/salesOrderRecoveries", verifyToken, getAllSalesOrderRecoveries);

/**
 * @swagger
 * /api/sales-order-recoveries/filterSalesOrderRecoveries:
 *   get:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Filter sales order recoveries by various criteria
 *     parameters:
 *       - in: query
 *         name: recovery_supplier
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: recovery_vehicle_type
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: so_id
 *         required: false
 *         schema:
 *           type: integer
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
 *         description: Filtered sales order recoveries retrieved successfully
 *       500:
 *         description: Error filtering sales order recoveries
 */
router.get("/filterSalesOrderRecoveries", verifyToken, filterSalesOrderRecoveries);

/**
 * @swagger
 * /api/sales-order-recoveries/exportFilteredSalesOrderRecoveriesToCSV:
 *   get:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Export filtered sales order recoveries to CSV
 *     parameters:
 *       - in: query
 *         name: recovery_supplier
 *         schema:
 *           type: string
 *       - in: query
 *         name: recovery_vehicle_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: so_id
 *         schema:
 *           type: integer
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
router.get("/exportFilteredSalesOrderRecoveriesToCSV", verifyToken, exportFilteredSalesOrderRecoveriesToCSV);

/**
 * @swagger
 * /api/sales-order-recoveries/exportFilteredSalesOrderRecoveriesToPDF:
 *   get:
 *     tags:
 *       - Sales Order Recoveries
 *     summary: Export filtered sales order recoveries to PDF
 *     parameters:
 *       - in: query
 *         name: recovery_supplier
 *         schema:
 *           type: string
 *       - in: query
 *         name: recovery_vehicle_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: so_id
 *         schema:
 *           type: integer
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
router.get("/exportFilteredSalesOrderRecoveriesToPDF", verifyToken, exportFilteredSalesOrderRecoveriesToPDF);

module.exports = router;