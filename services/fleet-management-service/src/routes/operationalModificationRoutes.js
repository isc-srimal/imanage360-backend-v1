const express = require("express");
const {
  createShiftChange,
  getModificationsBySalesOrder,
  getShiftChangesBySalesOrder,
  deleteModification,
} = require("../../controllers/fleet-management/operationalModificationController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/operational-modifications/shift-change:
 *   post:
 *     tags:
 *       - Operational Modifications
 *     summary: Create a shift change record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - new_shift
 *               - shift_change_date
 *               - shift_change_reason
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *               allocation_id:
 *                 type: integer
 *               new_shift:
 *                 type: string
 *                 enum: [Day, Night]
 *               shift_change_date:
 *                 type: string
 *                 format: date
 *               shift_change_reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shift change recorded successfully
 *       400:
 *         description: Invalid request
 */
router.post("/shift-change", verifyToken, createShiftChange);

/**
 * @swagger
 * /api/operational-modifications/sales-order/{sales_order_id}:
 *   get:
 *     tags:
 *       - Operational Modifications
 *     summary: Get all modifications for a sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Modifications retrieved successfully
 */
router.get("/sales-order/:sales_order_id", verifyToken, getModificationsBySalesOrder);

/**
 * @swagger
 * /api/operational-modifications/shift-changes/{sales_order_id}:
 *   get:
 *     tags:
 *       - Operational Modifications
 *     summary: Get shift changes for a sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shift changes retrieved successfully
 */
router.get("/shift-changes/:sales_order_id", verifyToken, getShiftChangesBySalesOrder);

/**
 * @swagger
 * /api/operational-modifications/{id}:
 *   delete:
 *     tags:
 *       - Operational Modifications
 *     summary: Delete a modification
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Modification deleted successfully
 */
router.delete("/:id", verifyToken, deleteModification);

module.exports = router;