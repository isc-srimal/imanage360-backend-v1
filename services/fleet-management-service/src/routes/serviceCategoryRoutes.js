const express = require("express");
const {
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  getServiceCategoryById,
  getAllServiceCategories,
  filterServiceCategories,
  exportFilteredServiceCategoriesToCSV,
  exportFilteredServiceCategoriesToPDF,
} = require("../controllers/serviceCategoryController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/servicecategories/createServiceCategory:
 *   post:
 *     tags:
 *       - Manage Service Categories
 *     summary: Create a new service category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Service category created successfully
 *       500:
 *         description: Error creating service category
 */
router.post("/createServiceCategory", verifyToken, createServiceCategory);

/**
 * @swagger
 * /api/servicecategories/updateServiceCategory/{service_category_id}:
 *   put:
 *     tags:
 *       - Manage Service Categories
 *     summary: Update an existing service category
 *     parameters:
 *       - in: path
 *         name: service_category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Service category updated successfully
 *       404:
 *         description: Service category not found
 *       500:
 *         description: Error updating service category
 */
router.put("/updateServiceCategory/:service_category_id", verifyToken, updateServiceCategory);

/**
 * @swagger
 * /api/servicecategories/deleteServiceCategory/{service_category_id}:
 *   delete:
 *     tags:
 *       - Manage Service Categories
 *     summary: Delete a service category by ID
 *     parameters:
 *       - in: path
 *         name: service_category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service category to delete
 *     responses:
 *       200:
 *         description: Service category deleted successfully
 *       404:
 *         description: Service category not found
 *       500:
 *         description: Error deleting service category
 */
router.delete("/deleteServiceCategory/:service_category_id", verifyToken, deleteServiceCategory);

/**
 * @swagger
 * /api/servicecategories/serviceCategory/{service_category_id}:
 *   get:
 *     tags:
 *       - Manage Service Categories
 *     summary: Get a single service category by ID
 *     parameters:
 *       - in: path
 *         name: service_category_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service category
 *     responses:
 *       200:
 *         description: Service category retrieved successfully
 *       404:
 *         description: Service category not found
 */
router.get("/serviceCategory/:service_category_id", verifyToken, getServiceCategoryById);

/**
 * @swagger
 * /api/servicecategories/serviceCategories:
 *   get:
 *     tags:
 *       - Manage Service Categories
 *     summary: Get all service categories with pagination
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
 *         description: Service categories retrieved successfully
 *       500:
 *         description: Error retrieving service categories
 */
router.get("/serviceCategories", verifyToken, getAllServiceCategories);

/**
 * @swagger
 * /api/servicecategories/filterServiceCategories:
 *   get:
 *     tags:
 *       - Manage Service Categories
 *     summary: Filter service categories by status
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
 *         description: Filtered service categories retrieved successfully
 *       500:
 *         description: Error filtering service categories
 */
router.get("/filterServiceCategories", verifyToken, filterServiceCategories);

/**
 * @swagger
 * /api/servicecategories/exportFilteredServiceCategoriesToCSV:
 *   get:
 *     tags:
 *       - Manage Service Categories
 *     summary: Export filtered service categories to CSV
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
router.get("/exportFilteredServiceCategoriesToCSV", verifyToken, exportFilteredServiceCategoriesToCSV);

/**
 * @swagger
 * /api/servicecategories/exportFilteredServiceCategoriesToPDF:
 *   get:
 *     tags:
 *       - Manage Service Categories
 *     summary: Export filtered service categories to PDF
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
router.get("/exportFilteredServiceCategoriesToPDF", verifyToken, exportFilteredServiceCategoriesToPDF);

module.exports = router;