const ServiceEntryTypeModel = require("../models/ServiceEntryTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createServiceEntryType = async (req, res) => {
  const { service_entry_type, status = "Active" } = req.body;

  try {
    const serviceEntryType = await ServiceEntryTypeModel.create({
      service_entry_type,
      status,
    });

    res
      .status(201)
      .json({ message: "Service entry type created successfully", serviceEntryType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateServiceEntryType = async (req, res) => {
  const { id } = req.params;
  const { service_entry_type, status } = req.body;

  try {
    const serviceEntryTypeToUpdate = await ServiceEntryTypeModel.findByPk(id);

    if (!serviceEntryTypeToUpdate) {
      return res.status(404).json({ message: "Service entry type not found" });
    }

    serviceEntryTypeToUpdate.service_entry_type = service_entry_type || serviceEntryTypeToUpdate.service_entry_type;
    serviceEntryTypeToUpdate.status = status || serviceEntryTypeToUpdate.status;

    await serviceEntryTypeToUpdate.save();
    res.status(200).json({
      message: "Service entry type updated successfully",
      serviceEntryType: serviceEntryTypeToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service entry type", error: error.message });
  }
};

const deleteServiceEntryType = async (req, res) => {
  const { id } = req.params;

  try {
    const serviceEntryTypeToDelete = await ServiceEntryTypeModel.findByPk(id);

    if (!serviceEntryTypeToDelete) {
      return res.status(404).json({ message: "Service entry type not found" });
    }

    await serviceEntryTypeToDelete.destroy();
    res.status(200).json({ message: "Service entry type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service entry type", error: error.message });
  }
};

const getServiceEntryTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceEntryType = await ServiceEntryTypeModel.findByPk(id);

    if (!serviceEntryType) {
      return res.status(404).json({ message: "Service entry type not found" });
    }

    res.status(200).json(serviceEntryType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service entry type", error: error.message });
  }
};

const getAllServiceEntryTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalServiceEntryTypes, rows: serviceEntryTypes } =
      await ServiceEntryTypeModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceEntryTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceEntryTypes / limit),
      serviceEntryTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service entry types", error: error.message });
  }
};

const filterServiceEntryTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalServiceEntryTypes, rows: serviceEntryTypes } =
      await ServiceEntryTypeModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceEntryTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceEntryTypes / limit),
      serviceEntryTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering service entry types", error: error.message });
  }
};

const exportFilteredServiceEntryTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceEntryTypes } = await ServiceEntryTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceEntryTypes || serviceEntryTypes.length === 0) {
      return res.status(404).json({
        message: "No service entry types found matching the filters",
      });
    }

    const serviceEntryTypesData = serviceEntryTypes.map((serviceEntryType) => {
      return {
        serviceEntryTypeId: serviceEntryType.service_entry_type_id,
        service_entry_type: serviceEntryType.service_entry_type,
        status: serviceEntryType.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(serviceEntryTypesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_service_entry_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting service entry types to CSV:", error);
    res.status(500).json({
      message: "Error exporting service entry types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredServiceEntryTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceEntryTypes } = await ServiceEntryTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceEntryTypes || serviceEntryTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "No service entry types found matching the filters" });
    }

    const serviceEntryTypesData = serviceEntryTypes.map((serviceEntryType) => {
      return [
        serviceEntryType.service_entry_type_id || "N/A",
        serviceEntryType.service_entry_type || "N/A",
        serviceEntryType.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Service Entry Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Service Entry Type ID", "Service Entry Type", "Status"],
              ...serviceEntryTypesData,
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
    res.attachment("service_entry_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting service entry types to PDF:", error);
    res.status(500).json({
      message: "Error exporting service entry types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createServiceEntryType,
  updateServiceEntryType,
  deleteServiceEntryType,
  getServiceEntryTypeById,
  getAllServiceEntryTypes,
  filterServiceEntryTypes,
  exportFilteredServiceEntryTypesToCSV,
  exportFilteredServiceEntryTypesToPDF,
};