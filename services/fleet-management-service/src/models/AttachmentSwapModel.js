// models/fleet-management/AttachmentSwapModel.js (UPDATED — added swap_group_id)
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const AttachmentModel = require("./AttachmentModel");
const ActiveAllocationModel =
  require("./ActiveAllocationsOriginalModel").ActiveAllocationModel;

const AttachmentSwapModel = sequelize.define(
  "tbl_attachment_swap",
  {
    attachment_swap_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    swap_group_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment:
        "Shared ID linking the OFF_HIRE and DELIVERY records created from one swap operation (e.g. AT-20260224-B7D2)",
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
    previous_attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentModel,
        key: "attachment_id",
      },
    },
    previous_attachment_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    new_attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentModel,
        key: "attachment_id",
      },
    },
    new_attachment_no: {
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
      allowNull: true,
      comment:
        "Type of swap record: OFF_HIRE for previous attachment, DELIVERY for new attachment",
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
      comment: "Estimated cost for swap (filled by Operations)",
    },
    swap_mobilization_trips: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Number of mobilization trips (filled by Operations)",
    },
    swap_demobilization_trips: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Number of demobilization trips (filled by Operations)",
    },
    swap_remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Swap remarks (filled by Operations)",
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
    },
    swap_submitted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    swap_approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_employees",
        key: "id",
      },
    },
    swap_approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    swap_return_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    swap_return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    swap_history: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: "tbl_attachment_swap",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Associations
AttachmentSwapModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

AttachmentSwapModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
});

AttachmentSwapModel.belongsTo(AttachmentModel, {
  foreignKey: "previous_attachment_id",
  as: "previousAttachment",
});

AttachmentSwapModel.belongsTo(AttachmentModel, {
  foreignKey: "new_attachment_id",
  as: "newAttachment",
});

module.exports = AttachmentSwapModel;