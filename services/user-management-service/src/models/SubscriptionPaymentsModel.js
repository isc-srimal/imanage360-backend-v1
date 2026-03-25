const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const SubscriptionsModel = require('./SubscriptionsModel');
const PaymentGatewayModel = require('./PaymentGatewayModel');

const SubscriptionPaymentsModel = sequelize.define('tbl_subscription_payments', {
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
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    payment_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    payment_method: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    payment_gateway_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentGatewayModel,
            key: 'uid',
        },
    },
    remarks: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
    tableName: 'tbl_subscription_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

SubscriptionPaymentsModel.belongsTo(SubscriptionsModel, {
    foreignKey: 'subscription_uid',
    as: 'subscriptions',
});

SubscriptionPaymentsModel.belongsTo(PaymentGatewayModel, {
    foreignKey: 'payment_gateway_uid',
    as: 'payment_gateway',
});

module.exports = SubscriptionPaymentsModel