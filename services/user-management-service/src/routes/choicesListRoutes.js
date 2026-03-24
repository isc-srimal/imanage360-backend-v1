const express = require('express');
const { getUserRolesList, getAllTextFieldTypeList } = require('../controllers/choicesListController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/choicesList/getUserRolesList:
 *   get:
 *     tags:
 *       - Choices List
 *     summary: Get user role List
 *     description: This endpoint allows to retrieve all the user roles list
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
 *         description: The number of user roles per page (default is 10)
 *     responses:
 *       200:
 *         description: user roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   role:
 *                     type: string
 *                     example: "user"
 *       500:
 *         description: Error retrieving user roles
 */
router.get('/getUserRolesList', verifyToken, getUserRolesList);

/**
 * @swagger
 * /api/choicesList/getAllTextFieldTypeList:
 *   get:
 *     tags:
 *       - Choices List
 *     summary: Get text field type list
 *     description: This endpoint allows to retrieve all the text field types list
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
 *         description: The number of text field types per page (default is 10)
 *     responses:
 *       200:
 *         description: Text field types retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTypes:
 *                   type: integer
 *                   example: 10
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 textFieldTypes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       type_name:
 *                         type: string
 *                         example: "text"
 *                       description:
 *                         type: string
 *                         example: "Simple text input field"
 *       500:
 *         description: Error retrieving text field types
 */
router.get('/getAllTextFieldTypeList', verifyToken, getAllTextFieldTypeList);

module.exports = router;