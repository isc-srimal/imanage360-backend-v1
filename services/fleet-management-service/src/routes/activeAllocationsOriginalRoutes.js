const express = require("express");
const {
  createActiveAllocation,
  getAllActiveAllocations,
  getActiveAllocationById,
  getTodayActiveAllocations,
  checkResourceAvailability,
  getSalesOrdersForAllocation,
  getSalesOrderForAllocation,
  updateSalesOrderStatus,
  getRemarksHistory,
  saveScheduledDates,
  getScheduledDates,
  saveAllocationRemarks,
  saveConfirmedSelections,
  getAllocationBySalesOrder,
  getAssignedOperators,
  getAllocatedEquipmentBySalesOrder,
  getAllocatedManpowerBySalesOrder,
  getAllocatedAttachmentsBySalesOrder,
  updateOpsStatus,
} = require("../../controllers/fleet-management/activeAllocationsOriginalController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/active-allocations/assigned-operators/{allocation_id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get assigned operators for an allocation
 *     parameters:
 *       - in: path
 *         name: allocation_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Allocation ID to fetch assigned operators for
 *     responses:
 *       200:
 *         description: Assigned operators retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignedOperators:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       allocation_id:
 *                         type: integer
 *                       equipment_serial_number:
 *                         type: integer
 *                       full_shift_operator:
 *                         type: string
 *                       day_shift_operator:
 *                         type: string
 *                       night_shift_operator:
 *                         type: string
 *                       reliever_operator:
 *                         type: string
 *                       equipment:
 *                         type: object
 *                         properties:
 *                           serial_number:
 *                             type: integer
 *                           reg_number:
 *                             type: string
 *                           vehicle_type:
 *                             type: string
 *       500:
 *         description: Error fetching assigned operators
 */
router.get(
  "/assigned-operators/:allocation_id",
  verifyToken,
  getAssignedOperators
);

/**
 * @swagger
 * /api/active-allocations/save-confirmed-selections:
 *   post:
 *     tags:
 *       - Active Allocations
 *     summary: Save confirmed resource selections to allocation tables
 *     description: Creates allocation records for equipment, manpower, and attachments with "allocated" status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - service_option
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 description: ID of the sales order
 *                 example: 123
 *               service_option:
 *                 type: string
 *                 description: Service option selected
 *                 example: "Equipment with Operator"
 *               allocation_date:
 *                 type: string
 *                 format: date
 *                 description: Date of allocation (defaults to current date if not provided)
 *                 example: "2025-11-21"
 *               equipment:
 *                 type: array
 *                 description: Array of equipment to allocate
 *                 items:
 *                   type: object
 *                   properties:
 *                     serial_number:
 *                       type: integer
 *                       example: 1001
 *                     note:
 *                       type: string
 *                       example: "Equipment ready for deployment"
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *               manpower:
 *                 type: array
 *                 description: Array of manpower to allocate
 *                 items:
 *                   type: object
 *                   properties:
 *                     employee_id:
 *                       type: integer
 *                       example: 501
 *                     note:
 *                       type: string
 *                       example: "Operator assigned"
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *               attachments:
 *                 type: array
 *                 description: Array of attachments to allocate
 *                 items:
 *                   type: object
 *                   properties:
 *                     attachment_id:
 *                       type: integer
 *                       example: 301
 *                     note:
 *                       type: string
 *                       example: "Attachment ready"
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       201:
 *         description: Resources confirmed and allocated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Resources confirmed and allocated successfully"
 *                 allocation_id:
 *                   type: integer
 *                   example: 456
 *       404:
 *         description: Sales order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sales order not found"
 *       500:
 *         description: Error saving confirmed selections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred"
 */
router.post("/save-confirmed-selections", verifyToken, saveConfirmedSelections);

/**
 * @swagger
 * /api/active-allocations/by-sales-order/{sales_order_id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get active allocation by sales order ID
 *     description: Retrieves the most recent active allocation for a specific sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order ID to fetch allocation for
 *         example: 123
 *     responses:
 *       200:
 *         description: Active allocation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 allocation_id:
 *                   type: integer
 *                   example: 456
 *                 sales_order_id:
 *                   type: integer
 *                   example: 123
 *                 service_option:
 *                   type: string
 *                   example: "Equipment with Operator"
 *                 allocation_date:
 *                   type: string
 *                   format: date
 *                   example: "2025-11-21"
 *                 status:
 *                   type: string
 *                   example: "Active"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:30:00.000Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-21T10:30:00.000Z"
 *       404:
 *         description: No active allocation found for this sales order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No active allocation found for this sales order"
 *       500:
 *         description: Error retrieving allocation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving allocation"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get(
  "/by-sales-order/:sales_order_id",
  verifyToken,
  getAllocationBySalesOrder
);

/**
 * @swagger
 * /api/active-allocations/save-scheduled-dates:
 *   post:
 *     tags:
 *       - Active Allocations
 *     summary: Save scheduled dates with conflict detection and remarks
 *     description: Saves scheduled dates for equipment, manpower, attachments, sub products, and backup resources. Detects conflicts when same resource is scheduled on same date for different SOs and requires remarks.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 example: 123
 *               equipment_schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     equipment_id:
 *                       type: integer
 *                       example: 1001
 *                     scheduled_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-28"
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *                     remark:
 *                       type: string
 *                       example: "Approved by manager for dual assignment"
 *               manpower_schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     manpower_id:
 *                       type: integer
 *                       example: 501
 *                     scheduled_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-28"
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *                     remark:
 *                       type: string
 *                       example: "Working split shift between two projects"
 *               attachment_schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attachment_id:
 *                       type: integer
 *                       example: 301
 *                     scheduled_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-28"
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *                     remark:
 *                       type: string
 *                       example: "Shared between morning and afternoon shifts"
 *               sub_product_schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: integer
 *                       example: 201
 *                     scheduled_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-28"
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *                     remark:
 *                       type: string
 *                       example: "Emergency requirement approved"
 *               backup_equipment_schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     equipment_id:
 *                       type: integer
 *                       example: 1002
 *                     allocation_id:
 *                       type: integer
 *                       example: 456
 *                     scheduled_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-28"
 *                     remark:
 *                       type: string
 *                       example: "Standby equipment for critical project"
 *               backup_manpower_schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     manpower_id:
 *                       type: integer
 *                       example: 502
 *                     allocation_id:
 *                       type: integer
 *                       example: 456
 *                     scheduled_date:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-28"
 *                     remark:
 *                       type: string
 *                       example: "Backup operator on standby"
 *               recovery_schedules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     recovery_id:
 *                       type: integer
 *                       example: 101
 *                     is_selected:
 *                       type: boolean
 *                       example: true
 *               bypass_conflict_check:
 *                 type: boolean
 *                 default: false
 *                 description: Set to true to bypass conflict detection (used after user confirms with remarks)
 *     responses:
 *       200:
 *         description: Scheduled dates saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Scheduled dates saved successfully"
 *       409:
 *         description: Conflicts detected - requires remarks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 warning:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Same date already assigned to another client. Please provide remarks to proceed."
 *                 conflicts:
 *                   type: object
 *                   properties:
 *                     equipment:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           equipment_id:
 *                             type: integer
 *                           scheduled_date:
 *                             type: string
 *                           existing_so:
 *                             type: string
 *                           existing_client:
 *                             type: string
 *                     manpower:
 *                       type: array
 *                       items:
 *                         type: object
 *                     attachment:
 *                       type: array
 *                       items:
 *                         type: object
 *                     subProduct:
 *                       type: array
 *                       items:
 *                         type: object
 *                     backupEquipment:
 *                       type: array
 *                       items:
 *                         type: object
 *                     backupManpower:
 *                       type: array
 *                       items:
 *                         type: object
 *       500:
 *         description: Error saving scheduled dates
 */
router.post("/save-scheduled-dates", verifyToken, saveScheduledDates);

// /**
//  * @swagger
//  * /api/active-allocations/save-scheduled-dates:
//  *   post:
//  *     tags:
//  *       - Active Allocations
//  *     summary: Save scheduled dates for equipment, manpower, and attachments
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               sales_order_id:
//  *                 type: integer
//  *               equipment_schedules:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     equipment_id:
//  *                       type: integer
//  *                     scheduled_date:
//  *                       type: string
//  *               manpower_schedules:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     manpower_id:
//  *                       type: integer
//  *                     scheduled_date:
//  *                       type: string
//  *               attachment_schedules:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     attachment_id:
//  *                       type: integer
//  *                     scheduled_date:
//  *                       type: string
//  */
// router.post("/save-scheduled-dates", verifyToken, saveScheduledDates);

/**
 * @swagger
 * /api/active-allocations/scheduled-dates/{sales_order_id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get scheduled dates for a sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/scheduled-dates/:sales_order_id", verifyToken, getScheduledDates);

/**
 * @swagger
 * /api/active-allocations/update-order-status:
 *   post:
 *     tags:
 *       - Active Allocations
 *     summary: Update sales order status when confirming resource selection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - new_status
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 description: ID of the sales order to update
 *                 example: 123
 *               new_status:
 *                 type: string
 *                 enum: [Rejected, Closed, Revision Rejected, Approved]
 *                 description: New status for the sales order
 *                 example: "Approved"
 * 
 *     responses:
 *       200:
 *         description: Sales order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Sales order status updated to In Progress successfully"
 *                 soStatus:
 *                   type: string
 *                   example: "Approved"
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error updating sales order status
 */
router.post("/update-order-status", verifyToken, updateSalesOrderStatus);

/**
 * @swagger
 * /api/active-allocations/sales-orders:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get sales orders for allocation (without rate and file fields)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Sales orders retrieved successfully
 *       500:
 *         description: Error retrieving sales orders
 */
router.get("/sales-orders", verifyToken, getSalesOrdersForAllocation);

/**
 * @swagger
 * /api/active-allocations/sales-orders/{id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get single sales order for allocation view
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales order retrieved successfully
 *       404:
 *         description: Sales order not found
 */
router.get("/sales-orders/:id", verifyToken, getSalesOrderForAllocation);

/**
 * @swagger
 * /api/active-allocations/check-availability:
 *   post:
 *     tags:
 *       - Active Allocations
 *     summary: Check resource availability for a specific date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date to check availability (YYYY-MM-DD)
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of equipment serial numbers
 *               manpower:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array of employee IDs
 *     responses:
 *       200:
 *         description: Resource availability checked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 conflicts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                       identifier:
 *                         type: string
 *                       salesOrderNumber:
 *                         type: string
 *                       client:
 *                         type: string
 *       500:
 *         description: Error checking resource availability
 */
router.post("/check-availability", verifyToken, checkResourceAvailability);

/**
 * @swagger
 * /api/active-allocations/save-remarks:
 *   post:
 *     tags:
 *       - Active Allocations
 *     summary: Save allocation remarks to history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - remark_text
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 description: ID of the sales order
 *                 example: 123
 *               remark_text:
 *                 type: string
 *                 description: Remark text to save
 *                 example: "Equipment needs special handling"
 *     responses:
 *       201:
 *         description: Remark saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Remark saved successfully"
 *                 remark:
 *                   type: object
 *                   properties:
 *                     remark_id:
 *                       type: integer
 *                     sales_order_id:
 *                       type: integer
 *                     remark_text:
 *                       type: string
 *                     created_by:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *       400:
 *         description: Remark text is required
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error saving remark
 */
router.post("/save-remarks", verifyToken, saveAllocationRemarks);

/**
 * @swagger
 * /api/active-allocations/remarks-history/{sales_order_id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get remarks history for a sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order ID to fetch remarks history for
 *     responses:
 *       200:
 *         description: Remarks history retrieved successfully
 *       500:
 *         description: Error retrieving remarks history
 */
router.get("/remarks-history/:sales_order_id", verifyToken, getRemarksHistory);

// /**
//  * @swagger
//  * /api/active-allocations/remarks-history/{sales_order_id}:
//  *   get:
//  *     tags:
//  *       - Active Allocations
//  *     summary: Get remarks history for a sales order
//  *     parameters:
//  *       - in: path
//  *         name: sales_order_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Sales Order ID to fetch remarks history for
//  *     responses:
//  *       200:
//  *         description: Remarks history retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 totalRemarks:
//  *                   type: integer
//  *                   description: Total number of remarks
//  *                   example: 5
//  *                 remarks:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       remark_id:
//  *                         type: integer
//  *                         example: 1
//  *                       remark_text:
//  *                         type: string
//  *                         example: "Equipment needs inspection before deployment"
//  *                       created_by:
//  *                         type: string
//  *                         example: "John Doe"
//  *                       createdAt:
//  *                         type: string
//  *                         format: date-time
//  *                         example: "2024-01-15T10:30:00.000Z"
//  *       500:
//  *         description: Error retrieving remarks history
//  */
// router.get("/remarks-history/:sales_order_id", verifyToken, getRemarksHistory);

/**
 * @swagger
 * /api/active-allocations/today:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get today's active allocations
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Today's active allocations retrieved successfully
 *       500:
 *         description: Error retrieving today's active allocations
 */
router.get("/today", verifyToken, getTodayActiveAllocations);

/**
 * @swagger
 * /api/active-allocations/create:
 *   post:
 *     tags:
 *       - Active Allocations
 *     summary: Create a new active allocation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *               service_option:
 *                 type: string
 *               allocation_date:
 *                 type: string
 *                 format: date
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     serial_number:
 *                       type: integer
 *                     status:
 *                       type: array
 *                       items:
 *                         type: string
 *                     note:
 *                       type: string
 *               manpower:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     employee_id:
 *                       type: integer
 *                     status:
 *                       type: array
 *                       items:
 *                         type: string
 *                     note:
 *                       type: string
 *               user_remarks:
 *                 type: string
 *                 description: Optional user remarks for the allocation
 *     responses:
 *       201:
 *         description: Active allocation created successfully
 *       500:
 *         description: Error creating active allocation
 */
router.post("/create", verifyToken, createActiveAllocation);

/**
 * @swagger
 * /api/active-allocations/all:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get all active allocations with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Active allocations retrieved successfully
 *       500:
 *         description: Error retrieving active allocations
 */
router.get("/all", verifyToken, getAllActiveAllocations);

/**
 * @swagger
 * /api/active-allocations/{id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get active allocation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Active allocation retrieved successfully
 *       404:
 *         description: Active allocation not found
 */
router.get("/:id", verifyToken, getActiveAllocationById);

/**
 * @swagger
 * /api/active-allocations/allocated-equipment/{sales_order_id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get allocated equipment for a sales order
 *     description: Retrieves all equipment allocated to a specific sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order ID to fetch allocated equipment for
 *     responses:
 *       200:
 *         description: Allocated equipment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipment:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       allocation_id:
 *                         type: integer
 *                       serial_number:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       note:
 *                         type: string
 *                       is_selected:
 *                         type: boolean
 *                       equipment:
 *                         type: object
 *                         properties:
 *                           serial_number:
 *                             type: integer
 *                           reg_number:
 *                             type: string
 *                           vehicle_type:
 *                             type: string
 *                           equipment_status:
 *                             type: string
 *       404:
 *         description: No allocated equipment found for this sales order
 *       500:
 *         description: Error fetching allocated equipment
 */
router.get(
  "/allocated-equipment/:sales_order_id",
  verifyToken,
  getAllocatedEquipmentBySalesOrder
);

/**
 * @swagger
 * /api/active-allocations/allocated-manpower/{sales_order_id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get allocated manpower (operators) for a sales order
 *     description: Retrieves all manpower/operators allocated to a specific sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order ID to fetch allocated manpower for
 *     responses:
 *       200:
 *         description: Allocated manpower retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 manpower:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       allocation_id:
 *                         type: integer
 *                       employee_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       note:
 *                         type: string
 *                       is_selected:
 *                         type: boolean
 *                       employee:
 *                         type: object
 *                         properties:
 *                           employeeId:
 *                             type: integer
 *                           personalDetails:
 *                             type: object
 *                             properties:
 *                               fullNameEnglish:
 *                                 type: string
 *                           manpowerDetails:
 *                             type: object
 *                             properties:
 *                               employeeNo:
 *                                 type: string
 *                               manpower_status:
 *                                 type: string
 *                               operator_type:
 *                                 type: object
 *                                 properties:
 *                                   operator_type:
 *                                     type: string
 *       404:
 *         description: No allocated manpower found for this sales order
 *       500:
 *         description: Error fetching allocated manpower
 */
router.get(
  "/allocated-manpower/:sales_order_id",
  verifyToken,
  getAllocatedManpowerBySalesOrder
);

/**
 * @swagger
 * /api/active-allocations/allocated-attachments/{sales_order_id}:
 *   get:
 *     tags:
 *       - Active Allocations
 *     summary: Get allocated attachments for a sales order
 *     description: Retrieves all attachments allocated to a specific sales order
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order ID to fetch allocated attachments for
 *     responses:
 *       200:
 *         description: Allocated attachments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attachments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       allocation_id:
 *                         type: integer
 *                       attachment_id:
 *                         type: integer
 *                       status:
 *                         type: string
 *                       note:
 *                         type: string
 *                       is_selected:
 *                         type: boolean
 *                       attachment:
 *                         type: object
 *                         properties:
 *                           attachment_id:
 *                             type: integer
 *                           attachment_number:
 *                             type: string
 *                           product_name:
 *                             type: string
 *                           serial_number:
 *                             type: string
 *                           attachment_status:
 *                             type: string
 *       404:
 *         description: No allocated attachments found for this sales order
 *       500:
 *         description: Error fetching allocated attachments
 */
router.get(
  "/allocated-attachments/:sales_order_id",
  verifyToken,
  getAllocatedAttachmentsBySalesOrder
);

/**
 * @swagger
 * /api/active-allocations/update-ops-status:
 *   post:
 *     tags:
 *       - Active Allocations
 *     summary: Update sales order ops_status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - new_ops_status
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 description: ID of the sales order to update
 *                 example: 123
 *               new_ops_status:
 *                 type: string
 *                 enum: [Pending Resource Allocation, Pending Delivery Note, Partially Delivered, In Operation, Partially Off Hired, Completed]
 *                 description: New ops_status for the sales order
 *                 example: "Pending Delivery Note"
 *     responses:
 *       200:
 *         description: Sales order ops_status updated successfully
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error updating ops status
 */
router.post("/update-ops-status", verifyToken, updateOpsStatus);

module.exports = router;
