const AssetCategoryModel = require("../models/AssetCategoryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createAssetCategory = async (req, res) => {
  const { category_name, status = "Active" } = req.body;

  try {
    const category = await AssetCategoryModel.create({
      category_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Asset category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAssetCategory = async (req, res) => {
  const { category_id } = req.params;
  const { category_name, status } = req.body;

  try {
    const categoryToUpdate = await AssetCategoryModel.findByPk(category_id);

    if (!categoryToUpdate) {
      return res.status(404).json({ message: "Asset category not found" });
    }

    categoryToUpdate.category_name = category_name || categoryToUpdate.category_name;
    categoryToUpdate.status = status || categoryToUpdate.status;

    await categoryToUpdate.save();
    res.status(200).json({
      message: "Asset category updated successfully",
      category: categoryToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating asset category", error: error.message });
  }
};

const deleteAssetCategory = async (req, res) => {
  const { category_id } = req.params;

  try {
    const categoryToDelete = await AssetCategoryModel.findByPk(category_id);

    if (!categoryToDelete) {
      return res.status(404).json({ message: "Asset category not found" });
    }

    await categoryToDelete.destroy();
    res.status(200).json({ message: "Asset category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting asset category", error: error.message });
  }
};

const getAssetCategoryById = async (req, res) => {
  try {
    const { category_id } = req.params;
    const category = await AssetCategoryModel.findByPk(category_id);

    if (!category) {
      return res.status(404).json({ message: "Asset category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset category", error: error.message });
  }
};

const getAllAssetCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCategories, rows: categories } =
      await AssetCategoryModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCategories / limit),
      categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset categories", error: error.message });
  }
};

const filterAssetCategories = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalCategories, rows: categories } =
      await AssetCategoryModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCategories / limit),
      categories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering asset categories", error: error.message });
  }
};

const exportFilteredAssetCategoriesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: categories } = await AssetCategoryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!categories || categories.length === 0) {
      return res.status(404).json({
        message: "No asset categories found matching the filters",
      });
    }

    const categoriesData = categories.map((category) => {
      return {
        category_id: category.category_id,
        category_name: category.category_name,
        status: category.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(categoriesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_asset_categories.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting asset categories to CSV:", error);
    res.status(500).json({
      message: "Error exporting asset categories to CSV",
      error: error.message,
    });
  }
};

const exportFilteredAssetCategoriesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: categories } = await AssetCategoryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({ message: "No asset categories found matching the filters" });
    }

    const categoriesData = categories.map((category) => {
      return [
        category.category_id || "N/A",
        category.category_name || "N/A",
        category.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Asset Categories Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Category ID", "Category Name", "Status"],
              ...categoriesData,
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
    res.attachment("asset_categories_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting asset categories to PDF:", error);
    res.status(500).json({
      message: "Error exporting asset categories to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createAssetCategory,
  updateAssetCategory,
  deleteAssetCategory,
  getAssetCategoryById,
  getAllAssetCategories,
  filterAssetCategories,
  exportFilteredAssetCategoriesToCSV,
  exportFilteredAssetCategoriesToPDF,
};