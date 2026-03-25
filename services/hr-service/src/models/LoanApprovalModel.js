const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const EmployeeModel = require('../models/employees/EmployeeModel');

const LoanApprovalModel = sequelize.define('tbl_loan_approval', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  loanAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  loanType: {
    type: DataTypes.ENUM('personal', 'home', 'education', 'vehicle', 'emergency'),
    allowNull: false,
  },
  loanTerm: { 
    type: DataTypes.INTEGER,
    allowNull: false,
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
  approvedBy: { 
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  approvalDate: { 
    type: DataTypes.DATE,
    allowNull: true,
  },
  monthlyDeduction: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  deductionStartMonth: {
    type: DataTypes.STRING, 
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
  tableName: 'tbl_loan_approval',
  timestamps: false,
});

LoanApprovalModel.belongsTo(EmployeeModel, { foreignKey: 'employeeId', as: 'employee' });
EmployeeModel.hasMany(LoanApprovalModel, { foreignKey: 'employeeId', as: 'tbl_loan_approval' });

module.exports = LoanApprovalModel;