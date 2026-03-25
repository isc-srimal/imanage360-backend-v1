const RolesModel = require("../models/RolesModel");
const TenantsModel = require("../models/TenantsModel");
const PermissionsModel = require("../models/PermissionsModel");
const RolePermissionsModel = require("../models/RolePermissionsModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const fs = require("fs");
const sequelize = require("../../src/config/dbSync");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createRole = async (req, res) => {
  const { role_name, description, status, is_business_role, tenant_uid, permissions } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const role = await RolesModel.create({
      role_name,
      description,
      permissionCount: permissions ? permissions.length : 0,
      status,
      is_business_role,
      tenant_uid,
    }, { transaction });

    if (permissions && permissions.length > 0) {
      const rolePermissionData = permissions.map(permission_uid => ({
        role_uid: role.uid,
        permission_uid: permission_uid
      }));

      await RolePermissionsModel.bulkCreate(rolePermissionData, { transaction });
    }

    await transaction.commit();

    res.status(201).json({ 
      message: "Role created successfully", 
      role: {
        ...role.toJSON(),
        permissionCount: permissions ? permissions.length : 0
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role", error: error.message });
  }
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { role_name, description, status, is_business_role, tenant_uid, permissions } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const roleToUpdate = await RolesModel.findByPk(id);

    if (!roleToUpdate) {
      await transaction.rollback();
      return res.status(404).json({ message: "Role not found" });
    }

    roleToUpdate.role_name = role_name || roleToUpdate.role_name;
    roleToUpdate.description = description || roleToUpdate.description;
    roleToUpdate.status = status || roleToUpdate.status;
    roleToUpdate.is_business_role = is_business_role !== undefined ? is_business_role : roleToUpdate.is_business_role;
    roleToUpdate.tenant_uid = tenant_uid || roleToUpdate.tenant_uid;

    if (permissions !== undefined) {
      await RolePermissionsModel.destroy({
        where: { role_uid: id },
        transaction
      });

      if (permissions.length > 0) {
        const rolePermissionData = permissions.map(permission_uid => ({
          role_uid: id,
          permission_uid: permission_uid
        }));

        await RolePermissionsModel.bulkCreate(rolePermissionData, { transaction });
      }

      roleToUpdate.permissionCount = permissions.length;
    } else {
      const permissionCountResult = await sequelize.query(
        `
        SELECT COUNT(*) as count
        FROM tbl_role_permissions rp
        JOIN tbl_permissions p ON rp.permission_uid = p.uid
        WHERE rp.role_uid = :roleId AND p.status = 'Active'
        `,
        {
          replacements: { roleId: id },
          type: sequelize.QueryTypes.SELECT,
          transaction
        }
      );

      const permissionCount = permissionCountResult[0]?.count || 0;
      roleToUpdate.permissionCount = permissionCount;
    }

    await roleToUpdate.save({ transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Role updated successfully",
      role: roleToUpdate,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role", error: error.message });
  }
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  const transaction = await sequelize.transaction();

  try {
    const roleToDelete = await RolesModel.findByPk(id);

    if (!roleToDelete) {
      await transaction.rollback();
      return res.status(404).json({ message: "Role not found" });
    }

    await RolePermissionsModel.destroy({
      where: { role_uid: id },
      transaction
    });

    await roleToDelete.destroy({ transaction });

    await transaction.commit();
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role", error: error.message });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await RolesModel.findByPk(id, {
      include: [{ model: TenantsModel, as: "tenants" }],
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const permissionCountResult = await sequelize.query(
      `
      SELECT COUNT(*) as count
      FROM tbl_role_permissions rp
      JOIN tbl_permissions p ON rp.permission_uid = p.uid
      WHERE rp.role_uid = :roleId AND p.status = 'Active'
      `,
      {
        replacements: { roleId: id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const permissionCount = permissionCountResult[0]?.count || 0;

    role.permissionCount = permissionCount;
    await role.save();

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving role", error: error.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalRoles, rows: roles } = await RolesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: TenantsModel, as: "tenants" }],
    });

    for (let role of roles) {
      const permissionCountResult = await sequelize.query(
        `
        SELECT COUNT(*) as count
        FROM tbl_role_permissions rp
        JOIN tbl_permissions p ON rp.permission_uid = p.uid
        WHERE rp.role_uid = :roleId AND p.status = 'Active'
        `,
        {
          replacements: { roleId: role.uid },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const permissionCount = permissionCountResult[0]?.count || 0;
      role.permissionCount = permissionCount;
      await role.save();
    }

    res.status(200).json({
      totalRoles,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRoles / limit),
      roles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving roles", error: error.message });
  }
};

const filterRoles = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalRoles, rows: roles } = await RolesModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: TenantsModel, as: "tenants" }],
    });

    for (let role of roles) {
      const permissionCountResult = await sequelize.query(
        `
        SELECT COUNT(*) as count
        FROM tbl_role_permissions rp
        JOIN tbl_permissions p ON rp.permission_uid = p.uid
        WHERE rp.role_uid = :roleId AND p.status = 'Active'
        `,
        {
          replacements: { roleId: role.uid },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const permissionCount = permissionCountResult[0]?.count || 0;
      role.permissionCount = permissionCount;
      await role.save();
    }

    res.status(200).json({
      totalRoles,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRoles / limit),
      roles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error filtering roles", error: error.message });
  }
};

const exportFilteredRolesToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: roles } = await RolesModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: TenantsModel, as: "tenants" }],
    });

    if (!roles || roles.length === 0) {
      return res.status(404).json({
        message: "No roles found matching the filters",
      });
    }

    const rolesData = [];
    for (let role of roles) {
      const permissionCountResult = await sequelize.query(
        `
        SELECT COUNT(*) as count
        FROM tbl_role_permissions rp
        JOIN tbl_permissions p ON rp.permission_uid = p.uid
        WHERE rp.role_uid = :roleId AND p.status = 'Active'
        `,
        {
          replacements: { roleId: role.uid },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      const permissionCount = permissionCountResult[0]?.count || 0;
      role.permissionCount = permissionCount;
      await role.save();

      rolesData.push({
        uid: role.uid,
        role_name: role.role_name,
        description: role.description,
        permissionCount: role.permissionCount,
        status: role.status,
        is_business_role: role.is_business_role ? "Yes" : "No",
        tenant_uid: role.tenant_uid,
        created_at: role.created_at,
        updated_at: role.updated_at,
      });
    }

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rolesData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_roles.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting roles to CSV:", error);
    res.status(500).json({
      message: "Error exporting roles to CSV",
      error: error.message,
    });
  }
};

const exportFilteredRolesToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: roles } = await RolesModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [{ model: TenantsModel, as: "tenants" }],
    });

    const fonts = {
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
      },
    };

    for (const style in fonts.Roboto) {
      if (!fs.existsSync(fonts.Roboto[style])) {
        console.error(`Font file missing: ${fonts.Roboto[style]}`);
        return res.status(500).json({
          message: "Font file missing, cannot generate PDF",
        });
      }
    }

    const printer = new PdfPrinter(fonts);

    let docDefinition;
    if (!roles || roles.length === 0) {
      docDefinition = {
        content: [{ text: "No roles found matching the filters", style: "header" }],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            alignment: "center",
            margin: [0, 0, 0, 20],
          },
        },
        defaultStyle: {
          fontSize: 8,
        },
      };
    } else {
      const rolesData = [];
      for (let role of roles) {
        const permissionCountResult = await sequelize.query(
          `
          SELECT COUNT(*) as count
          FROM tbl_role_permissions rp
          JOIN tbl_permissions p ON rp.permission_uid = p.uid
          WHERE rp.role_uid = :roleId AND p.status = 'Active'
          `,
          {
            replacements: { roleId: role.uid },
            type: sequelize.QueryTypes.SELECT,
          }
        );

        const permissionCount = permissionCountResult[0]?.count || 0;

        rolesData.push([
          String(role.uid ?? "N/A"),
          String(role.role_name ?? "N/A"),
          String(role.description ?? "N/A"),
          String(permissionCount ?? "N/A"),
          String(role.status ?? "N/A"),
          String(role.is_business_role ? "Yes" : "No"),
          String(role.tenant_uid ?? "N/A"),
        ]);
      }

      docDefinition = {
        content: [
          { text: "Roles Data", style: "header" },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*", "*", "*", "*", "*", "*"],
              body: [
                [
                  "Role ID",
                  "Role Name",
                  "Description",
                  "Permission Count",
                  "Status",
                  "Business Role",
                  "Tenant ID",
                ],
                ...rolesData,
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
        },
        defaultStyle: {
          fontSize: 8,
        },
      };
    }

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header("Content-Type", "application/pdf");
    res.attachment("roles_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting roles to PDF:", error);
    res.status(500).json({
      message: "Error exporting roles to PDF",
      error: error.message,
    });
  }
};

const getPermissionCountForRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await RolesModel.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const permissionCountResult = await sequelize.query(
      `
      SELECT COUNT(*) as count
      FROM tbl_role_permissions rp
      JOIN tbl_permissions p ON rp.permission_uid = p.uid
      WHERE rp.role_uid = :roleId AND p.status = 'Active'
      `,
      {
        replacements: { roleId: id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const permissionCount = permissionCountResult[0]?.count || 0;

    res.status(200).json({
      message: "Permission count retrieved successfully",
      roleId: id,
      permissionCount: permissionCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving permission count",
      error: error.message,
    });
  }
};

const getRolePermissions = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await RolesModel.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const rolePermissions = await RolePermissionsModel.findAll({
      where: { role_uid: id },
      attributes: ['permission_uid'],
    });

    const permissions = rolePermissions.map(rp => rp.permission_uid);

    res.status(200).json({
      message: "Role permissions retrieved successfully",
      permissions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving role permissions",
      error: error.message,
    });
  }
};

module.exports = {
  createRole,
  updateRole,
  deleteRole,
  getRoleById,
  getAllRoles,
  filterRoles,
  exportFilteredRolesToCSV,
  exportFilteredRolesToPDF,
  getPermissionCountForRole,
  getRolePermissions,
};