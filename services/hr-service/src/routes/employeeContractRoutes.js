const express = require("express");
const {
    uploadContractFile,
    uploadTemplateLogo,
    serveContractFile,
    viewContractTemplate,
    createContractTemplate,
    getAllContractTemplates,
    getContractTemplateById,
    getTemplatesByJobTitle,
    updateContractTemplate,
    deleteContractTemplate,
    toggleTemplateStatus,
    generateContractFromTemplate,
    getAllEmployeeContracts,
    getEmployeeContractById,
    updateEmployeeContract,
    updateContractStatus,
    saveContractFile,
    exportContractsToCSV,
} = require("../../controllers/hr/employeeContractController");

const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

// ============ CONTRACT TEMPLATE ROUTES ============

/**
 * @swagger
 * /api/contracts/upload:
 *   post:
 *     tags:
 *       - Employee Contracts
 *     summary: Upload contract file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - contractId
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Contract file (JPEG, JPG, PNG, PDF)
 *               contractId:
 *                 type: integer
 *                 description: Contract ID
 *     responses:
 *       200:
 *         description: Contract file uploaded successfully
 *       400:
 *         description: Invalid file or missing parameters
 *       404:
 *         description: Contract not found
 */
router.post("/upload", verifyToken, uploadContractFile);

/**
 * @swagger
 * /api/contracts/upload-logo:
 *   post:
 *     tags:
 *       - Contract Templates
 *     summary: Upload template logo
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - logo
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Logo image (JPEG, JPG, PNG)
 *     responses:
 *       200:
 *         description: Logo uploaded successfully
 *       400:
 *         description: Invalid file or missing parameters
 */
router.post("/upload-logo", verifyToken, uploadTemplateLogo);

/**
 * @swagger
 * /api/contracts/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Contract Templates
 *     summary: Serve a contract file (logo)
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [contractsLogos]
 *         description: Folder containing the file
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *       400:
 *         description: Invalid folder
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", serveContractFile);

/**
 * @swagger
 * /api/contracts/templates/view/{id}:
 *   get:
 *     tags:
 *       - Contract Templates
 *     summary: View full contract template (popup)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template details
 *       404:
 *         description: Template not found
 */
router.get("/templates/view/:id", verifyToken, viewContractTemplate);

/**
 * @swagger
 * /api/contracts/templates/create:
 *   post:
 *     tags:
 *       - Contract Templates
 *     summary: Create a new contract template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - templateName
 *               - jobTitle
 *               - contractPeriod
 *               - basicSalary
 *             properties:
 *               templateName:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               contractPeriod:
 *                 type: string
 *               autoRenewal:
 *                 type: boolean
 *               basicSalary:
 *                 type: number
 *     responses:
 *       201:
 *         description: Template created successfully
 */
router.post("/templates/create", verifyToken, createContractTemplate);

/**
 * @swagger
 * /api/contracts/templates/all:
 *   get:
 *     tags:
 *       - Contract Templates
 *     summary: Get all contract templates with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: jobTitle
 *         schema:
 *           type: string
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: string
 *           enum: [All, true, false]
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 */
router.get("/templates/all", verifyToken, getAllContractTemplates);

/**
 * @swagger
 * /api/contracts/templates/{id}:
 *   get:
 *     tags:
 *       - Contract Templates
 *     summary: Get a contract template by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *       404:
 *         description: Template not found
 */
router.get("/templates/:id", verifyToken, getContractTemplateById);

/**
 * @swagger
 * /api/contracts/templates/job/{jobTitle}:
 *   get:
 *     tags:
 *       - Contract Templates
 *     summary: Get templates by job title
 *     parameters:
 *       - in: path
 *         name: jobTitle
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 */
router.get("/templates/job/:jobTitle", verifyToken, getTemplatesByJobTitle);

/**
 * @swagger
 * /api/contracts/templates/update/{id}:
 *   put:
 *     tags:
 *       - Contract Templates
 *     summary: Update a contract template
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       404:
 *         description: Template not found
 */
router.put("/templates/update/:id", verifyToken, updateContractTemplate);

/**
 * @swagger
 * /api/contracts/templates/delete/{id}:
 *   delete:
 *     tags:
 *       - Contract Templates
 *     summary: Delete a contract template
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *       400:
 *         description: Template is in use
 *       404:
 *         description: Template not found
 */
router.delete("/templates/delete/:id", verifyToken, deleteContractTemplate);

/**
 * @swagger
 * /api/contracts/templates/toggle/{id}:
 *   patch:
 *     tags:
 *       - Contract Templates
 *     summary: Toggle template active status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template active status toggled successfully
 *       404:
 *         description: Template not found
 */
router.patch("/templates/toggle/:id", verifyToken, toggleTemplateStatus);

// ============ EMPLOYEE CONTRACT DETAILS ROUTES ============

/**
 * @swagger
 * /api/contracts/generate:
 *   post:
 *     tags:
 *       - Employee Contracts
 *     summary: Generate a contract from template
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - onboardingId
 *               - templateId
 *               - contractStartDate
 *             properties:
 *               onboardingId:
 *                 type: integer
 *               templateId:
 *                 type: integer
 *               contractStartDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Contract generated successfully
 *       400:
 *         description: Contract already exists
 *       404:
 *         description: Onboarding or template not found
 */
router.post("/generate", verifyToken, generateContractFromTemplate);

/**
 * @swagger
 * /api/contracts/all:
 *   get:
 *     tags:
 *       - Employee Contracts
 *     summary: Get all employee contracts with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, draft, active, completed, terminated]
 *     responses:
 *       200:
 *         description: Contracts retrieved successfully
 */
router.get("/all", verifyToken, getAllEmployeeContracts);

/**
 * @swagger
 * /api/contracts/{id}:
 *   get:
 *     tags:
 *       - Employee Contracts
 *     summary: Get a contract by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contract retrieved successfully
 *       404:
 *         description: Contract not found
 */
router.get("/:id", verifyToken, getEmployeeContractById);

/**
 * @swagger
 * /api/contracts/update/{id}:
 *   put:
 *     tags:
 *       - Employee Contracts
 *     summary: Update an employee contract
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Contract updated successfully
 *       404:
 *         description: Contract not found
 */
router.put("/update/:id", verifyToken, updateEmployeeContract);

/**
 * @swagger
 * /api/contracts/status/{id}:
 *   patch:
 *     tags:
 *       - Employee Contracts
 *     summary: Update contract status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, active, completed, terminated]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contract status updated successfully
 *       404:
 *         description: Contract not found
 */
router.patch("/status/:id", verifyToken, updateContractStatus);

/**
 * @swagger
 * /api/contracts/save-file/{id}:
 *   patch:
 *     tags:
 *       - Employee Contracts
 *     summary: Save contract file path
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filePath
 *             properties:
 *               filePath:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contract file saved successfully
 *       404:
 *         description: Contract not found
 */
router.patch("/save-file/:id", verifyToken, saveContractFile);

/**
 * @swagger
 * /api/contracts/export/csv:
 *   get:
 *     tags:
 *       - Employee Contracts
 *     summary: Export contracts to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, draft, active, completed, terminated]
 *     responses:
 *       200:
 *         description: CSV file download
 *       404:
 *         description: No contracts found
 */
router.get("/export/csv", verifyToken, exportContractsToCSV);

module.exports = router;