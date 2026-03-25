const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); 
const EmployeeModel = require('../models/employees/EmployeeModel');

const LeaveRequestModel = sequelize.define('tbl_leave_request', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    leaveStartDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    leaveEndDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    leaveType: {
        type: DataTypes.ENUM('sick', 'casual', 'vacation', 'unpaid'),
        allowNull: false,
    },
    medicalReport: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('approved', 'pending', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
    },
    approvedBy: { // HR or Reporting Manager
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    approvalDate: { // Date when leave is approved/rejected
        type: DataTypes.DATE,
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
    tableName: 'tbl_leave_request',
    timestamps: false,
});

LeaveRequestModel.belongsTo(EmployeeModel, { foreignKey: 'employeeId', as: 'employee' });
EmployeeModel.hasMany(LeaveRequestModel, { foreignKey: 'employeeId', as: 'tbl_leave_request' });

module.exports = LeaveRequestModel;