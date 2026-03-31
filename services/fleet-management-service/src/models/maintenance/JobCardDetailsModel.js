const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");
const JobLocationModel = require("../JobLocationModel");
const MainCategoryModel = require("../MainCategoryModel");

const JobCardDetailsModel = sequelize.define(
  "tbl_job_card_details",
  {
    job_card_no: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    plate_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reported_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reported_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    reported_by: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    customer_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    job_location_id: {
      type: DataTypes.INTEGER,
      references: {
        model: JobLocationModel,
        key: "job_location_id",
      },
      allowNull: false,
    },
    main_category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: MainCategoryModel,
        key: "main_category_id",
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
    tableName: "tbl_job_card_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

JobCardDetailsModel.belongsTo(JobLocationModel, {
  foreignKey: "job_location_id",
  as: "jobLocation",
});
JobLocationModel.hasMany(JobCardDetailsModel, {
  foreignKey: "job_location_id",
  as: "jobCardDetails",
});

JobCardDetailsModel.belongsTo(MainCategoryModel, {
  foreignKey: "main_category_id",
  as: "mainCategory",
});
MainCategoryModel.hasMany(JobCardDetailsModel, {
  foreignKey: "main_category_id",
  as: "jobCardDetails",
});

module.exports = JobCardDetailsModel;
