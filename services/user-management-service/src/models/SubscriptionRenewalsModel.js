const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const SubscriptionsModel = require('./SubscriptionsModel');

const SubscriptionRenewalsModel = sequelize.define('tbl_subscription_renewals', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subscription_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubscriptionsModel,
            key: 'uid',
        },
    },
    renewal_attempt: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    success: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    error_message: {
        type: DataTypes.STRING(255),
        allowNull: true,
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
}, {
    tableName: 'tbl_subscription_renewals',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

SubscriptionRenewalsModel.belongsTo(SubscriptionsModel, {
    foreignKey: 'subscription_uid',
    as: 'subscriptions',
});

module.exports = SubscriptionRenewalsModel