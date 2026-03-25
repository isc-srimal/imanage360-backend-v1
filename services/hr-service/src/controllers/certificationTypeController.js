const CertificationTypeModel = require("../models/CertificationTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createCertificationType = async (req, res) => {
  const { certificationType, status = "Active" } = req.body;

  try {
    const certification = await CertificationTypeModel.create({
      certificationType,
      status,
    });

    res
      .status(201)
      .json({ message: "Certification type created successfully", certification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCertificationType = async (req, res) => {
  const { id } = req.params;
  const { certificationType, status } = req.body;

  try {
    const certificationToUpdate = await CertificationTypeModel.findByPk(id);

    if (!certificationToUpdate) {
      return res.status(404).json({ message: "Certification type not found" });
    }

    certificationToUpdate.certificationType = certificationType || certificationToUpdate.certificationType;
    certificationToUpdate.status = status || certificationToUpdate.status;

    await certificationToUpdate.save();
    res.status(200).json({
      message: "Certification type updated successfully",
      certification: certificationToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating certification type", error: error.message });
  }
};

const deleteCertificationType = async (req, res) => {
  const { id } = req.params;

  try {
    const certificationToDelete = await CertificationTypeModel.findByPk(id);

    if (!certificationToDelete) {
      return res.status(404).json({ message: "Certification type not found" });
    }

    await certificationToDelete.destroy();
    res.status(200).json({ message: "Certification type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting certification type", error: error.message });
  }
};

const getCertificationTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const certification = await CertificationTypeModel.findByPk(id);

    if (!certification) {
      return res.status(404).json({ message: "Certification type not found" });
    }

    res.status(200).json(certification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving certification type", error: error.message });
  }
};

const getAllCertificationTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCertifications, rows: certifications } =
      await CertificationTypeModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCertifications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCertifications / limit),
      certifications,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving certification types", error: error.message });
  }
};

const filterCertificationTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalCertifications, rows: certifications } =
      await CertificationTypeModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalCertifications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCertifications / limit),
      certifications,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering certification types", error: error.message });
  }
};

const exportFilteredCertificationTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: certifications } = await CertificationTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!certifications || certifications.length === 0) {
      return res.status(404).json({
        message: "No certification types found matching the filters",
      });
    }

    const certificationsData = certifications.map((certification) => {
      return {
        certificationTypeId: certification.id,
        certificationType: certification.certificationType,
        status: certification.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(certificationsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_certification_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting certification types to CSV:", error);
    res.status(500).json({
      message: "Error exporting certification types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredCertificationTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: certifications } = await CertificationTypeModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!certifications || certifications.length === 0) {
      return res
        .status(404)
        .json({ message: "No certification types found matching the filters" });
    }

    const certificationsData = certifications.map((certification) => {
      return [
        certification.id || "N/A",
        certification.certificationType || "N/A",
        certification.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Certification Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Certification Type ID", "Certification Type", "Status"],
              ...certificationsData,
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
    res.attachment("certification_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting certification types to PDF:", error);
    res.status(500).json({
      message: "Error exporting certification types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createCertificationType,
  updateCertificationType,
  deleteCertificationType,
  getCertificationTypeById,
  getAllCertificationTypes,
  filterCertificationTypes,
  exportFilteredCertificationTypesToCSV,
  exportFilteredCertificationTypesToPDF,
};