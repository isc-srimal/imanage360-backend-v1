const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const UsersModel = require("./UsersModel");
const RolesModel = require("./RolesModel");

const UserGroupsModel = sequelize.define(
  "tbl_user_groups",
  {
    uid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    group_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_uid: {
      type: DataTypes.JSON(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    role_uid: {
      type: DataTypes.JSON(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
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
    tableName: "tbl_user_groups",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = UserGroupsModel;
