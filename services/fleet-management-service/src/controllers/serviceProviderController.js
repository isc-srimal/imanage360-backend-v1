const ServiceProviderModel = require("../models/ServiceProviderModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createServiceProvider = async (req, res) => {
  const { service_provider, status = "Active" } = req.body;

  try {
    const serviceProvider = await ServiceProviderModel.create({
      service_provider,
      status,
    });

    res
      .status(201)
      .json({ message: "Service provider created successfully", serviceProvider });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateServiceProvider = async (req, res) => {
  const { service_provider_id } = req.params;
  const { service_provider, status } = req.body;

  try {
    const serviceProviderToUpdate = await ServiceProviderModel.findByPk(service_provider_id);

    if (!serviceProviderToUpdate) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    serviceProviderToUpdate.service_provider = service_provider || serviceProviderToUpdate.service_provider;
    serviceProviderToUpdate.status = status || serviceProviderToUpdate.status;

    await serviceProviderToUpdate.save();
    res.status(200).json({
      message: "Service provider updated successfully",
      serviceProvider: serviceProviderToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service provider", error: error.message });
  }
};

const deleteServiceProvider = async (req, res) => {
  const { service_provider_id } = req.params;

  try {
    const serviceProviderToDelete = await ServiceProviderModel.findByPk(service_provider_id);

    if (!serviceProviderToDelete) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    await serviceProviderToDelete.destroy();
    res.status(200).json({ message: "Service provider deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service provider", error: error.message });
  }
};

const getServiceProviderById = async (req, res) => {
  try {
    const { service_provider_id } = req.params;
    const serviceProvider = await ServiceProviderModel.findByPk(service_provider_id);

    if (!serviceProvider) {
      return res.status(404).json({ message: "Service provider not found" });
    }

    res.status(200).json(serviceProvider);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service provider", error: error.message });
  }
};

const getAllServiceProviders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalServiceProviders, rows: serviceProviders } =
      await ServiceProviderModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceProviders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceProviders / limit),
      serviceProviders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service providers", error: error.message });
  }
};

const filterServiceProviders = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalServiceProviders, rows: serviceProviders } =
      await ServiceProviderModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceProviders,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceProviders / limit),
      serviceProviders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering service providers", error: error.message });
  }
};

const exportFilteredServiceProvidersToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceProviders } = await ServiceProviderModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceProviders || serviceProviders.length === 0) {
      return res.status(404).json({
        message: "No service providers found matching the filters",
      });
    }

    const serviceProvidersData = serviceProviders.map((provider) => {
      return {
        serviceProviderId: provider.service_provider_id,
        serviceProviderName: provider.service_provider,
        status: provider.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(serviceProvidersData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_service_providers.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting service providers to CSV:", error);
    res.status(500).json({
      message: "Error exporting service providers to CSV",
      error: error.message,
    });
  }
};

const exportFilteredServiceProvidersToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceProviders } = await ServiceProviderModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceProviders || serviceProviders.length === 0) {
      return res
        .status(404)
        .json({ message: "No service providers found matching the filters" });
    }

    const serviceProvidersData = serviceProviders.map((provider) => {
      return [
        provider.service_provider_id || "N/A",
        provider.service_provider || "N/A",
        provider.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Service Providers Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Service Provider ID", "Service Provider Name", "Status"],
              ...serviceProvidersData,
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
    res.attachment("service_providers_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting service providers to PDF:", error);
    res.status(500).json({
      message: "Error exporting service providers to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createServiceProvider,
  updateServiceProvider,
  deleteServiceProvider,
  getServiceProviderById,
  getAllServiceProviders,
  filterServiceProviders,
  exportFilteredServiceProvidersToCSV,
  exportFilteredServiceProvidersToPDF,
};