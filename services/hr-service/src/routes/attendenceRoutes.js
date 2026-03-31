const express = require("express");
const {
  createAttendence,
  updateAttendence,
  deleteAttendence,
  getAttendenceById,
  getAllAttendences,
  clockIn,
  clockOut,
  integrateAttendanceWithPayroll,
  filterAttendance,
  exportFilteredAttendanceToCSV,
  exportFilteredAttendanceToPDF,
} = require("../controllers/attendenceController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/attendence/createAttendence:
 *   post:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Create a new attendence data
 *     description: This endpoint allows to create a new attendence in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clockInTime:
 *                 type: date
 *               clockOutTime:
 *                 type: date
 *               date:
 *                 type: date
 *               remarks:
 *                 type: string
 *               status:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Attendence data created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createAttendence", verifyToken, createAttendence);

/**
 * @swagger
 * /api/attendence/updateAttendence/{id}:
 *   put:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Update an existing attendence data
 *     description: This endpoint allows to update an existing attendence's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attendence to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clockInTime:
 *                 type: date
 *               clockOutTime:
 *                 type: date
 *               date:
 *                 type: date
 *               remarks:
 *                 type: string
 *               status:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Attendence updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Attendence updated successfully"
 *                 attendence:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     clockInTime:
 *                       type: date
 *                     clockOutTime:
 *                       type: date
 *                     date:
 *                       type: date
 *                     remarks:
 *                       type: string
 *                     status:
 *                       type: string
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Attendence data not found
 *       500:
 *         description: Error updating attendence data
 */
router.put("/updateAttendence/:id", verifyToken, updateAttendence);

/**
 * @swagger
 * /api/attendence/deleteAttendence/{id}:
 *   delete:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Delete an existing attendence
 *     description: This endpoint allows to delete a attendence from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attendence to delete
 *     responses:
 *       200:
 *         description: Attendence data deleted successfully
 *       404:
 *         description: Attendence data not found
 */
router.delete("/deleteAttendence/:id", verifyToken, deleteAttendence);

/**
 * @swagger
 * /api/attendence/attendence/{id}:
 *   get:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Get a single attendence by ID
 *     description: This endpoint allows to retrieve a specific attendence by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the attendence to retrieve
 *     responses:
 *       200:
 *         description: Attendence data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     clockInTime:
 *                       type: date
 *                     clockOutTime:
 *                       type: date
 *                     date:
 *                       type: date
 *                     remarks:
 *                       type: string
 *                     status:
 *                       type: string
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Attendence data not found
 */
router.get("/attendence/:id", verifyToken, getAttendenceById);

/**
 * @swagger
 * /api/attendence/attendences:
 *   get:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Get all attendences with pagination
 *     description: This endpoint allows to retrieve all attendences in the system with pagination.
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
 *         description: Attendence data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     clockInTime:
 *                       type: date
 *                     clockOutTime:
 *                       type: date
 *                     date:
 *                       type: date
 *                     remarks:
 *                       type: string
 *                     status:
 *                       type: string
 *                     employeeId:
 *                       type: integer
 *       500:
 *         description: Error retrieving attendence data
 */
router.get("/attendences", verifyToken, getAllAttendences);

/**
 * @swagger
 * /api/attendence/clockIn:
 *   post:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Clock in an employee
 *     description: This endpoint allows an employee to clock in for the day.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               remarks:
 *                 type: string
 *     responses:
 *       201:
 *         description: Clock-in successful
 *       400:
 *         description: Employee already clocked in today
 *       500:
 *         description: Error clocking in the employee
 */
router.post("/clockIn", verifyToken, clockIn);

/**
 * @swagger
 * /api/attendence/clockOut:
 *   post:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Clock out an employee
 *     description: This endpoint allows an employee to clock out for the day.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               remarks:
 *                 type: string
 *     responses:
 *       200:
 *         description: Clock-out successful
 *       400:
 *         description: No clock-in record found for today
 *       500:
 *         description: Error clocking out the employee
 */
router.post("/clockOut", verifyToken, clockOut);

/**
 * @swagger
 * /api/attendence/integrateWithPayroll:
 *   post:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Integrate attendance data with payroll
 *     description: This endpoint processes attendance data and creates or updates the payroll for the employee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               month:
 *                 type: string
 *               year:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payroll integrated successfully
 *       500:
 *         description: Error integrating attendance with payroll
 */
router.post("/integrateWithPayroll", verifyToken, integrateAttendanceWithPayroll);

/**
 * @swagger
 * /api/attendence/filterAttendance:
 *   get:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Get filtered attendance data
 *     description: This endpoint allows filtering attendance data based on date, status, and pagination.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           description: A specific date (e.g., "2025-12-31") or a date range (e.g., "2025-01-01 to 2025-12-31") to filter by attendance date.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, present, absent, late, half-day, clocked Out]
 *         description: The attendance status to filter by.
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
 *         description: A list of filtered attendance records.
 *       500:
 *         description: Server error.
 */
router.get("/filterAttendance", verifyToken, filterAttendance);

/**
 * @swagger
 * /api/attendence/exportFilteredAttendanceToCSV:
 *   get:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Export filtered attendance data as CSV
 *     description: This endpoint allows exporting filtered attendance data in CSV format.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           description: A specific date or a date range to filter by attendance date.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, present, absent, late, half-day, clocked Out]
 *         description: The attendance status to filter by.
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
 *         description: CSV file containing filtered attendance data.
 *       500:
 *         description: Error exporting attendance data to CSV.
 */
router.get("/exportFilteredAttendanceToCSV", verifyToken, exportFilteredAttendanceToCSV);

/**
 * @swagger
 * /api/attendence/exportFilteredAttendanceToPDF:
 *   get:
 *     tags:
 *       - Manage Attendence Data
 *     summary: Export filtered attendance data to PDF
 *     description: This endpoint allows exporting filtered attendance data to a PDF file.
 *     parameters:
 *       - in: query
 *         name: date
 *         required: false
 *         schema:
 *           type: string
 *           description: A specific date or a date range to filter by attendance date.
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, present, absent, late, half-day, clocked Out]
 *         description: The attendance status to filter by.
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
 *         description: PDF file with filtered attendance data.
 *       404:
 *         description: No attendance found matching the filters.
 *       500:
 *         description: Internal server error.
 */
router.get("/exportFilteredAttendanceToPDF", verifyToken, exportFilteredAttendanceToPDF);

module.exports = router;