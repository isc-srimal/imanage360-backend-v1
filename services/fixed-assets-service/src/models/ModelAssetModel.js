const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ManufacturerModel = require("./ManufacturerModel");

const ModelAssetModel = sequelize.define(
  "tbl_asset_model",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    manufacturer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ManufacturerModel,
        key: "id",
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    tableName: "tbl_asset_model",
    timestamps: true,
  }
);

ModelAssetModel.belongsTo(ManufacturerModel, {
  foreignKey: "manufacturer_id",
  as: "manufacturer",
});
ManufacturerModel.hasMany(ModelAssetModel, {
  foreignKey: "manufacturer_id",
  as: "model",
});

module.exports = ModelAssetModel;
