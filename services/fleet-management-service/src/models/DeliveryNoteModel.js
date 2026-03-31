// models/fleet-management/DeliveryNoteModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const DeliveryNoteSubSalesOrderModel = require("./DeliveryNoteSubSalesOrderModel");
const { ActiveAllocationModel } = require("./ActiveAllocationsOriginalModel");

// Main Delivery Note Model
const DeliveryNoteModel = sequelize.define(
  "tbl_delivery_note",
  {
    dn_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dn_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrdersModel,
        key: "id",
      },
    },
    sub_sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DeliveryNoteSubSalesOrderModel,
        key: "sub_so_id",
      },
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
      },
    },
    client_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    project_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    delivery_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
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
      comment: "File path/URL for delivery confirmation attachment",
    },
    uploaded_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: "Username of the person who uploaded the DN",
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Timestamp of when the DN was uploaded",
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
    tableName: "tbl_delivery_note",
    timestamps: true,
    hooks: {
      beforeCreate: (deliveryNote, options) => {
        // DN create වෙනකොට status "Creation" ලෙස set කිරීම
        deliveryNote.status = "Creation";
      },
      // ❌ REMOVED: afterUpdate hook that was auto-syncing all trip statuses with DN status.
      //    Trip statuses are now managed independently per-trip.
      //    Only bulk operations (submitForApproval, rejectDeliveryNote) update trips en-masse.
    },
  },
);

// Counter Model for trip reference numbers
const TripCounterModel = sequelize.define(
  "tbl_trip_counter",
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
    tableName: "tbl_trip_counter",
    timestamps: false,
  },
);

// Delivery Note Trip Model (supports up to 7 trips)
const DeliveryNoteTripModel = sequelize.define(
  "tbl_delivery_note_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DeliveryNoteModel,
        key: "dn_id",
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
    prechecklist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to Prechecklist from Auto Xpert",
    },
    client_checklist_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Reference to Checklist to be signed from Client",
    },
    chargeable_type: {
      type: DataTypes.ENUM("Mobilization", "Non-Chargeable"),
      allowNull: true,
      comment: "Type of charge for the trip",
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
      comment: "Per-trip status — managed independently from the parent DN status",
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
    tableName: "tbl_delivery_note_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          // Get or create counter
          const counter = await TripCounterModel.findOrCreate({
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

          // Generate trip reference number in AX-DN-TP-001 format
          const tripNumber = String(nextValue).padStart(3, "0");
          trip.trip_reference_number = `AX-DN-TP-${tripNumber}`;

          // Set initial status
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          // Fallback: Use timestamp-based reference
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-DN-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  },
);

const DeliveryNoteEquipmentModel = sequelize.define(
  "tbl_dn_equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DeliveryNoteModel,
        key: "dn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DeliveryNoteTripModel,
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
      allowNull: false,
    },
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
  },
  {
    tableName: "tbl_dn_equipment",
    timestamps: true,
  },
);

const DeliveryNoteManpowerModel = sequelize.define(
  "tbl_dn_manpower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DeliveryNoteModel,
        key: "dn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DeliveryNoteTripModel,
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
      allowNull: false,
    },
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
  },
  {
    tableName: "tbl_dn_manpower",
    timestamps: true,
  },
);

const DeliveryNoteAttachmentModel = sequelize.define(
  "tbl_dn_attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DeliveryNoteModel,
        key: "dn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DeliveryNoteTripModel,
        key: "trip_id",
      },
      onDelete: "SET NULL",
    },
    attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attachment_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    attachment_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    // is_sub_product: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    //   comment:
    //     "True if this attachment is a sub-product from rental service, false if operational attachment",
    // },
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
  },
  {
    tableName: "tbl_dn_attachment",
    timestamps: true,
  },
);

const DeliveryNoteSubProductModel = sequelize.define(
  "tbl_dn_sub_product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: DeliveryNoteModel,
        key: "dn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: DeliveryNoteTripModel,
        key: "trip_id",
      },
      onDelete: "SET NULL",
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attachment_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    income_account: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "tbl_dn_sub_product",
    timestamps: true,
  },
);

// Associations
DeliveryNoteModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

DeliveryNoteModel.belongsTo(DeliveryNoteSubSalesOrderModel, {
  foreignKey: "sub_sales_order_id",
  as: "subSalesOrder",
});

DeliveryNoteModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
});

DeliveryNoteModel.hasMany(DeliveryNoteTripModel, {
  foreignKey: "dn_id",
  as: "trips",
});

DeliveryNoteTripModel.belongsTo(DeliveryNoteModel, {
  foreignKey: "dn_id",
  as: "deliveryNote",
});

DeliveryNoteModel.hasMany(DeliveryNoteEquipmentModel, {
  foreignKey: "dn_id",
  as: "equipment",
});

DeliveryNoteModel.hasMany(DeliveryNoteManpowerModel, {
  foreignKey: "dn_id",
  as: "manpower",
});

DeliveryNoteModel.hasMany(DeliveryNoteAttachmentModel, {
  foreignKey: "dn_id",
  as: "attachments",
});

DeliveryNoteModel.hasMany(DeliveryNoteSubProductModel, {
  foreignKey: "dn_id",
  as: "subProducts",
});

DeliveryNoteTripModel.hasMany(DeliveryNoteEquipmentModel, {
  foreignKey: "trip_id",
  as: "equipment",
});

DeliveryNoteTripModel.hasMany(DeliveryNoteManpowerModel, {
  foreignKey: "trip_id",
  as: "manpower",
});

DeliveryNoteTripModel.hasMany(DeliveryNoteAttachmentModel, {
  foreignKey: "trip_id",
  as: "attachments",
});

DeliveryNoteTripModel.hasMany(DeliveryNoteSubProductModel, {
  foreignKey: "trip_id",
  as: "subProducts",
});

module.exports = {
  DeliveryNoteModel,
  DeliveryNoteTripModel,
  DeliveryNoteEquipmentModel,
  DeliveryNoteManpowerModel,
  DeliveryNoteAttachmentModel,
  DeliveryNoteSubProductModel,
  TripCounterModel,
};