const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EmployeeModel = require("../models/employees/EmployeeModel");

const PayrollModel = sequelize.define(
  "tbl_payroll",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    month: { type: DataTypes.INTEGER, allowNull: true },
    year: { type: DataTypes.INTEGER, allowNull: true },
    salaryAmount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    accommodationAllowance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    foodAllowance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    transportationAllowance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    nationalAccreditationBonus: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    natureOfWorkAllowance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    socialBonus: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    relocationAllowance: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    otherBonuses: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    deductions: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    totalSalary: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isApproved: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: true,
      defaultValue: "pending",
    },
    status: {
      type: DataTypes.ENUM("Locked"),
      allowNull: false,
      defaultValue: "Locked",
    },
    approvedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    approvalDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeeModel,
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "tbl_payroll",
    timestamps: false,
  }
);

PayrollModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});

EmployeeModel.hasMany(PayrollModel, {
  foreignKey: "employeeId",
  as: "tbl_payroll",
});

module.exports = PayrollModel;
