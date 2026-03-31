const express = require("express");
const {
    uploadMedicalReport,
    createApplyLeave,
    updateApplyLeave,
    deleteApplyLeave,
    getApplyLeaveById,
    getAllApplyLeaves,
    approveLeave,
    rejectLeave,
    filterApplyLeave,
    exportFilteredApplyLeaveToCSV,
    exportFilteredApplyLeaveToPDF,
} = require("../controllers/leaveApprovalController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/applyLeave/createApplyLeave:
 *   post:
 *     tags:
 *       - Leave Approval Data
 *     summary: Create a new apply leave
 *     description: This endpoint allows to create a new apply leave in the ERP system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date
 *               toDate:
 *                 type: string
 *                 format: date
 *               appliedDate:
 *                 type: string
 *                 format: date
 *               leaveType:
 *                 type: string
 *                 enum: [Casual, Annual, Medical]
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Approved, Pending, Rejected]
 *               checkedBy:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *               medicalReport:
 *                 type: string
 *                 format: binary
 *                 description: Optional - upload only for Medical leave
 *             required:
 *               - fromDate
 *               - toDate
 *               - appliedDate
 *               - leaveType
 *               - reason
 *               - employeeId
 *     responses:
 *       201:
 *         description: Apply leave created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Apply leave created successfully"
 *                 applyleave:
 *                   $ref: '#/components/schemas/ApplyLeave'
 *       400:
 *         description: Invalid request (missing required fields or invalid file type)
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post("/createApplyLeave", verifyToken, uploadMedicalReport, createApplyLeave);

/**
 * @swagger
 * /api/applyLeave/updateApplyLeave/{id}:
 *   put:
 *     tags:
 *       - Leave Approval Data
 *     summary: Update an existing apply leave data
 *     description: This endpoint allows to update an existing apply leave's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the apply leave to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromDate:
 *                 type: date
 *               toDate:
 *                 type: date
 *               appliedDate:
 *                 type: date
 *               medicalReport:
 *                 type: string
 *               leaveType:
 *                 type: string
 *                 enum: [Casual, Annual, Medical]
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Approved, Pending, Rejected]
 *               checkedBy:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Apply leave updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Apply leave updated successfully"
 *                 applyLeave:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     fromDate:
 *                       type: date
 *                     toDate:
 *                       type: date
 *                     appliedDate:
 *                       type: date
 *                     medicalReport:
 *                       type: string
 *                     leaveType:
 *                       type: string
 *                       enum: [Casual, Annual, Medical]
 *                     reason:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Approved, Pending, Rejected]
 *                     checkedBy:
 *                       type: string
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Apply leave data not found
 *       500:
 *         description: Error updating apply leave data
 */
router.put("/updateApplyLeave/:id", verifyToken, updateApplyLeave);

/**
 * @swagger
 * /api/applyLeave/deleteApplyLeave/{id}:
 *   delete:
 *     tags:
 *       - Leave Approval Data
 *     summary: Delete an existing apply leave
 *     description: This endpoint allows to delete a apply leave from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the apply leave to delete
 *     responses:
 *       200:
 *         description: Apply leave data deleted successfully
 *       404:
 *         description: Apply leave data not found
 */
router.delete("/deleteApplyLeave/:id", verifyToken, deleteApplyLeave);

/**
 * @swagger
 * /api/applyLeave/applyleave/{id}:
 *   get:
 *     tags:
 *       - Leave Approval Data
 *     summary: Get a single apply leave by ID
 *     description: This endpoint allows to retrieve a specific apply leave by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the apply leave to retrieve
 *     responses:
 *       200:
 *         description: Apply leave data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     fromDate:
 *                       type: date
 *                     toDate:
 *                       type: date
 *                     appliedDate:
 *                       type: date
 *                     medicalReport:
 *                       type: string
 *                     leaveType:
 *                       type: string
 *                       enum: [Casual, Annual, Medical]
 *                     reason:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Approved, Pending, Rejected]
 *                     checkedBy:
 *                       type: string
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Apply leave data not found
 */
router.get("/applyleave/:id", verifyToken, getApplyLeaveById);

/**
 * @swagger
 * /api/applyLeave/applyleaves:
 *   get:
 *     tags:
 *       - Leave Approval Data
 *     summary: Get all apply leaves with pagination
 *     description: This endpoint allows to retrieve all apply leaves in the system with pagination.
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
 *         description: Apply leave data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     fromDate:
 *                       type: date
 *                     toDate:
 *                       type: date
 *                     appliedDate:
 *                       type: date
 *                     medicalReport:
 *                       type: string
 *                     leaveType:
 *                       type: string
 *                       enum: [Casual, Annual, Medical]
 *                     reason:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Approved, Pending, Rejected]
 *                     checkedBy:
 *                       type: string
 *                     employeeId:
 *                       type: integer
 *       500:
 *         description: Error retrieving apply leave data
 */
router.get("/applyleaves", verifyToken, getAllApplyLeaves);

/**
 * @swagger
 * /api/applyLeave/applyleave/{id}/approved:
 *   patch:
 *     tags:
 *       - Leave Approval Data
 *     summary: Approve a leave application
 *     description: Approves a specific leave application by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Leave application ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave approved successfully
 *       404:
 *         description: Leave not found
 *       500:
 *         description: Error approving leave
 */
router.patch("/applyleave/:id/approved", verifyToken, approveLeave);

/**
 * @swagger
 * /api/applyLeave/applyleave/{id}/rejected:
 *   patch:
 *     tags:
 *       - Leave Approval Data
 *     summary: Reject a leave application
 *     description: Rejects a specific leave application by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Leave application ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               checkedBy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave rejected successfully
 *       404:
 *         description: Leave not found
 *       500:
 *         description: Error rejecting leave
 */
router.patch("/applyleave/:id/rejected", verifyToken, rejectLeave);

/**
 * @swagger
 * /api/applyLeave/filterApplyLeave:
 *   get:
 *     tags:
 *       - Leave Approval Data
 *     summary: Get filtered apply leave data
 *     description: This endpoint allows filtering apply leaves based on leave type, status, and pagination.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Casual, Annual, Medical]
 *         description: The leave type to filter by.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Approved, Pending, Rejected]
 *         description: The leave status to filter by.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A list of filtered apply leaves.
 *       500:
 *         description: Server error.
 */
router.get("/filterApplyLeave", verifyToken, filterApplyLeave);

/**
 * @swagger
 * /api/applyLeave/exportFilteredApplyLeaveToCSV:
 *   get:
 *     tags:
 *       - Leave Approval Data
 *     summary: Export filtered apply leave data as CSV
 *     description: This endpoint allows exporting filtered apply leaves in CSV format.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Casual, Annual, Medical]
 *         description: The leave type to filter by.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Approved, Pending, Rejected]
 *         description: The leave status to filter by.
 *       - in: query
 *         name: searchTerm
 *         required: false
 *         schema:
 *           type: string
 *         description: Search term to filter by employee name.
 *       - in: query
 *         name: fromDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for leave period filter.
 *       - in: query
 *         name: toDate
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for leave period filter.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: CSV file containing filtered apply leaves.
 *       500:
 *         description: Error exporting apply leaves to CSV.
 */
router.get('/exportFilteredApplyLeaveToCSV', verifyToken, exportFilteredApplyLeaveToCSV);

/**
 * @swagger
 * /api/applyLeave/exportFilteredApplyLeaveToPDF:
 *   get:
 *     tags:
 *       - Leave Approval Data
 *     summary: Export filtered apply leave data to PDF
 *     description: This endpoint allows exporting filtered apply leaves to a PDF file.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Casual, Annual, Medical]
 *         description: The leave type to filter by.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Approved, Pending, Rejected]
 *         description: The leave status to filter by.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: PDF file with filtered apply leaves.
 *       404:
 *         description: No apply leaves found matching the filters.
 *       500:
 *         description: Internal server error.
 */
router.get("/exportFilteredApplyLeaveToPDF", verifyToken, exportFilteredApplyLeaveToPDF);

module.exports = router;