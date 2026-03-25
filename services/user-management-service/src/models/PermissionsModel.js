const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ModulesModel = require("./ModulesModel");

const PermissionsModel = sequelize.define(
  "tbl_permissions",
  {
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    module_uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ModulesModel,
        key: "uid",
      },
    },
    permission: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
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
    tableName: "tbl_permissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

PermissionsModel.belongsTo(ModulesModel, {
  foreignKey: "module_uid",
  as: "modules",
});

module.exports = PermissionsModel;
