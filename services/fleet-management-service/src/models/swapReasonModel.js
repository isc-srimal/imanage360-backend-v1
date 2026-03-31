const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const SwapReasonModel = sequelize.define('tbl_swap_reason', {
    swap_reason_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    swap_reason_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('Operator', 'Attachment', 'Equipment'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_swap_reason',
    timestamps: false,
});

module.exports = SwapReasonModel;