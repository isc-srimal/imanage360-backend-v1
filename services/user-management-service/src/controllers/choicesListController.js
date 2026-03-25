const UserRole = require('../models/UserRoleModel');
const TextFieldType = require('../../../sales-crm-service/src/models/TextFieldTypeModel');

// Get All Users with Pagination Controller
const getUserRolesList = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalRoles, rows: userRoles } = await UserRole.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalRoles,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalRoles / limit),
      userRoles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving User Roles', error: error.message });
  }
};

const getAllTextFieldTypeList = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalTypes, rows: textFieldTypes } = await TextFieldType.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalTypes,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalTypes / limit),
      textFieldTypes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving Text Field Types', error: error.message });
  }
};

module.exports = { 
  getUserRolesList,
  getAllTextFieldTypeList 
};