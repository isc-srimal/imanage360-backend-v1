const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const AttachmentModel = require("./AttachmentModel");

const AttachmentStatusHistoryModel = sequelize.define(
  "tbl_fleet_attachment_status_history",
  {
    history_id: {
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
    status: {
      type: DataTypes.ENUM("Active", "Retired", "Repaired", "Lost"),
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
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
    tableName: "tbl_fleet_attachment_status_history",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Relationships
AttachmentStatusHistoryModel.belongsTo(AttachmentModel, {
  foreignKey: "attachment_id",
  as: "attachment",
});
AttachmentModel.hasMany(AttachmentStatusHistoryModel, {
  foreignKey: "attachment_id",
  as: "status_history",
});

module.exports = AttachmentStatusHistoryModel;