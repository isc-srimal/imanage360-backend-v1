const express = require("express");
const {
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  getLeaveTypeById,
  getAllLeaveTypes,
  filterLeaveTypes,
  exportFilteredLeaveTypeToCSV,
  exportFilteredLeaveTypeToPDF,
} = require("../controllers/leaveTypeController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/leaveType/createLeaveType:
 *   post:
 *     tags:
 *       - Manage Leave Types
 *     summary: Register a new leave type
 *     description: This endpoint allows to register a new leave type in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveTypeName:
 *                 type: string
 *               leaveTypeNameArabic:
 *                 type: string
 *               description:
 *                 type: string
 *               numberOfLeavePerMonth:
 *                 type: integer
 *               numberOfLeavePerYear:
 *                 type: integer
 *               employeeType:
 *                 type: string
 *               leaveType:
 *                 type: string
 *                 enum: [Paid-Leave, Non-Paid-Leave]
 *               createdBy:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Leave type created successfully
 *       500:
 *         description: Error creating leave type
 */
router.post("/createLeaveType", verifyToken, createLeaveType);

/**
 * @swagger
 * /api/leaveType/updateLeaveType/{id}:
 *   put:
 *     tags:
 *       - Manage Leave Types
 *     summary: Update an existing leave type
 *     description: This endpoint allows to update an existing leave type's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leaveTypeName:
 *                 type: string
 *               leaveTypeNameArabic:
 *                 type: string
 *               description:
 *                 type: string
 *               numberOfLeavePerMonth:
 *                 type: integer
 *               numberOfLeavePerYear:
 *                 type: integer
 *               employeeType:
 *                 type: string
 *               leaveType:
 *                 type: string
 *                 enum: [Paid-Leave, Non-Paid-Leave]
 *               createdBy:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Leave type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Leave type updated successfully"
 *                 leaveType:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     leaveTypeName:
 *                       type: string
 *                     leaveTypeNameArabic:
 *                       type: string
 *                     description:
 *                       type: string
 *                     numberOfLeavePerMonth:
 *                       type: integer
 *                     numberOfLeavePerYear:
 *                       type: integer
 *                     employeeType:
 *                       type: string
 *                     leaveType:
 *                       type: string
 *                       enum: [Paid-Leave, Non-Paid-Leave]
 *                     createdBy:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Leave type not found
 *       500:
 *         description: Error updating leave type
 */
router.put("/updateLeaveType/:id", verifyToken, updateLeaveType);

/**
 * @swagger
 * /api/leaveType/deleteLeaveType/{id}:
 *   delete:
 *     tags:
 *       - Manage Leave Types
 *     summary: Delete an existing leave type
 *     description: This endpoint allows to delete a leave type from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave type to delete
 *     responses:
 *       200:
 *         description: Leave type deleted successfully
 *       404:
 *         description: Leave type not found
 */
router.delete("/deleteLeaveType/:id", verifyToken, deleteLeaveType);

/**
 * @swagger
 * /api/leaveType/leaveType/{id}:
 *   get:
 *     tags:
 *       - Manage Leave Types
 *     summary: Get a single leave type by ID
 *     description: This endpoint allows to retrieve a specific leave type by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the leave type to retrieve
 *     responses:
 *       200:
 *         description: Leave type retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     leaveTypeName:
 *                       type: string
 *                     leaveTypeNameArabic:
 *                       type: string
 *                     description:
 *                       type: string
 *                     numberOfLeavePerMonth:
 *                       type: integer
 *                     numberOfLeavePerYear:
 *                       type: integer
 *                     employeeType:
 *                       type: string
 *                     leaveType:
 *                       type: string
 *                       enum: [Paid-Leave, Non-Paid-Leave]
 *                     createdBy:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Leave type not found
 */
router.get("/leaveType/:id", verifyToken, getLeaveTypeById);

/**
 * @swagger
 * /api/leaveType/leaveTypes:
 *   get:
 *     tags:
 *       - Manage Leave Types
 *     summary: Get all leave types with pagination
 *     description: This endpoint allows to retrieve all leave types in the system with pagination.
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
 *         description: The number of leave types per page (default is 10)
 *     responses:
 *       200:
 *         description: Leave types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLeaveTypes:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 leaveTypes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                           id:
 *                             type: integer
 *                           leaveTypeName:
 *                             type: string
 *                           leaveTypeNameArabic:
 *                             type: string
 *                           description:
 *                             type: string
 *                           numberOfLeavePerMonth:
 *                             type: integer
 *                           numberOfLeavePerYear:
 *                             type: integer
 *                           employeeType:
 *                             type: string
 *                           leaveType:
 *                             type: string
 *                             enum: [Paid-Leave, Non-Paid-Leave]
 *                           createdBy:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [Active, Inactive]
 *       500:
 *         description: Error retrieving leave types
 */
router.get("/leaveTypes", verifyToken, getAllLeaveTypes);

/**
 * @swagger
 * /api/leaveType/filterLeaveTypes:
 *   get:
 *     tags:
 *       - Manage Leave Types
 *     summary: Filter leave types based on parameters
 *     description: This endpoint allows filtering leave types based on various query parameters.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Paid-Leave, Non-Paid-Leave]
 *       - in: query
 *         name: createdBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, HR, Manager, Admin]
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
 *         description: Filtered leave types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalLeaveTypes:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 leaveTypes:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error filtering leave types
 */
router.get("/filterLeaveTypes", verifyToken, filterLeaveTypes);

/**
 * @swagger
 * /api/leaveType/exportFilteredLeaveTypeToCSV:
 *   get:
 *     tags:
 *       - Manage Leave Types
 *     summary: Export filtered leave types to CSV
 *     description: This endpoint allows you to export filtered leave types to a CSV file.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Paid-Leave, Non-Paid-Leave]
 *       - in: query
 *         name: createdBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, HR, Manager, Admin]
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *     responses:
 *       200:
 *         description: CSV file containing filtered leave types
 *       500:
 *         description: Error exporting leave types to CSV
 */
router.get("/exportFilteredLeaveTypeToCSV", verifyToken, exportFilteredLeaveTypeToCSV);

/**
 * @swagger
 * /api/leaveType/exportFilteredLeaveTypeToPDF:
 *   get:
 *     tags:
 *       - Manage Leave Types
 *     summary: Export filtered leave types to PDF
 *     description: This endpoint allows exporting filtered leave types data to a PDF file.
 *     parameters:
 *       - in: query
 *         name: leaveType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Paid-Leave, Non-Paid-Leave]
 *       - in: query
 *         name: createdBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, HR, Manager, Admin]
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *     responses:
 *       200:
 *         description: PDF file with filtered leave types
 *       500:
 *         description: Error exporting leave types to PDF
 */
router.get("/exportFilteredLeaveTypeToPDF", verifyToken, exportFilteredLeaveTypeToPDF);

module.exports = router;