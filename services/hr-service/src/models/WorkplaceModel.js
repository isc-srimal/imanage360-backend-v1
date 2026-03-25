const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const WorkplaceModel = sequelize.define('tbl_workplace', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    workplaceName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    workplaceNameArabic: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_workplace',
    timestamps: false,
});

module.exports = WorkplaceModel;