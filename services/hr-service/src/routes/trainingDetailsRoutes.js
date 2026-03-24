const express = require("express");
const {
  uploadCertificationDocument,
  createTrainingDetails,
  updateTrainingDetails,
  deleteTrainingDetails,
  getTrainingDetailsById,
  getAllTrainingDetails,
  getTrainingDetailsByEmployee,
  getTrainingDetailsByTraining,
  updateTrainingProgress,
  serveCertificationFile,
  filterTrainingDetails,
  exportTrainingDetailsToCSV,
  exportTrainingDetailsToPDF,
} = require("../../controllers/hr/trainingDetailsController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/trainingDetails/createTrainingDetails:
 *   post:
 *     tags:
 *       - Training Details
 *     summary: Create new training details for an employee
 *     description: This endpoint allows creating new training details record for a specific employee and training program, including certification document upload.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               trainingId:
 *                 type: integer
 *                 description: ID of the training program
 *               employeeId:
 *                 type: integer
 *                 description: ID of the employee
 *               enrollmentDate:
 *                 type: string
 *                 format: date
 *                 description: Date when employee enrolled in training
 *               trainingProgress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 default: 0
 *                 description: Training progress percentage
 *               attendancePercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Attendance percentage
 *               assessmentScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Assessment score percentage
 *               feedback:
 *                 type: string
 *                 description: Training feedback
 *               certificationStatus:
 *                 type: string
 *                 enum: [pending, achieved, failed, not_applicable]
 *                 default: pending
 *                 description: Certification status
 *               certificationDate:
 *                 type: string
 *                 format: date
 *                 description: Date when certification was received
 *               certificationDocument:
 *                 type: string
 *                 format: binary
 *                 description: Certification document (PDF, JPG, PNG, DOC, DOCX)
 *               trainingNotes:
 *                 type: string
 *                 description: Additional training notes
 *             required:
 *               - trainingId
 *               - employeeId
 *     responses:
 *       201:
 *         description: Training details created successfully
 *       400:
 *         description: Invalid input or training details already exist
 *       404:
 *         description: Training or employee not found
 *       500:
 *         description: Error creating training details
 */
router.post("/createTrainingDetails", verifyToken, uploadCertificationDocument, createTrainingDetails);

/**
 * @swagger
 * /api/trainingDetails/updateTrainingDetails/{id}:
 *   put:
 *     tags:
 *       - Training Details
 *     summary: Update existing training details
 *     description: This endpoint allows updating existing training details including progress, scores, and certification information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training details record to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               trainingProgress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Training progress percentage
 *               attendancePercentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Attendance percentage
 *               assessmentScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Assessment score percentage
 *               feedback:
 *                 type: string
 *                 description: Training feedback
 *               certificationStatus:
 *                 type: string
 *                 enum: [pending, achieved, failed, not_applicable]
 *                 description: Certification status
 *               certificationDate:
 *                 type: string
 *                 format: date
 *                 description: Date when certification was received
 *               certificationDocument:
 *                 type: string
 *                 format: binary
 *                 description: Certification document (PDF, JPG, PNG, DOC, DOCX)
 *               trainingNotes:
 *                 type: string
 *                 description: Additional training notes
 *               completionDate:
 *                 type: string
 *                 format: date
 *                 description: Date when training was completed
 *     responses:
 *       200:
 *         description: Training details updated successfully
 *       404:
 *         description: Training details not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating training details
 */
router.put("/updateTrainingDetails/:id", verifyToken, uploadCertificationDocument, updateTrainingDetails);

/**
 * @swagger
 * /api/trainingDetails/deleteTrainingDetails/{id}:
 *   delete:
 *     tags:
 *       - Training Details
 *     summary: Delete training details
 *     description: This endpoint allows deleting a training details record from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training details record to delete
 *     responses:
 *       200:
 *         description: Training details deleted successfully
 *       404:
 *         description: Training details not found
 *       500:
 *         description: Error deleting training details
 */
router.delete("/deleteTrainingDetails/:id", verifyToken, deleteTrainingDetails);

/**
 * @swagger
 * /api/trainingDetails/trainingDetails/{id}:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Get training details by ID
 *     description: This endpoint allows retrieving a specific training details record by its ID with employee and training information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training details record to retrieve
 *     responses:
 *       200:
 *         description: Training details retrieved successfully
 *       404:
 *         description: Training details not found
 *       500:
 *         description: Error retrieving training details
 */
router.get("/trainingDetails/:id", verifyToken, getTrainingDetailsById);

/**
 * @swagger
 * /api/trainingDetails/allTrainingDetails:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Get all training details with pagination
 *     description: This endpoint allows retrieving all training details records in the system with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *     responses:
 *       200:
 *         description: Training details retrieved successfully
 *       500:
 *         description: Error retrieving training details
 */
router.get("/allTrainingDetails", verifyToken, getAllTrainingDetails);

/**
 * @swagger
 * /api/trainingDetails/employee/{employeeId}:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Get training details by employee ID
 *     description: This endpoint allows retrieving all training details for a specific employee with pagination, referring to Employee and TrainingAndDevelopment models.
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the employee
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *     responses:
 *       200:
 *         description: Employee training details retrieved successfully
 *       500:
 *         description: Error retrieving employee training details
 */
router.get("/employee/:employeeId", verifyToken, getTrainingDetailsByEmployee);

/**
 * @swagger
 * /api/trainingDetails/training/{trainingId}:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Get training details by training ID
 *     description: This endpoint allows retrieving all training details for a specific training program with pagination.
 *     parameters:
 *       - in: path
 *         name: trainingId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training program
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *     responses:
 *       200:
 *         description: Training details for training program retrieved successfully
 *       500:
 *         description: Error retrieving training details for training program
 */
router.get("/training/:trainingId", verifyToken, getTrainingDetailsByTraining);

/**
 * @swagger
 * /api/trainingDetails/updateProgress/{id}:
 *   put:
 *     tags:
 *       - Training Details
 *     summary: Update training progress
 *     description: This endpoint allows updating the training progress percentage for a specific training details record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training details record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainingProgress:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: The progress of the training in percentage (0 to 100)
 *             required:
 *               - trainingProgress
 *     responses:
 *       200:
 *         description: Training progress updated successfully
 *       400:
 *         description: Progress must be between 0 and 100
 *       404:
 *         description: Training details not found
 *       500:
 *         description: Error updating training progress
 */
router.put("/updateProgress/:id", verifyToken, updateTrainingProgress);

/**
 * @swagger
 * /api/trainingDetails/certificationFile/{filename}:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Serve a certification document file
 *     description: This endpoint serves a certification document file (PDF, JPG, PNG, DOC, DOCX) by its filename.
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the certification file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
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
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/certificationFile/:filename", verifyToken, serveCertificationFile);

/**
 * @swagger
 * /api/trainingDetails/filterTrainingDetails:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Filter training details
 *     description: This endpoint allows filtering training details based on various criteria with pagination.
 *     parameters:
 *       - in: query
 *         name: certificationStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, pending, achieved, failed, not_applicable]
 *           default: All
 *         description: Filter by certification status
 *       - in: query
 *         name: trainingProgress
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, completed, in-progress, not-started]
 *           default: All
 *         description: Filter by training progress status
 *       - in: query
 *         name: employeeId
 *         required: false
 *         schema:
 *           type: string
 *           default: All
 *         description: Filter by specific employee ID
 *       - in: query
 *         name: trainingId
 *         required: false
 *         schema:
 *           type: string
 *           default: All
 *         description: Filter by specific training ID
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of records per page
 *     responses:
 *       200:
 *         description: Filtered training details retrieved successfully
 *       500:
 *         description: Error filtering training details
 */
router.get("/filterTrainingDetails", verifyToken, filterTrainingDetails);

/**
 * @swagger
 * /api/trainingDetails/exportTrainingDetailsToCSV:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Export filtered training details to CSV
 *     description: This endpoint allows exporting filtered training details data to a CSV file.
 *     parameters:
 *       - in: query
 *         name: certificationStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, pending, achieved, failed, not_applicable]
 *           default: All
 *         description: Filter by certification status
 *       - in: query
 *         name: trainingProgress
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, completed, in-progress, not-started]
 *           default: All
 *         description: Filter by training progress status
 *       - in: query
 *         name: employeeId
 *         required: false
 *         schema:
 *           type: string
 *           default: All
 *         description: Filter by specific employee ID
 *       - in: query
 *         name: trainingId
 *         required: false
 *         schema:
 *           type: string
 *           default: All
 *         description: Filter by specific training ID
 *     responses:
 *       200:
 *         description: CSV file download
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No training details found matching the filters
 *       500:
 *         description: Error exporting training details to CSV
 */
router.get("/exportTrainingDetailsToCSV", verifyToken, exportTrainingDetailsToCSV);

/**
 * @swagger
 * /api/trainingDetails/exportTrainingDetailsToPDF:
 *   get:
 *     tags:
 *       - Training Details
 *     summary: Export filtered training details to PDF
 *     description: This endpoint allows exporting filtered training details data to a PDF file.
 *     parameters:
 *       - in: query
 *         name: certificationStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, pending, achieved, failed, not_applicable]
 *           default: All
 *         description: Filter by certification status
 *       - in: query
 *         name: trainingProgress
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, completed, in-progress, not-started]
 *           default: All
 *         description: Filter by training progress status
 *       - in: query
 *         name: employeeId
 *         required: false
 *         schema:
 *           type: string
 *           default: All
 *         description: Filter by specific employee ID
 *       - in: query
 *         name: trainingId
 *         required: false
 *         schema:
 *           type: string
 *           default: All
 *         description: Filter by specific training ID
 *     responses:
 *       200:
 *         description: PDF file download
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: No training details found matching the filters
 *       500:
 *         description: Error exporting training details to PDF
 */
router.get("/exportTrainingDetailsToPDF", verifyToken, exportTrainingDetailsToPDF);

module.exports = router;