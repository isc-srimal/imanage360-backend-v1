// // // models/fleet-management/EquipmentDeliveryNoteModel.js
// // const { DataTypes } = require("sequelize");
// // const sequelize = require("../../config/dbSync");
// // const EquipmentSwapModel = require("./EquipmentSwapModel");
// // const EquipmentModel = require("./EquipmentModel");

// // const EquipmentDeliveryNoteModel = sequelize.define(
// //   "tbl_equipment_delivery_note",
// //   {
// //     equipment_dn_id: {
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
// //     dn_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //       unique: true,
// //     },
// //     new_equipment_serial: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: EquipmentModel,
// //         key: "serial_number",
// //       },
// //     },
// //     new_plate_no: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     delivery_date: {
// //       type: DataTypes.DATEONLY,
// //       allowNull: false,
// //     },
// //     status: {
// //       type: DataTypes.ENUM("Creation", "In Progress", "Delivered", "Cancelled"),
// //       allowNull: false,
// //       defaultValue: "Creation",
// //     },
// //     delivery_attachment: {
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
// //     tableName: "tbl_equipment_delivery_note",
// //     timestamps: true,
// //     createdAt: "created_at",
// //     updatedAt: "updated_at",
// //   }
// // );

// // // Associations
// // EquipmentDeliveryNoteModel.belongsTo(EquipmentSwapModel, {
// //   foreignKey: "equipment_swap_id",
// //   as: "equipmentSwap",
// // });

// // EquipmentDeliveryNoteModel.belongsTo(EquipmentModel, {
// //   foreignKey: "new_equipment_serial",
// //   as: "newEquipment",
// // });

// // EquipmentSwapModel.hasMany(EquipmentDeliveryNoteModel, {
// //   foreignKey: "equipment_swap_id",
// //   as: "deliveryNotes",
// // });

// // module.exports = EquipmentDeliveryNoteModel;

// // models/fleet-management/EquipmentDeliveryNoteModel.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const EquipmentSwapModel = require("./EquipmentSwapModel");
// const EquipmentModel = require("./EquipmentModel");

// const EquipmentDeliveryNoteModel = sequelize.define(
//   "tbl_equipment_delivery_note",
//   {
//     equipment_dn_id: {
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
//     dn_number: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     new_equipment_serial: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: EquipmentModel,
//         key: "serial_number",
//       },
//     },
//     new_plate_no: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     delivery_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.ENUM("Creation", "In Progress", "Delivered", "Cancelled"),
//       allowNull: false,
//       defaultValue: "Creation",
//     },
//     delivery_attachment: {
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
//     tableName: "tbl_equipment_delivery_note",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//     hooks: {
//       afterCreate: async (deliveryNote, options) => {
//         try {
//           // Update equipment swap status when delivery note is created
//           await EquipmentSwapModel.update(
//             {
//               delivery_note_status: "In Progress",
//               overall_status: "In Progress"
//             },
//             {
//               where: { equipment_swap_id: deliveryNote.equipment_swap_id },
//               transaction: options.transaction
//             }
//           );
//         } catch (error) {
//           console.error("Error in afterCreate hook for EquipmentDeliveryNote:", error);
//         }
//       }
//     }
//   }
// );

// // Equipment Delivery Note Trip Model
// const EquipmentDeliveryNoteTripModel = sequelize.define(
//   "tbl_equipment_dn_trip",
//   {
//     trip_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     equipment_dn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: EquipmentDeliveryNoteModel,
//         key: "equipment_dn_id",
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
//       type: DataTypes.ENUM("Creation", "In Progress", "Delivered", "Cancelled"),
//       allowNull: false,
//       defaultValue: "Creation",
//     },
//     remarks: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "tbl_equipment_dn_trip",
//     timestamps: true,
//   }
// );

// // Associations
// EquipmentDeliveryNoteModel.belongsTo(EquipmentSwapModel, {
//   foreignKey: "equipment_swap_id",
//   as: "equipmentSwap",
// });

// EquipmentDeliveryNoteModel.belongsTo(EquipmentModel, {
//   foreignKey: "new_equipment_serial",
//   as: "newEquipment",
// });

// EquipmentDeliveryNoteModel.hasMany(EquipmentDeliveryNoteTripModel, {
//   foreignKey: "equipment_dn_id",
//   as: "trips",
// });

// EquipmentDeliveryNoteTripModel.belongsTo(EquipmentDeliveryNoteModel, {
//   foreignKey: "equipment_dn_id",
//   as: "deliveryNote",
// });

// EquipmentSwapModel.hasMany(EquipmentDeliveryNoteModel, {
//   foreignKey: "equipment_swap_id",
//   as: "deliveryNotes",
// });

// module.exports = {
//   EquipmentDeliveryNoteModel,
//   EquipmentDeliveryNoteTripModel,
// };

// models/fleet-management/EquipmentDeliveryNoteModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EquipmentSwapModel = require("./EquipmentSwapModel");
const EquipmentModel = require("./EquipmentModel");

// ─── Equipment Delivery Note ──────────────────────────────────────────────────

const EquipmentDeliveryNoteModel = sequelize.define(
  "tbl_equipment_delivery_note",
  {
    equipment_dn_id: {
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
    dn_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    new_equipment_serial: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
    },
    new_plate_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Extended status workflow to match main DeliveryNoteModel
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
    delivery_attachment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "File path for signed delivery note",
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
      comment: "Auto-incremented trip number sequence per delivery note",
    },
  },
  {
    tableName: "tbl_equipment_delivery_note",
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

// Counter Model for trip reference numbers
const TripEQDNCounterModel = sequelize.define(
  "tbl_eq_dn_trip_counter",
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
    tableName: "tbl_eq_dn_trip_counter",
    timestamps: false,
  },
);

// ─── Equipment Delivery Note Trip ─────────────────────────────────────────────

const EquipmentDeliveryNoteTripModel = sequelize.define(
  "tbl_equipment_dn_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentDeliveryNoteModel,
        key: "equipment_dn_id",
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
    tableName: "tbl_equipment_dn_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          // Get or create counter
          const counter = await TripEQDNCounterModel.findOrCreate({
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
          trip.trip_reference_number = `AX-EQ-DN-TP-${tripNumber}`;

          // Set initial status
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          // Fallback: Use timestamp-based reference
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-EQ-DN-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  },
);

// ─── Equipment DN Equipment (resources per trip) ──────────────────────────────

const EquipmentDNEquipmentModel = sequelize.define(
  "tbl_equipment_dn_equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    equipment_dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentDeliveryNoteModel,
        key: "equipment_dn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: EquipmentDeliveryNoteTripModel,
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
    tableName: "tbl_equipment_dn_equipment",
    timestamps: true,
  },
);

// ─── Associations ─────────────────────────────────────────────────────────────

EquipmentDeliveryNoteModel.belongsTo(EquipmentSwapModel, {
  foreignKey: "equipment_swap_id",
  as: "equipmentSwap",
});

EquipmentDeliveryNoteModel.belongsTo(EquipmentModel, {
  foreignKey: "new_equipment_serial",
  as: "newEquipment",
});

EquipmentDeliveryNoteModel.hasMany(EquipmentDeliveryNoteTripModel, {
  foreignKey: "equipment_dn_id",
  as: "trips",
});

EquipmentDeliveryNoteTripModel.belongsTo(EquipmentDeliveryNoteModel, {
  foreignKey: "equipment_dn_id",
  as: "deliveryNote",
});

EquipmentDeliveryNoteTripModel.hasMany(EquipmentDNEquipmentModel, {
  foreignKey: "trip_id",
  as: "equipment",
});

EquipmentDeliveryNoteModel.hasMany(EquipmentDNEquipmentModel, {
  foreignKey: "equipment_dn_id",
  as: "equipment",
});

EquipmentSwapModel.hasMany(EquipmentDeliveryNoteModel, {
  foreignKey: "equipment_swap_id",
  as: "deliveryNotes",
});

module.exports = {
  EquipmentDeliveryNoteModel,
  EquipmentDeliveryNoteTripModel,
  EquipmentDNEquipmentModel,
  TripEQDNCounterModel,
};
