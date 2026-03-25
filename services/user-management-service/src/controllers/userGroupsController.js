const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");
const UserGroupsModel = require("../models/UserGroupsModel");
const RolesModel = require("../models/RolesModel");
const fs = require("fs");
const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createUserGroup = async (req, res) => {
  const { group_name, description, user_uid, role_uid, status } = req.body;

  try {

    const userGroup = await UserGroupsModel.create({
      group_name,
      description,
      user_uid,
      role_uid,
      status,
    });

    res
      .status(201)
      .json({ message: "User group created successfully", userGroup });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user group", error: error.message });
  }
};

const updateUserGroup = async (req, res) => {
  const { id } = req.params;
  const { group_name, description, user_uid, role_uid, status } = req.body;

  try {
    const userGroupToUpdate = await UserGroupsModel.findByPk(id);

    if (!userGroupToUpdate) {
      return res.status(404).json({ message: "User group not found" });
    }

    userGroupToUpdate.group_name = group_name || userGroupToUpdate.group_name;
    userGroupToUpdate.description = description || userGroupToUpdate.description;
    userGroupToUpdate.user_uid = user_uid || userGroupToUpdate.user_uid;
    userGroupToUpdate.role_uid = role_uid || userGroupToUpdate.role_uid;
    userGroupToUpdate.status = status || userGroupToUpdate.status;

    await userGroupToUpdate.save();

    res.status(200).json({
      message: "User group updated successfully",
      userGroup: userGroupToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user group", error: error.message });
  }
};

const deleteUserGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const userGroupToDelete = await UserGroupsModel.findByPk(id);

    if (!userGroupToDelete) {
      return res.status(404).json({ message: "User group not found" });
    }

    await userGroupToDelete.destroy();
    res.status(200).json({ message: "User group deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user group", error: error.message });
  }
};

const getUserGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userGroup = await UserGroupsModel.findByPk(id, {
    });

    if (!userGroup) {
      return res.status(404).json({ message: "User group not found" });
    }

    res.status(200).json(userGroup);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user group", error: error.message });
  }
};

const getAllUserGroups = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalUserGroups, rows: userGroups } =
      await UserGroupsModel.findAndCountAll({
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalUserGroups,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUserGroups / limit),
      userGroups,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving user groups", error: error.message });
  }
};

const filterUserGroups = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { count: totalUserGroups, rows: userGroups } =
      await UserGroupsModel.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
      });

    res.status(200).json({
      totalUserGroups,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUserGroups / limit),
      userGroups,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering user groups", error: error.message });
  }
};

const exportFilteredUserGroupsToCSV = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: userGroups } = await UserGroupsModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    if (!userGroups || userGroups.length === 0) {
      return res.status(404).json({
        message: "No user groups found matching the filters",
      });
    }

    const userGroupsData = userGroups.map((group) => {
      return {
        uid: group.uid,
        group_name: group.group_name,
        description: group.description,
        user_uid: group.user_uid,
        role_Uid: group.role_uid,
        status: group.status,
        created_at: group.created_at,
        updated_at: group.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(userGroupsData);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_user_groups.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting user groups to CSV:", error);
    res.status(500).json({
      message: "Error exporting user groups to CSV",
      error: error.message,
    });
  }
};

const exportFilteredUserGroupsToPDF = async (req, res) => {
  try {
    const { status = "All", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};
    if (status !== "All") {
      where["status"] = status;
    }

    const { rows: userGroups } = await UserGroupsModel.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
    });

    // Define font paths
    const fonts = {
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
      },
    };

    // Verify font files exist
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
    if (!userGroups || userGroups.length === 0) {
      docDefinition = {
        content: [{ text: "No user groups found matching the filters", style: "header" }],
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
      const userGroupsData = userGroups.map((group) => {
        return [
          String(group.uid ?? "N/A"),
          String(group.group_name ?? "N/A"),
          String(group.description ?? "N/A"),
          String(group.user_uid ?? "N/A"),
          String(group.role_uid ?? "N/A"),
          String(group.status ?? "N/A"),
          String(group.created_at ?? "N/A"),
          String(group.updated_at ?? "N/A"),
        ];
      });

      docDefinition = {
        content: [
          { text: "User Groups Data", style: "header" },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*", "*", "*", "*", "*", "*", "*"],
              body: [
                [
                  "Group ID",
                  "Group Name",
                  "Description",
                  "User ID",
                  "Role ID",
                  "Status",
                  "Created At",
                  "Updated At",
                ],
                ...userGroupsData,
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
    res.attachment("user_groups_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting user groups to PDF:", error);
    res.status(500).json({
      message: "Error exporting user groups to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createUserGroup,
  updateUserGroup,
  deleteUserGroup,
  getUserGroupById,
  getAllUserGroups,
  filterUserGroups,
  exportFilteredUserGroupsToCSV,
  exportFilteredUserGroupsToPDF,
};
