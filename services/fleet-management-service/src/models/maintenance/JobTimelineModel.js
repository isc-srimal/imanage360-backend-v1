const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");

const JobTimelineModel = sequelize.define(
  "tbl_job_timeline",
  {
    job_timeline_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    maintenance_vehicle_plate_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    job_attented_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    job_attented_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    job_completed_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    job_completed_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    odometer: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actual_service_intervels: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    actual_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approximate_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "tbl_job_timeline",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = JobTimelineModel;
