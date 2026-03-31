const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");

const ServiceOptionsModel = sequelize.define(
  "tbl_service_options",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    details: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM("Company", "Client"),
      allowNull: true,
    },
    target_cost_amount: {
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
    tableName: "tbl_service_options",
    timestamps: false,
  }
);

module.exports = ServiceOptionsModel;
