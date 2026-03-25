const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const TenantsModel = require('./TenantsModel');

const GroupsModel = sequelize.define('tbl_groups', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    group_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    tenant_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TenantsModel,
            key: 'uid',
        },
    },
    description: {
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
    tableName: 'tbl_groups',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

GroupsModel.belongsTo(TenantsModel, {
    foreignKey: 'tenant_uid',
    as: 'tenants',
});

module.exports = GroupsModel