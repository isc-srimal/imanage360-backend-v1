const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const FormModel = require('./FormModel');

const SalesPipelineModel = sequelize.define('tbl_sales_pipelines', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { 
    type: DataTypes.STRING,
    unique: true, 
    allowNull: false 
  },
  description: DataTypes.STRING,
});

SalesPipelineModel.hasMany(FormModel, {
  foreignKey: 'sales_pipeline_id',
  as: 'forms'
});

FormModel.belongsTo(SalesPipelineModel, {
  foreignKey: 'sales_pipeline_id',
  as: 'salesPipeline'
});

module.exports = SalesPipelineModel;