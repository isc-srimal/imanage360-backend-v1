const Countries = require("../models/CountryModel");

const getCountryById = async (req, res) => {
    try {
      const { id } = req.params;
      const country = await Countries.findByPk(id);
  
      if (!country) {
        return res.status(404).json({ message: "Country not found" });
      }
  
      res.status(200).json(country);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving country", error: error.message });
    }
  };

  const getAllCountries = async (req, res) => {
    try {
      const { page = 1, limit = 247 } = req.query;
      const offset = (page - 1) * parseInt(limit);
  
      const { count: totalCountries, rows: countries } =
        await Countries.findAndCountAll({
          offset,
          limit: parseInt(limit),
        });
  
      res.status(200).json({
        totalCountries,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCountries / limit),
        countries,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error retrieving countries", error: error.message });
    }
  };

  module.exports = {
    getCountryById,
    getAllCountries,
  };  
