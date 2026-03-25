const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const UsersModel = require('./UsersModel');
const PermissionsModel = require('./PermissionsModel');

const CheckPermissionsModel = sequelize.define('tbl_check_permissions', {
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
    permission_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: PermissionsModel,
            key: 'uid',
        },
    },
    access_status: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    checked_by: {
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
    tableName: 'tbl_check_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

CheckPermissionsModel.belongsTo(UsersModel, {
    foreignKey: 'user_uid',
    as: 'users',
});

CheckPermissionsModel.belongsTo(PermissionsModel, {
    foreignKey: 'permission_uid',
    as: 'permissions',
});

module.exports = CheckPermissionsModel