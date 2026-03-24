const express = require("express");
const {
  createPerformance,
  updatePerformance,
  deletePerformance,
  getPerformanceById,
  getAllPerformances,
  addEmployeeFeedback,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalById,
  getAllGoals,
  createKPI,
  updateKPI,
  deleteKPI,
  getKPIById,
  filterPerformance,
  exportFilteredPerformanceToCSV,
  exportFilteredPerformanceToPDF,
} = require("../../controllers/hr/performanceManagementController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/performance/createPerformance:
 *   post:
 *     tags:
 *       - Performance Management
 *     summary: Create a new performance management
 *     description: This endpoint allows to create a new performance management in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewPeriodStartDate:
 *                 type: date
 *               reviewPeriodEndDate:
 *                 type: date
 *               goalsAchieved:
 *                 type: string
 *               performanceRating:
 *                 type: decimal
 *               managerFeedback:
 *                 type: string
 *               PeerFeedback:
 *                 type: string
 *               subordinateFeedback:
 *                 type: string
 *               trainingNeeds:
 *                 type: string
 *               promotionEligibility:
 *                 type: boolean
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Performance management created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createPerformance", verifyToken, createPerformance);

/**
 * @swagger
 * /api/performance/updatePerformance/{id}:
 *   put:
 *     tags:
 *       - Performance Management
 *     summary: Update an existing performance management data
 *     description: This endpoint allows to update an existing performance management's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the performance management to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reviewPeriodStartDate:
 *                 type: date
 *               reviewPeriodEndDate:
 *                 type: date
 *               goalsAchieved:
 *                 type: string
 *               performanceRating:
 *                 type: decimal
 *               managerFeedback:
 *                 type: string
 *               PeerFeedback:
 *                 type: string
 *               subordinateFeedback:
 *                 type: string
 *               trainingNeeds:
 *                 type: string
 *               promotionEligibility:
 *                 type: boolean
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Performance management updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Performance management updated successfully"
 *                 performance:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     reviewPeriodStartDate:
 *                       type: date
 *                     reviewPeriodEndDate:
 *                       type: date
 *                     goalsAchieved:
 *                       type: string
 *                     performanceRating:
 *                       type: decimal
 *                     managerFeedback:
 *                       type: string
 *                     PeerFeedback:
 *                       type: string
 *                     subordinateFeedback:
 *                       type: string
 *                     trainingNeeds:
 *                       type: string
 *                     promotionEligibility:
 *                       type: boolean
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Performance management data not found
 *       500:
 *         description: Error updating performance management data
 */
router.put("/updatePerformance/:id", verifyToken, updatePerformance);

/**
 * @swagger
 * /api/performance/deletePerformance/{id}:
 *   delete:
 *     tags:
 *       - Performance Management
 *     summary: Delete an existing performance management
 *     description: This endpoint allows to delete a performance management from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the performance management to delete
 *     responses:
 *       200:
 *         description: Performance management data deleted successfully
 *       404:
 *         description: Performance management data not found
 */
router.delete("/deletePerformance/:id", verifyToken, deletePerformance);

/**
 * @swagger
 * /api/performance/performance/{id}:
 *   get:
 *     tags:
 *       - Performance Management
 *     summary: Get a single performance management by ID
 *     description: This endpoint allows to retrieve a specific performance management by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the performance management to retrieve
 *     responses:
 *       200:
 *         description: Performance management data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     reviewPeriodStartDate:
 *                       type: date
 *                     reviewPeriodEndDate:
 *                       type: date
 *                     goalsAchieved:
 *                       type: string
 *                     performanceRating:
 *                       type: decimal
 *                     managerFeedback:
 *                       type: string
 *                     PeerFeedback:
 *                       type: string
 *                     subordinateFeedback:
 *                       type: string
 *                     trainingNeeds:
 *                       type: string
 *                     promotionEligibility:
 *                       type: boolean
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Leave data not found
 */
router.get("/performance/:id", verifyToken, getPerformanceById);

/**
 * @swagger
 * /api/performance/performances:
 *   get:
 *     tags:
 *       - Performance Management
 *     summary: Get all performance managements with pagination
 *     description: This endpoint allows to retrieve all performance managements in the system with pagination.
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
 *         description: The number of performance managements per page (default is 10)
 *     responses:
 *       200:
 *         description: Performance management data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     reviewPeriodStartDate:
 *                       type: date
 *                     reviewPeriodEndDate:
 *                       type: date
 *                     goalsAchieved:
 *                       type: string
 *                     performanceRating:
 *                       type: decimal
 *                     managerFeedback:
 *                       type: string
 *                     PeerFeedback:
 *                       type: string
 *                     subordinateFeedback:
 *                       type: string
 *                     trainingNeeds:
 *                       type: string
 *                     promotionEligibility:
 *                       type: boolean
 *                     employeeId:
 *                       type: integer
 *       500:
 *         description: Error retrieving performance management data
 */
router.get("/performances", verifyToken, getAllPerformances);

/**
 * @swagger
 * /api/performance/addEmployeeFeedback:
 *   put:
 *     tags:
 *       - Performance Management
 *     summary: Add or update feedback for an employee
 *     description: This endpoint allows to add or update feedback (manager, peer, subordinate) for a specific employee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               managerFeedback:
 *                 type: string
 *               peerFeedback:
 *                 type: string
 *               subordinateFeedback:
 *                 type: string
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       404:
 *         description: Performance record not found
 *       500:
 *         description: Error updating feedback
 */
router.put("/addEmployeeFeedback", verifyToken, addEmployeeFeedback);

/**
 * @swagger
 * /api/goal/createGoal:
 *   post:
 *     tags:
 *       - Goal Sector
 *     summary: Create a new goal
 *     description: This endpoint allows to create a new goal for an employee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goalName:
 *                 type: string
 *               targetValue:
 *                 type: float
 *               achievedValue:
 *                 type: float
 *               goalStatus:
 *                 type: string
 *                 enum: [Not Started, In Progress, Completed]
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Goal created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createGoal", verifyToken, createGoal);

/**
 * @swagger
 * /api/goal/updateGoal/{id}:
 *   put:
 *     tags:
 *       - Goal Sector
 *     summary: Update an existing goal data
 *     description: This endpoint allows to update an existing goal's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               goalName:
 *                 type: string
 *               targetValue:
 *                 type: float
 *               achievedValue:
 *                 type: float
 *               goalStatus:
 *                 type: string
 *                 enum: [Not Started, In Progress, Completed]
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Goal updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Goal updated successfully"
 *                 goal:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     goalName:
 *                       type: string
 *                     targetValue:
 *                       type: float
 *                     achievedValue:
 *                       type: float
 *                     goalStatus:
 *                       type: string
 *                       enum: [Not Started, In Progress, Completed]
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Goal data not found
 *       500:
 *         description: Error updating goal data
 */
router.put("/updateGoal/:id", verifyToken, updateGoal);

/**
 * @swagger
 * /api/goal/deleteGoal/{id}:
 *   delete:
 *     tags:
 *       - Goal Sector
 *     summary: Delete an existing goal
 *     description: This endpoint allows to delete a goal from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to delete
 *     responses:
 *       200:
 *         description: Goal deleted successfully
 *       404:
 *         description: Goal data not found
 */
router.delete("/deleteGoal/:id", verifyToken, deleteGoal);

/**
 * @swagger
 * /api/goal/goal/{id}:
 *   get:
 *     tags:
 *       - Goal Sector
 *     summary: Get a single goal by ID
 *     description: This endpoint allows to retrieve a specific goal by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the goal to retrieve
 *     responses:
 *       200:
 *         description: Goal data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     goalName:
 *                       type: string
 *                     targetValue:
 *                       type: float
 *                     achievedValue:
 *                       type: float
 *                     goalStatus:
 *                       type: string
 *                       enum: [Not Started, In Progress, Completed]
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: Goal data not found
 */
router.get("/goal/:id", verifyToken, getGoalById);

/**
 * @swagger
 * /api/goal/goals:
 *   get:
 *     tags:
 *       - Goal Sector
 *     summary: Get all goals with pagination
 *     description: This endpoint allows to retrieve all goals in the system with pagination.
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
 *         description: The number of goals per page (default is 10)
 *     responses:
 *       200:
 *         description: Goal data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     goalName:
 *                       type: string
 *                     targetValue:
 *                       type: float
 *                     achievedValue:
 *                       type: float
 *                     goalStatus:
 *                       type: string
 *                       enum: [Not Started, In Progress, Completed]
 *                     employeeId:
 *                       type: integer
 *       500:
 *         description: Error retrieving goal data
 */
router.get("/goals", verifyToken, getAllGoals);

/**
 * @swagger
 * /api/kpi/createKPI:
 *   post:
 *     tags:
 *       - KPI Sector
 *     summary: Create a new kpi
 *     description: This endpoint allows to create a new kpi for an employee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kpiName:
 *                 type: string
 *               targetValue:
 *                 type: float
 *               achievedValue:
 *                 type: float
 *               kpiStatus:
 *                 type: string
 *                 enum: [Not Achieved, Achieved]
 *               employeeId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: KPI created successfully
 *       403:
 *         description: Your request is wrong
 */
router.post("/createKPI", verifyToken, createKPI);

/**
 * @swagger
 * /api/kpi/updateKPI/{id}:
 *   put:
 *     tags:
 *       - KPI Sector
 *     summary: Update an existing kpi data
 *     description: This endpoint allows to update an existing kpi's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the kpi to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               kpiName:
 *                 type: string
 *               targetValue:
 *                 type: float
 *               achievedValue:
 *                 type: float
 *               kpiStatus:
 *                 type: string
 *                 enum: [Not Achieved, Achieved]
 *               employeeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: KPI updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "KPI updated successfully"
 *                 kpi:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     kpiName:
 *                       type: string
 *                     targetValue:
 *                       type: float
 *                     achievedValue:
 *                       type: float
 *                     kpiStatus:
 *                       type: string
 *                       enum: [Not Achieved, Achieved]
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: KPI data not found
 *       500:
 *         description: Error updating kpi data
 */
router.put("/updateKPI/:id", verifyToken, updateKPI);

/**
 * @swagger
 * /api/kpi/deleteKPI/{id}:
 *   delete:
 *     tags:
 *       - KPI Sector
 *     summary: Delete an existing kpi
 *     description: This endpoint allows to delete a kpi from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the kpi to delete
 *     responses:
 *       200:
 *         description: KPI deleted successfully
 *       404:
 *         description: KPI data not found
 */
router.delete("/deleteKPI/:id", verifyToken, deleteKPI);

/**
 * @swagger
 * /api/kpi/KPI/{id}:
 *   get:
 *     tags:
 *       - KPI Sector
 *     summary: Get a single KPI by ID
 *     description: This endpoint allows to retrieve a specific KPI by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the KPI to retrieve
 *     responses:
 *       200:
 *         description: KPI data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     KPIName:
 *                       type: string
 *                     targetValue:
 *                       type: float
 *                     achievedValue:
 *                       type: float
 *                     KPIStatus:
 *                       type: string
 *                       enum: [Not Started, In Progress, Completed]
 *                     employeeId:
 *                       type: integer
 *       404:
 *         description: KPI data not found
 */
router.get("/KPI/:id", verifyToken, getKPIById);

/**
 * @swagger
 * /api/performance/filterPerformance:
 *   get:
 *     tags:
 *       - Performance Management
 *     summary: Get filtered performance data
 *     description: This endpoint allows filtering performance data based on rating, date range, and pagination.
 *     parameters:
 *       - in: query
 *         name: performanceRating
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, 1, 2, 3, 4, 5]
 *         description: The performance rating to filter by.
 *       - in: query
 *         name: reviewPeriodStartDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The start date of the review period.
 *       - in: query
 *         name: reviewPeriodEndDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The end date of the review period.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A list of filtered performance records.
 *       500:
 *         description: Error filtering performance data
 */
router.get("/filterPerformance", verifyToken, filterPerformance);

/**
 * @swagger
 * /api/performance/exportFilteredPerformanceToCSV:
 *   get:
 *     tags:
 *       - Performance Management
 *     summary: Export filtered performance data to CSV
 *     description: This endpoint allows exporting filtered performance data as a CSV file.
 *     parameters:
 *       - in: query
 *         name: performanceRating
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, 1, 2, 3, 4, 5]
 *         description: The performance rating to filter by.
 *       - in: query
 *         name: reviewPeriodStartDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The start date of the review period.
 *       - in: query
 *         name: reviewPeriodEndDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The end date of the review period.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A CSV file containing filtered performance data.
 *       500:
 *         description: Error exporting performance data to CSV
 */
router.get("/exportFilteredPerformanceToCSV", verifyToken, exportFilteredPerformanceToCSV);

/**
 * @swagger
 * /api/performance/exportFilteredPerformanceToPDF:
 *   get:
 *     tags:
 *       - Performance Management
 *     summary: Export filtered performance data to PDF
 *     description: This endpoint allows exporting filtered performance data as a PDF file.
 *     parameters:
 *       - in: query
 *         name: performanceRating
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, 1, 2, 3, 4, 5]
 *         description: The performance rating to filter by.
 *       - in: query
 *         name: reviewPeriodStartDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The start date of the review period.
 *       - in: query
 *         name: reviewPeriodEndDate
 *         required: false
 *         schema:
 *           type: string
 *           description: The end date of the review period.
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of records per page.
 *     responses:
 *       200:
 *         description: A PDF file with filtered performance data.
 *       500:
 *         description: Error exporting performance data to PDF
 */
router.get("/exportFilteredPerformanceToPDF", verifyToken, exportFilteredPerformanceToPDF);

module.exports = router;