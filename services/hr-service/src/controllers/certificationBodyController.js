const CertificationBodyModel = require("../models/CertificationBodyModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createCertificationBody = async (req, res) => {
  const { certificationBody, status = "Active" } = req.body;

  try {
    const certification = await CertificationBodyModel.create({
      certificationBody,
      status,
    });

    res
      .status(201)
      .json({ message: "Certification body created successfully", certification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCertificationBody = async (req, res) => {
  const { id } = req.params;
  const { certificationBody, status } = req.body;

  try {
    const certificationToUpdate = await CertificationBodyModel.findByPk(id);

    if (!certificationToUpdate) {
      return res.status(404).json({ message: "Certification body not found" });
    }

    certificationToUpdate.certificationBody = certificationBody || certificationToUpdate.certificationBody;
    certificationToUpdate.status = status || certificationToUpdate.status;

    await certificationToUpdate.save();
    res.status(200).json({
      message: "Certification body updated successfully",
      certification: certificationToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating certification body", error: error.message });
  }
};

const deleteCertificationBody = async (req, res) => {
  const { id } = req.params;

  try {
    const certificationToDelete = await CertificationBodyModel.findByPk(id);

    if (!certificationToDelete) {
      return res.status(404).json({ message: "Certification body not found" });
    }

    await certificationToDelete.destroy();
    res.status(200).json({ message: "Certification body deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting certification body", error: error.message });
  }
};

const getCertificationBodyById = async (req, res) => {
  try {
    const { id } = req.params;
    const certification = await CertificationBodyModel.findByPk(id);

    if (!certification) {
      return res.status(404).json({ message: "Certification body not found" });
    }

    res.status(200).json(certification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving certification body", error: error.message });
  }
};

const getAllCertificationBodies = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCertifications, rows: certifications } =
      await CertificationBodyModel.findAndCountAll({
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
      .json({ message: "Error retrieving certification bodies", error: error.message });
  }
};

const filterCertificationBodies = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalCertifications, rows: certifications } =
      await CertificationBodyModel.findAndCountAll({
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
      .json({ message: "Error filtering certification bodies", error: error.message });
  }
};

const exportFilteredCertificationBodiesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: certifications } = await CertificationBodyModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!certifications || certifications.length === 0) {
      return res.status(404).json({
        message: "No certification bodies found matching the filters",
      });
    }

    const certificationsData = certifications.map((certification) => {
      return {
        certificationBodyId: certification.id,
        certificationBody: certification.certificationBody,
        status: certification.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(certificationsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_certification_bodies.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting certification bodies to CSV:", error);
    res.status(500).json({
      message: "Error exporting certification bodies to CSV",
      error: error.message,
    });
  }
};

const exportFilteredCertificationBodiesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: certifications } = await CertificationBodyModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!certifications || certifications.length === 0) {
      return res
        .status(404)
        .json({ message: "No certification bodies found matching the filters" });
    }

    const certificationsData = certifications.map((certification) => {
      return [
        certification.id || "N/A",
        certification.certificationBody || "N/A",
        certification.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Certification Bodies Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Certification Body ID", "Certification Body", "Status"],
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
    res.attachment("certification_bodies_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting certification bodies to PDF:", error);
    res.status(500).json({
      message: "Error exporting certification bodies to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createCertificationBody,
  updateCertificationBody,
  deleteCertificationBody,
  getCertificationBodyById,
  getAllCertificationBodies,
  filterCertificationBodies,
  exportFilteredCertificationBodiesToCSV,
  exportFilteredCertificationBodiesToPDF,
};