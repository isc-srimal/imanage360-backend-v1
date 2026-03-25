const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const ContractTypeModel = sequelize.define('tbl_contract_type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    contractTypeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    contractTypeDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_contract_type',
    timestamps: false,
});

module.exports = ContractTypeModel;