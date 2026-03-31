// // const { DataTypes } = require("sequelize");
// // const sequelize = require("../../config/dbSync");
// // const SalesOrdersModel = require("./SalesOrdersModel");
// // const { ActiveAllocationModel } = require("./ActiveAllocationsOriginalModel");

// // // Main Off Hire Note Model
// // const OffHireNoteModel = sequelize.define(
// //   "tbl_off_hire_note",
// //   {
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //       unique: true,
// //     },
// //     sales_order_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: SalesOrdersModel,
// //         key: "id",
// //       },
// //     },
// //     allocation_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: ActiveAllocationModel,
// //         key: "allocation_id",
// //       },
// //     },
// //     off_hire_date: {
// //       type: DataTypes.DATEONLY,
// //       allowNull: false,
// //     },
// //     site_end_date: {
// //       type: DataTypes.DATEONLY,
// //       allowNull: true,
// //       comment: "Date when work ended at client site",
// //     },
// //     client_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     project_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: true,
// //     },
// //     delivery_address: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     status: {
// //       type: DataTypes.ENUM("Creation", "In Progress", "Off Hired", "Cancelled"),
// //       allowNull: false,
// //       defaultValue: "Creation",
// //     },
// //     off_hire_attachment: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //       comment: "File path/URL for off hire confirmation attachment",
// //     },
// //     remarks: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     created_by: {
// //       type: DataTypes.STRING(100),
// //       allowNull: true,
// //     },
// //     trip_number_sequence: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       defaultValue: 0,
// //       comment: "Auto-incremented trip number sequence per off hire note",
// //     },
// //   },
// //   {
// //     tableName: "tbl_off_hire_note",
// //     timestamps: true,
// //     hooks: {
// //       beforeCreate: (offHireNote, options) => {
// //         offHireNote.status = "Creation";
// //       },
// //       afterUpdate: async (offHireNote, options) => {
// //         if (offHireNote.changed("status")) {
// //           await OffHireNoteTripModel.update(
// //             { trip_status: offHireNote.status },
// //             {
// //               where: { ohn_id: offHireNote.ohn_id },
// //               transaction: options.transaction,
// //             }
// //           );
// //         }
// //       },
// //     },
// //   }
// // );

// // // Counter Model for off hire trip reference numbers
// // const OffHireTripCounterModel = sequelize.define(
// //   "tbl_off_hire_trip_counter",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     counter_name: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //       unique: true,
// //       defaultValue: "off_hire_trip_reference",
// //     },
// //     last_value: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       defaultValue: 0,
// //     },
// //   },
// //   {
// //     tableName: "tbl_off_hire_trip_counter",
// //     timestamps: false,
// //   }
// // );

// // // Off Hire Note Trip Model (supports up to 7 trips)
// // const OffHireNoteTripModel = sequelize.define(
// //   "tbl_off_hire_note_trip",
// //   {
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_number: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       validate: {
// //         min: 1,
// //         max: 7,
// //       },
// //     },
// //     prechecklist_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       comment: "Reference to Prechecklist from Auto Xpert",
// //     },
// //     client_checklist_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       comment: "Reference to Checklist to be signed from Client",
// //     },
// //     transportation_company: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     driver_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     driver_contact: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //     },
// //     vehicle_type: {
// //       type: DataTypes.STRING(100),
// //       allowNull: true,
// //     },
// //     vehicle_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: true,
// //     },
// //     recovery_vehicle_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: true,
// //       comment: "Vehicle number selected from recovery section",
// //     },
// //     trip_status: {
// //       type: DataTypes.ENUM("Creation", "In Progress", "Off Hired", "Cancelled"),
// //       allowNull: false,
// //       defaultValue: "Creation",
// //     },
// //     remarks: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     trip_reference_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: true,
// //     },
// //   },
// //   {
// //     tableName: "tbl_off_hire_note_trip",
// //     timestamps: true,
// //     hooks: {
// //       beforeCreate: async (trip, options) => {
// //         try {
// //           const counter = await OffHireTripCounterModel.findOrCreate({
// //             where: { counter_name: "off_hire_trip_reference" },
// //             defaults: { last_value: 0 },
// //             transaction: options.transaction,
// //           });

// //           const nextValue = counter[0].last_value + 1;
// //           await counter[0].update(
// //             { last_value: nextValue },
// //             { transaction: options.transaction }
// //           );

// //           const tripNumber = String(nextValue).padStart(3, "0");
// //           trip.trip_reference_number = `AX-OH-TP-${tripNumber}`;

// //           trip.trip_status = "Creation";
// //         } catch (error) {
// //           console.error("Error in beforeCreate hook for trip:", error);
// //           const timestamp = Date.now();
// //           const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
// //           trip.trip_reference_number = `AX-OH-TP-${fallbackNumber}`;
// //           trip.trip_status = "Creation";
// //         }
// //       },
// //     },
// //   }
// // );

// // // Off Hire Note Equipment Model
// // const OffHireNoteEquipmentModel = sequelize.define(
// //   "tbl_ohn_equipment",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: OffHireNoteTripModel,
// //         key: "trip_id",
// //       },
// //       onDelete: "SET NULL",
// //     },
// //     serial_number: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     reg_number: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     equipment_type: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     condition: {
// //       type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
// //       allowNull: false,
// //       defaultValue: "Good",
// //     },
// //     damage_description: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //   },
// //   {
// //     tableName: "tbl_ohn_equipment",
// //     timestamps: true,
// //   }
// // );

// // // Off Hire Note Manpower Model
// // const OffHireNoteManpowerModel = sequelize.define(
// //   "tbl_ohn_manpower",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: OffHireNoteTripModel,
// //         key: "trip_id",
// //       },
// //       onDelete: "SET NULL",
// //     },
// //     employee_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     employee_no: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //     },
// //     employee_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     return_status: {
// //       type: DataTypes.ENUM("Returned", "On Duty", "Extended"),
// //       allowNull: false,
// //       defaultValue: "Returned",
// //     },
// //   },
// //   {
// //     tableName: "tbl_ohn_manpower",
// //     timestamps: true,
// //   }
// // );

// // // Off Hire Note Attachment Model
// // const OffHireNoteAttachmentModel = sequelize.define(
// //   "tbl_ohn_attachment",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: OffHireNoteTripModel,
// //         key: "trip_id",
// //       },
// //       onDelete: "SET NULL",
// //     },
// //     attachment_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     attachment_number: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     attachment_type: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     condition: {
// //       type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
// //       allowNull: false,
// //       defaultValue: "Good",
// //     },
// //     damage_description: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //   },
// //   {
// //     tableName: "tbl_ohn_attachment",
// //     timestamps: true,
// //   }
// // );

// // // Associations
// // OffHireNoteModel.belongsTo(SalesOrdersModel, {
// //   foreignKey: "sales_order_id",
// //   as: "salesOrder",
// // });

// // OffHireNoteModel.belongsTo(ActiveAllocationModel, {
// //   foreignKey: "allocation_id",
// //   as: "allocation",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteTripModel, {
// //   foreignKey: "ohn_id",
// //   as: "trips",
// // });

// // OffHireNoteTripModel.belongsTo(OffHireNoteModel, {
// //   foreignKey: "ohn_id",
// //   as: "offHireNote",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteEquipmentModel, {
// //   foreignKey: "ohn_id",
// //   as: "equipment",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteManpowerModel, {
// //   foreignKey: "ohn_id",
// //   as: "manpower",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteAttachmentModel, {
// //   foreignKey: "ohn_id",
// //   as: "attachments",
// // });

// // OffHireNoteTripModel.hasMany(OffHireNoteEquipmentModel, {
// //   foreignKey: "trip_id",
// //   as: "equipment",
// // });

// // OffHireNoteTripModel.hasMany(OffHireNoteManpowerModel, {
// //   foreignKey: "trip_id",
// //   as: "manpower",
// // });

// // OffHireNoteTripModel.hasMany(OffHireNoteAttachmentModel, {
// //   foreignKey: "trip_id",
// //   as: "attachments",
// // });

// // module.exports = {
// //   OffHireNoteModel,
// //   OffHireNoteTripModel,
// //   OffHireNoteEquipmentModel,
// //   OffHireNoteManpowerModel,
// //   OffHireNoteAttachmentModel,
// //   OffHireTripCounterModel,
// // };

// // const { DataTypes } = require("sequelize");
// // const sequelize = require("../../config/dbSync");
// // const SalesOrdersModel = require("./SalesOrdersModel");
// // const { ActiveAllocationModel } = require("./ActiveAllocationsOriginalModel");

// // // Main Off Hire Note Model
// // const OffHireNoteModel = sequelize.define(
// //   "tbl_off_hire_note",
// //   {
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //       unique: true,
// //     },
// //     sales_order_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: SalesOrdersModel,
// //         key: "id",
// //       },
// //     },
// //     allocation_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: ActiveAllocationModel,
// //         key: "allocation_id",
// //       },
// //     },
// //     off_hire_date: {
// //       type: DataTypes.DATEONLY,
// //       allowNull: false,
// //     },
// //     site_end_date: {
// //       type: DataTypes.DATEONLY,
// //       allowNull: true,
// //       comment: "Date when work ended at client site",
// //     },
// //     client_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     project_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: true,
// //     },
// //     delivery_address: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     status: {
// //       type: DataTypes.ENUM("Creation", "Under Approval", "Approved", "In Progress", "Off Hired", "Cancelled", "Close"),
// //       allowNull: false,
// //       defaultValue: "Creation",
// //     },
// //     off_hire_attachment: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //       comment: "File path/URL for off hire confirmation attachment",
// //     },
// //     remarks: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     created_by: {
// //       type: DataTypes.STRING(100),
// //       allowNull: true,
// //     },
// //     trip_number_sequence: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       defaultValue: 0,
// //       comment: "Auto-incremented trip number sequence per off hire note",
// //     },
// //   },
// //   {
// //     tableName: "tbl_off_hire_note",
// //     timestamps: true,
// //     hooks: {
// //       beforeCreate: (offHireNote, options) => {
// //         offHireNote.status = "Creation";
// //       },
// //       afterUpdate: async (offHireNote, options) => {
// //         if (offHireNote.changed("status")) {
// //           await OffHireNoteTripModel.update(
// //             { trip_status: offHireNote.status },
// //             {
// //               where: { ohn_id: offHireNote.ohn_id },
// //               transaction: options.transaction,
// //             }
// //           );
// //         }
// //       },
// //     },
// //   }
// // );

// // // Counter Model for off hire trip reference numbers
// // const OffHireTripCounterModel = sequelize.define(
// //   "tbl_off_hire_trip_counter",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     counter_name: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //       unique: true,
// //       defaultValue: "off_hire_trip_reference",
// //     },
// //     last_value: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       defaultValue: 0,
// //     },
// //   },
// //   {
// //     tableName: "tbl_off_hire_trip_counter",
// //     timestamps: false,
// //   }
// // );

// // // Off Hire Note Trip Model (supports up to 7 trips)
// // const OffHireNoteTripModel = sequelize.define(
// //   "tbl_off_hire_note_trip",
// //   {
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_number: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       validate: {
// //         min: 1,
// //         max: 7,
// //       },
// //     },
// //     prechecklist_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       comment: "Reference to Prechecklist from Auto Xpert",
// //     },
// //     client_checklist_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       comment: "Reference to Checklist to be signed from Client",
// //     },
// //     transportation_company: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     driver_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     driver_contact: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //     },
// //     vehicle_type: {
// //       type: DataTypes.STRING(100),
// //       allowNull: true,
// //     },
// //     vehicle_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: true,
// //     },
// //     recovery_vehicle_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: true,
// //       comment: "Vehicle number selected from recovery section",
// //     },
// //     chargeable_type: {
// //       type: DataTypes.ENUM("Demobilization", "Non Chargeable"),
// //       allowNull: false,
// //       defaultValue: "Demobilization",
// //       comment: "Trip chargeable type - Demobilization or Non Chargeable",
// //     },
// //     trip_status: {
// //       type: DataTypes.ENUM("Creation", "Under Approval", "Approved", "In Progress", "Off Hired", "Cancelled", "Close"),
// //       allowNull: false,
// //       defaultValue: "Creation",
// //     },
// //     remarks: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //     trip_reference_number: {
// //       type: DataTypes.STRING(50),
// //       allowNull: true,
// //     },
// //   },
// //   {
// //     tableName: "tbl_off_hire_note_trip",
// //     timestamps: true,
// //     hooks: {
// //       beforeCreate: async (trip, options) => {
// //         try {
// //           const counter = await OffHireTripCounterModel.findOrCreate({
// //             where: { counter_name: "off_hire_trip_reference" },
// //             defaults: { last_value: 0 },
// //             transaction: options.transaction,
// //           });

// //           const nextValue = counter[0].last_value + 1;
// //           await counter[0].update(
// //             { last_value: nextValue },
// //             { transaction: options.transaction }
// //           );

// //           const tripNumber = String(nextValue).padStart(3, "0");
// //           trip.trip_reference_number = `AX-OH-TP-${tripNumber}`;

// //           trip.trip_status = "Creation";
// //         } catch (error) {
// //           console.error("Error in beforeCreate hook for trip:", error);
// //           const timestamp = Date.now();
// //           const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
// //           trip.trip_reference_number = `AX-OH-TP-${fallbackNumber}`;
// //           trip.trip_status = "Creation";
// //         }
// //       },
// //     },
// //   }
// // );

// // // Off Hire Note Equipment Model
// // const OffHireNoteEquipmentModel = sequelize.define(
// //   "tbl_ohn_equipment",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: OffHireNoteTripModel,
// //         key: "trip_id",
// //       },
// //       onDelete: "SET NULL",
// //     },
// //     serial_number: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     reg_number: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     equipment_type: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     condition: {
// //       type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
// //       allowNull: false,
// //       defaultValue: "Good",
// //     },
// //     damage_description: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //   },
// //   {
// //     tableName: "tbl_ohn_equipment",
// //     timestamps: true,
// //   }
// // );

// // // Off Hire Note Manpower Model
// // const OffHireNoteManpowerModel = sequelize.define(
// //   "tbl_ohn_manpower",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: OffHireNoteTripModel,
// //         key: "trip_id",
// //       },
// //       onDelete: "SET NULL",
// //     },
// //     employee_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     employee_no: {
// //       type: DataTypes.STRING(50),
// //       allowNull: false,
// //     },
// //     employee_name: {
// //       type: DataTypes.STRING(255),
// //       allowNull: false,
// //     },
// //     return_status: {
// //       type: DataTypes.ENUM("Returned", "On Duty", "Extended"),
// //       allowNull: false,
// //       defaultValue: "Returned",
// //     },
// //   },
// //   {
// //     tableName: "tbl_ohn_manpower",
// //     timestamps: true,
// //   }
// // );

// // // Off Hire Note Attachment Model
// // const OffHireNoteAttachmentModel = sequelize.define(
// //   "tbl_ohn_attachment",
// //   {
// //     id: {
// //       type: DataTypes.INTEGER,
// //       primaryKey: true,
// //       autoIncrement: true,
// //     },
// //     ohn_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //       references: {
// //         model: OffHireNoteModel,
// //         key: "ohn_id",
// //       },
// //       onDelete: "CASCADE",
// //     },
// //     trip_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: true,
// //       references: {
// //         model: OffHireNoteTripModel,
// //         key: "trip_id",
// //       },
// //       onDelete: "SET NULL",
// //     },
// //     attachment_id: {
// //       type: DataTypes.INTEGER,
// //       allowNull: false,
// //     },
// //     attachment_number: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     attachment_type: {
// //       type: DataTypes.STRING(100),
// //       allowNull: false,
// //     },
// //     condition: {
// //       type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
// //       allowNull: false,
// //       defaultValue: "Good",
// //     },
// //     damage_description: {
// //       type: DataTypes.TEXT,
// //       allowNull: true,
// //     },
// //   },
// //   {
// //     tableName: "tbl_ohn_attachment",
// //     timestamps: true,
// //   }
// // );

// // // Associations
// // OffHireNoteModel.belongsTo(SalesOrdersModel, {
// //   foreignKey: "sales_order_id",
// //   as: "salesOrder",
// // });

// // OffHireNoteModel.belongsTo(ActiveAllocationModel, {
// //   foreignKey: "allocation_id",
// //   as: "allocation",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteTripModel, {
// //   foreignKey: "ohn_id",
// //   as: "trips",
// // });

// // OffHireNoteTripModel.belongsTo(OffHireNoteModel, {
// //   foreignKey: "ohn_id",
// //   as: "offHireNote",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteEquipmentModel, {
// //   foreignKey: "ohn_id",
// //   as: "equipment",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteManpowerModel, {
// //   foreignKey: "ohn_id",
// //   as: "manpower",
// // });

// // OffHireNoteModel.hasMany(OffHireNoteAttachmentModel, {
// //   foreignKey: "ohn_id",
// //   as: "attachments",
// // });

// // OffHireNoteTripModel.hasMany(OffHireNoteEquipmentModel, {
// //   foreignKey: "trip_id",
// //   as: "equipment",
// // });

// // OffHireNoteTripModel.hasMany(OffHireNoteManpowerModel, {
// //   foreignKey: "trip_id",
// //   as: "manpower",
// // });

// // OffHireNoteTripModel.hasMany(OffHireNoteAttachmentModel, {
// //   foreignKey: "trip_id",
// //   as: "attachments",
// // });

// // module.exports = {
// //   OffHireNoteModel,
// //   OffHireNoteTripModel,
// //   OffHireNoteEquipmentModel,
// //   OffHireNoteManpowerModel,
// //   OffHireNoteAttachmentModel,
// //   OffHireTripCounterModel,
// // };

// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const SalesOrdersModel = require("./SalesOrdersModel");
// const { ActiveAllocationModel } = require("./ActiveAllocationsOriginalModel");

// // Main Off Hire Note Model
// const OffHireNoteModel = sequelize.define(
//   "tbl_off_hire_note",
//   {
//     ohn_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     ohn_number: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//     },
//     sales_order_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: SalesOrdersModel,
//         key: "id",
//       },
//     },
//     allocation_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: ActiveAllocationModel,
//         key: "allocation_id",
//       },
//     },
//     client_name: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     project_name: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     delivery_address: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.ENUM("Creation", "Under Approval", "Approved", "In Progress", "Off Hired", "Cancelled", "Rejected", "Close"),
//       allowNull: false,
//       defaultValue: "Creation",
//     },
//     off_hire_attachment: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//       comment: "File path/URL for off hire confirmation attachment",
//     },
//     remarks: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     created_by: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },
//     trip_number_sequence: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//       comment: "Auto-incremented trip number sequence per off hire note",
//     },
//   },
//   {
//     tableName: "tbl_off_hire_note",
//     timestamps: true,
//     hooks: {
//       beforeCreate: (offHireNote, options) => {
//         offHireNote.status = "Creation";
//       },
//       afterUpdate: async (offHireNote, options) => {
//         if (offHireNote.changed("status")) {
//           await OffHireNoteTripModel.update(
//             { trip_status: offHireNote.status },
//             {
//               where: { ohn_id: offHireNote.ohn_id },
//               transaction: options.transaction,
//             }
//           );
//         }
//       },
//     },
//   }
// );

// // Counter Model for off hire trip reference numbers
// const OffHireTripCounterModel = sequelize.define(
//   "tbl_off_hire_trip_counter",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     counter_name: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//       unique: true,
//       defaultValue: "off_hire_trip_reference",
//     },
//     last_value: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       defaultValue: 0,
//     },
//   },
//   {
//     tableName: "tbl_off_hire_trip_counter",
//     timestamps: false,
//   }
// );

// // Off Hire Note Trip Model (supports up to 7 trips)
// const OffHireNoteTripModel = sequelize.define(
//   "tbl_off_hire_note_trip",
//   {
//     trip_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     ohn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: OffHireNoteModel,
//         key: "ohn_id",
//       },
//       onDelete: "CASCADE",
//     },
//     trip_number: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       validate: {
//         min: 1,
//         max: 7,
//       },
//     },
//     trip_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: false,
//     },
//     prechecklist_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       comment: "Reference to Prechecklist from Auto Xpert",
//     },
//     client_checklist_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       comment: "Reference to Checklist to be signed from Client",
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
//     recovery_vehicle_number: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//       comment: "Vehicle number selected from recovery section",
//     },
//     chargeable_type: {
//       type: DataTypes.ENUM("Demobilization", "Non Chargeable"),
//       allowNull: false,
//       defaultValue: "Demobilization",
//       comment: "Trip chargeable type - Demobilization or Non Chargeable",
//     },
//     trip_status: {
//       type: DataTypes.ENUM("Creation", "Under Approval", "Approved", "In Progress", "Off Hired", "Cancelled", "Rejected", "Close"),
//       allowNull: false,
//       defaultValue: "Creation",
//     },
//     remarks: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     trip_reference_number: {
//       type: DataTypes.STRING(50),
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "tbl_off_hire_note_trip",
//     timestamps: true,
//     hooks: {
//       beforeCreate: async (trip, options) => {
//         try {
//           const counter = await OffHireTripCounterModel.findOrCreate({
//             where: { counter_name: "off_hire_trip_reference" },
//             defaults: { last_value: 0 },
//             transaction: options.transaction,
//           });

//           const nextValue = counter[0].last_value + 1;
//           await counter[0].update(
//             { last_value: nextValue },
//             { transaction: options.transaction }
//           );

//           const tripNumber = String(nextValue).padStart(3, "0");
//           trip.trip_reference_number = `AX-OH-TP-${tripNumber}`;

//           trip.trip_status = "Creation";
//         } catch (error) {
//           console.error("Error in beforeCreate hook for trip:", error);
//           const timestamp = Date.now();
//           const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
//           trip.trip_reference_number = `AX-OH-TP-${fallbackNumber}`;
//           trip.trip_status = "Creation";
//         }
//       },
//     },
//   }
// );

// // Off Hire Note Equipment Model
// const OffHireNoteEquipmentModel = sequelize.define(
//   "tbl_ohn_equipment",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     ohn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: OffHireNoteModel,
//         key: "ohn_id",
//       },
//       onDelete: "CASCADE",
//     },
//     trip_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: OffHireNoteTripModel,
//         key: "trip_id",
//       },
//       onDelete: "SET NULL",
//     },
//     serial_number: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     reg_number: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     equipment_type: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     condition: {
//       type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
//       allowNull: false,
//       defaultValue: "Good",
//     },
//     damage_description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     // ── CHECKLIST FIELDS ──────────────────────────────────────────────────────
//     checklist_file_path: DataTypes.STRING,
//     checklist_file_name: DataTypes.STRING,
//     checklist_uploaded_at: DataTypes.DATE,
//     checklist_uploaded_by: DataTypes.STRING,
//     // ─────────────────────────────────────────────────────────────────────────
//   },
//   {
//     tableName: "tbl_ohn_equipment",
//     timestamps: true,
//   }
// );

// // Off Hire Note Manpower Model
// const OffHireNoteManpowerModel = sequelize.define(
//   "tbl_ohn_manpower",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     ohn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: OffHireNoteModel,
//         key: "ohn_id",
//       },
//       onDelete: "CASCADE",
//     },
//     trip_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: OffHireNoteTripModel,
//         key: "trip_id",
//       },
//       onDelete: "SET NULL",
//     },
//     employee_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     employee_no: {
//       type: DataTypes.STRING(50),
//       allowNull: false,
//     },
//     employee_name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     return_status: {
//       type: DataTypes.ENUM("Returned", "On Duty", "Extended"),
//       allowNull: false,
//       defaultValue: "Returned",
//     },
//     // ── CHECKLIST FIELDS ──────────────────────────────────────────────────────
//     checklist_file_path: DataTypes.STRING,
//     checklist_file_name: DataTypes.STRING,
//     checklist_uploaded_at: DataTypes.DATE,
//     checklist_uploaded_by: DataTypes.STRING,
//     // ─────────────────────────────────────────────────────────────────────────
//   },
//   {
//     tableName: "tbl_ohn_manpower",
//     timestamps: true,
//   }
// );

// // Off Hire Note Attachment Model
// const OffHireNoteAttachmentModel = sequelize.define(
//   "tbl_ohn_attachment",
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     ohn_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: OffHireNoteModel,
//         key: "ohn_id",
//       },
//       onDelete: "CASCADE",
//     },
//     trip_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: OffHireNoteTripModel,
//         key: "trip_id",
//       },
//       onDelete: "SET NULL",
//     },
//     attachment_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     attachment_number: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     attachment_type: {
//       type: DataTypes.STRING(100),
//       allowNull: false,
//     },
//     condition: {
//       type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
//       allowNull: false,
//       defaultValue: "Good",
//     },
//     damage_description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     // ── CHECKLIST FIELDS ──────────────────────────────────────────────────────
//     checklist_file_path: DataTypes.STRING,
//     checklist_file_name: DataTypes.STRING,
//     checklist_uploaded_at: DataTypes.DATE,
//     checklist_uploaded_by: DataTypes.STRING,
//     // ─────────────────────────────────────────────────────────────────────────
//   },
//   {
//     tableName: "tbl_ohn_attachment",
//     timestamps: true,
//   }
// );

// // Associations
// OffHireNoteModel.belongsTo(SalesOrdersModel, {
//   foreignKey: "sales_order_id",
//   as: "salesOrder",
// });

// OffHireNoteModel.belongsTo(ActiveAllocationModel, {
//   foreignKey: "allocation_id",
//   as: "allocation",
// });

// OffHireNoteModel.hasMany(OffHireNoteTripModel, {
//   foreignKey: "ohn_id",
//   as: "trips",
// });

// OffHireNoteTripModel.belongsTo(OffHireNoteModel, {
//   foreignKey: "ohn_id",
//   as: "offHireNote",
// });

// OffHireNoteModel.hasMany(OffHireNoteEquipmentModel, {
//   foreignKey: "ohn_id",
//   as: "equipment",
// });

// OffHireNoteModel.hasMany(OffHireNoteManpowerModel, {
//   foreignKey: "ohn_id",
//   as: "manpower",
// });

// OffHireNoteModel.hasMany(OffHireNoteAttachmentModel, {
//   foreignKey: "ohn_id",
//   as: "attachments",
// });

// OffHireNoteTripModel.hasMany(OffHireNoteEquipmentModel, {
//   foreignKey: "trip_id",
//   as: "equipment",
// });

// OffHireNoteTripModel.hasMany(OffHireNoteManpowerModel, {
//   foreignKey: "trip_id",
//   as: "manpower",
// });

// OffHireNoteTripModel.hasMany(OffHireNoteAttachmentModel, {
//   foreignKey: "trip_id",
//   as: "attachments",
// });

// module.exports = {
//   OffHireNoteModel,
//   OffHireNoteTripModel,
//   OffHireNoteEquipmentModel,
//   OffHireNoteManpowerModel,
//   OffHireNoteAttachmentModel,
//   OffHireTripCounterModel,
// };

const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const OffHireNoteSubSalesOrderModel = require("./OffHireNoteSubSalesOrderModel");
const { ActiveAllocationModel } = require("./ActiveAllocationsOriginalModel");

// Main Off Hire Note Model
const OffHireNoteModel = sequelize.define(
  "tbl_off_hire_note",
  {
    ohn_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ohn_number: {
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
        model: OffHireNoteSubSalesOrderModel,
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
        "Off Hired",
        "Cancelled",
        "Rejected",
        "Close"
      ),
      allowNull: false,
      defaultValue: "Creation",
    },
    off_hire_attachment: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "File path/URL for off hire confirmation attachment",
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
    tableName: "tbl_off_hire_note",
    timestamps: true,
    hooks: {
      beforeCreate: (offHireNote, options) => {
        offHireNote.status = "Creation";
      },
      // ── REMOVED: afterUpdate hook that was bulk-syncing all trip statuses ──
      // Trip statuses are now managed individually per trip.
      // OHN status is derived from trip statuses via checkAndUpdateOHNStatus().
    },
  }
);

// Counter Model for off hire trip reference numbers
const OffHireTripCounterModel = sequelize.define(
  "tbl_off_hire_trip_counter",
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
      defaultValue: "off_hire_trip_reference",
    },
    last_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "tbl_off_hire_trip_counter",
    timestamps: false,
  }
);

// Off Hire Note Trip Model (supports up to 7 trips)
const OffHireNoteTripModel = sequelize.define(
  "tbl_off_hire_note_trip",
  {
    trip_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OffHireNoteModel,
        key: "ohn_id",
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
    chargeable_type: {
      type: DataTypes.ENUM("Demobilization", "Non Chargeable"),
      allowNull: false,
      defaultValue: "Demobilization",
      comment: "Trip chargeable type - Demobilization or Non Chargeable",
    },
    trip_status: {
      type: DataTypes.ENUM(
        "Creation",
        "Under Approval",
        "Approved",
        "In Progress",
        "Off Hired",
        "Cancelled",
        "Rejected",
        "Close"
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
    tableName: "tbl_off_hire_note_trip",
    timestamps: true,
    hooks: {
      beforeCreate: async (trip, options) => {
        try {
          const counter = await OffHireTripCounterModel.findOrCreate({
            where: { counter_name: "off_hire_trip_reference" },
            defaults: { last_value: 0 },
            transaction: options.transaction,
          });

          const nextValue = counter[0].last_value + 1;
          await counter[0].update(
            { last_value: nextValue },
            { transaction: options.transaction }
          );

          const tripNumber = String(nextValue).padStart(3, "0");
          trip.trip_reference_number = `AX-OH-TP-${tripNumber}`;
          trip.trip_status = "Creation";
        } catch (error) {
          console.error("Error in beforeCreate hook for trip:", error);
          const timestamp = Date.now();
          const fallbackNumber = String(timestamp % 1000).padStart(3, "0");
          trip.trip_reference_number = `AX-OH-TP-${fallbackNumber}`;
          trip.trip_status = "Creation";
        }
      },
    },
  }
);

// Off Hire Note Equipment Model
const OffHireNoteEquipmentModel = sequelize.define(
  "tbl_ohn_equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OffHireNoteModel,
        key: "ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OffHireNoteTripModel,
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
    condition: {
      type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
      allowNull: false,
      defaultValue: "Good",
    },
    damage_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // ── CHECKLIST FIELDS ──────────────────────────────────────────────────────
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
    // ─────────────────────────────────────────────────────────────────────────
  },
  {
    tableName: "tbl_ohn_equipment",
    timestamps: true,
  }
);

// Off Hire Note Manpower Model
const OffHireNoteManpowerModel = sequelize.define(
  "tbl_ohn_manpower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OffHireNoteModel,
        key: "ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OffHireNoteTripModel,
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
    return_status: {
      type: DataTypes.ENUM("Returned", "On Duty", "Extended"),
      allowNull: false,
      defaultValue: "Returned",
    },
    // ── CHECKLIST FIELDS ──────────────────────────────────────────────────────
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
    // ─────────────────────────────────────────────────────────────────────────
  },
  {
    tableName: "tbl_ohn_manpower",
    timestamps: true,
  }
);

// Off Hire Note Attachment Model
const OffHireNoteAttachmentModel = sequelize.define(
  "tbl_ohn_attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OffHireNoteModel,
        key: "ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OffHireNoteTripModel,
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
    condition: {
      type: DataTypes.ENUM("Good", "Damaged", "Under Repair", "Lost"),
      allowNull: false,
      defaultValue: "Good",
    },
    damage_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // ── CHECKLIST FIELDS ──────────────────────────────────────────────────────
    checklist_file_path: DataTypes.STRING,
    checklist_file_name: DataTypes.STRING,
    checklist_uploaded_at: DataTypes.DATE,
    checklist_uploaded_by: DataTypes.STRING,
    // ─────────────────────────────────────────────────────────────────────────
  },
  {
    tableName: "tbl_ohn_attachment",
    timestamps: true,
  }
);

// Off Hire Note Sub Product Model
const OffHireNoteSubProductModel = sequelize.define(
  "tbl_ohn_sub_product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ohn_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OffHireNoteModel,
        key: "ohn_id",
      },
      onDelete: "CASCADE",
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: OffHireNoteTripModel,
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
    tableName: "tbl_ohn_sub_product",
    timestamps: true,
  }
);

// Associations
OffHireNoteModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

OffHireNoteModel.belongsTo(OffHireNoteSubSalesOrderModel, {
  foreignKey: "sub_sales_order_id",
  as: "subSalesOrder",
});

OffHireNoteModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
});

OffHireNoteModel.hasMany(OffHireNoteTripModel, {
  foreignKey: "ohn_id",
  as: "trips",
});

OffHireNoteTripModel.belongsTo(OffHireNoteModel, {
  foreignKey: "ohn_id",
  as: "offHireNote",
});

OffHireNoteModel.hasMany(OffHireNoteEquipmentModel, {
  foreignKey: "ohn_id",
  as: "equipment",
});

OffHireNoteModel.hasMany(OffHireNoteManpowerModel, {
  foreignKey: "ohn_id",
  as: "manpower",
});

OffHireNoteModel.hasMany(OffHireNoteAttachmentModel, {
  foreignKey: "ohn_id",
  as: "attachments",
});

OffHireNoteModel.hasMany(OffHireNoteSubProductModel, {
  foreignKey: "ohn_id",
  as: "subProducts",
});

OffHireNoteTripModel.hasMany(OffHireNoteEquipmentModel, {
  foreignKey: "trip_id",
  as: "equipment",
});

OffHireNoteTripModel.hasMany(OffHireNoteManpowerModel, {
  foreignKey: "trip_id",
  as: "manpower",
});

OffHireNoteTripModel.hasMany(OffHireNoteAttachmentModel, {
  foreignKey: "trip_id",
  as: "attachments",
});

OffHireNoteTripModel.hasMany(OffHireNoteSubProductModel, {
  foreignKey: "trip_id",
  as: "subProducts",
});

module.exports = {
  OffHireNoteModel,
  OffHireNoteTripModel,
  OffHireNoteEquipmentModel,
  OffHireNoteManpowerModel,
  OffHireNoteAttachmentModel,
  OffHireNoteSubProductModel,
  OffHireTripCounterModel,
};