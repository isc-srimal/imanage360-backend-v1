const ManpowerModel = require("../models/ManpowerModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const OperatorTypeModel = require("../models/OperatorTypeModel");
const EquipmentModel = require("../models/EquipmentModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const stream = require("stream");
const fs = require("fs"); 
const fsPromises = require("fs").promises; 
const multer = require("multer"); 

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const uploadGatePassDocument = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/gatePassAttachmentDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 }, // 50MB file size limit
}).any();

// Helper function to delete old files
const deleteOldFile = async (filePath) => {
  if (!filePath) return;

  try {
    const actualPath = filePath.replace(/^\/public\//, "public/");
    const fullPath = path.join(__dirname, "..", "..", actualPath);

    if (await fs.access(fullPath).then(() => true).catch(() => false)) {
      await fs.unlink(fullPath);
      console.log(`Deleted old file: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

const updateManpower = async (req, res) => {
  uploadGatePassDocument(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    const { manpower_id } = req.params;
    let parsedManpowerData;

    try {
      // Check if 'data' came as a file instead of form field
      const dataFile = req.files?.find((f) => f.fieldname === "data");

      if (dataFile) {
        const fileContent = await fsPromises.readFile(dataFile.path, "utf8");
        parsedManpowerData = JSON.parse(fileContent);
        await fsPromises.unlink(dataFile.path); // Delete temporary data file
      } else if (req.body.data) {
        parsedManpowerData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({
          message: "Missing employee form data in 'data' field",
        });
      }

      const {
        employeeId,
        employeeNo,
        contractNo,
        employeeFullName,
        operator_type_id,
        contractType,
        employeeType,
        employeeStatus,
        serial_number,
        equipmentDetails,
        month,
        gatePassNumber,
        gatePassIssueDate,
        gatePassExpiryDate,
        gatePassAttachment,
        gatePassExpiryStatus,
        status,
        manpower_status,
        manpower_status_note,
      } = parsedManpowerData;

      const manpowerToUpdate = await ManpowerModel.findByPk(manpower_id);

      if (!manpowerToUpdate) {
        return res.status(404).json({ message: "Manpower not found" });
      }

      // Handle file uploads (exclude 'data' file)
      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            if (!acc[file.fieldname]) {
              acc[file.fieldname] = [];
            }
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      // Update manpower details
      const updatedManpowerDetails = {
        employeeId: employeeId || manpowerToUpdate.employeeId,
        employeeNo: employeeNo || manpowerToUpdate.employeeNo,
        contractNo: contractNo || manpowerToUpdate.contractNo,
        employeeFullName: employeeFullName || manpowerToUpdate.employeeFullName,
        operator_type_id: operator_type_id || manpowerToUpdate.operator_type_id,
        contractType: contractType || manpowerToUpdate.contractType,
        employeeType: employeeType || manpowerToUpdate.employeeType,
        employeeStatus: employeeStatus || manpowerToUpdate.employeeStatus,
        serial_number: serial_number || manpowerToUpdate.serial_number,
        equipmentDetails: equipmentDetails || manpowerToUpdate.equipmentDetails,
        month: month || manpowerToUpdate.month,
        gatePassNumber: gatePassNumber || manpowerToUpdate.gatePassNumber,
        gatePassIssueDate:
          gatePassIssueDate || manpowerToUpdate.gatePassIssueDate,
        gatePassExpiryDate:
          gatePassExpiryDate || manpowerToUpdate.gatePassExpiryDate,
        gatePassExpiryStatus:
          gatePassExpiryStatus || manpowerToUpdate.gatePassExpiryStatus,
        status: status || manpowerToUpdate.status,
        manpower_status: manpower_status || manpowerToUpdate.manpower_status,
        manpower_status_note: manpower_status_note || manpowerToUpdate.manpower_status_note,
      };

      // Handle gate pass attachment
      if (uploadedFiles.gatePassAttachment?.[0]?.filename) {
        if (manpowerToUpdate.gatePassAttachment) {
          await deleteOldFile(manpowerToUpdate.gatePassAttachment);
        }
        updatedManpowerDetails.gatePassAttachment =
          `/public/uploads/gatePassAttachmentDocuments/${uploadedFiles.gatePassAttachment[0].filename}`;
      }

      // Update the manpower record
      await manpowerToUpdate.update(updatedManpowerDetails);

      res.status(200).json({
        message: "Manpower updated successfully",
        manpower: manpowerToUpdate,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating manpower", error: error.message });
    }
  });
};

const deleteManpower = async (req, res) => {
  const { manpower_id } = req.params;

  try {
    const manpowerToDelete = await ManpowerModel.findByPk(manpower_id);

    if (!manpowerToDelete) {
      return res.status(404).json({ message: "Manpower not found" });
    }

    // Delete associated gate pass attachment
    if (manpowerToDelete.gatePassAttachment) {
      await deleteOldFile(manpowerToDelete.gatePassAttachment);
    }

    await manpowerToDelete.destroy();
    res.status(200).json({ message: "Manpower deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting manpower", error: error.message });
  }
};

const getManpowerById = async (req, res) => {
  try {
    const { manpower_id } = req.params;
    const manpower = await ManpowerModel.findByPk(manpower_id, {
      include: [
        { model: EmployeeModel, as: "employee" },
        { model: OperatorTypeModel, as: "operator_type" },
        { model: EquipmentModel, as: "equipment" },
      ],
    });

    if (!manpower) {
      return res.status(404).json({ message: "Manpower not found" });
    }

    res.status(200).json(manpower);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving manpower", error: error.message });
  }
};

const getAllManpower = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalManpower, rows: manpower } =
      await ManpowerModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          { model: EmployeeModel, as: "employee" },
          {
            model: OperatorTypeModel,
            as: "operator_type",
            attributes: ["operator_type_id", "operator_type", "status"],
          },
          { model: EquipmentModel, as: "equipment" },
        ],
      });

    res.status(200).json({
      totalManpower,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalManpower / limit),
      manpower,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving manpower", error: error.message });
  }
};

const serveManpowerFile = async (req, res) => {
  const validFolders = ["gatePassAttachmentDocuments"];
  const { folder, filename } = req.params;

  // Validate folder
  if (!validFolders.includes(folder)) {
    return res.status(400).json({ message: "Invalid folder" });
  }

  // Construct and validate file path
  const basePath = path.join(__dirname, "..", "..", "public", "uploads");
  const safePath = path.join(basePath, folder, filename);

  if (!safePath.startsWith(basePath)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    // Check if file exists and get stats
    const stats = await fsPromises.stat(safePath);
    if (!stats.isFile()) {
      return res.status(404).json({ message: "Not a file" });
    }

    // Check if file is empty
    if (stats.size === 0) {
      return res.status(422).json({ message: "File is empty" });
    }

    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xls": "application/vnd.ms-excel",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);

    // Create read stream
    const readStream = fs.createReadStream(safePath); // Use standard fs

    // Handle stream errors
    readStream.on("error", (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming file", error: error.message });
      }
    });

    // Pipe the stream to response
    readStream.pipe(res);

    // Handle response finish/error to ensure proper cleanup
    res.on("finish", () => {
      readStream.destroy();
    });
    res.on("error", (error) => {
      console.error("Response error:", error);
      readStream.destroy();
    });
  } catch (error) {
    console.error("Error serving file:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error serving file", error: error.message });
    }
  }
};
const filterManpower = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalManpower, rows: manpower } =
      await ManpowerModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: EmployeeModel, as: "employee" },
          { model: OperatorTypeModel, as: "operator_type" },
          { model: EquipmentModel, as: "equipment" },
        ],
      });

    res.status(200).json({
      totalManpower,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalManpower / limit),
      manpower,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering manpower", error: error.message });
  }
};

const exportFilteredManpowerToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: manpower } = await ManpowerModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: EmployeeModel, as: "employee" },
        { model: OperatorTypeModel, as: "operator_type" },
        { model: EquipmentModel, as: "equipment" },
      ],
    });

    if (!manpower || manpower.length === 0) {
      return res.status(404).json({
        message: "No manpower found matching the filters",
      });
    }

    const manpowerData = manpower.map((record) => ({
      manpowerId: record.manpower_id || 0,
      employeeId: record.employee?.id || 0,
      employeeNo: record.employee?.personalDetails?.employeeNo || "N/A",
      contractNo: record.employee?.employeeContracts?.contractNo || "N/A",
      employeeFullName:
        record.employee?.personalDetails?.fullNameEnglish || "N/A",
      operator_type: record.operator_type?.operator_type || "N/A",
      contractType: record.employee?.employeeContracts?.contractType || "N/A",
      employeeType: record.employee?.otherDetails?.employeeType || "N/A",
      employeeStatus: record.employee?.otherDetails?.status || "N/A",
      equipmentDetails: record.equipmentDetails || "N/A",
      month: record.month || "N/A",
      gatePassNumber: record.gatePassNumber || "N/A",
      gatePassIssueDate: record.gatePassIssueDate || "N/A",
      gatePassExpiryDate: record.gatePassExpiryDate || "N/A",
      gatePassAttachment: record.gatePassAttachment || "N/A",
      gatePassExpiryStatus: record.gatePassExpiryStatus || "N/A",
      status: record.status || "N/A",
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(manpowerData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_manpower.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting manpower to CSV:", error);
    res.status(500).json({
      message: "Error exporting manpower to CSV",
      error: error.message,
    });
  }
};

const exportFilteredManpowerToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: manpower } = await ManpowerModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: EmployeeModel, as: "employee" },
        { model: OperatorTypeModel, as: "operator_type" },
        { model: EquipmentModel, as: "equipment" },
      ],
    });

    if (!manpower || manpower.length === 0) {
      return res
        .status(404)
        .json({ message: "No manpower found matching the filters" });
    }

    const manpowerData = manpower.map((record) => [
      record.manpower_id || "N/A",
      record.employee?.id || "N/A",
      record.employee?.personalDetails?.employeeNo || "N/A",
      record.employee?.employeeContracts?.contractNo || "N/A",
      record.employee?.personalDetails?.fullNameEnglish || "N/A",
      record.operator_type?.operator_type || "N/A",
      record.employee?.employeeContracts?.contractType || "N/A",
      record.employee?.otherDetails?.employeeType || "N/A",
      record.employee?.otherDetails?.status || "N/A",
      record.equipmentDetails || "N/A",
      record.month || "N/A",
      record.gatePassNumber || "N/A",
      record.gatePassIssueDate || "N/A",
      record.gatePassExpiryDate || "N/A",
      record.gatePassAttachment || "N/A",
      record.gatePassExpiryStatus || "N/A",
      record.status || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Manpower Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [
              30, 40, 60, 60, 80, 40, 50, 50, 50, 60, 30, 60, 60, 60, 60, 60,
              50,
            ],
            body: [
              [
                "ID",
                "Employee ID",
                "Employee No",
                "Contract No",
                "Full Name",
                "Operator Type",
                "Contract Type",
                "Employee Type",
                "Employee Status",
                "Equipment Details",
                "Month",
                "Gate Pass No",
                "Issue Date",
                "Expiry Date",
                "Attachment",
                "Expiry Status",
                "Status",
              ],
              ...manpowerData,
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
    res.attachment("manpower_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting manpower to PDF:", error);
    res.status(500).json({
      message: "Error exporting manpower to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadGatePassDocument,
  updateManpower,
  deleteManpower,
  getManpowerById,
  getAllManpower,
  serveManpowerFile,
  filterManpower,
  exportFilteredManpowerToCSV,
  exportFilteredManpowerToPDF,
};