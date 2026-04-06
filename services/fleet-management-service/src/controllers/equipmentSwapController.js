// // // controllers/fleet-management/equipmentSwapController.js (updated)
// // const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
// // const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // const {
// //   EquipmentDeliveryNoteModel,
// //   EquipmentDeliveryNoteTripModel,
// //   EquipmentDNEquipmentModel,
// // } = require("../../models/fleet-management/EquipmentDeliveryNoteModel");
// // const {
// //   EquipmentOffHireNoteModel,
// //   EquipmentOffHireNoteTripModel,
// //   EquipmentOHNEquipmentModel,
// // } = require("../../models/fleet-management/EquipmentOffHireNoteModel");
// // const sequelize = require("../../config/dbSync");
// // const { Op } = require("sequelize");
// // const UsersModel = require("../../models/user-security-management/UsersModel");
// // const SwapReasonModel = require("../../models/fleet-management/swapReasonModel");
// // const path = require("path");
// // const fs = require("fs");
// // const PDFDocument = require("pdfkit");

// // const generateEquipmentDNNumber = async () => {
// //   const currentYear = new Date().getFullYear();
// //   const prefix = `EQ-DN-${currentYear}-`;

// //   const lastDN = await EquipmentDeliveryNoteModel.findOne({
// //     where: { dn_number: { [Op.like]: `${prefix}%` } },
// //     order: [["dn_number", "DESC"]],
// //   });

// //   let nextNumber = 1;
// //   if (lastDN) {
// //     const parts = lastDN.dn_number.split("-");
// //     const lastNumber = parseInt(parts[parts.length - 1]);
// //     if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
// //   }

// //   return `${prefix}${String(nextNumber).padStart(4, "0")}`;
// // };

// // const generateEquipmentOHNNumber = async () => {
// //   const currentYear = new Date().getFullYear();
// //   const prefix = `EQ-OH-${currentYear}-`;

// //   const lastOHN = await EquipmentOffHireNoteModel.findOne({
// //     where: { ohn_number: { [Op.like]: `${prefix}%` } },
// //     order: [["ohn_number", "DESC"]],
// //   });

// //   let nextNumber = 1;
// //   if (lastOHN) {
// //     const parts = lastOHN.ohn_number.split("-");
// //     const lastNumber = parseInt(parts[parts.length - 1]);
// //     if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
// //   }

// //   return `${prefix}${String(nextNumber).padStart(4, "0")}`;
// // };

// // const getUsername = async (req) => {
// //   try {
// //     if (req.user?.uid) {
// //       const user = await UsersModel.findByPk(req.user.uid);
// //       if (user) return user.username;
// //     }
// //     return req.user?.username || "System";
// //   } catch {
// //     return "System";
// //   }
// // };

// // // Get all equipment tag numbers for dropdown
// // const getAllEquipmentTagNumbers = async (req, res) => {
// //   try {
// //     const equipment = await EquipmentModel.findAll({
// //       where: { status: "Active" },
// //       attributes: ["serial_number", "reg_number", "vehicle_type"],
// //       order: [["reg_number", "ASC"]],
// //     });

// //     res.status(200).json({
// //       success: true,
// //       equipment: equipment.map((eq) => ({
// //         serial_number: eq.serial_number,
// //         reg_number: eq.reg_number,
// //         vehicle_type: eq.vehicle_type,
// //       })),
// //     });
// //   } catch (error) {
// //     console.error("Error fetching equipment:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const getEquipmentSwapReasons = async (req, res) => {
// //   try {
// //     const swapReasons = await SwapReasonModel.findAll({
// //       where: {
// //         category: "Equipment",
// //         status: "Active",
// //       },
// //       attributes: ["swap_reason_id", "swap_reason_name"],
// //       order: [["swap_reason_name", "ASC"]],
// //     });

// //     res.status(200).json({
// //       success: true,
// //       swapReasons: swapReasons.map((reason) => ({
// //         swap_reason_id: reason.swap_reason_id,
// //         swap_reason_name: reason.swap_reason_name,
// //       })),
// //     });
// //   } catch (error) {
// //     console.error("Error fetching equipment swap reasons:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // controllers/fleet-management/equipmentSwapController.js
// // // UPDATED FUNCTION: createEquipmentSwap — generates swap_group_id shared by both records

// // // ─── Helper: generate a human-readable group ID ────────────────────────────
// // // Format: EQ-YYYYMMDD-XXXX  (e.g. EQ-20260224-A3F9)
// // const generateSwapGroupId = (prefix = "EQ") => {
// //   const now = new Date();
// //   const datePart = now
// //     .toISOString()
// //     .slice(0, 10)
// //     .replace(/-/g, ""); // "20260224"
// //   const randomPart = Math.random()
// //     .toString(36)
// //     .toUpperCase()
// //     .slice(2, 6); // 4 random alphanumeric chars
// //   return `${prefix}-${datePart}-${randomPart}`;
// // };
// // // ───────────────────────────────────────────────────────────────────────────

// // const createEquipmentSwap = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const {
// //       sales_order_id,
// //       allocation_id,
// //       previous_plate_no,
// //       new_plate_no,
// //       swap_date,
// //       swap_reason,
// //       swap_estimated_recovery_cost,
// //       swap_mobilization_trips,
// //       swap_demobilization_trips,
// //       swap_remark,
// //     } = req.body;

// //     // Validate required fields
// //     if (
// //       !sales_order_id ||
// //       !previous_plate_no ||
// //       !new_plate_no ||
// //       !swap_date ||
// //       !swap_reason
// //     ) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "All required fields must be filled",
// //       });
// //     }

// //     // Check if new plate number exists in equipment table
// //     const existingEquipment = await EquipmentModel.findOne({
// //       where: { reg_number: new_plate_no, status: "Active" },
// //     });

// //     if (!existingEquipment) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "New plate number does not exist in equipment table",
// //       });
// //     }

// //     // Get sales order
// //     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
// //     if (!salesOrder) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Sales order not found" });
// //     }

// //     // Get previous equipment details
// //     const previousEquipment = await EquipmentModel.findOne({
// //       where: { reg_number: previous_plate_no },
// //     });

// //     if (!previousEquipment) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Previous equipment not found" });
// //     }

// //     // Get logged in user
// //     let username = "System";
// //     if (req.user?.uid) {
// //       const user = await UsersModel.findByPk(req.user.uid);
// //       if (user) {
// //         username = user.username;
// //       }
// //     }

// //     // ✅ Generate one shared group ID for both records of this swap operation
// //     const swapGroupId = generateSwapGroupId("EQ");

// //     // CREATE RECORD 1: OFF_HIRE — for the existing/outgoing equipment
// //     const offHireSwap = await EquipmentSwapModel.create(
// //       {
// //         swap_group_id: swapGroupId,              // ✅ shared group ID
// //         sales_order_id,
// //         allocation_id: allocation_id || null,
// //         previous_equipment_serial: previousEquipment.serial_number,
// //         previous_plate_no,
// //         new_equipment_serial: null,
// //         new_plate_no: null,
// //         swap_date,
// //         swap_reason,
// //         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
// //         swap_mobilization_trips: null,
// //         swap_demobilization_trips: swap_demobilization_trips || null,
// //         swap_remark: swap_remark || null,
// //         delivery_note_status: "Pending",
// //         off_hire_note_status: "Pending",
// //         overall_status: "Creation",
// //         swap_type: "OFF_HIRE",
// //         created_by: username,
// //       },
// //       { transaction },
// //     );

// //     // CREATE RECORD 2: DELIVERY — for the new/incoming equipment
// //     const deliverySwap = await EquipmentSwapModel.create(
// //       {
// //         swap_group_id: swapGroupId,              // ✅ same shared group ID
// //         sales_order_id,
// //         allocation_id: allocation_id || null,
// //         previous_equipment_serial: null,
// //         previous_plate_no: null,
// //         new_equipment_serial: existingEquipment.serial_number,
// //         new_plate_no,
// //         swap_date,
// //         swap_reason,
// //         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
// //         swap_mobilization_trips: swap_mobilization_trips || null,
// //         swap_demobilization_trips: null,
// //         swap_remark: swap_remark || null,
// //         delivery_note_status: "Pending",
// //         off_hire_note_status: "Pending",
// //         overall_status: "Creation",
// //         swap_type: "DELIVERY",
// //         created_by: username,
// //       },
// //       { transaction },
// //     );

// //     await salesOrder.update(
// //       { has_pending_swap_request: true },
// //       { transaction },
// //     );

// //     // Update allocation equipment if allocation_id exists
// //     if (allocation_id) {
// //       const ActiveAllocationEquipmentModel =
// //         require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationEquipmentModel;

// //       await ActiveAllocationEquipmentModel.update(
// //         {
// //           serial_number: existingEquipment.serial_number,
// //           updated_at: new Date(),
// //         },
// //         {
// //           where: {
// //             allocation_id: allocation_id,
// //             serial_number: previousEquipment.serial_number,
// //           },
// //           transaction,
// //         },
// //       );
// //     }

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Equipment swap records created successfully",
// //       equipmentSwap: deliverySwap,
// //       offHireSwap,
// //       deliverySwap,
// //       swap_group_id: swapGroupId,              // ✅ returned in response
// //       summary: {
// //         swap_group_id: swapGroupId,
// //         off_hire_plate: previous_plate_no,
// //         delivery_plate: new_plate_no,
// //         swap_date,
// //       },
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating equipment swap:", error);
// //     res.status(500).json({
// //       message: "Error creating equipment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get equipment swap by ID with details
// // const getEquipmentSwapById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const equipmentSwap = await EquipmentSwapModel.findByPk(id, {
// //       include: [
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"],
// //         },
// //         {
// //           model: EquipmentModel,
// //           as: "previousEquipment",
// //           attributes: ["serial_number", "reg_number", "vehicle_type"],
// //         },
// //         {
// //           model: EquipmentModel,
// //           as: "newEquipment",
// //           attributes: ["serial_number", "reg_number", "vehicle_type"],
// //         },
// //         {
// //           model: EquipmentDeliveryNoteModel,
// //           as: "deliveryNotes",
// //           include: [
// //             {
// //               model: EquipmentDeliveryNoteTripModel,
// //               as: "trips",
// //             },
// //           ],
// //           order: [["created_at", "DESC"]],
// //         },
// //         {
// //           model: EquipmentOffHireNoteModel,
// //           as: "offHireNotes",
// //           include: [
// //             {
// //               model: EquipmentOffHireNoteTripModel,
// //               as: "trips",
// //             },
// //           ],
// //           order: [["created_at", "DESC"]],
// //         },
// //       ],
// //     });

// //     if (!equipmentSwap) {
// //       return res.status(404).json({ message: "Equipment swap not found" });
// //     }

// //     res.status(200).json({
// //       equipmentSwap,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching equipment swap:", error);
// //     res.status(500).json({
// //       message: "Error fetching equipment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get swap request counts for notification badge
// // const getSwapRequestCounts = async (req, res) => {
// //   try {
// //     const { sales_order_id } = req.query;

// //     const where = {
// //       swap_status: {
// //         [Op.in]: ["Swap Request", "Resubmit"],
// //       },
// //     };

// //     if (sales_order_id) {
// //       where.sales_order_id = sales_order_id;
// //     }

// //     const equipmentCount = await EquipmentSwapModel.count({ where });
// //     const attachmentCount = await AttachmentSwapModel.count({ where });

// //     res.status(200).json({
// //       success: true,
// //       equipmentSwapCount: equipmentCount,
// //       attachmentSwapCount: attachmentCount,
// //       totalSwapCount: equipmentCount + attachmentCount,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching swap request counts:", error);
// //     res.status(500).json({
// //       message: "Error fetching swap request counts",
// //       error: error.message,
// //     });
// //   }
// // };

// // const createEquipmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_swap_id } = req.params;
// //     const { delivery_date, remarks, trips } = req.body;

// //     // Get equipment swap
// //     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
// //       include: [
// //         {
// //           model: EquipmentModel,
// //           as: "newEquipment",
// //           attributes: ["serial_number", "reg_number"],
// //         },
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"],
// //         },
// //       ],
// //     });

// //     if (!equipmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Equipment swap not found" });
// //     }

// //     // Generate DN number
// //     const currentYear = new Date().getFullYear();
// //     const prefix = `EQ-DN-${currentYear}-`;

// //     const lastDN = await EquipmentDeliveryNoteModel.findOne({
// //       where: { dn_number: { [Op.like]: `${prefix}%` } },
// //       order: [["dn_number", "DESC"]],
// //     });

// //     let nextNumber = 1;
// //     if (lastDN) {
// //       const lastNumber = parseInt(lastDN.dn_number.split("-")[3]);
// //       nextNumber = lastNumber + 1;
// //     }

// //     const dn_number = `${prefix}${String(nextNumber).padStart(4, "0")}`;

// //     // Get logged in user
// //     let username = "System";
// //     if (req.user?.uid) {
// //       const user = await UsersModel.findByPk(req.user.uid);
// //       if (user) username = user.username;
// //     }

// //     // Create delivery note
// //     const deliveryNote = await EquipmentDeliveryNoteModel.create(
// //       {
// //         equipment_swap_id,
// //         dn_number,
// //         new_equipment_serial: equipmentSwap.new_equipment_serial,
// //         new_plate_no: equipmentSwap.new_plate_no,
// //         delivery_date,
// //         status: "Creation",
// //         remarks,
// //         created_by: username,
// //       },
// //       { transaction }
// //     );

// //     // Create trips if provided
// //     if (trips && trips.length > 0) {
// //       for (const trip of trips) {
// //         const newTrip = await EquipmentDeliveryNoteTripModel.create(
// //           {
// //             equipment_dn_id: deliveryNote.equipment_dn_id,
// //             trip_number: trip.trip_number,
// //             transportation_company: trip.transportation_company,
// //             driver_name: trip.driver_name,
// //             driver_contact: trip.driver_contact,
// //             vehicle_type: trip.vehicle_type || null,
// //             vehicle_number: trip.vehicle_number || null,
// //             recovery_vehicle_number: trip.recovery_vehicle_number || null,
// //             chargeable_type: trip.chargeable_type || null,
// //             trip_date: trip.trip_date || null,
// //             trip_status: "Creation",
// //             remarks: trip.remarks || null,
// //           },
// //           { transaction }
// //         );

// //         // Add equipment resources to this trip
// //         if (trip.equipment && trip.equipment.length > 0) {
// //           for (const equip of trip.equipment) {
// //             // EquipmentDNEquipmentModel is the new resource table.
// //             // If you haven't migrated yet, skip this block and use the old model.
// //             await EquipmentDNEquipmentModel.create(
// //               {
// //                 equipment_dn_id: deliveryNote.equipment_dn_id,
// //                 trip_id: newTrip.trip_id,
// //                 serial_number: equip.serial_number,
// //                 reg_number: equip.reg_number,
// //                 equipment_type: equip.equipment_type || null,
// //               },
// //               { transaction }
// //             );
// //           }
// //         }
// //       }
// //     }

// //     // ─── FIX: safe overall_status update ────────────────────────────────────
// //     // Only update if swap_group_id exists and sameGroupSwapData is non-empty
// //     if (equipmentSwap.swap_group_id) {
// //       const sameGroupSwapData = await EquipmentSwapModel.findAll({
// //         where: {
// //           swap_group_id: equipmentSwap.swap_group_id,
// //           equipment_swap_id: { [Op.ne]: equipmentSwap.equipment_swap_id },
// //         },
// //         transaction,
// //       });

// //       const partnerSwap = sameGroupSwapData[0]; // may be undefined

// //       if (partnerSwap) {
// //         if (partnerSwap.overall_status === "Partially completed") {
// //           // Partner already partially done → mark both as Completed
// //           const groupIds = sameGroupSwapData
// //             .map((d) => d.equipment_swap_id)
// //             .concat(equipmentSwap.equipment_swap_id);

// //           await EquipmentSwapModel.update(
// //             { overall_status: "Completed" },
// //             {
// //               where: { equipment_swap_id: { [Op.in]: groupIds } },
// //               transaction,
// //             }
// //           );
// //         } else {
// //           // Partner not done yet → mark this one as Partially completed
// //           await EquipmentSwapModel.update(
// //             { overall_status: "Partially completed" },
// //             {
// //               where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
// //               transaction,
// //             }
// //           );
// //         }
// //       } else {
// //         // No partner found — just mark as In progress
// //         await EquipmentSwapModel.update(
// //           {
// //             delivery_note_status: "In Progress",
// //             overall_status: "In progress",
// //           },
// //           {
// //             where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
// //             transaction,
// //           }
// //         );
// //       }
// //     } else {
// //       // No swap_group_id — simple update
// //       await EquipmentSwapModel.update(
// //         {
// //           delivery_note_status: "In Progress",
// //           overall_status: "In progress",
// //         },
// //         {
// //           where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
// //           transaction,
// //         }
// //       );
// //     }
// //     // ────────────────────────────────────────────────────────────────────────

// //     await transaction.commit();

// //     // Fetch created delivery note with trips
// //     const createdDeliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       deliveryNote.equipment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentDeliveryNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     res.status(201).json({
// //       message: "Equipment delivery note created successfully",
// //       deliveryNote: createdDeliveryNote,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating equipment delivery note:", error);
// //     res.status(500).json({
// //       message: "Error creating equipment delivery note",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Create equipment delivery note with trips
// // // const createEquipmentDeliveryNote = async (req, res) => {
// // //   const transaction = await sequelize.transaction();

// // //   try {
// // //     const { equipment_swap_id } = req.params;
// // //     const { delivery_date, remarks, trips } = req.body;

// // //     // Get equipment swap
// // //     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
// // //       include: [
// // //         {
// // //           model: EquipmentModel,
// // //           as: "newEquipment",
// // //           attributes: ["serial_number", "reg_number"],
// // //         },
// // //         {
// // //           model: SalesOrdersModel,
// // //           as: "salesOrder",
// // //           attributes: ["so_number", "client", "project_name"],
// // //         },
// // //       ],
// // //     });

// // //     if (!equipmentSwap) {
// // //       await transaction.rollback();
// // //       return res.status(404).json({ message: "Equipment swap not found" });
// // //     }

// // //     // Generate DN number
// // //     const currentYear = new Date().getFullYear();
// // //     const prefix = `EQ-DN-${currentYear}-`;

// // //     const lastDN = await EquipmentDeliveryNoteModel.findOne({
// // //       where: { dn_number: { [Op.like]: `${prefix}%` } },
// // //       order: [["dn_number", "DESC"]],
// // //     });

// // //     let nextNumber = 1;
// // //     if (lastDN) {
// // //       const lastNumber = parseInt(lastDN.dn_number.split("-")[3]);
// // //       nextNumber = lastNumber + 1;
// // //     }

// // //     const dn_number = `${prefix}${String(nextNumber).padStart(4, "0")}`;

// // //     // Get logged in user
// // //     let username = "System";
// // //     if (req.user?.uid) {
// // //       const user = await UsersModel.findByPk(req.user.uid);
// // //       if (user) {
// // //         username = user.username;
// // //       }
// // //     }

// // //     // Create delivery note
// // //     const deliveryNote = await EquipmentDeliveryNoteModel.create(
// // //       {
// // //         equipment_swap_id,
// // //         dn_number,
// // //         new_equipment_serial: equipmentSwap.new_equipment_serial,
// // //         new_plate_no: equipmentSwap.new_plate_no,
// // //         delivery_date,
// // //         status: "Creation",
// // //         remarks,
// // //         created_by: username,
// // //       },
// // //       { transaction },
// // //     );

// // //     // Create trips if provided
// // //     if (trips && trips.length > 0) {
// // //       for (const trip of trips) {
// // //         await EquipmentDeliveryNoteTripModel.create(
// // //           {
// // //             equipment_dn_id: deliveryNote.equipment_dn_id,
// // //             trip_number: trip.trip_number,
// // //             transportation_company: trip.transportation_company,
// // //             driver_name: trip.driver_name,
// // //             driver_contact: trip.driver_contact,
// // //             vehicle_type: trip.vehicle_type,
// // //             vehicle_number: trip.vehicle_number,
// // //             trip_date: trip.trip_date,
// // //             trip_status: "Creation",
// // //             remarks: trip.remarks,
// // //           },
// // //           { transaction },
// // //         );
// // //       }
// // //     }

// // //     const sameGroupSwapData = await EquipmentSwapModel.findAll({
// // //       where: {
// // //         overall_status: "Partially completed",
// // //         swap_group_id: equipmentSwap.swap_group_id,
// // //       },
// // //     });

// // //     if (equipmentSwap.overall_status === "In progress") {
// // //       if (sameGroupSwapData[0].overall_status === "Partially completed") {
// // //         const equipmentGroupSwapData = await EquipmentSwapModel.findAll({
// // //           where: {
// // //             swap_group_id: equipmentSwap.swap_group_id,
// // //           },
// // //         });

// // //         const ids = equipmentGroupSwapData.map((data) =>
// // //           data.getDataValue("equipment_swap_id"),
// // //         );
// // //         console.log("Updating IDs => ", ids);
// // //         for (const data of equipmentGroupSwapData) {
// // //           await EquipmentSwapModel.update(
// // //             { overall_status: "Completed" },
// // //             {
// // //               where: { equipment_swap_id: { [Op.in]: ids }},
// // //               transaction,
// // //             },
// // //           );
// // //         }
// // //       } else {
// // //         await EquipmentSwapModel.update(
// // //           { overall_status: "Partially completed" },
// // //           {
// // //             where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
// // //             transaction,
// // //           },
// // //         );
// // //       }
// // //     }

// // //     await transaction.commit();

// // //     // Fetch created delivery note with trips
// // //     const createdDeliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// // //       deliveryNote.equipment_dn_id,
// // //       {
// // //         include: [
// // //           {
// // //             model: EquipmentDeliveryNoteTripModel,
// // //             as: "trips",
// // //             order: [["trip_number", "ASC"]],
// // //           },
// // //           {
// // //             model: EquipmentSwapModel,
// // //             as: "equipmentSwap",
// // //             include: [
// // //               {
// // //                 model: SalesOrdersModel,
// // //                 as: "salesOrder",
// // //               },
// // //             ],
// // //           },
// // //         ],
// // //       },
// // //     );

// // //     res.status(201).json({
// // //       message: "Equipment delivery note created successfully",
// // //       deliveryNote: createdDeliveryNote,
// // //     });
// // //   } catch (error) {
// // //     await transaction.rollback();
// // //     console.error("Error creating equipment delivery note:", error);
// // //     res.status(500).json({
// // //       message: "Error creating equipment delivery note",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // Create equipment off hire note with trips
// // const createEquipmentOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_swap_id } = req.params;
// //     const { off_hire_date, remarks, trips } = req.body;

// //     // Get equipment swap
// //     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
// //       include: [
// //         {
// //           model: EquipmentModel,
// //           as: "previousEquipment",
// //           attributes: ["serial_number", "reg_number"],
// //         },
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"],
// //         },
// //       ],
// //     });

// //     if (!equipmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Equipment swap not found" });
// //     }

// //     // Generate OHN number
// //     const currentYear = new Date().getFullYear();
// //     const prefix = `EQ-OH-${currentYear}-`;

// //     const lastOHN = await EquipmentOffHireNoteModel.findOne({
// //       where: { ohn_number: { [Op.like]: `${prefix}%` } },
// //       order: [["ohn_number", "DESC"]],
// //     });

// //     let nextNumber = 1;
// //     if (lastOHN) {
// //       const lastNumber = parseInt(lastOHN.ohn_number.split("-")[3]);
// //       nextNumber = lastNumber + 1;
// //     }

// //     const ohn_number = `${prefix}${String(nextNumber).padStart(4, "0")}`;

// //     // Get logged in user
// //     let username = "System";
// //     if (req.user?.uid) {
// //       const user = await UsersModel.findByPk(req.user.uid);
// //       if (user) {
// //         username = user.username;
// //       }
// //     }

// //     // Create off hire note
// //     const offHireNote = await EquipmentOffHireNoteModel.create(
// //       {
// //         equipment_swap_id,
// //         ohn_number,
// //         previous_equipment_serial: equipmentSwap.previous_equipment_serial,
// //         previous_plate_no: equipmentSwap.previous_plate_no,
// //         off_hire_date,
// //         status: "Creation",
// //         remarks,
// //         created_by: username,
// //       },
// //       { transaction },
// //     );

// //     // Create trips if provided
// //     if (trips && trips.length > 0) {
// //       for (const trip of trips) {
// //         await EquipmentOffHireNoteTripModel.create(
// //           {
// //             equipment_ohn_id: offHireNote.equipment_ohn_id,
// //             trip_number: trip.trip_number,
// //             transportation_company: trip.transportation_company,
// //             driver_name: trip.driver_name,
// //             driver_contact: trip.driver_contact,
// //             vehicle_type: trip.vehicle_type,
// //             vehicle_number: trip.vehicle_number,
// //             trip_date: trip.trip_date,
// //             trip_status: "Creation",
// //             remarks: trip.remarks,
// //           },
// //           { transaction },
// //         );
// //       }
// //     }

// //     const sameGroupSwapData = await EquipmentSwapModel.findAll({
// //       where: {
// //         overall_status: "Partially completed",
// //         swap_group_id: equipmentSwap.swap_group_id,
// //       },
// //     });

// //     if (equipmentSwap.overall_status === "In progress") {
// //       if (sameGroupSwapData.length > 0) {
// //         const equipmentGroupSwapData = await EquipmentSwapModel.findAll({
// //           where: {
// //             swap_group_id: equipmentSwap.swap_group_id,
// //           },
// //         });

// //         const ids = equipmentGroupSwapData.map((data) =>
// //           data.getDataValue("equipment_swap_id"),
// //         );
// //         for (const data of equipmentGroupSwapData) {
// //           await EquipmentSwapModel.update(
// //             { overall_status: "Completed" },
// //             {
// //               where: { equipment_swap_id: { [Op.in]: ids } },
// //               transaction,
// //             },
// //           );
// //         }
// //       } else {
// //         await EquipmentSwapModel.update(
// //           { overall_status: "Partially completed" },
// //           {
// //             where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
// //             transaction,
// //           },
// //         );
// //       }
// //     }

// //     await transaction.commit();

// //     // Fetch created off hire note with trips
// //     const createdOffHireNote = await EquipmentOffHireNoteModel.findByPk(
// //       offHireNote.equipment_ohn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentOffHireNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     );

// //     res.status(201).json({
// //       message: "Equipment off hire note created successfully",
// //       offHireNote: createdOffHireNote,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating equipment off hire note:", error);
// //     res.status(500).json({
// //       message: "Error creating equipment off hire note",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get equipment delivery note summary
// // const getEquipmentDeliveryNoteSummary = async (req, res) => {
// //   try {
// //     const { equipment_dn_id } = req.params;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentDeliveryNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //                 attributes: ["so_number", "client", "project_name"],
// //               },
// //               {
// //                 model: EquipmentModel,
// //                 as: "newEquipment",
// //                 attributes: ["serial_number", "reg_number", "vehicle_type"],
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     );

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Format summary data
// //     const summaryData = {
// //       dn_number: deliveryNote.dn_number,
// //       equipment: deliveryNote.equipmentSwap.newEquipment,
// //       delivery_date: deliveryNote.delivery_date,
// //       status: deliveryNote.status,
// //       trips: deliveryNote.trips.map((trip) => ({
// //         trip_number: trip.trip_number,
// //         transportation: {
// //           company: trip.transportation_company,
// //           driver: trip.driver_name,
// //           contact: trip.driver_contact,
// //           vehicle: trip.vehicle_number,
// //         },
// //         trip_date: trip.trip_date,
// //         trip_status: trip.trip_status,
// //         remarks: trip.remarks,
// //       })),
// //     };

// //     res.status(200).json({
// //       success: true,
// //       summary: summaryData,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching delivery note summary:", error);
// //     res.status(500).json({
// //       message: "Error fetching delivery note summary",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get equipment off hire note summary
// // const getEquipmentOffHireNoteSummary = async (req, res) => {
// //   try {
// //     const { equipment_ohn_id } = req.params;

// //     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
// //       equipment_ohn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentOffHireNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //                 attributes: ["so_number", "client", "project_name"],
// //               },
// //               {
// //                 model: EquipmentModel,
// //                 as: "previousEquipment",
// //                 attributes: ["serial_number", "reg_number", "vehicle_type"],
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     );

// //     if (!offHireNote) {
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Format summary data
// //     const summaryData = {
// //       ohn_number: offHireNote.ohn_number,
// //       equipment: offHireNote.equipmentSwap.previousEquipment,
// //       off_hire_date: offHireNote.off_hire_date,
// //       status: offHireNote.status,
// //       trips: offHireNote.trips.map((trip) => ({
// //         trip_number: trip.trip_number,
// //         transportation: {
// //           company: trip.transportation_company,
// //           driver: trip.driver_name,
// //           contact: trip.driver_contact,
// //           vehicle: trip.vehicle_number,
// //         },
// //         trip_date: trip.trip_date,
// //         trip_status: trip.trip_status,
// //         remarks: trip.remarks,
// //       })),
// //     };

// //     res.status(200).json({
// //       success: true,
// //       summary: summaryData,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching off hire note summary:", error);
// //     res.status(500).json({
// //       message: "Error fetching off hire note summary",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Generate equipment delivery note PDF

// // const generateEquipmentDeliveryNotePDF = async (req, res) => {
// //   try {
// //     const { equipment_dn_id } = req.params;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentDeliveryNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //                 attributes: [
// //                   "so_number",
// //                   "client",
// //                   "project_name",
// //                   "ordered_date",
// //                   "lpo_number",
// //                 ],
// //               },
// //               {
// //                 model: EquipmentModel,
// //                 as: "newEquipment",
// //                 attributes: [
// //                   "serial_number",
// //                   "reg_number",
// //                   "vehicle_type",
// //                   "description",
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     );

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Update status to In Progress when PDF is generated
// //     await deliveryNote.update({ status: "In Progress" });

// //     // Also update trips status
// //     await EquipmentDeliveryNoteTripModel.update(
// //       { trip_status: "In Progress" },
// //       {
// //         where: { equipment_dn_id, trip_status: "Creation" },
// //       },
// //     );

// //     // Generate PDF
// //     const doc = new PDFDocument({ margin: 40, size: "A4" });

// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="DN-${deliveryNote.dn_number}.pdf"`,
// //     );

// //     doc.pipe(res);

// //     // Add border to page
// //     const pageWidth = doc.page.width;
// //     const pageHeight = doc.page.height;
// //     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

// //     // Company Header with Blue Background
// //     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#1E40AF", "#1E40AF");

// //     doc
// //       .fontSize(22)
// //       .font("Helvetica-Bold")
// //       .fillColor("#FFFFFF")
// //       .text("Auto Xpert Trading and Service WLL", 50, 55, { align: "center" })
// //       .fontSize(9)
// //       .font("Helvetica")
// //       .text(
// //         "Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56",
// //         50,
// //         82,
// //         { align: "center" },
// //       )
// //       .text("Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa", 50, 95, {
// //         align: "center",
// //       });

// //     doc.fillColor("#000000");

// //     // Document Title
// //     doc.moveDown(3);
// //     doc
// //       .fontSize(18)
// //       .font("Helvetica-Bold")
// //       .fillColor("#1E40AF")
// //       .text("EQUIPMENT DELIVERY NOTE", { align: "center" })
// //       .fillColor("#000000");

// //     doc.moveDown(1);
// //     doc
// //       .moveTo(100, doc.y)
// //       .lineTo(pageWidth - 100, doc.y)
// //       .stroke("#1E40AF");
// //     doc.moveDown(1);

// //     // Two Column Layout for Details
// //     const leftX = 50;
// //     const rightX = 320;
// //     const startY = doc.y;

// //     // Left Column - Ship-to Address
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#1E40AF");
// //     doc.text("SHIP-TO ADDRESS", leftX, startY);
// //     doc.fillColor("#000000");

// //     doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
// //     doc.fontSize(10).font("Helvetica");
// //     doc.text(
// //       deliveryNote.equipmentSwap.salesOrder.client,
// //       leftX + 10,
// //       startY + 30,
// //       { width: 220 },
// //     );

// //     // Right Column - Document Details
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#1E40AF");
// //     doc.text("DOCUMENT DETAILS", rightX, startY);
// //     doc.fillColor("#000000");

// //     const detailsY = startY + 20;
// //     doc.rect(rightX, detailsY, 240, 90).stroke("#CCCCCC");

// //     doc.fontSize(9).font("Helvetica-Bold");
// //     doc.text("Delivery Note No.:", rightX + 10, detailsY + 10);
// //     doc.text("Delivery Date:", rightX + 10, detailsY + 30);
// //     doc.text("Order Reference No.:", rightX + 10, detailsY + 50);
// //     doc.text("Project Name:", rightX + 10, detailsY + 70);

// //     doc.font("Helvetica");
// //     doc.text(deliveryNote.dn_number, rightX + 130, detailsY + 10);
// //     doc.text(
// //       new Date(deliveryNote.delivery_date).toLocaleDateString("en-GB"),
// //       rightX + 130,
// //       detailsY + 30,
// //     );
// //     doc.text(
// //       deliveryNote.equipmentSwap.salesOrder.so_number,
// //       rightX + 130,
// //       detailsY + 50,
// //     );
// //     doc.text(
// //       deliveryNote.equipmentSwap.salesOrder.project_name || "N/A",
// //       rightX + 130,
// //       detailsY + 70,
// //       { width: 100 },
// //     );

// //     doc.y = startY + 120;
// //     doc.moveDown(1);

// //     // Equipment Details Section
// //     doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //     doc
// //       .rect(leftX, doc.y, pageWidth - 100, 20)
// //       .fillAndStroke("#1E40AF", "#1E40AF");
// //     doc.text("EQUIPMENT DETAILS", leftX + 10, doc.y + 5);

// //     doc.fillColor("#000000");
// //     doc.moveDown(1.5);

// //     const equipY = doc.y;
// //     // doc.rect(leftX, equipY, pageWidth - 100, 70).stroke('#CCCCCC');

// //     doc.fontSize(9).font("Helvetica-Bold");
// //     doc.text("Plate Number:", leftX + 10, equipY + 10);
// //     doc.text("Vehicle Type:", leftX + 10, equipY + 30);
// //     doc.text("Serial Number:", leftX + 10, equipY + 50);

// //     doc.font("Helvetica");
// //     doc.text(
// //       deliveryNote.equipmentSwap.newEquipment.reg_number,
// //       leftX + 120,
// //       equipY + 10,
// //     );
// //     doc.text(
// //       deliveryNote.equipmentSwap.newEquipment.vehicle_type,
// //       leftX + 120,
// //       equipY + 30,
// //     );
// //     doc.text(
// //       deliveryNote.equipmentSwap.newEquipment.serial_number,
// //       leftX + 120,
// //       equipY + 50,
// //     );

// //     doc.y = equipY + 80;
// //     doc.moveDown(1);

// //     // Transportation Details
// //     if (deliveryNote.trips && deliveryNote.trips.length > 0) {
// //       doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //       doc
// //         .rect(leftX, doc.y, pageWidth - 100, 20)
// //         .fillAndStroke("#1E40AF", "#1E40AF");
// //       doc.text("TRANSPORTATION DETAILS", leftX + 10, doc.y + 5);

// //       doc.fillColor("#000000");
// //       doc.moveDown(1.5);

// //       deliveryNote.trips.forEach((trip, index) => {
// //         const tripY = doc.y;
// //         const tripHeight = 100;

// //         // Add new page if needed
// //         if (tripY + tripHeight > pageHeight - 100) {
// //           doc.addPage();
// //           doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //           doc.y = 50;
// //         }

// //         // doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke('#CCCCCC');

// //         doc.fontSize(10).font("Helvetica-Bold").fillColor("#1E40AF");
// //         doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
// //         doc.fillColor("#000000");

// //         const tripDetailsY = doc.y + 30;
// //         doc.fontSize(9).font("Helvetica-Bold");
// //         doc.text("Company:", leftX + 10, tripDetailsY);
// //         doc.text("Driver:", leftX + 10, tripDetailsY + 15);
// //         doc.text("Contact:", leftX + 10, tripDetailsY + 30);
// //         doc.text("Vehicle Type:", leftX + 10, tripDetailsY + 45);
// //         doc.text("Vehicle No.:", leftX + 10, tripDetailsY + 60);

// //         doc.font("Helvetica");
// //         doc.text(trip.transportation_company, leftX + 100, tripDetailsY, {
// //           width: 200,
// //         });
// //         doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
// //         doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
// //         doc.text(trip.vehicle_type || "N/A", leftX + 100, tripDetailsY + 45);
// //         doc.text(trip.vehicle_number || "N/A", leftX + 100, tripDetailsY + 60);

// //         if (trip.trip_date) {
// //           doc.font("Helvetica-Bold");
// //           doc.text("Trip Date:", rightX, tripDetailsY);
// //           doc.font("Helvetica");
// //           doc.text(
// //             new Date(trip.trip_date).toLocaleDateString("en-GB"),
// //             rightX + 80,
// //             tripDetailsY,
// //           );
// //         }

// //         doc.y += tripHeight + 10;
// //       });
// //     }

// //     // Remarks Section
// //     if (deliveryNote.remarks) {
// //       doc.moveDown(1);
// //       doc.fontSize(11).font("Helvetica-Bold").fillColor("#1E40AF");
// //       doc.text("REMARKS", leftX);
// //       doc.fillColor("#000000");

// //       doc.fontSize(9).font("Helvetica");
// //       doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke("#CCCCCC");
// //       doc.text(deliveryNote.remarks, leftX + 10, doc.y + 15, {
// //         width: pageWidth - 120,
// //       });
// //       doc.y += 50;
// //     }

// //     doc.moveDown(2);

// //     doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
// //     doc.text(
// //       "We acknowledge that the equipment has been received in good condition.",
// //       leftX + 10,
// //       doc.y + 10,
// //       { width: pageWidth - 120, align: "center" },
// //     );

// //     doc.moveDown(3);

// //     // Signature Section
// //     const sigY = doc.y;

// //     // Check if we need a new page
// //     if (sigY + 120 > pageHeight - 60) {
// //       doc.addPage();
// //       doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //       doc.y = 50;
// //     }

// //     doc.fontSize(10).font("Helvetica-Bold");

// //     // Left signature
// //     doc.text("Received By:", leftX, doc.y);
// //     doc
// //       .moveTo(leftX, doc.y + 50)
// //       .lineTo(leftX + 200, doc.y + 50)
// //       .stroke();
// //     doc.font("Helvetica").fontSize(8);
// //     doc.text("Name & Signature", leftX, doc.y + 55);

// //     // Right signature
// //     doc.font("Helvetica-Bold").fontSize(10);
// //     doc.text("Date:", rightX, sigY);
// //     doc
// //       .moveTo(rightX, sigY + 50)
// //       .lineTo(rightX + 200, sigY + 50)
// //       .stroke();
// //     doc.font("Helvetica").fontSize(8);
// //     doc.text("DD/MM/YYYY", rightX, sigY + 55);

// //     doc.moveDown(4);

// //     // Contact section
// //     doc.text("Contact No.:", leftX, doc.y);
// //     doc
// //       .moveTo(leftX, doc.y + 50)
// //       .lineTo(leftX + 200, doc.y + 50)
// //       .stroke();

// //     // Footer
// //     doc.fontSize(7).font("Helvetica-Oblique").fillColor("#666666");
// //     doc.text(
// //       "This is a computer generated document. No signature is required.",
// //       0,
// //       pageHeight - 50,
// //       { align: "center", width: pageWidth },
// //     );

// //     doc.end();
// //   } catch (error) {
// //     console.error("Error generating delivery note PDF:", error);
// //     res.status(500).json({
// //       message: "Error generating delivery note PDF",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Generate equipment off hire note PDF

// // const generateEquipmentOffHireNotePDF = async (req, res) => {
// //   try {
// //     const { equipment_ohn_id } = req.params;

// //     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
// //       equipment_ohn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentOffHireNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //                 attributes: [
// //                   "so_number",
// //                   "client",
// //                   "project_name",
// //                   "ordered_date",
// //                   "lpo_number",
// //                 ],
// //               },
// //               {
// //                 model: EquipmentModel,
// //                 as: "previousEquipment",
// //                 attributes: [
// //                   "serial_number",
// //                   "reg_number",
// //                   "vehicle_type",
// //                   "description",
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //       },
// //     );

// //     if (!offHireNote) {
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Update status to In Progress when PDF is generated
// //     await offHireNote.update({ status: "In Progress" });

// //     // Also update trips status
// //     await EquipmentOffHireNoteTripModel.update(
// //       { trip_status: "In Progress" },
// //       {
// //         where: { equipment_ohn_id, trip_status: "Creation" },
// //       },
// //     );

// //     // Generate PDF
// //     const doc = new PDFDocument({ margin: 40, size: "A4" });

// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="OHN-${offHireNote.ohn_number}.pdf"`,
// //     );

// //     doc.pipe(res);

// //     // Add border to page
// //     const pageWidth = doc.page.width;
// //     const pageHeight = doc.page.height;
// //     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

// //     // Company Header with Red Background
// //     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#DC2626", "#DC2626");

// //     doc
// //       .fontSize(22)
// //       .font("Helvetica-Bold")
// //       .fillColor("#FFFFFF")
// //       .text("Auto Xpert Trading and Service WLL", 50, 55, { align: "center" })
// //       .fontSize(9)
// //       .font("Helvetica")
// //       .text(
// //         "Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56",
// //         50,
// //         82,
// //         { align: "center" },
// //       )
// //       .text("Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa", 50, 95, {
// //         align: "center",
// //       });

// //     doc.fillColor("#000000");

// //     // Document Title
// //     doc.moveDown(3);
// //     doc
// //       .fontSize(18)
// //       .font("Helvetica-Bold")
// //       .fillColor("#DC2626")
// //       .text("EQUIPMENT OFF HIRE NOTE", { align: "center" })
// //       .fillColor("#000000");

// //     doc.moveDown(1);
// //     doc
// //       .moveTo(100, doc.y)
// //       .lineTo(pageWidth - 100, doc.y)
// //       .stroke("#DC2626");
// //     doc.moveDown(1);

// //     // Two Column Layout for Details
// //     const leftX = 50;
// //     const rightX = 320;
// //     const startY = doc.y;

// //     // Left Column - Client Address
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
// //     doc.text("CLIENT INFORMATION", leftX, startY);
// //     doc.fillColor("#000000");

// //     doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
// //     doc.fontSize(10).font("Helvetica");
// //     doc.text(
// //       offHireNote.equipmentSwap.salesOrder.client,
// //       leftX + 10,
// //       startY + 30,
// //       { width: 220 },
// //     );

// //     // Right Column - Document Details
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
// //     doc.text("DOCUMENT DETAILS", rightX, startY);
// //     doc.fillColor("#000000");

// //     const detailsY = startY + 20;
// //     doc.rect(rightX, detailsY, 240, 90).stroke("#CCCCCC");

// //     doc.fontSize(9).font("Helvetica-Bold");
// //     doc.text("Off Hire Note No.:", rightX + 10, detailsY + 10);
// //     doc.text("Off Hire Date:", rightX + 10, detailsY + 30);
// //     doc.text("Order Reference No.:", rightX + 10, detailsY + 50);
// //     doc.text("Project Name:", rightX + 10, detailsY + 70);

// //     doc.font("Helvetica");
// //     doc.text(offHireNote.ohn_number, rightX + 130, detailsY + 10);
// //     doc.text(
// //       new Date(offHireNote.off_hire_date).toLocaleDateString("en-GB"),
// //       rightX + 130,
// //       detailsY + 30,
// //     );
// //     doc.text(
// //       offHireNote.equipmentSwap.salesOrder.so_number,
// //       rightX + 130,
// //       detailsY + 50,
// //     );
// //     doc.text(
// //       offHireNote.equipmentSwap.salesOrder.project_name || "N/A",
// //       rightX + 130,
// //       detailsY + 70,
// //       { width: 100 },
// //     );

// //     doc.y = startY + 120;
// //     doc.moveDown(1);

// //     // Equipment Details Section
// //     doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //     doc
// //       .rect(leftX, doc.y, pageWidth - 100, 20)
// //       .fillAndStroke("#DC2626", "#DC2626");
// //     doc.text("EQUIPMENT DETAILS", leftX + 10, doc.y + 5);

// //     doc.fillColor("#000000");
// //     doc.moveDown(1.5);

// //     const equipY = doc.y;
// //     // doc.rect(leftX, equipY, pageWidth - 100, 70).stroke('#CCCCCC');

// //     doc.fontSize(9).font("Helvetica-Bold");
// //     doc.text("Plate Number:", leftX + 10, equipY + 10);
// //     doc.text("Vehicle Type:", leftX + 10, equipY + 30);
// //     doc.text("Serial Number:", leftX + 10, equipY + 50);

// //     doc.font("Helvetica");
// //     doc.text(
// //       offHireNote.equipmentSwap.previousEquipment.reg_number,
// //       leftX + 120,
// //       equipY + 10,
// //     );
// //     doc.text(
// //       offHireNote.equipmentSwap.previousEquipment.vehicle_type,
// //       leftX + 120,
// //       equipY + 30,
// //     );
// //     doc.text(
// //       offHireNote.equipmentSwap.previousEquipment.serial_number,
// //       leftX + 120,
// //       equipY + 50,
// //     );

// //     doc.y = equipY + 80;
// //     doc.moveDown(1);

// //     // Transportation Details
// //     if (offHireNote.trips && offHireNote.trips.length > 0) {
// //       doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //       doc
// //         .rect(leftX, doc.y, pageWidth - 100, 20)
// //         .fillAndStroke("#DC2626", "#DC2626");
// //       doc.text("TRANSPORTATION DETAILS", leftX + 10, doc.y + 5);

// //       doc.fillColor("#000000");
// //       doc.moveDown(1.5);

// //       offHireNote.trips.forEach((trip, index) => {
// //         const tripY = doc.y;
// //         const tripHeight = 100;

// //         // Add new page if needed
// //         if (tripY + tripHeight > pageHeight - 100) {
// //           doc.addPage();
// //           doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //           doc.y = 50;
// //         }

// //         // doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke('#CCCCCC');

// //         doc.fontSize(10).font("Helvetica-Bold").fillColor("#DC2626");
// //         doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
// //         doc.fillColor("#000000");

// //         const tripDetailsY = doc.y + 30;
// //         doc.fontSize(9).font("Helvetica-Bold");
// //         doc.text("Company:", leftX + 10, tripDetailsY);
// //         doc.text("Driver:", leftX + 10, tripDetailsY + 15);
// //         doc.text("Contact:", leftX + 10, tripDetailsY + 30);
// //         doc.text("Vehicle Type:", leftX + 10, tripDetailsY + 45);
// //         doc.text("Vehicle No.:", leftX + 10, tripDetailsY + 60);

// //         doc.font("Helvetica");
// //         doc.text(trip.transportation_company, leftX + 100, tripDetailsY, {
// //           width: 200,
// //         });
// //         doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
// //         doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
// //         doc.text(trip.vehicle_type || "N/A", leftX + 100, tripDetailsY + 45);
// //         doc.text(trip.vehicle_number || "N/A", leftX + 100, tripDetailsY + 60);

// //         if (trip.trip_date) {
// //           doc.font("Helvetica-Bold");
// //           doc.text("Trip Date:", rightX, tripDetailsY);
// //           doc.font("Helvetica");
// //           doc.text(
// //             new Date(trip.trip_date).toLocaleDateString("en-GB"),
// //             rightX + 80,
// //             tripDetailsY,
// //           );
// //         }

// //         doc.y += tripHeight + 10;
// //       });
// //     }

// //     // Remarks Section
// //     if (offHireNote.remarks) {
// //       doc.moveDown(1);
// //       doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
// //       doc.text("REMARKS", leftX);
// //       doc.fillColor("#000000");

// //       doc.fontSize(9).font("Helvetica");
// //       doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke("#CCCCCC");
// //       doc.text(offHireNote.remarks, leftX + 10, doc.y + 15, {
// //         width: pageWidth - 120,
// //       });
// //       doc.y += 50;
// //     }

// //     doc.moveDown(2);

// //     // Acknowledgement Box
// //     // doc.rect(leftX, doc.y, pageWidth - 100, 30).fillAndStroke('#FEE2E2', '#CCCCCC');
// //     doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
// //     doc.text(
// //       "We acknowledge that the equipment has been returned in good condition.",
// //       leftX + 10,
// //       doc.y + 10,
// //       { width: pageWidth - 120, align: "center" },
// //     );

// //     doc.moveDown(3);

// //     // Signature Section
// //     const sigY = doc.y;

// //     // Check if we need a new page
// //     if (sigY + 120 > pageHeight - 60) {
// //       doc.addPage();
// //       doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
// //       doc.y = 50;
// //     }

// //     doc.fontSize(10).font("Helvetica-Bold");

// //     // Left signature
// //     doc.text("Received By:", leftX, doc.y);
// //     doc
// //       .moveTo(leftX, doc.y + 50)
// //       .lineTo(leftX + 200, doc.y + 50)
// //       .stroke();
// //     doc.font("Helvetica").fontSize(8);
// //     doc.text("Name & Signature", leftX, doc.y + 55);

// //     // Right signature
// //     doc.font("Helvetica-Bold").fontSize(10);
// //     doc.text("Date:", rightX, sigY);
// //     doc
// //       .moveTo(rightX, sigY + 50)
// //       .lineTo(rightX + 200, sigY + 50)
// //       .stroke();
// //     doc.font("Helvetica").fontSize(8);
// //     doc.text("DD/MM/YYYY", rightX, sigY + 55);

// //     doc.moveDown(4);

// //     // Contact section
// //     doc.text("Contact No.:", leftX, doc.y);
// //     doc
// //       .moveTo(leftX, doc.y + 50)
// //       .lineTo(leftX + 200, doc.y + 50)
// //       .stroke();

// //     // Footer
// //     doc.fontSize(7).font("Helvetica-Oblique").fillColor("#666666");
// //     doc.text(
// //       "This is a computer generated document. No signature is required.",
// //       0,
// //       pageHeight - 50,
// //       { align: "center", width: pageWidth },
// //     );

// //     doc.end();
// //   } catch (error) {
// //     console.error("Error generating off hire note PDF:", error);
// //     res.status(500).json({
// //       message: "Error generating off hire note PDF",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Upload equipment delivery note attachment
// // const uploadEquipmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_dn_id } = req.params;
// //     const user = req.user;

// //     if (!req.file) {
// //       await transaction.rollback();
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const fileName = req.file.filename;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       { transaction }
// //     );

// //     if (!deliveryNote) {
// //       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     await deliveryNote.update(
// //       {
// //         delivery_attachment: fileName,
// //         status: "Completed",
// //         uploaded_by: user?.username || "System",
// //         uploaded_at: new Date(),
// //       },
// //       { transaction }
// //     );

// //     // Update equipment swap status
// //     const equipmentSwap = await EquipmentSwapModel.findByPk(
// //       deliveryNote.equipment_swap_id,
// //       { transaction }
// //     );

// //     if (equipmentSwap) {
// //       await equipmentSwap.update(
// //         {
// //           delivery_note_status: "Completed",
// //           overall_status:
// //             equipmentSwap.off_hire_note_status === "Completed"
// //               ? "Completed"
// //               : "In progress",
// //         },
// //         { transaction }
// //       );
// //     }

// //     await transaction.commit();

// //     res.status(200).json({
// //       success: true,
// //       message: "Signed delivery note uploaded successfully",
// //       fileName,
// //       status: "Completed",
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     if (req.file && fs.existsSync(req.file.path)) {
// //       fs.unlinkSync(req.file.path);
// //     }
// //     console.error("Error uploading equipment delivery note:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };
// // // const uploadEquipmentDeliveryNote = async (req, res) => {
// // //   const transaction = await sequelize.transaction();

// // //   try {
// // //     const { equipment_dn_id } = req.params;

// // //     // Multer puts the file in req.file (not req.files)
// // //     if (!req.file) {
// // //       await transaction.rollback();
// // //       return res.status(400).json({ message: "No file uploaded" });
// // //     }

// // //     const file = req.file;

// // //     // Multer already saved the file, so we use its filename
// // //     const fileName = file.filename;

// // //     // Update delivery note with file path
// // //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// // //       equipment_dn_id,
// // //       { transaction },
// // //     );
// // //     if (!deliveryNote) {
// // //       // Delete the uploaded file if delivery note not found
// // //       fs.unlinkSync(file.path);
// // //       await transaction.rollback();
// // //       return res.status(404).json({ message: "Delivery note not found" });
// // //     }

// // //     // Update status to Delivered
// // //     await deliveryNote.update(
// // //       {
// // //         delivery_attachment: fileName,
// // //         status: "Delivered",
// // //       },
// // //       { transaction },
// // //     );

// // //     // Update all trips status to Delivered
// // //     await EquipmentDeliveryNoteTripModel.update(
// // //       { trip_status: "Delivered" },
// // //       {
// // //         where: { equipment_dn_id },
// // //         transaction,
// // //       },
// // //     );

// // //     // Update equipment swap status
// // //     const equipmentSwap = await EquipmentSwapModel.findByPk(
// // //       deliveryNote.equipment_swap_id,
// // //       { transaction },
// // //     );
// // //     if (equipmentSwap) {
// // //       await equipmentSwap.update(
// // //         {
// // //           delivery_note_status: "Completed",
// // //           overall_status:
// // //             equipmentSwap.off_hire_note_status === "Completed"
// // //               ? "Completed"
// // //               : "In Progress",
// // //         },
// // //         { transaction },
// // //       );
// // //     }

// // //     await transaction.commit();

// // //     res.status(200).json({
// // //       success: true,
// // //       message: "Delivery note uploaded successfully",
// // //       fileName,
// // //       status: "Delivered",
// // //     });
// // //   } catch (error) {
// // //     await transaction.rollback();

// // //     // Clean up uploaded file if there's an error
// // //     if (req.file && fs.existsSync(req.file.path)) {
// // //       fs.unlinkSync(req.file.path);
// // //     }

// // //     console.error("Error uploading delivery note:", error);
// // //     res.status(500).json({
// // //       message: "Error uploading delivery note",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // Upload equipment off hire note attachment
// // const uploadEquipmentOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_ohn_id } = req.params;

// //     // Multer puts the file in req.file (not req.files)
// //     if (!req.file) {
// //       await transaction.rollback();
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const file = req.file;

// //     // Multer already saved the file, so we use its filename
// //     const fileName = file.filename;

// //     // Update off hire note with file path
// //     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
// //       equipment_ohn_id,
// //       { transaction },
// //     );
// //     if (!offHireNote) {
// //       // Delete the uploaded file if off hire note not found
// //       if (fs.existsSync(file.path)) {
// //         fs.unlinkSync(file.path);
// //       }
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Update status to Completed
// //     await offHireNote.update(
// //       {
// //         off_hire_attachment: fileName,
// //         status: "Completed",
// //       },
// //       { transaction },
// //     );

// //     // Update all trips status to Completed
// //     await EquipmentOffHireNoteTripModel.update(
// //       { trip_status: "Completed" },
// //       {
// //         where: { equipment_ohn_id },
// //         transaction,
// //       },
// //     );

// //     // Update equipment swap status
// //     const equipmentSwap = await EquipmentSwapModel.findByPk(
// //       offHireNote.equipment_swap_id,
// //       { transaction },
// //     );
// //     if (equipmentSwap) {
// //       await equipmentSwap.update(
// //         {
// //           off_hire_note_status: "Completed",
// //           overall_status:
// //             equipmentSwap.delivery_note_status === "Completed"
// //               ? "Completed"
// //               : "In Progress",
// //         },
// //         { transaction },
// //       );
// //     }

// //     await transaction.commit();

// //     res.status(200).json({
// //       success: true,
// //       message: "Off hire note uploaded successfully",
// //       fileName,
// //       status: "Completed",
// //     });
// //   } catch (error) {
// //     await transaction.rollback();

// //     // Clean up uploaded file if there's an error
// //     if (req.file && fs.existsSync(req.file.path)) {
// //       fs.unlinkSync(req.file.path);
// //     }

// //     console.error("Error uploading off hire note:", error);
// //     res.status(500).json({
// //       message: "Error uploading off hire note",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Add trip to equipment delivery note
// // const addTripToEquipmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_dn_id } = req.params;
// //     const {
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       recovery_vehicle_number,
// //       chargeable_type,
// //       trip_date,
// //       equipment,
// //       remarks,
// //     } = req.body;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       { transaction }
// //     );

// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     if (deliveryNote.status !== "Creation") {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Trips can only be added when delivery note is in Creation status",
// //       });
// //     }

// //     const existingTrips = await EquipmentDeliveryNoteTripModel.findAll({
// //       where: { equipment_dn_id },
// //       transaction,
// //     });

// //     if (existingTrips.length >= 7) {
// //       await transaction.rollback();
// //       return res
// //         .status(400)
// //         .json({ message: "Maximum 7 trips allowed per delivery note" });
// //     }

// //     const newTrip = await EquipmentDeliveryNoteTripModel.create(
// //       {
// //         equipment_dn_id,
// //         trip_number: existingTrips.length + 1,
// //         transportation_company,
// //         driver_name,
// //         driver_contact,
// //         vehicle_type: vehicle_type || null,
// //         vehicle_number: vehicle_number || null,
// //         recovery_vehicle_number: recovery_vehicle_number || null,
// //         chargeable_type: chargeable_type || null,
// //         trip_date: trip_date || null,
// //         trip_status: "Creation",
// //         remarks: remarks || null,
// //       },
// //       { transaction }
// //     );

// //     // Add equipment resources
// //     if (equipment && equipment.length > 0) {
// //       for (const equip of equipment) {
// //         await EquipmentDNEquipmentModel.create(
// //           {
// //             equipment_dn_id,
// //             trip_id: newTrip.trip_id,
// //             serial_number: equip.serial_number,
// //             reg_number: equip.reg_number,
// //             equipment_type: equip.equipment_type || null,
// //           },
// //           { transaction }
// //         );
// //       }
// //     }

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Trip added successfully",
// //       trip: await EquipmentDeliveryNoteTripModel.findByPk(newTrip.trip_id, {
// //         include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
// //       }),
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error adding trip to equipment delivery note:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };
// // // const addTripToEquipmentDeliveryNote = async (req, res) => {
// // //   const transaction = await sequelize.transaction();

// // //   try {
// // //     const { equipment_dn_id } = req.params;
// // //     const {
// // //       transportation_company,
// // //       driver_name,
// // //       driver_contact,
// // //       vehicle_type,
// // //       vehicle_number,
// // //       trip_date,
// // //       remarks,
// // //     } = req.body;

// // //     // Get delivery note
// // //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// // //       equipment_dn_id,
// // //       { transaction },
// // //     );
// // //     if (!deliveryNote) {
// // //       await transaction.rollback();
// // //       return res.status(404).json({ message: "Delivery note not found" });
// // //     }

// // //     // Get next trip number
// // //     const existingTrips = await EquipmentDeliveryNoteTripModel.findAll({
// // //       where: { equipment_dn_id },
// // //       transaction,
// // //     });

// // //     const nextTripNumber = existingTrips.length + 1;

// // //     // Create new trip
// // //     const newTrip = await EquipmentDeliveryNoteTripModel.create(
// // //       {
// // //         equipment_dn_id,
// // //         trip_number: nextTripNumber,
// // //         transportation_company,
// // //         driver_name,
// // //         driver_contact,
// // //         vehicle_type,
// // //         vehicle_number,
// // //         trip_date,
// // //         trip_status: "Creation",
// // //         remarks,
// // //       },
// // //       { transaction },
// // //     );

// // //     await transaction.commit();

// // //     res.status(201).json({
// // //       message: "Trip added successfully to equipment delivery note",
// // //       trip: newTrip,
// // //     });
// // //   } catch (error) {
// // //     await transaction.rollback();
// // //     console.error("Error adding trip to equipment delivery note:", error);
// // //     res.status(500).json({
// // //       message: "Error adding trip to equipment delivery note",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // Add trip to equipment off hire note
// // const addTripToEquipmentOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_ohn_id } = req.params;
// //     const {
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       trip_date,
// //       remarks,
// //     } = req.body;

// //     // Get off hire note
// //     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
// //       equipment_ohn_id,
// //       { transaction },
// //     );
// //     if (!offHireNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Get next trip number
// //     const existingTrips = await EquipmentOffHireNoteTripModel.findAll({
// //       where: { equipment_ohn_id },
// //       transaction,
// //     });

// //     const nextTripNumber = existingTrips.length + 1;

// //     // Create new trip
// //     const newTrip = await EquipmentOffHireNoteTripModel.create(
// //       {
// //         equipment_ohn_id,
// //         trip_number: nextTripNumber,
// //         transportation_company,
// //         driver_name,
// //         driver_contact,
// //         vehicle_type,
// //         vehicle_number,
// //         trip_date,
// //         trip_status: "Creation",
// //         remarks,
// //       },
// //       { transaction },
// //     );

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Trip added successfully to equipment off hire note",
// //       trip: newTrip,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error adding trip to equipment off hire note:", error);
// //     res.status(500).json({
// //       message: "Error adding trip to equipment off hire note",
// //       error: error.message,
// //     });
// //   }
// // };

// // const submitEquipmentSwapRequest = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_swap_id } = req.params;
// //     const { mobilization_charge, demobilization_charge } = req.body;

// //     // Validate required fields
// //     if (!mobilization_charge || !demobilization_charge) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Mobilization and demobilization charges are mandatory",
// //       });
// //     }

// //     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
// //       transaction,
// //     });

// //     if (!equipmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Equipment swap not found" });
// //     }

// //     // Update swap status and charges
// //     await equipmentSwap.update(
// //       {
// //         swap_status:
// //           equipmentSwap.swap_status === "Return" ? "Resubmit" : "Swap Request",
// //         mobilization_charge: parseFloat(mobilization_charge),
// //         demobilization_charge: parseFloat(demobilization_charge),
// //         return_reason: null, // Clear return reason on submit/resubmit
// //       },
// //       { transaction },
// //     );

// //     await SalesOrdersModel.update(
// //       { has_pending_swap_request: true },
// //       { where: { id: equipmentSwap.sales_order_id } },
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Equipment swap submitted successfully",
// //       equipmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error submitting equipment swap:", error);
// //     res.status(500).json({
// //       message: "Error submitting equipment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const returnEquipmentSwapRequest = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_swap_id } = req.params;
// //     const { return_reason } = req.body;

// //     if (!return_reason || !return_reason.trim()) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Return reason is required",
// //       });
// //     }

// //     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
// //       transaction,
// //     });

// //     if (!equipmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Equipment swap not found" });
// //     }

// //     // Update swap status to Return
// //     await equipmentSwap.update(
// //       {
// //         swap_status: "Return",
// //         return_reason: return_reason.trim(),
// //       },
// //       { transaction },
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Equipment swap returned successfully",
// //       equipmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error returning equipment swap:", error);
// //     res.status(500).json({
// //       message: "Error returning equipment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const approveEquipmentSwap = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_swap_id } = req.params;

// //     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
// //       transaction,
// //     });

// //     if (!equipmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Equipment swap not found" });
// //     }

// //     // Update swap status to Approved
// //     await equipmentSwap.update(
// //       {
// //         swap_status: "Approved",
// //       },
// //       { transaction }
// //     );

// //     const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
// //     const AttachmentSwapModel = require("../../models/fleet-management/AttachmentSwapModel");
// //     const SubProductSwapModel = require("../../models/fleet-management/SubProductSwapModel");

// //     const [equipmentSwaps, attachmentSwaps, subproductSwaps] = await Promise.all([
// //       EquipmentSwapModel.count({
// //         where: {
// //           sales_order_id: equipmentSwap.sales_order_id,
// //           swap_status: {
// //             [Op.in]: ['Swap Request', 'Return', 'Resubmit']
// //           }
// //         },
// //         transaction
// //       }),
// //       AttachmentSwapModel.count({
// //         where: {
// //           sales_order_id: equipmentSwap.sales_order_id,
// //           swap_status: {
// //             [Op.in]: ['Swap Request', 'Return', 'Resubmit']
// //           }
// //         },
// //         transaction
// //       }),
// //       SubProductSwapModel.count({
// //         where: {
// //           sales_order_id: equipmentSwap.sales_order_id,
// //           swap_status: {
// //             [Op.in]: ['Swap Request', 'Return', 'Resubmit']
// //           }
// //         },
// //         transaction
// //       })
// //     ]);

// //     const hasPendingSwaps = (equipmentSwaps + attachmentSwaps + subproductSwaps) > 0;

// //     await SalesOrdersModel.update(
// //       { has_pending_swap_request: hasPendingSwaps },
// //       {
// //         where: { id: equipmentSwap.sales_order_id },
// //         transaction
// //       }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Equipment swap approved successfully",
// //       equipmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error approving equipment swap:", error);
// //     res.status(500).json({
// //       message: "Error approving equipment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const rejectEquipmentSwap = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_swap_id } = req.params;
// //     const { rejection_reason } = req.body;

// //     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
// //       transaction,
// //     });

// //     if (!equipmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Equipment swap not found" });
// //     }

// //     // Update swap status to Rejected
// //     await equipmentSwap.update(
// //       {
// //         swap_status: "Rejected",
// //         return_reason: rejection_reason || "Rejected by approver",
// //       },
// //       { transaction }
// //     );

// //     // ✅ CHECK if any pending swaps remain for this sales order
// //     const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
// //     const AttachmentSwapModel = require("../../models/fleet-management/AttachmentSwapModel");
// //     const SubProductSwapModel = require("../../models/fleet-management/SubProductSwapModel");

// //     const [equipmentSwaps, attachmentSwaps, subproductSwaps] = await Promise.all([
// //       EquipmentSwapModel.count({
// //         where: {
// //           sales_order_id: equipmentSwap.sales_order_id,
// //           swap_status: {
// //             [Op.in]: ['Swap Request', 'Return', 'Resubmit']
// //           }
// //         },
// //         transaction
// //       }),
// //       AttachmentSwapModel.count({
// //         where: {
// //           sales_order_id: equipmentSwap.sales_order_id,
// //           swap_status: {
// //             [Op.in]: ['Swap Request', 'Return', 'Resubmit']
// //           }
// //         },
// //         transaction
// //       }),
// //       SubProductSwapModel.count({
// //         where: {
// //           sales_order_id: equipmentSwap.sales_order_id,
// //           swap_status: {
// //             [Op.in]: ['Swap Request', 'Return', 'Resubmit']
// //           }
// //         },
// //         transaction
// //       })
// //     ]);

// //     const hasPendingSwaps = (equipmentSwaps + attachmentSwaps + subproductSwaps) > 0;

// //     await SalesOrdersModel.update(
// //       { has_pending_swap_request: hasPendingSwaps },
// //       {
// //         where: { id: equipmentSwap.sales_order_id },
// //         transaction
// //       }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Equipment swap rejected successfully",
// //       equipmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error rejecting equipment swap:", error);
// //     res.status(500).json({
// //       message: "Error rejecting equipment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const getLatestEquipmentDeliveryNote = async (req, res) => {
// //   try {
// //     const { equipment_swap_id } = req.params;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findOne({
// //       where: { equipment_swap_id },
// //       order: [["createdAt", "DESC"]],
// //       include: [
// //         {
// //           model: EquipmentDeliveryNoteTripModel,
// //           as: "trips",
// //           include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
// //           order: [["trip_number", "ASC"]],
// //         },
// //         {
// //           model: EquipmentSwapModel,
// //           as: "equipmentSwap",
// //           include: [
// //             { model: SalesOrdersModel, as: "salesOrder" },
// //             {
// //               model: EquipmentModel,
// //               as: "newEquipment",
// //               attributes: ["serial_number", "reg_number", "vehicle_type"],
// //             },
// //           ],
// //         },
// //       ],
// //     });

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "No delivery note found" });
// //     }

// //     res.status(200).json({ deliveryNote });
// //   } catch (error) {
// //     console.error("Error fetching latest equipment delivery note:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const getEquipmentDeliveryNoteById = async (req, res) => {
// //   try {
// //     const { equipment_dn_id } = req.params;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentDeliveryNoteTripModel,
// //             as: "trips",
// //             include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               { model: SalesOrdersModel, as: "salesOrder" },
// //               {
// //                 model: EquipmentModel,
// //                 as: "newEquipment",
// //                 attributes: ["serial_number", "reg_number", "vehicle_type"],
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     res.status(200).json({ deliveryNote });
// //   } catch (error) {
// //     console.error("Error fetching equipment delivery note:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const submitEquipmentDNForApproval = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_dn_id } = req.params;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       { transaction }
// //     );

// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     if (deliveryNote.status !== "Creation") {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Can only submit delivery notes in 'Creation' status",
// //       });
// //     }

// //     await deliveryNote.update({ status: "Under Approval" }, { transaction });

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Submitted for approval successfully",
// //       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error submitting equipment DN for approval:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const approveEquipmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_dn_id } = req.params;
// //     const username = await getUsername(req);

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       { transaction }
// //     );

// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     if (deliveryNote.status !== "Under Approval") {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Delivery note must be 'Under Approval' to approve",
// //       });
// //     }

// //     await deliveryNote.update(
// //       {
// //         status: "Approved",
// //         approved_by: username,
// //         approved_at: new Date(),
// //       },
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Delivery note approved successfully",
// //       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error approving equipment delivery note:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const rejectEquipmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_dn_id } = req.params;
// //     const { reason } = req.body;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       { transaction }
// //     );

// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     if (deliveryNote.status !== "Under Approval") {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Delivery note must be 'Under Approval' to reject",
// //       });
// //     }

// //     await deliveryNote.update(
// //       {
// //         status: "Rejected",
// //         remarks: reason ? `Rejected: ${reason}` : deliveryNote.remarks,
// //       },
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Delivery note rejected successfully",
// //       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error rejecting equipment delivery note:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const generateEquipmentDNPDF = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_dn_id } = req.params;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: EquipmentDeliveryNoteTripModel,
// //             as: "trips",
// //             include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: EquipmentSwapModel,
// //             as: "equipmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //                 attributes: [
// //                   "so_number",
// //                   "client",
// //                   "project_name",
// //                   "lpo_number",
// //                 ],
// //               },
// //               {
// //                 model: EquipmentModel,
// //                 as: "newEquipment",
// //                 attributes: [
// //                   "serial_number",
// //                   "reg_number",
// //                   "vehicle_type",
// //                   "description",
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //         transaction,
// //       }
// //     );

// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     if (deliveryNote.status === "Approved") {
// //       await deliveryNote.update({ status: "In Progress" }, { transaction });
// //     }

// //     await transaction.commit();

// //     // Return data for frontend-side PDF generation
// //     res.status(200).json({
// //       success: true,
// //       data: deliveryNote,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error generating equipment DN PDF:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const closeEquipmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { equipment_dn_id } = req.params;

// //     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
// //       equipment_dn_id,
// //       { transaction }
// //     );

// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     if (deliveryNote.status !== "Completed") {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Only completed delivery notes can be closed",
// //       });
// //     }

// //     await deliveryNote.update({ status: "Close" }, { transaction });
// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Delivery note closed successfully",
// //       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error closing equipment delivery note:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const deleteTripFromEquipmentDN = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { trip_id } = req.params;

// //     const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
// //       include: [
// //         { model: EquipmentDeliveryNoteModel, as: "deliveryNote" },
// //       ],
// //       transaction,
// //     });

// //     if (!trip) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Trip not found" });
// //     }

// //     if (trip.deliveryNote.status !== "Creation") {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Trips can only be deleted when delivery note is in Creation status",
// //       });
// //     }

// //     await trip.destroy({ transaction });
// //     await transaction.commit();

// //     res.status(200).json({ message: "Trip deleted successfully" });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error deleting trip:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const uploadEquipmentDNChecklist = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { trip_id, resource_id } = req.params;
// //     const file = req.file;
// //     const user = req.user;

// //     if (!file) {
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const resource = await EquipmentDNEquipmentModel.findOne({
// //       where: { id: resource_id, trip_id },
// //       transaction,
// //     });

// //     if (!resource) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Equipment resource not found in this trip" });
// //     }

// //     await EquipmentDNEquipmentModel.update(
// //       {
// //         checklist_file_path: file.path,
// //         checklist_file_name: file.originalname,
// //         checklist_uploaded_at: new Date(),
// //         checklist_uploaded_by: user?.username || "System",
// //       },
// //       { where: { id: resource_id, trip_id }, transaction }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Checklist uploaded successfully",
// //       file: {
// //         path: file.path,
// //         name: file.originalname,
// //         uploaded_at: new Date(),
// //         uploaded_by: user?.username || "System",
// //       },
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error uploading equipment DN checklist:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const downloadEquipmentDNChecklist = async (req, res) => {
// //   try {
// //     const { trip_id, resource_id } = req.params;

// //     const resource = await EquipmentDNEquipmentModel.findOne({
// //       where: { id: resource_id, trip_id },
// //     });

// //     if (!resource) {
// //       return res.status(404).json({ message: "Equipment resource not found" });
// //     }

// //     if (!resource.checklist_file_path || !resource.checklist_file_name) {
// //       return res.status(404).json({ message: "No checklist found for this resource" });
// //     }

// //     if (!fs.existsSync(resource.checklist_file_path)) {
// //       return res.status(404).json({ message: "Checklist file not found on server" });
// //     }

// //     res.download(resource.checklist_file_path, resource.checklist_file_name, (err) => {
// //       if (err) {
// //         console.error("Error downloading file:", err);
// //         res.status(500).json({ message: "Error downloading checklist file" });
// //       }
// //     });
// //   } catch (error) {
// //     console.error("Error downloading equipment DN checklist:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const updateTripInEquipmentDN = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { trip_id } = req.params;
// //     const {
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       recovery_vehicle_number,
// //       chargeable_type,
// //       trip_date,
// //       equipment,
// //       remarks,
// //     } = req.body;

// //     const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
// //       include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
// //       transaction,
// //     });

// //     if (!trip) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Trip not found" });
// //     }

// //     if (trip.deliveryNote.status !== "Creation") {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: `Cannot edit trip — delivery note is in '${trip.deliveryNote.status}' status`,
// //       });
// //     }

// //     await trip.update(
// //       {
// //         transportation_company,
// //         driver_name,
// //         driver_contact,
// //         vehicle_type: vehicle_type || null,
// //         vehicle_number: vehicle_number || null,
// //         recovery_vehicle_number: recovery_vehicle_number || null,
// //         chargeable_type: chargeable_type || null,
// //         trip_date: trip_date || null,
// //         remarks: remarks || null,
// //       },
// //       { transaction }
// //     );

// //     // Replace equipment resources
// //     if (equipment !== undefined) {
// //       await EquipmentDNEquipmentModel.destroy({
// //         where: { trip_id },
// //         transaction,
// //       });

// //       if (equipment.length > 0) {
// //         for (const equip of equipment) {
// //           await EquipmentDNEquipmentModel.create(
// //             {
// //               equipment_dn_id: trip.equipment_dn_id,
// //               trip_id,
// //               serial_number: equip.serial_number,
// //               reg_number: equip.reg_number,
// //               equipment_type: equip.equipment_type || null,
// //             },
// //             { transaction }
// //           );
// //         }
// //       }
// //     }

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Trip updated successfully",
// //       trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
// //         include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
// //       }),
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error updating trip in equipment DN:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // module.exports = {
// //   getAllEquipmentTagNumbers,
// //   getEquipmentSwapReasons,
// //   createEquipmentSwap,
// //   getEquipmentSwapById,
// //   createEquipmentDeliveryNote,
// //   createEquipmentOffHireNote,
// //   getEquipmentDeliveryNoteSummary,
// //   getEquipmentOffHireNoteSummary,
// //   generateEquipmentDeliveryNotePDF,
// //   generateEquipmentOffHireNotePDF,
// //   uploadEquipmentDeliveryNote,
// //   uploadEquipmentOffHireNote,
// //   addTripToEquipmentDeliveryNote,
// //   addTripToEquipmentOffHireNote,
// //   submitEquipmentSwapRequest,
// //   returnEquipmentSwapRequest,
// //   approveEquipmentSwap,
// //   rejectEquipmentSwap,
// //   getSwapRequestCounts,
// //   getLatestEquipmentDeliveryNote,
// //   getEquipmentDeliveryNoteById,
// //   submitEquipmentDNForApproval,
// //   approveEquipmentDeliveryNote,
// //   rejectEquipmentDeliveryNote,
// //   generateEquipmentDNPDF,
// //   closeEquipmentDeliveryNote,
// //   deleteTripFromEquipmentDN,
// //   uploadEquipmentDNChecklist,
// //   downloadEquipmentDNChecklist,
// //   updateTripInEquipmentDN,
// // };

// // controllers/fleet-management/equipmentSwapController.js (Enhanced with all Off-Hire functions)

// const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
// const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
// const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// const {
//   EquipmentDeliveryNoteModel,
//   EquipmentDeliveryNoteTripModel,
//   EquipmentDNEquipmentModel,
// } = require("../../models/fleet-management/EquipmentDeliveryNoteModel");
// const {
//   EquipmentOffHireNoteModel,
//   EquipmentOffHireNoteTripModel,
//   EquipmentOHNEquipmentModel,
// } = require("../../models/fleet-management/EquipmentOffHireNoteModel");
// const sequelize = require("../../config/dbSync");
// const { Op } = require("sequelize");
// const UsersModel = require("../../models/user-security-management/UsersModel");
// const SwapReasonModel = require("../../models/fleet-management/swapReasonModel");
// const path = require("path");
// const fs = require("fs");
// const PDFDocument = require("pdfkit");

// const generateEquipmentDNNumber = async () => {
//   const currentYear = new Date().getFullYear();
//   const prefix = `EQ-DN-${currentYear}-`;

//   const lastDN = await EquipmentDeliveryNoteModel.findOne({
//     where: { dn_number: { [Op.like]: `${prefix}%` } },
//     order: [["dn_number", "DESC"]],
//   });

//   let nextNumber = 1;
//   if (lastDN) {
//     const parts = lastDN.dn_number.split("-");
//     const lastNumber = parseInt(parts[parts.length - 1]);
//     if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
//   }

//   return `${prefix}${String(nextNumber).padStart(4, "0")}`;
// };

// const generateEquipmentOHNNumber = async () => {
//   const currentYear = new Date().getFullYear();
//   const prefix = `EQ-OH-${currentYear}-`;

//   const lastOHN = await EquipmentOffHireNoteModel.findOne({
//     where: { ohn_number: { [Op.like]: `${prefix}%` } },
//     order: [["ohn_number", "DESC"]],
//   });

//   let nextNumber = 1;
//   if (lastOHN) {
//     const parts = lastOHN.ohn_number.split("-");
//     const lastNumber = parseInt(parts[parts.length - 1]);
//     if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
//   }

//   return `${prefix}${String(nextNumber).padStart(4, "0")}`;
// };

// const getUsername = async (req) => {
//   try {
//     if (req.user?.uid) {
//       const user = await UsersModel.findByPk(req.user.uid);
//       if (user) return user.username;
//     }
//     return req.user?.username || "System";
//   } catch {
//     return "System";
//   }
// };

// // Get all equipment tag numbers for dropdown
// const getAllEquipmentTagNumbers = async (req, res) => {
//   try {
//     const equipment = await EquipmentModel.findAll({
//       where: { status: "Active" },
//       attributes: ["serial_number", "reg_number", "vehicle_type"],
//       order: [["reg_number", "ASC"]],
//     });

//     res.status(200).json({
//       success: true,
//       equipment: equipment.map((eq) => ({
//         serial_number: eq.serial_number,
//         reg_number: eq.reg_number,
//         vehicle_type: eq.vehicle_type,
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching equipment:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getEquipmentSwapReasons = async (req, res) => {
//   try {
//     const swapReasons = await SwapReasonModel.findAll({
//       where: {
//         category: "Equipment",
//         status: "Active",
//       },
//       attributes: ["swap_reason_id", "swap_reason_name"],
//       order: [["swap_reason_name", "ASC"]],
//     });

//     res.status(200).json({
//       success: true,
//       swapReasons: swapReasons.map((reason) => ({
//         swap_reason_id: reason.swap_reason_id,
//         swap_reason_name: reason.swap_reason_name,
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching equipment swap reasons:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ─── Helper: generate a human-readable group ID ────────────────────────────
// // Format: EQ-YYYYMMDD-XXXX  (e.g. EQ-20260224-A3F9)
// const generateSwapGroupId = (prefix = "EQ") => {
//   const now = new Date();
//   const datePart = now
//     .toISOString()
//     .slice(0, 10)
//     .replace(/-/g, ""); // "20260224"
//   const randomPart = Math.random()
//     .toString(36)
//     .toUpperCase()
//     .slice(2, 6); // 4 random alphanumeric chars
//   return `${prefix}-${datePart}-${randomPart}`;
// };
// // ───────────────────────────────────────────────────────────────────────────

// const createEquipmentSwap = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       sales_order_id,
//       allocation_id,
//       previous_plate_no,
//       new_plate_no,
//       swap_date,
//       swap_reason,
//       swap_estimated_recovery_cost,
//       swap_mobilization_trips,
//       swap_demobilization_trips,
//       swap_remark,
//     } = req.body;

//     // Validate required fields
//     if (
//       !sales_order_id ||
//       !previous_plate_no ||
//       !new_plate_no ||
//       !swap_date ||
//       !swap_reason
//     ) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "All required fields must be filled",
//       });
//     }

//     // Check if new plate number exists in equipment table
//     const existingEquipment = await EquipmentModel.findOne({
//       where: { reg_number: new_plate_no, status: "Active" },
//     });

//     if (!existingEquipment) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "New plate number does not exist in equipment table",
//       });
//     }

//     // Get sales order
//     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
//     if (!salesOrder) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Sales order not found" });
//     }

//     // Get previous equipment details
//     const previousEquipment = await EquipmentModel.findOne({
//       where: { reg_number: previous_plate_no },
//     });

//     if (!previousEquipment) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Previous equipment not found" });
//     }

//     // Get logged in user
//     let username = "System";
//     if (req.user?.uid) {
//       const user = await UsersModel.findByPk(req.user.uid);
//       if (user) {
//         username = user.username;
//       }
//     }

//     // ✅ Generate one shared group ID for both records of this swap operation
//     const swapGroupId = generateSwapGroupId("EQ");

//     // CREATE RECORD 1: OFF_HIRE — for the existing/outgoing equipment
//     const offHireSwap = await EquipmentSwapModel.create(
//       {
//         swap_group_id: swapGroupId,
//         sales_order_id,
//         allocation_id: allocation_id || null,
//         previous_equipment_serial: previousEquipment.serial_number,
//         previous_plate_no,
//         new_equipment_serial: null,
//         new_plate_no: null,
//         swap_date,
//         swap_reason,
//         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
//         swap_mobilization_trips: null,
//         swap_demobilization_trips: swap_demobilization_trips || null,
//         swap_remark: swap_remark || null,
//         delivery_note_status: "Pending",
//         off_hire_note_status: "Pending",
//         overall_status: "Creation",
//         swap_type: "OFF_HIRE",
//         created_by: username,
//       },
//       { transaction }
//     );

//     // CREATE RECORD 2: DELIVERY — for the new/incoming equipment
//     const deliverySwap = await EquipmentSwapModel.create(
//       {
//         swap_group_id: swapGroupId,
//         sales_order_id,
//         allocation_id: allocation_id || null,
//         previous_equipment_serial: null,
//         previous_plate_no: null,
//         new_equipment_serial: existingEquipment.serial_number,
//         new_plate_no,
//         swap_date,
//         swap_reason,
//         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
//         swap_mobilization_trips: swap_mobilization_trips || null,
//         swap_demobilization_trips: null,
//         swap_remark: swap_remark || null,
//         delivery_note_status: "Pending",
//         off_hire_note_status: "Pending",
//         overall_status: "Creation",
//         swap_type: "DELIVERY",
//         created_by: username,
//       },
//       { transaction }
//     );

//     await salesOrder.update(
//       { has_pending_swap_request: true },
//       { transaction }
//     );

//     // Update allocation equipment if allocation_id exists
//     if (allocation_id) {
//       const ActiveAllocationEquipmentModel =
//         require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationEquipmentModel;

//       await ActiveAllocationEquipmentModel.update(
//         {
//           serial_number: existingEquipment.serial_number,
//           updated_at: new Date(),
//         },
//         {
//           where: {
//             allocation_id: allocation_id,
//             serial_number: previousEquipment.serial_number,
//           },
//           transaction,
//         }
//       );
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Equipment swap records created successfully",
//       equipmentSwap: deliverySwap,
//       offHireSwap,
//       deliverySwap,
//       swap_group_id: swapGroupId,
//       summary: {
//         swap_group_id: swapGroupId,
//         off_hire_plate: previous_plate_no,
//         delivery_plate: new_plate_no,
//         swap_date,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating equipment swap:", error);
//     res.status(500).json({
//       message: "Error creating equipment swap",
//       error: error.message,
//     });
//   }
// };

// // Get equipment swap by ID with details
// const getEquipmentSwapById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const equipmentSwap = await EquipmentSwapModel.findByPk(id, {
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//         {
//           model: EquipmentModel,
//           as: "previousEquipment",
//           attributes: ["serial_number", "reg_number", "vehicle_type"],
//         },
//         {
//           model: EquipmentModel,
//           as: "newEquipment",
//           attributes: ["serial_number", "reg_number", "vehicle_type"],
//         },
//         {
//           model: EquipmentDeliveryNoteModel,
//           as: "deliveryNotes",
//           include: [
//             {
//               model: EquipmentDeliveryNoteTripModel,
//               as: "trips",
//               include: [
//                 {
//                   model: EquipmentDNEquipmentModel,
//                   as: "equipment",
//                 },
//               ],
//             },
//           ],
//           order: [["created_at", "DESC"]],
//         },
//         {
//           model: EquipmentOffHireNoteModel,
//           as: "offHireNotes",
//           include: [
//             {
//               model: EquipmentOffHireNoteTripModel,
//               as: "trips",
//               include: [
//                 {
//                   model: EquipmentOHNEquipmentModel,
//                   as: "equipment",
//                 },
//               ],
//             },
//           ],
//           order: [["created_at", "DESC"]],
//         },
//       ],
//     });

//     if (!equipmentSwap) {
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     res.status(200).json({
//       equipmentSwap,
//     });
//   } catch (error) {
//     console.error("Error fetching equipment swap:", error);
//     res.status(500).json({
//       message: "Error fetching equipment swap",
//       error: error.message,
//     });
//   }
// };

// // Get swap request counts for notification badge
// const getSwapRequestCounts = async (req, res) => {
//   try {
//     const { sales_order_id } = req.query;

//     const where = {
//       swap_status: {
//         [Op.in]: ["Swap Request", "Resubmit"],
//       },
//     };

//     if (sales_order_id) {
//       where.sales_order_id = sales_order_id;
//     }

//     const equipmentCount = await EquipmentSwapModel.count({ where });

//     res.status(200).json({
//       success: true,
//       equipmentSwapCount: equipmentCount,
//       totalSwapCount: equipmentCount,
//     });
//   } catch (error) {
//     console.error("Error fetching swap request counts:", error);
//     res.status(500).json({
//       message: "Error fetching swap request counts",
//       error: error.message,
//     });
//   }
// };

// // ==================== DELIVERY NOTE FUNCTIONS ====================

// const createEquipmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_swap_id } = req.params;
//     const { delivery_date, remarks, trips } = req.body;

//     // Get equipment swap
//     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
//       include: [
//         {
//           model: EquipmentModel,
//           as: "newEquipment",
//           attributes: ["serial_number", "reg_number"],
//         },
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//       ],
//     });

//     if (!equipmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     // Generate DN number
//     const dn_number = await generateEquipmentDNNumber();

//     // Get logged in user
//     let username = await getUsername(req);

//     // Create delivery note
//     const deliveryNote = await EquipmentDeliveryNoteModel.create(
//       {
//         equipment_swap_id,
//         dn_number,
//         new_equipment_serial: equipmentSwap.new_equipment_serial,
//         new_plate_no: equipmentSwap.new_plate_no,
//         delivery_date,
//         status: "Creation",
//         remarks,
//         created_by: username,
//       },
//       { transaction }
//     );

//     // Create trips if provided
//     if (trips && trips.length > 0) {
//       for (const trip of trips) {
//         const newTrip = await EquipmentDeliveryNoteTripModel.create(
//           {
//             equipment_dn_id: deliveryNote.equipment_dn_id,
//             trip_number: trip.trip_number,
//             transportation_company: trip.transportation_company,
//             driver_name: trip.driver_name,
//             driver_contact: trip.driver_contact,
//             vehicle_type: trip.vehicle_type || null,
//             vehicle_number: trip.vehicle_number || null,
//             recovery_vehicle_number: trip.recovery_vehicle_number || null,
//             chargeable_type: trip.chargeable_type || null,
//             trip_date: trip.trip_date || null,
//             trip_status: "Creation",
//             remarks: trip.remarks || null,
//           },
//           { transaction }
//         );

//         // Add equipment resources to this trip
//         if (trip.equipment && trip.equipment.length > 0) {
//           for (const equip of trip.equipment) {
//             await EquipmentDNEquipmentModel.create(
//               {
//                 equipment_dn_id: deliveryNote.equipment_dn_id,
//                 trip_id: newTrip.trip_id,
//                 serial_number: equip.serial_number,
//                 reg_number: equip.reg_number,
//                 equipment_type: equip.equipment_type || null,
//               },
//               { transaction }
//             );
//           }
//         }
//       }
//     }

//     // Update swap status based on group logic
//     await updateSwapStatusAfterNoteCreation(
//       equipmentSwap,
//       "DELIVERY",
//       deliveryNote.equipment_dn_id,
//       transaction
//     );

//     await transaction.commit();

//     // Fetch created delivery note with trips
//     const createdDeliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       deliveryNote.equipment_dn_id,
//       {
//         include: [
//           {
//             model: EquipmentDeliveryNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: EquipmentDNEquipmentModel,
//                 as: "equipment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//               },
//             ],
//           },
//         ],
//       }
//     );

//     res.status(201).json({
//       message: "Equipment delivery note created successfully",
//       deliveryNote: createdDeliveryNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating equipment delivery note:", error);
//     res.status(500).json({
//       message: "Error creating equipment delivery note",
//       error: error.message,
//     });
//   }
// };

// // ==================== OFF-HIRE NOTE FUNCTIONS (Enhanced) ====================

// /**
//  * Create equipment off hire note with trips and equipment resources
//  */
// const createEquipmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_swap_id } = req.params;
//     const { off_hire_date, remarks, trips } = req.body;

//     // Get equipment swap
//     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
//       include: [
//         {
//           model: EquipmentModel,
//           as: "previousEquipment",
//           attributes: ["serial_number", "reg_number"],
//         },
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//       ],
//     });

//     if (!equipmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     // Generate OHN number
//     const ohn_number = await generateEquipmentOHNNumber();

//     // Get logged in user
//     let username = await getUsername(req);

//     // Create off hire note
//     const offHireNote = await EquipmentOffHireNoteModel.create(
//       {
//         equipment_swap_id,
//         ohn_number,
//         previous_equipment_serial: equipmentSwap.previous_equipment_serial,
//         previous_plate_no: equipmentSwap.previous_plate_no,
//         off_hire_date,
//         status: "Creation",
//         remarks,
//         created_by: username,
//       },
//       { transaction }
//     );

//     // Create trips if provided
//     if (trips && trips.length > 0) {
//       for (const trip of trips) {
//         const newTrip = await EquipmentOffHireNoteTripModel.create(
//           {
//             equipment_ohn_id: offHireNote.equipment_ohn_id,
//             trip_number: trip.trip_number,
//             transportation_company: trip.transportation_company,
//             driver_name: trip.driver_name,
//             driver_contact: trip.driver_contact,
//             vehicle_type: trip.vehicle_type || null,
//             vehicle_number: trip.vehicle_number || null,
//             recovery_vehicle_number: trip.recovery_vehicle_number || null,
//             chargeable_type: trip.chargeable_type || null,
//             trip_date: trip.trip_date || null,
//             trip_status: "Creation",
//             remarks: trip.remarks || null,
//           },
//           { transaction }
//         );

//         // Add equipment resources to this trip
//         if (trip.equipment && trip.equipment.length > 0) {
//           for (const equip of trip.equipment) {
//             await EquipmentOHNEquipmentModel.create(
//               {
//                 equipment_ohn_id: offHireNote.equipment_ohn_id,
//                 trip_id: newTrip.trip_id,
//                 serial_number: equip.serial_number,
//                 reg_number: equip.reg_number,
//                 equipment_type: equip.equipment_type || null,
//               },
//               { transaction }
//             );
//           }
//         }
//       }
//     }

//     // Update swap status based on group logic
//     await updateSwapStatusAfterNoteCreation(
//       equipmentSwap,
//       "OFF_HIRE",
//       offHireNote.equipment_ohn_id,
//       transaction
//     );

//     await transaction.commit();

//     // Fetch created off hire note with trips
//     const createdOffHireNote = await EquipmentOffHireNoteModel.findByPk(
//       offHireNote.equipment_ohn_id,
//       {
//         include: [
//           {
//             model: EquipmentOffHireNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: EquipmentOHNEquipmentModel,
//                 as: "equipment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//               },
//             ],
//           },
//         ],
//       }
//     );

//     res.status(201).json({
//       message: "Equipment off hire note created successfully",
//       offHireNote: createdOffHireNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating equipment off hire note:", error);
//     res.status(500).json({
//       message: "Error creating equipment off hire note",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Helper function to update swap status after note creation
//  */
// const updateSwapStatusAfterNoteCreation = async (equipmentSwap, noteType, noteId, transaction) => {
//   try {
//     if (!equipmentSwap.swap_group_id) {
//       // No group ID - simple update
//       const updateData = {};
//       if (noteType === "DELIVERY") {
//         updateData.delivery_note_status = "In Progress";
//       } else {
//         updateData.off_hire_note_status = "In Progress";
//       }
//       updateData.overall_status = "In progress";

//       await EquipmentSwapModel.update(updateData, {
//         where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
//         transaction,
//       });
//       return;
//     }

//     // Get all swaps in the same group
//     const groupSwaps = await EquipmentSwapModel.findAll({
//       where: {
//         swap_group_id: equipmentSwap.swap_group_id,
//       },
//       transaction,
//     });

//     const currentSwap = groupSwaps.find(
//       (s) => s.equipment_swap_id === equipmentSwap.equipment_swap_id
//     );

//     if (!currentSwap) return;

//     // Find the partner swap (opposite type)
//     const partnerSwap = groupSwaps.find(
//       (s) => s.swap_type !== currentSwap.swap_type
//     );

//     if (!partnerSwap) {
//       // No partner - just update this one
//       const updateData = {};
//       if (noteType === "DELIVERY") {
//         updateData.delivery_note_status = "In Progress";
//       } else {
//         updateData.off_hire_note_status = "In Progress";
//       }
//       updateData.overall_status = "In progress";

//       await EquipmentSwapModel.update(updateData, {
//         where: { equipment_swap_id: currentSwap.equipment_swap_id },
//         transaction,
//       });
//       return;
//     }

//     // Check if partner already has a note
//     let partnerHasNote = false;
//     if (partnerSwap.swap_type === "DELIVERY") {
//       const partnerNote = await EquipmentDeliveryNoteModel.findOne({
//         where: { equipment_swap_id: partnerSwap.equipment_swap_id },
//         transaction,
//       });
//       partnerHasNote = !!partnerNote;
//     } else {
//       const partnerNote = await EquipmentOffHireNoteModel.findOne({
//         where: { equipment_swap_id: partnerSwap.equipment_swap_id },
//         transaction,
//       });
//       partnerHasNote = !!partnerNote;
//     }

//     // Update current swap
//     const currentUpdate = {};
//     if (noteType === "DELIVERY") {
//       currentUpdate.delivery_note_status = "In Progress";
//     } else {
//       currentUpdate.off_hire_note_status = "In Progress";
//     }

//     if (partnerHasNote) {
//       // Both notes exist - mark both as Completed
//       currentUpdate.overall_status = "Completed";

//       // Update partner as Completed
//       const partnerUpdate = { overall_status: "Completed" };
//       await EquipmentSwapModel.update(partnerUpdate, {
//         where: { equipment_swap_id: partnerSwap.equipment_swap_id },
//         transaction,
//       });
//     } else {
//       // Only this note exists - mark as Partially completed
//       currentUpdate.overall_status = "Partially completed";
//     }

//     await EquipmentSwapModel.update(currentUpdate, {
//       where: { equipment_swap_id: currentSwap.equipment_swap_id },
//       transaction,
//     });

//   } catch (error) {
//     console.error("Error updating swap status:", error);
//     throw error;
//   }
// };

// // ==================== GET FUNCTIONS ====================

// /**
//  * Get equipment delivery note by ID with trips and equipment
//  */
// const getEquipmentDeliveryNoteById = async (req, res) => {
//   try {
//     const { equipment_dn_id } = req.params;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       {
//         include: [
//           {
//             model: EquipmentDeliveryNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: EquipmentDNEquipmentModel,
//                 as: "equipment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               { model: SalesOrdersModel, as: "salesOrder" },
//               {
//                 model: EquipmentModel,
//                 as: "newEquipment",
//                 attributes: ["serial_number", "reg_number", "vehicle_type"],
//               },
//             ],
//           },
//         ],
//       }
//     );

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     res.status(200).json({ deliveryNote });
//   } catch (error) {
//     console.error("Error fetching equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get equipment off hire note by ID with trips and equipment
//  */
// const getEquipmentOffHireNoteById = async (req, res) => {
//   try {
//     const { equipment_ohn_id } = req.params;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       {
//         include: [
//           {
//             model: EquipmentOffHireNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: EquipmentOHNEquipmentModel,
//                 as: "equipment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               { model: SalesOrdersModel, as: "salesOrder" },
//               {
//                 model: EquipmentModel,
//                 as: "previousEquipment",
//                 attributes: ["serial_number", "reg_number", "vehicle_type"],
//               },
//             ],
//           },
//         ],
//       }
//     );

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     res.status(200).json({ offHireNote });
//   } catch (error) {
//     console.error("Error fetching equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get latest equipment delivery note for a swap
//  */
// const getLatestEquipmentDeliveryNote = async (req, res) => {
//   try {
//     const { equipment_swap_id } = req.params;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findOne({
//       where: { equipment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: EquipmentDeliveryNoteTripModel,
//           as: "trips",
//           include: [
//             {
//               model: EquipmentDNEquipmentModel,
//               as: "equipment",
//             },
//           ],
//           order: [["trip_number", "ASC"]],
//         },
//         {
//           model: EquipmentSwapModel,
//           as: "equipmentSwap",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: EquipmentModel,
//               as: "newEquipment",
//               attributes: ["serial_number", "reg_number", "vehicle_type"],
//             },
//           ],
//         },
//       ],
//     });

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "No delivery note found" });
//     }

//     res.status(200).json({ deliveryNote });
//   } catch (error) {
//     console.error("Error fetching latest equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get latest equipment off hire note for a swap
//  */
// const getLatestEquipmentOffHireNote = async (req, res) => {
//   try {
//     const { equipment_swap_id } = req.params;

//     const offHireNote = await EquipmentOffHireNoteModel.findOne({
//       where: { equipment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: EquipmentOffHireNoteTripModel,
//           as: "trips",
//           include: [
//             {
//               model: EquipmentOHNEquipmentModel,
//               as: "equipment",
//             },
//           ],
//           order: [["trip_number", "ASC"]],
//         },
//         {
//           model: EquipmentSwapModel,
//           as: "equipmentSwap",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: EquipmentModel,
//               as: "previousEquipment",
//               attributes: ["serial_number", "reg_number", "vehicle_type"],
//             },
//           ],
//         },
//       ],
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "No off hire note found" });
//     }

//     res.status(200).json({ offHireNote });
//   } catch (error) {
//     console.error("Error fetching latest equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get equipment delivery note summary
//  */
// const getEquipmentDeliveryNoteSummary = async (req, res) => {
//   try {
//     const { equipment_dn_id } = req.params;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       {
//         include: [
//           {
//             model: EquipmentDeliveryNoteTripModel,
//             as: "trips",
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//                 attributes: ["so_number", "client", "project_name"],
//               },
//               {
//                 model: EquipmentModel,
//                 as: "newEquipment",
//                 attributes: ["serial_number", "reg_number", "vehicle_type"],
//               },
//             ],
//           },
//         ],
//       }
//     );

//     if (!deliveryNote) {
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     // Format summary data
//     const summaryData = {
//       dn_number: deliveryNote.dn_number,
//       equipment: deliveryNote.equipmentSwap.newEquipment,
//       delivery_date: deliveryNote.delivery_date,
//       status: deliveryNote.status,
//       trips: deliveryNote.trips.map((trip) => ({
//         trip_number: trip.trip_number,
//         transportation: {
//           company: trip.transportation_company,
//           driver: trip.driver_name,
//           contact: trip.driver_contact,
//           vehicle: trip.vehicle_number,
//         },
//         trip_date: trip.trip_date,
//         trip_status: trip.trip_status,
//         remarks: trip.remarks,
//       })),
//     };

//     res.status(200).json({
//       success: true,
//       summary: summaryData,
//     });
//   } catch (error) {
//     console.error("Error fetching delivery note summary:", error);
//     res.status(500).json({
//       message: "Error fetching delivery note summary",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Get equipment off hire note summary
//  */
// const getEquipmentOffHireNoteSummary = async (req, res) => {
//   try {
//     const { equipment_ohn_id } = req.params;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       {
//         include: [
//           {
//             model: EquipmentOffHireNoteTripModel,
//             as: "trips",
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//                 attributes: ["so_number", "client", "project_name"],
//               },
//               {
//                 model: EquipmentModel,
//                 as: "previousEquipment",
//                 attributes: ["serial_number", "reg_number", "vehicle_type"],
//               },
//             ],
//           },
//         ],
//       }
//     );

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     // Format summary data
//     const summaryData = {
//       ohn_number: offHireNote.ohn_number,
//       equipment: offHireNote.equipmentSwap.previousEquipment,
//       off_hire_date: offHireNote.off_hire_date,
//       status: offHireNote.status,
//       trips: offHireNote.trips.map((trip) => ({
//         trip_number: trip.trip_number,
//         transportation: {
//           company: trip.transportation_company,
//           driver: trip.driver_name,
//           contact: trip.driver_contact,
//           vehicle: trip.vehicle_number,
//         },
//         trip_date: trip.trip_date,
//         trip_status: trip.trip_status,
//         remarks: trip.remarks,
//       })),
//     };

//     res.status(200).json({
//       success: true,
//       summary: summaryData,
//     });
//   } catch (error) {
//     console.error("Error fetching off hire note summary:", error);
//     res.status(500).json({
//       message: "Error fetching off hire note summary",
//       error: error.message,
//     });
//   }
// };

// // ==================== STATUS MANAGEMENT FUNCTIONS ====================

// /**
//  * Submit equipment delivery note for approval
//  */
// const submitEquipmentDNForApproval = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Can only submit delivery notes in 'Creation' status",
//       });
//     }

//     await deliveryNote.update({ status: "Under Approval" }, { transaction });

//     await transaction.commit();

//     res.status(200).json({
//       message: "Submitted for approval successfully",
//       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting equipment DN for approval:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Submit equipment off hire note for approval
//  */
// const submitEquipmentOHNForApproval = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Can only submit off hire notes in 'Creation' status",
//       });
//     }

//     await offHireNote.update({ status: "Under Approval" }, { transaction });

//     await transaction.commit();

//     res.status(200).json({
//       message: "Submitted for approval successfully",
//       offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting equipment OHN for approval:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Approve equipment delivery note
//  */
// const approveEquipmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;
//     const username = await getUsername(req);

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Delivery note must be 'Under Approval' to approve",
//       });
//     }

//     await deliveryNote.update(
//       {
//         status: "Approved",
//         approved_by: username,
//         approved_at: new Date(),
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Delivery note approved successfully",
//       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Approve equipment off hire note
//  */
// const approveEquipmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;
//     const username = await getUsername(req);

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Off hire note must be 'Under Approval' to approve",
//       });
//     }

//     await offHireNote.update(
//       {
//         status: "Approved",
//         approved_by: username,
//         approved_at: new Date(),
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Off hire note approved successfully",
//       offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Reject equipment delivery note
//  */
// const rejectEquipmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;
//     const { reason } = req.body;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Delivery note must be 'Under Approval' to reject",
//       });
//     }

//     await deliveryNote.update(
//       {
//         status: "Rejected",
//         remarks: reason ? `Rejected: ${reason}` : deliveryNote.remarks,
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Delivery note rejected successfully",
//       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Reject equipment off hire note
//  */
// const rejectEquipmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;
//     const { reason } = req.body;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Under Approval") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Off hire note must be 'Under Approval' to reject",
//       });
//     }

//     await offHireNote.update(
//       {
//         status: "Rejected",
//         remarks: reason ? `Rejected: ${reason}` : offHireNote.remarks,
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Off hire note rejected successfully",
//       offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Generate equipment delivery note PDF data (for frontend)
//  */
// const generateEquipmentDNPDF = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       {
//         include: [
//           {
//             model: EquipmentDeliveryNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: EquipmentDNEquipmentModel,
//                 as: "equipment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//                 attributes: [
//                   "so_number",
//                   "client",
//                   "project_name",
//                   "lpo_number",
//                 ],
//               },
//               {
//                 model: EquipmentModel,
//                 as: "newEquipment",
//                 attributes: [
//                   "serial_number",
//                   "reg_number",
//                   "vehicle_type",
//                   "description",
//                 ],
//               },
//             ],
//           },
//         ],
//         transaction,
//       }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status === "Approved") {
//       await deliveryNote.update({ status: "In Progress" }, { transaction });
//     }

//     await transaction.commit();

//     // Return data for frontend-side PDF generation
//     res.status(200).json({
//       success: true,
//       data: deliveryNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error generating equipment DN PDF:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Generate equipment off hire note PDF data (for frontend)
//  */
// const generateEquipmentOHNPDF = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       {
//         include: [
//           {
//             model: EquipmentOffHireNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: EquipmentOHNEquipmentModel,
//                 as: "equipment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//                 attributes: [
//                   "so_number",
//                   "client",
//                   "project_name",
//                   "lpo_number",
//                 ],
//               },
//               {
//                 model: EquipmentModel,
//                 as: "previousEquipment",
//                 attributes: [
//                   "serial_number",
//                   "reg_number",
//                   "vehicle_type",
//                   "description",
//                 ],
//               },
//             ],
//           },
//         ],
//         transaction,
//       }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status === "Approved") {
//       await offHireNote.update({ status: "In Progress" }, { transaction });
//     }

//     await transaction.commit();

//     // Return data for frontend-side PDF generation
//     res.status(200).json({
//       success: true,
//       data: offHireNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error generating equipment OHN PDF:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Close equipment delivery note
//  */
// const closeEquipmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Completed") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Only completed delivery notes can be closed",
//       });
//     }

//     await deliveryNote.update({ status: "Close" }, { transaction });
//     await transaction.commit();

//     res.status(200).json({
//       message: "Delivery note closed successfully",
//       deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error closing equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Close equipment off hire note
//  */
// const closeEquipmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Completed") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Only completed off hire notes can be closed",
//       });
//     }

//     await offHireNote.update({ status: "Close" }, { transaction });
//     await transaction.commit();

//     res.status(200).json({
//       message: "Off hire note closed successfully",
//       offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error closing equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== TRIP MANAGEMENT FUNCTIONS ====================

// /**
//  * Add trip to equipment delivery note
//  */
// const addTripToEquipmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       equipment,
//       remarks,
//     } = req.body;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be added when delivery note is in Creation status",
//       });
//     }

//     const existingTrips = await EquipmentDeliveryNoteTripModel.findAll({
//       where: { equipment_dn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per delivery note" });
//     }

//     const newTrip = await EquipmentDeliveryNoteTripModel.create(
//       {
//         equipment_dn_id,
//         trip_number: existingTrips.length + 1,
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date || null,
//         trip_status: "Creation",
//         remarks: remarks || null,
//       },
//       { transaction }
//     );

//     // Add equipment resources
//     if (equipment && equipment.length > 0) {
//       for (const equip of equipment) {
//         await EquipmentDNEquipmentModel.create(
//           {
//             equipment_dn_id,
//             trip_id: newTrip.trip_id,
//             serial_number: equip.serial_number,
//             reg_number: equip.reg_number,
//             equipment_type: equip.equipment_type || null,
//           },
//           { transaction }
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await EquipmentDeliveryNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Add trip to equipment off hire note
//  */
// const addTripToEquipmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       equipment,
//       remarks,
//     } = req.body;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be added when off hire note is in Creation status",
//       });
//     }

//     const existingTrips = await EquipmentOffHireNoteTripModel.findAll({
//       where: { equipment_ohn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per off hire note" });
//     }

//     const newTrip = await EquipmentOffHireNoteTripModel.create(
//       {
//         equipment_ohn_id,
//         trip_number: existingTrips.length + 1,
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date || null,
//         trip_status: "Creation",
//         remarks: remarks || null,
//       },
//       { transaction }
//     );

//     // Add equipment resources
//     if (equipment && equipment.length > 0) {
//       for (const equip of equipment) {
//         await EquipmentOHNEquipmentModel.create(
//           {
//             equipment_ohn_id,
//             trip_id: newTrip.trip_id,
//             serial_number: equip.serial_number,
//             reg_number: equip.reg_number,
//             equipment_type: equip.equipment_type || null,
//           },
//           { transaction }
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await EquipmentOffHireNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Update trip in equipment delivery note
//  */
// const updateTripInEquipmentDN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       equipment,
//       remarks,
//     } = req.body;

//     const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
//       include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: `Cannot edit trip — delivery note is in '${trip.deliveryNote.status}' status`,
//       });
//     }

//     await trip.update(
//       {
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date || null,
//         remarks: remarks || null,
//       },
//       { transaction }
//     );

//     // Replace equipment resources
//     if (equipment !== undefined) {
//       await EquipmentDNEquipmentModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (equipment.length > 0) {
//         for (const equip of equipment) {
//           await EquipmentDNEquipmentModel.create(
//             {
//               equipment_dn_id: trip.equipment_dn_id,
//               trip_id,
//               serial_number: equip.serial_number,
//               reg_number: equip.reg_number,
//               equipment_type: equip.equipment_type || null,
//             },
//             { transaction }
//           );
//         }
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
//         include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip in equipment DN:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Update trip in equipment off hire note
//  */
// const updateTripInEquipmentOHN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       equipment,
//       remarks,
//     } = req.body;

//     const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
//       include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: `Cannot edit trip — off hire note is in '${trip.offHireNote.status}' status`,
//       });
//     }

//     await trip.update(
//       {
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date || null,
//         remarks: remarks || null,
//       },
//       { transaction }
//     );

//     // Replace equipment resources
//     if (equipment !== undefined) {
//       await EquipmentOHNEquipmentModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (equipment.length > 0) {
//         for (const equip of equipment) {
//           await EquipmentOHNEquipmentModel.create(
//             {
//               equipment_ohn_id: trip.equipment_ohn_id,
//               trip_id,
//               serial_number: equip.serial_number,
//               reg_number: equip.reg_number,
//               equipment_type: equip.equipment_type || null,
//             },
//             { transaction }
//           );
//         }
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip: await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
//         include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip in equipment OHN:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Delete trip from equipment delivery note
//  */
// const deleteTripFromEquipmentDN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;

//     const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
//       include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.deliveryNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be deleted when delivery note is in Creation status",
//       });
//     }

//     await trip.destroy({ transaction });
//     await transaction.commit();

//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Delete trip from equipment off hire note
//  */
// const deleteTripFromEquipmentOHN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;

//     const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
//       include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trips can only be deleted when off hire note is in Creation status",
//       });
//     }

//     await trip.destroy({ transaction });
//     await transaction.commit();

//     res.status(200).json({ message: "Trip deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== UPLOAD FUNCTIONS ====================

// /**
//  * Upload equipment delivery note attachment
//  */
// const uploadEquipmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;
//     const user = req.user;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileName = req.file.filename;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       { transaction }
//     );

//     if (!deliveryNote) {
//       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     await deliveryNote.update(
//       {
//         delivery_attachment: fileName,
//         status: "Completed",
//         uploaded_by: user?.username || "System",
//         uploaded_at: new Date(),
//       },
//       { transaction }
//     );

//     // Update equipment swap status
//     const equipmentSwap = await EquipmentSwapModel.findByPk(
//       deliveryNote.equipment_swap_id,
//       { transaction }
//     );

//     if (equipmentSwap) {
//       const updateData = {
//         delivery_note_status: "Completed",
//       };

//       // Check if partner is completed
//       if (equipmentSwap.swap_group_id) {
//         const partnerSwap = await EquipmentSwapModel.findOne({
//           where: {
//             swap_group_id: equipmentSwap.swap_group_id,
//             equipment_swap_id: { [Op.ne]: equipmentSwap.equipment_swap_id },
//           },
//           transaction,
//         });

//         if (partnerSwap && partnerSwap.off_hire_note_status === "Completed") {
//           updateData.overall_status = "Completed";
//         } else {
//           updateData.overall_status = "Partially completed";
//         }
//       } else {
//         updateData.overall_status = "In progress";
//       }

//       await equipmentSwap.update(updateData, { transaction });
//     }

//     await transaction.commit();

//     res.status(200).json({
//       success: true,
//       message: "Signed delivery note uploaded successfully",
//       fileName,
//       status: "Completed",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     console.error("Error uploading equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Upload equipment off hire note attachment
//  */
// const uploadEquipmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;
//     const user = req.user;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileName = req.file.filename;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       { transaction }
//     );

//     if (!offHireNote) {
//       if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     await offHireNote.update(
//       {
//         off_hire_attachment: fileName,
//         status: "Completed",
//         uploaded_by: user?.username || "System",
//         uploaded_at: new Date(),
//       },
//       { transaction }
//     );

//     // Update equipment swap status
//     const equipmentSwap = await EquipmentSwapModel.findByPk(
//       offHireNote.equipment_swap_id,
//       { transaction }
//     );

//     if (equipmentSwap) {
//       const updateData = {
//         off_hire_note_status: "Completed",
//       };

//       // Check if partner is completed
//       if (equipmentSwap.swap_group_id) {
//         const partnerSwap = await EquipmentSwapModel.findOne({
//           where: {
//             swap_group_id: equipmentSwap.swap_group_id,
//             equipment_swap_id: { [Op.ne]: equipmentSwap.equipment_swap_id },
//           },
//           transaction,
//         });

//         if (partnerSwap && partnerSwap.delivery_note_status === "Completed") {
//           updateData.overall_status = "Completed";
//         } else {
//           updateData.overall_status = "Partially completed";
//         }
//       } else {
//         updateData.overall_status = "In progress";
//       }

//       await equipmentSwap.update(updateData, { transaction });
//     }

//     await transaction.commit();

//     res.status(200).json({
//       success: true,
//       message: "Signed off hire note uploaded successfully",
//       fileName,
//       status: "Completed",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     console.error("Error uploading equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Upload equipment delivery note checklist
//  */
// const uploadEquipmentDNChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_id } = req.params;
//     const file = req.file;
//     const user = req.user;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const resource = await EquipmentDNEquipmentModel.findOne({
//       where: { id: resource_id, trip_id },
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: "Equipment resource not found in this trip" });
//     }

//     await EquipmentDNEquipmentModel.update(
//       {
//         checklist_file_path: file.path,
//         checklist_file_name: file.originalname,
//         checklist_uploaded_at: new Date(),
//         checklist_uploaded_by: user?.username || "System",
//       },
//       { where: { id: resource_id, trip_id }, transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Checklist uploaded successfully",
//       file: {
//         path: file.path,
//         name: file.originalname,
//         uploaded_at: new Date(),
//         uploaded_by: user?.username || "System",
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading equipment DN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Upload equipment off hire note checklist
//  */
// const uploadEquipmentOHNChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_id } = req.params;
//     const file = req.file;
//     const user = req.user;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const resource = await EquipmentOHNEquipmentModel.findOne({
//       where: { id: resource_id, trip_id },
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: "Equipment resource not found in this trip" });
//     }

//     await EquipmentOHNEquipmentModel.update(
//       {
//         checklist_file_path: file.path,
//         checklist_file_name: file.originalname,
//         checklist_uploaded_at: new Date(),
//         checklist_uploaded_by: user?.username || "System",
//       },
//       { where: { id: resource_id, trip_id }, transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Checklist uploaded successfully",
//       file: {
//         path: file.path,
//         name: file.originalname,
//         uploaded_at: new Date(),
//         uploaded_by: user?.username || "System",
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading equipment OHN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Download equipment delivery note checklist
//  */
// const downloadEquipmentDNChecklist = async (req, res) => {
//   try {
//     const { trip_id, resource_id } = req.params;

//     const resource = await EquipmentDNEquipmentModel.findOne({
//       where: { id: resource_id, trip_id },
//     });

//     if (!resource) {
//       return res.status(404).json({ message: "Equipment resource not found" });
//     }

//     if (!resource.checklist_file_path || !resource.checklist_file_name) {
//       return res
//         .status(404)
//         .json({ message: "No checklist found for this resource" });
//     }

//     if (!fs.existsSync(resource.checklist_file_path)) {
//       return res
//         .status(404)
//         .json({ message: "Checklist file not found on server" });
//     }

//     res.download(
//       resource.checklist_file_path,
//       resource.checklist_file_name,
//       (err) => {
//         if (err) {
//           console.error("Error downloading file:", err);
//           res
//             .status(500)
//             .json({ message: "Error downloading checklist file" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error downloading equipment DN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Download equipment off hire note checklist
//  */
// const downloadEquipmentOHNChecklist = async (req, res) => {
//   try {
//     const { trip_id, resource_id } = req.params;

//     const resource = await EquipmentOHNEquipmentModel.findOne({
//       where: { id: resource_id, trip_id },
//     });

//     if (!resource) {
//       return res.status(404).json({ message: "Equipment resource not found" });
//     }

//     if (!resource.checklist_file_path || !resource.checklist_file_name) {
//       return res
//         .status(404)
//         .json({ message: "No checklist found for this resource" });
//     }

//     if (!fs.existsSync(resource.checklist_file_path)) {
//       return res
//         .status(404)
//         .json({ message: "Checklist file not found on server" });
//     }

//     res.download(
//       resource.checklist_file_path,
//       resource.checklist_file_name,
//       (err) => {
//         if (err) {
//           console.error("Error downloading file:", err);
//           res
//             .status(500)
//             .json({ message: "Error downloading checklist file" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error downloading equipment OHN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== SWAP REQUEST MANAGEMENT ====================

// const submitEquipmentSwapRequest = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_swap_id } = req.params;
//     const { mobilization_charge, demobilization_charge } = req.body;

//     // Validate required fields
//     if (!mobilization_charge || !demobilization_charge) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Mobilization and demobilization charges are mandatory",
//       });
//     }

//     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
//       transaction,
//     });

//     if (!equipmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     // Update swap status and charges
//     await equipmentSwap.update(
//       {
//         swap_status:
//           equipmentSwap.swap_status === "Return" ? "Resubmit" : "Swap Request",
//         mobilization_charge: parseFloat(mobilization_charge),
//         demobilization_charge: parseFloat(demobilization_charge),
//         return_reason: null, // Clear return reason on submit/resubmit
//       },
//       { transaction }
//     );

//     await SalesOrdersModel.update(
//       { has_pending_swap_request: true },
//       { where: { id: equipmentSwap.sales_order_id } },
//       transaction
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Equipment swap submitted successfully",
//       equipmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting equipment swap:", error);
//     res.status(500).json({
//       message: "Error submitting equipment swap",
//       error: error.message,
//     });
//   }
// };

// const returnEquipmentSwapRequest = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_swap_id } = req.params;
//     const { return_reason } = req.body;

//     if (!return_reason || !return_reason.trim()) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Return reason is required",
//       });
//     }

//     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
//       transaction,
//     });

//     if (!equipmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     // Update swap status to Return
//     await equipmentSwap.update(
//       {
//         swap_status: "Return",
//         return_reason: return_reason.trim(),
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Equipment swap returned successfully",
//       equipmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error returning equipment swap:", error);
//     res.status(500).json({
//       message: "Error returning equipment swap",
//       error: error.message,
//     });
//   }
// };

// const approveEquipmentSwap = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_swap_id } = req.params;

//     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
//       transaction,
//     });

//     if (!equipmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     // Update swap status to Approved
//     await equipmentSwap.update(
//       {
//         swap_status: "Approved",
//       },
//       { transaction }
//     );

//     // Check if any pending swaps remain for this sales order
//     const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");

//     const equipmentSwaps = await EquipmentSwapModel.count({
//       where: {
//         sales_order_id: equipmentSwap.sales_order_id,
//         swap_status: {
//           [Op.in]: ["Swap Request", "Return", "Resubmit"],
//         },
//       },
//       transaction,
//     });

//     const hasPendingSwaps = equipmentSwaps > 0;

//     await SalesOrdersModel.update(
//       { has_pending_swap_request: hasPendingSwaps },
//       {
//         where: { id: equipmentSwap.sales_order_id },
//         transaction,
//       }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Equipment swap approved successfully",
//       equipmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving equipment swap:", error);
//     res.status(500).json({
//       message: "Error approving equipment swap",
//       error: error.message,
//     });
//   }
// };

// const rejectEquipmentSwap = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_swap_id } = req.params;
//     const { rejection_reason } = req.body;

//     const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
//       transaction,
//     });

//     if (!equipmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Equipment swap not found" });
//     }

//     // Update swap status to Rejected
//     await equipmentSwap.update(
//       {
//         swap_status: "Rejected",
//         return_reason: rejection_reason || "Rejected by approver",
//       },
//       { transaction }
//     );

//     // Check if any pending swaps remain for this sales order
//     const EquipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");

//     const equipmentSwaps = await EquipmentSwapModel.count({
//       where: {
//         sales_order_id: equipmentSwap.sales_order_id,
//         swap_status: {
//           [Op.in]: ["Swap Request", "Return", "Resubmit"],
//         },
//       },
//       transaction,
//     });

//     const hasPendingSwaps = equipmentSwaps > 0;

//     await SalesOrdersModel.update(
//       { has_pending_swap_request: hasPendingSwaps },
//       {
//         where: { id: equipmentSwap.sales_order_id },
//         transaction,
//       }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Equipment swap rejected successfully",
//       equipmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting equipment swap:", error);
//     res.status(500).json({
//       message: "Error rejecting equipment swap",
//       error: error.message,
//     });
//   }
// };

// // ==================== LEGACY PDF GENERATION (keep for backward compatibility) ====================

// const generateEquipmentDeliveryNotePDF = async (req, res) => {
//   // Legacy function - delegates to the newer implementation
//   return generateEquipmentDNPDF(req, res);
// };

// const generateEquipmentOffHireNotePDF = async (req, res) => {
//   // Legacy function - keep existing implementation or delegate
//   try {
//     const { equipment_ohn_id } = req.params;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       {
//         include: [
//           {
//             model: EquipmentOffHireNoteTripModel,
//             as: "trips",
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: EquipmentSwapModel,
//             as: "equipmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//                 attributes: [
//                   "so_number",
//                   "client",
//                   "project_name",
//                   "ordered_date",
//                   "lpo_number",
//                 ],
//               },
//               {
//                 model: EquipmentModel,
//                 as: "previousEquipment",
//                 attributes: [
//                   "serial_number",
//                   "reg_number",
//                   "vehicle_type",
//                   "description",
//                 ],
//               },
//             ],
//           },
//         ],
//       }
//     );

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     // Update status to In Progress when PDF is generated
//     await offHireNote.update({ status: "In Progress" });

//     // Also update trips status
//     await EquipmentOffHireNoteTripModel.update(
//       { trip_status: "In Progress" },
//       {
//         where: { equipment_ohn_id, trip_status: "Creation" },
//       }
//     );

//     // Generate PDF
//     const doc = new PDFDocument({ margin: 40, size: "A4" });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="OHN-${offHireNote.ohn_number}.pdf"`
//     );

//     doc.pipe(res);

//     // Add border to page
//     const pageWidth = doc.page.width;
//     const pageHeight = doc.page.height;
//     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

//     // Company Header with Red Background
//     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#DC2626", "#DC2626");

//     doc
//       .fontSize(22)
//       .font("Helvetica-Bold")
//       .fillColor("#FFFFFF")
//       .text("Auto Xpert Trading and Service WLL", 50, 55, { align: "center" })
//       .fontSize(9)
//       .font("Helvetica")
//       .text(
//         "Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56",
//         50,
//         82,
//         { align: "center" }
//       )
//       .text("Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa", 50, 95, {
//         align: "center",
//       });

//     doc.fillColor("#000000");

//     // Document Title
//     doc.moveDown(3);
//     doc
//       .fontSize(18)
//       .font("Helvetica-Bold")
//       .fillColor("#DC2626")
//       .text("EQUIPMENT OFF HIRE NOTE", { align: "center" })
//       .fillColor("#000000");

//     doc.moveDown(1);
//     doc
//       .moveTo(100, doc.y)
//       .lineTo(pageWidth - 100, doc.y)
//       .stroke("#DC2626");
//     doc.moveDown(1);

//     // Two Column Layout for Details
//     const leftX = 50;
//     const rightX = 320;
//     const startY = doc.y;

//     // Left Column - Client Address
//     doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
//     doc.text("CLIENT INFORMATION", leftX, startY);
//     doc.fillColor("#000000");

//     doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
//     doc.fontSize(10).font("Helvetica");
//     doc.text(
//       offHireNote.equipmentSwap.salesOrder.client,
//       leftX + 10,
//       startY + 30,
//       { width: 220 }
//     );

//     // Right Column - Document Details
//     doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
//     doc.text("DOCUMENT DETAILS", rightX, startY);
//     doc.fillColor("#000000");

//     const detailsY = startY + 20;
//     doc.rect(rightX, detailsY, 240, 90).stroke("#CCCCCC");

//     doc.fontSize(9).font("Helvetica-Bold");
//     doc.text("Off Hire Note No.:", rightX + 10, detailsY + 10);
//     doc.text("Off Hire Date:", rightX + 10, detailsY + 30);
//     doc.text("Order Reference No.:", rightX + 10, detailsY + 50);
//     doc.text("Project Name:", rightX + 10, detailsY + 70);

//     doc.font("Helvetica");
//     doc.text(offHireNote.ohn_number, rightX + 130, detailsY + 10);
//     doc.text(
//       new Date(offHireNote.off_hire_date).toLocaleDateString("en-GB"),
//       rightX + 130,
//       detailsY + 30
//     );
//     doc.text(
//       offHireNote.equipmentSwap.salesOrder.so_number,
//       rightX + 130,
//       detailsY + 50
//     );
//     doc.text(
//       offHireNote.equipmentSwap.salesOrder.project_name || "N/A",
//       rightX + 130,
//       detailsY + 70,
//       { width: 100 }
//     );

//     doc.y = startY + 120;
//     doc.moveDown(1);

//     // Equipment Details Section
//     doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
//     doc
//       .rect(leftX, doc.y, pageWidth - 100, 20)
//       .fillAndStroke("#DC2626", "#DC2626");
//     doc.text("EQUIPMENT DETAILS", leftX + 10, doc.y + 5);

//     doc.fillColor("#000000");
//     doc.moveDown(1.5);

//     const equipY = doc.y;

//     doc.fontSize(9).font("Helvetica-Bold");
//     doc.text("Plate Number:", leftX + 10, equipY + 10);
//     doc.text("Vehicle Type:", leftX + 10, equipY + 30);
//     doc.text("Serial Number:", leftX + 10, equipY + 50);

//     doc.font("Helvetica");
//     doc.text(
//       offHireNote.equipmentSwap.previousEquipment.reg_number,
//       leftX + 120,
//       equipY + 10
//     );
//     doc.text(
//       offHireNote.equipmentSwap.previousEquipment.vehicle_type,
//       leftX + 120,
//       equipY + 30
//     );
//     doc.text(
//       offHireNote.equipmentSwap.previousEquipment.serial_number,
//       leftX + 120,
//       equipY + 50
//     );

//     doc.y = equipY + 80;
//     doc.moveDown(1);

//     // Transportation Details
//     if (offHireNote.trips && offHireNote.trips.length > 0) {
//       doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
//       doc
//         .rect(leftX, doc.y, pageWidth - 100, 20)
//         .fillAndStroke("#DC2626", "#DC2626");
//       doc.text("TRANSPORTATION DETAILS", leftX + 10, doc.y + 5);

//       doc.fillColor("#000000");
//       doc.moveDown(1.5);

//       offHireNote.trips.forEach((trip, index) => {
//         const tripY = doc.y;
//         const tripHeight = 100;

//         // Add new page if needed
//         if (tripY + tripHeight > pageHeight - 100) {
//           doc.addPage();
//           doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
//           doc.y = 50;
//         }

//         doc.fontSize(10).font("Helvetica-Bold").fillColor("#DC2626");
//         doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
//         doc.fillColor("#000000");

//         const tripDetailsY = doc.y + 30;
//         doc.fontSize(9).font("Helvetica-Bold");
//         doc.text("Company:", leftX + 10, tripDetailsY);
//         doc.text("Driver:", leftX + 10, tripDetailsY + 15);
//         doc.text("Contact:", leftX + 10, tripDetailsY + 30);
//         doc.text("Vehicle Type:", leftX + 10, tripDetailsY + 45);
//         doc.text("Vehicle No.:", leftX + 10, tripDetailsY + 60);

//         doc.font("Helvetica");
//         doc.text(trip.transportation_company, leftX + 100, tripDetailsY, {
//           width: 200,
//         });
//         doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
//         doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
//         doc.text(trip.vehicle_type || "N/A", leftX + 100, tripDetailsY + 45);
//         doc.text(trip.vehicle_number || "N/A", leftX + 100, tripDetailsY + 60);

//         if (trip.trip_date) {
//           doc.font("Helvetica-Bold");
//           doc.text("Trip Date:", rightX, tripDetailsY);
//           doc.font("Helvetica");
//           doc.text(
//             new Date(trip.trip_date).toLocaleDateString("en-GB"),
//             rightX + 80,
//             tripDetailsY
//           );
//         }

//         doc.y += tripHeight + 10;
//       });
//     }

//     // Remarks Section
//     if (offHireNote.remarks) {
//       doc.moveDown(1);
//       doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
//       doc.text("REMARKS", leftX);
//       doc.fillColor("#000000");

//       doc.fontSize(9).font("Helvetica");
//       doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke("#CCCCCC");
//       doc.text(offHireNote.remarks, leftX + 10, doc.y + 15, {
//         width: pageWidth - 120,
//       });
//       doc.y += 50;
//     }

//     doc.moveDown(2);

//     // Acknowledgement Box
//     doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
//     doc.text(
//       "We acknowledge that the equipment has been returned in good condition.",
//       leftX + 10,
//       doc.y + 10,
//       { width: pageWidth - 120, align: "center" }
//     );

//     doc.moveDown(3);

//     // Signature Section
//     const sigY = doc.y;

//     // Check if we need a new page
//     if (sigY + 120 > pageHeight - 60) {
//       doc.addPage();
//       doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
//       doc.y = 50;
//     }

//     doc.fontSize(10).font("Helvetica-Bold");

//     // Left signature
//     doc.text("Received By:", leftX, doc.y);
//     doc
//       .moveTo(leftX, doc.y + 50)
//       .lineTo(leftX + 200, doc.y + 50)
//       .stroke();
//     doc.font("Helvetica").fontSize(8);
//     doc.text("Name & Signature", leftX, doc.y + 55);

//     // Right signature
//     doc.font("Helvetica-Bold").fontSize(10);
//     doc.text("Date:", rightX, sigY);
//     doc
//       .moveTo(rightX, sigY + 50)
//       .lineTo(rightX + 200, sigY + 50)
//       .stroke();
//     doc.font("Helvetica").fontSize(8);
//     doc.text("DD/MM/YYYY", rightX, sigY + 55);

//     doc.moveDown(4);

//     // Contact section
//     doc.text("Contact No.:", leftX, doc.y);
//     doc
//       .moveTo(leftX, doc.y + 50)
//       .lineTo(leftX + 200, doc.y + 50)
//       .stroke();

//     // Footer
//     doc.fontSize(7).font("Helvetica-Oblique").fillColor("#666666");
//     doc.text(
//       "This is a computer generated document. No signature is required.",
//       0,
//       pageHeight - 50,
//       { align: "center", width: pageWidth }
//     );

//     doc.end();
//   } catch (error) {
//     console.error("Error generating off hire note PDF:", error);
//     res.status(500).json({
//       message: "Error generating off hire note PDF",
//       error: error.message,
//     });
//   }
// };

// // ==================== EXPORTS ====================

// module.exports = {
//   // Equipment Tag Numbers
//   getAllEquipmentTagNumbers,
//   getEquipmentSwapReasons,

//   // Swap Creation & Retrieval
//   createEquipmentSwap,
//   getEquipmentSwapById,

//   // Delivery Note Functions
//   createEquipmentDeliveryNote,
//   getEquipmentDeliveryNoteById,
//   getLatestEquipmentDeliveryNote,
//   getEquipmentDeliveryNoteSummary,
//   submitEquipmentDNForApproval,
//   approveEquipmentDeliveryNote,
//   rejectEquipmentDeliveryNote,
//   generateEquipmentDeliveryNotePDF,
//   generateEquipmentDNPDF,
//   closeEquipmentDeliveryNote,
//   uploadEquipmentDeliveryNote,
//   addTripToEquipmentDeliveryNote,
//   updateTripInEquipmentDN,
//   deleteTripFromEquipmentDN,
//   uploadEquipmentDNChecklist,
//   downloadEquipmentDNChecklist,

//   // Off Hire Note Functions (Enhanced)
//   createEquipmentOffHireNote,
//   getEquipmentOffHireNoteById,
//   getLatestEquipmentOffHireNote,
//   getEquipmentOffHireNoteSummary,
//   submitEquipmentOHNForApproval,
//   approveEquipmentOffHireNote,
//   rejectEquipmentOffHireNote,
//   generateEquipmentOffHireNotePDF,
//   generateEquipmentOHNPDF,
//   closeEquipmentOffHireNote,
//   uploadEquipmentOffHireNote,
//   addTripToEquipmentOffHireNote,
//   updateTripInEquipmentOHN,
//   deleteTripFromEquipmentOHN,
//   uploadEquipmentOHNChecklist,
//   downloadEquipmentOHNChecklist,

//   // Swap Request Management
//   submitEquipmentSwapRequest,
//   returnEquipmentSwapRequest,
//   approveEquipmentSwap,
//   rejectEquipmentSwap,
//   getSwapRequestCounts,
// };

const EquipmentSwapModel = require("../models/EquipmentSwapModel");
const EquipmentModel = require("../models/EquipmentModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const {
  EquipmentDeliveryNoteModel,
  EquipmentDeliveryNoteTripModel,
  EquipmentDNEquipmentModel,
} = require("../models/EquipmentDeliveryNoteModel");
const {
  EquipmentOffHireNoteModel,
  EquipmentOffHireNoteTripModel,
  EquipmentOHNEquipmentModel,
} = require("../models/EquipmentOffHireNoteModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const SwapReasonModel = require("../models/swapReasonModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const generateEquipmentDNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `EQ-DN-${currentYear}-`;

  const lastDN = await EquipmentDeliveryNoteModel.findOne({
    where: { dn_number: { [Op.like]: `${prefix}%` } },
    order: [["dn_number", "DESC"]],
  });

  let nextNumber = 1;
  if (lastDN) {
    const parts = lastDN.dn_number.split("-");
    const lastNumber = parseInt(parts[parts.length - 1]);
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
};

const generateEquipmentOHNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `EQ-OH-${currentYear}-`;

  const lastOHN = await EquipmentOffHireNoteModel.findOne({
    where: { ohn_number: { [Op.like]: `${prefix}%` } },
    order: [["ohn_number", "DESC"]],
  });

  let nextNumber = 1;
  if (lastOHN) {
    const parts = lastOHN.ohn_number.split("-");
    const lastNumber = parseInt(parts[parts.length - 1]);
    if (!isNaN(lastNumber)) nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
};

const getUsername = async (req) => {
  try {
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) return user.username;
    }
    return req.user?.username || "System";
  } catch {
    return "System";
  }
};

/**
 * Update equipment swap statuses based on delivery/off-hire note changes
 */
const updateEquipmentSwapStatuses = async (
  equipmentSwapId,
  transaction = null,
) => {
  try {
    // Fetch equipment swap with all needed data in a single query
    const equipmentSwap = await EquipmentSwapModel.findByPk(equipmentSwapId, {
      include: [
        {
          model: EquipmentDeliveryNoteModel,
          as: "deliveryNotes", // Make sure this association exists
          limit: 1,
          order: [["created_at", "DESC"]],
          required: false,
        },
        {
          model: EquipmentOffHireNoteModel,
          as: "offHireNotes", // Make sure this association exists
          limit: 1,
          order: [["created_at", "DESC"]],
          required: false,
        },
      ],
      transaction,
    });

    if (!equipmentSwap) return;

    // Get latest notes (if any)
    const latestDN = equipmentSwap.deliveryNotes?.[0];
    const latestOHN = equipmentSwap.offHireNotes?.[0];

    // Determine delivery note status
    let deliveryNoteStatus = "Pending";
    if (latestDN) {
      const statusPriority = {
        Close: "Close",
        Completed: "Completed",
        Approved: "Approved",
        "Under Approval": "Under Approval",
        Rejected: "Rejected",
        "In Progress": "In Progress",
        Creation: "Creation",
      };
      deliveryNoteStatus = statusPriority[latestDN.status] || "Pending";
    }

    // Determine off-hire note status
    let offHireNoteStatus = "Pending";
    if (latestOHN) {
      const statusPriority = {
        Close: "Close",
        Completed: "Completed",
        Approved: "Approved",
        "Under Approval": "Under Approval",
        Rejected: "Rejected",
        "In Progress": "In Progress",
        Creation: "Creation",
      };
      offHireNoteStatus = statusPriority[latestOHN.status] || "Pending";
    }

    // Update only if status actually changed
    if (
      equipmentSwap.delivery_note_status !== deliveryNoteStatus ||
      equipmentSwap.off_hire_note_status !== offHireNoteStatus
    ) {
      await equipmentSwap.update(
        {
          delivery_note_status: deliveryNoteStatus,
          off_hire_note_status: offHireNoteStatus,
        },
        { transaction },
      );
    }

    // Handle partner swaps - use a separate non-blocking approach
    if (equipmentSwap.swap_group_id) {
      // Don't wait for partner updates - fire and forget
      // Or use a queue system for better reliability
      process.nextTick(async () => {
        try {
          const partnerSwaps = await EquipmentSwapModel.findAll({
            where: {
              swap_group_id: equipmentSwap.swap_group_id,
              equipment_swap_id: { [Op.ne]: equipmentSwap.equipment_swap_id },
            },
          });

          for (const partnerSwap of partnerSwaps) {
            // Use a new transaction for each partner
            const partnerTransaction = await sequelize.transaction();
            try {
              await updateEquipmentSwapStatuses(
                partnerSwap.equipment_swap_id,
                partnerTransaction,
              );
              await partnerTransaction.commit();
            } catch (error) {
              await partnerTransaction.rollback();
              console.error(
                `Error updating partner swap ${partnerSwap.equipment_swap_id}:`,
                error,
              );
            }
          }
        } catch (error) {
          console.error("Error processing partner swaps:", error);
        }
      });
    }
  } catch (error) {
    console.error("Error updating equipment swap statuses:", error);
    throw error;
  }
};

// Get all equipment tag numbers for dropdown
const getAllEquipmentTagNumbers = async (req, res) => {
  try {
    const equipment = await EquipmentModel.findAll({
      where: { status: "Active" },
      attributes: ["serial_number", "reg_number", "vehicle_type"],
      order: [["reg_number", "ASC"]],
    });

    res.status(200).json({
      success: true,
      equipment: equipment.map((eq) => ({
        serial_number: eq.serial_number,
        reg_number: eq.reg_number,
        vehicle_type: eq.vehicle_type,
      })),
    });
  } catch (error) {
    console.error("Error fetching equipment:", error);
    res.status(500).json({ error: error.message });
  }
};

const getEquipmentSwapReasons = async (req, res) => {
  try {
    const swapReasons = await SwapReasonModel.findAll({
      where: {
        category: "Equipment",
        status: "Active",
      },
      attributes: ["swap_reason_id", "swap_reason_name"],
      order: [["swap_reason_name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      swapReasons: swapReasons.map((reason) => ({
        swap_reason_id: reason.swap_reason_id,
        swap_reason_name: reason.swap_reason_name,
      })),
    });
  } catch (error) {
    console.error("Error fetching equipment swap reasons:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Helper: generate a human-readable group ID ────────────────────────────
// Format: EQ-YYYYMMDD-XXXX  (e.g. EQ-20260224-A3F9)
const generateSwapGroupId = (prefix = "EQ") => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // "20260224"
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 6); // 4 random alphanumeric chars
  return `${prefix}-${datePart}-${randomPart}`;
};
// ───────────────────────────────────────────────────────────────────────────

const createEquipmentSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      sales_order_id,
      allocation_id,
      previous_plate_no,
      new_plate_no,
      swap_date,
      swap_reason,
      swap_estimated_recovery_cost,
      swap_mobilization_trips,
      swap_demobilization_trips,
      swap_remark,
    } = req.body;

    // Validate required fields
    if (
      !sales_order_id ||
      !previous_plate_no ||
      !new_plate_no ||
      !swap_date ||
      !swap_reason
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // Check if new plate number exists in equipment table
    const existingEquipment = await EquipmentModel.findOne({
      where: { reg_number: new_plate_no, status: "Active" },
    });

    if (!existingEquipment) {
      await transaction.rollback();
      return res.status(400).json({
        message: "New plate number does not exist in equipment table",
      });
    }

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Get previous equipment details
    const previousEquipment = await EquipmentModel.findOne({
      where: { reg_number: previous_plate_no },
    });

    if (!previousEquipment) {
      await transaction.rollback();
      return res.status(404).json({ message: "Previous equipment not found" });
    }

    // Get logged in user
    let username = "System";
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        username = user.username;
      }
    }

    // ✅ Generate one shared group ID for both records of this swap operation
    const swapGroupId = generateSwapGroupId("EQ");

    // CREATE RECORD 1: OFF_HIRE — for the existing/outgoing equipment
    const offHireSwap = await EquipmentSwapModel.create(
      {
        swap_group_id: swapGroupId,
        sales_order_id,
        allocation_id: allocation_id || null,
        previous_equipment_serial: previousEquipment.serial_number,
        previous_plate_no,
        new_equipment_serial: null,
        new_plate_no: null,
        swap_date,
        swap_reason,
        swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
        swap_mobilization_trips: null,
        swap_demobilization_trips: swap_demobilization_trips || null,
        swap_remark: swap_remark || null,
        delivery_note_status: "Pending",
        off_hire_note_status: "Pending",
        overall_status: "Creation",
        swap_type: "OFF_HIRE",
        created_by: username,
      },
      { transaction },
    );

    // CREATE RECORD 2: DELIVERY — for the new/incoming equipment
    const deliverySwap = await EquipmentSwapModel.create(
      {
        swap_group_id: swapGroupId,
        sales_order_id,
        allocation_id: allocation_id || null,
        previous_equipment_serial: null,
        previous_plate_no: null,
        new_equipment_serial: existingEquipment.serial_number,
        new_plate_no,
        swap_date,
        swap_reason,
        swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
        swap_mobilization_trips: swap_mobilization_trips || null,
        swap_demobilization_trips: null,
        swap_remark: swap_remark || null,
        delivery_note_status: "Pending",
        off_hire_note_status: "Pending",
        overall_status: "Creation",
        swap_type: "DELIVERY",
        created_by: username,
      },
      { transaction },
    );

    await salesOrder.update(
      { has_pending_swap_request: true },
      { transaction },
    );

    // Update allocation equipment if allocation_id exists
    if (allocation_id) {
      const ActiveAllocationEquipmentModel =
        require("../models/ActiveAllocationsOriginalModel").AllocationEquipmentModel;

      await ActiveAllocationEquipmentModel.update(
        {
          serial_number: existingEquipment.serial_number,
          updated_at: new Date(),
        },
        {
          where: {
            allocation_id: allocation_id,
            serial_number: previousEquipment.serial_number,
          },
          transaction,
        },
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Equipment swap records created successfully",
      equipmentSwap: deliverySwap,
      offHireSwap,
      deliverySwap,
      swap_group_id: swapGroupId,
      summary: {
        swap_group_id: swapGroupId,
        off_hire_plate: previous_plate_no,
        delivery_plate: new_plate_no,
        swap_date,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating equipment swap:", error);
    res.status(500).json({
      message: "Error creating equipment swap",
      error: error.message,
    });
  }
};

// Get equipment swap by ID with details
const getEquipmentSwapById = async (req, res) => {
  try {
    const { id } = req.params;

    const equipmentSwap = await EquipmentSwapModel.findByPk(id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: EquipmentModel,
          as: "previousEquipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
        {
          model: EquipmentModel,
          as: "newEquipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
        {
          model: EquipmentDeliveryNoteModel,
          as: "deliveryNotes",
          include: [
            {
              model: EquipmentDeliveryNoteTripModel,
              as: "trips",
              include: [
                {
                  model: EquipmentDNEquipmentModel,
                  as: "equipment",
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        },
        {
          model: EquipmentOffHireNoteModel,
          as: "offHireNotes",
          include: [
            {
              model: EquipmentOffHireNoteTripModel,
              as: "trips",
              include: [
                {
                  model: EquipmentOHNEquipmentModel,
                  as: "equipment",
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!equipmentSwap) {
      return res.status(404).json({ message: "Equipment swap not found" });
    }

    res.status(200).json({
      equipmentSwap,
    });
  } catch (error) {
    console.error("Error fetching equipment swap:", error);
    res.status(500).json({
      message: "Error fetching equipment swap",
      error: error.message,
    });
  }
};

// Get swap request counts for notification badge
const getSwapRequestCounts = async (req, res) => {
  try {
    const { sales_order_id } = req.query;

    const where = {
      swap_status: {
        [Op.in]: ["Swap Request", "Resubmit"],
      },
    };

    if (sales_order_id) {
      where.sales_order_id = sales_order_id;
    }

    const equipmentCount = await EquipmentSwapModel.count({ where });

    res.status(200).json({
      success: true,
      equipmentSwapCount: equipmentCount,
      totalSwapCount: equipmentCount,
    });
  } catch (error) {
    console.error("Error fetching swap request counts:", error);
    res.status(500).json({
      message: "Error fetching swap request counts",
      error: error.message,
    });
  }
};

// ==================== DELIVERY NOTE FUNCTIONS ====================

const createEquipmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_swap_id } = req.params;
    const { remarks, trips } = req.body;

    // Get equipment swap
    const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
      include: [
        {
          model: EquipmentModel,
          as: "newEquipment",
          attributes: ["serial_number", "reg_number"],
        },
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
      ],
      transaction,
    });

    if (!equipmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Equipment swap not found" });
    }

    // Generate DN number
    const dn_number = await generateEquipmentDNNumber();

    // Get logged in user
    let username = await getUsername(req);

    // Create delivery note
    const deliveryNote = await EquipmentDeliveryNoteModel.create(
      {
        equipment_swap_id,
        dn_number,
        new_equipment_serial: equipmentSwap.new_equipment_serial,
        new_plate_no: equipmentSwap.new_plate_no,
        status: "Creation",
        remarks,
        created_by: username,
      },
      { transaction },
    );

    // Create trips if provided
    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const newTrip = await EquipmentDeliveryNoteTripModel.create(
          {
            equipment_dn_id: deliveryNote.equipment_dn_id,
            trip_number: trip.trip_number,
            transportation_company: trip.transportation_company,
            driver_name: trip.driver_name,
            driver_contact: trip.driver_contact,
            vehicle_type: trip.vehicle_type || null,
            vehicle_number: trip.vehicle_number || null,
            recovery_vehicle_number: trip.recovery_vehicle_number || null,
            chargeable_type: trip.chargeable_type || null,
            trip_date: trip.trip_date,
            trip_status: "Creation",
            remarks: trip.remarks || null,
          },
          { transaction },
        );

        // Add equipment resources to this trip
        if (trip.equipment && trip.equipment.length > 0) {
          for (const equip of trip.equipment) {
            await EquipmentDNEquipmentModel.create(
              {
                equipment_dn_id: deliveryNote.equipment_dn_id,
                trip_id: newTrip.trip_id,
                serial_number: equip.serial_number,
                reg_number: equip.reg_number,
                equipment_type: equip.equipment_type || null,
              },
              { transaction },
            );
          }
        }
      }
    }

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(equipment_swap_id, transaction);

    const sameGroupSwapData = await EquipmentSwapModel.findAll({
      where: {
        overall_status: "Partially completed",
        swap_group_id: equipmentSwap.swap_group_id,
      },
    });

    if (equipmentSwap.overall_status === "In progress") {
      if (sameGroupSwapData.length > 0) {
        const equipmentGroupSwapData = await EquipmentSwapModel.findAll({
          where: {
            swap_group_id: equipmentSwap.swap_group_id,
          },
        });

        const ids = equipmentGroupSwapData.map((data) =>
          data.getDataValue("equipment_swap_id"),
        );
        for (const data of equipmentGroupSwapData) {
          await EquipmentSwapModel.update(
            { overall_status: "Completed" },
            {
              where: { equipment_swap_id: { [Op.in]: ids } },
              transaction,
            },
          );
        }
      } else {
        await EquipmentSwapModel.update(
          { overall_status: "Partially completed" },
          {
            where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
            transaction,
          },
        );
      }
    }

    await transaction.commit();

    // Fetch created delivery note with trips
    const createdDeliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      deliveryNote.equipment_dn_id,
      {
        include: [
          {
            model: EquipmentDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: EquipmentDNEquipmentModel,
                as: "equipment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
              },
            ],
          },
        ],
      },
    );

    res.status(201).json({
      message: "Equipment delivery note created successfully",
      deliveryNote: createdDeliveryNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating equipment delivery note:", error);
    res.status(500).json({
      message: "Error creating equipment delivery note",
      error: error.message,
    });
  }
};

// ==================== OFF-HIRE NOTE FUNCTIONS ====================

/**
 * Create equipment off hire note with trips and equipment resources
 */
const createEquipmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_swap_id } = req.params;
    const { remarks, trips } = req.body;

    // Get equipment swap
    const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
      include: [
        {
          model: EquipmentModel,
          as: "previousEquipment",
          attributes: ["serial_number", "reg_number"],
        },
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
      ],
      transaction,
    });

    if (!equipmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Equipment swap not found" });
    }

    // Generate OHN number
    const ohn_number = await generateEquipmentOHNNumber();

    // Get logged in user
    let username = await getUsername(req);

    // Create off hire note
    const offHireNote = await EquipmentOffHireNoteModel.create(
      {
        equipment_swap_id,
        ohn_number,
        previous_equipment_serial: equipmentSwap.previous_equipment_serial,
        previous_plate_no: equipmentSwap.previous_plate_no,
        status: "Creation",
        remarks,
        created_by: username,
      },
      { transaction },
    );

    // Create trips if provided
    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const newTrip = await EquipmentOffHireNoteTripModel.create(
          {
            equipment_ohn_id: offHireNote.equipment_ohn_id,
            trip_number: trip.trip_number,
            transportation_company: trip.transportation_company,
            driver_name: trip.driver_name,
            driver_contact: trip.driver_contact,
            vehicle_type: trip.vehicle_type || null,
            vehicle_number: trip.vehicle_number || null,
            recovery_vehicle_number: trip.recovery_vehicle_number || null,
            chargeable_type: trip.chargeable_type || null,
            trip_date: trip.trip_date,
            trip_status: "Creation",
            remarks: trip.remarks || null,
          },
          { transaction },
        );

        // Add equipment resources to this trip
        if (trip.equipment && trip.equipment.length > 0) {
          for (const equip of trip.equipment) {
            await EquipmentOHNEquipmentModel.create(
              {
                equipment_ohn_id: offHireNote.equipment_ohn_id,
                trip_id: newTrip.trip_id,
                serial_number: equip.serial_number,
                reg_number: equip.reg_number,
                equipment_type: equip.equipment_type || null,
              },
              { transaction },
            );
          }
        }
      }
    }

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(equipment_swap_id, transaction);

    const sameGroupSwapData = await EquipmentSwapModel.findAll({
      where: {
        overall_status: "Partially completed",
        swap_group_id: equipmentSwap.swap_group_id,
      },
    });

    if (equipmentSwap.overall_status === "In progress") {
      if (sameGroupSwapData.length > 0) {
        const equipmentGroupSwapData = await EquipmentSwapModel.findAll({
          where: {
            swap_group_id: equipmentSwap.swap_group_id,
          },
        });

        const ids = equipmentGroupSwapData.map((data) =>
          data.getDataValue("equipment_swap_id"),
        );
        for (const data of equipmentGroupSwapData) {
          await EquipmentSwapModel.update(
            { overall_status: "Completed" },
            {
              where: { equipment_swap_id: { [Op.in]: ids } },
              transaction,
            },
          );
        }
      } else {
        await EquipmentSwapModel.update(
          { overall_status: "Partially completed" },
          {
            where: { equipment_swap_id: equipmentSwap.equipment_swap_id },
            transaction,
          },
        );
      }
    }

    await transaction.commit();

    // Fetch created off hire note with trips
    const createdOffHireNote = await EquipmentOffHireNoteModel.findByPk(
      offHireNote.equipment_ohn_id,
      {
        include: [
          {
            model: EquipmentOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: EquipmentOHNEquipmentModel,
                as: "equipment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
              },
            ],
          },
        ],
      },
    );

    res.status(201).json({
      message: "Equipment off hire note created successfully",
      offHireNote: createdOffHireNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating equipment off hire note:", error);
    res.status(500).json({
      message: "Error creating equipment off hire note",
      error: error.message,
    });
  }
};

// ==================== GET FUNCTIONS ====================

/**
 * Get equipment delivery note by ID with trips and equipment
 */
const getEquipmentDeliveryNoteById = async (req, res) => {
  try {
    const { equipment_dn_id } = req.params;

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      {
        include: [
          {
            model: EquipmentDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: EquipmentDNEquipmentModel,
                as: "equipment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              { model: SalesOrdersModel, as: "salesOrder" },
              {
                model: EquipmentModel,
                as: "newEquipment",
                attributes: ["serial_number", "reg_number", "vehicle_type"],
              },
            ],
          },
        ],
      },
    );

    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    res.status(200).json({ deliveryNote });
  } catch (error) {
    console.error("Error fetching equipment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get equipment off hire note by ID with trips and equipment
 */
const getEquipmentOffHireNoteById = async (req, res) => {
  try {
    const { equipment_ohn_id } = req.params;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      {
        include: [
          {
            model: EquipmentOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: EquipmentOHNEquipmentModel,
                as: "equipment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              { model: SalesOrdersModel, as: "salesOrder" },
              {
                model: EquipmentModel,
                as: "previousEquipment",
                attributes: ["serial_number", "reg_number", "vehicle_type"],
              },
            ],
          },
        ],
      },
    );

    if (!offHireNote) {
      return res.status(404).json({ message: "Off hire note not found" });
    }

    res.status(200).json({ offHireNote });
  } catch (error) {
    console.error("Error fetching equipment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get latest equipment delivery note for a swap
 */
const getLatestEquipmentDeliveryNote = async (req, res) => {
  try {
    const { equipment_swap_id } = req.params;

    const deliveryNote = await EquipmentDeliveryNoteModel.findOne({
      where: { equipment_swap_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: EquipmentDeliveryNoteTripModel,
          as: "trips",
          include: [
            {
              model: EquipmentDNEquipmentModel,
              as: "equipment",
            },
          ],
          order: [["trip_number", "ASC"]],
        },
        {
          model: EquipmentSwapModel,
          as: "equipmentSwap",
          include: [
            { model: SalesOrdersModel, as: "salesOrder" },
            {
              model: EquipmentModel,
              as: "newEquipment",
              attributes: ["serial_number", "reg_number", "vehicle_type"],
            },
          ],
        },
      ],
    });

    if (!deliveryNote) {
      return res.status(404).json({ message: "No delivery note found" });
    }

    res.status(200).json({ deliveryNote });
  } catch (error) {
    console.error("Error fetching latest equipment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get latest equipment off hire note for a swap
 */
const getLatestEquipmentOffHireNote = async (req, res) => {
  try {
    const { equipment_swap_id } = req.params;

    const offHireNote = await EquipmentOffHireNoteModel.findOne({
      where: { equipment_swap_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: EquipmentOffHireNoteTripModel,
          as: "trips",
          include: [
            {
              model: EquipmentOHNEquipmentModel,
              as: "equipment",
            },
          ],
          order: [["trip_number", "ASC"]],
        },
        {
          model: EquipmentSwapModel,
          as: "equipmentSwap",
          include: [
            { model: SalesOrdersModel, as: "salesOrder" },
            {
              model: EquipmentModel,
              as: "previousEquipment",
              attributes: ["serial_number", "reg_number", "vehicle_type"],
            },
          ],
        },
      ],
    });

    if (!offHireNote) {
      return res.status(404).json({ message: "No off hire note found" });
    }

    res.status(200).json({ offHireNote });
  } catch (error) {
    console.error("Error fetching latest equipment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get equipment delivery note summary
 */
const getEquipmentDeliveryNoteSummary = async (req, res) => {
  try {
    const { equipment_dn_id } = req.params;

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      {
        include: [
          {
            model: EquipmentDeliveryNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: ["so_number", "client", "project_name"],
              },
              {
                model: EquipmentModel,
                as: "newEquipment",
                attributes: ["serial_number", "reg_number", "vehicle_type"],
              },
            ],
          },
        ],
      },
    );

    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    // Format summary data
    const summaryData = {
      dn_number: deliveryNote.dn_number,
      equipment: deliveryNote.equipmentSwap.newEquipment,
      status: deliveryNote.status,
      trips: deliveryNote.trips.map((trip) => ({
        trip_number: trip.trip_number,
        transportation: {
          company: trip.transportation_company,
          driver: trip.driver_name,
          contact: trip.driver_contact,
          vehicle: trip.vehicle_number,
        },
        trip_date: trip.trip_date,
        trip_status: trip.trip_status,
        remarks: trip.remarks,
      })),
    };

    res.status(200).json({
      success: true,
      summary: summaryData,
    });
  } catch (error) {
    console.error("Error fetching delivery note summary:", error);
    res.status(500).json({
      message: "Error fetching delivery note summary",
      error: error.message,
    });
  }
};

/**
 * Get equipment off hire note summary
 */
const getEquipmentOffHireNoteSummary = async (req, res) => {
  try {
    const { equipment_ohn_id } = req.params;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      {
        include: [
          {
            model: EquipmentOffHireNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: ["so_number", "client", "project_name"],
              },
              {
                model: EquipmentModel,
                as: "previousEquipment",
                attributes: ["serial_number", "reg_number", "vehicle_type"],
              },
            ],
          },
        ],
      },
    );

    if (!offHireNote) {
      return res.status(404).json({ message: "Off hire note not found" });
    }

    // Format summary data
    const summaryData = {
      ohn_number: offHireNote.ohn_number,
      equipment: offHireNote.equipmentSwap.previousEquipment,
      status: offHireNote.status,
      trips: offHireNote.trips.map((trip) => ({
        trip_number: trip.trip_number,
        transportation: {
          company: trip.transportation_company,
          driver: trip.driver_name,
          contact: trip.driver_contact,
          vehicle: trip.vehicle_number,
        },
        trip_date: trip.trip_date,
        trip_status: trip.trip_status,
        remarks: trip.remarks,
      })),
    };

    res.status(200).json({
      success: true,
      summary: summaryData,
    });
  } catch (error) {
    console.error("Error fetching off hire note summary:", error);
    res.status(500).json({
      message: "Error fetching off hire note summary",
      error: error.message,
    });
  }
};

// ==================== STATUS MANAGEMENT FUNCTIONS ====================

/**
 * Submit equipment delivery note for approval
 */
const submitEquipmentDNForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_dn_id } = req.params;

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      { transaction },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Can only submit delivery notes in 'Creation' status",
      });
    }

    await deliveryNote.update({ status: "Under Approval" }, { transaction });

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      deliveryNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Submitted for approval successfully",
      deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting equipment DN for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Submit equipment off hire note for approval
 */
const submitEquipmentOHNForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_ohn_id } = req.params;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      { transaction },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Can only submit off hire notes in 'Creation' status",
      });
    }

    await offHireNote.update({ status: "Under Approval" }, { transaction });

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      offHireNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Submitted for approval successfully",
      offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting equipment OHN for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve equipment delivery note
 */
const approveEquipmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_dn_id } = req.params;
    const username = await getUsername(req);

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      { transaction },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Delivery note must be 'Under Approval' to approve",
      });
    }

    await deliveryNote.update(
      {
        status: "Approved",
        approved_by: username,
        approved_at: new Date(),
      },
      { transaction },
    );

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      deliveryNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note approved successfully",
      deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving equipment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve equipment off hire note
 */
const approveEquipmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_ohn_id } = req.params;
    const username = await getUsername(req);

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      { transaction },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Off hire note must be 'Under Approval' to approve",
      });
    }

    await offHireNote.update(
      {
        status: "Approved",
        approved_by: username,
        approved_at: new Date(),
      },
      { transaction },
    );

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      offHireNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note approved successfully",
      offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving equipment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject equipment delivery note
 */
const rejectEquipmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_dn_id } = req.params;
    const { reason } = req.body;

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      { transaction },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Delivery note must be 'Under Approval' to reject",
      });
    }

    await deliveryNote.update(
      {
        status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : deliveryNote.remarks,
      },
      { transaction },
    );

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      deliveryNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note rejected successfully",
      deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting equipment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject equipment off hire note
 */
const rejectEquipmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_ohn_id } = req.params;
    const { reason } = req.body;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      { transaction },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Off hire note must be 'Under Approval' to reject",
      });
    }

    await offHireNote.update(
      {
        status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : offHireNote.remarks,
      },
      { transaction },
    );

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      offHireNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note rejected successfully",
      offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting equipment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate equipment delivery note PDF data (for frontend)
 */
const generateEquipmentDNPDF = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_dn_id } = req.params;

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      {
        include: [
          {
            model: EquipmentDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: EquipmentDNEquipmentModel,
                as: "equipment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: [
                  "so_number",
                  "client",
                  "project_name",
                  "lpo_number",
                ],
              },
              {
                model: EquipmentModel,
                as: "newEquipment",
                attributes: [
                  "serial_number",
                  "reg_number",
                  "vehicle_type",
                  "description",
                ],
              },
            ],
          },
        ],
        transaction,
      },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status === "Approved") {
      await deliveryNote.update({ status: "In Progress" }, { transaction });

      // Update equipment swap statuses
      await updateEquipmentSwapStatuses(
        deliveryNote.equipment_swap_id,
        transaction,
      );
    }

    await transaction.commit();

    // Return data for frontend-side PDF generation
    res.status(200).json({
      success: true,
      data: deliveryNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating equipment DN PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate equipment off hire note PDF data (for frontend)
 */
const generateEquipmentOHNPDF = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_ohn_id } = req.params;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      {
        include: [
          {
            model: EquipmentOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: EquipmentOHNEquipmentModel,
                as: "equipment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: [
                  "so_number",
                  "client",
                  "project_name",
                  "lpo_number",
                ],
              },
              {
                model: EquipmentModel,
                as: "previousEquipment",
                attributes: [
                  "serial_number",
                  "reg_number",
                  "vehicle_type",
                  "description",
                ],
              },
            ],
          },
        ],
        transaction,
      },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status === "Approved") {
      await offHireNote.update({ status: "In Progress" }, { transaction });

      // Update equipment swap statuses
      await updateEquipmentSwapStatuses(
        offHireNote.equipment_swap_id,
        transaction,
      );
    }

    await transaction.commit();

    // Return data for frontend-side PDF generation
    res.status(200).json({
      success: true,
      data: offHireNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating equipment OHN PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close equipment delivery note
 */
const closeEquipmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_dn_id } = req.params;

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      { transaction },
    );

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (
      deliveryNote.status !== "Approved" ||
      deliveryNote.status !== "Rejected"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Only approved or rejected delivery notes can be closed",
      });
    }

    await deliveryNote.update({ status: "Close" }, { transaction });

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      deliveryNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note closed successfully",
      deliveryNote: await EquipmentDeliveryNoteModel.findByPk(equipment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing equipment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close equipment off hire note
 */
const closeEquipmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_ohn_id } = req.params;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      { transaction },
    );

    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (
      offHireNote.status !== "Approved" ||
      offHireNote.status !== "Rejected"
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Only approved or rejected off hire notes can be closed",
      });
    }

    await offHireNote.update({ status: "Close" }, { transaction });

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      offHireNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note closed successfully",
      offHireNote: await EquipmentOffHireNoteModel.findByPk(equipment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing equipment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== TRIP MANAGEMENT FUNCTIONS ====================

/**
 * Add trip to equipment delivery note
 */
// const addTripToEquipmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_dn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       equipment,
//       remarks,
//     } = req.body;

//     const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
//       equipment_dn_id,
//       { transaction },
//     );

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     // if (deliveryNote.status !== "Creation") {
//     //   await transaction.rollback();
//     //   return res.status(400).json({
//     //     message:
//     //       "Trips can only be added when delivery note is in Creation status",
//     //   });
//     // }

//     const existingTrips = await EquipmentDeliveryNoteTripModel.findAll({
//       where: { equipment_dn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per delivery note" });
//     }

//     const newTrip = await EquipmentDeliveryNoteTripModel.create(
//       {
//         equipment_dn_id,
//         trip_number: existingTrips.length + 1,
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date,
//         trip_status: "Creation",
//         remarks: remarks || null,
//       },
//       { transaction },
//     );

//     // Add equipment resources
//     if (equipment && equipment.length > 0) {
//       for (const equip of equipment) {
//         await EquipmentDNEquipmentModel.create(
//           {
//             equipment_dn_id,
//             trip_id: newTrip.trip_id,
//             serial_number: equip.serial_number,
//             reg_number: equip.reg_number,
//             equipment_type: equip.equipment_type || null,
//           },
//           { transaction },
//         );
//       }
//     }

//     // Update equipment swap statuses (note: status didn't change, but we still update to reflect latest)
//     await updateEquipmentSwapStatuses(
//       deliveryNote.equipment_swap_id,
//       transaction,
//     );

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await EquipmentDeliveryNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to equipment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

/**
 * Add trip to equipment off hire note
 */
// const addTripToEquipmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { equipment_ohn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       equipment,
//       remarks,
//     } = req.body;

//     const offHireNote = await EquipmentOffHireNoteModel.findByPk(
//       equipment_ohn_id,
//       { transaction },
//     );

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     // if (offHireNote.status !== "Creation") {
//     //   await transaction.rollback();
//     //   return res.status(400).json({
//     //     message:
//     //       "Trips can only be added when off hire note is in Creation status",
//     //   });
//     // }

//     const existingTrips = await EquipmentOffHireNoteTripModel.findAll({
//       where: { equipment_ohn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per off hire note" });
//     }

//     const newTrip = await EquipmentOffHireNoteTripModel.create(
//       {
//         equipment_ohn_id,
//         trip_number: existingTrips.length + 1,
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type: vehicle_type || null,
//         vehicle_number: vehicle_number || null,
//         recovery_vehicle_number: recovery_vehicle_number || null,
//         chargeable_type: chargeable_type || null,
//         trip_date: trip_date,
//         trip_status: "Creation",
//         remarks: remarks || null,
//       },
//       { transaction },
//     );

//     // Add equipment resources
//     if (equipment && equipment.length > 0) {
//       for (const equip of equipment) {
//         await EquipmentOHNEquipmentModel.create(
//           {
//             equipment_ohn_id,
//             trip_id: newTrip.trip_id,
//             serial_number: equip.serial_number,
//             reg_number: equip.reg_number,
//             equipment_type: equip.equipment_type || null,
//           },
//           { transaction },
//         );
//       }
//     }

//     // Update equipment swap statuses (note: status didn't change, but we still update to reflect latest)
//     await updateEquipmentSwapStatuses(
//       offHireNote.equipment_swap_id,
//       transaction,
//     );

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await EquipmentOffHireNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to equipment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// ─── Equipment Delivery Note ──────────────────────────────────────────────────
const addTripToEquipmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();
 
  try {
    const { equipment_dn_id } = req.params;
    const { trips } = req.body;
 
    if (!trips || !Array.isArray(trips) || trips.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "trips array is required" });
    }
 
    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      { transaction },
    );
 
    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }
 
    const existingTrips = await EquipmentDeliveryNoteTripModel.findAll({
      where: { equipment_dn_id },
      transaction,
    });
 
    if (existingTrips.length + trips.length > 7) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Maximum 7 trips allowed per delivery note. Currently has ${existingTrips.length}, trying to add ${trips.length}.`,
      });
    }
 
    const createdTrips = [];
 
    for (let i = 0; i < trips.length; i++) {
      const {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type,
        vehicle_number,
        recovery_vehicle_number,
        chargeable_type,
        trip_date,
        equipment,
        remarks,
      } = trips[i];
 
      const newTrip = await EquipmentDeliveryNoteTripModel.create(
        {
          equipment_dn_id,
          trip_number: existingTrips.length + i + 1,
          transportation_company,
          driver_name,
          driver_contact,
          vehicle_type: vehicle_type || null,
          vehicle_number: vehicle_number || null,
          recovery_vehicle_number: recovery_vehicle_number || null,
          chargeable_type: chargeable_type || null,
          trip_date,
          trip_status: "Creation",
          remarks: remarks || null,
        },
        { transaction },
      );
 
      if (equipment && equipment.length > 0) {
        for (const equip of equipment) {
          await EquipmentDNEquipmentModel.create(
            {
              equipment_dn_id,
              trip_id: newTrip.trip_id,
              serial_number: equip.serial_number,
              reg_number: equip.reg_number,
              equipment_type: equip.equipment_type || null,
            },
            { transaction },
          );
        }
      }
 
      createdTrips.push(newTrip.trip_id);
    }
 
    await updateEquipmentSwapStatuses(
      deliveryNote.equipment_swap_id,
      transaction,
    );
 
    await transaction.commit();
 
    const result = await EquipmentDeliveryNoteTripModel.findAll({
      where: { trip_id: createdTrips },
      include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
    });
 
    res.status(201).json({
      message: "Trips added successfully",
      trips: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trips to equipment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};
 
// ─── Equipment Off Hire Note ──────────────────────────────────────────────────
const addTripToEquipmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();
 
  try {
    const { equipment_ohn_id } = req.params;
    const { trips } = req.body;
 
    if (!trips || !Array.isArray(trips) || trips.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "trips array is required" });
    }
 
    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      { transaction },
    );
 
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }
 
    const existingTrips = await EquipmentOffHireNoteTripModel.findAll({
      where: { equipment_ohn_id },
      transaction,
    });
 
    if (existingTrips.length + trips.length > 7) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Maximum 7 trips allowed per off hire note. Currently has ${existingTrips.length}, trying to add ${trips.length}.`,
      });
    }
 
    const createdTrips = [];
 
    for (let i = 0; i < trips.length; i++) {
      const {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type,
        vehicle_number,
        recovery_vehicle_number,
        chargeable_type,
        trip_date,
        equipment,
        remarks,
      } = trips[i];
 
      const newTrip = await EquipmentOffHireNoteTripModel.create(
        {
          equipment_ohn_id,
          trip_number: existingTrips.length + i + 1,
          transportation_company,
          driver_name,
          driver_contact,
          vehicle_type: vehicle_type || null,
          vehicle_number: vehicle_number || null,
          recovery_vehicle_number: recovery_vehicle_number || null,
          chargeable_type: chargeable_type || null,
          trip_date,
          trip_status: "Creation",
          remarks: remarks || null,
        },
        { transaction },
      );
 
      if (equipment && equipment.length > 0) {
        for (const equip of equipment) {
          await EquipmentOHNEquipmentModel.create(
            {
              equipment_ohn_id,
              trip_id: newTrip.trip_id,
              serial_number: equip.serial_number,
              reg_number: equip.reg_number,
              equipment_type: equip.equipment_type || null,
            },
            { transaction },
          );
        }
      }
 
      createdTrips.push(newTrip.trip_id);
    }
 
    await updateEquipmentSwapStatuses(
      offHireNote.equipment_swap_id,
      transaction,
    );
 
    await transaction.commit();
 
    const result = await EquipmentOffHireNoteTripModel.findAll({
      where: { trip_id: createdTrips },
      include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
    });
 
    res.status(201).json({
      message: "Trips added successfully",
      trips: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trips to equipment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update trip in equipment delivery note
 */
const updateTripInEquipmentDN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const {
      transportation_company,
      driver_name,
      driver_contact,
      vehicle_type,
      vehicle_number,
      recovery_vehicle_number,
      chargeable_type,
      trip_date,
      equipment,
      remarks,
    } = req.body;

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot edit trip — delivery note is in '${trip.deliveryNote.status}' status`,
      });
    }

    await trip.update(
      {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type: vehicle_type || null,
        vehicle_number: vehicle_number || null,
        recovery_vehicle_number: recovery_vehicle_number || null,
        chargeable_type: chargeable_type || null,
        trip_date: trip_date,
        remarks: remarks || null,
      },
      { transaction },
    );

    // Replace equipment resources
    if (equipment !== undefined) {
      await EquipmentDNEquipmentModel.destroy({
        where: { trip_id },
        transaction,
      });

      if (equipment.length > 0) {
        for (const equip of equipment) {
          await EquipmentDNEquipmentModel.create(
            {
              equipment_dn_id: trip.equipment_dn_id,
              trip_id,
              serial_number: equip.serial_number,
              reg_number: equip.reg_number,
              equipment_type: equip.equipment_type || null,
            },
            { transaction },
          );
        }
      }
    }

    // Update equipment swap statuses (note: status didn't change, but we still update to reflect latest)
    await updateEquipmentSwapStatuses(
      trip.deliveryNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in equipment DN:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update trip in equipment off hire note
 */
const updateTripInEquipmentOHN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const {
      transportation_company,
      driver_name,
      driver_contact,
      vehicle_type,
      vehicle_number,
      recovery_vehicle_number,
      chargeable_type,
      trip_date,
      equipment,
      remarks,
    } = req.body;

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot edit trip — off hire note is in '${trip.offHireNote.status}' status`,
      });
    }

    await trip.update(
      {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type: vehicle_type || null,
        vehicle_number: vehicle_number || null,
        recovery_vehicle_number: recovery_vehicle_number || null,
        chargeable_type: chargeable_type || null,
        trip_date: trip_date,
        remarks: remarks || null,
      },
      { transaction },
    );

    // Replace equipment resources
    if (equipment !== undefined) {
      await EquipmentOHNEquipmentModel.destroy({
        where: { trip_id },
        transaction,
      });

      if (equipment.length > 0) {
        for (const equip of equipment) {
          await EquipmentOHNEquipmentModel.create(
            {
              equipment_ohn_id: trip.equipment_ohn_id,
              trip_id,
              serial_number: equip.serial_number,
              reg_number: equip.reg_number,
              equipment_type: equip.equipment_type || null,
            },
            { transaction },
          );
        }
      }
    }

    // Update equipment swap statuses (note: status didn't change, but we still update to reflect latest)
    await updateEquipmentSwapStatuses(
      trip.offHireNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in equipment OHN:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete trip from equipment delivery note
 */
const deleteTripFromEquipmentDN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Trips can only be deleted when delivery note is in Creation status",
      });
    }

    const equipmentSwapId = trip.deliveryNote.equipment_swap_id;
    await trip.destroy({ transaction });

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(equipmentSwapId, transaction);

    await transaction.commit();

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete trip from equipment off hire note
 */
const deleteTripFromEquipmentOHN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Trips can only be deleted when off hire note is in Creation status",
      });
    }

    const equipmentSwapId = trip.offHireNote.equipment_swap_id;
    await trip.destroy({ transaction });

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(equipmentSwapId, transaction);

    await transaction.commit();

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== UPLOAD FUNCTIONS ====================

/**
 * Upload equipment delivery note attachment
 */
const uploadEquipmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_dn_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    const deliveryNote = await EquipmentDeliveryNoteModel.findByPk(
      equipment_dn_id,
      { transaction },
    );

    if (!deliveryNote) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    await deliveryNote.update(
      {
        delivery_attachment: fileName,
        status: "Completed",
        uploaded_by: username || "System",
        uploaded_at: new Date(),
      },
      { transaction },
    );

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      deliveryNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Signed delivery note uploaded successfully",
      fileName,
      status: "Completed",
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading equipment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload equipment off hire note attachment
 */
const uploadEquipmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_ohn_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      { transaction },
    );

    if (!offHireNote) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    await offHireNote.update(
      {
        off_hire_attachment: fileName,
        status: "Completed",
        uploaded_by: username || "System",
        uploaded_at: new Date(),
      },
      { transaction },
    );

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(
      offHireNote.equipment_swap_id,
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Signed off hire note uploaded successfully",
      fileName,
      status: "Completed",
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading equipment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload equipment delivery note checklist
 */
const uploadEquipmentDNChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id, resource_id } = req.params;
    const file = req.file;
    const username = await getUsername(req);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resource = await EquipmentDNEquipmentModel.findOne({
      where: { id: resource_id, trip_id },
      transaction,
    });

    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Equipment resource not found in this trip" });
    }

    await EquipmentDNEquipmentModel.update(
      {
        checklist_file_path: file.path,
        checklist_file_name: file.originalname,
        checklist_uploaded_at: new Date(),
        checklist_uploaded_by: username || "System",
      },
      { where: { id: resource_id, trip_id }, transaction },
    );

    // Get the delivery note to update swap statuses
    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (trip && trip.deliveryNote) {
      await updateEquipmentSwapStatuses(
        trip.deliveryNote.equipment_swap_id,
        transaction,
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Checklist uploaded successfully",
      file: {
        path: file.path,
        name: file.originalname,
        uploaded_at: new Date(),
        uploaded_by: username || "System",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading equipment DN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload equipment off hire note checklist
 */
const uploadEquipmentOHNChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id, resource_id } = req.params;
    const file = req.file;
    const username = await getUsername(req);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resource = await EquipmentOHNEquipmentModel.findOne({
      where: { id: resource_id, trip_id },
      transaction,
    });

    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Equipment resource not found in this trip" });
    }

    await EquipmentOHNEquipmentModel.update(
      {
        checklist_file_path: file.path,
        checklist_file_name: file.originalname,
        checklist_uploaded_at: new Date(),
        checklist_uploaded_by: username || "System",
      },
      { where: { id: resource_id, trip_id }, transaction },
    );

    // Get the off hire note to update swap statuses
    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (trip && trip.offHireNote) {
      await updateEquipmentSwapStatuses(
        trip.offHireNote.equipment_swap_id,
        transaction,
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Checklist uploaded successfully",
      file: {
        path: file.path,
        name: file.originalname,
        uploaded_at: new Date(),
        uploaded_by: username || "System",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading equipment OHN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Download equipment delivery note checklist
 */
const downloadEquipmentDNChecklist = async (req, res) => {
  try {
    const { trip_id, resource_id } = req.params;

    const resource = await EquipmentDNEquipmentModel.findOne({
      where: { id: resource_id, trip_id },
    });

    if (!resource) {
      return res.status(404).json({ message: "Equipment resource not found" });
    }

    if (!resource.checklist_file_path || !resource.checklist_file_name) {
      return res
        .status(404)
        .json({ message: "No checklist found for this resource" });
    }

    if (!fs.existsSync(resource.checklist_file_path)) {
      return res
        .status(404)
        .json({ message: "Checklist file not found on server" });
    }

    res.download(
      resource.checklist_file_path,
      resource.checklist_file_name,
      (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading checklist file" });
        }
      },
    );
  } catch (error) {
    console.error("Error downloading equipment DN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Download equipment off hire note checklist
 */
const downloadEquipmentOHNChecklist = async (req, res) => {
  try {
    const { trip_id, resource_id } = req.params;

    const resource = await EquipmentOHNEquipmentModel.findOne({
      where: { id: resource_id, trip_id },
    });

    if (!resource) {
      return res.status(404).json({ message: "Equipment resource not found" });
    }

    if (!resource.checklist_file_path || !resource.checklist_file_name) {
      return res
        .status(404)
        .json({ message: "No checklist found for this resource" });
    }

    if (!fs.existsSync(resource.checklist_file_path)) {
      return res
        .status(404)
        .json({ message: "Checklist file not found on server" });
    }

    res.download(
      resource.checklist_file_path,
      resource.checklist_file_name,
      (err) => {
        if (err) {
          console.error("Error downloading file:", err);
          res.status(500).json({ message: "Error downloading checklist file" });
        }
      },
    );
  } catch (error) {
    console.error("Error downloading equipment OHN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== SWAP REQUEST MANAGEMENT ====================

const submitEquipmentSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_swap_id } = req.params;
    const { mobilization_charge, demobilization_charge } = req.body;

    // Validate required fields
    if (!mobilization_charge || !demobilization_charge) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Mobilization and demobilization charges are mandatory",
      });
    }

    const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
      transaction,
    });

    if (!equipmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Equipment swap not found" });
    }

    // Update swap status and charges
    await equipmentSwap.update(
      {
        swap_status:
          equipmentSwap.swap_status === "Return" ? "Resubmit" : "Swap Request",
        mobilization_charge: parseFloat(mobilization_charge),
        demobilization_charge: parseFloat(demobilization_charge),
        return_reason: null, // Clear return reason on submit/resubmit
      },
      { transaction },
    );

    await SalesOrdersModel.update(
      { has_pending_swap_request: true },
      { where: { id: equipmentSwap.sales_order_id } },
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Equipment swap submitted successfully",
      equipmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting equipment swap:", error);
    res.status(500).json({
      message: "Error submitting equipment swap",
      error: error.message,
    });
  }
};

const returnEquipmentSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_swap_id } = req.params;
    const { return_reason } = req.body;

    if (!return_reason || !return_reason.trim()) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Return reason is required",
      });
    }

    const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
      transaction,
    });

    if (!equipmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Equipment swap not found" });
    }

    // Update swap status to Return
    await equipmentSwap.update(
      {
        swap_status: "Return",
        return_reason: return_reason.trim(),
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Equipment swap returned successfully",
      equipmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error returning equipment swap:", error);
    res.status(500).json({
      message: "Error returning equipment swap",
      error: error.message,
    });
  }
};

const approveEquipmentSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_swap_id } = req.params;

    const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
      transaction,
    });

    if (!equipmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Equipment swap not found" });
    }

    // Update swap status to Approved
    await equipmentSwap.update(
      {
        swap_status: "Approved",
      },
      { transaction },
    );

    // Check if any pending swaps remain for this sales order
    const EquipmentSwapModel = require("../models/EquipmentSwapModel");

    const equipmentSwaps = await EquipmentSwapModel.count({
      where: {
        sales_order_id: equipmentSwap.sales_order_id,
        swap_status: {
          [Op.in]: ["Swap Request", "Return", "Resubmit"],
        },
      },
      transaction,
    });

    const hasPendingSwaps = equipmentSwaps > 0;

    await SalesOrdersModel.update(
      { has_pending_swap_request: hasPendingSwaps },
      {
        where: { id: equipmentSwap.sales_order_id },
        transaction,
      },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Equipment swap approved successfully",
      equipmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving equipment swap:", error);
    res.status(500).json({
      message: "Error approving equipment swap",
      error: error.message,
    });
  }
};

const rejectEquipmentSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { equipment_swap_id } = req.params;
    const { rejection_reason } = req.body;

    const equipmentSwap = await EquipmentSwapModel.findByPk(equipment_swap_id, {
      transaction,
    });

    if (!equipmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Equipment swap not found" });
    }

    // Update swap status to Rejected
    await equipmentSwap.update(
      {
        swap_status: "Rejected",
        return_reason: rejection_reason || "Rejected by approver",
      },
      { transaction },
    );

    // Check if any pending swaps remain for this sales order
    const EquipmentSwapModel = require("../models/EquipmentSwapModel");

    const equipmentSwaps = await EquipmentSwapModel.count({
      where: {
        sales_order_id: equipmentSwap.sales_order_id,
        swap_status: {
          [Op.in]: ["Swap Request", "Return", "Resubmit"],
        },
      },
      transaction,
    });

    const hasPendingSwaps = equipmentSwaps > 0;

    await SalesOrdersModel.update(
      { has_pending_swap_request: hasPendingSwaps },
      {
        where: { id: equipmentSwap.sales_order_id },
        transaction,
      },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Equipment swap rejected successfully",
      equipmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting equipment swap:", error);
    res.status(500).json({
      message: "Error rejecting equipment swap",
      error: error.message,
    });
  }
};

// ==================== LEGACY PDF GENERATION (keep for backward compatibility) ====================

const generateEquipmentDeliveryNotePDF = async (req, res) => {
  // Legacy function - delegates to the newer implementation
  return generateEquipmentDNPDF(req, res);
};

const generateEquipmentOffHireNotePDF = async (req, res) => {
  // Legacy function - keep existing implementation or delegate
  try {
    const { equipment_ohn_id } = req.params;

    const offHireNote = await EquipmentOffHireNoteModel.findByPk(
      equipment_ohn_id,
      {
        include: [
          {
            model: EquipmentOffHireNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: EquipmentSwapModel,
            as: "equipmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: [
                  "so_number",
                  "client",
                  "project_name",
                  "ordered_date",
                  "lpo_number",
                ],
              },
              {
                model: EquipmentModel,
                as: "previousEquipment",
                attributes: [
                  "serial_number",
                  "reg_number",
                  "vehicle_type",
                  "description",
                ],
              },
            ],
          },
        ],
      },
    );

    if (!offHireNote) {
      return res.status(404).json({ message: "Off hire note not found" });
    }

    // Update status to In Progress when PDF is generated
    await offHireNote.update({ status: "In Progress" });

    // Update equipment swap statuses
    await updateEquipmentSwapStatuses(offHireNote.equipment_swap_id);

    // Also update trips status
    await EquipmentOffHireNoteTripModel.update(
      { trip_status: "In Progress" },
      {
        where: { equipment_ohn_id, trip_status: "Creation" },
      },
    );

    // Generate PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="OHN-${offHireNote.ohn_number}.pdf"`,
    );

    doc.pipe(res);

    // Add border to page
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

    // Company Header with Red Background
    doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#DC2626", "#DC2626");

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#FFFFFF")
      .text("Auto Xpert Trading and Service WLL", 50, 55, { align: "center" })
      .fontSize(9)
      .font("Helvetica")
      .text(
        "Office No 11, 2nd Floor, Building No.207, Street 995, Zone 56",
        50,
        82,
        { align: "center" },
      )
      .text("Doha, Qatar | Tel: 44581071 | Email: info@autoxpert.qa", 50, 95, {
        align: "center",
      });

    doc.fillColor("#000000");

    // Document Title
    doc.moveDown(3);
    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#DC2626")
      .text("EQUIPMENT OFF HIRE NOTE", { align: "center" })
      .fillColor("#000000");

    doc.moveDown(1);
    doc
      .moveTo(100, doc.y)
      .lineTo(pageWidth - 100, doc.y)
      .stroke("#DC2626");
    doc.moveDown(1);

    // Two Column Layout for Details
    const leftX = 50;
    const rightX = 320;
    const startY = doc.y;

    // Left Column - Client Address
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
    doc.text("CLIENT INFORMATION", leftX, startY);
    doc.fillColor("#000000");

    doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
    doc.fontSize(10).font("Helvetica");
    doc.text(
      offHireNote.equipmentSwap.salesOrder.client,
      leftX + 10,
      startY + 30,
      { width: 220 },
    );

    // Right Column - Document Details
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
    doc.text("DOCUMENT DETAILS", rightX, startY);
    doc.fillColor("#000000");

    const detailsY = startY + 20;
    doc.rect(rightX, detailsY, 240, 90).stroke("#CCCCCC");

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Off Hire Note No.:", rightX + 10, detailsY + 10);
    doc.text("Order Reference No.:", rightX + 10, detailsY + 50);
    doc.text("Project Name:", rightX + 10, detailsY + 70);

    doc.font("Helvetica");
    doc.text(offHireNote.ohn_number, rightX + 130, detailsY + 10);
    doc.text(
      offHireNote.equipmentSwap.salesOrder.so_number,
      rightX + 130,
      detailsY + 50,
    );
    doc.text(
      offHireNote.equipmentSwap.salesOrder.project_name || "N/A",
      rightX + 130,
      detailsY + 70,
      { width: 100 },
    );

    doc.y = startY + 120;
    doc.moveDown(1);

    // Equipment Details Section
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
    doc
      .rect(leftX, doc.y, pageWidth - 100, 20)
      .fillAndStroke("#DC2626", "#DC2626");
    doc.text("EQUIPMENT DETAILS", leftX + 10, doc.y + 5);

    doc.fillColor("#000000");
    doc.moveDown(1.5);

    const equipY = doc.y;

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Plate Number:", leftX + 10, equipY + 10);
    doc.text("Vehicle Type:", leftX + 10, equipY + 30);
    doc.text("Serial Number:", leftX + 10, equipY + 50);

    doc.font("Helvetica");
    doc.text(
      offHireNote.equipmentSwap.previousEquipment.reg_number,
      leftX + 120,
      equipY + 10,
    );
    doc.text(
      offHireNote.equipmentSwap.previousEquipment.vehicle_type,
      leftX + 120,
      equipY + 30,
    );
    doc.text(
      offHireNote.equipmentSwap.previousEquipment.serial_number,
      leftX + 120,
      equipY + 50,
    );

    doc.y = equipY + 80;
    doc.moveDown(1);

    // Transportation Details
    if (offHireNote.trips && offHireNote.trips.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc
        .rect(leftX, doc.y, pageWidth - 100, 20)
        .fillAndStroke("#DC2626", "#DC2626");
      doc.text("TRANSPORTATION DETAILS", leftX + 10, doc.y + 5);

      doc.fillColor("#000000");
      doc.moveDown(1.5);

      offHireNote.trips.forEach((trip, index) => {
        const tripY = doc.y;
        const tripHeight = 100;

        // Add new page if needed
        if (tripY + tripHeight > pageHeight - 100) {
          doc.addPage();
          doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
          doc.y = 50;
        }

        doc.fontSize(10).font("Helvetica-Bold").fillColor("#DC2626");
        doc.text(`Trip ${trip.trip_number}`, leftX + 10, doc.y + 10);
        doc.fillColor("#000000");

        const tripDetailsY = doc.y + 30;
        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("Company:", leftX + 10, tripDetailsY);
        doc.text("Driver:", leftX + 10, tripDetailsY + 15);
        doc.text("Contact:", leftX + 10, tripDetailsY + 30);
        doc.text("Vehicle Type:", leftX + 10, tripDetailsY + 45);
        doc.text("Vehicle No.:", leftX + 10, tripDetailsY + 60);

        doc.font("Helvetica");
        doc.text(trip.transportation_company, leftX + 100, tripDetailsY, {
          width: 200,
        });
        doc.text(trip.driver_name, leftX + 100, tripDetailsY + 15);
        doc.text(trip.driver_contact, leftX + 100, tripDetailsY + 30);
        doc.text(trip.vehicle_type || "N/A", leftX + 100, tripDetailsY + 45);
        doc.text(trip.vehicle_number || "N/A", leftX + 100, tripDetailsY + 60);

        if (trip.trip_date) {
          doc.font("Helvetica-Bold");
          doc.text("Trip Date:", rightX, tripDetailsY);
          doc.font("Helvetica");
          doc.text(
            new Date(trip.trip_date).toLocaleDateString("en-GB"),
            rightX + 80,
            tripDetailsY,
          );
        }

        doc.y += tripHeight + 10;
      });
    }

    // Remarks Section
    if (offHireNote.remarks) {
      doc.moveDown(1);
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#DC2626");
      doc.text("REMARKS", leftX);
      doc.fillColor("#000000");

      doc.fontSize(9).font("Helvetica");
      doc.rect(leftX, doc.y + 5, pageWidth - 100, 40).stroke("#CCCCCC");
      doc.text(offHireNote.remarks, leftX + 10, doc.y + 15, {
        width: pageWidth - 120,
      });
      doc.y += 50;
    }

    doc.moveDown(2);

    // Acknowledgement Box
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
    doc.text(
      "We acknowledge that the equipment has been returned in good condition.",
      leftX + 10,
      doc.y + 10,
      { width: pageWidth - 120, align: "center" },
    );

    doc.moveDown(3);

    // Signature Section
    const sigY = doc.y;

    // Check if we need a new page
    if (sigY + 120 > pageHeight - 60) {
      doc.addPage();
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();
      doc.y = 50;
    }

    doc.fontSize(10).font("Helvetica-Bold");

    // Left signature
    doc.text("Received By:", leftX, doc.y);
    doc
      .moveTo(leftX, doc.y + 50)
      .lineTo(leftX + 200, doc.y + 50)
      .stroke();
    doc.font("Helvetica").fontSize(8);
    doc.text("Name & Signature", leftX, doc.y + 55);

    // Right signature
    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Date:", rightX, sigY);
    doc
      .moveTo(rightX, sigY + 50)
      .lineTo(rightX + 200, sigY + 50)
      .stroke();
    doc.font("Helvetica").fontSize(8);
    doc.text("DD/MM/YYYY", rightX, sigY + 55);

    doc.moveDown(4);

    // Contact section
    doc.text("Contact No.:", leftX, doc.y);
    doc
      .moveTo(leftX, doc.y + 50)
      .lineTo(leftX + 200, doc.y + 50)
      .stroke();

    // Footer
    doc.fontSize(7).font("Helvetica-Oblique").fillColor("#666666");
    doc.text(
      "This is a computer generated document. No signature is required.",
      0,
      pageHeight - 50,
      { align: "center", width: pageWidth },
    );

    doc.end();
  } catch (error) {
    console.error("Error generating off hire note PDF:", error);
    res.status(500).json({
      message: "Error generating off hire note PDF",
      error: error.message,
    });
  }
};

/**
 * Submit a single DN trip for approval
 */
const submitDNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip can only be submitted from 'Creation' status. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Under Approval" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.deliveryNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "DN Trip submitted for approval successfully",
      trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting DN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve a single DN trip
 */
const approveDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to approve. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Approved" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.deliveryNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "DN Trip approved successfully",
      trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject a single DN trip
 */
const rejectDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to reject. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction },
    );
    await updateEquipmentSwapStatuses(
      trip.deliveryNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "DN Trip rejected successfully",
      trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate PDF for a single DN trip (moves trip to In Progress)
 */
const generateDNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: EquipmentDNEquipmentModel,
          as: "equipment",
        },
        {
          model: EquipmentDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: EquipmentSwapModel,
              as: "equipmentSwap",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: [
                    "so_number",
                    "client",
                    "project_name",
                    "lpo_number",
                  ],
                },
                {
                  model: EquipmentModel,
                  as: "newEquipment",
                  attributes: [
                    "serial_number",
                    "reg_number",
                    "vehicle_type",
                    "description",
                  ],
                },
              ],
            },
          ],
        },
      ],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status === "Approved") {
      await trip.update({ trip_status: "In Progress" }, { transaction });
      await updateEquipmentSwapStatuses(
        trip.deliveryNote.equipment_swap_id,
        transaction,
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating DN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Complete a single DN trip (upload signed doc → Completed)
 */
const completeDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'In Progress' to complete. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Completed" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.deliveryNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "DN Trip completed successfully",
      trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close a single DN trip
 */
const closeDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    const closableStatuses = ["Completed", "Rejected"];
    if (!closableStatuses.includes(trip.trip_status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Only 'Completed' or 'Rejected' trips can be closed. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.deliveryNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "DN Trip closed successfully",
      trip: await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentDNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Submit a single OHN trip for approval
 */
const submitOHNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip can only be submitted from 'Creation' status. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Under Approval" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.offHireNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "OHN Trip submitted for approval successfully",
      trip: await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting OHN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve a single OHN trip
 */
const approveOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to approve. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Approved" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.offHireNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "OHN Trip approved successfully",
      trip: await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject a single OHN trip
 */
const rejectOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to reject. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction },
    );
    await updateEquipmentSwapStatuses(
      trip.offHireNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "OHN Trip rejected successfully",
      trip: await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate PDF for a single OHN trip (moves trip to In Progress)
 */
const generateOHNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: EquipmentOHNEquipmentModel,
          as: "equipment",
        },
        {
          model: EquipmentOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: EquipmentSwapModel,
              as: "equipmentSwap",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: [
                    "so_number",
                    "client",
                    "project_name",
                    "lpo_number",
                  ],
                },
                {
                  model: EquipmentModel,
                  as: "previousEquipment",
                  attributes: [
                    "serial_number",
                    "reg_number",
                    "vehicle_type",
                    "description",
                  ],
                },
              ],
            },
          ],
        },
      ],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status === "Approved") {
      await trip.update({ trip_status: "In Progress" }, { transaction });
      await updateEquipmentSwapStatuses(
        trip.offHireNote.equipment_swap_id,
        transaction,
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating OHN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Complete a single OHN trip
 */
const completeOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'In Progress' to complete. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Completed" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.offHireNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "OHN Trip completed successfully",
      trip: await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close a single OHN trip
 */
const closeOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: EquipmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    const closableStatuses = ["Completed", "Rejected"];
    if (!closableStatuses.includes(trip.trip_status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Only 'Completed' or 'Rejected' trips can be closed. Current status: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });
    await updateEquipmentSwapStatuses(
      trip.offHireNote.equipment_swap_id,
      transaction,
    );
    await transaction.commit();

    res.status(200).json({
      message: "OHN Trip closed successfully",
      trip: await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: EquipmentOHNEquipmentModel, as: "equipment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload delivery note document to a specific equipment DN trip
 */
const uploadEquipmentDeliveryNoteToTrip = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    // Find the trip
    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: EquipmentDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: EquipmentSwapModel,
              as: "equipmentSwap"
            }
          ]
        }
      ],
      transaction,
    });

    if (!trip) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update trip with delivery note attachment
    await trip.update(
      {
        delivery_attachment: fileName,
        delivery_attachment_uploaded_by: username || "System",
        delivery_attachment_uploaded_at: new Date(),
        trip_status: "Completed"
      },
      { transaction },
    );

    // Update equipment swap statuses
    if (trip.deliveryNote && trip.deliveryNote.equipmentSwap) {
      await updateEquipmentSwapStatuses(
        trip.deliveryNote.equipment_swap_id,
        transaction
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Delivery note uploaded to trip successfully",
      fileName,
      trip_id,
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading delivery note to trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload off hire note document to a specific equipment OHN trip
 */
const uploadEquipmentOffHireNoteToTrip = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    // Find the trip
    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: EquipmentOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: EquipmentSwapModel,
              as: "equipmentSwap"
            }
          ]
        }
      ],
      transaction,
    });

    if (!trip) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    // Update trip with off hire note attachment
    await trip.update(
      {
        off_hire_attachment: fileName,
        off_hire_attachment_uploaded_by: username || "System",
        off_hire_attachment_uploaded_at: new Date(),
        trip_status: "Completed"
      },
      { transaction },
    );

    // Update equipment swap statuses
    if (trip.offHireNote && trip.offHireNote.equipmentSwap) {
      await updateEquipmentSwapStatuses(
        trip.offHireNote.equipment_swap_id,
        transaction
      );
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Off hire note uploaded to trip successfully",
      fileName,
      trip_id,
    });
  } catch (error) {
    await transaction.rollback();
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error("Error uploading off hire note to trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate delivery note PDF for a specific equipment DN trip
 */
const generateEquipmentDeliveryNotePDFForTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: EquipmentDNEquipmentModel,
          as: "equipment",
        },
        {
          model: EquipmentDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: EquipmentSwapModel,
              as: "equipmentSwap",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: [
                    "so_number",
                    "client",
                    "project_name",
                    "lpo_number",
                  ],
                },
                {
                  model: EquipmentModel,
                  as: "newEquipment",
                  attributes: [
                    "serial_number",
                    "reg_number",
                    "vehicle_type",
                    "description",
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status === "Approved") {
      await trip.update({ trip_status: "In Progress" });
      if (trip.deliveryNote && trip.deliveryNote.equipmentSwap) {
        await updateEquipmentSwapStatuses(trip.deliveryNote.equipment_swap_id);
      }
    }

    // Return data for frontend-side PDF generation
    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error generating equipment DN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate off hire note PDF for a specific equipment OHN trip
 */
const generateEquipmentOffHireNotePDFForTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    const trip = await EquipmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: EquipmentOHNEquipmentModel,
          as: "equipment",
        },
        {
          model: EquipmentOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: EquipmentSwapModel,
              as: "equipmentSwap",
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: [
                    "so_number",
                    "client",
                    "project_name",
                    "lpo_number",
                  ],
                },
                {
                  model: EquipmentModel,
                  as: "previousEquipment",
                  attributes: [
                    "serial_number",
                    "reg_number",
                    "vehicle_type",
                    "description",
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status === "Approved") {
      await trip.update({ trip_status: "In Progress" });
      if (trip.offHireNote && trip.offHireNote.equipmentSwap) {
        await updateEquipmentSwapStatuses(trip.offHireNote.equipment_swap_id);
      }
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error generating equipment OHN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  // Equipment Tag Numbers
  getAllEquipmentTagNumbers,
  getEquipmentSwapReasons,

  // Swap Creation & Retrieval
  createEquipmentSwap,
  getEquipmentSwapById,

  // Delivery Note Functions
  createEquipmentDeliveryNote,
  getEquipmentDeliveryNoteById,
  getLatestEquipmentDeliveryNote,
  getEquipmentDeliveryNoteSummary,
  submitEquipmentDNForApproval,
  approveEquipmentDeliveryNote,
  rejectEquipmentDeliveryNote,
  generateEquipmentDeliveryNotePDF,
  generateEquipmentDNPDF,
  closeEquipmentDeliveryNote,
  uploadEquipmentDeliveryNote,
  addTripToEquipmentDeliveryNote,
  updateTripInEquipmentDN,
  deleteTripFromEquipmentDN,
  uploadEquipmentDNChecklist,
  downloadEquipmentDNChecklist,

  // Off Hire Note Functions
  createEquipmentOffHireNote,
  getEquipmentOffHireNoteById,
  getLatestEquipmentOffHireNote,
  getEquipmentOffHireNoteSummary,
  submitEquipmentOHNForApproval,
  approveEquipmentOffHireNote,
  rejectEquipmentOffHireNote,
  generateEquipmentOffHireNotePDF,
  generateEquipmentOHNPDF,
  closeEquipmentOffHireNote,
  uploadEquipmentOffHireNote,
  addTripToEquipmentOffHireNote,
  updateTripInEquipmentOHN,
  deleteTripFromEquipmentOHN,
  uploadEquipmentOHNChecklist,
  downloadEquipmentOHNChecklist,

  // Swap Request Management
  submitEquipmentSwapRequest,
  returnEquipmentSwapRequest,
  approveEquipmentSwap,
  rejectEquipmentSwap,
  getSwapRequestCounts,

  // Helper function (exported for potential external use)
  updateEquipmentSwapStatuses,

  // DN Trip Status
  submitDNTripForApproval,
  approveDNTrip,
  rejectDNTrip,
  generateDNTripPDF,
  completeDNTrip,
  closeDNTrip,
  generateEquipmentDeliveryNotePDFForTrip,
  uploadEquipmentDeliveryNoteToTrip,

  // OHN Trip Status
  submitOHNTripForApproval,
  approveOHNTrip,
  rejectOHNTrip,
  generateOHNTripPDF,
  completeOHNTrip,
  closeOHNTrip,
  generateEquipmentOffHireNotePDFForTrip,
  uploadEquipmentOffHireNoteToTrip,
};
