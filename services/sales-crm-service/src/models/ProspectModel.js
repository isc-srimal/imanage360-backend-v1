const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const ProspectModel = sequelize.define('tbl_prospects', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  phone: DataTypes.DOUBLE,
  email: DataTypes.STRING,
  city: DataTypes.STRING,
  country_id: DataTypes.INTEGER,
  industry_id: DataTypes.INTEGER,
});

module.exports = ProspectModel;