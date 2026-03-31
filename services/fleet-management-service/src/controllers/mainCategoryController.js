const MainCategoryModel = require("../models/MainCategoryModel");
const ServiceProviderModel = require("../models/ServiceProviderModel");
const ServicesModel = require("../models/ServicesModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createMainCategory = async (req, res) => {
  const { service_provider_id, reported_by, main_category, service_id, status = "Active" } = req.body;

  try {
    const mainCategory = await MainCategoryModel.create({
      service_provider_id,
      reported_by,
      main_category,
      service_id,
      status,
    });

    res
      .status(201)
      .json({ message: "Main category created successfully", mainCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMainCategory = async (req, res) => {
  const { main_category_id } = req.params;
  const { service_provider_id, reported_by, main_category, service_id, status } = req.body;

  try {
    const mainCategoryToUpdate = await MainCategoryModel.findByPk(main_category_id);

    if (!mainCategoryToUpdate) {
      return res.status(404).json({ message: "Main category not found" });
    }

    mainCategoryToUpdate.service_provider_id = service_provider_id || mainCategoryToUpdate.service_provider_id;
    mainCategoryToUpdate.reported_by = reported_by || mainCategoryToUpdate.reported_by;
    mainCategoryToUpdate.main_category = main_category || mainCategoryToUpdate.main_category;
    mainCategoryToUpdate.service_id = service_id || mainCategoryToUpdate.service_id;
    mainCategoryToUpdate.status = status || mainCategoryToUpdate.status;

    await mainCategoryToUpdate.save();
    res.status(200).json({
      message: "Main category updated successfully",
      mainCategory: mainCategoryToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating main category", error: error.message });
  }
};

const deleteMainCategory = async (req, res) => {
  const { main_category_id } = req.params;

  try {
    const mainCategoryToDelete = await MainCategoryModel.findByPk(main_category_id);

    if (!mainCategoryToDelete) {
      return res.status(404).json({ message: "Main category not found" });
    }

    await mainCategoryToDelete.destroy();
    res.status(200).json({ message: "Main category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting main category", error: error.message });
  }
};

const getMainCategoryById = async (req, res) => {
  try {
    const { main_category_id } = req.params;
    const mainCategory = await MainCategoryModel.findByPk(main_category_id, {
      include: [
        { model: ServiceProviderModel, as: 'service_provider' },
        { model: ServicesModel, as: 'services' }
      ]
    });

    if (!mainCategory) {
      return res.status(404).json({ message: "Main category not found" });
    }

    res.status(200).json(mainCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving main category", error: error.message });
  }
};

const getAllMainCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalMainCategories, rows: mainCategories } =
      await MainCategoryModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          { model: ServiceProviderModel, as: 'service_provider' },
          { model: ServicesModel, as: 'services' }
        ]
      });

    res.status(200).json({
      totalMainCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMainCategories / limit),
      mainCategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving main categories", error: error.message });
  }
};

const filterMainCategories = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalMainCategories, rows: mainCategories } =
      await MainCategoryModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: ServiceProviderModel, as: 'service_provider' },
          { model: ServicesModel, as: 'services' }
        ]
      });

    res.status(200).json({
      totalMainCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalMainCategories / limit),
      mainCategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering main categories", error: error.message });
  }
};

const exportFilteredMainCategoriesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: mainCategories } = await MainCategoryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: ServiceProviderModel, as: 'service_provider' },
        { model: ServicesModel, as: 'services' }
      ]
    });

    if (!mainCategories || mainCategories.length === 0) {
      return res.status(404).json({
        message: "No main categories found matching the filters",
      });
    }

    const mainCategoriesData = mainCategories.map((category) => {
      return {
        mainCategoryId: category.main_category_id,
        serviceProviderId: category.service_provider_id,
        reportedBy: category.reported_by,
        mainCategory: category.main_category,
        serviceId: category.service_id,
        status: category.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(mainCategoriesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_main_categories.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting main categories to CSV:", error);
    res.status(500).json({
      message: "Error exporting main categories to CSV",
      error: error.message,
    });
  }
};

const exportFilteredMainCategoriesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: mainCategories } = await MainCategoryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: ServiceProviderModel, as: 'service_provider' },
        { model: ServicesModel, as: 'services' }
      ]
    });

    if (!mainCategories || mainCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No main categories found matching the filters" });
    }

    const mainCategoriesData = mainCategories.map((category) => {
      return [
        category.main_category_id || "N/A",
        category.service_provider_id || "N/A",
        category.reported_by || "N/A",
        category.main_category || "N/A",
        category.service_id || "N/A",
        category.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Main Categories Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [80, 80, 80, "*", 80, 80],
            body: [
              ["ID", "Service Provider ID", "Reported By", "Main Category", "Service ID", "Status"],
              ...mainCategoriesData,
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
    res.attachment("main_categories_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting main categories to PDF:", error);
    res.status(500).json({
      message: "Error exporting main categories to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createMainCategory,
  updateMainCategory,
  deleteMainCategory,
  getMainCategoryById,
  getAllMainCategories,
  filterMainCategories,
  exportFilteredMainCategoriesToCSV,
  exportFilteredMainCategoriesToPDF,
};