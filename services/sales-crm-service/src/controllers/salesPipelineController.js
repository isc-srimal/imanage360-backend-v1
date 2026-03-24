const SalesPipeline = require('../models/SalesPipelineModel');
const PipelineStage = require('../models/PipelineStageModel'); 

exports.createSalesPipeline = async (req, res) => {
  const { name, description, stages } = req.body;
  
  try {
    const existingPipeline = await SalesPipeline.findOne({ where: { name } });
    
    if (existingPipeline) {
      return res.status(400).json({ 
        error: "This pipeline already exists",
        message: "A pipeline with this name already exists. Please use a different name." 
      });
    }

    const salesPipeline = await SalesPipeline.create(
      { name, description, stages },
      { include: [{ model: PipelineStage, as: 'stages' }] }
    );
    
    res.status(201).json(salesPipeline);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        error: "This pipeline already exists",
        message: "A pipeline with this name already exists. Please use a different name." 
      });
    }
    
    res.status(400).json({ error: error.message });
  }
};

exports.getSalesPipelines = async (req, res) => {
  try {
    const salesPipelines = await SalesPipeline.findAll({
      include: [{ model: PipelineStage, as: 'stages' }] 
    });
    res.status(200).json(salesPipelines);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSalesPipelineById = async (req, res) => {
  try {
    const salesPipeline = await SalesPipeline.findByPk(req.params.id, {
      include: [{ model: PipelineStage, as: 'stages' }]
    });
    if (salesPipeline) {
      res.status(200).json(salesPipeline);
    } else {
      res.status(404).json({ error: 'SalesPipeline not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSalesPipeline = async (req, res) => {
  const { stages, ...pipelineData } = req.body; 
  try {
    const salesPipeline = await SalesPipeline.findByPk(req.params.id, {
      include: [{ model: PipelineStage, as: 'stages' }]
    });

    if (!salesPipeline) {
      return res.status(404).json({ error: 'SalesPipeline not found' });
    }

    await salesPipeline.update(pipelineData);

    if (stages && stages.length > 0) {
      const existingStageIds = salesPipeline.stages.map(stage => stage.id);

      const processedStageIds = [];

      for (let stage of stages) {
        if (stage.id) {
          const existingStage = await PipelineStage.findOne({
            where: {
              id: stage.id,
              sales_pipeline_id: salesPipeline.id
            }
          });
          
          if (existingStage) {
            await existingStage.update(stage);
            processedStageIds.push(stage.id);
          } else {
            await PipelineStage.create({
              ...stage,
              id: undefined, 
              sales_pipeline_id: salesPipeline.id
            });
          }
        } else {
          await PipelineStage.create({
            ...stage,
            sales_pipeline_id: salesPipeline.id
          });
        }
      }

      const stagesToDelete = existingStageIds.filter(id => !processedStageIds.includes(id));
      if (stagesToDelete.length > 0) {
        await PipelineStage.destroy({
          where: {
            id: stagesToDelete,
            sales_pipeline_id: salesPipeline.id
          }
        });
      }
    }

    const updatedPipeline = await SalesPipeline.findByPk(req.params.id, {
      include: [{ model: PipelineStage, as: 'stages' }]
    });

    res.status(200).json(updatedPipeline);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSalesPipeline = async (req, res) => {
  try {
     const salesPipeline = await SalesPipeline.findByPk(req.params.id, {
      include: [{ model: PipelineStage, as: 'stages' }]
    });
    if (salesPipeline) { 
      await salesPipeline.destroy();
      res.status(200).json({ message: 'SalesPipeline deleted successfully'});
    } else {
      res.status(404).json({ error: 'SalesPipeline not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};