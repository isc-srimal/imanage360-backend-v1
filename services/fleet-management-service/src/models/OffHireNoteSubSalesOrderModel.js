const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");
const ManpowerModel = require("./ManpowerModel");
const AttachmentModel = require("./AttachmentModel");
const EquipmentModel = require("./EquipmentModel");

const OffHireNoteSubSalesOrderModel = sequelize.define(
  "tbl_off_hire_note_sub_sales_orders",
  {
    sub_so_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrderModel,
        key: "id",
      },
    },
    manpower_id: {
      type: DataTypes.JSON(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    attachment_id: {
      type: DataTypes.JSON(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    serial_number: {
      type: DataTypes.JSON(DataTypes.INTEGER),
      allowNull: true,
      defaultValue: [],
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
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
  },
  {
    tableName: "tbl_off_hire_note_sub_sales_orders",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Relationships
OffHireNoteSubSalesOrderModel.belongsTo(SalesOrderModel, {
    foreignKey: 'sales_order_id',
    as: 'salesOrder',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

module.exports = OffHireNoteSubSalesOrderModel;
