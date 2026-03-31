const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ProductModel = require("./ProductModel");
const SalesOrderModel = require("./SalesOrdersModel");

const SubProductAttachmentScheduledModel = sequelize.define(
  "tbl_sub_product_attachment_scheduled",
  {
    sub_product_scheduled_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductModel,
        key: "product_id",
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
    
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Remark for when sub product is already assigned to another SO on the same date",
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
    tableName: "tbl_sub_product_attachment_scheduled",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

SubProductAttachmentScheduledModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
  as: "product",
});
ProductModel.hasMany(SubProductAttachmentScheduledModel, {
  foreignKey: "product_id",
  as: "sub_product_scheduled",
});

SubProductAttachmentScheduledModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(SubProductAttachmentScheduledModel, {
  foreignKey: "so_id",
  as: "sub_product_scheduled",
});

module.exports = SubProductAttachmentScheduledModel;