const Employee = require("../models/employees/EmployeeModel");
const Leave = require("../models/LeaveRequestModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const storage = multer.diskStorage({
  destination: "public/uploads/leaveRequestsPortalMedicalReports/",
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

const createLeave = async (req, res) => {
  const {
    leaveStartDate,
    leaveEndDate,
    leaveType,
    reason,
    status = "pending",
    approvedBy,
    approvalDate,
    employeeId,
  } = req.body;

  let medicalReport = null;

  if (req.file) {
    medicalReport = `/public/uploads/leaveRequestsPortalMedicalReports/${req.file.filename}`;
  }

  try {
    const leave = await Leave.create({
      leaveStartDate,
      leaveEndDate,
      leaveType,
      reason,
      status,
      approvedBy,
      approvalDate,
      employeeId,
      medicalReport,
    });

    res
      .status(201)
      .json({ message: "Leave request created successfully", leave });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLeave = async (req, res) => {
  const { id } = req.params;
  const {
    leaveStartDate,
    leaveEndDate,
    leaveType,
    reason,
    status,
    employeeId,
  } = req.body;

  try {
    const leaveToUpdate = await Leave.findByPk(id);

    if (!leaveToUpdate) {
      return res.status(404).json({ message: "Leave data not found" });
    }

    leaveToUpdate.leaveStartDate =
      leaveStartDate || leaveToUpdate.leaveStartDate;
    leaveToUpdate.leaveEndDate = leaveEndDate || leaveToUpdate.leaveEndDate;
    leaveToUpdate.leaveType = leaveType || leaveToUpdate.leaveType;
    leaveToUpdate.reason = reason || leaveToUpdate.reason;
    leaveToUpdate.status = status || leaveToUpdate.status;
    leaveToUpdate.employeeId = employeeId || leaveToUpdate.employeeId;

    await leaveToUpdate.save();
    res.status(200).json({
      message: "Leave data updated successfully",
      leave: leaveToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating leave data",
      error: error.message,
    });
  }
};

const deleteLeave = async (req, res) => {
  const { id } = req.params;

  try {
    const leaveToDelete = await Leave.findByPk(id);

    if (!leaveToDelete) {
      return res.status(404).json({ message: "Leave data not found" });
    }

    await leaveToDelete.destroy();
    res.status(200).json({ message: "Leave data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting leave data",
      error: error.message,
    });
  }
};

const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await Leave.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!leave) {
      return res.status(404).json({ message: "Leave data not found" });
    }

    res.status(200).json(leave);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving leave data",
      error: error.message,
    });
  }
};

const getAllLeaves = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalLeaves, rows: leaves } = await Leave.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: {
        model: Employee,
        as: "employee",
      },
    });

    res.status(200).json({
      totalLeaves,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLeaves / limit),
      leaves,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving leave data",
      error: error.message,
    });
  }
};

const approveLeave = async (req, res) => {
  const { id } = req.params;
  const { approverId } = req.body;

  try {
    const leaveToApprove = await Leave.findByPk(id);

    if (!leaveToApprove) {
      return res.status(404).json({ message: "Leave data not found" });
    }

    if (leaveToApprove.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Leave request is already processed" });
    }

    leaveToApprove.status = "approved";
    leaveToApprove.approvedBy = approverId;
    leaveToApprove.approvalDate = new Date();

    await leaveToApprove.save();
    res.status(200).json({
      message: "Leave request approved successfully",
      leave: leaveToApprove,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error approving leave request",
      error: error.message,
    });
  }
};

const rejectLeave = async (req, res) => {
  const { id } = req.params;
  const { approverId } = req.body;

  try {
    const leaveToReject = await Leave.findByPk(id);

    if (!leaveToReject) {
      return res.status(404).json({ message: "Leave data not found" });
    }

    if (leaveToReject.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Leave request is already processed" });
    }

    leaveToReject.status = "rejected";
    leaveToReject.approvedBy = approverId;
    leaveToReject.approvalDate = new Date();

    await leaveToReject.save();
    res.status(200).json({
      message: "Leave request rejected successfully",
      leave: leaveToReject,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting leave request",
      error: error.message,
    });
  }
};

const filterLeaveRequest = async (req, res) => {
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

    const { count: totalLeaveRequests, rows: leaveRequest } =
      await Leave.findAndCountAll({
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
      totalLeaveRequests,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLeaveRequests / limit),
      leaveRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering leave requests",
      error: error.message,
    });
  }
};

const exportFilteredLeaveRequestToCSV = async (req, res) => {
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

    const { rows: leaveRequests } = await Leave.findAndCountAll({
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

    console.log(leaveRequests);

    if (!leaveRequests || leaveRequests.length === 0) {
      return res.status(404).json({
        message: "No leave request found matching the filters",
      });
    }

    const leaveRequestsData = leaveRequests.map((leaveRequestz) => {
      return {
        leaveRequestId: leaveRequestz.id,
        leaveStartDate: leaveRequestz.leaveStartDate,
        leaveEndDate: leaveRequestz.leaveEndDate,
        leaveType: leaveRequestz.leaveType,
        reason: leaveRequestz.reason,
        status: leaveRequestz.status,
        // approvedBy: leaveRequestz.approvedBy,
        // approvalDate: leaveRequestz.approvalDate,
        employeeId: leaveRequestz.employeeId,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(leaveRequestsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_leaveRequest.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting leave requests to CSV:", error);
    res.status(500).json({
      message: "Error exporting leave requests to CSV",
      error: error.message,
    });
  }
};

const exportFilteredLeaveRequestToPDF = async (req, res) => {
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

    const { rows: leaveRequests } = await Leave.findAndCountAll({
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

    if (!leaveRequests || leaveRequests.length === 0) {
      return res
        .status(404)
        .json({ message: "No leave request found matching the filters" });
    }

    // Helper function to format MySQL date strings to YYYY-MM-DD
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : "N/A";

    // Create table data rows with formatted dates
    const leaveRequestData = leaveRequests.map((leaveRequestz) => {
      return [
        leaveRequestz.id || "N/A",
        formatDate(leaveRequestz.leaveStartDate),
        formatDate(leaveRequestz.leaveEndDate),
        leaveRequestz.leaveType || "N/A",
        leaveRequestz.employeeId || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Leave Request Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*"],
            body: [
              [
                "Leave Request ID",
                "Leave Start Date",
                "Leave End Date",
                "Leave Type",
                "Employee ID",
              ],
              ...leaveRequestData,
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
    res.attachment("leaveRequest_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting leave requests to PDF:", error);
    res.status(500).json({
      message: "Error exporting leave requests to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedicalReport: upload.single("medicalReport"),
  createLeave,
  updateLeave,
  deleteLeave,
  getLeaveById,
  getAllLeaves,
  approveLeave,
  rejectLeave,
  filterLeaveRequest,
  exportFilteredLeaveRequestToCSV,
  exportFilteredLeaveRequestToPDF,
};
