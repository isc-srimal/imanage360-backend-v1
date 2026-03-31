const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const EquipmentModel = require('./EquipmentModel');
const SalesOrdersModel = require('./SalesOrdersModel');

const ActiveAllocationModel = sequelize.define('tbl_active_allocation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrdersModel, 
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
        type: DataTypes.ENUM('Active', 'Inactive', 'Pending'),
        allowNull: false,
        defaultValue: 'Active',
    },
    usageHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    tableName: 'tbl_active_allocation',
    timestamps: true,
});

ActiveAllocationModel.belongsTo(SalesOrdersModel, { foreignKey: 'sales_order_id', as: 'sales_order' });
SalesOrdersModel.hasMany(ActiveAllocationModel, { foreignKey: 'sales_order_id', as: 'tbl_active_allocation' });

ActiveAllocationModel.belongsTo(EquipmentModel, { foreignKey: 'equipment_id', as: 'equipment' });
EquipmentModel.hasMany(ActiveAllocationModel, { foreignKey: 'equipment_id', as: 'tbl_active_allocation' });

module.exports = ActiveAllocationModel;