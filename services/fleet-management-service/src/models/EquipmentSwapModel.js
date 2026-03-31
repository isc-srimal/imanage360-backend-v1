// models/fleet-management/EquipmentSwapModel.js (UPDATED — added swap_group_id)
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const EquipmentModel = require("./EquipmentModel");
const ActiveAllocationModel =
  require("./ActiveAllocationsOriginalModel").ActiveAllocationModel;

const EquipmentSwapModel = sequelize.define(
  "tbl_equipment_swap",
  {
    equipment_swap_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    swap_group_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment:
        "Shared ID linking the OFF_HIRE and DELIVERY records created from one swap operation (e.g. EQ-20260224-A3F9)",
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrdersModel,
        key: "id",
      },
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
      },
    },
    previous_equipment_serial: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
    },
    previous_plate_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    new_equipment_serial: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
    },
    new_plate_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    swap_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    swap_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    swap_type: {
      type: DataTypes.ENUM("OFF_HIRE", "DELIVERY"),
      allowNull: false,
      comment:
        "Type of swap record: OFF_HIRE for existing equipment, DELIVERY for new equipment",
    },
    delivery_note_status: {
      type: DataTypes.ENUM(
        "Pending",
        "Creation",
        "Under Approval",
        "Approved",
        "In Progress",
        "Completed",
        "Rejected",
        "Close",
      ),
      allowNull: false,
      defaultValue: "Pending",
    },
    off_hire_note_status: {
      type: DataTypes.ENUM(
        "Pending",
        "Creation",
        "Under Approval",
        "Approved",
        "In Progress",
        "Completed",
        "Rejected",
        "Close",
      ),
      allowNull: false,
      defaultValue: "Pending",
    },
    overall_status: {
      type: DataTypes.ENUM(
        "Creation",
        "Awaiting Sales confirmation",
        "Return",
        "In progress",
        "Partially completed",
        "Completed",
        "Cancelled",
      ),
      allowNull: false,
      defaultValue: "Creation",
    },
    mobilization_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Actual mobilization charge for the swap",
    },
    demobilization_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Actual demobilization charge for the swap",
    },
    return_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Reason for returning the swap request",
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
    swap_estimated_recovery_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Estimated cost for equipment swap recovery",
    },
    swap_mobilization_trips: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Number of trips for mobilization during swap",
    },
    swap_demobilization_trips: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Number of trips for demobilization during swap",
    },
    swap_remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Additional remarks for equipment swap",
    },
    swap_mobilization_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Mobilization charge approved by Sales",
    },
    swap_demobilization_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Demobilization charge approved by Sales",
    },
    swap_status: {
      type: DataTypes.ENUM(
        "Pending",
        "Swap Request",
        "Approved",
        "Rejected",
        "Return",
        "Resubmit",
        "Cancelled",
      ),
      allowNull: false,
      defaultValue: "Pending",
      comment: "Current status of swap request",
    },
    swap_submitted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_employees",
        key: "id",
      },
      comment: "Operations user who submitted the swap request",
    },
    swap_submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "When swap request was submitted",
    },
    swap_approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_employees",
        key: "id",
      },
      comment: "Sales user who approved/rejected",
    },
    swap_approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "When swap was approved/rejected",
    },
    swap_return_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Reason for returning the swap request",
    },
    swap_return_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "When swap was returned",
    },
    swap_history: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "History of swap status changes",
    },
  },
  {
    tableName: "tbl_equipment_swap",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Associations
EquipmentSwapModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

EquipmentSwapModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
});

EquipmentSwapModel.belongsTo(EquipmentModel, {
  foreignKey: "previous_equipment_serial",
  as: "previousEquipment",
});

EquipmentSwapModel.belongsTo(EquipmentModel, {
  foreignKey: "new_equipment_serial",
  as: "newEquipment",
});

module.exports = EquipmentSwapModel;