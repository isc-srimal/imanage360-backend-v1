const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");
const AttachmentModel = require("./AttachmentModel");

const AttachmentStageModel = sequelize.define(
  "tbl_attachment_stage",
  {
    attachment_stage_id: {
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
    attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AttachmentModel,
        key: "attachment_id",
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
    tableName: "tbl_attachment_stage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

AttachmentStageModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(AttachmentStageModel, {
  foreignKey: "so_id",
  as: "attachment_stage",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

AttachmentStageModel.belongsTo(AttachmentModel, {
  foreignKey: "attachment_id",
  as: "attachment",
});

AttachmentModel.hasMany(AttachmentStageModel, {
  foreignKey: "attachment_id",
  as: "attachment_stage",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = AttachmentStageModel;
