const IndustryModel = require("../models/IndustryModel"); 
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createIndustry = async (req, res) => {
  const { industry, status = "Active" } = req.body;

  try {
    const newIndustry = await IndustryModel.create({
      industry,
      status,
    });

    res
      .status(201)
      .json({ message: "Industry created successfully", industry: newIndustry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIndustry = async (req, res) => {
  const { id } = req.params;
  const { industry, status } = req.body;

  try {
    const industryToUpdate = await IndustryModel.findByPk(id);

    if (!industryToUpdate) {
      return res.status(404).json({ message: "Industry not found" });
    }

    industryToUpdate.industry = industry || industryToUpdate.industry;
    industryToUpdate.status = status || industryToUpdate.status;

    await industryToUpdate.save();
    res.status(200).json({
      message: "Industry updated successfully",
      industry: industryToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating industry", error: error.message });
  }
};

const deleteIndustry = async (req, res) => {
  const { id } = req.params;

  try {
    const industryToDelete = await IndustryModel.findByPk(id);

    if (!industryToDelete) {
      return res.status(404).json({ message: "Industry not found" });
    }

    await industryToDelete.destroy();
    res.status(200).json({ message: "Industry deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting industry", error: error.message });
  }
};

const getIndustryById = async (req, res) => {
  try {
    const { id } = req.params;
    const industry = await IndustryModel.findByPk(id);

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    res.status(200).json(industry);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving industry", error: error.message });
  }
};

const getAllIndustries = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalIndustries, rows: industries } =
      await IndustryModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalIndustries,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalIndustries / limit),
      industries,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving industries", error: error.message });
  }
};

const filterIndustries = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalIndustries, rows: industries } =
      await IndustryModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalIndustries,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalIndustries / limit),
      industries,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering industries", error: error.message });
  }
};

const exportFilteredIndustriesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: industries } = await IndustryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!industries || industries.length === 0) {
      return res.status(404).json({
        message: "No industries found matching the filters",
      });
    }

    const industriesData = industries.map((industry) => {
      return {
        industryId: industry.id,
        industry: industry.industry,
        status: industry.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(industriesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_industries.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting industries to CSV:", error);
    res.status(500).json({
      message: "Error exporting industries to CSV",
      error: error.message,
    });
  }
};

const exportFilteredIndustriesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: industries } = await IndustryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!industries || industries.length === 0) {
      return res
        .status(404)
        .json({ message: "No industries found matching the filters" });
    }

    const industriesData = industries.map((industry) => {
      return [
        industry.id || "N/A",
        industry.industry || "N/A",
        industry.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Industries Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Industry ID", "Industry", "Status"],
              ...industriesData,
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
    res.attachment("industries_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting industries to PDF:", error);
    res.status(500).json({
      message: "Error exporting industries to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createIndustry,
  updateIndustry,
  deleteIndustry,
  getIndustryById,
  getAllIndustries,
  filterIndustries,
  exportFilteredIndustriesToCSV,
  exportFilteredIndustriesToPDF,
};