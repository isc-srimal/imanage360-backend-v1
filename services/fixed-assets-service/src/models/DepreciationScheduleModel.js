const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const AssetModel = require("./AssetModel");

const DepreciationScheduleModel = sequelize.define(
  "tbl_depreciation_schedules",
  {
    schedule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AssetModel,
        key: "asset_id",
      },
    },
    dep_method: {
      type: DataTypes.ENUM(
        "straight_line",
        "declining_balance",
        "units_of_production"
      ),
      allowNull: false,
    },
    dep_rate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    approval_status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected"),
      allowNull: true,
      defaultValue: "Pending",
    },
    useful_life: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    total_estimated_units: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    original_cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    residual_value: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    accumulated_depreciation: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    yearly_depreciation: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    monthly_depreciation: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "tbl_depreciation_schedules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Relationship with AssetModel
DepreciationScheduleModel.belongsTo(AssetModel, {
  foreignKey: "asset_id",
  as: "Asset",
});

module.exports = DepreciationScheduleModel;
