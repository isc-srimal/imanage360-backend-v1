const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const UsersModel = require('./UsersModel');

const LoginMFAModel = sequelize.define('tbl_login_mfa', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UsersModel,
            key: 'uid',
        },
    },
    mfa_method: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    secret_key: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    is_enabled: {
        type: DataTypes.BOOLEAN,
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
    tableName: 'tbl_login_mfa',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

LoginMFAModel.belongsTo(UsersModel, {
    foreignKey: 'user_uid',
    as: 'users',
});

module.exports = LoginMFAModel