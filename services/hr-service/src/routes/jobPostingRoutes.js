const express = require("express");
const {
  createJobPosting,
  updateJobposting,
  deleteJobPosting,
  getJobPostingById,
  getAllJobPostings,
  approveJobPosting,
  rejectJobPosting,
  filterJobPosting,
  exportFilteredJobPostingToCSV,
  exportFilteredJobPostingToPDF,
} = require("../controllers/jobPostingController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/jobPosting/createJobPosting:
 *   post:
 *     tags:
 *       - Manage Job Posting
 *     summary: Create a new job post
 *     description: This endpoint allows to create a new job post in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: decimal
 *               postedAt:
 *                 type: date
 *               expiresAt:
 *                 type: date
 *               jobType:
 *                 type: string
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               keyRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Job post created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createJobPosting", verifyToken, createJobPosting);

/**
 * @swagger
 * /api/jobPosting/updateJobPost/{id}:
 *   put:
 *     tags:
 *       - Manage Job Posting
 *     summary: Update an existing job post
 *     description: This endpoint allows to update an existing job post's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               jobTitle:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: decimal
 *               jobType:
 *                 type: string
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               keyRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Job post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "job Post updated successfully"
 *                 recruitment:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     jobTitle:
 *                       type: string
 *                     jobDescription:
 *                       type: string
 *                     location:
 *                       type: string
 *                     salary:
 *                       type: decimal
 *                     jobType:
 *                       type: string
 *                     responsibilities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     keyRequirements:
 *                       type: array
 *                       items:
 *                         type: string
 *                     qualifications:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Job post not found
 *       500:
 *         description: Error updating job post
 */
router.put("/updateJobPost/:id", verifyToken, updateJobposting);

/**
 * @swagger
 * /api/jobPosting/deleteJobPost/{id}:
 *   delete:
 *     tags:
 *       - Manage Job Posting
 *     summary: Delete an existing job post
 *     description: This endpoint allows to delete a job post from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job post to delete
 *     responses:
 *       200:
 *         description: Job post deleted successfully
 *       404:
 *         description: Job post not found
 */
router.delete("/deleteJobPost/:id", verifyToken, deleteJobPosting);

/**
 * @swagger
 * /api/jobPosting/jobPost/{id}:
 *   get:
 *     tags:
 *       - Manage Job Posting
 *     summary: Get a single job post by ID
 *     description: This endpoint allows to retrieve a specific job post by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job post to retrieve
 *     responses:
 *       200:
 *         description: Job post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               jobTitle:
 *                 type: string
 *               jobDescription:
 *                 type: string
 *               location:
 *                 type: string
 *               salary:
 *                 type: decimal
 *               postedAt:
 *                 type: date
 *               expiresAt:
 *                 type: date
 *               jobType:
 *                 type: string
 *               responsibilities:
 *                 type: array
 *                 items:
 *                   type: string
 *               keyRequirements:
 *                 type: array
 *                 items:
 *                   type: string
 *               qualifications:
 *                 type: array
 *                 items:
 *                   type: string
 *       404:
 *         description: Job post not found
 */
router.get("/jobPost/:id", verifyToken, getJobPostingById);

/**
 * @swagger
 * /api/jobPosting/jobPosts:
 *   get:
 *     tags:
 *       - Manage Job Posting
 *     summary: Get all job post with pagination
 *     description: This endpoint allows to retrieve all job post in the system with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users per page (default is 10)
 *     responses:
 *       200:
 *         description: Job post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     jobTitle:
 *                       type: string
 *                     jobDescription:
 *                       type: string
 *                     location:
 *                       type: string
 *                     salary:
 *                       type: decimal
 *                     postedAt:
 *                       type: date
 *                     expiresAt:
 *                       type: date
 *                     jobType:
 *                       type: string
 *                     responsibilities:
 *                       type: array
 *                       items:
 *                         type: string
 *                     keyRequirements:
 *                       type: array
 *                       items:
 *                         type: string
 *                     qualifications:
 *                       type: array
 *                       items:
 *                         type: string
 *       500:
 *         description: Error retrieving job post
 */
router.get("/jobPosts", verifyToken, getAllJobPostings);

/**
 * @swagger
 * /api/jobPosting/approveJobPost/{id}:
 *   patch:
 *     tags:
 *       - Manage Job Posting
 *     summary: Approve a job post
 *     description: This endpoint allows a manager to approve a job post.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job post to approve
 *     responses:
 *       200:
 *         description: Job post approved successfully
 *       400:
 *         description: Job post is already processed
 *       404:
 *         description: Job post not found
 */
router.patch("/approveJobPost/:id", verifyToken, approveJobPosting);

/**
 * @swagger
 * /api/jobPosting/rejectJobPost/{id}:
 *   patch:
 *     tags:
 *       - Manage Job Posting
 *     summary: Reject a job post
 *     description: This endpoint allows a manager to reject a job post.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the job post to reject
 *     responses:
 *       200:
 *         description: Job post rejected successfully
 *       400:
 *         description: Job post is already processed
 *       404:
 *         description: Job post not found
 */
router.patch("/rejectJobPost/:id", verifyToken, rejectJobPosting);

/**
 * @swagger
 * /api/jobPosting/filterJobPostings:
 *   get:
 *     tags:
 *       - Manage Job Posting
 *     summary: Get filtered job postings by jobTitle, jobType, and approvalStatus
 *     description: This endpoint allows filtering job postings based on jobTitle, jobType, approvalStatus, salary, jobTitle, and expiresAt (which can be a specific date or a date range).
 *     parameters:
 *       - in: query
 *         name: jobType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Full-time, Part-time, Contract, Internship, Freelance]
 *         description: The job type of the job posting to filter by
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Doha, Wakra, Al kurr]
 *         description: The location of the job posting to filter by
 *       - in: query
 *         name: approvalStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, pending, approved, rejected]
 *         description: The approval status of the job posting to filter by
 *       - in: query
 *         name: expiresAt
 *         required: false
 *         schema:
 *           type: string
 *           description: A specific date (e.g., "2025-12-31") or a date range (e.g., "2025-01-01 to 2025-12-31") to filter by job posting expiration date.
 *       - in: query
 *         name: salary
 *         required: false
 *         schema:
 *           type: decimal
 *           enum: [All, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]
 *         description: The salary of the job posting to filter by
 *       - in: query
 *         name: jobTitle
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Manager, HR Assistant, Sales Assistant, Finance Assistant]
 *         description: The job title of the job posting to filter by
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of job postings per page
 *     responses:
 *       200:
 *         description: A list of filtered job postings
 *       500:
 *         description: Server error
 */
router.get("/filterJobPostings", verifyToken, filterJobPosting);

/**
 * @swagger
 * /api/jobPosting/exportFilteredJobPostingToCSV:
 *   get:
 *     tags:
 *       - Manage Job Posting
 *     summary: Export filtered job posting data as CSV
 *     description: This endpoint allows you to export filtered job posting data in CSV format.
 *     parameters:
 *       - in: query
 *         name: jobType
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter job postings by job type
 *       - in: query
 *         name: location
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter job postings by location
 *       - in: query
 *         name: approvalStatus
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter job postings by approval status
 *       - in: query
 *         name: expiresAt
 *         required: false
 *         schema:
 *           type: string
 *           description: The expires at of the job posting to filter by
 *       - in: query
 *         name: salary
 *         required: false
 *         schema:
 *           type: integer
 *           description: The salary of the job posting to filter by
 *       - in: query
 *         name: jobTitle
 *         required: false
 *         schema:
 *           type: string
 *           description: The job title of the job posting to filter by
 *     responses:
 *       200:
 *         description: CSV file containing filtered job posting data
 *       500:
 *         description: Error exporting job postings to CSV
 */
router.get(
  "/exportFilteredJobPostingToCSV",
  verifyToken,
  exportFilteredJobPostingToCSV
);

/**
 * @swagger
 * /api/jobPosting/exportFilteredJobPostingToPDF:
 *   get:
 *     tags:
 *       - Manage Job Posting
 *     summary: Export filtered job posting data to PDF
 *     description: This endpoint allows exporting job posting data based on filters to a PDF file.
 *     parameters:
 *       - name: jobType
 *         in: query
 *         description: Filter by job type
 *         required: false
 *         schema:
 *           type: string
 *       - name: location
 *         in: query
 *         description: Filter by location
 *         required: false
 *         schema:
 *           type: string
 *       - name: approvalStatus
 *         in: query
 *         description: Filter by approval status
 *         required: false
 *         schema:
 *           type: string
 *       - name: expiresAt
 *         in: query
 *         description: Filter by expires at
 *         required: false
 *         schema:
 *           type: string
 *       - name: salary
 *         in: query
 *         description: Filter by salary
 *         required: false
 *         schema:
 *           type: integer
 *       - name: jobTitle
 *         in: query
 *         description: Filter by job title
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Limit number of records per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file with job posting data
 *       404:
 *         description: No job postings found matching the filters
 *       500:
 *         description: Internal server error
 */
router.get(
  "/exportFilteredJobPostingToPDF",
  verifyToken,
  exportFilteredJobPostingToPDF
);

module.exports = router;
