const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const LoginStatusModel = require('./LoginStatusesModel');
const UsersModel = require('./UsersModel');

const LoginHistoriesModel = sequelize.define('tbl_login_histories', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    login_status_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: LoginStatusModel,
            key: 'uid',
        },
    },
    email: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    ip_address: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    login_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    user_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UsersModel,
            key: 'uid',
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
}, {
    tableName: 'tbl_login_histories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

LoginHistoriesModel.belongsTo(LoginStatusModel, {
    foreignKey: 'ulogin_status_uidid',
    as: 'login_statuses',
});

LoginHistoriesModel.belongsTo(UsersModel, {
    foreignKey: 'user_uid',
    as: 'users',
});

module.exports = LoginHistoriesModel