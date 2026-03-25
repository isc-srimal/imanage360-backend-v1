const Employee = require("../models/employees/EmployeeModel");
const LoanApproval = require("../models/LoanApprovalModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createLoanApproval = async (req, res) => {
  const {
    loanAmount,
    loanType,
    loanTerm,
    reason,
    status = "pending",
    approvedBy,
    approvalDate,
    monthlyDeduction,
    deductionStartMonth,
    employeeId,
  } = req.body;

  try {
    const loan = await LoanApproval.create({
      loanAmount,
      loanType,
      loanTerm,
      reason,
      status,
      approvedBy,
      approvalDate,
      monthlyDeduction,
      deductionStartMonth,
      employeeId,
    });

    res
      .status(201)
      .json({ message: "Loan approval created successfully", loan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLoanApproval = async (req, res) => {
  const { id } = req.params;
  const {
    loanAmount,
    loanType,
    loanTerm,
    reason,
    status,
    approvedBy,
    approvalDate,
    monthlyDeduction,
    deductionStartMonth,
    employeeId,
  } = req.body;

  try {
    const loanToUpdate = await LoanApproval.findByPk(id);

    if (!loanToUpdate) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    loanToUpdate.loanAmount = loanAmount || loanToUpdate.loanAmount;
    loanToUpdate.loanType = loanType || loanToUpdate.loanType;
    loanToUpdate.loanTerm = loanTerm || loanToUpdate.loanTerm;
    loanToUpdate.reason = reason || loanToUpdate.reason;
    loanToUpdate.status = status || loanToUpdate.status;
    loanToUpdate.approvedBy = approvedBy || loanToUpdate.approvedBy;
    loanToUpdate.approvalDate = approvalDate || loanToUpdate.approvalDate;
    loanToUpdate.monthlyDeduction =
      monthlyDeduction || loanToUpdate.monthlyDeduction;
    loanToUpdate.deductionStartMonth =
      deductionStartMonth || loanToUpdate.deductionStartMonth;
    loanToUpdate.employeeId = employeeId || loanToUpdate.employeeId;

    await loanToUpdate.save();
    res.status(200).json({
      message: "Loan data updated successfully",
      loan: loanToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating loan data", error: error.message });
  }
};

const deleteLoanApproval = async (req, res) => {
  const { id } = req.params;

  try {
    const loanToDelete = await LoanApproval.findByPk(id);

    if (!loanToDelete) {
      return res.status(404).json({ message: "Loan data not found" });
    }

    await loanToDelete.destroy();
    res.status(200).json({ message: "Loan data deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting loan data", error: error.message });
  }
};

const getLoanApprovalById = async (req, res) => {
  try {
    const { id } = req.params;
    const loan = await LoanApproval.findByPk(id, {
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
    res
      .status(500)
      .json({ message: "Error retrieving loan data", error: error.message });
  }
};

const getAllLoanApprovals = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalLoans, rows: loans } =
      await LoanApproval.findAndCountAll({
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
      .json({ message: "Error retrieving loan data", error: error.message });
  }
};

const approveLoan = async (req, res) => {
  const { id } = req.params;
  const { approvedBy, monthlyDeduction, deductionStartMonth } = req.body;

  try {
    const loan = await LoanApproval.findByPk(id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending loans can be approved" });
    }

    loan.status = "approved";
    loan.approvedBy = approvedBy;
    loan.approvalDate = new Date();
    loan.monthlyDeduction = monthlyDeduction;
    loan.deductionStartMonth = deductionStartMonth;

    await loan.save();

    res.status(200).json({ message: "Loan approved successfully", loan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving loan", error: error.message });
  }
};

const rejectLoan = async (req, res) => {
  const { id } = req.params;
  const { rejectedBy } = req.body;

  try {
    const loan = await LoanApproval.findByPk(id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    if (loan.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending loans can be rejected" });
    }

    loan.status = "rejected";
    loan.approvedBy = rejectedBy;
    loan.approvalDate = new Date();

    await loan.save();

    res.status(200).json({ message: "Loan rejected successfully", loan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting loan", error: error.message });
  }
};

const filterLoanApproval = async (req, res) => {
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
      await LoanApproval.findAndCountAll({
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

const exportFilteredLoanApprovalToCSV = async (req, res) => {
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

    const { rows: loans } = await LoanApproval.findAndCountAll({
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
        approvedBy: loanz.approvedBy,
        approvalDate: loanz.approvalDate,
        monthlyDeduction: loanz.monthlyDeduction,
        deductionStartMonth: loanz.deductionStartMonth,
        employeeId: loanz.employeeId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(loansData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_approval_loans.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting loans to CSV:", error);
    res.status(500).json({
      message: "Error exporting loans to CSV",
      error: error.message,
    });
  }
};

const exportFilteredLoanApprovalToPDF = async (req, res) => {
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

    const { rows: loans } = await LoanApproval.findAndCountAll({
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
        { text: "Approval Loans Data", style: "header" },
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
    res.attachment("approval_loans_data.pdf");

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
  createLoanApproval,
  updateLoanApproval,
  deleteLoanApproval,
  getLoanApprovalById,
  getAllLoanApprovals,
  approveLoan,
  rejectLoan,
  filterLoanApproval,
  exportFilteredLoanApprovalToCSV,
  exportFilteredLoanApprovalToPDF,
};
