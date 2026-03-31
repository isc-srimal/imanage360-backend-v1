const ServiceTypeOneModel = require("../models/ServiceTypeOneModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createServiceTypeOne = async (req, res) => {
  const { service_type_one, status = "Active" } = req.body;

  try {
    const serviceTypeOne = await ServiceTypeOneModel.create({
      service_type_one,
      status,
    });

    res
      .status(201)
      .json({ message: "Service type one created successfully", serviceTypeOne });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateServiceTypeOne = async (req, res) => {
  const { service_type_one_id } = req.params;
  const { service_type_one, status } = req.body;

  try {
    const serviceTypeOneToUpdate = await ServiceTypeOneModel.findByPk(service_type_one_id);

    if (!serviceTypeOneToUpdate) {
      return res.status(404).json({ message: "Service type one not found" });
    }

    serviceTypeOneToUpdate.service_type_one = service_type_one || serviceTypeOneToUpdate.service_type_one;
    serviceTypeOneToUpdate.status = status || serviceTypeOneToUpdate.status;

    await serviceTypeOneToUpdate.save();
    res.status(200).json({
      message: "Service type one updated successfully",
      serviceTypeOne: serviceTypeOneToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service type one", error: error.message });
  }
};

const deleteServiceTypeOne = async (req, res) => {
  const { service_type_one_id } = req.params;

  try {
    const serviceTypeOneToDelete = await ServiceTypeOneModel.findByPk(service_type_one_id);

    if (!serviceTypeOneToDelete) {
      return res.status(404).json({ message: "Service type one not found" });
    }

    await serviceTypeOneToDelete.destroy();
    res.status(200).json({ message: "Service type one deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service type one", error: error.message });
  }
};

const getServiceTypeOneById = async (req, res) => {
  try {
    const { service_type_one_id } = req.params;
    const serviceTypeOne = await ServiceTypeOneModel.findByPk(service_type_one_id);

    if (!serviceTypeOne) {
      return res.status(404).json({ message: "Service type one not found" });
    }

    res.status(200).json(serviceTypeOne);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service type one", error: error.message });
  }
};

const getAllServiceTypeOnes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalServiceTypeOnes, rows: serviceTypeOnes } =
      await ServiceTypeOneModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceTypeOnes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceTypeOnes / limit),
      serviceTypeOnes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving service type ones", error: error.message });
  }
};

const filterServiceTypeOnes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalServiceTypeOnes, rows: serviceTypeOnes } =
      await ServiceTypeOneModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalServiceTypeOnes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceTypeOnes / limit),
      serviceTypeOnes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering service type ones", error: error.message });
  }
};

const exportFilteredServiceTypeOnesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceTypeOnes } = await ServiceTypeOneModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceTypeOnes || serviceTypeOnes.length === 0) {
      return res.status(404).json({
        message: "No service type ones found matching the filters",
      });
    }

    const serviceTypeOnesData = serviceTypeOnes.map((service) => {
      return {
        serviceTypeOneId: service.service_type_one_id,
        serviceTypeOne: service.service_type_one,
        status: service.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(serviceTypeOnesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_service_type_ones.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting service type ones to CSV:", error);
    res.status(500).json({
      message: "Error exporting service type ones to CSV",
      error: error.message,
    });
  }
};

const exportFilteredServiceTypeOnesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceTypeOnes } = await ServiceTypeOneModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!serviceTypeOnes || serviceTypeOnes.length === 0) {
      return res
        .status(404)
        .json({ message: "No service type ones found matching the filters" });
    }

    const serviceTypeOnesData = serviceTypeOnes.map((service) => {
      return [
        service.service_type_one_id || "N/A",
        service.service_type_one || "N/A",
        service.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Service Type Ones Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Service Type One ID", "Service Type One", "Status"],
              ...serviceTypeOnesData,
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
    res.attachment("service_type_ones_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting service type ones to PDF:", error);
    res.status(500).json({
      message: "Error exporting service type ones to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createServiceTypeOne,
  updateServiceTypeOne,
  deleteServiceTypeOne,
  getServiceTypeOneById,
  getAllServiceTypeOnes,
  filterServiceTypeOnes,
  exportFilteredServiceTypeOnesToCSV,
  exportFilteredServiceTypeOnesToPDF,
};