const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const OrganizationModel = require('./OrganizationsModel');
const TenantModel = require('./TenantsModel');
const SubscriptionPlansModel = require('./SubscriptionPlansModel');

const SubscriptionsModel = sequelize.define('tbl_subscriptions', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    organization_uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: OrganizationModel,
            key: 'uid',
        },
    },
    tenant_uid: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: TenantModel,
            key: 'uid',
        },
    },
    plan_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubscriptionPlansModel,
            key: 'uid',
        },
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'expired', 'cancelled'),
        defaultValue: 'active',
    },
    auto_renew: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    order_reference: {
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
    tableName: 'tbl_subscriptions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

SubscriptionsModel.belongsTo(OrganizationModel, {
    foreignKey: 'organization_uid',
    as: 'organizations',
});

SubscriptionsModel.belongsTo(TenantModel, {
    foreignKey: 'tenant_uid',
    as: 'tenants',
});

SubscriptionsModel.belongsTo(SubscriptionPlansModel, {
    foreignKey: 'plan_uid',
    as: 'plans',
});

module.exports = SubscriptionsModel