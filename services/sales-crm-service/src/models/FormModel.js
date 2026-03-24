const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const FormFieldModel = require('./FormFieldModel');
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

const FormModel = sequelize.define('tbl_forms', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  logo: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  name: DataTypes.STRING,
  submit_message: DataTypes.STRING,
  reply_to_email: DataTypes.STRING,
  email_template_id: DataTypes.STRING,
  lead_assignee: DataTypes.STRING,
  lead_assignee_id: { 
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tbl_employees',
      key: 'id'
    }
  },
  form_unique_id: DataTypes.STRING,
  redirect_link: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isValidUrl(value) {
        if (value && value.trim() !== '') {
          try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
              throw new Error('Redirect URL must use HTTP or HTTPS protocol');
            }
          } catch (error) {
            throw new Error('Redirect URL must be a valid URL (e.g., https://www.example.com)');
          }
        }
      }
    }
  },
  url_label: DataTypes.STRING,
  theme: DataTypes.STRING,
  show_reference_branding: DataTypes.STRING,
  form_status: DataTypes.STRING,
  is_published: DataTypes.BOOLEAN,
  created_by: DataTypes.STRING,
  sales_pipeline_id: DataTypes.INTEGER,
});

FormModel.hasMany(FormFieldModel, {
  foreignKey: 'forms_id',
  as: 'formFields'
});

FormModel.belongsTo(EmployeeModel, {
  foreignKey: 'lead_assignee_id',
  as: 'leadAssigneeEmployee',
  constraints: false 
});

module.exports = FormModel;