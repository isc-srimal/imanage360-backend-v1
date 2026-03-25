const Employee = require("../../models/hr/employees/EmployeeModel");
const TrainingAndDevelopment = require("../../models/hr/TrainingAndDevelopmentModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const { Op } = require("sequelize");
const multer = require("multer");
const fs = require("fs");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// Define upload directory for training materials
const uploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "trainingMaterials"
);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration for training materials
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const employeeId = req.body.employeeId || "training";
    const timestamp = Date.now();
    const fileName = `${employeeId}_training_material_${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/zip",
    "application/x-rar-compressed",
    "video/mp4",
    "video/avi",
    "video/quicktime",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, ZIP, RAR, MP4, AVI, and MOV files are allowed"
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per file
  fileFilter: fileFilter,
}).array("trainingMaterials", 4); // Field name must match frontend

const createTrainingDevelopment = async (req, res) => {
  const {
    trainingProgramName,
    trainingStartDate,
    trainingEndDate,
    trainingStatus,
    trainerName,
    certificationReceived,
    certificationDate,
    trainingEvaluation,
    employeeId,
  } = req.body;

  try {
    // Validation rules
    if (new Date(trainingStartDate) > new Date(trainingEndDate)) {
      return res
        .status(400)
        .json({ message: "Start date cannot be after end date" });
    }
    if (new Date(trainingStartDate) > new Date()) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the future" });
    }

    // Handle file uploads
    let trainingMaterials = [];
    if (req.files && req.files.length > 0) {
      trainingMaterials = req.files.map((file) => ({
        path: path
          .join("/uploads/trainingMaterials", file.filename)
          .replace(/\\/g, "/"),
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
    }

    const trainingDevelopment = await TrainingAndDevelopment.create({
      trainingProgramName,
      trainingStartDate,
      trainingEndDate,
      trainingStatus,
      trainerName,
      certificationReceived,
      certificationDate,
      trainingEvaluation,
      trainingMaterials,
      employeeId,
    });

    res.status(201).json({
      message: "Training and development created successfully",
      trainingDevelopment,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating training record",
        error: error.message,
      });
  }
};

const updateTrainingDevelopment = async (req, res) => {
  const { id } = req.params;
  const {
    trainingProgramName,
    trainingStartDate,
    trainingEndDate,
    trainingStatus,
    trainerName,
    certificationReceived,
    certificationDate,
    trainingEvaluation,
    employeeId,
    existing_training_materials,
  } = req.body;

  try {
    const trainingDevelopment = await TrainingAndDevelopment.findByPk(id);
    if (!trainingDevelopment) {
      return res
        .status(404)
        .json({ message: "Training and development data not found" });
    }

    // Validation rules
    if (
      trainingStartDate &&
      trainingEndDate &&
      new Date(trainingStartDate) > new Date(trainingEndDate)
    ) {
      return res
        .status(400)
        .json({ message: "Start date cannot be after end date" });
    }
    if (trainingStartDate && new Date(trainingStartDate) > new Date()) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the future" });
    }

    // Handle file uploads
    let trainingMaterials = existing_training_materials
      ? JSON.parse(existing_training_materials)
      : trainingDevelopment.trainingMaterials || [];

    if (req.files && req.files.length > 0) {
      trainingMaterials = [
        ...trainingMaterials,
        ...req.files.map((file) => ({
          path: path
            .join("/uploads/trainingMaterials", file.filename)
            .replace(/\\/g, "/"),
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        })),
      ];
    }

    await trainingDevelopment.update({
      trainingProgramName:
        trainingProgramName || trainingDevelopment.trainingProgramName,
      trainingStartDate:
        trainingStartDate || trainingDevelopment.trainingStartDate,
      trainingEndDate: trainingEndDate || trainingDevelopment.trainingEndDate,
      trainingStatus: trainingStatus || trainingDevelopment.trainingStatus,
      trainerName: trainerName || trainingDevelopment.trainerName,
      certificationReceived:
        certificationReceived !== undefined
          ? certificationReceived
          : trainingDevelopment.certificationReceived,
      certificationDate:
        certificationDate || trainingDevelopment.certificationDate,
      trainingEvaluation:
        trainingEvaluation || trainingDevelopment.trainingEvaluation,
      trainingMaterials,
      employeeId: employeeId || trainingDevelopment.employeeId,
    });

    res.status(200).json({
      message: "Training and development updated successfully",
      trainingDevelopment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating training and development data",
      error: error.message,
    });
  }
};

const deleteTrainingDevelopment = async (req, res) => {
  const { id } = req.params;

  try {
    const trainingDevelopment = await TrainingAndDevelopment.findByPk(id);
    if (!trainingDevelopment) {
      return res
        .status(404)
        .json({ message: "Training and development data not found" });
    }

    await trainingDevelopment.destroy();
    res
      .status(200)
      .json({ message: "Training and development data deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting training and development data",
      error: error.message,
    });
  }
};

const getTrainingDevelopmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const trainingDevelopment = await TrainingAndDevelopment.findByPk(id, {
      include: {
        model: Employee,
        as: "employee",
      },
    });

    if (!trainingDevelopment) {
      return res
        .status(404)
        .json({ message: "Training and development data not found" });
    }

    res.status(200).json(trainingDevelopment);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving training and development data",
      error: error.message,
    });
  }
};

const getAllTrainingDevelopments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalTrainingDevelopments, rows: trainingDevelopments } =
      await TrainingAndDevelopment.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: {
          model: Employee,
          as: "employee",
        },
      });

    res.status(200).json({
      totalTrainingDevelopments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTrainingDevelopments / limit),
      trainingDevelopments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving training and development data",
      error: error.message,
    });
  }
};

const updateTrainingProgress = async (req, res) => {
  const { id } = req.params;
  const { trainingProgress } = req.body;

  if (trainingProgress < 0 || trainingProgress > 100) {
    return res
      .status(400)
      .json({ message: "Progress must be between 0 and 100." });
  }

  try {
    const trainingDevelopment = await TrainingAndDevelopment.findByPk(id);
    if (!trainingDevelopment) {
      return res
        .status(404)
        .json({ message: "Training and development data not found" });
    }

    trainingDevelopment.trainingProgress = trainingProgress;
    trainingDevelopment.progressUpdateDate = new Date();

    await trainingDevelopment.save();

    res.status(200).json({
      message: "Training progress updated successfully",
      trainingDevelopment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating training progress",
      error: error.message,
    });
  }
};

const getTrainingProgressById = async (req, res) => {
  try {
    const { id } = req.params;
    const trainingDevelopment = await TrainingAndDevelopment.findByPk(id, {
      attributes: [
        "id",
        "trainingProgramName",
        "trainingProgress",
        "progressUpdateDate",
      ],
    });

    if (!trainingDevelopment) {
      return res
        .status(404)
        .json({ message: "Training and development data not found" });
    }

    res.status(200).json(trainingDevelopment);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving training progress",
      error: error.message,
    });
  }
};

const getTrainingMaterials = async (req, res) => {
  const { id } = req.params;
  try {
    const trainingDevelopment = await TrainingAndDevelopment.findByPk(id, {
      attributes: ["trainingMaterials"],
    });
    if (!trainingDevelopment) {
      return res
        .status(404)
        .json({ message: "Training and development data not found" });
    }
    res
      .status(200)
      .json({ trainingMaterials: trainingDevelopment.trainingMaterials });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving training materials",
        error: error.message,
      });
  }
};

const serveTrainingMaterialFile = (req, res) => {
  const { filename } = req.params;

  // Define the base path for training materials
  const basePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "trainingMaterials"
  );
  const safePath = path.join(basePath, filename);

  // Security check to prevent directory traversal
  if (!safePath.startsWith(basePath)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (fs.existsSync(safePath)) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".zip": "application/zip",
      ".rar": "application/x-rar-compressed",
      ".mp4": "video/mp4",
      ".avi": "video/avi",
      ".mov": "video/quicktime",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Set Content-Disposition based on file type
    if (
      [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".rar"].includes(ext)
    ) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
    } else {
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    }

    res.setHeader("Content-Type", contentType);
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

const filterTrainingDevelopment = async (req, res) => {
  try {
    const {
      trainingStatus = "All",
      trainingStartDate = "All",
      trainingEndDate = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (trainingStatus !== "All") {
      where.trainingStatus = trainingStatus;
    }

    if (trainingStartDate && trainingStartDate !== "All") {
      if (!isNaN(Date.parse(trainingStartDate))) {
        where.trainingStartDate = new Date(trainingStartDate);
      } else if (trainingStartDate.includes("to")) {
        const [startDate, endDate] = trainingStartDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where.trainingStartDate = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (trainingEndDate && trainingEndDate !== "All") {
      if (!isNaN(Date.parse(trainingEndDate))) {
        where.trainingEndDate = new Date(trainingEndDate);
      } else if (trainingEndDate.includes("to")) {
        const [startDate, endDate] = trainingEndDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where.trainingEndDate = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    const { count: totalTrainingDevelopments, rows: trainingDevelopments } =
      await TrainingAndDevelopment.findAndCountAll({
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
      totalTrainingDevelopments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTrainingDevelopments / limit),
      trainingDevelopments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering training and development data",
      error: error.message,
    });
  }
};

const exportFilteredTrainingDevelopmentToCSV = async (req, res) => {
  try {
    const {
      trainingStatus = "All",
      trainingStartDate = "All",
      trainingEndDate = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (trainingStatus !== "All") {
      where.trainingStatus = trainingStatus;
    }

    if (trainingStartDate && trainingStartDate !== "All") {
      if (!isNaN(Date.parse(trainingStartDate))) {
        where.trainingStartDate = new Date(trainingStartDate);
      } else if (trainingStartDate.includes("to")) {
        const [startDate, endDate] = trainingStartDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where.trainingStartDate = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (trainingEndDate && trainingEndDate !== "All") {
      if (!isNaN(Date.parse(trainingEndDate))) {
        where.trainingEndDate = new Date(trainingEndDate);
      } else if (trainingEndDate.includes("to")) {
        const [startDate, endDate] = trainingEndDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where.trainingEndDate = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    const { rows: trainingDevelopments } =
      await TrainingAndDevelopment.findAndCountAll({
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

    if (!trainingDevelopments || trainingDevelopments.length === 0) {
      return res.status(404).json({
        message: "No training and development found matching the filters",
      });
    }

    const trainingData = trainingDevelopments.map((development) => ({
      trainingId: development.id,
      trainingProgramName: development.trainingProgramName,
      trainingStartDate: development.trainingStartDate,
      trainingEndDate: development.trainingEndDate,
      trainingStatus: development.trainingStatus,
      trainerName: development.trainerName,
      certificationReceived: development.certificationReceived,
      certificationDate: development.certificationDate,
      trainingEvaluation: development.trainingEvaluation,
      trainingMaterials: JSON.stringify(development.trainingMaterials),
      employeeId: development.employeeId,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(trainingData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_training_development.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Error exporting training and development data to CSV",
      error: error.message,
    });
  }
};

const exportFilteredTrainingDevelopmentToPDF = async (req, res) => {
  try {
    const {
      trainingStatus = "All",
      trainingStartDate = "All",
      trainingEndDate = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (trainingStatus !== "All") {
      where.trainingStatus = trainingStatus;
    }

    if (trainingStartDate && trainingStartDate !== "All") {
      if (!isNaN(Date.parse(trainingStartDate))) {
        where.trainingStartDate = new Date(trainingStartDate);
      } else if (trainingStartDate.includes("to")) {
        const [startDate, endDate] = trainingStartDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where.trainingStartDate = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    if (trainingEndDate && trainingEndDate !== "All") {
      if (!isNaN(Date.parse(trainingEndDate))) {
        where.trainingEndDate = new Date(trainingEndDate);
      } else if (trainingEndDate.includes("to")) {
        const [startDate, endDate] = trainingEndDate
          .split("to")
          .map((date) => new Date(date.trim()));
        where.trainingEndDate = {
          [Op.between]: [startDate, endDate],
        };
      }
    }

    const { rows: trainingDevelopments } =
      await TrainingAndDevelopment.findAndCountAll({
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

    if (!trainingDevelopments || trainingDevelopments.length === 0) {
      return res.status(404).json({
        message: "No training and development found matching the filters",
      });
    }

    const trainingData = trainingDevelopments.map((development) => [
      development.id || "N/A",
      development.trainingProgramName || "N/A",
      development.trainingStartDate || "N/A",
      development.trainingEndDate || "N/A",
      development.trainingStatus || "N/A",
      development.trainerName || "N/A",
      development.certificationReceived ? "Yes" : "No",
      development.certificationDate || "N/A",
      development.trainingEvaluation || "N/A",
      development.trainingMaterials.map((m) => m.originalName).join(", ") ||
        "N/A",
      development.employeeId || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Training and Development Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Training ID",
                "Program Name",
                "Start Date",
                "End Date",
                "Status",
                "Trainer Name",
                "Certification",
                "Cert. Date",
                "Evaluation",
                "Materials",
                "Employee ID",
              ],
              ...trainingData,
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
    res.attachment("training_development_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({
      message: "Error exporting training and development data to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadTrainingMaterials: upload,
  createTrainingDevelopment,
  updateTrainingDevelopment,
  deleteTrainingDevelopment,
  getTrainingDevelopmentById,
  getAllTrainingDevelopments,
  updateTrainingProgress,
  getTrainingProgressById,
  getTrainingMaterials,
  serveTrainingMaterialFile,
  filterTrainingDevelopment,
  exportFilteredTrainingDevelopmentToCSV,
  exportFilteredTrainingDevelopmentToPDF,
};
