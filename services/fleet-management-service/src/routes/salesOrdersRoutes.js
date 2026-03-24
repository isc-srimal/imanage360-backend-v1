const express = require("express");
const {
  createSalesOrder,
  updateSalesOrder,
  deleteSalesOrder,
  getSalesOrderById,
  getAllSalesOrders,
  filterSalesOrders,
  serveSalesOrderFile,
  exportFilteredSalesOrdersToCSV,
  exportFilteredSalesOrdersToPDF,
  getSalesOrdersWithExpiringLPO,
  approveSalesOrder,
  rejectSalesOrder,
  getSalesOrderAttachmentHistory,
  addBillingHistoryRecord,
  updateBillingHistoryRecord,
  deleteBillingHistoryRecord,
  getBillingHistory,
  getLPOReminders,
  submitLPORemarks,
  getSalesPersonLPOReminders,
  saveSalesOrderDraft,
  getUserSalesOrderDrafts,
  getSalesOrderDraftById,
  deleteSalesOrderDraft,
  closeSalesOrder,
  completeRevision,
  getRevisionCompleteSalesOrders,     
  getRevisionIncompleteSalesOrders,   
  getNoRevisionsSalesOrders, 
  getRentalServicesBySalesOrder,
} = require("../../controllers/fleet-management/salesOrdersController");
const { verifyToken } = require("../../middleware/authMiddleware");
const checkLPOReminders = require("../../middleware/lpoReminderCheck");

const router = express.Router();

/**
 * @swagger
 * /api/sales-orders/salesOrderes/{id}:
 *   get:
 *     tags:
 *       - Manage Sales Orders
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
router.get("/salesOrderes/:id", verifyToken, getSalesOrderById);

/**
 * @swagger
 * /api/sales-orders/close/{id}:
 * put:
 * tags:
 * - Manage Sales Orders
 * summary: Close a rejected sales order
 */
router.put("/close/:id", verifyToken, closeSalesOrder);

router.get("/:id/rental-services", verifyToken, getRentalServicesBySalesOrder);

/**
 * @swagger
 * /api/sales-orders/lpo-reminders:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get LPO reminders for sales orders
 *     description: Get all sales orders that require LPO remarks or have expired LPOs
 *     responses:
 *       200:
 *         description: LPO reminders retrieved successfully
 *       500:
 *         description: Error retrieving LPO reminders
 */
router.get("/lpo-reminders", verifyToken, getLPOReminders);

/**
 * @swagger
 * /api/sales-orders/{id}/lpo-remarks:
 *   post:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Submit LPO remarks for a sales order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - remarks
 *               - type
 *             properties:
 *               remarks:
 *                 type: string
 *                 description: Remarks for not obtaining LPO or LPO extension
 *               type:
 *                 type: string
 *                 enum: [no_lpo, lpo_expired]
 *                 description: Type of remark
 *     responses:
 *       200:
 *         description: Remarks submitted successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error submitting remarks
 */
router.post("/:id/lpo-remarks", verifyToken, submitLPORemarks);

/**
 * @swagger
 * /api/sales-orders/allocate/{id}:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Navigate to allocations page for a specific sales order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *     responses:
 *       200:
 *         description: Sales order details retrieved for allocation
 *       404:
 *         description: Sales order not found
 */
router.get("/allocate/:id", verifyToken, getSalesOrderById);

/**
 * @swagger
 * /api/sales-orders/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Serve a sales order file
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [supportAttachmentDocuments, lpoEndDateSupportAttachmentDocuments]
 *         description: Folder containing the file
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/msword:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.ms-excel:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid folder
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", verifyToken, serveSalesOrderFile);

// /**
//  * @swagger
//  * /api/sales-orders/createSalesOrder:
//  *   post:
//  *     tags:
//  *       - Manage Sales Orders
//  *     summary: Create a new sales order
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               ordered_date:
//  *                 type: string
//  *                 format: date
//  *               client:
//  *                 type: string
//  *               location_id:
//  *                 type: integer
//  *               sales_person_id:
//  *                 type: integer
//  *               quotation_number:
//  *                 type: string
//  *               lpo_number:
//  *                 type: string
//  *               lpo_start_date:
//  *                 type: string
//  *                 format: date
//  *               lpo_validity_start_date:
//  *                 type: string
//  *                 format: date
//  *               lpo_validity_date:
//  *                 type: string
//  *                 format: date
//  *               product_service_option:
//  *                 type: string
//  *               product_type_vehicle_type:
//  *                 type: string
//  *               sub_product:
//  *                 type: string
//  *               fuel:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               food:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               accommodation:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               transportation:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               shift:
//  *                 type: string
//  *                 enum: [Day, Night, Full, Day and Night]
//  *               expected_mobilization_date:
//  *                 type: string
//  *                 format: date
//  *               expected_demobilization_date:
//  *                 type: string
//  *                 format: date
//  *               normal_working_hrs_equipment:
//  *                 type: number
//  *               normal_working_hrs_manpower:
//  *                 type: number
//  *               ot_applicable:
//  *                 type: boolean
//  *               ot_rate_qar:
//  *                 type: number
//  *               recovery_is_required:
//  *                 type: boolean
//  *               description_remarks:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 enum: [Active, Inactive]
//  *     responses:
//  *       201:
//  *         description: Sales order created successfully
//  *       500:
//  *         description: Error creating sales order
//  */
// router.post("/createSalesOrder", verifyToken, createSalesOrder);

/**
 * @swagger
 * /api/sales-orders/attachment-history/{id}:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get attachment history for a sales order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *     responses:
 *       200:
 *         description: Attachment history retrieved successfully
 *       404:
 *         description: Sales order not found
 */
router.get(
  "/attachment-history/:id",
  verifyToken,
  getSalesOrderAttachmentHistory
);

/**
 * @swagger
 * /api/sales-orders/{id}/billing-history:
 *   post:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Add a new billing history record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billing_type
 *               - shift
 *               - effective_start_date
 *             properties:
 *               billing_type:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               shift:
 *                 type: string
 *                 enum: [Day, Night, Full, Day and Night]
 *               unit_rate:
 *                 type: number
 *                 description: Required for Day, Night, Full shifts
 *               day_unit_rate:
 *                 type: number
 *                 description: Required for Day and Night shift
 *               night_unit_rate:
 *                 type: number
 *                 description: Required for Day and Night shift
 *               effective_start_date:
 *                 type: string
 *                 format: date
 *               effective_end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Billing history record added successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Sales order not found
 */
router.post("/:id/billing-history", verifyToken, addBillingHistoryRecord);

/**
 * @swagger
 * /api/sales-orders/{id}/billing-history/{recordId}:
 *   put:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Update a billing history record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the billing history record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - billing_type
 *               - shift
 *               - effective_start_date
 *             properties:
 *               billing_type:
 *                 type: string
 *                 enum: [daily, weekly, monthly]
 *               shift:
 *                 type: string
 *                 enum: [Day, Night, Full, Day and Night]
 *               unit_rate:
 *                 type: number
 *               day_unit_rate:
 *                 type: number
 *               night_unit_rate:
 *                 type: number
 *               effective_start_date:
 *                 type: string
 *                 format: date
 *               effective_end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Billing history record updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Sales order or record not found
 */
router.put(
  "/:id/billing-history/:recordId",
  verifyToken,
  updateBillingHistoryRecord
);

/**
 * @swagger
 * /api/sales-orders/{id}/billing-history/{recordId}:
 *   delete:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Delete a billing history record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the billing history record
 *     responses:
 *       200:
 *         description: Billing history record deleted successfully
 *       404:
 *         description: Sales order or record not found
 */
router.delete(
  "/:id/billing-history/:recordId",
  verifyToken,
  deleteBillingHistoryRecord
);

/**
 * @swagger
 * /api/sales-orders/{id}/billing-history:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get billing history for a sales order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *     responses:
 *       200:
 *         description: Billing history retrieved successfully
 *       404:
 *         description: Sales order not found
 */
router.get("/:id/billing-history", verifyToken, getBillingHistory);

/**
 * @swagger
 * /api/sales-orders/approve/{id}:
 *   put:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Approve a sales order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sales order approved successfully
 */
router.put("/approve/:id", verifyToken, approveSalesOrder);

/**
 * @swagger
 * /api/sales-orders/reject/{id}:
 *   put:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Reject a sales order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejection_reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sales order rejected successfully
 */
router.put("/reject/:id", verifyToken, rejectSalesOrder);

/**
 * @swagger
 * /api/sales-orders/createSalesOrder:
 *   post:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Create a new sales order
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing sales order details
 *               lpoEndDateSupportAttachment:
 *                 type: string
 *                 format: binary
 *                 description: LPO end date support attachment file (optional)
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       201:
 *         description: Sales order created successfully
 *       500:
 *         description: Error creating sales order
 */
router.post("/createSalesOrder", verifyToken, createSalesOrder);

/**
 * @swagger
 * /api/sales-orders/updateSalesOrder/{id}:
 *   put:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Update an existing sales order record
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing sales order details
 *               supportAttachment:
 *                 type: string
 *                 format: binary
 *                 description: Support attachment file (optional)
 *               lpoEndDateSupportAttachment:
 *                 type: string
 *                 format: binary
 *                 description: LPO end date support attachment file (optional)
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       200:
 *         description: Sales order updated successfully
 *       400:
 *         description: File upload error or missing/invalid data format
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error updating sales order
 */
router.put("/updateSalesOrder/:id", verifyToken, updateSalesOrder);

// /**
//  * @swagger
//  * /api/sales-orders/updateSalesOrder/{id}:
//  *   put:
//  *     tags:
//  *       - Manage Sales Orders
//  *     summary: Update an existing sales order record
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the sales order to update
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               data:
//  *                 type: string
//  *                 description: JSON string containing sales order details
//  *               supportAttachment:
//  *                 type: string
//  *                 format: binary
//  *                 description: Support attachment file (optional)
//  *           encoding:
//  *             data:
//  *               contentType: application/json
//  *     responses:
//  *       200:
//  *         description: Sales order updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Sales order updated successfully
//  *                 sales:
//  *                   type: object
//  *                   properties:
//  *                     ordered_date:
//  *                       type: string
//  *                       format: date
//  *                     client:
//  *                       type: string
//  *                     location_id:
//  *                       type: integer
//  *                     sales_person_id:
//  *                       type: integer
//  *                     quotation_number:
//  *                       type: string
//  *                     lpo_number:
//  *                       type: string
//  *                     lpo_start_date:
//  *                       type: string
//  *                       format: date
//  *                     lpo_validity_start_date:
//  *                       type: string
//  *                       format: date
//  *                     lpo_validity_date:
//  *                       type: string
//  *                       format: date
//  *                     extended_lpo_validity_date:
//  *                       type: string
//  *                       format: date
//  *                     product_service_option:
//  *                       type: string
//  *                     product_type_vehicle_type:
//  *                       type: string
//  *                     sub_product:
//  *                       type: string
//  *                     fuel:
//  *                       type: string
//  *                       enum: [Client, Company]
//  *                     food:
//  *                       type: string
//  *                       enum: [Client, Company]
//  *                     accommodation:
//  *                       type: string
//  *                       enum: [Client, Company]
//  *                     transportation:
//  *                       type: string
//  *                       enum: [Client, Company]
//  *                     shift:
//  *                       type: string
//  *                       enum: [Day, Night, Full, Day and Night]
//  *                     order_status:
//  *                       type: string
//  *                       enum: [Pending, Confirmed, In Progress, Completed, Cancelled]
//  *                     expected_mobilization_date:
//  *                       type: string
//  *                       format: date
//  *                     expected_demobilization_date:
//  *                       type: string
//  *                       format: date
//  *                     normal_working_hrs_equipment:
//  *                       type: number
//  *                     normal_working_hrs_manpower:
//  *                       type: number
//  *                     ot_applicable:
//  *                       type: boolean
//  *                     ot_rate_qar:
//  *                       type: number
//  *                     recovery_is_required:
//  *                       type: boolean
//  *                     description_remarks:
//  *                       type: string
//  *                     status:
//  *                       type: string
//  *                       enum: [Active, Inactive]
//  *       400:
//  *         description: File upload error or missing/invalid data format
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 error:
//  *                   type: string
//  *       404:
//  *         description: Sales order not found
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: Sales order not found
//  *       500:
//  *         description: Error updating sales order
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 error:
//  *                   type: string
//  */
// router.put("/updateSalesOrder/:id", verifyToken, updateSalesOrder);

// /**
//  * @swagger
//  * /api/sales-orders/updateSalesOrder/{id}:
//  *   put:
//  *     tags:
//  *       - Manage Sales Orders
//  *     summary: Update an existing sales order
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the sales order to update
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               ordered_date:
//  *                 type: string
//  *                 format: date
//  *               client:
//  *                 type: string
//  *               location_id:
//  *                 type: integer
//  *               sales_person_id:
//  *                 type: integer
//  *               quotation_number:
//  *                 type: string
//  *               lpo_number:
//  *                 type: string
//  *               lpo_start_date:
//  *                 type: string
//  *                 format: date
//  *               lpo_validity_start_date:
//  *                 type: string
//  *                 format: date
//  *               lpo_validity_date:
//  *                 type: string
//  *                 format: date
//  *               extended_lpo_validity_date:
//  *                 type: string
//  *                 format: date
//  *               product_service_option:
//  *                 type: string
//  *               product_type_vehicle_type:
//  *                 type: string
//  *               sub_product:
//  *                 type: string
//  *               fuel:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               food:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               accommodation:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               transportation:
//  *                 type: string
//  *                 enum: [Client, Company]
//  *               shift:
//  *                 type: string
//  *                 enum: [Day, Night, Full, Day and Night]
//  *               order_status:
//  *                 type: string
//  *                 enum: [Pending, Confirmed, In Progress, Completed, Cancelled]
//  *               expected_mobilization_date:
//  *                 type: string
//  *                 format: date
//  *               project_mobilization_date:
//  *                 type: string
//  *                 format: date
//  *               work_chargeable_start_date:
//  *                 type: string
//  *                 format: date
//  *               work_chargeable_end_date:
//  *                 type: string
//  *                 format: date
//  *               project_demobilization_date:
//  *                 type: string
//  *                 format: date
//  *               normal_working_hrs_equipment:
//  *                 type: number
//  *               normal_working_hrs_manpower:
//  *                 type: number
//  *               ot_applicable:
//  *                 type: boolean
//  *               ot_rate_qar:
//  *                 type: number
//  *               recovery_is_required:
//  *                 type: boolean
//  *               description_remarks:
//  *                 type: string
//  *               status:
//  *                 type: string
//  *                 enum: [Active, Inactive]
//  *     responses:
//  *       200:
//  *         description: Sales order updated successfully
//  *       404:
//  *         description: Sales order not found
//  *       500:
//  *         description: Error updating sales order
//  */
// router.put("/updateSalesOrder/:id", verifyToken, updateSalesOrder);

/**
 * @swagger
 * /api/sales-orders/deleteSalesOrder/{id}:
 *   delete:
 *     tags:
 *       - Manage Sales Orders
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
router.delete("/deleteSalesOrder/:id", verifyToken, deleteSalesOrder);

/**
 * @swagger
 * /api/sales-orders/salesOrders:
 *   get:
 *     tags:
 *       - Manage Sales Orders
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
router.get("/salesOrders", verifyToken, checkLPOReminders, getAllSalesOrders);

/**
 * @swagger
 * /api/sales-orders/filterSalesOrders:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Filter sales orders by multiple criteria
 *     parameters:
 *       - in: query
 *         name: ops_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Pending resource Allocation, Pending Delivery Note, Partially Delivered, In Operation, Partially Off Hired, Completed]
 *       - in: query
 *         name: so_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Draft, Under Approval, Rejected, Closed, Revision Rejected, Approved, Revision Under Approval]
 *       - in: query
 *         name: client
 *         required: false
 *         description: Filter by client name (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         required: false
 *         description: Filter by job location name (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: so_number
 *         required: false
 *         description: Filter by SO number (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: order_date_from
 *         required: false
 *         description: Filter orders from this date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: order_date_to
 *         required: false
 *         description: Filter orders up to this date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
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
 *           default: 8
 *     responses:
 *       200:
 *         description: Filtered sales orders retrieved successfully
 *       500:
 *         description: Error filtering sales orders
 */
router.get("/filterSalesOrders", verifyToken, checkLPOReminders, filterSalesOrders);

/**
 * @swagger
 * /api/sales-orders/exportFilteredSalesOrdersToCSV:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Export filtered sales orders to CSV
 *     parameters:
 *       - in: query
 *         name: ops_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Pending resource Allocation, Pending Delivery Note, Partially Delivered, In Operation, Partially Off Hired, Completed]
 *       - in: query
 *         name: so_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Draft, Under Approval, Rejected, Closed, Revision Rejected, Approved, Revision Under Approval]
 *       - in: query
 *         name: client
 *         required: false
 *         description: Filter by client name (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         required: false
 *         description: Filter by job location name (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: so_number
 *         required: false
 *         description: Filter by SO number (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: order_date_from
 *         required: false
 *         description: Filter orders from this date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: order_date_to
 *         required: false
 *         description: Filter orders up to this date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: CSV file download
 *       404:
 *         description: No data found
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportFilteredSalesOrdersToCSV", verifyToken, exportFilteredSalesOrdersToCSV);

/**
 * @swagger
 * /api/sales-orders/exportFilteredSalesOrdersToPDF:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Export filtered sales orders to PDF
 *     parameters:
 *       - in: query
 *         name: ops_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Pending resource Allocation, Pending Delivery Note, Partially Delivered, In Operation, Partially Off Hired, Completed]
 *       - in: query
 *         name: so_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Draft, Under Approval, Rejected, Closed, Revision Rejected, Approved, Revision Under Approval]
 *       - in: query
 *         name: client
 *         required: false
 *         description: Filter by client name (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: location
 *         required: false
 *         description: Filter by job location name (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: so_number
 *         required: false
 *         description: Filter by SO number (partial match)
 *         schema:
 *           type: string
 *       - in: query
 *         name: order_date_from
 *         required: false
 *         description: Filter orders from this date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: order_date_to
 *         required: false
 *         description: Filter orders up to this date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
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
 *         description: PDF file download
 *       404:
 *         description: No data found
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportFilteredSalesOrdersToPDF", verifyToken, exportFilteredSalesOrdersToPDF);

// /**
//  * @swagger
//  * /api/sales-orders/filterSalesOrders:
//  *   get:
//  *     tags:
//  *       - Manage Sales Orders
//  *     summary: Filter sales orders by status and so_status
//  *     parameters:
//  *       - in: query
//  *         name: ops_status
//  *         required: false
//  *         schema:
//  *           type: string
//  *           enum: [All, Pending resource Allocation, Pending Delivery Note, Partially Delivered, In Operation, Partially Off Hired, Completed]
//  *       - in: query
//  *         name: so_status
//  *         required: false
//  *         schema:
//  *           type: string
//  *           enum: [All, Draft, Under Approval, Rejected, Closed, Revision Rejected, Approved, Revision Under Approval]
//  *       - in: query
//  *         name: page
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *     responses:
//  *       200:
//  *         description: Filtered sales orders retrieved successfully
//  *       500:
//  *         description: Error filtering sales orders
//  */
// router.get(
//   "/filterSalesOrders",
//   verifyToken,
//   checkLPOReminders,
//   filterSalesOrders
// );

// /**
//  * @swagger
//  * /api/sales-orders/exportFilteredSalesOrdersToCSV:
//  *   get:
//  *     tags:
//  *       - Manage Sales Orders
//  *     summary: Export filtered sales orders to CSV
//  *     parameters:
//  *       - in: query
//  *         name: ops_status
//  *         required: false
//  *         schema:
//  *           type: string
//  *           enum: [All, Pending resource Allocation, Pending Delivery Note, Partially Delivered, In Operation, Partially Off Hired, Completed]
//  *       - in: query
//  *         name: so_status
//  *         required: false
//  *         schema:
//  *           type: string
//  *           enum: [All, Draft, Under Approval, Rejected, Closed, Revision Rejected, Approved, Revision Under Approval]
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: CSV file download
//  *       500:
//  *         description: Error exporting CSV
//  */
// router.get(
//   "/exportFilteredSalesOrdersToCSV",
//   verifyToken,
//   exportFilteredSalesOrdersToCSV
// );

// /**
//  * @swagger
//  * /api/sales-orders/exportFilteredSalesOrdersToPDF:
//  *   get:
//  *     tags:
//  *       - Manage Sales Orders
//  *     summary: Export filtered sales orders to PDF
//   *     parameters:
//  *       - in: query
//  *         name: ops_status
//  *         required: false
//  *         schema:
//  *           type: string
//  *           enum: [All, Pending resource Allocation, Pending Delivery Note, Partially Delivered, In Operation, Partially Off Hired, Completed]
//  *       - in: query
//  *         name: so_status
//  *         required: false
//  *         schema:
//  *           type: string
//  *           enum: [All, Draft, Under Approval, Rejected, Closed, Revision Rejected, Approved, Revision Under Approval]
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: PDF file download
//  *       500:
//  *         description: Error exporting PDF
//  */
// router.get(
//   "/exportFilteredSalesOrdersToPDF",
//   verifyToken,
//   exportFilteredSalesOrdersToPDF
// );

/**
 * @swagger
 * /api/sales-orders/expiring-lpo:
 *   get:
 *     tags:
 *       - Sales Orders
 *     summary: Get sales orders with expiring LPO dates
 *     description: This endpoint retrieves sales orders whose LPO validity dates (standard or extended) are nearing expiry within a specified timeframe.
 *     parameters:
 *       - in: query
 *         name: daysAhead
 *         required: false
 *         schema:
 *           type: integer
 *           default: 180
 *         description: Number of days ahead to check for expiring LPO dates (default is 180 days = 6 months)
 *     responses:
 *       200:
 *         description: Sales orders with expiring LPO dates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of sales orders with expiring LPO dates
 *                 salesOrders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       client:
 *                         type: string
 *                       lpoNumber:
 *                         type: string
 *                       quotationNumber:
 *                         type: string
 *                       lpoValidityDate:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                         description: LPO validity date
 *                       extendedLpoValidityDate:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                         description: Extended LPO validity date
 *                       lpoValidityDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Days remaining until LPO validity expires
 *                       extendedLpoDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Days remaining until extended LPO expires
 *                       minDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Minimum days left between standard and extended LPO
 *                       hasLpoValidityExpiring:
 *                         type: boolean
 *                         description: Whether LPO validity date is expiring
 *                       hasExtendedLpoExpiring:
 *                         type: boolean
 *                         description: Whether extended LPO validity is expiring
 *                       SOStatus:
 *                         type: string
 *                       OPSStatus:
 *                         type: string
 *                       location:
 *                         type: string
 *                       salesPerson:
 *                         type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     urgent:
 *                       type: integer
 *                       description: Number of orders with urgent LPO expiry (≤30 days)
 *                     nearingExpiry:
 *                       type: integer
 *                       description: Number of orders with LPO nearing expiry (31-90 days)
 *                     lpoValidityExpiring:
 *                       type: integer
 *                       description: Number of orders with standard LPO validity expiring
 *                     extendedLpoExpiring:
 *                       type: integer
 *                       description: Number of orders with extended LPO validity expiring
 *       500:
 *         description: Error retrieving sales orders with expiring LPO dates
 */
router.get("/expiring-lpo", verifyToken, getSalesOrdersWithExpiringLPO);

// Add this route in your router
router.get("/my-lpo-reminders", verifyToken, getSalesPersonLPOReminders);

/**
 * @swagger
 * /api/sales-orders/draft:
 *   post:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Save or update sales order draft
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               draftId:
 *                 type: integer
 *               currentStep:
 *                 type: integer
 *               draftData:
 *                 type: object
 *     responses:
 *       200:
 *         description: Draft saved successfully
 */
router.post("/draft", verifyToken, saveSalesOrderDraft);

/**
 * @swagger
 * /api/sales-orders/draft/user:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get all drafts for current user
 *     responses:
 *       200:
 *         description: Drafts retrieved successfully
 */
router.get("/draft/user", verifyToken, getUserSalesOrderDrafts);

/**
 * @swagger
 * /api/sales-orders/draft/{id}:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get a specific draft by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Draft retrieved successfully
 */
router.get("/draft/:id", verifyToken, getSalesOrderDraftById);

/**
 * @swagger
 * /api/sales-orders/draft/{id}:
 *   delete:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Delete a draft
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Draft deleted successfully
 */
router.delete("/draft/:id", verifyToken, deleteSalesOrderDraft);

/**
 * @swagger
 * /api/sales-orders/complete-revision/{id}:
 *   put:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Mark revision as completed and clear edited_fields
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales order
 *     responses:
 *       200:
 *         description: Revision completed successfully
 *       404:
 *         description: Sales order not found
 *       500:
 *         description: Error completing revision
 */
router.put("/complete-revision/:id", verifyToken, completeRevision);

/**
 * @swagger
 * /api/sales-orders/filter/revision-complete:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get sales orders with completed revisions
 *     description: Returns sales orders where revisions have been completed (edited_fields is empty but revision history exists)
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
 *           default: 8
 *     responses:
 *       200:
 *         description: Revision complete sales orders retrieved successfully
 */
router.get("/filter/revision-complete", verifyToken, getRevisionCompleteSalesOrders);

/**
 * @swagger
 * /api/sales-orders/filter/revision-incomplete:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get sales orders with incomplete revisions
 *     description: Returns sales orders that have pending revisions (edited_fields is not empty)
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
 *           default: 8
 *     responses:
 *       200:
 *         description: Revision incomplete sales orders retrieved successfully
 */
router.get("/filter/revision-incomplete", verifyToken, getRevisionIncompleteSalesOrders);

/**
 * @swagger
 * /api/sales-orders/filter/no-revisions:
 *   get:
 *     tags:
 *       - Manage Sales Orders
 *     summary: Get sales orders with no revisions
 *     description: Returns sales orders that were initially created and never revised
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
 *           default: 8
 *     responses:
 *       200:
 *         description: Sales orders with no revisions retrieved successfully
 */
router.get("/filter/no-revisions", verifyToken, getNoRevisionsSalesOrders);

module.exports = router;
