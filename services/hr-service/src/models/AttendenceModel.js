const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); 
const EmployeeModel = require('../models/employees/EmployeeModel');

const AttendenceModel = sequelize.define('tbl_attendence', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clockInTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    clockOutTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    remarks: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('present', 'absent', 'late', 'half-day', 'clocked Out'),
        allowNull: false,
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
    tableName: 'tbl_attendence',
    timestamps: false,
});

AttendenceModel.belongsTo(EmployeeModel, { foreignKey: 'employeeId', as: 'employee' });
EmployeeModel.hasMany(AttendenceModel, { foreignKey: 'employeeId', as: 'tbl_attendence' });

module.exports = AttendenceModel;