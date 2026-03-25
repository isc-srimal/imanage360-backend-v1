const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const CountryModel = sequelize.define('tbl_countries', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    country_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_enName: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    country_arName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_enNationality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    country_arNationality: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'tbl_countries',
    timestamps: false,
});

module.exports = CountryModel;