const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");

const AcademicQualificationsModel = sequelize.define(
  "tbl_academic_qualifications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    qualification: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    qualificationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "tbl_academic_qualifications",
    timestamps: false,
  }
);

module.exports = AcademicQualificationsModel;
