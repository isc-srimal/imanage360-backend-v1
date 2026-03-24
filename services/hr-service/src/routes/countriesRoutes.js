const express = require("express");
const {
    getCountryById,
    getAllCountries,
} = require("../../controllers/hr/countriesController");
const { verifyToken } = require("../../middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/countries/country/{id}:
 *   get:
 *     tags:
 *       - Country List
 *     summary: Get a single country by ID
 *     description: This endpoint allows to retrieve a specific country by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the country to retrieve
 *     responses:
 *       200:
 *         description: Country retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     country_code:
 *                       type: string
 *                     country_enName:
 *                       type: string
 *                     country_arName:
 *                       type: string
 *                     country_enNationality:
 *                       type: string
 *                     country_arNationality:
 *                       type: string
 *       404:
 *         description: Country not found
 */
router.get("/country/:id", verifyToken, getCountryById);

/**
 * @swagger
 * /api/countries/countrieslist:
 *   get:
 *     tags:
 *       - Country List
 *     summary: Get all countries with pagination
 *     description: This endpoint allows to retrieve all countries in the system with pagination.
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
 *           default: 247
 *         description: The number of countries per page (default is 247)
 *     responses:
 *       200:
 *         description: Countries retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                     id:
 *                       type: integer
 *                     country_code:
 *                       type: string
 *                     country_enName:
 *                       type: string
 *                     country_arName:
 *                       type: string
 *                     country_enNationality:
 *                       type: string
 *                     country_arNationality:
 *                       type: string
 *       500:
 *         description: Error retrieving countries
 */
router.get("/countrieslist", verifyToken, getAllCountries);

module.exports = router;