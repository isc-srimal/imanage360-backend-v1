const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const DepartmentModel = require('../models/DepartmentModel');

const DesignationModel = sequelize.define('tbl_designation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    designationName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designationNameArabic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designationdescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
    departmentId: {
        type: DataTypes.INTEGER,
        references: {
            model: DepartmentModel,  
            key: 'id',  
        },
        allowNull: false,
    },
}, {
    tableName: 'tbl_designation',
    timestamps: false,
});

DesignationModel.belongsTo(DepartmentModel, { foreignKey: 'departmentId', as: 'department' });
DepartmentModel.hasMany(DesignationModel, { foreignKey: 'departmentId', as: 'tbl_designation' });

module.exports = DesignationModel;