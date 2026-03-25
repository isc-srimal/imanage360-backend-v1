const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const RolesModel = require('./RolesModel');
const PermissionsModel = require('./PermissionsModel');

const RolePermissionsModel = sequelize.define('tbl_role_permissions', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    role_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RolesModel,
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
    tableName: 'tbl_role_permissions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

RolePermissionsModel.belongsTo(RolesModel, {
    foreignKey: 'role_uid',
    as: 'roles',
});

RolePermissionsModel.belongsTo(PermissionsModel, {
    foreignKey: 'permission_uid',
    as: 'permissions',
});

module.exports = RolePermissionsModel