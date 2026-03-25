const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const IndustryModel = sequelize.define('tbl_industry', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    industry: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_industry',
    timestamps: false,
});

module.exports = IndustryModel;