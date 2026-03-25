const ModulesModel = require("../models/ModulesModel");

const createModule = async (req, res) => {
  const { module, description, permission_name, status } = req.body;

  try {
    const moduleRecord = await ModulesModel.create({
      module,
      description,
      permission_name,
      status: status || "Active",
    });

    res.status(201).json({ message: "Module created successfully", module: moduleRecord });
  } catch (error) {
    res.status(500).json({ message: "Error creating module", error: error.message });
  }
};

const updateModule = async (req, res) => {
  const { id } = req.params;
  const { module, description, permission_name, status } = req.body;

  try {
    const moduleToUpdate = await ModulesModel.findByPk(id);

    if (!moduleToUpdate) {
      return res.status(404).json({ message: "Module not found" });
    }

    moduleToUpdate.module = module || moduleToUpdate.module;
    moduleToUpdate.description = description || moduleToUpdate.description;
    moduleToUpdate.permission_name = permission_name !== undefined ? permission_name : moduleToUpdate.permission_name;
    moduleToUpdate.status = status || moduleToUpdate.status;

    await moduleToUpdate.save();

    res.status(200).json({
      message: "Module updated successfully",
      module: moduleToUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating module", error: error.message });
  }
};

const deleteModule = async (req, res) => {
  const { id } = req.params;

  try {
    const moduleToDelete = await ModulesModel.findByPk(id);

    if (!moduleToDelete) {
      return res.status(404).json({ message: "Module not found" });
    }

    await moduleToDelete.destroy();
    res.status(200).json({ message: "Module deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting module", error: error.message });
  }
};

const getModuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const module = await ModulesModel.findByPk(id);

    if (!module) {
      return res.status(404).json({ message: "Module not found" });
    }

    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving module", error: error.message });
  }
};

const getAllModules = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalModules, rows: modules } = await ModulesModel.findAndCountAll({
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalModules,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalModules / limit),
      modules,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving modules", error: error.message });
  }
};

module.exports = {
  createModule,
  updateModule,
  deleteModule,
  getModuleById,
  getAllModules,
};