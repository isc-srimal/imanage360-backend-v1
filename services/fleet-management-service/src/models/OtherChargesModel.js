const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");

const OtherChargesModel = sequelize.define(
  "tbl_other_charges",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unit_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_other_charges",
    timestamps: true,
  }
);

/**
 * ⚠️ IMPORTANT:
 * Associations must be created AFTER all models are loaded
 */
OtherChargesModel.associate = () => {
  const { tbl_sales_order } = sequelize.models;

  if (!tbl_sales_order) {
    throw new Error("SalesOrdersModel not initialized");
  }

  OtherChargesModel.belongsTo(tbl_sales_order, {
    foreignKey: "sales_order_id",
    as: "salesOrder",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

module.exports = OtherChargesModel;
