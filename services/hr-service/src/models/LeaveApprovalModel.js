const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); 
const EmployeeModel = require('../models/employees/EmployeeModel');

const LeaveApprovalModel = sequelize.define('tbl_leave_approval', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fromDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    toDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    appliedDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    medicalReport: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    leaveType: {
        type: DataTypes.ENUM('Casual', 'Annual', 'Medical'),
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Approved', 'Pending', 'Rejected'),
        allowNull: false,
        defaultValue: 'Pending',
    },
    checkedBy: { 
        type: DataTypes.STRING,
        allowNull: true,
    },
    employeeId: {
        type: DataTypes.INTEGER,
        references: {
            model: EmployeeModel,
            key: 'id',
        },
        allowNull: true,
    },
}, {
    tableName: 'tbl_leave_approval',
    timestamps: false,
});

LeaveApprovalModel.belongsTo(EmployeeModel, { foreignKey: 'employeeId', as: 'employee' });
EmployeeModel.hasMany(LeaveApprovalModel, { foreignKey: 'employeeId', as: 'tbl_leave_approval' });

module.exports = LeaveApprovalModel;