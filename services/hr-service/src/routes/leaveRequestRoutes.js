const express = require("express");
const {
    uploadMedicalReport,
    createLeave,
    updateLeave,
    deleteLeave,
    getLeaveById,
    getAllLeaves,
    approveLeave,
    rejectLeave,
    filterLeaveRequest,
    exportFilteredLeaveRequestToCSV,
    exportFilteredLeaveRequestToPDF,
} = require("../../controllers/hr/leaveRequestController");
const { verifyToken } = require("../../middleware/authMiddleware");
const { roleCheck } = require("../../middleware/roleMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/leave/createLeave:
 *   post:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Create a new leave request
 *     description: This endpoint allows to create a new leave request in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveStartDate:
 *                 type: date
 *               leaveEndDate:
 *                 type: date
 *               leaveType:
 *                 type: string
 *                 enum: [sick, casual, vacation, unpaid]
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *               approvedBy:
 *                 type: integer
 *               approvalDate:
 *                 type: date
 *               employeeId:
 *                 type: integer
 *               medicalReport:
 *                 type: string
 *                 format: binary
 *                 description: Optional - upload only for Medical leave
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createLeave", verifyToken, uploadMedicalReport, createLeave);

/**
 * @swagger
 * /api/leave/updateLeave/{id}:
 *   put:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Update an existing leave data
 *     description: This endpoint allows to update an existing leave's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveStartDate:
 *                 type: date
 *               leaveEndDate:
 *                 type: date
 *               leaveType:
 *                 type: string
 *                 enum: [sick, casual, vacation, unpaid]
 *               reason:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [approved, pending, rejected]
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Leave updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Leave updated successfully"
 *                 attendence:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     leaveStartDate:
 *                       type: date
 *                     leaveEndDate:
 *                       type: date
 *                     leaveType:
 *                       type: string
 *                       enum: [sick, casual, vacation, unpaid]
 *                     reason:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [approved, pending, rejected]
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Leave data not found
 *       500:
 *         description: Error updating leave data
 */
router.put("/updateLeave/:id", verifyToken, updateLeave);

/**
 * @swagger
 * /api/leave/deleteLeave/{id}:
 *   delete:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Delete an existing leave
 *     description: This endpoint allows to delete a leave from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave to delete
 *     responses:
 *       200:
 *         description: Leave data deleted successfully
 *       404:
 *         description: Leave data not found
 */
router.delete("/deleteLeave/:id", verifyToken, deleteLeave);

/**
 * @swagger
 * /api/leave/leave/{id}:
 *   get:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Get a single leave by ID
 *     description: This endpoint allows to retrieve a specific leave by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave to retrieve
 *     responses:
 *       200:
 *         description: Leave data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     leaveStartDate:
 *                       type: date
 *                     leaveEndDate:
 *                       type: date
 *                     leaveType:
 *                       type: string
 *                       enum: [sick, casual, vacation, unpaid]
 *                     reason:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [approved, pending, rejected]
 *                     approvedBy:
 *                       type: integer
 *                     approvalDate:
 *                       type: date
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Leave data not found
 */
router.get("/leave/:id", verifyToken, getLeaveById);

/**
 * @swagger
 * /api/leave/leaves:
 *   get:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Get all leaves with pagination
 *     description: This endpoint allows to retrieve all leaves in the system with pagination.
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
 *         description: Leave data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     leaveStartDate:
 *                       type: date
 *                     leaveEndDate:
 *                       type: date
 *                     leaveType:
 *                       type: string
 *                       enum: [sick, casual, vacation, unpaid]
 *                     reason:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [approved, pending, rejected]
 *                     approvedBy:
 *                       type: integer
 *                     approvalDate:
 *                       type: date
 *                     employeeId:
 *                       type: integer
 *       500:
 *         description: Error retrieving leave data
 */
router.get("/leaves", verifyToken, getAllLeaves);

/**
 * @swagger
 * /api/leave/approve/{id}:
 *   post:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Approve a leave request
 *     description: This endpoint allows HR or Reporting Manager to approve a leave request.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave request to approve
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approverId:
 *                 type: integer
 *                 description: ID of the approver (HR or Reporting Manager)
 *     responses:
 *       200:
 *         description: Leave request approved successfully
 *       400:
 *         description: Leave request is already processed
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Error approving the leave request
 */
router.post("/approve/:id", verifyToken, roleCheck(['HR', 'Manager']), approveLeave);

/**
 * @swagger
 * /api/leave/reject/{id}:
 *   post:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Reject a leave request
 *     description: This endpoint allows HR or Reporting Manager to reject a leave request.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave request to reject
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               approverId:
 *                 type: integer
 *                 description: ID of the approver (HR or Reporting Manager)
 *     responses:
 *       200:
 *         description: Leave request rejected successfully
 *       400:
 *         description: Leave request is already processed
 *       404:
 *         description: Leave request not found
 *       500:
 *         description: Error rejecting the leave request
 */
router.post("/reject/:id", verifyToken, roleCheck(['HR', 'Manager']), rejectLeave);

/**
 * @swagger
 * /api/leave/filterLeaveRequest:
 *   get:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Get filtered leave request data
 *     description: This endpoint allows filtering leave requests based on leave type, status, and pagination.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, sick, casual, vacation, unpaid]
 *         description: The leave type to filter by.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, approved, pending, rejected]
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
 *         description: A list of filtered leave requests.
 *       500:
 *         description: Server error.
 */
router.get("/filterLeaveRequest", verifyToken, filterLeaveRequest);

/**
 * @swagger
 * /api/leave/exportFilteredLeaveRequestToCSV:
 *   get:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Export filtered leave request data as CSV
 *     description: This endpoint allows exporting filtered leave requests in CSV format.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, sick, casual, vacation, unpaid]
 *         description: The leave type to filter by.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, approved, pending, rejected]
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
 *         description: CSV file containing filtered leave requests.
 *       500:
 *         description: Error exporting leave requests to CSV.
 */
router.get("/exportFilteredLeaveRequestToCSV", verifyToken, exportFilteredLeaveRequestToCSV);

/**
 * @swagger
 * /api/leave/exportFilteredLeaveRequestToPDF:
 *   get:
 *     tags:
 *       - Manage Leave Request Data
 *     summary: Export filtered leave request data to PDF
 *     description: This endpoint allows exporting filtered leave requests to a PDF file.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, sick, casual, vacation, unpaid]
 *         description: The leave type to filter by.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, approved, pending, rejected]
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
 *         description: PDF file with filtered leave requests.
 *       404:
 *         description: No leave requests found matching the filters.
 *       500:
 *         description: Internal server error.
 */
router.get("/exportFilteredLeaveRequestToPDF", verifyToken, exportFilteredLeaveRequestToPDF);

module.exports = router;