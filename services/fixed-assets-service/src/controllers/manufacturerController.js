const ManufacturerModel = require("../models/ManufacturerModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

// CREATE
const createManufacturer = async (req, res) => {
  const { manufacturer, status = "Active" } = req.body;

  try {
    const newRec = await ManufacturerModel.create({ manufacturer, status });
    res.status(201).json({ message: "Manufacturer created successfully", data: newRec });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateManufacturer = async (req, res) => {
  const { id } = req.params;
  const { manufacturer, status } = req.body;

  try {
    const rec = await ManufacturerModel.findByPk(id);
    if (!rec) return res.status(404).json({ message: "Manufacturer not found" });

    rec.manufacturer = manufacturer ?? rec.manufacturer;
    rec.status = status ?? rec.status;
    await rec.save();

    res.status(200).json({ message: "Manufacturer updated successfully", data: rec });
  } catch (error) {
    res.status(500).json({ message: "Error updating manufacturer", error: error.message });
  }
};

// DELETE
const deleteManufacturer = async (req, res) => {
  const { id } = req.params;

  try {
    const rec = await ManufacturerModel.findByPk(id);
    if (!rec) return res.status(404).json({ message: "Manufacturer not found" });

    await rec.destroy();
    res.status(200).json({ message: "Manufacturer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting manufacturer", error: error.message });
  }
};

// GET BY ID
const getManufacturerById = async (req, res) => {
  const { id } = req.params;
  try {
    const rec = await ManufacturerModel.findByPk(id);
    if (!rec) return res.status(404).json({ message: "Manufacturer not found" });
    res.status(200).json(rec);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving manufacturer", error: error.message });
  }
};

// GET ALL (paginated)
const getAllManufacturers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);

  try {
    const { count: total, rows: data } = await ManufacturerModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving manufacturers", error: error.message });
  }
};

// FILTER BY STATUS
const filterManufacturers = async (req, res) => {
  const { status = "All", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const where = status !== "All" ? { status } : {};

  try {
    const { count: total, rows: data } = await ManufacturerModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error filtering manufacturers", error: error.message });
  }
};

// EXPORT CSV
const exportFilteredManufacturersToCSV = async (req, res) => {
  const { status = "All", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const where = status !== "All" ? { status } : {};

  try {
    const { rows: data } = await ManufacturerModel.findAndCountAll({ where, offset, limit });

    if (!data?.length) {
      return res.status(404).json({ message: "No manufacturers found matching the filters" });
    }

    const csvData = data.map(m => ({
      id: m.id,
      manufacturer: m.manufacturer,
      status: m.status,
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_manufacturers.csv");
    res.send(csv);
  } catch (error) {
    console.error("CSV export error:", error);
    res.status(500).json({ message: "Error exporting CSV", error: error.message });
  }
};

// EXPORT PDF
const exportFilteredManufacturersToPDF = async (req, res) => {
  const { status = "All", page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * parseInt(limit);
  const where = status !== "All" ? { status } : {};

  try {
    const { rows: data } = await ManufacturerModel.findAndCountAll({ where, offset, limit });

    if (!data?.length) {
      return res.status(404).json({ message: "No manufacturers found matching the filters" });
    }

    const tableBody = data.map(m => [m.id ?? "N/A", m.manufacturer ?? "N/A", m.status ?? "N/A"]);

    const docDefinition = {
      content: [
        { text: "Manufacturers Report", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [80, "*", 100],
            body: [["ID", "Manufacturer", "Status"], ...tableBody],
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
      },
      defaultStyle: { fontSize: 10 },
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
    res.attachment("manufacturers_report.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("PDF export error:", error);
    res.status(500).json({ message: "Error exporting PDF", error: error.message });
  }
};

module.exports = {
  createManufacturer,
  updateManufacturer,
  deleteManufacturer,
  getManufacturerById,
  getAllManufacturers,
  filterManufacturers,
  exportFilteredManufacturersToCSV,
  exportFilteredManufacturersToPDF,
};