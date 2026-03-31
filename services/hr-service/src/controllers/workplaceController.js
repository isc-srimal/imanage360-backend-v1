const workplaces = require("../models/WorkplaceModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createWorkplace = async (req, res) => {
  const { workplaceName, workplaceNameArabic, status = "Active" } = req.body;

  try {
    const workplace = await workplaces.create({
      workplaceName,
      workplaceNameArabic,
      status,
    });

    res
      .status(201)
      .json({ message: "Workplace created successfully", workplace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateWorkplace = async (req, res) => {
  const { id } = req.params;
  const { workplaceName, workplaceNameArabic, status } = req.body;

  try {
    const workplaceToUpdate = await workplaces.findByPk(id);

    if (!workplaceToUpdate) {
      return res.status(404).json({ message: "Workplace not found" });
    }

    workplaceToUpdate.workplaceName =
      workplaceName || workplaceToUpdate.workplaceName;
    workplaceToUpdate.workplaceNameArabic =
      workplaceNameArabic || workplaceToUpdate.workplaceNameArabic;
    workplaceToUpdate.status = status || workplaceToUpdate.status;

    await workplaceToUpdate.save();
    res.status(200).json({
      message: "Workplace updated successfully",
      workplace: workplaceToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating workplace", error: error.message });
  }
};

const deleteWorkplace = async (req, res) => {
  const { id } = req.params;

  try {
    const workplaceToDelete = await workplaces.findByPk(id);

    if (!workplaceToDelete) {
      return res.status(404).json({ message: "Workplace not found" });
    }

    await workplaceToDelete.destroy();
    res.status(200).json({ message: "Workplace deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting workplace", error: error.message });
  }
};

const getWorkplaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const workplace = await workplaces.findByPk(id);

    if (!workplace) {
      return res.status(404).json({ message: "Workplace not found" });
    }

    res.status(200).json(workplace);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving workplace", error: error.message });
  }
};

const getAllWorkplaces = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalWorkplaces, rows: workplace } =
      await workplaces.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalWorkplaces,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalWorkplaces / limit),
      workplace,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving workplaces", error: error.message });
  }
};

const exportFilteredWorkplaceToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: workplace } = await workplaces.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(workplace);

    if (!workplace || workplace.length === 0) {
      return res.status(404).json({
        message: "No workplace found matching the filters",
      });
    }

    const workplaceData = workplace.map((workplacez) => {
      return {
        workplaceId: workplacez.id,
        workplaceName: workplacez.workplaceName,
        workplaceNameArabic: workplacez.workplaceNameArabic,
        status: workplacez.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = "\uFEFF" + json2csvParser.parse(workplaceData);

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("filtered_workplaces.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting workplaces to CSV:", error);
    res.status(500).json({
      message: "Error exporting workplaces to CSV",
      error: error.message,
    });
  }
};

const exportFilteredWorkplaceToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") where["status"] = status;

    const { rows: workplace } = await workplaces.findAndCountAll({ where, offset, limit: parseInt(limit) });

    if (!workplace || workplace.length === 0) {
      return res.status(404).json({ message: "No workplace found matching the filters" });
    }

    const workplaceData = workplace.map(workplacez => [
      workplacez.id || "N/A",
      workplacez.workplaceName || "N/A",
      { text: workplacez.workplaceNameArabic || "N/A", font: "Amiri", alignment: "right" },
      workplacez.status || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Workplace Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [80, "*", "*", "*", "*"],
            body: [
              [
                { text: "Workplace ID", bold: true },
                { text: "Workplace Name", bold: true },
                { text: "Workplace Name Arabic", bold: true },
                { text: "Status", bold: true },
              ],
              ...workplaceData,
            ],
          },
        },
      ],
      defaultStyle: {
        font: "Roboto",
        fontSize: 12,
      },
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
      Amiri: {
        normal: path.join(sourceDir, "Amiri-Regular.ttf"),
        bold: path.join(sourceDir, "Amiri-Bold.ttf"),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header("Content-Type", "application/pdf");
    res.attachment("workplace_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting workplace to PDF:", error);
    res.status(500).json({ message: "Error exporting workplace to PDF", error: error.message });
  }
};

module.exports = {
  createWorkplace,
  updateWorkplace,
  deleteWorkplace,
  getWorkplaceById,
  getAllWorkplaces,
  exportFilteredWorkplaceToCSV,
  exportFilteredWorkplaceToPDF,
};
