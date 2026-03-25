const CertificationNameModel = require("../models/CertificationNameModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createCertificationName = async (req, res) => {
  const { certificationName, status = "Active" } = req.body;

  try {
    const certification = await CertificationNameModel.create({
      certificationName,
      status,
    });

    res
      .status(201)
      .json({ message: "Certification name created successfully", certification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCertificationName = async (req, res) => {
  const { id } = req.params;
  const { certificationName, status } = req.body;

  try {
    const certificationToUpdate = await CertificationNameModel.findByPk(id);

    if (!certificationToUpdate) {
      return res.status(404).json({ message: "Certification name not found" });
    }

    certificationToUpdate.certificationName = certificationName || certificationToUpdate.certificationName;
    certificationToUpdate.status = status || certificationToUpdate.status;

    await certificationToUpdate.save();
    res.status(200).json({
      message: "Certification name updated successfully",
      certification: certificationToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating certification name", error: error.message });
  }
};

const deleteCertificationName = async (req, res) => {
  const { id } = req.params;

  try {
    const certificationToDelete = await CertificationNameModel.findByPk(id);

    if (!certificationToDelete) {
      return res.status(404).json({ message: "Certification name not found" });
    }

    await certificationToDelete.destroy();
    res.status(200).json({ message: "Certification name deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting certification name", error: error.message });
  }
};

const getCertificationNameById = async (req, res) => {
  try {
    const { id } = req.params;
    const certification = await CertificationNameModel.findByPk(id);

    if (!certification) {
      return res.status(404).json({ message: "Certification name not found" });
    }

    res.status(200).json(certification);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving certification name", error: error.message });
  }
};

const getAllCertificationNames = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalCertifications, rows: certifications } =
      await CertificationNameModel.findAndCountAll({
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
      .json({ message: "Error retrieving certification names", error: error.message });
  }
};

const filterCertificationNames = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalCertifications, rows: certifications } =
      await CertificationNameModel.findAndCountAll({
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
      .json({ message: "Error filtering certification names", error: error.message });
  }
};

const exportFilteredCertificationNamesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: certifications } = await CertificationNameModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!certifications || certifications.length === 0) {
      return res.status(404).json({
        message: "No certification names found matching the filters",
      });
    }

    const certificationsData = certifications.map((certification) => {
      return {
        certificationNameId: certification.id,
        certificationName: certification.certificationName,
        status: certification.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(certificationsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_certification_names.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting certification names to CSV:", error);
    res.status(500).json({
      message: "Error exporting certification names to CSV",
      error: error.message,
    });
  }
};

const exportFilteredCertificationNamesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: certifications } = await CertificationNameModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!certifications || certifications.length === 0) {
      return res
        .status(404)
        .json({ message: "No certification names found matching the filters" });
    }

    const certificationsData = certifications.map((certification) => {
      return [
        certification.id || "N/A",
        certification.certificationName || "N/A",
        certification.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Certification Names Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Certification Name ID", "Certification Name", "Status"],
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
    res.attachment("certification_names_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting certification names to PDF:", error);
    res.status(500).json({
      message: "Error exporting certification names to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createCertificationName,
  updateCertificationName,
  deleteCertificationName,
  getCertificationNameById,
  getAllCertificationNames,
  filterCertificationNames,
  exportFilteredCertificationNamesToCSV,
  exportFilteredCertificationNamesToPDF,
};