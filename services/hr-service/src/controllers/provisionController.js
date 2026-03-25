const AnnualLeavePolicy = require("../../models/hr/provisions/AnnualLeaveProvisionPolicy");
const AirTicketPolicy = require("../../models/hr/provisions/AirTicketProvisionPolicy");
const CountryModel = require("../../models/hr/CountryModel");
const AirTicketModel = require("../../models/hr/AirTicketModel");
const Employee = require("../../models/hr/employees/EmployeeModel");
const EmployeePayrollModel = require("../../models/hr/employees/EmployeePayrollModel");
const moment = require("moment");

const calculateAnnualLeaveAmount = (basicSalary, annualLeaveCount) => {
  const dailyWage = basicSalary / 30;
  const leaveEntitlement = dailyWage * annualLeaveCount;
  const monthlyProvision = leaveEntitlement / 12;

  return {
    totalLeaveEntitlement: leaveEntitlement,
    monthlyProvision: parseFloat(monthlyProvision.toFixed(2)),
  };
};

const calculateAnnualLeaveProvisionForAllEmployees = async (month, year) => {
  if (!month || !year) {
    throw new Error("Month and year are required.");
  }

  const provisionDate = moment(`${year}-${month}-01`).endOf("month").format("YYYY-MM-DD");

  const employees = await Employee.findAll({
    include: [
      {
        model: EmployeePayrollModel,
        as: "payrollDetails",
        where: { status: "Active" },
        required: true,
      },
      {
        model: AnnualLeavePolicy,
        as: "tbl_annual_leave_policy",
        required: false,
      },
    ],
    where: { otherDetails: { status: "Active" } },
  });

  if (!employees.length) {
    throw new Error("No active employees found.");
  }

  for (const employee of employees) {
    const payroll = Array.isArray(employee.payrollDetails)
      ? employee.payrollDetails.find((p) => p.status === "Active") || employee.payrollDetails[0]
      : employee.payrollDetails;

    const employeeName = employee.personalDetails?.fullNameEnglish;
    if (!employeeName) {
      console.warn(`Skipping employee with ID ${employee.id} due to missing fullNameEnglish.`);
      continue;
    }

    const basicSalary = payroll?.basicSalary;
    if (!basicSalary && basicSalary !== 0) {
      console.warn(`Skipping employee with ID ${employee.id} due to missing or invalid basic salary: ${basicSalary}`);
      continue;
    }

    const annualLeaveCount = payroll?.annualLeaveCount || 30;
    const { totalLeaveEntitlement, monthlyProvision } = calculateAnnualLeaveAmount(basicSalary, annualLeaveCount);

    const previousMonth = moment(`${year}-${month}-01`).subtract(1, "month").format("MM");
    const previousYear = moment(`${year}-${month}-01`).subtract(1, "month").format("YYYY");

    const previousProvision = await AnnualLeavePolicy.findOne({
      where: {
        employeeId: employee.id,
        month: previousMonth,
        year: previousYear,
      },
    });

    const previousAccumulatedProvision = previousProvision?.accumulatedProvision || 0;
    const accumulatedProvision = parseFloat((previousAccumulatedProvision + monthlyProvision).toFixed(2));
    const monthlyProvisionDifference = parseFloat((accumulatedProvision - previousAccumulatedProvision).toFixed(2));

    await AnnualLeavePolicy.upsert({
      employeeId: employee.id,
      employeePayrollId: payroll.id,
      employeeName,
      basicSalary,
      annualLeaveCount,
      calculatedLeaveEntitlement: totalLeaveEntitlement,
      monthlyProvision: monthlyProvisionDifference,
      accumulatedProvision,
      status: "Active",
      month,
      year,
      provisionDate,
    });
  }

  return `Annual leave provisions successfully calculated for ${employees.length} employees.`;
};

const calculateAnnualLeaveProvisionForAllEmployeesHandler = async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const message = await calculateAnnualLeaveProvisionForAllEmployees(month, year);
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Annual leave provision calculation error:", error);
    return res.status(500).json({ message: error.message || "Internal server error." });
  }
};
const getAllAnnualLeavePolicies = async (req, res) => {
  try {
    const policies = await AnnualLeavePolicy.findAll({
      include: {
        model: Employee,
        as: "employee",
      },
    });
    res
      .status(200)
      .json({ message: "All annual leave policies retrieved", policies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateAirTicketAmount = (adultPackageAmount) => {
  const ticketEntitlement = adultPackageAmount;
  const monthlyProvision = ticketEntitlement / 12;

  return {
    totalTicketEntitlement: ticketEntitlement,
    monthlyProvision: parseFloat(monthlyProvision.toFixed(2)),
  };
};

const calculateAirTicketProvisionForAllEmployees = async (month, year) => {
  if (!month || !year) {
    throw new Error("Month and year are required.");
  }

  const provisionDate = moment(`${year}-${month}-01`).endOf("month").format("YYYY-MM-DD");

  const employees = await Employee.findAll({
    include: [
      {
        model: EmployeePayrollModel,
        as: "payrollDetails",
        where: { status: "Active" },
        required: true,
      },
      {
        model: AirTicketPolicy,
        as: "tbl_air_ticket_policy",
        required: false,
      },
    ],
    where: { otherDetails: { status: "Active" } },
  });

  if (!employees.length) {
    throw new Error("No active employees found.");
  }

  for (const employee of employees) {
    const payroll = Array.isArray(employee.payrollDetails)
      ? employee.payrollDetails.find((p) => p.status === "Active") || employee.payrollDetails[0]
      : employee.payrollDetails;

    const employeeName = employee.personalDetails?.fullNameEnglish;
    if (!employeeName) {
      console.warn(`Skipping employee with ID ${employee.id} due to missing fullNameEnglish.`);
      continue;
    }

    const destinationCountry = employee.otherDetails?.destinationCountry;
    if (!destinationCountry) {
      console.warn(`Skipping employee with ID ${employee.id} due to missing destinationCountry.`);
      continue;
    }

    const trimmedCountry = destinationCountry.trim();
    const country = await CountryModel.findOne({
      where: { country_enName: trimmedCountry },
    });

    if (!country) {
      console.warn(`Skipping employee with ID ${employee.id} due to invalid destination country: ${trimmedCountry}`);
      continue;
    }

    const rate = await AirTicketModel.findOne({
      where: { destinationCountry: trimmedCountry },
    });

    if (!rate) {
      console.warn(`Skipping employee with ID ${employee.id} due to missing rate for destination: ${trimmedCountry}`);
      continue;
    }

    const adultPackageAmount = parseFloat(rate.adultPackageAmount);
    if (isNaN(adultPackageAmount)) {
      console.warn(`Skipping employee with ID ${employee.id} due to invalid adultPackageAmount: ${adultPackageAmount}`);
      continue;
    }

    const { totalTicketEntitlement, monthlyProvision } = calculateAirTicketAmount(adultPackageAmount);

    const previousMonth = moment(`${year}-${month}-01`).subtract(1, "month").format("MM");
    const previousYear = moment(`${year}-${month}-01`).subtract(1, "month").format("YYYY");

    const previousProvision = await AirTicketPolicy.findOne({
      where: {
        employeeId: employee.id,
        month: previousMonth,
        year: previousYear,
      },
    });

    const previousAccumulatedProvision = previousProvision?.accumulatedProvision || 0;
    const accumulatedProvision = parseFloat((previousAccumulatedProvision + monthlyProvision).toFixed(2));
    const monthlyProvisionDifference = parseFloat((accumulatedProvision - previousAccumulatedProvision).toFixed(2));

    await AirTicketPolicy.upsert({
      employeeId: employee.id,
      employeePayrollId: payroll.id,
      employeeName,
      destinationCountry: trimmedCountry,
      adultPackageAmount,
      calculatedTicketEntitlement: totalTicketEntitlement,
      monthlyProvision: monthlyProvisionDifference,
      accumulatedProvision,
      status: "Active",
      month,
      year,
      provisionDate,
    });
  }

  return `Air ticket provisions successfully calculated for ${employees.length} employees.`;
};

const calculateAirTicketProvisionForAllEmployeesHandler = async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const message = await calculateAirTicketProvisionForAllEmployees(month, year);
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Air ticket provision calculation error:", error);
    return res.status(500).json({ message: error.message || "Internal server error." });
  }
};

const getAllAirTicketPolicies = async (req, res) => {
  try {
    const policies = await AirTicketPolicy.findAll({
      include: {
        model: Employee,
        as: "employee",
      },
    });
    res
      .status(200)
      .json({ message: "All air ticket policies retrieved", policies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  calculateAnnualLeaveProvisionForAllEmployees,
  calculateAnnualLeaveProvisionForAllEmployeesHandler,
  getAllAnnualLeavePolicies,
  calculateAirTicketProvisionForAllEmployees,
  calculateAirTicketProvisionForAllEmployeesHandler,
  getAllAirTicketPolicies,
};
