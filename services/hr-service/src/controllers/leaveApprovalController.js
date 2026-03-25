const path = require("path");
const fs = require("fs");
const multer = require("multer");
const Employee = require("../models/employees/EmployeeModel");
const ApplyLeave = require("../models/LeaveApprovalModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const { Op } = require("sequelize");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const storage = multer.diskStorage({
  destination: "public/uploads/leaveApprovalMedicalReports/",
  filename: (req, file, cb) => {
    const { employeeId } = req.body;
    const timestamp = Date.now();
    const fileName = `${employeeId}_medical_${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, JPG, and PNG files are allowed"), false);
    }
  },
});

const createApplyLeave = async (req, res) => {
  const {
    fromDate,
    toDate,
    appliedDate,
    leaveType,
    reason,
    status = "Pending",
    checkedBy,
    employeeId,
  } = req.body;

  let medicalReport = null;

  if (req.file) {
    medicalReport = `public//uploads/leaveApprovalMedicalReports/${req.file.filename}`;
  }

  try {
    const applyleave = await ApplyLeave.create({
      fromDate,
      toDate,
      appliedDate,
      leaveType,
      reason,
      status,
      checkedBy,
      employeeId,
      medicalReport,
    });

    res
      .status(201)
      .json({ message: "Apply leave created successfully", applyleave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateApplyLeave = async (req, res) => {
  const { id } = req.params;
  const { fromDate, toDate, leaveType, reason, status } = req.body;

  try {
    const applyLeaveToUpdate = await ApplyLeave.findByPk(id);

    if (!applyLeaveToUpdate) {
      return res.status(404).json({ message: "Apply leave data not found" });
    }

    leaveToUpdate.fromDate = fromDate || leaveToUpdate.fromDate;
    leaveToUpdate.toDate = toDate || leaveToUpdate.toDate;
    leaveToUpdate.leaveType = leaveType || leaveToUpdate.leaveType;
    leaveToUpdate.reason = reason || leaveToUpdate.reason;
    leaveToUpdate.status = status || leaveToUpdate.status;

    await applyLeaveToUpdate.save();
    res.status(200).json({
      message: "Apply leave data updated successfully",
      applyleave: applyLeaveToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating apply leave data",
      error: error.message,
    });
  }
};

const deleteApplyLeave = async (req, res) => {
  const { id } = req.params;

  try {
    const applyLeaveToDelete = await ApplyLeave.findByPk(id);

    if (!applyLeaveToDelete) {
      return res.status(404).json({ message: "Apply leave data not found" });
    }

    await applyLeaveToDelete.destroy();
    res.status(200).json({ message: "Apply leave data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting apply leave data",
      error: error.message,
    });
  }
};

const getApplyLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const applyleave = await ApplyLeave.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!applyleave) {
      return res.status(404).json({ message: "Apply leave data not found" });
    }

    res.status(200).json(applyleave);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving apply leave data",
      error: error.message,
    });
  }
};

const getAllApplyLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalApplyLeaves, rows: applyleaves } =
      await ApplyLeave.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: {
          model: Employee,
          as: "employee",
        },
      });

    res.status(200).json({
      totalApplyLeaves,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalApplyLeaves / limit),
      applyleaves,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving apply leave data",
      error: error.message,
    });
  }
};

const approveLeave = async (req, res) => {
  const { id } = req.params;
  const { checkedBy } = req.body;

  try {
    const leave = await ApplyLeave.findByPk(id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "Approved";
    leave.checkedBy = checkedBy;
    await leave.save();

    res.status(200).json({ message: "Leave approved successfully", leave });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error approving leave", error: error.message });
  }
};

const rejectLeave = async (req, res) => {
  const { id } = req.params;
  const { checkedBy } = req.body;

  try {
    const leave = await ApplyLeave.findByPk(id);
    if (!leave) return res.status(404).json({ message: "Leave not found" });

    leave.status = "Rejected";
    leave.checkedBy = checkedBy;
    await leave.save();

    res.status(200).json({ message: "Leave rejected successfully", leave });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting leave", error: error.message });
  }
};

const filterApplyLeave = async (req, res) => {
  try {
    const {
      leaveType = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (leaveType !== "All") {
      where["leaveType"] = leaveType;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalApplyLeaveRequests, rows: applyLeaveRequest } =
      await ApplyLeave.findAndCountAll({
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
      totalApplyLeaveRequests,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalApplyLeaveRequests / limit),
      applyLeaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering apply leave data",
      error: error.message,
    });
  }
};

const exportFilteredApplyLeaveToCSV = async (req, res) => {
  try {
    const {
      leaveType = "All",
      status = "All",
      searchTerm = "",
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (leaveType !== "All") {
      where.leaveType = leaveType;
    }

    if (status !== "All") {
      where.status = status;
    }

    if (fromDate) {
      where.fromDate = { [Op.gte]: new Date(fromDate) };
    }

    if (toDate) {
      where.toDate = { [Op.lte]: new Date(toDate) };
    }

    if (searchTerm) {
      where[Op.or] = [
        {
          "$employee.personalDetails.fullNameEnglish$": {
            [Op.iLike]: `%${searchTerm}%`,
          },
        },
      ];
    }

    const { rows: applyleave } = await ApplyLeave.findAndCountAll({
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

    console.log(applyleave);

    const applyLeaveData = applyleave.map((applyleavez) => {
      return {
        applyLeaveId: applyleavez.id,
        fromDate: applyleavez.fromDate,
        toDate: applyleavez.toDate,
        appliedDate: applyleavez.appliedDate,
        medicalReport: applyleavez.medicalReport,
        leaveType: applyleavez.leaveType,
        reason: applyleavez.reason,
        status: applyleavez.status,
        checkedBy: applyleavez.checkedBy,
        employeeId: applyleavez.employeeId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(applyLeaveData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_apply_leaves.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting apply leave to CSV:", error);
    res.status(500).json({
      message: "Error exporting apply leave to CSV",
      error: error.message,
    });
  }
};

const exportFilteredApplyLeaveToPDF = async (req, res) => {
  try {
    const {
      leaveType = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (leaveType !== "All") {
      where["leaveType"] = leaveType;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: applyleave } = await ApplyLeave.findAndCountAll({
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

    if (!applyleave || applyleave.length === 0) {
      return res
        .status(404)
        .json({ message: "No apply leave found matching the filters" });
    }

    // Helper function to format MySQL date strings to YYYY-MM-DD
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : "N/A";

    const applyLeaveData = applyleave.map((applyleavez) => {
      return [
        applyleavez.id || "N/A",
        formatDate(applyleavez.fromDate) || "N/A",
        formatDate(applyleavez.toDate) || "N/A",
        formatDate(applyleavez.appliedDate) || "N/A",
        applyleavez.leaveType || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Leave Approval Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*"],
            body: [
              [
                "Apply Leave ID",
                "From Date",
                "To Date",
                "Applied Date",
                "Leave Type",
              ],
              ...applyLeaveData,
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
    res.attachment("applyleave_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting apply leave to PDF:", error);
    res.status(500).json({
      message: "Error exporting applyleave to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedicalReport: upload.single("medicalReport"),
  createApplyLeave,
  updateApplyLeave,
  deleteApplyLeave,
  getApplyLeaveById,
  getAllApplyLeaves,
  approveLeave,
  rejectLeave,
  filterApplyLeave,
  exportFilteredApplyLeaveToCSV,
  exportFilteredApplyLeaveToPDF,
};
