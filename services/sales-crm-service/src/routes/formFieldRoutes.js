const express = require('express');
const router = express.Router();
const formFieldController = require('../../controllers/crm/formFieldController');
const { verifyToken } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /api/crm/form-fields:
 *   post:
 *     tags:
 *       - Form Fields
 *     summary: Create a new form field
 *     description: Create a new form field in the CRM system.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               field_name:
 *                 type: string
 *               is_mandatory:
 *                 type: boolean
 *               is_hidden:
 *                 type: boolean
 *               label:
 *                 type: string
 *               placeholder_text:
 *                 type: string
 *               help_text:
 *                 type: string
 *               is_custom_field:
 *                 type: boolean
 *               forms_id:
 *                 type: integer
 *               forms_sales_pipeline_id:
 *                 type: integer
 *               text_field_type_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Form field created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', verifyToken, formFieldController.createFormField);

/**
 * @swagger
 * /api/crm/form-fields:
 *   get:
 *     tags:
 *       - Form Fields
 *     summary: Get all form fields
 *     description: Retrieve a list of all form fields.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of form fields
 *       400:
 *         description: Bad request
 */
router.get('/', verifyToken, formFieldController.getFormFields);

/**
 * @swagger
 * /api/crm/form-fields/{id}:
 *   get:
 *     tags:
 *       - Form Fields
 *     summary: Get a form field by ID
 *     description: Retrieve a form field by its ID.
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
 *         description: Form field retrieved successfully
 *       404:
 *         description: Form field not found
 */
router.get('/:id', verifyToken, formFieldController.getFormFieldById);

/**
 * @swagger
 * /api/crm/form-fields/{id}:
 *   put:
 *     tags:
 *       - Form Fields
 *     summary: Update a form field
 *     description: Update a form field by its ID.
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
 *               field_name:
 *                 type: string
 *               is_mandatory:
 *                 type: boolean
 *               is_hidden:
 *                 type: boolean
 *               label:
 *                 type: string
 *               placeholder_text:
 *                 type: string
 *               help_text:
 *                 type: string
 *               is_custom_field:
 *                 type: boolean
 *               forms_id:
 *                 type: integer
 *               forms_sales_pipeline_id:
 *                 type: integer
 *               text_field_type_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Form field updated successfully
 *       404:
 *         description: Form field not found
 */
router.put('/:id', verifyToken, formFieldController.updateFormField);

/**
 * @swagger
 * /api/crm/form-fields/{id}:
 *   delete:
 *     tags:
 *       - Form Fields
 *     summary: Delete a form field
 *     description: Delete a form field by its ID.
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
 *         description: Form field deleted successfully
 *       404:
 *         description: Form field not found
 */
router.delete('/:id', verifyToken, formFieldController.deleteFormField);

module.exports = router;