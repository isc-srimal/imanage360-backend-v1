// // models/fleet-management/AttachmentDeliveryNoteModel.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const AttachmentSwapModel = require("./AttachmentSwapModel");
// const AttachmentModel = require("./AttachmentModel");

// const AttachmentDeliveryNoteModel = sequelize.define(
//   "tbl_attachment_delivery_note",
//   {
//     attachment_dn_id: {
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
//     dn_number: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     new_attachment_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: AttachmentModel,
//         key: "attachment_id",
//       },
//     },
//     new_attachment_no: {
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
//     tableName: "tbl_attachment_delivery_note",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//     hooks: {
//       afterCreate: async (deliveryNote, options) => {
//         try {
//           // Update equipment swap status when delivery note is created
//           await AttachmentSwapModel.update(
//             {
//               delivery_note_status: "In Progress",
//               overall_status: "In Progress",
//             },
//             {
//               where: { attachment_swap_id: deliveryNote.attachment_swap_id },
//               transaction: options.transaction,
//             }
//           );
//         } catch (error) {
//           console.error(
//             "Error in afterCreate hook for AttachmentDeliveryNote:",
//             error
//           );
//         }
//       },
//     },
//   }
// );

// const AttachmentDeliveryNoteTripModel = sequelize.define(
//   "tbl_attachment_dn_trip",
//   {
//     trip_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     attachment_dn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: AttachmentDeliveryNoteModel,
//         key: "attachment_dn_id",
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
//     tableName: "tbl_attachment_dn_trip",
//     timestamps: true,
//   }
// );

// // Associations
// AttachmentDeliveryNoteModel.belongsTo(AttachmentSwapModel, {
//   foreignKey: "attachment_swap_id",
//   as: "attachmentSwap",
// });

// AttachmentDeliveryNoteModel.belongsTo(AttachmentModel, {
//   foreignKey: "new_attachment_id",
//   as: "newAttachment",
// });

// AttachmentDeliveryNoteModel.hasMany(AttachmentDeliveryNoteTripModel, {
//   foreignKey: "attachment_dn_id",
//   as: "trips",
// });

// AttachmentDeliveryNoteTripModel.belongsTo(AttachmentDeliveryNoteModel, {
//   foreignKey: "attachment_dn_id",
//   as: "deliveryNote",
// });

// AttachmentSwapModel.hasMany(AttachmentDeliveryNoteModel, {
//   foreignKey: "attachment_swap_id",
//   as: "deliveryNotes",
// });

// module.exports = {
//   AttachmentDeliveryNoteModel,
//   AttachmentDeliveryNoteTripModel,
// };

// models/fleet-management/AttachmentDeliveryNoteModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const AttachmentSwapModel = require("./AttachmentSwapModel");
const AttachmentModel = require("./AttachmentModel");

const AttachmentDeliveryNoteModel = sequelize.define(
  "tbl_attachment_delivery_note",
  {
    attachment_dn_id: {
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
    dn_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
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
    tableName: "tbl_attachment_delivery_note",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: (deliveryNote) => {
        deliveryNote.status = "Creation";
      },
      afterUpdate: async (deliveryNote, options) => {
        // Sync trip statuses when DN status changes
        if (deliveryNote.changed("status")) {
          await AttachmentDeliveryNoteTripModel.update(
            { trip_status: deliveryNote.status },
            {
              where: { attachment_dn_id: deliveryNote.attachment_dn_id },
              transaction: options.transaction,
            },
          );
        }
      },
      afterCreate: async (deliveryNote, options) => {
        try {
          // Update attachment swap status when delivery note is created
          await AttachmentSwapModel.update(
            {
              delivery_note_status: "In Progress",
              overall_status: "In Progress",
            },
            {
              where: { attachment_swap_id: deliveryNote.attachment_swap_id },
              transaction: options.transaction,
            },
          );
        } catch (error) {
          console.error(
            "Error in afterCreate hook for AttachmentDeliveryNote:",
            error,
          );
        }
      },
    },
  },
);

// Counter Model for trip reference numbers
const TripATDNCounterModel = sequelize.define(
  "tbl_at_dn_trip_counter",
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
    tableName: "tbl_at_dn_trip_counter",
    timestamps: false,
  },
);

// ─── Attachment Delivery Note Trip ─────────────────────────────────────────────
const AttachmentDeliveryNoteTripModel = sequelize.define(
  "tbl_attachment_dn_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attachment_dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentDeliveryNoteModel,
        key: "attachment_dn_id",
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
    tableName: "tbl_attachment_dn_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          // Get or create counter
          const counter = await TripATDNCounterModel.findOrCreate({
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
          trip.trip_reference_number = `AX-AT-DN-TP-${tripNumber}`;

          // Set initial status
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          // Fallback: Use timestamp-based reference
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-AT-DN-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  },
);

// ─── Attachment DN Attachment (resources per trip) ──────────────────────────────
const AttachmentDNAttachmentModel = sequelize.define(
  "tbl_attachment_dn_attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    attachment_dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentDeliveryNoteModel,
        key: "attachment_dn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: AttachmentDeliveryNoteTripModel,
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
    tableName: "tbl_attachment_dn_attachment",
    timestamps: true,
  },
);

// ─── Associations ─────────────────────────────────────────────────────────────
AttachmentDeliveryNoteModel.belongsTo(AttachmentSwapModel, {
  foreignKey: "attachment_swap_id",
  as: "attachmentSwap",
});

AttachmentDeliveryNoteModel.belongsTo(AttachmentModel, {
  foreignKey: "new_attachment_id",
  as: "newAttachment",
});

AttachmentDeliveryNoteModel.hasMany(AttachmentDeliveryNoteTripModel, {
  foreignKey: "attachment_dn_id",
  as: "trips",
});

AttachmentDeliveryNoteTripModel.belongsTo(AttachmentDeliveryNoteModel, {
  foreignKey: "attachment_dn_id",
  as: "deliveryNote",
});

AttachmentDeliveryNoteTripModel.hasMany(AttachmentDNAttachmentModel, {
  foreignKey: "trip_id",
  as: "attachment",
});

AttachmentDeliveryNoteModel.hasMany(AttachmentDNAttachmentModel, {
  foreignKey: "attachment_dn_id",
  as: "attachment",
});

AttachmentSwapModel.hasMany(AttachmentDeliveryNoteModel, {
  foreignKey: "attachment_swap_id",
  as: "deliveryNotes",
});

module.exports = {
  AttachmentDeliveryNoteModel,
  AttachmentDeliveryNoteTripModel,
  AttachmentDNAttachmentModel,
  TripATDNCounterModel,
};
