// routes/fleet-management/deliveryNoteRoutes.js
const express = require("express");
const {
  createDeliveryNote,
  getAllDeliveryNotes,
  getDeliveryNoteById,
  getDeliveryNoteByAllocation,
  confirmDeliveryNote,
  generateDeliveryNotePDF,
  updateDeliveryNoteStatus, // NEW
  updateTripStatus, // NEW
  getDeliveryNoteSummary, // NEW
  addTripToDeliveryNote, // NEW
  uploadDeliveryNoteAttachment, // NEW
  rejectDeliveryNote,
  saveDeliveryNote,
  submitForApproval,
  approveDeliveryNote,
  deleteTripFromDeliveryNote,
  approveTripInDeliveryNote,
  rejectTripInDeliveryNote,
  uploadResourceChecklist,
  downloadResourceChecklist,
  deleteResourceChecklist,
  updateDNStatusGeneric,
  updateTripInDeliveryNote,
  submitDNTripForApproval,
  approveDNTrip,
  rejectDNTrip,
  generateDNTripPDF,
  completeDNTrip,
  closeDNTrip,

} = require("../../controllers/fleet-management/deliveryNoteController");
const { verifyToken } = require("../../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/delivery-notes/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|jpg|jpeg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF and image files are allowed"));
    }
  },
});

const checklistStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { resource_type } = req.params;
    const uploadPath = `public/uploads/delivery-notes-template/checklist/${resource_type}/`;

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const { trip_id, resource_id } = req.params;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(
      null,
      `checklist-trip${trip_id}-${resource_id}-${uniqueSuffix}-${sanitizedFilename}`
    );
  }
});


const checklistUpload = multer({
  storage: checklistStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    // Allow PDF, images, Word docs, Excel files
    const allowedTypes = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.ms-excel';

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF, images, Word documents, and Excel files are allowed'));
    }
  }
});



/**
 * @swagger
 * /api/delivery-notes/create:
 *   post:
 *     tags:
 *       - Delivery Notes
 *     summary: Create a new delivery note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - allocation_id
 *               - delivery_date
 *               - trips
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *               allocation_id:
 *                 type: integer
 *               delivery_date:
 *                 type: string
 *                 format: date
 *               site_start_date:
 *                 type: string
 *                 format: date
 *               trips:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     trip_number:
 *                       type: integer
 *                     transportation_company:
 *                       type: string
 *                     driver_name:
 *                       type: string
 *                     driver_contact:
 *                       type: string
 *                     vehicle_type:
 *                       type: string
 *                     vehicle_number:
 *                       type: string
 *                     recovery_vehicle_number:
 *                       type: string
 *                     trip_date:
 *                       type: string
 *                       format: date
 *                     equipment:
 *                       type: array
 *                     manpower:
 *                       type: array
 *                     attachments:
 *                       type: array
 *                     subProducts:
 *                       type: array
 */
router.post("/create", verifyToken, createDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/trip/delete/{trip_id}:
 *   delete:
 *     tags:
 *       - Delivery Notes
 *     summary: Delete a trip from delivery note
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/trip/delete/:trip_id", verifyToken, deleteTripFromDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/trip/approve/{trip_id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Approve a specific trip
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/trip/approve/:trip_id", verifyToken, approveTripInDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/trip/reject/{trip_id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Reject a specific trip
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/trip/reject/:trip_id", verifyToken, rejectTripInDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/all:
 *   get:
 *     tags:
 *       - Delivery Notes
 *     summary: Get all delivery notes with pagination
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
 */
router.get("/all", verifyToken, getAllDeliveryNotes);

/**
 * @swagger
 * /api/delivery-notes/{id}:
 *   get:
 *     tags:
 *       - Delivery Notes
 *     summary: Get delivery note by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id", verifyToken, getDeliveryNoteById);

// /**
//  * @swagger
//  * /api/delivery-notes/by-allocation/{allocation_id}:
//  *   get:
//  *     tags:
//  *       - Delivery Notes
//  *     summary: Get delivery note by allocation ID
//  *     parameters:
//  *       - in: path
//  *         name: allocation_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.get("/by-allocation/:allocation_id", verifyToken, getDeliveryNoteByAllocation);

/**
 * @swagger
 * /api/delivery-notes/by-allocation/{allocation_id}:
 *   get:
 *     tags:
 *       - Delivery Notes
 *     summary: Get delivery note by allocation ID
 *     description: Retrieves a delivery note associated with a specific allocation, including sales order details, trips, equipment, manpower, and attachments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: allocation_id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 123
 *         description: The allocation ID to fetch the delivery note for
 *     responses:
 *       200:
 *         description: Delivery note retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dn_id:
 *                   type: integer
 *                   example: 1
 *                 dn_number:
 *                   type: string
 *                   example: "DN-2024-0001"
 *                 sales_order_id:
 *                   type: integer
 *                   example: 45
 *                 allocation_id:
 *                   type: integer
 *                   example: 123
 *                 delivery_date:
 *                   type: string
 *                   format: date
 *                   example: "2024-01-15"
 *                 site_start_date:
 *                   type: string
 *                   format: date
 *                   nullable: true
 *                   example: "2024-01-20"
 *                 delivery_address:
 *                   type: string
 *                   example: "123 Main St, Doha, Qatar"
 *                 status:
 *                   type: string
 *                   enum: [Creation, Under Approval, In Progress, Delivered, Cancelled]
 *                   example: "In Progress"
 *                 remarks:
 *                   type: string
 *                   nullable: true
 *                   example: "Handle with care"
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-10T10:30:00.000Z"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-10T10:30:00.000Z"
 *                 salesOrder:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 45
 *                     so_number:
 *                       type: string
 *                       example: "SO-2024-0001"
 *                     client:
 *                       type: string
 *                       example: "ABC Construction Ltd"
 *                     so_status:
 *                       type: string
 *                       example: "Approved"
 *                     project_name:
 *                       type: string
 *                       example: "Downtown Tower Project"
 *                 trips:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       trip_id:
 *                         type: integer
 *                         example: 1
 *                       dn_id:
 *                         type: integer
 *                         example: 1
 *                       trip_number:
 *                         type: integer
 *                         example: 1
 *                       trip_reference_number:
 *                         type: string
 *                         example: "TRIP-DN-2024-0001-001"
 *                       transportation_company:
 *                         type: string
 *                         example: "Fast Logistics"
 *                       driver_name:
 *                         type: string
 *                         example: "John Smith"
 *                       driver_contact:
 *                         type: string
 *                         example: "+974-12345678"
 *                       vehicle_type:
 *                         type: string
 *                         nullable: true
 *                         example: "Lorry"
 *                       vehicle_number:
 *                         type: string
 *                         nullable: true
 *                         example: "ABC-1234"
 *                       recovery_vehicle_number:
 *                         type: string
 *                         nullable: true
 *                         example: "BOOM-XYZ-5678"
 *                       trip_date:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                         example: "2024-01-15"
 *                       trip_status:
 *                         type: string
 *                         enum: [Creation, In Progress, Delivered, Cancelled]
 *                         example: "In Progress"
 *                       remarks:
 *                         type: string
 *                         nullable: true
 *                         example: "Delivery in morning"
 *                       equipment:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             trip_id:
 *                               type: integer
 *                               example: 1
 *                             serial_number:
 *                               type: integer
 *                               example: 12345
 *                             reg_number:
 *                               type: string
 *                               example: "EQ-001"
 *                             equipment_type:
 *                               type: string
 *                               example: "Excavator"
 *                       manpower:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             trip_id:
 *                               type: integer
 *                               example: 1
 *                             employee_id:
 *                               type: integer
 *                               example: 789
 *                             employee_no:
 *                               type: string
 *                               example: "EMP-001"
 *                             employee_name:
 *                               type: string
 *                               example: "Ahmed Ali"
 *                       attachments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             trip_id:
 *                               type: integer
 *                               example: 1
 *                             attachment_id:
 *                               type: integer
 *                               example: 456
 *                             attachment_number:
 *                               type: string
 *                               example: "ATT-001"
 *                             attachment_type:
 *                               type: string
 *                               example: "Bucket"
 *                       subProducts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             trip_id:
 *                               type: integer
 *                               example: 1
 *                             product_id:
 *                               type: integer
 *                               example: 789
 *                             attachment_number:
 *                               type: string
 *                               example: "SUB-001"
 *                             product_name:
 *                               type: string
 *                               example: "Concrete Mix"
 *                             unit_price:
 *                               type: number
 *                               format: float
 *                               example: 150.00
 *                             income_account:
 *                               type: string
 *                               example: "Income - Sales"
 *                 orderStatusInfo:
 *                   type: object
 *                   description: Additional sales order status information
 *                   properties:
 *                     currentOrderStatus:
 *                       type: string
 *                       example: "In Progress"
 *                     orderNumber:
 *                       type: string
 *                       example: "SO-2024-0001"
 *                     client:
 *                       type: string
 *                       example: "ABC Construction Ltd"
 *       404:
 *         description: No delivery note found for this allocation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No delivery note found for this allocation"
 *                 exists:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error message"
 *                 exists:
 *                   type: boolean
 *                   example: false
 */
router.get("/by-allocation/:allocation_id", verifyToken, getDeliveryNoteByAllocation);

/**
 * @swagger
 * /api/delivery-notes/summary/{dn_id}:
 *   get:
 *     tags:
 *       - Delivery Notes
 *     summary: Get delivery note summary with trips and resources
 */
router.get("/summary/:dn_id", verifyToken, getDeliveryNoteSummary);

/**
 * @swagger
 * /api/delivery-notes/add-trip/{dn_id}:
 *   post:
 *     tags:
 *       - Delivery Notes
 *     summary: Add a new trip to existing delivery note
 */
router.post("/add-trip/:dn_id", verifyToken, addTripToDeliveryNote);

// /**
//  * @swagger
//  * /api/delivery-notes/upload-attachment/{dn_id}:
//  *   post:
//  *     tags:
//  *       - Delivery Notes
//  *     summary: Upload delivery note attachment and update status to Delivered
//  */
// router.post("/upload-attachment/:dn_id",
//   verifyToken,
//   upload.single('delivery_attachment'),
//   uploadDeliveryNoteAttachment
// );

/**
 * @swagger
 * /api/delivery-notes/confirm/{id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Confirm delivery note
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/confirm/:id", verifyToken, confirmDeliveryNote);

// /**
//  * @swagger
//  * /api/delivery-notes/pdf/{id}:
//  *   get:
//  *     tags:
//  *       - Delivery Notes
//  *     summary: Generate and download delivery note PDF
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: PDF generated successfully
//  *         content:
//  *           application/pdf:
//  *             schema:
//  *               type: string
//  *               format: binary
//  */
// router.get("/pdf/:id", verifyToken, generateDeliveryNotePDF);

/**
 * @swagger
 * /api/delivery-notes/update-status/{id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Update delivery note status (System-defined only)
 *     description: |
 *       System-defined status transitions only. Manual status changes not allowed.
 *       
 *       Status Flow:
 *       1. Creation → When delivery note is created
 *       2. In Progress → When delivery note report is generated
 *       3. Delivered → When signed delivery note attachment is uploaded
 *       4. Cancelled → When delivery note is rejected/cancelled
 *       
 *       Allowed actions:
 *       - Upload delivery_attachment → Status becomes "Delivered"
 *       - Set status to "Cancelled" → Cancel delivery note
 *       
 *       Manual dropdown status changes NOT ALLOWED.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               delivery_attachment:
 *                 type: string
 *                 description: File path/URL for signed delivery note. Required to mark as Delivered.
 *               status:
 *                 type: string
 *                 enum: [Cancelled]
 *                 description: Only "Cancelled" status can be set manually.
 */
router.put("/update-status/:id", verifyToken, updateDeliveryNoteStatus);

/**
 * @swagger
 * /api/delivery-notes/trip/update-status/{trip_id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Update trip status (System-defined only)
 *     description: |
 *       Trip status automatically updates with delivery note status.
 *       Manual status changes not allowed.
 *       
 *       Allowed system transitions:
 *       - Creation → In Progress (when report generated)
 *       - In Progress → Delivered (when signed copy uploaded)
 *       - Any status → Cancelled (when cancelled)
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trip_status:
 *                 type: string
 *                 enum: [Cancelled]
 *                 description: Only "Cancelled" status can be set manually for trips.
 */
router.put("/trip/update-status/:trip_id", verifyToken, updateTripStatus);

/**
 * @summary Generic Status Update (For "Close" and other manual triggers)
 */
router.put("/update-status-generic/:id", verifyToken, updateDNStatusGeneric);


// /**
//  * @swagger
//  * /api/delivery-notes/reject/{id}:
//  *   put:
//  *     tags:
//  *       - Delivery Notes
//  *     summary: Reject/Cancel delivery note
//  *     description: |
//  *       Delivery note is reject/cancel.
//  *       Status automatically "Cancelled".
//  *       Sales order status is "Cancelled"
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: false
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               reason:
//  *                 type: string
//  *                 description: Cancellation reason (optional)
//  */
// router.put("/reject/:id", verifyToken, rejectDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/save/{id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Save delivery note (status remains Creation)
 *     description: |
 *       Save delivery note without changing status.
 *       User can still edit after saving.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/save/:id", verifyToken, saveDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/trips/{trip_id}/submit-approval:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Submit a single trip for approval
 *     description: |
 *       Submit one specific trip for approval.
 *       Only that trip's status changes to "Under Approval".
 *       All other trips in the same delivery note remain unchanged.
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the trip to submit for approval
 *     responses:
 *       200:
 *         description: Trip submitted for approval successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 trip:
 *                   type: object
 *                 parentDNStatus:
 *                   type: string
 *       400:
 *         description: Trip is not in 'Creation' status
 *       404:
 *         description: Trip not found
 */
router.put("/trips/:trip_id/submit-approval", verifyToken, submitForApproval);

/**
 * @swagger
 * /api/delivery-notes/approve/{id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Approve delivery note
 *     description: |
 *       Approve delivery note that is Under Approval.
 *       Status changes to "In Progress".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/approve/:id", verifyToken, approveDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/reject/{id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Reject delivery note
 *     description: |
 *       Reject delivery note that is Under Approval.
 *       Status changes to "Cancelled".
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 */
router.put("/reject/:id", verifyToken, rejectDeliveryNote);

// Upload checklist for a resource (Equipment/Manpower/Attachment)
router.post(
  "/trip/:trip_id/:resource_type/:resource_id/checklist/upload",
  verifyToken,
  checklistUpload.single('checklist'),
  uploadResourceChecklist
);

// Download checklist for a resource
router.get(
  "/trip/:trip_id/:resource_type/:resource_id/checklist/download",
  verifyToken,
  downloadResourceChecklist
);

// Delete checklist for a resource
router.delete(
  "/trip/:trip_id/:resource_type/:resource_id/checklist/delete",
  verifyToken,
  deleteResourceChecklist
);

/**
 * @swagger
 * /api/delivery-notes/trip/update/{trip_id}:
 *   put:
 *     tags:
 *       - Delivery Notes
 *     summary: Update an existing trip in a delivery note
 *     description: |
 *       Update trip details including vehicle info, driver info, and resources.
 *       Only allowed when Delivery Note is in 'Creation' status.
 *       Resources (equipment/manpower/attachments) are fully replaced with new selections.
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transportation_company:
 *                 type: string
 *               driver_name:
 *                 type: string
 *               driver_contact:
 *                 type: string
 *               vehicle_type:
 *                 type: string
 *               vehicle_number:
 *                 type: string
 *               recovery_vehicle_number:
 *                 type: string
 *               chargeable_type:
 *                 type: string
 *                 enum: [Mobilization, Non-Chargeable]
 *               trip_date:
 *                 type: string
 *                 format: date
 *               remarks:
 *                 type: string
 *               equipment:
 *                 type: array
 *               manpower:
 *                 type: array
 *               attachments:
 *                 type: array
 *               subProducts:
 *                 type: array
 */
router.put("/trip/update/:trip_id", verifyToken, updateTripInDeliveryNote);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/generate-pdf:
 *   get:
 *     tags:
 *       - Delivery Notes
 *     summary: Generate PDF for a specific trip (Approved → In Progress)
 *     description: |
 *       Transitions the given trip from 'Approved' to 'In Progress' and returns
 *       full trip data (including parent DN and sales order) for frontend PDF rendering.
 *       Requires a valid Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to generate PDF for
 *     responses:
 *       200:
 *         description: Trip moved to In Progress, PDF data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 moved to In Progress. PDF data ready."
 *                 data:
 *                   type: object
 *                   description: Full trip data including equipment, manpower, attachments, parent DN and sales order
 *                 parentDNStatus:
 *                   type: string
 *                   example: "In Progress"
 *       400:
 *         description: Trip is not in 'Approved' status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
// router.get("/pdf/:id", verifyToken, generateDeliveryNotePDF);   // ← OLD (remove or keep for backward compat)
router.get("/trip/:trip_id/generate-pdf", verifyToken, generateDeliveryNotePDF);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/upload-attachment:
 *   post:
 *     tags:
 *       - Delivery Notes
 *     summary: Upload signed delivery note for a specific trip (In Progress → Completed)
 *     description: |
 *       Uploads the signed delivery note file for the given trip and transitions
 *       that trip from 'In Progress' to 'Completed'.
 *       The parent DN status is automatically re-derived from all trip statuses.
 *       The uploaded file is stored on the DN header record.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to complete
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - delivery_attachment
 *             properties:
 *               delivery_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Signed delivery note file (PDF, JPG, JPEG, PNG — max 5 MB)
 *     responses:
 *       200:
 *         description: Trip completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 marked as Completed. DN status recalculated."
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Completed"
 *                 parentDNStatus:
 *                   type: string
 *                   example: "Completed"
 *                 uploadedFile:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalname:
 *                       type: string
 *                     path:
 *                       type: string
 *       400:
 *         description: Trip is not in 'In Progress' status or no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
// router.post("/upload-attachment/:dn_id", verifyToken, upload.single("delivery_attachment"), uploadDeliveryNoteAttachment);  // ← OLD (remove or keep for backward compat)
router.post(
  "/trip/:trip_id/upload-attachment",
  verifyToken,
  upload.single("delivery_attachment"),
  uploadDeliveryNoteAttachment
);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/submit-approval:
 *   put:
 *     tags:
 *       - Delivery Notes - Trip Lifecycle
 *     summary: Submit a trip for approval (Creation → Under Approval)
 *     description: |
 *       Transitions a specific trip from 'Creation' to 'Under Approval'.
 *       Only the targeted trip status changes — all other trips remain untouched.
 *       The parent DN status is automatically re-derived after the update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to submit for approval
 *     responses:
 *       200:
 *         description: Trip submitted for approval successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 submitted for approval successfully"
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Under Approval"
 *                 parentDNStatus:
 *                   type: string
 *                   example: "Under Approval"
 *       400:
 *         description: Trip is not in 'Creation' status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/trip/:trip_id/submit-approval", verifyToken, submitDNTripForApproval);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/approve:
 *   put:
 *     tags:
 *       - Delivery Notes - Trip Lifecycle
 *     summary: Approve a trip (Under Approval → Approved)
 *     description: |
 *       Transitions a specific trip from 'Under Approval' to 'Approved'.
 *       Only the targeted trip status changes.
 *       The parent DN status is automatically re-derived after the update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to approve
 *     responses:
 *       200:
 *         description: Trip approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 approved successfully"
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Approved"
 *                 parentDNStatus:
 *                   type: string
 *                   example: "Approved"
 *       400:
 *         description: Trip is not in 'Under Approval' status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/trip/:trip_id/approve", verifyToken, approveDNTrip);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/reject:
 *   put:
 *     tags:
 *       - Delivery Notes - Trip Lifecycle
 *     summary: Reject a trip (Under Approval → Rejected)
 *     description: |
 *       Transitions a specific trip from 'Under Approval' to 'Rejected'.
 *       Only the targeted trip status changes.
 *       The parent DN status is automatically re-derived after the update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to reject
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Optional rejection reason (stored in trip remarks)
 *                 example: "Vehicle documentation incomplete"
 *     responses:
 *       200:
 *         description: Trip rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 rejected successfully"
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Rejected"
 *                 parentDNStatus:
 *                   type: string
 *                   example: "Rejected"
 *       400:
 *         description: Trip is not in 'Under Approval' status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/trip/:trip_id/reject", verifyToken, rejectDNTrip);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/generate-pdf:
 *   get:
 *     tags:
 *       - Delivery Notes - Trip Lifecycle
 *     summary: Generate PDF for a trip (Approved → In Progress)
 *     description: |
 *       Transitions a specific trip from 'Approved' to 'In Progress' and returns
 *       the full trip data for PDF generation on the frontend.
 *       Requires a valid Bearer token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to generate PDF for
 *     responses:
 *       200:
 *         description: Trip moved to In Progress, PDF data returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 moved to In Progress. PDF data ready."
 *                 data:
 *                   type: object
 *                   description: Full trip data including equipment, manpower, attachments, and parent DN
 *                 parentDNStatus:
 *                   type: string
 *                   example: "In Progress"
 *       400:
 *         description: Trip is not in 'Approved' status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
router.get("/trip/:trip_id/generate-pdf", verifyToken, generateDNTripPDF);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/complete:
 *   post:
 *     tags:
 *       - Delivery Notes - Trip Lifecycle
 *     summary: Complete a trip by uploading signed delivery note (In Progress → Completed)
 *     description: |
 *       Transitions a specific trip from 'In Progress' to 'Completed'.
 *       Requires a signed delivery note file upload (PDF or image).
 *       The parent DN status is automatically re-derived after the update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to complete
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - delivery_attachment
 *             properties:
 *               delivery_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Signed delivery note file (PDF, JPG, JPEG, PNG — max 5MB)
 *     responses:
 *       200:
 *         description: Trip completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 completed successfully"
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Completed"
 *                 parentDNStatus:
 *                   type: string
 *                   example: "Completed"
 *                 uploadedFile:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     originalname:
 *                       type: string
 *                     path:
 *                       type: string
 *       400:
 *         description: Trip is not in 'In Progress' status or no file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/trip/:trip_id/complete",
  verifyToken,
  upload.single("delivery_attachment"),
  completeDNTrip
);

/**
 * @swagger
 * /api/delivery-notes/trip/{trip_id}/close:
 *   put:
 *     tags:
 *       - Delivery Notes - Trip Lifecycle
 *     summary: Close a completed trip (Completed → Close)
 *     description: |
 *       Transitions a specific trip from 'Completed' to 'Close'.
 *       This is the final terminal state for a trip.
 *       The parent DN status is automatically re-derived after the update.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: trip_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to close
 *     responses:
 *       200:
 *         description: Trip closed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-DN-TP-001 closed successfully"
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Close"
 *                 parentDNStatus:
 *                   type: string
 *                   example: "Close"
 *       400:
 *         description: Trip is not in 'Completed' status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 currentTripStatus:
 *                   type: string
 *                 tripReference:
 *                   type: string
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/trip/:trip_id/close", verifyToken, closeDNTrip);


module.exports = router;