const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ServiceCategoryModel = require("./ServiceCategoryModel");
const ServiceTypeOneModel = require("./ServiceTypeOneModel");
const ServiceTypeTwoModel = require("./ServiceTypeTwoModel");

const ServicesModel = sequelize.define(
  "tbl_services",
  {
    service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceCategoryModel, 
        key: "service_category_id",
      },
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    service_type_one_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceTypeOneModel, 
        key: "service_type_one_id",
      },
    },
    service_type_two_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceTypeTwoModel, 
        key: "service_type_two_id",
      },
    },
    engine_hours: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
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
    tableName: "tbl_services",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ServicesModel.belongsTo(ServiceCategoryModel, { foreignKey: 'service_category_id', as: 'service_category' });
ServiceCategoryModel.hasMany(ServicesModel, { foreignKey: 'service_category_id', as: 'tbl_services' });

ServicesModel.belongsTo(ServiceTypeOneModel, { foreignKey: 'service_type_one_id', as: 'service_type_one' });
ServiceTypeOneModel.hasMany(ServicesModel, { foreignKey: 'service_type_one_id', as: 'tbl_services' });

ServicesModel.belongsTo(ServiceTypeTwoModel, { foreignKey: 'service_type_two_id', as: 'service_type_two' });
ServiceTypeTwoModel.hasMany(ServicesModel, { foreignKey: 'service_type_two_id', as: 'tbl_services' });

module.exports = ServicesModel;
