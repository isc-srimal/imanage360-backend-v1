// routes/fleet-management/sub-product-attachment-assignment-routes.js
const express = require("express");
const {
  saveAssignments,
  getAssignmentsBySalesOrder,
  deleteAssignment,
} = require("../../controllers/fleet-management/subProductAttachmentAssignmentController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * POST /api/sub-product-attachment-assignments/save
 * Save (upsert) sub product attachment assignments for a sales order.
 *
 * Body:
 * {
 *   "sales_order_id": 1,
 *   "assignments": [
 *     { "product_id": 10, "attachment_number": "AT143545" },
 *     { "product_id": 11, "attachment_number": "AT577575" }
 *   ]
 * }
 */
router.post("/save", verifyToken, saveAssignments);

/**
 * GET /api/sub-product-attachment-assignments/sales-order/:sales_order_id
 * Retrieve all saved assignments for a sales order.
 * Used by the frontend to restore dropdown selections.
 */
router.get("/sales-order/:sales_order_id", verifyToken, getAssignmentsBySalesOrder);

/**
 * DELETE /api/sub-product-attachment-assignments/:assignment_id
 * Delete a single assignment record.
 */
router.delete("/:assignment_id", verifyToken, deleteAssignment);

module.exports = router;