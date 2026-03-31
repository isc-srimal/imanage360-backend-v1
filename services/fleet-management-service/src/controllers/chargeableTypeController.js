const ChargeableType = require("../models/ChargeableTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createChargeableType = async (req, res) => {
  const { chargeble_type_name, status = "Active" } = req.body;

  try {
    const chargeableType = await ChargeableType.create({
      chargeble_type_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Chargeable type created successfully", chargeableType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateChargeableType = async (req, res) => {
  const { id } = req.params;
  const { chargeble_type_name, status } = req.body;

  try {
    const chargeableTypeToUpdate = await ChargeableType.findByPk(id);

    if (!chargeableTypeToUpdate) {
      return res.status(404).json({ message: "Chargeable type not found" });
    }

    chargeableTypeToUpdate.chargeble_type_name = chargeble_type_name || chargeableTypeToUpdate.chargeble_type_name;
    chargeableTypeToUpdate.status = status || chargeableTypeToUpdate.status;

    await chargeableTypeToUpdate.save();
    res.status(200).json({
      message: "Chargeable type updated successfully",
      chargeableType: chargeableTypeToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating chargeable type", error: error.message });
  }
};

const deleteChargeableType = async (req, res) => {
  const { id } = req.params;

  try {
    const chargeableTypeToDelete = await ChargeableType.findByPk(id);

    if (!chargeableTypeToDelete) {
      return res.status(404).json({ message: "Chargeable type not found" });
    }

    await chargeableTypeToDelete.destroy();
    res.status(200).json({ message: "Chargeable type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting chargeable type", error: error.message });
  }
};

const getChargeableTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const chargeableType = await ChargeableType.findByPk(id);

    if (!chargeableType) {
      return res.status(404).json({ message: "Chargeable type not found" });
    }

    res.status(200).json(chargeableType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving chargeable type", error: error.message });
  }
};

const getAllChargeableTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalChargeableTypes, rows: chargeableTypes } =
      await ChargeableType.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalChargeableTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalChargeableTypes / limit),
      chargeableTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving chargeable types", error: error.message });
  }
};

const filterChargeableTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalChargeableTypes, rows: chargeableTypes } =
      await ChargeableType.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalChargeableTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalChargeableTypes / limit),
      chargeableTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering chargeable types", error: error.message });
  }
};

const exportFilteredChargeableTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: chargeableTypes } = await ChargeableType.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!chargeableTypes || chargeableTypes.length === 0) {
      return res.status(404).json({
        message: "No chargeable types found matching the filters",
      });
    }

    const chargeableTypesData = chargeableTypes.map((chargeableType) => {
      return {
        chargeableTypeId: chargeableType.chargeble_type_id,
        chargeableTypeName: chargeableType.chargeble_type_name,
        status: chargeableType.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(chargeableTypesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_chargeable_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting chargeable types to CSV:", error);
    res.status(500).json({
      message: "Error exporting chargeable types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredChargeableTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: chargeableTypes } = await ChargeableType.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!chargeableTypes || chargeableTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "No chargeable types found matching the filters" });
    }

    const chargeableTypesData = chargeableTypes.map((chargeableType) => {
      return [
        chargeableType.chargeble_type_id || "N/A",
        chargeableType.chargeble_type_name || "N/A",
        chargeableType.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Chargeable Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*"],
            body: [
              ["Chargeable Type ID", "Chargeable Type Name", "Status"],
              ...chargeableTypesData,
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
    res.attachment("chargeable_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting chargeable types to PDF:", error);
    res.status(500).json({
      message: "Error exporting chargeable types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createChargeableType,
  updateChargeableType,
  deleteChargeableType,
  getChargeableTypeById,
  getAllChargeableTypes,
  filterChargeableTypes,
  exportFilteredChargeableTypesToCSV,
  exportFilteredChargeableTypesToPDF,
};