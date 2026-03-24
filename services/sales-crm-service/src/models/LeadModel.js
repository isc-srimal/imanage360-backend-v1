const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const SalesPipelineModel = require('./SalesPipelineModel');
const PipelineStageModel = require('./PipelineStageModel');
const EmployeeModel = sequelize.define('tbl_employees', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    tableName: 'tbl_employees',
    timestamps: false,
});

const LeadModel = sequelize.define('tbl_leads', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  designation: DataTypes.STRING,
  lead_subject: DataTypes.STRING,
  additional_desc: DataTypes.TEXT,
  label_id: DataTypes.STRING,
  custom_field: DataTypes.STRING,
  sales_pipeline_id: DataTypes.INTEGER,
  pipeline_stages_id: DataTypes.INTEGER,
  prospect_id: DataTypes.INTEGER,
  sales_person: DataTypes.STRING, // This will store the employee's full name
  sales_person_id: { // Optional: if you want to also store the employee ID
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tbl_employees',
      key: 'id'
    }
  },
  lead_source: { // Add this new field
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Website'
  }
});

LeadModel.belongsTo(SalesPipelineModel, {
  foreignKey: 'sales_pipeline_id',
  as: 'salesPipeline'
});

LeadModel.belongsTo(PipelineStageModel, {
  foreignKey: 'pipeline_stages_id',
  as: 'pipelineStage'
});

LeadModel.belongsTo(EmployeeModel, {
  foreignKey: 'sales_person_id',
  as: 'salesPersonEmployee',
  constraints: false // Since this is optional
});

module.exports = LeadModel;