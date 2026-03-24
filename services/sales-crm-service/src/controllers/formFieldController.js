const FormField = require('../models/FormFieldModel');

exports.createFormField = async (req, res) => {
  try {
    const formField = await FormField.create(req.body);
    res.status(201).json(formField);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormFields = async (req, res) => {
  try {
    const formFields = await FormField.findAll();
    res.status(200).json(formFields);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getFormFieldById = async (req, res) => {
  try {
    const formField = await FormField.findByPk(req.params.id);
    if (formField) {
      res.status(200).json(formField);
    } else {
      res.status(404).json({ error: 'FormField not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateFormField = async (req, res) => {
  try {
    const formField = await FormField.findByPk(req.params.id);
    if (formField) {
      await formField.update(req.body);
      res.status(200).json(formField);
    } else {
      res.status(404).json({ error: 'FormField not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteFormField = async (req, res) => {
  try {
    const formField = await FormField.findByPk(req.params.id);
    if (formField) {
      await formField.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'FormField not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};