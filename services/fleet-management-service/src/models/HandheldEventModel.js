const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const EquipmentModel = require('./EquipmentModel');

const HandheldEventModel = sequelize.define('tbl_handheld_event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    eventType: {
        type: DataTypes.ENUM('SHIFT START', 'SHIFT END', 'IDLE'),
        allowNull: false,
    },
    time: {
        type: DataTypes.STRING, // e.g., '08:00 AM'
        allowNull: false,
    },
    siteId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentModel, 
        key: "serial_number",
      },
    },
    signature: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Review', 'Completed'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_handheld_event',
    timestamps: true,
});

HandheldEventModel.belongsTo(EquipmentModel, { foreignKey: 'equipment_id', as: 'equipment' });
EquipmentModel.hasMany(HandheldEventModel, { foreignKey: 'equipment_id', as: 'tbl_handheld_event' });

module.exports = HandheldEventModel;