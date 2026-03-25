const Employee = require("../../models/hr/employees/EmployeeModel");
const TrainingAndDevelopment = require("../../models/hr/TrainingAndDevelopmentModel");
const TrainingDetails = require("../../models/hr/TrainingDetailsModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const { Op } = require("sequelize");
const multer = require("multer");
const fs = require("fs");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const uploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "certifications"
);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration for certification documents
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const employeeId = req.body.employeeId || "certification";
    const timestamp = Date.now();
    const fileName = `${employeeId}_certification_${timestamp}${path.extname(
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
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only PDF, JPG, PNG, DOC, and DOCX files are allowed"),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter: fileFilter,
}).single("certificationDocument");

const createTrainingDetails = async (req, res) => {
  const {
    trainingId,
    employeeId,
    enrollmentDate,
    trainingProgress = 0,
    attendancePercentage,
    assessmentScore,
    feedback,
    certificationStatus = "pending",
    certificationDate,
    trainingNotes,
  } = req.body;

  try {
    // Check if training and employee exist
    const training = await TrainingAndDevelopment.findByPk(trainingId);
    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if training details already exist for this employee and training
    const existingDetails = await TrainingDetails.findOne({
      where: { trainingId, employeeId },
    });
    if (existingDetails) {
      return res.status(400).json({
        message: "Training details already exist for this employee and training",
      });
    }

    // Handle certification document upload
    let certificationDocument = null;
    if (req.file) {
      certificationDocument = {
        path: path
          .join("/uploads/certifications", req.file.filename)
          .replace(/\\/g, "/"),
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    const trainingDetails = await TrainingDetails.create({
      trainingId,
      employeeId,
      enrollmentDate: enrollmentDate || new Date(),
      trainingProgress,
      attendancePercentage,
      assessmentScore,
      feedback,
      certificationStatus,
      certificationDate,
      certificationDocument,
      trainingNotes,
      progressUpdateDate: new Date(),
    });

    res.status(201).json({
      message: "Training details created successfully",
      trainingDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating training details",
      error: error.message,
    });
  }
};

const updateTrainingDetails = async (req, res) => {
  const { id } = req.params;
  const {
    trainingProgress,
    attendancePercentage,
    assessmentScore,
    feedback,
    certificationStatus,
    certificationDate,
    trainingNotes,
    completionDate,
  } = req.body;

  try {
    const trainingDetails = await TrainingDetails.findByPk(id);
    if (!trainingDetails) {
      return res.status(404).json({ message: "Training details not found" });
    }

    // Handle certification document upload
    let certificationDocument = trainingDetails.certificationDocument;
    if (req.file) {
      certificationDocument = {
        path: path
          .join("/uploads/certifications", req.file.filename)
          .replace(/\\/g, "/"),
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      };
    }

    await trainingDetails.update({
      trainingProgress: trainingProgress !== undefined ? trainingProgress : trainingDetails.trainingProgress,
      attendancePercentage: attendancePercentage !== undefined ? attendancePercentage : trainingDetails.attendancePercentage,
      assessmentScore: assessmentScore !== undefined ? assessmentScore : trainingDetails.assessmentScore,
      feedback: feedback !== undefined ? feedback : trainingDetails.feedback,
      certificationStatus: certificationStatus || trainingDetails.certificationStatus,
      certificationDate: certificationDate || trainingDetails.certificationDate,
      certificationDocument,
      trainingNotes: trainingNotes !== undefined ? trainingNotes : trainingDetails.trainingNotes,
      completionDate: completionDate || trainingDetails.completionDate,
      progressUpdateDate: new Date(),
      lastAccessedDate: new Date(),
    });

    res.status(200).json({
      message: "Training details updated successfully",
      trainingDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating training details",
      error: error.message,
    });
  }
};

const deleteTrainingDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const trainingDetails = await TrainingDetails.findByPk(id);
    if (!trainingDetails) {
      return res.status(404).json({ message: "Training details not found" });
    }

    await trainingDetails.destroy();
    res.status(200).json({ message: "Training details deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting training details",
      error: error.message,
    });
  }
};

const getTrainingDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const trainingDetails = await TrainingDetails.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        {
          model: TrainingAndDevelopment,
          as: "training",
          attributes: [
            "id",
            "trainingProgramName",
            "trainerName",
            "trainingStartDate",
            "trainingEndDate",
            "trainingStatus",
          ],
        },
      ],
    });

    if (!trainingDetails) {
      return res.status(404).json({ message: "Training details not found" });
    }

    // Format employee data
    const formattedTrainingDetails = {
      ...trainingDetails.toJSON(),
      employee: trainingDetails.employee ? {
        id: trainingDetails.employee.id,
        fullNameEnglish: trainingDetails.employee.personalDetails.fullNameEnglish || "",
        email: trainingDetails.employee.personalDetails.email || "",
      } : null,
    };

    res.status(200).json(formattedTrainingDetails);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving training details",
      error: error.message,
    });
  }
};

const getAllTrainingDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalTrainingDetails, rows: trainingDetails } =
      await TrainingDetails.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: Employee,
            as: "employee",
            attributes: ["id", "personalDetails"],
          },
          {
            model: TrainingAndDevelopment,
            as: "training",
            attributes: [
              "id",
              "trainingProgramName",
              "trainerName",
              "trainingStartDate",
              "trainingEndDate",
              "trainingStatus",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

    // Format employee data in response
    const formattedTrainingDetails = trainingDetails.map(detail => ({
      ...detail.toJSON(),
      employee: detail.employee ? {
        id: detail.employee.id,
        fullNameEnglish: detail.employee.personalDetails.fullNameEnglish || "",
        email: detail.employee.personalDetails.email || "",
      } : null,
    }));

    res.status(200).json({
      totalTrainingDetails,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTrainingDetails / limit),
      trainingDetails: formattedTrainingDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving training details",
      error: error.message,
    });
  }
};

const getTrainingDetailsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalTrainingDetails, rows: trainingDetails } =
      await TrainingAndDevelopment.findAndCountAll({
        where: { employeeId },
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: Employee,
            as: "employee",
            attributes: ["id", "personalDetails"],
          },
        ],
      });

    // Format employee data in response
    const formattedTrainingDetails = trainingDetails.map(detail => ({
      ...detail.toJSON(),
      employee: detail.employee ? {
        id: detail.employee.id,
        fullNameEnglish: detail.employee.personalDetails.fullNameEnglish || "",
        email: detail.employee.personalDetails.email || "",
      } : null,
    }));

    res.status(200).json({
      totalTrainingDetails,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTrainingDetails / limit),
      trainingDetails: formattedTrainingDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving employee training details",
      error: error.message,
    });
  }
};

const getTrainingDetailsByTraining = async (req, res) => {
  try {
    const { trainingId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalTrainingDetails, rows: trainingDetails } =
      await TrainingDetails.findAndCountAll({
        where: { trainingId },
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: Employee,
            as: "employee",
            attributes: ["id", "personalDetails"],
          },
          {
            model: TrainingAndDevelopment,
            as: "training",
            attributes: [
              "id",
              "trainingProgramName",
              "trainerName",
              "trainingStartDate",
              "trainingEndDate",
              "trainingStatus",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

    // Format employee data in response
    const formattedTrainingDetails = trainingDetails.map(detail => ({
      ...detail.toJSON(),
      employee: detail.employee ? {
        id: detail.employee.id,
        fullNameEnglish: detail.employee.personalDetails.fullNameEnglish || "",
        email: detail.employee.personalDetails.email || "",
      } : null,
    }));

    res.status(200).json({
      totalTrainingDetails,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTrainingDetails / limit),
      trainingDetails: formattedTrainingDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving training details for training",
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
    const trainingDetails = await TrainingDetails.findByPk(id);
    if (!trainingDetails) {
      return res.status(404).json({ message: "Training details not found" });
    }

    await trainingDetails.update({
      trainingProgress,
      progressUpdateDate: new Date(),
      lastAccessedDate: new Date(),
      // Auto-complete if progress reaches 100%
      completionDate: trainingProgress === 100 && !trainingDetails.completionDate ? new Date() : trainingDetails.completionDate,
    });

    res.status(200).json({
      message: "Training progress updated successfully",
      trainingDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating training progress",
      error: error.message,
    });
  }
};

const serveCertificationFile = (req, res) => {
  const { filename } = req.params;

  const basePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "certifications"
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
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

const filterTrainingDetails = async (req, res) => {
  try {
    const {
      certificationStatus = "All",
      trainingProgress = "All",
      employeeId = "All",
      trainingId = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (certificationStatus !== "All") {
      where.certificationStatus = certificationStatus;
    }

    if (trainingProgress !== "All") {
      if (trainingProgress === "completed") {
        where.trainingProgress = 100;
      } else if (trainingProgress === "in-progress") {
        where.trainingProgress = { [Op.between]: [1, 99] };
      } else if (trainingProgress === "not-started") {
        where.trainingProgress = 0;
      }
    }

    if (employeeId !== "All") {
      where.employeeId = employeeId;
    }

    if (trainingId !== "All") {
      where.trainingId = trainingId;
    }

    const { count: totalTrainingDetails, rows: trainingDetails } =
      await TrainingDetails.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: Employee,
            as: "employee",
            attributes: ["id", "personalDetails"],
          },
          {
            model: TrainingAndDevelopment,
            as: "training",
            attributes: [
              "id",
              "trainingProgramName",
              "trainerName",
              "trainingStartDate",
              "trainingEndDate",
              "trainingStatus",
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

    // Format employee data in response
    const formattedTrainingDetails = trainingDetails.map(detail => ({
      ...detail.toJSON(),
      employee: detail.employee ? {
        id: detail.employee.id,
        fullNameEnglish: detail.employee.personalDetails.fullNameEnglish || "",
        email: detail.employee.personalDetails.email || "",
      } : null,
    }));

    res.status(200).json({
      totalTrainingDetails,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTrainingDetails / limit),
      trainingDetails: formattedTrainingDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering training details",
      error: error.message,
    });
  }
};

const exportTrainingDetailsToCSV = async (req, res) => {
  try {
    const {
      certificationStatus = "All",
      trainingProgress = "All",
      employeeId = "All",
      trainingId = "All",
    } = req.query;

    const where = {};

    if (certificationStatus !== "All") {
      where.certificationStatus = certificationStatus;
    }

    if (trainingProgress !== "All") {
      if (trainingProgress === "completed") {
        where.trainingProgress = 100;
      } else if (trainingProgress === "in-progress") {
        where.trainingProgress = { [Op.between]: [1, 99] };
      } else if (trainingProgress === "not-started") {
        where.trainingProgress = 0;
      }
    }

    if (employeeId !== "All") {
      where.employeeId = employeeId;
    }

    if (trainingId !== "All") {
      where.trainingId = trainingId;
    }

    const trainingDetails = await TrainingDetails.findAll({
      where,
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        {
          model: TrainingAndDevelopment,
          as: "training",
          attributes: [
            "id",
            "trainingProgramName",
            "trainerName",
            "trainingStartDate",
            "trainingEndDate",
            "trainingStatus",
          ],
        },
      ],
    });

    if (!trainingDetails || trainingDetails.length === 0) {
      return res.status(404).json({
        message: "No training details found matching the filters",
      });
    }

    const csvData = trainingDetails.map((detail) => ({
      trainingDetailsId: detail.id,
      employeeName: detail.employee?.personalDetails.fullNameEnglish || "N/A",
      employeeEmail: detail.employee?.personalDetails.email || "N/A",
      trainingProgramName: detail.training.trainingProgramName,
      trainerName: detail.training.trainerName,
      enrollmentDate: detail.enrollmentDate,
      trainingProgress: `${detail.trainingProgress}%`,
      attendancePercentage: detail.attendancePercentage ? `${detail.attendancePercentage}%` : "N/A",
      assessmentScore: detail.assessmentScore ? `${detail.assessmentScore}%` : "N/A",
      certificationStatus: detail.certificationStatus,
      certificationDate: detail.certificationDate || "N/A",
      completionDate: detail.completionDate || "N/A",
      feedback: detail.feedback || "N/A",
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("training_details.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Error exporting training details to CSV",
      error: error.message,
    });
  }
};

const exportTrainingDetailsToPDF = async (req, res) => {
  try {
    const {
      certificationStatus = "All",
      trainingProgress = "All",
      employeeId = "All",
      trainingId = "All",
    } = req.query;

    const where = {};

    if (certificationStatus !== "All") {
      where.certificationStatus = certificationStatus;
    }

    if (trainingProgress !== "All") {
      if (trainingProgress === "completed") {
        where.trainingProgress = 100;
      } else if (trainingProgress === "in-progress") {
        where.trainingProgress = { [Op.between]: [1, 99] };
      } else if (trainingProgress === "not-started") {
        where.trainingProgress = 0;
      }
    }

    if (employeeId !== "All") {
      where.employeeId = employeeId;
    }

    if (trainingId !== "All") {
      where.trainingId = trainingId;
    }

    const trainingDetails = await TrainingDetails.findAll({
      where,
      include: [
        {
          model: Employee,
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        {
          model: TrainingAndDevelopment,
          as: "training",
          attributes: [
            "id",
            "trainingProgramName",
            "trainerName",
            "trainingStartDate",
            "trainingEndDate",
            "trainingStatus",
          ],
        },
      ],
    });

    if (!trainingDetails || trainingDetails.length === 0) {
      return res.status(404).json({
        message: "No training details found matching the filters",
      });
    }

    const pdfData = trainingDetails.map((detail) => [
      detail.id || "N/A",
      detail.employee?.personalDetails.fullNameEnglish || "N/A",
      detail.training.trainingProgramName || "N/A",
      detail.training.trainerName || "N/A",
      `${detail.trainingProgress}%` || "0%",
      detail.attendancePercentage ? `${detail.attendancePercentage}%` : "N/A",
      detail.assessmentScore ? `${detail.assessmentScore}%` : "N/A",
      detail.certificationStatus || "N/A",
      detail.completionDate ? detail.completionDate.toDateString() : "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Training Details Report", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "ID",
                "Employee",
                "Training Program",
                "Trainer",
                "Progress",
                "Attendance",
                "Assessment",
                "Certification",
                "Completion",
              ],
              ...pdfData,
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
    res.attachment("training_details_report.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({
      message: "Error exporting training details to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadCertificationDocument: upload,
  createTrainingDetails,
  updateTrainingDetails,
  deleteTrainingDetails,
  getTrainingDetailsById,
  getAllTrainingDetails,
  getTrainingDetailsByEmployee,
  getTrainingDetailsByTraining,
  updateTrainingProgress,
  serveCertificationFile,
  filterTrainingDetails,
  exportTrainingDetailsToCSV,
  exportTrainingDetailsToPDF,
};