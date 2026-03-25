const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const ModulesModel = require('./ModulesModel');
const SubscriptionPlansModel = require('./SubscriptionPlansModel');

const SubscriptionModulesModel = sequelize.define('tbl_subscription_modules', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subscription_plan_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: SubscriptionPlansModel,
            key: 'uid',
        },
    },
    module_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ModulesModel,
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
    tableName: 'tbl_subscription_modules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

SubscriptionModulesModel.belongsTo(SubscriptionPlansModel, {
    foreignKey: 'subscription_plan_uid',
    as: 'plans',
});

SubscriptionModulesModel.belongsTo(ModulesModel, {
    foreignKey: 'module_uid',
    as: 'modules',
});

module.exports = SubscriptionModulesModel