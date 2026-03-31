const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");
const SalesOrderRecoveryModel = require("./SalesOrderRecoveryModel");

const RecoveryStageModel = sequelize.define(
  "tbl_recovery_stage",
  {
    recovery_stage_id: {
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
     so_recovery_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrderRecoveryModel,
        key: "so_recovery_id",
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
    tableName: "tbl_recovery_stage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

RecoveryStageModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(RecoveryStageModel, {
  foreignKey: "so_id",
  as: "recovery_stage",
});

RecoveryStageModel.belongsTo(SalesOrderRecoveryModel, {
  foreignKey: "so_recovery_id",
  as: "so_recovery",
});

SalesOrderRecoveryModel.hasMany(RecoveryStageModel, {
  foreignKey: "so_recovery_id",
  as: "recovery_stages",
});

module.exports = RecoveryStageModel;