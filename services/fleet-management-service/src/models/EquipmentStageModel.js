const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");
const EquipmentModel = require("./EquipmentModel");

const EquipmentStageModel = sequelize.define(
  "tbl_equipment_stage",
  {
    equipment_stage_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    so_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrderModel,
        key: "id",
      },
    },
    serial_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
    },
    stage_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    closure_status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "tbl_equipment_stage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

EquipmentStageModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(EquipmentStageModel, {
  foreignKey: "so_id",
  as: "equipment_stage",
});

EquipmentStageModel.belongsTo(EquipmentModel, {
  foreignKey: "serial_number",
  as: "equipment",
});

EquipmentModel.hasMany(EquipmentStageModel, {
  foreignKey: "serial_number",
  as: "equipment_stage",
});

module.exports = EquipmentStageModel;