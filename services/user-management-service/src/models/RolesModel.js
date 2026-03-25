const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const TenantsModel = require("./TenantsModel");

const RolesModel = sequelize.define(
  "tbl_roles",
  {
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    permissionCount: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
    is_business_role: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    tenant_uid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: TenantsModel,
        key: "uid",
      },
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
    tableName: "tbl_roles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

RolesModel.belongsTo(TenantsModel, {
  foreignKey: "tenant_uid",
  as: "tenants",
});

module.exports = RolesModel;
