const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const UserRoleModel = sequelize.define('tbl_user_roles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    roleName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'tbl_user_roles',
    timestamps: false, // Disable createdAt/updatedAt
});

module.exports = UserRoleModel;
