const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EmployeeModel = require("./employees/EmployeeModel");

const TrainingAndDevelopmentModel = sequelize.define(
  "tbl_training_and_development",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trainingProgramName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trainingStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trainingEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    trainingStatus: {
      type: DataTypes.ENUM("completed", "in-progress", "scheduled"),
      allowNull: false,
    },
    trainerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificationReceived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    certificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trainingEvaluation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    trainingMaterials: {
      type: DataTypes.JSON, 
      allowNull: false,
      defaultValue: [],
    },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: EmployeeModel,
        key: "id",
      },
      allowNull: false,
    },
    progressUpdateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_training_and_development",
    timestamps: false,
  }
);

TrainingAndDevelopmentModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});
EmployeeModel.hasOne(TrainingAndDevelopmentModel, {
  foreignKey: "employeeId",
  as: "tbl_training_and_development",
});

module.exports = TrainingAndDevelopmentModel;