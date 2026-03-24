const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const CustodianIDModel = sequelize.define('tbl_custodian', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    custodian_name: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_custodian',
    timestamps: false,
});

module.exports = CustodianIDModel;