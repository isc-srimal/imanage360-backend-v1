const AssetCapacityModel = require("../models/AssetCapacityModel");
const AssetCategoryModel = require("../models/AssetCategoryModel");
const AssetSubcategoryModel = require("../models/AssetSubcategoryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createAssetCapacity = async (req, res) => {
  const { capacity_value, category_id, subcategory_id, status = "Active" } = req.body;

  try {
    const category = await AssetCategoryModel.findByPk(category_id);
    if (!category) {
      return res.status(404).json({ message: "Asset category not found" });
    }

    const subcategory = await AssetSubcategoryModel.findByPk(subcategory_id);
    if (!subcategory) {
      return res.status(404).json({ message: "Asset subcategory not found" });
    }

    const capacity = await AssetCapacityModel.create({
      capacity_value,
      category_id,
      subcategory_id,
      status,
    });

    res
      .status(201)
      .json({ message: "Asset capacity created successfully", capacity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAssetCapacity = async (req, res) => {
  const { capacity_id } = req.params;
  const { capacity_value, category_id, subcategory_id, status } = req.body;

  try {
    const capacityToUpdate = await AssetCapacityModel.findByPk(capacity_id);

    if (!capacityToUpdate) {
      return res.status(404).json({ message: "Asset capacity not found" });
    }

    if (category_id) {
      const category = await AssetCategoryModel.findByPk(category_id);
      if (!category) {
        return res.status(404).json({ message: "Asset category not found" });
      }
    }

    if (subcategory_id) {
      const subcategory = await AssetSubcategoryModel.findByPk(subcategory_id);
      if (!subcategory) {
        return res.status(404).json({ message: "Asset subcategory not found" });
      }
    }

    capacityToUpdate.capacity_value = capacity_value || capacityToUpdate.capacity_value;
    capacityToUpdate.category_id = category_id || capacityToUpdate.category_id;
    capacityToUpdate.subcategory_id = subcategory_id || capacityToUpdate.subcategory_id;
    capacityToUpdate.status = status || capacityToUpdate.status;

    await capacityToUpdate.save();
    res.status(200).json({
      message: "Asset capacity updated successfully",
      capacity: capacityToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating asset capacity", error: error.message });
  }
};

const deleteAssetCapacity = async (req, res) => {
  const { capacity_id } = req.params;

  try {
    const capacityToDelete = await AssetCapacityModel.findByPk(capacity_id);

    if (!capacityToDelete) {
      return res.status(404).json({ message: "Asset capacity not found" });
    }

    await capacityToDelete.destroy();
    res.status(200).json({ message: "Asset capacity deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting asset capacity", error: error.message });
  }
};

const getAssetCapacityById = async (req, res) => {
  try {
    const { capacity_id } = req.params;
    const capacity = await AssetCapacityModel.findByPk(capacity_id, {
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
      ],
    });

    if (!capacity) {
      return res.status(404).json({ message: "Asset capacity not found" });
    }

    res.status(200).json(capacity);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset capacity", error: error.message });
  }
};

const getAllAssetCapacities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCapacities, rows: capacities } =
      await AssetCapacityModel.findAndCountAll({
        include: [
          { model: AssetCategoryModel, as: "category" },
          { model: AssetSubcategoryModel, as: "subcategory" },
        ],
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCapacities,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCapacities / limit),
      capacities,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving asset capacities", error: error.message });
  }
};

const filterAssetCapacities = async (req, res) => {
  try {
    const { status = "All", category_id, subcategory_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }
    if (category_id) {
      where["category_id"] = category_id;
    }
    if (subcategory_id) {
      where["subcategory_id"] = subcategory_id;
    }

    const { count: totalCapacities, rows: capacities } =
      await AssetCapacityModel.findAndCountAll({
        where,
        include: [
          { model: AssetCategoryModel, as: "category" },
          { model: AssetSubcategoryModel, as: "subcategory" },
        ],
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCapacities,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCapacities / limit),
      capacities,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering asset capacities", error: error.message });
  }
};

const exportFilteredAssetCapacitiesToCSV = async (req, res) => {
  try {
    const { status = "All", category_id, subcategory_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }
    if (category_id) {
      where["category_id"] = category_id;
    }
    if (subcategory_id) {
      where["subcategory_id"] = subcategory_id;
    }

    const { rows: capacities } = await AssetCapacityModel.findAndCountAll({
      where,
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
      ],
      offset,
      limit: parseInt(limit),
    });

    if (!capacities || capacities.length === 0) {
      return res.status(404).json({
        message: "No asset capacities found matching the filters",
      });
    }

    const capacitiesData = capacities.map((capacity) => {
      return {
        capacity_id: capacity.capacity_id,
        capacity_value: capacity.capacity_value,
        category_name: capacity.category ? capacity.category.category_name : "N/A",
        subcategory_name: capacity.subcategory ? capacity.subcategory.subcategory_name : "N/A",
        status: capacity.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(capacitiesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_asset_capacities.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting asset capacities to CSV:", error);
    res.status(500).json({
      message: "Error exporting asset capacities to CSV",
      error: error.message,
    });
  }
};

const exportFilteredAssetCapacitiesToPDF = async (req, res) => {
  try {
    const { status = "All", category_id, subcategory_id, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }
    if (category_id) {
      where["category_id"] = category_id;
    }
    if (subcategory_id) {
      where["subcategory_id"] = subcategory_id;
    }

    const { rows: capacities } = await AssetCapacityModel.findAndCountAll({
      where,
      include: [
        { model: AssetCategoryModel, as: "category" },
        { model: AssetSubcategoryModel, as: "subcategory" },
      ],
      offset,
      limit: parseInt(limit),
    });

    if (!capacities || capacities.length === 0) {
      return res
        .status(404)
        .json({ message: "No asset capacities found matching the filters" });
    }

    const capacitiesData = capacities.map((capacity) => {
      return [
        capacity.capacity_id || "N/A",
        capacity.capacity_value || "N/A",
        capacity.category ? capacity.category.category_name : "N/A",
        capacity.subcategory ? capacity.subcategory.subcategory_name : "N/A",
        capacity.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Asset Capacities Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*"],
            body: [
              ["Capacity ID", "Capacity Value", "Category Name", "Subcategory Name", "Status"],
              ...capacitiesData,
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
    res.attachment("asset_capacities_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting asset capacities to PDF:", error);
    res.status(500).json({
      message: "Error exporting asset capacities to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createAssetCapacity,
  updateAssetCapacity,
  deleteAssetCapacity,
  getAssetCapacityById,
  getAllAssetCapacities,
  filterAssetCapacities,
  exportFilteredAssetCapacitiesToCSV,
  exportFilteredAssetCapacitiesToPDF,
};