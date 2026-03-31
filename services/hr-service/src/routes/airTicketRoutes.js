const express = require("express");
const {
  createAirTicket,
  updateAirTickets,
  deleteAirTicket,
  getAirTicketById,
  getAllAirTickets,
  filterAirTickets,
  exportFilteredAirTicketsToCSV,
  exportFilteredAirTicketsToPDF,
} = require("../controllers/airTicketController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/air/createAirTicket:
 *   post:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Create a new air ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinationCountry:
 *                 type: string
 *               adultPackageAmount:
 *                 type: decimal
 *               infantAmount:
 *                 type: decimal
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Air ticket created successfully
 *       500:
 *         description: Error creating air ticket
 */
router.post("/createAirTicket", verifyToken, createAirTicket);

/**
 * @swagger
 * /api/air/updateAirTicket/{id}:
 *   put:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Update an existing air ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the air ticket to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destinationCountry:
 *                 type: string
 *               adultPackageAmount:
 *                 type: decimal
 *               infantAmount:
 *                 type: decimal
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Air ticket updated successfully
 *       404:
 *         description: Air ticket not found
 *       500:
 *         description: Error updating air ticket
 */
router.put("/updateAirTicket/:id", verifyToken, updateAirTickets);

/**
 * @swagger
 * /api/air/deleteAirTicket/{id}:
 *   delete:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Delete an air ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the air ticket to delete
 *     responses:
 *       200:
 *         description: Air ticket deleted successfully
 *       404:
 *         description: Air ticket not found
 *       500:
 *         description: Error deleting air ticket
 */
router.delete("/deleteAirTicket/:id", verifyToken, deleteAirTicket);

/**
 * @swagger
 * /api/air/airTicket/{id}:
 *   get:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Get a single air ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the air ticket
 *     responses:
 *       200:
 *         description: Air ticket retrieved successfully
 *       404:
 *         description: Air ticket not found
 */
router.get("/airTicket/:id", verifyToken, getAirTicketById);

/**
 * @swagger
 * /api/air/airTickets:
 *   get:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Get all air tickets with pagination
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
 *         description: Air tickets retrieved successfully
 *       500:
 *         description: Error retrieving air tickets
 */
router.get("/airTickets", verifyToken, getAllAirTickets);

/**
 * @swagger
 * /api/air/filterAirTickets:
 *   get:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Filter air tickets by status
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
 *         description: Filtered air tickets retrieved successfully
 *       500:
 *         description: Error filtering air tickets
 */
router.get("/filterAirTickets", verifyToken, filterAirTickets);

/**
 * @swagger
 * /api/air/exportFilteredAirTicketsToCSV:
 *   get:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Export filtered air tickets to CSV
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
router.get("/exportFilteredAirTicketsToCSV", verifyToken, exportFilteredAirTicketsToCSV);

/**
 * @swagger
 * /api/air/exportFilteredAirTicketsToPDF:
 *   get:
 *     tags:
 *       - Manage Air Tickets
 *     summary: Export filtered air tickets to PDF
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
router.get("/exportFilteredAirTicketsToPDF", verifyToken, exportFilteredAirTicketsToPDF);

module.exports = router;
