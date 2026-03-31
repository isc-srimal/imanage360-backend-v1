const ServiceCategoryModel = require("../models/ServiceCategoryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createServiceCategory = async (req, res) => {
  const { service_category, status = "Active" } = req.body;

  try {
    const serviceCategory = await ServiceCategoryModel.create({
      service_category,
      status,
    });

    res
      .status(201)
      .json({ message: "Service category created successfully", serviceCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateServiceCategory = async (req, res) => {
  const { service_category_id } = req.params;
  const { service_category, status } = req.body;

  try {
    const serviceCategoryToUpdate = await ServiceCategoryModel.findByPk(service_category_id);

    if (!serviceCategoryToUpdate) {
      return res.status(404).json({ message: "Service category not found" });
    }

    serviceCategoryToUpdate.service_category = service_category || serviceCategoryToUpdate.service_category;
    serviceCategoryToUpdate.status = status || serviceCategoryToUpdate.status;

    await serviceCategoryToUpdate.save();
    res.status(200).json({
      message: "Service category updated successfully",
      serviceCategory: serviceCategoryToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service category", error: error.message });
  }
};

const deleteServiceCategory = async (req, res) => {
  const { service_category_id } = req.params;

  try {
    const serviceCategoryToDelete = await ServiceCategoryModel.findByPk(service_category_id);

    if (!serviceCategoryToDelete) {
      return res.status(404).json({ message: "Service category not found" });
    }

    await serviceCategoryToDelete.destroy();
    res.status(200).json({ message: "Service category deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service category", error: error.message });
  }
};

const getServiceCategoryById = async (req, res) => {
  try {
    const { service_category_id } = req.params;
    const serviceCategory = await ServiceCategoryModel.findByPk(service_category_id);

    if (!serviceCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }

    res.status(200).json(serviceCategory);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service category", error: error.message });
  }
};

const getAllServiceCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalServiceCategories, rows: serviceCategories } =
      await ServiceCategoryModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceCategories / limit),
      serviceCategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service categories", error: error.message });
  }
};

const filterServiceCategories = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalServiceCategories, rows: serviceCategories } =
      await ServiceCategoryModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceCategories,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceCategories / limit),
      serviceCategories,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering service categories", error: error.message });
  }
};

const exportFilteredServiceCategoriesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceCategories } = await ServiceCategoryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceCategories || serviceCategories.length === 0) {
      return res.status(404).json({
        message: "No service categories found matching the filters",
      });
    }

    const serviceCategoriesData = serviceCategories.map((category) => {
      return {
        serviceCategoryId: category.service_category_id,
        serviceCategoryName: category.service_category,
        status: category.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(serviceCategoriesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_service_categories.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting service categories to CSV:", error);
    res.status(500).json({
      message: "Error exporting service categories to CSV",
      error: error.message,
    });
  }
};

const exportFilteredServiceCategoriesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceCategories } = await ServiceCategoryModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceCategories || serviceCategories.length === 0) {
      return res
        .status(404)
        .json({ message: "No service categories found matching the filters" });
    }

    const serviceCategoriesData = serviceCategories.map((category) => {
      return [
        category.service_category_id || "N/A",
        category.service_category || "N/A",
        category.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Service Categories Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Service Category ID", "Service Category Name", "Status"],
              ...serviceCategoriesData,
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
    res.attachment("service_categories_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting service categories to PDF:", error);
    res.status(500).json({
      message: "Error exporting service categories to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  getServiceCategoryById,
  getAllServiceCategories,
  filterServiceCategories,
  exportFilteredServiceCategoriesToCSV,
  exportFilteredServiceCategoriesToPDF,
};