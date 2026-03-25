const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EmployeeModel = require("./employees/EmployeeModel");
const TrainingAndDevelopmentModel = require("./TrainingAndDevelopmentModel");

const TrainingDetailsModel = sequelize.define(
  "tbl_training_details",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    trainingId: {
      type: DataTypes.INTEGER,
      references: {
        model: TrainingAndDevelopmentModel,
        key: "id",
      },
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
    enrollmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    completionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    trainingProgress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100,
      },
    },
    attendancePercentage: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    assessmentScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    certificationStatus: {
      type: DataTypes.ENUM("pending", "achieved", "failed", "not_applicable"),
      allowNull: false,
      defaultValue: "pending",
    },
    certificationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    certificationDocument: {
      type: DataTypes.JSON, 
      allowNull: true,
    },
    trainingNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastAccessedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    progressUpdateDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_training_details",
    timestamps: true,
    indexes: [
      {
        fields: ['trainingId', 'employeeId'],
        unique: true,
      },
      {
        fields: ['employeeId'],
      },
      {
        fields: ['trainingId'],
      },
    ],
  }
);

// Define associations
TrainingDetailsModel.belongsTo(TrainingAndDevelopmentModel, {
  foreignKey: "trainingId",
  as: "training",
});

TrainingDetailsModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});

TrainingAndDevelopmentModel.hasMany(TrainingDetailsModel, {
  foreignKey: "trainingId",
  as: "trainingDetails",
});

EmployeeModel.hasMany(TrainingDetailsModel, {
  foreignKey: "employeeId",
  as: "trainingDetails",
});

module.exports = TrainingDetailsModel;