const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const SubscriptionsModel = require('./SubscriptionsModel');
const PaymentGatewayModel = require('./PaymentGatewayModel');

const OnlinePaymentsModel = sequelize.define('tbl_online_payments', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    response_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    response_message: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    subscription_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubscriptionsModel,
            key: 'uid',
        },
    },
    payment_gateway_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PaymentGatewayModel,
            key: 'uid',
        },
    },
    response_data: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    transaction_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    page_language: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    callback_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    transaction_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Response_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    checksumhash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    response_checksumhash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    response_date: {
        type: DataTypes.DATEONLY,
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
    tableName: 'tbl_online_payments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

OnlinePaymentsModel.belongsTo(SubscriptionsModel, {
    foreignKey: 'subscription_uid',
    as: 'subscriptions',
});

OnlinePaymentsModel.belongsTo(PaymentGatewayModel, {
    foreignKey: 'payment_gateway_uid',
    as: 'payment_gateway',
});

module.exports = OnlinePaymentsModel