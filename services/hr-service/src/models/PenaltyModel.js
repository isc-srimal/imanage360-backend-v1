const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const EmployeeModel = require('../models/employees/EmployeeModel');

const PenaltyModel = sequelize.define('tbl_penalty', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  penaltyType: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  penaltyAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  monthlyDeduction: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  deductionStartMonth: {
    type: DataTypes.STRING, 
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING, 
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
  tableName: 'tbl_penalty',
  timestamps: false,
});

PenaltyModel.belongsTo(EmployeeModel, { foreignKey: 'employeeId', as: 'employee' });
EmployeeModel.hasMany(PenaltyModel, { foreignKey: 'employeeId', as: 'tbl_penalty' });

module.exports = PenaltyModel;