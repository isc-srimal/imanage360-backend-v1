const leaveTypes = require("../models/LeaveTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createLeaveType = async (req, res) => {
  const {
    leaveTypeName,
    leaveTypeNameArabic,
    description,
    numberOfLeavePerMonth,
    numberOfLeavePerYear,
    employeeType,
    leaveType,
    createdBy,
    status = "Active",
  } = req.body;

  try {
    const leaveTypesz = await leaveTypes.create({
      leaveTypeName,
      leaveTypeNameArabic,
      description,
      numberOfLeavePerMonth,
      numberOfLeavePerYear,
      employeeType,
      leaveType,
      createdBy,
      status,
    });

    res
      .status(201)
      .json({ message: "Leave type created successfully", leaveTypesz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLeaveType = async (req, res) => {
  const { id } = req.params;
  const {
    leaveTypeName,
    leaveTypeNameArabic,
    description,
    numberOfLeavePerMonth,
    numberOfLeavePerYear,
    employeeType,
    leaveType,
    createdBy,
    status,
  } = req.body;

  try {
    const leavesToUpdate = await leaveTypes.findByPk(id);

    if (!leavesToUpdate) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    leavesToUpdate.leaveTypeName =
      leaveTypeName || leavesToUpdate.leaveTypeName;
    leavesToUpdate.leaveTypeNameArabic =
      leaveTypeNameArabic || leavesToUpdate.leaveTypeNameArabic;
    leavesToUpdate.description = description || leavesToUpdate.description;
    leavesToUpdate.numberOfLeavePerMonth =
      numberOfLeavePerMonth || leavesToUpdate.numberOfLeavePerMonth;
    leavesToUpdate.numberOfLeavePerYear =
      numberOfLeavePerYear || leavesToUpdate.numberOfLeavePerYear;
    leavesToUpdate.employeeType = employeeType || leavesToUpdate.employeeType;
    leavesToUpdate.leaveType = leaveType || leavesToUpdate.leaveType;
    leavesToUpdate.createdBy = createdBy || leavesToUpdate.createdBy;
    leavesToUpdate.status = status || leavesToUpdate.status;

    await leavesToUpdate.save();
    res.status(200).json({
      message: "Leave type updated successfully",
      leaveTypes: leavesToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating leave type", error: error.message });
  }
};

const deleteLeaveType = async (req, res) => {
  const { id } = req.params;

  try {
    const leavesToDelete = await leaveTypes.findByPk(id);

    if (!leavesToDelete) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    await leavesToDelete.destroy();
    res.status(200).json({ message: "Leave type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting leave type", error: error.message });
  }
};

const getLeaveTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const leaveType = await leaveTypes.findByPk(id);

    if (!leaveType) {
      return res.status(404).json({ message: "Leave type not found" });
    }

    res.status(200).json(leaveType);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving leave type", error: error.message });
  }
};

const getAllLeaveTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalLeaveTypes, rows: leaveType } =
      await leaveTypes.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalLeaveTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLeaveTypes / limit),
      leaveType,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving leave types", error: error.message });
  }
};

const filterLeaveTypes = async (req, res) => {
  try {
    const {
      leaveType = "All",
      createdBy = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (leaveType !== "All") {
      where["leaveType"] = leaveType;
    }

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalLeaveTypes, rows: leaveTypez } =
      await leaveTypes.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalLeaveTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLeaveTypes / limit),
      leaveTypez,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering leave types", error: error.message });
  }
};

const exportFilteredLeaveTypeToCSV = async (req, res) => {
  try {
    const {
      leaveType = "All",
      createdBy = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (leaveType !== "All") {
      where["leaveType"] = leaveType;
    }

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: leaveTypez } = await leaveTypes.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(leaveTypez);

    if (!leaveTypez || leaveTypez.length === 0) {
      return res.status(404).json({
        message: "No leave types found matching the filters",
      });
    }

    const leaveTypesData = leaveTypez.map((leaveTypeze) => {
      return {
        leaveTypeId: leaveTypeze.id,
        leaveTypeName: leaveTypeze.leaveTypeName,
        leaveTypeNameArabic: leaveTypeze.leaveTypeNameArabic,
        description: leaveTypeze.description,
        numberOfLeavePerMonth: leaveTypeze.numberOfLeavePerMonth,
        numberOfLeavePerYear: leaveTypeze.numberOfLeavePerYear,
        employeeType: leaveTypeze.employeeType,
        leaveType: leaveTypeze.leaveType,
        createdBy: leaveTypeze.createdBy,
        status: leaveTypeze.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = "\uFEFF" + json2csvParser.parse(leaveTypesData);

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("filtered_leave_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting leave types to CSV:", error);
    res.status(500).json({
      message: "Error exporting leave types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredLeaveTypeToPDF = async (req, res) => {
  try {
    const {
      leaveType = "All",
      createdBy = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (leaveType !== "All") {
      where["leaveType"] = leaveType;
    }

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: leaveTypez } = await leaveTypes.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!leaveTypez || leaveTypez.length === 0) {
      return res
        .status(404)
        .json({ message: "No leave Type found matching the filters" });
    }

    const leaveTypeData = leaveTypez.map((leaveTypeze) => {
      return [
        leaveTypeze.id || "N/A",
        leaveTypeze.leaveTypeName || "N/A",
        {
          text: leaveTypeze.leaveTypeNameArabic || "N/A",
          font: "Amiri",
          alignment: "right",
        },
        leaveTypeze.numberOfLeavePerMonth || "N/A",
        leaveTypeze.numberOfLeavePerYear || "N/A",
        leaveTypeze.employeeType || "N/A",
        leaveTypeze.leaveType || "N/A",
        leaveTypeze.createdBy || "N/A",
        leaveTypeze.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Leave type Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Leave Type ID",
                "Leave Type Name",
                "Leave Type Name Arabic",
                "No Leave Per Month",
                "No Leave Per Year",
                "Employee Type",
                "Leave Type",
                "Created By",
                "Status",
              ],
              ...leaveTypeData,
            ],
          },
        },
      ],
      defaultStyle: {
        font: "Roboto",
        fontSize: 12,
      },
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
      Amiri: {
        normal: path.join(sourceDir, "Amiri-Regular.ttf"),
        bold: path.join(sourceDir, "Amiri-Bold.ttf"),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.header("Content-Type", "application/pdf");
    res.attachment("leave_type_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting leave types to PDF:", error);
    res.status(500).json({
      message: "Error exporting leave types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createLeaveType,
  updateLeaveType,
  deleteLeaveType,
  getLeaveTypeById,
  getAllLeaveTypes,
  filterLeaveTypes,
  exportFilteredLeaveTypeToCSV,
  exportFilteredLeaveTypeToPDF,
};
