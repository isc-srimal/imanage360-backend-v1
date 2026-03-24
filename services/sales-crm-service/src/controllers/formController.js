const Form = require("../models/FormModel");
const SalesPipelineModel = require("../models/SalesPipelineModel");
const FormFieldModel = require("../models/FormFieldModel");
const TextFieldTypeModel = require("../models/TextFieldTypeModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const { Op } = require("sequelize");

exports.createForm = async (req, res) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getForms = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } }, // Use `like` instead of `iLike`
            { "$salesPipeline.name$": { [Op.like]: `%${search}%` } }, // Search in sales pipeline name
          ],
        }
      : {};

    const { count: totalForms, rows: forms } = await Form.findAndCountAll({
      where: whereCondition,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: SalesPipelineModel,
          attributes: ["name"],
          as: "salesPipeline",
        },
        {
          model: EmployeeModel,
          as: "leadAssigneeEmployee",
        },
      ],
    });

    res.status(200).json({
      totalForms,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalForms / limit),
      forms,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id, {
      include: [
        {
          model: SalesPipelineModel,
          attributes: ["name"],
          as: "salesPipeline",
        },
        {
          model: FormFieldModel,
          as: "formFields",
          include: [
            {
              model: TextFieldTypeModel,
              as: "textFieldType",
              attributes: ["type_name", "type_value"],
            },
          ],
        },
        {
          model: EmployeeModel,
          as: "leadAssigneeEmployee",
        },
      ],
    });
    if (form) {
      res.status(200).json(form);
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      await form.update(req.body);
      res.status(200).json(form);
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByPk(req.params.id);
    if (form) {
      await form.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: "Form not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormByFormUniqueId = async (req, res) => {
  try {
    const { form_unique_id } = req.params;

    const form = await Form.findOne({
      where: { 
        form_unique_id,
        form_status: 'active',
        is_published: true
      },
      include: [
        {
          model: SalesPipelineModel,
          attributes: ["name"],
          as: "salesPipeline",
        },
        {
          model: FormFieldModel,
          as: "formFields",
          include: [
            {
              model: TextFieldTypeModel,
              as: "textFieldType",
              attributes: ["type_name", "type_value"],
            },
          ],
        },
        {
          model: EmployeeModel,
          as: "leadAssigneeEmployee",
        },
      ],
    });

    if (form) {
      res.status(200).json(form);
    } else {
      res.status(404).json({ error: "Form not found or not published" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};