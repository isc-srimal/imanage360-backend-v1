const express = require("express");
const {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
    getAllDepartments,
    filterDepartments,
    exportFilteredDepartmentsToCSV,
    exportFilteredDepartmentsToPDF
} = require("../controllers/departmentController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/department/createDepartment:
 *   post:
 *     tags:
 *       - Manage Department
 *     summary: Register a new department
 *     description: This endpoint allows to register a new department in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentName:
 *                 type: string
 *               departmentDescription:
 *                 type: string
 *               departmentNo:
 *                 type: integer
 *               departmentHead:
 *                 type: string
 *               location:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Department registered successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createDepartment", verifyToken, createDepartment);

/**
 * @swagger
 * /api/department/updateDepartment/{id}:
 *   put:
 *     tags:
 *       - Manage Department
 *     summary: Update an existing department
 *     description: This endpoint allows to update an existing department's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the department to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               departmentName:
 *                 type: string
 *               departmentDescription:
 *                 type: string
 *               departmentNo:
 *                 type: integer
 *               departmentHead:
 *                 type: string
 *               location:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Department updated successfully"
 *                 department:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     departmentName:
 *                       type: string
 *                     departmentDescription:
 *                       type: string
 *                     departmentNo:
 *                       type: integer
 *                     departmentHead:
 *                       type: string
 *                     location:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Department not found
 *       500:
 *         description: Error updating department
 */
router.put("/updateDepartment/:id", verifyToken, updateDepartment);

/**
 * @swagger
 * /api/department/deleteDepartment/{id}:
 *   delete:
 *     tags:
 *       - Manage Department
 *     summary: Delete an existing department
 *     description: This endpoint allows to delete a department from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the department to delete
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 */
router.delete("/deleteDepartment/:id", verifyToken, deleteDepartment);

/**
 * @swagger
 * /api/department/department/{id}:
 *   get:
 *     tags:
 *       - Manage Department
 *     summary: Get a single department by ID
 *     description: This endpoint allows to retrieve a specific department by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the department to retrieve
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     departmentName:
 *                       type: string
 *                     departmentDescription:
 *                       type: string
 *                     departmentNo:
 *                       type: integer
 *                     departmentHead:
 *                       type: string
 *                     location:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Department not found
 */
router.get("/department/:id", verifyToken, getDepartmentById);

/**
 * @swagger
 * /api/department/departments:
 *   get:
 *     tags:
 *       - Manage Department
 *     summary: Get all departments with pagination
 *     description: This endpoint allows to retrieve all departments in the system with pagination.
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
 *         description: Departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     departmentName:
 *                       type: string
 *                     departmentDescription:
 *                       type: string
 *                     departmentNo:
 *                       type: integer
 *                     departmentHead:
 *                       type: string
 *                     location:
 *                       type: string
 *                     createdBy:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       500:
 *         description: Error retrieving departments
 */
router.get("/departments", verifyToken, getAllDepartments);

/**
 * @swagger
 * /api/department/filterDepartments:
 *   get:
 *     tags:
 *       - Manage Department
 *     summary: Filter departments by createdBy and status
 *     description: This endpoint allows filtering departments based on status and createdBy.
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
 *         description: The number of departments per page (default is 10)
 *     responses:
 *       200:
 *         description: Filtered departments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalDepartments:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 departments:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Error filtering departments
 */
router.get("/filterDepartments", verifyToken, filterDepartments);

/**
 * @swagger
 * /api/department/exportFilteredDepartmentsToCSV:
 *   get:
 *     tags:
 *       - Manage Department
 *     summary: Export filtered departments to CSV
 *     description: This endpoint allows exporting filtered departments data to a CSV file.
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
 *         description: CSV file with filtered departments
 *       500:
 *         description: Error exporting departments to CSV
 */
router.get("/exportFilteredDepartmentsToCSV", verifyToken, exportFilteredDepartmentsToCSV);

/**
 * @swagger
 * /api/department/exportFilteredDepartmentsToPDF:
 *   get:
 *     tags:
 *       - Manage Department
 *     summary: Export filtered departments to PDF
 *     description: This endpoint allows exporting filtered departments data to a PDF file.
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
 *         description: PDF file with filtered departments
 *       500:
 *         description: Error exporting departments to PDF
 */
router.get("/exportFilteredDepartmentsToPDF", verifyToken, exportFilteredDepartmentsToPDF);

module.exports = router;