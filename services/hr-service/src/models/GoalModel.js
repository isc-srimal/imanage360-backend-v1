const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EmployeeModel = require("../models/employees/EmployeeModel");

const GoalModel = sequelize.define(
  "tbl_goals",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goalName: {
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
    goalStatus: {
      type: DataTypes.ENUM("Not Started", "In Progress", "Completed"),
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
    tableName: "tbl_goals",
    timestamps: false,
  }
);

GoalModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});
EmployeeModel.hasOne(GoalModel, { foreignKey: "employeeId", as: "tbl_goals" });

module.exports = GoalModel;