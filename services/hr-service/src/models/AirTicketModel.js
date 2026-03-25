const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const AirTicketModel = sequelize.define('tbl_air_tickets', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    destinationCountry: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    adultPackageAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    infantAmount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_air_tickets',
    timestamps: false,
});

module.exports = AirTicketModel;