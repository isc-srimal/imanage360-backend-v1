const bcrypt = require("bcryptjs");
const UsersModel = require("../models/UsersModel");
const UserTypesModel = require("../models/UserTypesModel");
const UsersGroupsModel = require("../models/UserGroupsModel");
const TenantsModel = require("../models/TenantsModel");
const OrganizationModel = require("../models/OrganizationsModel");
const BranchModel = require("../models/BranchesModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createUser = async (req, res) => {
  const {
    username,
    email,
    password,
    status,
    user_type_uid,
    group_uid,
    organization_uid,
    tenant_uid,
    branch_uid,
    employeeId,
    is_superadmin,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UsersModel.create({
      username,
      email,
      password: hashedPassword,
      status,
      user_type_uid,
      group_uid,
      organization_uid,
      tenant_uid,
      branch_uid,
      employeeId,
      is_superadmin,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    email,
    password,
    status,
    user_type_uid,
    group_uid,
    organization_uid,
    tenant_uid,
    branch_uid,
    employeeId,
    is_superadmin,
  } = req.body;

  try {
    const userToUpdate = await UsersModel.findByPk(id);

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    userToUpdate.username = username || userToUpdate.username;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.status = status || userToUpdate.status;
    userToUpdate.user_type_uid = user_type_uid || userToUpdate.user_type_uid;
    userToUpdate.group_uid = group_uid || userToUpdate.group_uid;
    userToUpdate.organization_uid = organization_uid || userToUpdate.organization_uid;
    userToUpdate.tenant_uid = tenant_uid || userToUpdate.tenant_uid;
    userToUpdate.branch_uid = branch_uid || userToUpdate.branch_uid;
    userToUpdate.employeeId = employeeId || userToUpdate.employeeId;
    userToUpdate.is_superadmin =
      is_superadmin !== undefined ? is_superadmin : userToUpdate.is_superadmin;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userToUpdate.password = hashedPassword;
    }

    await userToUpdate.save();

    res.status(200).json({
      message: "User updated successfully",
      user: userToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const userToDelete = await UsersModel.findByPk(id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    await userToDelete.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UsersModel.findByPk(id, {
      include: [
        { model: UserTypesModel, as: "user_types" },
        { model: OrganizationModel, as: "organizations" },
        { model: TenantsModel, as: "tenants" },
        { model: BranchModel, as: "branches" },
        { model: EmployeeModel, as: "employee" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalUsers, rows: users } = await UsersModel.findAndCountAll(
      {
        offset,
        limit: parseInt(limit),
        include: [
          { model: UserTypesModel, as: "user_types" },
          { model: OrganizationModel, as: "organizations" },
          { model: TenantsModel, as: "tenants" },
          { model: BranchModel, as: "branches" },
          { model: EmployeeModel, as: "employee" },
        ],
      }
    );

    res.status(200).json({
      totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: error.message });
  }
};

const filterUsers = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalUsers, rows: users } = await UsersModel.findAndCountAll(
      {
        where,
        offset,
        limit: parseInt(limit),
        include: [
          { model: UserTypesModel, as: "user_types" },
          { model: OrganizationModel, as: "organizations" },
          { model: TenantsModel, as: "tenants" },
          { model: BranchModel, as: "branches" },
          { model: EmployeeModel, as: "employee" },
        ],
      }
    );

    res.status(200).json({
      totalUsers,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering users", error: error.message });
  }
};

const exportFilteredUsersToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: users } = await UsersModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: UserTypesModel, as: "user_types" },
        { model: OrganizationModel, as: "organizations" },
        { model: TenantsModel, as: "tenants" },
        { model: BranchModel, as: "branches" },
        { model: EmployeeModel, as: "employee" },
      ],
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found matching the filters",
      });
    }

    const usersData = users.map((user) => {
      return {
        uid: user.uid,
        username: user.username,
        email: user.email,
        status: user.status,
        user_type_uid: user.user_type_uid,
        group_uid: user.group_uid,
        organization_uid: user.organization_uid,
        tenant_uid: user.tenant_uid,
        branch_uid: user.branch_uid,
        employeeId: user.employeeId,
        is_superadmin: user.is_superadmin ? "Yes" : "No",
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(usersData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_users.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting users to CSV:", error);
    res.status(500).json({
      message: "Error exporting users to CSV",
      error: error.message,
    });
  }
};

const exportFilteredUsersToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: users } = await UsersModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        { model: UserTypesModel, as: "user_types" },
        { model: OrganizationModel, as: "organizations" },
        { model: TenantsModel, as: "tenants" },
        { model: BranchModel, as: "branches" },
        { model: EmployeeModel, as: "employee" },
      ],
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users found matching the filters",
      });
    }

    const usersData = users.map((user) => {
      return [
        user.uid || "N/A",
        user.username || "N/A",
        user.email || "N/A",
        user.status || "N/A",
        user.user_type_uid || "N/A",
        user.group_uid || "N/A",
        user.organization_uid || "N/A",
        user.tenant_uid || "N/A",
        user.branch_uid || "N/A",
        user.employeeId || "N/A",
        user.is_superadmin ? "Yes" : "No",
      ];
    });

    const docDefinition = {
      content: [
        { text: "Users Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "User ID",
                "Username",
                "Email",
                "Status",
                "User Type ID",
                "Group ID",
                "Organization ID",
                "Tenant ID",
                "Branch ID",
                "Employee ID",
                "Superadmin",
              ],
              ...usersData,
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
    res.attachment("users_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting users to PDF:", error);
    res.status(500).json({
      message: "Error exporting users to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
  filterUsers,
  exportFilteredUsersToCSV,
  exportFilteredUsersToPDF,
};
