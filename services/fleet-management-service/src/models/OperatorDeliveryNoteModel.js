// // models/fleet-management/OperatorDeliveryNoteModel.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const OperatorChangeModel = require("./OperatorChangeModel");
// const ManpowerModel = require("./ManpowerModel");

// const OperatorDeliveryNoteModel = sequelize.define(
//   "tbl_operator_delivery_note",
//   {
//     operator_dn_id: {
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
//     dn_number: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     new_operator_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: ManpowerModel,
//         key: "manpower_id",
//       },
//     },
//     new_operator_name: {
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
//     tableName: "tbl_operator_delivery_note",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//     hooks: {
//       afterCreate: async (deliveryNote, options) => {
//         try {
//           // Update equipment swap status when delivery note is created
//           await OperatorChangeModel.update(
//             {
//               delivery_note_status: "In Progress",
//               overall_status: "In Progress",
//             },
//             {
//               where: { operator_change_id: deliveryNote.operator_change_id },
//               transaction: options.transaction,
//             }
//           );
//         } catch (error) {
//           console.error(
//             "Error in afterCreate hook for OperatorDeliveryNote:",
//             error
//           );
//         }
//       },
//     },
//   }
// );

// const OperatorDeliveryNoteTripModel = sequelize.define(
//   "tbl_operator_dn_trip",
//   {
//     trip_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     operator_dn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: OperatorDeliveryNoteModel,
//         key: "operator_dn_id",
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
//     tableName: "tbl_operator_dn_trip",
//     timestamps: true,
//   }
// );

// // Associations
// OperatorDeliveryNoteModel.belongsTo(OperatorChangeModel, {
//   foreignKey: "operator_change_id",
//   as: "operatorChange",
// });

// OperatorDeliveryNoteModel.belongsTo(ManpowerModel, {
//   foreignKey: "new_operator_id",
//   as: "newOperator",
// });

// OperatorDeliveryNoteModel.hasMany(OperatorDeliveryNoteTripModel, {
//   foreignKey: "operator_dn_id",
//   as: "trips",
// });

// OperatorDeliveryNoteTripModel.belongsTo(OperatorDeliveryNoteModel, {
//   foreignKey: "operator_dn_id",
//   as: "deliveryNote",
// });

// OperatorChangeModel.hasMany(OperatorDeliveryNoteModel, {
//   foreignKey: "operator_change_id",
//   as: "deliveryNotes",
// });

// module.exports = {
//   OperatorDeliveryNoteModel,
//   OperatorDeliveryNoteTripModel,
// };

// models/fleet-management/OperatorDeliveryNoteModel.js (UPDATED)
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const OperatorChangeModel = require("./OperatorChangeModel");
const ManpowerModel = require("./ManpowerModel");

const OperatorDeliveryNoteModel = sequelize.define(
  "tbl_operator_delivery_note",
  {
    operator_dn_id: {
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
    dn_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    new_operator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ManpowerModel,
        key: "manpower_id",
      },
    },
    new_operator_name: {
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
    tableName: "tbl_operator_delivery_note",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeCreate: (deliveryNote) => {
        deliveryNote.status = "Creation";
      },
      afterCreate: async (deliveryNote, options) => {
        try {
          // Update operator change status when delivery note is created
          await OperatorChangeModel.update(
            {
              delivery_note_status: "In Progress",
            },
            {
              where: { operator_change_id: deliveryNote.operator_change_id },
              transaction: options.transaction,
            },
          );

          // Update overall status based on group logic
          await updateOperatorChangeOverallStatus(
            deliveryNote.operator_change_id,
            options.transaction,
          );
        } catch (error) {
          console.error(
            "Error in afterCreate hook for OperatorDeliveryNote:",
            error,
          );
        }
      },
    },
  },
);

// Counter Model for trip reference numbers
const TripOPDNCounterModel = sequelize.define(
  "tbl_op_dn_trip_counter",
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
    tableName: "tbl_op_dn_trip_counter",
    timestamps: false,
  },
);

// Operator Delivery Note Trip Model (Enhanced with resource tracking)
const OperatorDeliveryNoteTripModel = sequelize.define(
  "tbl_operator_dn_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operator_dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperatorDeliveryNoteModel,
        key: "operator_dn_id",
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
    // Extended status workflow to match main DN
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
    tableName: "tbl_operator_dn_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          // Get or create counter
          const counter = await TripOPDNCounterModel.findOrCreate({
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
          trip.trip_reference_number = `AX-OP-DN-TP-${tripNumber}`;

          // Set initial status
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          // Fallback: Use timestamp-based reference
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-OP-DN-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  },
);

// NEW: Operator DN Equipment Model (resources per trip)
const OperatorDNManpowerModel = sequelize.define(
  "tbl_operator_dn_manpower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    operator_dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperatorDeliveryNoteModel,
        key: "operator_dn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OperatorDeliveryNoteTripModel,
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
    tableName: "tbl_operator_dn_manpower",
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
OperatorDeliveryNoteModel.belongsTo(OperatorChangeModel, {
  foreignKey: "operator_change_id",
  as: "operatorChange",
});

OperatorDeliveryNoteModel.belongsTo(ManpowerModel, {
  foreignKey: "new_operator_id",
  as: "newOperator",
});

OperatorDeliveryNoteModel.hasMany(OperatorDeliveryNoteTripModel, {
  foreignKey: "operator_dn_id",
  as: "trips",
});

OperatorDeliveryNoteModel.hasMany(OperatorDNManpowerModel, {
  foreignKey: "operator_dn_id",
  as: "manpower",
});

OperatorDeliveryNoteTripModel.belongsTo(OperatorDeliveryNoteModel, {
  foreignKey: "operator_dn_id",
  as: "deliveryNote",
});

OperatorDeliveryNoteTripModel.hasMany(OperatorDNManpowerModel, {
  foreignKey: "trip_id",
  as: "manpower",
});

OperatorDNManpowerModel.belongsTo(OperatorDeliveryNoteTripModel, {
  foreignKey: "trip_id",
  as: "trip",
});

OperatorChangeModel.hasMany(OperatorDeliveryNoteModel, {
  foreignKey: "operator_change_id",
  as: "deliveryNotes",
});

module.exports = {
  OperatorDeliveryNoteModel,
  OperatorDeliveryNoteTripModel,
  OperatorDNManpowerModel,
  TripOPDNCounterModel,
};
