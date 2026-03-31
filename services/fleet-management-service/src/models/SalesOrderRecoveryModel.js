const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");

const SalesOrderRecoveryModel = sequelize.define(
  "tbl_so_recovery",
  {
    so_recovery_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    recovery_supplier: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    recovery_vehicle_type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    no_of_trips: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estimated_cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    so_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrderModel,
        key: "id",
      },
    },
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    tableName: "tbl_so_recovery",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

SalesOrderRecoveryModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(SalesOrderRecoveryModel, {
  foreignKey: "so_id",
  as: "so_recovery",
});

module.exports = SalesOrderRecoveryModel;
