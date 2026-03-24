const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const SalesPipelineModel = require('./SalesPipelineModel'); 

const PipelineStageModel = sequelize.define('tbl_pipeline_stages', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  stage_name: { type: DataTypes.STRING, allowNull: false },
  closure_percentage: { type: DataTypes.INTEGER, allowNull: false },
  sales_pipeline_id: {
    type: DataTypes.INTEGER,
    references: {
      model: SalesPipelineModel,
      key: 'id'
    },
    onDelete: 'CASCADE',
  },
});

SalesPipelineModel.hasMany(PipelineStageModel, {
  foreignKey: 'sales_pipeline_id',
  as: 'stages',
  onDelete: 'CASCADE',
});
PipelineStageModel.belongsTo(SalesPipelineModel, {
  foreignKey: 'sales_pipeline_id',
});

module.exports = PipelineStageModel;
