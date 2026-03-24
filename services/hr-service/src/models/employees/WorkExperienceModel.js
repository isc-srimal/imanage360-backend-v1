const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");

const WorkExperienceModel = sequelize.define(
  "tbl_work_experience",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tbl_employees",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "tbl_work_experience",
    timestamps: false,
  }
);

module.exports = WorkExperienceModel;
