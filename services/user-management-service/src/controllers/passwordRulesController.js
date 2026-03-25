const PasswordRulesModel = require("../models/PasswordRulesModel");
const UserTypeModel = require("../models/UserTypesModel");

const createPasswordRule = async (req, res) => {
  const { user_type_uid, min_length, complexity_requirements, expiration_days, max_attempt } = req.body;

  try {
    const passwordRuleRecord = await PasswordRulesModel.create({
      user_type_uid,
      min_length,
      complexity_requirements,
      expiration_days,
      max_attempt,
    });

    res.status(201).json({ 
      message: "Password rule created successfully", 
      passwordRule: passwordRuleRecord 
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error creating password rule", 
      error: error.message 
    });
  }
};

const updatePasswordRule = async (req, res) => {
  const { id } = req.params;
  const { user_type_uid, min_length, complexity_requirements, expiration_days, max_attempt } = req.body;

  try {
    const passwordRuleToUpdate = await PasswordRulesModel.findByPk(id);

    if (!passwordRuleToUpdate) {
      return res.status(404).json({ message: "Password rule not found" });
    }

    passwordRuleToUpdate.user_type_uid = user_type_uid || passwordRuleToUpdate.user_type_uid;
    passwordRuleToUpdate.min_length = min_length || passwordRuleToUpdate.min_length;
    passwordRuleToUpdate.complexity_requirements = complexity_requirements || passwordRuleToUpdate.complexity_requirements;
    passwordRuleToUpdate.expiration_days = expiration_days || passwordRuleToUpdate.expiration_days;
    passwordRuleToUpdate.max_attempt = max_attempt || passwordRuleToUpdate.max_attempt;

    await passwordRuleToUpdate.save();

    res.status(200).json({
      message: "Password rule updated successfully",
      passwordRule: passwordRuleToUpdate,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating password rule", 
      error: error.message 
    });
  }
};

const deletePasswordRule = async (req, res) => {
  const { id } = req.params;

  try {
    const passwordRuleToDelete = await PasswordRulesModel.findByPk(id);

    if (!passwordRuleToDelete) {
      return res.status(404).json({ message: "Password rule not found" });
    }

    await passwordRuleToDelete.destroy();
    res.status(200).json({ message: "Password rule deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting password rule", 
      error: error.message 
    });
  }
};

const getPasswordRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const passwordRule = await PasswordRulesModel.findByPk(id, {
      include: [{ model: UserTypeModel, as: 'user_types' }],
    });

    if (!passwordRule) {
      return res.status(404).json({ message: "Password rule not found" });
    }

    res.status(200).json(passwordRule);
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving password rule", 
      error: error.message 
    });
  }
};

const getAllPasswordRules = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalPasswordRules, rows: passwordRules } = await PasswordRulesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
      include: [{ model: UserTypeModel, as: 'user_types' }]
    });

    res.status(200).json({
      totalPasswordRules,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalPasswordRules / limit),
      passwordRules,
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving password rules", 
      error: error.message 
    });
  }
};

module.exports = {
  createPasswordRule,
  updatePasswordRule,
  deletePasswordRule,
  getPasswordRuleById,
  getAllPasswordRules,
};