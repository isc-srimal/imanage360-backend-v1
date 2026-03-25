const commission = require("../models/CommissionModel");
const payrolls = require("../models/PayrollModel");
const employees = require("../models/employees/EmployeeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const moment = require("moment");
const { Op, where: whereClause, literal } = require("sequelize");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createCommission = async (req, res) => {
  const { month, reason, amount, status = "Active", employeeName, employeeId } = req.body;

  try {
    // Validate month is one of the month names
    const validMonths = moment.months(); // ["January", "February", ..., "December"]
    if (!validMonths.includes(month)) {
      return res.status(400).json({ error: "Invalid month name." });
    }

    // Get current year and build payroll month string YYYY-MM from month name
    const now = moment();
    const currentYear = now.year();

    // Convert month name to month number (0-based)
    const monthIndex = validMonths.indexOf(month); // e.g., "May" -> 4

    // Build YYYY-MM string for payroll check
    const payrollMonth = moment()
      .year(currentYear)
      .month(monthIndex)
      .format("YYYY-MM");

    // Check if month is past (before current month)
    // Commissions for past months not allowed
    const currentMonthIndex = now.month();
    if (monthIndex < currentMonthIndex) {
      return res.status(400).json({
        error: "Cannot add commission for past months.",
      });
    }

    // Step 2: Find the employee by fullNameEnglish from personalDetails
    const employee = await employees.findOne({
      where: {
        personalDetails: {
          fullNameEnglish: employeeName,
        },
      },
    });

    if (!employee) {
      return res
        .status(404)
        .json({ error: "Employee not found with that name." });
    }

    // Step 3: Check for locked payroll for same month and employee ID
    const lockedPayroll = await payrolls.findOne({
      where: {
        employeeId: employee.id,
        month: payrollMonth, // Use "YYYY-MM" here
        status: "Locked",
      },
    });

    if (lockedPayroll) {
      return res.status(400).json({
        error:
          "Cannot add commission. Payroll is already locked for this month.",
      });
    }

    // Step 4: Create commission record with full month name
    const newCommission = await commission.create({
      month, // e.g., "May"
      reason,
      amount,
      status,
      employeeName, // Or better: employeeId: employee.id (recommended)
      employeeId,
    });

    res.status(201).json({
      message: "Commission created successfully",
      commission: newCommission,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
const updateCommissions = async (req, res) => {
  const { id } = req.params;
  const { month, reason, amount, status, employeeName, payrollId } = req.body;

  try {
    const commissionsToUpdate = await commission.findByPk(id);

    if (!commissionsToUpdate) {
      return res.status(404).json({ message: "Commission not found" });
    }

    commissionsToUpdate.month = month || commissionsToUpdate.month;
    commissionsToUpdate.reason = reason || commissionsToUpdate.reason;
    commissionsToUpdate.amount = amount || commissionsToUpdate.amount;
    commissionsToUpdate.status = status || commissionsToUpdate.status;
    commissionsToUpdate.employeeName =
      employeeName || commissionsToUpdate.employeeName;
    commissionsToUpdate.payrollId = payrollId || commissionsToUpdate.payrollId;

    await commissionsToUpdate.save();
    res.status(200).json({
      message: "Commission updated successfully",
      commissions: commissionsToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating commission", error: error.message });
  }
};

const deleteCommission = async (req, res) => {
  const { id } = req.params;

  try {
    const commissionsToDelete = await commission.findByPk(id);

    if (!commissionsToDelete) {
      return res.status(404).json({ message: "Commission not found" });
    }

    await commissionsToDelete.destroy();
    res.status(200).json({ message: "Commission deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting commission", error: error.message });
  }
};

const getCommissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const commissions = await commission.findByPk(id, {
      include: [
        {
          model: payrolls,
          as: "payrolls",
        },
        {
          model: employees,
          as: "employee",
        },
      ],
    });

    if (!commissions) {
      return res.status(404).json({ message: "Commission not found" });
    }

    res.status(200).json(commissions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving commission", error: error.message });
  }
};

const getAllCommissions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCommissions, rows: commissions } =
      await commission.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: payrolls,
            as: "payrolls",
          },
          {
            model: employees,
            as: "employee",
          },
        ],
      });

    res.status(200).json({
      totalCommissions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCommissions / limit),
      commissions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving commissions",
      error: error.message,
    });
  }
};

const filterCommissions = async (req, res) => {
  try {
    const {
      status = "All",
      month = "All",
      designation = "All",
      qidNumber = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (month !== "All") {
      where["month"] = month;
    }

    const employeeWhere = {};

    if (designation !== "All") {
      employeeWhere[Op.and] = [
        whereClause(
          literal("JSON_UNQUOTE(JSON_EXTRACT(`employee`.`otherDetails`, '$.designation'))"),
          designation
        ),
      ];
    }

    if (qidNumber !== "All") {
      if (!employeeWhere[Op.and]) employeeWhere[Op.and] = [];
      employeeWhere[Op.and].push(
        whereClause(
          literal("JSON_UNQUOTE(JSON_EXTRACT(`employee`.`personalDetails`, '$.qidNumber'))"),
          qidNumber
        )
      );
    }

    const { count: totalCommissions, rows: commissions } =
      await commission.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: payrolls,
            as: "payrolls",
          },
          {
            model: employees,
            as: "employee",
            where: Object.keys(employeeWhere).length > 0 ? employeeWhere : undefined,
          },
        ],
      });

    res.status(200).json({
      totalCommissions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCommissions / limit),
      commissions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering commissions", error: error.message });
  }
};

const exportFilteredCommissionsToCSV = async (req, res) => {
  try {
    const {
      status = "All",
      month = "All",
      designation = "All",
      qidNumber = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (month !== "All") {
      where["month"] = month;
    }

    if (designation !== "All") where["otherDetails.designation"] = designation;

    if (qidNumber !== "All") where["personalDetails.qidNumber"] = qidNumber;

    const { rows: commissions } = await commission.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: payrolls,
          as: "payrolls",
        },
        {
          model: employees,
          as: "employee",
        },
      ],
    });

    console.log(commissions);

    if (!commissions || commissions.length === 0) {
      return res.status(404).json({
        message: "No commissions found matching the filters",
      });
    }

    const commissionsData = commissions.map((commissionz) => {
      return {
        commissionsId: commissionz.id,
        month: commissionz.month,
        reason: commissionz.reason,
        amount: commissionz.amount,
        status: commissionz.status,
        payrollId: commissionz.payrollId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(commissionsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_commissions.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting commissions to CSV:", error);
    res.status(500).json({
      message: "Error exporting commissions to CSV",
      error: error.message,
    });
  }
};

const exportFilteredCommissionsToPDF = async (req, res) => {
  try {
    const {
      status = "All",
      month = "All",
      designation = "All",
      qidNumber = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    if (month !== "All") {
      where["month"] = month;
    }

    if (designation !== "All") where["otherDetails.designation"] = designation;

    if (qidNumber !== "All") where["personalDetails.qidNumber"] = qidNumber;

    const { rows: commissions } = await commission.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: payrolls,
          as: "payrolls",
        },
        {
          model: employees,
          as: "employee",
        },
      ],
    });

    if (!commissions || commissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No commissions found matching the filters" });
    }

    const commissionsData = commissions.map((commissionz) => {
      return [
        commissionz.id || "N/A",
        commissionz.month || "N/A",
        commissionz.reason || "N/A",
        commissionz.amount || "N/A",
        commissionz.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Commissions Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*"],
            body: [
              ["Commissions ID", "Month", "Reason", "Amount", "Status"],
              ...commissionsData,
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
    res.attachment("commissions_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting commissions to PDF:", error);
    res.status(500).json({
      message: "Error exporting commissions to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createCommission,
  updateCommissions,
  deleteCommission,
  getCommissionById,
  getAllCommissions,
  filterCommissions,
  exportFilteredCommissionsToCSV,
  exportFilteredCommissionsToPDF,
};
