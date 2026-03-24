// // routes/fleet-management/equipment-swap-routes.js
// const express = require("express");
// const {
//   getAllEquipmentTagNumbers,
//   getEquipmentSwapReasons,
//   createEquipmentSwap,
//   getEquipmentSwapById,
//   createEquipmentDeliveryNote,
//   createEquipmentOffHireNote,
//   getEquipmentDeliveryNoteSummary,
//   getEquipmentOffHireNoteSummary,
//   generateEquipmentDeliveryNotePDF,
//   generateEquipmentOffHireNotePDF,
//   uploadEquipmentDeliveryNote,
//   uploadEquipmentOffHireNote,
//   addTripToEquipmentDeliveryNote,
//   addTripToEquipmentOffHireNote,
//   submitEquipmentSwapRequest,
//   returnEquipmentSwapRequest,
//   approveEquipmentSwap,
//   rejectEquipmentSwap,
//   getSwapRequestCounts,
//   getLatestEquipmentDeliveryNote,
//   getEquipmentDeliveryNoteById,
//   submitEquipmentDNForApproval,
//   approveEquipmentDeliveryNote,
//   rejectEquipmentDeliveryNote,
//   generateEquipmentDNPDF,
//   closeEquipmentDeliveryNote,
//   deleteTripFromEquipmentDN,
//   uploadEquipmentDNChecklist,
//   downloadEquipmentDNChecklist,
//   updateTripInEquipmentDN,
  
// } = require("../../controllers/fleet-management/equipmentSwapController");
// const { verifyToken } = require("../../middleware/authMiddleware");
// const upload = require("../../middleware/uploadMiddleware");
// const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
// const { Op } = require("sequelize");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const router = express.Router();

// const dnStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "public/uploads/equipment-delivery-notes/";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, `edn-${uniqueSuffix}-${file.originalname}`);
//   },
// });

// const dnUpload = multer({
//   storage: dnStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowed = /pdf|jpg|jpeg|png/;
//     const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//     const mime = allowed.test(file.mimetype);
//     if (ext && mime) return cb(null, true);
//     cb(new Error("Only PDF and image files are allowed"));
//   },
// });

// // ─── Multer: checklist upload ─────────────────────────────────────────────────

// const checklistStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "public/uploads/equipment-dn-checklists/";
//     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const { trip_id, resource_id } = req.params;
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
//     cb(null, `checklist-trip${trip_id}-res${resource_id}-${uniqueSuffix}-${safe}`);
//   },
// });

// const checklistUpload = multer({
//   storage: checklistStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     const allowed = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
//     const ext = allowed.test(path.extname(file.originalname).toLowerCase());
//     const mime =
//       allowed.test(file.mimetype) ||
//       file.mimetype ===
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
//       file.mimetype ===
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
//       file.mimetype === "application/msword" ||
//       file.mimetype === "application/vnd.ms-excel";

//     if (ext && mime) return cb(null, true);
//     cb(new Error("Only PDF, images, Word, and Excel files are allowed"));
//   },
// });

// router.get("/swap-reasons", verifyToken, getEquipmentSwapReasons);
// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     EquipmentSwap:
//  *       type: object
//  *       required:
//  *         - sales_order_id
//  *         - previous_plate_no
//  *         - new_plate_no
//  *         - swap_date
//  *         - swap_reason
//  *       properties:
//  *         equipment_swap_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         sales_order_id:
//  *           type: integer
//  *           description: Sales order ID
//  *         allocation_id:
//  *           type: integer
//  *           description: Allocation ID
//  *         previous_equipment_serial:
//  *           type: integer
//  *           description: Previous equipment serial number
//  *         previous_plate_no:
//  *           type: string
//  *           description: Previous plate number
//  *         new_equipment_serial:
//  *           type: integer
//  *           description: New equipment serial number
//  *         new_plate_no:
//  *           type: string
//  *           description: New plate number
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
//  *     EquipmentDeliveryNote:
//  *       type: object
//  *       required:
//  *         - equipment_swap_id
//  *         - delivery_date
//  *       properties:
//  *         equipment_dn_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         equipment_swap_id:
//  *           type: integer
//  *           description: Equipment swap ID
//  *         dn_number:
//  *           type: string
//  *           description: Delivery note number
//  *         new_equipment_serial:
//  *           type: integer
//  *           description: New equipment serial number
//  *         new_plate_no:
//  *           type: string
//  *           description: New plate number
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
//  *     EquipmentOffHireNote:
//  *       type: object
//  *       required:
//  *         - equipment_swap_id
//  *         - off_hire_date
//  *       properties:
//  *         equipment_ohn_id:
//  *           type: integer
//  *           description: Auto-generated ID
//  *         equipment_swap_id:
//  *           type: integer
//  *           description: Equipment swap ID
//  *         ohn_number:
//  *           type: string
//  *           description: Off hire note number
//  *         previous_equipment_serial:
//  *           type: integer
//  *           description: Previous equipment serial number
//  *         previous_plate_no:
//  *           type: string
//  *           description: Previous plate number
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
//  *     EquipmentTagNumber:
//  *       type: object
//  *       properties:
//  *         serial_number:
//  *           type: integer
//  *           description: Equipment serial number
//  *         reg_number:
//  *           type: string
//  *           description: Equipment registration number
//  * 
//  *     DeliveryNoteSummary:
//  *       type: object
//  *       properties:
//  *         dn_number:
//  *           type: string
//  *           description: Delivery note number
//  *         equipment:
//  *           type: object
//  *           properties:
//  *             serial_number:
//  *               type: integer
//  *             reg_number:
//  *               type: string
//  *             vehicle_type:
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
//  *   name: Equipment Swaps
//  *   description: Equipment swap management endpoints
//  */

// /**
//  * @swagger
//  * /api/equipment-swaps/equipment-tag-numbers:
//  *   get:
//  *     summary: Get all equipment tag numbers for dropdown
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of equipment tag numbers
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
//  *                     $ref: '#/components/schemas/EquipmentTagNumber'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/equipment-tag-numbers", verifyToken, getAllEquipmentTagNumbers);

// /**
//  * @swagger
//  * /api/equipment-swaps/create:
//  *   post:
//  *     summary: Create an equipment swap
//  *     tags: [Equipment Swaps]
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
//  *               - previous_plate_no
//  *               - new_plate_no
//  *               - swap_date
//  *               - swap_reason
//  *             properties:
//  *               sales_order_id:
//  *                 type: integer
//  *                 example: 1
//  *               allocation_id:
//  *                 type: integer
//  *                 example: 1
//  *               previous_plate_no:
//  *                 type: string
//  *                 example: "ABC-123"
//  *               new_plate_no:
//  *                 type: string
//  *                 example: "XYZ-789"
//  *               swap_date:
//  *                 type: string
//  *                 format: date
//  *                 example: "2024-01-15"
//  *               swap_reason:
//  *                 type: string
//  *                 example: "Equipment breakdown"
//  *     responses:
//  *       201:
//  *         description: Equipment swap created successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 equipmentSwap:
//  *                   $ref: '#/components/schemas/EquipmentSwap'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Sales order or equipment not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/create", verifyToken, createEquipmentSwap);

// /**
//  * @swagger
//  * /api/equipment-swaps/{id}:
//  *   get:
//  *     summary: Get equipment swap by ID with details
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment swap ID
//  *     responses:
//  *       200:
//  *         description: Equipment swap details
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 equipmentSwap:
//  *                   $ref: '#/components/schemas/EquipmentSwap'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Equipment swap not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/:id", verifyToken, getEquipmentSwapById);

// /**
//  * @swagger
//  * /api/equipment-swaps/{equipment_swap_id}/delivery-note:
//  *   post:
//  *     summary: Create equipment delivery note
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment swap ID
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
//  *                   $ref: '#/components/schemas/EquipmentDeliveryNote'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Equipment swap not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/:equipment_swap_id/delivery-note", verifyToken, createEquipmentDeliveryNote);

// /**
//  * @swagger
//  * /api/equipment-swaps/{equipment_swap_id}/off-hire-note:
//  *   post:
//  *     summary: Create equipment off hire note
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment swap ID
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
//  *                   $ref: '#/components/schemas/EquipmentOffHireNote'
//  *       400:
//  *         description: Validation error
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: Equipment swap not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/:equipment_swap_id/off-hire-note", verifyToken, createEquipmentOffHireNote);

// /**
//  * @swagger
//  * /api/equipment-swaps/delivery-note/{equipment_dn_id}/summary:
//  *   get:
//  *     summary: Get equipment delivery note summary
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment delivery note ID
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
// router.get("/delivery-note/:equipment_dn_id/summary", verifyToken, getEquipmentDeliveryNoteSummary);

// /**
//  * @swagger
//  * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/summary:
//  *   get:
//  *     summary: Get equipment off hire note summary
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment off hire note ID
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
// router.get("/off-hire-note/:equipment_ohn_id/summary", verifyToken, getEquipmentOffHireNoteSummary);

// /**
//  * @swagger
//  * /api/equipment-swaps/delivery-note/{equipment_dn_id}/generate-pdf:
//  *   get:
//  *     summary: Generate equipment delivery note PDF
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment delivery note ID
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
// router.get("/delivery-note/:equipment_dn_id/generate-pdf", verifyToken, generateEquipmentDeliveryNotePDF);

// /**
//  * @swagger
//  * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/generate-pdf:
//  *   get:
//  *     summary: Generate equipment off hire note PDF
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment off hire note ID
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
// router.get("/off-hire-note/:equipment_ohn_id/generate-pdf", verifyToken, generateEquipmentOffHireNotePDF);

// /**
//  * @swagger
//  * /api/equipment-swaps/delivery-note/{equipment_dn_id}/upload:
//  *   post:
//  *     summary: Upload signed equipment delivery note
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment delivery note ID
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
// router.post("/delivery-note/:equipment_dn_id/upload", verifyToken, upload.single("delivery_attachment"), uploadEquipmentDeliveryNote);

// /**
//  * @swagger
//  * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/upload:
//  *   post:
//  *     summary: Upload signed equipment off hire note
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment off hire note ID
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
// router.post("/off-hire-note/:equipment_ohn_id/upload", verifyToken, upload.single("off_hire_attachment"), uploadEquipmentOffHireNote);

// /**
//  * @swagger
//  * /api/equipment-swaps/delivery-note/{equipment_dn_id}/add-trip:
//  *   post:
//  *     summary: Add trip to equipment delivery note
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_dn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment delivery note ID
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
// router.post("/delivery-note/:equipment_dn_id/add-trip", verifyToken, addTripToEquipmentDeliveryNote);

// /**
//  * @swagger
//  * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/add-trip:
//  *   post:
//  *     summary: Add trip to equipment off hire note
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_ohn_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment off hire note ID
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
// router.post("/off-hire-note/:equipment_ohn_id/add-trip", verifyToken, addTripToEquipmentOffHireNote);

// /**
//  * @swagger
//  * /api/equipment-swaps/delivery-note/{equipment_swap_id}/latest:
//  *   get:
//  *     summary: Get latest equipment delivery note for swap
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment swap ID
//  *     responses:
//  *       200:
//  *         description: Latest delivery note
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 deliveryNote:
//  *                   $ref: '#/components/schemas/EquipmentDeliveryNote'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: No delivery note found
//  *       500:
//  *         description: Server error
//  */
// router.get("/delivery-note/:equipment_swap_id/latest", verifyToken, async (req, res) => {
//   try {
//     const { equipment_swap_id } = req.params;
    
//     const EquipmentDeliveryNoteModel = require("../../models/fleet-management/EquipmentDeliveryNoteModel").EquipmentDeliveryNoteModel;
    
//     const deliveryNote = await EquipmentDeliveryNoteModel.findOne({
//       where: { equipment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: require("../../models/fleet-management/EquipmentDeliveryNoteModel").EquipmentDeliveryNoteTripModel,
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
//  * /api/equipment-swaps/off-hire-note/{equipment_swap_id}/latest:
//  *   get:
//  *     summary: Get latest equipment off hire note for swap
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Equipment swap ID
//  *     responses:
//  *       200:
//  *         description: Latest off hire note
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 offHireNote:
//  *                   $ref: '#/components/schemas/EquipmentOffHireNote'
//  *       401:
//  *         description: Unauthorized
//  *       404:
//  *         description: No off hire note found
//  *       500:
//  *         description: Server error
//  */
// router.get("/off-hire-note/:equipment_swap_id/latest", verifyToken, async (req, res) => {
//   try {
//     const { equipment_swap_id } = req.params;
    
//     const EquipmentOffHireNoteModel = require("../../models/fleet-management/EquipmentOffHireNoteModel").EquipmentOffHireNoteModel;
    
//     const offHireNote = await EquipmentOffHireNoteModel.findOne({
//       where: { equipment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: require("../../models/fleet-management/EquipmentOffHireNoteModel").EquipmentOffHireNoteTripModel,
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
//  * /api/equipment-swaps/sales-order/{sales_order_id}:
//  *   get:
//  *     summary: Get all equipment swaps for sales order
//  *     tags: [Equipment Swaps]
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
//  *         description: List of equipment swaps
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 totalCount:
//  *                   type: integer
//  *                 equipmentSwaps:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/EquipmentSwap'
//  *       401:
//  *         description: Unauthorized
//  *       500:
//  *         description: Server error
//  */
// router.get("/sales-order/:sales_order_id", verifyToken, async (req, res) => {
//   try {
//     const { sales_order_id } = req.params;
    
//     const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
//     const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
//     const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
    
//     const equipmentSwaps = await EquipmentSwapModel.findAll({
//       where: { sales_order_id },
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"]
//         },
//         {
//           model: EquipmentModel,
//           as: "previousEquipment",
//           attributes: ["serial_number", "reg_number", "vehicle_type"]
//         },
//         {
//           model: EquipmentModel,
//           as: "newEquipment",
//           attributes: ["serial_number", "reg_number", "vehicle_type"]
//         }
//       ],
//       order: [["created_at", "DESC"]]
//     });

//     res.status(200).json({
//       totalCount: equipmentSwaps.length,
//       equipmentSwaps
//     });
//   } catch (error) {
//     console.error("Error fetching equipment swaps:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// /**
//  * @swagger
//  * /api/equipment-swaps/submit/{equipment_swap_id}:
//  *   put:
//  *     summary: Submit equipment swap request with charges
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
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
//  *                 example: 1000.00
//  *               demobilization_charge:
//  *                 type: number
//  *                 example: 1000.00
//  *     responses:
//  *       200:
//  *         description: Equipment swap submitted successfully
//  *       400:
//  *         description: Validation error
//  *       404:
//  *         description: Equipment swap not found
//  */
// router.put("/submit/:equipment_swap_id", verifyToken, submitEquipmentSwapRequest);

// /**
//  * @swagger
//  * /api/equipment-swaps/return/{equipment_swap_id}:
//  *   put:
//  *     summary: Return equipment swap request with reason
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
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
//  *         description: Equipment swap returned successfully
//  *       400:
//  *         description: Validation error
//  *       404:
//  *         description: Equipment swap not found
//  */
// router.put("/return/:equipment_swap_id", verifyToken, returnEquipmentSwapRequest);

// /**
//  * @swagger
//  * /api/equipment-swaps/approve/{equipment_swap_id}:
//  *   put:
//  *     summary: Approve equipment swap request
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Equipment swap approved successfully
//  *       404:
//  *         description: Equipment swap not found
//  */
// router.put("/approve/:equipment_swap_id", verifyToken, approveEquipmentSwap);

// /**
//  * @swagger
//  * /api/equipment-swaps/reject/{equipment_swap_id}:
//  *   put:
//  *     summary: Reject equipment swap request
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
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
//  *         description: Equipment swap rejected successfully
//  *       404:
//  *         description: Equipment swap not found
//  */
// router.put("/reject/:equipment_swap_id", verifyToken, rejectEquipmentSwap);


// // /**
// //  * @swagger
// //  * /api/equipment-swaps/pending-requests:
// //  *   get:
// //  *     summary: Get all pending equipment swap requests for sales team
// //  *     tags: [Equipment Swaps]
// //  *     security:
// //  *       - bearerAuth: []
// //  *     parameters:
// //  *       - in: query
// //  *         name: sales_order_id
// //  *         schema:
// //  *           type: integer
// //  *         description: Filter by sales order ID (optional)
// //  *     responses:
// //  *       200:
// //  *         description: List of pending equipment swap requests
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 success:
// //  *                   type: boolean
// //  *                 totalCount:
// //  *                   type: integer
// //  *                 pendingCount:
// //  *                   type: integer
// //  *                 resubmitCount:
// //  *                   type: integer
// //  *                 equipmentSwaps:
// //  *                   type: array
// //  *                   items:
// //  *                     $ref: '#/components/schemas/EquipmentSwap'
// //  */
// // router.get("/pending-requests", verifyToken, getPendingEquipmentSwapRequests);

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

// // equipment-swaps/update-swap-request/:id
// router.put('/update-swap-request/:id', verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { 
//       status, 
//       swap_mobilization_charge, 
//       swap_demobilization_charge,
//       swap_estimated_transfer_cost,
//       swap_sales_remark,
//       return_reason 
//     } = req.body;

//     const swap = await EquipmentSwapModel.findByPk(id);
//     if (!swap) {
//       return res.status(404).json({ message: 'Swap record not found' });
//     }

//     // Update swap request
//     const updateData = {
//       swap_status: status,
//       swap_mobilization_charge,
//       swap_demobilization_charge,
//       swap_estimated_transfer_cost,
//       swap_sales_remark,
//       return_reason: status === 'Return' ? return_reason : null,
//       updated_at: new Date(),
//     };

//     await swap.update(updateData);

//     // If returned, set status to Return for operations to see
//     if (status === 'Return') {
//       // You might want to create a notification for operations team
//     }

//     // If approved, you might want to trigger other actions
//     if (status === 'Approved') {
//       // Update allocation or trigger next steps
//     }

//     res.json({ 
//       message: 'Swap request updated successfully',
//       swap 
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Submit swap for approval (Operations team)
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
//       const equipmentSwap = await EquipmentSwapModel.findByPk(id);

//       if (!equipmentSwap) {
//         return res.status(404).json({ message: `Equipment swap not found: ${id}` });
//       }

//       if (equipmentSwap.swap_status !== "Pending") {
//         return res.status(400).json({
//           message: `Swap ID ${id} is not in Pending status`,
//         });
//       }

//       const history = equipmentSwap.swap_history || [];
//       history.push({
//         status: "Swap Request",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Submitted for approval",
//       });

//       await equipmentSwap.update({
//         swap_status: "Swap Request",
//         swap_submitted_by: userId,
//         swap_submitted_at: new Date(),
//         swap_history: history,
//         overall_status: "Awaiting Sales confirmation",
//       });

//       results.push(equipmentSwap);
//     }

//     res.json({
//       message: "Swap requests submitted for approval successfully",
//       equipmentSwaps: results,
//     });
//   } catch (error) {
//     console.error('Error submitting swap for approval:', error);
//     res.status(500).json({ message: 'Failed to submit swap for approval' });
//   }
// });

// // Approve swap (Sales team)
// router.post('/approve', verifyToken, async (req, res) => {
//   try {
//     const { swap_ids_arr } = req.body;
//     const { swap_mobilization_charge, swap_demobilization_charge } = req.body;
//     const userId = req.user.id;

//     const results = [];

//     for (const id of swap_ids_arr) {
//       const equipmentSwap = await EquipmentSwapModel.findByPk(id);

//       if (!equipmentSwap) {
//         return res
//           .status(404)
//           .json({ message: `Equipment swap not found: ${id}` });
//       }

//       if (!["Swap Request", "Resubmit"].includes(equipmentSwap.swap_status)) {
//         return res.status(400).json({
//           message: "Only swap requests can be approved",
//         });
//       }

//       if (!swap_mobilization_charge || !swap_demobilization_charge) {
//         return res.status(400).json({
//           message: "Both mobilization and demobilization charges are required",
//         });
//       }

//       // Update swap history
//       const history = equipmentSwap.swap_history || [];
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

//       await equipmentSwap.update({
//         swap_status: "Approved",
//         swap_mobilization_charge,
//         swap_demobilization_charge,
//         swap_approved_by: userId,
//         swap_approved_at: new Date(),
//         swap_history: history,
//         overall_status: "In progress",
//       });

//       results.push(equipmentSwap);
//     }

//     res.json({
//       message: "Swap request returned to operations team",
//       equipmentSwaps: results,
//     });
//   } catch (error) {
//     console.error('Error approving swap:', error);
//     res.status(500).json({ message: 'Failed to approve swap' });
//   }
// });

// // Return swap to operations (Sales team)
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
//       const equipmentSwap = await EquipmentSwapModel.findByPk(id);

//       if (!equipmentSwap) {
//         return res
//           .status(404)
//           .json({ message: `Equipment swap not found: ${id}` });
//       }

//       if (!["Swap Request", "Resubmit"].includes(equipmentSwap.swap_status)) {
//         return res.status(400).json({
//           message: "Only swap requests can be returned",
//         });
//       }

//       // Update swap history
//       const history = equipmentSwap.swap_history || [];
//       history.push({
//         status: "Return",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Returned by sales team",
//         reason: return_reason.trim(),
//       });

//       await equipmentSwap.update({
//         swap_status: "Return",
//         swap_return_reason: return_reason.trim(),
//         swap_return_date: new Date(),
//         swap_history: history,
//         overall_status: "Return",
//       });

//       results.push(equipmentSwap);
//     }

//     res.json({
//       message: "Swap request returned to operations team",
//       equipmentSwaps: results,
//     });

//   } catch (error) {
//     console.error('Error returning swap:', error);
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
//       const equipmentSwap = await EquipmentSwapModel.findByPk(id);

//       if (!equipmentSwap) {
//         return res
//           .status(404)
//           .json({ message: `Equipment swap not found: ${id}` });
//       }

//       // Update swap history
//       const history = equipmentSwap.swap_history || [];
//       history.push({
//         status: "Cancelled",
//         date: new Date(),
//         by_user_id: userId,
//         action: "Cancelled by sales team",
//       });

//       await equipmentSwap.update({
//         swap_status: "Cancelled",
//         swap_history: history,
//         overall_status: "Cancelled",
//       });

//       results.push(equipmentSwap);
//     }

//     res.json({
//       message: "Swap request cancelled to operations team",
//       equipmentSwaps: results,
//     });

//   } catch (error) {
//     console.error('Error returning swap:', error);
//     res.status(500).json({ message: 'Failed to return swap', error: error });
//   }
// });

// // Resubmit swap after return (Operations team)
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
//       const equipmentSwap = await EquipmentSwapModel.findByPk(id);

//       if (!equipmentSwap) {
//         return res
//           .status(404)
//           .json({ message: `Equipment swap not found: ${id}` });
//       }

//       if (equipmentSwap.swap_status !== "Return") {
//         return res.status(400).json({
//           message: "Only returned swaps can be resubmitted",
//         });
//       }

//       // Update swap history
//       const history = equipmentSwap.swap_history || [];
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

//       // Update optional fields if provided
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

//       await equipmentSwap.update(updateData);

      
//     }

//     res.json({
//       message: "Swap request returned to operations team",
//       equipmentSwaps: results,
//     });

//   } catch (error) {
//     console.error('Error resubmitting swap:', error);
//     res.status(500).json({ message: 'Failed to resubmit swap' });
//   }
// });

// /**
//  * @swagger
//  * /api/equipment-swaps/{equipment_swap_id}/swap-request:
//  *   post:
//  *     summary: Submit equipment swap request
//  *     tags: [Equipment Swaps]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: equipment_swap_id
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
//  *         description: Equipment swap not found
//  */
// router.post("/:equipment_swap_id/swap-request", verifyToken, async (req, res) => {
//   try {
//     const { equipment_swap_id } = req.params;
//     const {
//       sales_order_id,
//       estimated_cost,
//       remark,
//       mobilization_charge,
//       demobilization_charge
//     } = req.body;

//     // Find the equipment swap
//     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id);
//     if (!equipmentSwap) {
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     // Update swap status
//     await equipmentSwap.update({
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
//       swap_type: "equipment",
//       swap_id: equipment_swap_id,
//       status: "Swap Request",
//       estimated_cost,
//       remark,
//       mobilization_charge,
//       demobilization_charge,
//       created_at: new Date()
//     });

//     res.status(200).json({
//       message: "Equipment swap request submitted successfully",
//       swapRequest,
//       equipmentSwap
//     });
//   } catch (error) {
//     console.error("Error submitting equipment swap request:", error);
//     res.status(500).json({ message: "Failed to submit swap request" });
//   }
// });

// // router.get("/equipment-swaps/pending-requests", verifyToken, async (req, res) => {
// //   try {
// //     const { sales_order_id } = req.query;
    
// //     const whereClause = {
// //       [Op.or]: [
// //         { swap_status: "Swap Request" },
// //         { swap_status: "Return" },
// //         { swap_status: "Resubmit" }
// //       ]
// //     };

// //     if (sales_order_id) {
// //       whereClause.sales_order_id = sales_order_id;
// //     }

// //     const equipmentSwaps = await EquipmentSwapModel.findAll({
// //       where: whereClause,
// //       order: [["created_at", "DESC"]]
// //     });

// //     res.status(200).json({
// //       success: true,
// //       totalCount: equipmentSwaps.length,
// //       equipmentSwaps
// //     });
// //   } catch (error) {
// //     console.error("Error fetching pending equipment swaps:", error);
// //     res.status(500).json({ 
// //       success: false, 
// //       message: "Failed to fetch pending equipment swaps" 
// //     });
// //   }
// // });

// router.get("/equipment-swaps/pending-requests", verifyToken, async (req, res) => {
//   try {
//     console.log("GET /api/equipment-swaps/pending-requests called");
//     const { sales_order_id } = req.query;
    
//     // Import models inside the function to avoid circular dependencies
//     const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
    
//     // Build where clause
//     const whereClause = {};
    
//     // Only filter by sales_order_id if provided
//     if (sales_order_id) {
//       whereClause.sales_order_id = sales_order_id;
//     }
    
//     // Filter by swap_status
//     whereClause.swap_status = ["Swap Request", "Return", "Resubmit"];

//     console.log("Where clause:", JSON.stringify(whereClause));

//     // Simple query without complex includes
//     const equipmentSwaps = await EquipmentSwapModel.findAll({
//       where: whereClause,
//       order: [["created_at", "DESC"]],
//       limit: 50
//     });

//     console.log(`Found ${equipmentSwaps.length} swaps`);

//     // Count by status
//     const statusCounts = {
//       "Swap Request": 0,
//       "Return": 0,
//       "Resubmit": 0
//     };
    
//     equipmentSwaps.forEach(swap => {
//       if (statusCounts[swap.swap_status] !== undefined) {
//         statusCounts[swap.swap_status]++;
//       }
//     });

//     res.status(200).json({
//       success: true,
//       totalCount: equipmentSwaps.length,
//       pendingCount: statusCounts["Swap Request"],
//       returnCount: statusCounts["Return"],
//       resubmitCount: statusCounts["Resubmit"],
//       equipmentSwaps: equipmentSwaps.map(swap => ({
//         equipment_swap_id: swap.equipment_swap_id,
//         sales_order_id: swap.sales_order_id,
//         previous_plate_no: swap.previous_plate_no,
//         new_plate_no: swap.new_plate_no,
//         swap_status: swap.swap_status,
//         swap_reason: swap.swap_reason,
//         created_at: swap.created_at,
//         updated_at: swap.updated_at
//       }))
//     });
//   } catch (error) {
//     console.error("Error in /pending-requests:", error);
//     res.status(500).json({ 
//       success: false, 
//       message: "Failed to fetch pending equipment swaps",
//       error: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// });

// /**
//  * GET /api/equipment-delivery-notes/swap/:equipment_swap_id/latest
//  * Get the latest delivery note for a given swap
//  */
// router.get(
//   "/swap/:equipment_swap_id/latest",
//   verifyToken,
//   getLatestEquipmentDeliveryNote
// );

// /**
//  * GET /api/equipment-delivery-notes/:equipment_dn_id
//  * Get a specific delivery note by its ID
//  */
// router.get(
//   "/:equipment_dn_id",
//   verifyToken,
//   getEquipmentDeliveryNoteById
// );

// /**
//  * PUT /api/equipment-swaps/delivery-note/:equipment_dn_id/submit-approval
//  * Submit delivery note for approval (Creation → Under Approval)
//  */
// router.put(
//   "/delivery-note/:equipment_dn_id/submit-approval",
//   verifyToken,
//   submitEquipmentDNForApproval
// );

// /**
//  * PUT /api/equipment-delivery-notes/:equipment_dn_id/approve
//  * Approve delivery note (Under Approval → Approved)
//  */
// router.put(
//   "/delivery-note/:equipment_dn_id/approve",
//   verifyToken,
//   approveEquipmentDeliveryNote
// );

// /**
//  * PUT /api/equipment-delivery-notes/:equipment_dn_id/reject
//  * Reject delivery note (Under Approval → Rejected)
//  */
// router.put(
//   "/delivery-note/:equipment_dn_id/reject",
//   verifyToken,
//   rejectEquipmentDeliveryNote
// );

// /**
//  * GET /api/equipment-delivery-notes/:equipment_dn_id/generate-pdf
//  * Generate PDF and transition status (Approved → In Progress)
//  */
// router.get(
//   "/delivery-note/:equipment_dn_id/generate-pdf",
//   verifyToken,
//   generateEquipmentDNPDF
// );

// /**
//  * PUT /api/equipment-delivery-notes/:equipment_dn_id/close
//  * Close delivery note (Completed → Close)
//  */
// router.put(
//   "/delivery-note/:equipment_dn_id/close",
//   verifyToken,
//   closeEquipmentDeliveryNote
// );

// /**
//  * PUT /api/equipment-delivery-notes/trips/:trip_id
//  * Update a trip (only in Creation status)
//  */
// router.put(
//   "/trips/:trip_id",
//   verifyToken,
//   updateTripInEquipmentDN
// );

// /**
//  * DELETE /api/equipment-delivery-notes/trips/:trip_id
//  * Delete a trip (only in Creation status)
//  */
// router.delete(
//   "/trips/:trip_id",
//   verifyToken,
//   deleteTripFromEquipmentDN
// );

// /**
//  * POST /api/equipment-delivery-notes/trips/:trip_id/equipment/:resource_id/checklist/upload
//  * Upload a checklist file for an equipment resource in a trip
//  */
// router.post(
//   "/trips/:trip_id/equipment/:resource_id/checklist/upload",
//   verifyToken,
//   checklistUpload.single("checklist"),
//   uploadEquipmentDNChecklist
// );

// /**
//  * GET /api/equipment-delivery-notes/trips/:trip_id/equipment/:resource_id/checklist/download
//  * Download the uploaded checklist for an equipment resource
//  */
// router.get(
//   "/trips/:trip_id/equipment/:resource_id/checklist/download",
//   verifyToken,
//   downloadEquipmentDNChecklist
// );

// module.exports = router;

// routes/fleet-management/equipment-swap-routes.js
const express = require("express");
const {
  // Equipment Tag Numbers
  getAllEquipmentTagNumbers,
  getEquipmentSwapReasons,

  // Swap Creation & Retrieval
  createEquipmentSwap,
  getEquipmentSwapById,

  // Delivery Note Functions
  createEquipmentDeliveryNote,
  getEquipmentDeliveryNoteById,
  getLatestEquipmentDeliveryNote,
  getEquipmentDeliveryNoteSummary,
  submitEquipmentDNForApproval,
  approveEquipmentDeliveryNote,
  rejectEquipmentDeliveryNote,
  generateEquipmentDeliveryNotePDF,
  generateEquipmentDNPDF,
  closeEquipmentDeliveryNote,
  uploadEquipmentDeliveryNote,
  addTripToEquipmentDeliveryNote,
  updateTripInEquipmentDN,
  deleteTripFromEquipmentDN,
  uploadEquipmentDNChecklist,
  downloadEquipmentDNChecklist,

  // Off Hire Note Functions (Enhanced)
  createEquipmentOffHireNote,
  getEquipmentOffHireNoteById,
  getLatestEquipmentOffHireNote,
  getEquipmentOffHireNoteSummary,
  submitEquipmentOHNForApproval,
  approveEquipmentOffHireNote,
  rejectEquipmentOffHireNote,
  generateEquipmentOffHireNotePDF,
  generateEquipmentOHNPDF,
  closeEquipmentOffHireNote,
  uploadEquipmentOffHireNote,
  addTripToEquipmentOffHireNote,
  updateTripInEquipmentOHN,
  deleteTripFromEquipmentOHN,
  uploadEquipmentOHNChecklist,
  downloadEquipmentOHNChecklist,

  // Swap Request Management
  submitEquipmentSwapRequest,
  returnEquipmentSwapRequest,
  approveEquipmentSwap,
  rejectEquipmentSwap,
  getSwapRequestCounts,

    // DN Trip Status
  submitDNTripForApproval,
  approveDNTrip,
  rejectDNTrip,
  generateDNTripPDF,
  completeDNTrip,
  closeDNTrip,
  generateEquipmentDeliveryNotePDFForTrip,
  uploadEquipmentDeliveryNoteToTrip,

  // OHN Trip Status
  submitOHNTripForApproval,
  approveOHNTrip,
  rejectOHNTrip,
  generateOHNTripPDF,
  completeOHNTrip,
  closeOHNTrip,
  generateEquipmentOffHireNotePDFForTrip,
  uploadEquipmentOffHireNoteToTrip,
} = require("../../controllers/fleet-management/equipmentSwapController");
const { verifyToken } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/uploadMiddleware");
const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
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
    const dir = "public/uploads/equipment-delivery-notes/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `edn-${uniqueSuffix}-${file.originalname}`);
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
    const dir = "public/uploads/equipment-off-hire-notes/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `eohn-${uniqueSuffix}-${file.originalname}`);
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
    const dir = "public/uploads/equipment-dn-checklists/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { trip_id, resource_id } = req.params;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(
      null,
      `checklist-dn-trip${trip_id}-res${resource_id}-${uniqueSuffix}-${safe}`
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
    const dir = "public/uploads/equipment-ohn-checklists/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const { trip_id, resource_id } = req.params;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safe = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(
      null,
      `checklist-ohn-trip${trip_id}-res${resource_id}-${uniqueSuffix}-${safe}`
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
      file.mikmime === "application/msword" ||
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
 *     EquipmentSwap:
 *       type: object
 *       required:
 *         - sales_order_id
 *         - previous_plate_no
 *         - new_plate_no
 *         - swap_date
 *         - swap_reason
 *       properties:
 *         equipment_swap_id:
 *           type: integer
 *           description: Auto-generated ID
 *         sales_order_id:
 *           type: integer
 *           description: Sales order ID
 *         allocation_id:
 *           type: integer
 *           description: Allocation ID
 *         previous_equipment_serial:
 *           type: integer
 *           description: Previous equipment serial number
 *         previous_plate_no:
 *           type: string
 *           description: Previous plate number
 *         new_equipment_serial:
 *           type: integer
 *           description: New equipment serial number
 *         new_plate_no:
 *           type: string
 *           description: New plate number
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
 *     EquipmentDeliveryNote:
 *       type: object
 *       required:
 *         - equipment_swap_id
 *         - delivery_date
 *       properties:
 *         equipment_dn_id:
 *           type: integer
 *           description: Auto-generated ID
 *         equipment_swap_id:
 *           type: integer
 *           description: Equipment swap ID
 *         dn_number:
 *           type: string
 *           description: Delivery note number
 *         new_equipment_serial:
 *           type: integer
 *           description: New equipment serial number
 *         new_plate_no:
 *           type: string
 *           description: New plate number
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
 *     EquipmentOffHireNote:
 *       type: object
 *       required:
 *         - equipment_swap_id
 *         - off_hire_date
 *       properties:
 *         equipment_ohn_id:
 *           type: integer
 *           description: Auto-generated ID
 *         equipment_swap_id:
 *           type: integer
 *           description: Equipment swap ID
 *         ohn_number:
 *           type: string
 *           description: Off hire note number
 *         previous_equipment_serial:
 *           type: integer
 *           description: Previous equipment serial number
 *         previous_plate_no:
 *           type: string
 *           description: Previous plate number
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
 *         equipment:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               serial_number:
 *                 type: integer
 *               reg_number:
 *                 type: string
 *               equipment_type:
 *                 type: string
 *         remarks:
 *           type: string
 *           description: Trip remarks
 * 
 *     EquipmentTagNumber:
 *       type: object
 *       properties:
 *         serial_number:
 *           type: integer
 *           description: Equipment serial number
 *         reg_number:
 *           type: string
 *           description: Equipment registration number
 * 
 */

/**
 * @swagger
 * tags:
 *   name: Equipment Swaps
 *   description: Equipment swap management endpoints
 */

// ==================== PUBLIC ROUTES ====================

router.get("/swap-reasons", verifyToken, getEquipmentSwapReasons);
router.get("/equipment-tag-numbers", verifyToken, getAllEquipmentTagNumbers);

// ==================== SWAP CREATION & RETRIEVAL ====================

/**
 * @swagger
 * /api/equipment-swaps/create:
 *   post:
 *     summary: Create an equipment swap
 *     tags: [Equipment Swaps]
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
 *               - previous_plate_no
 *               - new_plate_no
 *               - swap_date
 *               - swap_reason
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 example: 1
 *               allocation_id:
 *                 type: integer
 *                 example: 1
 *               previous_plate_no:
 *                 type: string
 *                 example: "ABC-123"
 *               new_plate_no:
 *                 type: string
 *                 example: "XYZ-789"
 *               swap_date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               swap_reason:
 *                 type: string
 *                 example: "Equipment breakdown"
 *     responses:
 *       201:
 *         description: Equipment swap created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sales order or equipment not found
 *       500:
 *         description: Server error
 */
router.post("/create", verifyToken, createEquipmentSwap);

/**
 * @swagger
 * /api/equipment-swaps/{id}:
 *   get:
 *     summary: Get equipment swap by ID with details
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment swap ID
 *     responses:
 *       200:
 *         description: Equipment swap details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment swap not found
 *       500:
 *         description: Server error
 */
router.get("/:id", verifyToken, getEquipmentSwapById);

// ==================== DELIVERY NOTE ROUTES ====================

/**
 * @swagger
 * /api/equipment-swaps/{equipment_swap_id}/delivery-note:
 *   post:
 *     summary: Create equipment delivery note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment swap ID
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
 *         description: Equipment swap not found
 *       500:
 *         description: Server error
 */
router.post("/:equipment_swap_id/delivery-note", verifyToken, createEquipmentDeliveryNote);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}:
 *   get:
 *     summary: Get equipment delivery note by ID
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.get("/delivery-note/:equipment_dn_id", verifyToken, getEquipmentDeliveryNoteById);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/summary:
 *   get:
 *     summary: Get equipment delivery note summary
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.get("/delivery-note/:equipment_dn_id/summary", verifyToken, getEquipmentDeliveryNoteSummary);

/**
 * @swagger
 * /api/equipment-swaps/swap/{equipment_swap_id}/latest-delivery-note:
 *   get:
 *     summary: Get latest equipment delivery note for a swap
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment swap ID
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
router.get("/swap/:equipment_swap_id/latest-delivery-note", verifyToken, getLatestEquipmentDeliveryNote);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/submit-approval:
 *   put:
 *     summary: Submit delivery note for approval
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.put("/delivery-note/:equipment_dn_id/submit-approval", verifyToken, submitEquipmentDNForApproval);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/approve:
 *   put:
 *     summary: Approve delivery note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.put("/delivery-note/:equipment_dn_id/approve", verifyToken, approveEquipmentDeliveryNote);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/reject:
 *   put:
 *     summary: Reject delivery note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.put("/delivery-note/:equipment_dn_id/reject", verifyToken, rejectEquipmentDeliveryNote);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/generate-pdf:
 *   get:
 *     summary: Generate delivery note PDF data (for frontend)
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.get("/delivery-note/:equipment_dn_id/generate-pdf", verifyToken, generateEquipmentDNPDF);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/generate-pdf-legacy:
 *   get:
 *     summary: Generate delivery note PDF (legacy - full PDF)
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.get("/delivery-note/:equipment_dn_id/generate-pdf-legacy", verifyToken, generateEquipmentDeliveryNotePDF);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/close:
 *   put:
 *     summary: Close delivery note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.put("/delivery-note/:equipment_dn_id/close", verifyToken, closeEquipmentDeliveryNote);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/upload:
 *   post:
 *     summary: Upload signed equipment delivery note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
  "/delivery-note/:equipment_dn_id/upload",
  verifyToken,
  dnUpload.single("delivery_attachment"),
  uploadEquipmentDeliveryNote
);

/**
 * @swagger
 * /api/equipment-swaps/delivery-note/{equipment_dn_id}/add-trip:
 *   post:
 *     summary: Add trip to equipment delivery note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_dn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment delivery note ID
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
router.post("/delivery-note/:equipment_dn_id/add-trip", verifyToken, addTripToEquipmentDeliveryNote);

// ==================== OFF HIRE NOTE ROUTES (Enhanced) ====================

/**
 * @swagger
 * /api/equipment-swaps/{equipment_swap_id}/off-hire-note:
 *   post:
 *     summary: Create equipment off hire note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment swap ID
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
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Equipment swap not found
 *       500:
 *         description: Server error
 */
router.post("/:equipment_swap_id/off-hire-note", verifyToken, createEquipmentOffHireNote);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}:
 *   get:
 *     summary: Get equipment off hire note by ID
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.get("/off-hire-note/:equipment_ohn_id", verifyToken, getEquipmentOffHireNoteById);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/summary:
 *   get:
 *     summary: Get equipment off hire note summary
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.get("/off-hire-note/:equipment_ohn_id/summary", verifyToken, getEquipmentOffHireNoteSummary);

/**
 * @swagger
 * /api/equipment-swaps/swap/{equipment_swap_id}/latest-off-hire-note:
 *   get:
 *     summary: Get latest equipment off hire note for a swap
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment swap ID
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
router.get("/swap/:equipment_swap_id/latest-off-hire-note", verifyToken, getLatestEquipmentOffHireNote);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/submit-approval:
 *   put:
 *     summary: Submit off hire note for approval
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.put("/off-hire-note/:equipment_ohn_id/submit-approval", verifyToken, submitEquipmentOHNForApproval);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/approve:
 *   put:
 *     summary: Approve off hire note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.put("/off-hire-note/:equipment_ohn_id/approve", verifyToken, approveEquipmentOffHireNote);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/reject:
 *   put:
 *     summary: Reject off hire note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.put("/off-hire-note/:equipment_ohn_id/reject", verifyToken, rejectEquipmentOffHireNote);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/generate-pdf:
 *   get:
 *     summary: Generate off hire note PDF data (for frontend)
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.get("/off-hire-note/:equipment_ohn_id/generate-pdf", verifyToken, generateEquipmentOHNPDF);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/generate-pdf-legacy:
 *   get:
 *     summary: Generate off hire note PDF (legacy - full PDF)
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.get("/off-hire-note/:equipment_ohn_id/generate-pdf-legacy", verifyToken, generateEquipmentOffHireNotePDF);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/close:
 *   put:
 *     summary: Close off hire note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.put("/off-hire-note/:equipment_ohn_id/close", verifyToken, closeEquipmentOffHireNote);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/upload:
 *   post:
 *     summary: Upload signed equipment off hire note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
  "/off-hire-note/:equipment_ohn_id/upload",
  verifyToken,
  ohnUpload.single("off_hire_attachment"),
  uploadEquipmentOffHireNote
);

/**
 * @swagger
 * /api/equipment-swaps/off-hire-note/{equipment_ohn_id}/add-trip:
 *   post:
 *     summary: Add trip to equipment off hire note
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_ohn_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment off hire note ID
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
router.post("/off-hire-note/:equipment_ohn_id/add-trip", verifyToken, addTripToEquipmentOffHireNote);

// ==================== TRIP MANAGEMENT ROUTES (DN) ====================

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}:
 *   put:
 *     summary: Update a trip in equipment delivery note
 *     tags: [Equipment Swaps]
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
router.put("/trips/delivery-note/:trip_id", verifyToken, updateTripInEquipmentDN);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}:
 *   delete:
 *     summary: Delete a trip from equipment delivery note
 *     tags: [Equipment Swaps]
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
router.delete("/trips/delivery-note/:trip_id", verifyToken, deleteTripFromEquipmentDN);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/equipment/{resource_id}/checklist/upload:
 *   post:
 *     summary: Upload checklist for equipment resource in DN trip
 *     tags: [Equipment Swaps]
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
  "/trips/delivery-note/:trip_id/equipment/:resource_id/checklist/upload",
  verifyToken,
  checklistUpload.single("checklist"),
  uploadEquipmentDNChecklist
);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/equipment/{resource_id}/checklist/download:
 *   get:
 *     summary: Download checklist for equipment resource in DN trip
 *     tags: [Equipment Swaps]
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
  "/trips/delivery-note/:trip_id/equipment/:resource_id/checklist/download",
  verifyToken,
  downloadEquipmentDNChecklist
);

// ==================== TRIP MANAGEMENT ROUTES (OHN) ====================

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}:
 *   put:
 *     summary: Update a trip in equipment off hire note
 *     tags: [Equipment Swaps]
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
router.put("/trips/off-hire-note/:trip_id", verifyToken, updateTripInEquipmentOHN);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}:
 *   delete:
 *     summary: Delete a trip from equipment off hire note
 *     tags: [Equipment Swaps]
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
router.delete("/trips/off-hire-note/:trip_id", verifyToken, deleteTripFromEquipmentOHN);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/equipment/{resource_id}/checklist/upload:
 *   post:
 *     summary: Upload checklist for equipment resource in OHN trip
 *     tags: [Equipment Swaps]
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
  "/trips/off-hire-note/:trip_id/equipment/:resource_id/checklist/upload",
  verifyToken,
  ohnChecklistUpload.single("checklist"),
  uploadEquipmentOHNChecklist
);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/equipment/{resource_id}/checklist/download:
 *   get:
 *     summary: Download checklist for equipment resource in OHN trip
 *     tags: [Equipment Swaps]
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
  "/trips/off-hire-note/:trip_id/equipment/:resource_id/checklist/download",
  verifyToken,
  downloadEquipmentOHNChecklist
);

// ==================== SWAP REQUEST MANAGEMENT ====================

/**
 * @swagger
 * /api/equipment-swaps/submit/{equipment_swap_id}:
 *   put:
 *     summary: Submit equipment swap request with charges
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
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
 *                 example: 1000.00
 *               demobilization_charge:
 *                 type: number
 *                 example: 1000.00
 *     responses:
 *       200:
 *         description: Equipment swap submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Equipment swap not found
 */
router.put("/submit/:equipment_swap_id", verifyToken, submitEquipmentSwapRequest);

/**
 * @swagger
 * /api/equipment-swaps/return/{equipment_swap_id}:
 *   put:
 *     summary: Return equipment swap request with reason
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
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
 *         description: Equipment swap returned successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Equipment swap not found
 */
router.put("/return/:equipment_swap_id", verifyToken, returnEquipmentSwapRequest);

/**
 * @swagger
 * /api/equipment-swaps/approve/{equipment_swap_id}:
 *   put:
 *     summary: Approve equipment swap request
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Equipment swap approved successfully
 *       404:
 *         description: Equipment swap not found
 */
router.put("/approve/:equipment_swap_id", verifyToken, approveEquipmentSwap);

/**
 * @swagger
 * /api/equipment-swaps/reject/{equipment_swap_id}:
 *   put:
 *     summary: Reject equipment swap request
 *     tags: [Equipment Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: equipment_swap_id
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
 *         description: Equipment swap rejected successfully
 *       404:
 *         description: Equipment swap not found
 */
router.put("/reject/:equipment_swap_id", verifyToken, rejectEquipmentSwap);

/**
 * @swagger
 * /api/equipment-swaps/swap-requests/counts:
 *   get:
 *     summary: Get counts of pending swap requests for notification badge
 *     tags: [Equipment Swaps]
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
 *                 equipmentSwapCount:
 *                   type: integer
 *                 totalSwapCount:
 *                   type: integer
 */
router.get("/swap-requests/counts", verifyToken, getSwapRequestCounts);

// ─── DN Trip Status Routes ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/submit-approval:
 *   put:
 *     summary: Submit a single DN trip for approval
 *     tags: [Equipment Swaps]
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
router.put("/trips/delivery-note/:trip_id/submit-approval", verifyToken, submitDNTripForApproval);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/approve:
 *   put:
 *     summary: Approve a single DN trip
 *     tags: [Equipment Swaps]
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
 *         description: Trip approved successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/approve", verifyToken, approveDNTrip);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/reject:
 *   put:
 *     summary: Reject a single DN trip
 *     tags: [Equipment Swaps]
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
 *                 example: "Incomplete trip details"
 *     responses:
 *       200:
 *         description: Trip rejected successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/reject", verifyToken, rejectDNTrip);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/generate-pdf:
 *   get:
 *     summary: Generate PDF for a single DN trip (moves status to In Progress)
 *     tags: [Equipment Swaps]
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
 *         description: Trip PDF data returned, status moved to In Progress
 *       404:
 *         description: Trip not found
 */
router.get("/trips/delivery-note/:trip_id/generate-pdf", verifyToken, generateDNTripPDF);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/complete:
 *   put:
 *     summary: Complete a single DN trip (In Progress → Completed)
 *     tags: [Equipment Swaps]
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
 *         description: Trip completed successfully
 *       400:
 *         description: Trip must be In Progress to complete
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/complete", verifyToken, completeDNTrip);

/**
 * @swagger
 * /api/equipment-swaps/trips/delivery-note/{trip_id}/close:
 *   put:
 *     summary: Close a single DN trip (Completed or Rejected → Close)
 *     tags: [Equipment Swaps]
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
 *         description: Trip closed successfully
 *       400:
 *         description: Only Completed or Rejected trips can be closed
 *       404:
 *         description: Trip not found
 */
router.put("/trips/delivery-note/:trip_id/close", verifyToken, closeDNTrip);


// ─── OHN Trip Status Routes ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/submit-approval:
 *   put:
 *     summary: Submit a single OHN trip for approval
 *     tags: [Equipment Swaps]
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
router.put("/trips/off-hire-note/:trip_id/submit-approval", verifyToken, submitOHNTripForApproval);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/approve:
 *   put:
 *     summary: Approve a single OHN trip
 *     tags: [Equipment Swaps]
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
 *         description: Trip approved successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/approve", verifyToken, approveOHNTrip);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/reject:
 *   put:
 *     summary: Reject a single OHN trip
 *     tags: [Equipment Swaps]
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
 *                 example: "Incomplete trip details"
 *     responses:
 *       200:
 *         description: Trip rejected successfully
 *       400:
 *         description: Invalid status transition
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/reject", verifyToken, rejectOHNTrip);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/generate-pdf:
 *   get:
 *     summary: Generate PDF for a single OHN trip (moves status to In Progress)
 *     tags: [Equipment Swaps]
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
 *         description: Trip PDF data returned, status moved to In Progress
 *       404:
 *         description: Trip not found
 */
router.get("/trips/off-hire-note/:trip_id/generate-pdf", verifyToken, generateOHNTripPDF);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/complete:
 *   put:
 *     summary: Complete a single OHN trip (In Progress → Completed)
 *     tags: [Equipment Swaps]
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
 *         description: Trip completed successfully
 *       400:
 *         description: Trip must be In Progress to complete
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/complete", verifyToken, completeOHNTrip);

/**
 * @swagger
 * /api/equipment-swaps/trips/off-hire-note/{trip_id}/close:
 *   put:
 *     summary: Close a single OHN trip (Completed or Rejected → Close)
 *     tags: [Equipment Swaps]
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
 *         description: Trip closed successfully
 *       400:
 *         description: Only Completed or Rejected trips can be closed
 *       404:
 *         description: Trip not found
 */
router.put("/trips/off-hire-note/:trip_id/close", verifyToken, closeOHNTrip);

// ==================== TRIP DOCUMENT UPLOAD ROUTES ====================

router.post(
  "/trips/delivery-note/:trip_id/upload-delivery-note",
  verifyToken,
  dnUpload.single("delivery_attachment"),
  uploadEquipmentDeliveryNoteToTrip
);

router.post(
  "/trips/off-hire-note/:trip_id/upload-off-hire-note",
  verifyToken,
  ohnUpload.single("off_hire_attachment"),
  uploadEquipmentOffHireNoteToTrip
);

router.get(
  "/trips/delivery-note/:trip_id/generate-delivery-note-pdf",
  verifyToken,
  generateEquipmentDeliveryNotePDFForTrip
);

router.get(
  "/trips/off-hire-note/:trip_id/generate-off-hire-note-pdf",
  verifyToken,
  generateEquipmentOffHireNotePDFForTrip
);


// ==================== PENDING REQUESTS ====================

/**
 * @swagger
 * /api/equipment-swaps/pending-requests:
 *   get:
 *     summary: Get all pending equipment swap requests
 *     tags: [Equipment Swaps]
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
 *         description: List of pending equipment swap requests
 */
router.get("/pending-requests", verifyToken, async (req, res) => {
  try {
    const { sales_order_id } = req.query;

    // Build where clause
    const whereClause = {};

    // Only filter by sales_order_id if provided
    if (sales_order_id) {
      whereClause.sales_order_id = sales_order_id;
    }

    // Filter by swap_status
    whereClause.swap_status = ["Swap Request", "Return", "Resubmit"];

    // Simple query without complex includes
    const equipmentSwaps = await EquipmentSwapModel.findAll({
      where: whereClause,
      order: [["created_at", "DESC"]],
      limit: 50,
    });

    // Count by status
    const statusCounts = {
      "Swap Request": 0,
      Return: 0,
      Resubmit: 0,
    };

    equipmentSwaps.forEach((swap) => {
      if (statusCounts[swap.swap_status] !== undefined) {
        statusCounts[swap.swap_status]++;
      }
    });

    res.status(200).json({
      success: true,
      totalCount: equipmentSwaps.length,
      pendingCount: statusCounts["Swap Request"],
      returnCount: statusCounts["Return"],
      resubmitCount: statusCounts["Resubmit"],
      equipmentSwaps: equipmentSwaps.map((swap) => ({
        equipment_swap_id: swap.equipment_swap_id,
        sales_order_id: swap.sales_order_id,
        previous_plate_no: swap.previous_plate_no,
        new_plate_no: swap.new_plate_no,
        swap_status: swap.swap_status,
        swap_reason: swap.swap_reason,
        created_at: swap.created_at,
        updated_at: swap.updated_at,
      })),
    });
  } catch (error) {
    console.error("Error in /pending-requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending equipment swaps",
      error: error.message,
    });
  }
});

// ==================== LEGACY ROUTES (for backward compatibility) ====================

// Keep the old route format for compatibility
router.get("/delivery-note/:equipment_swap_id/latest", verifyToken, getLatestEquipmentDeliveryNote);
router.get("/off-hire-note/:equipment_swap_id/latest", verifyToken, getLatestEquipmentOffHireNote);

// Sales order specific
router.get("/sales-order/:sales_order_id", verifyToken, async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const equipmentSwaps = await EquipmentSwapModel.findAll({
      where: { sales_order_id },
      include: [
        {
          model: require("../../models/fleet-management/SalesOrdersModel"),
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: require("../../models/fleet-management/EquipmentModel"),
          as: "previousEquipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
        {
          model: require("../../models/fleet-management/EquipmentModel"),
          as: "newEquipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      totalCount: equipmentSwaps.length,
      equipmentSwaps,
    });
  } catch (error) {
    console.error("Error fetching equipment swaps:", error);
    res.status(500).json({ error: error.message });
  }
});

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

    if (!swap_ids_arr || !Array.isArray(swap_ids_arr) || swap_ids_arr.length === 0) {
      return res.status(400).json({
        message: "swap_ids_arr array is required",
      });
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const equipmentSwap = await EquipmentSwapModel.findByPk(id);

      if (!equipmentSwap) {
        return res
          .status(404)
          .json({ message: `Equipment swap not found: ${id}` });
      }

      if (equipmentSwap.swap_status !== "Pending") {
        return res.status(400).json({
          message: `Swap ID ${id} is not in Pending status`,
        });
      }

      const history = equipmentSwap.swap_history || [];
      history.push({
        status: "Swap Request",
        date: new Date(),
        by_user_id: uid,
        action: "Submitted for approval",
      });

      await equipmentSwap.update({
        swap_status: "Swap Request",
        swap_submitted_by: uid,
        swap_submitted_at: new Date(),
        swap_history: history,
        overall_status: "Awaiting Sales confirmation",
      });

      results.push(equipmentSwap);
    }

    res.json({
      message: "Swap requests submitted for approval successfully",
      equipmentSwaps: results,
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
      const equipmentSwap = await EquipmentSwapModel.findByPk(id);

      if (!equipmentSwap) {
        return res
          .status(404)
          .json({ message: `Equipment swap not found: ${id}` });
      }

      if (!["Swap Request", "Resubmit"].includes(equipmentSwap.swap_status)) {
        return res.status(400).json({
          message: "Only swap requests can be approved",
        });
      }

      if (!swap_mobilization_charge || !swap_demobilization_charge) {
        return res.status(400).json({
          message:
            "Both mobilization and demobilization charges are required",
        });
      }

      // Update swap history
      const history = equipmentSwap.swap_history || [];
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

      await equipmentSwap.update({
        swap_status: "Approved",
        swap_mobilization_charge,
        swap_demobilization_charge,
        swap_approved_by: uid,
        swap_approved_at: new Date(),
        swap_history: history,
        overall_status: "In progress",
      });

      results.push(equipmentSwap);
    }

    res.json({
      message: "Swap requests approved successfully",
      equipmentSwaps: results,
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

    if (!swap_ids_arr || !Array.isArray(swap_ids_arr) || swap_ids_arr.length === 0) {
      return res.status(400).json({
        message: "swap_ids_arr array is required",
      });
    }

    if (!return_reason || !return_reason.trim()) {
      return res.status(400).json({ message: "Return reason is required" });
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const equipmentSwap = await EquipmentSwapModel.findByPk(id);

      if (!equipmentSwap) {
        return res
          .status(404)
          .json({ message: `Equipment swap not found: ${id}` });
      }

      if (!["Swap Request", "Resubmit"].includes(equipmentSwap.swap_status)) {
        return res.status(400).json({
          message: "Only swap requests can be returned",
        });
      }

      // Update swap history
      const history = equipmentSwap.swap_history || [];
      history.push({
        status: "Return",
        date: new Date(),
        by_user_id: uid,
        action: "Returned by sales team",
        reason: return_reason.trim(),
      });

      await equipmentSwap.update({
        swap_status: "Return",
        swap_return_reason: return_reason.trim(),
        swap_return_date: new Date(),
        swap_history: history,
        overall_status: "Return",
      });

      results.push(equipmentSwap);
    }

    res.json({
      message: "Swap requests returned successfully",
      equipmentSwaps: results,
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

    if (!swap_ids_arr || !Array.isArray(swap_ids_arr) || swap_ids_arr.length === 0) {
      return res.status(400).json({
        message: "swap_ids_arr array is required",
      });
    }

    const results = [];

    for (const id of swap_ids_arr) {
      const equipmentSwap = await EquipmentSwapModel.findByPk(id);

      if (!equipmentSwap) {
        return res
          .status(404)
          .json({ message: `Equipment swap not found: ${id}` });
      }

      // Update swap history
      const history = equipmentSwap.swap_history || [];
      history.push({
        status: "Cancelled",
        date: new Date(),
        by_user_id: uid,
        action: "Cancelled",
      });

      await equipmentSwap.update({
        swap_status: "Cancelled",
        swap_history: history,
        overall_status: "Cancelled",
      });

      results.push(equipmentSwap);
    }

    res.json({
      message: "Swap requests cancelled successfully",
      equipmentSwaps: results,
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
      const equipmentSwap = await EquipmentSwapModel.findByPk(id);

      if (!equipmentSwap) {
        return res
          .status(404)
          .json({ message: `Equipment swap not found: ${id}` });
      }

      if (equipmentSwap.swap_status !== "Return") {
        return res.status(400).json({
          message: "Only returned swaps can be resubmitted",
        });
      }

      // Update swap history
      const history = equipmentSwap.swap_history || [];
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

      await equipmentSwap.update(updateData);

      results.push(equipmentSwap);
    }

    res.json({
      message: "Swap requests resubmitted successfully",
      equipmentSwaps: results,
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

    const swap = await EquipmentSwapModel.findByPk(id);
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