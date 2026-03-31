const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");

const EquipmentRentalServiceModel = sequelize.define(
  "tbl_equipment_rental_service",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    income_account: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_sales_order",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "tbl_equipment_rental_service",
    timestamps: false,
  }
);

module.exports = EquipmentRentalServiceModel;
