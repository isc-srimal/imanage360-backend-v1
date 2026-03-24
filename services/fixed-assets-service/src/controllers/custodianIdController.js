const CustodianIDModel = require("../models/CustodianIDModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createCustodianID = async (req, res) => {
  const { custodian_name, status = "Active" } = req.body;

  try {
    const custodian = await CustodianIDModel.create({
      custodian_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Custodian ID created successfully", custodian });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCustodianID = async (req, res) => {
  const { id } = req.params;
  const { custodian_name, status } = req.body;

  try {
    const custodianToUpdate = await CustodianIDModel.findByPk(id);

    if (!custodianToUpdate) {
      return res.status(404).json({ message: "Custodian ID not found" });
    }

    custodianToUpdate.custodian_name = custodian_name || custodianToUpdate.custodian_name;
    custodianToUpdate.status = status || custodianToUpdate.status;

    await custodianToUpdate.save();
    res.status(200).json({
      message: "Custodian ID updated successfully",
      custodian: custodianToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating custodian ID", error: error.message });
  }
};

const deleteCustodianID = async (req, res) => {
  const { id } = req.params;

  try {
    const custodianToDelete = await CustodianIDModel.findByPk(id);

    if (!custodianToDelete) {
      return res.status(404).json({ message: "Custodian ID not found" });
    }

    await custodianToDelete.destroy();
    res.status(200).json({ message: "Custodian ID deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting custodian ID", error: error.message });
  }
};

const getCustodianIDById = async (req, res) => {
  try {
    const { id } = req.params;
    const custodian = await CustodianIDModel.findByPk(id);

    if (!custodian) {
      return res.status(404).json({ message: "Custodian ID not found" });
    }

    res.status(200).json(custodian);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving custodian ID", error: error.message });
  }
};

const getAllCustodianIDs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCustodians, rows: custodians } =
      await CustodianIDModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCustodians,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCustodians / limit),
      custodians,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving custodian IDs", error: error.message });
  }
};

const filterCustodianIDs = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalCustodians, rows: custodians } =
      await CustodianIDModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCustodians,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCustodians / limit),
      custodians,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering custodian IDs", error: error.message });
  }
};

const exportFilteredCustodianIDsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: custodians } = await CustodianIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!custodians || custodians.length === 0) {
      return res.status(404).json({
        message: "No custodian IDs found matching the filters",
      });
    }

    const custodiansData = custodians.map((custodian) => {
      return {
        custodianId: custodian.id,
        custodian_name: custodian.custodian_name,
        status: custodian.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(custodiansData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_custodian_ids.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting custodian IDs to CSV:", error);
    res.status(500).json({
      message: "Error exporting custodian IDs to CSV",
      error: error.message,
    });
  }
};

const exportFilteredCustodianIDsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: custodians } = await CustodianIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!custodians || custodians.length === 0) {
      return res
        .status(404)
        .json({ message: "No custodian IDs found matching the filters" });
    }

    const custodiansData = custodians.map((custodian) => {
      return [
        custodian.id || "N/A",
        custodian.custodian_name || "N/A",
        custodian.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Custodian IDs Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["ID", "Custodian Name", "Status"],
              ...custodiansData,
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
    res.attachment("custodian_ids_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting custodian IDs to PDF:", error);
    res.status(500).json({
      message: "Error exporting custodian IDs to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createCustodianID,
  updateCustodianID,
  deleteCustodianID,
  getCustodianIDById,
  getAllCustodianIDs,
  filterCustodianIDs,
  exportFilteredCustodianIDsToCSV,
  exportFilteredCustodianIDsToPDF,
};