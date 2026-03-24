const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const ManufacturerModel = sequelize.define('tbl_asset_manufacturer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_asset_manufacturer',
    timestamps: true,
});

module.exports = ManufacturerModel;