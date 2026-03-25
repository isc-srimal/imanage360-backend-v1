const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");
const EmployeeModel = require("../employees/EmployeeModel");
const EmployeePayrollModel = require("../employees/EmployeePayrollModel");

const AirTicketProvisionPolicy = sequelize.define(
  "tbl_air_ticket_policy",
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
    destinationCountry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    adultPackageAmount: {
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
    calculatedTicketEntitlement: {
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
    tableName: "tbl_air_ticket_policy",
    timestamps: false,
  }
);

AirTicketProvisionPolicy.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});
EmployeeModel.hasMany(AirTicketProvisionPolicy, {
  foreignKey: "employeeId",
  as: "tbl_air_ticket_policy",
});

AirTicketProvisionPolicy.belongsTo(EmployeePayrollModel, {
  foreignKey: "employeePayrollId",
  as: "employee_payroll",
});
EmployeePayrollModel.hasMany(AirTicketProvisionPolicy, {
  foreignKey: "employeePayrollId",
  as: "tbl_air_ticket_policy",
});

module.exports = AirTicketProvisionPolicy;
