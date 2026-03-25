const express = require("express");
const {
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlanById,
  getAllSubscriptionPlans,
  filterSubscriptionPlans,
  exportFilteredSubscriptionPlansToCSV,
  exportFilteredSubscriptionPlansToPDF,
} = require("../controllers/subscriptionPlansController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/subscription-plans/createSubscriptionPlan:
 *   post:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Create a new subscription plan
 *     description: This endpoint allows you to create a new subscription plan record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_plan:
 *                 type: string
 *               max_users:
 *                 type: integer
 *               duration:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *               permission:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Subscription plan created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/createSubscriptionPlan", verifyToken, createSubscriptionPlan);

/**
 * @swagger
 * /api/subscription-plans/updateSubscriptionPlan/{id}:
 *   put:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Update an existing subscription plan
 *     description: This endpoint allows you to update an existing subscription plan record.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subscription plan to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_plan:
 *                 type: string
 *               max_users:
 *                 type: integer
 *               duration:
 *                 type: string
 *               price:
 *                 type: number
 *               currency:
 *                 type: string
 *               permission:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Subscription plan updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Server error
 */
router.put("/updateSubscriptionPlan/:id", verifyToken, updateSubscriptionPlan);

/**
 * @swagger
 * /api/subscription-plans/deleteSubscriptionPlan/{id}:
 *   delete:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Delete a subscription plan
 *     description: This endpoint allows you to delete a subscription plan by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subscription plan to delete
 *     responses:
 *       200:
 *         description: Subscription plan deleted successfully
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Server error
 */
router.delete("/deleteSubscriptionPlan/:id", verifyToken, deleteSubscriptionPlan);

/**
 * @swagger
 * /api/subscription-plans/subscriptionPlan/{id}:
 *   get:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Get a single subscription plan by ID
 *     description: This endpoint allows you to retrieve a specific subscription plan record by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the subscription plan to retrieve
 *     responses:
 *       200:
 *         description: Subscription plan retrieved successfully
 *       404:
 *         description: Subscription plan not found
 *       500:
 *         description: Server error
 */
router.get("/subscriptionPlan/:id", verifyToken, getSubscriptionPlanById);

/**
 * @swagger
 * /api/subscription-plans/subscriptionPlans:
 *   get:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Get all subscription plans with pagination
 *     description: This endpoint retrieves all subscription plans with pagination support.
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
 *         description: Subscription plans retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/subscriptionPlans", verifyToken, getAllSubscriptionPlans);

/**
 * @swagger
 * /api/subscription-plans/filterSubscriptionPlans:
 *   get:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Filter subscription plans based on status
 *     description: This endpoint retrieves subscription plans filtered by status with pagination support.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         enum: [All, Active, Inactive]
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
 *         description: Filtered subscription plans retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/filterSubscriptionPlans", verifyToken, filterSubscriptionPlans);

/**
 * @swagger
 * /api/subscription-plans/exportFilteredSubscriptionPlansCSV:
 *   get:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Export filtered subscription plans to CSV
 *     description: Exports subscription plans filtered by status as a CSV file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         enum: [All, Active, Inactive]
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
 *         description: No subscription plans found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredSubscriptionPlansCSV", verifyToken, exportFilteredSubscriptionPlansToCSV);

/**
 * @swagger
 * /api/subscription-plans/exportFilteredSubscriptionPlansPDF:
 *   get:
 *     tags:
 *       - Manage Subscription Plans
 *     summary: Export filtered subscription plans to PDF
 *     description: Exports subscription plans filtered by status as a PDF file.
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         enum: [All, Active, Inactive]
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
 *         description: No subscription plans found
 *       500:
 *         description: Server error
 */
router.get("/exportFilteredSubscriptionPlansPDF", verifyToken, exportFilteredSubscriptionPlansToPDF);

module.exports = router;