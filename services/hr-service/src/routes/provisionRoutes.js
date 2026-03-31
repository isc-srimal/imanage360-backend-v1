const express = require("express");
const {
  calculateAnnualLeaveProvisionForAllEmployeesHandler,
  calculateAirTicketProvisionForAllEmployeesHandler,
  getAllAnnualLeavePolicies,
  getAllAirTicketPolicies,
} = require("../controllers/provisionController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/provision/calculateAnnualLeaveProvisionForAllEmployees:
 *   post:
 *     summary: Calculate annual leave provisions for all employees
 *     tags:
 *       - Provision Calculations
 *     description: Calculates annual leave provisions for all active employees, including accumulated and monthly provisions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 5
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Annual leave provisions calculated successfully.
 *       400:
 *         description: Missing required input data.
 *       500:
 *         description: Internal server error.
 */
router.post("/calculateAnnualLeaveProvisionForAllEmployees", verifyToken, calculateAnnualLeaveProvisionForAllEmployeesHandler);

/**
 * @swagger
 * /api/provision/calculateAirTicketProvisionForAllEmployees:
 *   post:
 *     summary: Calculate air ticket provisions for all employees
 *     tags:
 *       - Provision Calculations
 *     description: Calculates air ticket provisions for all active employees, including accumulated and monthly provisions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - month
 *               - year
 *             properties:
 *               month:
 *                 type: integer
 *                 example: 5
 *               year:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Air ticket provisions calculated successfully.
 *       400:
 *         description: Missing required input data.
 *       500:
 *         description: Internal server error.
 */
router.post("/calculateAirTicketProvisionForAllEmployees", verifyToken, calculateAirTicketProvisionForAllEmployeesHandler);

/**
 * @swagger
 * /api/provision/getAllAnnualLeavePolicies:
 *   get:
 *     tags:
 *       - Provision Calculations
 *     summary: Get all annual leave policies
 *     description: Retrieves all annual leave policies.
 *     responses:
 *       200:
 *         description: Annual leave policies retrieved
 *       500:
 *         description: Internal server error
 */
router.get("/getAllAnnualLeavePolicies", verifyToken, getAllAnnualLeavePolicies);

/**
 * @swagger
 * /api/provision/getAllAirTicketPolicies:
 *   get:
 *     tags:
 *       - Provision Calculations
 *     summary: Get all air ticket policies
 *     description: Retrieves all air ticket policies.
 *     responses:
 *       200:
 *         description: Air ticket policies retrieved
 *       500:
 *         description: Internal server error
 */
router.get("/getAllAirTicketPolicies", verifyToken, getAllAirTicketPolicies);

module.exports = router;