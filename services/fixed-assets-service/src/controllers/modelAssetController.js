const ModelAssetModel = require("../models/ModelAssetModel");
const ManufacturerModel = require("../models/ManufacturerModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// ──────────────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────────────
const createModelAsset = async (req, res) => {
  const { manufacturer_id, model, status = "Active" } = req.body;

  try {
    const newModel = await ModelAssetModel.create({
      manufacturer_id,
      model,
      status,
    });

    res
      .status(201)
      .json({ message: "Asset model created successfully", model: newModel });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ──────────────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────────────
const updateModelAsset = async (req, res) => {
  const { id } = req.params;
  const { manufacturer_id, model, status } = req.body;

  try {
    const assetToUpdate = await ModelAssetModel.findByPk(id);
    if (!assetToUpdate) {
      return res.status(404).json({ message: "Asset model not found" });
    }

    assetToUpdate.manufacturer_id =
      manufacturer_id ?? assetToUpdate.manufacturer_id;
    assetToUpdate.model = model ?? assetToUpdate.model;
    assetToUpdate.status = status ?? assetToUpdate.status;

    await assetToUpdate.save();

    res
      .status(200)
      .json({
        message: "Asset model updated successfully",
        model: assetToUpdate,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating asset model", error: error.message });
  }
};

// ──────────────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────────────
const deleteModelAsset = async (req, res) => {
  const { id } = req.params;

  try {
    const assetToDelete = await ModelAssetModel.findByPk(id);
    if (!assetToDelete) {
      return res.status(404).json({ message: "Asset model not found" });
    }

    await assetToDelete.destroy();
    res.status(200).json({ message: "Asset model deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting asset model", error: error.message });
  }
};

// ──────────────────────────────────────────────────────
// GET BY ID
// ──────────────────────────────────────────────────────
const getModelAssetById = async (req, res) => {
  const { id } = req.params;

  try {
    const asset = await ModelAssetModel.findByPk(id, {
      include: [{ model: ManufacturerModel, as: "manufacturer" }],
    });

    if (!asset) {
      return res.status(404).json({ message: "Asset model not found" });
    }

    res.status(200).json(asset);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset model", error: error.message });
  }
};

// ──────────────────────────────────────────────────────
// GET ALL (paginated)
// ──────────────────────────────────────────────────────
const getAllModelAssets = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);

  try {
    const { count: total, rows: assets } =
      await ModelAssetModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [{ model: ManufacturerModel, as: "manufacturer" }],
      });

    res.status(200).json({
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      assets,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset models", error: error.message });
  }
};

// ──────────────────────────────────────────────────────
// FILTER (by status)
// ──────────────────────────────────────────────────────
const filterModelAssets = async (req, res) => {
  const { status = "All", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const where = {};

  if (status !== "All") where.status = status;

  try {
    const { count: total, rows: data } =
      await ModelAssetModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [{ model: ManufacturerModel, as: "manufacturer" }],
      });

    res.status(200).json({
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering asset models", error: error.message });
  }
};

// ──────────────────────────────────────────────────────
// EXPORT CSV
// ──────────────────────────────────────────────────────
const exportFilteredModelAssetsToCSV = async (req, res) => {
  const { status = "All", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const where = {};

  if (status !== "All") where.status = status;

  try {
    const { rows: assets } = await ModelAssetModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: ManufacturerModel, as: "manufacturer" }],
    });

    if (!assets || assets.length === 0) {
      return res
        .status(404)
        .json({ message: "No asset models found matching the filters" });
    }

    const data = assets.map((a) => ({
      id: a.id,
      manufacturer_id: a.manufacturer_id,
      manufacturer_name: a.manufacturer?.manufacturer ?? "N/A",
      model: a.model,
      status: a.status,
    }));

    const csv = new Parser().parse(data);
    res.header("Content-Type", "text/csv");
    res.attachment("filtered_asset_models.csv");
    res.send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    res
      .status(500)
      .json({ message: "Error exporting CSV", error: error.message });
  }
};

// ──────────────────────────────────────────────────────
// EXPORT PDF
// ──────────────────────────────────────────────────────
const exportFilteredModelAssetsToPDF = async (req, res) => {
  const { status = "All", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const where = {};

  if (status !== "All") where.status = status;

  try {
    const { rows: assets } = await ModelAssetModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: ManufacturerModel, as: "manufacturer" }],
    });

    if (!assets || assets.length === 0) {
      return res
        .status(404)
        .json({ message: "No asset models found matching the filters" });
    }

    const body = assets.map((a) => [
      a.id?.toString() ?? "N/A",
      a.manufacturer_id?.toString() ?? "N/A",
      a.manufacturer?.manufacturer ?? "N/A",
      a.model ?? "N/A",
      a.status ?? "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Asset Models Report", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, 80, 120, "*", 70],
            body: [
              ["ID", "Manufacturer ID", "Manufacturer", "Model", "Status"],
              ...body,
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
      defaultStyle: { fontSize: 8 },
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
    res.attachment("asset_models_report.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF export error:", error);
    res
      .status(500)
      .json({ message: "Error exporting PDF", error: error.message });
  }
};

module.exports = {
  createModelAsset,
  updateModelAsset,
  deleteModelAsset,
  getModelAssetById,
  getAllModelAssets,
  filterModelAssets,
  exportFilteredModelAssetsToCSV,
  exportFilteredModelAssetsToPDF,
};
