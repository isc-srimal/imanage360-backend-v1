const AttachmentModel = require("../models/AttachmentModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const ProductModel = require("../models/ProductModel");
const EquipmentModel = require("../models/EquipmentModel");
const AttachmentStatusHistoryModel = require("../models/AttachmentStatusHistoryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const sequelize = require("../../src/config/dbSync");
const fs = require("fs");
const fsPromises = require("fs").promises;
const multer = require("multer");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const photoUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "attachments"
);

if (!fs.existsSync(photoUploadDir)) {
  fs.mkdirSync(photoUploadDir, { recursive: true });
}

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photoUploadDir);
  },
  filename: (req, file, cb) => {
    const attachmentId = req.body.attachment_id || "attachment";
    const timestamp = Date.now();
    const fileName = `${attachmentId}_photo_${timestamp}${path.extname(
      file.originalname
    )}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadDir;
      if (file.fieldname === "photos") {
        uploadDir = photoUploadDir;
      } else if (file.fieldname === "supportDocument") {
        uploadDir = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "uploads",
          "supportDocuments"
        );
      } else {
        return cb(new Error("Invalid field name"), null);
      }

      // Ensure directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const ext = path.extname(file.originalname);
      const prefix = file.fieldname === "photos" ? "photo" : "doc";
      cb(null, `${prefix}_${timestamp}_${random}${ext}`);
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
    files: 10, // max 4 photos + 1 doc + margin
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "photos") {
      if (/^image\/(jpeg|png)$/.test(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Only JPEG/PNG images allowed for photos"), false);
      }
    } else if (file.fieldname === "supportDocument") {
      cb(null, true); // allow any
    } else {
      cb(new Error(`Unexpected field: ${file.fieldname}`), false);
    }
  },
}).any();

// Helper function to delete old files
const deleteOldFile = async (filePath) => {
  if (!filePath) return;

  try {
    const actualPath = filePath.replace(/^\/public\//, "public/");
    const fullPath = path.join(__dirname, "..", "..", actualPath);

    const exists = await fsPromises
      .access(fullPath)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      await fsPromises.unlink(fullPath);
      console.log(`Deleted old file: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

// Create Attachment
const createAttachment = async (req, res) => {

  let parsedAttachmentData;

  try {
    // Check if 'data' came as a file instead of form field
    const dataFile = req.files?.find((f) => f.fieldname === "data");

    if (dataFile) {
      const fileContent = await fsPromises.readFile(dataFile.path, "utf8");
      parsedAttachmentData = JSON.parse(fileContent);
      await fsPromises.unlink(dataFile.path);
    } else if (req.body.data) {
      parsedAttachmentData =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
    } else {
      parsedAttachmentData = req.body;
    }

    const {
      sales_order_id,
      product_id,
      attachment_number,
      product_name,
      product_details,
      serial_number,
      equipment_type_compatibility,
      location,
      plate_number,
      vehicle_type,
      purchase_date,
      status = "Active",
      date,
      remarks,
      attachment_status = "idle",
    } = parsedAttachmentData;

    // Handle photo uploads
    let photo_attachments = [];

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const photoFiles = req.files.filter(
        (file) => file.fieldname === "photos"
      );

      photo_attachments = photoFiles.map((file) => ({
        path: `/uploads/attachments/${file.filename}`,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
    }

    // Validate sales_order_id if provided
    if (sales_order_id) {
      const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
      if (!salesOrder) {
        return res.status(400).json({ message: "Invalid sales order" });
      }
    }

    // Validate product_id if provided
    if (product_id) {
      const product = await ProductModel.findByPk(product_id);
      if (!product) {
        return res.status(400).json({ message: "Invalid product" });
      }
    }

    // Validate required fields
    if (!attachment_number || attachment_number.trim() === "") {
      return res.status(400).json({ message: "Attachment number is required" });
    }
    if (!product_name || product_name.trim() === "") {
      return res.status(400).json({ message: "Product name is required" });
    }
    if (!product_details || product_details.trim() === "") {
      return res.status(400).json({ message: "Product details are required" });
    }
    if (!serial_number || serial_number.trim() === "") {
      return res.status(400).json({ message: "Serial number is required" });
    }
    if (!purchase_date) {
      return res.status(400).json({ message: "Purchase date is required" });
    }

    // Handle file uploads
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

    const attachmentData = {
      sales_order_id: sales_order_id || null,
      product_id: product_id || null,
      attachment_number,
      product_name,
      product_details,
      serial_number,
      equipment_type_compatibility,
      location,
      plate_number,
      vehicle_type,
      purchase_date,
      status,
      date: date || null,
      remarks: remarks || null,
      attachment_status,
      photo_attachments,
    };

    // Add supportDocument if uploaded
    if (uploadedFiles.supportDocument?.[0]?.filename) {
      attachmentData.supportDocument =
        uploadedFiles.supportDocument[0].filename;
    }

    const attachment = await AttachmentModel.create(attachmentData);

    res.status(201).json({
      message: "Attachment created successfully",
      attachment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttachment = async (req, res) => {
  const { id } = req.params;
  let parsedAttachmentData;

  try {
    // Parse data from file, JSON string, or direct fields
    const dataFile = req.files?.find((f) => f.fieldname === "data");
    if (dataFile) {
      const fileContent = await fsPromises.readFile(dataFile.path, "utf8");
      parsedAttachmentData = JSON.parse(fileContent);
      await fsPromises.unlink(dataFile.path);
    } else if (req.body.data) {
      parsedAttachmentData = typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
    } else if (Object.keys(req.body).length > 0) {
      parsedAttachmentData = req.body;
    } else {
      return res.status(400).json({ message: "Missing attachment form data" });
    }

    const {
      sales_order_id,
      product_id,
      attachment_number,
      product_name,
      product_details,
      serial_number,
      equipment_type_compatibility,
      location,
      plate_number,
      vehicle_type,
      purchase_date,
      status,
      date,
      remarks,
      attachment_status,
      existing_photos,
    } = parsedAttachmentData;

    const attachment = await AttachmentModel.findByPk(id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    // Parse kept photos
    let keptPhotos = [];
    if (existing_photos) {
      try {
        keptPhotos = typeof existing_photos === "string"
          ? JSON.parse(existing_photos)
          : existing_photos;
      } catch (e) {
        return res.status(400).json({ message: "Invalid existing_photos format" });
      }
    }

    const keptPaths = keptPhotos.map(p => p.path).filter(Boolean);
    const currentPhotos = attachment.photo_attachments || [];
    const photosToDelete = currentPhotos.filter(p => !keptPaths.includes(p.path));

    for (const photo of photosToDelete) {
      await deleteOldFile(photo.path);
    }

    // Group uploaded files
    const uploadedFiles = req.files.reduce((acc, file) => {
      if (!acc[file.fieldname]) acc[file.fieldname] = [];
      acc[file.fieldname].push(file);
      return acc;
    }, {});

    // New photos
    let photo_attachments = [...keptPhotos];
    if (uploadedFiles.photos) {
      const newPhotos = uploadedFiles.photos.map(file => ({
        path: `/uploads/attachments/${file.filename}`,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));
      photo_attachments = [...photo_attachments, ...newPhotos].slice(0, 4);
    }

    // Update fields
    const updates = {
      sales_order_id: sales_order_id ?? attachment.sales_order_id,
      product_id: product_id ?? attachment.product_id,
      attachment_number: attachment_number ?? attachment.attachment_number,
      product_name: product_name ?? attachment.product_name,
      product_details: product_details ?? attachment.product_details,
      serial_number: serial_number ?? attachment.serial_number,
      equipment_type_compatibility: equipment_type_compatibility ?? attachment.equipment_type_compatibility,
      location: location ?? attachment.location,
      plate_number: plate_number ?? attachment.plate_number,
      vehicle_type: vehicle_type ?? attachment.vehicle_type,
      purchase_date: purchase_date ?? attachment.purchase_date,
      status: status ?? attachment.status,
      date: date ?? attachment.date,
      remarks: remarks ?? attachment.remarks,
      attachment_status: attachment_status ?? attachment.attachment_status,
      photo_attachments,
    };

    // Handle support document
    if (uploadedFiles.supportDocument?.[0]) {
      if (attachment.supportDocument) {
        await deleteOldFile(attachment.supportDocument);
      }
      updates.supportDocument = uploadedFiles.supportDocument[0].filename;
    }

    await attachment.update(updates);

    res.status(200).json({
      message: "Attachment updated successfully",
      attachment,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating attachment", error: error.message });
  }
};

const getAttachmentPhotos = async (req, res) => {
  const { attachment_id } = req.params;
  try {
    const attachment = await ProductModel.findByPk(attachment_id, {
      attributes: ["photo_attachments"],
    });
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }
    res.status(200).json({ photos: attachment.photo_attachments || [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving photos", error: error.message });
  }
};

// Delete Attachment
const deleteAttachment = async (req, res) => {
  const { id } = req.params;

  try {
    const attachment = await AttachmentModel.findByPk(id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    // Delete associated file if exists
    if (attachment.supportDocument) {
      await deleteOldFile(attachment.supportDocument);
    }

    await attachment.destroy();
    res.status(200).json({ message: "Attachment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting attachment",
      error: error.message,
    });
  }
};

// Serve Attachment File
const serveAttachmentFile = async (req, res) => {
  const validFolders = ["supportDocuments", "attachments"];
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
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
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
        res
          .status(500)
          .json({ message: "Error streaming file", error: error.message });
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
      res
        .status(500)
        .json({ message: "Error serving file", error: error.message });
    }
  }
};

// Get Attachment by ID
const getAttachmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await AttachmentModel.findByPk(id, {
      include: [
        { model: SalesOrdersModel, as: "sales_order" },
        { model: ProductModel, as: "product" },
      ],
    });

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    res.status(200).json(attachment);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attachment",
      error: error.message,
    });
  }
};

// Get All Attachments
const getAllAttachments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAttachments, rows: attachments } =
      await AttachmentModel.findAndCountAll({
        include: [
          { model: SalesOrdersModel, as: "sales_order" },
          { model: ProductModel, as: "product" },
        ],
        offset,
        limit: parseInt(limit),
        // order: [["created_at", "DESC"]],
      });

    res.status(200).json({
      totalAttachments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachments / limit),
      attachments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving attachments",
      error: error.message,
    });
  }
};

// Filter Attachments
const filterAttachments = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { count: totalAttachments, rows: attachments } =
      await AttachmentModel.findAndCountAll({
        where,
        include: [
          { model: SalesOrdersModel, as: "sales_order" },
          { model: ProductModel, as: "product" },
        ],
        offset,
        limit: parseInt(limit),
        // order: [["created_at", "DESC"]],
      });

    res.status(200).json({
      totalAttachments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAttachments / limit),
      attachments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering attachments",
      error: error.message,
    });
  }
};

// Export Filtered Attachments to CSV
const exportFilteredAttachmentsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { rows: attachments } = await AttachmentModel.findAndCountAll({
      where,
      include: [
        { model: SalesOrdersModel, as: "sales_order" },
        { model: ProductModel, as: "product" },
      ],
      offset,
      limit: parseInt(limit),
    });

    if (!attachments || attachments.length === 0) {
      return res
        .status(404)
        .json({ message: "No attachments found matching the filters" });
    }

    const attachmentsData = attachments.map((attachment) => ({
      attachment_id: attachment.attachment_id,
      attachment_number: attachment.attachment_number,
      product_name: attachment.product_name,
      product_details: attachment.product_details,
      serial_number: attachment.serial_number,
      equipment_type_compatibility: attachment.equipment_type_compatibility,
      location: attachment.location,
      plate_number: attachment.plate_number,
      purchase_date: attachment.purchase_date,
      status: attachment.status,
      supportDocument: attachment.supportDocument || "N/A",
      photo_attachments: JSON.stringify(attachment.photo_attachments),
      date: attachment.date || "N/A",
      remarks: attachment.remarks || "N/A",
      attachment_status: attachment.attachment_status,
      created_at: attachment.created_at,
      updated_at: attachment.updated_at,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(attachmentsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_attachments.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting attachments to CSV:", error);
    res.status(500).json({
      message: "Error exporting attachments to CSV",
      error: error.message,
    });
  }
};

// Export Filtered Attachments to PDF
const exportFilteredAttachmentsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where.status = status;
    }

    const { rows: attachments } = await AttachmentModel.findAndCountAll({
      where,
      include: [
        { model: SalesOrdersModel, as: "sales_order" },
        { model: ProductModel, as: "product" },
      ],
      offset,
      limit: parseInt(limit),
    });

    if (!attachments || attachments.length === 0) {
      return res
        .status(404)
        .json({ message: "No attachments found matching the filters" });
    }

    const attachmentsData = attachments.map((attachment) => [
      attachment.attachment_id || "N/A",
      attachment.attachment_number || "N/A",
      attachment.product_name || "N/A",
      attachment.product_details || "N/A",
      attachment.serial_number || "N/A",
      attachment.purchase_date || "N/A",
      attachment.status || "N/A",
      attachment.date || "N/A",
      attachment.remarks || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Attachments Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: Array(9).fill("*"),
            body: [
              [
                "Attachment ID",
                "Attachment Number",
                "Product Name",
                "Product Details",
                "Serial Number",
                "Purchase Date",
                "Status",
                "Date",
                "Remarks",
              ],
              ...attachmentsData,
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
    res.attachment("attachments_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting attachments to PDF:", error);
    res.status(500).json({
      message: "Error exporting attachments to PDF",
      error: error.message,
    });
  }
};

const getAttachmentStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const history = await AttachmentStatusHistoryModel.findAll({
      where: { attachment_id: id },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving status history",
      error: error.message,
    });
  }
};

// Create status history entry
const createStatusHistory = async (req, res) => {
  try {
    const { attachment_id, status, date, remarks } = req.body;

    if (!attachment_id || !status || !date) {
      return res.status(400).json({
        message: "Attachment ID, status, and date are required",
      });
    }

    const attachment = await AttachmentModel.findByPk(attachment_id);
    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    const history = await AttachmentStatusHistoryModel.create({
      attachment_id,
      status,
      date,
      remarks: remarks || null,
    });

    // Update attachment status
    await attachment.update({ status, date, remarks });

    res.status(201).json({
      message: "Status history created successfully",
      history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating status history",
      error: error.message,
    });
  }
};

// Update status history entry
const updateStatusHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, remarks } = req.body;

    const history = await AttachmentStatusHistoryModel.findByPk(id);
    if (!history) {
      return res.status(404).json({ message: "Status history not found" });
    }

    await history.update({
      status: status || history.status,
      date: date || history.date,
      remarks: remarks !== undefined ? remarks : history.remarks,
    });

    // Update attachment if this is the latest entry
    const latestHistory = await AttachmentStatusHistoryModel.findOne({
      where: { attachment_id: history.attachment_id },
      order: [["created_at", "DESC"]],
    });

    if (latestHistory.history_id === history.history_id) {
      await AttachmentModel.update(
        { status: history.status, date: history.date, remarks: history.remarks },
        { where: { attachment_id: history.attachment_id } }
      );
    }

    res.status(200).json({
      message: "Status history updated successfully",
      history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating status history",
      error: error.message,
    });
  }
};

// Add this new function after the existing controller functions
const getVehicleTypeByPlateNumber = async (req, res) => {
  const { plate_number } = req.params;

  try {
    if (!plate_number || plate_number.trim() === "") {
      return res.status(400).json({ message: "Plate number is required" });
    }

    const equipment = await EquipmentModel.findOne({
      where: { reg_number: plate_number.trim() },
      attributes: ["vehicle_type", "reg_number"],
    });

    if (!equipment) {
      return res.status(404).json({ 
        message: "No equipment found with this plate number",
        vehicle_type: null 
      });
    }

    res.status(200).json({
      vehicle_type: equipment.vehicle_type,
      plate_number: equipment.reg_number,
    });
  } catch (error) {
    console.error("Error fetching vehicle type:", error);
    res.status(500).json({
      message: "Error fetching vehicle type",
      error: error.message,
    });
  }
};

module.exports = {
  uploadAttachments: upload,
  createAttachment,
  updateAttachment,
  getAttachmentPhotos,
  deleteAttachment,
  serveAttachmentFile,
  getAttachmentById,
  getAllAttachments,
  filterAttachments,
  exportFilteredAttachmentsToCSV,
  exportFilteredAttachmentsToPDF,
  getAttachmentStatusHistory,
  createStatusHistory,
  updateStatusHistory,
  getVehicleTypeByPlateNumber,
};
