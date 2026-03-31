const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");

const ChargeableTypeModel = sequelize.define(
  "tbl_chargeble_type",
  {
    chargeble_type_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "chargeble_type_id"
    },
    chargeble_type_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "chargeble_type_name"
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
      field: "status"
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at"
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
      field: "updated_at"
    },
  },
  {
    tableName: "tbl_chargeble_type",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = ChargeableTypeModel;