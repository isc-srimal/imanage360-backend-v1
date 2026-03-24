const express = require("express");
const {
  uploadEquipments,
  createEquipment,
  updateEquipment,
  getEquipmentPhotos,
  getEquipmentDocuments,
  serveEquipmentFile,
  deleteEquipment,
  getEquipmentById,
  getAllEquipment,
  createEquipmentFromAsset,
  getEquipmentSchedule,
  filterEquipment,
  exportFilteredEquipmentToCSV,
  exportFilteredEquipmentToPDF,
} = require("../../controllers/fleet-management/equipmentController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/equipment/createEquipment:
 *   post:
 *     tags:
 *       - Manage Equipment
 *     summary: Create a new equipment record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *               owner_id:
 *                 type: integer
 *               reg_number:
 *                 type: string
 *               serial_numbers:
 *                 type: string
 *               engine_number:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               manufacturer:
 *                 type: string
 *               model:
 *                 type: string
 *               vehicle_type:
 *                 type: string
 *               VIN:
 *                 type: string
 *               description:
 *                 type: string
 *               year_of_manufacture:
 *                 type: integer
 *               departmentName:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *               barcode:
 *                 type: string
 *               rfid_tag:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Equipment created successfully
 *       500:
 *         description: Error creating equipment
 */
router.post("/createEquipment", verifyToken, uploadEquipments, createEquipment);

/**
 * @swagger
 * /api/equipment/updateEquipment/{serial_number}:
 *   put:
 *     tags:
 *       - Manage Equipment
 *     summary: Update an existing equipment record
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Serial number of the equipment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *               owner_id:
 *                 type: integer
 *               reg_number:
 *                 type: string
 *               serial_numbers:
 *                 type: string
 *               engine_number:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               subcategory_id:
 *                 type: integer
 *               manufacturer:
 *                 type: string
 *               model:
 *                 type: string
 *               vehicle_type:
 *                 type: string
 *               VIN:
 *                 type: string
 *               description:
 *                 type: string
 *               year_of_manufacture:
 *                 type: integer
 *               departmentName:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *               barcode:
 *                 type: string
 *               rfid_tag:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               existing_photos:
 *                 type: string
 *               existing_documents:
 *                 type: string
 *     responses:
 *       200:
 *         description: Equipment updated successfully
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Error updating equipment
 */
router.put("/updateEquipment/:serial_number", verifyToken, uploadEquipments, updateEquipment);

/**
 * @swagger
 * /api/equipment/{serial_number}/photos:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Get photos for an equipment
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the equipment
 *     responses:
 *       200:
 *         description: Equipment photos retrieved successfully
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Error retrieving photos
 */
router.get("/:serial_number/photos", verifyToken, getEquipmentPhotos);

/**
 * @swagger
 * /api/equipment/{serial_number}/documents:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Get documents for an equipment
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the equipment
 *     responses:
 *       200:
 *         description: Equipment documents retrieved successfully
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Error retrieving documents
 */
router.get("/:serial_number/documents", verifyToken, getEquipmentDocuments);

/**
 * @swagger
 * /api/equipment/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Serve an equipment file
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [equipmentsImages, equipmentsDocs]
 *         description: Folder containing the file (equipmentsImages or equipmentsDocs)
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
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
 *       400:
 *         description: Invalid folder
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", verifyToken, serveEquipmentFile);

/**
 * @swagger
 * /api/equipment/deleteEquipment/{serial_number}:
 *   delete:
 *     tags:
 *       - Manage Equipment
 *     summary: Delete an equipment record by serial number
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Serial number of the equipment to delete
 *     responses:
 *       200:
 *         description: Equipment deleted successfully
 *       404:
 *         description: Equipment not found
 *       500:
 *         description: Error deleting equipment
 */
router.delete("/deleteEquipment/:serial_number", verifyToken, deleteEquipment);

/**
 * @swagger
 * /api/equipment/equipment/{serial_number}:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Get a single equipment record by serial number
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Serial number of the equipment
 *     responses:
 *       200:
 *         description: Equipment retrieved successfully
 *       404:
 *         description: Equipment not found
 */
router.get("/equipment/:serial_number", verifyToken, getEquipmentById);

/**
 * @swagger
 * /api/equipment/equipments:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Get all equipment records with pagination
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
 *         description: Equipment records retrieved successfully
 *       500:
 *         description: Error retrieving equipment
 */
router.get("/equipments", verifyToken, getAllEquipment);

/**
 * @swagger
 * /api/equipment/createEquipmentFromAsset:
 *   post:
 *     tags:
 *       - Manage Equipment
 *     summary: Create equipment record from existing asset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               asset_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Equipment created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Error creating equipment
 */
router.post("/createEquipmentFromAsset", verifyToken, createEquipmentFromAsset);

/**
 * @swagger
 * /api/equipment/schedule:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Get equipment schedule data for calendar view
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Schedule data retrieved successfully
 *       500:
 *         description: Error fetching schedule
 */
router.get("/schedule", verifyToken, getEquipmentSchedule);

/**
 * @swagger
 * /api/equipment/filterEquipment:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Filter equipment by category, asset number, subcategory, or employee name
 *     parameters:
 *       - in: query
 *         name: category_name
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: asset_number
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: subcategory_name
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: employee_name
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
 *         description: Filtered equipment retrieved successfully
 *       500:
 *         description: Error filtering equipment
 */
router.get("/filterEquipment", verifyToken, filterEquipment);

/**
 * @swagger
 * /api/equipment/exportFilteredEquipmentToCSV:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Export filtered equipment to CSV
 *     parameters:
 *       - in: query
 *         name: category_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: asset_number
 *         schema:
 *           type: string
 *       - in: query
 *         name: subcategory_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: employee_name
 *         schema:
 *           type: string
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
router.get("/exportFilteredEquipmentToCSV", verifyToken, exportFilteredEquipmentToCSV);

/**
 * @swagger
 * /api/equipment/exportFilteredEquipmentToPDF:
 *   get:
 *     tags:
 *       - Manage Equipment
 *     summary: Export filtered equipment to PDF
 *     parameters:
 *       - in: query
 *         name: category_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: asset_number
 *         schema:
 *           type: string
 *       - in: query
 *         name: subcategory_name
 *         schema:
 *           type: string
 *       - in: query
 *         name: employee_name
 *         schema:
 *           type: string
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
router.get("/exportFilteredEquipmentToPDF", verifyToken, exportFilteredEquipmentToPDF);

module.exports = router;