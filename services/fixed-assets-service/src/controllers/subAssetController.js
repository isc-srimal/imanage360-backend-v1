const SubAssetModel = require("../models/SubAssetModel");
const AssetModel = require("../models/AssetModel");
const SupplierIDModel = require("../models/SupplierIDModel");
const AssetCategoryModel = require("../models/AssetCategoryModel");
const AssetSubcategoryModel = require("../models/AssetSubcategoryModel");
const AssetCapacityModel = require("../models/AssetCapacityModel");
const AssetClassificationModel = require("../models/AssetClassificationModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const sequelize = require("../../src/config/dbSync");
const ManufacturerModel = require("../models/ManufacturerModel");
const ModelAssetModel = require("../models/ModelAssetModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const postToGeneralLedger = async (data) => {
  try {
    console.log(`Posting to GL: ${JSON.stringify(data)}`);
    return { journal_entry_id: `JE-${Date.now()}` };
  } catch (error) {
    throw new Error(`GL Posting failed: ${error.message}`);
  }
};

const createSubAsset = async (req, res) => {
  const {
    tag_numbers,
    serial_number,
    engine_number,
    year_of_manufacture,
    manufacturer_id,
    model_id,
    description,
    asset_number,
    classification_id,
    category_name,
    subcategory_name,
    capacity_value,
    acquisition_date,
    acquisition_cost,
    supplier_name,
    purchase_order_id,
    useful_life,
    residual_value,
    current_value,
    status,
    barcode,
    rfid_tag,
  } = req.body;

  try {
    const existingTagNumber = await SubAssetModel.findOne({ where: { tag_numbers } });
    if (existingTagNumber) {
      return res.status(400).json({ message: "Tag number already exists" });
    }
    const existingSerialNumber = await SubAssetModel.findOne({ where: { serial_number } });
    if (existingSerialNumber) {
      return res.status(400).json({ message: "Serial number already exists" });
    }
    if (new Date(acquisition_date) > new Date()) {
      return res
        .status(400)
        .json({ message: "Acquisition date cannot be in the future" });
    }
    if (acquisition_cost <= 0) {
      return res
        .status(400)
        .json({ message: "Acquisition cost must be positive" });
    }
    if (useful_life !== null && useful_life <= 0) {
      return res
        .status(400)
        .json({ message: "Useful life must be greater than 0 if provided" });
    }
    if (
      ![
        "active",
        "inactive",
        "disposed",
        "transferred",
        "in_construction",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    if (
      year_of_manufacture &&
      (year_of_manufacture < 1900 ||
        year_of_manufacture > new Date().getFullYear())
    ) {
      return res.status(400).json({ message: "Invalid year of manufacture" });
    }

    const subAsset = await SubAssetModel.create({
      tag_numbers,
      serial_number,
      engine_number,
      year_of_manufacture,
      manufacturer_id,
      model_id,
      description,
      asset_number,
      classification_id,
      category_name,
      subcategory_name,
      capacity_value,
      acquisition_date,
      acquisition_cost,
      supplier_name,
      purchase_order_id,
      useful_life,
      residual_value,
      current_value: current_value || acquisition_cost,
      status: status || "active",
      barcode,
      rfid_tag,
    });

    if (status === "active") {
      const glResponse = await postToGeneralLedger({
        type: "sub_asset_acquisition",
        sub_asset_id: subAsset.sub_asset_id,
        amount: acquisition_cost,
        account: "fixed_asset",
        contra_account: "accounts_payable",
      });
      await subAsset.update({ journal_entry_id: glResponse.journal_entry_id });
    }

    res
      .status(201)
      .json({ message: "Sub-asset created successfully", subAsset });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating sub-asset", error: error.message });
  }
};

const updateSubAsset = async (req, res) => {
  const { sub_asset_id } = req.params;
  const {
    tag_numbers,
    serial_number,
    engine_number,
    year_of_manufacture,
    manufacturer_id,
    model_id,
    description,
    asset_number,
    classification_id,
    category_name,
    subcategory_name,
    capacity_value,
    acquisition_date,
    acquisition_cost,
    supplier_name,
    purchase_order_id,
    residual_value,
    current_value,
    status,
    barcode,
    rfid_tag,
  } = req.body;

  try {
    const subAsset = await SubAssetModel.findByPk(sub_asset_id);
    if (!subAsset) {
      return res.status(404).json({ message: "Sub-asset not found" });
    }


    const existingTagNumber = await SubAssetModel.findOne({ where: { tag_numbers } });
    if (existingTagNumber) {
      return res.status(400).json({ message: "Tag number already exists" });
    }
    const existingSerialNumber = await SubAssetModel.findOne({ where: { serial_number } });
    if (existingSerialNumber) {
      return res.status(400).json({ message: "Serial number already exists" });
    }
    if (acquisition_date && new Date(acquisition_date) > new Date()) {
      return res
        .status(400)
        .json({ message: "Acquisition date cannot be in the future" });
    }
    if (acquisition_cost && acquisition_cost <= 0) {
      return res
        .status(400)
        .json({ message: "Acquisition cost must be positive" });
    }
    if (
      year_of_manufacture &&
      (year_of_manufacture < 1900 ||
        year_of_manufacture > new Date().getFullYear())
    ) {
      return res.status(400).json({ message: "Invalid year of manufacture" });
    }
    if (
      status &&
      ![
        "active",
        "inactive",
        "disposed",
        "transferred",
        "in_construction",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await subAsset.update({
      tag_numbers: tag_numbers || subAsset.tag_numbers,
      serial_number: serial_number || subAsset.serial_number,
      engine_number: engine_number || subAsset.engine_number,
      year_of_manufacture: year_of_manufacture || subAsset.year_of_manufacture,
      manufacturer_id: manufacturer_id || subAsset.manufacturer_id,
      model_id: model_id || subAsset.model_id,
      description: description || subAsset.description,
      classification_id: classification_id || subAsset.classification_id,
      asset_number: asset_number || subAsset.asset_number,
      category_name: category_name || subAsset.category_name,
      subcategory_name: subcategory_name || subAsset.subcategory_name,
      capacity_value: capacity_value || subAsset.capacity_value,
      acquisition_date: acquisition_date || subAsset.acquisition_date,
      acquisition_cost: acquisition_cost || subAsset.acquisition_cost,
      supplier_name: supplier_name || subAsset.supplier_name,
      purchase_order_id: purchase_order_id || subAsset.purchase_order_id,
      residual_value: residual_value || subAsset.residual_value,
      current_value: current_value || subAsset.current_value,
      status: status || subAsset.status,
      barcode: barcode || subAsset.barcode,
      rfid_tag: rfid_tag || subAsset.rfid_tag,
    });

    if (status === "active" && subAsset.status === "in_construction") {
      const glResponse = await postToGeneralLedger({
        type: "sub_asset_acquisition",
        sub_asset_id,
        amount: subAsset.acquisition_cost,
        account: "fixed_asset",
        contra_account: "accounts_payable",
      });
      await subAsset.update({ journal_entry_id: glResponse.journal_entry_id });
    }

    res
      .status(200)
      .json({ message: "Sub-asset updated successfully", subAsset });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating sub-asset", error: error.message });
  }
};

const deleteSubAsset = async (req, res) => {
  const { sub_asset_id } = req.params;

  try {
    const subAsset = await SubAssetModel.findByPk(sub_asset_id);
    if (!subAsset) {
      return res.status(404).json({ message: "Sub-asset not found" });
    }

    await subAsset.destroy();
    res.status(200).json({ message: "Sub-asset deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting sub-asset", error: error.message });
  }
};

const getSubAssetById = async (req, res) => {
  try {
    const { sub_asset_id } = req.params;
    const subAsset = await SubAssetModel.findByPk(sub_asset_id, {
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
        { model: ManufacturerModel, as: "manufacturer" },
        { model: ModelAssetModel, as: "model" },
        { model: AssetModel, as: "asset" },
        { model: SupplierIDModel, as: "supplier" },
      ],
    });
    if (!subAsset) {
      return res.status(404).json({ message: "Sub-asset not found" });
    }
    res.status(200).json(subAsset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving sub-asset", error: error.message });
  }
};

const getAllSubAssets = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSubAssets, rows: subAssets } =
      await SubAssetModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          { model: AssetCategoryModel, as: "category" },
          { model: AssetSubcategoryModel, as: "subcategory" },
          { model: AssetCapacityModel, as: "capacity" },
          { model: ManufacturerModel, as: "manufacturer" },
          { model: ModelAssetModel, as: "model" },
          { model: AssetClassificationModel, as: "classification" },
          { model: AssetModel, as: "asset" },
          { model: SupplierIDModel, as: "supplier" },
        ],
      });

    res.status(200).json({
      totalSubAssets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubAssets / limit),
      subAssets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving sub-assets", error: error.message });
  }
};

const filterSubAssets = async (req, res) => {
  try {
    const {
      status = "All",
      asset_id,
      supplier_name,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (status !== "All") where.status = status;
    if (asset_id) where.asset_id = asset_id;
    if (supplier_name) where.supplier_name = supplier_name;

    const { count: totalSubAssets, rows: subAssets } =
      await SubAssetModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: AssetCategoryModel, as: "category" },
          { model: AssetSubcategoryModel, as: "subcategory" },
          { model: AssetCapacityModel, as: "capacity" },
          { model: ManufacturerModel, as: "manufacturer" },
          { model: ModelAssetModel, as: "model" },
          { model: AssetClassificationModel, as: "classification" },
          { model: AssetModel, as: "asset" },
          { model: SupplierIDModel, as: "supplier" },
        ],
      });

    res.status(200).json({
      totalSubAssets,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubAssets / limit),
      subAssets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering sub-assets", error: error.message });
  }
};

const exportSubAssetRegisterToCSV = async (req, res) => {
  try {
    const {
      status = "All",
      asset_id,
      supplier_name,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (status !== "All") where.status = status;
    if (asset_id) where.asset_id = asset_id;
    if (supplier_name) where.supplier_name = supplier_name;

    const subAssets = await SubAssetModel.findAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
        { model: ManufacturerModel, as: "manufacturer" },
        { model: ModelAssetModel, as: "model" },
        { model: AssetClassificationModel, as: "classification" },
        { model: AssetModel, as: "asset" },
        { model: SupplierIDModel, as: "supplier" },
      ],
    });

    if (!subAssets || subAssets.length === 0) {
      return res
        .status(404)
        .json({ message: "No sub-assets found matching the filters" });
    }

    const subAssetData = subAssets.map((subAsset) => ({
      tag_numbers: subAsset.tag_numbers,
      serial_number: subAsset.serial_number,
      engine_number: subAsset.engine_number,
      year_of_manufacture: subAsset.year_of_manufacture,
      manufacturer_id: subAsset.manufacturer_id,
      model_id: subAsset.model_id,
      description: subAsset.description,
      sub_asset_id: subAsset.sub_asset_id,
      asset_number: subAsset.asset_number,
      classification_id: subAsset.classification_id,
      category_name: subAsset.category_name,
      subcategory_name: subAsset.subcategory_name,
      capacity_value: subAsset.capacity_value,
      acquisition_date: subAsset.acquisition_date,
      acquisition_cost: subAsset.acquisition_cost,
      supplier_name: subAsset.supplier_name,
      purchase_order_id: subAsset.purchase_order_id,
      useful_life: subAsset.useful_life,
      residual_value: subAsset.residual_value,
      current_value: subAsset.current_value,
      status: subAsset.status,
      barcode: subAsset.barcode,
      rfid_tag: subAsset.rfid_tag,
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(subAssetData);

    res.header("Content-Type", "text/csv");
    res.attachment("sub_asset_register.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({
      message: "Error exporting sub-asset register to CSV",
      error: error.message,
    });
  }
};

const exportSubAssetRegisterToPDF = async (req, res) => {
  try {
    const {
      status = "All",
      asset_id,
      supplier_name,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (status !== "All") where.status = status;
    if (asset_id) where.asset_id = asset_id;
    if (supplier_name) where.supplier_name = supplier_name;

    const subAssets = await SubAssetModel.findAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
        { model: AssetCapacityModel, as: "capacity" },
        { model: ManufacturerModel, as: "manufacturer" },
        { model: ModelAssetModel, as: "model" },
        { model: AssetClassificationModel, as: "classification" },
        { model: AssetModel, as: "asset" },
        { model: SupplierIDModel, as: "supplier" },
      ],
    });

    if (!subAssets || subAssets.length === 0) {
      return res
        .status(404)
        .json({ message: "No sub-assets found matching the filters" });
    }

    const subAssetData = subAssets.map((subAsset) => [
      subAsset.sub_asset_id || "N/A",
      subAsset.asset_number || "N/A",
      subAsset.acquisition_date || "N/A",
      subAsset.acquisition_cost || "N/A",
      subAsset.status || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Sub-Asset Register", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],

            body: [
              [
                "Sub-Asset ID",
                "Asset Number",
                "Acquisition Date",
                "Acquisition Cost",
                "Status",
              ],
              ...subAssetData,
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
    res.attachment("sub_asset_register.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    res.status(500).json({
      message: "Error exporting sub-asset register to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createSubAsset,
  updateSubAsset,
  deleteSubAsset,
  getSubAssetById,
  getAllSubAssets,
  filterSubAssets,
  exportSubAssetRegisterToCSV,
  exportSubAssetRegisterToPDF,
};
