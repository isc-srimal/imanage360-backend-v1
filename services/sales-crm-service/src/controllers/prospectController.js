const Prospect = require('../models/ProspectModel');

exports.createProspect = async (req, res) => {
  try {
    const prospect = await Prospect.create(req.body);
    res.status(201).json(prospect);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProspects = async (req, res) => {
  try {
    const prospects = await Prospect.findAll();
    res.status(200).json(prospects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProspectById = async (req, res) => {
  try {
    const prospect = await Prospect.findByPk(req.params.id);
    if (prospect) {
      res.status(200).json(prospect);
    } else {
      res.status(404).json({ error: 'Prospect not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findByPk(req.params.id);
    if (prospect) {
      await prospect.update(req.body);
      res.status(200).json(prospect);
    } else {
      res.status(404).json({ error: 'Prospect not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProspect = async (req, res) => {
  try {
    const prospect = await Prospect.findByPk(req.params.id);
    if (prospect) {
      await prospect.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Prospect not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};