// // // models/fleet-management/EquipmentOffHireNoteModel.js
// // const { DataTypes } = require("sequelize");
// // const sequelize = require("../../config/dbSync");
// // const EquipmentSwapModel = require("./EquipmentSwapModel");
// // const EquipmentModel = require("./EquipmentModel");

// // const EquipmentOffHireNoteModel = sequelize.define(
// //   "tbl_equipment_off_hire_note",
// //   {
// //     equipment_ohn_id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     equipment_swap_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: EquipmentSwapModel,
// //         key: "equipment_swap_id",
// //       },
// //     },
// //     ohn_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //       unique: true,
// //     },
// //     previous_equipment_serial: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: EquipmentModel,
// //         key: "serial_number",
// //       },
// //     },
// //     previous_plate_no: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     off_hire_date: {
// //       type: DataTypes.DATEONLY,
// //       allowNull: false,
// //     },
// //     status: {
// //       type: DataTypes.ENUM("Creation", "In Progress", "Completed", "Cancelled"),
// //       allowNull: false,
// //       defaultValue: "Creation",
// //     },
// //     off_hire_attachment: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     remarks: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     created_by: {
// //       type: DataTypes.STRING(100),
// //       allowNull: true,
// //     },
// //     created_at: {
// //       type: DataTypes.DATE,
// //       defaultValue: DataTypes.NOW,
// //     },
// //     updated_at: {
// //       type: DataTypes.DATE,
// //       defaultValue: DataTypes.NOW,
// //       onUpdate: DataTypes.NOW,
// //     },
// //   },
// //   {
// //     tableName: "tbl_equipment_off_hire_note",
// //     timestamps: true,
// //     createdAt: "created_at",
// //     updatedAt: "updated_at",
// //   }
// // );

// // // Associations
// // EquipmentOffHireNoteModel.belongsTo(EquipmentSwapModel, {
// //   foreignKey: "equipment_swap_id",
// //   as: "equipmentSwap",
// // });

// // EquipmentOffHireNoteModel.belongsTo(EquipmentModel, {
// //   foreignKey: "previous_equipment_serial",
// //   as: "previousEquipment",
// // });

// // EquipmentSwapModel.hasMany(EquipmentOffHireNoteModel, {
// //   foreignKey: "equipment_swap_id",
// //   as: "offHireNotes",
// // });

// // module.exports = EquipmentOffHireNoteModel;

// // models/fleet-management/EquipmentOffHireNoteModel.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const EquipmentSwapModel = require("./EquipmentSwapModel");
// const EquipmentModel = require("./EquipmentModel");

// const EquipmentOffHireNoteModel = sequelize.define(
//   "tbl_equipment_off_hire_note",
//   {
//     equipment_ohn_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     equipment_swap_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: EquipmentSwapModel,
//         key: "equipment_swap_id",
//       },
//     },
//     ohn_number: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     previous_equipment_serial: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: EquipmentModel,
//         key: "serial_number",
//       },
//     },
//     previous_plate_no: {
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
//     tableName: "tbl_equipment_off_hire_note",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//     hooks: {
//       afterCreate: async (offHireNote, options) => {
//         try {
//           // Update equipment swap status when off hire note is created
//           await EquipmentSwapModel.update(
//             {
//               off_hire_note_status: "In Progress"
//             },
//             {
//               where: { equipment_swap_id: offHireNote.equipment_swap_id },
//               transaction: options.transaction
//             }
//           );
//         } catch (error) {
//           console.error("Error in afterCreate hook for EquipmentOffHireNote:", error);
//         }
//       }
//     }
//   }
// );

// // Equipment Off Hire Note Trip Model
// const EquipmentOffHireNoteTripModel = sequelize.define(
//   "tbl_equipment_ohn_trip",
//   {
//     trip_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     equipment_ohn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: EquipmentOffHireNoteModel,
//         key: "equipment_ohn_id",
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
//     tableName: "tbl_equipment_ohn_trip",
//     timestamps: true,
//   }
// );

// // Associations
// EquipmentOffHireNoteModel.belongsTo(EquipmentSwapModel, {
//   foreignKey: "equipment_swap_id",
//   as: "equipmentSwap",
// });

// EquipmentOffHireNoteModel.belongsTo(EquipmentModel, {
//   foreignKey: "previous_equipment_serial",
//   as: "previousEquipment",
// });

// EquipmentOffHireNoteModel.hasMany(EquipmentOffHireNoteTripModel, {
//   foreignKey: "equipment_ohn_id",
//   as: "trips",
// });

// EquipmentOffHireNoteTripModel.belongsTo(EquipmentOffHireNoteModel, {
//   foreignKey: "equipment_ohn_id",
//   as: "offHireNote",
// });

// EquipmentSwapModel.hasMany(EquipmentOffHireNoteModel, {
//   foreignKey: "equipment_swap_id",
//   as: "offHireNotes",
// });

// module.exports = {
//   EquipmentOffHireNoteModel,
//   EquipmentOffHireNoteTripModel,
// };

// models/fleet-management/EquipmentOffHireNoteModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EquipmentSwapModel = require("./EquipmentSwapModel");
const EquipmentModel = require("./EquipmentModel");

// ─── Equipment Off Hire Note ──────────────────────────────────────────────────

const EquipmentOffHireNoteModel = sequelize.define(
  "tbl_equipment_off_hire_note",
  {
    equipment_ohn_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_swap_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentSwapModel,
        key: "equipment_swap_id",
      },
    },
    ohn_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    previous_equipment_serial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
    },
    previous_plate_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Extended status workflow to match EquipmentDeliveryNoteModel
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
    tableName: "tbl_equipment_off_hire_note",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Counter Model for trip reference numbers
const TripEQOHNCounterModel = sequelize.define(
  "tbl_eq_ohn_trip_counter",
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
    tableName: "tbl_eq_ohn_trip_counter",
    timestamps: false,
  },
);

// ─── Equipment Off Hire Note Trip ─────────────────────────────────────────────

const EquipmentOffHireNoteTripModel = sequelize.define(
  "tbl_equipment_ohn_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentOffHireNoteModel,
        key: "equipment_ohn_id",
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
    tableName: "tbl_equipment_ohn_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          // Get or create counter
          const counter = await TripEQOHNCounterModel.findOrCreate({
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
          trip.trip_reference_number = `AX-EQ-OHN-TP-${tripNumber}`;

          // Set initial status
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          // Fallback: Use timestamp-based reference
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-EQ-OHN-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  },
);

// ─── Equipment OHN Equipment (resources per trip) ─────────────────────────────

const EquipmentOHNEquipmentModel = sequelize.define(
  "tbl_equipment_ohn_equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentOffHireNoteModel,
        key: "equipment_ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: EquipmentOffHireNoteTripModel,
        key: "trip_id",
      },
      onDelete: "SET NULL",
    },
    serial_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reg_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    equipment_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
  },
  {
    tableName: "tbl_equipment_ohn_equipment",
    timestamps: true,
  },
);

// ─── Associations ─────────────────────────────────────────────────────────────

EquipmentOffHireNoteModel.belongsTo(EquipmentSwapModel, {
  foreignKey: "equipment_swap_id",
  as: "equipmentSwap",
});

EquipmentOffHireNoteModel.belongsTo(EquipmentModel, {
  foreignKey: "previous_equipment_serial",
  as: "previousEquipment",
});

EquipmentOffHireNoteModel.hasMany(EquipmentOffHireNoteTripModel, {
  foreignKey: "equipment_ohn_id",
  as: "trips",
});

EquipmentOffHireNoteTripModel.belongsTo(EquipmentOffHireNoteModel, {
  foreignKey: "equipment_ohn_id",
  as: "offHireNote",
});

EquipmentOffHireNoteTripModel.hasMany(EquipmentOHNEquipmentModel, {
  foreignKey: "trip_id",
  as: "equipment",
});

EquipmentOffHireNoteModel.hasMany(EquipmentOHNEquipmentModel, {
  foreignKey: "equipment_ohn_id",
  as: "equipment",
});

EquipmentSwapModel.hasMany(EquipmentOffHireNoteModel, {
  foreignKey: "equipment_swap_id",
  as: "offHireNotes",
});

module.exports = {
  EquipmentOffHireNoteModel,
  EquipmentOffHireNoteTripModel,
  EquipmentOHNEquipmentModel,
  TripEQOHNCounterModel,
};
