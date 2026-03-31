const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const JobLocationModel = require("./JobLocationModel");

const SalesOrderModelOld = sequelize.define(
  "tbl_sales_order_old",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectSite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: JobLocationModel,
        key: "job_location_id",
      },
    },
    factors: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobilizationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    workStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    workEndDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    billingModel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    serviceOptions: {
      type: DataTypes.JSON, // Stores array of service options
      allowNull: true,
    },
    specialInstructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    estimatedValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Confirmed", "Active", "Inactive"),
      allowNull: false,
      defaultValue: "Pending",
    },
  },
  {
    tableName: "tbl_sales_order_old",
    timestamps: true, // Including timestamps for createdAt/updatedAt
  }
);

SalesOrderModelOld.belongsTo(JobLocationModel, {
  foreignKey: "projectSite",
  as: "jobLocation",
});
JobLocationModel.hasMany(SalesOrderModelOld, {
  foreignKey: "projectSite",
  as: "salesOrder",
});

module.exports = SalesOrderModelOld;
