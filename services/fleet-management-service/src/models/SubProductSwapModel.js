// models/fleet-management/SubProductSwapModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");

const SubProductSwapModel = sequelize.define(
  "tbl_sub_product_swap",
  {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    income_account: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    attachment_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "tbl_sub_product_swap",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Associations
// SubProductSwapModel.belongsTo(SalesOrdersModel, {
//   foreignKey: "sales_order_id",
//   as: "salesOrder",
// });

// SubProductSwapModel.belongsTo(ActiveAllocationModel, {
//   foreignKey: "allocation_id",
//   as: "allocation",
// });

// SubProductSwapModel.belongsTo(ProductModel, {
//   foreignKey: "previous_sub_product_id",
//   as: "previousSubProduct",
// });

// SubProductSwapModel.belongsTo(ProductModel, {
//   foreignKey: "new_sub_product_id",
//   as: "newSubProduct",
// });

module.exports = SubProductSwapModel;