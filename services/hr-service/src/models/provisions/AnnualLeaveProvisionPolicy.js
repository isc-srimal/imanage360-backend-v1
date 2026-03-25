const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");
const EmployeeModel = require("../employees/EmployeeModel");
const EmployeePayrollModel = require("../employees/EmployeePayrollModel");

const AnnualLeaveProvisionPolicy = sequelize.define(
  "tbl_annual_leave_policy",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    employeeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    basicSalary: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    annualLeaveCount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    monthlyProvision: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    accumulatedProvision: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    calculatedLeaveEntitlement: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provisionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeeModel,
        key: "id",
      },
      allowNull: false,
    },
    employeePayrollId: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeePayrollModel,
        key: "id",
      },
      allowNull: true,
    },
  },
  {
    tableName: "tbl_annual_leave_policy",
    timestamps: false,
  }
);

AnnualLeaveProvisionPolicy.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});
EmployeeModel.hasMany(AnnualLeaveProvisionPolicy, {
  foreignKey: "employeeId",
  as: "tbl_annual_leave_policy",
});

AnnualLeaveProvisionPolicy.belongsTo(EmployeePayrollModel, {
  foreignKey: "employeePayrollId",
  as: "employee_payroll",
});
EmployeePayrollModel.hasMany(AnnualLeaveProvisionPolicy, {
  foreignKey: "employeePayrollId",
  as: "tbl_annual_leave_policy",
});

module.exports = AnnualLeaveProvisionPolicy;
