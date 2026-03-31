// config/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log("Created directory:", dirPath);
  }
};

// Storage configuration for checklist templates
const checklistTemplateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "checklist-templates"
    );
    ensureDirectoryExists(uploadPath);
    console.log("Upload destination:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    console.log("Generated filename:", filename);
    cb(null, filename);
  },
});

// File filter for templates
const templateFileFilter = (req, file, cb) => {
  console.log("File filter - mimetype:", file.mimetype);
  const allowedMimes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.ms-excel",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type: ${file.mimetype}. Only PDF, DOCX, XLSX files are allowed.`
      ),
      false
    );
  }
};

// Multer upload configuration for checklist templates
const uploadChecklistTemplate = multer({
  storage: checklistTemplateStorage,
  fileFilter: templateFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const checklistManpowerTemplateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "checklist-manpower-templates"
    );
    ensureDirectoryExists(uploadPath);
    console.log("Manpower template upload destination:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    console.log("Generated manpower template filename:", filename);
    cb(null, filename);
  },
});

const uploadManpowerChecklistTemplate = multer({
  storage: checklistManpowerTemplateStorage,
  fileFilter: templateFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const checklistAttachmentTemplateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "checklist-attachment-templates"
    );
    ensureDirectoryExists(uploadPath);
    console.log("Attachment template upload destination:", uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    const filename = `${nameWithoutExt}-${uniqueSuffix}${ext}`;
    console.log("Generated attachment template filename:", filename);
    cb(null, filename);
  },
});

const uploadAttachmentChecklistTemplate = multer({
  storage: checklistAttachmentTemplateStorage,
  fileFilter: templateFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

module.exports = {
  uploadChecklistTemplate,
  uploadAttachmentChecklistTemplate,
  uploadManpowerChecklistTemplate,
};
