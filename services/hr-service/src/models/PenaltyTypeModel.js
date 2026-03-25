const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const PenaltyTypeModel = sequelize.define('tbl_penalty_type', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    penaltyType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_penalty_type',
    timestamps: false,
});

module.exports = PenaltyTypeModel;