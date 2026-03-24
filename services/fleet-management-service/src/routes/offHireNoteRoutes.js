const express = require("express");

const fs = require("fs"); // Added missing module
const path = require("path"); // Added missing module
const {
  createOffHireNote,
  getAllOffHireNotes,
  getOffHireNoteById,
  getOffHireNoteByAllocation,
  generateOffHireNotePDF,
  updateOffHireNoteStatus,
  updateTripStatus,
  getOffHireNoteSummary,
  addTripToOffHireNote,
  uploadOffHireNoteAttachment,
  rejectOffHireNote,
  updateTripInOffHireNote,
  uploadResourceChecklist,
  downloadResourceChecklist,
  deleteResourceChecklist,
  deleteOffHireNoteTrip, 
  submitOffHireNoteForApproval,
  approveOffHireNote,
  updateOffHireNoteStatusGeneric,
  submitTripForApproval,
  submitOHNTripForApproval,
  approveOHNTrip,
  rejectOHNTrip,
  generateOHNTripPDF,
  completeOHNTrip,
  closeOHNTrip,
} = require("../../controllers/fleet-management/offHireNoteController");
const { verifyToken } = require("../../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/off-hire-noteses/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const checklistStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { resource_type } = req.params;
    const uploadPath = `public/uploads/off-hire-notes-template/checklist/${resource_type}/`;

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const { trip_id, resource_id } = req.params;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(
      null,
      `checklist-trip${trip_id}-${resource_id}-${uniqueSuffix}-${sanitizedFilename}`
    );
  },
});

const checklistUpload = multer({
  storage: checklistStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|jpg|jpeg|png|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype =
      allowedTypes.test(file.mimetype) ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/msword" ||
      file.mimetype === "application/vnd.ms-excel";

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, images, Word documents, and Excel files are allowed"));
    }
  },
});

// /**
//  * @swagger
//  * /api/off-hire-notes/create:
//  *   post:
//  *     tags:
//  *       - Off Hire Notes
//  *     summary: Create a new off hire note
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - sales_order_id
//  *               - allocation_id
//  *               - off_hire_date
//  *               - trips
//  *             properties:
//  *               sales_order_id:
//  *                 type: integer
//  *               allocation_id:
//  *                 type: integer
//  *               off_hire_date:
//  *                 type: string
//  *                 format: date
//  *               site_end_date:
//  *                 type: string
//  *                 format: date
//  *               trips:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     trip_number:
//  *                       type: integer
//  *                     transportation_company:
//  *                       type: string
//  *                     driver_name:
//  *                       type: string
//  *                     driver_contact:
//  *                       type: string
//  *                     vehicle_type:
//  *                       type: string
//  *                     vehicle_number:
//  *                       type: string
//  *                     recovery_vehicle_number:
//  *                       type: string
//  *                     equipment:
//  *                       type: array
//  *                     manpower:
//  *                       type: array
//  *                     attachments:
//  *                       type: array
//  */
// router.post("/create", verifyToken, createOffHireNote);

/**
 * @swagger
 * /api/off-hire-notes/create:
 *   post:
 *     tags:
 *       - Off Hire Notes
 *     summary: Create a new off hire note
 *     description: Use this API to create a new off-hire note with trip, equipment, and manpower details.
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
 *               - allocation_id
 *               - off_hire_date
 *               - trips
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *                 example: 1024
 *               allocation_id:
 *                 type: integer
 *                 example: 55
 *               off_hire_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-16"
 *               site_end_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-01-16"
 *               trips:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     trip_number:
 *                       type: integer
 *                       example: 1
 *                     transportation_company:
 *                       type: string
 *                       example: "Lanka Logistics"
 *                     driver_name:
 *                       type: string
 *                       example: "Sunil Perera"
 *                     driver_contact:
 *                       type: string
 *                       example: "0771234567"
 *                     vehicle_type:
 *                       type: string
 *                       example: "Lorry"
 *                     vehicle_number:
 *                       type: string
 *                       example: "WP-1234"
 *                     recovery_vehicle_number:
 *                       type: string
 *                       example: "REC-5566"
 *               equipment:
 *                 type: array
 *                 items:
 *                   type: object
 *                   example: []
 *               manpower:
 *                 type: array
 *                 items:
 *                   type: object
 *                   example: []
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   example: []
 *               subProducts:
 *                 type: array
 *                 items:
 *                   type: object
 *                   example: []
 *     responses:
 *       201:
 *         description: Off Hire Note created successfully
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
 *                   example: "Off Hire Note created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     off_hire_id:
 *                       type: integer
 *                       example: 5001
 *       400:
 *         description: Bad Request - Missing or invalid fields
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 *       500:
 *         description: Internal Server Error
 */
router.post("/create", verifyToken, createOffHireNote);

/**
 * @swagger
 * /api/off-hire-notes/all:
 *   get:
 *     tags:
 *       - Off Hire Notes
 *     summary: Get all off hire notes with pagination
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
router.get("/all", verifyToken, getAllOffHireNotes);

/**
 * @swagger
 * /api/off-hire-notes/{id}:
 *   get:
 *     tags:
 *       - Off Hire Notes
 *     summary: Get off hire note by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id", verifyToken, getOffHireNoteById);

/**
 * @swagger
 * /api/off-hire-notes/by-allocation/{allocation_id}:
 *   get:
 *     tags:
 *       - Off Hire Notes
 *     summary: Get off hire note by allocation ID
 *     parameters:
 *       - in: path
 *         name: allocation_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/by-allocation/:allocation_id", verifyToken, getOffHireNoteByAllocation);

/**
 * @swagger
 * /api/off-hire-notes/summary/{ohn_id}:
 *   get:
 *     tags:
 *       - Off Hire Notes
 *     summary: Get off hire note summary with trips and resources
 */
router.get("/summary/:ohn_id", verifyToken, getOffHireNoteSummary);

/**
 * @swagger
 * /api/off-hire-notes/add-trip/{ohn_id}:
 *   post:
 *     tags:
 *       - Off Hire Notes
 *     summary: Add a new trip to existing off hire note
 */
router.post("/add-trip/:ohn_id", verifyToken, addTripToOffHireNote);

// /**
//  * @swagger
//  * /api/off-hire-notes/upload-attachment/{ohn_id}:
//  *   post:
//  *     tags:
//  *       - Off Hire Notes
//  *     summary: Upload off hire note attachment and update status to Off Hired
//  */
// router.post(
//   "/upload-attachment/:ohn_id",
//   verifyToken,
//   upload.single("off_hire_attachment"),
//   uploadOffHireNoteAttachment
// );

// /**
//  * @swagger
//  * /api/off-hire-notes/pdf/{id}:
//  *   get:
//  *     tags:
//  *       - Off Hire Notes
//  *     summary: Generate and download off hire note PDF
//  */
// router.get("/pdf/:id", verifyToken, generateOffHireNotePDF);

/**
 * @swagger
 * /api/off-hire-notes/update-status/{id}:
 *   put:
 *     tags:
 *       - Off Hire Notes
 *     summary: Update off hire note status (System-defined only)
 *     description: |
 *       System-defined status transitions only.
 *       
 *       Status Flow:
 *       1. Creation → When off hire note is created
 *       2. In Progress → When off hire note report is generated
 *       3. Off Hired → When signed off hire note attachment is uploaded
 *       4. Cancelled → When off hire note is rejected/cancelled
 */
router.put("/update-status/:id", verifyToken, updateOffHireNoteStatus);

/**
 * @swagger
 * /api/off-hire-notes/trip/update-status/{trip_id}:
 *   put:
 *     tags:
 *       - Off Hire Notes
 *     summary: Update trip status (System-defined only)
 */
router.put("/trip/update-status/:trip_id", verifyToken, updateTripStatus);

/**
 * @swagger
 * /api/off-hire-notes/reject/{id}:
 *   put:
 *     tags:
 *       - Off Hire Notes
 *     summary: Reject/Cancel off hire note
 */
router.put("/reject/:id", verifyToken, rejectOffHireNote);

// Add these lines to your routes file
router.delete("/trip/delete/:trip_id", verifyToken, deleteOffHireNoteTrip);
router.put("/submit-approval/:id", verifyToken, submitOffHireNoteForApproval);
router.put("/approve/:id", verifyToken, approveOffHireNote);
router.put("/update-status-generic/:id", verifyToken, updateOffHireNoteStatusGeneric);

/**
 * @swagger
 * /api/off-hire-notes/trips/{trip_id}/submit-approval:
 *   put:
 *     tags:
 *       - Off Hire Notes
 *     summary: Submit a single trip for approval
 *     description: |
 *       Transitions a specific trip from 'Creation' → 'Under Approval'.
 *       Only the targeted trip status changes — all other trips in the same
 *       Off Hire Note remain untouched.
 *       The parent OHN status is automatically re-derived after the update.
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
 *                   example: "Trip AX-OH-TP-001 submitted for approval successfully"
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_status:
 *                       type: string
 *                       example: "Under Approval"
 *                 ohnStatus:
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
 *                 currentStatus:
 *                   type: string
 *                 allowedStatus:
 *                   type: string
 *                   example: "Creation"
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Internal Server Error
 */
router.put("/trips/:trip_id/submit-approval", verifyToken, submitTripForApproval);

/**
 * @swagger
 * /api/off-hire-notes/trip/update/{trip_id}:
 *   put:
 *     tags:
 *       - Off Hire Notes
 *     summary: Update an existing trip in an off hire note
 *     description: |
 *       Update trip details including vehicle info, driver info, and resources.
 *       Only allowed when Off Hire Note is in 'Creation' status.
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
 *                 enum: [Demobilization, Non-Chargeable]
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
router.put("/trip/update/:trip_id", verifyToken, updateTripInOffHireNote);

// router.post(
//   "/trip/:trip_id/:resource_type/:resource_id/checklist/upload",
//   verifyToken,
//   checklistUpload.single("checklist"),
//   uploadResourceChecklist
// );

router.post(
  "/trip/:trip_id/:resource_type/:resource_id/checklist/upload",
  verifyToken,
  checklistUpload.single("checklist"), // Must match the field name 'checklist' in your frontend FormData
  uploadResourceChecklist
);

router.get(
  "/trip/:trip_id/:resource_type/:resource_id/checklist/download",
  verifyToken,
  downloadResourceChecklist
);

router.delete(
  "/trip/:trip_id/:resource_type/:resource_id/checklist/delete",
  verifyToken,
  deleteResourceChecklist
);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/generate-pdf:
 *   get:
 *     tags:
 *       - Off Hire Notes
 *     summary: Generate PDF for a specific trip (Approved → In Progress)
 *     description: |
 *       Transitions the given trip from 'Approved' to 'In Progress' and returns
 *       full trip data (including parent OHN and sales order) for frontend PDF rendering.
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
 *                   example: "Trip AX-OH-TP-001 moved to In Progress. PDF data ready."
 *                 data:
 *                   type: object
 *                   description: Full trip data including equipment, manpower, attachments, parent OHN and sales order
 *                 ohnStatus:
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
// router.get("/pdf/:id", verifyToken, generateOffHireNotePDF);   // ← OLD (remove or keep for backward compat)
router.get("/trip/:trip_id/generate-pdf", verifyToken, generateOffHireNotePDF);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/upload-attachment:
 *   post:
 *     tags:
 *       - Off Hire Notes
 *     summary: Upload signed off hire note for a specific trip (In Progress → Off Hired)
 *     description: |
 *       Uploads the signed off hire note file for the given trip and transitions
 *       that trip from 'In Progress' to 'Off Hired'.
 *       The parent OHN status is automatically re-derived from all trip statuses.
 *       If ALL trips are now Off Hired or Close, the Sales Order ops_status is
 *       set to 'Completed' and the Allocation status is set to 'Completed'.
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
 *               - off_hire_attachment
 *             properties:
 *               off_hire_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Signed off hire note file (PDF, JPG, JPEG, PNG)
 *     responses:
 *       200:
 *         description: Trip marked as Off Hired successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-OH-TP-001 marked as Off Hired. OHN status recalculated."
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Off Hired"
 *                 ohnStatus:
 *                   type: string
 *                   example: "Off Hired"
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
// router.post("/upload-attachment/:ohn_id", verifyToken, upload.single("off_hire_attachment"), uploadOffHireNoteAttachment);  // ← OLD (remove or keep for backward compat)
router.post(
  "/trip/:trip_id/upload-attachment",
  verifyToken,
  upload.single("off_hire_attachment"),
  uploadOffHireNoteAttachment
);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/submit-approval:
 *   put:
 *     tags:
 *       - Off Hire Notes - Trip Lifecycle
 *     summary: Submit a trip for approval (Creation → Under Approval)
 *     description: |
 *       Transitions a specific trip from 'Creation' to 'Under Approval'.
 *       Only the targeted trip status changes — all other trips remain untouched.
 *       The parent OHN status is automatically re-derived after the update.
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
 *                   example: "Trip AX-OH-TP-001 submitted for approval successfully"
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
 *                 ohnStatus:
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
router.put("/trip/:trip_id/submit-approval", verifyToken, submitOHNTripForApproval);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/approve:
 *   put:
 *     tags:
 *       - Off Hire Notes - Trip Lifecycle
 *     summary: Approve a trip (Under Approval → Approved)
 *     description: |
 *       Transitions a specific trip from 'Under Approval' to 'Approved'.
 *       Only the targeted trip status changes.
 *       The parent OHN status is automatically re-derived after the update.
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
 *                   example: "Trip AX-OH-TP-001 approved successfully"
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
 *                 ohnStatus:
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
router.put("/trip/:trip_id/approve", verifyToken, approveOHNTrip);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/reject:
 *   put:
 *     tags:
 *       - Off Hire Notes - Trip Lifecycle
 *     summary: Reject a trip (Under Approval → Rejected)
 *     description: |
 *       Transitions a specific trip from 'Under Approval' to 'Rejected'.
 *       Only the targeted trip status changes.
 *       The parent OHN status is automatically re-derived after the update.
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
 *                 example: "Equipment condition not verified"
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
 *                   example: "Trip AX-OH-TP-001 rejected successfully"
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
 *                 ohnStatus:
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
router.put("/trip/:trip_id/reject", verifyToken, rejectOHNTrip);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/generate-pdf:
 *   get:
 *     tags:
 *       - Off Hire Notes - Trip Lifecycle
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
 *                   example: "Trip AX-OH-TP-001 moved to In Progress. PDF data ready."
 *                 data:
 *                   type: object
 *                   description: Full trip data including equipment, manpower, attachments, and parent OHN
 *                 ohnStatus:
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
router.get("/trip/:trip_id/generate-pdf", verifyToken, generateOHNTripPDF);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/complete:
 *   post:
 *     tags:
 *       - Off Hire Notes - Trip Lifecycle
 *     summary: Complete a trip by uploading signed off hire note (In Progress → Off Hired)
 *     description: |
 *       Transitions a specific trip from 'In Progress' to 'Off Hired'.
 *       Requires a signed off hire note file upload (PDF or image).
 *       The parent OHN status is automatically re-derived after the update.
 *       If ALL trips are now Off Hired / Close, the Sales Order ops_status is
 *       set to 'Completed' and the Allocation status is set to 'Completed'.
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
 *               - off_hire_attachment
 *             properties:
 *               off_hire_attachment:
 *                 type: string
 *                 format: binary
 *                 description: Signed off hire note file (PDF, JPG, JPEG, PNG)
 *     responses:
 *       200:
 *         description: Trip marked as Off Hired successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trip AX-OH-TP-001 marked as Off Hired successfully"
 *                 trip:
 *                   type: object
 *                   properties:
 *                     trip_id:
 *                       type: integer
 *                     trip_reference_number:
 *                       type: string
 *                     trip_status:
 *                       type: string
 *                       example: "Off Hired"
 *                 ohnStatus:
 *                   type: string
 *                   example: "Off Hired"
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
  upload.single("off_hire_attachment"),
  completeOHNTrip
);

/**
 * @swagger
 * /api/off-hire-notes/trip/{trip_id}/close:
 *   put:
 *     tags:
 *       - Off Hire Notes - Trip Lifecycle
 *     summary: Close an off hired trip (Off Hired → Close)
 *     description: |
 *       Transitions a specific trip from 'Off Hired' to 'Close'.
 *       This is the final terminal state for a trip.
 *       The parent OHN status is automatically re-derived after the update.
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
 *                   example: "Trip AX-OH-TP-001 closed successfully"
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
 *                 ohnStatus:
 *                   type: string
 *                   example: "Close"
 *       400:
 *         description: Trip is not in 'Off Hired' status
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
router.put("/trip/:trip_id/close", verifyToken, closeOHNTrip);


module.exports = router;