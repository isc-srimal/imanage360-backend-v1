// // routes/fleet-management/operator-change-routes.js
// const express = require("express");
// const {
//   getAllEquipmentForOperator,
//   getManpowerByOperatorType,
//   getAllOperatorTypes,
//   createOperatorChange,
//   // getOperatorChangesBySalesOrder,
//   getOperatorChangeById,
//   createOperatorDeliveryNote,
//   createOperatorOffHireNote,
//   getOperatorDeliveryNoteSummary,
//   getOperatorOffHireNoteSummary,
//   generateOperatorDeliveryNotePDF,
//   generateOperatorOffHireNotePDF,
//   uploadOperatorDeliveryNote,
//   uploadOperatorOffHireNote,
//   addTripToOperatorDeliveryNote,
//   addTripToOperatorOffHireNote,
//   getOperatorSwapReasons,
//   // getOperatorDetailsById,
// } = require("../../controllers/fleet-management/operatorChangeController");
// const { verifyToken } = require("../../middleware/authMiddleware");
// const upload = require("../../middleware/uploadMiddleware");
// const OperatorChangeModel = require("../../models/fleet-management/OperatorChangeModel");

// const router = express.Router();

// /**
//  * @swagger
//  * /api/operator-changes/operator-swap-reasons:
//  *   get:
//  *     summary: Get operator swap reasons
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of operator swap reasons
//  */
// router.get("/operator-swap-reasons", verifyToken, getOperatorSwapReasons);

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     OperatorChange:
//  *       type: object
//  *       required:
//  *         - sales_order_id
//  *         - new_operator_id
//  *         - change_date
//  *         - change_reason
//  *       properties:
//  *         operator_change_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         sales_order_id:
//  *           type: integer
//  *           description: Sales order ID
//  *         allocation_id:
//  *           type: integer
//  *           description: Allocation ID
//  *         previous_operator_id:
//  *           type: integer
//  *           description: Previous operator ID
//  *         previous_operator_name:
//  *           type: string
//  *           description: Previous operator name
//  *         new_operator_id:
//  *           type: integer
//  *           description: New operator ID
//  *         new_operator_name:
//  *           type: string
//  *           description: New operator name
//  *         operator_type:
//  *           type: string
//  *           description: Type of operator
//  *         change_date:
//  *           type: string
//  *           format: date
//  *           description: Change date
//  *         change_reason:
//  *           type: string
//  *           description: Reason for change
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
//  *     OperatorDeliveryNote:
//  *       type: object
//  *       required:
//  *         - operator_change_id
//  *         - delivery_date
//  *       properties:
//  *         operator_dn_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         operator_change_id:
//  *           type: integer
//  *           description: Operator change ID
//  *         dn_number:
//  *           type: string
//  *           description: Delivery note number
//  *         new_operator_id:
//  *           type: integer
//  *           description: New operator ID
//  *         new_operator_name:
//  *           type: string
//  *           description: New operator name
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
//  *     OperatorOffHireNote:
//  *       type: object
//  *       required:
//  *         - operator_change_id
//  *         - off_hire_date
//  *       properties:
//  *         operator_ohn_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         operator_change_id:
//  *           type: integer
//  *           description: Operator change ID
//  *         ohn_number:
//  *           type: string
//  *           description: Off hire note number
//  *         previous_operator_id:
//  *           type: integer
//  *           description: Previous operator ID
//  *         previous_operator_name:
//  *           type: string
//  *           description: Previous operator name
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
//  *     EquipmentForOperator:
//  *       type: object
//  *       properties:
//  *         serial_number:
//  *           type: integer
//  *           description: Equipment serial number
//  *         reg_number:
//  *           type: string
//  *           description: Equipment registration number
//  *         vehicle_type:
//  *           type: string
//  *           description: Vehicle type
//  *
//  *     ManpowerItem:
//  *       type: object
//  *       properties:
//  *         manpower_id:
//  *           type: integer
//  *         employeeId:
//  *           type: string
//  *         employeeNo:
//  *           type: string
//  *         employeeFullName:
//  *           type: string
//  *         operator_type:
//  *           type: string
//  *
//  *     OperatorTypeItem:
//  *       type: object
//  *       properties:
//  *         operator_type_id:
//  *           type: integer
//  *         operator_type:
//  *           type: string
//  *
//  *     DeliveryNoteSummary:
//  *       type: object
//  *       properties:
//  *         dn_number:
//  *           type: string
//  *           description: Delivery note number
//  *         operator:
//  *           type: object
//  *           properties:
//  *             manpower_id:
//  *               type: integer
//  *             employeeNo:
//  *               type: string
//  *             employeeFullName:
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
//  *   name: Operator Changes
//  *   description: Operator change management endpoints
//  */

// /**
//  * @swagger
//  * /api/operator-changes/equipment-list:
//  *   get:
//  *     summary: Get all equipment for dropdown
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of equipment
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 equipment:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/EquipmentForOperator'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/equipment-list", verifyToken, getAllEquipmentForOperator);

// /**
//  * @swagger
//  * /api/operator-changes/manpower-list:
//  *   get:
//  *     summary: Get manpower by operator type
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: operator_type
//  *         schema:
//  *           type: integer
//  *         description: Operator type ID
//  *     responses:
//  *       200:
//  *         description: List of manpower
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 manpower:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/ManpowerItem'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/manpower-list", verifyToken, getManpowerByOperatorType);

// /**
//  * @swagger
//  * /api/operator-changes/operator-types:
//  *   get:
//  *     summary: Get all operator types for dropdown
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of operator types
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 success:
//  *                   type: boolean
//  *                 operatorTypes:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/OperatorTypeItem'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/operator-types", verifyToken, getAllOperatorTypes);

// /**
//  * @swagger
//  * /api/operator-changes/create:
//  *   post:
//  *     summary: Create an operator change
//  *     tags: [Operator Changes]
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
//  *               - new_operator_id
//  *               - change_date
//  *               - change_reason
//  *             properties:
//  *               sales_order_id:
//  *                 type: integer
//  *                 example: 1
//  *               allocation_id:
//  *                 type: integer
//  *                 example: 1
//  *               equipment_serial_number:
//  *                 type: integer
//  *                 example: 1001
//  *               plate_number:
//  *                 type: string
//  *                 example: "ABC-123"
//  *               previous_operator_id:
//  *                 type: integer
//  *                 example: 1
//  *               new_operator_id:
//  *                 type: integer
//  *                 example: 2
//  *               operator_type:
//  *                 type: string
//  *                 example: "Driver"
//  *               change_date:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-01-15"
//  *               change_reason:
//  *                 type: string
//  *                 example: "Operator resignation"
//  *     responses:
//  *       201:
//  *         description: Operator change created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 data:
//  *                   type: object
//  *                   properties:
//  *                     operatorChange:
//  *                       $ref: '#/components/schemas/OperatorChange'
//  *                     previousOperator:
//  *                       type: object
//  *                       properties:
//  *                         manpower_id:
//  *                           type: integer
//  *                         employee_id:
//  *                           type: string
//  *                         name:
//  *                           type: string
//  *                         employee_no:
//  *                           type: string
//  *                     newOperator:
//  *                       type: object
//  *                       properties:
//  *                         manpower_id:
//  *                           type: integer
//  *                         employee_id:
//  *                           type: string
//  *                         name:
//  *                           type: string
//  *                         employee_no:
//  *                           type: string
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Sales order or operator not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/create", verifyToken, createOperatorChange);

// /**
//  * @swagger
//  * /api/operator-changes/{id}:
//  *   get:
//  *     summary: Get operator change by ID with details
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator change ID
//  *     responses:
//  *       200:
//  *         description: Operator change details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 operatorChange:
//  *                   $ref: '#/components/schemas/OperatorChange'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Operator change not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/:id", verifyToken, getOperatorChangeById);

// /**
//  * @swagger
//  * /api/operator-changes/{operator_change_id}/delivery-note:
//  *   post:
//  *     summary: Create operator delivery note
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_change_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator change ID
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
//  *                   $ref: '#/components/schemas/OperatorDeliveryNote'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Operator change not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/:operator_change_id/delivery-note", verifyToken, createOperatorDeliveryNote);

// /**
//  * @swagger
//  * /api/operator-changes/{operator_change_id}/off-hire-note:
//  *   post:
//  *     summary: Create operator off hire note
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_change_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator change ID
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
//  *                 example: "Off hire due to change"
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
//  *                   $ref: '#/components/schemas/OperatorOffHireNote'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Operator change not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/:operator_change_id/off-hire-note", verifyToken, createOperatorOffHireNote);

// // /**
// //  * @swagger
// //  * /api/operator-changes/sales-order/{sales_order_id}:
// //  *   get:
// //  *     summary: Get all operator changes for sales order
// //  *     tags: [Operator Changes]
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
// //  *         description: List of operator changes
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 totalCount:
// //  *                   type: integer
// //  *                 operatorChanges:
// //  *                   type: array
// //  *                   items:
// //  *                     $ref: '#/components/schemas/OperatorChange'
// //  *       401:
// //  *         description: Unauthorized
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/sales-order/:sales_order_id", verifyToken, getOperatorChangesBySalesOrder);

// /**
//  * @swagger
//  * /api/operator-changes/delivery-note/{operator_dn_id}/summary:
//  *   get:
//  *     summary: Get operator delivery note summary
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator delivery note ID
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
//  *                   $ref: '#/components/schemas/DeliveryNoteSummary'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Delivery note not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/delivery-note/:operator_dn_id/summary", verifyToken, getOperatorDeliveryNoteSummary);

// /**
//  * @swagger
//  * /api/operator-changes/off-hire-note/{operator_ohn_id}/summary:
//  *   get:
//  *     summary: Get operator off hire note summary
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator off hire note ID
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
//  *                   $ref: '#/components/schemas/DeliveryNoteSummary'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Off hire note not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/off-hire-note/:operator_ohn_id/summary", verifyToken, getOperatorOffHireNoteSummary);

// /**
//  * @swagger
//  * /api/operator-changes/delivery-note/{operator_dn_id}/generate-pdf:
//  *   get:
//  *     summary: Generate operator delivery note PDF
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator delivery note ID
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
// router.get("/delivery-note/:operator_dn_id/generate-pdf", verifyToken, generateOperatorDeliveryNotePDF);

// /**
//  * @swagger
//  * /api/operator-changes/off-hire-note/{operator_ohn_id}/generate-pdf:
//  *   get:
//  *     summary: Generate operator off hire note PDF
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator off hire note ID
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
// router.get("/off-hire-note/:operator_ohn_id/generate-pdf", verifyToken, generateOperatorOffHireNotePDF);

// /**
//  * @swagger
//  * /api/operator-changes/delivery-note/{operator_dn_id}/upload:
//  *   post:
//  *     summary: Upload signed operator delivery note
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator delivery note ID
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
// router.post("/delivery-note/:operator_dn_id/upload", verifyToken, upload.single("delivery_attachment"), uploadOperatorDeliveryNote);

// /**
//  * @swagger
//  * /api/operator-changes/off-hire-note/{operator_ohn_id}/upload:
//  *   post:
//  *     summary: Upload signed operator off hire note
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator off hire note ID
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
// router.post("/off-hire-note/:operator_ohn_id/upload", verifyToken, upload.single("off_hire_attachment"), uploadOperatorOffHireNote);

// /**
//  * @swagger
//  * /api/operator-changes/delivery-note/{operator_dn_id}/add-trip:
//  *   post:
//  *     summary: Add trip to operator delivery note
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator delivery note ID
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
// router.post("/delivery-note/:operator_dn_id/add-trip", verifyToken, addTripToOperatorDeliveryNote);

// /**
//  * @swagger
//  * /api/operator-changes/off-hire-note/{operator_ohn_id}/add-trip:
//  *   post:
//  *     summary: Add trip to operator off hire note
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator off hire note ID
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
// router.post("/off-hire-note/:operator_ohn_id/add-trip", verifyToken, addTripToOperatorOffHireNote);

// /**
//  * @swagger
//  * /api/operator-changes/delivery-note/{operator_change_id}/latest:
//  *   get:
//  *     summary: Get latest operator delivery note for change
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_change_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator change ID
//  *     responses:
//  *       200:
//  *         description: Latest delivery note
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 deliveryNote:
//  *                   $ref: '#/components/schemas/OperatorDeliveryNote'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: No delivery note found
//  *       500:
//  *         description: Server error
//  */
// router.get("/delivery-note/:operator_change_id/latest", verifyToken, async (req, res) => {
//   try {
//     const { operator_change_id } = req.params;

//     const OperatorDeliveryNoteModel = require("../../models/fleet-management/OperatorDeliveryNoteModel").OperatorDeliveryNoteModel;

//     const deliveryNote = await OperatorDeliveryNoteModel.findOne({
//       where: { operator_change_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: require("../../models/fleet-management/OperatorDeliveryNoteModel").OperatorDeliveryNoteTripModel,
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
//  * /api/operator-changes/off-hire-note/{operator_change_id}/latest:
//  *   get:
//  *     summary: Get latest operator off hire note for change
//  *     tags: [Operator Changes]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: operator_change_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Operator change ID
//  *     responses:
//  *       200:
//  *         description: Latest off hire note
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 offHireNote:
//  *                   $ref: '#/components/schemas/OperatorOffHireNote'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: No off hire note found
//  *       500:
//  *         description: Server error
//  */
// router.get("/off-hire-note/:operator_change_id/latest", verifyToken, async (req, res) => {
//   try {
//     const { operator_change_id } = req.params;

//     const OperatorOffHireNoteModel = require("../../models/fleet-management/OperatorOffHireNoteModel").OperatorOffHireNoteModel;

//     const offHireNote = await OperatorOffHireNoteModel.findOne({
//       where: { operator_change_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: require("../../models/fleet-management/OperatorOffHireNoteModel").OperatorOffHireNoteTripModel,
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

// // Submit operator change for approval
// router.post("/submit-for-approval", verifyToken, async (req, res) => {
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
//       const operatorChange = await OperatorChangeModel.findByPk(id);

//       if (!operatorChange) {
//         return res.status(404).json({
//           message: `Equipment swap not found: ${id}`
//         });
//       }

//       if (operatorChange.change_status !== "Pending") {
//         return res.status(400).json({
//           message: `Swap ID ${id} is not in Pending status`,
//         });
//       }

//       const history = operatorChange.change_history || [];
//       history.push({
//         status: 'Swap Request',
//         date: new Date(),
//         by_user_id: userId,
//         action: 'Submitted for approval'
//       });

//       await operatorChange.update({
//         change_status: "Swap Request",
//         change_submitted_by: userId,
//         change_submitted_at: new Date(),
//         change_history: history,
//         overall_status: "Awaiting Sales confirmation",
//       });

//       results.push(operatorChange);
//     }

//     res.json({
//       message: "Swap requests submitted for approval successfully",
//       operatorChanges: results,
//     });
//   } catch (error) {
//     console.error("Error submitting swap for approval:", error);
//     res.status(500).json({ message: "Failed to submit swap for approval" });
//   }
// });

// // Approve operator change (no charges required)
// router.post('/approve', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const userId = req.user.id;

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const operatorChange = await OperatorChangeModel.findByPk(id);

//       if (!operatorChange) {
//         return res.status(404).json({ message: `Operator change not found: ${id}` });
//       }

//       if (!['Swap Request', 'Resubmit'].includes(operatorChange.change_status)) {
//         return res.status(400).json({
//           message: 'Only swap requests can be approved'
//         });
//       }

//       const history = operatorChange.change_history || [];
//       history.push({
//         status: "Approved",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Approved by sales team",
//       });

//       await operatorChange.update({
//         change_status: "Approved",
//         change_approved_by: userId,
//         change_approved_at: new Date(),
//         change_history: history,
//         overall_status: "In progress",
//       });

//       results.push(operatorChange);
//     }

//     res.json({
//       message: 'Operator change approved successfully',
//       operatorChanges: results
//     });
//   } catch (error) {
//     console.error('Error approving operator change:', error);
//     res.status(500).json({ message: 'Failed to approve change' });
//   }
// });

// // Return operator change
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
//       const operatorChange = await OperatorChangeModel.findByPk(id);

//       if (!operatorChange) {
//         return res.status(404).json({ message: `Operator change not found: ${id}` });
//       }

//       if (!['Swap Request', 'Resubmit'].includes(operatorChange.change_status)) {
//         return res.status(400).json({
//           message: 'Only swap requests can be returned'
//         });
//       }

//       const history = operatorChange.change_history || [];
//       history.push({
//         status: "Return",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Returned by sales team",
//         reason: return_reason.trim(),
//       });

//       await operatorChange.update({
//         change_status: "Return",
//         change_return_reason: return_reason.trim(),
//         change_return_date: new Date(),
//         change_history: history,
//         overall_status: "Return",
//       });

//       results.push(operatorChange);
//     }

//     res.json({
//       message: 'Operator change returned to operations team',
//       operatorChanges: results
//     });

//   } catch (error) {
//     console.error('Error returning operator change:', error);
//     res.status(500).json({ message: 'Failed to return change' });
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
//       const operatorChange = await OperatorChangeModel.findByPk(id);

//       if (!attachmentSwap) {
//         return res
//           .status(404)
//           .json({ message: `Operator change not found: ${id}` });
//       }

//       // Update swap history
//       const history = operatorChange.swap_history || [];
//       history.push({
//         status: "Cancelled",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Cancelled by sales team",
//       });

//       await operatorChange.update({
//         swap_status: "Cancelled",
//         swap_history: history,
//         overall_status: "Cancelled",
//       });

//       results.push(operatorChange);
//     }

//     res.json({
//       message: "Operator changes request cancelled to operations team",
//       operatorChanges: results,
//     });

//   } catch (error) {
//     console.error('Error returning swap:', error);
//     res.status(500).json({ message: 'Failed to return swap', error: error });
//   }
// });

// // Resubmit operator change
// router.post('/resubmit', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const userId = req.user.id;
//     const {
//       change_estimated_transfer_cost,
//       change_remark
//     } = req.body;

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const operatorChange = await OperatorChangeModel.findByPk(id);

//       if (!operatorChange) {
//         return res.status(404).json({ message: `Operator change not found: ${id}` });
//       }

//       if (operatorChange.change_status !== "Return") {
//         return res.status(400).json({
//           message: "Only returned changes can be resubmitted",
//         });
//       }

//       const history = operatorChange.change_history || [];
//       history.push({
//         status: "Resubmit",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Resubmitted after corrections",
//       });

//       const updateData = {
//         change_status: "Resubmit",
//         change_submitted_by: userId,
//         change_submitted_at: new Date(),
//         change_return_reason: null,
//         change_return_date: null,
//         change_history: history,
//         overall_status: "Awaiting Sales confirmation",
//       };

//       if (change_estimated_transfer_cost !== undefined) {
//         updateData.change_estimated_transfer_cost =
//           change_estimated_transfer_cost;
//       }
//       if (change_remark !== undefined) {
//         updateData.change_remark = change_remark;
//       }

//       await operatorChange.update(updateData);
//     }

//     res.json({
//       message: 'Operator change resubmitted successfully',
//       operatorChanges: results
//     });

//   } catch (error) {
//     console.error('Error resubmitting operator change:', error);
//     res.status(500).json({ message: 'Failed to resubmit change' });
//   }
// });

// // /**
// //  * @swagger
// //  * /api/operator-changes/operator-details/{operator_id}:
// //  *   get:
// //  *     summary: Get operator details by ID
// //  *     tags: [Operator Changes]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     parameters:
// //  *       - in: path
// //  *         name: operator_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *         description: Operator ID (manpower_id)
// //  *     responses:
// //  *       200:
// //  *         description: Operator details
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 success:
// //  *                   type: boolean
// //  *                 operator:
// //  *                   type: object
// //  *                   properties:
// //  *                     manpower_id:
// //  *                       type: integer
// //  *                     employeeId:
// //  *                       type: string
// //  *                     employeeNo:
// //  *                       type: string
// //  *                     employeeFullName:
// //  *                       type: string
// //  *                     nationality:
// //  *                       type: string
// //  *                     passport_no:
// //  *                       type: string
// //  *                     qid:
// //  *                       type: string
// //  *                     operator_type:
// //  *                       type: string
// //  *                     status:
// //  *                       type: string
// //  *       401:
// //  *         description: Unauthorized
// //  *       404:
// //  *         description: Operator not found
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/operator-details/:operator_id", verifyToken, getOperatorDetailsById);
// /**
//  * @swagger
//  * /api/operator-changes/sales-order/{sales_order_id}:
//  *   get:
//  *     summary: Get all operator changes for sales order
//  *     tags: [Operator Changes]
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
//  *         description: List of operator changes
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 totalCount:
//  *                   type: integer
//  *                 operatorChanges:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/OperatorChange'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/sales-order/:sales_order_id", verifyToken, async (req, res) => {
//   try {
//     const { sales_order_id } = req.params;

//     const OperatorChangeModel = require("../../models/fleet-management/OperatorChangeModel");
//     const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
//     const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
//     const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
//     const { ActiveAllocationModel } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");

//     const operatorChanges = await OperatorChangeModel.findAll({
//       where: { sales_order_id },
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//         {
//           model: EquipmentModel,
//           as: "equipment",
//           attributes: ["serial_number", "reg_number", "vehicle_type"],
//         },
//         {
//           model: ManpowerModel,
//           as: "previousOperator",
//           attributes: ["manpower_id", "employeeFullName", "employeeType"],
//         },
//         {
//           model: ManpowerModel,
//           as: "newOperator",
//           attributes: ["manpower_id", "employeeFullName", "employeeType"],
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
//       totalCount: operatorChanges.length,
//       operatorChanges,
//     });
//   } catch (error) {
//     console.error("Error fetching operator changes:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;

// routes/fleet-management/operator-change-routes.js (UPDATED with all missing routes)
const express = require("express");
const {
  // Swap Reasons
  getOperatorSwapReasons,

  // Dropdown Functions
  getAllEquipmentForOperator,
  getManpowerByOperatorType,
  getAllOperatorTypes,

  // Operator Change Creation & Retrieval
  createOperatorChange,
  getOperatorChangeById,
  getOperatorChangesBySalesOrder,

  // Delivery Note Functions
  createOperatorDeliveryNote,
  getOperatorDeliveryNoteById,
  getLatestOperatorDeliveryNote,
  getOperatorDeliveryNoteSummary,
  submitOperatorDNForApproval,
  approveOperatorDeliveryNote,
  rejectOperatorDeliveryNote,
  closeOperatorDeliveryNote,
  uploadOperatorDeliveryNote,
  generateOperatorDeliveryNotePDF,

  // Off Hire Note Functions
  createOperatorOffHireNote,
  getOperatorOffHireNoteById,
  getLatestOperatorOffHireNote,
  getOperatorOffHireNoteSummary,
  submitOperatorOHNForApproval,
  approveOperatorOffHireNote,
  rejectOperatorOffHireNote,
  closeOperatorOffHireNote,
  uploadOperatorOffHireNote,
  generateOperatorOffHireNotePDF,

  // Trip Management Functions
  addTripToOperatorDeliveryNote,
  addTripToOperatorOffHireNote,
  updateTripInOperatorDN,
  updateTripInOperatorOHN,
  deleteTripFromOperatorDN,
  deleteTripFromOperatorOHN,

  // Checklist Functions
  uploadOperatorDNChecklist,
  uploadOperatorOHNChecklist,
  downloadOperatorDNChecklist,
  downloadOperatorOHNChecklist,

  // DN Trip Status
  submitOperatorDNTripForApproval,
  approveOperatorDNTrip,
  rejectOperatorDNTrip,
  generateOperatorDNTripPDF,
  completeOperatorDNTrip,
  closeOperatorDNTrip,
  generateOperatorDeliveryNotePDFForTrip,
  uploadOperatorDeliveryNoteToTrip,

  // OHN Trip Status
  submitOperatorOHNTripForApproval,
  approveOperatorOHNTrip,
  rejectOperatorOHNTrip,
  generateOperatorOHNTripPDF,
  completeOperatorOHNTrip,
  closeOperatorOHNTrip,
  generateOperatorOffHireNotePDFForTrip,
  uploadOperatorOffHireNoteToTrip,
} = require("../controllers/operatorChangeController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const OperatorChangeModel = require("../models/OperatorChangeModel");
const { Op } = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");

const router = express.Router();

// ==================== MULTER CONFIGURATIONS ====================

// Storage for delivery note uploads
const dnStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/operator-delivery-notes/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `op-dn-${uniqueSuffix}-${file.originalname}`);
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
    const dir = "public/uploads/operator-off-hire-notes/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `op-ohn-${uniqueSuffix}-${file.originalname}`);
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

// Storage for DN checklist uploads
const dnChecklistStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/operator-dn-checklists/";
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

const dnChecklistUpload = multer({
  storage: dnChecklistStorage,
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
    const dir = "public/uploads/operator-ohn-checklists/";
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

// ==================== SWAGGER DOCUMENTATION ====================

/**
 * @swagger
 * components:
 *   schemas:
 *     OperatorChange:
 *       type: object
 *       required:
 *         - sales_order_id
 *         - new_operator_id
 *         - change_date
 *         - change_reason
 *       properties:
 *         operator_change_id:
 *           type: integer
 *           description: Auto-generated ID
 *         sales_order_id:
 *           type: integer
 *           description: Sales order ID
 *         allocation_id:
 *           type: integer
 *           description: Allocation ID
 *         previous_operator_id:
 *           type: integer
 *           description: Previous operator ID
 *         previous_operator_name:
 *           type: string
 *           description: Previous operator name
 *         new_operator_id:
 *           type: integer
 *           description: New operator ID
 *         new_operator_name:
 *           type: string
 *           description: New operator name
 *         operator_type:
 *           type: string
 *           description: Type of operator
 *         change_date:
 *           type: string
 *           format: date
 *           description: Change date
 *         change_reason:
 *           type: string
 *           description: Reason for change
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
 *           enum: [Creation, In progress, Partially completed, Completed, Cancelled]
 *           default: Creation
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
 *     OperatorDeliveryNote:
 *       type: object
 *       required:
 *         - operator_change_id
 *         - delivery_date
 *       properties:
 *         operator_dn_id:
 *           type: integer
 *           description: Auto-generated ID
 *         operator_change_id:
 *           type: integer
 *           description: Operator change ID
 *         dn_number:
 *           type: string
 *           description: Delivery note number
 *         new_operator_id:
 *           type: integer
 *           description: New operator ID
 *         new_operator_name:
 *           type: string
 *           description: New operator name
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
 *     OperatorOffHireNote:
 *       type: object
 *       required:
 *         - operator_change_id
 *         - off_hire_date
 *       properties:
 *         operator_ohn_id:
 *           type: integer
 *           description: Auto-generated ID
 *         operator_change_id:
 *           type: integer
 *           description: Operator change ID
 *         ohn_number:
 *           type: string
 *           description: Off hire note number
 *         previous_operator_id:
 *           type: integer
 *           description: Previous operator ID
 *         previous_operator_name:
 *           type: string
 *           description: Previous operator name
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
 *         manpower:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               employee_id:
 *                 type: integer
 *               employee_no:
 *                 type: string
 *               employee_name:
 *                 type: string
 *         remarks:
 *           type: string
 *           description: Trip remarks
 *
 */

/**
 * @swagger
 * tags:
 *   name: Operator Changes
 *   description: Operator change management endpoints
 */

// ==================== PUBLIC ROUTES ====================

/**
 * @swagger
 * /api/operator-changes/operator-swap-reasons:
 *   get:
 *     summary: Get operator swap reasons
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of operator swap reasons
 */
router.get("/operator-swap-reasons", verifyToken, getOperatorSwapReasons);

/**
 * @swagger
 * /api/operator-changes/equipment-list:
 *   get:
 *     summary: Get all equipment for dropdown
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of equipment
 */
router.get("/equipment-list", verifyToken, getAllEquipmentForOperator);

/**
 * @swagger
 * /api/operator-changes/manpower-list:
 *   get:
 *     summary: Get manpower by operator type
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: operator_type
 *         schema:
 *           type: integer
 *         description: Operator type ID
 *     responses:
 *       200:
 *         description: List of manpower
 */
router.get("/manpower-list", verifyToken, getManpowerByOperatorType);

/**
 * @swagger
 * /api/operator-changes/operator-types:
 *   get:
 *     summary: Get all operator types for dropdown
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of operator types
 */
router.get("/operator-types", verifyToken, getAllOperatorTypes);

// ==================== OPERATOR CHANGE CREATION & RETRIEVAL ====================

/**
 * @swagger
 * /api/operator-changes/create:
 *   post:
 *     summary: Create an operator change
 *     tags: [Operator Changes]
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
 *               - new_operator_id
 *               - change_date
 *               - change_reason
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 example: 1
 *               allocation_id:
 *                 type: integer
 *                 example: 1
 *               equipment_serial_number:
 *                 type: integer
 *                 example: 1001
 *               plate_number:
 *                 type: string
 *                 example: "ABC-123"
 *               previous_operator_id:
 *                 type: integer
 *                 example: 1
 *               new_operator_id:
 *                 type: integer
 *                 example: 2
 *               operator_type:
 *                 type: string
 *                 example: "Driver"
 *               change_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               change_reason:
 *                 type: string
 *                 example: "Operator resignation"
 *     responses:
 *       201:
 *         description: Operator change created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sales order or operator not found
 *       500:
 *         description: Server error
 */
router.post("/create", verifyToken, createOperatorChange);

/**
 * @swagger
 * /api/operator-changes/{id}:
 *   get:
 *     summary: Get operator change by ID with details
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator change ID
 *     responses:
 *       200:
 *         description: Operator change details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Operator change not found
 *       500:
 *         description: Server error
 */
router.get("/:id", verifyToken, getOperatorChangeById);

/**
 * @swagger
 * /api/operator-changes/sales-order/{sales_order_id}:
 *   get:
 *     summary: Get all operator changes for sales order
 *     tags: [Operator Changes]
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
 *         description: List of operator changes
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get(
  "/sales-order/:sales_order_id",
  verifyToken,
  getOperatorChangesBySalesOrder,
);

// ==================== DELIVERY NOTE ROUTES ====================

/**
 * @swagger
 * /api/operator-changes/{operator_change_id}/delivery-note:
 *   post:
 *     summary: Create operator delivery note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_change_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator change ID
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Operator change not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:operator_change_id/delivery-note",
  verifyToken,
  createOperatorDeliveryNote,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}:
 *   get:
 *     summary: Get operator delivery note by ID
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
 *     responses:
 *       200:
 *         description: Delivery note details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/delivery-note/:operator_dn_id",
  verifyToken,
  getOperatorDeliveryNoteById,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_change_id}/latest:
 *   get:
 *     summary: Get latest operator delivery note for change
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_change_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator change ID
 *     responses:
 *       200:
 *         description: Latest delivery note
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No delivery note found
 *       500:
 *         description: Server error
 */
router.get(
  "/delivery-note/:operator_change_id/latest",
  verifyToken,
  getLatestOperatorDeliveryNote,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/summary:
 *   get:
 *     summary: Get operator delivery note summary
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
 *     responses:
 *       200:
 *         description: Delivery note summary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Delivery note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/delivery-note/:operator_dn_id/summary",
  verifyToken,
  getOperatorDeliveryNoteSummary,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/submit-approval:
 *   put:
 *     summary: Submit operator delivery note for approval
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
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
  "/delivery-note/:operator_dn_id/submit-approval",
  verifyToken,
  submitOperatorDNForApproval,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/approve:
 *   put:
 *     summary: Approve operator delivery note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
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
  "/delivery-note/:operator_dn_id/approve",
  verifyToken,
  approveOperatorDeliveryNote,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/reject:
 *   put:
 *     summary: Reject operator delivery note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
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
  "/delivery-note/:operator_dn_id/reject",
  verifyToken,
  rejectOperatorDeliveryNote,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/close:
 *   put:
 *     summary: Close operator delivery note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
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
  "/delivery-note/:operator_dn_id/close",
  verifyToken,
  closeOperatorDeliveryNote,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/upload:
 *   post:
 *     summary: Upload signed operator delivery note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
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
  "/delivery-note/:operator_dn_id/upload",
  verifyToken,
  dnUpload.single("delivery_attachment"),
  uploadOperatorDeliveryNote,
);

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/generate-pdf:
 *   get:
 *     summary: Generate operator delivery note PDF
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
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
  "/delivery-note/:operator_dn_id/generate-pdf",
  verifyToken,
  generateOperatorDeliveryNotePDF,
);

// ==================== OFF-HIRE NOTE ROUTES ====================

/**
 * @swagger
 * /api/operator-changes/{operator_change_id}/off-hire-note:
 *   post:
 *     summary: Create operator off hire note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_change_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator change ID
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
 *                 example: "Off hire due to change"
 *               trips:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TripData'
 *     responses:
 *       201:
 *         description: Off hire note created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Operator change not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:operator_change_id/off-hire-note",
  verifyToken,
  createOperatorOffHireNote,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}:
 *   get:
 *     summary: Get operator off hire note by ID
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
 *     responses:
 *       200:
 *         description: Off hire note details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/off-hire-note/:operator_ohn_id",
  verifyToken,
  getOperatorOffHireNoteById,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_change_id}/latest:
 *   get:
 *     summary: Get latest operator off hire note for change
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_change_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator change ID
 *     responses:
 *       200:
 *         description: Latest off hire note
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No off hire note found
 *       500:
 *         description: Server error
 */
router.get(
  "/off-hire-note/:operator_change_id/latest",
  verifyToken,
  getLatestOperatorOffHireNote,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/summary:
 *   get:
 *     summary: Get operator off hire note summary
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
 *     responses:
 *       200:
 *         description: Off hire note summary
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Off hire note not found
 *       500:
 *         description: Server error
 */
router.get(
  "/off-hire-note/:operator_ohn_id/summary",
  verifyToken,
  getOperatorOffHireNoteSummary,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/submit-approval:
 *   put:
 *     summary: Submit operator off hire note for approval
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
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
  "/off-hire-note/:operator_ohn_id/submit-approval",
  verifyToken,
  submitOperatorOHNForApproval,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/approve:
 *   put:
 *     summary: Approve operator off hire note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
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
  "/off-hire-note/:operator_ohn_id/approve",
  verifyToken,
  approveOperatorOffHireNote,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/reject:
 *   put:
 *     summary: Reject operator off hire note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
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
  "/off-hire-note/:operator_ohn_id/reject",
  verifyToken,
  rejectOperatorOffHireNote,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/close:
 *   put:
 *     summary: Close operator off hire note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
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
  "/off-hire-note/:operator_ohn_id/close",
  verifyToken,
  closeOperatorOffHireNote,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/upload:
 *   post:
 *     summary: Upload signed operator off hire note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
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
  "/off-hire-note/:operator_ohn_id/upload",
  verifyToken,
  ohnUpload.single("off_hire_attachment"),
  uploadOperatorOffHireNote,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/generate-pdf:
 *   get:
 *     summary: Generate operator off hire note PDF
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
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
  "/off-hire-note/:operator_ohn_id/generate-pdf",
  verifyToken,
  generateOperatorOffHireNotePDF,
);

// ==================== TRIP MANAGEMENT ROUTES ====================

/**
 * @swagger
 * /api/operator-changes/delivery-note/{operator_dn_id}/add-trip:
 *   post:
 *     summary: Add trip to operator delivery note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator delivery note ID
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
  "/delivery-note/:operator_dn_id/add-trip",
  verifyToken,
  addTripToOperatorDeliveryNote,
);

/**
 * @swagger
 * /api/operator-changes/off-hire-note/{operator_ohn_id}/add-trip:
 *   post:
 *     summary: Add trip to operator off hire note
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: operator_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Operator off hire note ID
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
  "/off-hire-note/:operator_ohn_id/add-trip",
  verifyToken,
  addTripToOperatorOffHireNote,
);

/**
 * @swagger
 * /api/operator-changes/trips/delivery-note/{trip_id}:
 *   put:
 *     summary: Update a trip in operator delivery note
 *     tags: [Operator Changes]
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
  updateTripInOperatorDN,
);

/**
 * @swagger
 * /api/operator-changes/trips/off-hire-note/{trip_id}:
 *   put:
 *     summary: Update a trip in operator off hire note
 *     tags: [Operator Changes]
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
  updateTripInOperatorOHN,
);

/**
 * @swagger
 * /api/operator-changes/trips/delivery-note/{trip_id}:
 *   delete:
 *     summary: Delete a trip from operator delivery note
 *     tags: [Operator Changes]
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
  deleteTripFromOperatorDN,
);

/**
 * @swagger
 * /api/operator-changes/trips/off-hire-note/{trip_id}:
 *   delete:
 *     summary: Delete a trip from operator off hire note
 *     tags: [Operator Changes]
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
  deleteTripFromOperatorOHN,
);

// ==================== CHECKLIST ROUTES ====================

/**
 * @swagger
 * /api/operator-changes/trips/delivery-note/{trip_id}/manpower/{resource_id}/checklist/upload:
 *   post:
 *     summary: Upload checklist for manpower resource in DN trip
 *     tags: [Operator Changes]
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
  "/trips/delivery-note/:trip_id/manpower/:resource_id/checklist/upload",
  verifyToken,
  dnChecklistUpload.single("checklist"),
  uploadOperatorDNChecklist,
);

/**
 * @swagger
 * /api/operator-changes/trips/off-hire-note/{trip_id}/manpower/{resource_id}/checklist/upload:
 *   post:
 *     summary: Upload checklist for manpower resource in OHN trip
 *     tags: [Operator Changes]
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
  "/trips/off-hire-note/:trip_id/manpower/:resource_id/checklist/upload",
  verifyToken,
  ohnChecklistUpload.single("checklist"),
  uploadOperatorOHNChecklist,
);

/**
 * @swagger
 * /api/operator-changes/trips/delivery-note/{trip_id}/manpower/{resource_id}/checklist/download:
 *   get:
 *     summary: Download checklist for manpower resource in DN trip
 *     tags: [Operator Changes]
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
  "/trips/delivery-note/:trip_id/manpower/:resource_id/checklist/download",
  verifyToken,
  downloadOperatorDNChecklist,
);

/**
 * @swagger
 * /api/operator-changes/trips/off-hire-note/{trip_id}/manpower/{resource_id}/checklist/download:
 *   get:
 *     summary: Download checklist for manpower resource in OHN trip
 *     tags: [Operator Changes]
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
  "/trips/off-hire-note/:trip_id/manpower/:resource_id/checklist/download",
  verifyToken,
  downloadOperatorOHNChecklist,
);

// ==================== TRIP DOCUMENT UPLOAD ROUTES ====================

/**
 * @swagger
 * /api/operator-changes/trips/delivery-note/{trip_id}/upload-delivery-note:
 *   post:
 *     summary: Upload delivery note document to a specific trip
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
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
 *               delivery_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Delivery note file (PDF/Image)
 *     responses:
 *       200:
 *         description: Delivery note uploaded to trip successfully
 */
router.post(
  "/trips/delivery-note/:trip_id/upload-delivery-note",
  verifyToken,
  dnUpload.single("delivery_attachment"),
  uploadOperatorDeliveryNoteToTrip
);

/**
 * @swagger
 * /api/operator-changes/trips/off-hire-note/{trip_id}/upload-off-hire-note:
 *   post:
 *     summary: Upload off hire note document to a specific trip
 *     tags: [Operator Changes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
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
 *               off_hire_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Off hire note file (PDF/Image)
 *     responses:
 *       200:
 *         description: Off hire note uploaded to trip successfully
 */
router.post(
  "/trips/off-hire-note/:trip_id/upload-off-hire-note",
  verifyToken,
  ohnUpload.single("off_hire_attachment"),
  uploadOperatorOffHireNoteToTrip
);

/**
 * @swagger
 * /api/operator-changes/trips/delivery-note/{trip_id}/generate-delivery-note-pdf:
 *   get:
 *     summary: Generate delivery note PDF for a specific trip
 *     tags: [Operator Changes]
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
 *         description: PDF file
 */
router.get(
  "/trips/delivery-note/:trip_id/generate-delivery-note-pdf",
  verifyToken,
  generateOperatorDeliveryNotePDFForTrip
);

/**
 * @swagger
 * /api/operator-changes/trips/off-hire-note/{trip_id}/generate-off-hire-note-pdf:
 *   get:
 *     summary: Generate off hire note PDF for a specific trip
 *     tags: [Operator Changes]
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
 *         description: PDF file
 */
router.get(
  "/trips/off-hire-note/:trip_id/generate-off-hire-note-pdf",
  verifyToken,
  generateOperatorOffHireNotePDFForTrip
);

// ─── DN Trip Status Routes ────────────────────────────────────────────────────

router.put("/trips/delivery-note/:trip_id/submit-approval", verifyToken, submitOperatorDNTripForApproval);
router.put("/trips/delivery-note/:trip_id/approve", verifyToken, approveOperatorDNTrip);
router.put("/trips/delivery-note/:trip_id/reject", verifyToken, rejectOperatorDNTrip);
router.get("/trips/delivery-note/:trip_id/generate-pdf", verifyToken, generateOperatorDNTripPDF);
router.put("/trips/delivery-note/:trip_id/complete", verifyToken, completeOperatorDNTrip);
router.put("/trips/delivery-note/:trip_id/close", verifyToken, closeOperatorDNTrip);

// ─── OHN Trip Status Routes ───────────────────────────────────────────────────

router.put("/trips/off-hire-note/:trip_id/submit-approval", verifyToken, submitOperatorOHNTripForApproval);
router.put("/trips/off-hire-note/:trip_id/approve", verifyToken, approveOperatorOHNTrip);
router.put("/trips/off-hire-note/:trip_id/reject", verifyToken, rejectOperatorOHNTrip);
router.get("/trips/off-hire-note/:trip_id/generate-pdf", verifyToken, generateOperatorOHNTripPDF);
router.put("/trips/off-hire-note/:trip_id/complete", verifyToken, completeOperatorOHNTrip);
router.put("/trips/off-hire-note/:trip_id/close", verifyToken, closeOperatorOHNTrip);

// ==================== SWAP REQUEST MANAGEMENT ====================

// Get pending operator change requests counts
router.get("/pending-requests/counts", verifyToken, async (req, res) => {
  try {
    const where = {
      change_status: {
        [Op.in]: ["Swap Request", "Resubmit", "Return"],
      },
    };

    const operatorCount = await OperatorChangeModel.count({ where });

    res.status(200).json({
      success: true,
      operatorChangeCount: operatorCount,
      totalChangeCount: operatorCount,
    });
  } catch (error) {
    console.error("Error fetching pending request counts:", error);
    res.status(500).json({
      message: "Error fetching pending request counts",
      error: error.message,
    });
  }
});

// Get all pending operator change requests
router.get("/pending-requests", verifyToken, async (req, res) => {
  try {
    const { sales_order_id } = req.query;

    const whereClause = {};

    if (sales_order_id) {
      whereClause.sales_order_id = sales_order_id;
    }

    whereClause.change_status = ["Swap Request", "Return", "Resubmit"];

    const operatorChanges = await OperatorChangeModel.findAll({
      where: whereClause,
      include: [
        {
          model: require("../../models/fleet-management/SalesOrdersModel"),
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: require("../../models/fleet-management/ManpowerModel"),
          as: "newOperator",
          attributes: ["manpower_id", "employeeFullName", "employeeNo"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 50,
    });

    const statusCounts = {
      "Swap Request": 0,
      Return: 0,
      Resubmit: 0,
    };

    operatorChanges.forEach((change) => {
      if (statusCounts[change.change_status] !== undefined) {
        statusCounts[change.change_status]++;
      }
    });

    res.status(200).json({
      success: true,
      totalCount: operatorChanges.length,
      pendingCount: statusCounts["Swap Request"],
      returnCount: statusCounts["Return"],
      resubmitCount: statusCounts["Resubmit"],
      operatorChanges,
    });
  } catch (error) {
    console.error("Error fetching pending operator changes:", error);
    res.status(500).json({
      message: "Error fetching pending operator changes",
      error: error.message,
    });
  }
});

// Submit operator change for approval (Operations team)
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
      const operatorChange = await OperatorChangeModel.findByPk(id);

      if (!operatorChange) {
        return res.status(404).json({
          message: `Operator change not found: ${id}`,
        });
      }

      if (operatorChange.change_status !== "Pending") {
        return res.status(400).json({
          message: `Change ID ${id} is not in Pending status`,
        });
      }

      const history = operatorChange.change_history || [];
      history.push({
        status: "Swap Request",
        date: new Date(),
        by_user_id: uid,
        action: "Submitted for approval",
      });

      await operatorChange.update({
        change_status: "Swap Request",
        change_submitted_by: uid,
        change_submitted_at: new Date(),
        change_history: history,
        overall_status: "Awaiting Sales confirmation",
      });

      results.push(operatorChange);
    }

    res.json({
      message: "Swap requests submitted for approval successfully",
      operatorChanges: results,
    });
  } catch (error) {
    console.error("Error submitting swap for approval:", error);
    res.status(500).json({ message: "Failed to submit swap for approval" });
  }
});

// Approve operator change (Sales team)
router.post("/approve", verifyToken, async (req, res) => {
  try {
    const { swap_ids_arr } = req.body;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        uid = user.uid;
      }
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const operatorChange = await OperatorChangeModel.findByPk(id);

      if (!operatorChange) {
        return res
          .status(404)
          .json({ message: `Operator change not found: ${id}` });
      }

      if (
        !["Swap Request", "Resubmit"].includes(operatorChange.change_status)
      ) {
        return res.status(400).json({
          message: "Only swap requests can be approved",
        });
      }

      const history = operatorChange.change_history || [];
      history.push({
        status: "Approved",
        date: new Date(),
        by_user_id: uid,
        action: "Approved by sales team",
      });

      await operatorChange.update({
        change_status: "Approved",
        change_approved_by: uid,
        change_approved_at: new Date(),
        change_history: history,
        overall_status: "In progress",
      });

      results.push(operatorChange);
    }

    res.json({
      message: "Operator change approved successfully",
      operatorChanges: results,
    });
  } catch (error) {
    console.error("Error approving operator change:", error);
    res.status(500).json({ message: "Failed to approve change" });
  }
});

// Return operator change to operations (Sales team)
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
      const operatorChange = await OperatorChangeModel.findByPk(id);

      if (!operatorChange) {
        return res
          .status(404)
          .json({ message: `Operator change not found: ${id}` });
      }

      if (
        !["Swap Request", "Resubmit"].includes(operatorChange.change_status)
      ) {
        return res.status(400).json({
          message: "Only swap requests can be returned",
        });
      }

      const history = operatorChange.change_history || [];
      history.push({
        status: "Return",
        date: new Date(),
        by_user_id: uid,
        action: "Returned by sales team",
        reason: return_reason.trim(),
      });

      await operatorChange.update({
        change_status: "Return",
        change_return_reason: return_reason.trim(),
        change_return_date: new Date(),
        change_history: history,
        overall_status: "Return",
      });

      results.push(operatorChange);
    }

    res.json({
      message: "Operator change returned to operations team",
      operatorChanges: results,
    });
  } catch (error) {
    console.error("Error returning operator change:", error);
    res.status(500).json({ message: "Failed to return change" });
  }
});

// Cancel operator change (Sales team)
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
      const operatorChange = await OperatorChangeModel.findByPk(id);

      if (!operatorChange) {
        return res
          .status(404)
          .json({ message: `Operator change not found: ${id}` });
      }

      const history = operatorChange.change_history || [];
      history.push({
        status: "Cancelled",
        date: new Date(),
        by_user_id: uid,
        action: "Cancelled by sales team",
      });

      await operatorChange.update({
        change_status: "Cancelled",
        change_history: history,
        overall_status: "Cancelled",
      });

      results.push(operatorChange);
    }

    res.json({
      message: "Operator changes cancelled successfully",
      operatorChanges: results,
    });
  } catch (error) {
    console.error("Error cancelling operator change:", error);
    res.status(500).json({ message: "Failed to cancel change" });
  }
});

// Resubmit operator change after return (Operations team)
router.post("/resubmit", verifyToken, async (req, res) => {
  try {
    const { swap_ids_arr } = req.body;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        uid = user.uid;
      }
    }
    const { change_estimated_transfer_cost, change_remark } = req.body;

    const results = [];

    for (const id of swap_ids_arr) {
      const operatorChange = await OperatorChangeModel.findByPk(id);

      if (!operatorChange) {
        return res
          .status(404)
          .json({ message: `Operator change not found: ${id}` });
      }

      if (operatorChange.change_status !== "Return") {
        return res.status(400).json({
          message: "Only returned changes can be resubmitted",
        });
      }

      const history = operatorChange.change_history || [];
      history.push({
        status: "Resubmit",
        date: new Date(),
        by_user_id: uid,
        action: "Resubmitted after corrections",
      });

      const updateData = {
        change_status: "Resubmit",
        change_submitted_by: uid,
        change_submitted_at: new Date(),
        change_return_reason: null,
        change_return_date: null,
        change_history: history,
        overall_status: "Awaiting Sales confirmation",
      };

      if (change_estimated_transfer_cost !== undefined) {
        updateData.change_estimated_transfer_cost =
          change_estimated_transfer_cost;
      }
      if (change_remark !== undefined) {
        updateData.change_remark = change_remark;
      }

      await operatorChange.update(updateData);

      results.push(operatorChange);
    }

    res.json({
      message: "Operator change resubmitted successfully",
      operatorChanges: results,
    });
  } catch (error) {
    console.error("Error resubmitting operator change:", error);
    res.status(500).json({ message: "Failed to resubmit change" });
  }
});

module.exports = router;
