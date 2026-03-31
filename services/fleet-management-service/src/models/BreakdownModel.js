const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const EquipmentModel = require('./EquipmentModel');
const SalesOrderModel = require('./SalesOrdersModel');

const BreakdownModel = sequelize.define('tbl_breakdown', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    eventType: {
        type: DataTypes.ENUM('Breakdown', 'Idle'),
        allowNull: false,
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING, // e.g., '1h 30m'
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrderModel, 
        key: "id",
      },
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentModel, 
        key: "serial_number",
      },
    },
    status: {
        type: DataTypes.ENUM('Active', 'Resolved', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending',
    },
}, {
    tableName: 'tbl_breakdown',
    timestamps: true,
});

BreakdownModel.belongsTo(SalesOrderModel, { foreignKey: 'sales_order_id', as: 'sales_order' });
SalesOrderModel.hasMany(BreakdownModel, { foreignKey: 'sales_order_id', as: 'tbl_breakdown' });

BreakdownModel.belongsTo(EquipmentModel, { foreignKey: 'equipment_id', as: 'equipment' });
EquipmentModel.hasMany(BreakdownModel, { foreignKey: 'equipment_id', as: 'tbl_breakdown' });

module.exports = BreakdownModel;