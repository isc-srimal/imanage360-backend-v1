// models/fleet-management/SwapRequestModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../src/config/dbSync');
const SalesOrdersModel = require('./SalesOrdersModel');

const SwapRequest = sequelize.define('tbl_swap_requests', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  sales_order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SalesOrdersModel,
      key: 'id'
    }
  },
  swap_type: {
    type: DataTypes.ENUM('equipment', 'attachment', 'subproduct', 'operator'),
    allowNull: false
  },
  swap_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Swap Request', 'Approved', 'Rejected', 'Return', 'Resubmit'),
    defaultValue: 'Swap Request'
  },
  estimated_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  remark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mobilization_charge: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  demobilization_charge: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estimated_transfer_cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  sales_remark: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  return_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tbl_swap_requests',
  timestamps: false,
  underscored: true
});

// Associations
SwapRequest.belongsTo(SalesOrdersModel, {
  foreignKey: 'sales_order_id',
  as: 'salesOrder'
});

SalesOrdersModel.hasMany(SwapRequest, {
  foreignKey: 'sales_order_id',
  as: 'swapRequests'
});

module.exports = SwapRequest;