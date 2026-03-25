const Gratuity = require("../models/GratuityModel");
const Employee = require("../models/employees/EmployeeModel");
const EmployeePayrollModel = require("../models/employees/EmployeePayrollModel");
const { Op } = require("sequelize");
const moment = require("moment");

const calculateGratuityAmount = (basicSalary, yearsOfService) => {
  const dailyWage = basicSalary / 30;
  const gratuity = dailyWage * 21 * yearsOfService;
  const totalGratuity = gratuity;
  const monthlyProvision = totalGratuity / 12;

  return {
    totalGratuity,
    monthlyProvision: parseFloat(monthlyProvision.toFixed(2)),
  };
};

const calculateGratuityProvisionForAllEmployees = async (month, year) => {
  if (!month || !year) {
    throw new Error("Month and year are required.");
  }

  const provisionDate = moment(`${year}-${month}-01`)
    .endOf("month")
    .format("YYYY-MM-DD");

  const employees = await Employee.findAll({
    include: [
      {
        model: EmployeePayrollModel,
        as: "payrollDetails",
        where: { status: "Active" },
        required: true,
      },
      {
        model: Gratuity,
        as: "tbl_gratuity",
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
      ? employee.payrollDetails.find((p) => p.status === "Active") ||
        employee.payrollDetails[0]
      : employee.payrollDetails;

    console.log(`Employee ID ${employee.id} payroll:`, payroll);

    const employeeName = employee.personalDetails?.fullNameEnglish;
    if (!employeeName) {
      console.warn(
        `Skipping employee with ID ${employee.id} due to missing fullNameEnglish.`
      );
      continue;
    }

    const basicSalary = payroll?.basicSalary;
    if (!basicSalary && basicSalary !== 0) {
      console.warn(
        `Skipping employee with ID ${employee.id} due to missing or invalid basic salary: ${basicSalary}`
      );
      continue;
    }

    // Calculate yearsOfService from dateOfJoin
    const dateOfJoin = employee.otherDetails?.dateOfJoin;
    let yearsOfService = 5; // Default fallback
    if (dateOfJoin) {
      const joinDate = moment(dateOfJoin);
      const currentDate = moment();
      yearsOfService = currentDate.diff(joinDate, "years"); // Get whole years, no decimals
    } else {
      console.warn(
        `Employee ID ${employee.id} has no dateOfJoin, using default yearsOfService: ${yearsOfService}`
      );
    }

    const { totalGratuity, monthlyProvision } = calculateGratuityAmount(
      basicSalary,
      yearsOfService
    );

    const previousMonth = moment(`${year}-${month}-01`)
      .subtract(1, "month")
      .format("MM");
    const previousYear = moment(`${year}-${month}-01`)
      .subtract(1, "month")
      .format("YYYY");

    const previousGratuity = await Gratuity.findOne({
      where: {
        employeeId: employee.id,
        month: previousMonth,
        year: previousYear,
      },
    });

    const previousAccumulatedProvision =
      previousGratuity?.accumulatedProvision || 0;
    const accumulatedProvision = parseFloat(
      (previousAccumulatedProvision + monthlyProvision).toFixed(2)
    );
    const monthlyProvisionDifference = parseFloat(
      (accumulatedProvision - previousAccumulatedProvision).toFixed(2)
    );

    await Gratuity.upsert({
      employeeId: employee.id,
      employeePayrollId: payroll.id,
      employeeName,
      basicSalary,
      yearsOfService,
      calculatedGratuity: totalGratuity,
      monthlyProvision: monthlyProvisionDifference,
      accumulatedProvision,
      status: "Active",
      month,
      year,
      provisionDate,
    });
  }

  return `Gratuity provisions successfully calculated for ${employees.length} employees.`;
};

const calculateGratuityProvisionForAllEmployeesHandler = async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const message = await calculateGratuityProvisionForAllEmployees(
      month,
      year
    );
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Gratuity provision calculation error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Internal server error." });
  }
};

const getAllGratuities = async (req, res) => {
  try {
    const gratuities = await Gratuity.findAll({
      include: {
        model: Employee,
        as: "employee",
      },
    });
    res.status(200).json(gratuities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching gratuities", error: error.message });
  }
};

const getGratuityById = async (req, res) => {
  try {
    const { id } = req.params;
    const gratuity = await Gratuity.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });
    if (!gratuity)
      return res.status(404).json({ message: "Gratuity not found" });

    res.status(200).json(gratuity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching gratuity", error: error.message });
  }
};

const updateGratuity = async (req, res) => {
  const { id } = req.params;
  const { employeeId, employeeName, basicSalary, yearsOfService, status } =
    req.body;

  try {
    const gratuity = await Gratuity.findByPk(id);
    if (!gratuity) {
      return res.status(404).json({ message: "Gratuity not found" });
    }

    // Check for duplicate employee name (excluding current record)
    if (employeeId) {
      const duplicate = await Gratuity.findOne({
        where: {
          employeeId,
          id: { [Op.ne]: id },
        },
      });
      if (duplicate) {
        return res
          .status(409)
          .json({
            message: "Another record already exists with this employee name",
          });
      }
    }

    // Recalculate gratuity and monthly provision if salary or years changed
    if (basicSalary && yearsOfService) {
      const { totalGratuity, monthlyProvision } = calculateGratuityAmount(
        basicSalary,
        yearsOfService
      );
      gratuity.calculatedGratuity = totalGratuity;
      gratuity.monthlyProvision = monthlyProvision;
    }

    gratuity.employeeId = employeeId || gratuity.employeeId;
    gratuity.employeeName = employeeName || gratuity.employeeName;
    gratuity.basicSalary = basicSalary || gratuity.basicSalary;
    gratuity.yearsOfService = yearsOfService || gratuity.yearsOfService;
    gratuity.status = status || gratuity.status;

    await gratuity.save();

    res
      .status(200)
      .json({ message: "Gratuity updated successfully", gratuity });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating gratuity", error: error.message });
  }
};

const deleteGratuity = async (req, res) => {
  try {
    const gratuity = await Gratuity.findByPk(req.params.id);
    if (!gratuity)
      return res.status(404).json({ message: "Gratuity not found" });

    await gratuity.destroy();
    res.status(200).json({ message: "Gratuity deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting gratuity", error: error.message });
  }
};

module.exports = {
  calculateGratuityProvisionForAllEmployees,
  calculateGratuityProvisionForAllEmployeesHandler,
  getAllGratuities,
  getGratuityById,
  updateGratuity,
  deleteGratuity,
};
