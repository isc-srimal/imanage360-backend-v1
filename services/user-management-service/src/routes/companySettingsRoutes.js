const express = require('express');
const {getCompanyDetails, updateCompanyDetails } = require('../../controllers/user/companySettingController');
const { verifyToken } = require('../../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/manageCompany/companyDetails/{id}:
 *   get:
 *     tags:
 *       - Company Profile settings
 *     summary: Get company details by ID
 *     description: This endpoint allows you to retrieve company details by the company ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the company
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 companyName:
 *                   type: string
 *                   example: "Tech Corp"
 *                 address:
 *                   type: string
 *                   example: "1234 Main St, City, Country"
 *                 logoUrl:
 *                   type: string
 *                   example: "https://example.com/logo.png"
 *       404:
 *         description: Company details not found
 *       500:
 *         description: Error retrieving company details
 */
router.get('/companyDetails/:id',verifyToken, getCompanyDetails);

/**
 * @swagger
 * /api/manageCompany/updateCompanyDetails/{id}:
 *   put:
 *     tags:
 *       - Company Profile settings
 *     summary: Update company details
 *     description: This endpoint allows you to update a company's details by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The ID of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *                 example: "New Tech Corp"
 *               address:
 *                 type: string
 *                 example: "4567 New Address, City, Country"
 *               logoUrl:
 *                 type: string
 *                 example: "https://example.com/new-logo.png"
 *     responses:
 *       200:
 *         description: Company details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Company updated successfully"
 *                 company:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     companyName:
 *                       type: string
 *                       example: "New Tech Corp"
 *                     address:
 *                       type: string
 *                       example: "4567 New Address, City, Country"
 *                     logoUrl:
 *                       type: string
 *                       example: "https://example.com/new-logo.png"
 *       404:
 *         description: Company details not found
 *       500:
 *         description: Error updating company details
 */
router.put('/updateCompanyDetails/:id', verifyToken, updateCompanyDetails);

module.exports = router;