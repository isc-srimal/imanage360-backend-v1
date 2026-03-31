const VehicleOwnerModel = require("../models/VehicleOwnerModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createVehicleOwner = async (req, res) => {
  const { name, own_vehicle, status = "Active" } = req.body;

  try {
    const vehicleOwner = await VehicleOwnerModel.create({
      name,
      own_vehicle,
      status,
    });

    res.status(201).json({
      message: "Vehicle owner created successfully",
      vehicleOwner,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVehicleOwner = async (req, res) => {
  const { vehicle_owner_id } = req.params;
  const { name, own_vehicle, status } = req.body;

  try {
    const vehicleOwnerToUpdate = await VehicleOwnerModel.findByPk(vehicle_owner_id);

    if (!vehicleOwnerToUpdate) {
      return res.status(404).json({ message: "Vehicle owner not found" });
    }

    vehicleOwnerToUpdate.name = name || vehicleOwnerToUpdate.name;
    vehicleOwnerToUpdate.own_vehicle = own_vehicle !== undefined ? own_vehicle : vehicleOwnerToUpdate.own_vehicle;
    vehicleOwnerToUpdate.status = status || vehicleOwnerToUpdate.status;

    await vehicleOwnerToUpdate.save();
    res.status(200).json({
      message: "Vehicle owner updated successfully",
      vehicleOwner: vehicleOwnerToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating vehicle owner",
      error: error.message,
    });
  }
};

const deleteVehicleOwner = async (req, res) => {
  const { vehicle_owner_id } = req.params;

  try {
    const vehicleOwnerToDelete = await VehicleOwnerModel.findByPk(vehicle_owner_id);

    if (!vehicleOwnerToDelete) {
      return res.status(404).json({ message: "Vehicle owner not found" });
    }

    await vehicleOwnerToDelete.destroy();
    res.status(200).json({ message: "Vehicle owner deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting vehicle owner",
      error: error.message,
    });
  }
};

const getVehicleOwnerById = async (req, res) => {
  try {
    const { vehicle_owner_id } = req.params;
    const vehicleOwner = await VehicleOwnerModel.findByPk(vehicle_owner_id);

    if (!vehicleOwner) {
      return res.status(404).json({ message: "Vehicle owner not found" });
    }

    res.status(200).json(vehicleOwner);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving vehicle owner",
      error: error.message,
    });
  }
};

const getAllVehicleOwners = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalVehicleOwners, rows: vehicleOwners } =
      await VehicleOwnerModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalVehicleOwners,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalVehicleOwners / limit),
      vehicleOwners,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving vehicle owners",
      error: error.message,
    });
  }
};

const filterVehicleOwners = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where.status = status;
    }

    const { count: totalVehicleOwners, rows: vehicleOwners } =
      await VehicleOwnerModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalVehicleOwners,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalVehicleOwners / limit),
      vehicleOwners,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering vehicle owners",
      error: error.message,
    });
  }
};

const exportFilteredVehicleOwnersToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where.status = status;
    }

    const { rows: vehicleOwners } = await VehicleOwnerModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!vehicleOwners || vehicleOwners.length === 0) {
      return res.status(404).json({
        message: "No vehicle owners found matching the filters",
      });
    }

    const vehicleOwnersData = vehicleOwners.map((owner) => ({
      vehicleOwnerId: owner.vehicle_owner_id,
      name: owner.name,
      ownVehicle: owner.own_vehicle ? "Yes" : "No",
      status: owner.status,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(vehicleOwnersData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_vehicle_owners.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting vehicle owners to CSV:", error);
    res.status(500).json({
      message: "Error exporting vehicle owners to CSV",
      error: error.message,
    });
  }
};

const exportFilteredVehicleOwnersToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where.status = status;
    }

    const { rows: vehicleOwners } = await VehicleOwnerModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!vehicleOwners || vehicleOwners.length === 0) {
      return res.status(404).json({
        message: "No vehicle owners found matching the filters",
      });
    }

    const vehicleOwnersData = vehicleOwners.map((owner) => [
      owner.vehicle_owner_id || "N/A",
      owner.name || "N/A",
      owner.own_vehicle ? "Yes" : "No",
      owner.status || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Vehicle Owners Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", 100, 100],
            body: [
              ["Vehicle Owner ID", "Name", "Own Vehicle", "Status"],
              ...vehicleOwnersData,
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
    res.attachment("vehicle_owners_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting vehicle owners to PDF:", error);
    res.status(500).json({
      message: "Error exporting vehicle owners to PDF",
      error: error.message,
    });
  }
};

const getAvailableVehicleOwners = async (req, res) => {
  try {
    const vehicleOwners = await VehicleOwnerModel.findAll({
      where: {
        own_vehicle: false,
        status: "Active"
      },
      attributes: ['vehicle_owner_id', 'name'],
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      vehicleOwners
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving available vehicle owners",
      error: error.message,
    });
  }
};

module.exports = {
  createVehicleOwner,
  updateVehicleOwner,
  deleteVehicleOwner,
  getVehicleOwnerById,
  getAllVehicleOwners,
  filterVehicleOwners,
  exportFilteredVehicleOwnersToCSV,
  exportFilteredVehicleOwnersToPDF,
  getAvailableVehicleOwners,
};