const ProductModel = require("../models/ProductModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const sequelize = require("../../src/config/dbSync");
const multer = require("multer");
const fs = require("fs");
const fsPromises = require("fs").promises;

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const photoUploadDir = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "uploads",
  "productImages"
);

if (!fs.existsSync(photoUploadDir)) {
  fs.mkdirSync(photoUploadDir, { recursive: true });
}

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, photoUploadDir);
  },
  filename: (req, file, cb) => {
    const productId = req.body.product_id || "product";
    const timestamp = Date.now();
    const fileName = `${productId}_photo_${timestamp}${path.extname(
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
      } else {
        cb(new Error(`Unexpected field: ${file.fieldname}`), null);
      }
    },
    filename: (req, file, cb) => {
      const productId = req.body.product_id || "product";
      const timestamp = Date.now();
      const prefix = file.fieldname === "photos";
      const fileName = `${productId}_${prefix}_${timestamp}${path.extname(
        file.originalname
      )}`;
      cb(null, fileName);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const photoTypes = ["image/jpeg", "image/png"];
    if (file.fieldname === "photos" && photoTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type for ${file.fieldname}. Allowed types: ${
            file.fieldname === "photos"
          }`
        ),
        false
      );
    }
  },
}).fields([{ name: "photos", maxCount: 4 }]);

const createProduct = async (req, res) => {
  const {
    sales_order_id,
    product_name,
    description,
    unit_price,
    sell_this,
    income_account,
  } = req.body;

  try {
    let product_photo_attachments = [];

    if (req.files) {
      if (req.files["photos"]) {
        product_photo_attachments = req.files["photos"].map((file) => ({
          path: `/uploads/productImages/${file.filename}`,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        }));
      }
    }

    const product = await ProductModel.create({
      sales_order_id,
      product_name,
      description,
      unit_price,
      sell_this,
      income_account,
      product_photo_attachments,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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

const updateProduct = async (req, res) => {
  const { product_id } = req.params;
  const {
    sales_order_id,
    product_name,
    attachment_number,
    schedule_date,
    description,
    unit_price,
    sell_this,
    income_account,
    existing_photos, // JSON string of kept photos
  } = req.body;

  try {
    const productToUpdate = await ProductModel.findByPk(product_id);

    if (!productToUpdate) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Current photos in DB
    const currentPhotos = productToUpdate.product_photo_attachments || [];

    // Parse kept photos from frontend (array of photo objects)
    let keptPhotos = [];
    if (existing_photos) {
      try {
        keptPhotos = JSON.parse(existing_photos);
      } catch (parseError) {
        console.error("Error parsing existing_photos:", parseError);
        return res.status(400).json({ message: "Invalid existing_photos format" });
      }
    }

    // Extract paths of kept photos
    const keptPaths = keptPhotos.map(photo => photo.path).filter(Boolean);

    // Find photos to delete (present in DB but not in keptPhotos)
    const photosToDelete = currentPhotos.filter(
      photo => !keptPaths.includes(photo.path)
    );

    // Delete old files asynchronously
    for (const photo of photosToDelete) {
      await deleteOldFile(photo.path); // Using your existing deleteOldFile function
    }

    // Prepare new photo attachments
    let product_photo_attachments = [...keptPhotos];

    // Add new uploaded photos
    if (req.files && req.files["photos"]) {
      const newPhotos = req.files["photos"].map((file) => ({
        path: `/uploads/productImages/${file.filename}`,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      }));

      // Combine and limit to 4
      product_photo_attachments = [...product_photo_attachments, ...newPhotos].slice(0, 4);
    }

    // Update product in DB
    await productToUpdate.update({
      sales_order_id: sales_order_id || productToUpdate.sales_order_id,
      product_name: product_name || productToUpdate.product_name,
      attachment_number: attachment_number || productToUpdate.attachment_number,
      schedule_date: schedule_date || productToUpdate.schedule_date,
      description: description || productToUpdate.description,
      unit_price: unit_price !== undefined ? unit_price : productToUpdate.unit_price,
      sell_this: sell_this !== undefined ? sell_this : productToUpdate.sell_this,
      income_account: income_account || productToUpdate.income_account,
      product_photo_attachments,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: productToUpdate,
    });
  } catch (error) {
    console.error("Error in updateProduct:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

const getProductPhotos = async (req, res) => {
  const { product_id } = req.params;
  try {
    const product = await ProductModel.findByPk(product_id, {
      attributes: ["product_photo_attachments"],
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ photos: product.product_photo_attachments || [] });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving photos", error: error.message });
  }
};

const serveProductFile = async (req, res) => {
  const validFolders = ["productImages"];
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
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Set response headers
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Length", stats.size);

    // Create read stream
    const readStream = fs.createReadStream(safePath);

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

const deleteProduct = async (req, res) => {
  const { product_id } = req.params;

  try {
    const productToDelete = await ProductModel.findByPk(product_id);

    if (!productToDelete) {
      return res.status(404).json({ message: "Product not found" });
    }

    await productToDelete.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;
    const product = await ProductModel.findByPk(product_id, {
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalProducts, rows: products } =
      await ProductModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalProducts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
};

const filterProducts = async (req, res) => {
  try {
    const { sell_this = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (sell_this !== "All") {
      where["sell_this"] = sell_this === "true" || sell_this === "1";
    }

    const { count: totalProducts, rows: products } =
      await ProductModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalProducts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / limit),
      products,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering products", error: error.message });
  }
};

const exportFilteredProductsToCSV = async (req, res) => {
  try {
    const { sell_this = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (sell_this !== "All") {
      where["sell_this"] = sell_this === "true" || sell_this === "1";
    }

    const { rows: products } = await ProductModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found matching the filters",
      });
    }

    const productsData = products.map((product) => {
      return {
        productId: product.product_id,
        productName: product.product_name,
        description: product.description,
        unitPrice: product.unit_price,
        sellThis: product.sell_this,
        incomeAccount: product.income_account,
        product_photo_attachments: JSON.stringify(product.product_photo_attachments),
        createdAt: product.created_at,
        updatedAt: product.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(productsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_products.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting products to CSV:", error);
    res.status(500).json({
      message: "Error exporting products to CSV",
      error: error.message,
    });
  }
};

const exportFilteredProductsToPDF = async (req, res) => {
  try {
    const { sell_this = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (sell_this !== "All") {
      where["sell_this"] = sell_this === "true" || sell_this === "1";
    }

    const { rows: products } = await ProductModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found matching the filters" });
    }

    const productsData = products.map((product) => {
      return [
        product.product_id || "N/A",
        product.product_name || "N/A",
        product.description || "N/A",
        product.unit_price || "N/A",
        product.sell_this ? "Yes" : "No",
        product.income_account || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Products Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, 70, "*", 60, 50, "*"],
            body: [
              [
                "ID",
                "Product Name",
                "Description",
                "Unit Price",
                "Sell",
                "Income Account",
              ],
              ...productsData,
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
    res.attachment("products_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting products to PDF:", error);
    res.status(500).json({
      message: "Error exporting products to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  uploadProducts: upload,
  createProduct,
  updateProduct,
  getProductPhotos,
  serveProductFile,
  deleteProduct,
  getProductById,
  getAllProducts,
  filterProducts,
  exportFilteredProductsToCSV,
  exportFilteredProductsToPDF,
};
