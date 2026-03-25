const contractType = require("../models/ContractTypeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createContractType = async (req, res) => {
  const {
    contractTypeName,
    contractTypeDescription,
    status = "Active",
  } = req.body;

  try {
    const contract = await contractType.create({
      contractTypeName,
      contractTypeDescription,
      status,
    });

    res
      .status(201)
      .json({ message: "Contract type created successfully", contract });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateContractType = async (req, res) => {
  const { id } = req.params;
  const { contractTypeName, contractTypeDescription, status } = req.body;

  try {
    const contractToUpdate = await contractType.findByPk(id);

    if (!contractToUpdate) {
      return res.status(404).json({ message: "Contract type not found" });
    }

    contractToUpdate.contractTypeName =
      contractTypeName || contractToUpdate.contractTypeName;
    contractToUpdate.contractTypeDescription =
      contractTypeDescription || contractToUpdate.contractTypeDescription;
    contractToUpdate.status = status || contractToUpdate.status;

    await contractToUpdate.save();
    res.status(200).json({
      message: "Contract type updated successfully",
      contract: contractToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating contract type", error: error.message });
  }
};

const deleteContractType = async (req, res) => {
  const { id } = req.params;

  try {
    const contractToDelete = await contractType.findByPk(id);

    if (!contractToDelete) {
      return res.status(404).json({ message: "Contract type not found" });
    }

    await contractToDelete.destroy();
    res.status(200).json({ message: "Contract type deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting contract type", error: error.message });
  }
};

const getContractTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await contractType.findByPk(id);

    if (!contract) {
      return res.status(404).json({ message: "Contract type not found" });
    }

    res.status(200).json(contract);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving contract type",
      error: error.message,
    });
  }
};

const getAllContractTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalContracts, rows: contracts } =
      await contractType.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalContracts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalContracts / limit),
      contracts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving contract types",
      error: error.message,
    });
  }
};

const filterContractTypes = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalContracts, rows: contracts } =
      await contractType.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalContracts,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalContracts / limit),
      contracts,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error filtering contract types",
        error: error.message,
      });
  }
};

const exportFilteredContractTypesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: contract } = await contractType.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    console.log(contract);

    if (!contract || contract.length === 0) {
      return res.status(404).json({
        message: "No contract type found matching the filters",
      });
    }

    const contractTypesData = contract.map((contractz) => {
      return {
        contractTypeId: contractz.id,
        contractTypeName: contractz.contractTypeName,
        contractTypeDescription: contractz.contractTypeDescription,
        status: contractz.status,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(contractTypesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_contract_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting contract types to CSV:", error);
    res.status(500).json({
      message: "Error exporting contract types to CSV",
      error: error.message,
    });
  }
};

const exportFilteredContractTypesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") where["status"] = status;

    const { rows: contract } = await contractType.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!contract || contract.length === 0) {
      return res
        .status(404)
        .json({ message: "No contract type found matching the filters" });
    }

    const contractTypesData = contract.map((contractz) => [
      contractz.id || "N/A",
      contractz.contractTypeName || "N/A",
      contractz.status || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Contract Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [80, "*", "*", "*"],
            body: [
              [
                { text: "Contract Type ID", bold: true },
                { text: "Contract Type Name", bold: true },
                { text: "Status", bold: true },
              ],
              ...contractTypesData,
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
    res.attachment("contract_type_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting contract type to PDF:", error);
    res
      .status(500)
      .json({
        message: "Error exporting contract type to PDF",
        error: error.message,
      });
  }
};

module.exports = {
  createContractType,
  updateContractType,
  deleteContractType,
  getContractTypeById,
  getAllContractTypes,
  filterContractTypes,
  exportFilteredContractTypesToCSV,
  exportFilteredContractTypesToPDF,
};
