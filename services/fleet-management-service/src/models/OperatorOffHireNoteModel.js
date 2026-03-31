// // models/fleet-management/OperatorOffHireNoteModel.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const OperatorChangeModel = require("./OperatorChangeModel");
// const ManpowerModel = require("./ManpowerModel");

// const OperatorOffHireNoteModel = sequelize.define(
//   "tbl_operator_off_hire_note",
//   {
//     operator_ohn_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     operator_change_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: OperatorChangeModel,
//         key: "operator_change_id",
//       },
//     },
//     ohn_number: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     previous_operator_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: ManpowerModel,
//         key: "manpower_id",
//       },
//     },
//     previous_operator_name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     off_hire_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM("Creation", "In Progress", "Completed", "Cancelled"),
//       allowNull: false,
//       defaultValue: "Creation",
//     },
//     off_hire_attachment: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     remarks: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     created_by: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       onUpdate: DataTypes.NOW,
//     },
//   },
//   {
//     tableName: "tbl_operator_off_hire_note",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//     hooks: {
//       afterCreate: async (offHireNote, options) => {
//         try {
//           // Update equipment swap status when off hire note is created
//           await OperatorChangeModel.update(
//             {
//               off_hire_note_status: "In Progress",
//             },
//             {
//               where: { operator_change_id: offHireNote.operator_change_id },
//               transaction: options.transaction,
//             }
//           );
//         } catch (error) {
//           console.error(
//             "Error in afterCreate hook for OperatorOffHireNote:",
//             error
//           );
//         }
//       },
//     },
//   }
// );

// const OperatorOffHireNoteTripModel = sequelize.define(
//   "tbl_operator_ohn_trip",
//   {
//     trip_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     operator_ohn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: OperatorOffHireNoteModel,
//         key: "operator_ohn_id",
//       },
//       onDelete: "CASCADE",
//     },
//     trip_number: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     transportation_company: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     driver_name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     driver_contact: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//     },
//     vehicle_type: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },
//     vehicle_number: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//     trip_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     trip_status: {
//       type: DataTypes.ENUM("Creation", "In Progress", "Completed", "Cancelled"),
//       allowNull: false,
//       defaultValue: "Creation",
//     },
//     remarks: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "tbl_operator_ohn_trip",
//     timestamps: true,
//   }
// );

// // Associations
// OperatorOffHireNoteModel.belongsTo(OperatorChangeModel, {
//   foreignKey: "operator_change_id",
//   as: "operatorChange",
// });

// OperatorOffHireNoteModel.belongsTo(ManpowerModel, {
//   foreignKey: "previous_operator_id",
//   as: "previousOperator",
// });

// OperatorOffHireNoteModel.hasMany(OperatorOffHireNoteTripModel, {
//   foreignKey: "operator_ohn_id",
//   as: "trips",
// });

// OperatorOffHireNoteTripModel.belongsTo(OperatorOffHireNoteModel, {
//   foreignKey: "operator_ohn_id",
//   as: "offHireNote",
// });

// OperatorChangeModel.hasMany(OperatorOffHireNoteModel, {
//   foreignKey: "operator_change_id",
//   as: "offHireNotes",
// });

// module.exports = {
//   OperatorOffHireNoteModel,
//   OperatorOffHireNoteTripModel,
// };

// models/fleet-management/OperatorOffHireNoteModel.js (UPDATED)
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const OperatorChangeModel = require("./OperatorChangeModel");
const ManpowerModel = require("./ManpowerModel");

const OperatorOffHireNoteModel = sequelize.define(
  "tbl_operator_off_hire_note",
  {
    operator_ohn_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operator_change_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperatorChangeModel,
        key: "operator_change_id",
      },
    },
    ohn_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    previous_operator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ManpowerModel,
        key: "manpower_id",
      },
    },
    previous_operator_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Extended status workflow to match EquipmentOffHireNoteModel
    status: {
      type: DataTypes.ENUM(
        "Creation",
        "Under Approval",
        "Approved",
        "In Progress",
        "Completed",
        "Rejected",
        "Close",
      ),
      allowNull: false,
      defaultValue: "Creation",
    },
    off_hire_attachment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "File path for signed off hire note",
    },
    uploaded_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    approved_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    trip_number_sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Auto-incremented trip number sequence per off hire note",
    },
  },
  {
    tableName: "tbl_operator_off_hire_note",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: (offHireNote) => {
        offHireNote.status = "Creation";
      },
      afterCreate: async (offHireNote, options) => {
        try {
          // Update operator change status when off hire note is created
          await OperatorChangeModel.update(
            {
              off_hire_note_status: "In Progress",
            },
            {
              where: { operator_change_id: offHireNote.operator_change_id },
              transaction: options.transaction,
            },
          );

          // Update overall status based on group logic
          await updateOperatorChangeOverallStatus(
            offHireNote.operator_change_id,
            options.transaction,
          );
        } catch (error) {
          console.error(
            "Error in afterCreate hook for OperatorOffHireNote:",
            error,
          );
        }
      },
    },
  },
);

// Counter Model for trip reference numbers
const TripOPOHNCounterModel = sequelize.define(
  "tbl_op_ohn_trip_counter",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    counter_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      defaultValue: "trip_reference",
    },
    last_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "tbl_op_ohn_trip_counter",
    timestamps: false,
  },
);

// Operator Off Hire Note Trip Model (Enhanced)
const OperatorOffHireNoteTripModel = sequelize.define(
  "tbl_operator_ohn_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operator_ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperatorOffHireNoteModel,
        key: "operator_ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 7,
      },
    },
    trip_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    transportation_company: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    driver_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    driver_contact: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    vehicle_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    vehicle_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    recovery_vehicle_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "Vehicle number selected from recovery section",
    },
    allocated_equipment_serial: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Serial number of allocated equipment when selected as vehicle",
    },
    chargeable_type: {
      type: DataTypes.ENUM("Mobilization", "Non-Chargeable"),
      allowNull: true,
    },
    // Extended status workflow
    trip_status: {
      type: DataTypes.ENUM(
        "Creation",
        "Under Approval",
        "Approved",
        "In Progress",
        "Completed",
        "Rejected",
        "Close",
      ),
      allowNull: false,
      defaultValue: "Creation",
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    trip_reference_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_operator_ohn_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          // Get or create counter
          const counter = await TripOPOHNCounterModel.findOrCreate({
            where: { counter_name: "trip_reference" },
            defaults: { last_value: 0 },
            transaction: options.transaction,
          });

          // Increment counter
          const nextValue = counter[0].last_value + 1;
          await counter[0].update(
            { last_value: nextValue },
            { transaction: options.transaction },
          );

          // Generate trip reference number in AX-TP-001 format
          const tripNumber = String(nextValue).padStart(3, "0");
          trip.trip_reference_number = `AX-OP-OHN-TP-${tripNumber}`;

          // Set initial status
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          // Fallback: Use timestamp-based reference
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-OP-OHN-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  },
);

// NEW: Operator OHN Equipment Model (resources per trip)
const OperatorOHNManpowerModel = sequelize.define(
  "tbl_operator_ohn_manpower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operator_ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperatorOffHireNoteModel,
        key: "operator_ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OperatorOffHireNoteTripModel,
        key: "trip_id",
      },
      onDelete: "SET NULL",
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employee_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    employee_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
  },
  {
    tableName: "tbl_operator_ohn_manpower",
    timestamps: true,
  },
);

// Helper function to update overall status based on group
async function updateOperatorChangeOverallStatus(
  operatorChangeId,
  transaction,
) {
  try {
    const operatorChange = await OperatorChangeModel.findByPk(
      operatorChangeId,
      {
        transaction,
      },
    );

    if (!operatorChange || !operatorChange.change_group_id) {
      return;
    }

    // Get all changes in the same group
    const groupChanges = await OperatorChangeModel.findAll({
      where: {
        change_group_id: operatorChange.change_group_id,
      },
      transaction,
    });

    // Check if both delivery and off-hire notes exist and are completed
    const deliveryChange = groupChanges.find(
      (c) => c.change_type === "DELIVERY",
    );
    const offHireChange = groupChanges.find(
      (c) => c.change_type === "OFF_HIRE",
    );

    if (!deliveryChange || !offHireChange) {
      return;
    }

    // Get the notes
    const deliveryNote = await OperatorDeliveryNoteModel.findOne({
      where: { operator_change_id: deliveryChange.operator_change_id },
      transaction,
    });

    const offHireNote = await OperatorOffHireNoteModel.findOne({
      where: { operator_change_id: offHireChange.operator_change_id },
      transaction,
    });

    let overallStatus = "In progress";

    if (deliveryNote && offHireNote) {
      if (
        deliveryNote.status === "Completed" &&
        offHireNote.status === "Completed"
      ) {
        overallStatus = "Completed";
      } else if (
        deliveryNote.status === "Completed" ||
        offHireNote.status === "Completed"
      ) {
        overallStatus = "Partially completed";
      }
    }

    // Update both records
    await OperatorChangeModel.update(
      { overall_status: overallStatus },
      {
        where: { change_group_id: operatorChange.change_group_id },
        transaction,
      },
    );
  } catch (error) {
    console.error("Error updating operator change overall status:", error);
  }
}

// Associations
OperatorOffHireNoteModel.belongsTo(OperatorChangeModel, {
  foreignKey: "operator_change_id",
  as: "operatorChange",
});

OperatorOffHireNoteModel.belongsTo(ManpowerModel, {
  foreignKey: "previous_operator_id",
  as: "previousOperator",
});

OperatorOffHireNoteModel.hasMany(OperatorOffHireNoteTripModel, {
  foreignKey: "operator_ohn_id",
  as: "trips",
});

OperatorOffHireNoteModel.hasMany(OperatorOHNManpowerModel, {
  foreignKey: "operator_ohn_id",
  as: "manpower",
});

OperatorOffHireNoteTripModel.belongsTo(OperatorOffHireNoteModel, {
  foreignKey: "operator_ohn_id",
  as: "offHireNote",
});

OperatorOffHireNoteTripModel.hasMany(OperatorOHNManpowerModel, {
  foreignKey: "trip_id",
  as: "manpower",
});

OperatorOHNManpowerModel.belongsTo(OperatorOffHireNoteTripModel, {
  foreignKey: "trip_id",
  as: "trip",
});

OperatorChangeModel.hasMany(OperatorOffHireNoteModel, {
  foreignKey: "operator_change_id",
  as: "offHireNotes",
});

// Import here to avoid circular dependency
const { OperatorDeliveryNoteModel } = require("./OperatorDeliveryNoteModel");

module.exports = {
  OperatorOffHireNoteModel,
  OperatorOffHireNoteTripModel,
  OperatorOHNManpowerModel,
  TripOPOHNCounterModel,
};
