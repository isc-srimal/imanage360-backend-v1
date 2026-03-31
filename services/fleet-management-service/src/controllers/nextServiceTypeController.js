const NextServiceTypeModel = require("../models/NextServiceTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createNextServiceType = async (req, res) => {
  const { next_service_type, status = "Active" } = req.body;

  try {
    const nextServiceType = await NextServiceTypeModel.create({
      next_service_type,
      status,
    });

    res
      .status(201)
      .json({ message: "Next service type created successfully", nextServiceType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateNextServiceType = async (req, res) => {
  const { next_service_type_id } = req.params;
  const { next_service_type, status } = req.body;

  try {
    const nextServiceTypeToUpdate = await NextServiceTypeModel.findByPk(next_service_type_id);

    if (!nextServiceTypeToUpdate) {
      return res.status(404).json({ message: "Next service type not found" });
    }

    nextServiceTypeToUpdate.next_service_type = next_service_type || nextServiceTypeToUpdate.next_service_type;
    nextServiceTypeToUpdate.status = status || nextServiceTypeToUpdate.status;

    await nextServiceTypeToUpdate.save();
    res.status(200).json({
      message: "Next service type updated successfully",
      nextServiceType: nextServiceTypeToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating next service type", error: error.message });
  }
};

const deleteNextServiceType = async (req, res) => {
  const { next_service_type_id } = req.params;

  try {
    const nextServiceTypeToDelete = await NextServiceTypeModel.findByPk(next_service_type_id);

    if (!nextServiceTypeToDelete) {
      return res.status(404).json({ message: "Next service type not found" });
    }

    await nextServiceTypeToDelete.destroy();
    res.status(200).json({ message: "Next service type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting next service type", error: error.message });
  }
};

const getNextServiceTypeById = async (req, res) => {
  try {
    const { next_service_type_id } = req.params;
    const nextServiceType = await NextServiceTypeModel.findByPk(next_service_type_id);

    if (!nextServiceType) {
      return res.status(404).json({ message: "Next service type not found" });
    }

    res.status(200).json(nextServiceType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving next service type", error: error.message });
  }
};

const getAllNextServiceTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalNextServiceTypes, rows: nextServiceTypes } =
      await NextServiceTypeModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalNextServiceTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalNextServiceTypes / limit),
      nextServiceTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving next service types", error: error.message });
  }
};

const filterNextServiceTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalNextServiceTypes, rows: nextServiceTypes } =
      await NextServiceTypeModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalNextServiceTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalNextServiceTypes / limit),
      nextServiceTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering next service types", error: error.message });
  }
};

const exportFilteredNextServiceTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: nextServiceTypes } = await NextServiceTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!nextServiceTypes || nextServiceTypes.length === 0) {
      return res.status(404).json({
        message: "No next service types found matching the filters",
      });
    }

    const nextServiceTypesData = nextServiceTypes.map((serviceType) => {
      return {
        nextServiceTypeId: serviceType.next_service_type_id,
        nextServiceType: serviceType.next_service_type,
        status: serviceType.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(nextServiceTypesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_next_service_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting next service types to CSV:", error);
    res.status(500).json({
      message: "Error exporting next service types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredNextServiceTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: nextServiceTypes } = await NextServiceTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!nextServiceTypes || nextServiceTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "No next service types found matching the filters" });
    }

    const nextServiceTypesData = nextServiceTypes.map((serviceType) => {
      return [
        serviceType.next_service_type_id || "N/A",
        serviceType.next_service_type || "N/A",
        serviceType.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Next Service Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Next Service Type ID", "Next Service Type", "Status"],
              ...nextServiceTypesData,
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
    res.attachment("next_service_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting next service types to PDF:", error);
    res.status(500).json({
      message: "Error exporting next service types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createNextServiceType,
  updateNextServiceType,
  deleteNextServiceType,
  getNextServiceTypeById,
  getAllNextServiceTypes,
  filterNextServiceTypes,
  exportFilteredNextServiceTypesToCSV,
  exportFilteredNextServiceTypesToPDF,
};