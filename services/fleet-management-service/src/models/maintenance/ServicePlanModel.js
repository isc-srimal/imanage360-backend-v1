const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");
const NextServiceTypeModel = require("../NextServiceTypeModel");

const ServicePlanModel = sequelize.define(
  "tbl_service_plan",
  {
    service_plan_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    next_service_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    engine_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    next_service_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: NextServiceTypeModel,
        key: "next_service_type_id",
      },
      allowNull: false,
    },
    notification: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    supplier: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    supplier_invice_no: {
      type: DataTypes.STRING(255),
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
    tableName: "tbl_service_plan",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ServicePlanModel.belongsTo(NextServiceTypeModel, {
  foreignKey: "next_service_type_id",
  as: "nextServiceType",
});
NextServiceTypeModel.hasMany(ServicePlanModel, {
  foreignKey: "next_service_type_id",
  as: "servicePlan",
});

module.exports = ServicePlanModel;
