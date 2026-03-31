const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ServiceTypeOneModel = require("./ServiceTypeOneModel");

const ServiceTypeTwoModel = sequelize.define(
  "tbl_service_type_two",
  {
    service_type_two_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_type_one_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ServiceTypeOneModel, 
        key: "service_type_one_id",
      },
    },
    service_type_two: {
      type: DataTypes.STRING(255),
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
    tableName: "tbl_service_type_two",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ServiceTypeTwoModel.belongsTo(ServiceTypeOneModel, { foreignKey: 'service_type_one_id', as: 'service_type_one' });
ServiceTypeOneModel.hasMany(ServiceTypeTwoModel, { foreignKey: 'service_type_one_id', as: 'tbl_service_type_two' });

module.exports = ServiceTypeTwoModel;
