const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const AttachmentModel = require("./AttachmentModel");
const SalesOrderModel = require("./SalesOrdersModel");

const AttachmentScheduledModel = sequelize.define(
  "tbl_attachment_scheduled",
  {
    attachment_scheduled_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AttachmentModel,
        key: "attachment_id",
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
      comment: "Remark for when attachment is already assigned to another SO on the same date",
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
    tableName: "tbl_attachment_scheduled",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

AttachmentScheduledModel.belongsTo(AttachmentModel, {
  foreignKey: "attachment_id",
  as: "attachment",
});
AttachmentModel.hasMany(AttachmentScheduledModel, {
  foreignKey: "attachment_id",
  as: "attachment_scheduled",
});

AttachmentScheduledModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(AttachmentScheduledModel, {
  foreignKey: "so_id",
  as: "attachment_scheduled",
});

module.exports = AttachmentScheduledModel;
