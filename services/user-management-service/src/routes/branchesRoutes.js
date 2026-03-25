const express = require("express");
const {
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchById,
  getAllBranches,
  exportBranchesToCSV,
  exportBranchesToPDF,
} = require("../controllers/branchesController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/branches/createBranch:
 *   post:
 *     tags:
 *       - Manage Branches
 *     summary: Create a new branch
 *     description: This endpoint allows you to create a new branch record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization_uid:
 *                 type: integer
 *               tenant_uid:
 *                 type: integer
 *               branch_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               description:
 *                 type: string
 *               country_uid:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       500:
 *         description: Server error
 */
router.post("/createBranch", verifyToken, createBranch);

/**
 * @swagger
 * /api/branches/updateBranch/{id}:
 *   put:
 *     tags:
 *       - Manage Branches
 *     summary: Update an existing branch
 *     description: This endpoint allows you to update an existing branch record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the branch to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization_uid:
 *                 type: integer
 *               tenant_uid:
 *                 type: integer
 *               branch_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               logo:
 *                 type: string
 *               description:
 *                 type: string
 *               country_uid:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.put("/updateBranch/:id", verifyToken, updateBranch);

/**
 * @swagger
 * /api/branches/deleteBranch/{id}:
 *   delete:
 *     tags:
 *       - Manage Branches
 *     summary: Delete a branch
 *     description: This endpoint allows you to delete a branch by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the branch to delete
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteBranch/:id", verifyToken, deleteBranch);

/**
 * @swagger
 * /api/branches/branch/{id}:
 *   get:
 *     tags:
 *       - Manage Branches
 *     summary: Get a single branch by ID
 *     description: This endpoint allows you to retrieve a specific branch record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the branch to retrieve
 *     responses:
 *       200:
 *         description: Branch retrieved successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get("/branch/:id", verifyToken, getBranchById);

/**
 * @swagger
 * /api/branches/branches:
 *   get:
 *     tags:
 *       - Manage Branches
 *     summary: Get all branches with pagination
 *     description: This endpoint retrieves all branches with pagination support.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: Branches retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/branches", verifyToken, getAllBranches);

/**
 * @swagger
 * /api/branches/exportBranchesCSV:
 *   get:
 *     tags:
 *       - Manage Branches
 *     summary: Export branches to CSV
 *     description: Exports branches as a CSV file.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 *       404:
 *         description: No branches found
 *       500:
 *         description: Server error
 */
router.get("/exportBranchesCSV", verifyToken, exportBranchesToCSV);

/**
 * @swagger
 * /api/branches/exportBranchesPDF:
 *   get:
 *     tags:
 *       - Manage Branches
 *     summary: Export branches to PDF
 *     description: Exports branches as a PDF file.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of records per page (optional)
 *     responses:
 *       200:
 *         description: PDF file generated successfully
 *       404:
 *         description: No branches found
 *       500:
 *         description: Server error
 */
router.get("/exportBranchesPDF", verifyToken, exportBranchesToPDF);

module.exports = router;