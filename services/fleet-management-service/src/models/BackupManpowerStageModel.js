const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");
const ManpowerModel = require("./ManpowerModel");

const BackupManpowerStageModel = sequelize.define(
  "tbl_backup_manpower_stage",
  {
    backup_manpower_stage_id: {
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
    manpower_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ManpowerModel,
        key: "manpower_id",
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
    tableName: "tbl_backup_manpower_stage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

BackupManpowerStageModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(BackupManpowerStageModel, {
  foreignKey: "so_id",
  as: "backup_manpower_stage",
});

BackupManpowerStageModel.belongsTo(ManpowerModel, {
  foreignKey: "manpower_id",
  as: "manpower",
});

ManpowerModel.hasMany(BackupManpowerStageModel, {
  foreignKey: "manpower_id",
  as: "backup_manpower_stage",
});

module.exports = BackupManpowerStageModel;