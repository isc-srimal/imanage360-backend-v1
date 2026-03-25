const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); 

const SettingsModel = sequelize.define("tbl_settings", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
    tableName: 'tbl_settings',
    timestamps: false,
});

module.exports = SettingsModel;