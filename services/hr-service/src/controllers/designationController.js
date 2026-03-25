const designations = require("../models/DesignationModel");
const Department = require("../models/DepartmentModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createDesignation = async (req, res) => {
  const {
    designationName,
    designationNameArabic,
    designationdescription,
    createdBy,
    status = "Active",
    departmentId,
  } = req.body;

  try {
    const designation = await designations.create({
      designationName,
      designationNameArabic,
      designationdescription,
      createdBy,
      status,
      departmentId,
    });

    res
      .status(201)
      .json({ message: "Designation created successfully", designation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDesignation = async (req, res) => {
  const { id } = req.params;
  const {
    designationName,
    designationNameArabic,
    designationdescription,
    createdBy,
    status,
    departmentId,
  } = req.body;

  try {
    const designationToUpdate = await designations.findByPk(id);

    if (!designationToUpdate) {
      return res.status(404).json({ message: "Designation not found" });
    }

    designationToUpdate.designationName =
      designationName || designationToUpdate.designationName;
    designationToUpdate.designationNameArabic =
      designationNameArabic || designationToUpdate.designationNameArabic;
    designationToUpdate.designationdescription =
      designationdescription || designationToUpdate.designationdescription;
    designationToUpdate.createdBy = createdBy || designationToUpdate.createdBy;
    designationToUpdate.status = status || designationToUpdate.status;
    designationToUpdate.departmentId =
      departmentId || designationToUpdate.departmentId;

    await designationToUpdate.save();
    res.status(200).json({
      message: "Designation updated successfully",
      designation: designationToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating designation", error: error.message });
  }
};

const deleteDesignation = async (req, res) => {
  const { id } = req.params;

  try {
    const designationToDelete = await designations.findByPk(id);

    if (!designationToDelete) {
      return res.status(404).json({ message: "Designation not found" });
    }

    await designationToDelete.destroy();
    res.status(200).json({ message: "Designation deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting designation", error: error.message });
  }
};

const getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await designations.findByPk(id, {
      include: {
        model: Department,
        as: "department",
      },
    });

    if (!designation) {
      return res.status(404).json({ message: "Designation not found" });
    }

    res.status(200).json(designation);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving designation", error: error.message });
  }
};

const getAllDesignations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalDesignations, rows: designation } =
      await designations.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: {
          model: Department,
          as: "department",
        },
      });

    res.status(200).json({
      totalDesignations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDesignations / limit),
      designation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving designations", error: error.message });
  }
};

const filterDesignations = async (req, res) => {
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

    const { count: totalDesignations, rows: designation } =
      await designations.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: Department,
            as: "department",
          },
        ],
      });

    res.status(200).json({
      totalDesignations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalDesignations / limit),
      designation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering designations", error: error.message });
  }
};

const exportFilteredDesignationsToCSV = async (req, res) => {
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

    const { rows: designation } = await designations.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: Department,
          as: "department",
        },
      ],
    });

    console.log(designation);

    if (!designation || designation.length === 0) {
      return res.status(404).json({
        message: "No designation found matching the filters",
      });
    }

    const designationData = designation.map((designationz) => {
      return {
        designationId: designationz.id,
        designationName: designationz.designationName,
        designationNameArabic: designationz.designationNameArabic,
        designationdescription: designationz.designationdescription,
        createdBy: designationz.createdBy,
        status: designationz.status,
        departmentId: designationz.departmentId,
      };
    });

    const json2csvParser = new Parser();
    const csv = "\uFEFF" + json2csvParser.parse(designationData);

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("filtered_designations.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting designations to CSV:", error);
    res.status(500).json({
      message: "Error exporting designations to CSV",
      error: error.message,
    });
  }
};

const exportFiltereddesignationsToPDF = async (req, res) => {
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

    const { rows: designation } = await designations.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: Department,
          as: "department",
        },
      ],
    });

    if (!designation || designation.length === 0) {
      return res
        .status(404)
        .json({ message: "No designation found matching the filters" });
    }

    const designationData = designation.map((designationz) => {
      return [
        designationz.id || "N/A",
        designationz.designationName || "N/A",
        {
          text: designationz.designationNameArabic || "N/A",
          font: "Amiri",
          alignment: "right",
        },
        designationz.createdBy || "N/A",
        designationz.status || "N/A",
        designationz.departmentId || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Designation Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Designation ID",
                "Designation Name English",
                "Designation Name Arabic",
                "Created By",
                "Status",
                "Department ID",
              ],
              ...designationData,
            ],
          },
        },
      ],
      // defaultStyle: {
      //   font: "Roboto",
      //   fontSize: 12,
      // },
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
      // Roboto: {
      //   normal: "node_modules/pdfmake/build/vfs_fonts/Roboto-Regular.ttf",
      //   bold: "node_modules/pdfmake/build/vfs_fonts/Roboto-Medium.ttf",
      //   italics: "node_modules/pdfmake/build/vfs_fonts/Roboto-Italic.ttf",
      //   bolditalics:
      //     "node_modules/pdfmake/build/vfs_fonts/Roboto-MediumItalic.ttf",
      // },
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
    res.attachment("designation_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting designations to PDF:", error);
    res.status(500).json({
      message: "Error exporting designations to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createDesignation,
  updateDesignation,
  deleteDesignation,
  getDesignationById,
  getAllDesignations,
  filterDesignations,
  exportFilteredDesignationsToCSV,
  exportFiltereddesignationsToPDF,
};
