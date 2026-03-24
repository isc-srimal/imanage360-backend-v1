const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { verifyToken } = require('../../../../api-gateway/src/middleware/authMiddleware');

/**
 * @swagger
 * /api/crm/leads/download:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Download all leads as a CSV file
 *     description: Exports all leads from the database into a CSV file for download.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 *       404:
 *         description: No leads found
 *       500:
 *         description: Server error
 */
router.get('/download', verifyToken, leadController.downloadLeadsCSV);

/**
 * @swagger
 * /api/crm/leads:
 *   post:
 *     tags:
 *       - Leads
 *     summary: Create a new lead
 *     description: Create a new lead in the CRM system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               designation:
 *                 type: string
 *               lead_subject:
 *                 type: string
 *               additional_desc:
 *                 type: string
 *               label_id:
 *                 type: string
 *               custom_field:
 *                 type: string
 *               sales_pipeline_id:
 *                 type: integer
 *               pipeline_stages_id:
 *                 type: integer
 *               prospect_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Lead created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', verifyToken, leadController.createLead);


/**
 * @swagger
 * /api/crm/leads:
 *   post:
 *     tags:
 *       - Leads
 *     summary: Create a new lead
 *     description: Create a new lead in the CRM system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               designation:
 *                 type: string
 *               lead_subject:
 *                 type: string
 *               additional_desc:
 *                 type: string
 *               label_id:
 *                 type: string
 *               custom_field:
 *                 type: string
 *               sales_pipeline_id:
 *                 type: integer
 *               pipeline_stages_id:
 *                 type: integer
 *               prospect_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Lead created successfully
 *       400:
 *         description: Bad request
 */
router.post('/create-form-lead', leadController.createLead);

/**
 * @swagger
 * /api/crm/leads:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get all leads
 *     description: Retrieve a list of all leads.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of leads
 *       400:
 *         description: Bad request
 */
router.get('/', verifyToken, leadController.getLeads);

/**
 * @swagger
 * /api/crm/leads/{id}:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get a lead by ID
 *     description: Retrieve a lead by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lead retrieved successfully
 *       404:
 *         description: Lead not found
 */
router.get('/:id', verifyToken, leadController.getLeadById);

/**
 * @swagger
 * /api/crm/leads/{id}:
 *   put:
 *     tags:
 *       - Leads
 *     summary: Update a lead
 *     description: Update a lead by its ID.
 *     security:
 *       - bearerAuth: []
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
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               designation:
 *                 type: string
 *               lead_subject:
 *                 type: string
 *               additional_desc:
 *                 type: string
 *               label_id:
 *                 type: string
 *               custom_field:
 *                 type: string
 *               sales_pipeline_id:
 *                 type: integer
 *               pipeline_stages_id:
 *                 type: integer
 *               prospect_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *       404:
 *         description: Lead not found
 */
router.put('/:id', verifyToken, leadController.updateLead);

/**
 * @swagger
 * /api/crm/leads/{id}:
 *   delete:
 *     tags:
 *       - Leads
 *     summary: Delete a lead
 *     description: Delete a lead by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Lead deleted successfully
 *       404:
 *         description: Lead not found
 */
router.delete('/:id', verifyToken, leadController.deleteLead);

/**
 * @swagger
 * /api/crm/leads/summary:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get leads summary statistics
 *     description: Retrieve summary statistics for leads including new, scheduled, overdue, and closed counts.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pipeline_id
 *         schema:
 *           type: integer
 *         description: Filter by specific pipeline ID
 *     responses:
 *       200:
 *         description: Summary statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newLeads:
 *                   type: integer
 *                   description: Number of leads created in the last 7 days
 *                 scheduledLeads:
 *                   type: integer
 *                   description: Number of leads in active stages
 *                 overdue:
 *                   type: integer
 *                   description: Number of overdue leads
 *                 closed:
 *                   type: integer
 *                   description: Number of closed deals
 *       400:
 *         description: Bad request
 */
router.get('/summary', verifyToken, leadController.getLeadsSummary);

/**
 * @swagger
 * /api/crm/leads/employees-filter:
 *   get:
 *     tags:
 *       - Leads
 *     summary: Get employees for lead filtering
 *     description: Retrieve list of employees who are assigned to leads for filtering purposes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *       400:
 *         description: Bad request
 */
router.get('/employees-filter', verifyToken, leadController.getEmployeesForFilter);

module.exports = router;