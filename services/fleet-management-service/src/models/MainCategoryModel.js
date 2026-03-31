const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ServiceProviderModel = require("./ServiceProviderModel");
const ServicesModel = require("./ServicesModel");

const MainCategoryModel = sequelize.define(
  "tbl_main_category",
  {
    main_category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceProviderModel, 
        key: "service_provider_id",
      },
    },
    reported_by: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    main_category: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServicesModel, 
        key: "service_id",
      },
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
    tableName: "tbl_main_category",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

MainCategoryModel.belongsTo(ServiceProviderModel, { foreignKey: 'service_provider_id', as: 'service_provider' });
ServiceProviderModel.hasMany(MainCategoryModel, { foreignKey: 'service_provider_id', as: 'tbl_main_category' });

MainCategoryModel.belongsTo(ServicesModel, { foreignKey: 'service_id', as: 'services' });
ServicesModel.hasMany(MainCategoryModel, { foreignKey: 'service_id', as: 'tbl_main_category' });

module.exports = MainCategoryModel;
