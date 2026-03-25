const Employee = require("../models/employees/EmployeeModel");
const Payroll = require("../models/PayrollModel");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const SettingsModel = require("../models/SettingsModel");
const CommissionModel = require("../models/CommissionModel");
const PayrollDetailsModel = require("../models/employees/EmployeePayrollModel");
const { Op } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const moment = require("moment");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const cron = require("node-cron");
const jwt = require("jsonwebtoken");
const { schedulePayrollCalculation } = require("../../cronJobs/payrollScheduler");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createPayroll = async (req, res) => {
  const {
    salaryAmount,
    accommodationAllowance,
    foodAllowance,
    transportationAllowance,
    nationalAccreditationBonus,
    natureOfWorkAllowance,
    socialBonus,
    relocationAllowance,
    otherBonuses,
    deductions,
    totalSalary,
    paymentMethod,
    paymentDate,
    isApproved = 'pending',
    approvedBy,
    approvalDate,
    employeeId,
  } = req.body;

  try {
    const payroll = await Payroll.create({
      salaryAmount,
      accommodationAllowance,
      foodAllowance,
      transportationAllowance,
      nationalAccreditationBonus,
      natureOfWorkAllowance,
      socialBonus,
      relocationAllowance,
      otherBonuses,
      deductions,
      totalSalary,
      paymentMethod,
      paymentDate,
      isApproved,
      approvedBy,
      approvalDate,
      employeeId,
    });

    res.status(201).json({ message: "Payroll created successfully", payroll });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePayroll = async (req, res) => {
  const { id } = req.params;

  try {
    const payrollToDelete = await Payroll.findByPk(id);

    if (!payrollToDelete) {
      return res.status(404).json({ message: "Payroll data not found" });
    }

    await payrollToDelete.destroy();
    res.status(200).json({ message: "Payroll deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting payroll", error: error.message });
  }
};

const getPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll data not found" });
    }

    res.status(200).json(payroll);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payroll data", error: error.message });
  }
};

const getAllPayrolls = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalPayrolls, rows: payrolls } =
      await Payroll.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: {
          model: Employee,
          as: "employee",
        },
      });

    res.status(200).json({
      totalPayrolls,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPayrolls / limit),
      payrolls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving payrolls data",
      error: error.message,
    });
  }
};

const updatePayrollDeduction = async (req, res) => {
  const { id } = req.params;
  const { deductions, paymentMethod, paymentDate, totalSalary } = req.body;

  try {
    // Validate required fields
    if (deductions === undefined || !paymentMethod || !paymentDate) {
      return res.status(400).json({ message: "Deductions, payment method, and payment date are required" });
    }

    // Validate numeric fields
    if (isNaN(parseFloat(deductions)) || isNaN(parseFloat(totalSalary))) {
      return res.status(400).json({ message: "Deductions and total salary must be valid numbers" });
    }

    // Validate paymentMethod
    const validPaymentMethods = ['cash', 'cheque', 'debit'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Validate paymentDate format
    if (isNaN(Date.parse(paymentDate))) {
      return res.status(400).json({ message: "Invalid payment date format" });
    }

    const payroll = await Payroll.findByPk(id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    // Update fields
    payroll.deductions = parseFloat(deductions);
    payroll.paymentMethod = paymentMethod;
    payroll.paymentDate = new Date(paymentDate);
    payroll.totalSalary = parseFloat(totalSalary);

    await payroll.save();

    res.status(200).json({
      message: "Payroll updated successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating payroll",
      error: error.message,
    });
  }
};

const approvePayroll = async (req, res) => {
  const { id } = req.params;
  const { approverId } = req.body;

  try {
    const payroll = await Payroll.findByPk(id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll data not found" });
    }

    if (payroll.isApproved !== "pending") {
      return res.status(400).json({ message: "Payroll is already processed" });
    }

    payroll.isApproved = "approved";
    payroll.approvedBy = approverId; 
    payroll.approvalDate = new Date(); 

    await payroll.save();

    res.status(200).json({
      message: "Payroll approved successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error approving payroll",
      error: error.message,
    });
  }
};

const rejectPayroll = async (req, res) => {
  const { id } = req.params;
  const { approverId } = req.body;

  try {
    const payroll = await Payroll.findByPk(id);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll data not found" });
    }

    if (payroll.isApproved !== "pending") {
      return res.status(400).json({ message: "Payroll is already processed" });
    }

    payroll.isApproved = "rejected";
    payroll.approvedBy = approverId;
    payroll.approvalDate = new Date();

    await payroll.save();

    res.status(200).json({
      message: "Payroll rejected successfully",
      payroll,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting payroll",
      error: error.message,
    });
  }
};

const calculatePayrollForAllEmployees = async (month, year) => {
  if (!month || !year) {
    throw new Error("Month and year are required.");
  }

  // Format paymentDate for payroll record (e.g., last day of month)
  const paymentDate = moment(`${year}-${month}-01`).endOf("month").format("YYYY-MM-DD");

  // Check if payroll is already locked (approved) for this month
  const lockedPayroll = await Payroll.findOne({
    where: { paymentDate, isApproved: "approved" },
  });
  if (lockedPayroll) {
    throw new Error("Payroll is locked for this month.");
  }

  // Fetch all active employees with their payroll details
  const employees = await Employee.findAll({
    include: [
      {
        model: PayrollDetailsModel,
        as: "payrollDetails",
        required: false, // Allow employees without payroll details
      },
    ],
    where: { "otherDetails.status": "Active" }, // Ensure only active employees are fetched
  });

  if (!employees.length) {
    throw new Error("No active employees found.");
  }

  // Fetch global payroll settings for fallback values
  const settings = await SettingsModel.findOne();

  // Clear existing payrolls for the month to prevent duplicates
  await Payroll.destroy({ where: { paymentDate } });

  // Loop over employees and calculate payroll
  for (const employee of employees) {
    const payrollDetail = employee.payrollDetails && employee.payrollDetails.length > 0 
      ? employee.payrollDetails[0] 
      : {};

    const basicSalary = payrollDetail.basicSalary || settings?.basicSalary || 0;
    const accommodationAllowance = payrollDetail.fullPackageAllowance || settings?.fullPackageAllowance || 0;
    const foodAllowance = payrollDetail.fullPackageFoodAllowance || settings?.fullPackageFoodAllowance || 0;
    const transportationAllowance = payrollDetail.fullPackageTransportationAllowance || settings?.fullPackageTransportationAllowance || 0;
    const nationalAccreditationBonus = payrollDetail.nationalAccreditationBonus || settings?.nationalAccreditationBonus || 0;
    const natureOfWorkAllowance = payrollDetail.natureOfWorkAllowance || settings?.natureOfWorkAllowance || 0;
    const socialBonus = payrollDetail.socialBonus || settings?.socialBonus || 0;
    const relocationAllowance = payrollDetail.relocationAllowance || settings?.relocationAllowance || 0;
    const otherBonuses = payrollDetail.otherBonuses || settings?.otherBonuses || 0;
    const deductions = payrollDetail.deductions || settings?.deductions || 0;

    const employeeName = employee.personalDetails?.fullNameEnglish;

    if (!employeeName) {
      console.warn(`Skipping employee with ID ${employee.id} due to missing fullNameEnglish.`);
      continue;
    }

    const totalCommission = await CommissionModel.sum("amount", {
      where: {
        employeeName,
        month: month.toString(),
        status: "Active",
        payrollId: null,
      },
    }) || 0;

    const totalSalary =
      parseFloat(basicSalary) +
      parseFloat(accommodationAllowance) +
      parseFloat(foodAllowance) +
      parseFloat(transportationAllowance) +
      parseFloat(nationalAccreditationBonus) +
      parseFloat(natureOfWorkAllowance) +
      parseFloat(socialBonus) +
      parseFloat(relocationAllowance) +
      parseFloat(otherBonuses) +
      parseFloat(totalCommission) -
      parseFloat(deductions);

    const payrollRecord = await Payroll.create({
      month,
      year,
      salaryAmount: basicSalary,
      accommodationAllowance,
      foodAllowance,
      transportationAllowance,
      nationalAccreditationBonus,
      natureOfWorkAllowance,
      socialBonus,
      relocationAllowance,
      otherBonuses,
      deductions,
      totalSalary,
      paymentMethod: "cash",
      paymentDate,
      isApproved: "pending",
      employeeId: employee.id,
    });

    await CommissionModel.update(
      { payrollId: payrollRecord.id },
      {
        where: {
          employeeName,
          month: month.toString(),
          status: "Active",
          payrollId: null,
        },
      }
    );
  }

  return `Payroll successfully calculated for ${employees.length} employees.`;
};

// Controller handler
const calculatePayrollForAllEmployeesHandler = async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const message = await calculatePayrollForAllEmployees(month, year);
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Payroll calculation error:", error);
    return res.status(500).json({ message: error.message || "Internal server error." });
  }
};

const setSalaryCalculationDate = async (req, res) => {
  const { date } = req.body;

  try {
    const setting = await SettingsModel.findOne({
      where: { name: "salaryCalculationDate" },
    });

    if (!setting) {
      await SettingsModel.create({
        name: "salaryCalculationDate",
        value: date,
      });
    } else {
      setting.value = date;
      await setting.save();
    }

    res
      .status(200)
      .json({ message: "Salary calculation date updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generatePaySlip = async (req, res) => {
  const { id } = req.params;

  try {
    const payroll = await Payroll.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    const employee = payroll.employee;
    const paySlipsDir = path.join(__dirname, "..", "pay_slips");

    if (!fs.existsSync(paySlipsDir)) {
      fs.mkdirSync(paySlipsDir, { recursive: true });
    }

    const formattedDate = new Date(payroll.paymentDate).toLocaleString(
      "default",
      { month: "long", year: "numeric" }
    );

    const filename = `pay_slip_${employee.id}_${formattedDate}.pdf`;
    const filePath = path.join(paySlipsDir, filename);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    const logoPath = path.join(__dirname, "..", "public", "logo", "logo.jpg");
    doc.image(logoPath, 270, 40, { width: 100 });
    doc.moveDown(2);
    doc
      .fontSize(22)
      .fillColor("red")
      .text("Auto Xpert", { align: "center" })
      .fontSize(22)
      .fillColor("#000")
      .text(" Trading and Services W.L.L.", { align: "center" });

    doc.moveDown(1);

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Employee Name: ${employee.personalDetails?.fullNameEnglish}`, {
        align: "left",
      });
    doc.text(`Employee ID: ${employee.id}`, { align: "left" });
    doc.text(`Month: ${formattedDate}`, { align: "left" });
    doc.moveDown(1);

    const salaryComponents = [
      { label: "Basic Salary", value: payroll.salaryAmount },
      {
        label: "Accommodation Allowance",
        value: payroll.accommodationAllowance,
      },
      { label: "Food Allowance", value: payroll.foodAllowance },
      {
        label: "Transportation Allowance",
        value: payroll.transportationAllowance,
      },
      {
        label: "National Accreditation Bonus",
        value: payroll.nationalAccreditationBonus,
      },
      {
        label: "Nature of Work Allowance",
        value: payroll.natureOfWorkAllowance,
      },
      { label: "Social Bonus", value: payroll.socialBonus },
      { label: "Relocation Allowance", value: payroll.relocationAllowance },
      { label: "Other Bonuses", value: payroll.otherBonuses },
    ];

    const tableTop = doc.y;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Salary Components", 50, tableTop);
    doc.text("Amount", 400, tableTop);

    const salaryRowStartY = tableTop + 20;

    salaryComponents.forEach((component, index) => {
      const rowY = salaryRowStartY + index * 20;
      doc.fontSize(12).text(component.label, 50, rowY);
      doc.text(
        `${component.value ? `${component.value} QAR` : "-"}`,
        400,
        rowY
      );
    });

    doc.moveDown(0.5);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(
        `Gross Salary: ${payroll.totalSalary} QAR`,
        50,
        salaryRowStartY + salaryComponents.length * 20 + 10
      );

    doc.moveDown(1);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Deductions", { align: "left" });

    const deductions = [
      { label: "Deductions", value: payroll.deductions },
    ];

    const deductionTableTop = doc.y;

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Deduction Type", 50, deductionTableTop);
    doc.text("Amount", 400, deductionTableTop);

    const deductionRowStartY = deductionTableTop + 20;

    deductions.forEach((deduction, index) => {
      const rowY = deductionRowStartY + index * 20;
      doc.fontSize(12).text(deduction.label, 50, rowY);
      doc.text(
        `${deduction.value ? `${deduction.value} QAR` : "-"}`,
        400,
        rowY
      );
    });

    doc.moveDown(0.5);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(
        `Total Deductions: ${payroll.deductions} QAR`,
        50,
        deductionRowStartY + deductions.length * 20 + 10
      );

    doc.moveDown(1);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(`Net Salary: ${payroll.totalSalary} QAR`, { align: "left" });

    doc.end();

    res.status(200).json({
      message: "Pay slip generated successfully",
      filePath: `/api/payroll/paySlip/download/${filename}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadPaySlip = async (req, res) => {
  const { filename } = req.params;
  const { token } = req.query;

  if (!token) {
    return res
      .status(401)
      .json({ message: "A token is required for authentication" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const filePath = path.join(__dirname, "..", "pay_slips", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    return res.download(filePath, filename);
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const filterPayroll = async (req, res) => {
  try {
    const {
      paymentMethod = "All",
      paymentDate = "All",
      isApproved = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (paymentMethod !== "All") {
      where["paymentMethod"] = paymentMethod;
    }

    if (paymentDate && paymentDate !== "All") {
      if (!isNaN(Date.parse(paymentDate))) {
        where["paymentDate"] = new Date(paymentDate);
      } else if (paymentDate.includes("to")) {
        const [startDate, endDate] = paymentDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where["paymentDate"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (isApproved !== "All") {
      where["isApproved"] = isApproved;
    }

    const { count: totalPayrolls, rows: payroll } =
      await Payroll.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: Employee,
            as: "employee",
          },
        ],
      });

    res.status(200).json({
      totalPayrolls,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPayrolls / limit),
      payroll,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering payrolls", error: error.message });
  }
};

const exportFilteredPayrollToCSV = async (req, res) => {
  try {
    const {
      paymentMethod = "All",
      paymentDate = "All",
      isApproved = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (paymentMethod !== "All") {
      where["paymentMethod"] = paymentMethod;
    }

    if (paymentDate && paymentDate !== "All") {
      if (!isNaN(Date.parse(paymentDate))) {
        where["paymentDate"] = new Date(paymentDate);
      } else if (paymentDate.includes("to")) {
        const [startDate, endDate] = paymentDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where["paymentDate"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (isApproved !== "All") {
      where["isApproved"] = isApproved;
    }

    const { rows: payrolls } = await Payroll.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: Employee,
          as: "employee",
        },
      ],
    });

    console.log(payrolls);

    if (!payrolls || payrolls.length === 0) {
      return res.status(404).json({
        message: "No payroll found matching the filters",
      });
    }

    const payrollsData = payrolls.map((payrollz) => {
      return {
        payrollId: payrollz.id,
        salaryAmount: payrollz.salaryAmount,
        accommodationAllowance: payrollz.accommodationAllowance,
        foodAllowance: payrollz.foodAllowance,
        transportationAllowance: payrollz.transportationAllowance,
        nationalAccreditationBonus: payrollz.nationalAccreditationBonus,
        natureOfWorkAllowance: payrollz.natureOfWorkAllowance,
        socialBonus: payrollz.socialBonus,
        relocationAllowance: payrollz.relocationAllowance,
        otherBonuses: payrollz.otherBonuses,
        deductions: payrollz.deductions,
        totalSalary: payrollz.totalSalary,
        paymentMethod: payrollz.paymentMethod,
        paymentDate: payrollz.paymentDate,
        isApproved: payrollz.isApproved,
        employeeId: payrollz.employeeId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(payrollsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_payroll.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting payrolls to CSV:", error);
    res.status(500).json({
      message: "Error exporting payrolls to CSV",
      error: error.message,
    });
  }
};

const exportFilteredPayrollToPDF = async (req, res) => {
  try {
    const {
      paymentMethod = "All",
      paymentDate = "All",
      isApproved = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (paymentMethod !== "All") {
      where["paymentMethod"] = paymentMethod;
    }

    if (paymentDate && paymentDate !== "All") {
      if (!isNaN(Date.parse(paymentDate))) {
        where["paymentDate"] = new Date(paymentDate);
      } else if (paymentDate.includes("to")) {
        const [startDate, endDate] = paymentDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where["paymentDate"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (isApproved !== "All") {
      where["isApproved"] = isApproved;
    }

    const { rows: payrolls } = await Payroll.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: Employee,
          as: "employee",
        },
      ],
    });

    if (!payrolls || payrolls.length === 0) {
      return res
        .status(404)
        .json({ message: "No payroll found matching the filters" });
    }

    const payrollData = payrolls.map((payrollz) => {
      return [
        payrollz.id || "N/A",
        payrollz.salaryAmount || "N/A",
        payrollz.totalSalary || "N/A",
        payrollz.paymentMethod || "N/A",
        payrollz.employeeId || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Payroll Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Payroll ID",
                "Salary Amount",
                "Total Salary",
                "Payment Method",
                "Employee ID",
              ],
              ...payrollData,
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
    res.attachment("payroll_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting payrolls to PDF:", error);
    res.status(500).json({
      message: "Error exporting payrolls to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createPayroll,
  deletePayroll,
  getPayrollById,
  getAllPayrolls,
  updatePayrollDeduction,
  approvePayroll,
  rejectPayroll,
  calculatePayrollForAllEmployeesHandler,
  calculatePayrollForAllEmployees,
  setSalaryCalculationDate,
  generatePaySlip,
  downloadPaySlip,
  filterPayroll,
  exportFilteredPayrollToCSV,
  exportFilteredPayrollToPDF,
};
