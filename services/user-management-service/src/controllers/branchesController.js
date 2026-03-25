const BranchesModel = require("../models/BranchesModel");
const TenantsModel = require("../models/TenantsModel");
const CountryModel = require("../../../hr-service/src/models/CountryModel");
const OrganizationModel = require("../models/OrganizationsModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createBranch = async (req, res) => {
  const { organization_uid, tenant_uid, branch_name, email, phone, address, logo, description, country_uid, status } = req.body;

  try {
    const branchRecord = await BranchesModel.create({
      organization_uid,
      tenant_uid,
      branch_name,
      email,
      phone,
      address,
      logo,
      description,
      country_uid,
      status,
    });

    res.status(201).json({ message: "Branch created successfully", branch: branchRecord });
  } catch (error) {
    res.status(500).json({ message: "Error creating branch", error: error.message });
  }
};

const updateBranch = async (req, res) => {
  const { id } = req.params;
  const { organization_uid, tenant_uid, branch_name, email, phone, address, logo, description, country_uid, status } = req.body;

  try {
    const branchToUpdate = await BranchesModel.findByPk(id);

    if (!branchToUpdate) {
      return res.status(404).json({ message: "Branch not found" });
    }

    branchToUpdate.organization_uid = organization_uid || branchToUpdate.organization_uid;
    branchToUpdate.tenant_uid = tenant_uid || branchToUpdate.tenant_uid;
    branchToUpdate.branch_name = branch_name || branchToUpdate.branch_name;
    branchToUpdate.email = email || branchToUpdate.email;
    branchToUpdate.phone = phone || branchToUpdate.phone;
    branchToUpdate.address = address || branchToUpdate.address;
    branchToUpdate.logo = logo || branchToUpdate.logo;
    branchToUpdate.description = description || branchToUpdate.description;
    branchToUpdate.country_uid = country_uid || branchToUpdate.country_uid;
    branchToUpdate.status = status || branchToUpdate.status;

    await branchToUpdate.save();

    res.status(200).json({
      message: "Branch updated successfully",
      branch: branchToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating branch", error: error.message });
  }
};

const deleteBranch = async (req, res) => {
  const { id } = req.params;

  try {
    const branchToDelete = await BranchesModel.findByPk(id);

    if (!branchToDelete) {
      return res.status(404).json({ message: "Branch not found" });
    }

    await branchToDelete.destroy();
    res.status(200).json({ message: "Branch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting branch", error: error.message });
  }
};

const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await BranchesModel.findByPk(id, {
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: TenantsModel, as: "tenants" },
        { model: CountryModel, as: "country" },
      ],
    });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    res.status(200).json(branch);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving branch", error: error.message });
  }
};

const getAllBranches = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalBranches, rows: branches } = await BranchesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: TenantsModel, as: "tenants" },
        { model: CountryModel, as: "country" },
      ],
    });

    res.status(200).json({
      totalBranches,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBranches / limit),
      branches,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving branches", error: error.message });
  }
};

const exportBranchesToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: branches } = await BranchesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: TenantsModel, as: "tenants" },
        { model: CountryModel, as: "country" },
      ],
    });

    if (!branches || branches.length === 0) {
      return res.status(404).json({
        message: "No branches found",
      });
    }

    const branchesData = branches.map((branch) => {
      return {
        uid: branch.uid,
        organization_uid: branch.organization_uid,
        tenant_uid: branch.tenant_uid,
        branch_name: branch.branch_name,
        email: branch.email,
        phone: branch.phone,
        address: branch.address,
        logo: branch.logo,
        description: branch.description,
        country_uid: branch.country_uid,
        status: branch.status,
        created_at: branch.created_at,
        updated_at: branch.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(branchesData);

    res.header("Content-Type", "text/csv");
    res.attachment("branches.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting branches to CSV:", error);
    res.status(500).json({
      message: "Error exporting branches to CSV",
      error: error.message,
    });
  }
};

const exportBranchesToPDF = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: branches } = await BranchesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: TenantsModel, as: "tenants" },
        { model: CountryModel, as: "country" },
      ],
    });

    if (!branches || branches.length === 0) {
      return res.status(404).json({
        message: "No branches found",
      });
    }

    const branchesData = branches.map((branch) => {
      return [
        branch.uid || "N/A",
        branch.organization_uid || "N/A",
        branch.tenant_uid || "N/A",
        branch.branch_name || "N/A",
        branch.email || "N/A",
        branch.phone || "N/A",
        branch.address || "N/A",
        branch.logo || "N/A",
        branch.description || "N/A",
        branch.country_uid || "N/A",
        branch.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Branches Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Branch ID",
                "Organization ID",
                "Tenant ID",
                "Branch Name",
                "Email",
                "Phone",
                "Address",
                "Logo",
                "Description",
                "Country ID",
                "Status",
              ],
              ...branchesData,
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
    res.attachment("branches_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting branches to PDF:", error);
    res.status(500).json({
      message: "Error exporting branches to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createBranch,
  updateBranch,
  deleteBranch,
  getBranchById,
  getAllBranches,
  exportBranchesToCSV,
  exportBranchesToPDF,
};