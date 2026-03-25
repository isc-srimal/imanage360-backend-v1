const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EmployeeModel = require("../models/employees/EmployeeModel");
const EmployeePayrollModel = require("../models/employees/EmployeePayrollModel");

const GratuityModel = sequelize.define(
  "tbl_gratuity",
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
    yearsOfService: {
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
    calculatedGratuity: {
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
    tableName: "tbl_gratuity",
    timestamps: false,
  }
);

GratuityModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});
EmployeeModel.hasMany(GratuityModel, {
  foreignKey: "employeeId",
  as: "tbl_gratuity",
});

GratuityModel.belongsTo(EmployeePayrollModel, {
  foreignKey: "employeePayrollId",
  as: "employee_payroll",
});
EmployeePayrollModel.hasMany(GratuityModel, {
  foreignKey: "employeePayrollId",
  as: "tbl_gratuity",
});

module.exports = GratuityModel;
