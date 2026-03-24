const express = require("express");
const {
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  getMaintenanceById,
  getAllMaintenance,
  filterMaintenance,
  exportFilteredMaintenanceToCSV,
  exportFilteredMaintenanceToPDF,
} = require("../../controllers/fleet-management/maintenanceController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/maintenance/createMaintenance:
 *   post:
 *     tags:
 *       - Manage Maintenance
 *     summary: Create a new maintenance record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plate_number:
 *                 type: string
 *               reported_date:
 *                 type: string
 *                 format: date
 *               reported_time:
 *                 type: string
 *               reported_by:
 *                 type: string
 *               customer_name:
 *                 type: string
 *               job_location_id:
 *                 type: integer
 *               main_category_id:
 *                 type: integer
 *               maintenance_vehicle_plate_number:
 *                 type: string
 *               job_attented_date:
 *                 type: string
 *                 format: date
 *               job_attented_time:
 *                 type: string
 *               job_completed_date:
 *                 type: string
 *                 format: date
 *               job_completed_time:
 *                 type: string
 *               odometer:
 *                 type: number
 *               actual_service_intervels:
 *                 type: number
 *               actual_cost:
 *                 type: number
 *               approximate_cost:
 *                 type: number
 *               service_category_id:
 *                 type: integer
 *               service_provider_id:
 *                 type: integer
 *               service_type_one_id:
 *                 type: integer
 *               service_type_two_id:
 *                 type: integer
 *               technician:
 *                 type: string
 *               service_diagnosis:
 *                 type: string
 *               reported_issue:
 *                 type: string
 *               root_cause_failure:
 *                 type: string
 *               next_service_date:
 *                 type: string
 *                 format: date
 *               engine_hours:
 *                 type: number
 *               next_service_type_id:
 *                 type: integer
 *               notification:
 *                 type: string
 *               notes:
 *                 type: string
 *               supplier:
 *                 type: string
 *               supplier_invice_no:
 *                 type: string
 *     responses:
 *       201:
 *         description: Maintenance record created successfully
 *       500:
 *         description: Error creating maintenance record
 */
router.post("/createMaintenance", verifyToken, createMaintenance);

/**
 * @swagger
 * /api/maintenance/updateMaintenance/{id}:
 *   put:
 *     tags:
 *       - Manage Maintenance
 *     summary: Update an existing maintenance record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the maintenance record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plate_number:
 *                 type: string
 *               reported_date:
 *                 type: string
 *                 format: date
 *               reported_time:
 *                 type: string
 *               reported_by:
 *                 type: string
 *               customer_name:
 *                 type: string
 *               job_location_id:
 *                 type: integer
 *               main_category_id:
 *                 type: integer
 *               maintenance_vehicle_plate_number:
 *                 type: string
 *               job_attented_date:
 *                 type: string
 *                 format: date
 *               job_attented_time:
 *                 type: string
 *               job_completed_date:
 *                 type: string
 *                 format: date
 *               job_completed_time:
 *                 type: string
 *               odometer:
 *                 type: number
 *               actual_service_intervels:
 *                 type: number
 *               actual_cost:
 *                 type: number
 *               approximate_cost:
 *                 type: number
 *               service_category_id:
 *                 type: integer
 *               service_provider_id:
 *                 type: integer
 *               service_type_one_id:
 *                 type: integer
 *               service_type_two_id:
 *                 type: integer
 *               technician:
 *                 type: string
 *               service_diagnosis:
 *                 type: string
 *               reported_issue:
 *                 type: string
 *               root_cause_failure:
 *                 type: string
 *               next_service_date:
 *                 type: string
 *                 format: date
 *               engine_hours:
 *                 type: number
 *               next_service_type_id:
 *                 type: integer
 *               notification:
 *                 type: string
 *               notes:
 *                 type: string
 *               supplier:
 *                 type: string
 *               supplier_invice_no:
 *                 type: string
 *     responses:
 *       200:
 *         description: Maintenance record updated successfully
 *       404:
 *         description: Maintenance record not found
 *       500:
 *         description: Error updating maintenance record
 */
router.put("/updateMaintenance/:id", verifyToken, updateMaintenance);

/**
 * @swagger
 * /api/maintenance/deleteMaintenance/{id}:
 *   delete:
 *     tags:
 *       - Manage Maintenance
 *     summary: Delete a maintenance record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the maintenance record to delete
 *     responses:
 *       200:
 *         description: Maintenance record deleted successfully
 *       404:
 *         description: Maintenance record not found
 *       500:
 *         description: Error deleting maintenance record
 */
router.delete("/deleteMaintenance/:id", verifyToken, deleteMaintenance);

/**
 * @swagger
 * /api/maintenance/maintenance/{id}:
 *   get:
 *     tags:
 *       - Manage Maintenance
 *     summary: Get a single maintenance record by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the maintenance record
 *     responses:
 *       200:
 *         description: Maintenance record retrieved successfully
 *       404:
 *         description: Maintenance record not found
 *       500:
 *         description: Error retrieving maintenance record
 */
router.get("/maintenance/:id", verifyToken, getMaintenanceById);

/**
 * @swagger
 * /api/maintenance/maintenances:
 *   get:
 *     tags:
 *       - Manage Maintenance
 *     summary: Get all maintenance records with pagination
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
 *         description: Maintenance records retrieved successfully
 *       500:
 *         description: Error retrieving maintenance records
 */
router.get("/maintenances", verifyToken, getAllMaintenance);

/**
 * @swagger
 * /api/maintenance/filterMaintenance:
 *   get:
 *     tags:
 *       - Manage Maintenance
 *     summary: Filter maintenance records by job card number or plate number
 *     parameters:
 *       - in: query
 *         name: job_card_no
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: plate_number
 *         required: false
 *         schema:
 *           type: string
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
 *         description: Filtered maintenance records retrieved successfully
 *       500:
 *         description: Error filtering maintenance records
 */
router.get("/filterMaintenance", verifyToken, filterMaintenance);

/**
 * @swagger
 * /api/maintenance/exportFilteredMaintenanceToCSV:
 *   get:
 *     tags:
 *       - Manage Maintenance
 *     summary: Export filtered maintenance records to CSV
 *     parameters:
 *       - in: query
 *         name: job_card_no
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: plate_number
 *         required: false
 *         schema:
 *           type: string
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
 *         description: CSV file download
 *       404:
 *         description: No maintenance records found
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportFilteredMaintenanceToCSV", verifyToken, exportFilteredMaintenanceToCSV);

/**
 * @swagger
 * /api/maintenance/exportFilteredMaintenanceToPDF:
 *   get:
 *     tags:
 *       - Manage Maintenance
 *     summary: Export filtered maintenance records to PDF
 *     parameters:
 *       - in: query
 *         name: job_card_no
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: plate_number
 *         required: false
 *         schema:
 *           type: string
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
 *         description: PDF file download
 *       404:
 *         description: No maintenance records found
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportFilteredMaintenanceToPDF", verifyToken, exportFilteredMaintenanceToPDF);

module.exports = router;