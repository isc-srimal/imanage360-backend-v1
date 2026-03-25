const OrganizationsModel = require("../models/OrganizationsModel");
const CountryModel = require("../../../hr-service/src/models/CountryModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createOrganization = async (req, res) => {
  const { organization, email, phone, address, logo, description, country_uid, status } = req.body;

  try {
    const organizationRecord = await OrganizationsModel.create({
      organization,
      email,
      phone,
      address,
      logo,
      description,
      country_uid,
      status,
    });

    res.status(201).json({ message: "Organization created successfully", organization: organizationRecord });
  } catch (error) {
    res.status(500).json({ message: "Error creating organization", error: error.message });
  }
};

const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { organization, email, phone, address, logo, description, country_uid, status } = req.body;

  try {
    const organizationToUpdate = await OrganizationsModel.findByPk(id);

    if (!organizationToUpdate) {
      return res.status(404).json({ message: "Organization not found" });
    }

    organizationToUpdate.organization = organization || organizationToUpdate.organization;
    organizationToUpdate.email = email || organizationToUpdate.email;
    organizationToUpdate.phone = phone || organizationToUpdate.phone;
    organizationToUpdate.address = address || organizationToUpdate.address;
    organizationToUpdate.logo = logo || organizationToUpdate.logo;
    organizationToUpdate.description = description || organizationToUpdate.description;
    organizationToUpdate.country_uid = country_uid || organizationToUpdate.country_uid;
    organizationToUpdate.status = status || organizationToUpdate.status;

    await organizationToUpdate.save();

    res.status(200).json({
      message: "Organization updated successfully",
      organization: organizationToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating organization", error: error.message });
  }
};

const deleteOrganization = async (req, res) => {
  const { id } = req.params;

  try {
    const organizationToDelete = await OrganizationsModel.findByPk(id);

    if (!organizationToDelete) {
      return res.status(404).json({ message: "Organization not found" });
    }

    await organizationToDelete.destroy();
    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting organization", error: error.message });
  }
};

const getOrganizationById = async (req, res) => {
  try {
    const { id } = req.params;
    const organization = await OrganizationsModel.findByPk(id, {
      include: [{ model: CountryModel, as: "country" }],
    });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving organization", error: error.message });
  }
};

const getAllOrganizations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalOrganizations, rows: organizations } = await OrganizationsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: CountryModel, as: "country" }],
    });

    res.status(200).json({
      totalOrganizations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrganizations / limit),
      organizations,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving organizations", error: error.message });
  }
};

const exportOrganizationsToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: organizations } = await OrganizationsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: CountryModel, as: "country" }],
    });

    if (!organizations || organizations.length === 0) {
      return res.status(404).json({
        message: "No organizations found",
      });
    }

    const organizationsData = organizations.map((org) => {
      return {
        uid: org.uid,
        organization: org.organization,
        email: org.email,
        phone: org.phone,
        address: org.address,
        logo: org.logo,
        description: org.description,
        country_uid: org.country_uid,
        status: org.status,
        created_at: org.created_at,
        updated_at: org.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(organizationsData);

    res.header("Content-Type", "text/csv");
    res.attachment("organizations.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting organizations to CSV:", error);
    res.status(500).json({
      message: "Error exporting organizations to CSV",
      error: error.message,
    });
  }
};

const exportOrganizationsToPDF = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: organizations } = await OrganizationsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: CountryModel, as: "country" }],
    });

    if (!organizations || organizations.length === 0) {
      return res.status(404).json({
        message: "No organizations found",
      });
    }

    const organizationsData = organizations.map((org) => {
      return [
        org.uid || "N/A",
        org.organization || "N/A",
        org.email || "N/A",
        org.phone || "N/A",
        org.address || "N/A",
        org.logo || "N/A",
        org.description || "N/A",
        org.country_uid || "N/A",
        org.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Organizations Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [ 
              [
                "Organization ID",
                "Organization",
                "Email",
                "Phone",
                "Address",
                "Logo",
                "Description",
                "Country ID",
                "Status",
              ],
              ...organizationsData,
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
    res.attachment("organizations_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting organizations to PDF:", error);
    res.status(500).json({
      message: "Error exporting organizations to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationById,
  getAllOrganizations,
  exportOrganizationsToCSV,
  exportOrganizationsToPDF,
};