const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EmployeeModel = require("../models/employees/EmployeeModel");

const KPIModel = sequelize.define(
  "tbl_kpis",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kpiName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    achievedValue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    kpiStatus: {
      type: DataTypes.ENUM("Not Achieved", "Achieved"),
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
  },
  {
    tableName: "tbl_kpis",
    timestamps: false,
  }
);

KPIModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});
EmployeeModel.hasOne(KPIModel, { foreignKey: "employeeId", as: "tbl_kpis" });

module.exports = KPIModel;
