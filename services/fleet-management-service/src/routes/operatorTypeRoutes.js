const express = require("express");
const {
  createOperatorType,
  updateOperatorType,
  deleteOperatorType,
  getOperatorTypeById,
  getAllOperatorTypes,
  filterOperatorTypes,
  exportFilteredOperatorTypesToCSV,
  exportFilteredOperatorTypesToPDF,
} = require("../../controllers/fleet-management/operatorTypeController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/operatortypes/createOperatorType:
 *   post:
 *     tags:
 *       - Manage Operator Types
 *     summary: Create a new operator type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operator_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Operator type created successfully
 *       500:
 *         description: Error creating operator type
 */
router.post("/createOperatorType", verifyToken, createOperatorType);

/**
 * @swagger
 * /api/operatortypes/updateOperatorType/{operator_type_id}:
 *   put:
 *     tags:
 *       - Manage Operator Types
 *     summary: Update an existing operator type
 *     parameters:
 *       - in: path
 *         name: operator_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the operator type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               operator_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Operator type updated successfully
 *       404:
 *         description: Operator type not found
 *       500:
 *         description: Error updating operator type
 */
router.put("/updateOperatorType/:operator_type_id", verifyToken, updateOperatorType);

/**
 * @swagger
 * /api/operatortypes/deleteOperatorType/{operator_type_id}:
 *   delete:
 *     tags:
 *       - Manage Operator Types
 *     summary: Delete an operator type by ID
 *     parameters:
 *       - in: path
 *         name: operator_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the operator type to delete
 *     responses:
 *       200:
 *         description: Operator type deleted successfully
 *       404:
 *         description: Operator type not found
 *       500:
 *         description: Error deleting operator type
 */
router.delete("/deleteOperatorType/:operator_type_id", verifyToken, deleteOperatorType);

/**
 * @swagger
 * /api/operatortypes/operatorType/{operator_type_id}:
 *   get:
 *     tags:
 *       - Manage Operator Types
 *     summary: Get a single operator type by ID
 *     parameters:
 *       - in: path
 *         name: operator_type_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the operator type
 *     responses:
 *       200:
 *         description: Operator type retrieved successfully
 *       404:
 *         description: Operator type not found
 */
router.get("/operatorType/:operator_type_id", verifyToken, getOperatorTypeById);

/**
 * @swagger
 * /api/operatortypes/operatorTypes:
 *   get:
 *     tags:
 *       - Manage Operator Types
 *     summary: Get all operator types with pagination
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
 *         description: Operator types retrieved successfully
 *       500:
 *         description: Error retrieving operator types
 */
router.get("/operatorTypes", verifyToken, getAllOperatorTypes);

/**
 * @swagger
 * /api/operatortypes/filterOperatorTypes:
 *   get:
 *     tags:
 *       - Manage Operator Types
 *     summary: Filter operator types by status
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
 *         description: Filtered operator types retrieved successfully
 *       500:
 *         description: Error filtering operator types
 */
router.get("/filterOperatorTypes", verifyToken, filterOperatorTypes);

/**
 * @swagger
 * /api/operatortypes/exportFilteredOperatorTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Operator Types
 *     summary: Export filtered operator types to CSV
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
router.get("/exportFilteredOperatorTypesToCSV", verifyToken, exportFilteredOperatorTypesToCSV);

/**
 * @swagger
 * /api/operatortypes/exportFilteredOperatorTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Operator Types
 *     summary: Export filtered operator types to PDF
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
router.get("/exportFilteredOperatorTypesToPDF", verifyToken, exportFilteredOperatorTypesToPDF);

module.exports = router;