const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const GroupsModel = require('./GroupsModel');
const RolesModel = require('./RolesModel');

const GroupRolesModel = sequelize.define('tbl_group_roles', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    group_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: GroupsModel,
            key: 'uid',
        },
    },
    role_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: RolesModel,
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
    tableName: 'tbl_group_roles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

GroupRolesModel.belongsTo(GroupsModel, {
    foreignKey: 'group_uid',
    as: 'groups',
});

GroupRolesModel.belongsTo(RolesModel, {
    foreignKey: 'role_uid',
    as: 'roles',
});

module.exports = GroupRolesModel