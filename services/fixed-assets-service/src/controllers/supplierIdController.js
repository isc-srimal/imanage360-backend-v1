const SupplierIDModel = require("../models/SupplierIDModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createSupplierId = async (req, res) => {
  const { supplier_name, status = "Active" } = req.body;

  try {
    const supplier = await SupplierIDModel.create({
      supplier_name,
      status,
    });

    res
      .status(201)
      .json({ message: "Supplier ID created successfully", supplier });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSupplierId = async (req, res) => {
  const { id } = req.params;
  const { supplier_name, status } = req.body;

  try {
    const supplierToUpdate = await SupplierIDModel.findByPk(id);

    if (!supplierToUpdate) {
      return res.status(404).json({ message: "Supplier ID not found" });
    }

    supplierToUpdate.supplier_name = supplier_name || supplierToUpdate.supplier_name;
    supplierToUpdate.status = status || supplierToUpdate.status;

    await supplierToUpdate.save();
    res.status(200).json({
      message: "Supplier ID updated successfully",
      supplier: supplierToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating supplier ID", error: error.message });
  }
};

const deleteSupplierId = async (req, res) => {
  const { id } = req.params;

  try {
    const supplierToDelete = await SupplierIDModel.findByPk(id);

    if (!supplierToDelete) {
      return res.status(404).json({ message: "Supplier ID not found" });
    }

    await supplierToDelete.destroy();
    res.status(200).json({ message: "Supplier ID deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting supplier ID", error: error.message });
  }
};

const getSupplierIdById = async (req, res) => {
  try {
    const { id } = req.params;
    const supplier = await SupplierIDModel.findByPk(id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier ID not found" });
    }

    res.status(200).json(supplier);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving supplier ID", error: error.message });
  }
};

const getAllSupplierIds = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalSuppliers, rows: suppliers } =
      await SupplierIDModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalSuppliers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSuppliers / limit),
      suppliers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving supplier IDs", error: error.message });
  }
};

const filterSupplierIds = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalSuppliers, rows: suppliers } =
      await SupplierIDModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalSuppliers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalSuppliers / limit),
      suppliers,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering supplier IDs", error: error.message });
  }
};

const exportFilteredSupplierIdsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: suppliers } = await SupplierIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!suppliers || suppliers.length === 0) {
      return res.status(404).json({
        message: "No supplier IDs found matching the filters",
      });
    }

    const suppliersData = suppliers.map((supplier) => {
      return {
        supplierId: supplier.id,
        supplier_name: supplier.supplier_name,
        status: supplier.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(suppliersData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_supplier_ids.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting supplier IDs to CSV:", error);
    res.status(500).json({
      message: "Error exporting supplier IDs to CSV",
      error: error.message,
    });
  }
};

const exportFilteredSupplierIdsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: suppliers } = await SupplierIDModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!suppliers || suppliers.length === 0) {
      return res
        .status(404)
        .json({ message: "No supplier IDs found matching the filters" });
    }

    const suppliersData = suppliers.map((supplier) => {
      return [
        supplier.id || "N/A",
        supplier.supplier_name || "N/A",
        supplier.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Supplier IDs Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*"],
            body: [
              ["Supplier ID", "Supplier Name", "Status"],
              ...suppliersData,
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
    res.attachment("supplier_ids_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting supplier IDs to PDF:", error);
    res.status(500).json({
      message: "Error exporting supplier IDs to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createSupplierId,
  updateSupplierId,
  deleteSupplierId,
  getSupplierIdById,
  getAllSupplierIds,
  filterSupplierIds,
  exportFilteredSupplierIdsToCSV,
  exportFilteredSupplierIdsToPDF,
};