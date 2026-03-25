const penaltyTypes = require("../../models/hr/PenaltyTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createPenaltyType = async (req, res) => {
  const { penaltyType, status = "Active" } = req.body;

  try {
    const penalties = await penaltyTypes.create({
      penaltyType,
      status,
    });

    res
      .status(201)
      .json({ message: "Penalty type created successfully", penalties });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePenaltyTypes = async (req, res) => {
  const { id } = req.params;
  const { penaltyType, status } = req.body;

  try {
    const penaltiesToUpdate = await penaltyTypes.findByPk(id);

    if (!penaltiesToUpdate) {
      return res.status(404).json({ message: "Penalty type not found" });
    }

    penaltiesToUpdate.penaltyType = penaltyType || penaltiesToUpdate.penaltyType;
    penaltiesToUpdate.status = status || penaltiesToUpdate.status;

    await penaltiesToUpdate.save();
    res.status(200).json({
      message: "Penalty type updated successfully",
      penalties: penaltiesToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating penalty type", error: error.message });
  }
};

const deletePenaltyType = async (req, res) => {
  const { id } = req.params;

  try {
    const penaltiesToDelete = await penaltyTypes.findByPk(id);

    if (!penaltiesToDelete) {
      return res.status(404).json({ message: "Penalty type not found" });
    }

    await penaltiesToDelete.destroy();
    res.status(200).json({ message: "Penalty type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting penalty type", error: error.message });
  }
};

const getPenaltyTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const penalties = await penaltyTypes.findByPk(id);

    if (!penalties) {
      return res.status(404).json({ message: "Penalty type not found" });
    }

    res.status(200).json(penalties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving penalty type", error: error.message });
  }
};

const getAllPenaltyTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalPenalties, rows: penalties } =
      await penaltyTypes.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalPenalties,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPenalties / limit),
      penalties,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving penalty types", error: error.message });
  }
};

const filterPenaltyTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalPenalties, rows: penalties } =
      await penaltyTypes.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalPenalties,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPenalties / limit),
      penalties,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering penalty types", error: error.message });
  }
};

const exportFilteredPenaltyTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: penalties } = await penaltyTypes.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(penalties);

    if (!penalties || penalties.length === 0) {
      return res.status(404).json({
        message: "No penalty types found matching the filters",
      });
    }

    const penaltiesData = penalties.map((penaltiez) => {
      return {
        penaltyTypesId: penaltiez.id,
        penaltyType: penaltiez.penaltyType,
        status: penaltiez.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(penaltiesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_penalty_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting penalty types to CSV:", error);
    res.status(500).json({
      message: "Error exporting penalty types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredPenaltyTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: penalties } = await penaltyTypes.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!penalties || penalties.length === 0) {
      return res
        .status(404)
        .json({ message: "No penalty types found matching the filters" });
    }

    const penaltiesData = penalties.map((penaltiez) => {
      return [
        penaltiez.id || "N/A",
        penaltiez.penaltyType || "N/A",
        penaltiez.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Penalty Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*"],
            body: [
              ["Penalty Types ID", "Penalty Type", "Status"],
              ...penaltiesData,
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
    res.attachment("penalty_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting penalty types to PDF:", error);
    res.status(500).json({
      message: "Error exporting penalty types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createPenaltyType,
  updatePenaltyTypes,
  deletePenaltyType,
  getPenaltyTypeById,
  getAllPenaltyTypes,
  filterPenaltyTypes,
  exportFilteredPenaltyTypesToCSV,
  exportFilteredPenaltyTypesToPDF,
};
