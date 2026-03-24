const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const CostCenterIDModel = sequelize.define('tbl_cost_center', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cost_center_name: {
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
    tableName: 'tbl_cost_center',
    timestamps: false,
});

module.exports = CostCenterIDModel;