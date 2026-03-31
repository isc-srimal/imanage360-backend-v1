// models/fleet-management/OperatorChangeModel.js (UPDATED — added change_group_id)
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const EquipmentModel = require("./EquipmentModel");
const ManpowerModel = require("./ManpowerModel");
const ActiveAllocationModel =
  require("./ActiveAllocationsOriginalModel").ActiveAllocationModel;

const OperatorChangeModel = sequelize.define(
  "tbl_operator_change",
  {
    operator_change_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    change_group_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment:
        "Shared ID linking the OFF_HIRE and DELIVERY records created from one operator change operation (e.g. OP-20260224-C1E5)",
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
    equipment_serial_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
    },
    plate_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    previous_operator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ManpowerModel,
        key: "manpower_id",
      },
    },
    previous_operator_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    new_operator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ManpowerModel,
        key: "manpower_id",
      },
    },
    new_operator_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    operator_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    change_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    change_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    change_type: {
      type: DataTypes.ENUM("OFF_HIRE", "DELIVERY"),
      allowNull: false,
      comment:
        "Indicates if this record is for off-hire (current operator) or delivery (new operator)",
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
      type: DataTypes.ENUM("Creation", "Awaiting Sales confirmation", "Return", "In progress", "Partially completed", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Creation",
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
    change_estimated_transfer_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Estimated transfer cost (filled by Operations)",
    },
    change_remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Change remarks (filled by Operations)",
    },
    change_status: {
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
      comment: "Current status of operator change request",
    },
    change_submitted_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_employees",
        key: "id",
      },
    },
    change_submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    change_approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_employees",
        key: "id",
      },
    },
    change_approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    change_return_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Reason for returning the change request",
    },
    change_return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    change_history: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: "tbl_operator_change",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Associations
OperatorChangeModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

OperatorChangeModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
});

OperatorChangeModel.belongsTo(EquipmentModel, {
  foreignKey: "equipment_serial_number",
  as: "equipment",
});

OperatorChangeModel.belongsTo(ManpowerModel, {
  foreignKey: "previous_operator_id",
  as: "previousOperator",
});

OperatorChangeModel.belongsTo(ManpowerModel, {
  foreignKey: "new_operator_id",
  as: "newOperator",
});

module.exports = OperatorChangeModel;