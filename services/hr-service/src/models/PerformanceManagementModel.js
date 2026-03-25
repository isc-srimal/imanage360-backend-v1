const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); 
const EmployeeModel = require('../models/employees/EmployeeModel');

const PerformanceManagementModel = sequelize.define('tbl_performance_management', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reviewPeriodStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    reviewPeriodEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    goalsAchieved: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    performanceRating: { 
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    managerFeedback: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    PeerFeedback: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    subordinateFeedback: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    trainingNeeds: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    promotionEligibility: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    employeeId: {
        type: DataTypes.INTEGER,
        references: {
            model: EmployeeModel,
            key: 'id',
        },
        allowNull: false,
    },
}, {
    tableName: 'tbl_performance_management',
    timestamps: false,
});

PerformanceManagementModel.belongsTo(EmployeeModel, { foreignKey: 'employeeId', as: 'employee' });
EmployeeModel.hasOne(PerformanceManagementModel, { foreignKey: 'employeeId', as: 'tbl_performance_management' });

module.exports = PerformanceManagementModel;