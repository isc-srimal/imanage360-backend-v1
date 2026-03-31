// const {
//   OffHireNoteModel,
//   OffHireNoteTripModel,
//   OffHireNoteEquipmentModel,
//   OffHireNoteManpowerModel,
//   OffHireNoteAttachmentModel,
// } = require("../../models/fleet-management/OffHireNoteModel");
// const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// const {
//   ActiveAllocationModel,
//   AllocationEquipmentModel,
//   AllocationManpowerModel,
//   AllocationAttachmentModel,
// } = require("../../models/fleet-management/ActiveAllocationsOriginalModel");
// const sequelize = require("../../config/dbSync");
// const { Op } = require("sequelize");
// const fs = require("fs");
// const path = require("path");
// const UsersModel = require("../../models/user-security-management/UsersModel");

// // Generate OHN Number
// const generateOHNNumber = async () => {
//   const currentYear = new Date().getFullYear();
//   const prefix = `OHN-${currentYear}-`;

//   const lastOHN = await OffHireNoteModel.findOne({
//     where: {
//       ohn_number: {
//         [Op.like]: `${prefix}%`,
//       },
//     },
//     order: [["ohn_number", "DESC"]],
//   });

//   let nextNumber = 1;
//   if (lastOHN) {
//     const lastNumber = parseInt(lastOHN.ohn_number.split("-")[2]);
//     nextNumber = lastNumber + 1;
//   }

//   return `${prefix}${String(nextNumber).padStart(4, "0")}`;
// };

// const createOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       sales_order_id,
//       allocation_id,
//       trips,
//       remarks,
//     } = req.body;

//     const allocation = await ActiveAllocationModel.findByPk(allocation_id, {
//       include: [
//         {
//           model: AllocationEquipmentModel,
//           as: "equipmentAllocations",
//           where: { is_selected: true },
//           required: false,
//         },
//         {
//           model: AllocationManpowerModel,
//           as: "manpowerAllocations",
//           where: { is_selected: true },
//           required: false,
//         },
//         {
//           model: AllocationAttachmentModel,
//           as: "attachmentAllocations",
//           where: { is_selected: true },
//           required: false,
//         },
//       ],
//     });

//     if (!allocation) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Allocation not found" });
//     }

//     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
//     if (!salesOrder) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Sales order not found" });
//     }

//     const ohn_number = await generateOHNNumber();

//     if (req.user?.uid) {
//       const user = await UsersModel.findByPk(req.user.uid);
//       if (user) {
//         username = user.username;
//       }
//     }

//     const offHireNote = await OffHireNoteModel.create(
//       {
//         ohn_number,
//         sales_order_id,
//         allocation_id,
//         client_name: salesOrder.client,
//         project_name: salesOrder.project_name,
//         delivery_address: salesOrder.delivery_address,
//         status: "Creation",
//         remarks,
//         created_by: username || "iteq-admin",
//       },
//       { transaction }
//     );

//     if (trips && trips.length > 0) {
//       for (const trip of trips) {
//         const tripRecord = await OffHireNoteTripModel.create(
//           {
//             ohn_id: offHireNote.ohn_id,
//             trip_number: trip.trip_number,
//             trip_date: trip.trip_date,
//             transportation_company: trip.transportation_company,
//             driver_name: trip.driver_name,
//             driver_contact: trip.driver_contact,
//             vehicle_type: trip.vehicle_type,
//             vehicle_number: trip.vehicle_number,
//             recovery_vehicle_number: trip.recovery_vehicle_number,
//             chargeable_type: trip.chargeable_type || "Demobilization",
//             trip_status: "Creation",
//             remarks: trip.remarks,
//             prechecklist_id: trip.prechecklist_id || null,
//             client_checklist_id: trip.client_checklist_id || null,
//           },
//           { transaction }
//         );

//         if (trip.equipment && trip.equipment.length > 0) {
//           for (const equip of trip.equipment) {
//             await OffHireNoteEquipmentModel.create(
//               {
//                 ohn_id: offHireNote.ohn_id,
//                 trip_id: tripRecord.trip_id,
//                 serial_number: equip.serial_number,
//                 reg_number: equip.reg_number,
//                 equipment_type: equip.equipment_type,
//                 condition: equip.condition || "Good",
//                 damage_description: equip.damage_description || null,
//               },
//               { transaction }
//             );
//           }
//         }

//         if (trip.manpower && trip.manpower.length > 0) {
//           for (const mp of trip.manpower) {
//             await OffHireNoteManpowerModel.create(
//               {
//                 ohn_id: offHireNote.ohn_id,
//                 trip_id: tripRecord.trip_id,
//                 employee_id: mp.employee_id,
//                 employee_no: mp.employee_no,
//                 employee_name: mp.employee_name,
//                 return_status: mp.return_status || "Returned",
//               },
//               { transaction }
//             );
//           }
//         }

//         if (trip.attachments && trip.attachments.length > 0) {
//           for (const attach of trip.attachments) {
//             await OffHireNoteAttachmentModel.create(
//               {
//                 ohn_id: offHireNote.ohn_id,
//                 trip_id: tripRecord.trip_id,
//                 attachment_id: attach.attachment_id,
//                 attachment_number: attach.attachment_number,
//                 attachment_type: attach.attachment_type,
//                 condition: attach.condition || "Good",
//                 damage_description: attach.damage_description || null,
//               },
//               { transaction }
//             );
//           }
//         }
//       }
//     }

//     await ActiveAllocationModel.update(
//       { status: "Off Hire Note Created" },
//       {
//         where: { allocation_id },
//         transaction,
//       }
//     );

//     await transaction.commit();

//     const createdOffHireNote = await OffHireNoteModel.findByPk(
//       offHireNote.ohn_id,
//       {
//         include: [
//           {
//             model: OffHireNoteTripModel,
//             as: "trips",
//             include: [
//               { model: OffHireNoteEquipmentModel, as: "equipment" },
//               { model: OffHireNoteManpowerModel, as: "manpower" },
//               { model: OffHireNoteAttachmentModel, as: "attachments" },
//             ],
//           },
//         ],
//       }
//     );

//     res.status(201).json({
//       message: "Off hire note created successfully",
//       offHireNote: createdOffHireNote,
//       updatedOrderStatus: "Off Hire Note",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getOffHireNoteSummary = async (req, res) => {
//   try {
//     const { ohn_id } = req.params;

//     const offHireNote = await OffHireNoteModel.findByPk(ohn_id, {
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//         {
//           model: OffHireNoteTripModel,
//           as: "trips",
//           include: [
//             {
//               model: OffHireNoteEquipmentModel,
//               as: "equipment",
//               attributes: [
//                 "id",
//                 "serial_number",
//                 "reg_number",
//                 "equipment_type",
//                 "condition",
//                 "damage_description",
//               ],
//             },
//             {
//               model: OffHireNoteManpowerModel,
//               as: "manpower",
//               attributes: [
//                 "id",
//                 "employee_id",
//                 "employee_no",
//                 "employee_name",
//                 "return_status",
//               ],
//             },
//             {
//               model: OffHireNoteAttachmentModel,
//               as: "attachments",
//               attributes: [
//                 "id",
//                 "attachment_id",
//                 "attachment_number",
//                 "attachment_type",
//                 "condition",
//                 "damage_description",
//               ],
//             },
//           ],
//           order: [["trip_number", "ASC"]],
//         },
//       ],
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     const summaryData = {
//       ohn_number: offHireNote.ohn_number,
//       client: offHireNote.client_name,
//       project: offHireNote.project_name,
//       status: offHireNote.status,
//       trips: offHireNote.trips.map((trip) => ({
//         trip_number: trip.trip_number,
//         trip_date: trip.trip_date,
//         trip_reference_number: trip.trip_reference_number,
//         equipment: trip.equipment.map((eq) => ({
//           type: "Equipment",
//           id: eq.serial_number,
//           number: eq.reg_number,
//           details: eq.equipment_type,
//           condition: eq.condition,
//           damage_description: eq.damage_description,
//           status: offHireNote.status,
//         })),
//         manpower: trip.manpower.map((mp) => ({
//           type: "Manpower",
//           id: mp.employee_id,
//           number: mp.employee_no,
//           details: mp.employee_name,
//           return_status: mp.return_status,
//           status: offHireNote.status,
//         })),
//         attachments: trip.attachments.map((at) => ({
//           type: "Attachment",
//           id: at.attachment_id,
//           number: at.attachment_number,
//           details: at.attachment_type,
//           condition: at.condition,
//           damage_description: at.damage_description,
//           status: offHireNote.status,
//         })),
//         transportation: {
//           company: trip.transportation_company,
//           driver: trip.driver_name,
//           contact: trip.driver_contact,
//           vehicle: trip.vehicle_number,
//           recovery_vehicle: trip.recovery_vehicle_number,
//         },
//       })),
//     };

//     res.status(200).json({
//       success: true,
//       summary: summaryData,
//     });
//   } catch (error) {
//     console.error("Error fetching off hire note summary:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const addTripToOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { ohn_id } = req.params;
//     const {
//       transportation_company,
//       trip_date,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       equipment,
//       manpower,
//       attachments,
//       remarks,
//     } = req.body;

//     const offHireNote = await OffHireNoteModel.findByPk(ohn_id, {
//       transaction,
//     });
//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     const existingTrips = await OffHireNoteTripModel.findAll({
//       where: { ohn_id },
//       transaction,
//     });

//     const nextTripNumber = existingTrips.length + 1;
//     if (nextTripNumber > 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per off hire note" });
//     }

//     const newTrip = await OffHireNoteTripModel.create(
//       {
//         ohn_id,
//         trip_number: nextTripNumber,
//         trip_date,
//         transportation_company,
//         driver_name,
//         driver_contact,
//         vehicle_type,
//         vehicle_number,
//         recovery_vehicle_number,
//         chargeable_type: chargeable_type || "Demobilization",
//         trip_status: "Creation",
//         remarks,
//       },
//       { transaction }
//     );

//     if (equipment && equipment.length > 0) {
//       for (const equip of equipment) {
//         await OffHireNoteEquipmentModel.create(
//           {
//             ohn_id,
//             trip_id: newTrip.trip_id,
//             serial_number: equip.serial_number,
//             reg_number: equip.reg_number,
//             equipment_type: equip.equipment_type,
//             condition: equip.condition || "Good",
//             damage_description: equip.damage_description || null,
//           },
//           { transaction }
//         );
//       }
//     }

//     if (manpower && manpower.length > 0) {
//       for (const mp of manpower) {
//         await OffHireNoteManpowerModel.create(
//           {
//             ohn_id,
//             trip_id: newTrip.trip_id,
//             employee_id: mp.employee_id,
//             employee_no: mp.employee_no,
//             employee_name: mp.employee_name,
//             return_status: mp.return_status || "Returned",
//           },
//           { transaction }
//         );
//       }
//     }

//     if (attachments && attachments.length > 0) {
//       for (const attach of attachments) {
//         await OffHireNoteAttachmentModel.create(
//           {
//             ohn_id,
//             trip_id: newTrip.trip_id,
//             attachment_id: attach.attachment_id,
//             attachment_number: attach.attachment_number,
//             attachment_type: attach.attachment_type,
//             condition: attach.condition || "Good",
//             damage_description: attach.damage_description || null,
//           },
//           { transaction }
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully to off hire note",
//       trip: newTrip,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const uploadOffHireNoteAttachment = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { ohn_id } = req.params;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Off hire attachment file is required",
//         details: "No file was uploaded or file upload failed",
//       });
//     }

//     const fileName = req.file.filename;

//     const offHireNote = await OffHireNoteModel.findByPk(ohn_id, {
//       include: [{ model: SalesOrdersModel, as: "salesOrder" }],
//       transaction,
//     });

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     await offHireNote.update(
//       {
//         off_hire_attachment: fileName,
//         status: "Off Hired",
//       },
//       { transaction }
//     );

//     await OffHireNoteTripModel.update(
//       { trip_status: "Off Hired" },
//       {
//         where: { ohn_id },
//         transaction,
//       }
//     );

//     await SalesOrdersModel.update(
//       { ops_status: "Completed" },
//       {
//         where: { id: offHireNote.sales_order_id },
//         transaction,
//       }
//     );

//     await ActiveAllocationModel.update(
//       { status: "Completed" },
//       {
//         where: { allocation_id: offHireNote.allocation_id },
//         transaction,
//       }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message:
//         "Off hire note uploaded successfully and status updated to Off Hired",
//       offHireNote: {
//         ...offHireNote.toJSON(),
//         status: "Off Hired",
//         off_hire_attachment: fileName,
//       },
//       orderStatus: "Completed",
//       uploadedFile: {
//         filename: req.file.filename,
//         originalname: req.file.originalname,
//         path: `/uploads/off-hire-notes/${req.file.filename}`,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading off hire note attachment:", error);
//     res.status(500).json({
//       error: error.message,
//       stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//     });
//   }
// };

// const getAllOffHireNotes = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const offset = (page - 1) * parseInt(limit);

//     const { count, rows } = await OffHireNoteModel.findAndCountAll({
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//         {
//           model: OffHireNoteTripModel,
//           as: "trips",
//           include: [
//             { model: OffHireNoteEquipmentModel, as: "equipment" },
//             { model: OffHireNoteManpowerModel, as: "manpower" },
//             { model: OffHireNoteAttachmentModel, as: "attachments" },
//           ],
//         },
//       ],
//       offset,
//       limit: parseInt(limit),
//       order: [["createdAt", "DESC"]],
//     });

//     res.status(200).json({
//       totalCount: count,
//       currentPage: parseInt(page),
//       totalPages: Math.ceil(count / limit),
//       offHireNotes: rows,
//     });
//   } catch (error) {
//     console.error("Error fetching off hire notes:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getOffHireNoteById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const offHireNote = await OffHireNoteModel.findByPk(id, {
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//         },
//         {
//           model: OffHireNoteTripModel,
//           as: "trips",
//           include: [
//             { model: OffHireNoteEquipmentModel, as: "equipment" },
//             { model: OffHireNoteManpowerModel, as: "manpower" },
//             { model: OffHireNoteAttachmentModel, as: "attachments" },
//           ],
//         },
//       ],
//     });

//     if (!offHireNote) {
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     res.status(200).json(offHireNote);
//   } catch (error) {
//     console.error("Error fetching off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getOffHireNoteByAllocation = async (req, res) => {
//   try {
//     const { allocation_id } = req.params;

//     const offHireNote = await OffHireNoteModel.findOne({
//       where: { allocation_id },
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: [
//             "id",
//             "so_number",
//             "client",
//             "so_status",
//             "project_name",
//           ],
//         },
//         {
//           model: OffHireNoteTripModel,
//           as: "trips",
//           include: [
//             {
//               model: OffHireNoteEquipmentModel,
//               as: "equipment",
//               // Include checklist fields so frontend can show upload status
//               attributes: [
//                 "id",
//                 "serial_number",
//                 "reg_number",
//                 "equipment_type",
//                 "condition",
//                 "damage_description",
//                 "checklist_file_path",
//                 "checklist_file_name",
//                 "checklist_uploaded_at",
//                 "checklist_uploaded_by",
//               ],
//             },
//             {
//               model: OffHireNoteManpowerModel,
//               as: "manpower",
//               attributes: [
//                 "id",
//                 "employee_id",
//                 "employee_no",
//                 "employee_name",
//                 "return_status",
//                 "checklist_file_path",
//                 "checklist_file_name",
//                 "checklist_uploaded_at",
//                 "checklist_uploaded_by",
//               ],
//             },
//             {
//               model: OffHireNoteAttachmentModel,
//               as: "attachments",
//               attributes: [
//                 "id",
//                 "attachment_id",
//                 "attachment_number",
//                 "attachment_type",
//                 "condition",
//                 "damage_description",
//                 "checklist_file_path",
//                 "checklist_file_name",
//                 "checklist_uploaded_at",
//                 "checklist_uploaded_by",
//               ],
//             },
//           ],
//         },
//       ],
//     });

//     if (!offHireNote) {
//       return res.status(404).json({
//         message: "No off hire note found for this allocation",
//         exists: false,
//       });
//     }

//     res.status(200).json({
//       ...offHireNote.toJSON(),
//       orderStatusInfo: {
//         currentOrderStatus: offHireNote.salesOrder?.so_status,
//         orderNumber: offHireNote.salesOrder?.so_number,
//         client: offHireNote.salesOrder?.client,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching off hire note:", error);
//     res.status(500).json({
//       error: error.message,
//       exists: false,
//     });
//   }
// };

// const generateOffHireNotePDF = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;

//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       await transaction.rollback();
//       return res.status(401).json({
//         error: "Authentication token is required",
//         message: "Please provide a valid Bearer token in Authorization header",
//       });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       await transaction.rollback();
//       return res.status(401).json({
//         error: "Invalid token",
//         message: "Authentication token is missing or invalid",
//       });
//     }

//     const offHireNote = await OffHireNoteModel.findByPk(id, {
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//         },
//         {
//           model: OffHireNoteTripModel,
//           as: "trips",
//           include: [
//             { model: OffHireNoteEquipmentModel, as: "equipment" },
//             { model: OffHireNoteManpowerModel, as: "manpower" },
//             { model: OffHireNoteAttachmentModel, as: "attachments" },
//           ],
//         },
//       ],
//       transaction,
//     });

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     if (offHireNote.status === "Approved") {
//       await offHireNote.update({ status: "In Progress" }, { transaction });
//     }

//     await OffHireNoteTripModel.update(
//       { trip_status: "In Progress" },
//       {
//         where: { ohn_id: id, trip_status: "Creation" },
//         transaction,
//       }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       success: true,
//       data: offHireNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error generating off hire note PDF:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateOffHireNoteStatus = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     const { off_hire_attachment } = req.body;

//     const offHireNote = await OffHireNoteModel.findByPk(id, {
//       include: [{ model: SalesOrdersModel, as: "salesOrder" }],
//       transaction,
//     });

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     let newStatus = offHireNote.status;

//     if (off_hire_attachment) {
//       newStatus = "Off Hired";

//       await offHireNote.update(
//         {
//           status: "Off Hired",
//           off_hire_attachment,
//         },
//         { transaction }
//       );

//       await OffHireNoteTripModel.update(
//         { trip_status: "Off Hired" },
//         {
//           where: { ohn_id: id },
//           transaction,
//         }
//       );

//       await SalesOrdersModel.update(
//         { ops_status: "Completed" },
//         {
//           where: { id: offHireNote.sales_order_id },
//           transaction,
//         }
//       );

//       await ActiveAllocationModel.update(
//         { status: "Completed" },
//         {
//           where: { allocation_id: offHireNote.allocation_id },
//           transaction,
//         }
//       );
//     } else if (req.body.status === "Rejected") {
//       newStatus = "Rejected";

//       await offHireNote.update({ status: "Rejected" }, { transaction });

//       await OffHireNoteTripModel.update(
//         { trip_status: "Rejected" },
//         {
//           where: { ohn_id: id },
//           transaction,
//         }
//       );

//       await SalesOrdersModel.update(
//         { so_status: "Closed" },
//         {
//           where: { id: offHireNote.sales_order_id },
//           transaction,
//         }
//       );

//       await ActiveAllocationModel.update(
//         { status: "Rejected" },
//         {
//           where: { allocation_id: offHireNote.allocation_id },
//           transaction,
//         }
//       );
//     } else {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Manual status changes not allowed. Use system-defined flows.",
//         allowedActions: [
//           "Upload off_hire_attachment to mark as Off Hired (Order → Completed)",
//           "Set status to Rejected to cancel off hire note (Order → Rejected)",
//         ],
//       });
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: `Off hire note status updated to ${newStatus}`,
//       offHireNote: {
//         ...offHireNote.toJSON(),
//         status: newStatus,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating off hire note status:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateTripStatus = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;

//     const trip = await OffHireNoteTripModel.findByPk(trip_id, { transaction });
//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     const currentStatus = trip.trip_status;
//     const requestedStatus = req.body.trip_status;

//     const validTransitions = {
//       Creation: ["In Progress", "Rejected"],
//       "In Progress": ["Off Hired", "Rejected"],
//       "Off Hired": ["Rejected"],
//       Cancelled: [],
//     };

//     if (!validTransitions[currentStatus]?.includes(requestedStatus)) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Manual trip status changes not allowed.",
//         currentStatus,
//         allowedNextStatuses: validTransitions[currentStatus] || [],
//       });
//     }

//     if (requestedStatus === "In Progress") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Trip status 'In Progress' is set automatically when off hire note report is generated.",
//       });
//     }

//     await trip.update({ trip_status: requestedStatus }, { transaction });

//     if (requestedStatus === "Off Hired") {
//       const allTrips = await OffHireNoteTripModel.findAll({
//         where: { ohn_id: trip.ohn_id },
//         transaction,
//       });

//       const allOffHired = allTrips.every((t) => t.trip_status === "Off Hired");
//       if (allOffHired) {
//         await OffHireNoteModel.update(
//           { status: "Off Hired" },
//           { where: { ohn_id: trip.ohn_id }, transaction }
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Trip status updated successfully",
//       trip,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip status:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const rejectOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     const { reason } = req.body;

//     const offHireNote = await OffHireNoteModel.findByPk(id, {
//       include: [{ model: SalesOrdersModel, as: "salesOrder" }],
//       transaction,
//     });

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     await offHireNote.update({ status: "Rejected" }, { transaction });

//     await OffHireNoteTripModel.update(
//       { trip_status: "Rejected" },
//       {
//         where: { ohn_id: id },
//         transaction,
//       }
//     );

//     if (offHireNote.salesOrder) {
//       await SalesOrdersModel.update(
//         { so_status: "Closed" },
//         {
//           where: { id: offHireNote.sales_order_id },
//           transaction,
//         }
//       );
//     }

//     // await ActiveAllocationModel.update(
//     //   { status: "Rejected" },
//     //   {
//     //     where: { allocation_id: offHireNote.allocation_id },
//     //     transaction,
//     //   }
//     // );

//     await transaction.commit();

//     res.status(200).json({
//       message: `Off hire note rejected successfully`,
//       offHireNote: {
//         ...offHireNote.toJSON(),
//         status: "Rejected",
//       },
//       orderStatus: "Rejected",
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const deleteOffHireNoteTrip = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { trip_id } = req.params;

//     const trip = await OffHireNoteTripModel.findByPk(trip_id);
//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     const ohn = await OffHireNoteModel.findByPk(trip.ohn_id);
//     if (ohn.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message:
//           "Cannot delete trip. OHN is already in progress or completed.",
//       });
//     }

//     await OffHireNoteEquipmentModel.destroy({ where: { trip_id }, transaction });
//     await OffHireNoteManpowerModel.destroy({ where: { trip_id }, transaction });
//     await OffHireNoteAttachmentModel.destroy({ where: { trip_id }, transaction });

//     await trip.destroy({ transaction });

//     await transaction.commit();
//     res
//       .status(200)
//       .json({ message: "Trip and its resources deleted successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error deleting trip:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const submitOffHireNoteForApproval = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const offHireNote = await OffHireNoteModel.findByPk(id);

//     if (!offHireNote)
//       return res.status(404).json({ message: "Off hire note not found" });

//     await offHireNote.update({ status: "Under Approval" });

//     await OffHireNoteTripModel.update(
//       { trip_status: "Under Approval" },
//       { where: { ohn_id: id } }
//     );

//     res
//       .status(200)
//       .json({ message: "Off hire note submitted for approval" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const approveOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const offHireNote = await OffHireNoteModel.findByPk(id, { transaction });

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     await offHireNote.update({ status: "Approved" }, { transaction });

//     await OffHireNoteTripModel.update(
//       { trip_status: "Approved" },
//       { where: { ohn_id: id }, transaction }
//     );

//     await transaction.commit();
//     res.status(200).json({ message: "Off hire note approved successfully" });
//   } catch (error) {
//     await transaction.rollback();
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateOffHireNoteStatusGeneric = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { status } = req.body;

//     const offHireNote = await OffHireNoteModel.findByPk(id);
//     if (!offHireNote)
//       return res.status(404).json({ message: "Off hire note not found" });

//     await offHireNote.update({ status: status });

//     await OffHireNoteTripModel.update(
//       { trip_status: status },
//       { where: { ohn_id: id } }
//     );

//     res.status(200).json({ message: `Status updated to ${status}` });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const updateTripInOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;
//     const {
//       transportation_company,
//       trip_date,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       equipment,
//       manpower,
//       attachments,
//       remarks,
//     } = req.body;

//     const trip = await OffHireNoteTripModel.findByPk(trip_id, {
//       include: [{ model: OffHireNoteModel, as: "offHireNote" }],
//       transaction,
//     });

//     if (!trip) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Trip not found" });
//     }

//     if (trip.offHireNote.status !== "Creation") {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: `Cannot edit trip - Off Hire Note is in '${trip.offHireNote.status}' status. Only 'Creation' status allows edits.`,
//       });
//     }

//     await trip.update(
//       {
//         transportation_company,
//         trip_date,
//         driver_name,
//         driver_contact,
//         vehicle_type,
//         vehicle_number,
//         recovery_vehicle_number,
//         chargeable_type: chargeable_type || "Demobilization",
//         remarks,
//       },
//       { transaction }
//     );

//     if (equipment !== undefined) {
//       await OffHireNoteEquipmentModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (equipment.length > 0) {
//         for (const equip of equipment) {
//           await OffHireNoteEquipmentModel.create(
//             {
//               ohn_id: trip.ohn_id,
//               trip_id,
//               serial_number: equip.serial_number,
//               reg_number: equip.reg_number,
//               equipment_type: equip.equipment_type,
//               condition: equip.condition || "Good",
//               damage_description: equip.damage_description || null,
//             },
//             { transaction }
//           );
//         }
//       }
//     }

//     if (manpower !== undefined) {
//       await OffHireNoteManpowerModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (manpower.length > 0) {
//         for (const mp of manpower) {
//           await OffHireNoteManpowerModel.create(
//             {
//               ohn_id: trip.ohn_id,
//               trip_id,
//               employee_id: mp.employee_id,
//               employee_no: mp.employee_no,
//               employee_name: mp.employee_name,
//               return_status: mp.return_status || "Returned",
//             },
//             { transaction }
//           );
//         }
//       }
//     }

//     if (attachments !== undefined) {
//       await OffHireNoteAttachmentModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (attachments.length > 0) {
//         for (const attach of attachments) {
//           await OffHireNoteAttachmentModel.create(
//             {
//               ohn_id: trip.ohn_id,
//               trip_id,
//               attachment_id: attach.attachment_id,
//               attachment_number: attach.attachment_number,
//               attachment_type: attach.attachment_type,
//               condition: attach.condition || "Good",
//               damage_description: attach.damage_description || null,
//             },
//             { transaction }
//           );
//         }
//       }
//     }

//     await transaction.commit();

//     const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
//       include: [
//         { model: OffHireNoteEquipmentModel, as: "equipment" },
//         { model: OffHireNoteManpowerModel, as: "manpower" },
//         { model: OffHireNoteAttachmentModel, as: "attachments" },
//       ],
//     });

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip: updatedTrip,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip in off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const uploadResourceChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_type, resource_id } = req.params;
//     const file = req.file;
//     const user = req.user;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const validTypes = ["equipment", "manpower", "attachment"];
//     if (!validTypes.includes(resource_type)) {
//       return res.status(400).json({
//         message:
//           "Invalid resource type. Must be equipment, manpower, or attachment",
//       });
//     }

//     let Model;
//     let whereCondition;

//     switch (resource_type) {
//       case "equipment":
//         Model = OffHireNoteEquipmentModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//       case "manpower":
//         Model = OffHireNoteManpowerModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//       case "attachment":
//         Model = OffHireNoteAttachmentModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//     }

//     const resource = await Model.findOne({
//       where: whereCondition,
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: `${resource_type} not found in this trip` });
//     }

//     if (req.user?.uid) {
//       const user = await UsersModel.findByPk(req.user.uid);
//       if (user) {
//         username = user.username;
//       }
//     }

//     const updateData = {
//       checklist_file_path: file.path,
//       checklist_file_name: file.originalname,
//       checklist_uploaded_at: new Date(),
//       checklist_uploaded_by: username || "iteq-admin",
//     };

//     await Model.update(updateData, {
//       where: whereCondition,
//       transaction,
//     });

//     await transaction.commit();

//     res.status(200).json({
//       message: "Checklist uploaded successfully",
//       file: {
//         path: file.path,
//         name: file.originalname,
//         uploaded_at: updateData.checklist_uploaded_at,
//         uploaded_by: updateData.checklist_uploaded_by,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading checklist:", error);
//     res.status(500).json({
//       message: "Failed to upload checklist",
//       error: error.message,
//     });
//   }
// };

// const downloadResourceChecklist = async (req, res) => {
//   try {
//     const { trip_id, resource_type, resource_id } = req.params;

//     const validTypes = ["equipment", "manpower", "attachment"];
//     if (!validTypes.includes(resource_type)) {
//       return res.status(400).json({ message: "Invalid resource type" });
//     }

//     let Model;
//     let whereCondition;

//     switch (resource_type) {
//       case "equipment":
//         Model = OffHireNoteEquipmentModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//       case "manpower":
//         Model = OffHireNoteManpowerModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//       case "attachment":
//         Model = OffHireNoteAttachmentModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//     }

//     const resource = await Model.findOne({ where: whereCondition });

//     if (!resource) {
//       return res
//         .status(404)
//         .json({ message: `${resource_type} not found in this trip` });
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
//           res.status(500).json({ message: "Error downloading checklist file" });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error downloading checklist:", error);
//     res.status(500).json({
//       message: "Failed to download checklist",
//       error: error.message,
//     });
//   }
// };

// const deleteResourceChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_type, resource_id } = req.params;

//     const validTypes = ["equipment", "manpower", "attachment"];
//     if (!validTypes.includes(resource_type)) {
//       return res.status(400).json({ message: "Invalid resource type" });
//     }

//     let Model;
//     let whereCondition;

//     switch (resource_type) {
//       case "equipment":
//         Model = OffHireNoteEquipmentModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//       case "manpower":
//         Model = OffHireNoteManpowerModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//       case "attachment":
//         Model = OffHireNoteAttachmentModel;
//         whereCondition = { id: resource_id, trip_id: trip_id };
//         break;
//     }

//     const resource = await Model.findOne({
//       where: whereCondition,
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: `${resource_type} not found in this trip` });
//     }

//     if (!resource.checklist_file_path) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: "No checklist found for this resource" });
//     }

//     if (fs.existsSync(resource.checklist_file_path)) {
//       fs.unlinkSync(resource.checklist_file_path);
//       console.log(`Deleted checklist file: ${resource.checklist_file_path}`);
//     }

//     await Model.update(
//       {
//         checklist_file_path: null,
//         checklist_file_name: null,
//         checklist_uploaded_at: null,
//         checklist_uploaded_by: null,
//       },
//       {
//         where: whereCondition,
//         transaction,
//       }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Checklist deleted successfully",
//       resource_type,
//       resource_id,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error deleting checklist:", error);
//     res.status(500).json({
//       message: "Failed to delete checklist",
//       error: error.message,
//     });
//   }
// };

// module.exports = {
//   createOffHireNote,
//   getAllOffHireNotes,
//   getOffHireNoteById,
//   getOffHireNoteByAllocation,
//   generateOffHireNotePDF,
//   updateOffHireNoteStatus,
//   updateTripStatus,
//   getOffHireNoteSummary,
//   addTripToOffHireNote,
//   uploadOffHireNoteAttachment,
//   rejectOffHireNote,
//   deleteOffHireNoteTrip,
//   submitOffHireNoteForApproval,
//   approveOffHireNote,
//   updateOffHireNoteStatusGeneric,
//   updateTripInOffHireNote,
//   uploadResourceChecklist,
//   downloadResourceChecklist,
//   deleteResourceChecklist,
// };

const {
  OffHireNoteModel,
  OffHireNoteTripModel,
  OffHireNoteEquipmentModel,
  OffHireNoteManpowerModel,
  OffHireNoteAttachmentModel,
  OffHireNoteSubProductModel,
} = require("../models/OffHireNoteModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const {
  ActiveAllocationModel,
  AllocationEquipmentModel,
  AllocationManpowerModel,
  AllocationAttachmentModel,
} = require("../models/ActiveAllocationsOriginalModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");

// ─────────────────────────────────────────────────────────────────────────────
// TRIP STATUS TRANSITION RULES
//
//  Each trip moves through its OWN lifecycle independently.
//  The parent OHN status is RE-DERIVED from all trip statuses after every change.
//
//  Valid per-trip transitions:
//   Creation      → Under Approval | Rejected
//   Under Approval→ Approved       | Rejected
//   Approved      → In Progress    | Rejected
//   In Progress   → Off Hired      | Rejected
//   Off Hired     → Close
//   Rejected      → (terminal)
//   Close         → (terminal)
//   Cancelled     → (terminal)
//
//  OHN status derivation rule (checkAndUpdateOHNStatus):
//   • Any trip Rejected / Cancelled  → keep individual; OHN only changes when ALL terminal
//   • All trips Off Hired            → OHN = "Off Hired"
//   • All trips Close                → OHN = "Close"
//   • Any trip In Progress           → OHN = "In Progress"
//   • Any trip Approved (none higher)→ OHN = "Approved"
//   • Any trip Under Approval        → OHN = "Under Approval"
//   • Otherwise                      → OHN = "Creation"
// ─────────────────────────────────────────────────────────────────────────────

const TRIP_VALID_TRANSITIONS = {
  Creation:       ["Under Approval", "Rejected"],
  "Under Approval": ["Approved", "Rejected"],
  Approved:       ["In Progress", "Rejected"],
  "In Progress":  ["Off Hired", "Rejected"],
  "Off Hired":    ["Close"],
  Rejected:       [],
  Close:          [],
  Cancelled:      [],
};

/**
 * Re-derives and persists the OHN status from the current trip statuses.
 * Call this inside a transaction after any trip status update.
 */
const checkAndUpdateOHNStatus = async (ohn_id, transaction) => {
  const trips = await OffHireNoteTripModel.findAll({
    where: { ohn_id },
    attributes: ["trip_status"],
    transaction,
  });

  if (!trips.length) return;

  const statuses = trips.map((t) => t.trip_status);

  let newOHNStatus;

  if (statuses.every((s) => s === "Close")) {
    newOHNStatus = "Close";
  } else if (statuses.every((s) => s === "Off Hired" || s === "Close")) {
    newOHNStatus = "Off Hired";
  } else if (statuses.every((s) => ["Rejected", "Cancelled"].includes(s))) {
    newOHNStatus = "Rejected";
  } else if (statuses.some((s) => s === "In Progress")) {
    newOHNStatus = "In Progress";
  } else if (statuses.some((s) => s === "Approved")) {
    newOHNStatus = "Approved";
  } else if (statuses.some((s) => s === "Under Approval")) {
    newOHNStatus = "Under Approval";
  } else {
    newOHNStatus = "Creation";
  }

  await OffHireNoteModel.update(
    { status: newOHNStatus },
    { where: { ohn_id }, transaction }
  );

  return newOHNStatus;
};

// ─────────────────────────────────────────────────────────────────────────────
// Generate OHN Number
// ─────────────────────────────────────────────────────────────────────────────
const generateOHNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `OHN-${currentYear}-`;

  const lastOHN = await OffHireNoteModel.findOne({
    where: { ohn_number: { [Op.like]: `${prefix}%` } },
    order: [["ohn_number", "DESC"]],
  });

  let nextNumber = 1;
  if (lastOHN) {
    const lastNumber = parseInt(lastOHN.ohn_number.split("-")[2]);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE OFF HIRE NOTE
// ─────────────────────────────────────────────────────────────────────────────
const createOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sales_order_id, allocation_id, trips, remarks } = req.body;

    const allocation = await ActiveAllocationModel.findByPk(allocation_id, {
      include: [
        { model: AllocationEquipmentModel, as: "equipmentAllocations", where: { is_selected: true }, required: false },
        { model: AllocationManpowerModel,  as: "manpowerAllocations",  where: { is_selected: true }, required: false },
        { model: AllocationAttachmentModel,as: "attachmentAllocations",where: { is_selected: true }, required: false },
      ],
    });
    if (!allocation) {
      await transaction.rollback();
      return res.status(404).json({ message: "Allocation not found" });
    }

    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    const ohn_number = await generateOHNNumber();

    let username = "iteq-admin";
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) username = user.username;
    }

    const offHireNote = await OffHireNoteModel.create(
      {
        ohn_number,
        sales_order_id,
        allocation_id,
        client_name: salesOrder.client,
        project_name: salesOrder.project_name,
        delivery_address: salesOrder.delivery_address,
        status: "Creation",
        remarks,
        created_by: username,
      },
      { transaction }
    );

    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const tripRecord = await OffHireNoteTripModel.create(
          {
            ohn_id: offHireNote.ohn_id,
            trip_number: trip.trip_number,
            trip_date: trip.trip_date,
            transportation_company: trip.transportation_company,
            driver_name: trip.driver_name,
            driver_contact: trip.driver_contact,
            vehicle_type: trip.vehicle_type,
            vehicle_number: trip.vehicle_number,
            recovery_vehicle_number: trip.recovery_vehicle_number,
            chargeable_type: trip.chargeable_type || "Demobilization",
            trip_status: "Creation",
            remarks: trip.remarks,
            prechecklist_id: trip.prechecklist_id || null,
            client_checklist_id: trip.client_checklist_id || null,
          },
          { transaction }
        );

        if (trip.equipment?.length > 0) {
          for (const equip of trip.equipment) {
            await OffHireNoteEquipmentModel.create(
              { ohn_id: offHireNote.ohn_id, trip_id: tripRecord.trip_id, ...equip, condition: equip.condition || "Good", damage_description: equip.damage_description || null },
              { transaction }
            );
          }
        }

        if (trip.manpower?.length > 0) {
          for (const mp of trip.manpower) {
            await OffHireNoteManpowerModel.create(
              { ohn_id: offHireNote.ohn_id, trip_id: tripRecord.trip_id, ...mp, return_status: mp.return_status || "Returned" },
              { transaction }
            );
          }
        }

        if (trip.attachments?.length > 0) {
          for (const attach of trip.attachments) {
            await OffHireNoteAttachmentModel.create(
              { ohn_id: offHireNote.ohn_id, trip_id: tripRecord.trip_id, ...attach, condition: attach.condition || "Good", damage_description: attach.damage_description || null },
              { transaction }
            );
          }
        }

        if (trip.subProducts?.length > 0) {
          for (const subProd of trip.subProducts) {
            await OffHireNoteSubProductModel.create(
              { ohn_id: offHireNote.ohn_id, trip_id: tripRecord.trip_id, ...subProd },
              { transaction }
            );
          }
        }
      }
    }

    await ActiveAllocationModel.update(
      { status: "Off Hire Note Created" },
      { where: { allocation_id }, transaction }
    );

    await transaction.commit();

    const createdOffHireNote = await OffHireNoteModel.findByPk(offHireNote.ohn_id, {
      include: [
        {
          model: OffHireNoteTripModel,
          as: "trips",
          include: [
            { model: OffHireNoteEquipmentModel, as: "equipment" },
            { model: OffHireNoteManpowerModel,  as: "manpower" },
            { model: OffHireNoteAttachmentModel,as: "attachments" },
            { model: OffHireNoteSubProductModel,as: "subProducts" },
          ],
        },
      ],
    });

    res.status(201).json({
      message: "Off hire note created successfully",
      offHireNote: createdOffHireNote,
      updatedOrderStatus: "Off Hire Note",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE INDIVIDUAL TRIP STATUS
// ─────────────────────────────────────────────────────────────────────────────
const updateTripStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const { trip_status: requestedStatus } = req.body;

    const trip = await OffHireNoteTripModel.findByPk(trip_id, { transaction });
    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    const currentStatus = trip.trip_status;
    const allowed = TRIP_VALID_TRANSITIONS[currentStatus] ?? [];

    if (!allowed.includes(requestedStatus)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot transition trip from '${currentStatus}' to '${requestedStatus}'.`,
        currentStatus,
        allowedNextStatuses: allowed,
      });
    }

    // Update this specific trip
    await trip.update({ trip_status: requestedStatus }, { transaction });

    // Re-derive and persist OHN status from ALL trip statuses
    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    // Side-effects when a trip is fully Off Hired / Closed
    if (requestedStatus === "Off Hired") {
      // If ALL trips are now Off Hired → update allocation & sales order
      const remainingTrips = await OffHireNoteTripModel.findAll({
        where: { ohn_id: trip.ohn_id },
        attributes: ["trip_status"],
        transaction,
      });
      const allOffHired = remainingTrips.every(
        (t) => t.trip_status === "Off Hired" || t.trip_status === "Close"
      );

      if (allOffHired) {
        const offHireNote = await OffHireNoteModel.findByPk(trip.ohn_id, { transaction });
        await SalesOrdersModel.update(
          { ops_status: "Completed" },
          { where: { id: offHireNote.sales_order_id }, transaction }
        );
        await ActiveAllocationModel.update(
          { status: "Completed" },
          { where: { allocation_id: offHireNote.allocation_id }, transaction }
        );
      }
    }

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      message: `Trip status updated to '${requestedStatus}'`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip status:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT INDIVIDUAL TRIP FOR APPROVAL  (Creation → Under Approval)
// ─────────────────────────────────────────────────────────────────────────────
const submitTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip cannot be submitted for approval. Current status is '${trip.trip_status}'. Only 'Creation' status trips can be submitted.`,
        currentStatus: trip.trip_status,
        allowedStatus: "Creation",
      });
    }

    // Update only this specific trip
    await trip.update({ trip_status: "Under Approval" }, { transaction });

    // Re-derive OHN status from all trips
    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} submitted for approval successfully`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// SUBMIT OHN FOR APPROVAL  (moves each trip: Creation → Under Approval)
// ─────────────────────────────────────────────────────────────────────────────
const submitOffHireNoteForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const offHireNote = await OffHireNoteModel.findByPk(id, { transaction });
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `OHN is already in '${offHireNote.status}' status. Only 'Creation' status can be submitted for approval.`,
      });
    }

    // Move ONLY trips that are still in 'Creation'
    const tripsToSubmit = await OffHireNoteTripModel.findAll({
      where: { ohn_id: id, trip_status: "Creation" },
      transaction,
    });

    for (const trip of tripsToSubmit) {
      await trip.update({ trip_status: "Under Approval" }, { transaction });
    }

    // Re-derive OHN status
    await checkAndUpdateOHNStatus(id, transaction);

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note submitted for approval",
      submittedTrips: tripsToSubmit.length,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// APPROVE OHN  (moves each trip: Under Approval → Approved)
// ─────────────────────────────────────────────────────────────────────────────
const approveOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;

    const offHireNote = await OffHireNoteModel.findByPk(id, { transaction });
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    // Move ONLY trips in 'Under Approval'
    const tripsToApprove = await OffHireNoteTripModel.findAll({
      where: { ohn_id: id, trip_status: "Under Approval" },
      transaction,
    });

    for (const trip of tripsToApprove) {
      await trip.update({ trip_status: "Approved" }, { transaction });
    }

    // Re-derive OHN status
    const newOHNStatus = await checkAndUpdateOHNStatus(id, transaction);

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note approved successfully",
      approvedTrips: tripsToApprove.length,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE PDF  (moves each trip: Approved → In Progress)
// ─────────────────────────────────────────────────────────────────────────────
// const generateOffHireNotePDF = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;

//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       await transaction.rollback();
//       return res.status(401).json({ error: "Authentication token is required" });
//     }

//     const offHireNote = await OffHireNoteModel.findByPk(id, {
//       include: [
//         {
//           model: OffHireNoteTripModel,
//           as: "trips",
//           include: [
//             { model: OffHireNoteEquipmentModel, as: "equipment" },
//             { model: OffHireNoteManpowerModel,  as: "manpower" },
//             { model: OffHireNoteAttachmentModel,as: "attachments" },
//           ],
//         },
//         { model: SalesOrdersModel, as: "salesOrder" },
//       ],
//       transaction,
//     });

//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     // Move ONLY trips in 'Approved' → 'In Progress'
//     const tripsToProgress = await OffHireNoteTripModel.findAll({
//       where: { ohn_id: id, trip_status: "Approved" },
//       transaction,
//     });

//     for (const trip of tripsToProgress) {
//       await trip.update({ trip_status: "In Progress" }, { transaction });
//     }

//     // Re-derive OHN status
//     await checkAndUpdateOHNStatus(id, transaction);

//     await transaction.commit();

//     res.status(200).json({
//       success: true,
//       data: offHireNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error generating off hire note PDF:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// ─────────────────────────────────────────────────────────────────────────────
// UPLOAD OFF-HIRE ATTACHMENT  (moves ALL trips → Off Hired, OHN → Off Hired)
// ─────────────────────────────────────────────────────────────────────────────
// const uploadOffHireNoteAttachment = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { ohn_id } = req.params;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "Off hire attachment file is required" });
//     }

//     const offHireNote = await OffHireNoteModel.findByPk(ohn_id, {
//       include: [{ model: SalesOrdersModel, as: "salesOrder" }],
//       transaction,
//     });
//     if (!offHireNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Off hire note not found" });
//     }

//     await offHireNote.update(
//       { off_hire_attachment: req.file.filename, status: "Off Hired" },
//       { transaction }
//     );

//     // Mark every trip as Off Hired (regardless of current status)
//     await OffHireNoteTripModel.update(
//       { trip_status: "Off Hired" },
//       { where: { ohn_id }, transaction }
//     );

//     await SalesOrdersModel.update(
//       { ops_status: "Completed" },
//       { where: { id: offHireNote.sales_order_id }, transaction }
//     );

//     await ActiveAllocationModel.update(
//       { status: "Completed" },
//       { where: { allocation_id: offHireNote.allocation_id }, transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Off hire note uploaded successfully. Status updated to Off Hired.",
//       offHireNote: { ...offHireNote.toJSON(), status: "Off Hired", off_hire_attachment: req.file.filename },
//       orderStatus: "Completed",
//       uploadedFile: {
//         filename: req.file.filename,
//         originalname: req.file.originalname,
//         path: `/uploads/off-hire-notes/${req.file.filename}`,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading off hire note attachment:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// ─────────────────────────────────────────────────────────────────────────────
// REJECT OHN  (moves ALL non-terminal trips → Rejected)
// ─────────────────────────────────────────────────────────────────────────────
const rejectOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const offHireNote = await OffHireNoteModel.findByPk(id, {
      include: [{ model: SalesOrdersModel, as: "salesOrder" }],
      transaction,
    });
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    // Reject only trips that are NOT already terminal
    const terminalStatuses = ["Off Hired", "Close", "Cancelled"];
    const tripsToReject = await OffHireNoteTripModel.findAll({
      where: {
        ohn_id: id,
        trip_status: { [Op.notIn]: terminalStatuses },
      },
      transaction,
    });

    for (const trip of tripsToReject) {
      await trip.update({ trip_status: "Rejected" }, { transaction });
    }

    await offHireNote.update({ status: "Rejected" }, { transaction });

    if (offHireNote.salesOrder) {
      await SalesOrdersModel.update(
        { so_status: "Closed" },
        { where: { id: offHireNote.sales_order_id }, transaction }
      );
    }

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note rejected successfully",
      offHireNote: { ...offHireNote.toJSON(), status: "Rejected" },
      rejectedTrips: tripsToReject.length,
      orderStatus: "Rejected",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE OHN STATUS (system-defined flows: Off Hired via attachment, or Rejected)
// ─────────────────────────────────────────────────────────────────────────────
const updateOffHireNoteStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { off_hire_attachment, status } = req.body;

    const offHireNote = await OffHireNoteModel.findByPk(id, {
      include: [{ model: SalesOrdersModel, as: "salesOrder" }],
      transaction,
    });
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    if (off_hire_attachment) {
      await offHireNote.update(
        { status: "Off Hired", off_hire_attachment },
        { transaction }
      );
      await OffHireNoteTripModel.update(
        { trip_status: "Off Hired" },
        { where: { ohn_id: id }, transaction }
      );
      await SalesOrdersModel.update(
        { ops_status: "Completed" },
        { where: { id: offHireNote.sales_order_id }, transaction }
      );
      await ActiveAllocationModel.update(
        { status: "Completed" },
        { where: { allocation_id: offHireNote.allocation_id }, transaction }
      );

      await transaction.commit();
      return res.status(200).json({
        message: "Off hire note status updated to Off Hired",
        offHireNote: { ...offHireNote.toJSON(), status: "Off Hired" },
      });
    }

    if (status === "Rejected") {
      await offHireNote.update({ status: "Rejected" }, { transaction });

      const terminalStatuses = ["Off Hired", "Close", "Cancelled"];
      const tripsToReject = await OffHireNoteTripModel.findAll({
        where: { ohn_id: id, trip_status: { [Op.notIn]: terminalStatuses } },
        transaction,
      });
      for (const trip of tripsToReject) {
        await trip.update({ trip_status: "Rejected" }, { transaction });
      }

      await SalesOrdersModel.update(
        { so_status: "Closed" },
        { where: { id: offHireNote.sales_order_id }, transaction }
      );
      await ActiveAllocationModel.update(
        { status: "Rejected" },
        { where: { allocation_id: offHireNote.allocation_id }, transaction }
      );

      await transaction.commit();
      return res.status(200).json({
        message: "Off hire note rejected",
        offHireNote: { ...offHireNote.toJSON(), status: "Rejected" },
      });
    }

    await transaction.rollback();
    return res.status(400).json({
      message: "Manual status changes not allowed. Use system-defined flows.",
      allowedActions: [
        "Upload off_hire_attachment to mark as Off Hired",
        "Set status to Rejected to cancel off hire note",
      ],
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating off hire note status:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GENERIC STATUS UPDATE  (admin/override)
// ─────────────────────────────────────────────────────────────────────────────
const updateOffHireNoteStatusGeneric = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const offHireNote = await OffHireNoteModel.findByPk(id, { transaction });
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    await offHireNote.update({ status }, { transaction });

    // For admin override: push the same status down to all trips
    await OffHireNoteTripModel.update(
      { trip_status: status },
      { where: { ohn_id: id }, transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: `Status updated to ${status}` });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ADD TRIP
// ─────────────────────────────────────────────────────────────────────────────
const addTripToOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { ohn_id } = req.params;
    const {
      transportation_company, trip_date, driver_name, driver_contact,
      vehicle_type, vehicle_number, recovery_vehicle_number, chargeable_type,
      equipment, manpower, attachments, subProducts, remarks,
    } = req.body;

    const offHireNote = await OffHireNoteModel.findByPk(ohn_id, { transaction });
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }

    const existingTrips = await OffHireNoteTripModel.findAll({ where: { ohn_id }, transaction });
    const nextTripNumber = existingTrips.length + 1;
    if (nextTripNumber > 7) {
      await transaction.rollback();
      return res.status(400).json({ message: "Maximum 7 trips allowed per off hire note" });
    }

    const newTrip = await OffHireNoteTripModel.create(
      {
        ohn_id, trip_number: nextTripNumber, trip_date,
        transportation_company, driver_name, driver_contact,
        vehicle_type, vehicle_number, recovery_vehicle_number,
        chargeable_type: chargeable_type || "Demobilization",
        trip_status: "Creation", remarks,
      },
      { transaction }
    );

    if (equipment?.length > 0) {
      for (const equip of equipment) {
        await OffHireNoteEquipmentModel.create(
          { ohn_id, trip_id: newTrip.trip_id, ...equip, condition: equip.condition || "Good", damage_description: equip.damage_description || null },
          { transaction }
        );
      }
    }
    if (manpower?.length > 0) {
      for (const mp of manpower) {
        await OffHireNoteManpowerModel.create(
          { ohn_id, trip_id: newTrip.trip_id, ...mp, return_status: mp.return_status || "Returned" },
          { transaction }
        );
      }
    }
    if (attachments?.length > 0) {
      for (const attach of attachments) {
        await OffHireNoteAttachmentModel.create(
          { ohn_id, trip_id: newTrip.trip_id, ...attach, condition: attach.condition || "Good", damage_description: attach.damage_description || null },
          { transaction }
        );
      }
    }
    if (subProducts?.length > 0) {
      for (const subProd of subProducts) {
        await OffHireNoteSubProductModel.create(
          { ohn_id, trip_id: newTrip.trip_id, ...subProd },
          { transaction }
        );
      }
    }

    await transaction.commit();

    res.status(201).json({ message: "Trip added successfully to off hire note", trip: newTrip });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trip to off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE TRIP
// ─────────────────────────────────────────────────────────────────────────────
const deleteOffHireNoteTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OffHireNoteTripModel.findByPk(trip_id);
    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    const ohn = await OffHireNoteModel.findByPk(trip.ohn_id);
    if (ohn.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({ message: "Cannot delete trip. OHN is already in progress or completed." });
    }

    await OffHireNoteEquipmentModel.destroy({ where: { trip_id }, transaction });
    await OffHireNoteManpowerModel.destroy({ where: { trip_id }, transaction });
    await OffHireNoteAttachmentModel.destroy({ where: { trip_id }, transaction });
    await OffHireNoteSubProductModel.destroy({ where: { trip_id }, transaction });
    await trip.destroy({ transaction });

    await transaction.commit();
    res.status(200).json({ message: "Trip and its resources deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// UPDATE TRIP DETAILS
// ─────────────────────────────────────────────────────────────────────────────
const updateTripInOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const {
      transportation_company, trip_date, driver_name, driver_contact,
      vehicle_type, vehicle_number, recovery_vehicle_number, chargeable_type,
      equipment, manpower, attachments, subProducts, remarks,
    } = req.body;

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
      transaction,
    });
    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.offHireNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot edit trip - Off Hire Note is in '${trip.offHireNote.status}' status. Only 'Creation' status allows edits.`,
      });
    }

    await trip.update(
      { transportation_company, trip_date, driver_name, driver_contact, vehicle_type, vehicle_number, recovery_vehicle_number, chargeable_type: chargeable_type || "Demobilization", remarks },
      { transaction }
    );

    if (equipment !== undefined) {
      await OffHireNoteEquipmentModel.destroy({ where: { trip_id }, transaction });
      for (const equip of equipment) {
        await OffHireNoteEquipmentModel.create(
          { ohn_id: trip.ohn_id, trip_id, ...equip, condition: equip.condition || "Good", damage_description: equip.damage_description || null },
          { transaction }
        );
      }
    }
    if (manpower !== undefined) {
      await OffHireNoteManpowerModel.destroy({ where: { trip_id }, transaction });
      for (const mp of manpower) {
        await OffHireNoteManpowerModel.create(
          { ohn_id: trip.ohn_id, trip_id, ...mp, return_status: mp.return_status || "Returned" },
          { transaction }
        );
      }
    }
    if (attachments !== undefined) {
      await OffHireNoteAttachmentModel.destroy({ where: { trip_id }, transaction });
      for (const attach of attachments) {
        await OffHireNoteAttachmentModel.create(
          { ohn_id: trip.ohn_id, trip_id, ...attach, condition: attach.condition || "Good", damage_description: attach.damage_description || null },
          { transaction }
        );
      }
    }
    if (subProducts !== undefined) {
      await OffHireNoteSubProductModel.destroy({ where: { trip_id }, transaction });
      for (const subProd of subProducts) {
        await OffHireNoteSubProductModel.create(
          { ohn_id: trip.ohn_id, trip_id, ...subProd },
          { transaction }
        );
      }
    }

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// READ OPERATIONS (unchanged logic, kept for completeness)
// ─────────────────────────────────────────────────────────────────────────────
const getOffHireNoteSummary = async (req, res) => {
  try {
    const { ohn_id } = req.params;
    const offHireNote = await OffHireNoteModel.findByPk(ohn_id, {
      include: [
        { model: SalesOrdersModel, as: "salesOrder", attributes: ["so_number", "client", "project_name"] },
        {
          model: OffHireNoteTripModel,
          as: "trips",
          include: [
            { model: OffHireNoteEquipmentModel, as: "equipment", attributes: ["id","serial_number","reg_number","equipment_type","condition","damage_description"] },
            { model: OffHireNoteManpowerModel,  as: "manpower",  attributes: ["id","employee_id","employee_no","employee_name","return_status"] },
            { model: OffHireNoteAttachmentModel,as: "attachments",attributes: ["id","attachment_id","attachment_number","attachment_type","condition","damage_description"] },
            { model: OffHireNoteSubProductModel,as: "subProducts",attributes: ["id","product_id","product_name","attachment_number","unit_price","income_account"] },
          ],
          order: [["trip_number", "ASC"]],
        },
      ],
    });

    if (!offHireNote) return res.status(404).json({ message: "Off hire note not found" });

    const summaryData = {
      ohn_number: offHireNote.ohn_number,
      client: offHireNote.client_name,
      project: offHireNote.project_name,
      status: offHireNote.status,
      trips: offHireNote.trips.map((trip) => ({
        trip_number: trip.trip_number,
        trip_date: trip.trip_date,
        trip_reference_number: trip.trip_reference_number,
        trip_status: trip.trip_status,
        equipment: trip.equipment.map((eq) => ({ type: "Equipment", id: eq.serial_number, number: eq.reg_number, details: eq.equipment_type, condition: eq.condition, damage_description: eq.damage_description, status: trip.trip_status })),
        manpower: trip.manpower.map((mp) => ({ type: "Manpower", id: mp.employee_id, number: mp.employee_no, details: mp.employee_name, return_status: mp.return_status, status: trip.trip_status })),
        attachments: trip.attachments.map((at) => ({ type: "Attachment", id: at.attachment_id, number: at.attachment_number, details: at.attachment_type, condition: at.condition, damage_description: at.damage_description, status: trip.trip_status })),
        subProducts: trip.subProducts.map((sp) => ({ type: "SubProduct", id: sp.product_id, number: sp.attachment_number, details: sp.product_name, unit_price: sp.unit_price, income_account: sp.income_account })),
        transportation: { company: trip.transportation_company, driver: trip.driver_name, contact: trip.driver_contact, vehicle: trip.vehicle_number, recovery_vehicle: trip.recovery_vehicle_number },
      })),
    };

    res.status(200).json({ success: true, summary: summaryData });
  } catch (error) {
    console.error("Error fetching off hire note summary:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllOffHireNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);
    const { count, rows } = await OffHireNoteModel.findAndCountAll({
      include: [
        { model: SalesOrdersModel, as: "salesOrder", attributes: ["so_number", "client", "project_name"] },
        {
          model: OffHireNoteTripModel, as: "trips",
          include: [
            { model: OffHireNoteEquipmentModel, as: "equipment" },
            { model: OffHireNoteManpowerModel,  as: "manpower" },
            { model: OffHireNoteAttachmentModel,as: "attachments" },
            { model: OffHireNoteSubProductModel,as: "subProducts" },
          ],
        },
      ],
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ totalCount: count, currentPage: parseInt(page), totalPages: Math.ceil(count / limit), offHireNotes: rows });
  } catch (error) {
    console.error("Error fetching off hire notes:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOffHireNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const offHireNote = await OffHireNoteModel.findByPk(id, {
      include: [
        { model: SalesOrdersModel, as: "salesOrder" },
        {
          model: OffHireNoteTripModel, as: "trips",
          include: [
            { model: OffHireNoteEquipmentModel, as: "equipment" },
            { model: OffHireNoteManpowerModel,  as: "manpower" },
            { model: OffHireNoteAttachmentModel,as: "attachments" },
            { model: OffHireNoteSubProductModel,as: "subProducts" },
          ],
        },
      ],
    });
    if (!offHireNote) return res.status(404).json({ message: "Off hire note not found" });
    res.status(200).json(offHireNote);
  } catch (error) {
    console.error("Error fetching off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOffHireNoteByAllocation = async (req, res) => {
  try {
    const { allocation_id } = req.params;
    const offHireNote = await OffHireNoteModel.findOne({
      where: { allocation_id },
      include: [
        { model: SalesOrdersModel, as: "salesOrder", attributes: ["id","so_number","client","so_status","project_name"] },
        {
          model: OffHireNoteTripModel, as: "trips",
          include: [
            { model: OffHireNoteEquipmentModel, as: "equipment", attributes: ["id","serial_number","reg_number","equipment_type","condition","damage_description","checklist_file_path","checklist_file_name","checklist_uploaded_at","checklist_uploaded_by"] },
            { model: OffHireNoteManpowerModel,  as: "manpower",  attributes: ["id","employee_id","employee_no","employee_name","return_status","checklist_file_path","checklist_file_name","checklist_uploaded_at","checklist_uploaded_by"] },
            { model: OffHireNoteAttachmentModel,as: "attachments",attributes: ["id","attachment_id","attachment_number","attachment_type","condition","damage_description","checklist_file_path","checklist_file_name","checklist_uploaded_at","checklist_uploaded_by"] },
            { model: OffHireNoteSubProductModel,as: "subProducts", attributes: ["id","product_id","product_name","attachment_number","unit_price","income_account"] },
          ],
        },
      ],
    });
    if (!offHireNote) return res.status(404).json({ message: "No off hire note found for this allocation", exists: false });
    res.status(200).json({
      ...offHireNote.toJSON(),
      orderStatusInfo: {
        currentOrderStatus: offHireNote.salesOrder?.so_status,
        orderNumber: offHireNote.salesOrder?.so_number,
        client: offHireNote.salesOrder?.client,
      },
    });
  } catch (error) {
    console.error("Error fetching off hire note:", error);
    res.status(500).json({ error: error.message, exists: false });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CHECKLIST OPERATIONS (unchanged)
// ─────────────────────────────────────────────────────────────────────────────
const uploadResourceChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id, resource_type, resource_id } = req.params;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const validTypes = ["equipment", "manpower", "attachment"];
    if (!validTypes.includes(resource_type)) return res.status(400).json({ message: "Invalid resource type" });

    const modelMap = { equipment: OffHireNoteEquipmentModel, manpower: OffHireNoteManpowerModel, attachment: OffHireNoteAttachmentModel };
    const Model = modelMap[resource_type];
    const whereCondition = { id: resource_id, trip_id };

    const resource = await Model.findOne({ where: whereCondition, transaction });
    if (!resource) {
      await transaction.rollback();
      return res.status(404).json({ message: `${resource_type} not found in this trip` });
    }

    let username = "iteq-admin";
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) username = user.username;
    }

    const uploadedAt = new Date();
    await Model.update(
      { checklist_file_path: file.path, checklist_file_name: file.originalname, checklist_uploaded_at: uploadedAt, checklist_uploaded_by: username },
      { where: whereCondition, transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: "Checklist uploaded successfully", file: { path: file.path, name: file.originalname, uploaded_at: uploadedAt, uploaded_by: username } });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading checklist:", error);
    res.status(500).json({ message: "Failed to upload checklist", error: error.message });
  }
};

const downloadResourceChecklist = async (req, res) => {
  try {
    const { trip_id, resource_type, resource_id } = req.params;
    const validTypes = ["equipment", "manpower", "attachment"];
    if (!validTypes.includes(resource_type)) return res.status(400).json({ message: "Invalid resource type" });

    const modelMap = { equipment: OffHireNoteEquipmentModel, manpower: OffHireNoteManpowerModel, attachment: OffHireNoteAttachmentModel };
    const resource = await modelMap[resource_type].findOne({ where: { id: resource_id, trip_id } });
    if (!resource) return res.status(404).json({ message: `${resource_type} not found in this trip` });
    if (!resource.checklist_file_path || !resource.checklist_file_name) return res.status(404).json({ message: "No checklist found for this resource" });
    if (!fs.existsSync(resource.checklist_file_path)) return res.status(404).json({ message: "Checklist file not found on server" });

    res.download(resource.checklist_file_path, resource.checklist_file_name, (err) => {
      if (err) { console.error("Error downloading file:", err); res.status(500).json({ message: "Error downloading checklist file" }); }
    });
  } catch (error) {
    console.error("Error downloading checklist:", error);
    res.status(500).json({ message: "Failed to download checklist", error: error.message });
  }
};

const deleteResourceChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id, resource_type, resource_id } = req.params;
    const validTypes = ["equipment", "manpower", "attachment"];
    if (!validTypes.includes(resource_type)) return res.status(400).json({ message: "Invalid resource type" });

    const modelMap = { equipment: OffHireNoteEquipmentModel, manpower: OffHireNoteManpowerModel, attachment: OffHireNoteAttachmentModel };
    const Model = modelMap[resource_type];
    const whereCondition = { id: resource_id, trip_id };

    const resource = await Model.findOne({ where: whereCondition, transaction });
    if (!resource) { await transaction.rollback(); return res.status(404).json({ message: `${resource_type} not found in this trip` }); }
    if (!resource.checklist_file_path) { await transaction.rollback(); return res.status(404).json({ message: "No checklist found for this resource" }); }

    if (fs.existsSync(resource.checklist_file_path)) fs.unlinkSync(resource.checklist_file_path);

    await Model.update(
      { checklist_file_path: null, checklist_file_name: null, checklist_uploaded_at: null, checklist_uploaded_by: null },
      { where: whereCondition, transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: "Checklist deleted successfully", resource_type, resource_id });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting checklist:", error);
    res.status(500).json({ message: "Failed to delete checklist", error: error.message });
  }
};

// ── generateOffHireNotePDF  (Approved → In Progress)  ────────────────────────
// Route: GET /api/off-hire-notes/trip/:trip_id/generate-pdf
const generateOffHireNotePDF = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await transaction.rollback();
      return res.status(401).json({ error: "Authentication token is required" });
    }

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OffHireNoteModel,
          as: "offHireNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: OffHireNoteEquipmentModel,  as: "equipment" },
        { model: OffHireNoteManpowerModel,   as: "manpower" },
        { model: OffHireNoteAttachmentModel, as: "attachments" },
        { model: OffHireNoteSubProductModel, as: "subProducts" },
      ],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Approved") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot generate PDF — trip must be in 'Approved' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    await trip.update({ trip_status: "In Progress" }, { transaction });

    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    await transaction.commit();

    // Re-fetch with updated statuses
    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OffHireNoteModel,
          as: "offHireNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: OffHireNoteEquipmentModel,  as: "equipment" },
        { model: OffHireNoteManpowerModel,   as: "manpower" },
        { model: OffHireNoteAttachmentModel, as: "attachments" },
        { model: OffHireNoteSubProductModel, as: "subProducts" },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Trip ${trip.trip_reference_number} moved to In Progress. PDF data ready.`,
      data: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating off hire note PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── uploadOffHireNoteAttachment  (In Progress → Off Hired)  ──────────────────
// Route: POST /api/off-hire-notes/trip/:trip_id/upload-attachment
const uploadOffHireNoteAttachment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "Off hire attachment file is required" });
    }

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OffHireNoteModel,
          as: "offHireNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
      ],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot complete trip — trip must be in 'In Progress' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    const fileName = req.file.filename;
    const filePath = `/uploads/off-hire-notes/${fileName}`;

    // Mark this specific trip as Off Hired
    await trip.update({ trip_status: "Off Hired" }, { transaction });

    // Store attachment on the OHN header
    await OffHireNoteModel.update(
      { off_hire_attachment: fileName },
      { where: { ohn_id: trip.ohn_id }, transaction }
    );

    // Re-derive OHN status from all trip statuses
    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    // If ALL trips are now Off Hired / Close → update allocation & sales order
    const remainingTrips = await OffHireNoteTripModel.findAll({
      where: { ohn_id: trip.ohn_id },
      attributes: ["trip_status"],
      transaction,
    });
    const allOffHired = remainingTrips.every(
      (t) => t.trip_status === "Off Hired" || t.trip_status === "Close"
    );
    if (allOffHired) {
      const offHireNote = await OffHireNoteModel.findByPk(trip.ohn_id, { transaction });
      await SalesOrdersModel.update(
        { ops_status: "Completed" },
        { where: { id: offHireNote.sales_order_id }, transaction }
      );
      await ActiveAllocationModel.update(
        { status: "Completed" },
        { where: { allocation_id: offHireNote.allocation_id }, transaction }
      );
    }

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} marked as Off Hired. OHN status recalculated.`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
      uploadedFile: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: filePath,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading off hire note attachment:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 1. submitOHNTripForApproval  (Creation → Under Approval) ─────────────────
const submitOHNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot submit trip for approval — trip must be in 'Creation' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    await trip.update({ trip_status: "Under Approval" }, { transaction });

    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} submitted for approval successfully`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting OHN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 2. approveOHNTrip  (Under Approval → Approved) ───────────────────────────
const approveOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot approve trip — trip must be in 'Under Approval' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    await trip.update({ trip_status: "Approved" }, { transaction });

    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} approved successfully`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 3. rejectOHNTrip  (Under Approval → Rejected) ────────────────────────────
const rejectOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot reject trip — trip must be in 'Under Approval' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction }
    );

    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} rejected successfully`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 4. generateOHNTripPDF  (Approved → In Progress) ──────────────────────────
const generateOHNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await transaction.rollback();
      return res.status(401).json({ error: "Authentication token is required" });
    }

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OffHireNoteModel,
          as: "offHireNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Approved") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot generate PDF — trip must be in 'Approved' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    await trip.update({ trip_status: "In Progress" }, { transaction });

    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: OffHireNoteModel,
          as: "offHireNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Trip ${trip.trip_reference_number} moved to In Progress. PDF data ready.`,
      data: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating OHN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 5. completeOHNTrip  (In Progress → Off Hired) ────────────────────────────
const completeOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "Off hire attachment file is required to complete a trip" });
    }

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot complete trip — trip must be in 'In Progress' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    const fileName = req.file.filename;
    const filePath = `/uploads/off-hire-notes/${fileName}`;

    await trip.update({ trip_status: "Off Hired" }, { transaction });

    // Store attachment on the OHN header
    await OffHireNoteModel.update(
      { off_hire_attachment: fileName },
      { where: { ohn_id: trip.ohn_id }, transaction }
    );

    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    // If all trips are now Off Hired / Close → update allocation & sales order
    const remainingTrips = await OffHireNoteTripModel.findAll({
      where: { ohn_id: trip.ohn_id },
      attributes: ["trip_status"],
      transaction,
    });
    const allOffHired = remainingTrips.every(
      (t) => t.trip_status === "Off Hired" || t.trip_status === "Close"
    );
    if (allOffHired) {
      const offHireNote = await OffHireNoteModel.findByPk(trip.ohn_id, { transaction });
      await SalesOrdersModel.update(
        { ops_status: "Completed" },
        { where: { id: offHireNote.sales_order_id }, transaction }
      );
      await ActiveAllocationModel.update(
        { status: "Completed" },
        { where: { allocation_id: offHireNote.allocation_id }, transaction }
      );
    }

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} marked as Off Hired successfully`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
      uploadedFile: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: filePath,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 6. closeOHNTrip  (Off Hired → Close) ─────────────────────────────────────
const closeOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: OffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Off Hired") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot close trip — trip must be in 'Off Hired' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });

    const newOHNStatus = await checkAndUpdateOHNStatus(trip.ohn_id, transaction);

    await transaction.commit();

    const updatedTrip = await OffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: OffHireNoteEquipmentModel, as: "equipment" },
        { model: OffHireNoteManpowerModel,  as: "manpower" },
        { model: OffHireNoteAttachmentModel,as: "attachments" },
        { model: OffHireNoteSubProductModel,as: "subProducts" },
      ],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} closed successfully`,
      trip: updatedTrip,
      ohnStatus: newOHNStatus,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOffHireNote,
  getAllOffHireNotes,
  getOffHireNoteById,
  getOffHireNoteByAllocation,
  generateOffHireNotePDF,
  updateOffHireNoteStatus,
  updateTripStatus,
  getOffHireNoteSummary,
  addTripToOffHireNote,
  uploadOffHireNoteAttachment,
  rejectOffHireNote,
  deleteOffHireNoteTrip,
  submitOffHireNoteForApproval,
  approveOffHireNote,
  updateOffHireNoteStatusGeneric,
  updateTripInOffHireNote,
  uploadResourceChecklist,
  downloadResourceChecklist,
  deleteResourceChecklist,
  submitTripForApproval,
  submitOHNTripForApproval,
  approveOHNTrip,
  rejectOHNTrip,
  generateOHNTripPDF,
  completeOHNTrip,
  closeOHNTrip,
};