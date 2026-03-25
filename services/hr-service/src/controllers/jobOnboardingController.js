const JobOnboardingModel = require("../models/JobOnboardingModel");
const JobPostingModel = require("../models/JobPostingModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// Helper function to create upload directory if it doesn't exist
const ensureUploadDir = (uploadPath) => {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
};

// Multer configuration for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "resumeDocuments"
    );
    ensureUploadDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// Export multer upload middleware
const uploadResume = upload.single("resume");

const createJobOnboarding = async (req, res) => {
  const {
    employeeName,
    passportNumber,
    QIDNumber,
    contactNumber,
    jobId,
    jobTitle,
    jobCode,
    scheduledDate,
    scheduledTime,
  } = req.body;

  try {
    const resume = req.file ? req.file.filename : "";

    if (!resume) {
      return res.status(400).json({ message: "Resume file is required" });
    }

    const onboarding = await JobOnboardingModel.create({
      employeeName,
      passportNumber,
      QIDNumber,
      contactNumber,
      resume,
      jobId: jobId || null,
      jobTitle: jobTitle || null,
      jobCode: jobCode || null,
      scheduledDate: scheduledDate || null,
      scheduledTime: scheduledTime || null,
    });

    res.status(201).json({
      message: "Job onboarding created successfully",
      onboarding,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateJobOnboarding = async (req, res) => {
  const { id } = req.params;
  const {
    employeeName,
    passportNumber,
    QIDNumber,
    contactNumber,
    jobId,
    jobTitle,
    jobCode,
    scheduledDate,
    scheduledTime,
  } = req.body;

  try {
    const onboarding = await JobOnboardingModel.findByPk(id);

    if (!onboarding) {
      return res.status(404).json({ message: "Job onboarding not found" });
    }

    // Handle resume file update
    if (req.file) {
      // Delete old resume file if exists
      if (onboarding.resume) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "uploads",
          "resumeDocuments",
          onboarding.getDataValue("resume")
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      onboarding.resume = req.file.filename;
    }

    onboarding.employeeName = employeeName || onboarding.employeeName;
    onboarding.passportNumber = passportNumber || onboarding.passportNumber;
    onboarding.QIDNumber = QIDNumber || onboarding.QIDNumber;
    onboarding.contactNumber = contactNumber || onboarding.contactNumber;
    onboarding.jobId = jobId !== undefined ? jobId : onboarding.jobId;
    onboarding.jobTitle = jobTitle !== undefined ? jobTitle : onboarding.jobTitle;
    onboarding.jobCode = jobCode !== undefined ? jobCode : onboarding.jobCode;
    onboarding.scheduledDate = scheduledDate !== undefined ? scheduledDate : onboarding.scheduledDate;
    onboarding.scheduledTime = scheduledTime !== undefined ? scheduledTime : onboarding.scheduledTime;

    await onboarding.save();

    res.status(200).json({
      message: "Job onboarding updated successfully",
      onboarding,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating job onboarding",
      error: error.message,
    });
  }
};

const deleteJobOnboarding = async (req, res) => {
  const { id } = req.params;

  try {
    const onboarding = await JobOnboardingModel.findByPk(id);

    if (!onboarding) {
      return res.status(404).json({ message: "Job onboarding not found" });
    }

    // Delete resume file if exists
    if (onboarding.resume) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        "resumeDocuments",
        onboarding.getDataValue("resume")
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await onboarding.destroy();
    res.status(200).json({ message: "Job onboarding deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting job onboarding",
      error: error.message,
    });
  }
};

const getJobOnboardingById = async (req, res) => {
  try {
    const { id } = req.params;
    const onboarding = await JobOnboardingModel.findByPk(id, {
      include: [
        {
          model: JobPostingModel,
          as: "job_posting",
        },
      ],
    });

    if (!onboarding) {
      return res.status(404).json({ message: "Job onboarding not found" });
    }

    res.status(200).json(onboarding);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving job onboarding",
      error: error.message,
    });
  }
};

const getAllJobOnboardings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalOnboardings, rows: onboardings } =
      await JobOnboardingModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: JobPostingModel,
            as: "job_posting",
          },
        ],
      });

    res.status(200).json({
      totalOnboardings,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOnboardings / limit),
      onboardings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving job onboardings",
      error: error.message,
    });
  }
};

const filterJobOnboardings = async (req, res) => {
  try {
    const { approvalStatus = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (approvalStatus !== "All") {
      where["approvalStatus"] = approvalStatus;
    }

    const { count: totalOnboardings, rows: onboardings } =
      await JobOnboardingModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: JobPostingModel,
            as: "job_posting",
          },
        ],
      });

    res.status(200).json({
      totalOnboardings,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOnboardings / limit),
      onboardings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering job onboardings",
      error: error.message,
    });
  }
};

const approveJobOnboarding = async (req, res) => {
  const { id } = req.params;

  try {
    const onboarding = await JobOnboardingModel.findByPk(id);

    if (!onboarding) {
      return res.status(404).json({ message: "Job onboarding not found" });
    }

    onboarding.approvalStatus = "approved";
    onboarding.rejectedReason = null;

    await onboarding.save();

    res.status(200).json({
      message: "Job onboarding approved successfully",
      onboarding,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error approving job onboarding",
      error: error.message,
    });
  }
};

const rejectJobOnboarding = async (req, res) => {
  const { id } = req.params;
  const { rejectedReason } = req.body;

  try {
    const onboarding = await JobOnboardingModel.findByPk(id);

    if (!onboarding) {
      return res.status(404).json({ message: "Job onboarding not found" });
    }

    if (!rejectedReason) {
      return res.status(400).json({ message: "Rejected reason is required" });
    }

    onboarding.approvalStatus = "rejected";
    onboarding.rejectedReason = rejectedReason;

    await onboarding.save();

    res.status(200).json({
      message: "Job onboarding rejected successfully",
      onboarding,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error rejecting job onboarding",
      error: error.message,
    });
  }
};

const serveResumeFile = (req, res) => {
  const { filename } = req.params;

  const basePath = path.join(__dirname, "..", "..", "public", "uploads", "resumeDocuments");
  const safePath = path.join(basePath, filename);

  if (!safePath.startsWith(basePath)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (fs.existsSync(safePath)) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", contentType);
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

const exportFilteredJobOnboardingsToCSV = async (req, res) => {
  try {
    const { approvalStatus = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (approvalStatus !== "All") {
      where["approvalStatus"] = approvalStatus;
    }

    const { rows: onboardings } = await JobOnboardingModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: JobPostingModel,
          as: "job_posting",
        },
      ],
    });

    if (!onboardings || onboardings.length === 0) {
      return res.status(404).json({
        message: "No job onboardings found matching the filters",
      });
    }

    const onboardingsData = onboardings.map((onboarding) => {
      return {
        id: onboarding.id,
        employeeName: onboarding.employeeName,
        passportNumber: onboarding.passportNumber,
        QIDNumber: onboarding.QIDNumber,
        contactNumber: onboarding.contactNumber,
        jobTitle: onboarding.jobTitle,
        jobCode: onboarding.jobCode,
        scheduledDate: onboarding.scheduledDate,
        scheduledTime: onboarding.scheduledTime,
        approvalStatus: onboarding.approvalStatus || "Pending",
        rejectedReason: onboarding.rejectedReason || "N/A",
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(onboardingsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_job_onboardings.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting job onboardings to CSV:", error);
    res.status(500).json({
      message: "Error exporting job onboardings to CSV",
      error: error.message,
    });
  }
};

const exportFilteredJobOnboardingsToPDF = async (req, res) => {
  try {
    const { approvalStatus = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (approvalStatus !== "All") {
      where["approvalStatus"] = approvalStatus;
    }

    const { rows: onboardings } = await JobOnboardingModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: JobPostingModel,
          as: "job_posting",
        },
      ],
    });

    if (!onboardings || onboardings.length === 0) {
      return res.status(404).json({
        message: "No job onboardings found matching the filters",
      });
    }

    const onboardingsData = onboardings.map((onboarding) => {
      return [
        onboarding.id || "N/A",
        onboarding.employeeName || "N/A",
        onboarding.passportNumber || "N/A",
        onboarding.QIDNumber || "N/A",
        onboarding.contactNumber || "N/A",
        onboarding.jobTitle || "N/A",
        onboarding.approvalStatus || "Pending",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Job Onboarding Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto", "*", "auto"],
            body: [
              [
                "ID",
                "Employee Name",
                "Passport",
                "QID",
                "Contact",
                "Job Title",
                "Status",
              ],
              ...onboardingsData,
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
    res.attachment("job_onboardings_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting job onboardings to PDF:", error);
    res.status(500).json({
      message: "Error exporting job onboardings to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  createJobOnboarding,
  updateJobOnboarding,
  deleteJobOnboarding,
  getJobOnboardingById,
  getAllJobOnboardings,
  filterJobOnboardings,
  approveJobOnboarding,
  rejectJobOnboarding,
  serveResumeFile,
  exportFilteredJobOnboardingsToCSV,
  exportFilteredJobOnboardingsToPDF,
};