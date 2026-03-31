const OperatorTypeModel = require("../models/OperatorTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createOperatorType = async (req, res) => {
  const { operator_type, status = "Active" } = req.body;

  try {
    const operatorType = await OperatorTypeModel.create({
      operator_type,
      status,
    });

    res
      .status(201)
      .json({ message: "Operator type created successfully", operatorType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOperatorType = async (req, res) => {
  const { operator_type_id } = req.params;
  const { operator_type, status } = req.body;

  try {
    const operatorTypeToUpdate = await OperatorTypeModel.findByPk(operator_type_id);

    if (!operatorTypeToUpdate) {
      return res.status(404).json({ message: "Operator type not found" });
    }

    operatorTypeToUpdate.operator_type = operator_type || operatorTypeToUpdate.operator_type;
    operatorTypeToUpdate.status = status || operatorTypeToUpdate.status;

    await operatorTypeToUpdate.save();
    res.status(200).json({
      message: "Operator type updated successfully",
      operatorType: operatorTypeToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating operator type", error: error.message });
  }
};

const deleteOperatorType = async (req, res) => {
  const { operator_type_id } = req.params;

  try {
    const operatorTypeToDelete = await OperatorTypeModel.findByPk(operator_type_id);

    if (!operatorTypeToDelete) {
      return res.status(404).json({ message: "Operator type not found" });
    }

    await operatorTypeToDelete.destroy();
    res.status(200).json({ message: "Operator type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting operator type", error: error.message });
  }
};

const getOperatorTypeById = async (req, res) => {
  try {
    const { operator_type_id } = req.params;
    const operatorType = await OperatorTypeModel.findByPk(operator_type_id);

    if (!operatorType) {
      return res.status(404).json({ message: "Operator type not found" });
    }

    res.status(200).json(operatorType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving operator type", error: error.message });
  }
};

const getAllOperatorTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalOperatorTypes, rows: operatorTypes } =
      await OperatorTypeModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalOperatorTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOperatorTypes / limit),
      operatorTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving operator types", error: error.message });
  }
};

const filterOperatorTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalOperatorTypes, rows: operatorTypes } =
      await OperatorTypeModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalOperatorTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOperatorTypes / limit),
      operatorTypes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering operator types", error: error.message });
  }
};

const exportFilteredOperatorTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: operatorTypes } = await OperatorTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!operatorTypes || operatorTypes.length === 0) {
      return res.status(404).json({
        message: "No operator types found matching the filters",
      });
    }

    const operatorTypesData = operatorTypes.map((type) => {
      return {
        operatorTypeId: type.operator_type_id,
        operatorTypeName: type.operator_type,
        status: type.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(operatorTypesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_operator_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting operator types to CSV:", error);
    res.status(500).json({
      message: "Error exporting operator types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredOperatorTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: operatorTypes } = await OperatorTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!operatorTypes || operatorTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "No operator types found matching the filters" });
    }

    const operatorTypesData = operatorTypes.map((type) => {
      return [
        type.operator_type_id || "N/A",
        type.operator_type || "N/A",
        type.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Operator Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Operator Type ID", "Operator Type Name", "Status"],
              ...operatorTypesData,
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
    res.attachment("operator_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting operator types to PDF:", error);
    res.status(500).json({
      message: "Error exporting operator types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createOperatorType,
  updateOperatorType,
  deleteOperatorType,
  getOperatorTypeById,
  getAllOperatorTypes,
  filterOperatorTypes,
  exportFilteredOperatorTypesToCSV,
  exportFilteredOperatorTypesToPDF,
};