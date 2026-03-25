const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const LoginSSOModel = sequelize.define('tbl_login_sso', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sso_provider: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    user_uid: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sso_client_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    sso_client_secret: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    callback_url: {
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
    tableName: 'tbl_login_sso',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

module.exports = LoginSSOModel;