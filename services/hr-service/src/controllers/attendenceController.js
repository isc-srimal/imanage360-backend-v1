const Employee = require("../models/employees/EmployeeModel");
const Attendence = require("../models/AttendenceModel");
const Payroll = require("../models/PayrollModel");
const { Op } = require("sequelize");
const moment = require("moment-timezone");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createAttendence = async (req, res) => {
  const { clockInTime, clockOutTime, date, remarks, status, employeeId } =
    req.body;

  try {
    const attendence = await Attendence.create({
      clockInTime,
      clockOutTime,
      date,
      remarks,
      status,
      employeeId,
    });

    res
      .status(201)
      .json({ message: "Attendence data created successfully", attendence });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttendence = async (req, res) => {
  const { id } = req.params;
  const { clockInTime, clockOutTime, date, remarks, status, employeeId } =
    req.body;

  try {
    const attendenceToUpdate = await Attendence.findByPk(id);

    if (!attendenceToUpdate) {
      return res.status(404).json({ message: "Attendence data not found" });
    }

    attendenceToUpdate.clockInTime =
      clockInTime || attendenceToUpdate.clockInTime;
    attendenceToUpdate.clockOutTime =
      clockOutTime || attendenceToUpdate.clockOutTime;
    attendenceToUpdate.date = date || attendenceToUpdate.date;
    attendenceToUpdate.remarks = remarks || attendenceToUpdate.remarks;
    attendenceToUpdate.status = status || attendenceToUpdate.status;
    attendenceToUpdate.employeeId = employeeId || attendenceToUpdate.employeeId;

    await attendenceToUpdate.save();
    res.status(200).json({
      message: "Attendence data updated successfully",
      attendence: attendenceToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating attendence data",
      error: error.message,
    });
  }
};

const deleteAttendence = async (req, res) => {
  const { id } = req.params;

  try {
    const attendenceToDelete = await Attendence.findByPk(id);

    if (!attendenceToDelete) {
      return res.status(404).json({ message: "Attendence data not found" });
    }

    await attendenceToDelete.destroy();
    res.status(200).json({ message: "Attendence data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting attendence data",
      error: error.message,
    });
  }
};

const getAttendenceById = async (req, res) => {
  try {
    const { id } = req.params;
    const attendence = await Attendence.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!attendence) {
      return res.status(404).json({ message: "Attendence data not found" });
    }

    res.status(200).json(attendence);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attendence data",
      error: error.message,
    });
  }
};

const getAllAttendences = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAttendence, rows: attendences } =
      await Attendence.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: {
          model: Employee,
          as: "employee",
        },
      });

    res.status(200).json({
      totalAttendence,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttendence / limit),
      attendences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attendence data",
      error: error.message,
    });
  }
};

const clockIn = async (req, res) => {
  const { employeeId, remarks } = req.body;

  const currentDate = new Date().toISOString().split("T")[0];
  const currentTime = moment().tz("Asia/Colombo").format("HH:mm:ss");

  try {
    const existingAttendence = await Attendence.findOne({
      where: {
        employeeId,
        remarks,
        date: currentDate,
        clockInTime: { [Op.not]: null },
      },
    });

    if (existingAttendence) {
      return res
        .status(400)
        .json({ message: "Employee already clocked in today" });
    }

    const attendence = await Attendence.create({
      clockInTime: currentTime,
      date: currentDate,
      employeeId,
      remarks,
      status: "present",
    });

    res.status(201).json({
      message: "Clock-in successful",
      attendence,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const clockOut = async (req, res) => {
  const { employeeId, remarks } = req.body;

  const currentDate = moment().tz("Asia/Colombo").format("YYYY-MM-DD");
  const currentTime = moment().tz("Asia/Colombo").format("HH:mm:ss");

  try {
    console.log("Searching for attendance with:", {
      employeeId,
      remarks,
      currentDate,
    });

    const attendence = await Attendence.findOne({
      where: {
        employeeId: employeeId,
        // remarks: remarks,
        date: {
          [Op.between]: [`${currentDate} 00:00:00`, `${currentDate} 23:59:59`],
        },
        clockOutTime: null,
      },
      logging: console.log,
    });

    if (!attendence) {
      const existingRecord = await Attendence.findOne({
        where: {
          employeeId: employeeId,
          // remarks: remarks,
          date: {
            [Op.between]: [
              `${currentDate} 00:00:00`,
              `${currentDate} 23:59:59`,
            ],
          },
        },
      });

      if (existingRecord) {
        return res.status(400).json({
          message: "Employee has already clocked out for today",
          // remarks: remarks,
          clockInTime: existingRecord.clockInTime,
          clockOutTime: existingRecord.clockOutTime,
        });
      } else {
        return res.status(400).json({
          message: "No clock-in record found for today. Please clock in first.",
        });
      }
    }

    attendence.remarks = remarks;
    attendence.clockOutTime = currentTime;
    attendence.status = "clocked Out";

    await attendence.save();

    res.status(200).json({
      message: "Clock-out successful",
      attendence,
    });
  } catch (error) {
    console.error("Clock out error:", error);
    res.status(500).json({
      error: "Error processing clock out request",
      details: error.message,
    });
  }
};

const integrateAttendanceWithPayroll = async (req, res) => {
  const { employeeId, month, year } = req.body;

  try {
    const attendanceData = await Attendence.findAll({
      where: {
        employeeId,
        date: {
          [Op.gte]: moment(`${year}-${month}-01`).startOf("month").toDate(),
          [Op.lte]: moment(`${year}-${month}-01`).endOf("month").toDate(),
        },
      },
    });

    if (attendanceData.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance data found for the specified month." });
    }

    let totalWorkedHours = 0;
    attendanceData.forEach((attendance) => {
      const clockInTime = moment(attendance.clockInTime);
      const clockOutTime = moment(attendance.clockOutTime);

      const workedHours = clockOutTime.diff(clockInTime, "hours", true);
      totalWorkedHours += workedHours;
    });

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const baseSalary = employee.payrollDetails?.basicSalary;

    const hourlyRate = baseSalary / (30 * 8);
    const calculatedSalary = totalWorkedHours * hourlyRate;

    const existingPayroll = await Payroll.findOne({
      where: {
        employeeId,
        paymentDate: {
          [Op.gte]: moment(`${year}-${month}-01`).startOf("month").toDate(),
          [Op.lte]: moment(`${year}-${month}-01`).endOf("month").toDate(),
        },
      },
    });

    if (existingPayroll) {
      existingPayroll.salaryAmount = calculatedSalary;
      await existingPayroll.save();
      res.status(200).json({
        message: "Payroll updated successfully",
        payroll: existingPayroll,
      });
    } else {
      const newPayroll = await Payroll.create({
        salaryAmount: calculatedSalary,
        employeeId,
        paymentMethod: "Bank Transfer",
        paymentDate: moment(`${year}-${month}-01`).endOf("month").toDate(),
      });
      res.status(201).json({
        message: "Payroll created successfully",
        payroll: newPayroll,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterAttendance = async (req, res) => {
  try {
    const { date = "All", status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (date && date !== "All") {
      if (!isNaN(Date.parse(date))) {
        where["date"] = new Date(date);
      } else if (date.includes("to")) {
        const [startDate, endDate] = date
          .split("to")
          .map((date) => new Date(date.trim()));
        where["date"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalAttendances, rows: attendances } =
      await Attendence.findAndCountAll({
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
      totalAttendances,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttendances / limit),
      attendances,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering Attendances", error: error.message });
  }
};

const exportFilteredAttendanceToCSV = async (req, res) => {
  try {
    const { date = "All", status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (date && date !== "All") {
      if (!isNaN(Date.parse(date))) {
        where["date"] = new Date(date);
      } else if (date.includes("to")) {
        const [startDate, endDate] = date
          .split("to")
          .map((date) => new Date(date.trim()));
        where["date"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: attendances } = await Attendence.findAndCountAll({
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

    console.log(attendances);

    if (!attendances || attendances.length === 0) {
      return res.status(404).json({
        message: "No attendance found matching the filters",
      });
    }

    const attendanceData = attendances.map((attendancez) => {
      return {
        attendanceId: attendancez.id,
        clockInTime: attendancez.clockInTime,
        clockOutTime: attendancez.clockOutTime,
        date: attendancez.date,
        remarks: attendancez.remarks,
        status: attendancez.status,
        employeeId: attendancez.employeeId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(attendanceData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_attendances.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting attendances to CSV:", error);
    res.status(500).json({
      message: "Error exporting attendances to CSV",
      error: error.message,
    });
  }
};

const exportFilteredAttendanceToPDF = async (req, res) => {
  try {
    const { date = "All", status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (date && date !== "All") {
      if (!isNaN(Date.parse(date))) {
        where["date"] = new Date(date);
      } else if (date.includes("to")) {
        const [startDate, endDate] = date
          .split("to")
          .map((date) => new Date(date.trim()));
        where["date"] = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: attendances } = await Attendence.findAndCountAll({
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

    if (!attendances || attendances.length === 0) {
      return res
        .status(404)
        .json({ message: "No attendance found matching the filters" });
    }

    const attendanceData = attendances.map((attendancez) => {
      return [
        attendancez.id || "N/A",
        attendancez.clockInTime || "N/A",
        attendancez.clockOutTime || "N/A",
        attendancez.date || "N/A",
        attendancez.status || "N/A",
        attendancez.employeeId || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Attendance Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Attendance ID",
                "Clock In Time",
                "Clock Out Time",
                "Date",
                "Status",
                "Employee ID",
              ],
              ...attendanceData,
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
    res.attachment("attendance_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting attendances to PDF:", error);
    res.status(500).json({
      message: "Error exporting attendances to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createAttendence,
  updateAttendence,
  deleteAttendence,
  getAttendenceById,
  getAllAttendences,
  clockIn,
  clockOut,
  integrateAttendanceWithPayroll,
  filterAttendance,
  exportFilteredAttendanceToCSV,
  exportFilteredAttendanceToPDF,
};
