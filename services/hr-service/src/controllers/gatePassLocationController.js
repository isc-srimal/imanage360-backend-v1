// controllers/gatePass/gatePassLocationController.js
const GatePassLocationModel = require("../models/GatePassLocationModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// Create
const createGatePassLocation = async (req, res) => {
  const { gatePassLocation, status = "Active" } = req.body;

  try {
    const location = await GatePassLocationModel.create({
      gatePassLocation,
      status,
    });

    res
      .status(201)
      .json({ message: "Gate pass location created successfully", location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
const updateGatePassLocation = async (req, res) => {
  const { id } = req.params;
  const { gatePassLocation, status } = req.body;

  try {
    const location = await GatePassLocationModel.findByPk(id);

    if (!location) {
      return res.status(404).json({ message: "Gate pass location not found" });
    }

    location.gatePassLocation = gatePassLocation || location.gatePassLocation;
    location.status = status || location.status;

    await location.save();

    res.status(200).json({
      message: "Gate pass location updated successfully",
      location,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating gate pass location", error: error.message });
  }
};

// Delete
const deleteGatePassLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await GatePassLocationModel.findByPk(id);

    if (!location) {
      return res.status(404).json({ message: "Gate pass location not found" });
    }

    await location.destroy();
    res.status(200).json({ message: "Gate pass location deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting gate pass location", error: error.message });
  }
};

// Get by ID
const getGatePassLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await GatePassLocationModel.findByPk(id);

    if (!location) {
      return res.status(404).json({ message: "Gate pass location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving gate pass location", error: error.message });
  }
};

// Get All with pagination
const getAllGatePassLocations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalLocations, rows: locations } =
      await GatePassLocationModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalLocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLocations / limit),
      locations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving gate pass locations", error: error.message });
  }
};

// Filter by status
const filterGatePassLocations = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") where.status = status;

    const { count: totalLocations, rows: locations } =
      await GatePassLocationModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalLocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLocations / limit),
      locations,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering gate pass locations", error: error.message });
  }
};

// Export filtered to CSV
const exportFilteredLocationsToCSV = async (req, res) => {
  try {
    const { status = "All" } = req.query;
    const where = status !== "All" ? { status } : {};

    const { rows: locations } = await GatePassLocationModel.findAndCountAll({ where });

    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: "No gate pass locations found" });
    }

    const data = locations.map((loc) => ({
      ID: loc.id,
      Location: loc.gatePassLocation,
      Status: loc.status,
    }));

    const parser = new Parser();
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("gate_pass_locations.csv");
    res.send(csv);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting to CSV", error: error.message });
  }
};

// Export filtered to PDF
const exportFilteredLocationsToPDF = async (req, res) => {
  try {
    const { status = "All" } = req.query;
    const where = status !== "All" ? { status } : {};

    const { rows: locations } = await GatePassLocationModel.findAndCountAll({ where });

    if (!locations || locations.length === 0) {
      return res.status(404).json({ message: "No gate pass locations found" });
    }

    const body = locations.map((loc) => [
      loc.id?.toString() || "N/A",
      loc.gatePassLocation || "N/A",
      loc.status || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Gate Pass Locations", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto"],
            body: [["ID", "Location", "Status"], ...body],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
      },
      defaultStyle: { fontSize: 10 },
    };

    const printer = new PdfPrinter({
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header("Content-Type", "application/pdf");
    res.attachment("gate_pass_locations.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error exporting to PDF", error: error.message });
  }
};

module.exports = {
  createGatePassLocation,
  updateGatePassLocation,
  deleteGatePassLocation,
  getGatePassLocationById,
  getAllGatePassLocations,
  filterGatePassLocations,
  exportFilteredLocationsToCSV,
  exportFilteredLocationsToPDF,
};