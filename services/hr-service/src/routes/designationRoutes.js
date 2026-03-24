const express = require("express");
const {
  createDesignation,
  updateDesignation,
  deleteDesignation,
  getDesignationById,
  getAllDesignations,
  filterDesignations,
  exportFilteredDesignationsToCSV,
  exportFiltereddesignationsToPDF,
} = require("../../controllers/hr/designationController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/designation/createDesignation:
 *   post:
 *     tags:
 *       - Manage Designations
 *     summary: Register a new designation
 *     description: This endpoint allows to register a new designation in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               designationName:
 *                 type: string
 *               designationNameArabic:
 *                 type: string
 *               designationdescription:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               departmentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Designation created successfully
 *       500:
 *         description: Error creating designation
 */
router.post("/createDesignation", verifyToken, createDesignation);

/**
 * @swagger
 * /api/designation/updateDesignation/{id}:
 *   put:
 *     tags:
 *       - Manage Designations
 *     summary: Update an existing designation
 *     description: This endpoint allows to update an existing designation's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the designation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               designationName:
 *                 type: string
 *               designationNameArabic:
 *                 type: string
 *               designationdescription:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *               departmentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Designation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Designation updated successfully"
 *                 designation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     designationName:
 *                       type: string
 *                     designationNameArabic:
 *                       type: string
 *                     designationdescription:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *                     departmentId:
 *                       type: integer
 *       404:
 *         description: Designation not found
 *       500:
 *         description: Error updating designation
 */
router.put("/updateDesignation/:id", verifyToken, updateDesignation);

/**
 * @swagger
 * /api/designation/deleteDesignation/{id}:
 *   delete:
 *     tags:
 *       - Manage Designations
 *     summary: Delete an existing designation
 *     description: This endpoint allows to delete a designation from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the designation to delete
 *     responses:
 *       200:
 *         description: Designation deleted successfully
 *       404:
 *         description: Designation not found
 */
router.delete("/deleteDesignation/:id", verifyToken, deleteDesignation);

/**
 * @swagger
 * /api/designation/designation/{id}:
 *   get:
 *     tags:
 *       - Manage Designations
 *     summary: Get a single designation by ID
 *     description: This endpoint allows to retrieve a specific designation by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the designation to retrieve
 *     responses:
 *       200:
 *         description: Designation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     designationName:
 *                       type: string
 *                     designationNameArabic:
 *                       type: string
 *                     designationdescription:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *                     departmentId:
 *                       type: integer
 *       404:
 *         description: Designation not found
 */
router.get("/designation/:id", verifyToken, getDesignationById);

/**
 * @swagger
 * /api/designation/designations:
 *   get:
 *     tags:
 *       - Manage Designations
 *     summary: Get all designations with pagination
 *     description: This endpoint allows to retrieve all designations in the system with pagination.
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
 *         description: The number of designations per page (default is 10)
 *     responses:
 *       200:
 *         description: Designations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDesignations:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 designations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                           id:
 *                             type: integer
 *                           designationName:
 *                             type: string
 *                           designationNameArabic:
 *                             type: string
 *                           designationdescription:
 *                             type: string
 *                           createdBy:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [Active, Inactive]
 *                           departmentId:
 *                             type: integer
 *       500:
 *         description: Error retrieving designations
 */
router.get("/designations", verifyToken, getAllDesignations);

/**
 * @swagger
 * /api/designation/filterDesignations:
 *   get:
 *     tags:
 *       - Manage Designations
 *     summary: Get filtered designations
 *     description: This endpoint allows filtering designations based on status and createdBy.
 *     parameters:
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
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of designations per page (default is 10)
 *     responses:
 *       200:
 *         description: Filtered designations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDesignations:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 designations:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error filtering designations
 */
router.get("/filterDesignations", verifyToken, filterDesignations);

/**
 * @swagger
 * /api/designation/exportFilteredDesignationsToCSV:
 *   get:
 *     tags:
 *       - Manage Designations
 *     summary: Export filtered designations to CSV
 *     description: This endpoint allows you to export filtered designations to a CSV file.
 *     parameters:
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
 *         description: CSV file containing filtered designations
 *       500:
 *         description: Error exporting designations to CSV
 */
router.get("/exportFilteredDesignationsToCSV", verifyToken, exportFilteredDesignationsToCSV);

/**
 * @swagger
 * /api/designation/exportFilteredDesignationsToPDF:
 *   get:
 *     tags:
 *       - Manage Designations
 *     summary: Export filtered designations to PDF
 *     description: This endpoint allows exporting filtered designations data to a PDF file.
 *     parameters:
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
 *         description: PDF file with filtered designations
 *       500:
 *         description: Error exporting designations to PDF
 */
router.get("/exportFilteredDesignationsToPDF", verifyToken, exportFiltereddesignationsToPDF);

module.exports = router;