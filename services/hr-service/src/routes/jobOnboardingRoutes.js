const express = require("express");
const {
  uploadResume,
  createJobOnboarding,
  updateJobOnboarding,
  deleteJobOnboarding,
  getJobOnboardingById,
  getAllJobOnboardings,
  filterJobOnboardings,
  approveJobOnboarding,
  rejectJobOnboarding,
  serveResumeFile,
  exportFilteredJobOnboardingsToCSV,
  exportFilteredJobOnboardingsToPDF,
} = require("../../controllers/hr/jobOnboardingController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/jobOnboarding/all:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Get all job onboardings with pagination
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
 *         description: Job onboardings retrieved successfully
 *       500:
 *         description: Error retrieving job onboardings
 */
router.get("/all", verifyToken, getAllJobOnboardings);

/**
 * @swagger
 * /api/jobOnboarding/filter:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Filter job onboardings by approval status
 *     parameters:
 *       - in: query
 *         name: approvalStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
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
 *         description: Filtered job onboardings retrieved successfully
 *       500:
 *         description: Error filtering job onboardings
 */
router.get("/filter", verifyToken, filterJobOnboardings);

/**
 * @swagger
 * /api/jobOnboarding/exportCSV:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Export filtered job onboardings to CSV
 *     parameters:
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file download
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportCSV", verifyToken, exportFilteredJobOnboardingsToCSV);

/**
 * @swagger
 * /api/jobOnboarding/exportPDF:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Export filtered job onboardings to PDF
 *     parameters:
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file download
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportPDF", verifyToken, exportFilteredJobOnboardingsToPDF);

/**
 * @swagger
 * /api/jobOnboarding/create:
 *   post:
 *     tags:
 *       - Job Onboarding
 *     summary: Create a new job onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - employeeName
 *               - passportNumber
 *               - QIDNumber
 *               - contactNumber
 *               - resume
 *             properties:
 *               employeeName:
 *                 type: string
 *               passportNumber:
 *                 type: string
 *               QIDNumber:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *               jobId:
 *                 type: integer
 *               jobTitle:
 *                 type: string
 *               jobCode:
 *                 type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               scheduledTime:
 *                 type: string
 *     responses:
 *       201:
 *         description: Job onboarding created successfully
 *       400:
 *         description: Resume file is required
 *       500:
 *         description: Error creating job onboarding
 */
router.post("/create", verifyToken, uploadResume, createJobOnboarding);

/**
 * @swagger
 * /api/jobOnboarding/update/{id}:
 *   put:
 *     tags:
 *       - Job Onboarding
 *     summary: Update an existing job onboarding
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job onboarding to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               employeeName:
 *                 type: string
 *               passportNumber:
 *                 type: string
 *               QIDNumber:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               resume:
 *                 type: string
 *                 format: binary
 *               jobId:
 *                 type: integer
 *               jobTitle:
 *                 type: string
 *               jobCode:
 *                 type: string
 *               scheduledDate:
 *                 type: string
 *                 format: date
 *               scheduledTime:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job onboarding updated successfully
 *       404:
 *         description: Job onboarding not found
 *       500:
 *         description: Error updating job onboarding
 */
router.put("/update/:id", verifyToken, uploadResume, updateJobOnboarding);

/**
 * @swagger
 * /api/jobOnboarding/delete/{id}:
 *   delete:
 *     tags:
 *       - Job Onboarding
 *     summary: Delete a job onboarding by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job onboarding to delete
 *     responses:
 *       200:
 *         description: Job onboarding deleted successfully
 *       404:
 *         description: Job onboarding not found
 *       500:
 *         description: Error deleting job onboarding
 */
router.delete("/delete/:id", verifyToken, deleteJobOnboarding);

/**
 * @swagger
 * /api/jobOnboarding/{id}:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Get a single job onboarding by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job onboarding
 *     responses:
 *       200:
 *         description: Job onboarding retrieved successfully
 *       404:
 *         description: Job onboarding not found
 */
router.get("/:id", verifyToken, getJobOnboardingById);

/**
 * @swagger
 * /api/jobOnboarding/approve/{id}:
 *   patch:
 *     tags:
 *       - Job Onboarding
 *     summary: Approve a job onboarding
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job onboarding to approve
 *     responses:
 *       200:
 *         description: Job onboarding approved successfully
 *       404:
 *         description: Job onboarding not found
 *       500:
 *         description: Error approving job onboarding
 */
router.patch("/approve/:id", verifyToken, approveJobOnboarding);

/**
 * @swagger
 * /api/jobOnboarding/reject/{id}:
 *   patch:
 *     tags:
 *       - Job Onboarding
 *     summary: Reject a job onboarding
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the job onboarding to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rejectedReason
 *             properties:
 *               rejectedReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Job onboarding rejected successfully
 *       400:
 *         description: Rejected reason is required
 *       404:
 *         description: Job onboarding not found
 *       500:
 *         description: Error rejecting job onboarding
 */
router.patch("/reject/:id", verifyToken, rejectJobOnboarding);

/**
 * @swagger
 * /api/jobOnboarding/resume/{filename}:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Serve a resume file
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the resume file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
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
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/resume/:filename", verifyToken, serveResumeFile);

/**
 * @swagger
 * /api/jobOnboarding/exportCSV:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Export filtered job onboardings to CSV
 *     parameters:
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file download
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportCSV", verifyToken, exportFilteredJobOnboardingsToCSV);

/**
 * @swagger
 * /api/jobOnboarding/exportPDF:
 *   get:
 *     tags:
 *       - Job Onboarding
 *     summary: Export filtered job onboardings to PDF
 *     parameters:
 *       - in: query
 *         name: approvalStatus
 *         schema:
 *           type: string
 *           enum: [All, approved, rejected]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file download
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportPDF", verifyToken, exportFilteredJobOnboardingsToPDF);

module.exports = router;