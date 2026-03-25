const Employee = require("../../models/hr/employees/EmployeeModel");
const Penalty = require("../../models/hr/PenaltyModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createPenalty = async (req, res) => {
  const {
    penaltyType,
    description,
    penaltyAmount,
    monthlyDeduction,
    deductionStartMonth,
    createdBy,
    employeeId
  } = req.body;

  try {
    const penalty = await Penalty.create({
      penaltyType,
      description,
      penaltyAmount,
      monthlyDeduction,
      deductionStartMonth,
      createdBy,
      employeeId
    });

    res.status(201).json({ message: "Penalty created successfully", penalty });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePenalty = async (req, res) => {
  const { id } = req.params;
  const {
    penaltyType,
    description,
    penaltyAmount,
    monthlyDeduction,
    deductionStartMonth,
    createdBy,
    employeeId
  } = req.body;

  try {
    const penaltyToUpdate = await Penalty.findByPk(id);

    if (!penaltyToUpdate) {
      return res.status(404).json({ message: "Penalty not found" });
    }

    penaltyToUpdate.penaltyType = penaltyType || penaltyToUpdate.penaltyType;
    penaltyToUpdate.description = description || penaltyToUpdate.description;
    penaltyToUpdate.penaltyAmount = penaltyAmount || penaltyToUpdate.penaltyAmount;
    penaltyToUpdate.monthlyDeduction = monthlyDeduction || penaltyToUpdate.monthlyDeduction;
    penaltyToUpdate.deductionStartMonth = deductionStartMonth || penaltyToUpdate.deductionStartMonth;
    penaltyToUpdate.createdBy = createdBy || penaltyToUpdate.createdBy;
    penaltyToUpdate.employeeId = employeeId || penaltyToUpdate.employeeId;

    await penaltyToUpdate.save();

    res.status(200).json({
      message: "Penalty updated successfully",
      penalty: penaltyToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating penalty", error: error.message });
  }
};

const deletePenalty = async (req, res) => {
  const { id } = req.params;

  try {
    const penaltyToDelete = await Penalty.findByPk(id);

    if (!penaltyToDelete) {
      return res.status(404).json({ message: "Penalty not found" });
    }

    await penaltyToDelete.destroy();
    res.status(200).json({ message: "Penalty deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting penalty", error: error.message });
  }
};

const getPenaltyById = async (req, res) => {
  try {
    const { id } = req.params;
    const penalty = await Penalty.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!penalty) {
      return res.status(404).json({ message: "Penalty not found" });
    }

    res.status(200).json(penalty);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving penalty", error: error.message });
  }
};

const getAllPenalties = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalPenalties, rows: penalties } = await Penalty.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    res.status(200).json({
      totalPenalties,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPenalties / limit),
      penalties,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving penalties", error: error.message });
  }
};

const setPenaltyDeduction = async (req, res) => {
  const { id } = req.params;
  const { monthlyDeduction, deductionStartMonth } = req.body;

  try {
    const penalty = await Penalty.findByPk(id);

    if (!penalty) {
      return res.status(404).json({ message: "Penalty not found" });
    }

    penalty.monthlyDeduction = monthlyDeduction ?? penalty.monthlyDeduction;
    penalty.deductionStartMonth = deductionStartMonth ?? penalty.deductionStartMonth;

    await penalty.save();

    res.status(200).json({
      message: "Penalty deduction details updated successfully",
      penalty,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating penalty deduction",
      error: error.message,
    });
  }
};

const filterPenalties = async (req, res) => {
  try {
    const { createdBy = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    const { count: totalPenalties, rows: penalties } =
      await Penalty.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: {
          model: Employee,
          as: "employee",
        },
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
      .json({ message: "Error filtering penalties", error: error.message });
  }
};

const exportFilteredPenaltiesToCSV = async (req, res) => {
  try {
    const {
      createdBy = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    const { rows: penalties } = await Penalty.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    console.log(penalties);

    if (!penalties || penalties.length === 0) {
      return res.status(404).json({
        message: "No penalties found matching the filters",
      });
    }

    const penaltiesData = penalties.map((penaltiez) => {
      return {
        penaltyId: penaltiez.id,
        penaltyType: penaltiez.penaltyType,
        description: penaltiez.description,
        penaltyAmount: penaltiez.penaltyAmount,
        monthlyDeduction: penaltiez.monthlyDeduction,
        deductionStartMonth: penaltiez.deductionStartMonth,
        createdBy: penaltiez.createdBy,
        employeeId: penaltiez.employeeId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(penaltiesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_penalties.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting penalties to CSV:", error);
    res.status(500).json({
      message: "Error exporting penalties to CSV",
      error: error.message,
    });
  }
};

const exportFilteredPenaltiesToPDF = async (req, res) => {
  try {
    const {
      createdBy = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    const { rows: penalties } = await Penalty.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!penalties || penalties.length === 0) {
      return res
        .status(404)
        .json({ message: "No penalties found matching the filters" });
    }

    const penaltiesData = penalties.map((penaltiez) => {
      return [
        penaltiez.id || "N/A",
        penaltiez.penaltyType || "N/A",
        penaltiez.penaltyAmount || "N/A",
        penaltiez.monthlyDeduction || "N/A",
        penaltiez.deductionStartMonth || "N/A",
        penaltiez.employeeId || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Penalties Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Penalty ID",
                "Penalty Type",
                "Amount",
                "Deduction",
                "Deduction Start Month",
                "Employee ID",
              ],
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
    res.attachment("penalties_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting penalties to PDF:", error);
    res.status(500).json({
      message: "Error exporting penalties to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createPenalty,
  updatePenalty,
  deletePenalty,
  getPenaltyById,
  getAllPenalties,
  setPenaltyDeduction,
  filterPenalties,
  exportFilteredPenaltiesToCSV,
  exportFilteredPenaltiesToPDF,
};