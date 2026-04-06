const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const TextFieldTypeModel = require('./TextFieldTypeModel');

const FormFieldModel = sequelize.define('tbl_form_fields', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  field_name: DataTypes.STRING,
  is_mandatory: DataTypes.BOOLEAN,
  is_hidden: DataTypes.BOOLEAN,
  label: DataTypes.STRING,
  placeholder_text: DataTypes.STRING,
  help_text: DataTypes.STRING,
  is_custom_field: DataTypes.BOOLEAN,
  forms_id: DataTypes.INTEGER,
  forms_sales_pipeline_id: DataTypes.INTEGER,
  text_field_type_id: DataTypes.INTEGER,
});

FormFieldModel.belongsTo(TextFieldTypeModel, {
  foreignKey: 'text_field_type_id',
  as: 'textFieldType',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
});

module.exports = FormFieldModel;