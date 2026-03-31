const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const ActiveAllocationModel = require("./ActiveAllocationsOriginalModel").ActiveAllocationModel;

const OperationalModificationModel = sequelize.define(
  "tbl_operational_modification",
  {
    modification_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrdersModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    modification_type: {
      type: DataTypes.ENUM(
        "shift_change",
        "operator_change",
        "equipment_swap",
        "attachment_swap"
      ),
      allowNull: false,
    },
    // Shift Change fields
    previous_shift: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    new_shift: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    shift_change_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    shift_change_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Operator Change fields
    equipment_serial_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    previous_operator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_operator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    operator_change_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    operator_change_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Equipment Swap fields
    previous_equipment_serial: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_equipment_serial: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    equipment_swap_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    equipment_swap_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Attachment Swap fields
    previous_attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    new_attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    attachment_swap_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    attachment_swap_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Active",
    },
  },
  {
    tableName: "tbl_operational_modification",
    timestamps: true,
  }
);

// Associations
OperationalModificationModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

SalesOrdersModel.hasMany(OperationalModificationModel, {
  foreignKey: "sales_order_id",
  as: "operationalModifications",
});

module.exports = OperationalModificationModel;