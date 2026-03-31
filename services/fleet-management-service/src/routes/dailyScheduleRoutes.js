const express = require("express");
const {
  createDailySchedule,
  updateDailySchedule,
  deleteDailySchedule,
  getDailyScheduleById,
  getAllDailySchedules,
  filterDailySchedules,
  exportFilteredDailySchedulesToCSV,
  exportFilteredDailySchedulesToPDF,
  getAlerts,
  resolveAlert,
  updateScheduleStatus,
} = require("../controllers/dailyScheduleController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/schedules/alerts:
 *   get:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Get active alerts
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
 *       - in: query
 *         name: alert_type
 *         required: false
 *         schema:
 *           type: string
 *           enum: [breakdown, idle]
 *     responses:
 *       200:
 *         description: Alerts retrieved successfully
 *       500:
 *         description: Error retrieving alerts
 */
router.get("/alerts", verifyToken, getAlerts);

/**
 * @swagger
 * /api/schedules/resolveAlert/{schedule_id}:
 *   put:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Resolve an alert
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the schedule to resolve alert for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resolution_notes:
 *                 type: string
 *               resolved_by:
 *                 type: string
 *     responses:
 *       200:
 *         description: Alert resolved successfully
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Error resolving alert
 */
router.put("/resolveAlert/:schedule_id", verifyToken, resolveAlert);

/**
 * @swagger
 * /api/schedules/updateStatus/{schedule_id}:
 *   put:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Update schedule status and alert status
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               alert_status:
 *                 type: string
 *                 enum: [active, resolved]
 *     responses:
 *       200:
 *         description: Schedule status updated successfully
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Error updating schedule status
 */
router.put("/updateStatus/:schedule_id", verifyToken, updateScheduleStatus);

/**
 * @swagger
 * /api/schedules/createDailySchedule:
 *   post:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Create a new daily schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               employeeFullName:
 *                 type: string
 *               client:
 *                 type: string
 *               serial_number:
 *                 type: integer
 *               equipmentDetails:
 *                 type: string
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Daily schedule created successfully
 *       500:
 *         description: Error creating daily schedule
 */
router.post("/createDailySchedule", verifyToken, createDailySchedule);

/**
 * @swagger
 * /api/schedules/updateDailySchedule/{schedule_id}:
 *   put:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Update an existing daily schedule
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the daily schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               employeeFullName:
 *                 type: string
 *               client:
 *                 type: string
 *               serial_number:
 *                 type: integer
 *               equipmentDetails:
 *                 type: string
 *               status:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Daily schedule updated successfully
 *       404:
 *         description: Daily schedule not found
 *       500:
 *         description: Error updating daily schedule
 */
router.put("/updateDailySchedule/:schedule_id", verifyToken, updateDailySchedule);

/**
 * @swagger
 * /api/schedules/deleteDailySchedule/{schedule_id}:
 *   delete:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Delete a daily schedule by ID
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the daily schedule to delete
 *     responses:
 *       200:
 *         description: Daily schedule deleted successfully
 *       404:
 *         description: Daily schedule not found
 *       500:
 *         description: Error deleting daily schedule
 */
router.delete("/deleteDailySchedule/:schedule_id", verifyToken, deleteDailySchedule);

/**
 * @swagger
 * /api/schedules/dailySchedule/{schedule_id}:
 *   get:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Get a single daily schedule by ID
 *     parameters:
 *       - in: path
 *         name: schedule_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the daily schedule
 *     responses:
 *       200:
 *         description: Daily schedule retrieved successfully
 *       404:
 *         description: Daily schedule not found
 */
router.get("/dailySchedule/:schedule_id", verifyToken, getDailyScheduleById);

/**
 * @swagger
 * /api/schedules/dailySchedules:
 *   get:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Get all daily schedules with pagination
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
 *         description: Daily schedules retrieved successfully
 *       500:
 *         description: Error retrieving daily schedules
 */
router.get("/dailySchedules", verifyToken, getAllDailySchedules);

/**
 * @swagger
 * /api/schedules/filterDailySchedules:
 *   get:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Filter daily schedules by status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           default: All
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
 *         description: Filtered daily schedules retrieved successfully
 *       500:
 *         description: Error filtering daily schedules
 */
router.get("/filterDailySchedules", verifyToken, filterDailySchedules);

/**
 * @swagger
 * /api/schedules/exportFilteredDailySchedulesToCSV:
 *   get:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Export filtered daily schedules to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: All
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
router.get("/exportFilteredDailySchedulesToCSV", verifyToken, exportFilteredDailySchedulesToCSV);

/**
 * @swagger
 * /api/schedules/exportFilteredDailySchedulesToPDF:
 *   get:
 *     tags:
 *       - Manage Daily Schedules
 *     summary: Export filtered daily schedules to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           default: All
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
router.get("/exportFilteredDailySchedulesToPDF", verifyToken, exportFilteredDailySchedulesToPDF);

module.exports = router;