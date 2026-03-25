const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const BankDetailsModel = sequelize.define('tbl_bank_details', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bankName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_bank_details',
    timestamps: false,
});

module.exports = BankDetailsModel;