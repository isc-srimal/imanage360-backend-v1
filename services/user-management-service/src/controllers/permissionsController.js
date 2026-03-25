const PermissionsModel = require("../models/PermissionsModel");
const ModulesModel = require("../models/ModulesModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createPermission = async (req, res) => {
  const { module_uid, permission, description, status } = req.body;

  try {
    const permissionRecord = await PermissionsModel.create({
      module_uid,
      permission,
      description,
      status,
    });

    res.status(201).json({ message: "Permission created successfully", permission: permissionRecord });
  } catch (error) {
    res.status(500).json({ message: "Error creating permission", error: error.message });
  }
};

const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { module_uid, permission, description, status } = req.body;

  try {
    const permissionToUpdate = await PermissionsModel.findByPk(id);

    if (!permissionToUpdate) {
      return res.status(404).json({ message: "Permission not found" });
    }

    permissionToUpdate.module_uid = module_uid || permissionToUpdate.module_uid;
    permissionToUpdate.permission = permission || permissionToUpdate.permission;
    permissionToUpdate.description = description !== undefined ? description : permissionToUpdate.description;
    permissionToUpdate.status = status || permissionToUpdate.status;

    await permissionToUpdate.save();

    res.status(200).json({
      message: "Permission updated successfully",
      permission: permissionToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating permission", error: error.message });
  }
};

const deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permissionToDelete = await PermissionsModel.findByPk(id);

    if (!permissionToDelete) {
      return res.status(404).json({ message: "Permission not found" });
    }

    await permissionToDelete.destroy();
    res.status(200).json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting permission", error: error.message });
  }
};

const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const permission = await PermissionsModel.findByPk(id, {
      include: [{ model: ModulesModel, as: "modules" }],
    });

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.status(200).json(permission);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving permission", error: error.message });
  }
};

const getAllPermissions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalPermissions, rows: permissions } = await PermissionsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: ModulesModel, as: "modules" }],
    });

    res.status(200).json({
      totalPermissions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPermissions / limit),
      permissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving permissions", error: error.message });
  }
};

const filterPermissions = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalPermissions, rows: permissions } = await PermissionsModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: ModulesModel, as: "modules" }],
    });

    res.status(200).json({
      totalPermissions,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPermissions / limit),
      permissions,
    });
  } catch (error) {
    res.status(500).json({ message: "Error filtering permissions", error: error.message });
  }
};

const exportFilteredPermissionsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: permissions } = await PermissionsModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: ModulesModel, as: "modules" }],
    });

    if (!permissions || permissions.length === 0) {
      return res.status(404).json({
        message: "No permissions found matching the filters",
      });
    }

    const permissionsData = permissions.map((permission) => {
      return {
        uid: permission.uid,
        module_uid: permission.module_uid,
        permission: permission.permission,
        description: permission.description,
        status: permission.status,
        created_at: permission.created_at,
        updated_at: permission.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(permissionsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_permissions.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting permissions to CSV:", error);
    res.status(500).json({
      message: "Error exporting permissions to CSV",
      error: error.message,
    });
  }
};

const exportFilteredPermissionsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: permissions } = await PermissionsModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: ModulesModel, as: "modules" }],
    });

    if (!permissions || permissions.length === 0) {
      return res.status(404).json({
        message: "No permissions found matching the filters",
      });
    }

    const permissionsData = permissions.map((permission) => {
      return [
        permission.uid || "N/A",
        permission.module_uid || "N/A",
        permission.permission || "N/A",
        permission.description || "N/A",
        permission.status || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Permissions Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: [
              ["Permission ID", "Module UID", "Permission", "Description", "Status"],
              ...permissionsData,
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
    res.attachment("permissions_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting permissions to PDF:", error);
    res.status(500).json({
      message: "Error exporting permissions to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createPermission,
  updatePermission,
  deletePermission,
  getPermissionById,
  getAllPermissions,
  filterPermissions,
  exportFilteredPermissionsToCSV,
  exportFilteredPermissionsToPDF,
};