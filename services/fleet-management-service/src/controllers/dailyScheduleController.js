const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const DailyScheduleModel = require("../models/DailyScheduleModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const EquipmentModel = require("../models/EquipmentModel");
const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");
const { Op } = require("sequelize");

const getAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 10, alert_type } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {
      alert_status: "active",
    };

    // Filter by alert type if provided
    if (alert_type) {
      if (alert_type === "breakdown") {
        where.status = {
          [Op.or]: [
            { [Op.like]: "%Major Breakdown%" },
            { [Op.like]: "%Minor Breakdown%" },
            { [Op.like]: "%Major BD%" },
            { [Op.like]: "%Minor BD%" },
            { [Op.like]: "%major-breakdown%" },
            { [Op.like]: "%minor-breakdown%" },
          ],
        };
      } else if (alert_type === "idle") {
        where.status = {
          [Op.or]: [
            { [Op.like]: "%Idle Eqp%" },
            { [Op.like]: "%Idle%" },
            { [Op.like]: "%ID%" },
            { [Op.like]: "%idle-eqp%" },
          ],
        };
      }
    }

    const { count: totalAlerts, rows: alerts } =
      await DailyScheduleModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: EmployeeModel, as: "employee" },
          { model: EquipmentModel, as: "equipment" },
        ],
        order: [["created_at", "DESC"]],
      });

    console.log(`📡 API returning ${alerts.length} active alerts`);
    console.log("📊 Alert statuses:", alerts.map(a => a.status));

    res.status(200).json({
      totalAlerts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAlerts / limit),
      alerts,
    });
  } catch (error) {
    console.error("❌ Error in getAlerts:", error);
    res.status(500).json({
      message: "Error retrieving alerts",
      error: error.message,
    });
  }
};

// New function: Resolve Alert
const resolveAlert = async (req, res) => {
  const { schedule_id } = req.params;
  const { resolution_notes, resolved_by } = req.body;

  try {
    const schedule = await DailyScheduleModel.findByPk(schedule_id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Update alert status
    schedule.alert_status = "resolved";
    schedule.resolved_at = new Date();
    schedule.resolution_notes = resolution_notes;
    schedule.resolved_by = resolved_by;

    await schedule.save();

    res.status(200).json({
      message: "Alert resolved successfully",
      schedule: schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error resolving alert",
      error: error.message,
    });
  }
};

// New function: Update Schedule Status (for calendar updates)
const updateScheduleStatus = async (req, res) => {
  const { schedule_id } = req.params;
  const { status, alert_status } = req.body;

  try {
    const schedule = await DailyScheduleModel.findByPk(schedule_id);

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Update status and alert status
    if (status) schedule.status = status;
    if (alert_status) schedule.alert_status = alert_status;

    await schedule.save();

    res.status(200).json({
      message: "Schedule status updated successfully",
      schedule: schedule,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating schedule status",
      error: error.message,
    });
  }
};

const createDailySchedule = async (req, res) => {
  const {
    employeeId,
    employeeFullName,
    client,
    serial_number,
    equipmentDetails,
    status,
    date,
    bypassValidation = false,
  } = req.body;

  try {
    // Check for existing schedules on same date
    let conflicts = [];

    if (serial_number) {
      const existingEquipmentSchedule = await DailyScheduleModel.findOne({
        where: {
          serial_number: serial_number,
          date: date,
        },
      });

      if (existingEquipmentSchedule) {
        conflicts.push({
          type: "equipment",
          serial_number: serial_number,
          existing_client: existingEquipmentSchedule.client,
        });
      }
    }

    if (employeeId) {
      const existingManpowerSchedule = await DailyScheduleModel.findOne({
        where: {
          employeeId: employeeId,
          date: date,
        },
      });

      if (existingManpowerSchedule) {
        conflicts.push({
          type: "manpower",
          employeeId: employeeId,
          existing_client: existingManpowerSchedule.client,
        });
      }
    }

    // If conflicts found and not bypassed, return warning
    if (conflicts.length > 0 && !bypassValidation) {
      return res.status(400).json({
        warning: true,
        message:
          "Same date already assigned to another client. Do you really want to still schedule this?",
        conflicts: conflicts,
      });
    }

    // Determine alert status based on status value
    const statusLower = status.toLowerCase();
    const alertStatus =
      statusLower.includes("major breakdown") ||
      statusLower.includes("major bd") ||
      statusLower.includes("minor breakdown") ||
      statusLower.includes("minor bd") ||
      statusLower.includes("idle eqp") ||
      statusLower.includes("idle")
        ? "active"
        : null;

    const schedule = await DailyScheduleModel.create({
      employeeId,
      employeeFullName,
      client,
      serial_number,
      equipmentDetails,
      status,
      date,
      alert_status: alertStatus,
    });

    res
      .status(201)
      .json({ message: "Daily schedule created successfully", schedule });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Replace the updateDailySchedule function in dailyScheduleController.js

const updateDailySchedule = async (req, res) => {
  const { schedule_id } = req.params;
  const {
    employeeId,
    employeeFullName,
    client,
    serial_number,
    equipmentDetails,
    status,
    date,
    alert_status,
    resolution_notes,
  } = req.body;

  try {
    const scheduleToUpdate = await DailyScheduleModel.findByPk(schedule_id);

    if (!scheduleToUpdate) {
      return res.status(404).json({ message: "Daily schedule not found" });
    }

    // Store old status for comparison
    const oldStatus = scheduleToUpdate.status;

    // Update basic fields
    scheduleToUpdate.employeeId = employeeId ?? scheduleToUpdate.employeeId;
    scheduleToUpdate.employeeFullName =
      employeeFullName ?? scheduleToUpdate.employeeFullName;
    scheduleToUpdate.client = client ?? scheduleToUpdate.client;
    scheduleToUpdate.serial_number =
      serial_number ?? scheduleToUpdate.serial_number;
    scheduleToUpdate.equipmentDetails =
      equipmentDetails ?? scheduleToUpdate.equipmentDetails;
    scheduleToUpdate.date = date ?? scheduleToUpdate.date;

    // CRITICAL: Check if status is being updated and contains alert keywords
    if (status) {
      scheduleToUpdate.status = status;

      // Check if NEW status contains breakdown or idle keywords (case-insensitive)
      const statusLower = status.toLowerCase();
      const oldStatusLower = oldStatus ? oldStatus.toLowerCase() : "";

      console.log("🔍 Checking status update:", {
        oldStatus: oldStatus,
        newStatus: status,
        statusLower: statusLower,
      });

      // ENHANCED: Check if this is a NEW alert status - ALL VARIATIONS
      const isNewAlertStatus =
        // Idle variations
        statusLower.includes("idle eqp") ||
        statusLower.includes("idle-eqp") ||
        (statusLower.includes("idle") && statusLower.includes("id")) ||
        
        // Major Breakdown variations - FIXED
        statusLower.includes("major breakdown") ||
        statusLower.includes("major-breakdown") ||
        statusLower.includes("major bd") ||
        (statusLower.includes("major") && statusLower.includes("bd")) ||
        
        // Minor Breakdown variations - FIXED
        statusLower.includes("minor breakdown") ||
        statusLower.includes("minor-breakdown") ||
        statusLower.includes("minor bd") ||
        (statusLower.includes("minor") && statusLower.includes("bd")) ||
        
        // Generic breakdown
        statusLower.includes("breakdown");

      console.log("🔍 Alert status check:", {
        isNewAlertStatus,
        hasOldBreakdown: oldStatusLower.includes("breakdown"),
        hasOldIdle: oldStatusLower.includes("idle"),
      });

      // Only create alert if this is genuinely a new alert status
      if (
        isNewAlertStatus &&
        !oldStatusLower.includes("breakdown") &&
        !oldStatusLower.includes("idle eqp") &&
        !oldStatusLower.includes("idle-eqp")
      ) {
        scheduleToUpdate.alert_status = "active";
        scheduleToUpdate.resolved_at = null;
        scheduleToUpdate.resolved_by = null;
        scheduleToUpdate.resolution_notes = null;

        console.log(
          `🚨 ALERT CREATED: Schedule ID ${schedule_id}, Status: ${status}`
        );
      } else if (isNewAlertStatus) {
        // If already was an alert status, just ensure it's still active
        scheduleToUpdate.alert_status =
          scheduleToUpdate.alert_status || "active";
        
        console.log(
          `⚠️ ALERT MAINTAINED: Schedule ID ${schedule_id}, Status: ${status}`
        );
      }
    }

    // Allow manual override of alert_status if explicitly provided
    if (alert_status !== undefined) {
      scheduleToUpdate.alert_status = alert_status;
    }

    if (resolution_notes) {
      scheduleToUpdate.resolution_notes = resolution_notes;
    }

    await scheduleToUpdate.save();

    console.log(
      `✅ Schedule Updated: ID ${schedule_id}, Alert Status: ${scheduleToUpdate.alert_status}, Status: ${scheduleToUpdate.status}`
    );

    res.status(200).json({
      message: "Daily schedule updated successfully",
      schedule: scheduleToUpdate,
      alertCreated: scheduleToUpdate.alert_status === "active",
    });
  } catch (error) {
    console.error("❌ Error updating schedule:", error);
    res.status(500).json({
      message: "Error updating daily schedule",
      error: error.message,
    });
  }
};

const deleteDailySchedule = async (req, res) => {
  const { schedule_id } = req.params;

  try {
    const scheduleToDelete = await DailyScheduleModel.findByPk(schedule_id);

    if (!scheduleToDelete) {
      return res.status(404).json({ message: "Daily schedule not found" });
    }

    await scheduleToDelete.destroy();
    res.status(200).json({ message: "Daily schedule deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting daily schedule", error: error.message });
  }
};

const getDailyScheduleById = async (req, res) => {
  try {
    const { schedule_id } = req.params;
    const schedule = await DailyScheduleModel.findByPk(schedule_id, {
      include: [
        { model: EmployeeModel, as: "employee" },
        { model: EquipmentModel, as: "equipment" },
      ],
    });

    if (!schedule) {
      return res.status(404).json({ message: "Daily schedule not found" });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving daily schedule",
      error: error.message,
    });
  }
};

const getAllDailySchedules = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSchedules, rows: schedules } =
      await DailyScheduleModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          { model: EmployeeModel, as: "employee" },
          { model: EquipmentModel, as: "equipment" },
        ],
      });

    res.status(200).json({
      totalSchedules,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSchedules / limit),
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving daily schedules",
      error: error.message,
    });
  }
};

const filterDailySchedules = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { count: totalSchedules, rows: schedules } =
      await DailyScheduleModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: EmployeeModel, as: "employee" },
          { model: EquipmentModel, as: "equipment" },
        ],
      });

    res.status(200).json({
      totalSchedules,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSchedules / limit),
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering daily schedules",
      error: error.message,
    });
  }
};

const exportFilteredDailySchedulesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { rows: schedules } = await DailyScheduleModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: EmployeeModel, as: "employee" },
        { model: EquipmentModel, as: "equipment" },
      ],
    });

    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No daily schedules found matching the filters" });
    }

    const schedulesData = schedules.map((schedule) => ({
      scheduleId: schedule.schedule_id,
      employeeName: schedule.employee
        ? schedule.employee.fullName
        : schedule.employeeFullName,
      client: schedule.client,
      equipmentSerial: schedule.equipment
        ? schedule.equipment.serial_number
        : schedule.serial_number,
      equipmentDetails: schedule.equipmentDetails,
      status: schedule.status,
      date: schedule.date
        ? new Date(schedule.date).toLocaleDateString()
        : "N/A",
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(schedulesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_daily_schedules.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting daily schedules to CSV:", error);
    res.status(500).json({
      message: "Error exporting daily schedules to CSV",
      error: error.message,
    });
  }
};

const exportFilteredDailySchedulesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { rows: schedules } = await DailyScheduleModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: EmployeeModel, as: "employee" },
        { model: EquipmentModel, as: "equipment" },
      ],
    });

    if (!schedules || schedules.length === 0) {
      return res
        .status(404)
        .json({ message: "No daily schedules found matching the filters" });
    }

    const schedulesData = schedules.map((schedule) => [
      schedule.schedule_id || "N/A",
      schedule.employee
        ? schedule.employee.fullName
        : schedule.employeeFullName,
      schedule.client || "N/A",
      schedule.equipment
        ? schedule.equipment.serial_number
        : schedule.serial_number || "N/A",
      schedule.equipmentDetails || "N/A",
      schedule.status || "N/A",
      schedule.date ? new Date(schedule.date).toLocaleDateString() : "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Daily Schedules Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, 100, 100, 100, 100, 100, 100],
            body: [
              [
                "Schedule ID",
                "Employee Name",
                "Client",
                "Equipment Serial",
                "Equipment Details",
                "Status",
                "Date",
              ],
              ...schedulesData,
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
    res.attachment("daily_schedules_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting daily schedules to PDF:", error);
    res.status(500).json({
      message: "Error exporting daily schedules to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createDailySchedule,
  updateDailySchedule,
  deleteDailySchedule,
  getDailyScheduleById,
  getAllDailySchedules,
  filterDailySchedules,
  exportFilteredDailySchedulesToCSV,
  exportFilteredDailySchedulesToPDF,
  getAlerts,
  resolveAlert,
  updateScheduleStatus,
};
