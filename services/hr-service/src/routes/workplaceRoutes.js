const express = require("express");
const {
  createWorkplace,
  updateWorkplace,
  deleteWorkplace,
  getWorkplaceById,
  getAllWorkplaces,
  exportFilteredWorkplaceToCSV,
  exportFilteredWorkplaceToPDF,
} = require("../../controllers/hr/workplaceController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/workplace/createWorkplace:
 *   post:
 *     tags:
 *       - Manage Workplaces
 *     summary: Register a new workplace
 *     description: This endpoint allows registering a new workplace in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workplaceName:
 *                 type: string
 *               workplaceNameArabic:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Workplace created successfully
 *       500:
 *         description: Error creating workplace
 */
router.post("/createWorkplace", verifyToken, createWorkplace);

/**
 * @swagger
 * /api/workplace/updateWorkplace/{id}:
 *   put:
 *     tags:
 *       - Manage Workplaces
 *     summary: Update an existing workplace
 *     description: This endpoint allows to update an existing workplace's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the workplace to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workplaceName:
 *                 type: string
 *               workplaceNameArabic:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Workplace updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Workplace updated successfully"
 *                 workplace:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     workplaceName:
 *                       type: string
 *                     workplaceNameArabic:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Workplace not found
 *       500:
 *         description: Error updating workplace
 */
router.put("/updateWorkplace/:id", verifyToken, updateWorkplace);

/**
 * @swagger
 * /api/workplace/deleteWorkplace/{id}:
 *   delete:
 *     tags:
 *       - Manage Workplaces
 *     summary: Delete an existing workplace
 *     description: This endpoint allows to delete a workplace from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the workplace to delete
 *     responses:
 *       200:
 *         description: Workplace deleted successfully
 *       404:
 *         description: Workplace not found
 */
router.delete("/deleteWorkplace/:id", verifyToken, deleteWorkplace);

/**
 * @swagger
 * /api/workplace/workplace/{id}:
 *   get:
 *     tags:
 *       - Manage Workplaces
 *     summary: Get a single workplace by ID
 *     description: This endpoint allows to retrieve a specific workplace by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the workplace to retrieve
 *     responses:
 *       200:
 *         description: Workplace retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     workplaceName:
 *                       type: string
 *                     workplaceNameArabic:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Workplace not found
 */
router.get("/workplace/:id", verifyToken, getWorkplaceById);

/**
 * @swagger
 * /api/workplace/workplaces:
 *   get:
 *     tags:
 *       - Manage Workplaces
 *     summary: Get all workplaces with pagination
 *     description: This endpoint allows to retrieve all workplaces in the system with pagination.
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
 *         description: The number of workplaces per page (default is 10)
 *     responses:
 *       200:
 *         description: Workplaces retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalWorkplaces:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 workplaces:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                           id:
 *                             type: integer
 *                           workplaceName:
 *                             type: string
 *                           workplaceNameArabic:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [Active, Inactive]
 *       500:
 *         description: Error retrieving workplaces
 */
router.get("/workplaces", verifyToken, getAllWorkplaces);

/**
 * @swagger
 * /api/workplace/exportFilteredWorkplacesToCSV:
 *   get:
 *     tags:
 *       - Manage Workplaces
 *     summary: Export filtered workplaces to CSV
 *     description: This endpoint allows you to export filtered workplaces to a CSV file.
 *     parameters:
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
 *         description: CSV file containing filtered workplaces
 *       500:
 *         description: Error exporting workplaces to CSV
 */
router.get("/exportFilteredWorkplacesToCSV", verifyToken, exportFilteredWorkplaceToCSV);

/**
 * @swagger
 * /api/workplace/exportFilteredWorkplacesToPDF:
 *   get:
 *     tags:
 *       - Manage Workplaces
 *     summary: Export filtered workplaces to PDF
 *     description: This endpoint allows exporting filtered workplaces data to a PDF file.
 *     parameters:
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
 *         description: PDF file with filtered workplaces
 *       500:
 *         description: Error exporting workplaces to PDF
 */
router.get("/exportFilteredWorkplacesToPDF", verifyToken, exportFilteredWorkplaceToPDF);

module.exports = router;