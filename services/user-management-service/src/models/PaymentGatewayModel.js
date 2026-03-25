const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const PaymentGatewayModel = sequelize.define('tbl_payment_gateway', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    website: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    callback_url: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    merchant_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    secret_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    checked_date: {
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
    tableName: 'tbl_payment_gateway',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = PaymentGatewayModel