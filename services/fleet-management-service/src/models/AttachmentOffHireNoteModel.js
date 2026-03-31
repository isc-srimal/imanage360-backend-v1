// // models/fleet-management/AttachmentOffHireNoteModel.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const AttachmentSwapModel = require("./AttachmentSwapModel");
// const AttachmentModel = require("./AttachmentModel");

// const AttachmentOffHireNoteModel = sequelize.define(
//   "tbl_attachment_off_hire_note",
//   {
//     attachment_ohn_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     attachment_swap_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: AttachmentSwapModel,
//         key: "attachment_swap_id",
//       },
//     },
//     ohn_number: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     previous_attachment_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: AttachmentModel,
//         key: "attachment_id",
//       },
//     },
//     previous_attachment_no: {
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
//     tableName: "tbl_attachment_off_hire_note",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//     hooks: {
//       afterCreate: async (offHireNote, options) => {
//         try {
//           // Update equipment swap status when off hire note is created
//           await AttachmentSwapModel.update(
//             {
//               off_hire_note_status: "In Progress",
//             },
//             {
//               where: { attachment_swap_id: offHireNote.attachment_swap_id },
//               transaction: options.transaction,
//             }
//           );
//         } catch (error) {
//           console.error(
//             "Error in afterCreate hook for AttachmentOffHireNote:",
//             error
//           );
//         }
//       },
//     },
//   }
// );

// const AttachmentOffHireNoteTripModel = sequelize.define(
//   "tbl_attachment_ohn_trip",
//   {
//     trip_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     attachment_ohn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: AttachmentOffHireNoteModel,
//         key: "attachment_ohn_id",
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
//     tableName: "tbl_attachment_ohn_trip",
//     timestamps: true,
//   }
// );

// // Associations
// AttachmentOffHireNoteModel.belongsTo(AttachmentSwapModel, {
//   foreignKey: "attachment_swap_id",
//   as: "attachmentSwap",
// });

// AttachmentOffHireNoteModel.belongsTo(AttachmentModel, {
//   foreignKey: "previous_attachment_id",
//   as: "previousAttachment",
// });

// AttachmentOffHireNoteModel.hasMany(AttachmentOffHireNoteTripModel, {
//   foreignKey: "attachment_ohn_id",
//   as: "trips",
// });

// AttachmentOffHireNoteTripModel.belongsTo(AttachmentOffHireNoteModel, {
//   foreignKey: "attachment_ohn_id",
//   as: "offHireNote",
// });

// AttachmentSwapModel.hasMany(AttachmentOffHireNoteModel, {
//   foreignKey: "attachment_swap_id",
//   as: "offHireNotes",
// });

// module.exports = {
//   AttachmentOffHireNoteModel,
//   AttachmentOffHireNoteTripModel,
// };

// models/fleet-management/AttachmentOffHireNoteModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const AttachmentSwapModel = require("./AttachmentSwapModel");
const AttachmentModel = require("./AttachmentModel");

const AttachmentOffHireNoteModel = sequelize.define(
  "tbl_attachment_off_hire_note",
  {
    attachment_ohn_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attachment_swap_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentSwapModel,
        key: "attachment_swap_id",
      },
    },
    ohn_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    tableName: "tbl_attachment_off_hire_note",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: (offHireNote) => {
        offHireNote.status = "Creation";
      },
      afterUpdate: async (offHireNote, options) => {
        // Sync trip statuses when OHN status changes
        if (offHireNote.changed("status")) {
          await AttachmentOffHireNoteTripModel.update(
            { trip_status: offHireNote.status },
            {
              where: { attachment_ohn_id: offHireNote.attachment_ohn_id },
              transaction: options.transaction,
            },
          );
        }
      },
      afterCreate: async (offHireNote, options) => {
        try {
          // Update attachment swap status when off hire note is created
          await AttachmentSwapModel.update(
            {
              off_hire_note_status: "In Progress",
              // overall_status will be updated by the controller logic
            },
            {
              where: { attachment_swap_id: offHireNote.attachment_swap_id },
              transaction: options.transaction,
            },
          );
        } catch (error) {
          console.error(
            "Error in afterCreate hook for AttachmentOffHireNote:",
            error,
          );
        }
      },
    },
  },
);

// Counter Model for trip reference numbers
const TripATOHNCounterModel = sequelize.define(
  "tbl_at_ohn_trip_counter",
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
    tableName: "tbl_at_ohn_trip_counter",
    timestamps: false,
  },
);

// ─── Attachment Off Hire Note Trip ─────────────────────────────────────────────
const AttachmentOffHireNoteTripModel = sequelize.define(
  "tbl_attachment_ohn_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attachment_ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentOffHireNoteModel,
        key: "attachment_ohn_id",
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
    tableName: "tbl_attachment_ohn_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          // Get or create counter
          const counter = await TripATOHNCounterModel.findOrCreate({
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
          trip.trip_reference_number = `AX-AT-OHN-TP-${tripNumber}`;

          // Set initial status
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          // Fallback: Use timestamp-based reference
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-AT-OHN-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  },
);

// ─── Attachment OHN Equipment (resources per trip) ─────────────────────────────
const AttachmentOHNAttachmentModel = sequelize.define(
  "tbl_attachment_ohn_attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attachment_ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentOffHireNoteModel,
        key: "attachment_ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AttachmentOffHireNoteTripModel,
        key: "trip_id",
      },
      onDelete: "SET NULL",
    },
    attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID of the attachment being transported",
    },
    attachment_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    attachment_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
  },
  {
    tableName: "tbl_attachment_ohn_attachment",
    timestamps: true,
  },
);

// ─── Associations ─────────────────────────────────────────────────────────────
AttachmentOffHireNoteModel.belongsTo(AttachmentSwapModel, {
  foreignKey: "attachment_swap_id",
  as: "attachmentSwap",
});

AttachmentOffHireNoteModel.belongsTo(AttachmentModel, {
  foreignKey: "previous_attachment_id",
  as: "previousAttachment",
});

AttachmentOffHireNoteModel.hasMany(AttachmentOffHireNoteTripModel, {
  foreignKey: "attachment_ohn_id",
  as: "trips",
});

AttachmentOffHireNoteTripModel.belongsTo(AttachmentOffHireNoteModel, {
  foreignKey: "attachment_ohn_id",
  as: "offHireNote",
});

AttachmentOffHireNoteTripModel.hasMany(AttachmentOHNAttachmentModel, {
  foreignKey: "trip_id",
  as: "attachment",
});

AttachmentOffHireNoteModel.hasMany(AttachmentOHNAttachmentModel, {
  foreignKey: "attachment_ohn_id",
  as: "attachment",
});

AttachmentSwapModel.hasMany(AttachmentOffHireNoteModel, {
  foreignKey: "attachment_swap_id",
  as: "offHireNotes",
});

module.exports = {
  AttachmentOffHireNoteModel,
  AttachmentOffHireNoteTripModel,
  AttachmentOHNAttachmentModel,
  TripATOHNCounterModel,
};
