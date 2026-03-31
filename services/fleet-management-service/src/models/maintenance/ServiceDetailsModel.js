const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");
const ServiceCategoryModel = require("../ServiceCategoryModel");
const ServiceProviderModel = require("../ServiceProviderModel");
const ServiceTypeOneModel = require("../ServiceTypeOneModel");
const ServiceTypeTwoModel = require("../ServiceTypeTwoModel");

const ServiceDetailsModel = sequelize.define(
  "tbl_service_details",
  {
    service_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ServiceCategoryModel,
        key: "service_category_id",
      },
      allowNull: false,
    },
    service_provider_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ServiceProviderModel,
        key: "service_provider_id",
      },
      allowNull: false,
    },
    service_type_one_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ServiceTypeOneModel,
        key: "service_type_one_id",
      },
      allowNull: false,
    },
    service_type_two_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ServiceTypeTwoModel,
        key: "service_type_two_id",
      },
      allowNull: false,
    },
    technician: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    service_diagnosis: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    reported_issue: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    root_cause_failure: {
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
    tableName: "tbl_service_details",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ServiceDetailsModel.belongsTo(ServiceCategoryModel, {
  foreignKey: "service_category_id",
  as: "serviceCategory",
});
ServiceCategoryModel.hasMany(ServiceDetailsModel, {
  foreignKey: "service_category_id",
  as: "serviceDetails",
});

ServiceDetailsModel.belongsTo(ServiceProviderModel, {
  foreignKey: "service_provider_id",
  as: "serviceProvider",
});
ServiceProviderModel.hasMany(ServiceDetailsModel, {
  foreignKey: "service_provider_id",
  as: "serviceDetails",
});

ServiceDetailsModel.belongsTo(ServiceTypeOneModel, {
  foreignKey: "service_type_one_id",
  as: "serviceTypeOne",
});
ServiceTypeOneModel.hasMany(ServiceDetailsModel, {
  foreignKey: "service_type_one_id",
  as: "serviceDetails",
});

ServiceDetailsModel.belongsTo(ServiceTypeTwoModel, {
  foreignKey: "service_type_two_id",
  as: "serviceTypeTwo",
});
ServiceTypeTwoModel.hasMany(ServiceDetailsModel, {
  foreignKey: "service_type_two_id",
  as: "serviceDetails",
});

module.exports = ServiceDetailsModel;
