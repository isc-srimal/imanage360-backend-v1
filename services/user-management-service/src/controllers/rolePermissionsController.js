const RolePermissionsModel = require("../models/RolePermissionsModel");
const RolesModel = require("../models/RolesModel");
const PermissionsModel = require("../models/PermissionsModel");
const UsersModel = require("../models/UsersModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const sequelize = require("../../src/config/dbSync");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createRolePermission = async (req, res) => {
  const { role_uid, permission_uid } = req.body;

  try {
    const rolePermissionRecord = await RolePermissionsModel.create({
      role_uid,
      permission_uid,
    });

    res.status(201).json({ 
      message: "Role permission created successfully", 
      rolePermission: rolePermissionRecord 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating role permission", 
      error: error.message 
    });
  }
};

const updateRolePermission = async (req, res) => {
  const { id } = req.params;
  const { role_uid, permission_uid } = req.body;

  try {
    const rolePermissionToUpdate = await RolePermissionsModel.findByPk(id);

    if (!rolePermissionToUpdate) {
      return res.status(404).json({ message: "Role permission not found" });
    }

    rolePermissionToUpdate.role_uid = role_uid || rolePermissionToUpdate.role_uid;
    rolePermissionToUpdate.permission_uid = permission_uid || rolePermissionToUpdate.permission_uid;

    await rolePermissionToUpdate.save();

    res.status(200).json({
      message: "Role permission updated successfully",
      rolePermission: rolePermissionToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating role permission", 
      error: error.message 
    });
  }
};

const deleteRolePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const rolePermissionToDelete = await RolePermissionsModel.findByPk(id);

    if (!rolePermissionToDelete) {
      return res.status(404).json({ message: "Role permission not found" });
    }

    await rolePermissionToDelete.destroy();
    res.status(200).json({ message: "Role permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting role permission", 
      error: error.message 
    });
  }
};

const getRolePermissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const rolePermission = await RolePermissionsModel.findByPk(id, {
      include: [
        {
          model: RolesModel,
          as: 'roles',
          attributes: ['uid', 'role_name', 'description']
        },
        {
          model: PermissionsModel,
          as: 'permissions',
          attributes: ['uid', 'permission', 'description']
        }
      ]
    });

    if (!rolePermission) {
      return res.status(404).json({ message: "Role permission not found" });
    }

    res.status(200).json(rolePermission);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving role permission", 
      error: error.message 
    });
  }
};

const getAllRolePermissions = async (req, res) => {
  try {
    const userId = req.user.uid; // Assuming user ID is available from auth middleware

    // Get user details to check if super admin
    const user = await UsersModel.findByPk(userId, {
      attributes: ['uid', 'is_superadmin']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSuperAdmin = user.is_superadmin;

    if (isSuperAdmin) {
      // If super admin, return empty arrays
      res.status(200).json({
        roles: [],
        permissions: []
      });
    } else {
      // If not super admin, return all roles and permissions
      const allRoles = await RolesModel.findAll({
        attributes: ['role_name'],
        where: { status: 'Active' }
      });

      const allPermissions = await PermissionsModel.findAll({
        attributes: ['permission'],
        where: { status: 'Active' }
      });

      const roles = allRoles.map(role => role.role_name);
      const permissions = allPermissions.map(permission => permission.permission);

      res.status(200).json({
        roles,
        permissions,
        isSuperAdmin: false
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving role permissions", 
      error: error.message 
    });
  }
};

const getRolePermissionsByUserId = async (req, res) => {
  try {
    const { id } = req.params; // User ID from the path

    // Find user by ID and check if they exist
    const user = await UsersModel.findByPk(id, {
      attributes: ['uid', 'is_superadmin', 'group_uid']
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSuperAdmin = user.is_superadmin;

    if (isSuperAdmin) {
      // If super admin, return empty arrays and is_superadmin true
      res.status(200).json({
        is_superadmin: true,
        roles: [],
        permissions: []
      });
    } else {
      let userRoles = [];
      let userPermissions = [];
      let permissionCount = 0;
      let roleIds = [];

      // First try to get role assignments from tbl_user_groups table
      const userGroupResults = await sequelize.query(
        `SELECT DISTINCT ug.role_uid
         FROM tbl_user_groups ug
         WHERE ug.uid = :userId AND ug.status = 'Active'`,
        {
          replacements: { userId: id },
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (userGroupResults.length > 0) {
        // Use role assignments from tbl_user_groups
        roleIds = userGroupResults.map(group => group.role_uid);
      } else {
        // Fallback to group_uid field in users table
        let userGroupIds = user.group_uid;

        // Handle if group_uid is stored as JSON string
        if (typeof userGroupIds === 'string') {
          try {
            userGroupIds = JSON.parse(userGroupIds);
          } catch (e) {
            userGroupIds = [];
          }
        }

        // Ensure it's an array
        if (!Array.isArray(userGroupIds)) {
          userGroupIds = userGroupIds ? [userGroupIds] : [];
        }

        roleIds = userGroupIds;
      }

      if (roleIds.length > 0) {
        // Create placeholders for the IN clause
        const placeholders = roleIds.map((_, index) => `:roleId${index}`).join(', ');
        
        // Create replacements object with individual parameters
        const roleReplacements = {};
        roleIds.forEach((roleId, index) => {
          roleReplacements[`roleId${index}`] = roleId;
        });

        // Get user's roles based on their role assignments
        const roleResults = await sequelize.query(
          `SELECT DISTINCT r.uid, r.role_name
           FROM tbl_roles r
           WHERE r.uid IN (${placeholders}) AND r.status = 'Active'
           ORDER BY r.role_name`,
          {
            replacements: roleReplacements,
            type: sequelize.QueryTypes.SELECT
          }
        );

        // Get user's permissions based on their assigned roles
        const permissionResults = await sequelize.query(
          `SELECT DISTINCT p.permission
           FROM tbl_permissions p
           INNER JOIN tbl_role_permissions rp ON p.uid = rp.permission_uid
           INNER JOIN tbl_roles r ON rp.role_uid = r.uid
           WHERE rp.role_uid IN (${placeholders}) 
           AND p.status = 'Active' 
           AND r.status = 'Active'
           ORDER BY p.permission`,
          {
            replacements: roleReplacements,
            type: sequelize.QueryTypes.SELECT
          }
        );

        userRoles = roleResults.map(role => role.role_name);
        userPermissions = permissionResults.map(permission => permission.permission);
        permissionCount = userPermissions.length;

        // Debug logging
        console.log(`User ID ${id} - Role IDs: ${roleIds.join(', ')}`);
        console.log(`User ID ${id} - Roles: ${userRoles.join(', ')}`);
        console.log(`User ID ${id} - Permission Count: ${permissionCount}`);
      }

      res.status(200).json({
        is_superadmin: false,
        roles: userRoles,
        permissions: userPermissions,
        permissionCount
      });
    }
  } catch (error) {
    console.error("Error retrieving role permissions:", error);
    res.status(500).json({
      message: "Error retrieving role permissions",
      error: error.message
    });
  }
};

const exportRolePermissionsToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: rolePermissions } = await RolePermissionsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: RolesModel,
          as: 'roles',
          attributes: ['role_name', 'description']
        },
        {
          model: PermissionsModel,
          as: 'permissions',
          attributes: ['permission', 'description']
        }
      ]
    });

    if (!rolePermissions || rolePermissions.length === 0) {
      return res.status(404).json({
        message: "No role permissions found",
      });
    }

    const rolePermissionsData = rolePermissions.map((rolePermission) => {
      return {
        uid: rolePermission.uid,
        role_name: rolePermission.roles?.role_name || 'N/A',
        role_description: rolePermission.roles?.description || 'N/A',
        permission: rolePermission.permissions?.permission || 'N/A',
        permission_description: rolePermission.permissions?.description || 'N/A',
        created_at: rolePermission.created_at,
        updated_at: rolePermission.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(rolePermissionsData);

    res.header("Content-Type", "text/csv");
    res.attachment("role_permissions.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting role permissions to CSV:", error);
    res.status(500).json({
      message: "Error exporting role permissions to CSV",
      error: error.message,
    });
  }
};

const exportRolePermissionsToPDF = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: rolePermissions } = await RolePermissionsModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: RolesModel,
          as: 'roles',
          attributes: ['role_name', 'description']
        },
        {
          model: PermissionsModel,
          as: 'permissions',
          attributes: ['permission', 'description']
        }
      ]
    });

    if (!rolePermissions || rolePermissions.length === 0) {
      return res.status(404).json({
        message: "No role permissions found",
      });
    }

    const rolePermissionsData = rolePermissions.map((rolePermission) => {
      return [
        rolePermission.uid || "N/A",
        rolePermission.roles?.role_name || "N/A",
        rolePermission.roles?.description || "N/A",
        rolePermission.permissions?.permission || "N/A",
        rolePermission.permissions?.description || "N/A",
        rolePermission.created_at || "N/A",
        rolePermission.updated_at || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Role Permissions Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "ID",
                "Role Name",
                "Role Description",
                "Permission",
                "Permission Description",
                "Created At",
                "Updated At",
              ],
              ...rolePermissionsData,
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
    res.attachment("role_permissions_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting role permissions to PDF:", error);
    res.status(500).json({
      message: "Error exporting role permissions to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createRolePermission,
  updateRolePermission,
  deleteRolePermission,
  getRolePermissionById,
  getAllRolePermissions,
  getRolePermissionsByUserId,
  exportRolePermissionsToCSV,
  exportRolePermissionsToPDF,
};