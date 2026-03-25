const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync'); // Shared sequelize instance
const UserRoleModel = require('./UserRoleModel');

const UserModel = sequelize.define('tbl_users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    roleId: {
        type: DataTypes.INTEGER,
        references: {
            model: UserRoleModel,
            key: 'id',
        },
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING, // Token field
        allowNull: true,
    },
}, {
    tableName: 'tbl_users',
    timestamps: true,
});

// Associations
UserModel.belongsTo(UserRoleModel, { foreignKey: 'roleId', as: 'role' });
UserRoleModel.hasMany(UserModel, { foreignKey: 'roleId', as: 'tbl_users' });

module.exports = UserModel;
