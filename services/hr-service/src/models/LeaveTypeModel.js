const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const LeaveTypeModel = sequelize.define('tbl_leave_type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    leaveTypeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leaveTypeNameArabic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numberOfLeavePerMonth: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numberOfLeavePerYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    employeeType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    leaveType: {
        type: DataTypes.ENUM('Paid-Leave', 'Non-Paid-Leave'),
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
}, {
    tableName: 'tbl_leave_type',
    timestamps: false,
});

module.exports = LeaveTypeModel;