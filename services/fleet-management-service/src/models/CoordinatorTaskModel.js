const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');

const CoordinatorTaskModel = sequelize.define('tbl_coordinator_task', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        allowNull: false,
        defaultValue: 'Medium',
    },
    assignedTo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
        allowNull: false,
        defaultValue: 'Pending',
    },
}, {
    tableName: 'tbl_coordinator_task',
    timestamps: true,
});

module.exports = CoordinatorTaskModel;