const express = require("express");
const {
  uploadTrainingMaterials,
  createTrainingDevelopment,
  updateTrainingDevelopment,
  deleteTrainingDevelopment,
  getTrainingDevelopmentById,
  getAllTrainingDevelopments,
  updateTrainingProgress,
  getTrainingProgressById,
  getTrainingMaterials,
  serveTrainingMaterialFile,
  filterTrainingDevelopment,
  exportFilteredTrainingDevelopmentToCSV,
  exportFilteredTrainingDevelopmentToPDF,
} = require("../controllers/trainingAndDevelopmentController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/trainingDevelopment/createTrainingDevelopment:
 *   post:
 *     tags:
 *       - Training And Development
 *     summary: Create a new training and development record
 *     description: This endpoint allows creating a new training and development record in the ERP system, including uploading training materials (PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, ZIP, RAR, MP4, AVI, MOV).
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               trainingProgramName:
 *                 type: string
 *               trainingStartDate:
 *                 type: string
 *                 format: date
 *               trainingEndDate:
 *                 type: string
 *                 format: date
 *               trainingStatus:
 *                 type: string
 *                 enum: [completed, in-progress, scheduled]
 *               trainerName:
 *                 type: string
 *               certificationReceived:
 *                 type: boolean
 *               certificationDate:
 *                 type: string
 *                 format: date
 *               trainingEvaluation:
 *                 type: string
 *               trainingMaterials:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Training and development created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating training record
 */
router.post("/createTrainingDevelopment", verifyToken, uploadTrainingMaterials, createTrainingDevelopment);

/**
 * @swagger
 * /api/trainingDevelopment/updateTrainingDevelopment/{id}:
 *   put:
 *     tags:
 *       - Training And Development
 *     summary: Update an existing training and development record
 *     description: This endpoint allows updating an existing training and development record, including uploading new training materials (PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, ZIP, RAR, MP4, AVI, MOV) or retaining existing ones.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training and development record to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               trainingProgramName:
 *                 type: string
 *               trainingStartDate:
 *                 type: string
 *                 format: date
 *               trainingEndDate:
 *                 type: string
 *                 format: date
 *               trainingStatus:
 *                 type: string
 *                 enum: [completed, in-progress, scheduled]
 *               trainerName:
 *                 type: string
 *               certificationReceived:
 *                 type: boolean
 *               certificationDate:
 *                 type: string
 *                 format: date
 *               trainingEvaluation:
 *                 type: string
 *               trainingMaterials:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               existing_training_materials:
 *                 type: string
 *                 description: JSON string of existing training materials to retain
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Training and development updated successfully
 *       404:
 *         description: Training and development data not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating training and development data
 */
router.put("/updateTrainingDevelopment/:id", verifyToken, uploadTrainingMaterials, updateTrainingDevelopment);

/**
 * @swagger
 * /api/trainingDevelopment/deleteTrainingDevelopment/{id}:
 *   delete:
 *     tags:
 *       - Training And Development
 *     summary: Delete a training and development record
 *     description: This endpoint allows deleting a training and development record from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training and development record to delete
 *     responses:
 *       200:
 *         description: Training and development data deleted successfully
 *       404:
 *         description: Training and development data not found
 *       500:
 *         description: Error deleting training and development data
 */
router.delete("/deleteTrainingDevelopment/:id", verifyToken, deleteTrainingDevelopment);

/**
 * @swagger
 * /api/trainingDevelopment/trainingAndDevelopment/{id}:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Get a single training and development record by ID
 *     description: This endpoint allows retrieving a specific training and development record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training and development record to retrieve
 *     responses:
 *       200:
 *         description: Training and development data retrieved successfully
 *       404:
 *         description: Training and development data not found
 *       500:
 *         description: Error retrieving training and development data
 */
router.get("/trainingAndDevelopment/:id", verifyToken, getTrainingDevelopmentById);

/**
 * @swagger
 * /api/trainingDevelopment/trainingAndDevelopments:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Get all training and development records with pagination
 *     description: This endpoint allows retrieving all training and development records in the system with pagination.
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
 *         description: Training and development data retrieved successfully
 *       500:
 *         description: Error retrieving training and development data
 */
router.get("/trainingAndDevelopments", verifyToken, getAllTrainingDevelopments);

/**
 * @swagger
 * /api/trainingDevelopment/updateTrainingProgress/{id}:
 *   put:
 *     tags:
 *       - Training And Development
 *     summary: Update the progress of a training and development record
 *     description: This endpoint allows updating the training progress for a specific training and development record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training and development record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               trainingProgress:
 *                 type: integer
 *                 description: The progress of the training in percentage (0 to 100)
 *     responses:
 *       200:
 *         description: Training progress updated successfully
 *       400:
 *         description: Progress must be between 0 and 100
 *       404:
 *         description: Training and development data not found
 *       500:
 *         description: Error updating training progress
 */
router.put("/updateTrainingProgress/:id", verifyToken, updateTrainingProgress);

/**
 * @swagger
 * /api/trainingDevelopment/getTrainingProgress/{id}:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Get the progress of a training and development record
 *     description: This endpoint allows retrieving the progress of a specific training and development record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training and development record
 *     responses:
 *       200:
 *         description: Training progress retrieved successfully
 *       404:
 *         description: Training and development data not found
 *       500:
 *         description: Error retrieving training progress
 */
router.get("/getTrainingProgress/:id", verifyToken, getTrainingProgressById);

/**
 * @swagger
 * /api/trainingDevelopment/trainingMaterials/{id}:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Get training materials for a training and development record
 *     description: This endpoint retrieves the metadata of training materials for a specific training and development record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the training and development record
 *     responses:
 *       200:
 *         description: Training materials retrieved successfully
 *       404:
 *         description: Training and development data not found
 *       500:
 *         description: Error retrieving training materials
 */
router.get("/trainingMaterials/:id", verifyToken, getTrainingMaterials);

/**
 * @swagger
 * /api/trainingDevelopment/files/{filename}:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Serve a training material file
 *     description: This endpoint serves a training material file (PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, ZIP, RAR, MP4, AVI, MOV) by its filename.
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to serve
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
 *           application/vnd.ms-excel:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 *           application/x-rar-compressed:
 *             schema:
 *               type: string
 *               format: binary
 *           video/mp4:
 *             schema:
 *               type: string
 *               format: binary
 *           video/avi:
 *             schema:
 *               type: string
 *               format: binary
 *           video/quicktime:
 *             schema:
 *               type: string
 *               format: binary
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:filename", verifyToken, serveTrainingMaterialFile);

/**
 * @swagger
 * /api/trainingDevelopment/filterTrainingDevelopment:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Filter training and development records
 *     description: This endpoint allows filtering training and development records based on status and date range with pagination.
 *     parameters:
 *       - in: query
 *         name: trainingStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, completed, in-progress, scheduled]
 *       - in: query
 *         name: trainingStartDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: trainingEndDate
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
 *         description: Filtered training and development records retrieved successfully
 *       500:
 *         description: Error filtering training and development data
 */
router.get("/filterTrainingDevelopment", verifyToken, filterTrainingDevelopment);

/**
 * @swagger
 * /api/trainingDevelopment/exportFilteredTrainingDevelopmentToCSV:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Export filtered training and development data to CSV
 *     description: This endpoint allows exporting filtered training and development data to a CSV file.
 *     parameters:
 *       - in: query
 *         name: trainingStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, completed, in-progress, scheduled]
 *       - in: query
 *         name: trainingStartDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: trainingEndDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file download
 *       404:
 *         description: No training and development data found
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportFilteredTrainingDevelopmentToCSV", verifyToken, exportFilteredTrainingDevelopmentToCSV);

/**
 * @swagger
 * /api/trainingDevelopment/exportFilteredTrainingDevelopmentToPDF:
 *   get:
 *     tags:
 *       - Training And Development
 *     summary: Export filtered training and development data to PDF
 *     description: This endpoint allows exporting filtered training and development data to a PDF file.
 *     parameters:
 *       - in: query
 *         name: trainingStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, completed, in-progress, scheduled]
 *       - in: query
 *         name: trainingStartDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: trainingEndDate
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file download
 *       404:
 *         description: No training and development data found
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportFilteredTrainingDevelopmentToPDF", verifyToken, exportFilteredTrainingDevelopmentToPDF);

module.exports = router;