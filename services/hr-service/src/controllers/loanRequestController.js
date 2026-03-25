const Employee = require("../models/employees/EmployeeModel");
const Loan = require("../models/LoanRequestModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createLoan = async (req, res) => {
  const {
    loanAmount,
    loanType,
    loanTerm,
    reason,
    status = 'pending',
    monthlyDeduction,
    deductionStartMonth,
    employeeId
  } = req.body;

  try {
    const loan = await Loan.create({
      loanAmount,
      loanType,
      loanTerm,
      reason,
      status,
      monthlyDeduction,
      deductionStartMonth,
      employeeId,
    });

    res.status(201).json({ message: "Loan request created successfully", loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLoan = async (req, res) => {
  const { id } = req.params;
  const {
    loanAmount,
    loanType,
    loanTerm,
    reason,
    status,
    monthlyDeduction,
    deductionStartMonth,
    employeeId,
  } = req.body;

  try {
    const loanToUpdate = await Loan.findByPk(id);

    if (!loanToUpdate) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    loanToUpdate.loanAmount = loanAmount || loanToUpdate.loanAmount;
    loanToUpdate.loanType = loanType || loanToUpdate.loanType;
    loanToUpdate.loanTerm = loanTerm || loanToUpdate.loanTerm;
    loanToUpdate.reason = reason || loanToUpdate.reason;
    loanToUpdate.status = status || loanToUpdate.status;
    loanToUpdate.monthlyDeduction = monthlyDeduction || loanToUpdate.monthlyDeduction;
    loanToUpdate.deductionStartMonth = deductionStartMonth || loanToUpdate.deductionStartMonth;
    loanToUpdate.employeeId = employeeId || loanToUpdate.employeeId;

    await loanToUpdate.save();
    res.status(200).json({
      message: "Loan data updated successfully",
      loan: loanToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating loan data", error: error.message });
  }
};

const deleteLoan = async (req, res) => {
  const { id } = req.params;

  try {
    const loanToDelete = await Loan.findByPk(id);

    if (!loanToDelete) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    await loanToDelete.destroy();
    res.status(200).json({ message: "Loan data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting loan data", error: error.message });
  }
};

const getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await Loan.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving loan data", error: error.message });
  }
};

const getAllLoans = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalLoans, rows: loans } = await Loan.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    res.status(200).json({
      totalLoans,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLoans / limit),
      loans,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving loan data", error: error.message });
  }
};


const filterLoans = async (req, res) => {
  try {
    const {
      status = "All",
      loanType = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (loanType !== "All") {
      where["loanType"] = loanType;
    }

    const { count: totalLoans, rows: loans } =
      await Loan.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: {
          model: Employee,
          as: "employee",
        },
      });

    res.status(200).json({
      totalLoans,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLoans / limit),
      loans,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering loans", error: error.message });
  }
};

const exportFilteredLoansToCSV = async (req, res) => {
  try {
    const {
      status = "All",
      loanType = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (loanType !== "All") {
      where["loanType"] = loanType;
    }

    const { rows: loans } = await Loan.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    console.log(loans);

    if (!loans || loans.length === 0) {
      return res.status(404).json({
        message: "No loans found matching the filters",
      });
    }

    const loansData = loans.map((loanz) => {
      return {
        loanId: loanz.id,
        loanAmount: loanz.loanAmount,
        loanType: loanz.loanType,
        loanTerm: loanz.loanTerm,
        reason: loanz.reason,
        status: loanz.status,
        monthlyDeduction: loanz.monthlyDeduction,
        deductionStartMonth: loanz.deductionStartMonth,
        employeeId: loanz.employeeId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(loansData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_request_loans.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting loans to CSV:", error);
    res.status(500).json({
      message: "Error exporting loans to CSV",
      error: error.message,
    });
  }
};

const exportFilteredLoansToPDF = async (req, res) => {
  try {
    const {
      status = "All",
      loanType = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (loanType !== "All") {
      where["loanType"] = loanType;
    }

    const { rows: loans } = await Loan.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!loans || loans.length === 0) {
      return res
        .status(404)
        .json({ message: "No loans found matching the filters" });
    }

    const loansData = loans.map((loanz) => {
      return [
        loanz.id || "N/A",
        loanz.loanAmount || "N/A",
        loanz.loanType || "N/A",
        loanz.status || "N/A",
        loanz.monthlyDeduction || "N/A",
        loanz.employeeId || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Request Loans Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Loan ID",
                "Loan Amount",
                "Loan Type",
                "Status",
                "Monthly Deduction",
                "Employee ID",
              ],
              ...loansData,
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
    res.attachment("request_loans_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting loans to PDF:", error);
    res.status(500).json({
      message: "Error exporting loans to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createLoan,
  updateLoan,
  deleteLoan,
  getLoanById,
  getAllLoans,
  filterLoans,
  exportFilteredLoansToCSV,
  exportFilteredLoansToPDF,
};