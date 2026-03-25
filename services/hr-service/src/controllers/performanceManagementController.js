const Employee = require("../../models/hr/employees/EmployeeModel");
const PerformanceManagement = require("../../models/hr/PerformanceManagementModel");
const Goals = require("../../models/hr/GoalModel");
const KPIs = require("../../models/hr/KPIModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createPerformance = async (req, res) => {
  const {
    reviewPeriodStartDate,
    reviewPeriodEndDate,
    goalsAchieved,
    performanceRating,
    managerFeedback,
    PeerFeedback,
    subordinateFeedback,
    trainingNeeds,
    promotionEligibility,
    employeeId,
  } = req.body;

  try {
    const performance = await PerformanceManagement.create({
      reviewPeriodStartDate,
      reviewPeriodEndDate,
      goalsAchieved,
      performanceRating,
      managerFeedback,
      PeerFeedback,
      subordinateFeedback,
      trainingNeeds,
      promotionEligibility,
      employeeId,
    });

    res.status(201).json({
      message: "Performance management created successfully",
      performance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updatePerformance = async (req, res) => {
  const { id } = req.params;
  const {
    reviewPeriodStartDate,
    reviewPeriodEndDate,
    goalsAchieved,
    performanceRating,
    managerFeedback,
    PeerFeedback,
    subordinateFeedback,
    trainingNeeds,
    promotionEligibility,
    employeeId,
  } = req.body;

  try {
    const performanceToUpdate = await PerformanceManagement.findByPk(id);

    if (!performanceToUpdate) {
      return res
        .status(404)
        .json({ message: "Performance management data not found" });
    }

    performanceToUpdate.reviewPeriodStartDate =
      reviewPeriodStartDate || performanceToUpdate.reviewPeriodStartDate;
    performanceToUpdate.reviewPeriodEndDate =
      reviewPeriodEndDate || performanceToUpdate.reviewPeriodEndDate;
    performanceToUpdate.goalsAchieved =
      goalsAchieved || performanceToUpdate.goalsAchieved;
    performanceToUpdate.performanceRating =
      performanceRating || performanceToUpdate.performanceRating;
    performanceToUpdate.managerFeedback =
      managerFeedback || performanceToUpdate.managerFeedback;
    performanceToUpdate.PeerFeedback =
      PeerFeedback || performanceToUpdate.PeerFeedback;
    performanceToUpdate.subordinateFeedback =
      subordinateFeedback || performanceToUpdate.subordinateFeedback;
    performanceToUpdate.trainingNeeds =
      trainingNeeds || performanceToUpdate.trainingNeeds;
    performanceToUpdate.promotionEligibility =
      promotionEligibility || performanceToUpdate.promotionEligibility;
    performanceToUpdate.employeeId =
      employeeId || performanceToUpdate.employeeId;

    await performanceToUpdate.save();
    res.status(200).json({
      message: "Performance management data updated successfully",
      performance: performanceToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating performance management data",
      error: error.message,
    });
  }
};

const deletePerformance = async (req, res) => {
  const { id } = req.params;

  try {
    const performanceToDelete = await PerformanceManagement.findByPk(id);

    if (!performanceToDelete) {
      return res
        .status(404)
        .json({ message: "Performance management data not found" });
    }

    await performanceToDelete.destroy();
    res
      .status(200)
      .json({ message: "Performance management data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting performance management data",
      error: error.message,
    });
  }
};

const getPerformanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const performance = await PerformanceManagement.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!performance) {
      return res
        .status(404)
        .json({ message: "Performance management data not found" });
    }

    res.status(200).json(performance);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving performance management data",
      error: error.message,
    });
  }
};

const getAllPerformances = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalPerformances, rows: performences } =
      await PerformanceManagement.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: {
          model: Employee,
          as: "employee",
        },
      });

    res.status(200).json({
      totalPerformances,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPerformances / limit),
      performences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving performance management data",
      error: error.message,
    });
  }
};

const addEmployeeFeedback = async (req, res) => {
  const { managerFeedback, peerFeedback, subordinateFeedback, employeeId } =
    req.body;

  try {
    let performance = await PerformanceManagement.findOne({ employeeId });

    if (!performance) {
      return res.status(404).json({ error: "Performance record not found" });
    }

    performance.managerFeedback =
      managerFeedback || performance.managerFeedback;
    performance.PeerFeedback = peerFeedback || performance.PeerFeedback;
    performance.subordinateFeedback =
      subordinateFeedback || performance.subordinateFeedback;

    await performance.save();

    res.status(200).json({
      message: "Feedback updated successfully",
      performance,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createGoal = async (req, res) => {
  const { goalName, targetValue, achievedValue, goalStatus, employeeId } =
    req.body;

  try {
    const goals = await Goals.create({
      goalName,
      targetValue,
      achievedValue,
      goalStatus,
      employeeId,
    });

    res.status(201).json({
      message: "Goal created successfully",
      goals,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateGoal = async (req, res) => {
  const { id } = req.params;
  const { goalName, targetValue, achievedValue, goalStatus, employeeId } =
    req.body;

  try {
    const goalToUpdate = await Goals.findByPk(id);

    if (!goalToUpdate) {
      return res.status(404).json({ message: "Goal data not found" });
    }

    goalToUpdate.goalName = goalName || goalToUpdate.goalName;
    goalToUpdate.targetValue = targetValue || goalToUpdate.targetValue;
    goalToUpdate.achievedValue = achievedValue || goalToUpdate.achievedValue;
    goalToUpdate.goalStatus = goalStatus || goalToUpdate.goalStatus;
    goalToUpdate.employeeId = employeeId || goalToUpdate.employeeId;

    await goalToUpdate.save();
    res.status(200).json({
      message: "Goal data updated successfully",
      goals: goalToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating goal data",
      error: error.message,
    });
  }
};

const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const goalToDelete = await Goals.findByPk(id);

    if (!goalToDelete) {
      return res.status(404).json({ message: "Goal data not found" });
    }

    await goalToDelete.destroy();
    res.status(200).json({ message: "Goal data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting goal data",
      error: error.message,
    });
  }
};

const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goals.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal data not found" });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving goal data",
      error: error.message,
    });
  }
};

const getAllGoals = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalGoals, rows: goals } = await Goals.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    res.status(200).json({
      totalGoals,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalGoals / limit),
      goals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving goals data",
      error: error.message,
    });
  }
};

const createKPI = async (req, res) => {
  const { kpiName, targetValue, achievedValue, kpiStatus, employeeId } =
    req.body;

  try {
    const kpis = await KPIs.create({
      kpiName,
      targetValue,
      achievedValue,
      kpiStatus,
      employeeId,
    });

    res.status(201).json({
      message: "KPIs created successfully",
      kpis,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateKPI = async (req, res) => {
  const { id } = req.params;
  const { kpiName, targetValue, achievedValue, kpiStatus, employeeId } =
    req.body;

  try {
    const kpiToUpdate = await KPIs.findByPk(id);

    if (!kpiToUpdate) {
      return res.status(404).json({ message: "KPI data not found" });
    }

    kpiToUpdate.kpiName = kpiName || kpiToUpdate.kpiName;
    kpiToUpdate.targetValue = targetValue || kpiToUpdate.targetValue;
    kpiToUpdate.achievedValue = achievedValue || kpiToUpdate.achievedValue;
    kpiToUpdate.kpiStatus = kpiStatus || kpiToUpdate.kpiStatus;
    kpiToUpdate.employeeId = employeeId || kpiToUpdate.employeeId;

    await kpiToUpdate.save();
    res.status(200).json({
      message: "KPI data updated successfully",
      kpis: kpiToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating kpi data",
      error: error.message,
    });
  }
};

const deleteKPI = async (req, res) => {
  const { id } = req.params;

  try {
    const kpiToDelete = await KPIs.findByPk(id);

    if (!kpiToDelete) {
      return res.status(404).json({ message: "KPI data not found" });
    }

    await kpiToDelete.destroy();
    res.status(200).json({ message: "KPI data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting kpi data",
      error: error.message,
    });
  }
};

const getKPIById = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await KPIs.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!goal) {
      return res.status(404).json({ message: "Goal data not found" });
    }

    res.status(200).json(goal);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving KPI data",
      error: error.message,
    });
  }
};

const filterPerformance = async (req, res) => {
  try {
    const {
      performanceRating = "All",
      reviewPeriodStartDate = "All",
      reviewPeriodEndDate = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (performanceRating !== "All") {
      where["performanceRating"] = performanceRating;
    }

    if (reviewPeriodStartDate && reviewPeriodStartDate !== "All") {
      if (!isNaN(Date.parse(reviewPeriodStartDate))) {
        where["reviewPeriodStartDate"] = new Date(reviewPeriodStartDate);
      }
    }

    if (reviewPeriodEndDate && reviewPeriodEndDate !== "All") {
      if (!isNaN(Date.parse(reviewPeriodEndDate))) {
        where["reviewPeriodEndDate"] = new Date(reviewPeriodEndDate);
      }
    }

    const { count: totalPerformances, rows: performances } =
      await PerformanceManagement.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [{ model: Employee, as: "employee" }],
      });

    res.status(200).json({
      totalPerformances,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPerformances / limit),
      performances,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering performance data",
      error: error.message,
    });
  }
};

const exportFilteredPerformanceToCSV = async (req, res) => {
  try {
    const {
      performanceRating = "All",
      reviewPeriodStartDate = "All",
      reviewPeriodEndDate = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (performanceRating !== "All") {
      where["performanceRating"] = performanceRating;
    }

    if (reviewPeriodStartDate && reviewPeriodStartDate !== "All") {
      if (!isNaN(Date.parse(reviewPeriodStartDate))) {
        where["reviewPeriodStartDate"] = new Date(reviewPeriodStartDate);
      }
    }

    if (reviewPeriodEndDate && reviewPeriodEndDate !== "All") {
      if (!isNaN(Date.parse(reviewPeriodEndDate))) {
        where["reviewPeriodEndDate"] = new Date(reviewPeriodEndDate);
      }
    }

    const { rows: performances } = await PerformanceManagement.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: Employee, as: "employee" }],
    });

    if (!performances || performances.length === 0) {
      return res
        .status(404)
        .json({ message: "No performance data found matching the filters" });
    }

    const performancesData = performances.map((performance) => ({
      performanceId: performance.id,
      performanceRating: performance.performanceRating,
      reviewPeriodStartDate: performance.reviewPeriodStartDate,
      reviewPeriodEndDate: performance.reviewPeriodEndDate,
      employeeId: performance.employeeId,
      managerFeedback: performance.managerFeedback,
      PeerFeedback: performance.PeerFeedback,
      subordinateFeedback: performance.subordinateFeedback,
      trainingNeeds: performance.trainingNeeds,
      promotionEligibility: performance.promotionEligibility,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(performancesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_performance.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting performance data to CSV:", error);
    res.status(500).json({
      message: "Error exporting performance data to CSV",
      error: error.message,
    });
  }
};

const exportFilteredPerformanceToPDF = async (req, res) => {
  try {
    const {
      performanceRating = "All",
      reviewPeriodStartDate = "All",
      reviewPeriodEndDate = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (performanceRating !== "All") {
      where["performanceRating"] = performanceRating;
    }

    if (reviewPeriodStartDate && reviewPeriodStartDate !== "All") {
      if (!isNaN(Date.parse(reviewPeriodStartDate))) {
        where["reviewPeriodStartDate"] = new Date(reviewPeriodStartDate);
      }
    }

    if (reviewPeriodEndDate && reviewPeriodEndDate !== "All") {
      if (!isNaN(Date.parse(reviewPeriodEndDate))) {
        where["reviewPeriodEndDate"] = new Date(reviewPeriodEndDate);
      }
    }

    const { rows: performances } = await PerformanceManagement.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: Employee, as: "employee" }],
    });

    if (!performances || performances.length === 0) {
      return res
        .status(404)
        .json({ message: "No performance data found matching the filters" });
    }

    // Helper function to format MySQL date strings to YYYY-MM-DD
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : "N/A";

    const performanceData = performances.map((performance) => [
      performance.id || "N/A",
      performance.performanceRating || "N/A",
      formatDate(performance.reviewPeriodStartDate),
      formatDate(performance.reviewPeriodEndDate),
      performance.managerFeedback || "N/A",
      performance.trainingNeeds || "N/A",
      performance.promotionEligibility || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Performance Management Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Performance ID",
                "Rating",
                "Review Period Start Date",
                "Review Period End Date",
                "Manager Feedback",
                "Training Needs",
                "Promotion Eligibility",
              ],
              ...performanceData,
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
    res.attachment("performance_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting performance data to PDF:", error);
    res.status(500).json({
      message: "Error exporting performance data to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createPerformance,
  updatePerformance,
  deletePerformance,
  getPerformanceById,
  getAllPerformances,
  addEmployeeFeedback,
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalById,
  getAllGoals,
  createKPI,
  updateKPI,
  deleteKPI,
  getKPIById,
  filterPerformance,
  exportFilteredPerformanceToCSV,
  exportFilteredPerformanceToPDF,
};
