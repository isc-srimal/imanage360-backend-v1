const TenantsModel = require("../models/TenantsModel");
const OrganizationModel = require("../models/OrganizationsModel");
const CountryModel = require("../../../hr-service/src/models/CountryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createTenant = async (req, res) => {
  const { organization_uid, tenant, domain, email, phone, address, logo, description, country_uid, status } = req.body;

  try {
    const tenantRecord = await TenantsModel.create({
      organization_uid,
      tenant,
      domain,
      email,
      phone,
      address,
      logo,
      description,
      country_uid,
      status,
    });

    res.status(201).json({ message: "Tenant created successfully", tenant: tenantRecord });
  } catch (error) {
    res.status(500).json({ message: "Error creating tenant", error: error.message });
  }
};

const updateTenant = async (req, res) => {
  const { id } = req.params;
  const { organization_uid, tenant, domain, email, phone, address, logo, description, country_uid, status } = req.body;

  try {
    const tenantToUpdate = await TenantsModel.findByPk(id);

    if (!tenantToUpdate) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    tenantToUpdate.organization_uid = organization_uid || tenantToUpdate.organization_uid;
    tenantToUpdate.tenant = tenant || tenantToUpdate.tenant;
    tenantToUpdate.domain = domain || tenantToUpdate.domain;
    tenantToUpdate.email = email || tenantToUpdate.email;
    tenantToUpdate.phone = phone || tenantToUpdate.phone;
    tenantToUpdate.address = address || tenantToUpdate.address;
    tenantToUpdate.logo = logo || tenantToUpdate.logo;
    tenantToUpdate.description = description || tenantToUpdate.description;
    tenantToUpdate.country_uid = country_uid || tenantToUpdate.country_uid;
    tenantToUpdate.status = status || tenantToUpdate.status;

    await tenantToUpdate.save();

    res.status(200).json({
      message: "Tenant updated successfully",
      tenant: tenantToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating tenant", error: error.message });
  }
};

const deleteTenant = async (req, res) => {
  const { id } = req.params;

  try {
    const tenantToDelete = await TenantsModel.findByPk(id);

    if (!tenantToDelete) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    await tenantToDelete.destroy();
    res.status(200).json({ message: "Tenant deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tenant", error: error.message });
  }
};

const getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await TenantsModel.findByPk(id, {
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: CountryModel, as: "country" },
      ],
    });

    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    res.status(200).json(tenant);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tenant", error: error.message });
  }
};

const getAllTenants = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalTenants, rows: tenants } = await TenantsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: CountryModel, as: "country" },
      ],
    });

    res.status(200).json({
      totalTenants,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTenants / limit),
      tenants,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tenants", error: error.message });
  }
};

const exportTenantsToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: tenants } = await TenantsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: CountryModel, as: "country" },
      ],
    });

    if (!tenants || tenants.length === 0) {
      return res.status(404).json({
        message: "No tenants found",
      });
    }

    const tenantsData = tenants.map((tenant) => {
      return {
        uid: tenant.uid,
        organization_uid: tenant.organization_uid,
        tenant: tenant.tenant,
        domain: tenant.domain,
        email: tenant.email,
        phone: tenant.phone,
        address: tenant.address,
        logo: tenant.logo,
        description: tenant.description,
        country_uid: tenant.country_uid,
        status: tenant.status,
        created_at: tenant.created_at,
        updated_at: tenant.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(tenantsData);

    res.header("Content-Type", "text/csv");
    res.attachment("tenants.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting tenants to CSV:", error);
    res.status(500).json({
      message: "Error exporting tenants to CSV",
      error: error.message,
    });
  }
};

const exportTenantsToPDF = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: tenants } = await TenantsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        { model: OrganizationModel, as: "organizations" },
        { model: CountryModel, as: "country" },
      ],
    });

    if (!tenants || tenants.length === 0) {
      return res.status(404).json({
        message: "No tenants found",
      });
    }

    const tenantsData = tenants.map((tenant) => {
      return [
        tenant.uid || "N/A",
        tenant.organization_uid || "N/A",
        tenant.tenant || "N/A",
        tenant.domain || "N/A",
        tenant.email || "N/A",
        tenant.phone || "N/A",
        tenant.address || "N/A",
        tenant.logo || "N/A",
        tenant.description || "N/A",
        tenant.country_uid || "N/A",
        tenant.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Tenants Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Tenant ID",
                "Organization ID",
                "Tenant",
                "Domain",
                "Email",
                "Phone",
                "Address",
                "Logo",
                "Description",
                "Country ID",
                "Status",
              ],
              ...tenantsData,
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
    res.attachment("tenants_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting tenants to PDF:", error);
    res.status(500).json({
      message: "Error exporting tenants to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createTenant,
  updateTenant,
  deleteTenant,
  getTenantById,
  getAllTenants,
  exportTenantsToCSV,
  exportTenantsToPDF,
};