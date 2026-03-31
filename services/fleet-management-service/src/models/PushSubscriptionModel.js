// models/PushSubscriptionModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const UsersModel = sequelize.define('tbl_all_users', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
}, {
    tableName: 'tbl_all_users',
    timestamps: false,
});

const PushSubscriptionModel = sequelize.define(
  "tbl_push_subscriptions",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UsersModel,
        key: "uid",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      comment: "uid from tbl_all_users",
    },
    endpoint: {
      type: DataTypes.STRING(500), // ✅ VARCHAR(500) supports UNIQUE index
      allowNull: false,
      unique: true,
      comment: "Push service endpoint URL",
    },
    subscription_data: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: "Full PushSubscription JSON object from browser",
    },
    user_agent: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_push_subscriptions",
    timestamps: true,
  },
);

// Association
PushSubscriptionModel.belongsTo(UsersModel, {
  foreignKey: "user_id",
  as: "user",
});

UsersModel.hasMany(PushSubscriptionModel, {
  foreignKey: "user_id",
  as: "pushSubscriptions",
});

module.exports = PushSubscriptionModel;
