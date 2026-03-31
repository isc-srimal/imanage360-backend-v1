const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const ActiveAllocationModel = require("./ActiveAllocationsOriginalModel").ActiveAllocationModel;
const EquipmentModel = require("./EquipmentModel");
const ManpowerModel = require("./ManpowerModel");

const AssignedOperatorsModel = sequelize.define(
  "tbl_assigned_operators",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    equipment_serial_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    full_shift_operator: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Format: employeeNo - employeeFullName",
    },
    day_shift_operator: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Format: employeeNo - employeeFullName",
    },
    night_shift_operator: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Format: employeeNo - employeeFullName",
    },
    reliever_operator: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Format: employeeNo - employeeFullName",
    },
  },
  {
    tableName: "tbl_assigned_operators",
    timestamps: true,
  }
);

// Associations
ActiveAllocationModel.hasMany(AssignedOperatorsModel, {
  foreignKey: "allocation_id",
  as: "assignedOperators",
});

AssignedOperatorsModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
});

AssignedOperatorsModel.belongsTo(EquipmentModel, {
  foreignKey: "equipment_serial_number",
  as: "equipment",
});

EquipmentModel.hasMany(AssignedOperatorsModel, {
  foreignKey: "equipment_serial_number",
  as: "assignedOperators",
});

module.exports = AssignedOperatorsModel;