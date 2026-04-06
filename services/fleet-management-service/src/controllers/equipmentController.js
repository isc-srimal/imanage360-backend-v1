const { Op, Sequelize } = require("sequelize");
const EquipmentModel = require("../models/EquipmentModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const AssetModel = require("../../../fixed-assets-service/src/models/AssetModel");
const AssetCategoryModel = require("../../../fixed-assets-service/src/models/AssetCategoryModel");
const AssetSubcategoryModel = require("../../../fixed-assets-service/src/models/AssetSubcategoryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const DepartmentModel = require("../../../hr-service/src/models/DepartmentModel");
const AssetCapacityModel = require("../../../fixed-assets-service/src/models/AssetCapacityModel");
const ManufacturerModel = require("../../../fixed-assets-service/src/models/ManufacturerModel");
const ModelAssetModel = require("../../../fixed-assets-service/src/models/ModelAssetModel");
const VehicleOwnerModel = require("../models/VehicleOwnerModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const photoUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "fixed-assets-service",
  "public",
  "uploads",
  "equipments",
  "equipmentsImages"
);
const docUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "fixed-assets-service",
  "public",
  "uploads",
  "equipments",
  "equipmentsDocs"
);

if (!fs.existsSync(photoUploadDir)) {
  fs.mkdirSync(photoUploadDir, { recursive: true });
}
if (!fs.existsSync(docUploadDir)) {
  fs.mkdirSync(docUploadDir, { recursive: true });
}

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photoUploadDir);
  },
  filename: (req, file, cb) => {
    const serialNumber = req.body.serial_number || "equipment";
    const timestamp = Date.now();
    const fileName = `${serialNumber}_photo_${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const docStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, docUploadDir);
  },
  filename: (req, file, cb) => {
    const serialNumber = req.body.serial_number || "equipment";
    const timestamp = Date.now();
    const fileName = `${serialNumber}_doc_${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "photos") {
        cb(null, photoUploadDir);
      } else if (file.fieldname === "documents") {
        cb(null, docUploadDir);
      } else {
        cb(new Error(`Unexpected field: ${file.fieldname}`), null);
      }
    },
    filename: (req, file, cb) => {
      const serialNumber = req.body.serial_number || "equipment";
      const timestamp = Date.now();
      const prefix = file.fieldname === "photos" ? "photo" : "doc";
      const fileName = `${serialNumber}_${prefix}_${timestamp}${path.extname(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const photoTypes = ["image/jpeg", "image/png"];
    const docTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file.fieldname === "photos" && photoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else if (
      file.fieldname === "documents" &&
      docTypes.includes(file.mimetype)
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type for ${file.fieldname}. Allowed types: ${
            file.fieldname === "photos" ? "JPG, PNG" : "PDF, DOC, DOCX"
          }`
        ),
        false
      );
    }
  },
}).fields([
  { name: "photos", maxCount: 4 },
  { name: "documents", maxCount: 4 },
]);

const createEquipment = async (req, res) => {
  const {
    asset_number,
    owner_id,
    reg_number,
    serial_numbers,
    engine_number,
    category_name,
    subcategory_name,
    capacity_id,
    manufacturer_id,
    model_id,
    vehicle_type,
    VIN,
    description,
    year_of_manufacture,
    departmentName,
    employeeId,
    barcode,
    rfid_tag,
    equipment_status,       
    equipment_status_note, 
  } = req.body;

  try {
    // Validate required fields
    if (!reg_number?.trim())
      return res.status(400).json({ error: "Registration number is required" });
    if (!vehicle_type?.trim())
      return res.status(400).json({ error: "Vehicle type is required" });
    if (!VIN?.trim()) return res.status(400).json({ error: "VIN is required" });
    if (!description?.trim())
      return res.status(400).json({ error: "Description is required" });
    if (!year_of_manufacture)
      return res.status(400).json({ error: "Year of manufacture is required" });
    if (!employeeId)
      return res.status(400).json({ error: "Employee ID is required" });

    const existingRegNumber = await EquipmentModel.findOne({ where: { reg_number } });
    if (existingRegNumber) {
      return res.status(400).json({ message: "Registration number already exists" });
    }

    const existingSerialNumber = await EquipmentModel.findOne({ where: { serial_numbers } });
    if (existingSerialNumber) {
      return res.status(400).json({ message: "Serial number already exists" });
    }

    // Validate employee
    const employee = await EmployeeModel.findByPk(employeeId);
    if (!employee) return res.status(400).json({ error: "Employee not found" });

    // Resolve asset_id or custom
    let asset_id = null;
    let asset_number_custom = null;
    if (asset_number?.trim()) {
      const asset = await AssetModel.findOne({
        where: { asset_number: asset_number.trim() },
      });
      if (asset) asset_id = asset.asset_id;
      else asset_number_custom = asset_number.trim();
    }

    // Resolve category_id or custom
    let category_id = null;
    let category_name_custom = null;
    if (category_name?.trim()) {
      const category = await AssetCategoryModel.findOne({
        where: { category_name: category_name.trim() },
      });
      if (category) category_id = category.category_id;
      else category_name_custom = category_name.trim();
    }

    // Resolve subcategory_id or custom
    let subcategory_id = null;
    let subcategory_name_custom = null;
    if (subcategory_name?.trim()) {
      const subcategory = await AssetSubcategoryModel.findOne({
        where: { subcategory_name: subcategory_name.trim() },
      });
      if (subcategory) subcategory_id = subcategory.subcategory_id;
      else subcategory_name_custom = subcategory_name.trim();
    }

    // Handle file uploads
    const photo_attachments = (req.files?.photos || []).map((file) => ({
      path: `/uploads/equipments/equipmentsImages/${file.filename}`,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    const document_attachments = (req.files?.documents || []).map((file) => ({
      path: `/uploads/equipments/equipmentsDocs/${file.filename}`,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    }));

    // Create equipment
    const equipment = await EquipmentModel.create({
      asset_id,
      owner_id: owner_id || null,
      reg_number: reg_number.trim(),
      serial_numbers: serial_numbers?.trim() || null,
      engine_number: engine_number?.trim() || null,
      category_id,
      subcategory_id,
      capacity_id: capacity_id || null,
      manufacturer_id: manufacturer_id || null,
      model_id: model_id || null,
      asset_number_custom,
      category_name_custom,
      subcategory_name_custom,
      vehicle_type: vehicle_type.trim(),
      VIN: VIN.trim(),
      description: description.trim(),
      year_of_manufacture: parseInt(year_of_manufacture),
      departmentName: departmentName || null,
      employeeId,
      barcode: barcode?.trim() || null,
      rfid_tag: rfid_tag?.trim() || null,
      equipment_status: equipment_status || 'idle',     
      equipment_status_note: equipment_status_note || null, 
      photo_attachments,
      document_attachments,
    });

    res
      .status(201)
      .json({ message: "Equipment created successfully", equipment });
  } catch (error) {
    console.error("Create Equipment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// UPDATE EQUIPMENT
const updateEquipment = async (req, res) => {
  const { serial_number } = req.params;
  const {
    asset_number,
    owner_id,
    reg_number,
    serial_numbers,
    engine_number,
    category_name,
    subcategory_name,
    capacity_id,
    manufacturer_id,
    model_id,
    vehicle_type,
    VIN,
    description,
    year_of_manufacture,
    departmentName,
    employeeId,
    barcode,
    rfid_tag,
    equipment_status,       
    equipment_status_note,
    existing_photos,
    existing_documents,
  } = req.body;

  try {
    const equipment = await EquipmentModel.findByPk(serial_number);
    if (!equipment)
      return res.status(404).json({ message: "Equipment not found" });

    // Update asset
    if (asset_number?.trim()) {
      const asset = await AssetModel.findOne({
        where: { asset_number: asset_number.trim() },
      });
      equipment.asset_id = asset ? asset.asset_id : null;
      equipment.asset_number_custom = asset ? null : asset_number.trim();
    }

    // Update category
    if (category_name?.trim()) {
      const category = await AssetCategoryModel.findOne({
        where: { category_name: category_name.trim() },
      });
      equipment.category_id = category ? category.category_id : null;
      equipment.category_name_custom = category ? null : category_name.trim();
    }

    // Update subcategory
    if (subcategory_name?.trim()) {
      const subcategory = await AssetSubcategoryModel.findOne({
        where: { subcategory_name: subcategory_name.trim() },
      });
      equipment.subcategory_id = subcategory
        ? subcategory.subcategory_id
        : null;
      equipment.subcategory_name_custom = subcategory
        ? null
        : subcategory_name.trim();
    }

    const existingRegNumber = await EquipmentModel.findOne({ where: { reg_number } });
    if (existingRegNumber) {
      return res.status(400).json({ message: "Registration number already exists" });
    }

    const existingSerialNumber = await EquipmentModel.findOne({ where: { serial_numbers } });
    if (existingSerialNumber) {
      return res.status(400).json({ message: "Serial number already exists" });
    }

    // Update other fields
    const updates = {
      owner_id,
      reg_number,
      serial_numbers,
      engine_number,
      capacity_id,
      manufacturer_id,
      model_id,
      vehicle_type,
      VIN,
      description,
      year_of_manufacture: year_of_manufacture
        ? parseInt(year_of_manufacture)
        : undefined,
      departmentName,
      employeeId,
      barcode,
      rfid_tag,
      equipment_status,        
      equipment_status_note,
    };

    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined) equipment[key] = updates[key];
    });

    // Handle attachments
    let photos = existing_photos
      ? JSON.parse(existing_photos)
      : equipment.photo_attachments;
    let docs = existing_documents
      ? JSON.parse(existing_documents)
      : equipment.document_attachments;

    if (req.files?.photos) {
      photos = [
        ...photos,
        ...req.files.photos.map((f) => ({
          path: `/uploads/equipments/equipmentsImages/${f.filename}`,
          originalName: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        })),
      ];
    }

    if (req.files?.documents) {
      docs = [
        ...docs,
        ...req.files.documents.map((f) => ({
          path: `/uploads/equipments/equipmentsDocs/${f.filename}`,
          originalName: f.originalname,
          mimetype: f.mimetype,
          size: f.size,
        })),
      ];
    }

    equipment.photo_attachments = photos;
    equipment.document_attachments = docs;

    await equipment.save();
    res
      .status(200)
      .json({ message: "Equipment updated successfully", equipment });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get equipment photos
const getEquipmentPhotos = async (req, res) => {
  const { serial_number } = req.params;
  try {
    const equipment = await EquipmentModel.findByPk(serial_number, {
      attributes: ["photo_attachments"],
    });
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.status(200).json({ photos: equipment.photo_attachments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving photos", error: error.message });
  }
};

// Get equipment documents
const getEquipmentDocuments = async (req, res) => {
  const { serial_number } = req.params;
  try {
    const equipment = await EquipmentModel.findByPk(serial_number, {
      attributes: ["document_attachments"],
    });
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }
    res.status(200).json({ documents: equipment.document_attachments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving documents", error: error.message });
  }
};

// Serve asset files
const serveEquipmentFile = (req, res) => {
  const validFolders = ["equipmentsImages", "equipmentsDocs"]; // Allowed folders
  const { folder, filename } = req.params;

  // Validate folder
  if (!validFolders.includes(folder)) {
    return res.status(400).json({ message: "Invalid folder" });
  }

  // Use the same base path as upload directories
  const basePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "equipments"
  );
  const safePath = path.join(basePath, folder, filename);

  // Security check to prevent directory traversal
  if (!safePath.startsWith(basePath)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (fs.existsSync(safePath)) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Set Content-Disposition for documents to encourage downloading
    if (folder === "assetsDocs") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
    } else {
      res.setHeader("Content-Disposition", "inline");
    }

    res.setHeader("Content-Type", contentType);
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

const deleteEquipment = async (req, res) => {
  const { serial_number } = req.params;

  try {
    const equipmentToDelete = await EquipmentModel.findByPk(serial_number);

    if (!equipmentToDelete) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    await equipmentToDelete.destroy();
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting equipment", error: error.message });
  }
};

const getEquipmentById = async (req, res) => {
  try {
    const { serial_number } = req.params;
    const equipment = await EquipmentModel.findByPk(serial_number, {
      include: [
        {
          model: require("../../../hr-service/src/models/employees/EmployeeModel"),
          as: "employee",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetModel"),
          as: "asset",
        },
        {
          model: VehicleOwnerModel,
          as: "owner",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetCategoryModel"),
          as: "category",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetSubcategoryModel"),
          as: "subcategory",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetCapacityModel"),
          as: "capacity",
        },
        {
          model: require("../../../fixed-assets-service/src/models/ManufacturerModel"),
          as: "manufacturer",
        },
        {
          model: require("../../../fixed-assets-service/src/models/ModelAssetModel"),
          as: "model",
        },
        {
          model: require("../../../hr-service/src/models/DepartmentModel"),
          as: "department",
        },
      ],
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Add computed fields for display
    const equipmentData = equipment.toJSON();
    equipmentData.display_asset_number =
      equipmentData.asset_number_custom ||
      equipmentData.asset?.asset_number ||
      "N/A";
    equipmentData.display_category_name =
      equipmentData.category_name_custom ||
      equipmentData.category?.category_name ||
      "N/A";
    equipmentData.display_subcategory_name =
      equipmentData.subcategory_name_custom ||
      equipmentData.subcategory?.subcategory_name ||
      "N/A";

    res.status(200).json(equipmentData);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving equipment", error: error.message });
  }
};

const getAllEquipment = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalEquipment, rows: equipment } =
      await EquipmentModel.findAndCountAll({
        include: [
          {
            model: require("../../../hr-service/src/models/employees/EmployeeModel"),
            as: "employee",
          },
          {
            model: require("../../../fixed-assets-service/src/models/AssetModel"),
            as: "asset",
          },
          {
            model: VehicleOwnerModel,
            as: "owner",
          },
          {
            model: require("../../../fixed-assets-service/src/models/AssetCategoryModel"),
            as: "category",
          },
          {
            model: require("../../../fixed-assets-service/src/models/AssetSubcategoryModel"),
            as: "subcategory",
          },
          {
            model: require("../../../fixed-assets-service/src/models/AssetCapacityModel"),
            as: "capacity",
          },
          {
            model: require("../../../fixed-assets-service/src/models/ManufacturerModel"),
            as: "manufacturer",
          },
          {
            model: require("../../../fixed-assets-service/src/models/ModelAssetModel"),
            as: "model",
          },
          {
            model: require("../../../hr-service/src/models/DepartmentModel"),
            as: "department",
          },
        ],
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalEquipment,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEquipment / limit),
      equipment,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving equipment", error: error.message });
  }
};

const createEquipmentFromAsset = async (req, res) => {
  try {
    const { asset_id } = req.body;

    // Fetch the asset details
    const asset = await AssetModel.findByPk(asset_id, {
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
        { model: ManufacturerModel, as: "manufacturer" },
        { model: ModelAssetModel, as: "model" },
        { model: DepartmentModel, as: "department" },
      ],
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Check if equipment already exists for this asset
    const existingEquipment = await EquipmentModel.findOne({
      where: { asset_id: asset_id },
    });

    if (existingEquipment) {
      return res.status(400).json({
        message: "Equipment record already exists for this asset",
      });
    }

    // Find "Auto Xpert" owner with own_vehicle = true
    const autoXpertOwner = await VehicleOwnerModel.findOne({
      where: {
        name: "Auto Xpert",
        own_vehicle: true,
        status: "Active",
      },
    });

    if (!autoXpertOwner) {
      return res.status(400).json({
        message:
          "Auto Xpert owner not found. Please create a vehicle owner with name 'Auto Xpert' and own_vehicle = true",
      });
    }

    // Get a default employee (first active employee or create logic for default)
    const defaultEmployee = await EmployeeModel.findOne({
      order: [["id", "ASC"]],
    });

    if (!defaultEmployee) {
      return res.status(400).json({
        message:
          "No employees found. Please create at least one employee first.",
      });
    }

    // Create equipment record
    const equipment = await EquipmentModel.create({
      asset_id: asset.asset_id,
      owner_id: autoXpertOwner.vehicle_owner_id,
      reg_number: asset.tag_number || asset.asset_number,
      serial_numbers: asset.serial_number || "N/A",
      engine_number: asset.engine_number || "N/A",
      category_id: asset.category_id,
      subcategory_id: asset.subcategory_id,
      capacity_id: asset.capacity_id,
      manufacturer_id: asset.manufacturer_id,
      model_id: asset.model_id,
      vehicle_type: asset.vehicle_type || "N/A",
      VIN: asset.VIN || "N/A",
      description: asset.description || "N/A",
      year_of_manufacture:
        asset.year_of_manufacture || new Date().getFullYear(),
      departmentName: asset.departmentName || "N/A",
      employeeId: defaultEmployee.id,
      barcode: asset.barcode || "N/A",
      rfid_tag: asset.rfid_tag || "N/A",
      photo_attachments: asset.photo_attachments || [],
      document_attachments: asset.document_attachments || [],
    });

    res.status(201).json({
      message: "Equipment created successfully from asset",
      equipment,
    });
  } catch (error) {
    console.error("Error creating equipment from asset:", error);
    res.status(500).json({
      message: "Error creating equipment from asset",
      error: error.message,
    });
  }
};

const getEquipmentSchedule = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.created_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const equipment = await EquipmentModel.findAll({
      where,
      include: [
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        {
          model: AssetModel,
          as: "asset",
          attributes: ["asset_id", "asset_number", "tag_number"],
        },
      ],
      attributes: [
        "serial_number",
        "reg_number",
        "customer_name",
        "project_name",
        "created_at",
      ],
    });

    // Group equipment by date
    const scheduleData = equipment.reduce((acc, equip) => {
      const date = new Date(equip.created_at).toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = [];
      }

      acc[date].push({
        serial_number: equip.serial_number,
        reg_number: equip.reg_number,
        customer_name: equip.customer_name,
        project_name: equip.project_name,
        employee_name:
          equip.employee?.personalDetails?.fullNameEnglish || "N/A",
        asset_number: equip.asset?.asset_number || "N/A",
      });

      return acc;
    }, {});

    res.status(200).json({
      success: true,
      scheduleData,
    });
  } catch (error) {
    console.error("Error fetching equipment schedule:", error);
    res.status(500).json({
      message: "Error fetching equipment schedule",
      error: error.message,
    });
  }
};

const filterEquipment = async (req, res) => {
  try {
    const {
      category_name,
      asset_number,
      subcategory_name,
      employee_name,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    // Filter by category (check both master and custom)
    if (category_name) {
      where[Op.or] = [
        { "$asset.category.category_name$": category_name },
        { category_name_custom: category_name },
      ];
    }

    if (asset_number) {
      // where["$asset.asset_number$"] = asset_number;
      where[Op.or] = [
        { "$asset.asset_number$": asset_number },
        { asset_number_custom: asset_number },
      ];
    }

    // Filter by subcategory (check both master and custom)
    if (subcategory_name) {
      where[Op.or] = [
        ...(where[Op.or] || []),
        { "$asset.subcategory.subcategory_name$": subcategory_name },
        { subcategory_name_custom: subcategory_name },
      ];
    }

    if (employee_name) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.literal(
          `JSON_EXTRACT(employee.personalDetails, '$.fullNameEnglish') = :employee_name`
        ),
      ];
    }

    const { count: totalEquipment, rows: equipment } =
      await EquipmentModel.findAndCountAll({
        where,
        include: [
          {
            model: EmployeeModel,
            as: "employee",
            attributes: ["id", "personalDetails"],
          },
          {
            model: AssetModel,
            as: "asset",
          },
          {
            model: AssetCategoryModel,
            as: "category",
          },
          {
            model: AssetSubcategoryModel,
            as: "subcategory",
          },
          {
            model: VehicleOwnerModel,
            as: "owner",
          },
          {
            model: require("../../../fixed-assets-service/src/models/AssetCapacityModel"),
            as: "capacity",
          },
          {
            model: require("../../../fixed-assets-service/src/models/ManufacturerModel"),
            as: "manufacturer",
          },
          {
            model: require("../../../fixed-assets-service/src/models/ModelAssetModel"),
            as: "model",
          },
          {
            model: require("../../../hr-service/src/models/DepartmentModel"),
            as: "department",
          },
        ],
        offset,
        limit: parseInt(limit),
        replacements: { employee_name },
      });

    res.status(200).json({
      totalEquipment,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEquipment / limit),
      equipment,
    });
  } catch (error) {
    console.error("Error filtering equipment:", error);
    res
      .status(500)
      .json({ message: "Error filtering equipment", error: error.message });
  }
};

const exportFilteredEquipmentToCSV = async (req, res) => {
  try {
    const {
      category_name,
      asset_number,
      subcategory_name,
      employee_name,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    // Filter by category (check both master and custom)
    if (category_name) {
      where[Op.or] = [
        { "$asset.category.category_name$": category_name },
        { category_name_custom: category_name },
      ];
    }

    if (asset_number) {
      // where["$asset.asset_number$"] = asset_number;
      where[Op.or] = [
        { "$asset.asset_number$": asset_number },
        { asset_number_custom: asset_number },
      ];
    }

    // Filter by subcategory (check both master and custom)
    if (subcategory_name) {
      where[Op.or] = [
        ...(where[Op.or] || []),
        { "$asset.subcategory.subcategory_name$": subcategory_name },
        { subcategory_name_custom: subcategory_name },
      ];
    }

    if (employee_name) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.literal(
          `JSON_EXTRACT(employee.personalDetails, '$.fullNameEnglish') = :employee_name`
        ),
      ];
    }

    const { rows: equipment } = await EquipmentModel.findAndCountAll({
      where,
      include: [
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        {
          model: AssetModel,
          as: "asset",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetCategoryModel"),
          as: "category",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetSubcategoryModel"),
          as: "subcategory",
        },
        {
          model: VehicleOwnerModel,
          as: "owner",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetCapacityModel"),
          as: "capacity",
        },
        {
          model: require("../../../fixed-assets-service/src/models/ManufacturerModel"),
          as: "manufacturer",
        },
        {
          model: require("../../../fixed-assets-service/src/models/ModelAssetModel"),
          as: "model",
        },
        {
          model: require("../../../hr-service/src/models/DepartmentModel"),
          as: "department",
        },
      ],
      offset,
      limit: parseInt(limit),
    });

    if (!equipment || equipment.length === 0) {
      return res.status(404).json({
        message: "No equipment found matching the filters",
      });
    }

    const equipmentData = equipment.map((equip) => ({
      serial_number: equip.serial_number,
      asset_number: equip.asset?.asset_number || equip.asset_number_custom,
      reg_number: equip.reg_number,
      serial_numbers: equip.serial_numbers,
      engine_number: equip.engine_number,
      category: equip.category?.category_name || equip.category_name_custom,
      subcategory:
        equip.subcategory?.subcategory_name || equip.subcategory_name_custom,
      capacity: equip.capacity?.capacity_value,
      manufacturer: equip.manufacturer?.manufacturer,
      model: equip.model?.model,
      vehicle_type: equip.vehicle_type,
      VIN: equip.VIN,
      description: equip.description,
      barcode: equip.barcode,
      rfid_tag: equip.rfid_tag,
      photo_attachments: equip.photo_attachments,
      document_attachments: equip.document_attachments,
      year_of_manufacture: equip.year_of_manufacture,
      owner_name: equip.owner ? equip.owner.name : "N/A",
      departmentName: equip.departmentName,
      employee: equip.employee
        ? equip.employee.personalDetails.fullNameEnglish
        : "N/A",
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(equipmentData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_equipment.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting equipment to CSV:", error);
    res.status(500).json({
      message: "Error exporting equipment to CSV",
      error: error.message,
    });
  }
};

const exportFilteredEquipmentToPDF = async (req, res) => {
  try {
    const {
      category_name,
      asset_number,
      subcategory_name,
      employee_name,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    // Filter by category (check both master and custom)
    if (category_name) {
      where[Op.or] = [
        { "$asset.category.category_name$": category_name },
        { category_name_custom: category_name },
      ];
    }

    if (asset_number) {
      where[Op.or] = [
        { "$asset.asset_number$": asset_number },
        { asset_number_custom: asset_number },
      ];
    }

    // Filter by subcategory (check both master and custom)
    if (subcategory_name) {
      where[Op.or] = [
        ...(where[Op.or] || []),
        { "$asset.subcategory.subcategory_name$": subcategory_name },
        { subcategory_name_custom: subcategory_name },
      ];
    }

    if (employee_name) {
      where[Op.and] = [
        ...(where[Op.and] || []),
        Sequelize.literal(
          `JSON_EXTRACT(employee.personalDetails, '$.fullNameEnglish') = :employee_name`
        ),
      ];
    }

    const { rows: equipment } = await EquipmentModel.findAndCountAll({
      where,
      include: [
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        {
          model: AssetModel,
          as: "asset",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetCategoryModel"),
          as: "category",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetSubcategoryModel"),
          as: "subcategory",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetCapacityModel"),
          as: "capacity",
        },
        {
          model: require("../../../fixed-assets-service/src/models/ManufacturerModel"),
          as: "manufacturer",
        },
        {
          model: require("../../../fixed-assets-service/src/models/ModelAssetModel"),
          as: "model",
        },
        {
          model: require("../../../hr-service/src/models/DepartmentModel"),
          as: "department",
        },
      ],
      offset,
      limit: parseInt(limit),
    });

    if (!equipment || equipment.length === 0) {
      return res.status(404).json({
        message: "No equipment found matching the filters",
      });
    }

    const equipmentData = equipment.map((equip) => [
      equip.serial_number || "N/A",
      equip.asset
        ? equip.asset.asset_number
        : equip.asset_number_custom || "N/A",
      equip.category?.category_name || "N/A",
      equip.subcategory?.subcategory_name || "N/A",
      equip.capacity?.capacity_value || "N/A",
      equip.manufacturer?.manufacturer || "N/A",
      equip.model?.model || "N/A",
      equip.vehicle_type || "N/A",
      equip.VIN || "N/A",
      equip.year_of_manufacture || "N/A",
      equip.owner ? equip.owner.name : "N/A",
      equip.employee ? equip.employee.personalDetails.fullNameEnglish : "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Equipment Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80],
            body: [
              [
                "Serial Number",
                "Asset Number",
                "Category",
                "Subcategory",
                "Capacity",
                "Manufacturer",
                "Model",
                "Vehicle Type",
                "Vehicle Identification No",
                "Year",
                "Owner",
                "Employee",
              ],
              ...equipmentData,
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
    res.attachment("equipment_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting equipment to PDF:", error);
    res.status(500).json({
      message: "Error exporting equipment to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadEquipments: upload,
  createEquipment,
  updateEquipment,
  getEquipmentPhotos,
  getEquipmentDocuments,
  serveEquipmentFile,
  deleteEquipment,
  getEquipmentById,
  getAllEquipment,
  createEquipmentFromAsset,
  getEquipmentSchedule,
  filterEquipment,
  exportFilteredEquipmentToCSV,
  exportFilteredEquipmentToPDF,
};
