// models/fleet-management/SubProductAttachmentAssignmentModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");

const SubProductAttachmentAssignmentModel = sequelize.define(
  "tbl_sub_product_attachment_assignment",
  {
    assignment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrdersModel,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Product ID from tbl_products",
    },
    attachment_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "Attachment number selected from swapped attachments",
    },
    created_by: {
      type: DataTypes.STRING(255),
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
    tableName: "tbl_sub_product_attachment_assignment",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        // Enforce one assignment per product per sales order
        unique: true,
        fields: ["sales_order_id", "product_id"],
      },
    ],
  },
);

SubProductAttachmentAssignmentModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

module.exports = SubProductAttachmentAssignmentModel;