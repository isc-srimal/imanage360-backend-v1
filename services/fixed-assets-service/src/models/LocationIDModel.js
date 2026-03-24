const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const LocationIDModel = sequelize.define('tbl_location', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    location_name: {
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
    tableName: 'tbl_location',
    timestamps: false,
});

module.exports = LocationIDModel;