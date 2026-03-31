const ServicesModel = require("../models/ServicesModel");
const ServiceCategoryModel = require("../models/ServiceCategoryModel");
const ServiceTypeOneModel = require("../models/ServiceTypeOneModel");
const ServiceTypeTwoModel = require("../models/ServiceTypeTwoModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createService = async (req, res) => {
  const { service_category_id, description, service_type_one_id, service_type_two_id, engine_hours, status = "Active" } = req.body;

  try {
    const service = await ServicesModel.create({
      service_category_id,
      description,
      service_type_one_id,
      service_type_two_id,
      engine_hours,
      status,
    });

    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateService = async (req, res) => {
  const { service_id } = req.params;
  const { service_category_id, description, service_type_one_id, service_type_two_id, engine_hours, status } = req.body;

  try {
    const serviceToUpdate = await ServicesModel.findByPk(service_id);

    if (!serviceToUpdate) {
      return res.status(404).json({ message: "Service not found" });
    }

    serviceToUpdate.service_category_id = service_category_id || serviceToUpdate.service_category_id;
    serviceToUpdate.description = description || serviceToUpdate.description;
    serviceToUpdate.service_type_one_id = service_type_one_id || serviceToUpdate.service_type_one_id;
    serviceToUpdate.service_type_two_id = service_type_two_id || serviceToUpdate.service_type_two_id;
    serviceToUpdate.engine_hours = engine_hours || serviceToUpdate.engine_hours;
    serviceToUpdate.status = status || serviceToUpdate.status;

    await serviceToUpdate.save();
    res.status(200).json({
      message: "Service updated successfully",
      service: serviceToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
};

const deleteService = async (req, res) => {
  const { service_id } = req.params;

  try {
    const serviceToDelete = await ServicesModel.findByPk(service_id);

    if (!serviceToDelete) {
      return res.status(404).json({ message: "Service not found" });
    }

    await serviceToDelete.destroy();
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { service_id } = req.params;
    const service = await ServicesModel.findByPk(service_id, {
      include: [
        { model: ServiceCategoryModel, as: 'service_category' },
        { model: ServiceTypeOneModel, as: 'service_type_one' },
        { model: ServiceTypeTwoModel, as: 'service_type_two' }
      ]
    });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving service", error: error.message });
  }
};

const getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalServices, rows: services } = await ServicesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: ServiceCategoryModel, as: 'service_category' },
        { model: ServiceTypeOneModel, as: 'service_type_one' },
        { model: ServiceTypeTwoModel, as: 'service_type_two' }
      ]
    });

    res.status(200).json({
      totalServices,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServices / limit),
      services,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving services", error: error.message });
  }
};

const filterServices = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalServices, rows: services } = await ServicesModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: ServiceCategoryModel, as: 'service_category' },
        { model: ServiceTypeOneModel, as: 'service_type_one' },
        { model: ServiceTypeTwoModel, as: 'service_type_two' }
      ]
    });

    res.status(200).json({
      totalServices,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServices / limit),
      services,
    });
  } catch (error) {
    res.status(500).json({ message: "Error filtering services", error: error.message });
  }
};

const exportFilteredServicesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: services } = await ServicesModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: ServiceCategoryModel, as: 'service_category' },
        { model: ServiceTypeOneModel, as: 'service_type_one' },
        { model: ServiceTypeTwoModel, as: 'service_type_two' }
      ]
    });

    if (!services || services.length === 0) {
      return res.status(404).json({
        message: "No services found matching the filters",
      });
    }

    const servicesData = services.map((service) => {
      return {
        serviceId: service.service_id,
        serviceCategoryId: service.service_category_id,
        description: service.description,
        serviceTypeOneId: service.service_type_one_id,
        serviceTypeTwoId: service.service_type_two_id,
        engineHours: service.engine_hours,
        status: service.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(servicesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_services.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting services to CSV:", error);
    res.status(500).json({
      message: "Error exporting services to CSV",
      error: error.message,
    });
  }
};

const exportFilteredServicesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: services } = await ServicesModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: ServiceCategoryModel, as: 'service_category' },
        { model: ServiceTypeOneModel, as: 'service_type_one' },
        { model: ServiceTypeTwoModel, as: 'service_type_two' }
      ]
    });

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found matching the filters" });
    }

    const servicesData = services.map((service) => {
      return [
        service.service_id || "N/A",
        service.service_category_id || "N/A",
        service.description || "N/A",
        service.service_type_one_id || "N/A",
        service.service_type_two_id || "N/A",
        service.engine_hours || "N/A",
        service.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Services Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [50, 80, "*", 80, 80, 80, 80],
            body: [
              ["ID", "Category ID", "Description", "Type One ID", "Type Two ID", "Engine Hours", "Status"],
              ...servicesData,
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
    res.attachment("services_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting services to PDF:", error);
    res.status(500).json({
      message: "Error exporting services to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createService,
  updateService,
  deleteService,
  getServiceById,
  getAllServices,
  filterServices,
  exportFilteredServicesToCSV,
  exportFilteredServicesToPDF,
};