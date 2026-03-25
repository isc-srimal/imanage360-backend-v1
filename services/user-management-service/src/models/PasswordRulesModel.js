const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const UserTypesModel = require('./UserTypesModel');

const PasswordRulesModel = sequelize.define('tbl_password_rules', {
    uid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_type_uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: UserTypesModel,
            key: 'uid',
        },
    },
    min_length: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    complexity_requirements: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    expiration_days: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_attempt: {
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
    tableName: 'tbl_password_rules',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

PasswordRulesModel.belongsTo(UserTypesModel, {
    foreignKey: 'user_type_uid',
    as: 'user_types',
});

module.exports = PasswordRulesModel