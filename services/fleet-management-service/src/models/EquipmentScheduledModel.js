const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EquipmentModel = require("./EquipmentModel");
const SalesOrderModel = require("./SalesOrdersModel");

const EquipmentScheduledModel = sequelize.define(
  "tbl_equipment_scheduled",
  {
    equipment_scheduled_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
    },
    so_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrderModel,
        key: "id",
      },
    },
    scheduled_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // scheduled_end_date: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Remark for when equipment is already assigned to another SO on the same date",
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
    tableName: "tbl_equipment_scheduled",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

EquipmentScheduledModel.belongsTo(EquipmentModel, {
  foreignKey: "equipment_id",
  as: "equipment",
});
EquipmentModel.hasMany(EquipmentScheduledModel, {
  foreignKey: "equipment_id",
  as: "equipment_scheduled",
});

EquipmentScheduledModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(EquipmentScheduledModel, {
  foreignKey: "so_id",
  as: "equipment_scheduled",
});

module.exports = EquipmentScheduledModel;
