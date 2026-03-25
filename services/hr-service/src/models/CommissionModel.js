const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const PayrollModel = require("../models/PayrollModel");
const EmployeeModel = require("../models/employees/EmployeeModel");

const CommissionModel = sequelize.define(
  "tbl_commission",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payrollId: {
      type: DataTypes.INTEGER,
      references: {
        model: PayrollModel,
        key: "id",
      },
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeeModel,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "tbl_commission",
    timestamps: false,
  }
);

CommissionModel.belongsTo(PayrollModel, {
  foreignKey: "payrollId",
  as: "payrolls",
});
PayrollModel.hasMany(CommissionModel, {
  foreignKey: "payrollId",
  as: "tbl_commission",
});

CommissionModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});

EmployeeModel.hasMany(CommissionModel, {
  foreignKey: "employeeId",
  as: "tbl_commission",
});

module.exports = CommissionModel;
