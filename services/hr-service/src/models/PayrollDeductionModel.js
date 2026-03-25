const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");

const PayrollDeduction = sequelize.define("tbl_payroll_deductions", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: {
    type: DataTypes.ENUM("loan", "penalty"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.ENUM("deduct_now", "carry_forward"),
    defaultValue: "deduct_now",
    allowNull: false,
  },
}, {
  tableName: "tbl_payroll_deductions",
  timestamps: false,
});

module.exports = PayrollDeduction;
