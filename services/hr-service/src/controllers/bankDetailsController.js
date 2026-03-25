const bankDetails = require("../models/BankDetailsModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createBankDetail = async (req, res) => {
  const { bankName, status = "Active" } = req.body;

  try {
    const bank = await bankDetails.create({
      bankName,
      status,
    });

    res.status(201).json({ message: "Bank detail created successfully", bank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBankDetails = async (req, res) => {
  const { id } = req.params;
  const { bankName, status } = req.body;

  try {
    const bankToUpdate = await bankDetails.findByPk(id);

    if (!bankToUpdate) {
      return res.status(404).json({ message: "Bank detail not found" });
    }

    bankToUpdate.bankName = bankName || bankToUpdate.bankName;
    bankToUpdate.status = status || bankToUpdate.status;

    await bankToUpdate.save();
    res.status(200).json({
      message: "Bank detail updated successfully",
      bank: bankToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating bank detail", error: error.message });
  }
};

const deleteBankDetail = async (req, res) => {
  const { id } = req.params;

  try {
    const bankToDelete = await bankDetails.findByPk(id);

    if (!bankToDelete) {
      return res.status(404).json({ message: "Bank detail not found" });
    }

    await bankToDelete.destroy();
    res.status(200).json({ message: "Bank detail deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting bank detail", error: error.message });
  }
};

const getBankDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const bank = await bankDetails.findByPk(id);

    if (!bank) {
      return res.status(404).json({ message: "Bank detail not found" });
    }

    res.status(200).json(bank);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving bank detail", error: error.message });
  }
};

const getAllBankDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalBankDetails, rows: bank } =
      await bankDetails.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalBankDetails,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBankDetails / limit),
      bank,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving bank details", error: error.message });
  }
};

const filterBankDetails = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalBankDetails, rows: bank } =
      await bankDetails.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalBankDetails,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBankDetails / limit),
      bank,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering bank details", error: error.message });
  }
};

const exportFilteredBankDetailsToCSV = async (req, res) => {
  try {
    const {
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: bank } = await bankDetails.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(bank);

    if (!bank || bank.length === 0) {
      return res.status(404).json({
        message: "No bank details found matching the filters",
      });
    }

    const bankDetailsData = bank.map((bankz) => {
      return {
        bankDetailsId: bankz.id,
        bankName: bankz.bankName,
        status: bankz.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(bankDetailsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_bank_details.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting bank details to CSV:", error);
    res.status(500).json({
      message: "Error exporting bank details to CSV",
      error: error.message,
    });
  }
};

const exportFilteredBankDetailsToPDF = async (req, res) => {
  try {
    const {
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: bank } = await bankDetails.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!bank || bank.length === 0) {
      return res
        .status(404)
        .json({ message: "No bank details found matching the filters" });
    }

    const bankDetailsData = bank.map((bankz) => {
      return [
        bankz.id || "N/A",
        bankz.bankName || "N/A",
        bankz.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Bank Details Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*"],
            body: [
              [
                "Bank Details ID",
                "Bank Name",
                "Status",
              ],
              ...bankDetailsData,
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
    res.attachment("bank_details_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting bank details to PDF:", error);
    res.status(500).json({
      message: "Error exporting bank details to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createBankDetail,
  updateBankDetails,
  deleteBankDetail,
  getBankDetailById,
  getAllBankDetails,
  filterBankDetails,
  exportFilteredBankDetailsToCSV,
  exportFilteredBankDetailsToPDF,
};
