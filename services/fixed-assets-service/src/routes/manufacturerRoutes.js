const express = require("express");
const {
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  getManufacturerById,
  getAllManufacturers,
  filterManufacturers,
  exportFilteredManufacturersToCSV,
  exportFilteredManufacturersToPDF,
} = require("../controllers/manufacturerController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/manufacturers/export/csv:
 *   get:
 *     tags: [Manage Manufacturers]
 *     summary: Export filtered manufacturers to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: CSV download }
 *       404: { description: No data }
 *       500: { description: Server error }
 */
router.get("/export/csv", verifyToken, exportFilteredManufacturersToCSV);

/**
 * @swagger
 * /api/manufacturers/export/pdf:
 *   get:
 *     tags: [Manage Manufacturers]
 *     summary: Export filtered manufacturers to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *     responses:
 *       200: { description: PDF download }
 *       404: { description: No data }
 *       500: { description: Server error }
 */
router.get("/export/pdf", verifyToken, exportFilteredManufacturersToPDF);

/**
 * @swagger
 * /api/manufacturers/filter:
 *   get:
 *     tags: [Manage Manufacturers]
 *     summary: Filter by status
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [All, Active, Inactive] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Success }
 *       500: { description: Server error }
 */
router.get("/filter", verifyToken, filterManufacturers);

/**
 * @swagger
 * /api/manufacturers/create:
 *   post:
 *     tags: [Manage Manufacturers]
 *     summary: Create a new manufacturer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturer: { type: string }
 *               status: { type: string, enum: [Active, Inactive] }
 *     responses:
 *       201: { description: Manufacturer created }
 *       500: { description: Server error }
 */
router.post("/create", verifyToken, createManufacturer);

/**
 * @swagger
 * /api/manufacturers/update/{id}:
 *   put:
 *     tags: [Manage Manufacturers]
 *     summary: Update a manufacturer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturer: { type: string }
 *               status: { type: string, enum: [Active, Inactive] }
 *     responses:
 *       200: { description: Updated }
 *       404: { description: Not found }
 *       500: { description: Server error }
 */
router.put("/update/:id", verifyToken, updateManufacturer);

/**
 * @swagger
 * /api/manufacturers/delete/{id}:
 *   delete:
 *     tags: [Manage Manufacturers]
 *     summary: Delete a manufacturer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 *       404: { description: Not found }
 *       500: { description: Server error }
 */
router.delete("/delete/:id", verifyToken, deleteManufacturer);

/**
 * @swagger
 * /api/manufacturers/{id}:
 *   get:
 *     tags: [Manage Manufacturers]
 *     summary: Get manufacturer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Success }
 *       404: { description: Not found }
 */
router.get("/:id", verifyToken, getManufacturerById);

/**
 * @swagger
 * /api/manufacturers:
 *   get:
 *     tags: [Manage Manufacturers]
 *     summary: List all manufacturers (paginated)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200: { description: Success }
 *       500: { description: Server error }
 */
router.get("/", verifyToken, getAllManufacturers);





module.exports = router;