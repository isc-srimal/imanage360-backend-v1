const AssetSubcategoryModel = require("../models/AssetSubcategoryModel");
const AssetCategoryModel = require("../models/AssetCategoryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createAssetSubcategory = async (req, res) => {
  const { subcategory_name, category_id, status = "Active" } = req.body;

  try {
    // Validate category_id exists
    const category = await AssetCategoryModel.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ message: "Asset category not found" });
    }

    const subcategory = await AssetSubcategoryModel.create({
      subcategory_name,
      category_id,
      status,
    });

    res
      .status(201)
      .json({ message: "Asset subcategory created successfully", subcategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAssetSubcategory = async (req, res) => {
  const { subcategory_id } = req.params;
  const { subcategory_name, category_id, status } = req.body;

  try {
    const subcategoryToUpdate = await AssetSubcategoryModel.findByPk(subcategory_id);

    if (!subcategoryToUpdate) {
      return res.status(404).json({ message: "Asset subcategory not found" });
    }

    // Validate category_id if provided
    if (category_id) {
      const category = await AssetCategoryModel.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ message: "Asset category not found" });
      }
    }

    subcategoryToUpdate.subcategory_name = subcategory_name || subcategoryToUpdate.subcategory_name;
    subcategoryToUpdate.category_id = category_id || subcategoryToUpdate.category_id;
    subcategoryToUpdate.status = status || subcategoryToUpdate.status;

    await subcategoryToUpdate.save();
    res.status(200).json({
      message: "Asset subcategory updated successfully",
      subcategory: subcategoryToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating asset subcategory", error: error.message });
  }
};

const deleteAssetSubcategory = async (req, res) => {
  const { subcategory_id } = req.params;

  try {
    const subcategoryToDelete = await AssetSubcategoryModel.findByPk(subcategory_id);

    if (!subcategoryToDelete) {
      return res.status(404).json({ message: "Asset subcategory not found" });
    }

    await subcategoryToDelete.destroy();
    res.status(200).json({ message: "Asset subcategory deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting asset subcategory", error: error.message });
  }
};

const getAssetSubcategoryById = async (req, res) => {
  try {
    const { subcategory_id } = req.params;
    const subcategory = await AssetSubcategoryModel.findByPk(subcategory_id, {
      include: [{ model: AssetCategoryModel, as: "category" }],
    });

    if (!subcategory) {
      return res.status(404).json({ message: "Asset subcategory not found" });
    }

    res.status(200).json(subcategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset subcategory", error: error.message });
  }
};

const getAllAssetSubcategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSubcategories, rows: subcategories } =
      await AssetSubcategoryModel.findAndCountAll({
        include: [{ model: AssetCategoryModel, as: "category" }],
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalSubcategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubcategories / limit),
      subcategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset subcategories", error: error.message });
  }
};

const filterAssetSubcategories = async (req, res) => {
  try {
    const { status = "All", category_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }
    if (category_id) {
      where["category_id"] = category_id;
    }

    const { count: totalSubcategories, rows: subcategories } =
      await AssetSubcategoryModel.findAndCountAll({
        where,
        include: [{ model: AssetCategoryModel, as: "category" }],
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalSubcategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSubcategories / limit),
      subcategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering asset subcategories", error: error.message });
  }
};

const exportFilteredAssetSubcategoriesToCSV = async (req, res) => {
  try {
    const { status = "All", category_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }
    if (category_id) {
      where["category_id"] = category_id;
    }

    const { rows: subcategories } = await AssetSubcategoryModel.findAndCountAll({
      where,
      include: [{ model: AssetCategoryModel, as: "category" }],
      offset,
      limit: parseInt(limit),
    });

    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({
        message: "No asset subcategories found matching the filters",
      });
    }

    const subcategoriesData = subcategories.map((subcategory) => {
      return {
        subcategory_id: subcategory.subcategory_id,
        subcategory_name: subcategory.subcategory_name,
        category_name: subcategory.category ? subcategory.category.category_name : "N/A",
        status: subcategory.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(subcategoriesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_asset_subcategories.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting asset subcategories to CSV:", error);
    res.status(500).json({
      message: "Error exporting asset subcategories to CSV",
      error: error.message,
    });
  }
};

const exportFilteredAssetSubcategoriesToPDF = async (req, res) => {
  try {
    const { status = "All", category_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }
    if (category_id) {
      where["category_id"] = category_id;
    }

    const { rows: subcategories } = await AssetSubcategoryModel.findAndCountAll({
      where,
      include: [{ model: AssetCategoryModel, as: "category" }],
      offset,
      limit: parseInt(limit),
    });

    if (!subcategories || subcategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No asset subcategories found matching the filters" });
    }

    const subcategoriesData = subcategories.map((subcategory) => {
      return [
        subcategory.subcategory_id || "N/A",
        subcategory.subcategory_name || "N/A",
        subcategory.category ? subcategory.category.category_name : "N/A",
        subcategory.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Asset Subcategories Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*"],
            body: [
              ["Subcategory ID", "Subcategory Name", "Category Name", "Status"],
              ...subcategoriesData,
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
    res.attachment("asset_subcategories_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting asset subcategories to PDF:", error);
    res.status(500).json({
      message: "Error exporting asset subcategories to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createAssetSubcategory,
  updateAssetSubcategory,
  deleteAssetSubcategory,
  getAssetSubcategoryById,
  getAllAssetSubcategories,
  filterAssetSubcategories,
  exportFilteredAssetSubcategoriesToCSV,
  exportFilteredAssetSubcategoriesToPDF,
};