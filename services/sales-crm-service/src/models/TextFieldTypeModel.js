const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const TextFieldTypeModel = sequelize.define('tbl_text_field_type', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type_name: DataTypes.STRING,
  type_value: DataTypes.STRING
});

module.exports = TextFieldTypeModel;
