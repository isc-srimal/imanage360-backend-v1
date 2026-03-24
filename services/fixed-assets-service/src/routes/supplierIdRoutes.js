const express = require("express");
const {
  createSupplierId,
  updateSupplierId,
  deleteSupplierId,
  getSupplierIdById,
  getAllSupplierIds,
  filterSupplierIds,
  exportFilteredSupplierIdsToCSV,
  exportFilteredSupplierIdsToPDF,
} = require("../controllers/supplierIdController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/suppliers/createSupplierId:
 *   post:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Create a new supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Supplier ID created successfully
 *       500:
 *         description: Error creating supplier ID
 */
router.post("/createSupplierId", verifyToken, createSupplierId);

/**
 * @swagger
 * /api/suppliers/updateSupplierId/{id}:
 *   put:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Update an existing supplier ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the supplier ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplier_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Supplier ID updated successfully
 *       404:
 *         description: Supplier ID not found
 *       500:
 *         description: Error updating supplier ID
 */
router.put("/updateSupplierId/:id", verifyToken, updateSupplierId);

/**
 * @swagger
 * /api/suppliers/deleteSupplierId/{id}:
 *   delete:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Delete a supplier ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the supplier ID to delete
 *     responses:
 *       200:
 *         description: Supplier ID deleted successfully
 *       404:
 *         description: Supplier ID not found
 *       500:
 *         description: Error deleting supplier ID
 */
router.delete("/deleteSupplierId/:id", verifyToken, deleteSupplierId);

/**
 * @swagger
 * /api/suppliers/supplierId/{id}:
 *   get:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Get a single supplier ID by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the supplier ID
 *     responses:
 *       200:
 *         description: Supplier ID retrieved successfully
 *       404:
 *         description: Supplier ID not found
 */
router.get("/supplierId/:id", verifyToken, getSupplierIdById);

/**
 * @swagger
 * /api/suppliers/supplierIds:
 *   get:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Get all supplier IDs with pagination
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
 *         description: Supplier IDs retrieved successfully
 *       500:
 *         description: Error retrieving supplier IDs
 */
router.get("/supplierIds", verifyToken, getAllSupplierIds);

/**
 * @swagger
 * /api/suppliers/filterSupplierIds:
 *   get:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Filter supplier IDs by status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
 *         description: Filtered supplier IDs retrieved successfully
 *       500:
 *         description: Error filtering supplier IDs
 */
router.get("/filterSupplierIds", verifyToken, filterSupplierIds);

/**
 * @swagger
 * /api/suppliers/exportFilteredSupplierIdsToCSV:
 *   get:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Export filtered supplier IDs to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredSupplierIdsToCSV", verifyToken, exportFilteredSupplierIdsToCSV);

/**
 * @swagger
 * /api/suppliers/exportFilteredSupplierIdsToPDF:
 *   get:
 *     tags:
 *       - Manage Supplier IDs
 *     summary: Export filtered supplier IDs to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredSupplierIdsToPDF", verifyToken, exportFilteredSupplierIdsToPDF);

module.exports = router;