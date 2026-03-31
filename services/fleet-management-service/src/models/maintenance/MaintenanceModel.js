const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");
const JobCardDetailsModel = require("./JobCardDetailsModel");
const JobTimelineModel = require("./JobTimelineModel");
const ServiceDetailsModel = require("./ServiceDetailsModel");
const ServicePlanModel = require("./ServicePlanModel");

const MaintenanceModel = sequelize.define(
  "tbl_fleet_maintenance",
  {
    maintenance_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    job_card_no: {
      type: DataTypes.INTEGER,
      references: {
        model: JobCardDetailsModel,
        key: "job_card_no",
      },
      allowNull: false,
    },
    service_details_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ServiceDetailsModel,
        key: "service_details_id",
      },
      allowNull: false,
    },
    job_timeline_id: {
      type: DataTypes.INTEGER,
      references: {
        model: JobTimelineModel,
        key: "job_timeline_id",
      },
      allowNull: false,
    },
    service_plan_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ServicePlanModel,
        key: "service_plan_id",
      },
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
    tableName: "tbl_fleet_maintenance",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

MaintenanceModel.belongsTo(JobCardDetailsModel, {
  foreignKey: "job_card_no",
  as: "jobCardDetails",
});
JobCardDetailsModel.hasMany(MaintenanceModel, {
  foreignKey: "job_card_no",
  as: "maintenance",
});

MaintenanceModel.belongsTo(ServiceDetailsModel, {
  foreignKey: "service_details_id",
  as: "serviceDetails",
});
ServiceDetailsModel.hasMany(MaintenanceModel, {
  foreignKey: "service_details_id",
  as: "maintenance",
});

MaintenanceModel.belongsTo(JobTimelineModel, {
  foreignKey: "job_timeline_id",
  as: "jobTimeline",
});
JobTimelineModel.hasMany(MaintenanceModel, {
  foreignKey: "job_timeline_id",
  as: "maintenance",
});

MaintenanceModel.belongsTo(ServicePlanModel, {
  foreignKey: "service_plan_id",
  as: "servicePlan",
});
ServicePlanModel.hasMany(MaintenanceModel, {
  foreignKey: "service_plan_id",
  as: "maintenance",
});

module.exports = MaintenanceModel;
