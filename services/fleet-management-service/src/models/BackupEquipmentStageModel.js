const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");
const EquipmentModel = require("./EquipmentModel");

const BackupEquipmentStageModel = sequelize.define(
  "tbl_backup_equipment_stage",
  {
    backup_equipment_stage_id: {
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
    tableName: "tbl_backup_equipment_stage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

BackupEquipmentStageModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(BackupEquipmentStageModel, {
  foreignKey: "so_id",
  as: "backup_equipment_stage",
});

BackupEquipmentStageModel.belongsTo(EquipmentModel, {
  foreignKey: "serial_number",
  as: "equipment",
});

EquipmentModel.hasMany(BackupEquipmentStageModel, {
  foreignKey: "serial_number",
  as: "backup_equipment_stage",
});

module.exports = BackupEquipmentStageModel;
