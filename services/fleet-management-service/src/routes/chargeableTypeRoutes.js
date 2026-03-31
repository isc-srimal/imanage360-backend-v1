const express = require("express");
const {
  createChargeableType,
  updateChargeableType,
  deleteChargeableType,
  getChargeableTypeById,
  getAllChargeableTypes,
  filterChargeableTypes,
  exportFilteredChargeableTypesToCSV,
  exportFilteredChargeableTypesToPDF,
} = require("../controllers/chargeableTypeController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/chargeable-types/createChargeableType:
 *   post:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Create a new chargeable type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chargeble_type_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Chargeable type created successfully
 *       500:
 *         description: Error creating chargeable type
 */
router.post("/createChargeableType", verifyToken, createChargeableType);

/**
 * @swagger
 * /api/chargeable-types/updateChargeableType/{id}:
 *   put:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Update an existing chargeable type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the chargeable type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chargeble_type_name:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Chargeable type updated successfully
 *       404:
 *         description: Chargeable type not found
 *       500:
 *         description: Error updating chargeable type
 */
router.put("/updateChargeableType/:id", verifyToken, updateChargeableType);

/**
 * @swagger
 * /api/chargeable-types/deleteChargeableType/{id}:
 *   delete:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Delete a chargeable type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the chargeable type to delete
 *     responses:
 *       200:
 *         description: Chargeable type deleted successfully
 *       404:
 *         description: Chargeable type not found
 *       500:
 *         description: Error deleting chargeable type
 */
router.delete("/deleteChargeableType/:id", verifyToken, deleteChargeableType);

/**
 * @swagger
 * /api/chargeable-types/chargeableType/{id}:
 *   get:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Get a single chargeable type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the chargeable type
 *     responses:
 *       200:
 *         description: Chargeable type retrieved successfully
 *       404:
 *         description: Chargeable type not found
 */
router.get("/chargeableType/:id", verifyToken, getChargeableTypeById);

/**
 * @swagger
 * /api/chargeable-types/chargeableTypes:
 *   get:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Get all chargeable types with pagination
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
 *         description: Chargeable types retrieved successfully
 *       500:
 *         description: Error retrieving chargeable types
 */
router.get("/chargeableTypes", verifyToken, getAllChargeableTypes);

/**
 * @swagger
 * /api/chargeable-types/filterChargeableTypes:
 *   get:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Filter chargeable types by status
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
 *         description: Filtered chargeable types retrieved successfully
 *       500:
 *         description: Error filtering chargeable types
 */
router.get("/filterChargeableTypes", verifyToken, filterChargeableTypes);

/**
 * @swagger
 * /api/chargeable-types/exportFilteredChargeableTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Export filtered chargeable types to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredChargeableTypesToCSV", verifyToken, exportFilteredChargeableTypesToCSV);

/**
 * @swagger
 * /api/chargeable-types/exportFilteredChargeableTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Chargeable Types
 *     summary: Export filtered chargeable types to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredChargeableTypesToPDF", verifyToken, exportFilteredChargeableTypesToPDF);

module.exports = router;