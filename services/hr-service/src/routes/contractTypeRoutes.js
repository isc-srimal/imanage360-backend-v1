const express = require("express");
const {
  createContractType,
  updateContractType,
  deleteContractType,
  getContractTypeById,
  getAllContractTypes,
  filterContractTypes,
  exportFilteredContractTypesToCSV,
  exportFilteredContractTypesToPDF,
} = require("../../controllers/hr/contractTypeController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/contractType/createContractType:
 *   post:
 *     tags:
 *       - Manage Contract Type
 *     summary: Register a new contract type
 *     description: This endpoint allows to register a new contract type in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractTypeName:
 *                 type: string
 *               contractTypeDescription:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Contract type created successfully
 *       500:
 *         description: Error creating contract type
 */
router.post("/createContractType", verifyToken, createContractType);

/**
 * @swagger
 * /api/contractType/updateContractType/{id}:
 *   put:
 *     tags:
 *       - Manage Contract Type
 *     summary: Update an existing contract type
 *     description: This endpoint allows to update an existing contract type's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contract type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contractTypeName:
 *                 type: string
 *               contractTypeDescription:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Contract type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contract type updated successfully"
 *                 contract:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     contractTypeName:
 *                       type: string
 *                     contractTypeDescription:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Contract type not found
 *       500:
 *         description: Error updating contract type
 */
router.put("/updateContractType/:id", verifyToken, updateContractType);

/**
 * @swagger
 * /api/contractType/deleteContractType/{id}:
 *   delete:
 *     tags:
 *       - Manage Contract Type
 *     summary: Delete an existing contract type
 *     description: This endpoint allows to delete a contract type from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contract type to delete
 *     responses:
 *       200:
 *         description: Contract type deleted successfully
 *       404:
 *         description: Contract type not found
 */
router.delete("/deleteContractType/:id", verifyToken, deleteContractType);

/**
 * @swagger
 * /api/contractType/contractType/{id}:
 *   get:
 *     tags:
 *       - Manage Contract Type
 *     summary: Get a single contract type by ID
 *     description: This endpoint allows to retrieve a specific contract type by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the contract type to retrieve
 *     responses:
 *       200:
 *         description: Contract type retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     contractTypeName:
 *                       type: string
 *                     contractTypeDescription:
 *                       type: string
 *                     status:
 *                       type: string
 *                       enum: [Active, Inactive]
 *       404:
 *         description: Contract type not found
 */
router.get("/contractType/:id", verifyToken, getContractTypeById);

/**
 * @swagger
 * /api/contractType/contractTypes:
 *   get:
 *     tags:
 *       - Manage Contract Type
 *     summary: Get all contract types with pagination
 *     description: This endpoint allows to retrieve all contract types in the system with pagination.
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
 *         description: The number of contract types per page (default is 10)
 *     responses:
 *       200:
 *         description: Contract types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalContracts:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 contracts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       contractTypeName:
 *                         type: string
 *                       contractTypeDescription:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [Active, Inactive]
 *       500:
 *         description: Error retrieving contract types
 */
router.get("/contractTypes", verifyToken, getAllContractTypes);

/**
 * @swagger
 * /api/contractType/filterContractTypes:
 *   get:
 *     tags:
 *       - Manage Contract Type
 *     summary: Filter contract types by status
 *     description: This endpoint filters contract types based on their status.
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
 *         description: Filtered contract types retrieved successfully
 *       500:
 *         description: Error filtering contract types
 */
router.get("/filterContractTypes", verifyToken, filterContractTypes);

/**
 * @swagger
 * /api/contractType/exportFilteredContractTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Contract Type
 *     summary: Export filtered contract types to CSV
 *     description: Exports filtered contract types data to a downloadable CSV file.
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *     responses:
 *       200:
 *         description: CSV file of filtered contract types
 *       500:
 *         description: Error exporting to CSV
 */
router.get("/exportFilteredContractTypesToCSV", verifyToken, exportFilteredContractTypesToCSV);

/**
 * @swagger
 * /api/contractType/exportFilteredContractTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Contract Type
 *     summary: Export filtered contract types to PDF
 *     description: Exports filtered contract types data to a downloadable PDF file.
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *     responses:
 *       200:
 *         description: PDF file of filtered contract types
 *       500:
 *         description: Error exporting to PDF
 */
router.get("/exportFilteredContractTypesToPDF", verifyToken, exportFilteredContractTypesToPDF);

module.exports = router;