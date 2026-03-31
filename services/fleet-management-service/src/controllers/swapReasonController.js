const SwapReason = require("../models/swapReasonModel");
const { Op } = require("sequelize");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");


const getSwapReasonsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ 
        message: "Category parameter is required" 
      });
    }

    const swapReasons = await SwapReason.findAll({
      where: { 
        category,
        status: "Active"
      },
      attributes: ["swap_reason_id", "swap_reason_name", "category"],
      order: [["swap_reason_name", "ASC"]]
    });

    res.status(200).json({
      success: true,
      swapReasons
    });
  } catch (error) {
    console.error("Error retrieving swap reasons by category:", error);
    res.status(500).json({ 
      message: "Error retrieving swap reasons", 
      error: error.message 
    });
  }
};

const createSwapReason = async (req, res) => {
  const { swap_reason_name, category, status = "Active" } = req.body;

  try {
    // Check if swap reason already exists
    const existingReason = await SwapReason.findOne({
      where: { swap_reason_name }
    });

    if (existingReason) {
      return res.status(400).json({ 
        message: "Swap reason with this name already exists" 
      });
    }

    const swapReason = await SwapReason.create({
      swap_reason_name,
      category,
      status,
    });

    res.status(201).json({ 
      message: "Swap reason created successfully", 
      swapReason 
    });
  } catch (error) {
    console.error("Error creating swap reason:", error);
    res.status(500).json({ 
      error: error.message 
    });
  }
};

const updateSwapReason = async (req, res) => {
  const { id } = req.params;
  const { swap_reason_name, category, status } = req.body;

  try {
    const swapReasonToUpdate = await SwapReason.findByPk(id);

    if (!swapReasonToUpdate) {
      return res.status(404).json({ 
        message: "Swap reason not found" 
      });
    }

    // Check for duplicate name (excluding current record)
    if (swap_reason_name && swap_reason_name !== swapReasonToUpdate.swap_reason_name) {
      const existingReason = await SwapReason.findOne({
        where: { 
          swap_reason_name,
          swap_reason_id: { [Op.ne]: id }
        }
      });

      if (existingReason) {
        return res.status(400).json({ 
          message: "Swap reason with this name already exists" 
        });
      }
    }

    swapReasonToUpdate.swap_reason_name = swap_reason_name || swapReasonToUpdate.swap_reason_name;
    swapReasonToUpdate.category = category || swapReasonToUpdate.category;
    swapReasonToUpdate.status = status || swapReasonToUpdate.status;

    await swapReasonToUpdate.save();
    res.status(200).json({
      message: "Swap reason updated successfully",
      swapReason: swapReasonToUpdate,
    });
  } catch (error) {
    console.error("Error updating swap reason:", error);
    res.status(500).json({ 
      message: "Error updating swap reason", 
      error: error.message 
    });
  }
};

const deleteSwapReason = async (req, res) => {
  const { id } = req.params;

  try {
    const swapReasonToDelete = await SwapReason.findByPk(id);

    if (!swapReasonToDelete) {
      return res.status(404).json({ 
        message: "Swap reason not found" 
      });
    }

    await swapReasonToDelete.destroy();
    res.status(200).json({ 
      message: "Swap reason deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting swap reason:", error);
    res.status(500).json({ 
      message: "Error deleting swap reason", 
      error: error.message 
    });
  }
};

const getSwapReasonById = async (req, res) => {
  try {
    const { id } = req.params;
    const swapReason = await SwapReason.findByPk(id);

    if (!swapReason) {
      return res.status(404).json({ 
        message: "Swap reason not found" 
      });
    }

    res.status(200).json(swapReason);
  } catch (error) {
    console.error("Error retrieving swap reason:", error);
    res.status(500).json({ 
      message: "Error retrieving swap reason", 
      error: error.message 
    });
  }
};

const getAllSwapReasons = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSwapReasons, rows: swapReasons } =
      await SwapReason.findAndCountAll({
        offset,
        limit: parseInt(limit),
        order: [['swap_reason_id', 'DESC']]
      });

    res.status(200).json({
      totalSwapReasons,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSwapReasons / limit),
      swapReasons,
    });
  } catch (error) {
    console.error("Error retrieving swap reasons:", error);
    res.status(500).json({ 
      message: "Error retrieving swap reasons", 
      error: error.message 
    });
  }
};

const filterSwapReasons = async (req, res) => {
  try {
    const { 
      status = "All", 
      category,
      searchTerm = "",
      page = 1, 
      limit = 10 
    } = req.query;
    
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    // Status filter
    if (status !== "All") {
      where["status"] = status;
    }

    // Category filter
    if (category) {
      where["category"] = category;
    }

    // Search term filter
    if (searchTerm) {
      where["swap_reason_name"] = {
        [Op.like]: `%${searchTerm}%`
      };
    }

    const { count: totalSwapReasons, rows: swapReasons } =
      await SwapReason.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        order: [['swap_reason_id', 'DESC']]
      });

    res.status(200).json({
      totalSwapReasons,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSwapReasons / limit),
      swapReasons,
    });
  } catch (error) {
    console.error("Error filtering swap reasons:", error);
    res.status(500).json({ 
      message: "Error filtering swap reasons", 
      error: error.message 
    });
  }
};

const exportFilteredSwapReasonsToCSV = async (req, res) => {
  try {
    const { 
      status = "All", 
      category,
      searchTerm = ""
    } = req.query;

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (category) {
      where["category"] = category;
    }

    if (searchTerm) {
      where["swap_reason_name"] = {
        [Op.like]: `%${searchTerm}%`
      };
    }

    const swapReasons = await SwapReason.findAll({
      where,
      order: [['swap_reason_id', 'DESC']]
    });

    if (!swapReasons || swapReasons.length === 0) {
      return res.status(404).json({
        message: "No swap reasons found matching the filters",
      });
    }

    const swapReasonsData = swapReasons.map((reason) => {
      return {
        swapReasonId: reason.swap_reason_id,
        swapReasonName: reason.swap_reason_name,
        category: reason.category,
        status: reason.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(swapReasonsData);

    res.header("Content-Type", "text/csv");
    res.attachment("swap_reasons_data.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting swap reasons to CSV:", error);
    res.status(500).json({
      message: "Error exporting swap reasons to CSV",
      error: error.message,
    });
  }
};

const exportFilteredSwapReasonsToPDF = async (req, res) => {
  try {
    const { 
      status = "All", 
      category,
      searchTerm = ""
    } = req.query;

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (category) {
      where["category"] = category;
    }

    if (searchTerm) {
      where["swap_reason_name"] = {
        [Op.like]: `%${searchTerm}%`
      };
    }

    const swapReasons = await SwapReason.findAll({
      where,
      order: [['swap_reason_id', 'DESC']]
    });

    if (!swapReasons || swapReasons.length === 0) {
      return res.status(404).json({ 
        message: "No swap reasons found matching the filters" 
      });
    }

    const swapReasonsData = swapReasons.map((reason) => {
      return [
        reason.swap_reason_id || "N/A",
        reason.swap_reason_name || "N/A",
        reason.category || "N/A",
        reason.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Swap Reasons Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*"],
            body: [
              ["ID", "Swap Reason Name", "Category", "Status"],
              ...swapReasonsData,
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
        fontSize: 10,
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
    res.attachment("swap_reasons_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting swap reasons to PDF:", error);
    res.status(500).json({
      message: "Error exporting swap reasons to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createSwapReason,
  updateSwapReason,
  deleteSwapReason,
  getSwapReasonById,
  getAllSwapReasons,
  filterSwapReasons,
  exportFilteredSwapReasonsToCSV,
  exportFilteredSwapReasonsToPDF,
  getSwapReasonsByCategory,
};