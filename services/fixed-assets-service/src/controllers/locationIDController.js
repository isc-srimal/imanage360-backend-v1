const LocationIDModel = require("../models/LocationIDModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createLocationID = async (req, res) => {
  const { location_name, status = "Active" } = req.body;

  try {
    const location = await LocationIDModel.create({
      location_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Location ID created successfully", location });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLocationID = async (req, res) => {
  const { id } = req.params;
  const { location_name, status } = req.body;

  try {
    const locationToUpdate = await LocationIDModel.findByPk(id);

    if (!locationToUpdate) {
      return res.status(404).json({ message: "Location ID not found" });
    }

    locationToUpdate.location_name = location_name || locationToUpdate.location_name;
    locationToUpdate.status = status || locationToUpdate.status;

    await locationToUpdate.save();
    res.status(200).json({
      message: "Location ID updated successfully",
      location: locationToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating location ID", error: error.message });
  }
};

const deleteLocationID = async (req, res) => {
  const { id } = req.params;

  try {
    const locationToDelete = await LocationIDModel.findByPk(id);

    if (!locationToDelete) {
      return res.status(404).json({ message: "Location ID not found" });
    }

    await locationToDelete.destroy();
    res.status(200).json({ message: "Location ID deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting location ID", error: error.message });
  }
};

const getLocationIDById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await LocationIDModel.findByPk(id);

    if (!location) {
      return res.status(404).json({ message: "Location ID not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving location ID", error: error.message });
  }
};

const getAllLocationIDs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalLocations, rows: locations } =
      await LocationIDModel.findAndCountAll({
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
      .json({ message: "Error retrieving location IDs", error: error.message });
  }
};

const filterLocationIDs = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalLocations, rows: locations } =
      await LocationIDModel.findAndCountAll({
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
      .json({ message: "Error filtering location IDs", error: error.message });
  }
};

const exportFilteredLocationIDsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: locations } = await LocationIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!locations || locations.length === 0) {
      return res.status(404).json({
        message: "No location IDs found matching the filters",
      });
    }

    const locationsData = locations.map((location) => {
      return {
        locationId: location.id,
        location_name: location.location_name,
        status: location.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(locationsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_location_ids.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting location IDs to CSV:", error);
    res.status(500).json({
      message: "Error exporting location IDs to CSV",
      error: error.message,
    });
  }
};

const exportFilteredLocationIDsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: locations } = await LocationIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!locations || locations.length === 0) {
      return res
        .status(404)
        .json({ message: "No location IDs found matching the filters" });
    }

    const locationsData = locations.map((location) => {
      return [
        location.id || "N/A",
        location.location_name || "N/A",
        location.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Location IDs Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Location ID", "Location Name", "Status"],
              ...locationsData,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        body: {
          fontSize: 8,
          bold: true,
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
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
    res.attachment("location_ids_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting location IDs to PDF:", error);
    res.status(500).json({
      message: "Error exporting location IDs to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createLocationID,
  updateLocationID,
  deleteLocationID,
  getLocationIDById,
  getAllLocationIDs,
  filterLocationIDs,
  exportFilteredLocationIDsToCSV,
  exportFilteredLocationIDsToPDF,
};