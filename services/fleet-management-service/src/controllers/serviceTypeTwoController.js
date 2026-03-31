const ServiceTypeTwoModel = require("../models/ServiceTypeTwoModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const ServiceTypeOneModel = require("../models/ServiceTypeOneModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createServiceTypeTwo = async (req, res) => {
  const { service_type_one_id, service_type_two, status = "Active" } = req.body;

  try {
    const serviceTypeTwo = await ServiceTypeTwoModel.create({
      service_type_one_id,
      service_type_two,
      status,
    });

    res.status(201).json({
      message: "Service type two created successfully",
      serviceTypeTwo,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateServiceTypeTwo = async (req, res) => {
  const { service_type_two_id } = req.params;
  const { service_type_one_id, service_type_two, status } = req.body;

  try {
    const serviceTypeTwoToUpdate = await ServiceTypeTwoModel.findByPk(
      service_type_two_id
    );

    if (!serviceTypeTwoToUpdate) {
      return res.status(404).json({ message: "Service type two not found" });
    }

    serviceTypeTwoToUpdate.service_type_one_id =
      service_type_one_id || serviceTypeTwoToUpdate.service_type_one_id;
    serviceTypeTwoToUpdate.service_type_two =
      service_type_two || serviceTypeTwoToUpdate.service_type_two;
    serviceTypeTwoToUpdate.status = status || serviceTypeTwoToUpdate.status;

    await serviceTypeTwoToUpdate.save();
    res.status(200).json({
      message: "Service type two updated successfully",
      serviceTypeTwo: serviceTypeTwoToUpdate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating service type two",
      error: error.message,
    });
  }
};

const deleteServiceTypeTwo = async (req, res) => {
  const { service_type_two_id } = req.params;

  try {
    const serviceTypeTwoToDelete = await ServiceTypeTwoModel.findByPk(
      service_type_two_id
    );

    if (!serviceTypeTwoToDelete) {
      return res.status(404).json({ message: "Service type two not found" });
    }

    await serviceTypeTwoToDelete.destroy();
    res.status(200).json({ message: "Service type two deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting service type two",
      error: error.message,
    });
  }
};

const getServiceTypeTwoById = async (req, res) => {
  try {
    const { service_type_two_id } = req.params;
    const serviceTypeTwo = await ServiceTypeTwoModel.findByPk(
      service_type_two_id,
      {
        include: [{ model: ServiceTypeOneModel, as: "service_type_one" }],
      }
    );

    if (!serviceTypeTwo) {
      return res.status(404).json({ message: "Service type two not found" });
    }

    res.status(200).json(serviceTypeTwo);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving service type two",
      error: error.message,
    });
  }
};

const getAllServiceTypeTwos = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalServiceTypeTwos, rows: serviceTypeTwos } =
      await ServiceTypeTwoModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [{ model: ServiceTypeOneModel, as: "service_type_one" }],
      });

    res.status(200).json({
      totalServiceTypeTwos,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceTypeTwos / limit),
      serviceTypeTwos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving service type twos",
      error: error.message,
    });
  }
};

const filterServiceTypeTwos = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalServiceTypeTwos, rows: serviceTypeTwos } =
      await ServiceTypeTwoModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [{ model: ServiceTypeOneModel, as: "service_type_one" }],
      });

    res.status(200).json({
      totalServiceTypeTwos,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalServiceTypeTwos / limit),
      serviceTypeTwos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error filtering service type twos",
      error: error.message,
    });
  }
};

const exportFilteredServiceTypeTwosToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceTypeTwos } = await ServiceTypeTwoModel.findAndCountAll(
      {
        where,
        offset,
        limit: parseInt(limit),
        include: [{ model: ServiceTypeOneModel, as: "service_type_one" }],
      }
    );

    if (!serviceTypeTwos || serviceTypeTwos.length === 0) {
      return res.status(404).json({
        message: "No service type twos found matching the filters",
      });
    }

    const serviceTypeTwosData = serviceTypeTwos.map((service) => {
      return {
        serviceTypeOneName: service.service_type_one.service_type_one,
        serviceTypeTwoId: service.service_type_two_id,
        serviceTypeTwoName: service.service_type_two,
        status: service.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(serviceTypeTwosData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_service_type_twos.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting service type twos to CSV:", error);
    res.status(500).json({
      message: "Error exporting service type twos to CSV",
      error: error.message,
    });
  }
};

const exportFilteredServiceTypeTwosToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: serviceTypeTwos } = await ServiceTypeTwoModel.findAndCountAll(
      {
        where,
        offset,
        limit: parseInt(limit),
        include: [{ model: ServiceTypeOneModel, as: "service_type_one" }],
      }
    );

    if (!serviceTypeTwos || serviceTypeTwos.length === 0) {
      return res
        .status(404)
        .json({ message: "No service type twos found matching the filters" });
    }

    const serviceTypeTwosData = serviceTypeTwos.map((service) => {
      return [
        service.service_type_one.service_type_one || "N/A",
        service.service_type_two_id || "N/A",
        service.service_type_two || "N/A",
        service.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Service Type Twos Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*"],
            body: [
              ["Service Type One Name", "Service Type Two ID", "Service Type Two Name", "Status"],
              ...serviceTypeTwosData,
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
    res.attachment("service_type_twos_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting service type twos to PDF:", error);
    res.status(500).json({
      message: "Error exporting service type twos to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createServiceTypeTwo,
  updateServiceTypeTwo,
  deleteServiceTypeTwo,
  getServiceTypeTwoById,
  getAllServiceTypeTwos,
  filterServiceTypeTwos,
  exportFilteredServiceTypeTwosToCSV,
  exportFilteredServiceTypeTwosToPDF,
};
