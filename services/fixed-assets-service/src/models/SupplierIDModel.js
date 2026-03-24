const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const SupplierIDModel = sequelize.define('tbl_supplier', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    supplier_name: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_supplier',
    timestamps: false,
});

module.exports = SupplierIDModel;