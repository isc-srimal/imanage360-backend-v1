const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");

const ProductModel = sequelize.define(
  "tbl_fleet_product",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sell_this: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    income_account: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    attachment_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Attachment number entered for sub product"
    },
    schedule_date: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    product_photo_attachments: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
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
    tableName: "tbl_fleet_product",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// ProductModel.belongsTo(SalesOrdersModel, { foreignKey: 'sales_order_id', as: 'sales_order' });
// SalesOrdersModel.hasMany(ProductModel, { foreignKey: 'sales_order_id', as: 'tbl_fleet_product' });

module.exports = ProductModel;
