const {
  EmployeeContractTemplateModel,
  EmployeeContractDetailsModel,
  setupContractRelationships,
} = require("../models/ContractModel");
const JobOnboardingModel = require("../models/JobOnboardingModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup relationships
setupContractRelationships(JobOnboardingModel);

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const ensureUploadDirs = () => {
  const dirs = [
    path.join(__dirname, "..", "..", "public", "uploads", "contracts"),
    path.join(__dirname, "..", "..", "public", "uploads", "contractsLogos"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log("Created directory:", dir);
    }
  });
};

ensureUploadDirs();

// Configure multer for contract file uploads
const contractStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "contracts"
    );

    // Create directory if it doesn't exist
    const fs = require("fs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadContract = multer({
  storage: contractStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept both images and PDFs
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype =
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf";

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, JPG, PNG) and PDF are allowed!"));
    }
  },
}).single("file");

// Upload contract file
const uploadContractFile = async (req, res) => {
  uploadContract(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        message: "Invalid file type",
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const contractId = req.body.contractId;

    if (!contractId) {
      return res.status(400).json({
        message: "Contract ID is required",
      });
    }

    try {
      const contract = await EmployeeContractDetailsModel.findByPk(contractId);

      if (!contract) {
        // Delete uploaded file if contract not found
        const fs = require("fs");
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Contract not found" });
      }

      // Save file path to database
      contract.contractFilePath = req.file.filename;
      await contract.save();

      res.status(200).json({
        message: "Contract file uploaded successfully",
        contract,
        filePath: contract.contractFilePath,
      });
    } catch (error) {
      // Delete uploaded file on error
      const fs = require("fs");
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: "Error saving contract file",
        error: error.message,
      });
    }
  });
};

const logoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "contractsLogos"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "logo-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const uploadLogo = multer({
  storage: logoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype =
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png";

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files (JPEG, JPG, PNG) are allowed for logos!"));
    }
  },
}).single("logo");

// Upload template logo
const uploadTemplateLogo = async (req, res) => {
  uploadLogo(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      return res.status(400).json({
        message: "Invalid file type",
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    try {
      res.status(200).json({
        message: "Logo uploaded successfully",
        filename: req.file.filename,
        path: `/public/uploads/contractsLogos/${req.file.filename}`,
      });
    } catch (error) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: "Error processing logo",
        error: error.message,
      });
    }
  });
};

// Add serveContractFile function
const serveContractFile = async (req, res) => {
  const validFolders = ["contractsLogos"];
  const { folder, filename } = req.params;

  console.log("Serving file request:", { folder, filename });

  if (!validFolders.includes(folder)) {
    console.error("Invalid folder:", folder);
    return res.status(400).json({ message: "Invalid folder" });
  }

  const basePath = path.join(__dirname, "..", "..", "public", "uploads");
  const safePath = path.join(basePath, folder, filename);

  console.log("File path:", safePath);

  if (!safePath.startsWith(basePath)) {
    console.error("Access denied:", safePath);
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const fsPromises = require("fs").promises;

    // Check if file exists
    try {
      await fsPromises.access(safePath);
    } catch (err) {
      console.error("File not found:", safePath);
      return res.status(404).json({ message: "File not found" });
    }

    const stats = await fsPromises.stat(safePath);

    if (!stats.isFile()) {
      console.error("Not a file:", safePath);
      return res.status(404).json({ message: "Not a file" });
    }

    if (stats.size === 0) {
      console.error("File is empty:", safePath);
      return res.status(422).json({ message: "File is empty" });
    }

    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    console.log("Serving file:", { contentType, size: stats.size });

    // Set headers for image display
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);
    res.setHeader("Cache-Control", "public, max-age=86400");

    const readStream = fs.createReadStream(safePath);

    readStream.on("error", (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming file" });
      }
    });

    readStream.pipe(res);

    res.on("finish", () => readStream.destroy());
    res.on("error", () => readStream.destroy());
  } catch (error) {
    console.error("Error serving file:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "Error serving file", error: error.message });
    }
  }
};

// Helper function to generate contract number
const generateContractNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `EA/${month}/${random}`;
};

// CONTRACT TEMPLATE MANAGEMENT

// Create a new contract template
const createContractTemplate = async (req, res) => {
  try {
    const template = await EmployeeContractTemplateModel.create(req.body);
    res.status(201).json({
      message: "Contract template created successfully",
      template,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all contract templates
const getAllContractTemplates = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      jobTitle = "All",
      isActive = "All",
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (jobTitle !== "All") {
      where.jobTitle = jobTitle;
    }

    if (isActive !== "All") {
      where.isActive = isActive === "true";
    }

    const { count: totalTemplates, rows: templates } =
      await EmployeeContractTemplateModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
      });

    res.status(200).json({
      totalTemplates,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTemplates / limit),
      templates,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving contract templates",
      error: error.message,
    });
  }
};

// Get contract template by ID
const getContractTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await EmployeeContractTemplateModel.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Contract template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving contract template",
      error: error.message,
    });
  }
};

// Get templates by job title
const getTemplatesByJobTitle = async (req, res) => {
  try {
    const { jobTitle } = req.params;
    const templates = await EmployeeContractTemplateModel.findAll({
      where: {
        jobTitle,
        isActive: true,
      },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving templates",
      error: error.message,
    });
  }
};

// Update contract template
const updateContractTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await EmployeeContractTemplateModel.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Contract template not found" });
    }

    await template.update(req.body);

    res.status(200).json({
      message: "Contract template updated successfully",
      template,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating contract template",
      error: error.message,
    });
  }
};

// Delete contract template
const deleteContractTemplate = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await EmployeeContractTemplateModel.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Contract template not found" });
    }

    // Check if template is used in any contracts
    const usedInContracts = await EmployeeContractDetailsModel.count({
      where: { templateId: id },
    });

    if (usedInContracts > 0) {
      return res.status(400).json({
        message:
          "Cannot delete template as it is being used in existing contracts. Consider deactivating it instead.",
      });
    }

    await template.destroy();
    res.status(200).json({ message: "Contract template deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting contract template",
      error: error.message,
    });
  }
};

// Toggle template active status
const toggleTemplateStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const template = await EmployeeContractTemplateModel.findByPk(id);

    if (!template) {
      return res.status(404).json({ message: "Contract template not found" });
    }

    template.isActive = !template.isActive;
    await template.save();

    res.status(200).json({
      message: `Template ${
        template.isActive ? "activated" : "deactivated"
      } successfully`,
      template,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating template status",
      error: error.message,
    });
  }
};

const viewContractTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const template = await EmployeeContractTemplateModel.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching template",
      error: error.message,
    });
  }
};

// EMPLOYEE CONTRACT DETAILS MANAGEMENT

// Generate contract from template
const generateContractFromTemplate = async (req, res) => {
  const { onboardingId, templateId, contractStartDate } = req.body;

  try {
    console.log("Generate Contract Request:", {
      onboardingId,
      templateId,
      contractStartDate,
    });

    // Validate input
    if (!onboardingId || !templateId || !contractStartDate) {
      return res.status(400).json({
        message:
          "Missing required fields: onboardingId, templateId, or contractStartDate",
      });
    }

    // Get onboarding details
    const onboarding = await JobOnboardingModel.findByPk(onboardingId);
    console.log("Onboarding found:", onboarding ? "Yes" : "No");

    if (!onboarding) {
      return res.status(404).json({
        message: "Onboarding record not found",
        onboardingId,
      });
    }

    // Get template details
    const template = await EmployeeContractTemplateModel.findByPk(templateId);
    console.log("Template found:", template ? "Yes" : "No");

    if (!template) {
      return res.status(404).json({
        message: "Contract template not found",
        templateId,
      });
    }

    // Check if contract already exists for this onboarding
    const existingContract = await EmployeeContractDetailsModel.findOne({
      where: {
        onboardingId: onboardingId,
      },
    });

    if (
      existingContract &&
      (existingContract.status === "draft" ||
        existingContract.status === "active")
    ) {
      return res.status(400).json({
        message: "An active or draft contract already exists for this employee",
        existingContractNumber: existingContract.contractNumber,
      });
    }

    // Generate contract number
    const contractNumber = generateContractNumber();
    console.log("Generated contract number:", contractNumber);

    // Calculate contract end date based on contract period
    let contractEndDate = null;
    if (contractStartDate && template.contractPeriod) {
      const startDate = new Date(contractStartDate);

      // Convert contract period to months
      const periodText = template.contractPeriod.toLowerCase().trim();
      let monthsToAdd = 3; // Default to 3 months

      // Extract number from contract period text
      const periodMap = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5,
        six: 6,
        seven: 7,
        eight: 8,
        nine: 9,
        ten: 10,
        eleven: 11,
        twelve: 12,
      };

      // Check for different time units
      const words = periodText.split(" ");
      if (words.length >= 2) {
        const firstWord = words[0];
        const timeUnit = words[1];

        let numberValue = 0;

        // Get numeric value
        if (periodMap[firstWord]) {
          numberValue = periodMap[firstWord];
        } else {
          // Try to extract numeric value
          const numericMatch = periodText.match(/\d+/);
          if (numericMatch) {
            numberValue = parseInt(numericMatch[0]);
          }
        }

        // Convert to months based on time unit
        if (timeUnit.includes("year")) {
          monthsToAdd = numberValue * 12;
        } else if (timeUnit.includes("month")) {
          monthsToAdd = numberValue;
        } else if (timeUnit.includes("week")) {
          monthsToAdd = Math.round(numberValue / 4.345); // Approximate weeks to months
        } else if (timeUnit.includes("day")) {
          monthsToAdd = Math.round(numberValue / 30); // Approximate days to months
        } else {
          // Default to months if unit not specified
          monthsToAdd = numberValue || 3;
        }
      } else {
        // If only one word, try to extract number
        const numericMatch = periodText.match(/\d+/);
        if (numericMatch) {
          monthsToAdd = parseInt(numericMatch[0]);
        } else if (periodMap[periodText]) {
          monthsToAdd = periodMap[periodText];
        }
      }

      // Calculate end date
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + monthsToAdd);

      // Adjust for end of month (if start date is end of month, end date should also be end of month)
      if (
        startDate.getDate() !==
        new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate()
      ) {
        // If not end of month, subtract one day to get the day before the same date next period
        endDate.setDate(endDate.getDate() - 1);
      }

      contractEndDate = endDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

      console.log("Contract period:", template.contractPeriod);
      console.log("Months to add:", monthsToAdd);
      console.log("Start date:", contractStartDate);
      console.log("End date:", contractEndDate);
    }

    // Calculate contract end date
    // let contractEndDate = null;
    // if (contractStartDate && template.contractPeriod) {
    //     const startDate = new Date(contractStartDate);
    //     // Extract number from contract period (e.g., "three months" -> 3)
    //     const periodMatch = template.contractPeriod.match(/\d+/);
    //     const monthsToAdd = periodMatch ? parseInt(periodMatch[0]) : 3;

    //     const endDate = new Date(startDate);
    //     endDate.setMonth(endDate.getMonth() + monthsToAdd);
    //     contractEndDate = endDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

    //     console.log("Contract period:", template.contractPeriod);
    //     console.log("Months to add:", monthsToAdd);
    //     console.log("End date:", contractEndDate);
    // }

    // Create contract details
    const contractData = {
      contractNumber,
      onboardingId: parseInt(onboardingId),
      templateId: parseInt(templateId),
      employeeName: onboarding.employeeName,
      qidNumber: onboarding.QIDNumber,
      passportNumber: onboarding.passportNumber,
      jobTitle: onboarding.jobTitle || template.jobTitle,
      contractStartDate: contractStartDate,
      contractEndDate: contractEndDate,
      basicSalary: parseFloat(template.basicSalary),
      fixedAllowance: template.fixedAllowance
        ? parseFloat(template.fixedAllowance)
        : 0,
      accommodationAmount: template.accommodationProvided
        ? null
        : template.accommodationAmount
        ? parseFloat(template.accommodationAmount)
        : null,
      foodAmount: template.foodProvided
        ? null
        : template.foodAmount
        ? parseFloat(template.foodAmount)
        : null,
      transportationAmount: template.transportationProvided
        ? null
        : template.transportationAmount
        ? parseFloat(template.transportationAmount)
        : null,
      overtimeRate: template.overtimeRate
        ? parseFloat(template.overtimeRate)
        : null,
      status: "draft",
    };

    console.log("Creating contract with data:", contractData);

    const contract = await EmployeeContractDetailsModel.create(contractData);

    console.log("Contract created successfully:", contract.id);

    res.status(201).json({
      message: "Contract generated successfully",
      contract,
      template,
    });
  } catch (error) {
    console.error("Error generating contract:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
};

// Get all employee contracts
const getAllEmployeeContracts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "All" } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where.status = status;
    }

    const { count: totalContracts, rows: contracts } =
      await EmployeeContractDetailsModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: JobOnboardingModel,
            as: "onboarding",
          },
          {
            model: EmployeeContractTemplateModel,
            as: "template",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

    res.status(200).json({
      totalContracts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalContracts / limit),
      contracts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving employee contracts",
      error: error.message,
    });
  }
};

// Get contract by ID
const getEmployeeContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await EmployeeContractDetailsModel.findByPk(id, {
      include: [
        {
          model: JobOnboardingModel,
          as: "onboarding",
        },
        {
          model: EmployeeContractTemplateModel,
          as: "template",
        },
      ],
    });

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving contract",
      error: error.message,
    });
  }
};

// Update employee contract
const updateEmployeeContract = async (req, res) => {
  const { id } = req.params;

  try {
    const contract = await EmployeeContractDetailsModel.findByPk(id);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    await contract.update(req.body);

    res.status(200).json({
      message: "Contract updated successfully",
      contract,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating contract",
      error: error.message,
    });
  }
};

// Update contract status
const updateContractStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const contract = await EmployeeContractDetailsModel.findByPk(id);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    contract.status = status;
    if (notes) contract.notes = notes;
    if (status === "active" && !contract.signedDate) {
      contract.signedDate = new Date();
    }

    await contract.save();

    res.status(200).json({
      message: "Contract status updated successfully",
      contract,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating contract status",
      error: error.message,
    });
  }
};

// Save contract file path
const saveContractFile = async (req, res) => {
  const { id } = req.params;
  const { filePath } = req.body;

  try {
    const contract = await EmployeeContractDetailsModel.findByPk(id);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    contract.contractFilePath = filePath;
    await contract.save();

    res.status(200).json({
      message: "Contract file saved successfully",
      contract,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving contract file",
      error: error.message,
    });
  }
};

// Export contracts to CSV
const exportContractsToCSV = async (req, res) => {
  try {
    const { status = "All" } = req.query;

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const contracts = await EmployeeContractDetailsModel.findAll({
      where,
      include: [
        {
          model: JobOnboardingModel,
          as: "onboarding",
        },
        {
          model: EmployeeContractTemplateModel,
          as: "template",
        },
      ],
    });

    if (!contracts || contracts.length === 0) {
      return res.status(404).json({
        message: "No contracts found matching the filters",
      });
    }

    const contractsData = contracts.map((contract) => ({
      contractNumber: contract.contractNumber,
      employeeName: contract.employeeName,
      qidNumber: contract.qidNumber,
      jobTitle: contract.jobTitle,
      contractStartDate: contract.contractStartDate,
      contractEndDate: contract.contractEndDate,
      basicSalary: contract.basicSalary,
      status: contract.status,
      signedDate: contract.signedDate,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(contractsData);

    res.header("Content-Type", "text/csv");
    res.attachment("employee_contracts.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting contracts to CSV:", error);
    res.status(500).json({
      message: "Error exporting contracts to CSV",
      error: error.message,
    });
  }
};

module.exports = {
  // Template management
  uploadContractFile,
  uploadTemplateLogo,
  serveContractFile,
  createContractTemplate,
  getAllContractTemplates,
  getContractTemplateById,
  getTemplatesByJobTitle,
  updateContractTemplate,
  deleteContractTemplate,
  toggleTemplateStatus,
  viewContractTemplate,
  // Contract details management
  generateContractFromTemplate,
  getAllEmployeeContracts,
  getEmployeeContractById,
  updateEmployeeContract,
  updateContractStatus,
  saveContractFile,
  exportContractsToCSV,
};
