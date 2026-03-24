const express = require('express');
const router = express.Router();
const formController = require('../../controllers/crm/formController');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /api/crm/forms:
 *   post:
 *     tags:
 *       - Forms
 *     summary: Create a new form
 *     description: Create a new form in the CRM system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               submit_message:
 *                 type: string
 *               reply_to_email:
 *                 type: string
 *               email_template_id:
 *                 type: string
 *               lead_assignee:
 *                 type: string
 *               form_unique_id:
 *                 type: string
 *               redirect_link:
 *                 type: string
 *               url_label:
 *                 type: string
 *               theme:
 *                 type: string
 *               show_reference_branding:
 *                 type: string
 *               form_status:
 *                 type: string
 *               is_published:
 *                 type: boolean
 *               created_by:
 *                 type: string
 *               sales_pipeline_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Form created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', verifyToken, formController.createForm);

/**
 * @swagger
 * /api/crm/forms:
 *   get:
 *     tags:
 *       - Forms
 *     summary: Get all forms
 *     description: Retrieve a list of all forms.
 *     responses:
 *       200:
 *         description: A list of forms
 *       400:
 *         description: Bad request
 */
router.get('/', verifyToken, formController.getForms);

/**
 * @swagger
 * /api/crm/forms/{id}:
 *   get:
 *     tags:
 *       - Forms
 *     summary: Get a form by ID
 *     description: Retrieve a form by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Form retrieved successfully
 *       404:
 *         description: Form not found
 */
router.get('/:id', verifyToken, formController.getFormById);

/**
 * @swagger
 * /api/crm/forms/{id}:
 *   put:
 *     tags:
 *       - Forms
 *     summary: Update a form
 *     description: Update a form by its ID.
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
 *               logo:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               name:
 *                 type: string
 *               submit_message:
 *                 type: string
 *               reply_to_email:
 *                 type: string
 *               email_template_id:
 *                 type: string
 *               lead_assignee:
 *                 type: string
 *               form_unique_id:
 *                 type: string
 *               redirect_link:
 *                 type: string
 *               url_label:
 *                 type: string
 *               theme:
 *                 type: string
 *               show_reference_branding:
 *                 type: string
 *               form_status:
 *                 type: string
 *               is_published:
 *                 type: boolean
 *               created_by:
 *                 type: string
 *               sales_pipeline_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Form updated successfully
 *       404:
 *         description: Form not found
 */
router.put('/:id', verifyToken, formController.updateForm);

/**
 * @swagger
 * /api/crm/forms/{id}:
 *   delete:
 *     tags:
 *       - Forms
 *     summary: Delete a form
 *     description: Delete a form by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Form deleted successfully
 *       404:
 *         description: Form not found
 */
router.delete('/:id', verifyToken, formController.deleteForm);

// /**
//  * @swagger
//  * /api/crm/forms/redirect/{redirect_link}:
//  *   get:
//  *     tags:
//  *       - Forms
//  *     summary: Get a form by redirect link
//  *     description: Retrieve a form and its fields by its redirect link. Public endpoint - no authentication required.
//  *     parameters:
//  *       - in: path
//  *         name: redirect_link
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The redirect link of the form
//  *     responses:
//  *       200:
//  *         description: Form retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 id:
//  *                   type: integer
//  *                 title:
//  *                   type: string
//  *                 description:
//  *                   type: string
//  *                 formFields:
//  *                   type: array
//  *                   items:
//  *                     type: object
//  *                     properties:
//  *                       id:
//  *                         type: integer
//  *                       textFieldType:
//  *                         type: object
//  *                         properties:
//  *                           type_name:
//  *                             type: string
//  *                           type_value:
//  *                             type: string
//  *       404:
//  *         description: Form not found
//  *       400:
//  *         description: Bad request
//  */
// router.get('/redirect/:redirect_link', formController.getFormByRedirectLink);

/**
 * @swagger
 * /api/crm/forms/public/{form_unique_id}:
 *   get:
 *     tags:
 *       - Forms
 *     summary: Get a published form by form_unique_id
 *     description: Retrieve a published form and its fields by its unique ID. Public endpoint - no authentication required.
 *     parameters:
 *       - in: path
 *         name: form_unique_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the form
 *     responses:
 *       200:
 *         description: Form retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 formFields:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       textFieldType:
 *                         type: object
 *                         properties:
 *                           type_name:
 *                             type: string
 *                           type_value:
 *                             type: string
 *       404:
 *         description: Form not found or not published
 *       400:
 *         description: Bad request
 */
router.get('/public/:form_unique_id', formController.getFormByFormUniqueId);

module.exports = router;