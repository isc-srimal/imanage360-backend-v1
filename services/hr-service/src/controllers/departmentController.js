const Department = require("../models/DepartmentModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createDepartment = async (req, res) => {
  const {
    departmentName,
    departmentNo,
    departmentDescription,
    departmentHead,
    location,
    createdBy,
    status = "Active",
  } = req.body;

  try {
    const department = await Department.create({
      departmentName,
      departmentNo,
      departmentDescription,
      departmentHead,
      location,
      createdBy,
      status,
    });

    res
      .status(201)
      .json({ message: "Department created successfully", department });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const {
    departmentName,
    departmentNo,
    departmentDescription,
    departmentHead,
    location,
    createdBy,
    status,
  } = req.body;

  try {
    const departmentToUpdate = await Department.findByPk(id);

    if (!departmentToUpdate) {
      return res.status(404).json({ message: "Department not found" });
    }

    departmentToUpdate.departmentName =
      departmentName || departmentToUpdate.departmentName;
    departmentToUpdate.departmentNo =
      departmentNo || departmentToUpdate.departmentNo;
    departmentToUpdate.departmentDescription =
      departmentDescription || departmentToUpdate.departmentDescription;
    departmentToUpdate.departmentHead =
      departmentHead || departmentToUpdate.departmentHead;
    departmentToUpdate.location = location || departmentToUpdate.location;
    departmentToUpdate.createdBy = createdBy || departmentToUpdate.createdBy;
    departmentToUpdate.status = status || departmentToUpdate.status;

    await departmentToUpdate.save();
    res.status(200).json({
      message: "Department updated successfully",
      department: departmentToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating department", error: error.message });
  }
};

const deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const departmentToDelete = await Department.findByPk(id);

    if (!departmentToDelete) {
      return res.status(404).json({ message: "Department not found" });
    }

    await departmentToDelete.destroy();
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting department", error: error.message });
  }
};

const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json(department);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving department", error: error.message });
  }
};

const getAllDepartments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalDepartments, rows: departments } =
      await Department.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalDepartments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDepartments / limit),
      departments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving departments", error: error.message });
  }
};

const filterDepartments = async (req, res) => {
  try {
    const {
      createdBy = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalDepartments, rows: departments } =
      await Department.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalDepartments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDepartments / limit),
      departments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering departments", error: error.message });
  }
};

const exportFilteredDepartmentsToCSV = async (req, res) => {
  try {
    const {
      createdBy = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: departments } = await Department.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(departments);

    if (!departments || departments.length === 0) {
      return res.status(404).json({
        message: "No department found matching the filters",
      });
    }

    const departmentData = departments.map((departmentz) => {
      return {
        departmentId: departmentz.id,
        departmentNo: departmentz.departmentNo,
        departmentName: departmentz.departmentName,
        departmentDescription: departmentz.departmentDescription,
        departmentHead: departmentz.departmentHead,
        location: departmentz.location,
        createdBy: departmentz.createdBy,
        status: departmentz.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(departmentData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_departments.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting departments to CSV:", error);
    res.status(500).json({
      message: "Error exporting departments to CSV",
      error: error.message,
    });
  }
};

const exportFilteredDepartmentsToPDF = async (req, res) => {
  try {
    const {
      createdBy = "All",
      status = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (createdBy !== "All") {
      where["createdBy"] = createdBy;
    }

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: departments } = await Department.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!departments || departments.length === 0) {
      return res
        .status(404)
        .json({ message: "No department found matching the filters" });
    }

    const departmentData = departments.map((departmentz) => {
      return [
        departmentz.id || "N/A",
        departmentz.departmentNo || "N/A",
        departmentz.departmentName || "N/A",
        departmentz.departmentHead || "N/A",
        departmentz.location || "N/A",
        departmentz.createdBy || "N/A",
        departmentz.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Department Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Department ID",
                "Department No",
                "Department Name",
                "Department Head",
                "Location",
                "Created By",
                "Status",
              ],
              ...departmentData,
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
    res.attachment("department_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting departments to PDF:", error);
    res.status(500).json({
      message: "Error exporting departments to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentById,
  getAllDepartments,
  filterDepartments,
  exportFilteredDepartmentsToCSV,
  exportFilteredDepartmentsToPDF,
};
