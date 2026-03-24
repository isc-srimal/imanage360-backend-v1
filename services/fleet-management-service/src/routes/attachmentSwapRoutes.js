// // // routes/fleet-management/attachment-swap-routes.js
// // const express = require("express");
// // const {
// //   getAllAttachmentNumbers,
// //   createAttachmentSwap,
// //   getAttachmentSwapsBySalesOrder,
// //   createAttachmentDeliveryNote,
// //   createAttachmentOffHireNote,
// //   getAttachmentSwapById,
// //   getAttachmentDeliveryNote,
// //   getAttachmentOffHireNote,
// //   downloadAttachmentDeliveryNote,
// //   downloadAttachmentOffHireNote,
// //   uploadAttachmentDeliveryNote,
// //   uploadAttachmentOffHireNote
// // } = require("../../controllers/fleet-management/attachmentSwapController");
// // const { verifyToken } = require("../../middleware/authMiddleware");

// // const router = express.Router();

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/attachment-numbers:
// //  *   get:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Get all attachment numbers for dropdown
// //  *     responses:
// //  *       200:
// //  *         description: Attachment list retrieved successfully
// //  */
// // router.get("/attachment-numbers", verifyToken, getAllAttachmentNumbers);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/create:
// //  *   post:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Create an attachment swap
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             type: object
// //  *             required:
// //  *               - sales_order_id
// //  *               - previous_attachment_no
// //  *               - new_attachment_no
// //  *               - swap_date
// //  *               - swap_reason
// //  *             properties:
// //  *               sales_order_id:
// //  *                 type: integer
// //  *               allocation_id:
// //  *                 type: integer
// //  *               previous_attachment_no:
// //  *                 type: string
// //  *               new_attachment_no:
// //  *                 type: string
// //  *               swap_date:
// //  *                 type: string
// //  *                 format: date
// //  *               swap_reason:
// //  *                 type: string
// //  *     responses:
// //  *       201:
// //  *         description: Attachment swap created successfully
// //  */
// // router.post("/create", verifyToken, createAttachmentSwap);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/sales-order/{sales_order_id}:
// //  *   get:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Get all attachment swaps for a sales order
// //  *     parameters:
// //  *       - in: path
// //  *         name: sales_order_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     responses:
// //  *       200:
// //  *         description: Attachment swaps retrieved successfully
// //  */
// // router.get("/sales-order/:sales_order_id", verifyToken, getAttachmentSwapsBySalesOrder);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/{id}:
// //  *   get:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Get attachment swap by ID with details
// //  *     parameters:
// //  *       - in: path
// //  *         name: id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     responses:
// //  *       200:
// //  *         description: Attachment swap details retrieved
// //  */
// // router.get("/:id", verifyToken, getAttachmentSwapById);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/{attachment_swap_id}/delivery-note:
// //  *   post:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Create attachment delivery note
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_swap_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             type: object
// //  *             required:
// //  *               - delivery_date
// //  *             properties:
// //  *               delivery_date:
// //  *                 type: string
// //  *                 format: date
// //  *               remarks:
// //  *                 type: string
// //  *     responses:
// //  *       201:
// //  *         description: Delivery note created successfully
// //  */
// // router.post("/:attachment_swap_id/delivery-note", verifyToken, createAttachmentDeliveryNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/{attachment_swap_id}/off-hire-note:
// //  *   post:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Create attachment off hire note
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_swap_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         application/json:
// //  *           schema:
// //  *             type: object
// //  *             required:
// //  *               - off_hire_date
// //  *             properties:
// //  *               off_hire_date:
// //  *                 type: string
// //  *                 format: date
// //  *               remarks:
// //  *                 type: string
// //  *     responses:
// //  *       201:
// //  *         description: Off hire note created successfully
// //  */
// // router.post("/:attachment_swap_id/off-hire-note", verifyToken, createAttachmentOffHireNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/delivery-note/{attachment_dn_id}:
// //  *   get:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Get attachment delivery note by ID
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_dn_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     responses:
// //  *       200:
// //  *         description: Delivery note retrieved successfully
// //  */
// // router.get("/delivery-note/:attachment_dn_id", verifyToken, getAttachmentDeliveryNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}:
// //  *   get:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Get attachment off hire note by ID
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_ohn_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     responses:
// //  *       200:
// //  *         description: Off hire note retrieved successfully
// //  */
// // router.get("/off-hire-note/:attachment_ohn_id", verifyToken, getAttachmentOffHireNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/delivery-note/{attachment_dn_id}/download:
// //  *   get:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Download attachment delivery note PDF
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_dn_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     responses:
// //  *       200:
// //  *         description: PDF file downloaded
// //  */
// // router.get("/delivery-note/:attachment_dn_id/download", verifyToken, downloadAttachmentDeliveryNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/download:
// //  *   get:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Download attachment off hire note PDF
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_ohn_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     responses:
// //  *       200:
// //  *         description: PDF file downloaded
// //  */
// // router.get("/off-hire-note/:attachment_ohn_id/download", verifyToken, downloadAttachmentOffHireNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/delivery-note/{attachment_dn_id}/upload:
// //  *   post:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Upload attachment delivery note document
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_dn_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         multipart/form-data:
// //  *           schema:
// //  *             type: object
// //  *             properties:
// //  *               delivery_attachment:
// //  *                 type: string
// //  *                 format: binary
// //  *     responses:
// //  *       200:
// //  *         description: File uploaded successfully
// //  */
// // router.post("/delivery-note/:attachment_dn_id/upload", verifyToken, uploadAttachmentDeliveryNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/upload:
// //  *   post:
// //  *     tags:
// //  *       - Attachment Swaps
// //  *     summary: Upload attachment off hire note document
// //  *     parameters:
// //  *       - in: path
// //  *         name: attachment_ohn_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *     requestBody:
// //  *       required: true
// //  *       content:
// //  *         multipart/form-data:
// //  *           schema:
// //  *             type: object
// //  *             properties:
// //  *               off_hire_attachment:
// //  *                 type: string
// //  *                 format: binary
// //  *     responses:
// //  *       200:
// //  *         description: File uploaded successfully
// //  */
// // router.post("/off-hire-note/:attachment_ohn_id/upload", verifyToken, uploadAttachmentOffHireNote);

// // module.exports = router;

// // routes/fleet-management/attachment-swap-routes.js
// const express = require("express");
// const {
//   getAllAttachmentNumbers,
//   getAttachmentSwapReasons,
//   createAttachmentSwap,
//   // getAttachmentSwapsBySalesOrder,
//   getAttachmentSwapById,
//   createAttachmentDeliveryNote,
//   createAttachmentOffHireNote,
//   getAttachmentDeliveryNoteSummary,
//   getAttachmentOffHireNoteSummary,
//   generateAttachmentDeliveryNotePDF,
//   generateAttachmentOffHireNotePDF,
//   uploadAttachmentDeliveryNote,
//   uploadAttachmentOffHireNote,
//   addTripToAttachmentDeliveryNote,
//   addTripToAttachmentOffHireNote,
//   submitAttachmentSwapRequest,
//   returnAttachmentSwapRequest,
//   approveAttachmentSwap,
//   rejectAttachmentSwap,
//   getPendingAttachmentSwapRequests,
//   getSwapRequestCounts,

// } = require("../../controllers/fleet-management/attachmentSwapController");
// const { verifyToken } = require("../../middleware/authMiddleware");
// const upload = require("../../middleware/uploadMiddleware");
// const AttachmentSwapModel = require("../../models/fleet-management/AttachmentSwapModel");

// const router = express.Router();

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     AttachmentSwap:
//  *       type: object
//  *       required:
//  *         - sales_order_id
//  *         - previous_attachment_no
//  *         - new_attachment_no
//  *         - swap_date
//  *         - swap_reason
//  *       properties:
//  *         attachment_swap_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         sales_order_id:
//  *           type: integer
//  *           description: Sales order ID
//  *         allocation_id:
//  *           type: integer
//  *           description: Allocation ID
//  *         previous_attachment_id:
//  *           type: integer
//  *           description: Previous attachment ID
//  *         previous_attachment_no:
//  *           type: string
//  *           description: Previous attachment number
//  *         new_attachment_id:
//  *           type: integer
//  *           description: New attachment ID
//  *         new_attachment_no:
//  *           type: string
//  *           description: New attachment number
//  *         swap_date:
//  *           type: string
//  *           format: date
//  *           description: Swap date
//  *         swap_reason:
//  *           type: string
//  *           description: Reason for swap
//  *         delivery_note_status:
//  *           type: string
//  *           enum: [Pending, In Progress, Completed, Cancelled]
//  *           default: Pending
//  *         off_hire_note_status:
//  *           type: string
//  *           enum: [Pending, In Progress, Completed, Cancelled]
//  *           default: Pending
//  *         overall_status:
//  *           type: string
//  *           enum: [Created, In Progress, Completed, Cancelled]
//  *           default: Created
//  *         created_by:
//  *           type: string
//  *           description: Created by user
//  *         created_at:
//  *           type: string
//  *           format: date-time
//  *           description: Creation timestamp
//  *         updated_at:
//  *           type: string
//  *           format: date-time
//  *           description: Update timestamp
//  *
//  *     AttachmentDeliveryNote:
//  *       type: object
//  *       required:
//  *         - attachment_swap_id
//  *         - delivery_date
//  *       properties:
//  *         attachment_dn_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         attachment_swap_id:
//  *           type: integer
//  *           description: Attachment swap ID
//  *         dn_number:
//  *           type: string
//  *           description: Delivery note number
//  *         new_attachment_id:
//  *           type: integer
//  *           description: New attachment ID
//  *         new_attachment_no:
//  *           type: string
//  *           description: New attachment number
//  *         delivery_date:
//  *           type: string
//  *           format: date
//  *           description: Delivery date
//  *         status:
//  *           type: string
//  *           enum: [Creation, In Progress, Delivered, Cancelled]
//  *           default: Creation
//  *         delivery_attachment:
//  *           type: string
//  *           description: Delivery attachment file path
//  *         remarks:
//  *           type: string
//  *           description: Remarks
//  *         created_by:
//  *           type: string
//  *           description: Created by user
//  *         created_at:
//  *           type: string
//  *           format: date-time
//  *           description: Creation timestamp
//  *         updated_at:
//  *           type: string
//  *           format: date-time
//  *           description: Update timestamp
//  *
//  *     AttachmentOffHireNote:
//  *       type: object
//  *       required:
//  *         - attachment_swap_id
//  *         - off_hire_date
//  *       properties:
//  *         attachment_ohn_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         attachment_swap_id:
//  *           type: integer
//  *           description: Attachment swap ID
//  *         ohn_number:
//  *           type: string
//  *           description: Off hire note number
//  *         previous_attachment_id:
//  *           type: integer
//  *           description: Previous attachment ID
//  *         previous_attachment_no:
//  *           type: string
//  *           description: Previous attachment number
//  *         off_hire_date:
//  *           type: string
//  *           format: date
//  *           description: Off hire date
//  *         status:
//  *           type: string
//  *           enum: [Creation, In Progress, Completed, Cancelled]
//  *           default: Creation
//  *         off_hire_attachment:
//  *           type: string
//  *           description: Off hire attachment file path
//  *         remarks:
//  *           type: string
//  *           description: Remarks
//  *         created_by:
//  *           type: string
//  *           description: Created by user
//  *         created_at:
//  *           type: string
//  *           format: date-time
//  *           description: Creation timestamp
//  *         updated_at:
//  *           type: string
//  *           format: date-time
//  *           description: Update timestamp
//  *
//  *     TripData:
//  *       type: object
//  *       properties:
//  *         trip_number:
//  *           type: integer
//  *           description: Trip number (1-7)
//  *         transportation_company:
//  *           type: string
//  *           description: Transportation company name
//  *         driver_name:
//  *           type: string
//  *           description: Driver name
//  *         driver_contact:
//  *           type: string
//  *           description: Driver contact number
//  *         vehicle_type:
//  *           type: string
//  *           description: Vehicle type
//  *         vehicle_number:
//  *           type: string
//  *           description: Vehicle number
//  *         trip_date:
//  *           type: string
//  *           format: date
//  *           description: Trip date
//  *         remarks:
//  *           type: string
//  *           description: Trip remarks
//  *
//  *     AttachmentNumber:
//  *       type: object
//  *       properties:
//  *         attachment_id:
//  *           type: integer
//  *           description: Attachment ID
//  *         attachment_number:
//  *           type: string
//  *           description: Attachment number
//  *         product_name:
//  *           type: string
//  *           description: Product name
//  *
//  *     AttachmentDeliveryNoteSummary:
//  *       type: object
//  *       properties:
//  *         dn_number:
//  *           type: string
//  *           description: Delivery note number
//  *         attachment:
//  *           type: object
//  *           properties:
//  *             attachment_id:
//  *               type: integer
//  *             attachment_number:
//  *               type: string
//  *             product_name:
//  *               type: string
//  *             serial_number:
//  *               type: string
//  *         delivery_date:
//  *           type: string
//  *           format: date
//  *         status:
//  *           type: string
//  *         trips:
//  *           type: array
//  *           items:
//  *             type: object
//  *             properties:
//  *               trip_number:
//  *                 type: integer
//  *               transportation:
//  *                 type: object
//  *                 properties:
//  *                   company:
//  *                     type: string
//  *                   driver:
//  *                     type: string
//  *                   contact:
//  *                     type: string
//  *                   vehicle:
//  *                     type: string
//  *               trip_date:
//  *                 type: string
//  *                 format: date
//  *               trip_status:
//  *                 type: string
//  *               remarks:
//  *                 type: string
//  *
//  *   securitySchemes:
//  *     bearerAuth:
//  *       type: http
//  *       scheme: bearer
//  *       bearerFormat: JWT
//  */

// /**
//  * @swagger
//  * tags:
//  *   name: Attachment Swaps
//  *   description: Attachment swap management endpoints
//  */

// /**
//  * @swagger
//  * /api/attachment-swaps/attachment-numbers:
//  *   get:
//  *     summary: Get all attachment numbers for dropdown
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of attachment numbers
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 attachments:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/AttachmentNumber'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/attachment-numbers", verifyToken, getAllAttachmentNumbers);

// router.get("/swap-reasons", verifyToken, getAttachmentSwapReasons);

// /**
//  * @swagger
//  * /api/attachment-swaps/create:
//  *   post:
//  *     summary: Create an attachment swap
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - sales_order_id
//  *               - previous_attachment_no
//  *               - new_attachment_no
//  *               - swap_date
//  *               - swap_reason
//  *             properties:
//  *               sales_order_id:
//  *                 type: integer
//  *                 example: 1
//  *               allocation_id:
//  *                 type: integer
//  *                 example: 1
//  *               previous_attachment_no:
//  *                 type: string
//  *                 example: "ATT-001"
//  *               new_attachment_no:
//  *                 type: string
//  *                 example: "ATT-002"
//  *               swap_date:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-01-15"
//  *               swap_reason:
//  *                 type: string
//  *                 example: "Attachment breakdown"
//  *     responses:
//  *       201:
//  *         description: Attachment swap created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 attachmentSwap:
//  *                   $ref: '#/components/schemas/AttachmentSwap'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Sales order or attachment not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/create", verifyToken, createAttachmentSwap);

// /**
//  * @swagger
//  * /api/attachment-swaps/{id}:
//  *   get:
//  *     summary: Get attachment swap by ID with details
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment swap ID
//  *     responses:
//  *       200:
//  *         description: Attachment swap details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 attachmentSwap:
//  *                   $ref: '#/components/schemas/AttachmentSwap'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Attachment swap not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/:id", verifyToken, getAttachmentSwapById);

// /**
//  * @swagger
//  * /api/attachment-swaps/{attachment_swap_id}/delivery-note:
//  *   post:
//  *     summary: Create attachment delivery note
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment swap ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - delivery_date
//  *             properties:
//  *               delivery_date:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-01-20"
//  *               remarks:
//  *                 type: string
//  *                 example: "Delivery to site"
//  *               trips:
//  *                 type: array
//  *                 items:
//  *                   $ref: '#/components/schemas/TripData'
//  *     responses:
//  *       201:
//  *         description: Delivery note created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 deliveryNote:
//  *                   $ref: '#/components/schemas/AttachmentDeliveryNote'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Attachment swap not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/:attachment_swap_id/delivery-note", verifyToken, createAttachmentDeliveryNote);

// /**
//  * @swagger
//  * /api/attachment-swaps/{attachment_swap_id}/off-hire-note:
//  *   post:
//  *     summary: Create attachment off hire note
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment swap ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - off_hire_date
//  *             properties:
//  *               off_hire_date:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-01-25"
//  *               remarks:
//  *                 type: string
//  *                 example: "Off hire due to swap"
//  *               trips:
//  *                 type: array
//  *                 items:
//  *                   $ref: '#/components/schemas/TripData'
//  *     responses:
//  *       201:
//  *         description: Off hire note created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 offHireNote:
//  *                   $ref: '#/components/schemas/AttachmentOffHireNote'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Attachment swap not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/:attachment_swap_id/off-hire-note", verifyToken, createAttachmentOffHireNote);

// // /**
// //  * @swagger
// //  * /api/attachment-swaps/sales-order/{sales_order_id}:
// //  *   get:
// //  *     summary: Get all attachment swaps for sales order
// //  *     tags: [Attachment Swaps]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     parameters:
// //  *       - in: path
// //  *         name: sales_order_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *         description: Sales order ID
// //  *     responses:
// //  *       200:
// //  *         description: List of attachment swaps
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 totalCount:
// //  *                   type: integer
// //  *                 attachmentSwaps:
// //  *                   type: array
// //  *                   items:
// //  *                     $ref: '#/components/schemas/AttachmentSwap'
// //  *       401:
// //  *         description: Unauthorized
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/sales-order/:sales_order_id", verifyToken, getAttachmentSwapsBySalesOrder);

// /**
//  * @swagger
//  * /api/attachment-swaps/delivery-note/{attachment_dn_id}/summary:
//  *   get:
//  *     summary: Get attachment delivery note summary
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment delivery note ID
//  *     responses:
//  *       200:
//  *         description: Delivery note summary
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 summary:
//  *                   $ref: '#/components/schemas/AttachmentDeliveryNoteSummary'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Delivery note not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/delivery-note/:attachment_dn_id/summary", verifyToken, getAttachmentDeliveryNoteSummary);

// /**
//  * @swagger
//  * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/summary:
//  *   get:
//  *     summary: Get attachment off hire note summary
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment off hire note ID
//  *     responses:
//  *       200:
//  *         description: Off hire note summary
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 summary:
//  *                   $ref: '#/components/schemas/AttachmentDeliveryNoteSummary'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Off hire note not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/off-hire-note/:attachment_ohn_id/summary", verifyToken, getAttachmentOffHireNoteSummary);

// /**
//  * @swagger
//  * /api/attachment-swaps/delivery-note/{attachment_dn_id}/generate-pdf:
//  *   get:
//  *     summary: Generate attachment delivery note PDF
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment delivery note ID
//  *     responses:
//  *       200:
//  *         description: PDF file
//  *         content:
//  *           application/pdf:
//  *             schema:
//  *               type: string
//  *               format: binary
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Delivery note not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/delivery-note/:attachment_dn_id/generate-pdf", verifyToken, generateAttachmentDeliveryNotePDF);

// /**
//  * @swagger
//  * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/generate-pdf:
//  *   get:
//  *     summary: Generate attachment off hire note PDF
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment off hire note ID
//  *     responses:
//  *       200:
//  *         description: PDF file
//  *         content:
//  *           application/pdf:
//  *             schema:
//  *               type: string
//  *               format: binary
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Off hire note not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/off-hire-note/:attachment_ohn_id/generate-pdf", verifyToken, generateAttachmentOffHireNotePDF);

// /**
//  * @swagger
//  * /api/attachment-swaps/delivery-note/{attachment_dn_id}/upload:
//  *   post:
//  *     summary: Upload signed attachment delivery note
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment delivery note ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               delivery_attachment:
//  *                 type: string
//  *                 format: binary
//  *                 description: Signed delivery note file (PDF/Image)
//  *     responses:
//  *       200:
//  *         description: Delivery note uploaded successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *                 fileName:
//  *                   type: string
//  *                 status:
//  *                   type: string
//  *       400:
//  *         description: No file uploaded
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Delivery note not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/delivery-note/:attachment_dn_id/upload", verifyToken, upload.single("delivery_attachment"), uploadAttachmentDeliveryNote);

// /**
//  * @swagger
//  * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/upload:
//  *   post:
//  *     summary: Upload signed attachment off hire note
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment off hire note ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               off_hire_attachment:
//  *                 type: string
//  *                 format: binary
//  *                 description: Signed off hire note file (PDF/Image)
//  *     responses:
//  *       200:
//  *         description: Off hire note uploaded successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 message:
//  *                   type: string
//  *                 fileName:
//  *                   type: string
//  *                 status:
//  *                   type: string
//  *       400:
//  *         description: No file uploaded
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Off hire note not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/off-hire-note/:attachment_ohn_id/upload", verifyToken, upload.single("off_hire_attachment"), uploadAttachmentOffHireNote);

// /**
//  * @swagger
//  * /api/attachment-swaps/delivery-note/{attachment_dn_id}/add-trip:
//  *   post:
//  *     summary: Add trip to attachment delivery note
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment delivery note ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - transportation_company
//  *               - driver_name
//  *               - driver_contact
//  *             properties:
//  *               transportation_company:
//  *                 type: string
//  *                 example: "ABC Transport"
//  *               driver_name:
//  *                 type: string
//  *                 example: "John Doe"
//  *               driver_contact:
//  *                 type: string
//  *                 example: "0712345678"
//  *               vehicle_type:
//  *                 type: string
//  *                 example: "Lorry"
//  *               vehicle_number:
//  *                 type: string
//  *                 example: "ABC-123"
//  *               trip_date:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-01-20"
//  *               remarks:
//  *                 type: string
//  *                 example: "First trip"
//  *     responses:
//  *       201:
//  *         description: Trip added successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 trip:
//  *                   $ref: '#/components/schemas/TripData'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Delivery note not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/delivery-note/:attachment_dn_id/add-trip", verifyToken, addTripToAttachmentDeliveryNote);

// /**
//  * @swagger
//  * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/add-trip:
//  *   post:
//  *     summary: Add trip to attachment off hire note
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment off hire note ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - transportation_company
//  *               - driver_name
//  *               - driver_contact
//  *             properties:
//  *               transportation_company:
//  *                 type: string
//  *                 example: "ABC Transport"
//  *               driver_name:
//  *                 type: string
//  *                 example: "John Doe"
//  *               driver_contact:
//  *                 type: string
//  *                 example: "0712345678"
//  *               vehicle_type:
//  *                 type: string
//  *                 example: "Lorry"
//  *               vehicle_number:
//  *                 type: string
//  *                 example: "ABC-123"
//  *               trip_date:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-01-25"
//  *               remarks:
//  *                 type: string
//  *                 example: "Return trip"
//  *     responses:
//  *       201:
//  *         description: Trip added successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 trip:
//  *                   $ref: '#/components/schemas/TripData'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Off hire note not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/off-hire-note/:attachment_ohn_id/add-trip", verifyToken, addTripToAttachmentOffHireNote);

// /**
//  * @swagger
//  * /api/attachment-swaps/delivery-note/{attachment_swap_id}/latest:
//  *   get:
//  *     summary: Get latest attachment delivery note for swap
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment swap ID
//  *     responses:
//  *       200:
//  *         description: Latest delivery note
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 deliveryNote:
//  *                   $ref: '#/components/schemas/AttachmentDeliveryNote'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: No delivery note found
//  *       500:
//  *         description: Server error
//  */
// router.get("/delivery-note/:attachment_swap_id/latest", verifyToken, async (req, res) => {
//   try {
//     const { attachment_swap_id } = req.params;

//     const AttachmentDeliveryNoteModel = require("../../models/fleet-management/AttachmentDeliveryNoteModel").AttachmentDeliveryNoteModel;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findOne({
//       where: { attachment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: require("../../models/fleet-management/AttachmentDeliveryNoteModel").AttachmentDeliveryNoteTripModel,
//           as: "trips"
//         }
//       ]
//     });

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "No delivery note found" });
//     }

//     res.status(200).json({ deliveryNote });
//   } catch (error) {
//     console.error("Error fetching latest delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// /**
//  * @swagger
//  * /api/attachment-swaps/off-hire-note/{attachment_swap_id}/latest:
//  *   get:
//  *     summary: Get latest attachment off hire note for swap
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment swap ID
//  *     responses:
//  *       200:
//  *         description: Latest off hire note
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 offHireNote:
//  *                   $ref: '#/components/schemas/AttachmentOffHireNote'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: No off hire note found
//  *       500:
//  *         description: Server error
//  */
// router.get("/off-hire-note/:attachment_swap_id/latest", verifyToken, async (req, res) => {
//   try {
//     const { attachment_swap_id } = req.params;

//     const AttachmentOffHireNoteModel = require("../../models/fleet-management/AttachmentOffHireNoteModel").AttachmentOffHireNoteModel;

//     const offHireNote = await AttachmentOffHireNoteModel.findOne({
//       where: { attachment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: require("../../models/fleet-management/AttachmentOffHireNoteModel").AttachmentOffHireNoteTripModel,
//           as: "trips"
//         }
//       ]
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "No off hire note found" });
//     }

//     res.status(200).json({ offHireNote });
//   } catch (error) {
//     console.error("Error fetching latest off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
// /**
//  * @swagger
//  * /api/attachment-swaps/submit/{attachment_swap_id}:
//  *   put:
//  *     summary: Submit attachment swap request with charges
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - mobilization_charge
//  *               - demobilization_charge
//  *             properties:
//  *               mobilization_charge:
//  *                 type: number
//  *                 example: 500.00
//  *               demobilization_charge:
//  *                 type: number
//  *                 example: 500.00
//  *     responses:
//  *       200:
//  *         description: Attachment swap submitted successfully
//  *       400:
//  *         description: Validation error
//  *       404:
//  *         description: Attachment swap not found
//  */
// router.put("/submit/:attachment_swap_id", verifyToken, submitAttachmentSwapRequest);

// /**
//  * @swagger
//  * /api/attachment-swaps/return/{attachment_swap_id}:
//  *   put:
//  *     summary: Return attachment swap request with reason
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - return_reason
//  *             properties:
//  *               return_reason:
//  *                 type: string
//  *                 example: "Additional information needed"
//  *     responses:
//  *       200:
//  *         description: Attachment swap returned successfully
//  *       400:
//  *         description: Validation error
//  *       404:
//  *         description: Attachment swap not found
//  */
// router.put("/return/:attachment_swap_id", verifyToken, returnAttachmentSwapRequest);

// /**
//  * @swagger
//  * /api/attachment-swaps/approve/{attachment_swap_id}:
//  *   put:
//  *     summary: Approve attachment swap request
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Attachment swap approved successfully
//  *       404:
//  *         description: Attachment swap not found
//  */
// router.put("/approve/:attachment_swap_id", verifyToken, approveAttachmentSwap);

// /**
//  * @swagger
//  * /api/attachment-swaps/reject/{attachment_swap_id}:
//  *   put:
//  *     summary: Reject attachment swap request
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               rejection_reason:
//  *                 type: string
//  *                 example: "Does not meet requirements"
//  *     responses:
//  *       200:
//  *         description: Attachment swap rejected successfully
//  *       404:
//  *         description: Attachment swap not found
//  */
// router.put("/reject/:attachment_swap_id", verifyToken, rejectAttachmentSwap);

// /**
//  * @swagger
//  * /api/attachment-swaps/pending-requests:
//  *   get:
//  *     summary: Get all pending attachment swap requests for sales team
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: sales_order_id
//  *         schema:
//  *           type: integer
//  *         description: Filter by sales order ID (optional)
//  *     responses:
//  *       200:
//  *         description: List of pending attachment swap requests
//  */
// router.get("/pending-requests", verifyToken, getPendingAttachmentSwapRequests);

// /**
//  * @swagger
//  * /api/swap-requests/counts:
//  *   get:
//  *     summary: Get counts of pending swap requests for notification badge
//  *     tags: [Equipment Swaps, Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: sales_order_id
//  *         schema:
//  *           type: integer
//  *         description: Filter by sales order ID (optional)
//  *     responses:
//  *       200:
//  *         description: Swap request counts
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 equipmentSwapCount:
//  *                   type: integer
//  *                 attachmentSwapCount:
//  *                   type: integer
//  *                 totalSwapCount:
//  *                   type: integer
//  */
// router.get("/swap-requests/counts", verifyToken, getSwapRequestCounts);

// /**
//  * @swagger
//  * /api/attachment-swaps/sales-order/{sales_order_id}:
//  *   get:
//  *     summary: Get all attachment swaps for sales order
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: sales_order_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Sales order ID
//  *     responses:
//  *       200:
//  *         description: List of attachment swaps
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 totalCount:
//  *                   type: integer
//  *                 attachmentSwaps:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/AttachmentSwap'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/sales-order/:sales_order_id", verifyToken, async (req, res) => {
//   try {
//     const { sales_order_id } = req.params;

//     const AttachmentSwapModel = require("../../models/fleet-management/AttachmentSwapModel");
//     const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
//     const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
//     const { ActiveAllocationModel } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");

//     const attachmentSwaps = await AttachmentSwapModel.findAll({
//       where: { sales_order_id },
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//         {
//           model: AttachmentModel,
//           as: "previousAttachment",
//           attributes: ["attachment_id", "attachment_number", "vehicle_type"],
//         },
//         {
//           model: AttachmentModel,
//           as: "newAttachment",
//           attributes: ["attachment_id", "attachment_number", "vehicle_type"],
//         },
//         {
//           model: ActiveAllocationModel,
//           as: "allocation",
//           attributes: ["allocation_id"],
//         },
//       ],
//       order: [["created_at", "DESC"]],
//     });

//     res.status(200).json({
//       totalCount: attachmentSwaps.length,
//       attachmentSwaps,
//     });
//   } catch (error) {
//     console.error("Error fetching attachment swaps:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Submit attachment swap for approval
// router.post('/submit-for-approval', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const userId = req.user.id;

//     if (!swap_ids_arr || !Array.isArray(swap_ids_arr) || swap_ids_arr.length === 0) {
//       return res.status(400).json({
//         message: "swap_ids_arr array is required",
//       });
//     }

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const attachmentSwap = await AttachmentSwapModel.findByPk(id);

//       if (!attachmentSwap) {
//         return res.status(404).json({ message: `Equipment swap not found: ${id}` });
//       }

//       if (attachmentSwap.swap_status !== "Pending") {
//         return res.status(400).json({
//           message: `Swap ID ${id} is not in Pending status`,
//         });
//       }

//       const history = attachmentSwap.swap_history || [];
//       history.push({
//         status: "Swap Request",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Submitted for approval",
//       });

//       await attachmentSwap.update({
//         swap_status: "Swap Request",
//         swap_submitted_by: userId,
//         swap_submitted_at: new Date(),
//         swap_history: history,
//         overall_status: "Awaiting Sales confirmation",
//       });

//       results.push(attachmentSwap);
//     }

//     res.json({
//       message: "Swap requests submitted for approval successfully",
//       attachmentSwaps: results,
//     });
//   } catch (error) {
//     console.error('Error submitting attachment swap:', error);
//     res.status(500).json({ message: 'Failed to submit swap for approval' });
//   }
// });

// // Approve attachment swap
// router.post('/approve', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const { swap_mobilization_charge, swap_demobilization_charge } = req.body;
//     const userId = req.user.id;

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const attachmentSwap = await AttachmentSwapModel.findByPk(id);

//       if (!attachmentSwap) {
//         return res.status(404).json({
//           message: `Attachment swap not found: ${id}`
//         });
//       }

//       if (!["Swap Request", "Resubmit"].includes(attachmentSwap.swap_status)) {
//         return res.status(400).json({
//           message: "Only swap requests can be approved",
//         });
//       }

//       if (!swap_mobilization_charge || !swap_demobilization_charge) {
//         return res.status(400).json({
//           message: "Both mobilization and demobilization charges are required",
//         });
//       }

//       const history = attachmentSwap.swap_history || [];
//       history.push({
//         status: "Approved",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Approved by sales team",
//         charges: {
//           mobilization: swap_mobilization_charge,
//           demobilization: swap_demobilization_charge,
//         },
//       });

//       await attachmentSwap.update({
//         swap_status: "Approved",
//         swap_mobilization_charge,
//         swap_demobilization_charge,
//         swap_approved_by: userId,
//         swap_approved_at: new Date(),
//         swap_history: history,
//         overall_status: "In progress",
//       });

//       results.push(attachmentSwap);
//     }

//     res.json({
//       message: "Attachment swap approved successfully",
//       attachmentSwaps: results,
//     });
//   } catch (error) {
//     console.error('Error approving attachment swap:', error);
//     res.status(500).json({ message: 'Failed to approve swap' });
//   }
// });

// // Return attachment swap
// router.post('/return', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const { return_reason } = req.body;
//     const userId = req.user.id;

//     if (!swap_ids_arr || !Array.isArray(swap_ids_arr) || swap_ids_arr.length === 0) {
//       return res.status(400).json({
//         message: "swap_ids_arr array is required",
//       });
//     }

//     if (!return_reason || !return_reason.trim()) {
//       return res.status(400).json({ message: 'Return reason is required' });
//     }

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const attachmentSwap = await AttachmentSwapModel.findByPk(id);

//       if (!attachmentSwap) {
//         return res.status(404).json({ message: `Attachment swap not found: ${id}` });
//       }

//       if (!["Swap Request", "Resubmit"].includes(attachmentSwap.swap_status)) {
//         return res.status(400).json({
//           message: "Only swap requests can be returned",
//         });
//       }

//       const history = attachmentSwap.swap_history || [];
//       history.push({
//         status: "Return",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Returned by sales team",
//         reason: return_reason.trim(),
//       });

//       await attachmentSwap.update({
//         swap_status: "Return",
//         swap_return_reason: return_reason.trim(),
//         swap_return_date: new Date(),
//         swap_history: history,
//         overall_status: "Return",
//       });

//       results.push(attachmentSwap);
//     }

//     res.json({
//       message: 'Attachment swap returned to operations team',
//       attachmentSwaps: results
//     });
//   } catch (error) {
//     console.error('Error returning attachment swap:', error);
//     res.status(500).json({ message: 'Failed to return swap' });
//   }
// });

// // Cancel swap to operations (Sales team)
// router.post('/cancel', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const userId = req.user.id;

//     if (!swap_ids_arr || !Array.isArray(swap_ids_arr) || swap_ids_arr.length === 0) {
//       return res.status(400).json({
//         message: "swap_ids_arr array is required",
//       });
//     }

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const attachmentSwap = await AttachmentSwapModel.findByPk(id);

//       if (!attachmentSwap) {
//         return res
//           .status(404)
//           .json({ message: `Attachment swap not found: ${id}` });
//       }

//       // Update swap history
//       const history = attachmentSwap.swap_history || [];
//       history.push({
//         status: "Cancelled",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Cancelled by sales team",
//       });

//       await attachmentSwap.update({
//         swap_status: "Cancelled",
//         swap_history: history,
//         overall_status: "Cancelled",
//       });

//       results.push(attachmentSwap);
//     }

//     res.json({
//       message: "Swap request cancelled to operations team",
//       attachmentSwaps: results,
//     });

//   } catch (error) {
//     console.error('Error returning swap:', error);
//     res.status(500).json({ message: 'Failed to return swap', error: error });
//   }
// });

// // Resubmit attachment swap
// router.post('/resubmit', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const userId = req.user.id;
//     const {
//       swap_estimated_recovery_cost,
//       swap_mobilization_trips,
//       swap_demobilization_trips,
//       swap_remark
//     } = req.body;

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const attachmentSwap = await AttachmentSwapModel.findByPk(id);

//       if (!attachmentSwap) {
//         return res.status(404).json({ message: `Attachment swap not found: ${id}` });
//       }

//       if (attachmentSwap.swap_status !== "Return") {
//         return res.status(400).json({
//           message: "Only returned swaps can be resubmitted",
//         });
//       }

//       const history = attachmentSwap.swap_history || [];
//       history.push({
//         status: "Resubmit",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Resubmitted after corrections",
//       });

//       const updateData = {
//         swap_status: "Resubmit",
//         swap_submitted_by: userId,
//         swap_submitted_at: new Date(),
//         swap_return_reason: null,
//         swap_return_date: null,
//         swap_history: history,
//         overall_status: "Awaiting Sales confirmation",
//       };

//       if (swap_estimated_recovery_cost !== undefined) {
//         updateData.swap_estimated_recovery_cost = swap_estimated_recovery_cost;
//       }
//       if (swap_mobilization_trips !== undefined) {
//         updateData.swap_mobilization_trips = swap_mobilization_trips;
//       }
//       if (swap_demobilization_trips !== undefined) {
//         updateData.swap_demobilization_trips = swap_demobilization_trips;
//       }
//       if (swap_remark !== undefined) {
//         updateData.swap_remark = swap_remark;
//       }

//       await attachmentSwap.update(updateData);

//       results.push(attachmentSwap);
//     }

//     res.json({
//       message: 'Attachment swap resubmitted successfully',
//       attachmentSwaps: results
//     });
//   } catch (error) {
//     console.error('Error resubmitting attachment swap:', error);
//     res.status(500).json({ message: 'Failed to resubmit swap' });
//   }
// });

// /**
//  * @swagger
//  * /api/attachment-swaps/{attachment_swap_id}/swap-request:
//  *   post:
//  *     summary: Submit attachment swap request
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: attachment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - sales_order_id
//  *               - estimated_cost
//  *               - remark
//  *             properties:
//  *               sales_order_id:
//  *                 type: integer
//  *               swap_type:
//  *                 type: string
//  *                 enum: [equipment, attachment, subproduct]
//  *               swap_id:
//  *                 type: integer
//  *               estimated_cost:
//  *                 type: number
//  *               remark:
//  *                 type: string
//  *               mobilization_charge:
//  *                 type: number
//  *               demobilization_charge:
//  *                 type: number
//  *     responses:
//  *       200:
//  *         description: Swap request submitted successfully
//  *       400:
//  *         description: Validation error
//  *       404:
//  *         description: Attachment swap not found
//  */
// router.post("/:attachment_swap_id/swap-request", verifyToken, async (req, res) => {
//   try {
//     const { attachment_swap_id } = req.params;
//     const {
//       sales_order_id,
//       estimated_cost,
//       remark,
//       mobilization_charge,
//       demobilization_charge
//     } = req.body;

//     // Find the attachment swap
//     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id);
//     if (!attachmentSwap) {
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     // Update swap status
//     await attachmentSwap.update({
//       swap_status: "Swap Request",
//       swap_estimated_recovery_cost: estimated_cost,
//       swap_remark: remark,
//       swap_mobilization_charge: mobilization_charge,
//       swap_demobilization_charge: demobilization_charge,
//       swap_request_date: new Date()
//     });

//     // Create swap request record
//     const SwapRequestModel = require("../../models/fleet-management/SwapRequestModel");
//     const swapRequest = await SwapRequestModel.create({
//       sales_order_id,
//       swap_type: "attachment",
//       swap_id: attachment_swap_id,
//       status: "Swap Request",
//       estimated_cost,
//       remark,
//       mobilization_charge,
//       demobilization_charge,
//       created_at: new Date()
//     });

//     res.status(200).json({
//       message: "Attachment swap request submitted successfully",
//       swapRequest,
//       attachmentSwap
//     });
//   } catch (error) {
//     console.error("Error submitting attachment swap request:", error);
//     res.status(500).json({ message: "Failed to submit swap request" });
//   }
// });

// module.exports = router;

// routes/fleet-management/attachment-swap-routes.js
const express = require("express");
const {
  getAllAttachmentNumbers,
  getAttachmentSwapReasons,
  createAttachmentSwap,
  getAttachmentSwapsBySalesOrder,
  getAttachmentSwapById,

  // Delivery Note Functions
  createAttachmentDeliveryNote,
  getAttachmentDeliveryNoteById,
  getLatestAttachmentDeliveryNote,
  getAttachmentDeliveryNoteSummary,
  submitAttachmentDNForApproval,
  approveAttachmentDeliveryNote,
  rejectAttachmentDeliveryNote,
  generateAttachmentDeliveryNotePDF,
  generateAttachmentDNPDF,
  closeAttachmentDeliveryNote,
  uploadAttachmentDeliveryNote,
  addTripToAttachmentDeliveryNote,
  updateTripInAttachmentDN,
  deleteTripFromAttachmentDN,
  uploadAttachmentDNChecklist,
  downloadAttachmentDNChecklist,

  // Off Hire Note Functions (Enhanced)
  createAttachmentOffHireNote,
  getAttachmentOffHireNoteById,
  getLatestAttachmentOffHireNote,
  getAttachmentOffHireNoteSummary,
  submitAttachmentOHNForApproval,
  approveAttachmentOffHireNote,
  rejectAttachmentOffHireNote,
  generateAttachmentOffHireNotePDF,
  generateAttachmentOHNPDF,
  closeAttachmentOffHireNote,
  uploadAttachmentOffHireNote,
  addTripToAttachmentOffHireNote,
  updateTripInAttachmentOHN,
  deleteTripFromAttachmentOHN,
  uploadAttachmentOHNChecklist,
  downloadAttachmentOHNChecklist,

  // Swap Request Management
  submitAttachmentSwapRequest,
  returnAttachmentSwapRequest,
  approveAttachmentSwap,
  rejectAttachmentSwap,
  getPendingAttachmentSwapRequests,
  getSwapRequestCounts,

  // DN Trip Status
  submitAttachmentDNTripForApproval,
  approveAttachmentDNTrip,
  rejectAttachmentDNTrip,
  generateAttachmentDNTripPDF,
  completeAttachmentDNTrip,
  closeAttachmentDNTrip,
  generateAttachmentDeliveryNotePDFForTrip,
  uploadAttachmentDeliveryNoteToTrip,

  // OHN Trip Status
  submitAttachmentOHNTripForApproval,
  approveAttachmentOHNTrip,
  rejectAttachmentOHNTrip,
  generateAttachmentOHNTripPDF,
  completeAttachmentOHNTrip,
  closeAttachmentOHNTrip,
  generateAttachmentOffHireNotePDFForTrip,
  uploadAttachmentOffHireNoteToTrip,
} = require("../../controllers/fleet-management/attachmentSwapController");
const { verifyToken } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");
const AttachmentSwapModel = require("../../models/fleet-management/AttachmentSwapModel");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const UsersModel = require("../../models/user-security-management/UsersModel");

const router = express.Router();

// ==================== MULTER CONFIGURATIONS ====================

// Storage for delivery note uploads
const dnStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/attachment-delivery-notes/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `adn-${uniqueSuffix}-${file.originalname}`);
  },
});

const dnUpload = multer({
  storage: dnStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only PDF and image files are allowed"));
  },
});

// Storage for off hire note uploads
const ohnStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/attachment-off-hire-notes/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `aohn-${uniqueSuffix}-${file.originalname}`);
  },
});

const ohnUpload = multer({
  storage: ohnStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only PDF and image files are allowed"));
  },
});

// Storage for checklist uploads (DN)
const checklistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/attachment-dn-checklists/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { trip_id, resource_id } = req.params;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(
      null,
      `checklist-dn-trip${trip_id}-res${resource_id}-${uniqueSuffix}-${safe}`,
    );
  },
});

const checklistUpload = multer({
  storage: checklistStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime =
      allowed.test(file.mimetype) ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.ms-excel";

    if (ext && mime) return cb(null, true);
    cb(new Error("Only PDF, images, Word, and Excel files are allowed"));
  },
});

// Storage for OHN checklist uploads
const ohnChecklistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/attachment-ohn-checklists/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { trip_id, resource_id } = req.params;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(
      null,
      `checklist-ohn-trip${trip_id}-res${resource_id}-${uniqueSuffix}-${safe}`,
    );
  },
});

const ohnChecklistUpload = multer({
  storage: ohnChecklistStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime =
      allowed.test(file.mimetype) ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.ms-excel";

    if (ext && mime) return cb(null, true);
    cb(new Error("Only PDF, images, Word, and Excel files are allowed"));
  },
});

/**
 * @swagger
 * components:
 *   schemas:
 *     AttachmentSwap:
 *       type: object
 *       required:
 *         - sales_order_id
 *         - previous_attachment_no
 *         - new_attachment_no
 *         - swap_date
 *         - swap_reason
 *       properties:
 *         attachment_swap_id:
 *           type: integer
 *           description: Auto-generated ID
 *         sales_order_id:
 *           type: integer
 *           description: Sales order ID
 *         allocation_id:
 *           type: integer
 *           description: Allocation ID
 *         previous_attachment_id:
 *           type: integer
 *           description: Previous attachment ID
 *         previous_attachment_no:
 *           type: string
 *           description: Previous attachment number
 *         new_attachment_id:
 *           type: integer
 *           description: New attachment ID
 *         new_attachment_no:
 *           type: string
 *           description: New attachment number
 *         swap_date:
 *           type: string
 *           format: date
 *           description: Swap date
 *         swap_reason:
 *           type: string
 *           description: Reason for swap
 *         delivery_note_status:
 *           type: string
 *           enum: [Pending, In Progress, Completed, Cancelled]
 *           default: Pending
 *         off_hire_note_status:
 *           type: string
 *           enum: [Pending, In Progress, Completed, Cancelled]
 *           default: Pending
 *         overall_status:
 *           type: string
 *           enum: [Created, In Progress, Completed, Cancelled]
 *           default: Created
 *         created_by:
 *           type: string
 *           description: Created by user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Update timestamp
 *
 *     AttachmentDeliveryNote:
 *       type: object
 *       required:
 *         - attachment_swap_id
 *         - delivery_date
 *       properties:
 *         attachment_dn_id:
 *           type: integer
 *           description: Auto-generated ID
 *         attachment_swap_id:
 *           type: integer
 *           description: Attachment swap ID
 *         dn_number:
 *           type: string
 *           description: Delivery note number
 *         new_attachment_id:
 *           type: integer
 *           description: New attachment ID
 *         new_attachment_no:
 *           type: string
 *           description: New attachment number
 *         delivery_date:
 *           type: string
 *           format: date
 *           description: Delivery date
 *         status:
 *           type: string
 *           enum: [Creation, Under Approval, Approved, In Progress, Completed, Rejected, Close]
 *           default: Creation
 *         delivery_attachment:
 *           type: string
 *           description: Delivery attachment file path
 *         uploaded_by:
 *           type: string
 *         uploaded_at:
 *           type: string
 *           format: date-time
 *         approved_by:
 *           type: string
 *         approved_at:
 *           type: string
 *           format: date-time
 *         remarks:
 *           type: string
 *           description: Remarks
 *         created_by:
 *           type: string
 *           description: Created by user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Update timestamp
 *
 *     AttachmentOffHireNote:
 *       type: object
 *       required:
 *         - attachment_swap_id
 *         - off_hire_date
 *       properties:
 *         attachment_ohn_id:
 *           type: integer
 *           description: Auto-generated ID
 *         attachment_swap_id:
 *           type: integer
 *           description: Attachment swap ID
 *         ohn_number:
 *           type: string
 *           description: Off hire note number
 *         previous_attachment_id:
 *           type: integer
 *           description: Previous attachment ID
 *         previous_attachment_no:
 *           type: string
 *           description: Previous attachment number
 *         off_hire_date:
 *           type: string
 *           format: date
 *           description: Off hire date
 *         status:
 *           type: string
 *           enum: [Creation, Under Approval, Approved, In Progress, Completed, Rejected, Close]
 *           default: Creation
 *         off_hire_attachment:
 *           type: string
 *           description: Off hire attachment file path
 *         uploaded_by:
 *           type: string
 *         uploaded_at:
 *           type: string
 *           format: date-time
 *         approved_by:
 *           type: string
 *         approved_at:
 *           type: string
 *           format: date-time
 *         remarks:
 *           type: string
 *           description: Remarks
 *         created_by:
 *           type: string
 *           description: Created by user
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Update timestamp
 *
 *     TripData:
 *       type: object
 *       properties:
 *         trip_number:
 *           type: integer
 *           description: Trip number (1-7)
 *         transportation_company:
 *           type: string
 *           description: Transportation company name
 *         driver_name:
 *           type: string
 *           description: Driver name
 *         driver_contact:
 *           type: string
 *           description: Driver contact number
 *         vehicle_type:
 *           type: string
 *           description: Vehicle type
 *         vehicle_number:
 *           type: string
 *           description: Vehicle number
 *         recovery_vehicle_number:
 *           type: string
 *           description: Recovery vehicle number
 *         chargeable_type:
 *           type: string
 *           enum: [Mobilization, Non-Chargeable]
 *         trip_date:
 *           type: string
 *           format: date
 *           description: Trip date
 *         attachment:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               attachment_id:
 *                 type: integer
 *               attachment_number:
 *                 type: string
 *               attachment_type:
 *                 type: string
 *         remarks:
 *           type: string
 *           description: Trip remarks
 *
 *     AttachmentNumber:
 *       type: object
 *       properties:
 *         attachment_id:
 *           type: integer
 *           description: Attachment ID
 *         attachment_number:
 *           type: string
 *           description: Attachment number
 *         product_name:
 *           type: string
 *           description: Product name
 *
 *     AttachmentDeliveryNoteSummary:
 *       type: object
 *       properties:
 *         dn_number:
 *           type: string
 *           description: Delivery note number
 *         attachment:
 *           type: object
 *           properties:
 *             attachment_id:
 *               type: integer
 *             attachment_number:
 *               type: string
 *             product_name:
 *               type: string
 *             serial_number:
 *               type: string
 *         delivery_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         trips:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               trip_number:
 *                 type: integer
 *               transportation:
 *                 type: object
 *                 properties:
 *                   company:
 *                     type: string
 *                   driver:
 *                     type: string
 *                   contact:
 *                     type: string
 *                   vehicle:
 *                     type: string
 *               trip_date:
 *                 type: string
 *                 format: date
 *               trip_status:
 *                 type: string
 *               remarks:
 *                 type: string
 *
 */

/**
 * @swagger
 * tags:
 *   name: Attachment Swaps
 *   description: Attachment swap management endpoints
 */

// ==================== PUBLIC ROUTES ====================

/**
 * @swagger
 * /api/attachment-swaps/attachment-numbers:
 *   get:
 *     summary: Get all attachment numbers for dropdown
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of attachment numbers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 attachments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AttachmentNumber'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/attachment-numbers", verifyToken, getAllAttachmentNumbers);

/**
 * @swagger
 * /api/attachment-swaps/swap-reasons:
 *   get:
 *     summary: Get all attachment swap reasons
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of swap reasons
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/swap-reasons", verifyToken, getAttachmentSwapReasons);

// ==================== SWAP CREATION & RETRIEVAL ====================

/**
 * @swagger
 * /api/attachment-swaps/create:
 *   post:
 *     summary: Create an attachment swap
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - previous_attachment_no
 *               - new_attachment_no
 *               - swap_date
 *               - swap_reason
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 example: 1
 *               allocation_id:
 *                 type: integer
 *                 example: 1
 *               previous_attachment_no:
 *                 type: string
 *                 example: "ATT-001"
 *               new_attachment_no:
 *                 type: string
 *                 example: "ATT-002"
 *               swap_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               swap_reason:
 *                 type: string
 *                 example: "Attachment breakdown"
 *               swap_estimated_recovery_cost:
 *                 type: number
 *                 example: 500.00
 *               swap_mobilization_trips:
 *                 type: integer
 *                 example: 1
 *               swap_demobilization_trips:
 *                 type: integer
 *                 example: 1
 *               swap_remark:
 *                 type: string
 *                 example: "Urgent swap needed"
 *     responses:
 *       201:
 *         description: Attachment swap created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 attachmentSwaps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AttachmentSwap'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sales order or attachment not found
 *       500:
 *         description: Server error
 */
router.post("/create", verifyToken, createAttachmentSwap);

/**
 * @swagger
 * /api/attachment-swaps/{id}:
 *   get:
 *     summary: Get attachment swap by ID with details
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment swap ID
 *     responses:
 *       200:
 *         description: Attachment swap details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 attachmentSwap:
 *                   $ref: '#/components/schemas/AttachmentSwap'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attachment swap not found
 *       500:
 *         description: Server error
 */
router.get("/:id", verifyToken, getAttachmentSwapById);

// ==================== DELIVERY NOTE ROUTES ====================

/**
 * @swagger
 * /api/attachment-swaps/{attachment_swap_id}/delivery-note:
 *   post:
 *     summary: Create attachment delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment swap ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - delivery_date
 *             properties:
 *               delivery_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-20"
 *               remarks:
 *                 type: string
 *                 example: "Delivery to site"
 *               trips:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TripData'
 *     responses:
 *       201:
 *         description: Delivery note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deliveryNote:
 *                   $ref: '#/components/schemas/AttachmentDeliveryNote'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attachment swap not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:attachment_swap_id/delivery-note",
  verifyToken,
  createAttachmentDeliveryNote,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}:
 *   get:
 *     summary: Get attachment delivery note by ID
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     responses:
 *       200:
 *         description: Delivery note details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deliveryNote:
 *                   $ref: '#/components/schemas/AttachmentDeliveryNote'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/delivery-note/:attachment_dn_id",
  verifyToken,
  getAttachmentDeliveryNoteById,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/summary:
 *   get:
 *     summary: Get attachment delivery note summary
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     responses:
 *       200:
 *         description: Delivery note summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 summary:
 *                   $ref: '#/components/schemas/AttachmentDeliveryNoteSummary'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/delivery-note/:attachment_dn_id/summary",
  verifyToken,
  getAttachmentDeliveryNoteSummary,
);

/**
 * @swagger
 * /api/attachment-swaps/swap/{attachment_swap_id}/latest-delivery-note:
 *   get:
 *     summary: Get latest attachment delivery note for a swap
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment swap ID
 *     responses:
 *       200:
 *         description: Latest delivery note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deliveryNote:
 *                   $ref: '#/components/schemas/AttachmentDeliveryNote'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No delivery note found
 *       500:
 *         description: Server error
 */
router.get(
  "/swap/:attachment_swap_id/latest-delivery-note",
  verifyToken,
  getLatestAttachmentDeliveryNote,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/submit-approval:
 *   put:
 *     summary: Submit delivery note for approval
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     responses:
 *       200:
 *         description: Submitted for approval successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/delivery-note/:attachment_dn_id/submit-approval",
  verifyToken,
  submitAttachmentDNForApproval,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/approve:
 *   put:
 *     summary: Approve delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     responses:
 *       200:
 *         description: Delivery note approved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/delivery-note/:attachment_dn_id/approve",
  verifyToken,
  approveAttachmentDeliveryNote,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/reject:
 *   put:
 *     summary: Reject delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Incomplete information"
 *     responses:
 *       200:
 *         description: Delivery note rejected successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/delivery-note/:attachment_dn_id/reject",
  verifyToken,
  rejectAttachmentDeliveryNote,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/generate-pdf:
 *   get:
 *     summary: Generate delivery note PDF data (for frontend)
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     responses:
 *       200:
 *         description: PDF data generated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/delivery-note/:attachment_dn_id/generate-pdf",
  verifyToken,
  generateAttachmentDNPDF,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/generate-pdf-legacy:
 *   get:
 *     summary: Generate delivery note PDF (legacy - full PDF)
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/delivery-note/:attachment_dn_id/generate-pdf-legacy",
  verifyToken,
  generateAttachmentDeliveryNotePDF,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/close:
 *   put:
 *     summary: Close delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     responses:
 *       200:
 *         description: Delivery note closed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/delivery-note/:attachment_dn_id/close",
  verifyToken,
  closeAttachmentDeliveryNote,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/upload:
 *   post:
 *     summary: Upload signed attachment delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               delivery_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Signed delivery note file (PDF/Image)
 *     responses:
 *       200:
 *         description: Delivery note uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.post(
  "/delivery-note/:attachment_dn_id/upload",
  verifyToken,
  dnUpload.single("delivery_attachment"),
  uploadAttachmentDeliveryNote,
);

/**
 * @swagger
 * /api/attachment-swaps/delivery-note/{attachment_dn_id}/add-trip:
 *   post:
 *     summary: Add trip to attachment delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment delivery note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripData'
 *     responses:
 *       201:
 *         description: Trip added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.post(
  "/delivery-note/:attachment_dn_id/add-trip",
  verifyToken,
  addTripToAttachmentDeliveryNote,
);

// ==================== OFF HIRE NOTE ROUTES (Enhanced) ====================

/**
 * @swagger
 * /api/attachment-swaps/{attachment_swap_id}/off-hire-note:
 *   post:
 *     summary: Create attachment off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment swap ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - off_hire_date
 *             properties:
 *               off_hire_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-25"
 *               remarks:
 *                 type: string
 *                 example: "Off hire due to swap"
 *               trips:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TripData'
 *     responses:
 *       201:
 *         description: Off hire note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 offHireNote:
 *                   $ref: '#/components/schemas/AttachmentOffHireNote'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Attachment swap not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:attachment_swap_id/off-hire-note",
  verifyToken,
  createAttachmentOffHireNote,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}:
 *   get:
 *     summary: Get attachment off hire note by ID
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     responses:
 *       200:
 *         description: Off hire note details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offHireNote:
 *                   $ref: '#/components/schemas/AttachmentOffHireNote'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/off-hire-note/:attachment_ohn_id",
  verifyToken,
  getAttachmentOffHireNoteById,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/summary:
 *   get:
 *     summary: Get attachment off hire note summary
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     responses:
 *       200:
 *         description: Off hire note summary
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 summary:
 *                   $ref: '#/components/schemas/AttachmentDeliveryNoteSummary'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/off-hire-note/:attachment_ohn_id/summary",
  verifyToken,
  getAttachmentOffHireNoteSummary,
);

/**
 * @swagger
 * /api/attachment-swaps/swap/{attachment_swap_id}/latest-off-hire-note:
 *   get:
 *     summary: Get latest attachment off hire note for a swap
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment swap ID
 *     responses:
 *       200:
 *         description: Latest off hire note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 offHireNote:
 *                   $ref: '#/components/schemas/AttachmentOffHireNote'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No off hire note found
 *       500:
 *         description: Server error
 */
router.get(
  "/swap/:attachment_swap_id/latest-off-hire-note",
  verifyToken,
  getLatestAttachmentOffHireNote,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/submit-approval:
 *   put:
 *     summary: Submit off hire note for approval
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     responses:
 *       200:
 *         description: Submitted for approval successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/off-hire-note/:attachment_ohn_id/submit-approval",
  verifyToken,
  submitAttachmentOHNForApproval,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/approve:
 *   put:
 *     summary: Approve off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     responses:
 *       200:
 *         description: Off hire note approved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/off-hire-note/:attachment_ohn_id/approve",
  verifyToken,
  approveAttachmentOffHireNote,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/reject:
 *   put:
 *     summary: Reject off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Incomplete information"
 *     responses:
 *       200:
 *         description: Off hire note rejected successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/off-hire-note/:attachment_ohn_id/reject",
  verifyToken,
  rejectAttachmentOffHireNote,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/generate-pdf:
 *   get:
 *     summary: Generate off hire note PDF data (for frontend)
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     responses:
 *       200:
 *         description: PDF data generated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/off-hire-note/:attachment_ohn_id/generate-pdf",
  verifyToken,
  generateAttachmentOHNPDF,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/generate-pdf-legacy:
 *   get:
 *     summary: Generate off hire note PDF (legacy - full PDF)
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     responses:
 *       200:
 *         description: PDF file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/off-hire-note/:attachment_ohn_id/generate-pdf-legacy",
  verifyToken,
  generateAttachmentOffHireNotePDF,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/close:
 *   put:
 *     summary: Close off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     responses:
 *       200:
 *         description: Off hire note closed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.put(
  "/off-hire-note/:attachment_ohn_id/close",
  verifyToken,
  closeAttachmentOffHireNote,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/upload:
 *   post:
 *     summary: Upload signed attachment off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               off_hire_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Signed off hire note file (PDF/Image)
 *     responses:
 *       200:
 *         description: Off hire note uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 fileName:
 *                   type: string
 *                 status:
 *                   type: string
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.post(
  "/off-hire-note/:attachment_ohn_id/upload",
  verifyToken,
  ohnUpload.single("off_hire_attachment"),
  uploadAttachmentOffHireNote,
);

/**
 * @swagger
 * /api/attachment-swaps/off-hire-note/{attachment_ohn_id}/add-trip:
 *   post:
 *     summary: Add trip to attachment off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Attachment off hire note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripData'
 *     responses:
 *       201:
 *         description: Trip added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.post(
  "/off-hire-note/:attachment_ohn_id/add-trip",
  verifyToken,
  addTripToAttachmentOffHireNote,
);

// ==================== TRIP MANAGEMENT ROUTES (DN) ====================

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}:
 *   put:
 *     summary: Update a trip in attachment delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripData'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.put(
  "/trips/delivery-note/:trip_id",
  verifyToken,
  updateTripInAttachmentDN,
);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}:
 *   delete:
 *     summary: Delete a trip from attachment delivery note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/trips/delivery-note/:trip_id",
  verifyToken,
  deleteTripFromAttachmentDN,
);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/attachment/{resource_id}/checklist/upload:
 *   post:
 *     summary: Upload checklist for attachment resource in DN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: resource_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               checklist:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Checklist uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
router.post(
  "/trips/delivery-note/:trip_id/attachment/:resource_id/checklist/upload",
  verifyToken,
  checklistUpload.single("checklist"),
  uploadAttachmentDNChecklist,
);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/attachment/{resource_id}/checklist/download:
 *   get:
 *     summary: Download checklist for attachment resource in DN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: resource_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Checklist file
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Checklist not found
 *       500:
 *         description: Server error
 */
router.get(
  "/trips/delivery-note/:trip_id/attachment/:resource_id/checklist/download",
  verifyToken,
  downloadAttachmentDNChecklist,
);

// ==================== TRIP MANAGEMENT ROUTES (OHN) ====================

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}:
 *   put:
 *     summary: Update a trip in attachment off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripData'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.put(
  "/trips/off-hire-note/:trip_id",
  verifyToken,
  updateTripInAttachmentOHN,
);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}:
 *   delete:
 *     summary: Delete a trip from attachment off hire note
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Trip ID
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/trips/off-hire-note/:trip_id",
  verifyToken,
  deleteTripFromAttachmentOHN,
);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/attachment/{resource_id}/checklist/upload:
 *   post:
 *     summary: Upload checklist for attachment resource in OHN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: resource_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               checklist:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Checklist uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Server error
 */
router.post(
  "/trips/off-hire-note/:trip_id/attachment/:resource_id/checklist/upload",
  verifyToken,
  ohnChecklistUpload.single("checklist"),
  uploadAttachmentOHNChecklist,
);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/attachment/{resource_id}/checklist/download:
 *   get:
 *     summary: Download checklist for attachment resource in OHN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: resource_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Checklist file
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Checklist not found
 *       500:
 *         description: Server error
 */
router.get(
  "/trips/off-hire-note/:trip_id/attachment/:resource_id/checklist/download",
  verifyToken,
  downloadAttachmentOHNChecklist,
);

// ==================== SWAP REQUEST MANAGEMENT ====================

/**
 * @swagger
 * /api/attachment-swaps/submit/{attachment_swap_id}:
 *   put:
 *     summary: Submit attachment swap request with charges
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobilization_charge
 *               - demobilization_charge
 *             properties:
 *               mobilization_charge:
 *                 type: number
 *                 example: 500.00
 *               demobilization_charge:
 *                 type: number
 *                 example: 500.00
 *     responses:
 *       200:
 *         description: Attachment swap submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Attachment swap not found
 */
router.put(
  "/submit/:attachment_swap_id",
  verifyToken,
  submitAttachmentSwapRequest,
);

/**
 * @swagger
 * /api/attachment-swaps/return/{attachment_swap_id}:
 *   put:
 *     summary: Return attachment swap request with reason
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - return_reason
 *             properties:
 *               return_reason:
 *                 type: string
 *                 example: "Additional information needed"
 *     responses:
 *       200:
 *         description: Attachment swap returned successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Attachment swap not found
 */
router.put(
  "/return/:attachment_swap_id",
  verifyToken,
  returnAttachmentSwapRequest,
);

/**
 * @swagger
 * /api/attachment-swaps/approve/{attachment_swap_id}:
 *   put:
 *     summary: Approve attachment swap request
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Attachment swap approved successfully
 *       404:
 *         description: Attachment swap not found
 */
router.put("/approve/:attachment_swap_id", verifyToken, approveAttachmentSwap);

// /**
//  * @swagger
//  * /api/attachment-swaps/approve:
//  *   post:
//  *     summary: Approve one or more attachment swap requests
//  *     tags: [Attachment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - swap_ids_arr
//  *               - swap_mobilization_charge
//  *               - swap_demobilization_charge
//  *             properties:
//  *               swap_ids_arr:
//  *                 type: array
//  *                 items:
//  *                   type: integer
//  *                 example: [1, 2, 3]
//  *               swap_mobilization_charge:
//  *                 type: number
//  *                 example: 150.00
//  *               swap_demobilization_charge:
//  *                 type: number
//  *                 example: 100.00
//  *     responses:
//  *       200:
//  *         description: Attachment swaps approved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 attachmentSwaps:
//  *                   type: array
//  *                 updatedCount:
//  *                   type: integer
//  *       400:
//  *         description: Bad request - missing required fields
//  *       404:
//  *         description: No attachment swaps found for provided IDs
//  *       500:
//  *         description: Internal server error
//  */
// router.post("/approve", verifyToken, approveAttachmentSwap);

/**
 * @swagger
 * /api/attachment-swaps/reject/{attachment_swap_id}:
 *   put:
 *     summary: Reject attachment swap request
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachment_swap_id
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
 *                 example: "Does not meet requirements"
 *     responses:
 *       200:
 *         description: Attachment swap rejected successfully
 *       404:
 *         description: Attachment swap not found
 */
router.put("/reject/:attachment_swap_id", verifyToken, rejectAttachmentSwap);

/**
 * @swagger
 * /api/attachment-swaps/swap-requests/counts:
 *   get:
 *     summary: Get counts of pending swap requests for notification badge
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sales_order_id
 *         schema:
 *           type: integer
 *         description: Filter by sales order ID (optional)
 *     responses:
 *       200:
 *         description: Swap request counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 attachmentSwapCount:
 *                   type: integer
 *                 totalSwapCount:
 *                   type: integer
 */
router.get("/swap-requests/counts", verifyToken, getSwapRequestCounts);

// ==================== PENDING REQUESTS ====================

/**
 * @swagger
 * /api/attachment-swaps/pending-requests:
 *   get:
 *     summary: Get all pending attachment swap requests
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sales_order_id
 *         schema:
 *           type: integer
 *         description: Filter by sales order ID (optional)
 *     responses:
 *       200:
 *         description: List of pending attachment swap requests
 */
router.get("/pending-requests", verifyToken, getPendingAttachmentSwapRequests);

// ==================== LEGACY ROUTES (for backward compatibility) ====================

// Keep the old route format for compatibility
router.get(
  "/delivery-note/:attachment_swap_id/latest",
  verifyToken,
  getLatestAttachmentDeliveryNote,
);
router.get(
  "/off-hire-note/:attachment_swap_id/latest",
  verifyToken,
  getLatestAttachmentOffHireNote,
);

// Sales order specific
/**
 * @swagger
 * /api/attachment-swaps/sales-order/{sales_order_id}:
 *   get:
 *     summary: Get all attachment swaps for sales order
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales order ID
 *     responses:
 *       200:
 *         description: List of attachment swaps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                 attachmentSwaps:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AttachmentSwap'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/sales-order/:sales_order_id",
  verifyToken,
  getAttachmentSwapsBySalesOrder,
);

// ─── DN Trip Status Routes ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/submit-approval:
 *   put:
 *     summary: Submit a DN trip for approval
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip submitted for approval
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/submit-approval", verifyToken, submitAttachmentDNTripForApproval);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/approve:
 *   put:
 *     summary: Approve a DN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip approved
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/approve", verifyToken, approveAttachmentDNTrip);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/reject:
 *   put:
 *     summary: Reject a DN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trip rejected
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/reject", verifyToken, rejectAttachmentDNTrip);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/generate-pdf:
 *   get:
 *     summary: Generate PDF data for a DN trip (Approved → In Progress)
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip PDF data returned
 *       404:
 *         description: Trip not found
 */
router.get("/trips/delivery-note/:trip_id/generate-pdf", verifyToken, generateAttachmentDNTripPDF);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/complete:
 *   put:
 *     summary: Complete a DN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip completed
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/complete", verifyToken, completeAttachmentDNTrip);

/**
 * @swagger
 * /api/attachment-swaps/trips/delivery-note/{trip_id}/close:
 *   put:
 *     summary: Close a DN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip closed
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/close", verifyToken, closeAttachmentDNTrip);

// ─── OHN Trip Status Routes ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/submit-approval:
 *   put:
 *     summary: Submit an OHN trip for approval
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip submitted for approval
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/submit-approval", verifyToken, submitAttachmentOHNTripForApproval);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/approve:
 *   put:
 *     summary: Approve an OHN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip approved
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/approve", verifyToken, approveAttachmentOHNTrip);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/reject:
 *   put:
 *     summary: Reject an OHN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Trip rejected
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/reject", verifyToken, rejectAttachmentOHNTrip);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/generate-pdf:
 *   get:
 *     summary: Generate PDF data for an OHN trip (Approved → In Progress)
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip PDF data returned
 *       404:
 *         description: Trip not found
 */
router.get("/trips/off-hire-note/:trip_id/generate-pdf", verifyToken, generateAttachmentOHNTripPDF);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/complete:
 *   put:
 *     summary: Complete an OHN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip completed
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/complete", verifyToken, completeAttachmentOHNTrip);

/**
 * @swagger
 * /api/attachment-swaps/trips/off-hire-note/{trip_id}/close:
 *   put:
 *     summary: Close an OHN trip
 *     tags: [Attachment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip closed
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/close", verifyToken, closeAttachmentOHNTrip);

// ==================== TRIP DOCUMENT UPLOAD ROUTES ====================

router.post(
  "/trips/delivery-note/:trip_id/upload-delivery-note",
  verifyToken,
  dnUpload.single("delivery_attachment"),
  uploadAttachmentDeliveryNoteToTrip
);

router.post(
  "/trips/off-hire-note/:trip_id/upload-off-hire-note",
  verifyToken,
  ohnUpload.single("off_hire_attachment"),
  uploadAttachmentOffHireNoteToTrip
);

router.get(
  "/trips/delivery-note/:trip_id/generate-delivery-note-pdf",
  verifyToken,
  generateAttachmentDeliveryNotePDFForTrip
);

router.get(
  "/trips/off-hire-note/:trip_id/generate-off-hire-note-pdf",
  verifyToken,
  generateAttachmentOffHireNotePDFForTrip
);

// ==================== SWAP REQUEST MANAGEMENT (Batch operations) ====================

// Submit for approval (Operations team)
router.post("/submit-for-approval", verifyToken, async (req, res) => {
  try {
    const { swap_ids_arr } = req.body;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        uid = user.uid;
      }
    }

    if (
      !swap_ids_arr ||
      !Array.isArray(swap_ids_arr) ||
      swap_ids_arr.length === 0
    ) {
      return res.status(400).json({
        message: "swap_ids_arr array is required",
      });
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const attachmentSwap = await AttachmentSwapModel.findByPk(id);

      if (!attachmentSwap) {
        return res
          .status(404)
          .json({ message: `Attachment swap not found: ${id}` });
      }

      if (attachmentSwap.swap_status !== "Pending") {
        return res.status(400).json({
          message: `Swap ID ${id} is not in Pending status`,
        });
      }

      const history = attachmentSwap.swap_history || [];
      history.push({
        status: "Swap Request",
        date: new Date(),
        by_user_id: uid,
        action: "Submitted for approval",
      });

      await attachmentSwap.update({
        swap_status: "Swap Request",
        swap_submitted_by: uid,
        swap_submitted_at: new Date(),
        swap_history: history,
        overall_status: "Awaiting Sales confirmation",
      });

      results.push(attachmentSwap);
    }

    res.json({
      message: "Swap requests submitted for approval successfully",
      attachmentSwaps: results,
    });
  } catch (error) {
    console.error("Error submitting swap for approval:", error);
    res.status(500).json({ message: "Failed to submit swap for approval" });
  }
});

// Approve swap (Sales team)
router.post("/approve", verifyToken, async (req, res) => {
  try {
    const { swap_ids_arr } = req.body;
    const { swap_mobilization_charge, swap_demobilization_charge } = req.body;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        uid = user.uid;
      }
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const attachmentSwap = await AttachmentSwapModel.findByPk(id);

      if (!attachmentSwap) {
        return res
          .status(404)
          .json({ message: `Attachment swap not found: ${id}` });
      }

      if (!["Swap Request", "Resubmit"].includes(attachmentSwap.swap_status)) {
        return res.status(400).json({
          message: "Only swap requests can be approved",
        });
      }

      if (!swap_mobilization_charge || !swap_demobilization_charge) {
        return res.status(400).json({
          message: "Both mobilization and demobilization charges are required",
        });
      }

      // Update swap history
      const history = attachmentSwap.swap_history || [];
      history.push({
        status: "Approved",
        date: new Date(),
        by_user_id: uid,
        action: "Approved by sales team",
        charges: {
          mobilization: swap_mobilization_charge,
          demobilization: swap_demobilization_charge,
        },
      });

      await attachmentSwap.update({
        swap_status: "Approved",
        swap_mobilization_charge,
        swap_demobilization_charge,
        swap_approved_by: uid,
        swap_approved_at: new Date(),
        swap_history: history,
        overall_status: "In progress",
      });

      results.push(attachmentSwap);
    }

    res.json({
      message: "Swap requests approved successfully",
      attachmentSwaps: results,
    });
  } catch (error) {
    console.error("Error approving swap:", error);
    res.status(500).json({ message: "Failed to approve swap" });
  }
});

// Return swap to operations (Sales team)
router.post("/return", verifyToken, async (req, res) => {
  try {
    const { swap_ids_arr } = req.body;
    const { return_reason } = req.body;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        uid = user.uid;
      }
    }

    if (
      !swap_ids_arr ||
      !Array.isArray(swap_ids_arr) ||
      swap_ids_arr.length === 0
    ) {
      return res.status(400).json({
        message: "swap_ids_arr array is required",
      });
    }

    if (!return_reason || !return_reason.trim()) {
      return res.status(400).json({ message: "Return reason is required" });
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const attachmentSwap = await AttachmentSwapModel.findByPk(id);

      if (!attachmentSwap) {
        return res
          .status(404)
          .json({ message: `Attachment swap not found: ${id}` });
      }

      if (!["Swap Request", "Resubmit"].includes(attachmentSwap.swap_status)) {
        return res.status(400).json({
          message: "Only swap requests can be returned",
        });
      }

      // Update swap history
      const history = attachmentSwap.swap_history || [];
      history.push({
        status: "Return",
        date: new Date(),
        by_user_id: uid,
        action: "Returned by sales team",
        reason: return_reason.trim(),
      });

      await attachmentSwap.update({
        swap_status: "Return",
        swap_return_reason: return_reason.trim(),
        swap_return_date: new Date(),
        swap_history: history,
        overall_status: "Return",
      });

      results.push(attachmentSwap);
    }

    res.json({
      message: "Swap requests returned successfully",
      attachmentSwaps: results,
    });
  } catch (error) {
    console.error("Error returning swap:", error);
    res.status(500).json({ message: "Failed to return swap" });
  }
});

// Cancel swap
router.post("/cancel", verifyToken, async (req, res) => {
  try {
    const { swap_ids_arr } = req.body;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        uid = user.uid;
      }
    }

    if (
      !swap_ids_arr ||
      !Array.isArray(swap_ids_arr) ||
      swap_ids_arr.length === 0
    ) {
      return res.status(400).json({
        message: "swap_ids_arr array is required",
      });
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const attachmentSwap = await AttachmentSwapModel.findByPk(id);

      if (!attachmentSwap) {
        return res
          .status(404)
          .json({ message: `Attachment swap not found: ${id}` });
      }

      // Update swap history
      const history = attachmentSwap.swap_history || [];
      history.push({
        status: "Cancelled",
        date: new Date(),
        by_user_id: uid,
        action: "Cancelled",
      });

      await attachmentSwap.update({
        swap_status: "Cancelled",
        swap_history: history,
        overall_status: "Cancelled",
      });

      results.push(attachmentSwap);
    }

    res.json({
      message: "Swap requests cancelled successfully",
      attachmentSwaps: results,
    });
  } catch (error) {
    console.error("Error cancelling swap:", error);
    res.status(500).json({ message: "Failed to cancel swap" });
  }
});

// Resubmit swap after return (Operations team)
router.post("/resubmit", verifyToken, async (req, res) => {
  try {
    const { swap_ids_arr } = req.body;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        uid = user.uid;
      }
    }
    const {
      swap_estimated_recovery_cost,
      swap_mobilization_trips,
      swap_demobilization_trips,
      swap_remark,
    } = req.body;

    const results = [];

    for (const id of swap_ids_arr) {
      const attachmentSwap = await AttachmentSwapModel.findByPk(id);

      if (!attachmentSwap) {
        return res
          .status(404)
          .json({ message: `Attachment swap not found: ${id}` });
      }

      if (attachmentSwap.swap_status !== "Return") {
        return res.status(400).json({
          message: "Only returned swaps can be resubmitted",
        });
      }

      // Update swap history
      const history = attachmentSwap.swap_history || [];
      history.push({
        status: "Resubmit",
        date: new Date(),
        by_user_id: uid,
        action: "Resubmitted after corrections",
      });

      const updateData = {
        swap_status: "Resubmit",
        swap_submitted_by: uid,
        swap_submitted_at: new Date(),
        swap_return_reason: null,
        swap_return_date: null,
        swap_history: history,
        overall_status: "Awaiting Sales confirmation",
      };

      // Update optional fields if provided
      if (swap_estimated_recovery_cost !== undefined) {
        updateData.swap_estimated_recovery_cost = swap_estimated_recovery_cost;
      }
      if (swap_mobilization_trips !== undefined) {
        updateData.swap_mobilization_trips = swap_mobilization_trips;
      }
      if (swap_demobilization_trips !== undefined) {
        updateData.swap_demobilization_trips = swap_demobilization_trips;
      }
      if (swap_remark !== undefined) {
        updateData.swap_remark = swap_remark;
      }

      await attachmentSwap.update(updateData);

      results.push(attachmentSwap);
    }

    res.json({
      message: "Swap requests resubmitted successfully",
      attachmentSwaps: results,
    });
  } catch (error) {
    console.error("Error resubmitting swap:", error);
    res.status(500).json({ message: "Failed to resubmit swap" });
  }
});

// Update single swap request
router.put("/update-swap-request/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      swap_mobilization_charge,
      swap_demobilization_charge,
      swap_estimated_transfer_cost,
      swap_sales_remark,
      return_reason,
    } = req.body;

    const swap = await AttachmentSwapModel.findByPk(id);
    if (!swap) {
      return res.status(404).json({ message: "Swap record not found" });
    }

    // Update swap request
    const updateData = {
      swap_status: status,
      swap_mobilization_charge,
      swap_demobilization_charge,
      swap_estimated_transfer_cost,
      swap_sales_remark,
      return_reason: status === "Return" ? return_reason : null,
      updated_at: new Date(),
    };

    await swap.update(updateData);

    res.json({
      message: "Swap request updated successfully",
      swap,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
