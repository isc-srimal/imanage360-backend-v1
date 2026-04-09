// models/DepartmentModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const DepartmentModel = sequelize.define('tbl_department', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    departmentNo: { type: DataTypes.INTEGER, allowNull: false },
    departmentName: { type: DataTypes.STRING, allowNull: false, unique: true },
    departmentDescription: { type: DataTypes.STRING, allowNull: false },
    departmentHead: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    createdBy: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM('Active', 'Inactive'), allowNull: false, defaultValue: 'Active' },
}, {
    tableName: 'tbl_department',
    timestamps: false,
});

module.exports = DepartmentModel;