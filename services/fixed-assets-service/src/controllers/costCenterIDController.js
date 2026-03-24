const CostCenterIDModel = require("../models/CostCenterIDModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createCostCenterID = async (req, res) => {
  const { cost_center_name, status = "Active" } = req.body;

  try {
    const costCenter = await CostCenterIDModel.create({
      cost_center_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Cost center ID created successfully", costCenter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCostCenterID = async (req, res) => {
  const { id } = req.params;
  const { cost_center_name, status } = req.body;

  try {
    const costCenterToUpdate = await CostCenterIDModel.findByPk(id);

    if (!costCenterToUpdate) {
      return res.status(404).json({ message: "Cost center ID not found" });
    }

    costCenterToUpdate.cost_center_name = cost_center_name || costCenterToUpdate.cost_center_name;
    costCenterToUpdate.status = status || costCenterToUpdate.status;

    await costCenterToUpdate.save();
    res.status(200).json({
      message: "Cost center ID updated successfully",
      costCenter: costCenterToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating cost center ID", error: error.message });
  }
};

const deleteCostCenterID = async (req, res) => {
  const { id } = req.params;

  try {
    const costCenterToDelete = await CostCenterIDModel.findByPk(id);

    if (!costCenterToDelete) {
      return res.status(404).json({ message: "Cost center ID not found" });
    }

    await costCenterToDelete.destroy();
    res.status(200).json({ message: "Cost center ID deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting cost center ID", error: error.message });
  }
};

const getCostCenterIDById = async (req, res) => {
  try {
    const { id } = req.params;
    const costCenter = await CostCenterIDModel.findByPk(id);

    if (!costCenter) {
      return res.status(404).json({ message: "Cost center ID not found" });
    }

    res.status(200).json(costCenter);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving cost center ID", error: error.message });
  }
};

const getAllCostCenterIDs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCostCenters, rows: costCenters } =
      await CostCenterIDModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCostCenters,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCostCenters / limit),
      costCenters,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving cost center IDs", error: error.message });
  }
};

const filterCostCenterIDs = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalCostCenters, rows: costCenters } =
      await CostCenterIDModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCostCenters,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCostCenters / limit),
      costCenters,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering cost center IDs", error: error.message });
  }
};

const exportFilteredCostCenterIDsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: costCenters } = await CostCenterIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!costCenters || costCenters.length === 0) {
      return res.status(404).json({
        message: "No cost center IDs found matching the filters",
      });
    }

    const costCentersData = costCenters.map((costCenter) => {
      return {
        costCenterId: costCenter.id,
        cost_center_name: costCenter.cost_center_name,
        status: costCenter.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(costCentersData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_cost_center_ids.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting cost center IDs to CSV:", error);
    res.status(500).json({
      message: "Error exporting cost center IDs to CSV",
      error: error.message,
    });
  }
};

const exportFilteredCostCenterIDsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: costCenters } = await CostCenterIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!costCenters || costCenters.length === 0) {
      return res
        .status(404)
        .json({ message: "No cost center IDs found matching the filters" });
    }

    const costCentersData = costCenters.map((costCenter) => {
      return [
        costCenter.id || "N/A",
        costCenter.cost_center_name || "N/A",
        costCenter.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Cost Center IDs Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Cost Center ID", "Cost Center Name", "Status"],
              ...costCentersData,
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
    res.attachment("cost_center_ids_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting cost center IDs to PDF:", error);
    res.status(500).json({
      message: "Error exporting cost center IDs to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createCostCenterID,
  updateCostCenterID,
  deleteCostCenterID,
  getCostCenterIDById,
  getAllCostCenterIDs,
  filterCostCenterIDs,
  exportFilteredCostCenterIDsToCSV,
  exportFilteredCostCenterIDsToPDF,
};