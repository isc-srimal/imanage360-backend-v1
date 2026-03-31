const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ManpowerModel = require("./ManpowerModel");
const SalesOrderModel = require("./SalesOrdersModel");

const ManpowerScheduledModel = sequelize.define(
  "tbl_manpower_scheduled",
  {
    manpower_scheduled_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    manpower_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ManpowerModel,
        key: "manpower_id",
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
    // scheduled_start_date: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    scheduled_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Remark for when manpower is already assigned to another SO on the same date",
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
    tableName: "tbl_manpower_scheduled",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ManpowerScheduledModel.belongsTo(ManpowerModel, {
  foreignKey: "manpower_id",
  as: "manpower",
});
ManpowerModel.hasMany(ManpowerScheduledModel, {
  foreignKey: "manpower_id",
  as: "manpower_scheduled",
});

ManpowerScheduledModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(ManpowerScheduledModel, {
  foreignKey: "so_id",
  as: "manpower_scheduled",
});

module.exports = ManpowerScheduledModel;
