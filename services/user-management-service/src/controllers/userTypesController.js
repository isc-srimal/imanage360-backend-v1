const UserTypesModel = require("../models/UserTypesModel");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const path = require("path");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

const createUserType = async (req, res) => {
  const { user_type, description } = req.body;

  try {
    const userTypeRecord = await UserTypesModel.create({
      user_type,
      description,
    });

    res.status(201).json({ message: "User type created successfully", userType: userTypeRecord });
  } catch (error) {
    res.status(500).json({ message: "Error creating user type", error: error.message });
  }
};

const updateUserType = async (req, res) => {
  const { id } = req.params;
  const { user_type, description } = req.body;

  try {
    const userTypeToUpdate = await UserTypesModel.findByPk(id);

    if (!userTypeToUpdate) {
      return res.status(404).json({ message: "User type not found" });
    }

    userTypeToUpdate.user_type = user_type || userTypeToUpdate.user_type;
    userTypeToUpdate.description = description || userTypeToUpdate.description;

    await userTypeToUpdate.save();

    res.status(200).json({
      message: "User type updated successfully",
      userType: userTypeToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating user type", error: error.message });
  }
};

const deleteUserType = async (req, res) => {
  const { id } = req.params;

  try {
    const userTypeToDelete = await UserTypesModel.findByPk(id);

    if (!userTypeToDelete) {
      return res.status(404).json({ message: "User type not found" });
    }

    await userTypeToDelete.destroy();
    res.status(200).json({ message: "User type deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user type", error: error.message });
  }
};

const getUserTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const userType = await UserTypesModel.findByPk(id);

    if (!userType) {
      return res.status(404).json({ message: "User type not found" });
    }

    res.status(200).json(userType);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user type", error: error.message });
  }
};

const getAllUserTypes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalUserTypes, rows: userTypes } = await UserTypesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalUserTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalUserTypes / limit),
      userTypes,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user types", error: error.message });
  }
};

const exportUserTypesToCSV = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: userTypes } = await UserTypesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    if (!userTypes || userTypes.length === 0) {
      return res.status(404).json({
        message: "No user types found",
      });
    }

    const userTypesData = userTypes.map((userType) => {
      return {
        uid: userType.uid,
        user_type: userType.user_type,
        description: userType.description,
        created_at: userType.created_at,
        updated_at: userType.updated_at,
      };
    });

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(userTypesData);

    res.header("Content-Type", "text/csv");
    res.attachment("user_types.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting user types to CSV:", error);
    res.status(500).json({
      message: "Error exporting user types to CSV",
      error: error.message,
    });
  }
};

const exportUserTypesToPDF = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { rows: userTypes } = await UserTypesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    if (!userTypes || userTypes.length === 0) {
      return res.status(404).json({
        message: "No user types found",
      });
    }

    const userTypesData = userTypes.map((userType) => {
      return [
        userType.uid || "N/A",
        userType.user_type || "N/A",
        userType.description || "N/A",
        userType.created_at || "N/A",
        userType.updated_at || "N/A",
      ];
    });

    const docDefinition = {
      content: [
        { text: "User Types Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*", "*"],
            body: [
              [
                "User Type ID",
                "User Type",
                "Description",
                "Created At",
                "Updated At",
              ],
              ...userTypesData,
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
    res.attachment("user_types_data.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting user types to PDF:", error);
    res.status(500).json({
      message: "Error exporting user types to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  createUserType,
  updateUserType,
  deleteUserType,
  getUserTypeById,
  getAllUserTypes,
  exportUserTypesToCSV,
  exportUserTypesToPDF,
};