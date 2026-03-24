// // // // // // // const express = require('express');
// // // // // // // const {
// // // // // // //     createActiveAllocation,
// // // // // // //     updateActiveAllocation,
// // // // // // //     deleteActiveAllocation,
// // // // // // //     getActiveAllocationById,
// // // // // // //     getActiveAllocations,
// // // // // // //     exportActiveAllocationsToCSV,
// // // // // // //     exportActiveAllocationsToPDF,
// // // // // // //     createBreakdown,
// // // // // // //     updateBreakdown,
// // // // // // //     getBreakdowns,
// // // // // // //     exportBreakdownsToCSV,
// // // // // // //     exportBreakdownsToPDF,
// // // // // // //     createHandheldEvent,
// // // // // // //     updateHandheldEvent,
// // // // // // //     getHandheldEvents,
// // // // // // //     createCoordinatorTask,
// // // // // // //     updateCoordinatorTask,
// // // // // // //     getCoordinatorTasks,
// // // // // // // } = require('../../controllers/fleet-management/operationalHandlingController');
// // // // // // // const { verifyToken } = require('../../middleware/authMiddleware');

// // // // // // // const router = express.Router();

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/active-allocations/create:
// // // // // // //  *   post:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Create a new active allocation
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               sales_order_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               equipment_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Active, Inactive, Pending]
// // // // // // //  *               usageHours:
// // // // // // //  *                 type: integer
// // // // // // //  *     responses:
// // // // // // //  *       201:
// // // // // // //  *         description: Active allocation created successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error creating active allocation
// // // // // // //  */
// // // // // // // router.post('/active-allocations/create', verifyToken, createActiveAllocation);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/active-allocations/update/{id}:
// // // // // // //  *   put:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Update an active allocation
// // // // // // //  *     parameters:
// // // // // // //  *       - in: path
// // // // // // //  *         name: id
// // // // // // //  *         required: true
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               sales_order_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               equipment_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Active, Inactive, Pending]
// // // // // // //  *               usageHours:
// // // // // // //  *                 type: integer
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Active allocation updated successfully
// // // // // // //  *       404:
// // // // // // //  *         description: Active allocation not found
// // // // // // //  *       500:
// // // // // // //  *         description: Error updating active allocation
// // // // // // //  */
// // // // // // // router.put('/active-allocations/update/:id', verifyToken, updateActiveAllocation);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/active-allocations/delete/{id}:
// // // // // // //  *   delete:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Delete an active allocation
// // // // // // //  *     parameters:
// // // // // // //  *       - in: path
// // // // // // //  *         name: id
// // // // // // //  *         required: true
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Active allocation deleted successfully
// // // // // // //  *       404:
// // // // // // //  *         description: Active allocation not found
// // // // // // //  *       500:
// // // // // // //  *         description: Error deleting active allocation
// // // // // // //  */
// // // // // // // router.delete('/active-allocations/delete/:id', verifyToken, deleteActiveAllocation);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/active-allocations/{id}:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Get an active allocation by ID
// // // // // // //  *     parameters:
// // // // // // //  *       - in: path
// // // // // // //  *         name: id
// // // // // // //  *         required: true
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Active allocation retrieved successfully
// // // // // // //  *       404:
// // // // // // //  *         description: Active allocation not found
// // // // // // //  *       500:
// // // // // // //  *         description: Error retrieving active allocation
// // // // // // //  */
// // // // // // // router.get('/active-allocations/:id', verifyToken, getActiveAllocationById);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/active-allocations:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Get all active allocations with pagination
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 1
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 10
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Active, Inactive, Pending]
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Active allocations retrieved successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error retrieving active allocations
// // // // // // //  */
// // // // // // // router.get('/active-allocations', verifyToken, getActiveAllocations);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/active-allocations/export/csv:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Export active allocations to CSV
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Active, Inactive, Pending]
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: CSV file download
// // // // // // //  *       500:
// // // // // // //  *         description: Error exporting CSV
// // // // // // //  */
// // // // // // // router.get('/active-allocations/export/csv', verifyToken, exportActiveAllocationsToCSV);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/active-allocations/export/pdf:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Export active allocations to PDF
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Active, Inactive, Pending]
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: PDF file download
// // // // // // //  *       500:
// // // // // // //  *         description: Error exporting PDF
// // // // // // //  */
// // // // // // // router.get('/active-allocations/export/pdf', verifyToken, exportActiveAllocationsToPDF);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/breakdowns/create:
// // // // // // //  *   post:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Create a new breakdown or idle event
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               eventType:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Breakdown, Idle]
// // // // // // //  *               reason:
// // // // // // //  *                 type: string
// // // // // // //  *               duration:
// // // // // // //  *                 type: string
// // // // // // //  *               sales_order_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               equipment_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Active, Resolved, Pending]
// // // // // // //  *     responses:
// // // // // // //  *       201:
// // // // // // //  *         description: Breakdown event created successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error creating breakdown event
// // // // // // //  */
// // // // // // // router.post('/breakdowns/create', verifyToken, createBreakdown);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/breakdowns/update/{id}:
// // // // // // //  *   put:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Update a breakdown or idle event
// // // // // // //  *     parameters:
// // // // // // //  *       - in: path
// // // // // // //  *         name: id
// // // // // // //  *         required: true
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               eventType:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Breakdown, Idle]
// // // // // // //  *               reason:
// // // // // // //  *                 type: string
// // // // // // //  *               duration:
// // // // // // //  *                 type: string
// // // // // // //  *               sales_order_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               equipment_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Active, Resolved, Pending]
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Breakdown event updated successfully
// // // // // // //  *       404:
// // // // // // //  *         description: Breakdown event not found
// // // // // // //  *       500:
// // // // // // //  *         description: Error updating breakdown event
// // // // // // //  */
// // // // // // // router.put('/breakdowns/update/:id', verifyToken, updateBreakdown);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/breakdowns:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Get all breakdown/idle events with pagination
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 1
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 10
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Active, Resolved, Pending]
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Breakdowns retrieved successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error retrieving breakdowns
// // // // // // //  */
// // // // // // // router.get('/breakdowns', verifyToken, getBreakdowns);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/breakdowns/export/csv:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Export breakdown/idle events to CSV
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Active, Resolved, Pending]
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: CSV file download
// // // // // // //  *       500:
// // // // // // //  *         description: Error exporting CSV
// // // // // // //  */
// // // // // // // router.get('/breakdowns/export/csv', verifyToken, exportBreakdownsToCSV);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/breakdowns/export/pdf:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Export breakdown/idle events to PDF
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Active, Resolved, Pending]
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: PDF file download
// // // // // // //  *       500:
// // // // // // //  *         description: Error exporting PDF
// // // // // // //  */
// // // // // // // router.get('/breakdowns/export/pdf', verifyToken, exportBreakdownsToPDF);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/handheld-events/create:
// // // // // // //  *   post:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Create a new handheld event
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               eventType:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [SHIFT START, SHIFT END, IDLE]
// // // // // // //  *               time:
// // // // // // //  *                 type: string
// // // // // // //  *               siteId:
// // // // // // //  *                 type: string
// // // // // // //  *               equipment_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               signature:
// // // // // // //  *                 type: boolean
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Active, Review, Completed]
// // // // // // //  *     responses:
// // // // // // //  *       201:
// // // // // // //  *         description: Handheld event created successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error creating handheld event
// // // // // // //  */
// // // // // // // router.post('/handheld-events/create', verifyToken, createHandheldEvent);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/handheld-events/update/{id}:
// // // // // // //  *   put:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Update a handheld event
// // // // // // //  *     parameters:
// // // // // // //  *       - in: path
// // // // // // //  *         name: id
// // // // // // //  *         required: true
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               eventType:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [SHIFT START, SHIFT END, IDLE]
// // // // // // //  *               time:
// // // // // // //  *                 type: string
// // // // // // //  *               siteId:
// // // // // // //  *                 type: string
// // // // // // //  *               equipment_id:
// // // // // // //  *                 type: integer
// // // // // // //  *               signature:
// // // // // // //  *                 type: boolean
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Active, Review, Completed]
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Handheld event updated successfully
// // // // // // //  *       404:
// // // // // // //  *         description: Handheld event not found
// // // // // // //  *       500:
// // // // // // //  *         description: Error updating handheld event
// // // // // // //  */
// // // // // // // router.put('/handheld-events/update/:id', verifyToken, updateHandheldEvent);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/handheld-events:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Get all handheld events with pagination
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 1
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 10
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Active, Review, Completed]
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Handheld events retrieved successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error retrieving handheld events
// // // // // // //  */
// // // // // // // router.get('/handheld-events', verifyToken, getHandheldEvents);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/coordinator-tasks/create:
// // // // // // //  *   post:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Create a new coordinator task
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               name:
// // // // // // //  *                 type: string
// // // // // // //  *               priority:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Low, Medium, High]
// // // // // // //  *               assignedTo:
// // // // // // //  *                 type: string
// // // // // // //  *               dueDate:
// // // // // // //  *                 type: string
// // // // // // //  *                 format: date
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Pending, In Progress, Completed]
// // // // // // //  *     responses:
// // // // // // //  *       201:
// // // // // // //  *         description: Coordinator task created successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error creating coordinator task
// // // // // // //  */
// // // // // // // router.post('/coordinator-tasks/create', verifyToken, createCoordinatorTask);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/coordinator-tasks/update/{id}:
// // // // // // //  *   put:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Update a coordinator task
// // // // // // //  *     parameters:
// // // // // // //  *       - in: path
// // // // // // //  *         name: id
// // // // // // //  *         required: true
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *     requestBody:
// // // // // // //  *       required: true
// // // // // // //  *       content:
// // // // // // //  *         application/json:
// // // // // // //  *           schema:
// // // // // // //  *             type: object
// // // // // // //  *             properties:
// // // // // // //  *               name:
// // // // // // //  *                 type: string
// // // // // // //  *               priority:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Low, Medium, High]
// // // // // // //  *               assignedTo:
// // // // // // //  *                 type: string
// // // // // // //  *               dueDate:
// // // // // // //  *                 type: string
// // // // // // //  *                 format: date
// // // // // // //  *               status:
// // // // // // //  *                 type: string
// // // // // // //  *                 enum: [Pending, In Progress, Completed]
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Coordinator task updated successfully
// // // // // // //  *       404:
// // // // // // //  *         description: Coordinator task not found
// // // // // // //  *       500:
// // // // // // //  *         description: Error updating coordinator task
// // // // // // //  */
// // // // // // // router.put('/coordinator-tasks/update/:id', verifyToken, updateCoordinatorTask);

// // // // // // // /**
// // // // // // //  * @swagger
// // // // // // //  * /api/operational/coordinator-tasks:
// // // // // // //  *   get:
// // // // // // //  *     tags:
// // // // // // //  *       - Operational Handling
// // // // // // //  *     summary: Get all coordinator tasks with pagination
// // // // // // //  *     parameters:
// // // // // // //  *       - in: query
// // // // // // //  *         name: page
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 1
// // // // // // //  *       - in: query
// // // // // // //  *         name: limit
// // // // // // //  *         schema:
// // // // // // //  *           type: integer
// // // // // // //  *           default: 10
// // // // // // //  *       - in: query
// // // // // // //  *         name: status
// // // // // // //  *         schema:
// // // // // // //  *           type: string
// // // // // // //  *           enum: [All, Pending, In Progress, Completed]
// // // // // // //  *     responses:
// // // // // // //  *       200:
// // // // // // //  *         description: Coordinator tasks retrieved successfully
// // // // // // //  *       500:
// // // // // // //  *         description: Error retrieving coordinator tasks
// // // // // // //  */
// // // // // // // router.get('/coordinator-tasks', verifyToken, getCoordinatorTasks);

// // // // // // // module.exports = router;

// // // // // // const express = require("express");
// // // // // // const {
// // // // // //   getCurrentShiftOrders,
// // // // // //   getNextShiftOrders,
// // // // // //   getFutureOrders,
// // // // // //   getAllActiveOrders,
// // // // // //   getCompletedOrders,
// // // // // //   getShiftAllocationById,
// // // // // //   createShiftAllocation,
// // // // // //   updateShiftAllocationStatus,
// // // // // //   getShiftInfo,
// // // // // // } = require("../../controllers/fleet-management/operationalHandlingController");
// // // // // // const { verifyToken } = require("../../middleware/authMiddleware");

// // // // // // const router = express.Router();

// // // // // // // ─── Shift Info ───────────────────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/shift-info:
// // // // // //  *   get:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Get current shift and next shift information
// // // // // //  *     description: >
// // // // // //  *       Returns the current shift type (Day/Night), current shift date,
// // // // // //  *       next shift type, and next shift date based on server time.
// // // // // //  *       Day Shift = 06:00–17:59 | Night Shift = 18:00–05:59.
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Shift info retrieved successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               type: object
// // // // // //  *               properties:
// // // // // //  *                 serverTime:
// // // // // //  *                   type: string
// // // // // //  *                   format: date-time
// // // // // //  *                 currentShiftType:
// // // // // //  *                   type: string
// // // // // //  *                   enum: [Day, Night]
// // // // // //  *                 currentShiftDate:
// // // // // //  *                   type: string
// // // // // //  *                   format: date
// // // // // //  *                 nextShiftType:
// // // // // //  *                   type: string
// // // // // //  *                   enum: [Day, Night]
// // // // // //  *                 nextShiftDate:
// // // // // //  *                   type: string
// // // // // //  *                   format: date
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.get("/shift-info", verifyToken, getShiftInfo);

// // // // // // // ─── Active Orders ────────────────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/active-orders:
// // // // // //  *   get:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Get all active orders grouped by Current Shift, Next Shift, and Future Orders
// // // // // //  *     description: >
// // // // // //  *       Returns a combined response containing:
// // // // // //  *       - **currentShift**: Orders for the shift currently in progress.
// // // // // //  *       - **nextShift**: Orders for the shift immediately following the current one.
// // // // // //  *       - **futureOrders**: Orders scheduled beyond the next shift window.
// // // // // //  *
// // // // // //  *       Active Order Rules:
// // // // // //  *       - At least one resource (equipment, manpower, or attachment) must be allocated.
// // // // // //  *       - The current date must fall between scheduled_date and lpo_end_date (inclusive).
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Active orders retrieved successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               type: object
// // // // // //  *               properties:
// // // // // //  *                 currentShift:
// // // // // //  *                   $ref: '#/components/schemas/ShiftOrdersGroup'
// // // // // //  *                 nextShift:
// // // // // //  *                   $ref: '#/components/schemas/ShiftOrdersGroup'
// // // // // //  *                 futureOrders:
// // // // // //  *                   type: object
// // // // // //  *                   properties:
// // // // // //  *                     totalOrders:
// // // // // //  *                       type: integer
// // // // // //  *                     orders:
// // // // // //  *                       type: array
// // // // // //  *                       items:
// // // // // //  *                         $ref: '#/components/schemas/ShiftAllocationRecord'
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.get("/active-orders", verifyToken, getAllActiveOrders);

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/active-orders/current-shift:
// // // // // //  *   get:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Get Current Shift active orders
// // // // // //  *     description: >
// // // // // //  *       Returns orders allocated to the shift currently in progress based on server time.
// // // // // //  *       Day Shift (06:00–17:59) or Night Shift (18:00–05:59).
// // // // // //  *       Only orders with at least one allocated resource and within their
// // // // // //  *       active date window (scheduled_date ≤ today ≤ lpo_end_date) are returned.
// // // // // //  *     parameters:
// // // // // //  *       - in: query
// // // // // //  *         name: page
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 1
// // // // // //  *       - in: query
// // // // // //  *         name: limit
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 10
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Current shift orders retrieved successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               allOf:
// // // // // //  *                 - $ref: '#/components/schemas/PaginatedShiftOrders'
// // // // // //  *                 - type: object
// // // // // //  *                   properties:
// // // // // //  *                     shiftType:
// // // // // //  *                       type: string
// // // // // //  *                       enum: [Day, Night]
// // // // // //  *                     shiftDate:
// // // // // //  *                       type: string
// // // // // //  *                       format: date
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.get("/active-orders/current-shift", verifyToken, getCurrentShiftOrders);

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/active-orders/next-shift:
// // // // // //  *   get:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Get Next Shift active orders
// // // // // //  *     description: >
// // // // // //  *       Returns orders allocated to the shift immediately following the current shift.
// // // // // //  *       If current = Day Shift → Next = Night Shift (same date).
// // // // // //  *       If current = Night Shift → Next = Day Shift (next calendar date).
// // // // // //  *     parameters:
// // // // // //  *       - in: query
// // // // // //  *         name: page
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 1
// // // // // //  *       - in: query
// // // // // //  *         name: limit
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 10
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Next shift orders retrieved successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               allOf:
// // // // // //  *                 - $ref: '#/components/schemas/PaginatedShiftOrders'
// // // // // //  *                 - type: object
// // // // // //  *                   properties:
// // // // // //  *                     shiftType:
// // // // // //  *                       type: string
// // // // // //  *                       enum: [Day, Night]
// // // // // //  *                     shiftDate:
// // // // // //  *                       type: string
// // // // // //  *                       format: date
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.get("/active-orders/next-shift", verifyToken, getNextShiftOrders);

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/active-orders/future-orders:
// // // // // //  *   get:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Get Future Orders
// // // // // //  *     description: >
// // // // // //  *       Returns orders scheduled after the next shift window.
// // // // // //  *       These are allocations planned for later dates or future operational shifts.
// // // // // //  *       Orders must still have a valid lpo_end_date >= their shift_date to be included.
// // // // // //  *     parameters:
// // // // // //  *       - in: query
// // // // // //  *         name: page
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 1
// // // // // //  *       - in: query
// // // // // //  *         name: limit
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 10
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Future orders retrieved successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               $ref: '#/components/schemas/PaginatedShiftOrders'
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.get("/active-orders/future-orders", verifyToken, getFutureOrders);

// // // // // // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/completed-orders:
// // // // // //  *   get:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Get all Completed Orders
// // // // // //  *     description: >
// // // // // //  *       Returns shift allocation records where operational_status is "Completed".
// // // // // //  *       Only records with at least one allocated resource are returned.
// // // // // //  *       Supports optional date range filtering.
// // // // // //  *     parameters:
// // // // // //  *       - in: query
// // // // // //  *         name: page
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 1
// // // // // //  *       - in: query
// // // // // //  *         name: limit
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *           default: 10
// // // // // //  *       - in: query
// // // // // //  *         name: from_date
// // // // // //  *         required: false
// // // // // //  *         schema:
// // // // // //  *           type: string
// // // // // //  *           format: date
// // // // // //  *         description: Filter completed orders from this date (YYYY-MM-DD)
// // // // // //  *       - in: query
// // // // // //  *         name: to_date
// // // // // //  *         required: false
// // // // // //  *         schema:
// // // // // //  *           type: string
// // // // // //  *           format: date
// // // // // //  *         description: Filter completed orders up to this date (YYYY-MM-DD)
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Completed orders retrieved successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               $ref: '#/components/schemas/PaginatedShiftOrders'
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.get("/completed-orders", verifyToken, getCompletedOrders);

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/completed-orders/{id}:
// // // // // //  *   get:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Get a single shift allocation record by ID
// // // // // //  *     description: Retrieves a specific shift allocation record with all associated resources.
// // // // // //  *     parameters:
// // // // // //  *       - in: path
// // // // // //  *         name: id
// // // // // //  *         required: true
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *         description: Shift Allocation ID
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Shift allocation record retrieved successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               $ref: '#/components/schemas/ShiftAllocationRecord'
// // // // // //  *       404:
// // // // // //  *         description: Shift allocation record not found
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.get("/completed-orders/:id", verifyToken, getShiftAllocationById);

// // // // // // // ─── Create & Update Shift Allocation ────────────────────────────────────────

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/shift-allocation:
// // // // // //  *   post:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Create a new shift allocation
// // // // // //  *     description: >
// // // // // //  *       Creates a shift allocation record for a Sales Order on a specific date and shift.
// // // // // //  *       At least one resource (equipment, manpower, or attachment) MUST be provided.
// // // // // //  *       Orders without any resource will be rejected.
// // // // // //  *     requestBody:
// // // // // //  *       required: true
// // // // // //  *       content:
// // // // // //  *         application/json:
// // // // // //  *           schema:
// // // // // //  *             type: object
// // // // // //  *             required:
// // // // // //  *               - so_id
// // // // // //  *               - shift_date
// // // // // //  *               - shift_type
// // // // // //  *             properties:
// // // // // //  *               so_id:
// // // // // //  *                 type: integer
// // // // // //  *                 description: Sales Order ID
// // // // // //  *               shift_date:
// // // // // //  *                 type: string
// // // // // //  *                 format: date
// // // // // //  *                 description: Calendar date of the shift (YYYY-MM-DD)
// // // // // //  *               shift_type:
// // // // // //  *                 type: string
// // // // // //  *                 enum: [Day, Night]
// // // // // //  *                 description: "Day = 06:00–17:59 | Night = 18:00–05:59"
// // // // // //  *               scheduled_date:
// // // // // //  *                 type: string
// // // // // //  *                 format: date
// // // // // //  *                 description: Scheduled start date set during equipment allocation
// // // // // //  *               remarks:
// // // // // //  *                 type: string
// // // // // //  *               equipment:
// // // // // //  *                 type: array
// // // // // //  *                 items:
// // // // // //  *                   type: object
// // // // // //  *                   required: [serial_number]
// // // // // //  *                   properties:
// // // // // //  *                     serial_number:
// // // // // //  *                       type: integer
// // // // // //  *                     note:
// // // // // //  *                       type: string
// // // // // //  *               manpower:
// // // // // //  *                 type: array
// // // // // //  *                 items:
// // // // // //  *                   type: object
// // // // // //  *                   required: [employee_id]
// // // // // //  *                   properties:
// // // // // //  *                     employee_id:
// // // // // //  *                       type: integer
// // // // // //  *                     note:
// // // // // //  *                       type: string
// // // // // //  *               attachments:
// // // // // //  *                 type: array
// // // // // //  *                 items:
// // // // // //  *                   type: object
// // // // // //  *                   required: [attachment_id]
// // // // // //  *                   properties:
// // // // // //  *                     attachment_id:
// // // // // //  *                       type: integer
// // // // // //  *                     note:
// // // // // //  *                       type: string
// // // // // //  *     responses:
// // // // // //  *       201:
// // // // // //  *         description: Shift allocation created successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               type: object
// // // // // //  *               properties:
// // // // // //  *                 message:
// // // // // //  *                   type: string
// // // // // //  *                 shift_allocation_id:
// // // // // //  *                   type: integer
// // // // // //  *       400:
// // // // // //  *         description: Validation error (no resources provided)
// // // // // //  *       404:
// // // // // //  *         description: Sales order not found
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.post("/shift-allocation", verifyToken, createShiftAllocation);

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * /api/operational-handling/shift-allocation/{id}/status:
// // // // // //  *   put:
// // // // // //  *     tags:
// // // // // //  *       - Operational Handling
// // // // // //  *     summary: Update operational status of a shift allocation
// // // // // //  *     description: >
// // // // // //  *       Updates the operational_status of a shift allocation record.
// // // // // //  *       Setting status to **"Completed"** will move the order to the Completed Orders list.
// // // // // //  *
// // // // // //  *       Status flow: Pending → In Progress → Completed | Cancelled
// // // // // //  *     parameters:
// // // // // //  *       - in: path
// // // // // //  *         name: id
// // // // // //  *         required: true
// // // // // //  *         schema:
// // // // // //  *           type: integer
// // // // // //  *         description: Shift Allocation ID
// // // // // //  *     requestBody:
// // // // // //  *       required: true
// // // // // //  *       content:
// // // // // //  *         application/json:
// // // // // //  *           schema:
// // // // // //  *             type: object
// // // // // //  *             required:
// // // // // //  *               - operational_status
// // // // // //  *             properties:
// // // // // //  *               operational_status:
// // // // // //  *                 type: string
// // // // // //  *                 enum: [Pending, In Progress, Completed, Cancelled]
// // // // // //  *                 description: New operational status
// // // // // //  *               remarks:
// // // // // //  *                 type: string
// // // // // //  *                 description: Optional remarks for the status update
// // // // // //  *     responses:
// // // // // //  *       200:
// // // // // //  *         description: Status updated successfully
// // // // // //  *         content:
// // // // // //  *           application/json:
// // // // // //  *             schema:
// // // // // //  *               type: object
// // // // // //  *               properties:
// // // // // //  *                 message:
// // // // // //  *                   type: string
// // // // // //  *                 shift_allocation_id:
// // // // // //  *                   type: integer
// // // // // //  *                 operational_status:
// // // // // //  *                   type: string
// // // // // //  *       400:
// // // // // //  *         description: Invalid status value
// // // // // //  *       404:
// // // // // //  *         description: Shift allocation record not found
// // // // // //  *       500:
// // // // // //  *         description: Server error
// // // // // //  */
// // // // // // router.put("/shift-allocation/:id/status", verifyToken, updateShiftAllocationStatus);

// // // // // // // ─── Swagger Component Schemas ────────────────────────────────────────────────

// // // // // // /**
// // // // // //  * @swagger
// // // // // //  * components:
// // // // // //  *   schemas:
// // // // // //  *     ShiftAllocationRecord:
// // // // // //  *       type: object
// // // // // //  *       properties:
// // // // // //  *         shift_allocation_id:
// // // // // //  *           type: integer
// // // // // //  *         so_id:
// // // // // //  *           type: integer
// // // // // //  *         shift_date:
// // // // // //  *           type: string
// // // // // //  *           format: date
// // // // // //  *         shift_type:
// // // // // //  *           type: string
// // // // // //  *           enum: [Day, Night]
// // // // // //  *         scheduled_date:
// // // // // //  *           type: string
// // // // // //  *           format: date
// // // // // //  *         operational_status:
// // // // // //  *           type: string
// // // // // //  *           enum: [Pending, In Progress, Completed, Cancelled]
// // // // // //  *         remarks:
// // // // // //  *           type: string
// // // // // //  *         salesOrder:
// // // // // //  *           type: object
// // // // // //  *           properties:
// // // // // //  *             id:
// // // // // //  *               type: integer
// // // // // //  *             so_number:
// // // // // //  *               type: string
// // // // // //  *             client:
// // // // // //  *               type: string
// // // // // //  *             project_name:
// // // // // //  *               type: string
// // // // // //  *             shift:
// // // // // //  *               type: string
// // // // // //  *             lpo_validity_date:
// // // // // //  *               type: string
// // // // // //  *               format: date
// // // // // //  *             extended_lpo_validity_date:
// // // // // //  *               type: string
// // // // // //  *               format: date
// // // // // //  *             ops_status:
// // // // // //  *               type: string
// // // // // //  *             jobLocation:
// // // // // //  *               type: object
// // // // // //  *               properties:
// // // // // //  *                 job_location_id:
// // // // // //  *                   type: integer
// // // // // //  *                 job_location_name:
// // // // // //  *                   type: string
// // // // // //  *         equipmentAllocations:
// // // // // //  *           type: array
// // // // // //  *           items:
// // // // // //  *             type: object
// // // // // //  *             properties:
// // // // // //  *               serial_number:
// // // // // //  *                 type: integer
// // // // // //  *               note:
// // // // // //  *                 type: string
// // // // // //  *               equipment:
// // // // // //  *                 type: object
// // // // // //  *                 properties:
// // // // // //  *                   serial_number:
// // // // // //  *                     type: integer
// // // // // //  *                   reg_number:
// // // // // //  *                     type: string
// // // // // //  *                   vehicle_type:
// // // // // //  *                     type: string
// // // // // //  *         manpowerAllocations:
// // // // // //  *           type: array
// // // // // //  *           items:
// // // // // //  *             type: object
// // // // // //  *             properties:
// // // // // //  *               employee_id:
// // // // // //  *                 type: integer
// // // // // //  *               note:
// // // // // //  *                 type: string
// // // // // //  *         attachmentAllocations:
// // // // // //  *           type: array
// // // // // //  *           items:
// // // // // //  *             type: object
// // // // // //  *             properties:
// // // // // //  *               attachment_id:
// // // // // //  *                 type: integer
// // // // // //  *               note:
// // // // // //  *                 type: string
// // // // // //  *
// // // // // //  *     ShiftOrdersGroup:
// // // // // //  *       type: object
// // // // // //  *       properties:
// // // // // //  *         shiftType:
// // // // // //  *           type: string
// // // // // //  *           enum: [Day, Night]
// // // // // //  *         shiftDate:
// // // // // //  *           type: string
// // // // // //  *           format: date
// // // // // //  *         totalOrders:
// // // // // //  *           type: integer
// // // // // //  *         orders:
// // // // // //  *           type: array
// // // // // //  *           items:
// // // // // //  *             $ref: '#/components/schemas/ShiftAllocationRecord'
// // // // // //  *
// // // // // //  *     PaginatedShiftOrders:
// // // // // //  *       type: object
// // // // // //  *       properties:
// // // // // //  *         totalOrders:
// // // // // //  *           type: integer
// // // // // //  *         currentPage:
// // // // // //  *           type: integer
// // // // // //  *         totalPages:
// // // // // //  *           type: integer
// // // // // //  *         orders:
// // // // // //  *           type: array
// // // // // //  *           items:
// // // // // //  *             $ref: '#/components/schemas/ShiftAllocationRecord'
// // // // // //  */

// // // // // // module.exports = router;

// // // // // // routes/fleet-management/operationalHandlingRoutes.js

// // // // // const express = require("express");
// // // // // const {
// // // // //   getActiveOrders,
// // // // //   getCompletedOrders,
// // // // //   getOperationalOrderDetails,
// // // // //   getCurrentShiftInfo,
// // // // //   getOrdersByDate,
// // // // //   completeOperationalOrder,
// // // // //   getOperationalStats
// // // // // } = require("../../controllers/fleet-management/operationalHandlingController");
// // // // // const { verifyToken } = require("../../middleware/authMiddleware");

// // // // // const router = express.Router();

// // // // // /**
// // // // //  * @swagger
// // // // //  * tags:
// // // // //  *   name: Operational Handling
// // // // //  *   description: Operational handling module for managing active and completed orders with shift-based categorization
// // // // //  */

// // // // // /**
// // // // //  * @swagger
// // // // //  * /api/operational-handling/active-orders:
// // // // //  *   get:
// // // // //  *     tags: [Operational Handling]
// // // // //  *     summary: Get all active orders categorized by shift (current, next, future)
// // // // //  *     description: |
// // // // //  *       Retrieves active orders where operational resources have been allocated.
// // // // //  *       Orders are categorized based on shift timing:
// // // // //  *       - Current Shift: Based on system time (Day: 6AM-5:59PM, Night: 6PM-5:59AM)
// // // // //  *       - Next Shift: The shift immediately following current shift
// // // // //  *       - Future Orders: Scheduled after next shift window
// // // // //  *     parameters:
// // // // //  *       - in: query
// // // // //  *         name: page
// // // // //  *         schema:
// // // // //  *           type: integer
// // // // //  *           default: 1
// // // // //  *         description: Page number for pagination
// // // // //  *       - in: query
// // // // //  *         name: limit
// // // // //  *         schema:
// // // // //  *           type: integer
// // // // //  *           default: 10
// // // // //  *         description: Number of items per page
// // // // //  *     responses:
// // // // //  *       200:
// // // // //  *         description: Active orders retrieved successfully
// // // // //  *         content:
// // // // //  *           application/json:
// // // // //  *             schema:
// // // // //  *               type: object
// // // // //  *               properties:
// // // // //  *                 message:
// // // // //  *                   type: string
// // // // //  *                 current_shift:
// // // // //  *                   type: object
// // // // //  *                   properties:
// // // // //  *                     shift_name:
// // // // //  *                       type: string
// // // // //  *                       enum: [Day, Night]
// // // // //  *                     shift_start:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                     shift_end:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                     total_orders:
// // // // //  *                       type: integer
// // // // //  *                     orders:
// // // // //  *                       type: array
// // // // //  *                 next_shift:
// // // // //  *                   type: object
// // // // //  *                   properties:
// // // // //  *                     shift_name:
// // // // //  *                       type: string
// // // // //  *                       enum: [Day, Night]
// // // // //  *                     shift_start:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                     shift_end:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                     total_orders:
// // // // //  *                       type: integer
// // // // //  *                     orders:
// // // // //  *                       type: array
// // // // //  *                 future_orders:
// // // // //  *                   type: object
// // // // //  *                   properties:
// // // // //  *                     start_from:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                     total_orders:
// // // // //  *                       type: integer
// // // // //  *                     orders:
// // // // //  *                       type: array
// // // // //  *                 pagination:
// // // // //  *                   type: object
// // // // //  *       500:
// // // // //  *         description: Error retrieving active orders
// // // // //  */
// // // // // router.get("/active-orders", verifyToken, getActiveOrders);

// // // // // /**
// // // // //  * @swagger
// // // // //  * /api/operational-handling/completed-orders:
// // // // //  *   get:
// // // // //  *     tags: [Operational Handling]
// // // // //  *     summary: Get all completed orders
// // // // //  *     description: |
// // // // //  *       Retrieves orders that have been marked as completed based on operational status.
// // // // //  *       Only orders with allocated resources are displayed.
// // // // //  *     parameters:
// // // // //  *       - in: query
// // // // //  *         name: page
// // // // //  *         schema:
// // // // //  *           type: integer
// // // // //  *           default: 1
// // // // //  *         description: Page number for pagination
// // // // //  *       - in: query
// // // // //  *         name: limit
// // // // //  *         schema:
// // // // //  *           type: integer
// // // // //  *           default: 10
// // // // //  *         description: Number of items per page
// // // // //  *       - in: query
// // // // //  *         name: from_date
// // // // //  *         schema:
// // // // //  *           type: string
// // // // //  *           format: date
// // // // //  *         description: Filter completed orders from this date
// // // // //  *       - in: query
// // // // //  *         name: to_date
// // // // //  *         schema:
// // // // //  *           type: string
// // // // //  *           format: date
// // // // //  *         description: Filter completed orders up to this date
// // // // //  *     responses:
// // // // //  *       200:
// // // // //  *         description: Completed orders retrieved successfully
// // // // //  *         content:
// // // // //  *           application/json:
// // // // //  *             schema:
// // // // //  *               type: object
// // // // //  *               properties:
// // // // //  *                 message:
// // // // //  *                   type: string
// // // // //  *                 total_orders:
// // // // //  *                   type: integer
// // // // //  *                 current_page:
// // // // //  *                   type: integer
// // // // //  *                 total_pages:
// // // // //  *                   type: integer
// // // // //  *                 orders:
// // // // //  *                   type: array
// // // // //  *       500:
// // // // //  *         description: Error retrieving completed orders
// // // // //  */
// // // // // router.get("/completed-orders", verifyToken, getCompletedOrders);

// // // // // /**
// // // // //  * @swagger
// // // // //  * /api/operational-handling/order/{allocationId}:
// // // // //  *   get:
// // // // //  *     tags: [Operational Handling]
// // // // //  *     summary: Get detailed information for a specific operational order
// // // // //  *     description: Retrieves comprehensive details of an operational order including all allocated resources
// // // // //  *     parameters:
// // // // //  *       - in: path
// // // // //  *         name: allocationId
// // // // //  *         required: true
// // // // //  *         schema:
// // // // //  *           type: integer
// // // // //  *         description: ID of the allocation
// // // // //  *     responses:
// // // // //  *       200:
// // // // //  *         description: Operational order details retrieved successfully
// // // // //  *       404:
// // // // //  *         description: Operational order not found
// // // // //  *       500:
// // // // //  *         description: Error retrieving operational order details
// // // // //  */
// // // // // router.get("/order/:allocationId", verifyToken, getOperationalOrderDetails);

// // // // // /**
// // // // //  * @swagger
// // // // //  * /api/operational-handling/current-shift-info:
// // // // //  *   get:
// // // // //  *     tags: [Operational Handling]
// // // // //  *     summary: Get information about current and next shifts
// // // // //  *     description: |
// // // // //  *       Returns current shift information based on system time:
// // // // //  *       - Day Shift: 6:00 AM to 5:59 PM
// // // // //  *       - Night Shift: 6:00 PM to 5:59 AM (next day)
// // // // //  *     responses:
// // // // //  *       200:
// // // // //  *         description: Shift information retrieved successfully
// // // // //  *         content:
// // // // //  *           application/json:
// // // // //  *             schema:
// // // // //  *               type: object
// // // // //  *               properties:
// // // // //  *                 current_shift:
// // // // //  *                   type: object
// // // // //  *                   properties:
// // // // //  *                     name:
// // // // //  *                       type: string
// // // // //  *                       enum: [Day, Night]
// // // // //  *                     start:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                     end:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                 next_shift:
// // // // //  *                   type: object
// // // // //  *                   properties:
// // // // //  *                     name:
// // // // //  *                       type: string
// // // // //  *                       enum: [Day, Night]
// // // // //  *                     start:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                     end:
// // // // //  *                       type: string
// // // // //  *                       format: date-time
// // // // //  *                 server_time:
// // // // //  *                   type: string
// // // // //  *                   format: date-time
// // // // //  *       500:
// // // // //  *         description: Error getting shift information
// // // // //  */
// // // // // router.get("/current-shift-info", verifyToken, getCurrentShiftInfo);

// // // // // /**
// // // // //  * @swagger
// // // // //  * /api/operational-handling/orders-by-date:
// // // // //  *   get:
// // // // //  *     tags: [Operational Handling]
// // // // //  *     summary: Get operational orders for a specific date
// // // // //  *     description: Retrieves all operational orders scheduled for a specific date
// // // // //  *     parameters:
// // // // //  *       - in: query
// // // // //  *         name: date
// // // // //  *         required: true
// // // // //  *         schema:
// // // // //  *           type: string
// // // // //  *           format: date
// // // // //  *         description: Date to filter orders (YYYY-MM-DD)
// // // // //  *       - in: query
// // // // //  *         name: shift
// // // // //  *         schema:
// // // // //  *           type: string
// // // // //  *           enum: [Day, Night]
// // // // //  *         description: Filter by shift (optional)
// // // // //  *     responses:
// // // // //  *       200:
// // // // //  *         description: Orders retrieved successfully
// // // // //  *       400:
// // // // //  *         description: Date parameter is required
// // // // //  *       500:
// // // // //  *         description: Error retrieving orders by date
// // // // //  */
// // // // // router.get("/orders-by-date", verifyToken, getOrdersByDate);

// // // // // /**
// // // // //  * @swagger
// // // // //  * /api/operational-handling/order/{allocationId}/complete:
// // // // //  *   put:
// // // // //  *     tags: [Operational Handling]
// // // // //  *     summary: Mark an operational order as completed
// // // // //  *     description: |
// // // // //  *       Updates the operational status to Completed for the specified allocation.
// // // // //  *       If this is the last active allocation for the sales order, updates the
// // // // //  *       sales order ops_status to Completed as well.
// // // // //  *     parameters:
// // // // //  *       - in: path
// // // // //  *         name: allocationId
// // // // //  *         required: true
// // // // //  *         schema:
// // // // //  *           type: integer
// // // // //  *         description: ID of the allocation to complete
// // // // //  *     requestBody:
// // // // //  *       required: false
// // // // //  *       content:
// // // // //  *         application/json:
// // // // //  *           schema:
// // // // //  *             type: object
// // // // //  *             properties:
// // // // //  *               completion_notes:
// // // // //  *                 type: string
// // // // //  *                 description: Optional notes about completion
// // // // //  *     responses:
// // // // //  *       200:
// // // // //  *         description: Operational order marked as completed successfully
// // // // //  *       400:
// // // // //  *         description: Order is already completed
// // // // //  *       404:
// // // // //  *         description: Operational order not found
// // // // //  *       500:
// // // // //  *         description: Error completing operational order
// // // // //  */
// // // // // router.put("/order/:allocationId/complete", verifyToken, completeOperationalOrder);

// // // // // /**
// // // // //  * @swagger
// // // // //  * /api/operational-handling/stats:
// // // // //  *   get:
// // // // //  *     tags: [Operational Handling]
// // // // //  *     summary: Get operational handling statistics
// // // // //  *     description: |
// // // // //  *       Returns statistics about operational orders including:
// // // // //  *       - Count of orders in current shift
// // // // //  *       - Count of orders in next shift
// // // // //  *       - Count of future orders
// // // // //  *       - Count of completed orders
// // // // //  *       - Current shift information
// // // // //  *     responses:
// // // // //  *       200:
// // // // //  *         description: Operational statistics retrieved successfully
// // // // //  *         content:
// // // // //  *           application/json:
// // // // //  *             schema:
// // // // //  *               type: object
// // // // //  *               properties:
// // // // //  *                 stats:
// // // // //  *                   type: object
// // // // //  *                   properties:
// // // // //  *                     current_shift:
// // // // //  *                       type: object
// // // // //  *                       properties:
// // // // //  *                         count:
// // // // //  *                           type: integer
// // // // //  *                         shift_name:
// // // // //  *                           type: string
// // // // //  *                     next_shift:
// // // // //  *                       type: object
// // // // //  *                       properties:
// // // // //  *                         count:
// // // // //  *                           type: integer
// // // // //  *                         shift_name:
// // // // //  *                           type: string
// // // // //  *                     future_orders:
// // // // //  *                       type: object
// // // // //  *                       properties:
// // // // //  *                         count:
// // // // //  *                           type: integer
// // // // //  *                     completed_orders:
// // // // //  *                       type: object
// // // // //  *                       properties:
// // // // //  *                         count:
// // // // //  *                           type: integer
// // // // //  *                     total_active:
// // // // //  *                       type: integer
// // // // //  *                 shift_info:
// // // // //  *                   type: object
// // // // //  *       500:
// // // // //  *         description: Error getting operational statistics
// // // // //  */
// // // // // router.get("/stats", verifyToken, getOperationalStats);

// // // // // module.exports = router;

// // // // const express = require("express");
// // // // const {
// // // //   getShiftInfo,
// // // //   getCurrentShiftOrders,
// // // //   getNextShiftOrders,
// // // //   getFutureOrders,
// // // //   getAllActiveOrders,
// // // //   getCompletedOrders,
// // // //   getOrderById,
// // // //   getOrdersBySalesOrder,
// // // // } = require("../../controllers/fleet-management/operationalHandlingController");
// // // // const { verifyToken } = require("../../middleware/authMiddleware");

// // // // const router = express.Router();

// // // // // ─── Swagger Component Schemas ────────────────────────────────────────────────

// // // // /**
// // // //  * @swagger
// // // //  * components:
// // // //  *   schemas:
// // // //  *
// // // //  *     EquipmentResource:
// // // //  *       type: object
// // // //  *       description: One allocated equipment entry (displayed individually)
// // // //  *       properties:
// // // //  *         resource_type:
// // // //  *           type: string
// // // //  *           example: equipment
// // // //  *         allocation_detail:
// // // //  *           type: object
// // // //  *           properties:
// // // //  *             id:
// // // //  *               type: integer
// // // //  *             allocation_id:
// // // //  *               type: integer
// // // //  *             serial_number:
// // // //  *               type: integer
// // // //  *             eqt_stu:
// // // //  *               type: string
// // // //  *             status:
// // // //  *               type: string
// // // //  *             note:
// // // //  *               type: string
// // // //  *             is_selected:
// // // //  *               type: boolean
// // // //  *         equipment_info:
// // // //  *           type: object
// // // //  *           properties:
// // // //  *             serial_number:
// // // //  *               type: integer
// // // //  *             reg_number:
// // // //  *               type: string
// // // //  *             vehicle_type:
// // // //  *               type: string
// // // //  *             equipment_status:
// // // //  *               type: string
// // // //  *             equipment_status_note:
// // // //  *               type: string
// // // //  *
// // // //  *     ManpowerResource:
// // // //  *       type: object
// // // //  *       description: One allocated manpower entry (displayed individually)
// // // //  *       properties:
// // // //  *         resource_type:
// // // //  *           type: string
// // // //  *           example: manpower
// // // //  *         allocation_detail:
// // // //  *           type: object
// // // //  *           properties:
// // // //  *             id:
// // // //  *               type: integer
// // // //  *             allocation_id:
// // // //  *               type: integer
// // // //  *             employee_id:
// // // //  *               type: integer
// // // //  *             man_stu:
// // // //  *               type: string
// // // //  *             status:
// // // //  *               type: string
// // // //  *             note:
// // // //  *               type: string
// // // //  *             is_selected:
// // // //  *               type: boolean
// // // //  *         employee_info:
// // // //  *           type: object
// // // //  *           properties:
// // // //  *             id:
// // // //  *               type: integer
// // // //  *             full_name:
// // // //  *               type: string
// // // //  *             employee_no:
// // // //  *               type: string
// // // //  *             manpower_status:
// // // //  *               type: string
// // // //  *
// // // //  *     AttachmentResource:
// // // //  *       type: object
// // // //  *       description: One allocated attachment entry (displayed individually)
// // // //  *       properties:
// // // //  *         resource_type:
// // // //  *           type: string
// // // //  *           example: attachment
// // // //  *         allocation_detail:
// // // //  *           type: object
// // // //  *           properties:
// // // //  *             id:
// // // //  *               type: integer
// // // //  *             allocation_id:
// // // //  *               type: integer
// // // //  *             attachment_id:
// // // //  *               type: integer
// // // //  *             att_stu:
// // // //  *               type: string
// // // //  *             status:
// // // //  *               type: string
// // // //  *             note:
// // // //  *               type: string
// // // //  *             is_selected:
// // // //  *               type: boolean
// // // //  *         attachment_info:
// // // //  *           type: object
// // // //  *           properties:
// // // //  *             attachment_id:
// // // //  *               type: integer
// // // //  *             attachment_number:
// // // //  *               type: string
// // // //  *             product_name:
// // // //  *               type: string
// // // //  *             serial_number:
// // // //  *               type: string
// // // //  *             attachment_status:
// // // //  *               type: string
// // // //  *
// // // //  *     ResourcesSummary:
// // // //  *       type: object
// // // //  *       properties:
// // // //  *         total_equipment:
// // // //  *           type: integer
// // // //  *         total_manpower:
// // // //  *           type: integer
// // // //  *         total_attachments:
// // // //  *           type: integer
// // // //  *         total_resources:
// // // //  *           type: integer
// // // //  *
// // // //  *     AllocationOrder:
// // // //  *       type: object
// // // //  *       description: >
// // // //  *         One allocation record with all three resource types returned
// // // //  *         SEPARATELY so the frontend can display each resource individually.
// // // //  *       properties:
// // // //  *         allocation_id:
// // // //  *           type: integer
// // // //  *         allocation_date:
// // // //  *           type: string
// // // //  *           format: date
// // // //  *         status:
// // // //  *           type: string
// // // //  *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
// // // //  *         service_option:
// // // //  *           type: string
// // // //  *         user_remarks:
// // // //  *           type: string
// // // //  *         salesOrder:
// // // //  *           type: object
// // // //  *           properties:
// // // //  *             id:
// // // //  *               type: integer
// // // //  *             so_number:
// // // //  *               type: string
// // // //  *             client:
// // // //  *               type: string
// // // //  *             project_name:
// // // //  *               type: string
// // // //  *             delivery_address:
// // // //  *               type: string
// // // //  *             shift:
// // // //  *               type: string
// // // //  *               enum: [Day, Night, Full, Day and Night]
// // // //  *             lpo_number:
// // // //  *               type: string
// // // //  *             lpo_validity_date:
// // // //  *               type: string
// // // //  *               format: date
// // // //  *             extended_lpo_validity_date:
// // // //  *               type: string
// // // //  *               format: date
// // // //  *             expected_mobilization_date:
// // // //  *               type: string
// // // //  *               format: date
// // // //  *             expected_demobilization_date:
// // // //  *               type: string
// // // //  *               format: date
// // // //  *             ops_status:
// // // //  *               type: string
// // // //  *             so_status:
// // // //  *               type: string
// // // //  *             jobLocation:
// // // //  *               type: object
// // // //  *               properties:
// // // //  *                 job_location_id:
// // // //  *                   type: integer
// // // //  *                 job_location_name:
// // // //  *                   type: string
// // // //  *         resources:
// // // //  *           type: object
// // // //  *           description: Resources split into three separate arrays for individual display
// // // //  *           properties:
// // // //  *             equipment:
// // // //  *               type: array
// // // //  *               description: Each allocated equipment shown separately (one per item)
// // // //  *               items:
// // // //  *                 $ref: '#/components/schemas/EquipmentResource'
// // // //  *             manpower:
// // // //  *               type: array
// // // //  *               description: Each allocated manpower/employee shown separately (one per item)
// // // //  *               items:
// // // //  *                 $ref: '#/components/schemas/ManpowerResource'
// // // //  *             attachments:
// // // //  *               type: array
// // // //  *               description: Each allocated attachment shown separately (one per item)
// // // //  *               items:
// // // //  *                 $ref: '#/components/schemas/AttachmentResource'
// // // //  *             summary:
// // // //  *               $ref: '#/components/schemas/ResourcesSummary'
// // // //  *         scheduled_dates:
// // // //  *           type: object
// // // //  *           nullable: true
// // // //  *           properties:
// // // //  *             scheduled_date:
// // // //  *               type: string
// // // //  *               format: date
// // // //  *               description: Earliest scheduled_date across all resource types for this SO
// // // //  *
// // // //  *     PaginatedOrders:
// // // //  *       type: object
// // // //  *       properties:
// // // //  *         totalOrders:
// // // //  *           type: integer
// // // //  *         currentPage:
// // // //  *           type: integer
// // // //  *         totalPages:
// // // //  *           type: integer
// // // //  *         orders:
// // // //  *           type: array
// // // //  *           items:
// // // //  *             $ref: '#/components/schemas/AllocationOrder'
// // // //  *
// // // //  *     ShiftOrdersGroup:
// // // //  *       allOf:
// // // //  *         - $ref: '#/components/schemas/PaginatedOrders'
// // // //  *         - type: object
// // // //  *           properties:
// // // //  *             shiftType:
// // // //  *               type: string
// // // //  *               enum: [Day, Night]
// // // //  *             shiftDate:
// // // //  *               type: string
// // // //  *               format: date
// // // //  */

// // // // // ─── Shift Info ───────────────────────────────────────────────────────────────

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/shift-info:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get current and next shift information
// // // //  *     description: >
// // // //  *       Returns shift context based on server time.
// // // //  *       Day Shift = 06:00–17:59 | Night Shift = 18:00–05:59.
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: Shift info retrieved successfully
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               type: object
// // // //  *               properties:
// // // //  *                 serverTime:
// // // //  *                   type: string
// // // //  *                   format: date-time
// // // //  *                 currentShiftType:
// // // //  *                   type: string
// // // //  *                   enum: [Day, Night]
// // // //  *                 currentShiftDate:
// // // //  *                   type: string
// // // //  *                   format: date
// // // //  *                 nextShiftType:
// // // //  *                   type: string
// // // //  *                   enum: [Day, Night]
// // // //  *                 nextShiftDate:
// // // //  *                   type: string
// // // //  *                   format: date
// // // //  *                 futureAfterDate:
// // // //  *                   type: string
// // // //  *                   format: date
// // // //  *                 shiftWindows:
// // // //  *                   type: object
// // // //  *                   properties:
// // // //  *                     day:
// // // //  *                       type: string
// // // //  *                       example: "06:00 – 17:59"
// // // //  *                     night:
// // // //  *                       type: string
// // // //  *                       example: "18:00 – 05:59 (next day)"
// // // //  */
// // // // router.get("/shift-info", verifyToken, getShiftInfo);

// // // // // ─── Active Orders ────────────────────────────────────────────────────────────

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/active-orders:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get all active orders grouped (Current Shift + Next Shift + Future Orders)
// // // //  *     description: >
// // // //  *       Returns a combined response with all three active order categories in one call.
// // // //  *
// // // //  *       **Active Order Rules:**
// // // //  *       - Order must be allocated (status != Completed/Cancelled)
// // // //  *       - At least one resource (equipment / manpower / attachment) must be allocated
// // // //  *       - Current date must be >= scheduled_date AND <= lpo_end_date
// // // //  *
// // // //  *       **Resources are returned separately** under `resources.equipment`,
// // // //  *       `resources.manpower`, and `resources.attachments` — one item per resource —
// // // //  *       so the frontend can display each one individually.
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: All active orders retrieved successfully
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               type: object
// // // //  *               properties:
// // // //  *                 currentShift:
// // // //  *                   $ref: '#/components/schemas/ShiftOrdersGroup'
// // // //  *                 nextShift:
// // // //  *                   $ref: '#/components/schemas/ShiftOrdersGroup'
// // // //  *                 futureOrders:
// // // //  *                   type: object
// // // //  *                   properties:
// // // //  *                     totalOrders:
// // // //  *                       type: integer
// // // //  *                     orders:
// // // //  *                       type: array
// // // //  *                       items:
// // // //  *                         $ref: '#/components/schemas/AllocationOrder'
// // // //  *       500:
// // // //  *         description: Server error
// // // //  */
// // // // router.get("/active-orders", verifyToken, getAllActiveOrders);

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/active-orders/current-shift:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get Current Shift active orders
// // // //  *     description: >
// // // //  *       Returns allocations for the shift currently in progress based on server time.
// // // //  *
// // // //  *       - If time is 06:00–17:59 → returns Day shift orders for today
// // // //  *       - If time is 18:00–05:59 → returns Night shift orders for today
// // // //  *
// // // //  *       SO's shift field must match (Day / Night / Full / Day and Night).
// // // //  *       Each resource (equipment, manpower, attachment) is listed separately
// // // //  *       under `resources` for individual display.
// // // //  *     parameters:
// // // //  *       - in: query
// // // //  *         name: page
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 1
// // // //  *       - in: query
// // // //  *         name: limit
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 10
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: Current shift orders retrieved
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               $ref: '#/components/schemas/ShiftOrdersGroup'
// // // //  *       500:
// // // //  *         description: Server error
// // // //  */
// // // // router.get("/active-orders/current-shift", verifyToken, getCurrentShiftOrders);

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/active-orders/next-shift:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get Next Shift orders
// // // //  *     description: >
// // // //  *       Returns allocations for the shift immediately following the current one.
// // // //  *
// // // //  *       - Current = Day  → Next = Night (same date, starts 18:00)
// // // //  *       - Current = Night → Next = Day  (next calendar date, starts 06:00)
// // // //  *
// // // //  *       Each resource is listed separately for individual display.
// // // //  *     parameters:
// // // //  *       - in: query
// // // //  *         name: page
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 1
// // // //  *       - in: query
// // // //  *         name: limit
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 10
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: Next shift orders retrieved
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               $ref: '#/components/schemas/ShiftOrdersGroup'
// // // //  *       500:
// // // //  *         description: Server error
// // // //  */
// // // // router.get("/active-orders/next-shift", verifyToken, getNextShiftOrders);

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/active-orders/future-orders:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get Future Orders
// // // //  *     description: >
// // // //  *       Returns allocations scheduled after the next shift window.
// // // //  *       allocation_date must be strictly greater than the next shift date.
// // // //  *       LPO end date must still be valid (>= allocation_date).
// // // //  *
// // // //  *       Each resource is listed separately for individual display.
// // // //  *     parameters:
// // // //  *       - in: query
// // // //  *         name: page
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 1
// // // //  *       - in: query
// // // //  *         name: limit
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 10
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: Future orders retrieved
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               $ref: '#/components/schemas/PaginatedOrders'
// // // //  *       500:
// // // //  *         description: Server error
// // // //  */
// // // // router.get("/active-orders/future-orders", verifyToken, getFutureOrders);

// // // // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/completed-orders:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get all Completed Orders
// // // //  *     description: >
// // // //  *       Returns all allocations where status === "Completed".
// // // //  *       At least one resource must exist per allocation.
// // // //  *       Resources (equipment, manpower, attachments) are returned separately
// // // //  *       for individual display.
// // // //  *       Supports optional date range filtering.
// // // //  *     parameters:
// // // //  *       - in: query
// // // //  *         name: page
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 1
// // // //  *       - in: query
// // // //  *         name: limit
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *           default: 10
// // // //  *       - in: query
// // // //  *         name: from_date
// // // //  *         required: false
// // // //  *         schema:
// // // //  *           type: string
// // // //  *           format: date
// // // //  *         description: Filter from this date (YYYY-MM-DD)
// // // //  *       - in: query
// // // //  *         name: to_date
// // // //  *         required: false
// // // //  *         schema:
// // // //  *           type: string
// // // //  *           format: date
// // // //  *         description: Filter up to this date (YYYY-MM-DD)
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: Completed orders retrieved
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               $ref: '#/components/schemas/PaginatedOrders'
// // // //  *       500:
// // // //  *         description: Server error
// // // //  */
// // // // router.get("/completed-orders", verifyToken, getCompletedOrders);

// // // // // ─── Single & SO-level Lookup ─────────────────────────────────────────────────

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/orders/{id}:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get a single allocation order by allocation_id
// // // //  *     description: >
// // // //  *       Returns the full allocation record including all resources
// // // //  *       displayed separately (equipment / manpower / attachments).
// // // //  *     parameters:
// // // //  *       - in: path
// // // //  *         name: id
// // // //  *         required: true
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *         description: allocation_id from tbl_active_allocation_original
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: Allocation order retrieved
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               $ref: '#/components/schemas/AllocationOrder'
// // // //  *       404:
// // // //  *         description: Allocation record not found
// // // //  *       500:
// // // //  *         description: Server error
// // // //  */
// // // // router.get("/orders/:id", verifyToken, getOrderById);

// // // // /**
// // // //  * @swagger
// // // //  * /api/operational-handling/orders/by-sales-order/{so_id}:
// // // //  *   get:
// // // //  *     tags:
// // // //  *       - Operational Handling
// // // //  *     summary: Get all allocation orders for a specific Sales Order
// // // //  *     description: >
// // // //  *       Returns all allocation records linked to the given Sales Order ID.
// // // //  *       Each allocation's resources (equipment, manpower, attachments) are
// // // //  *       returned separately for individual display.
// // // //  *     parameters:
// // // //  *       - in: path
// // // //  *         name: so_id
// // // //  *         required: true
// // // //  *         schema:
// // // //  *           type: integer
// // // //  *         description: Sales Order ID
// // // //  *     responses:
// // // //  *       200:
// // // //  *         description: Allocations for the sales order retrieved
// // // //  *         content:
// // // //  *           application/json:
// // // //  *             schema:
// // // //  *               type: object
// // // //  *               properties:
// // // //  *                 so_id:
// // // //  *                   type: integer
// // // //  *                 totalAllocations:
// // // //  *                   type: integer
// // // //  *                 orders:
// // // //  *                   type: array
// // // //  *                   items:
// // // //  *                     $ref: '#/components/schemas/AllocationOrder'
// // // //  *       404:
// // // //  *         description: No allocations found for this sales order
// // // //  *       500:
// // // //  *         description: Server error
// // // //  */
// // // // router.get("/orders/by-sales-order/:so_id", verifyToken, getOrdersBySalesOrder);

// // // // module.exports = router;

// // // const express = require("express");
// // // const {
// // //   getShiftInfo,
// // //   getCurrentShiftOrders,
// // //   getNextShiftOrders,
// // //   getFutureOrders,
// // //   getAllActiveOrders,
// // //   getCompletedOrders,
// // //   getOrderById,
// // //   getOrdersBySalesOrder,
// // //   debugOrders,
// // // } = require("../../controllers/fleet-management/operationalHandlingController");
// // // const { verifyToken } = require("../../middleware/authMiddleware");

// // // const router = express.Router();

// // // // ─── Swagger Component Schemas ────────────────────────────────────────────────

// // // /**
// // //  * @swagger
// // //  * components:
// // //  *   schemas:
// // //  *
// // //  *     EquipmentResource:
// // //  *       type: object
// // //  *       description: One allocated equipment entry (displayed individually)
// // //  *       properties:
// // //  *         resource_type:
// // //  *           type: string
// // //  *           example: equipment
// // //  *         allocation_detail:
// // //  *           type: object
// // //  *           properties:
// // //  *             id:
// // //  *               type: integer
// // //  *             allocation_id:
// // //  *               type: integer
// // //  *             serial_number:
// // //  *               type: integer
// // //  *             eqt_stu:
// // //  *               type: string
// // //  *             status:
// // //  *               type: string
// // //  *             note:
// // //  *               type: string
// // //  *             is_selected:
// // //  *               type: boolean
// // //  *         equipment_info:
// // //  *           type: object
// // //  *           properties:
// // //  *             serial_number:
// // //  *               type: integer
// // //  *             reg_number:
// // //  *               type: string
// // //  *             vehicle_type:
// // //  *               type: string
// // //  *             equipment_status:
// // //  *               type: string
// // //  *             equipment_status_note:
// // //  *               type: string
// // //  *
// // //  *     ManpowerResource:
// // //  *       type: object
// // //  *       description: One allocated manpower entry (displayed individually)
// // //  *       properties:
// // //  *         resource_type:
// // //  *           type: string
// // //  *           example: manpower
// // //  *         allocation_detail:
// // //  *           type: object
// // //  *           properties:
// // //  *             id:
// // //  *               type: integer
// // //  *             allocation_id:
// // //  *               type: integer
// // //  *             employee_id:
// // //  *               type: integer
// // //  *             man_stu:
// // //  *               type: string
// // //  *             status:
// // //  *               type: string
// // //  *             note:
// // //  *               type: string
// // //  *             is_selected:
// // //  *               type: boolean
// // //  *         employee_info:
// // //  *           type: object
// // //  *           properties:
// // //  *             id:
// // //  *               type: integer
// // //  *             full_name:
// // //  *               type: string
// // //  *             employee_no:
// // //  *               type: string
// // //  *             manpower_status:
// // //  *               type: string
// // //  *
// // //  *     AttachmentResource:
// // //  *       type: object
// // //  *       description: One allocated attachment entry (displayed individually)
// // //  *       properties:
// // //  *         resource_type:
// // //  *           type: string
// // //  *           example: attachment
// // //  *         allocation_detail:
// // //  *           type: object
// // //  *           properties:
// // //  *             id:
// // //  *               type: integer
// // //  *             allocation_id:
// // //  *               type: integer
// // //  *             attachment_id:
// // //  *               type: integer
// // //  *             att_stu:
// // //  *               type: string
// // //  *             status:
// // //  *               type: string
// // //  *             note:
// // //  *               type: string
// // //  *             is_selected:
// // //  *               type: boolean
// // //  *         attachment_info:
// // //  *           type: object
// // //  *           properties:
// // //  *             attachment_id:
// // //  *               type: integer
// // //  *             attachment_number:
// // //  *               type: string
// // //  *             product_name:
// // //  *               type: string
// // //  *             serial_number:
// // //  *               type: string
// // //  *             attachment_status:
// // //  *               type: string
// // //  *
// // //  *     ResourcesSummary:
// // //  *       type: object
// // //  *       properties:
// // //  *         total_equipment:
// // //  *           type: integer
// // //  *         total_manpower:
// // //  *           type: integer
// // //  *         total_attachments:
// // //  *           type: integer
// // //  *         total_resources:
// // //  *           type: integer
// // //  *
// // //  *     AllocationOrder:
// // //  *       type: object
// // //  *       description: >
// // //  *         One allocation record with all three resource types returned
// // //  *         SEPARATELY so the frontend can display each resource individually.
// // //  *       properties:
// // //  *         allocation_id:
// // //  *           type: integer
// // //  *         allocation_date:
// // //  *           type: string
// // //  *           format: date
// // //  *         status:
// // //  *           type: string
// // //  *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
// // //  *         service_option:
// // //  *           type: string
// // //  *         user_remarks:
// // //  *           type: string
// // //  *         salesOrder:
// // //  *           type: object
// // //  *           properties:
// // //  *             id:
// // //  *               type: integer
// // //  *             so_number:
// // //  *               type: string
// // //  *             client:
// // //  *               type: string
// // //  *             project_name:
// // //  *               type: string
// // //  *             delivery_address:
// // //  *               type: string
// // //  *             shift:
// // //  *               type: string
// // //  *               enum: [Day, Night, Full, Day and Night]
// // //  *             lpo_number:
// // //  *               type: string
// // //  *             lpo_validity_date:
// // //  *               type: string
// // //  *               format: date
// // //  *             extended_lpo_validity_date:
// // //  *               type: string
// // //  *               format: date
// // //  *             expected_mobilization_date:
// // //  *               type: string
// // //  *               format: date
// // //  *             expected_demobilization_date:
// // //  *               type: string
// // //  *               format: date
// // //  *             ops_status:
// // //  *               type: string
// // //  *             so_status:
// // //  *               type: string
// // //  *             jobLocation:
// // //  *               type: object
// // //  *               properties:
// // //  *                 job_location_id:
// // //  *                   type: integer
// // //  *                 job_location_name:
// // //  *                   type: string
// // //  *         resources:
// // //  *           type: object
// // //  *           description: Resources split into three separate arrays for individual display
// // //  *           properties:
// // //  *             equipment:
// // //  *               type: array
// // //  *               description: Each allocated equipment shown separately (one per item)
// // //  *               items:
// // //  *                 $ref: '#/components/schemas/EquipmentResource'
// // //  *             manpower:
// // //  *               type: array
// // //  *               description: Each allocated manpower/employee shown separately (one per item)
// // //  *               items:
// // //  *                 $ref: '#/components/schemas/ManpowerResource'
// // //  *             attachments:
// // //  *               type: array
// // //  *               description: Each allocated attachment shown separately (one per item)
// // //  *               items:
// // //  *                 $ref: '#/components/schemas/AttachmentResource'
// // //  *             summary:
// // //  *               $ref: '#/components/schemas/ResourcesSummary'
// // //  *         scheduled_dates:
// // //  *           type: object
// // //  *           nullable: true
// // //  *           properties:
// // //  *             scheduled_date:
// // //  *               type: string
// // //  *               format: date
// // //  *               description: Earliest scheduled_date across all resource types for this SO
// // //  *
// // //  *     PaginatedOrders:
// // //  *       type: object
// // //  *       properties:
// // //  *         totalOrders:
// // //  *           type: integer
// // //  *         currentPage:
// // //  *           type: integer
// // //  *         totalPages:
// // //  *           type: integer
// // //  *         orders:
// // //  *           type: array
// // //  *           items:
// // //  *             $ref: '#/components/schemas/AllocationOrder'
// // //  *
// // //  *     ShiftOrdersGroup:
// // //  *       allOf:
// // //  *         - $ref: '#/components/schemas/PaginatedOrders'
// // //  *         - type: object
// // //  *           properties:
// // //  *             shiftType:
// // //  *               type: string
// // //  *               enum: [Day, Night]
// // //  *             shiftDate:
// // //  *               type: string
// // //  *               format: date
// // //  */

// // // // ─── Shift Info ───────────────────────────────────────────────────────────────

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/shift-info:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get current and next shift information
// // //  *     description: >
// // //  *       Returns shift context based on server time.
// // //  *       Day Shift = 06:00–17:59 | Night Shift = 18:00–05:59.
// // //  *     responses:
// // //  *       200:
// // //  *         description: Shift info retrieved successfully
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               type: object
// // //  *               properties:
// // //  *                 serverTime:
// // //  *                   type: string
// // //  *                   format: date-time
// // //  *                 currentShiftType:
// // //  *                   type: string
// // //  *                   enum: [Day, Night]
// // //  *                 currentShiftDate:
// // //  *                   type: string
// // //  *                   format: date
// // //  *                 nextShiftType:
// // //  *                   type: string
// // //  *                   enum: [Day, Night]
// // //  *                 nextShiftDate:
// // //  *                   type: string
// // //  *                   format: date
// // //  *                 futureAfterDate:
// // //  *                   type: string
// // //  *                   format: date
// // //  *                 shiftWindows:
// // //  *                   type: object
// // //  *                   properties:
// // //  *                     day:
// // //  *                       type: string
// // //  *                       example: "06:00 – 17:59"
// // //  *                     night:
// // //  *                       type: string
// // //  *                       example: "18:00 – 05:59 (next day)"
// // //  */
// // // router.get("/shift-info", verifyToken, getShiftInfo);

// // // // ─── Active Orders ────────────────────────────────────────────────────────────

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/active-orders:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get all active orders grouped (Current Shift + Next Shift + Future Orders)
// // //  *     description: >
// // //  *       Returns a combined response with all three active order categories in one call.
// // //  *
// // //  *       **Active Order Rules:**
// // //  *       - Order must be allocated (status != Completed/Cancelled)
// // //  *       - At least one resource (equipment / manpower / attachment) must be allocated
// // //  *       - Current date must be >= scheduled_date AND <= lpo_end_date
// // //  *
// // //  *       **Resources are returned separately** under `resources.equipment`,
// // //  *       `resources.manpower`, and `resources.attachments` — one item per resource —
// // //  *       so the frontend can display each one individually.
// // //  *     responses:
// // //  *       200:
// // //  *         description: All active orders retrieved successfully
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               type: object
// // //  *               properties:
// // //  *                 currentShift:
// // //  *                   $ref: '#/components/schemas/ShiftOrdersGroup'
// // //  *                 nextShift:
// // //  *                   $ref: '#/components/schemas/ShiftOrdersGroup'
// // //  *                 futureOrders:
// // //  *                   type: object
// // //  *                   properties:
// // //  *                     totalOrders:
// // //  *                       type: integer
// // //  *                     orders:
// // //  *                       type: array
// // //  *                       items:
// // //  *                         $ref: '#/components/schemas/AllocationOrder'
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/active-orders", verifyToken, getAllActiveOrders);

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/active-orders/current-shift:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get Current Shift active orders
// // //  *     description: >
// // //  *       Returns allocations for the shift currently in progress based on server time.
// // //  *
// // //  *       - If time is 06:00–17:59 → returns Day shift orders for today
// // //  *       - If time is 18:00–05:59 → returns Night shift orders for today
// // //  *
// // //  *       SO's shift field must match (Day / Night / Full / Day and Night).
// // //  *       Each resource (equipment, manpower, attachment) is listed separately
// // //  *       under `resources` for individual display.
// // //  *     parameters:
// // //  *       - in: query
// // //  *         name: page
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 1
// // //  *       - in: query
// // //  *         name: limit
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 10
// // //  *     responses:
// // //  *       200:
// // //  *         description: Current shift orders retrieved
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               $ref: '#/components/schemas/ShiftOrdersGroup'
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/active-orders/current-shift", verifyToken, getCurrentShiftOrders);

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/active-orders/next-shift:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get Next Shift orders
// // //  *     description: >
// // //  *       Returns allocations for the shift immediately following the current one.
// // //  *
// // //  *       - Current = Day  → Next = Night (same date, starts 18:00)
// // //  *       - Current = Night → Next = Day  (next calendar date, starts 06:00)
// // //  *
// // //  *       Each resource is listed separately for individual display.
// // //  *     parameters:
// // //  *       - in: query
// // //  *         name: page
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 1
// // //  *       - in: query
// // //  *         name: limit
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 10
// // //  *     responses:
// // //  *       200:
// // //  *         description: Next shift orders retrieved
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               $ref: '#/components/schemas/ShiftOrdersGroup'
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/active-orders/next-shift", verifyToken, getNextShiftOrders);

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/active-orders/future-orders:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get Future Orders
// // //  *     description: >
// // //  *       Returns allocations scheduled after the next shift window.
// // //  *       allocation_date must be strictly greater than the next shift date.
// // //  *       LPO end date must still be valid (>= allocation_date).
// // //  *
// // //  *       Each resource is listed separately for individual display.
// // //  *     parameters:
// // //  *       - in: query
// // //  *         name: page
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 1
// // //  *       - in: query
// // //  *         name: limit
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 10
// // //  *     responses:
// // //  *       200:
// // //  *         description: Future orders retrieved
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               $ref: '#/components/schemas/PaginatedOrders'
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/active-orders/future-orders", verifyToken, getFutureOrders);

// // // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/completed-orders:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get all Completed Orders
// // //  *     description: >
// // //  *       Returns all allocations where status === "Completed".
// // //  *       At least one resource must exist per allocation.
// // //  *       Resources (equipment, manpower, attachments) are returned separately
// // //  *       for individual display.
// // //  *       Supports optional date range filtering.
// // //  *     parameters:
// // //  *       - in: query
// // //  *         name: page
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 1
// // //  *       - in: query
// // //  *         name: limit
// // //  *         schema:
// // //  *           type: integer
// // //  *           default: 10
// // //  *       - in: query
// // //  *         name: from_date
// // //  *         required: false
// // //  *         schema:
// // //  *           type: string
// // //  *           format: date
// // //  *         description: Filter from this date (YYYY-MM-DD)
// // //  *       - in: query
// // //  *         name: to_date
// // //  *         required: false
// // //  *         schema:
// // //  *           type: string
// // //  *           format: date
// // //  *         description: Filter up to this date (YYYY-MM-DD)
// // //  *     responses:
// // //  *       200:
// // //  *         description: Completed orders retrieved
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               $ref: '#/components/schemas/PaginatedOrders'
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/completed-orders", verifyToken, getCompletedOrders);

// // // // ─── Single & SO-level Lookup ─────────────────────────────────────────────────

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/orders/{id}:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get a single allocation order by allocation_id
// // //  *     description: >
// // //  *       Returns the full allocation record including all resources
// // //  *       displayed separately (equipment / manpower / attachments).
// // //  *     parameters:
// // //  *       - in: path
// // //  *         name: id
// // //  *         required: true
// // //  *         schema:
// // //  *           type: integer
// // //  *         description: allocation_id from tbl_active_allocation_original
// // //  *     responses:
// // //  *       200:
// // //  *         description: Allocation order retrieved
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               $ref: '#/components/schemas/AllocationOrder'
// // //  *       404:
// // //  *         description: Allocation record not found
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/orders/:id", verifyToken, getOrderById);

// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/orders/by-sales-order/{so_id}:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling
// // //  *     summary: Get all allocation orders for a specific Sales Order
// // //  *     description: >
// // //  *       Returns all allocation records linked to the given Sales Order ID.
// // //  *       Each allocation's resources (equipment, manpower, attachments) are
// // //  *       returned separately for individual display.
// // //  *     parameters:
// // //  *       - in: path
// // //  *         name: so_id
// // //  *         required: true
// // //  *         schema:
// // //  *           type: integer
// // //  *         description: Sales Order ID
// // //  *     responses:
// // //  *       200:
// // //  *         description: Allocations for the sales order retrieved
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               type: object
// // //  *               properties:
// // //  *                 so_id:
// // //  *                   type: integer
// // //  *                 totalAllocations:
// // //  *                   type: integer
// // //  *                 orders:
// // //  *                   type: array
// // //  *                   items:
// // //  *                     $ref: '#/components/schemas/AllocationOrder'
// // //  *       404:
// // //  *         description: No allocations found for this sales order
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/orders/by-sales-order/:so_id", verifyToken, getOrdersBySalesOrder);

// // // // TEMP DEBUG ROUTE — remove before production
// // // /**
// // //  * @swagger
// // //  * /api/operational-handling/debug:
// // //  *   get:
// // //  *     tags:
// // //  *       - Operational Handling [DEBUG]
// // //  *     summary: "[TEMP] Debug all allocations with filter diagnostics"
// // //  *     description: >
// // //  *       **TEMPORARY endpoint — remove before production.**
// // //  *
// // //  *       Fetches ALL allocations from the database (no filters applied at DB level)
// // //  *       and returns a detailed diagnostic report per allocation showing exactly
// // //  *       which filter checks pass or fail. Useful for debugging why orders are
// // //  *       not appearing in current-shift / next-shift / future / completed responses.
// // //  *
// // //  *       Each allocation in the response includes a `checks` object with:
// // //  *       - `statusOk` — is the status not Completed/Cancelled?
// // //  *       - `salesOrderLoaded` — did the SO join succeed?
// // //  *       - `hasResources` — does this allocation have equipment/manpower/attachments?
// // //  *       - `matchesCurrentShift` / `matchesNextShift` — does SO shift field match?
// // //  *       - `allocationDateMatchesCurrentShift` / `allocationDateMatchesNextShift`
// // //  *       - `scheduledDate` — earliest scheduled_date found across resource scheduled tables
// // //  *       - `lpoEndDate` — resolved lpo end date (extended or standard)
// // //  *       - `activeWindowForCurrentShift` / `activeWindowForNextShift`
// // //  *       - `wouldAppearInCurrentShift` / `wouldAppearInNextShift` — final verdict
// // //  *     responses:
// // //  *       200:
// // //  *         description: Debug report for all allocations
// // //  *         content:
// // //  *           application/json:
// // //  *             schema:
// // //  *               type: object
// // //  *               properties:
// // //  *                 serverTime:
// // //  *                   type: string
// // //  *                   format: date-time
// // //  *                 shiftContext:
// // //  *                   type: object
// // //  *                   properties:
// // //  *                     currentShiftType:
// // //  *                       type: string
// // //  *                       enum: [Day, Night]
// // //  *                     currentShiftDate:
// // //  *                       type: string
// // //  *                       format: date
// // //  *                     nextShiftType:
// // //  *                       type: string
// // //  *                       enum: [Day, Night]
// // //  *                     nextShiftDate:
// // //  *                       type: string
// // //  *                       format: date
// // //  *                 totalAllocationsInDB:
// // //  *                   type: integer
// // //  *                 allocations:
// // //  *                   type: array
// // //  *                   items:
// // //  *                     type: object
// // //  *                     properties:
// // //  *                       allocation_id:
// // //  *                         type: integer
// // //  *                       allocation_date:
// // //  *                         type: string
// // //  *                         format: date
// // //  *                       status:
// // //  *                         type: string
// // //  *                       sales_order_id:
// // //  *                         type: integer
// // //  *                       salesOrder:
// // //  *                         type: object
// // //  *                         description: SO fields if join succeeded
// // //  *                       resourceCounts:
// // //  *                         type: object
// // //  *                         properties:
// // //  *                           equipment:
// // //  *                             type: integer
// // //  *                           manpower:
// // //  *                             type: integer
// // //  *                           attachments:
// // //  *                             type: integer
// // //  *                       checks:
// // //  *                         type: object
// // //  *                         description: Per-filter pass/fail diagnostics
// // //  *                         properties:
// // //  *                           statusOk:
// // //  *                             type: boolean
// // //  *                           salesOrderLoaded:
// // //  *                             type: boolean
// // //  *                           hasResources:
// // //  *                             type: boolean
// // //  *                           soShiftValue:
// // //  *                             type: string
// // //  *                           currentShiftType:
// // //  *                             type: string
// // //  *                           matchesCurrentShift:
// // //  *                             type: boolean
// // //  *                           matchesNextShift:
// // //  *                             type: boolean
// // //  *                           allocationDateMatchesCurrentShift:
// // //  *                             type: boolean
// // //  *                           allocationDateMatchesNextShift:
// // //  *                             type: boolean
// // //  *                           currentShiftDate:
// // //  *                             type: string
// // //  *                           nextShiftDate:
// // //  *                             type: string
// // //  *                           scheduledDate:
// // //  *                             type: string
// // //  *                             nullable: true
// // //  *                           lpoEndDate:
// // //  *                             type: string
// // //  *                             nullable: true
// // //  *                           effectiveStart:
// // //  *                             type: string
// // //  *                           activeWindowForCurrentShift:
// // //  *                             type: boolean
// // //  *                           activeWindowForNextShift:
// // //  *                             type: boolean
// // //  *                       wouldAppearInCurrentShift:
// // //  *                         type: boolean
// // //  *                       wouldAppearInNextShift:
// // //  *                         type: boolean
// // //  *       500:
// // //  *         description: Server error
// // //  */
// // // router.get("/debug", verifyToken, debugOrders);

// // // module.exports = router;

// // const express = require("express");
// // const {
// //   getShiftInfo,
// //   getCurrentShiftOrders,
// //   getNextShiftOrders,
// //   getFutureOrders,
// //   getAllActiveOrders,
// //   getCompletedOrders,
// //   getOrderById,
// //   getOrdersBySalesOrder,
// //   getAllFilterActiveOrders,
// //   getFilterCompletedOrders,
// //   debugOrders,
// // } = require("../../controllers/fleet-management/operationalHandlingController");
// // const { verifyToken } = require("../../middleware/authMiddleware");

// // const router = express.Router();

// // // ─── Swagger Component Schemas ────────────────────────────────────────────────

// // /**
// //  * @swagger
// //  * components:
// //  *   schemas:
// //  *
// //  *     EquipmentResource:
// //  *       type: object
// //  *       description: One allocated equipment entry (displayed individually)
// //  *       properties:
// //  *         resource_type:
// //  *           type: string
// //  *           example: equipment
// //  *         allocation_detail:
// //  *           type: object
// //  *           properties:
// //  *             id:
// //  *               type: integer
// //  *             allocation_id:
// //  *               type: integer
// //  *             serial_number:
// //  *               type: integer
// //  *             eqt_stu:
// //  *               type: string
// //  *             status:
// //  *               type: string
// //  *             note:
// //  *               type: string
// //  *               nullable: true
// //  *             is_selected:
// //  *               type: boolean
// //  *         equipment_info:
// //  *           type: object
// //  *           nullable: true
// //  *           properties:
// //  *             serial_number:
// //  *               type: integer
// //  *             reg_number:
// //  *               type: string
// //  *             vehicle_type:
// //  *               type: string
// //  *             equipment_status:
// //  *               type: string
// //  *             equipment_status_note:
// //  *               type: string
// //  *               nullable: true
// //  *
// //  *     ManpowerResource:
// //  *       type: object
// //  *       description: One allocated manpower entry (displayed individually)
// //  *       properties:
// //  *         resource_type:
// //  *           type: string
// //  *           example: manpower
// //  *         allocation_detail:
// //  *           type: object
// //  *           properties:
// //  *             id:
// //  *               type: integer
// //  *             allocation_id:
// //  *               type: integer
// //  *             employee_id:
// //  *               type: integer
// //  *             man_stu:
// //  *               type: string
// //  *             status:
// //  *               type: string
// //  *             note:
// //  *               type: string
// //  *               nullable: true
// //  *             is_selected:
// //  *               type: boolean
// //  *         employee_info:
// //  *           type: object
// //  *           nullable: true
// //  *           properties:
// //  *             id:
// //  *               type: integer
// //  *             full_name:
// //  *               type: string
// //  *               nullable: true
// //  *             employee_no:
// //  *               type: string
// //  *               nullable: true
// //  *             manpower_status:
// //  *               type: string
// //  *               nullable: true
// //  *             operator_type:
// //  *               type: string
// //  *               nullable: true
// //  *
// //  *     AttachmentResource:
// //  *       type: object
// //  *       description: One allocated attachment entry (displayed individually)
// //  *       properties:
// //  *         resource_type:
// //  *           type: string
// //  *           example: attachment
// //  *         allocation_detail:
// //  *           type: object
// //  *           properties:
// //  *             id:
// //  *               type: integer
// //  *             allocation_id:
// //  *               type: integer
// //  *             attachment_id:
// //  *               type: integer
// //  *             att_stu:
// //  *               type: string
// //  *             status:
// //  *               type: string
// //  *             note:
// //  *               type: string
// //  *               nullable: true
// //  *             is_selected:
// //  *               type: boolean
// //  *         attachment_info:
// //  *           type: object
// //  *           nullable: true
// //  *           properties:
// //  *             attachment_id:
// //  *               type: integer
// //  *             attachment_number:
// //  *               type: string
// //  *             product_name:
// //  *               type: string
// //  *             serial_number:
// //  *               type: string
// //  *             attachment_status:
// //  *               type: string
// //  *
// //  *     ResourcesSummary:
// //  *       type: object
// //  *       properties:
// //  *         total_equipment:
// //  *           type: integer
// //  *         total_manpower:
// //  *           type: integer
// //  *         total_attachments:
// //  *           type: integer
// //  *         total_resources:
// //  *           type: integer
// //  *
// //  *     AllocationSalesOrder:
// //  *       type: object
// //  *       description: Sales Order details nested inside an allocation
// //  *       properties:
// //  *         id:
// //  *           type: integer
// //  *         so_number:
// //  *           type: string
// //  *         client:
// //  *           type: string
// //  *         project_name:
// //  *           type: string
// //  *         delivery_address:
// //  *           type: string
// //  *         shift:
// //  *           type: string
// //  *           enum: [Day, Night, Full, Day and Night]
// //  *         lpo_number:
// //  *           type: string
// //  *           nullable: true
// //  *         lpo_validity_date:
// //  *           type: string
// //  *           format: date
// //  *           nullable: true
// //  *         extended_lpo_validity_date:
// //  *           type: string
// //  *           format: date
// //  *           nullable: true
// //  *         expected_mobilization_date:
// //  *           type: string
// //  *           format: date
// //  *           nullable: true
// //  *         expected_demobilization_date:
// //  *           type: string
// //  *           format: date
// //  *           nullable: true
// //  *         ops_status:
// //  *           type: string
// //  *           nullable: true
// //  *         so_status:
// //  *           type: string
// //  *           nullable: true
// //  *         jobLocation:
// //  *           type: object
// //  *           nullable: true
// //  *           properties:
// //  *             job_location_id:
// //  *               type: integer
// //  *             job_location_name:
// //  *               type: string
// //  *
// //  *     AllocationOrder:
// //  *       type: object
// //  *       description: >
// //  *         One full allocation record. Resources are split into three separate arrays
// //  *         (equipment / manpower / attachments) so the frontend can display each
// //  *         resource individually per tab. An allocation can appear in multiple tabs
// //  *         if it has resources of multiple types.
// //  *       properties:
// //  *         allocation_id:
// //  *           type: integer
// //  *         allocation_date:
// //  *           type: string
// //  *           format: date
// //  *         status:
// //  *           type: string
// //  *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
// //  *         service_option:
// //  *           type: string
// //  *           nullable: true
// //  *         user_remarks:
// //  *           type: string
// //  *           nullable: true
// //  *         salesOrder:
// //  *           $ref: '#/components/schemas/AllocationSalesOrder'
// //  *         resources:
// //  *           type: object
// //  *           description: Resources split into three separate arrays for individual display
// //  *           properties:
// //  *             equipment:
// //  *               type: array
// //  *               description: Each allocated equipment shown separately (one per item)
// //  *               items:
// //  *                 $ref: '#/components/schemas/EquipmentResource'
// //  *             manpower:
// //  *               type: array
// //  *               description: Each allocated manpower/employee shown separately (one per item)
// //  *               items:
// //  *                 $ref: '#/components/schemas/ManpowerResource'
// //  *             attachments:
// //  *               type: array
// //  *               description: Each allocated attachment shown separately (one per item)
// //  *               items:
// //  *                 $ref: '#/components/schemas/AttachmentResource'
// //  *             summary:
// //  *               $ref: '#/components/schemas/ResourcesSummary'
// //  *         scheduled_dates:
// //  *           type: object
// //  *           nullable: true
// //  *           description: Earliest scheduled date info for this allocation's SO
// //  *           properties:
// //  *             scheduled_date:
// //  *               type: string
// //  *               format: date
// //  *               nullable: true
// //  *               description: Earliest scheduled_date across all resource types for this SO
// //  *
// //  *     TabOrdersNoPage:
// //  *       type: object
// //  *       description: >
// //  *         Resource-type tab without per-tab pagination.
// //  *         Used inside getAllActiveOrders and getCompletedOrders combined responses.
// //  *         Every AllocationOrder in this list has at least one resource of that type.
// //  *       properties:
// //  *         totalOrders:
// //  *           type: integer
// //  *           description: Count of allocations in this tab
// //  *         orders:
// //  *           type: array
// //  *           items:
// //  *             $ref: '#/components/schemas/AllocationOrder'
// //  *
// //  *     TabOrders:
// //  *       type: object
// //  *       description: >
// //  *         Individually paginated resource-type tab.
// //  *         Used by filter endpoints where each tab has its own page/limit.
// //  *         Every AllocationOrder in this list has at least one resource of that type.
// //  *       properties:
// //  *         totalOrders:
// //  *           type: integer
// //  *         currentPage:
// //  *           type: integer
// //  *         totalPages:
// //  *           type: integer
// //  *         orders:
// //  *           type: array
// //  *           items:
// //  *             $ref: '#/components/schemas/AllocationOrder'
// //  *
// //  *     ShiftTabsGroup:
// //  *       type: object
// //  *       description: >
// //  *         One shift group (currentShift or nextShift) containing three
// //  *         non-paginated resource-type tabs.
// //  *         Returned by GET /active-orders combined endpoint.
// //  *       properties:
// //  *         shiftType:
// //  *           type: string
// //  *           enum: [Day, Night]
// //  *         shiftDate:
// //  *           type: string
// //  *           format: date
// //  *         totalOrders:
// //  *           type: integer
// //  *           description: Unique allocation count across all three tabs
// //  *         equipment:
// //  *           $ref: '#/components/schemas/TabOrdersNoPage'
// //  *         manpower:
// //  *           $ref: '#/components/schemas/TabOrdersNoPage'
// //  *         attachments:
// //  *           $ref: '#/components/schemas/TabOrdersNoPage'
// //  *
// //  *     FutureTabsGroup:
// //  *       type: object
// //  *       description: >
// //  *         Future orders group containing three non-paginated resource-type tabs.
// //  *         Returned by GET /active-orders combined endpoint.
// //  *       properties:
// //  *         totalOrders:
// //  *           type: integer
// //  *         equipment:
// //  *           $ref: '#/components/schemas/TabOrdersNoPage'
// //  *         manpower:
// //  *           $ref: '#/components/schemas/TabOrdersNoPage'
// //  *         attachments:
// //  *           $ref: '#/components/schemas/TabOrdersNoPage'
// //  *
// //  *     FilteredShiftTabsGroup:
// //  *       type: object
// //  *       description: >
// //  *         One shift group returned by the filter endpoint.
// //  *         Each resource-type tab is individually paginated.
// //  *       properties:
// //  *         shiftType:
// //  *           type: string
// //  *           enum: [Day, Night]
// //  *         shiftDate:
// //  *           type: string
// //  *           format: date
// //  *         equipment:
// //  *           $ref: '#/components/schemas/TabOrders'
// //  *         manpower:
// //  *           $ref: '#/components/schemas/TabOrders'
// //  *         attachments:
// //  *           $ref: '#/components/schemas/TabOrders'
// //  *
// //  *     FilteredFutureTabsGroup:
// //  *       type: object
// //  *       description: >
// //  *         Future orders returned by the filter endpoint.
// //  *         Each resource-type tab is individually paginated.
// //  *       properties:
// //  *         equipment:
// //  *           $ref: '#/components/schemas/TabOrders'
// //  *         manpower:
// //  *           $ref: '#/components/schemas/TabOrders'
// //  *         attachments:
// //  *           $ref: '#/components/schemas/TabOrders'
// //  *
// //  *     PaginatedOrders:
// //  *       type: object
// //  *       description: Legacy flat paginated list used by the individual shift endpoints.
// //  *       properties:
// //  *         totalOrders:
// //  *           type: integer
// //  *         currentPage:
// //  *           type: integer
// //  *         totalPages:
// //  *           type: integer
// //  *         orders:
// //  *           type: array
// //  *           items:
// //  *             $ref: '#/components/schemas/AllocationOrder'
// //  *
// //  *     ShiftOrdersGroup:
// //  *       allOf:
// //  *         - $ref: '#/components/schemas/PaginatedOrders'
// //  *         - type: object
// //  *           properties:
// //  *             shiftType:
// //  *               type: string
// //  *               enum: [Day, Night]
// //  *             shiftDate:
// //  *               type: string
// //  *               format: date
// //  *
// //  *     DebugAllocationChecks:
// //  *       type: object
// //  *       description: Per-filter pass/fail diagnostics for one allocation record
// //  *       properties:
// //  *         statusOk:
// //  *           type: boolean
// //  *           description: Is status not Completed/Cancelled?
// //  *         salesOrderLoaded:
// //  *           type: boolean
// //  *           description: Did the SO join succeed?
// //  *         hasResources:
// //  *           type: boolean
// //  *           description: Does this allocation have equipment/manpower/attachments?
// //  *         soShiftValue:
// //  *           type: string
// //  *           description: Raw shift value from the Sales Order
// //  *         currentShiftType:
// //  *           type: string
// //  *           description: Detected current shift type at time of request
// //  *         matchesCurrentShift:
// //  *           type: boolean
// //  *         matchesNextShift:
// //  *           type: boolean
// //  *         allocationDateMatchesCurrentShift:
// //  *           type: boolean
// //  *         allocationDateMatchesNextShift:
// //  *           type: boolean
// //  *         currentShiftDate:
// //  *           type: string
// //  *           format: date
// //  *         nextShiftDate:
// //  *           type: string
// //  *           format: date
// //  *         scheduledDate:
// //  *           type: string
// //  *           format: date
// //  *           nullable: true
// //  *           description: Earliest scheduled_date found across resource scheduled tables
// //  *         lpoEndDate:
// //  *           type: string
// //  *           format: date
// //  *           nullable: true
// //  *           description: Resolved LPO end date (extended or standard)
// //  *         effectiveStart:
// //  *           type: string
// //  *           format: date
// //  *           description: scheduledDate ?? allocationDate ?? referenceDate
// //  *         activeWindowForCurrentShift:
// //  *           type: boolean
// //  *           description: effectiveStart <= currentShiftDate AND lpoEndDate >= currentShiftDate
// //  *         activeWindowForNextShift:
// //  *           type: boolean
// //  *           description: effectiveStart <= nextShiftDate AND lpoEndDate >= nextShiftDate
// //  *
// //  *     DebugAllocationItem:
// //  *       type: object
// //  *       description: Full debug report entry for one allocation
// //  *       properties:
// //  *         allocation_id:
// //  *           type: integer
// //  *         allocation_date:
// //  *           type: string
// //  *           format: date
// //  *         status:
// //  *           type: string
// //  *         sales_order_id:
// //  *           type: integer
// //  *         salesOrder:
// //  *           type: object
// //  *           nullable: true
// //  *           description: Reduced SO fields if join succeeded
// //  *           properties:
// //  *             id:
// //  *               type: integer
// //  *             shift:
// //  *               type: string
// //  *             lpo_validity_date:
// //  *               type: string
// //  *               format: date
// //  *               nullable: true
// //  *             extended_lpo_validity_date:
// //  *               type: string
// //  *               format: date
// //  *               nullable: true
// //  *             ops_status:
// //  *               type: string
// //  *               nullable: true
// //  *             so_status:
// //  *               type: string
// //  *               nullable: true
// //  *         resourceCounts:
// //  *           type: object
// //  *           properties:
// //  *             equipment:
// //  *               type: integer
// //  *             manpower:
// //  *               type: integer
// //  *             attachments:
// //  *               type: integer
// //  *         checks:
// //  *           $ref: '#/components/schemas/DebugAllocationChecks'
// //  *         wouldAppearInCurrentShift:
// //  *           type: boolean
// //  *           description: Final verdict — would this appear in current shift results?
// //  *         wouldAppearInNextShift:
// //  *           type: boolean
// //  *           description: Final verdict — would this appear in next shift results?
// //  */

// // // ─── Shift Info ───────────────────────────────────────────────────────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/shift-info:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get current and next shift information
// //  *     description: >
// //  *       Returns shift context based on server time.
// //  *       Day Shift = 06:00–17:59 | Night Shift = 18:00–05:59.
// //  *     responses:
// //  *       200:
// //  *         description: Shift info retrieved successfully
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 serverTime:
// //  *                   type: string
// //  *                   format: date-time
// //  *                 currentShiftType:
// //  *                   type: string
// //  *                   enum: [Day, Night]
// //  *                 currentShiftDate:
// //  *                   type: string
// //  *                   format: date
// //  *                 nextShiftType:
// //  *                   type: string
// //  *                   enum: [Day, Night]
// //  *                 nextShiftDate:
// //  *                   type: string
// //  *                   format: date
// //  *                 futureAfterDate:
// //  *                   type: string
// //  *                   format: date
// //  *                 shiftWindows:
// //  *                   type: object
// //  *                   properties:
// //  *                     day:
// //  *                       type: string
// //  *                       example: "06:00 – 17:59"
// //  *                     night:
// //  *                       type: string
// //  *                       example: "18:00 – 05:59 (next day)"
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/shift-info", verifyToken, getShiftInfo);

// // // ─── Active Orders (combined – all shifts + future) ───────────────────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/active-orders:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get all active orders grouped by shift with resource-type tabs
// //  *     description: >
// //  *       Returns a single combined response with three shift groups:
// //  *       **currentShift**, **nextShift**, and **futureOrders**.
// //  *
// //  *       Each group contains three resource-type tabs:
// //  *       - `equipment`   — allocations that have ≥1 equipment resource
// //  *       - `manpower`    — allocations that have ≥1 manpower resource
// //  *       - `attachments` — allocations that have ≥1 attachment resource
// //  *
// //  *       An allocation can appear in multiple tabs if it has multiple resource types.
// //  *       Each tab entry is a full `AllocationOrder` object so the frontend has all
// //  *       SO details regardless of which tab is active.
// //  *
// //  *       **Active Order Rules:**
// //  *       - Status must NOT be Completed or Cancelled
// //  *       - At least one resource must exist
// //  *       - Allocation must be within its active window (scheduledDate → lpoEndDate)
// //  *     responses:
// //  *       200:
// //  *         description: All active orders retrieved successfully
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 currentShift:
// //  *                   $ref: '#/components/schemas/ShiftTabsGroup'
// //  *                 nextShift:
// //  *                   $ref: '#/components/schemas/ShiftTabsGroup'
// //  *                 futureOrders:
// //  *                   $ref: '#/components/schemas/FutureTabsGroup'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/active-orders", verifyToken, getAllActiveOrders);

// // // ─── Active Orders (individual shift endpoints – legacy flat list) ─────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/active-orders/current-shift:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get Current Shift active orders (flat paginated list)
// //  *     description: >
// //  *       Returns allocations for the shift currently in progress as a flat
// //  *       paginated list. Each allocation carries its resources split by type
// //  *       under `resources.equipment`, `resources.manpower`, `resources.attachments`.
// //  *
// //  *       - 06:00–17:59 → Day shift orders for today
// //  *       - 18:00–05:59 → Night shift orders for today
// //  *     parameters:
// //  *       - in: query
// //  *         name: page
// //  *         schema:
// //  *           type: integer
// //  *           default: 1
// //  *       - in: query
// //  *         name: limit
// //  *         schema:
// //  *           type: integer
// //  *           default: 10
// //  *     responses:
// //  *       200:
// //  *         description: Current shift orders retrieved
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               $ref: '#/components/schemas/ShiftOrdersGroup'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/active-orders/current-shift", verifyToken, getCurrentShiftOrders);

// // /**
// //  * @swagger
// //  * /api/operational-handling/active-orders/next-shift:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get Next Shift orders (flat paginated list)
// //  *     description: >
// //  *       Returns allocations for the shift immediately following the current one
// //  *       as a flat paginated list.
// //  *
// //  *       - Current = Day  → Next = Night (same date)
// //  *       - Current = Night → Next = Day (next calendar date)
// //  *     parameters:
// //  *       - in: query
// //  *         name: page
// //  *         schema:
// //  *           type: integer
// //  *           default: 1
// //  *       - in: query
// //  *         name: limit
// //  *         schema:
// //  *           type: integer
// //  *           default: 10
// //  *     responses:
// //  *       200:
// //  *         description: Next shift orders retrieved
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               $ref: '#/components/schemas/ShiftOrdersGroup'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/active-orders/next-shift", verifyToken, getNextShiftOrders);

// // /**
// //  * @swagger
// //  * /api/operational-handling/active-orders/future-orders:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get Future Orders (flat paginated list)
// //  *     description: >
// //  *       Returns allocations scheduled strictly after the next shift date.
// //  *       `allocation_date` must be > `nextShiftDate` and LPO end date must still be valid.
// //  *     parameters:
// //  *       - in: query
// //  *         name: page
// //  *         schema:
// //  *           type: integer
// //  *           default: 1
// //  *       - in: query
// //  *         name: limit
// //  *         schema:
// //  *           type: integer
// //  *           default: 10
// //  *     responses:
// //  *       200:
// //  *         description: Future orders retrieved
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               $ref: '#/components/schemas/PaginatedOrders'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/active-orders/future-orders", verifyToken, getFutureOrders);

// // // ─── Filter: Active Orders ────────────────────────────────────────────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/active-orders/filter:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Filter active orders with resource-type tabs per shift group
// //  *     description: >
// //  *       Filters active orders across **Current Shift**, **Next Shift**, and **Future Orders**.
// //  *       Returns three individually paginated resource-type tabs per shift group.
// //  *
// //  *       **SO-level filters** apply globally across all tabs:
// //  *       - `so_number` — partial match
// //  *       - `shift`     — exact match on SO shift field
// //  *       - `service_option` — exact match on allocation service_option
// //  *
// //  *       **Scheduled-date range** (`scheduled_date_from` / `scheduled_date_to`)
// //  *       filters out allocations whose earliest resolved `scheduled_date` falls
// //  *       outside the specified range.
// //  *
// //  *       **Resource-level filters** narrow a specific tab only:
// //  *       - `reg_number`        → **equipment** tab only (partial match on reg_number)
// //  *       - `employee_no`       → **manpower** tab only (partial match on employeeNo)
// //  *       - `attachment_number` → **attachments** tab only (partial match on attachment_number)
// //  *
// //  *       When a resource-level filter is active, only allocations containing a
// //  *       matching resource appear in that tab; the other tabs are unaffected.
// //  *
// //  *       Pagination (`page` / `limit`) is applied independently to each tab.
// //  *     parameters:
// //  *       - in: query
// //  *         name: so_number
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on Sales Order number
// //  *       - in: query
// //  *         name: service_option
// //  *         schema:
// //  *           type: string
// //  *         description: Exact match on allocation service_option field
// //  *       - in: query
// //  *         name: shift
// //  *         schema:
// //  *           type: string
// //  *           enum: [Day, Night, Full, "Day and Night"]
// //  *         description: Filter by SO shift type
// //  *       - in: query
// //  *         name: scheduled_date_from
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Earliest allowed scheduled_date (YYYY-MM-DD)
// //  *       - in: query
// //  *         name: scheduled_date_to
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Latest allowed scheduled_date (YYYY-MM-DD)
// //  *       - in: query
// //  *         name: reg_number
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on equipment reg_number — affects equipment tab only
// //  *       - in: query
// //  *         name: employee_no
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on employee number — affects manpower tab only
// //  *       - in: query
// //  *         name: attachment_number
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on attachment_number — affects attachments tab only
// //  *       - in: query
// //  *         name: page
// //  *         schema:
// //  *           type: integer
// //  *           default: 1
// //  *         description: Page number applied per tab
// //  *       - in: query
// //  *         name: limit
// //  *         schema:
// //  *           type: integer
// //  *           default: 10
// //  *         description: Items per page applied per tab
// //  *     responses:
// //  *       200:
// //  *         description: Filtered active orders with per-shift resource-type tabs
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 currentShift:
// //  *                   $ref: '#/components/schemas/FilteredShiftTabsGroup'
// //  *                 nextShift:
// //  *                   $ref: '#/components/schemas/FilteredShiftTabsGroup'
// //  *                 futureOrders:
// //  *                   $ref: '#/components/schemas/FilteredFutureTabsGroup'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/active-orders/filter", verifyToken, getAllFilterActiveOrders);

// // // ─── Completed Orders ─────────────────────────────────────────────────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/completed-orders:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get completed orders with resource-type tabs
// //  *     description: >
// //  *       Returns all allocations where `status === "Completed"`.
// //  *       Resources are split into three separate tabs so the frontend can display
// //  *       each resource type individually:
// //  *       - `equipment`   — allocations that have ≥1 equipment resource
// //  *       - `manpower`    — allocations that have ≥1 manpower resource
// //  *       - `attachments` — allocations that have ≥1 attachment resource
// //  *
// //  *       Supports optional `allocation_date` range filtering via `from_date` / `to_date`.
// //  *
// //  *       `totalOrders` / `currentPage` / `totalPages` refer to the DB-level
// //  *       paginated query; tab counts reflect how many allocations in the current
// //  *       page have that resource type.
// //  *     parameters:
// //  *       - in: query
// //  *         name: page
// //  *         schema:
// //  *           type: integer
// //  *           default: 1
// //  *       - in: query
// //  *         name: limit
// //  *         schema:
// //  *           type: integer
// //  *           default: 10
// //  *       - in: query
// //  *         name: from_date
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Filter allocation_date from this date (YYYY-MM-DD)
// //  *       - in: query
// //  *         name: to_date
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Filter allocation_date up to this date (YYYY-MM-DD)
// //  *     responses:
// //  *       200:
// //  *         description: Completed orders retrieved
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 totalOrders:
// //  *                   type: integer
// //  *                   description: Total DB count before tab split
// //  *                 currentPage:
// //  *                   type: integer
// //  *                 totalPages:
// //  *                   type: integer
// //  *                 equipment:
// //  *                   $ref: '#/components/schemas/TabOrdersNoPage'
// //  *                 manpower:
// //  *                   $ref: '#/components/schemas/TabOrdersNoPage'
// //  *                 attachments:
// //  *                   $ref: '#/components/schemas/TabOrdersNoPage'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/completed-orders", verifyToken, getCompletedOrders);

// // // ─── Filter: Completed Orders ─────────────────────────────────────────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/completed-orders/filter:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Filter completed orders with resource-type tabs
// //  *     description: >
// //  *       Filters completed allocations and returns three individually paginated
// //  *       resource-type tabs: **equipment**, **manpower**, **attachments**.
// //  *
// //  *       **SO-level filters** apply globally across all tabs:
// //  *       - `so_number`      — partial match
// //  *       - `shift`          — exact match on SO shift
// //  *       - `service_option` — exact match on allocation service_option
// //  *
// //  *       **Date range filters:**
// //  *       - `from_date` / `to_date`                     → `allocation_date` range
// //  *       - `scheduled_date_from` / `scheduled_date_to` → resolved `scheduled_date` range
// //  *
// //  *       **Resource-level filters** narrow a specific tab only:
// //  *       - `reg_number`        → **equipment** tab only
// //  *       - `employee_no`       → **manpower** tab only
// //  *       - `attachment_number` → **attachments** tab only
// //  *
// //  *       Pagination (`page` / `limit`) is applied independently to each tab.
// //  *     parameters:
// //  *       - in: query
// //  *         name: so_number
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on Sales Order number
// //  *       - in: query
// //  *         name: service_option
// //  *         schema:
// //  *           type: string
// //  *         description: Exact match on allocation service_option
// //  *       - in: query
// //  *         name: shift
// //  *         schema:
// //  *           type: string
// //  *           enum: [Day, Night, Full, "Day and Night"]
// //  *         description: Filter by SO shift type
// //  *       - in: query
// //  *         name: from_date
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Allocation date range start (YYYY-MM-DD)
// //  *       - in: query
// //  *         name: to_date
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Allocation date range end (YYYY-MM-DD)
// //  *       - in: query
// //  *         name: scheduled_date_from
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Scheduled date range start (YYYY-MM-DD)
// //  *       - in: query
// //  *         name: scheduled_date_to
// //  *         schema:
// //  *           type: string
// //  *           format: date
// //  *         description: Scheduled date range end (YYYY-MM-DD)
// //  *       - in: query
// //  *         name: reg_number
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on equipment reg_number — equipment tab only
// //  *       - in: query
// //  *         name: employee_no
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on employee number — manpower tab only
// //  *       - in: query
// //  *         name: attachment_number
// //  *         schema:
// //  *           type: string
// //  *         description: Partial match on attachment_number — attachments tab only
// //  *       - in: query
// //  *         name: page
// //  *         schema:
// //  *           type: integer
// //  *           default: 1
// //  *         description: Page number applied per tab
// //  *       - in: query
// //  *         name: limit
// //  *         schema:
// //  *           type: integer
// //  *           default: 10
// //  *         description: Items per page applied per tab
// //  *     responses:
// //  *       200:
// //  *         description: Filtered completed orders with resource-type tabs
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 equipment:
// //  *                   $ref: '#/components/schemas/TabOrders'
// //  *                 manpower:
// //  *                   $ref: '#/components/schemas/TabOrders'
// //  *                 attachments:
// //  *                   $ref: '#/components/schemas/TabOrders'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/completed-orders/filter", verifyToken, getFilterCompletedOrders);

// // // ─── Single & SO-level Lookup ─────────────────────────────────────────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/orders/{id}:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get a single allocation order by allocation_id
// //  *     description: >
// //  *       Returns the full allocation record including all resources
// //  *       displayed separately under `resources.equipment`, `resources.manpower`,
// //  *       and `resources.attachments`.
// //  *     parameters:
// //  *       - in: path
// //  *         name: id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *         description: allocation_id from tbl_active_allocation_original
// //  *     responses:
// //  *       200:
// //  *         description: Allocation order retrieved
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               $ref: '#/components/schemas/AllocationOrder'
// //  *       404:
// //  *         description: Allocation record not found
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/orders/:id", verifyToken, getOrderById);

// // /**
// //  * @swagger
// //  * /api/operational-handling/orders/by-sales-order/{so_id}:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling
// //  *     summary: Get all allocation orders for a specific Sales Order
// //  *     description: >
// //  *       Returns all allocation records linked to the given Sales Order ID.
// //  *       Each allocation's resources (equipment, manpower, attachments) are
// //  *       returned separately for individual display.
// //  *     parameters:
// //  *       - in: path
// //  *         name: so_id
// //  *         required: true
// //  *         schema:
// //  *           type: integer
// //  *         description: Sales Order ID
// //  *     responses:
// //  *       200:
// //  *         description: Allocations for the sales order retrieved
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 so_id:
// //  *                   type: integer
// //  *                 totalAllocations:
// //  *                   type: integer
// //  *                 orders:
// //  *                   type: array
// //  *                   items:
// //  *                     $ref: '#/components/schemas/AllocationOrder'
// //  *       404:
// //  *         description: No allocations found for this sales order
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/orders/by-sales-order/:so_id", verifyToken, getOrdersBySalesOrder);

// // // ─── Debug (TEMP — remove before production) ─────────────────────────────────

// // /**
// //  * @swagger
// //  * /api/operational-handling/debug:
// //  *   get:
// //  *     tags:
// //  *       - Operational Handling [DEBUG]
// //  *     summary: "[TEMP] Debug all allocations with filter diagnostics"
// //  *     description: >
// //  *       **TEMPORARY endpoint — remove before production.**
// //  *
// //  *       Fetches ALL allocations from the database (no filters applied at DB level)
// //  *       and returns a detailed diagnostic report per allocation showing exactly
// //  *       which filter checks pass or fail. Useful for debugging why orders are
// //  *       not appearing in current-shift / next-shift / future / completed responses.
// //  *
// //  *       Each allocation in the response includes a `checks` object with:
// //  *       - `statusOk`                          — is status not Completed/Cancelled?
// //  *       - `salesOrderLoaded`                  — did the SO join succeed?
// //  *       - `hasResources`                      — does this allocation have resources?
// //  *       - `matchesCurrentShift`               — does SO shift field match current shift?
// //  *       - `matchesNextShift`                  — does SO shift field match next shift?
// //  *       - `allocationDateMatchesCurrentShift` — allocation_date == currentShiftDate?
// //  *       - `allocationDateMatchesNextShift`    — allocation_date == nextShiftDate?
// //  *       - `scheduledDate`                     — earliest scheduled_date found
// //  *       - `lpoEndDate`                        — resolved LPO end date
// //  *       - `effectiveStart`                    — scheduledDate ?? allocationDate ?? referenceDate
// //  *       - `activeWindowForCurrentShift`       — within active window for current shift?
// //  *       - `activeWindowForNextShift`          — within active window for next shift?
// //  *       - `wouldAppearInCurrentShift`         — final pass/fail verdict
// //  *       - `wouldAppearInNextShift`            — final pass/fail verdict
// //  *     responses:
// //  *       200:
// //  *         description: Debug report for all allocations
// //  *         content:
// //  *           application/json:
// //  *             schema:
// //  *               type: object
// //  *               properties:
// //  *                 serverTime:
// //  *                   type: string
// //  *                   format: date-time
// //  *                 shiftContext:
// //  *                   type: object
// //  *                   properties:
// //  *                     currentShiftType:
// //  *                       type: string
// //  *                       enum: [Day, Night]
// //  *                     currentShiftDate:
// //  *                       type: string
// //  *                       format: date
// //  *                     nextShiftType:
// //  *                       type: string
// //  *                       enum: [Day, Night]
// //  *                     nextShiftDate:
// //  *                       type: string
// //  *                       format: date
// //  *                 totalAllocationsInDB:
// //  *                   type: integer
// //  *                 allocations:
// //  *                   type: array
// //  *                   items:
// //  *                     $ref: '#/components/schemas/DebugAllocationItem'
// //  *       500:
// //  *         description: Server error
// //  */
// // router.get("/debug", verifyToken, debugOrders);

// // module.exports = router;

// const express = require("express");
// const {
//   getShiftInfo,
//   getCurrentShiftOrders,
//   getNextShiftOrders,
//   getFutureOrders,
//   getAllActiveOrders,
//   getCompletedOrders,
//   getOrderById,
//   getOrdersBySalesOrder,
//   getAllFilterActiveOrders,
//   getFilterCompletedOrders,
//   debugOrders,
// } = require("../../controllers/fleet-management/operationalHandlingController");
// const { verifyToken } = require("../../middleware/authMiddleware");

// const router = express.Router();

// // ─── Swagger Component Schemas ────────────────────────────────────────────────

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *
//  *     # ── Resource-level item schemas ────────────────────────────────────────
//  *
//  *     EquipmentResource:
//  *       type: object
//  *       description: One allocated equipment entry (displayed individually)
//  *       properties:
//  *         resource_type:
//  *           type: string
//  *           example: equipment
//  *         allocation_detail:
//  *           type: object
//  *           properties:
//  *             id:
//  *               type: integer
//  *             allocation_id:
//  *               type: integer
//  *             serial_number:
//  *               type: integer
//  *             eqt_stu:
//  *               type: string
//  *             status:
//  *               type: string
//  *             note:
//  *               type: string
//  *               nullable: true
//  *             is_selected:
//  *               type: boolean
//  *         equipment_info:
//  *           type: object
//  *           nullable: true
//  *           properties:
//  *             serial_number:
//  *               type: integer
//  *             reg_number:
//  *               type: string
//  *             vehicle_type:
//  *               type: string
//  *             equipment_status:
//  *               type: string
//  *             equipment_status_note:
//  *               type: string
//  *               nullable: true
//  *
//  *     ManpowerResource:
//  *       type: object
//  *       description: One allocated manpower entry (displayed individually)
//  *       properties:
//  *         resource_type:
//  *           type: string
//  *           example: manpower
//  *         allocation_detail:
//  *           type: object
//  *           properties:
//  *             id:
//  *               type: integer
//  *             allocation_id:
//  *               type: integer
//  *             employee_id:
//  *               type: integer
//  *             man_stu:
//  *               type: string
//  *             status:
//  *               type: string
//  *             note:
//  *               type: string
//  *               nullable: true
//  *             is_selected:
//  *               type: boolean
//  *         employee_info:
//  *           type: object
//  *           nullable: true
//  *           properties:
//  *             id:
//  *               type: integer
//  *             full_name:
//  *               type: string
//  *               nullable: true
//  *             employee_no:
//  *               type: string
//  *               nullable: true
//  *             manpower_status:
//  *               type: string
//  *               nullable: true
//  *             operator_type:
//  *               type: string
//  *               nullable: true
//  *
//  *     AttachmentResource:
//  *       type: object
//  *       description: One allocated attachment entry (displayed individually)
//  *       properties:
//  *         resource_type:
//  *           type: string
//  *           example: attachment
//  *         allocation_detail:
//  *           type: object
//  *           properties:
//  *             id:
//  *               type: integer
//  *             allocation_id:
//  *               type: integer
//  *             attachment_id:
//  *               type: integer
//  *             att_stu:
//  *               type: string
//  *             status:
//  *               type: string
//  *             note:
//  *               type: string
//  *               nullable: true
//  *             is_selected:
//  *               type: boolean
//  *         attachment_info:
//  *           type: object
//  *           nullable: true
//  *           properties:
//  *             attachment_id:
//  *               type: integer
//  *             attachment_number:
//  *               type: string
//  *             product_name:
//  *               type: string
//  *             serial_number:
//  *               type: string
//  *             attachment_status:
//  *               type: string
//  *
//  *     ResourcesSummary:
//  *       type: object
//  *       properties:
//  *         total_equipment:
//  *           type: integer
//  *         total_manpower:
//  *           type: integer
//  *         total_attachments:
//  *           type: integer
//  *         total_resources:
//  *           type: integer
//  *
//  *     # ── Sales Order nested schema ───────────────────────────────────────────
//  *
//  *     AllocationSalesOrder:
//  *       type: object
//  *       description: Sales Order details nested inside an allocation
//  *       properties:
//  *         id:
//  *           type: integer
//  *         so_number:
//  *           type: string
//  *         client:
//  *           type: string
//  *         project_name:
//  *           type: string
//  *         delivery_address:
//  *           type: string
//  *         shift:
//  *           type: string
//  *           enum: [Day, Night, Full, Day and Night]
//  *         lpo_number:
//  *           type: string
//  *           nullable: true
//  *         lpo_validity_date:
//  *           type: string
//  *           format: date
//  *           nullable: true
//  *         extended_lpo_validity_date:
//  *           type: string
//  *           format: date
//  *           nullable: true
//  *         expected_mobilization_date:
//  *           type: string
//  *           format: date
//  *           nullable: true
//  *         expected_demobilization_date:
//  *           type: string
//  *           format: date
//  *           nullable: true
//  *         ops_status:
//  *           type: string
//  *           nullable: true
//  *         so_status:
//  *           type: string
//  *           nullable: true
//  *         jobLocation:
//  *           type: object
//  *           nullable: true
//  *           properties:
//  *             job_location_id:
//  *               type: integer
//  *             job_location_name:
//  *               type: string
//  *
//  *     # ── Full allocation order object ────────────────────────────────────────
//  *
//  *     AllocationOrder:
//  *       type: object
//  *       description: >
//  *         One full allocation record. resources.equipment / resources.manpower /
//  *         resources.attachments are separate arrays — one entry per allocated resource —
//  *         so the frontend can display each resource individually.
//  *       properties:
//  *         allocation_id:
//  *           type: integer
//  *         allocation_date:
//  *           type: string
//  *           format: date
//  *         status:
//  *           type: string
//  *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
//  *         service_option:
//  *           type: string
//  *           nullable: true
//  *         user_remarks:
//  *           type: string
//  *           nullable: true
//  *         salesOrder:
//  *           $ref: '#/components/schemas/AllocationSalesOrder'
//  *         scheduled_dates:
//  *           type: object
//  *           nullable: true
//  *           properties:
//  *             scheduled_date:
//  *               type: string
//  *               format: date
//  *               nullable: true
//  *
//  *     # ── Shift group (used inside resource sections) ─────────────────────────
//  *
//  *     ShiftGroup:
//  *       type: object
//  *       description: >
//  *         One shift period's orders inside a resource-type section.
//  *         All orders here have at least one resource of the parent section's type.
//  *       properties:
//  *         shiftType:
//  *           type: string
//  *           enum: [Day, Night]
//  *         shiftDate:
//  *           type: string
//  *           format: date
//  *         totalOrders:
//  *           type: integer
//  *         orders:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/AllocationOrder'
//  *
//  *     FutureGroup:
//  *       type: object
//  *       description: >
//  *         Future orders inside a resource-type section.
//  *         All orders here have at least one resource of the parent section's type.
//  *       properties:
//  *         totalOrders:
//  *           type: integer
//  *         orders:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/AllocationOrder'
//  *
//  *     FilteredShiftGroup:
//  *       type: object
//  *       description: >
//  *         Paginated shift period group returned by filter endpoints.
//  *       properties:
//  *         shiftType:
//  *           type: string
//  *           enum: [Day, Night]
//  *         shiftDate:
//  *           type: string
//  *           format: date
//  *         totalOrders:
//  *           type: integer
//  *         currentPage:
//  *           type: integer
//  *         totalPages:
//  *           type: integer
//  *         orders:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/AllocationOrder'
//  *
//  *     FilteredFutureGroup:
//  *       type: object
//  *       description: >
//  *         Paginated future orders group returned by filter endpoints.
//  *       properties:
//  *         totalOrders:
//  *           type: integer
//  *         currentPage:
//  *           type: integer
//  *         totalPages:
//  *           type: integer
//  *         orders:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/AllocationOrder'
//  *
//  *     # ── Resource-type section (active orders) ──────────────────────────────
//  *
//  *     ActiveResourceSection:
//  *       type: object
//  *       description: >
//  *         One resource-type section inside getAllActiveOrders response.
//  *         Contains currentShift, nextShift, and futureOrders sub-groups.
//  *       properties:
//  *         currentShift:
//  *           $ref: '#/components/schemas/ShiftGroup'
//  *         nextShift:
//  *           $ref: '#/components/schemas/ShiftGroup'
//  *         futureOrders:
//  *           $ref: '#/components/schemas/FutureGroup'
//  *
//  *     FilteredActiveResourceSection:
//  *       type: object
//  *       description: >
//  *         One resource-type section inside getAllFilterActiveOrders response.
//  *         Each shift group is individually paginated.
//  *       properties:
//  *         currentShift:
//  *           $ref: '#/components/schemas/FilteredShiftGroup'
//  *         nextShift:
//  *           $ref: '#/components/schemas/FilteredShiftGroup'
//  *         futureOrders:
//  *           $ref: '#/components/schemas/FilteredFutureGroup'
//  *
//  *     # ── Resource-type section (completed orders) ───────────────────────────
//  *
//  *     CompletedResourceSection:
//  *       type: object
//  *       description: >
//  *         One resource-type section inside getCompletedOrders response.
//  *         Contains paginated completed orders of that resource type.
//  *       properties:
//  *         totalOrders:
//  *           type: integer
//  *         currentPage:
//  *           type: integer
//  *         totalPages:
//  *           type: integer
//  *         orders:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/AllocationOrder'
//  *
//  *     # ── Legacy flat pagination (used by individual shift endpoints) ─────────
//  *
//  *     PaginatedOrders:
//  *       type: object
//  *       properties:
//  *         totalOrders:
//  *           type: integer
//  *         currentPage:
//  *           type: integer
//  *         totalPages:
//  *           type: integer
//  *         orders:
//  *           type: array
//  *           items:
//  *             $ref: '#/components/schemas/AllocationOrder'
//  *
//  *     ShiftOrdersGroup:
//  *       allOf:
//  *         - $ref: '#/components/schemas/PaginatedOrders'
//  *         - type: object
//  *           properties:
//  *             shiftType:
//  *               type: string
//  *               enum: [Day, Night]
//  *             shiftDate:
//  *               type: string
//  *               format: date
//  *
//  *     # ── Debug schemas ───────────────────────────────────────────────────────
//  *
//  *     DebugAllocationChecks:
//  *       type: object
//  *       description: Per-filter pass/fail diagnostics for one allocation
//  *       properties:
//  *         statusOk:
//  *           type: boolean
//  *         salesOrderLoaded:
//  *           type: boolean
//  *         hasResources:
//  *           type: boolean
//  *         soShiftValue:
//  *           type: string
//  *         currentShiftType:
//  *           type: string
//  *         matchesCurrentShift:
//  *           type: boolean
//  *         matchesNextShift:
//  *           type: boolean
//  *         allocationDateMatchesCurrentShift:
//  *           type: boolean
//  *         allocationDateMatchesNextShift:
//  *           type: boolean
//  *         currentShiftDate:
//  *           type: string
//  *           format: date
//  *         nextShiftDate:
//  *           type: string
//  *           format: date
//  *         scheduledDate:
//  *           type: string
//  *           format: date
//  *           nullable: true
//  *         lpoEndDate:
//  *           type: string
//  *           format: date
//  *           nullable: true
//  *         effectiveStart:
//  *           type: string
//  *           format: date
//  *         activeWindowForCurrentShift:
//  *           type: boolean
//  *         activeWindowForNextShift:
//  *           type: boolean
//  *
//  *     DebugAllocationItem:
//  *       type: object
//  *       properties:
//  *         allocation_id:
//  *           type: integer
//  *         allocation_date:
//  *           type: string
//  *           format: date
//  *         status:
//  *           type: string
//  *         sales_order_id:
//  *           type: integer
//  *         salesOrder:
//  *           type: object
//  *           nullable: true
//  *           properties:
//  *             id:
//  *               type: integer
//  *             shift:
//  *               type: string
//  *             lpo_validity_date:
//  *               type: string
//  *               format: date
//  *               nullable: true
//  *             extended_lpo_validity_date:
//  *               type: string
//  *               format: date
//  *               nullable: true
//  *             ops_status:
//  *               type: string
//  *               nullable: true
//  *             so_status:
//  *               type: string
//  *               nullable: true
//  *         resourceCounts:
//  *           type: object
//  *           properties:
//  *             equipment:
//  *               type: integer
//  *             manpower:
//  *               type: integer
//  *             attachments:
//  *               type: integer
//  *         checks:
//  *           $ref: '#/components/schemas/DebugAllocationChecks'
//  *         wouldAppearInCurrentShift:
//  *           type: boolean
//  *         wouldAppearInNextShift:
//  *           type: boolean
//  */

// // ─── Shift Info ───────────────────────────────────────────────────────────────

// /**
//  * @swagger
//  * /api/operational-handling/shift-info:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get current and next shift information
//  *     description: >
//  *       Returns shift context based on server time.
//  *       Day Shift = 06:00–17:59 | Night Shift = 18:00–05:59.
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Shift info retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 serverTime:
//  *                   type: string
//  *                   format: date-time
//  *                 currentShiftType:
//  *                   type: string
//  *                   enum: [Day, Night]
//  *                 currentShiftDate:
//  *                   type: string
//  *                   format: date
//  *                 nextShiftType:
//  *                   type: string
//  *                   enum: [Day, Night]
//  *                 nextShiftDate:
//  *                   type: string
//  *                   format: date
//  *                 futureAfterDate:
//  *                   type: string
//  *                   format: date
//  *                 shiftWindows:
//  *                   type: object
//  *                   properties:
//  *                     day:
//  *                       type: string
//  *                       example: "06:00 – 17:59"
//  *                     night:
//  *                       type: string
//  *                       example: "18:00 – 05:59 (next day)"
//  *       500:
//  *         description: Server error
//  */
// router.get("/shift-info", verifyToken, getShiftInfo);

// // ─── Active Orders – combined (resource-type first) ───────────────────────────

// /**
//  * @swagger
//  * /api/operational-handling/active-orders:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get all active orders — resource-type first, shift groups inside
//  *     description: >
//  *       Returns active orders grouped **by resource type first**, then by shift period inside each type.
//  *
//  *       **Response structure:**
//  *       ```
//  *       {
//  *         equipment: {
//  *           currentShift: { shiftType, shiftDate, totalOrders, orders: [...] },
//  *           nextShift:    { shiftType, shiftDate, totalOrders, orders: [...] },
//  *           futureOrders: { totalOrders, orders: [...] }
//  *         },
//  *         manpower: {
//  *           currentShift: { ... },
//  *           nextShift:    { ... },
//  *           futureOrders: { ... }
//  *         },
//  *         attachments: {
//  *           currentShift: { ... },
//  *           nextShift:    { ... },
//  *           futureOrders: { ... }
//  *         }
//  *       }
//  *       ```
//  *
//  *       An allocation appears in a section only if it has ≥1 resource of that type.
//  *       Each order is a full `AllocationOrder` object containing all SO details and
//  *       all three resource arrays so the frontend always has complete context.
//  *
//  *       **Active Order Rules:**
//  *       - Status must NOT be Completed or Cancelled
//  *       - At least one resource must exist
//  *       - Must be within active window (scheduledDate → lpoEndDate)
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: All active orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 equipment:
//  *                   $ref: '#/components/schemas/ActiveResourceSection'
//  *                 manpower:
//  *                   $ref: '#/components/schemas/ActiveResourceSection'
//  *                 attachments:
//  *                   $ref: '#/components/schemas/ActiveResourceSection'
//  *       500:
//  *         description: Server error
//  */
// router.get("/active-orders", verifyToken, getAllActiveOrders);

// // ─── Active Orders – individual shift endpoints (flat list) ───────────────────

// /**
//  * @swagger
//  * /api/operational-handling/active-orders/current-shift:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get Current Shift active orders (flat paginated list)
//  *     description: >
//  *       Returns allocations for the shift currently in progress as a flat list.
//  *       Resources in each order are split under resources.equipment / resources.manpower / resources.attachments.
//  *
//  *       - 06:00–17:59 → Day shift for today
//  *       - 18:00–05:59 → Night shift for today
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *     responses:
//  *       200:
//  *         description: Current shift orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ShiftOrdersGroup'
//  *       500:
//  *         description: Server error
//  */
// router.get("/active-orders/current-shift", verifyToken, getCurrentShiftOrders);

// /**
//  * @swagger
//  * /api/operational-handling/active-orders/next-shift:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get Next Shift orders (flat paginated list)
//  *     description: >
//  *       Returns allocations for the shift immediately following the current one.
//  *       - Current = Day  → Next = Night (same date)
//  *       - Current = Night → Next = Day (next calendar date)
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *     responses:
//  *       200:
//  *         description: Next shift orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ShiftOrdersGroup'
//  *       500:
//  *         description: Server error
//  */
// router.get("/active-orders/next-shift", verifyToken, getNextShiftOrders);

// /**
//  * @swagger
//  * /api/operational-handling/active-orders/future-orders:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get Future Orders (flat paginated list)
//  *     description: >
//  *       Returns allocations scheduled strictly after the next shift date.
//  *       allocation_date must be > nextShiftDate and LPO end date must still be valid.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *     responses:
//  *       200:
//  *         description: Future orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/PaginatedOrders'
//  *       500:
//  *         description: Server error
//  */
// router.get("/active-orders/future-orders", verifyToken, getFutureOrders);

// // ─── Filter: Active Orders ────────────────────────────────────────────────────

// /**
//  * @swagger
//  * /api/operational-handling/active-orders/filter:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Filter active orders — resource-type first, shift groups inside, per-section pagination
//  *     description: >
//  *       Same structure as `GET /active-orders` but with filters applied.
//  *       Each resource-type section (equipment / manpower / attachments) has its own
//  *       independently paginated shift groups.
//  *
//  *       **Response structure:**
//  *       ```
//  *       {
//  *         equipment: {
//  *           currentShift: { shiftType, shiftDate, totalOrders, currentPage, totalPages, orders: [...] },
//  *           nextShift:    { shiftType, shiftDate, totalOrders, currentPage, totalPages, orders: [...] },
//  *           futureOrders: { totalOrders, currentPage, totalPages, orders: [...] }
//  *         },
//  *         manpower:    { currentShift, nextShift, futureOrders },
//  *         attachments: { currentShift, nextShift, futureOrders }
//  *       }
//  *       ```
//  *
//  *       **SO-level filters** (apply to all three resource sections):
//  *       - `so_number`      — partial match on SO number
//  *       - `shift`          — exact match on SO shift field
//  *       - `service_option` — exact match on allocation service_option
//  *       - `scheduled_date_from` / `scheduled_date_to` — scheduled_date range filter
//  *
//  *       **Resource-level filters** (each narrows its own section only):
//  *       - `reg_number`        → **equipment** section only (partial match)
//  *       - `employee_no`       → **manpower** section only (partial match)
//  *       - `attachment_number` → **attachments** section only (partial match)
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: so_number
//  *         schema: { type: string }
//  *         description: Partial match on Sales Order number
//  *       - in: query
//  *         name: service_option
//  *         schema: { type: string }
//  *         description: Exact match on allocation service_option
//  *       - in: query
//  *         name: shift
//  *         schema: { type: string, enum: [Day, Night, Full, "Day and Night"] }
//  *         description: Filter by SO shift type
//  *       - in: query
//  *         name: scheduled_date_from
//  *         schema: { type: string, format: date }
//  *         description: Earliest allowed scheduled_date (YYYY-MM-DD)
//  *       - in: query
//  *         name: scheduled_date_to
//  *         schema: { type: string, format: date }
//  *         description: Latest allowed scheduled_date (YYYY-MM-DD)
//  *       - in: query
//  *         name: reg_number
//  *         schema: { type: string }
//  *         description: Partial match on equipment reg_number — equipment section only
//  *       - in: query
//  *         name: employee_no
//  *         schema: { type: string }
//  *         description: Partial match on employee number — manpower section only
//  *       - in: query
//  *         name: attachment_number
//  *         schema: { type: string }
//  *         description: Partial match on attachment_number — attachments section only
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *         description: Page number — applied independently per resource section
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *         description: Items per page — applied independently per resource section
//  *     responses:
//  *       200:
//  *         description: Filtered active orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 equipment:
//  *                   $ref: '#/components/schemas/FilteredActiveResourceSection'
//  *                 manpower:
//  *                   $ref: '#/components/schemas/FilteredActiveResourceSection'
//  *                 attachments:
//  *                   $ref: '#/components/schemas/FilteredActiveResourceSection'
//  *       500:
//  *         description: Server error
//  */
// router.get("/active-orders/filter", verifyToken, getAllFilterActiveOrders);

// // ─── Completed Orders ─────────────────────────────────────────────────────────

// /**
//  * @swagger
//  * /api/operational-handling/completed-orders:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get completed orders — resource-type first
//  *     description: >
//  *       Returns completed allocations grouped **by resource type**.
//  *
//  *       **Response structure:**
//  *       ```
//  *       {
//  *         equipment: {
//  *           totalOrders, currentPage, totalPages,
//  *           orders: [ ...AllocationOrder ]
//  *         },
//  *         manpower: {
//  *           totalOrders, currentPage, totalPages,
//  *           orders: [ ...AllocationOrder ]
//  *         },
//  *         attachments: {
//  *           totalOrders, currentPage, totalPages,
//  *           orders: [ ...AllocationOrder ]
//  *         }
//  *       }
//  *       ```
//  *
//  *       An order appears in a section only if it has ≥1 resource of that type.
//  *       Supports optional `allocation_date` range via `from_date` / `to_date`.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *       - in: query
//  *         name: from_date
//  *         schema: { type: string, format: date }
//  *         description: Filter allocation_date from (YYYY-MM-DD)
//  *       - in: query
//  *         name: to_date
//  *         schema: { type: string, format: date }
//  *         description: Filter allocation_date to (YYYY-MM-DD)
//  *     responses:
//  *       200:
//  *         description: Completed orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 equipment:
//  *                   $ref: '#/components/schemas/CompletedResourceSection'
//  *                 manpower:
//  *                   $ref: '#/components/schemas/CompletedResourceSection'
//  *                 attachments:
//  *                   $ref: '#/components/schemas/CompletedResourceSection'
//  *       500:
//  *         description: Server error
//  */
// router.get("/completed-orders", verifyToken, getCompletedOrders);

// // ─── Filter: Completed Orders ─────────────────────────────────────────────────

// /**
//  * @swagger
//  * /api/operational-handling/completed-orders/filter:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Filter completed orders — resource-type first, per-section pagination
//  *     description: >
//  *       Same structure as `GET /completed-orders` but with filters applied.
//  *       Each resource-type section is independently paginated.
//  *
//  *       **Response structure:**
//  *       ```
//  *       {
//  *         equipment:   { totalOrders, currentPage, totalPages, orders: [...] },
//  *         manpower:    { totalOrders, currentPage, totalPages, orders: [...] },
//  *         attachments: { totalOrders, currentPage, totalPages, orders: [...] }
//  *       }
//  *       ```
//  *
//  *       **SO-level filters** (apply to all three sections):
//  *       - `so_number`      — partial match on SO number
//  *       - `shift`          — exact match on SO shift field
//  *       - `service_option` — exact match on allocation service_option
//  *
//  *       **Date filters:**
//  *       - `from_date` / `to_date`                     — allocation_date range
//  *       - `scheduled_date_from` / `scheduled_date_to` — scheduled_date range
//  *
//  *       **Resource-level filters** (each narrows its own section only):
//  *       - `reg_number`        → **equipment** section only
//  *       - `employee_no`       → **manpower** section only
//  *       - `attachment_number` → **attachments** section only
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: so_number
//  *         schema: { type: string }
//  *         description: Partial match on Sales Order number
//  *       - in: query
//  *         name: service_option
//  *         schema: { type: string }
//  *         description: Exact match on allocation service_option
//  *       - in: query
//  *         name: shift
//  *         schema: { type: string, enum: [Day, Night, Full, "Day and Night"] }
//  *         description: Filter by SO shift type
//  *       - in: query
//  *         name: from_date
//  *         schema: { type: string, format: date }
//  *         description: Allocation date range start (YYYY-MM-DD)
//  *       - in: query
//  *         name: to_date
//  *         schema: { type: string, format: date }
//  *         description: Allocation date range end (YYYY-MM-DD)
//  *       - in: query
//  *         name: scheduled_date_from
//  *         schema: { type: string, format: date }
//  *         description: Scheduled date range start (YYYY-MM-DD)
//  *       - in: query
//  *         name: scheduled_date_to
//  *         schema: { type: string, format: date }
//  *         description: Scheduled date range end (YYYY-MM-DD)
//  *       - in: query
//  *         name: reg_number
//  *         schema: { type: string }
//  *         description: Partial match on equipment reg_number — equipment section only
//  *       - in: query
//  *         name: employee_no
//  *         schema: { type: string }
//  *         description: Partial match on employee number — manpower section only
//  *       - in: query
//  *         name: attachment_number
//  *         schema: { type: string }
//  *         description: Partial match on attachment_number — attachments section only
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *         description: Page number — applied independently per resource section
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *         description: Items per page — applied independently per resource section
//  *     responses:
//  *       200:
//  *         description: Filtered completed orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 equipment:
//  *                   $ref: '#/components/schemas/CompletedResourceSection'
//  *                 manpower:
//  *                   $ref: '#/components/schemas/CompletedResourceSection'
//  *                 attachments:
//  *                   $ref: '#/components/schemas/CompletedResourceSection'
//  *       500:
//  *         description: Server error
//  */
// router.get("/completed-orders/filter", verifyToken, getFilterCompletedOrders);

// // ─── Single & SO-level Lookup ─────────────────────────────────────────────────

// /**
//  * @swagger
//  * /api/operational-handling/orders/{id}:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get a single allocation order by allocation_id
//  *     description: >
//  *       Returns the full allocation record with resources split under
//  *       resources.equipment / resources.manpower / resources.attachments.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema: { type: integer }
//  *         description: allocation_id from tbl_active_allocation_original
//  *     responses:
//  *       200:
//  *         description: Allocation order retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/AllocationOrder'
//  *       404:
//  *         description: Allocation record not found
//  *       500:
//  *         description: Server error
//  */
// router.get("/orders/:id", verifyToken, getOrderById);

// /**
//  * @swagger
//  * /api/operational-handling/orders/by-sales-order/{so_id}:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get all allocation orders for a specific Sales Order
//  *     description: >
//  *       Returns all allocation records linked to the given Sales Order ID.
//  *       Each allocation's resources are returned separately for individual display.
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: so_id
//  *         required: true
//  *         schema: { type: integer }
//  *         description: Sales Order ID
//  *     responses:
//  *       200:
//  *         description: Allocations retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 so_id:
//  *                   type: integer
//  *                 totalAllocations:
//  *                   type: integer
//  *                 orders:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/AllocationOrder'
//  *       404:
//  *         description: No allocations found for this sales order
//  *       500:
//  *         description: Server error
//  */
// router.get("/orders/by-sales-order/:so_id", verifyToken, getOrdersBySalesOrder);

// // ─── Debug (TEMP — remove before production) ─────────────────────────────────

// /**
//  * @swagger
//  * /api/operational-handling/debug:
//  *   get:
//  *     tags:
//  *       - Operational Handling [DEBUG]
//  *     summary: "[TEMP] Debug all allocations with per-filter diagnostics"
//  *     description: >
//  *       **TEMPORARY endpoint — remove before production.**
//  *
//  *       Fetches ALL allocations from the database (no filters applied) and returns
//  *       a detailed per-allocation diagnostic report showing exactly which filter
//  *       checks pass or fail.
//  *
//  *       Each allocation entry includes:
//  *       - `checks` — boolean flags for every filter condition
//  *       - `wouldAppearInCurrentShift` — final verdict for current shift
//  *       - `wouldAppearInNextShift`    — final verdict for next shift
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Debug report for all allocations
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 serverTime:
//  *                   type: string
//  *                   format: date-time
//  *                 shiftContext:
//  *                   type: object
//  *                   properties:
//  *                     currentShiftType:
//  *                       type: string
//  *                       enum: [Day, Night]
//  *                     currentShiftDate:
//  *                       type: string
//  *                       format: date
//  *                     nextShiftType:
//  *                       type: string
//  *                       enum: [Day, Night]
//  *                     nextShiftDate:
//  *                       type: string
//  *                       format: date
//  *                 totalAllocationsInDB:
//  *                   type: integer
//  *                 allocations:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/DebugAllocationItem'
//  *       500:
//  *         description: Server error
//  */
// router.get("/debug", verifyToken, debugOrders);

// module.exports = router;
const express = require("express");
const {
  getShiftInfo,
  getCurrentShiftOrders,
  getNextShiftOrders,
  getFutureOrders,
  getAllActiveOrders,
  getCompletedOrders,
  getOrderById,
  getOrdersBySalesOrder,
  getAllFilterActiveOrders,
  getFilterCompletedOrders,
  debugOrders,
} = require("../../controllers/fleet-management/operationalHandlingController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

// ─── Swagger Component Schemas ────────────────────────────────────────────────

/**
 * @swagger
 * components:
 *   schemas:
 *
 *     # ── Shared nested schemas ──────────────────────────────────────────────
 *
 *     AllocationSalesOrder:
 *       type: object
 *       description: Sales Order details nested inside an allocation
 *       properties:
 *         id:
 *           type: integer
 *         so_number:
 *           type: string
 *         client:
 *           type: string
 *         project_name:
 *           type: string
 *         delivery_address:
 *           type: string
 *         shift:
 *           type: string
 *           enum: [Day, Night, Full, Day and Night]
 *         lpo_number:
 *           type: string
 *           nullable: true
 *         lpo_validity_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         extended_lpo_validity_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         expected_mobilization_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         expected_demobilization_date:
 *           type: string
 *           format: date
 *           nullable: true
 *         ops_status:
 *           type: string
 *           nullable: true
 *         so_status:
 *           type: string
 *           nullable: true
 *         jobLocation:
 *           type: object
 *           nullable: true
 *           properties:
 *             job_location_id:
 *               type: integer
 *             job_location_name:
 *               type: string
 *
 *     ScheduledDates:
 *       type: object
 *       nullable: true
 *       properties:
 *         scheduled_date:
 *           type: string
 *           format: date
 *           nullable: true
 *
 *     # ── Equipment item ──────────────────────────────────────────────────────
 *
 *     EquipmentItem:
 *       type: object
 *       description: One allocated equipment entry
 *       properties:
 *         serial_number:
 *           type: integer
 *         reg_number:
 *           type: string
 *           nullable: true
 *         vehicle_type:
 *           type: string
 *           nullable: true
 *         equipment_status:
 *           type: string
 *           nullable: true
 *         equipment_status_note:
 *           type: string
 *           nullable: true
 *         eqt_stu:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           nullable: true
 *         note:
 *           type: string
 *           nullable: true
 *         is_selected:
 *           type: boolean
 *           nullable: true
 *
 *     # ── Manpower item ───────────────────────────────────────────────────────
 *
 *     ManpowerItem:
 *       type: object
 *       description: One allocated manpower entry
 *       properties:
 *         employee_id:
 *           type: integer
 *         employee_no:
 *           type: string
 *           nullable: true
 *         full_name:
 *           type: string
 *           nullable: true
 *         manpower_status:
 *           type: string
 *           nullable: true
 *         operator_type:
 *           type: string
 *           nullable: true
 *         man_stu:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           nullable: true
 *         note:
 *           type: string
 *           nullable: true
 *         is_selected:
 *           type: boolean
 *           nullable: true
 *
 *     # ── Attachment item ─────────────────────────────────────────────────────
 *
 *     AttachmentItem:
 *       type: object
 *       description: One allocated attachment entry
 *       properties:
 *         attachment_id:
 *           type: integer
 *           nullable: true
 *         attachment_number:
 *           type: string
 *           nullable: true
 *         product_name:
 *           type: string
 *           nullable: true
 *         serial_number:
 *           type: string
 *           nullable: true
 *         attachment_status:
 *           type: string
 *           nullable: true
 *         att_stu:
 *           type: string
 *           nullable: true
 *         status:
 *           type: string
 *           nullable: true
 *         note:
 *           type: string
 *           nullable: true
 *         is_selected:
 *           type: boolean
 *           nullable: true
 *
 *     # ── Active order section shapes ─────────────────────────────────────────
 *
 *     EquipmentOrderInSection:
 *       type: object
 *       description: >
 *         Allocation order as it appears in the active **equipment** section.
 *         Contains scheduled_dates and equipment items.
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
 *         service_option:
 *           type: string
 *           nullable: true
 *         user_remarks:
 *           type: string
 *           nullable: true
 *         salesOrder:
 *           $ref: '#/components/schemas/AllocationSalesOrder'
 *         scheduled_dates:
 *           $ref: '#/components/schemas/ScheduledDates'
 *         equipment:
 *           type: object
 *           properties:
 *             reg_number:
 *               type: string
 *               nullable: true
 *               description: First allocated equipment reg_number (convenience field)
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EquipmentItem'
 *
 *     ManpowerOrderInSection:
 *       type: object
 *       description: >
 *         Allocation order as it appears in the active **manpower** section.
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
 *         service_option:
 *           type: string
 *           nullable: true
 *         user_remarks:
 *           type: string
 *           nullable: true
 *         salesOrder:
 *           $ref: '#/components/schemas/AllocationSalesOrder'
 *         scheduled_dates:
 *           $ref: '#/components/schemas/ScheduledDates'
 *         employee_no:
 *           type: string
 *           nullable: true
 *           description: First allocated employee number (convenience field)
 *         manpower:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ManpowerItem'
 *
 *     AttachmentOrderInSection:
 *       type: object
 *       description: >
 *         Allocation order as it appears in the active **attachments** section.
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
 *         service_option:
 *           type: string
 *           nullable: true
 *         user_remarks:
 *           type: string
 *           nullable: true
 *         salesOrder:
 *           $ref: '#/components/schemas/AllocationSalesOrder'
 *         scheduled_dates:
 *           $ref: '#/components/schemas/ScheduledDates'
 *         attachment_number:
 *           type: string
 *           nullable: true
 *           description: First allocated attachment number (convenience field)
 *         attachments:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttachmentItem'
 *
 *     # ── Completed order section shapes ──────────────────────────────────────
 *     # (scheduled_dates replaced by delivery_note_trip_date + off_hire_note_trip_date)
 *
 *     CompletedEquipmentOrderInSection:
 *       type: object
 *       description: >
 *         Allocation order as it appears in the completed **equipment** section.
 *         Contains delivery_note_trip_date and off_hire_note_trip_date instead of scheduled_dates.
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
 *         service_option:
 *           type: string
 *           nullable: true
 *         user_remarks:
 *           type: string
 *           nullable: true
 *         salesOrder:
 *           $ref: '#/components/schemas/AllocationSalesOrder'
 *         delivery_note_trip_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Earliest Delivery Note trip date for this allocation
 *         off_hire_note_trip_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Latest Off Hire Note trip date for this allocation
 *         equipment:
 *           type: object
 *           properties:
 *             reg_number:
 *               type: string
 *               nullable: true
 *               description: First allocated equipment reg_number (convenience field)
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EquipmentItem'
 *
 *     CompletedManpowerOrderInSection:
 *       type: object
 *       description: >
 *         Allocation order as it appears in the completed **manpower** section.
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
 *         service_option:
 *           type: string
 *           nullable: true
 *         user_remarks:
 *           type: string
 *           nullable: true
 *         salesOrder:
 *           $ref: '#/components/schemas/AllocationSalesOrder'
 *         delivery_note_trip_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Earliest Delivery Note trip date for this allocation
 *         off_hire_note_trip_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Latest Off Hire Note trip date for this allocation
 *         employee_no:
 *           type: string
 *           nullable: true
 *           description: First allocated employee number (convenience field)
 *         manpower:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ManpowerItem'
 *
 *     CompletedAttachmentOrderInSection:
 *       type: object
 *       description: >
 *         Allocation order as it appears in the completed **attachments** section.
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
 *         service_option:
 *           type: string
 *           nullable: true
 *         user_remarks:
 *           type: string
 *           nullable: true
 *         salesOrder:
 *           $ref: '#/components/schemas/AllocationSalesOrder'
 *         delivery_note_trip_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Earliest Delivery Note trip date for this allocation
 *         off_hire_note_trip_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Latest Off Hire Note trip date for this allocation
 *         attachment_number:
 *           type: string
 *           nullable: true
 *           description: First allocated attachment number (convenience field)
 *         attachments:
 *           type: object
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttachmentItem'
 *
 *     # ── Full allocation order (detail endpoints) ────────────────────────────
 *
 *     EquipmentResource:
 *       type: object
 *       properties:
 *         resource_type:
 *           type: string
 *           example: equipment
 *         allocation_detail:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             allocation_id:
 *               type: integer
 *             serial_number:
 *               type: integer
 *             eqt_stu:
 *               type: string
 *             status:
 *               type: string
 *             note:
 *               type: string
 *               nullable: true
 *             is_selected:
 *               type: boolean
 *         equipment_info:
 *           type: object
 *           nullable: true
 *           properties:
 *             serial_number:
 *               type: integer
 *             reg_number:
 *               type: string
 *             vehicle_type:
 *               type: string
 *             equipment_status:
 *               type: string
 *             equipment_status_note:
 *               type: string
 *               nullable: true
 *
 *     ManpowerResource:
 *       type: object
 *       properties:
 *         resource_type:
 *           type: string
 *           example: manpower
 *         allocation_detail:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             allocation_id:
 *               type: integer
 *             employee_id:
 *               type: integer
 *             man_stu:
 *               type: string
 *             status:
 *               type: string
 *             note:
 *               type: string
 *               nullable: true
 *             is_selected:
 *               type: boolean
 *         employee_info:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             full_name:
 *               type: string
 *               nullable: true
 *             employee_no:
 *               type: string
 *               nullable: true
 *             manpower_status:
 *               type: string
 *               nullable: true
 *             operator_type:
 *               type: string
 *               nullable: true
 *
 *     AttachmentResource:
 *       type: object
 *       properties:
 *         resource_type:
 *           type: string
 *           example: attachment
 *         allocation_detail:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             allocation_id:
 *               type: integer
 *             attachment_id:
 *               type: integer
 *             att_stu:
 *               type: string
 *             status:
 *               type: string
 *             note:
 *               type: string
 *               nullable: true
 *             is_selected:
 *               type: boolean
 *         attachment_info:
 *           type: object
 *           nullable: true
 *           properties:
 *             attachment_id:
 *               type: integer
 *             attachment_number:
 *               type: string
 *             product_name:
 *               type: string
 *             serial_number:
 *               type: string
 *             attachment_status:
 *               type: string
 *
 *     ResourcesSummary:
 *       type: object
 *       properties:
 *         total_equipment:
 *           type: integer
 *         total_manpower:
 *           type: integer
 *         total_attachments:
 *           type: integer
 *         total_resources:
 *           type: integer
 *
 *     AllocationOrder:
 *       type: object
 *       description: >
 *         Full allocation order returned by detail / flat-list endpoints.
 *         All three resource arrays are included under resources.
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *           enum: [Active, Delivery Note Created, Completed, Cancelled, Off Hire Note Created]
 *         service_option:
 *           type: string
 *           nullable: true
 *         user_remarks:
 *           type: string
 *           nullable: true
 *         salesOrder:
 *           $ref: '#/components/schemas/AllocationSalesOrder'
 *         resources:
 *           type: object
 *           properties:
 *             equipment:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EquipmentResource'
 *             manpower:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ManpowerResource'
 *             attachments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AttachmentResource'
 *             summary:
 *               $ref: '#/components/schemas/ResourcesSummary'
 *         scheduled_dates:
 *           $ref: '#/components/schemas/ScheduledDates'
 *
 *     # ── Active shift group schemas ───────────────────────────────────────────
 *
 *     EquipmentShiftGroup:
 *       type: object
 *       properties:
 *         shiftType:
 *           type: string
 *           enum: [Day, Night]
 *         shiftDate:
 *           type: string
 *           format: date
 *         totalOrders:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EquipmentOrderInSection'
 *
 *     ManpowerShiftGroup:
 *       type: object
 *       properties:
 *         shiftType:
 *           type: string
 *           enum: [Day, Night]
 *         shiftDate:
 *           type: string
 *           format: date
 *         totalOrders:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ManpowerOrderInSection'
 *
 *     AttachmentShiftGroup:
 *       type: object
 *       properties:
 *         shiftType:
 *           type: string
 *           enum: [Day, Night]
 *         shiftDate:
 *           type: string
 *           format: date
 *         totalOrders:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttachmentOrderInSection'
 *
 *     EquipmentFutureGroup:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EquipmentOrderInSection'
 *
 *     ManpowerFutureGroup:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ManpowerOrderInSection'
 *
 *     AttachmentFutureGroup:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttachmentOrderInSection'
 *
 *     # ── Filtered active shift group schemas ─────────────────────────────────
 *
 *     FilteredEquipmentShiftGroup:
 *       type: object
 *       properties:
 *         shiftType:
 *           type: string
 *           enum: [Day, Night]
 *         shiftDate:
 *           type: string
 *           format: date
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EquipmentOrderInSection'
 *
 *     FilteredManpowerShiftGroup:
 *       type: object
 *       properties:
 *         shiftType:
 *           type: string
 *           enum: [Day, Night]
 *         shiftDate:
 *           type: string
 *           format: date
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ManpowerOrderInSection'
 *
 *     FilteredAttachmentShiftGroup:
 *       type: object
 *       properties:
 *         shiftType:
 *           type: string
 *           enum: [Day, Night]
 *         shiftDate:
 *           type: string
 *           format: date
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttachmentOrderInSection'
 *
 *     FilteredEquipmentFutureGroup:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/EquipmentOrderInSection'
 *
 *     FilteredManpowerFutureGroup:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ManpowerOrderInSection'
 *
 *     FilteredAttachmentFutureGroup:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttachmentOrderInSection'
 *
 *     # ── Active resource section schemas ─────────────────────────────────────
 *
 *     ActiveEquipmentSection:
 *       type: object
 *       properties:
 *         currentShift:
 *           $ref: '#/components/schemas/EquipmentShiftGroup'
 *         nextShift:
 *           $ref: '#/components/schemas/EquipmentShiftGroup'
 *         futureOrders:
 *           $ref: '#/components/schemas/EquipmentFutureGroup'
 *
 *     ActiveManpowerSection:
 *       type: object
 *       properties:
 *         currentShift:
 *           $ref: '#/components/schemas/ManpowerShiftGroup'
 *         nextShift:
 *           $ref: '#/components/schemas/ManpowerShiftGroup'
 *         futureOrders:
 *           $ref: '#/components/schemas/ManpowerFutureGroup'
 *
 *     ActiveAttachmentSection:
 *       type: object
 *       properties:
 *         currentShift:
 *           $ref: '#/components/schemas/AttachmentShiftGroup'
 *         nextShift:
 *           $ref: '#/components/schemas/AttachmentShiftGroup'
 *         futureOrders:
 *           $ref: '#/components/schemas/AttachmentFutureGroup'
 *
 *     # ── Filtered active resource section schemas ─────────────────────────────
 *
 *     FilteredActiveEquipmentSection:
 *       type: object
 *       properties:
 *         currentShift:
 *           $ref: '#/components/schemas/FilteredEquipmentShiftGroup'
 *         nextShift:
 *           $ref: '#/components/schemas/FilteredEquipmentShiftGroup'
 *         futureOrders:
 *           $ref: '#/components/schemas/FilteredEquipmentFutureGroup'
 *
 *     FilteredActiveManpowerSection:
 *       type: object
 *       properties:
 *         currentShift:
 *           $ref: '#/components/schemas/FilteredManpowerShiftGroup'
 *         nextShift:
 *           $ref: '#/components/schemas/FilteredManpowerShiftGroup'
 *         futureOrders:
 *           $ref: '#/components/schemas/FilteredManpowerFutureGroup'
 *
 *     FilteredActiveAttachmentSection:
 *       type: object
 *       properties:
 *         currentShift:
 *           $ref: '#/components/schemas/FilteredAttachmentShiftGroup'
 *         nextShift:
 *           $ref: '#/components/schemas/FilteredAttachmentShiftGroup'
 *         futureOrders:
 *           $ref: '#/components/schemas/FilteredAttachmentFutureGroup'
 *
 *     # ── Completed resource section schemas ───────────────────────────────────
 *
 *     CompletedEquipmentSection:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompletedEquipmentOrderInSection'
 *
 *     CompletedManpowerSection:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompletedManpowerOrderInSection'
 *
 *     CompletedAttachmentSection:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CompletedAttachmentOrderInSection'
 *
 *     # ── Legacy flat pagination (individual shift endpoints) ─────────────────
 *
 *     PaginatedOrders:
 *       type: object
 *       properties:
 *         totalOrders:
 *           type: integer
 *         currentPage:
 *           type: integer
 *         totalPages:
 *           type: integer
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AllocationOrder'
 *
 *     ShiftOrdersGroup:
 *       allOf:
 *         - $ref: '#/components/schemas/PaginatedOrders'
 *         - type: object
 *           properties:
 *             shiftType:
 *               type: string
 *               enum: [Day, Night]
 *             shiftDate:
 *               type: string
 *               format: date
 *
 *     # ── Debug schemas ───────────────────────────────────────────────────────
 *
 *     DebugAllocationChecks:
 *       type: object
 *       properties:
 *         statusOk:
 *           type: boolean
 *         salesOrderLoaded:
 *           type: boolean
 *         hasResources:
 *           type: boolean
 *         soShiftValue:
 *           type: string
 *         currentShiftType:
 *           type: string
 *         matchesCurrentShift:
 *           type: boolean
 *         matchesNextShift:
 *           type: boolean
 *         allocationDateMatchesCurrentShift:
 *           type: boolean
 *         allocationDateMatchesNextShift:
 *           type: boolean
 *         currentShiftDate:
 *           type: string
 *           format: date
 *         nextShiftDate:
 *           type: string
 *           format: date
 *         scheduledDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         lpoEndDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         effectiveStart:
 *           type: string
 *           format: date
 *         activeWindowForCurrentShift:
 *           type: boolean
 *         activeWindowForNextShift:
 *           type: boolean
 *
 *     DebugAllocationItem:
 *       type: object
 *       properties:
 *         allocation_id:
 *           type: integer
 *         allocation_date:
 *           type: string
 *           format: date
 *         status:
 *           type: string
 *         sales_order_id:
 *           type: integer
 *         salesOrder:
 *           type: object
 *           nullable: true
 *           properties:
 *             id:
 *               type: integer
 *             shift:
 *               type: string
 *             lpo_validity_date:
 *               type: string
 *               format: date
 *               nullable: true
 *             extended_lpo_validity_date:
 *               type: string
 *               format: date
 *               nullable: true
 *             ops_status:
 *               type: string
 *               nullable: true
 *             so_status:
 *               type: string
 *               nullable: true
 *         resourceCounts:
 *           type: object
 *           properties:
 *             equipment:
 *               type: integer
 *             manpower:
 *               type: integer
 *             attachments:
 *               type: integer
 *         checks:
 *           $ref: '#/components/schemas/DebugAllocationChecks'
 *         wouldAppearInCurrentShift:
 *           type: boolean
 *         wouldAppearInNextShift:
 *           type: boolean
 */

// ─── Shift Info ───────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/operational-handling/shift-info:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get current and next shift information
 *     description: Returns shift context based on server time. Day = 06:00–17:59 | Night = 18:00–05:59.
 *     responses:
 *       200:
 *         description: Shift info retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serverTime:
 *                   type: string
 *                   format: date-time
 *                 currentShiftType:
 *                   type: string
 *                   enum: [Day, Night]
 *                 currentShiftDate:
 *                   type: string
 *                   format: date
 *                 nextShiftType:
 *                   type: string
 *                   enum: [Day, Night]
 *                 nextShiftDate:
 *                   type: string
 *                   format: date
 *                 futureAfterDate:
 *                   type: string
 *                   format: date
 *                 shiftWindows:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: string
 *                       example: "06:00 – 17:59"
 *                     night:
 *                       type: string
 *                       example: "18:00 – 05:59 (next day)"
 *       500:
 *         description: Server error
 */
router.get("/shift-info", verifyToken, getShiftInfo);

// ─── Active Orders – combined ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/operational-handling/active-orders:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get all active orders — resource-type first, shift groups inside
 *     description: >
 *       Returns active orders grouped **by resource type first**, then by shift period inside.
 *
 *       **Response structure:**
 *       ```
 *       {
 *         equipment: {
 *           currentShift: { shiftType, shiftDate, totalOrders, orders: [ EquipmentOrderInSection ] },
 *           nextShift:    { shiftType, shiftDate, totalOrders, orders: [ EquipmentOrderInSection ] },
 *           futureOrders: { totalOrders, orders: [ EquipmentOrderInSection ] }
 *         },
 *         manpower: {
 *           currentShift: { shiftType, shiftDate, totalOrders, orders: [ ManpowerOrderInSection ] },
 *           nextShift:    { ... },
 *           futureOrders: { ... }
 *         },
 *         attachments: {
 *           currentShift: { shiftType, shiftDate, totalOrders, orders: [ AttachmentOrderInSection ] },
 *           nextShift:    { ... },
 *           futureOrders: { ... }
 *         }
 *       }
 *       ```
 *
 *       **Per-section order shapes:**
 *       - **equipment orders** contain `equipment: { reg_number, items: [...] }`
 *       - **manpower orders** contain `employee_no` + `manpower: { items: [...] }`
 *       - **attachment orders** contain `attachment_number` + `attachments: { items: [...] }`
 *     responses:
 *       200:
 *         description: Active orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipment:
 *                   $ref: '#/components/schemas/ActiveEquipmentSection'
 *                 manpower:
 *                   $ref: '#/components/schemas/ActiveManpowerSection'
 *                 attachments:
 *                   $ref: '#/components/schemas/ActiveAttachmentSection'
 *       500:
 *         description: Server error
 */
router.get("/active-orders", verifyToken, getAllActiveOrders);

// ─── Active Orders – individual shift endpoints (flat list) ───────────────────

/**
 * @swagger
 * /api/operational-handling/active-orders/current-shift:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get Current Shift active orders (flat paginated list)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Current shift orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftOrdersGroup'
 *       500:
 *         description: Server error
 */
router.get("/active-orders/current-shift", verifyToken, getCurrentShiftOrders);

/**
 * @swagger
 * /api/operational-handling/active-orders/next-shift:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get Next Shift orders (flat paginated list)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Next shift orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShiftOrdersGroup'
 *       500:
 *         description: Server error
 */
router.get("/active-orders/next-shift", verifyToken, getNextShiftOrders);

/**
 * @swagger
 * /api/operational-handling/active-orders/future-orders:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get Future Orders (flat paginated list)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Future orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedOrders'
 *       500:
 *         description: Server error
 */
router.get("/active-orders/future-orders", verifyToken, getFutureOrders);

// ─── Filter: Active Orders ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/operational-handling/active-orders/filter:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Filter active orders — resource-type first, paginated shift groups
 *     description: >
 *       Same response structure as `GET /active-orders` but with filters and per-section pagination.
 *
 *       **SO-level filters** (applied to all three sections):
 *       - `so_number` — partial match
 *       - `shift`     — exact match on SO shift
 *       - `service_option` — exact match on allocation service_option
 *       - `scheduled_date_from` / `scheduled_date_to` — earliest scheduled_date range
 *
 *       **Resource-level filters** (each narrows its own section only):
 *       - `reg_number`        → **equipment** section only
 *       - `employee_no`       → **manpower** section only
 *       - `attachment_number` → **attachments** section only
 *     parameters:
 *       - in: query
 *         name: so_number
 *         schema: { type: string }
 *         description: Partial match on SO number
 *       - in: query
 *         name: service_option
 *         schema: { type: string }
 *         description: Exact match on allocation service_option
 *       - in: query
 *         name: shift
 *         schema: { type: string, enum: [Day, Night, Full, "Day and Night"] }
 *       - in: query
 *         name: scheduled_date_from
 *         schema: { type: string, format: date }
 *         description: Scheduled date range start (YYYY-MM-DD)
 *       - in: query
 *         name: scheduled_date_to
 *         schema: { type: string, format: date }
 *         description: Scheduled date range end (YYYY-MM-DD)
 *       - in: query
 *         name: reg_number
 *         schema: { type: string }
 *         description: Partial match on equipment reg_number — equipment section only
 *       - in: query
 *         name: employee_no
 *         schema: { type: string }
 *         description: Partial match on employee number — manpower section only
 *       - in: query
 *         name: attachment_number
 *         schema: { type: string }
 *         description: Partial match on attachment_number — attachments section only
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Applied independently per section
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Applied independently per section
 *     responses:
 *       200:
 *         description: Filtered active orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipment:
 *                   $ref: '#/components/schemas/FilteredActiveEquipmentSection'
 *                 manpower:
 *                   $ref: '#/components/schemas/FilteredActiveManpowerSection'
 *                 attachments:
 *                   $ref: '#/components/schemas/FilteredActiveAttachmentSection'
 *       500:
 *         description: Server error
 */
router.get("/active-orders/filter", verifyToken, getAllFilterActiveOrders);

// ─── Completed Orders ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/operational-handling/completed-orders:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get completed orders — resource-type first
 *     description: >
 *       Returns allocations where the Sales Order ops_status is "Completed".
 *       Date range filters use Delivery Note trip_date (from_date) and
 *       Off Hire Note trip_date (to_date).
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: from_date
 *         schema: { type: string, format: date }
 *         description: Filter by Delivery Note trip_date from (YYYY-MM-DD)
 *       - in: query
 *         name: to_date
 *         schema: { type: string, format: date }
 *         description: Filter by Off Hire Note trip_date to (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Completed orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipment:
 *                   $ref: '#/components/schemas/CompletedEquipmentSection'
 *                 manpower:
 *                   $ref: '#/components/schemas/CompletedManpowerSection'
 *                 attachments:
 *                   $ref: '#/components/schemas/CompletedAttachmentSection'
 *       500:
 *         description: Server error
 */
router.get("/completed-orders", verifyToken, getCompletedOrders);
// /**
//  * @swagger
//  * /api/operational-handling/completed-orders:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Get completed orders — resource-type first
//  *     description: >
//  *       Returns completed allocations grouped by resource type.
//  *
//  *       **Response structure:**
//  *       ```
//  *       {
//  *         equipment:   { totalOrders, currentPage, totalPages, orders: [ EquipmentOrderInSection ] },
//  *         manpower:    { totalOrders, currentPage, totalPages, orders: [ ManpowerOrderInSection ] },
//  *         attachments: { totalOrders, currentPage, totalPages, orders: [ AttachmentOrderInSection ] }
//  *       }
//  *       ```
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *       - in: query
//  *         name: from_date
//  *         schema: { type: string, format: date }
//  *         description: Filter allocation_date from (YYYY-MM-DD)
//  *       - in: query
//  *         name: to_date
//  *         schema: { type: string, format: date }
//  *         description: Filter allocation_date to (YYYY-MM-DD)
//  *     responses:
//  *       200:
//  *         description: Completed orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 equipment:
//  *                   $ref: '#/components/schemas/CompletedEquipmentSection'
//  *                 manpower:
//  *                   $ref: '#/components/schemas/CompletedManpowerSection'
//  *                 attachments:
//  *                   $ref: '#/components/schemas/CompletedAttachmentSection'
//  *       500:
//  *         description: Server error
//  */
// router.get("/completed-orders", verifyToken, getCompletedOrders);

// ─── Filter: Completed Orders ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/operational-handling/completed-orders/filter:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Filter completed orders — resource-type first, per-section pagination
 *     description: >
 *       Returns allocations where Sales Order ops_status is "Completed", with filters.
 *       Date range uses Delivery Note trip_date (from_date) and Off Hire Note trip_date (to_date).
 *
 *       **SO-level filters:** `so_number`, `shift`, `service_option`
 *
 *       **Date filters:**
 *       - `from_date` — Delivery Note trip_date from
 *       - `to_date`   — Off Hire Note trip_date to
 *
 *       **Resource-level filters:**
 *       - `reg_number`        → equipment section only
 *       - `employee_no`       → manpower section only
 *       - `attachment_number` → attachments section only
 *     parameters:
 *       - in: query
 *         name: so_number
 *         schema: { type: string }
 *       - in: query
 *         name: service_option
 *         schema: { type: string }
 *       - in: query
 *         name: shift
 *         schema: { type: string, enum: [Day, Night, Full, "Day and Night"] }
 *       - in: query
 *         name: from_date
 *         schema: { type: string, format: date }
 *         description: Delivery Note trip_date from (YYYY-MM-DD)
 *       - in: query
 *         name: to_date
 *         schema: { type: string, format: date }
 *         description: Off Hire Note trip_date to (YYYY-MM-DD)
 *       - in: query
 *         name: reg_number
 *         schema: { type: string }
 *         description: equipment section only
 *       - in: query
 *         name: employee_no
 *         schema: { type: string }
 *         description: manpower section only
 *       - in: query
 *         name: attachment_number
 *         schema: { type: string }
 *         description: attachments section only
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Filtered completed orders retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 equipment:
 *                   $ref: '#/components/schemas/CompletedEquipmentSection'
 *                 manpower:
 *                   $ref: '#/components/schemas/CompletedManpowerSection'
 *                 attachments:
 *                   $ref: '#/components/schemas/CompletedAttachmentSection'
 *       500:
 *         description: Server error
 */
router.get("/completed-orders/filter", verifyToken, getFilterCompletedOrders);
// /**
//  * @swagger
//  * /api/operational-handling/completed-orders/filter:
//  *   get:
//  *     tags:
//  *       - Operational Handling
//  *     summary: Filter completed orders — resource-type first, per-section pagination
//  *     description: >
//  *       Same response structure as `GET /completed-orders` but with filters.
//  *
//  *       **SO-level filters:** `so_number`, `shift`, `service_option`
//  *
//  *       **Date filters:**
//  *       - `from_date` / `to_date` — allocation_date range
//  *       - `scheduled_date_from` / `scheduled_date_to` — scheduled_date range
//  *
//  *       **Resource-level filters:**
//  *       - `reg_number`        → equipment section only
//  *       - `employee_no`       → manpower section only
//  *       - `attachment_number` → attachments section only
//  *     parameters:
//  *       - in: query
//  *         name: so_number
//  *         schema: { type: string }
//  *       - in: query
//  *         name: service_option
//  *         schema: { type: string }
//  *       - in: query
//  *         name: shift
//  *         schema: { type: string, enum: [Day, Night, Full, "Day and Night"] }
//  *       - in: query
//  *         name: from_date
//  *         schema: { type: string, format: date }
//  *         description: Allocation date from (YYYY-MM-DD)
//  *       - in: query
//  *         name: to_date
//  *         schema: { type: string, format: date }
//  *         description: Allocation date to (YYYY-MM-DD)
//  *       - in: query
//  *         name: scheduled_date_from
//  *         schema: { type: string, format: date }
//  *       - in: query
//  *         name: scheduled_date_to
//  *         schema: { type: string, format: date }
//  *       - in: query
//  *         name: reg_number
//  *         schema: { type: string }
//  *         description: equipment section only
//  *       - in: query
//  *         name: employee_no
//  *         schema: { type: string }
//  *         description: manpower section only
//  *       - in: query
//  *         name: attachment_number
//  *         schema: { type: string }
//  *         description: attachments section only
//  *       - in: query
//  *         name: page
//  *         schema: { type: integer, default: 1 }
//  *       - in: query
//  *         name: limit
//  *         schema: { type: integer, default: 10 }
//  *     responses:
//  *       200:
//  *         description: Filtered completed orders retrieved
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 equipment:
//  *                   $ref: '#/components/schemas/CompletedEquipmentSection'
//  *                 manpower:
//  *                   $ref: '#/components/schemas/CompletedManpowerSection'
//  *                 attachments:
//  *                   $ref: '#/components/schemas/CompletedAttachmentSection'
//  *       500:
//  *         description: Server error
//  */
// router.get("/completed-orders/filter", verifyToken, getFilterCompletedOrders);

// ─── Single & SO-level Lookup ─────────────────────────────────────────────────

/**
 * @swagger
 * /api/operational-handling/orders/{id}:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get a single allocation order by allocation_id (full detail)
 *     description: Returns the full AllocationOrder with all resources under resources.equipment / resources.manpower / resources.attachments.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Allocation retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllocationOrder'
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.get("/orders/:id", verifyToken, getOrderById);

/**
 * @swagger
 * /api/operational-handling/orders/by-sales-order/{so_id}:
 *   get:
 *     tags:
 *       - Operational Handling
 *     summary: Get all allocation orders for a specific Sales Order (full detail)
 *     parameters:
 *       - in: path
 *         name: so_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Allocations retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 so_id:
 *                   type: integer
 *                 totalAllocations:
 *                   type: integer
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AllocationOrder'
 *       404:
 *         description: No allocations found
 *       500:
 *         description: Server error
 */
router.get("/orders/by-sales-order/:so_id", verifyToken, getOrdersBySalesOrder);

// ─── Debug (TEMP — remove before production) ─────────────────────────────────

/**
 * @swagger
 * /api/operational-handling/debug:
 *   get:
 *     tags:
 *       - Operational Handling [DEBUG]
 *     summary: "[TEMP] Debug all allocations with per-filter diagnostics"
 *     description: >
 *       **TEMPORARY endpoint — remove before production.**
 *       Fetches ALL allocations with no filters and returns per-allocation
 *       diagnostic checks showing exactly why each order passes or fails
 *       each active-order filter condition.
 *     responses:
 *       200:
 *         description: Debug report
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serverTime:
 *                   type: string
 *                   format: date-time
 *                 shiftContext:
 *                   type: object
 *                   properties:
 *                     currentShiftType:
 *                       type: string
 *                       enum: [Day, Night]
 *                     currentShiftDate:
 *                       type: string
 *                       format: date
 *                     nextShiftType:
 *                       type: string
 *                       enum: [Day, Night]
 *                     nextShiftDate:
 *                       type: string
 *                       format: date
 *                 totalAllocationsInDB:
 *                   type: integer
 *                 allocations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DebugAllocationItem'
 *       500:
 *         description: Server error
 */
router.get("/debug", verifyToken, debugOrders);

module.exports = router;