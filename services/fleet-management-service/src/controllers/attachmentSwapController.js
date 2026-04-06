// // // controllers/fleet-management/AttachmentSwapController.js
// // const AttachmentSwapModel = require("../../models/fleet-management/AttachmentSwapModel");
// // const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// // const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// // const {
// //   AttachmentDeliveryNoteModel,
// //   AttachmentDeliveryNoteTripModel,
// // } = require("../../models/fleet-management/AttachmentDeliveryNoteModel");
// // const {
// //   AttachmentOffHireNoteModel,
// //   AttachmentOffHireNoteTripModel,
// // } = require("../../models/fleet-management/AttachmentOffHireNoteModel");
// // const sequelize = require("../../config/dbSync");
// // const { Op } = require("sequelize");
// // const UsersModel = require("../../models/user-security-management/UsersModel");
// // const SwapReasonModel = require("../../models/fleet-management/swapReasonModel");
// // const path = require("path");
// // const fs = require("fs");
// // const PDFDocument = require("pdfkit");

// // // Get all attachment numbers for dropdown
// // const getAllAttachmentNumbers = async (req, res) => {
// //   try {
// //     const attachment = await AttachmentModel.findAll({
// //       where: { status: "Active" },
// //       attributes: ["attachment_id", "attachment_number", "product_name"],
// //       order: [["attachment_number", "ASC"]],
// //     });

// //     res.status(200).json({
// //       success: true,
// //       attachment: attachment.map((attach) => ({
// //         attachment_id: attach.attachment_id,
// //         attachment_number: attach.attachment_number,
// //         product_name: attach.product_name,
// //       })),
// //     });
// //   } catch (error) {
// //     console.error("Error fetching attachments:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const getAttachmentSwapReasons = async (req, res) => {
// //   try {
// //     const swapReasons = await SwapReasonModel.findAll({
// //       where: {
// //         category: "Attachment",
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
// //     console.error("Error fetching attachment swap reasons:", error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // controllers/fleet-management/attachmentSwapController.js
// // // UPDATED FUNCTION: createAttachmentSwap — generates swap_group_id shared by both records

// // // ─── Helper: generate a human-readable group ID ────────────────────────────
// // // Format: AT-YYYYMMDD-XXXX  (e.g. AT-20260224-B7D2)
// // const generateSwapGroupId = (prefix = "AT") => {
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

// // const createAttachmentSwap = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const {
// //       sales_order_id,
// //       allocation_id,
// //       previous_attachment_no,
// //       new_attachment_no,
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
// //       !previous_attachment_no ||
// //       !new_attachment_no ||
// //       !swap_date ||
// //       !swap_reason
// //     ) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "All required fields must be filled",
// //       });
// //     }

// //     // Check if new attachment number exists
// //     const existingAttachment = await AttachmentModel.findOne({
// //       where: { attachment_number: new_attachment_no, status: "Active" },
// //     });

// //     if (!existingAttachment) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "New attachment number does not exist in attachment table",
// //       });
// //     }

// //     // Get sales order
// //     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
// //     if (!salesOrder) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Sales order not found" });
// //     }

// //     // Get previous attachment details
// //     const previousAttachment = await AttachmentModel.findOne({
// //       where: { attachment_number: previous_attachment_no },
// //     });

// //     if (!previousAttachment) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Previous attachment not found" });
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
// //     const swapGroupId = generateSwapGroupId("AT");

// //     // CREATE RECORD 1: OFF_HIRE — for the outgoing/previous attachment
// //     const offHireRecord = await AttachmentSwapModel.create(
// //       {
// //         swap_group_id: swapGroupId,              // ✅ shared group ID
// //         sales_order_id,
// //         allocation_id: allocation_id || null,
// //         previous_attachment_id: previousAttachment.attachment_id,
// //         previous_attachment_no: previous_attachment_no,
// //         new_attachment_id: existingAttachment.attachment_id,
// //         new_attachment_no: null,
// //         swap_date,
// //         swap_reason,
// //         swap_type: "OFF_HIRE",
// //         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
// //         swap_mobilization_trips: swap_mobilization_trips || null,
// //         swap_demobilization_trips: swap_demobilization_trips || null,
// //         swap_remark: swap_remark || null,
// //         delivery_note_status: "Pending",
// //         off_hire_note_status: "Pending",
// //         overall_status: "Creation",
// //         created_by: username,
// //       },
// //       { transaction },
// //     );

// //     // CREATE RECORD 2: DELIVERY — for the incoming/new attachment
// //     const deliveryRecord = await AttachmentSwapModel.create(
// //       {
// //         swap_group_id: swapGroupId,              // ✅ same shared group ID
// //         sales_order_id,
// //         allocation_id: allocation_id || null,
// //         previous_attachment_id: previousAttachment.attachment_id,
// //         previous_attachment_no: null,
// //         new_attachment_id: existingAttachment.attachment_id,
// //         new_attachment_no: new_attachment_no,
// //         swap_date,
// //         swap_reason,
// //         swap_type: "DELIVERY",
// //         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
// //         swap_mobilization_trips: swap_mobilization_trips || null,
// //         swap_demobilization_trips: swap_demobilization_trips || null,
// //         swap_remark: swap_remark || null,
// //         delivery_note_status: "Pending",
// //         off_hire_note_status: "Pending",
// //         overall_status: "Creation",
// //         created_by: username,
// //       },
// //       { transaction },
// //     );

// //     // Update allocation attachment if allocation_id exists
// //     if (allocation_id) {
// //       const ActiveAllocationAttachmentModel =
// //         require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationAttachmentModel;

// //       await ActiveAllocationAttachmentModel.update(
// //         {
// //           attachment_id: existingAttachment.attachment_id,
// //           updated_at: new Date(),
// //         },
// //         {
// //           where: {
// //             allocation_id: allocation_id,
// //             attachment_id: previousAttachment.attachment_id,
// //           },
// //           transaction,
// //         },
// //       );
// //     }

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Attachment is Changed",
// //       attachmentSwaps: [offHireRecord, deliveryRecord],
// //       swap_group_id: swapGroupId,              // ✅ returned in response
// //       summary: {
// //         swap_group_id: swapGroupId,
// //         off_hire_attachment: previous_attachment_no,
// //         delivery_attachment: new_attachment_no,
// //         swap_date,
// //       },
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating attachment swap:", error);
// //     res.status(500).json({
// //       message: "Error creating attachment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // // const createAttachmentSwap = async (req, res) => {
// // //   const transaction = await sequelize.transaction();

// // //   try {
// // //     const {
// // //       sales_order_id,
// // //       allocation_id,
// // //       previous_attachment_no,
// // //       new_attachment_no,
// // //       swap_date,
// // //       swap_reason,
// // //       swap_estimated_recovery_cost,
// // //       swap_mobilization_trips,
// // //       swap_demobilization_trips,
// // //       swap_remark,
// // //     } = req.body;

// // //     // Validate required fields
// // //     if (
// // //       !sales_order_id ||
// // //       !previous_attachment_no ||
// // //       !new_attachment_no ||
// // //       !swap_date ||
// // //       !swap_reason
// // //     ) {
// // //       await transaction.rollback();
// // //       return res.status(400).json({
// // //         message: "All required fields must be filled",
// // //       });
// // //     }

// // //     // Check if new attachment number exists
// // //     const existingAttachment = await AttachmentModel.findOne({
// // //       where: { attachment_number: new_attachment_no, status: "Active" },
// // //     });

// // //     if (!existingAttachment) {
// // //       await transaction.rollback();
// // //       return res.status(400).json({
// // //         message: "New attachment number does not exist in attachment table",
// // //       });
// // //     }

// // //     // Get sales order
// // //     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
// // //     if (!salesOrder) {
// // //       await transaction.rollback();
// // //       return res.status(404).json({ message: "Sales order not found" });
// // //     }

// // //     // Get previous attachment details
// // //     const previousAttachment = await AttachmentModel.findOne({
// // //       where: { attachment_number: previous_attachment_no },
// // //     });

// // //     if (!previousAttachment) {
// // //       await transaction.rollback();
// // //       return res.status(404).json({ message: "Previous attachment not found" });
// // //     }

// // //     // Get logged in user
// // //     let username = "System";
// // //     if (req.user?.uid) {
// // //       const user = await UsersModel.findByPk(req.user.uid);
// // //       if (user) {
// // //         username = user.username;
// // //       }
// // //     }

// // //     const offHireRecord = await AttachmentSwapModel.create(
// // //       {
// // //         sales_order_id,
// // //         allocation_id: allocation_id || null,
// // //         previous_attachment_id: previousAttachment.attachment_id,
// // //         previous_attachment_no: previous_attachment_no,
// // //         new_attachment_id: existingAttachment.attachment_id,
// // //         new_attachment_no: null,
// // //         swap_date,
// // //         swap_reason,
// // //         swap_type: "OFF_HIRE",
// // //         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
// // //         swap_mobilization_trips: swap_mobilization_trips || null,
// // //         swap_demobilization_trips: swap_demobilization_trips || null,
// // //         swap_remark: swap_remark || null,
// // //         delivery_note_status: "Pending",
// // //         off_hire_note_status: "Pending",
// // //         overall_status: "Created",
// // //         created_by: username,
// // //       },
// // //       { transaction }
// // //     );

// // //     const deliveryRecord = await AttachmentSwapModel.create(
// // //       {
// // //         sales_order_id,
// // //         allocation_id: allocation_id || null,
// // //         previous_attachment_id: previousAttachment.attachment_id,
// // //         previous_attachment_no: null,
// // //         new_attachment_id: existingAttachment.attachment_id,
// // //         new_attachment_no: new_attachment_no,
// // //         swap_date,
// // //         swap_reason,
// // //         swap_type: "DELIVERY",
// // //         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
// // //         swap_mobilization_trips: swap_mobilization_trips || null,
// // //         swap_demobilization_trips: swap_demobilization_trips || null,
// // //         swap_remark: swap_remark || null,
// // //         delivery_note_status: "Pending",
// // //         off_hire_note_status: "Pending",
// // //         overall_status: "Created",
// // //         created_by: username,
// // //       },
// // //       { transaction }
// // //     );

// // //     // Update allocation attachment if allocation_id exists
// // //     if (allocation_id) {
// // //       const ActiveAllocationAttachmentModel =
// // //         require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationAttachmentModel;

// // //       await ActiveAllocationAttachmentModel.update(
// // //         {
// // //           attachment_id: existingAttachment.attachment_id,
// // //           updated_at: new Date(),
// // //         },
// // //         {
// // //           where: {
// // //             allocation_id: allocation_id,
// // //             attachment_id: previousAttachment.attachment_id,
// // //           },
// // //           transaction,
// // //         }
// // //       );
// // //     }

// // //     await transaction.commit();

// // //     res.status(201).json({
// // //       message: "Attachment is Changed",
// // //       attachmentSwaps: [offHireRecord, deliveryRecord],   // return both
// // //     });
// // //   } catch (error) {
// // //     await transaction.rollback();
// // //     console.error("Error creating attachment swap:", error);
// // //     res.status(500).json({
// // //       message: "Error creating attachment swap",
// // //       error: error.message,
// // //     });
// // //   }
// // // };

// // // Get all attachment swaps for sales order
// // const getAttachmentSwapsBySalesOrder = async (req, res) => {
// //   try {
// //     const { sales_order_id } = req.params;

// //     const attachmentSwaps = await AttachmentSwapModel.findAll({
// //       where: { sales_order_id },
// //       include: [
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"],
// //         },
// //         {
// //           model: AttachmentModel,
// //           as: "previousAttachment",
// //           attributes: [
// //             "attachment_id",
// //             "attachment_number",
// //             "product_name",
// //             "serial_number",
// //           ],
// //         },
// //         {
// //           model: AttachmentModel,
// //           as: "newAttachment",
// //           attributes: [
// //             "attachment_id",
// //             "attachment_number",
// //             "product_name",
// //             "serial_number",
// //           ],
// //         },
// //         {
// //           model: AttachmentDeliveryNoteModel,
// //           as: "deliveryNotes",
// //           include: [
// //             {
// //               model: AttachmentDeliveryNoteTripModel,
// //               as: "trips",
// //             },
// //           ],
// //           order: [["created_at", "DESC"]],
// //         },
// //         {
// //           model: AttachmentOffHireNoteModel,
// //           as: "offHireNotes",
// //           include: [
// //             {
// //               model: AttachmentOffHireNoteTripModel,
// //               as: "trips",
// //             },
// //           ],
// //           order: [["created_at", "DESC"]],
// //         },
// //       ],
// //       order: [["created_at", "DESC"]],
// //     });

// //     res.status(200).json({
// //       totalCount: attachmentSwaps.length,
// //       attachmentSwaps,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching attachment swaps:", error);
// //     res.status(500).json({
// //       message: "Error fetching attachment swaps",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get attachment swap by ID with details
// // const getAttachmentSwapById = async (req, res) => {
// //   try {
// //     const { id } = req.params;

// //     const attachmentSwap = await AttachmentSwapModel.findByPk(id, {
// //       include: [
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["so_number", "client", "project_name"],
// //         },
// //         {
// //           model: AttachmentModel,
// //           as: "previousAttachment",
// //           attributes: [
// //             "attachment_id",
// //             "attachment_number",
// //             "product_name",
// //             "serial_number",
// //           ],
// //         },
// //         {
// //           model: AttachmentModel,
// //           as: "newAttachment",
// //           attributes: [
// //             "attachment_id",
// //             "attachment_number",
// //             "product_name",
// //             "serial_number",
// //           ],
// //         },
// //         {
// //           model: AttachmentDeliveryNoteModel,
// //           as: "deliveryNotes",
// //           include: [
// //             {
// //               model: AttachmentDeliveryNoteTripModel,
// //               as: "trips",
// //             },
// //           ],
// //           order: [["created_at", "DESC"]],
// //         },
// //         {
// //           model: AttachmentOffHireNoteModel,
// //           as: "offHireNotes",
// //           include: [
// //             {
// //               model: AttachmentOffHireNoteTripModel,
// //               as: "trips",
// //             },
// //           ],
// //           order: [["created_at", "DESC"]],
// //         },
// //       ],
// //     });

// //     if (!attachmentSwap) {
// //       return res.status(404).json({ message: "Attachment swap not found" });
// //     }

// //     res.status(200).json({
// //       attachmentSwap,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching attachment swap:", error);
// //     res.status(500).json({
// //       message: "Error fetching attachment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const getPendingAttachmentSwapRequests = async (req, res) => {
// //   try {
// //     const { sales_order_id } = req.query;

// //     const where = {
// //       swap_status: {
// //         [Op.in]: ['Swap Request', 'Resubmit']
// //       }
// //     };

// //     if (sales_order_id) {
// //       where.sales_order_id = sales_order_id;
// //     }

// //     const attachmentSwaps = await AttachmentSwapModel.findAll({
// //       where,
// //       include: [
// //         {
// //           model: SalesOrdersModel,
// //           as: "salesOrder",
// //           attributes: ["id", "so_number", "client", "project_name"]
// //         },
// //         {
// //           model: AttachmentModel,
// //           as: "previousAttachment",
// //           attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"]
// //         },
// //         {
// //           model: AttachmentModel,
// //           as: "newAttachment",
// //           attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"]
// //         }
// //       ],
// //       order: [["created_at", "DESC"]]
// //     });

// //     // Count pending requests
// //     const pendingCount = attachmentSwaps.filter(
// //       swap => swap.swap_status === 'Swap Request'
// //     ).length;

// //     const resubmitCount = attachmentSwaps.filter(
// //       swap => swap.swap_status === 'Resubmit'
// //     ).length;

// //     res.status(200).json({
// //       success: true,
// //       totalCount: attachmentSwaps.length,
// //       pendingCount,
// //       resubmitCount,
// //       attachmentSwaps
// //     });
// //   } catch (error) {
// //     console.error("Error fetching pending attachment swap requests:", error);
// //     res.status(500).json({
// //       message: "Error fetching pending attachment swap requests",
// //       error: error.message
// //     });
// //   }
// // };

// // const getSwapRequestCounts = async (req, res) => {
// //   try {
// //     const { sales_order_id } = req.query;

// //     const where = {
// //       swap_status: {
// //         [Op.in]: ['Swap Request', 'Resubmit']
// //       }
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
// //       totalSwapCount: equipmentCount + attachmentCount
// //     });
// //   } catch (error) {
// //     console.error("Error fetching swap request counts:", error);
// //     res.status(500).json({
// //       message: "Error fetching swap request counts",
// //       error: error.message
// //     });
// //   }
// // };

// // // Create attachment delivery note with trips
// // const createAttachmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_swap_id } = req.params;
// //     const { delivery_date, remarks, trips } = req.body;

// //     // Get attachment swap
// //     const attachmentSwap = await AttachmentSwapModel.findByPk(
// //       attachment_swap_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentModel,
// //             as: "newAttachment",
// //             attributes: ["attachment_id", "attachment_number", "product_name"],
// //           },
// //           {
// //             model: SalesOrdersModel,
// //             as: "salesOrder",
// //             attributes: ["so_number", "client", "project_name"],
// //           },
// //         ],
// //       }
// //     );

// //     if (!attachmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Attachment swap not found" });
// //     }

// //     // Generate DN number
// //     const currentYear = new Date().getFullYear();
// //     const prefix = `AT-DN-${currentYear}-`;

// //     const lastDN = await AttachmentDeliveryNoteModel.findOne({
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
// //       if (user) {
// //         username = user.username;
// //       }
// //     }

// //     // Create delivery note
// //     const deliveryNote = await AttachmentDeliveryNoteModel.create(
// //       {
// //         attachment_swap_id,
// //         dn_number,
// //         new_attachment_id: attachmentSwap.new_attachment_id,
// //         new_attachment_no: attachmentSwap.new_attachment_no,
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
// //         await AttachmentDeliveryNoteTripModel.create(
// //           {
// //             attachment_dn_id: deliveryNote.attachment_dn_id,
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
// //           { transaction }
// //         );
// //       }
// //     }

// //     const sameGroupSwapData = await AttachmentSwapModel.findAll({
// //       where: {
// //         overall_status: "Partially completed",
// //         swap_group_id: attachmentSwap.swap_group_id,
// //       },
// //     });

// //     if (attachmentSwap.overall_status === "In progress") {
// //       if (sameGroupSwapData.length > 0) {
// //         const attachmentGroupSwapData = await AttachmentSwapModel.findAll({
// //           where: {
// //             swap_group_id: attachmentSwap.swap_group_id,
// //           },
// //         });

// //         const ids = attachmentGroupSwapData.map((data) =>
// //           data.getDataValue("attachment_swap_id"),
// //         );
// //         for (const data of attachmentGroupSwapData) {
// //           await AttachmentSwapModel.update(
// //             { overall_status: "Completed" },
// //             {
// //               where: { attachment_swap_id: { [Op.in]: ids } },
// //               transaction,
// //             },
// //           );
// //         }
// //       } else {
// //         await AttachmentSwapModel.update(
// //           { overall_status: "Partially completed" },
// //           {
// //             where: { attachment_swap_id: attachmentSwap.attachment_swap_id },
// //             transaction,
// //           },
// //         );
// //       }
// //     }

// //     await transaction.commit();

// //     // Fetch created delivery note with trips
// //     const createdDeliveryNote = await AttachmentDeliveryNoteModel.findByPk(
// //       deliveryNote.attachment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentDeliveryNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: AttachmentSwapModel,
// //             as: "attachmentSwap",
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
// //       message: "Attachment delivery note created successfully",
// //       deliveryNote: createdDeliveryNote,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating attachment delivery note:", error);
// //     res.status(500).json({
// //       message: "Error creating attachment delivery note",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Create attachment off hire note with trips
// // const createAttachmentOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_swap_id } = req.params;
// //     const { off_hire_date, remarks, trips } = req.body;

// //     // Get attachment swap
// //     const attachmentSwap = await AttachmentSwapModel.findByPk(
// //       attachment_swap_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentModel,
// //             as: "previousAttachment",
// //             attributes: ["attachment_id", "attachment_number", "product_name"],
// //           },
// //           {
// //             model: SalesOrdersModel,
// //             as: "salesOrder",
// //             attributes: ["so_number", "client", "project_name"],
// //           },
// //         ],
// //       }
// //     );

// //     if (!attachmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Attachment swap not found" });
// //     }

// //     // Generate OHN number
// //     const currentYear = new Date().getFullYear();
// //     const prefix = `AT-OH-${currentYear}-`;

// //     const lastOHN = await AttachmentOffHireNoteModel.findOne({
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
// //     const offHireNote = await AttachmentOffHireNoteModel.create(
// //       {
// //         attachment_swap_id,
// //         ohn_number,
// //         previous_attachment_id: attachmentSwap.previous_attachment_id,
// //         previous_attachment_no: attachmentSwap.previous_attachment_no,
// //         off_hire_date,
// //         status: "Creation",
// //         remarks,
// //         created_by: username,
// //       },
// //       { transaction }
// //     );

// //     // Create trips if provided
// //     if (trips && trips.length > 0) {
// //       for (const trip of trips) {
// //         await AttachmentOffHireNoteTripModel.create(
// //           {
// //             attachment_ohn_id: offHireNote.attachment_ohn_id,
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
// //           { transaction }
// //         );
// //       }
// //     }

// //     const sameGroupSwapData = await AttachmentSwapModel.findAll({
// //       where: {
// //         overall_status: "Partially completed",
// //         swap_group_id: attachmentSwap.swap_group_id,
// //       },
// //     });

// //     if (attachmentSwap.overall_status === "In progress") {
// //       if (sameGroupSwapData.length > 0) {
// //         const attachmentGroupSwapData = await AttachmentSwapModel.findAll({
// //           where: {
// //             swap_group_id: attachmentSwap.swap_group_id,
// //           },
// //         });

// //         const ids = attachmentGroupSwapData.map((data) =>
// //           data.getDataValue("attachment_swap_id"),
// //         );
// //         for (const data of attachmentGroupSwapData) {
// //           await AttachmentSwapModel.update(
// //             { overall_status: "Completed" },
// //             {
// //               where: { attachment_swap_id: { [Op.in]: ids } },
// //               transaction,
// //             },
// //           );
// //         }
// //       } else {
// //         await AttachmentSwapModel.update(
// //           { overall_status: "Partially completed" },
// //           {
// //             where: { attachment_swap_id: attachmentSwap.attachment_swap_id },
// //             transaction,
// //           },
// //         );
// //       }
// //     }

// //     await transaction.commit();

// //     // Fetch created off hire note with trips
// //     const createdOffHireNote = await AttachmentOffHireNoteModel.findByPk(
// //       offHireNote.attachment_ohn_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentOffHireNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: AttachmentSwapModel,
// //             as: "attachmentSwap",
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
// //       message: "Attachment off hire note created successfully",
// //       offHireNote: createdOffHireNote,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error creating attachment off hire note:", error);
// //     res.status(500).json({
// //       message: "Error creating attachment off hire note",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Get attachment delivery note summary
// // const getAttachmentDeliveryNoteSummary = async (req, res) => {
// //   try {
// //     const { attachment_dn_id } = req.params;

// //     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
// //       attachment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentDeliveryNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: AttachmentSwapModel,
// //             as: "attachmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //                 attributes: ["so_number", "client", "project_name"],
// //               },
// //               {
// //                 model: AttachmentModel,
// //                 as: "newAttachment",
// //                 attributes: [
// //                   "attachment_id",
// //                   "attachment_number",
// //                   "product_name",
// //                   "serial_number",
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Format summary data
// //     const summaryData = {
// //       dn_number: deliveryNote.dn_number,
// //       attachment: deliveryNote.attachmentSwap.newAttachment,
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

// // // Get attachment off hire note summary
// // const getAttachmentOffHireNoteSummary = async (req, res) => {
// //   try {
// //     const { attachment_ohn_id } = req.params;

// //     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
// //       attachment_ohn_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentOffHireNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: AttachmentSwapModel,
// //             as: "attachmentSwap",
// //             include: [
// //               {
// //                 model: SalesOrdersModel,
// //                 as: "salesOrder",
// //                 attributes: ["so_number", "client", "project_name"],
// //               },
// //               {
// //                 model: AttachmentModel,
// //                 as: "previousAttachment",
// //                 attributes: [
// //                   "attachment_id",
// //                   "attachment_number",
// //                   "product_name",
// //                   "serial_number",
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     if (!offHireNote) {
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Format summary data
// //     const summaryData = {
// //       ohn_number: offHireNote.ohn_number,
// //       attachment: offHireNote.attachmentSwap.previousAttachment,
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

// // // Generate attachment delivery note PDF
// // const generateAttachmentDeliveryNotePDF = async (req, res) => {
// //   try {
// //     const { attachment_dn_id } = req.params;

// //     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
// //       attachment_dn_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentDeliveryNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: AttachmentSwapModel,
// //             as: "attachmentSwap",
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
// //                 model: AttachmentModel,
// //                 as: "newAttachment",
// //                 attributes: [
// //                   "attachment_id",
// //                   "attachment_number",
// //                   "product_name",
// //                   "serial_number",
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     if (!deliveryNote) {
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Update status to In Progress when PDF is generated
// //     await deliveryNote.update({ status: "In Progress" });

// //     // Also update trips status
// //     await AttachmentDeliveryNoteTripModel.update(
// //       { trip_status: "In Progress" },
// //       {
// //         where: { attachment_dn_id, trip_status: "Creation" },
// //       }
// //     );

// //     // Generate PDF
// //     const doc = new PDFDocument({ margin: 40, size: "A4" });

// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="AT-DN-${deliveryNote.dn_number}.pdf"`
// //     );

// //     doc.pipe(res);

// //     // Add border to page
// //     const pageWidth = doc.page.width;
// //     const pageHeight = doc.page.height;
// //     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

// //     // Company Header with Purple Background
// //     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#7C3AED", "#7C3AED");

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
// //         { align: "center" }
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
// //       .fillColor("#7C3AED")
// //       .text("ATTACHMENT DELIVERY NOTE", { align: "center" })
// //       .fillColor("#000000");

// //     doc.moveDown(1);
// //     doc
// //       .moveTo(100, doc.y)
// //       .lineTo(pageWidth - 100, doc.y)
// //       .stroke("#7C3AED");
// //     doc.moveDown(1);

// //     // Two Column Layout for Details
// //     const leftX = 50;
// //     const rightX = 320;
// //     const startY = doc.y;

// //     // Left Column - Ship-to Address
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#7C3AED");
// //     doc.text("SHIP-TO ADDRESS", leftX, startY);
// //     doc.fillColor("#000000");

// //     doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
// //     doc.fontSize(10).font("Helvetica");
// //     doc.text(
// //       deliveryNote.attachmentSwap.salesOrder.client,
// //       leftX + 10,
// //       startY + 30,
// //       { width: 220 }
// //     );

// //     // Right Column - Document Details
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#7C3AED");
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
// //       detailsY + 30
// //     );
// //     doc.text(
// //       deliveryNote.attachmentSwap.salesOrder.so_number,
// //       rightX + 130,
// //       detailsY + 50
// //     );
// //     doc.text(
// //       deliveryNote.attachmentSwap.salesOrder.project_name || "N/A",
// //       rightX + 130,
// //       detailsY + 70,
// //       { width: 100 }
// //     );

// //     doc.y = startY + 120;
// //     doc.moveDown(1);

// //     // Attachment Details Section
// //     doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //     doc
// //       .rect(leftX, doc.y, pageWidth - 100, 20)
// //       .fillAndStroke("#7C3AED", "#7C3AED");
// //     doc.text("ATTACHMENT DETAILS", leftX + 10, doc.y + 5);

// //     doc.fillColor("#000000");
// //     doc.moveDown(1.5);

// //     const attachY = doc.y;
// //     const attachHeight = deliveryNote.attachmentSwap.newAttachment.serial_number
// //       ? 70
// //       : 50;
// //     doc.rect(leftX, attachY, pageWidth - 100, attachHeight).stroke("#CCCCCC");

// //     doc.fontSize(9).font("Helvetica-Bold");
// //     doc.text("Attachment Number:", leftX + 10, attachY + 10);
// //     doc.text("Product Name:", leftX + 10, attachY + 30);

// //     doc.font("Helvetica");
// //     doc.text(
// //       deliveryNote.attachmentSwap.newAttachment.attachment_number,
// //       leftX + 130,
// //       attachY + 10
// //     );
// //     doc.text(
// //       deliveryNote.attachmentSwap.newAttachment.product_name,
// //       leftX + 130,
// //       attachY + 30,
// //       { width: 350 }
// //     );

// //     if (deliveryNote.attachmentSwap.newAttachment.serial_number) {
// //       doc.font("Helvetica-Bold");
// //       doc.text("Serial Number:", leftX + 10, attachY + 50);
// //       doc.font("Helvetica");
// //       doc.text(
// //         deliveryNote.attachmentSwap.newAttachment.serial_number,
// //         leftX + 130,
// //         attachY + 50
// //       );
// //     }

// //     doc.y = attachY + attachHeight + 10;
// //     doc.moveDown(1);

// //     // Transportation Details
// //     if (deliveryNote.trips && deliveryNote.trips.length > 0) {
// //       doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //       doc
// //         .rect(leftX, doc.y, pageWidth - 100, 20)
// //         .fillAndStroke("#7C3AED", "#7C3AED");
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

// //         doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke("#CCCCCC");

// //         doc.fontSize(10).font("Helvetica-Bold").fillColor("#7C3AED");
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
// //             tripDetailsY
// //           );
// //         }

// //         doc.y += tripHeight + 10;
// //       });
// //     }

// //     // Remarks Section
// //     if (deliveryNote.remarks) {
// //       doc.moveDown(1);
// //       doc.fontSize(11).font("Helvetica-Bold").fillColor("#7C3AED");
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

// //     // Acknowledgement Box
// //     doc
// //       .rect(leftX, doc.y, pageWidth - 100, 30)
// //       .fillAndStroke("#EDE9FE", "#CCCCCC");
// //     doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
// //     doc.text(
// //       "We acknowledge that the attachment has been received in good condition.",
// //       leftX + 10,
// //       doc.y + 10,
// //       { width: pageWidth - 120, align: "center" }
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
// //       { align: "center", width: pageWidth }
// //     );

// //     doc.end();
// //   } catch (error) {
// //     console.error("Error generating attachment delivery note PDF:", error);
// //     res.status(500).json({
// //       message: "Error generating attachment delivery note PDF",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Generate attachment off hire note PDF
// // const generateAttachmentOffHireNotePDF = async (req, res) => {
// //   try {
// //     const { attachment_ohn_id } = req.params;

// //     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
// //       attachment_ohn_id,
// //       {
// //         include: [
// //           {
// //             model: AttachmentOffHireNoteTripModel,
// //             as: "trips",
// //             order: [["trip_number", "ASC"]],
// //           },
// //           {
// //             model: AttachmentSwapModel,
// //             as: "attachmentSwap",
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
// //                 model: AttachmentModel,
// //                 as: "previousAttachment",
// //                 attributes: [
// //                   "attachment_id",
// //                   "attachment_number",
// //                   "product_name",
// //                   "serial_number",
// //                 ],
// //               },
// //             ],
// //           },
// //         ],
// //       }
// //     );

// //     if (!offHireNote) {
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Update status to In Progress when PDF is generated
// //     await offHireNote.update({ status: "In Progress" });

// //     // Also update trips status
// //     await AttachmentOffHireNoteTripModel.update(
// //       { trip_status: "In Progress" },
// //       {
// //         where: { attachment_ohn_id, trip_status: "Creation" },
// //       }
// //     );

// //     // Generate PDF
// //     const doc = new PDFDocument({ margin: 40, size: "A4" });

// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `attachment; filename="AT-OH-${offHireNote.ohn_number}.pdf"`
// //     );

// //     doc.pipe(res);

// //     // Add border to page
// //     const pageWidth = doc.page.width;
// //     const pageHeight = doc.page.height;
// //     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

// //     // Company Header with Indigo Background
// //     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#4F46E5", "#4F46E5");

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
// //         { align: "center" }
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
// //       .fillColor("#4F46E5")
// //       .text("ATTACHMENT OFF HIRE NOTE", { align: "center" })
// //       .fillColor("#000000");

// //     doc.moveDown(1);
// //     doc
// //       .moveTo(100, doc.y)
// //       .lineTo(pageWidth - 100, doc.y)
// //       .stroke("#4F46E5");
// //     doc.moveDown(1);

// //     // Two Column Layout for Details
// //     const leftX = 50;
// //     const rightX = 320;
// //     const startY = doc.y;

// //     // Left Column - Client Information
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
// //     doc.text("CLIENT INFORMATION", leftX, startY);
// //     doc.fillColor("#000000");

// //     doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
// //     doc.fontSize(10).font("Helvetica");
// //     doc.text(
// //       offHireNote.attachmentSwap.salesOrder.client,
// //       leftX + 10,
// //       startY + 30,
// //       { width: 220 }
// //     );

// //     // Right Column - Document Details
// //     doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
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
// //       detailsY + 30
// //     );
// //     doc.text(
// //       offHireNote.attachmentSwap.salesOrder.so_number,
// //       rightX + 130,
// //       detailsY + 50
// //     );
// //     doc.text(
// //       offHireNote.attachmentSwap.salesOrder.project_name || "N/A",
// //       rightX + 130,
// //       detailsY + 70,
// //       { width: 100 }
// //     );

// //     doc.y = startY + 120;
// //     doc.moveDown(1);

// //     // Attachment Details Section
// //     doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //     doc
// //       .rect(leftX, doc.y, pageWidth - 100, 20)
// //       .fillAndStroke("#4F46E5", "#4F46E5");
// //     doc.text("ATTACHMENT DETAILS", leftX + 10, doc.y + 5);

// //     doc.fillColor("#000000");
// //     doc.moveDown(1.5);

// //     const attachY = doc.y;
// //     const attachHeight = offHireNote.attachmentSwap.previousAttachment
// //       .serial_number
// //       ? 70
// //       : 50;
// //     doc.rect(leftX, attachY, pageWidth - 100, attachHeight).stroke("#CCCCCC");

// //     doc.fontSize(9).font("Helvetica-Bold");
// //     doc.text("Attachment Number:", leftX + 10, attachY + 10);
// //     doc.text("Product Name:", leftX + 10, attachY + 30);

// //     doc.font("Helvetica");
// //     doc.text(
// //       offHireNote.attachmentSwap.previousAttachment.attachment_number,
// //       leftX + 130,
// //       attachY + 10
// //     );
// //     doc.text(
// //       offHireNote.attachmentSwap.previousAttachment.product_name,
// //       leftX + 130,
// //       attachY + 30,
// //       { width: 350 }
// //     );

// //     if (offHireNote.attachmentSwap.previousAttachment.serial_number) {
// //       doc.font("Helvetica-Bold");
// //       doc.text("Serial Number:", leftX + 10, attachY + 50);
// //       doc.font("Helvetica");
// //       doc.text(
// //         offHireNote.attachmentSwap.previousAttachment.serial_number,
// //         leftX + 130,
// //         attachY + 50
// //       );
// //     }

// //     doc.y = attachY + attachHeight + 10;
// //     doc.moveDown(1);

// //     // Transportation Details
// //     if (offHireNote.trips && offHireNote.trips.length > 0) {
// //       doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
// //       doc
// //         .rect(leftX, doc.y, pageWidth - 100, 20)
// //         .fillAndStroke("#4F46E5", "#4F46E5");
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

// //         doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke("#CCCCCC");

// //         doc.fontSize(10).font("Helvetica-Bold").fillColor("#4F46E5");
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
// //             tripDetailsY
// //           );
// //         }

// //         doc.y += tripHeight + 10;
// //       });
// //     }

// //     // Remarks Section
// //     if (offHireNote.remarks) {
// //       doc.moveDown(1);
// //       doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
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
// //     doc
// //       .rect(leftX, doc.y, pageWidth - 100, 30)
// //       .fillAndStroke("#E0E7FF", "#CCCCCC");
// //     doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
// //     doc.text(
// //       "We acknowledge that the attachment has been returned in good condition.",
// //       leftX + 10,
// //       doc.y + 10,
// //       { width: pageWidth - 120, align: "center" }
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
// //       { align: "center", width: pageWidth }
// //     );

// //     doc.end();
// //   } catch (error) {
// //     console.error("Error generating attachment off hire note PDF:", error);
// //     res.status(500).json({
// //       message: "Error generating attachment off hire note PDF",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Upload attachment delivery note attachment
// // const uploadAttachmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_dn_id } = req.params;

// //     if (!req.file) {
// //       await transaction.rollback();
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const file = req.file;
// //     const fileName = file.filename;

// //     // Update delivery note with file path
// //     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
// //       attachment_dn_id,
// //       { transaction }
// //     );
// //     if (!deliveryNote) {
// //       fs.unlinkSync(file.path);
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Update status to Delivered
// //     await deliveryNote.update(
// //       {
// //         delivery_attachment: fileName,
// //         status: "Delivered",
// //       },
// //       { transaction }
// //     );

// //     // Update all trips status to Delivered
// //     await AttachmentDeliveryNoteTripModel.update(
// //       { trip_status: "Delivered" },
// //       {
// //         where: { attachment_dn_id },
// //         transaction,
// //       }
// //     );

// //     // Update attachment swap status
// //     const attachmentSwap = await AttachmentSwapModel.findByPk(
// //       deliveryNote.attachment_swap_id,
// //       { transaction }
// //     );
// //     if (attachmentSwap) {
// //       await attachmentSwap.update(
// //         {
// //           delivery_note_status: "Completed",
// //           overall_status:
// //             attachmentSwap.off_hire_note_status === "Completed"
// //               ? "Completed"
// //               : "In Progress",
// //         },
// //         { transaction }
// //       );
// //     }

// //     await transaction.commit();

// //     res.status(200).json({
// //       success: true,
// //       message: "Delivery note uploaded successfully",
// //       fileName,
// //       status: "Delivered",
// //     });
// //   } catch (error) {
// //     await transaction.rollback();

// //     // Clean up uploaded file if there's an error
// //     if (req.file && fs.existsSync(req.file.path)) {
// //       fs.unlinkSync(req.file.path);
// //     }

// //     console.error("Error uploading delivery note:", error);
// //     res.status(500).json({
// //       message: "Error uploading delivery note",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Upload attachment off hire note attachment
// // const uploadAttachmentOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_ohn_id } = req.params;

// //     if (!req.file) {
// //       await transaction.rollback();
// //       return res.status(400).json({ message: "No file uploaded" });
// //     }

// //     const file = req.file;
// //     const fileName = file.filename;

// //     // Update off hire note with file path
// //     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
// //       attachment_ohn_id,
// //       { transaction }
// //     );
// //     if (!offHireNote) {
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
// //       { transaction }
// //     );

// //     // Update all trips status to Completed
// //     await AttachmentOffHireNoteTripModel.update(
// //       { trip_status: "Completed" },
// //       {
// //         where: { attachment_ohn_id },
// //         transaction,
// //       }
// //     );

// //     // Update attachment swap status
// //     const attachmentSwap = await AttachmentSwapModel.findByPk(
// //       offHireNote.attachment_swap_id,
// //       { transaction }
// //     );
// //     if (attachmentSwap) {
// //       await attachmentSwap.update(
// //         {
// //           off_hire_note_status: "Completed",
// //           overall_status:
// //             attachmentSwap.delivery_note_status === "Completed"
// //               ? "Completed"
// //               : "In Progress",
// //         },
// //         { transaction }
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

// // // Add trip to attachment delivery note
// // const addTripToAttachmentDeliveryNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_dn_id } = req.params;
// //     const {
// //       transportation_company,
// //       driver_name,
// //       driver_contact,
// //       vehicle_type,
// //       vehicle_number,
// //       trip_date,
// //       remarks,
// //     } = req.body;

// //     // Get delivery note
// //     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
// //       attachment_dn_id,
// //       { transaction }
// //     );
// //     if (!deliveryNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Delivery note not found" });
// //     }

// //     // Get next trip number
// //     const existingTrips = await AttachmentDeliveryNoteTripModel.findAll({
// //       where: { attachment_dn_id },
// //       transaction,
// //     });

// //     const nextTripNumber = existingTrips.length + 1;

// //     // Create new trip
// //     const newTrip = await AttachmentDeliveryNoteTripModel.create(
// //       {
// //         attachment_dn_id,
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
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Trip added successfully to attachment delivery note",
// //       trip: newTrip,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error adding trip to attachment delivery note:", error);
// //     res.status(500).json({
// //       message: "Error adding trip to attachment delivery note",
// //       error: error.message,
// //     });
// //   }
// // };

// // // Add trip to attachment off hire note
// // const addTripToAttachmentOffHireNote = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_ohn_id } = req.params;
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
// //     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
// //       attachment_ohn_id,
// //       { transaction }
// //     );
// //     if (!offHireNote) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Off hire note not found" });
// //     }

// //     // Get next trip number
// //     const existingTrips = await AttachmentOffHireNoteTripModel.findAll({
// //       where: { attachment_ohn_id },
// //       transaction,
// //     });

// //     const nextTripNumber = existingTrips.length + 1;

// //     // Create new trip
// //     const newTrip = await AttachmentOffHireNoteTripModel.create(
// //       {
// //         attachment_ohn_id,
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
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(201).json({
// //       message: "Trip added successfully to attachment off hire note",
// //       trip: newTrip,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error adding trip to attachment off hire note:", error);
// //     res.status(500).json({
// //       message: "Error adding trip to attachment off hire note",
// //       error: error.message,
// //     });
// //   }
// // };

// // const submitAttachmentSwapRequest = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_swap_id } = req.params;
// //     const { mobilization_charge, demobilization_charge } = req.body;

// //     if (!mobilization_charge || !demobilization_charge) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Mobilization and demobilization charges are mandatory",
// //       });
// //     }

// //     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
// //       transaction,
// //     });

// //     if (!attachmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Attachment swap not found" });
// //     }

// //     await attachmentSwap.update(
// //       {
// //         swap_status: attachmentSwap.swap_status === "Return" ? "Resubmit" : "Swap Request",
// //         mobilization_charge: parseFloat(mobilization_charge),
// //         demobilization_charge: parseFloat(demobilization_charge),
// //         return_reason: null,
// //       },
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Attachment swap submitted successfully",
// //       attachmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error submitting attachment swap:", error);
// //     res.status(500).json({
// //       message: "Error submitting attachment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const returnAttachmentSwapRequest = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_swap_id } = req.params;
// //     const { return_reason } = req.body;

// //     if (!return_reason || !return_reason.trim()) {
// //       await transaction.rollback();
// //       return res.status(400).json({
// //         message: "Return reason is required",
// //       });
// //     }

// //     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
// //       transaction,
// //     });

// //     if (!attachmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Attachment swap not found" });
// //     }

// //     await attachmentSwap.update(
// //       {
// //         swap_status: "Return",
// //         return_reason: return_reason.trim(),
// //       },
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Attachment swap returned successfully",
// //       attachmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error returning attachment swap:", error);
// //     res.status(500).json({
// //       message: "Error returning attachment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const approveAttachmentSwap = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_swap_id } = req.params;

// //     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
// //       transaction,
// //     });

// //     if (!attachmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Attachment swap not found" });
// //     }

// //     await attachmentSwap.update(
// //       {
// //         swap_status: "Approved",
// //       },
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Attachment swap approved successfully",
// //       attachmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error approving attachment swap:", error);
// //     res.status(500).json({
// //       message: "Error approving attachment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // const rejectAttachmentSwap = async (req, res) => {
// //   const transaction = await sequelize.transaction();

// //   try {
// //     const { attachment_swap_id } = req.params;
// //     const { rejection_reason } = req.body;

// //     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
// //       transaction,
// //     });

// //     if (!attachmentSwap) {
// //       await transaction.rollback();
// //       return res.status(404).json({ message: "Attachment swap not found" });
// //     }

// //     await attachmentSwap.update(
// //       {
// //         swap_status: "Rejected",
// //         return_reason: rejection_reason || "Rejected by approver",
// //       },
// //       { transaction }
// //     );

// //     await transaction.commit();

// //     res.status(200).json({
// //       message: "Attachment swap rejected successfully",
// //       attachmentSwap,
// //     });
// //   } catch (error) {
// //     await transaction.rollback();
// //     console.error("Error rejecting attachment swap:", error);
// //     res.status(500).json({
// //       message: "Error rejecting attachment swap",
// //       error: error.message,
// //     });
// //   }
// // };

// // module.exports = {
// //   getAllAttachmentNumbers,
// //   getAttachmentSwapReasons,
// //   createAttachmentSwap,
// //   getAttachmentSwapsBySalesOrder,
// //   getAttachmentSwapById,
// //   createAttachmentDeliveryNote,
// //   createAttachmentOffHireNote,
// //   getAttachmentDeliveryNoteSummary,
// //   getAttachmentOffHireNoteSummary,
// //   generateAttachmentDeliveryNotePDF,
// //   generateAttachmentOffHireNotePDF,
// //   uploadAttachmentDeliveryNote,
// //   uploadAttachmentOffHireNote,
// //   addTripToAttachmentDeliveryNote,
// //   addTripToAttachmentOffHireNote,
// //   submitAttachmentSwapRequest,
// //   returnAttachmentSwapRequest,
// //   approveAttachmentSwap,
// //   rejectAttachmentSwap,
// //   getPendingAttachmentSwapRequests,
// //   getSwapRequestCounts,
// // };

// // controllers/fleet-management/AttachmentSwapController.js
// const AttachmentSwapModel = require("../../models/fleet-management/AttachmentSwapModel");
// const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
// const SalesOrdersModel = require("../../models/fleet-management/SalesOrdersModel");
// const {
//   AttachmentDeliveryNoteModel,
//   AttachmentDeliveryNoteTripModel,
//   AttachmentDNAttachmentModel,
// } = require("../../models/fleet-management/AttachmentDeliveryNoteModel");
// const {
//   AttachmentOffHireNoteModel,
//   AttachmentOffHireNoteTripModel,
//   AttachmentOHNAttachmentModel,
// } = require("../../models/fleet-management/AttachmentOffHireNoteModel");
// const sequelize = require("../../config/dbSync");
// const { Op } = require("sequelize");
// const UsersModel = require("../../models/user-security-management/UsersModel");
// const SwapReasonModel = require("../../models/fleet-management/swapReasonModel");
// const path = require("path");
// const fs = require("fs");
// const PDFDocument = require("pdfkit");

// // Helper functions
// const generateAttachmentDNNumber = async () => {
//   const currentYear = new Date().getFullYear();
//   const prefix = `AT-DN-${currentYear}-`;

//   const lastDN = await AttachmentDeliveryNoteModel.findOne({
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

// const generateAttachmentOHNNumber = async () => {
//   const currentYear = new Date().getFullYear();
//   const prefix = `AT-OH-${currentYear}-`;

//   const lastOHN = await AttachmentOffHireNoteModel.findOne({
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

// // Get all attachment numbers for dropdown
// const getAllAttachmentNumbers = async (req, res) => {
//   try {
//     const attachment = await AttachmentModel.findAll({
//       where: { status: "Active" },
//       attributes: ["attachment_id", "attachment_number", "product_name"],
//       order: [["attachment_number", "ASC"]],
//     });

//     res.status(200).json({
//       success: true,
//       attachment: attachment.map((attach) => ({
//         attachment_id: attach.attachment_id,
//         attachment_number: attach.attachment_number,
//         product_name: attach.product_name,
//       })),
//     });
//   } catch (error) {
//     console.error("Error fetching attachments:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// const getAttachmentSwapReasons = async (req, res) => {
//   try {
//     const swapReasons = await SwapReasonModel.findAll({
//       where: {
//         category: "Attachment",
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
//     console.error("Error fetching attachment swap reasons:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ─── Helper: generate a human-readable group ID ────────────────────────────
// // Format: AT-YYYYMMDD-XXXX  (e.g. AT-20260224-B7D2)
// const generateSwapGroupId = (prefix = "AT") => {
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

// const createAttachmentSwap = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const {
//       sales_order_id,
//       allocation_id,
//       previous_attachment_no,
//       new_attachment_no,
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
//       !previous_attachment_no ||
//       !new_attachment_no ||
//       !swap_date ||
//       !swap_reason
//     ) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "All required fields must be filled",
//       });
//     }

//     // Check if new attachment number exists
//     const existingAttachment = await AttachmentModel.findOne({
//       where: { attachment_number: new_attachment_no, status: "Active" },
//     });

//     if (!existingAttachment) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "New attachment number does not exist in attachment table",
//       });
//     }

//     // Get sales order
//     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
//     if (!salesOrder) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Sales order not found" });
//     }

//     // Get previous attachment details
//     const previousAttachment = await AttachmentModel.findOne({
//       where: { attachment_number: previous_attachment_no },
//     });

//     if (!previousAttachment) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Previous attachment not found" });
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
//     const swapGroupId = generateSwapGroupId("AT");

//     // CREATE RECORD 1: OFF_HIRE — for the outgoing/previous attachment
//     const offHireRecord = await AttachmentSwapModel.create(
//       {
//         swap_group_id: swapGroupId,
//         sales_order_id,
//         allocation_id: allocation_id || null,
//         previous_attachment_id: previousAttachment.attachment_id,
//         previous_attachment_no: previous_attachment_no,
//         new_attachment_id: existingAttachment.attachment_id,
//         new_attachment_no: null,
//         swap_date,
//         swap_reason,
//         swap_type: "OFF_HIRE",
//         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
//         swap_mobilization_trips: swap_mobilization_trips || null,
//         swap_demobilization_trips: swap_demobilization_trips || null,
//         swap_remark: swap_remark || null,
//         delivery_note_status: "Pending",
//         off_hire_note_status: "Pending",
//         overall_status: "Creation",
//         created_by: username,
//       },
//       { transaction }
//     );

//     // CREATE RECORD 2: DELIVERY — for the incoming/new attachment
//     const deliveryRecord = await AttachmentSwapModel.create(
//       {
//         swap_group_id: swapGroupId,
//         sales_order_id,
//         allocation_id: allocation_id || null,
//         previous_attachment_id: previousAttachment.attachment_id,
//         previous_attachment_no: null,
//         new_attachment_id: existingAttachment.attachment_id,
//         new_attachment_no: new_attachment_no,
//         swap_date,
//         swap_reason,
//         swap_type: "DELIVERY",
//         swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
//         swap_mobilization_trips: swap_mobilization_trips || null,
//         swap_demobilization_trips: swap_demobilization_trips || null,
//         swap_remark: swap_remark || null,
//         delivery_note_status: "Pending",
//         off_hire_note_status: "Pending",
//         overall_status: "Creation",
//         created_by: username,
//       },
//       { transaction }
//     );

//     // Update allocation attachment if allocation_id exists
//     if (allocation_id) {
//       const ActiveAllocationAttachmentModel =
//         require("../../models/fleet-management/ActiveAllocationsOriginalModel").AllocationAttachmentModel;

//       await ActiveAllocationAttachmentModel.update(
//         {
//           attachment_id: existingAttachment.attachment_id,
//           updated_at: new Date(),
//         },
//         {
//           where: {
//             allocation_id: allocation_id,
//             attachment_id: previousAttachment.attachment_id,
//           },
//           transaction,
//         }
//       );
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Attachment is Changed",
//       attachmentSwaps: [offHireRecord, deliveryRecord],
//       swap_group_id: swapGroupId,
//       summary: {
//         swap_group_id: swapGroupId,
//         off_hire_attachment: previous_attachment_no,
//         delivery_attachment: new_attachment_no,
//         swap_date,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating attachment swap:", error);
//     res.status(500).json({
//       message: "Error creating attachment swap",
//       error: error.message,
//     });
//   }
// };

// // Get all attachment swaps for sales order
// const getAttachmentSwapsBySalesOrder = async (req, res) => {
//   try {
//     const { sales_order_id } = req.params;

//     const attachmentSwaps = await AttachmentSwapModel.findAll({
//       where: { sales_order_id },
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//         {
//           model: AttachmentModel,
//           as: "previousAttachment",
//           attributes: [
//             "attachment_id",
//             "attachment_number",
//             "product_name",
//             "serial_number",
//           ],
//         },
//         {
//           model: AttachmentModel,
//           as: "newAttachment",
//           attributes: [
//             "attachment_id",
//             "attachment_number",
//             "product_name",
//             "serial_number",
//           ],
//         },
//         {
//           model: AttachmentDeliveryNoteModel,
//           as: "deliveryNotes",
//           include: [
//             {
//               model: AttachmentDeliveryNoteTripModel,
//               as: "trips",
//             },
//           ],
//           order: [["created_at", "DESC"]],
//         },
//         {
//           model: AttachmentOffHireNoteModel,
//           as: "offHireNotes",
//           include: [
//             {
//               model: AttachmentOffHireNoteTripModel,
//               as: "trips",
//             },
//           ],
//           order: [["created_at", "DESC"]],
//         },
//       ],
//       order: [["created_at", "DESC"]],
//     });

//     res.status(200).json({
//       totalCount: attachmentSwaps.length,
//       attachmentSwaps,
//     });
//   } catch (error) {
//     console.error("Error fetching attachment swaps:", error);
//     res.status(500).json({
//       message: "Error fetching attachment swaps",
//       error: error.message,
//     });
//   }
// };

// // Get attachment swap by ID with details
// const getAttachmentSwapById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const attachmentSwap = await AttachmentSwapModel.findByPk(id, {
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//         {
//           model: AttachmentModel,
//           as: "previousAttachment",
//           attributes: [
//             "attachment_id",
//             "attachment_number",
//             "product_name",
//             "serial_number",
//           ],
//         },
//         {
//           model: AttachmentModel,
//           as: "newAttachment",
//           attributes: [
//             "attachment_id",
//             "attachment_number",
//             "product_name",
//             "serial_number",
//           ],
//         },
//         {
//           model: AttachmentDeliveryNoteModel,
//           as: "deliveryNotes",
//           include: [
//             {
//               model: AttachmentDeliveryNoteTripModel,
//               as: "trips",
//               include: [
//                 {
//                   model: AttachmentDNAttachmentModel,
//                   as: "attachment",
//                 },
//               ],
//             },
//           ],
//           order: [["created_at", "DESC"]],
//         },
//         {
//           model: AttachmentOffHireNoteModel,
//           as: "offHireNotes",
//           include: [
//             {
//               model: AttachmentOffHireNoteTripModel,
//               as: "trips",
//               include: [
//                 {
//                   model: AttachmentOHNAttachmentModel,
//                   as: "attachment",
//                 },
//               ],
//             },
//           ],
//           order: [["created_at", "DESC"]],
//         },
//       ],
//     });

//     if (!attachmentSwap) {
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     res.status(200).json({
//       attachmentSwap,
//     });
//   } catch (error) {
//     console.error("Error fetching attachment swap:", error);
//     res.status(500).json({
//       message: "Error fetching attachment swap",
//       error: error.message,
//     });
//   }
// };

// const getPendingAttachmentSwapRequests = async (req, res) => {
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

//     const attachmentSwaps = await AttachmentSwapModel.findAll({
//       where,
//       include: [
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["id", "so_number", "client", "project_name"],
//         },
//         {
//           model: AttachmentModel,
//           as: "previousAttachment",
//           attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"],
//         },
//         {
//           model: AttachmentModel,
//           as: "newAttachment",
//           attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"],
//         },
//       ],
//       order: [["created_at", "DESC"]],
//     });

//     // Count pending requests
//     const pendingCount = attachmentSwaps.filter(
//       (swap) => swap.swap_status === "Swap Request"
//     ).length;

//     const resubmitCount = attachmentSwaps.filter(
//       (swap) => swap.swap_status === "Resubmit"
//     ).length;

//     res.status(200).json({
//       success: true,
//       totalCount: attachmentSwaps.length,
//       pendingCount,
//       resubmitCount,
//       attachmentSwaps,
//     });
//   } catch (error) {
//     console.error("Error fetching pending attachment swap requests:", error);
//     res.status(500).json({
//       message: "Error fetching pending attachment swap requests",
//       error: error.message,
//     });
//   }
// };

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

//     const equipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
//     const equipmentCount = await equipmentSwapModel.count({ where });
//     const attachmentCount = await AttachmentSwapModel.count({ where });

//     res.status(200).json({
//       success: true,
//       equipmentSwapCount: equipmentCount,
//       attachmentSwapCount: attachmentCount,
//       totalSwapCount: equipmentCount + attachmentCount,
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

// /**
//  * Create attachment delivery note with trips and resources
//  */
// const createAttachmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_swap_id } = req.params;
//     const { delivery_date, remarks, trips } = req.body;

//     // Get attachment swap
//     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
//       include: [
//         {
//           model: AttachmentModel,
//           as: "newAttachment",
//           attributes: ["attachment_id", "attachment_number", "product_name"],
//         },
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//       ],
//     });

//     if (!attachmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     // Generate DN number
//     const dn_number = await generateAttachmentDNNumber();

//     // Get logged in user
//     let username = await getUsername(req);

//     // Create delivery note
//     const deliveryNote = await AttachmentDeliveryNoteModel.create(
//       {
//         attachment_swap_id,
//         dn_number,
//         new_attachment_id: attachmentSwap.new_attachment_id,
//         new_attachment_no: attachmentSwap.new_attachment_no,
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
//         const newTrip = await AttachmentDeliveryNoteTripModel.create(
//           {
//             attachment_dn_id: deliveryNote.attachment_dn_id,
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

//         // Add attachment resources to this trip
//         if (trip.attachment && trip.attachment.length > 0) {
//           for (const attach of trip.attachment) {
//             await AttachmentDNAttachmentModel.create(
//               {
//                 attachment_dn_id: deliveryNote.attachment_dn_id,
//                 trip_id: newTrip.trip_id,
//                 attachment_id: attach.attachment_id,
//                 attachment_number: attach.attachment_number,
//                 attachment_type: attach.attachment_type || null,
//               },
//               { transaction }
//             );
//           }
//         }
//       }
//     }

//     // Update swap status based on group logic
//     await updateSwapStatusAfterNoteCreation(
//       attachmentSwap,
//       "DELIVERY",
//       deliveryNote.attachment_dn_id,
//       transaction
//     );

//     await transaction.commit();

//     // Fetch created delivery note with trips
//     const createdDeliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       deliveryNote.attachment_dn_id,
//       {
//         include: [
//           {
//             model: AttachmentDeliveryNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: AttachmentDNAttachmentModel,
//                 as: "attachment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
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
//       message: "Attachment delivery note created successfully",
//       deliveryNote: createdDeliveryNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating attachment delivery note:", error);
//     res.status(500).json({
//       message: "Error creating attachment delivery note",
//       error: error.message,
//     });
//   }
// };

// // ==================== OFF-HIRE NOTE FUNCTIONS (Enhanced) ====================

// /**
//  * Create attachment off hire note with trips and resources
//  */
// const createAttachmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_swap_id } = req.params;
//     const { off_hire_date, remarks, trips } = req.body;

//     // Get attachment swap
//     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
//       include: [
//         {
//           model: AttachmentModel,
//           as: "previousAttachment",
//           attributes: ["attachment_id", "attachment_number", "product_name"],
//         },
//         {
//           model: SalesOrdersModel,
//           as: "salesOrder",
//           attributes: ["so_number", "client", "project_name"],
//         },
//       ],
//     });

//     if (!attachmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     // Generate OHN number
//     const ohn_number = await generateAttachmentOHNNumber();

//     // Get logged in user
//     let username = await getUsername(req);

//     // Create off hire note
//     const offHireNote = await AttachmentOffHireNoteModel.create(
//       {
//         attachment_swap_id,
//         ohn_number,
//         previous_attachment_id: attachmentSwap.previous_attachment_id,
//         previous_attachment_no: attachmentSwap.previous_attachment_no,
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
//         const newTrip = await AttachmentOffHireNoteTripModel.create(
//           {
//             attachment_ohn_id: offHireNote.attachment_ohn_id,
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

//         // Add attachment resources to this trip
//         if (trip.attachment && trip.attachment.length > 0) {
//           for (const attach of trip.attachment) {
//             await AttachmentOHNAttachmentModel.create(
//               {
//                 attachment_ohn_id: offHireNote.attachment_ohn_id,
//                 trip_id: newTrip.trip_id,
//                 attachment_id: attach.attachment_id,
//                 attachment_number: attach.attachment_number,
//                 attachment_type: attach.attachment_type || null,
//               },
//               { transaction }
//             );
//           }
//         }
//       }
//     }

//     // Update swap status based on group logic
//     await updateSwapStatusAfterNoteCreation(
//       attachmentSwap,
//       "OFF_HIRE",
//       offHireNote.attachment_ohn_id,
//       transaction
//     );

//     await transaction.commit();

//     // Fetch created off hire note with trips
//     const createdOffHireNote = await AttachmentOffHireNoteModel.findByPk(
//       offHireNote.attachment_ohn_id,
//       {
//         include: [
//           {
//             model: AttachmentOffHireNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: AttachmentOHNAttachmentModel,
//                 as: "attachment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
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
//       message: "Attachment off hire note created successfully",
//       offHireNote: createdOffHireNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error creating attachment off hire note:", error);
//     res.status(500).json({
//       message: "Error creating attachment off hire note",
//       error: error.message,
//     });
//   }
// };

// /**
//  * Helper function to update swap status after note creation
//  */
// const updateSwapStatusAfterNoteCreation = async (attachmentSwap, noteType, noteId, transaction) => {
//   try {
//     if (!attachmentSwap.swap_group_id) {
//       // No group ID - simple update
//       const updateData = {};
//       if (noteType === "DELIVERY") {
//         updateData.delivery_note_status = "In Progress";
//       } else {
//         updateData.off_hire_note_status = "In Progress";
//       }
//       updateData.overall_status = "In progress";

//       await AttachmentSwapModel.update(updateData, {
//         where: { attachment_swap_id: attachmentSwap.attachment_swap_id },
//         transaction,
//       });
//       return;
//     }

//     // Get all swaps in the same group
//     const groupSwaps = await AttachmentSwapModel.findAll({
//       where: {
//         swap_group_id: attachmentSwap.swap_group_id,
//       },
//       transaction,
//     });

//     const currentSwap = groupSwaps.find(
//       (s) => s.attachment_swap_id === attachmentSwap.attachment_swap_id
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

//       await AttachmentSwapModel.update(updateData, {
//         where: { attachment_swap_id: currentSwap.attachment_swap_id },
//         transaction,
//       });
//       return;
//     }

//     // Check if partner already has a note
//     let partnerHasNote = false;
//     if (partnerSwap.swap_type === "DELIVERY") {
//       const partnerNote = await AttachmentDeliveryNoteModel.findOne({
//         where: { attachment_swap_id: partnerSwap.attachment_swap_id },
//         transaction,
//       });
//       partnerHasNote = !!partnerNote;
//     } else {
//       const partnerNote = await AttachmentOffHireNoteModel.findOne({
//         where: { attachment_swap_id: partnerSwap.attachment_swap_id },
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
//       await AttachmentSwapModel.update(partnerUpdate, {
//         where: { attachment_swap_id: partnerSwap.attachment_swap_id },
//         transaction,
//       });
//     } else {
//       // Only this note exists - mark as Partially completed
//       currentUpdate.overall_status = "Partially completed";
//     }

//     await AttachmentSwapModel.update(currentUpdate, {
//       where: { attachment_swap_id: currentSwap.attachment_swap_id },
//       transaction,
//     });

//   } catch (error) {
//     console.error("Error updating swap status:", error);
//     throw error;
//   }
// };

// // ==================== GET FUNCTIONS ====================

// /**
//  * Get attachment delivery note by ID with trips and resources
//  */
// const getAttachmentDeliveryNoteById = async (req, res) => {
//   try {
//     const { attachment_dn_id } = req.params;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
//       {
//         include: [
//           {
//             model: AttachmentDeliveryNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: AttachmentDNAttachmentModel,
//                 as: "attachment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
//             include: [
//               { model: SalesOrdersModel, as: "salesOrder" },
//               {
//                 model: AttachmentModel,
//                 as: "newAttachment",
//                 attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"],
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
//     console.error("Error fetching attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get attachment off hire note by ID with trips and resources
//  */
// const getAttachmentOffHireNoteById = async (req, res) => {
//   try {
//     const { attachment_ohn_id } = req.params;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
//       {
//         include: [
//           {
//             model: AttachmentOffHireNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: AttachmentOHNAttachmentModel,
//                 as: "attachment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
//             include: [
//               { model: SalesOrdersModel, as: "salesOrder" },
//               {
//                 model: AttachmentModel,
//                 as: "previousAttachment",
//                 attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"],
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
//     console.error("Error fetching attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get latest attachment delivery note for a swap
//  */
// const getLatestAttachmentDeliveryNote = async (req, res) => {
//   try {
//     const { attachment_swap_id } = req.params;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findOne({
//       where: { attachment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: AttachmentDeliveryNoteTripModel,
//           as: "trips",
//           include: [
//             {
//               model: AttachmentDNAttachmentModel,
//               as: "attachment",
//             },
//           ],
//           order: [["trip_number", "ASC"]],
//         },
//         {
//           model: AttachmentSwapModel,
//           as: "attachmentSwap",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: AttachmentModel,
//               as: "newAttachment",
//               attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"],
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
//     console.error("Error fetching latest attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get latest attachment off hire note for a swap
//  */
// const getLatestAttachmentOffHireNote = async (req, res) => {
//   try {
//     const { attachment_swap_id } = req.params;

//     const offHireNote = await AttachmentOffHireNoteModel.findOne({
//       where: { attachment_swap_id },
//       order: [["created_at", "DESC"]],
//       include: [
//         {
//           model: AttachmentOffHireNoteTripModel,
//           as: "trips",
//           include: [
//             {
//               model: AttachmentOHNAttachmentModel,
//               as: "attachment",
//             },
//           ],
//           order: [["trip_number", "ASC"]],
//         },
//         {
//           model: AttachmentSwapModel,
//           as: "attachmentSwap",
//           include: [
//             { model: SalesOrdersModel, as: "salesOrder" },
//             {
//               model: AttachmentModel,
//               as: "previousAttachment",
//               attributes: ["attachment_id", "attachment_number", "product_name", "serial_number"],
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
//     console.error("Error fetching latest attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Get attachment delivery note summary
//  */
// const getAttachmentDeliveryNoteSummary = async (req, res) => {
//   try {
//     const { attachment_dn_id } = req.params;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
//       {
//         include: [
//           {
//             model: AttachmentDeliveryNoteTripModel,
//             as: "trips",
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//                 attributes: ["so_number", "client", "project_name"],
//               },
//               {
//                 model: AttachmentModel,
//                 as: "newAttachment",
//                 attributes: [
//                   "attachment_id",
//                   "attachment_number",
//                   "product_name",
//                   "serial_number",
//                 ],
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
//       attachment: deliveryNote.attachmentSwap.newAttachment,
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
//  * Get attachment off hire note summary
//  */
// const getAttachmentOffHireNoteSummary = async (req, res) => {
//   try {
//     const { attachment_ohn_id } = req.params;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
//       {
//         include: [
//           {
//             model: AttachmentOffHireNoteTripModel,
//             as: "trips",
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
//             include: [
//               {
//                 model: SalesOrdersModel,
//                 as: "salesOrder",
//                 attributes: ["so_number", "client", "project_name"],
//               },
//               {
//                 model: AttachmentModel,
//                 as: "previousAttachment",
//                 attributes: [
//                   "attachment_id",
//                   "attachment_number",
//                   "product_name",
//                   "serial_number",
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

//     // Format summary data
//     const summaryData = {
//       ohn_number: offHireNote.ohn_number,
//       attachment: offHireNote.attachmentSwap.previousAttachment,
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
//  * Submit attachment delivery note for approval
//  */
// const submitAttachmentDNForApproval = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
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
//       deliveryNote: await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting attachment DN for approval:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Submit attachment off hire note for approval
//  */
// const submitAttachmentOHNForApproval = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
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
//       offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting attachment OHN for approval:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Approve attachment delivery note
//  */
// const approveAttachmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;
//     const username = await getUsername(req);

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
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
//       deliveryNote: await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Approve attachment off hire note
//  */
// const approveAttachmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;
//     const username = await getUsername(req);

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
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
//       offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Reject attachment delivery note
//  */
// const rejectAttachmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;
//     const { reason } = req.body;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
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
//       deliveryNote: await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Reject attachment off hire note
//  */
// const rejectAttachmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;
//     const { reason } = req.body;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
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
//       offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Generate attachment delivery note PDF data (for frontend)
//  */
// const generateAttachmentDNPDF = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
//       {
//         include: [
//           {
//             model: AttachmentDeliveryNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: AttachmentDNAttachmentModel,
//                 as: "attachment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
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
//                 model: AttachmentModel,
//                 as: "newAttachment",
//                 attributes: [
//                   "attachment_id",
//                   "attachment_number",
//                   "product_name",
//                   "serial_number",
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
//     console.error("Error generating attachment DN PDF:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Generate attachment off hire note PDF data (for frontend)
//  */
// const generateAttachmentOHNPDF = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
//       {
//         include: [
//           {
//             model: AttachmentOffHireNoteTripModel,
//             as: "trips",
//             include: [
//               {
//                 model: AttachmentOHNAttachmentModel,
//                 as: "attachment",
//               },
//             ],
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
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
//                 model: AttachmentModel,
//                 as: "previousAttachment",
//                 attributes: [
//                   "attachment_id",
//                   "attachment_number",
//                   "product_name",
//                   "serial_number",
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
//     console.error("Error generating attachment OHN PDF:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Close attachment delivery note
//  */
// const closeAttachmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
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
//       deliveryNote: await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error closing attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Close attachment off hire note
//  */
// const closeAttachmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
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
//       offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error closing attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== TRIP MANAGEMENT FUNCTIONS ====================

// /**
//  * Add trip to attachment delivery note
//  */
// const addTripToAttachmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       attachment,
//       remarks,
//     } = req.body;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
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

//     const existingTrips = await AttachmentDeliveryNoteTripModel.findAll({
//       where: { attachment_dn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per delivery note" });
//     }

//     const newTrip = await AttachmentDeliveryNoteTripModel.create(
//       {
//         attachment_dn_id,
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

//     // Add attachment resources
//     if (attachment && attachment.length > 0) {
//       for (const attach of attachment) {
//         await AttachmentDNAttachmentModel.create(
//           {
//             attachment_dn_id,
//             trip_id: newTrip.trip_id,
//             attachment_id: attach.attachment_id,
//             attachment_number: attach.attachment_number,
//             attachment_type: attach.attachment_type || null,
//           },
//           { transaction }
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await AttachmentDeliveryNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Add trip to attachment off hire note
//  */
// const addTripToAttachmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       attachment,
//       remarks,
//     } = req.body;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
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

//     const existingTrips = await AttachmentOffHireNoteTripModel.findAll({
//       where: { attachment_ohn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per off hire note" });
//     }

//     const newTrip = await AttachmentOffHireNoteTripModel.create(
//       {
//         attachment_ohn_id,
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

//     // Add attachment resources
//     if (attachment && attachment.length > 0) {
//       for (const attach of attachment) {
//         await AttachmentOHNAttachmentModel.create(
//           {
//             attachment_ohn_id,
//             trip_id: newTrip.trip_id,
//             attachment_id: attach.attachment_id,
//             attachment_number: attach.attachment_number,
//             attachment_type: attach.attachment_type || null,
//           },
//           { transaction }
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await AttachmentOffHireNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Update trip in attachment delivery note
//  */
// const updateTripInAttachmentDN = async (req, res) => {
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
//       attachment,
//       remarks,
//     } = req.body;

//     const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
//       include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
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

//     // Replace attachment resources
//     if (attachment !== undefined) {
//       await AttachmentDNAttachmentModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (attachment.length > 0) {
//         for (const attach of attachment) {
//           await AttachmentDNAttachmentModel.create(
//             {
//               attachment_dn_id: trip.attachment_dn_id,
//               trip_id,
//               attachment_id: attach.attachment_id,
//               attachment_number: attach.attachment_number,
//               attachment_type: attach.attachment_type || null,
//             },
//             { transaction }
//           );
//         }
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip: await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
//         include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip in attachment DN:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Update trip in attachment off hire note
//  */
// const updateTripInAttachmentOHN = async (req, res) => {
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
//       attachment,
//       remarks,
//     } = req.body;

//     const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
//       include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
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

//     // Replace attachment resources
//     if (attachment !== undefined) {
//       await AttachmentOHNAttachmentModel.destroy({
//         where: { trip_id },
//         transaction,
//       });

//       if (attachment.length > 0) {
//         for (const attach of attachment) {
//           await AttachmentOHNAttachmentModel.create(
//             {
//               attachment_ohn_id: trip.attachment_ohn_id,
//               trip_id,
//               attachment_id: attach.attachment_id,
//               attachment_number: attach.attachment_number,
//               attachment_type: attach.attachment_type || null,
//             },
//             { transaction }
//           );
//         }
//       }
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Trip updated successfully",
//       trip: await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
//         include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error updating trip in attachment OHN:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Delete trip from attachment delivery note
//  */
// const deleteTripFromAttachmentDN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;

//     const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
//       include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
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
//  * Delete trip from attachment off hire note
//  */
// const deleteTripFromAttachmentOHN = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id } = req.params;

//     const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
//       include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
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
//  * Upload attachment delivery note attachment
//  */
// const uploadAttachmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;
//     const user = req.user;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileName = req.file.filename;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
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

//     // Update attachment swap status
//     const attachmentSwap = await AttachmentSwapModel.findByPk(
//       deliveryNote.attachment_swap_id,
//       { transaction }
//     );

//     if (attachmentSwap) {
//       const updateData = {
//         delivery_note_status: "Completed",
//       };

//       // Check if partner is completed
//       if (attachmentSwap.swap_group_id) {
//         const partnerSwap = await AttachmentSwapModel.findOne({
//           where: {
//             swap_group_id: attachmentSwap.swap_group_id,
//             attachment_swap_id: { [Op.ne]: attachmentSwap.attachment_swap_id },
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

//       await attachmentSwap.update(updateData, { transaction });
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
//     console.error("Error uploading attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Upload attachment off hire note attachment
//  */
// const uploadAttachmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;
//     const user = req.user;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const fileName = req.file.filename;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
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

//     // Update attachment swap status
//     const attachmentSwap = await AttachmentSwapModel.findByPk(
//       offHireNote.attachment_swap_id,
//       { transaction }
//     );

//     if (attachmentSwap) {
//       const updateData = {
//         off_hire_note_status: "Completed",
//       };

//       // Check if partner is completed
//       if (attachmentSwap.swap_group_id) {
//         const partnerSwap = await AttachmentSwapModel.findOne({
//           where: {
//             swap_group_id: attachmentSwap.swap_group_id,
//             attachment_swap_id: { [Op.ne]: attachmentSwap.attachment_swap_id },
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

//       await attachmentSwap.update(updateData, { transaction });
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
//     console.error("Error uploading attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Upload attachment delivery note checklist
//  */
// const uploadAttachmentDNChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_id } = req.params;
//     const file = req.file;
//     const user = req.user;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const resource = await AttachmentDNAttachmentModel.findOne({
//       where: { id: resource_id, trip_id },
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: "Attachment resource not found in this trip" });
//     }

//     await AttachmentDNAttachmentModel.update(
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
//     console.error("Error uploading attachment DN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Upload attachment off hire note checklist
//  */
// const uploadAttachmentOHNChecklist = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { trip_id, resource_id } = req.params;
//     const file = req.file;
//     const user = req.user;

//     if (!file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const resource = await AttachmentOHNAttachmentModel.findOne({
//       where: { id: resource_id, trip_id },
//       transaction,
//     });

//     if (!resource) {
//       await transaction.rollback();
//       return res
//         .status(404)
//         .json({ message: "Attachment resource not found in this trip" });
//     }

//     await AttachmentOHNAttachmentModel.update(
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
//     console.error("Error uploading attachment OHN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Download attachment delivery note checklist
//  */
// const downloadAttachmentDNChecklist = async (req, res) => {
//   try {
//     const { trip_id, resource_id } = req.params;

//     const resource = await AttachmentDNAttachmentModel.findOne({
//       where: { id: resource_id, trip_id },
//     });

//     if (!resource) {
//       return res.status(404).json({ message: "Attachment resource not found" });
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
//     console.error("Error downloading attachment DN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// /**
//  * Download attachment off hire note checklist
//  */
// const downloadAttachmentOHNChecklist = async (req, res) => {
//   try {
//     const { trip_id, resource_id } = req.params;

//     const resource = await AttachmentOHNAttachmentModel.findOne({
//       where: { id: resource_id, trip_id },
//     });

//     if (!resource) {
//       return res.status(404).json({ message: "Attachment resource not found" });
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
//     console.error("Error downloading attachment OHN checklist:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ==================== SWAP REQUEST MANAGEMENT ====================

// const submitAttachmentSwapRequest = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_swap_id } = req.params;
//     const { mobilization_charge, demobilization_charge } = req.body;

//     if (!mobilization_charge || !demobilization_charge) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Mobilization and demobilization charges are mandatory",
//       });
//     }

//     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
//       transaction,
//     });

//     if (!attachmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     await attachmentSwap.update(
//       {
//         swap_status: attachmentSwap.swap_status === "Return" ? "Resubmit" : "Swap Request",
//         mobilization_charge: parseFloat(mobilization_charge),
//         demobilization_charge: parseFloat(demobilization_charge),
//         return_reason: null,
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Attachment swap submitted successfully",
//       attachmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error submitting attachment swap:", error);
//     res.status(500).json({
//       message: "Error submitting attachment swap",
//       error: error.message,
//     });
//   }
// };

// const returnAttachmentSwapRequest = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_swap_id } = req.params;
//     const { return_reason } = req.body;

//     if (!return_reason || !return_reason.trim()) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Return reason is required",
//       });
//     }

//     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
//       transaction,
//     });

//     if (!attachmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     await attachmentSwap.update(
//       {
//         swap_status: "Return",
//         return_reason: return_reason.trim(),
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Attachment swap returned successfully",
//       attachmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error returning attachment swap:", error);
//     res.status(500).json({
//       message: "Error returning attachment swap",
//       error: error.message,
//     });
//   }
// };

// const approveAttachmentSwap = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_swap_id } = req.params;

//     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
//       transaction,
//     });

//     if (!attachmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     await attachmentSwap.update(
//       {
//         swap_status: "Approved",
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Attachment swap approved successfully",
//       attachmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error approving attachment swap:", error);
//     res.status(500).json({
//       message: "Error approving attachment swap",
//       error: error.message,
//     });
//   }
// };

// const rejectAttachmentSwap = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_swap_id } = req.params;
//     const { rejection_reason } = req.body;

//     const attachmentSwap = await AttachmentSwapModel.findByPk(attachment_swap_id, {
//       transaction,
//     });

//     if (!attachmentSwap) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Attachment swap not found" });
//     }

//     await attachmentSwap.update(
//       {
//         swap_status: "Rejected",
//         return_reason: rejection_reason || "Rejected by approver",
//       },
//       { transaction }
//     );

//     await transaction.commit();

//     res.status(200).json({
//       message: "Attachment swap rejected successfully",
//       attachmentSwap,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error rejecting attachment swap:", error);
//     res.status(500).json({
//       message: "Error rejecting attachment swap",
//       error: error.message,
//     });
//   }
// };

// // ==================== LEGACY PDF GENERATION (keep for backward compatibility) ====================

// const generateAttachmentDeliveryNotePDF = async (req, res) => {
//   // Legacy function - delegates to the newer implementation
//   return generateAttachmentDNPDF(req, res);
// };

// const generateAttachmentOffHireNotePDF = async (req, res) => {
//   // Legacy function - keep existing implementation
//   try {
//     const { attachment_ohn_id } = req.params;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
//       {
//         include: [
//           {
//             model: AttachmentOffHireNoteTripModel,
//             as: "trips",
//             order: [["trip_number", "ASC"]],
//           },
//           {
//             model: AttachmentSwapModel,
//             as: "attachmentSwap",
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
//                 model: AttachmentModel,
//                 as: "previousAttachment",
//                 attributes: [
//                   "attachment_id",
//                   "attachment_number",
//                   "product_name",
//                   "serial_number",
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
//     await AttachmentOffHireNoteTripModel.update(
//       { trip_status: "In Progress" },
//       {
//         where: { attachment_ohn_id, trip_status: "Creation" },
//       }
//     );

//     // Generate PDF
//     const doc = new PDFDocument({ margin: 40, size: "A4" });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="AT-OH-${offHireNote.ohn_number}.pdf"`
//     );

//     doc.pipe(res);

//     // Add border to page
//     const pageWidth = doc.page.width;
//     const pageHeight = doc.page.height;
//     doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

//     // Company Header with Indigo Background
//     doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#4F46E5", "#4F46E5");

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
//       .fillColor("#4F46E5")
//       .text("ATTACHMENT OFF HIRE NOTE", { align: "center" })
//       .fillColor("#000000");

//     doc.moveDown(1);
//     doc
//       .moveTo(100, doc.y)
//       .lineTo(pageWidth - 100, doc.y)
//       .stroke("#4F46E5");
//     doc.moveDown(1);

//     // Two Column Layout for Details
//     const leftX = 50;
//     const rightX = 320;
//     const startY = doc.y;

//     // Left Column - Client Information
//     doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
//     doc.text("CLIENT INFORMATION", leftX, startY);
//     doc.fillColor("#000000");

//     doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
//     doc.fontSize(10).font("Helvetica");
//     doc.text(
//       offHireNote.attachmentSwap.salesOrder.client,
//       leftX + 10,
//       startY + 30,
//       { width: 220 }
//     );

//     // Right Column - Document Details
//     doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
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
//       offHireNote.attachmentSwap.salesOrder.so_number,
//       rightX + 130,
//       detailsY + 50
//     );
//     doc.text(
//       offHireNote.attachmentSwap.salesOrder.project_name || "N/A",
//       rightX + 130,
//       detailsY + 70,
//       { width: 100 }
//     );

//     doc.y = startY + 120;
//     doc.moveDown(1);

//     // Attachment Details Section
//     doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
//     doc
//       .rect(leftX, doc.y, pageWidth - 100, 20)
//       .fillAndStroke("#4F46E5", "#4F46E5");
//     doc.text("ATTACHMENT DETAILS", leftX + 10, doc.y + 5);

//     doc.fillColor("#000000");
//     doc.moveDown(1.5);

//     const attachY = doc.y;
//     const attachHeight = offHireNote.attachmentSwap.previousAttachment
//       .serial_number
//       ? 70
//       : 50;
//     doc.rect(leftX, attachY, pageWidth - 100, attachHeight).stroke("#CCCCCC");

//     doc.fontSize(9).font("Helvetica-Bold");
//     doc.text("Attachment Number:", leftX + 10, attachY + 10);
//     doc.text("Product Name:", leftX + 10, attachY + 30);

//     doc.font("Helvetica");
//     doc.text(
//       offHireNote.attachmentSwap.previousAttachment.attachment_number,
//       leftX + 130,
//       attachY + 10
//     );
//     doc.text(
//       offHireNote.attachmentSwap.previousAttachment.product_name,
//       leftX + 130,
//       attachY + 30,
//       { width: 350 }
//     );

//     if (offHireNote.attachmentSwap.previousAttachment.serial_number) {
//       doc.font("Helvetica-Bold");
//       doc.text("Serial Number:", leftX + 10, attachY + 50);
//       doc.font("Helvetica");
//       doc.text(
//         offHireNote.attachmentSwap.previousAttachment.serial_number,
//         leftX + 130,
//         attachY + 50
//       );
//     }

//     doc.y = attachY + attachHeight + 10;
//     doc.moveDown(1);

//     // Transportation Details
//     if (offHireNote.trips && offHireNote.trips.length > 0) {
//       doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
//       doc
//         .rect(leftX, doc.y, pageWidth - 100, 20)
//         .fillAndStroke("#4F46E5", "#4F46E5");
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

//         doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke("#CCCCCC");

//         doc.fontSize(10).font("Helvetica-Bold").fillColor("#4F46E5");
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
//       doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
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
//     doc
//       .rect(leftX, doc.y, pageWidth - 100, 30)
//       .fillAndStroke("#E0E7FF", "#CCCCCC");
//     doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
//     doc.text(
//       "We acknowledge that the attachment has been returned in good condition.",
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
//   // Attachment Numbers
//   getAllAttachmentNumbers,
//   getAttachmentSwapReasons,

//   // Swap Creation & Retrieval
//   createAttachmentSwap,
//   getAttachmentSwapsBySalesOrder,
//   getAttachmentSwapById,

//   // Delivery Note Functions
//   createAttachmentDeliveryNote,
//   getAttachmentDeliveryNoteById,
//   getLatestAttachmentDeliveryNote,
//   getAttachmentDeliveryNoteSummary,
//   submitAttachmentDNForApproval,
//   approveAttachmentDeliveryNote,
//   rejectAttachmentDeliveryNote,
//   generateAttachmentDeliveryNotePDF,
//   generateAttachmentDNPDF,
//   closeAttachmentDeliveryNote,
//   uploadAttachmentDeliveryNote,
//   addTripToAttachmentDeliveryNote,
//   updateTripInAttachmentDN,
//   deleteTripFromAttachmentDN,
//   uploadAttachmentDNChecklist,
//   downloadAttachmentDNChecklist,

//   // Off Hire Note Functions (Enhanced)
//   createAttachmentOffHireNote,
//   getAttachmentOffHireNoteById,
//   getLatestAttachmentOffHireNote,
//   getAttachmentOffHireNoteSummary,
//   submitAttachmentOHNForApproval,
//   approveAttachmentOffHireNote,
//   rejectAttachmentOffHireNote,
//   generateAttachmentOffHireNotePDF,
//   generateAttachmentOHNPDF,
//   closeAttachmentOffHireNote,
//   uploadAttachmentOffHireNote,
//   addTripToAttachmentOffHireNote,
//   updateTripInAttachmentOHN,
//   deleteTripFromAttachmentOHN,
//   uploadAttachmentOHNChecklist,
//   downloadAttachmentOHNChecklist,

//   // Swap Request Management
//   submitAttachmentSwapRequest,
//   returnAttachmentSwapRequest,
//   approveAttachmentSwap,
//   rejectAttachmentSwap,
//   getPendingAttachmentSwapRequests,
//   getSwapRequestCounts,
// };

// controllers/fleet-management/AttachmentSwapController.js
const AttachmentSwapModel = require("../models/AttachmentSwapModel");
const AttachmentModel = require("../models/AttachmentModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const {
  AttachmentDeliveryNoteModel,
  AttachmentDeliveryNoteTripModel,
  AttachmentDNAttachmentModel,
} = require("../models/AttachmentDeliveryNoteModel");
const {
  AttachmentOffHireNoteModel,
  AttachmentOffHireNoteTripModel,
  AttachmentOHNAttachmentModel,
} = require("../models/AttachmentOffHireNoteModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const SwapReasonModel = require("../models/swapReasonModel");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

// Helper functions
const generateAttachmentDNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `AT-DN-${currentYear}-`;

  const lastDN = await AttachmentDeliveryNoteModel.findOne({
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

const generateAttachmentOHNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `AT-OH-${currentYear}-`;

  const lastOHN = await AttachmentOffHireNoteModel.findOne({
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

// Helper function to update statuses across swap group
const updateSwapGroupStatuses = async (
  swapGroupId,
  noteType,
  status,
  transaction,
) => {
  try {
    if (!swapGroupId) return;

    // Get all swaps in the group
    const groupSwaps = await AttachmentSwapModel.findAll({
      where: { swap_group_id: swapGroupId },
      transaction,
    });

    if (groupSwaps.length === 0) return;

    // Separate by type
    const deliverySwap = groupSwaps.find((s) => s.swap_type === "DELIVERY");
    const offHireSwap = groupSwaps.find((s) => s.swap_type === "OFF_HIRE");

    if (!deliverySwap || !offHireSwap) return;

    // Determine which status to update based on note type
    if (noteType === "DELIVERY") {
      await deliverySwap.update(
        { delivery_note_status: status },
        { transaction },
      );
    } else if (noteType === "OFF_HIRE") {
      await offHireSwap.update(
        { off_hire_note_status: status },
        { transaction },
      );
    }

    // Recalculate overall status based on both statuses
    await recalculateOverallStatus(
      deliverySwap.attachment_swap_id,
      offHireSwap.attachment_swap_id,
      transaction,
    );
  } catch (error) {
    console.error("Error updating swap group statuses:", error);
    throw error;
  }
};

// Helper function to recalculate overall status
const recalculateOverallStatus = async (
  deliverySwapId,
  offHireSwapId,
  transaction,
) => {
  try {
    // Get both swaps
    const deliverySwap = deliverySwapId
      ? await AttachmentSwapModel.findByPk(deliverySwapId, { transaction })
      : null;
    const offHireSwap = offHireSwapId
      ? await AttachmentSwapModel.findByPk(offHireSwapId, { transaction })
      : null;

    if (!deliverySwap && !offHireSwap) return;

    // If we have only one swap (no group), just update that one

    // Both swaps exist - determine overall status

    if (
      deliverySwap.delivery_note_status === "Completed" &&
      offHireSwap.off_hire_note_status === "Completed"
    ) {
    } else if (
      deliverySwap.delivery_note_status === "Completed" ||
      offHireSwap.off_hire_note_status === "Completed"
    ) {
    } else if (
      deliverySwap.delivery_note_status === "In Progress" ||
      offHireSwap.off_hire_note_status === "In Progress" ||
      deliverySwap.delivery_note_status === "Approved" ||
      offHireSwap.off_hire_note_status === "Approved"
    ) {
    }

    // Update both swaps with the same overall status
  } catch (error) {
    console.error("Error recalculating overall status:", error);
    throw error;
  }
};

// Get all attachment numbers for dropdown
const getAllAttachmentNumbers = async (req, res) => {
  try {
    const attachment = await AttachmentModel.findAll({
      where: { status: "Active" },
      attributes: ["attachment_id", "attachment_number", "product_name"],
      order: [["attachment_number", "ASC"]],
    });

    res.status(200).json({
      success: true,
      attachment: attachment.map((attach) => ({
        attachment_id: attach.attachment_id,
        attachment_number: attach.attachment_number,
        product_name: attach.product_name,
      })),
    });
  } catch (error) {
    console.error("Error fetching attachments:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAttachmentSwapReasons = async (req, res) => {
  try {
    const swapReasons = await SwapReasonModel.findAll({
      where: {
        category: "Attachment",
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
    console.error("Error fetching attachment swap reasons:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── Helper: generate a human-readable group ID ────────────────────────────
// Format: AT-YYYYMMDD-XXXX  (e.g. AT-20260224-B7D2)
const generateSwapGroupId = (prefix = "AT") => {
  const now = new Date();
  const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // "20260224"
  const randomPart = Math.random().toString(36).toUpperCase().slice(2, 6); // 4 random alphanumeric chars
  return `${prefix}-${datePart}-${randomPart}`;
};
// ───────────────────────────────────────────────────────────────────────────

const createAttachmentSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      sales_order_id,
      allocation_id,
      previous_attachment_no,
      new_attachment_no,
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
      !previous_attachment_no ||
      !new_attachment_no ||
      !swap_date ||
      !swap_reason
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // Check if new attachment number exists
    const existingAttachment = await AttachmentModel.findOne({
      where: { attachment_number: new_attachment_no, status: "Active" },
    });

    if (!existingAttachment) {
      await transaction.rollback();
      return res.status(400).json({
        message: "New attachment number does not exist in attachment table",
      });
    }

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Get previous attachment details
    const previousAttachment = await AttachmentModel.findOne({
      where: { attachment_number: previous_attachment_no },
    });

    if (!previousAttachment) {
      await transaction.rollback();
      return res.status(404).json({ message: "Previous attachment not found" });
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
    const swapGroupId = generateSwapGroupId("AT");

    // CREATE RECORD 1: OFF_HIRE — for the outgoing/previous attachment
    const offHireRecord = await AttachmentSwapModel.create(
      {
        swap_group_id: swapGroupId,
        sales_order_id,
        allocation_id: allocation_id || null,
        previous_attachment_id: previousAttachment.attachment_id,
        previous_attachment_no: previous_attachment_no,
        new_attachment_id: existingAttachment.attachment_id,
        new_attachment_no: null,
        swap_date,
        swap_reason,
        swap_type: "OFF_HIRE",
        swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
        swap_mobilization_trips: swap_mobilization_trips || null,
        swap_demobilization_trips: swap_demobilization_trips || null,
        swap_remark: swap_remark || null,
        delivery_note_status: "Pending",
        off_hire_note_status: "Pending",
        overall_status: "Creation",
        created_by: username,
      },
      { transaction },
    );

    // CREATE RECORD 2: DELIVERY — for the incoming/new attachment
    const deliveryRecord = await AttachmentSwapModel.create(
      {
        swap_group_id: swapGroupId,
        sales_order_id,
        allocation_id: allocation_id || null,
        previous_attachment_id: previousAttachment.attachment_id,
        previous_attachment_no: null,
        new_attachment_id: existingAttachment.attachment_id,
        new_attachment_no: new_attachment_no,
        swap_date,
        swap_reason,
        swap_type: "DELIVERY",
        swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
        swap_mobilization_trips: swap_mobilization_trips || null,
        swap_demobilization_trips: swap_demobilization_trips || null,
        swap_remark: swap_remark || null,
        delivery_note_status: "Pending",
        off_hire_note_status: "Pending",
        overall_status: "Creation",
        created_by: username,
      },
      { transaction },
    );

    // Update allocation attachment if allocation_id exists
    if (allocation_id) {
      const ActiveAllocationAttachmentModel =
        require("../models/ActiveAllocationsOriginalModel").AllocationAttachmentModel;

      await ActiveAllocationAttachmentModel.update(
        {
          attachment_id: existingAttachment.attachment_id,
          updated_at: new Date(),
        },
        {
          where: {
            allocation_id: allocation_id,
            attachment_id: previousAttachment.attachment_id,
          },
          transaction,
        },
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Attachment is Changed",
      attachmentSwaps: [offHireRecord, deliveryRecord],
      swap_group_id: swapGroupId,
      summary: {
        swap_group_id: swapGroupId,
        off_hire_attachment: previous_attachment_no,
        delivery_attachment: new_attachment_no,
        swap_date,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating attachment swap:", error);
    res.status(500).json({
      message: "Error creating attachment swap",
      error: error.message,
    });
  }
};

// Get all attachment swaps for sales order
const getAttachmentSwapsBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const attachmentSwaps = await AttachmentSwapModel.findAll({
      where: { sales_order_id },
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: AttachmentModel,
          as: "previousAttachment",
          attributes: [
            "attachment_id",
            "attachment_number",
            "product_name",
            "serial_number",
          ],
        },
        {
          model: AttachmentModel,
          as: "newAttachment",
          attributes: [
            "attachment_id",
            "attachment_number",
            "product_name",
            "serial_number",
          ],
        },
        {
          model: AttachmentDeliveryNoteModel,
          as: "deliveryNotes",
          include: [
            {
              model: AttachmentDeliveryNoteTripModel,
              as: "trips",
            },
          ],
          order: [["created_at", "DESC"]],
        },
        {
          model: AttachmentOffHireNoteModel,
          as: "offHireNotes",
          include: [
            {
              model: AttachmentOffHireNoteTripModel,
              as: "trips",
            },
          ],
          order: [["created_at", "DESC"]],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      totalCount: attachmentSwaps.length,
      attachmentSwaps,
    });
  } catch (error) {
    console.error("Error fetching attachment swaps:", error);
    res.status(500).json({
      message: "Error fetching attachment swaps",
      error: error.message,
    });
  }
};

// Get attachment swap by ID with details
const getAttachmentSwapById = async (req, res) => {
  try {
    const { id } = req.params;

    const attachmentSwap = await AttachmentSwapModel.findByPk(id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: AttachmentModel,
          as: "previousAttachment",
          attributes: [
            "attachment_id",
            "attachment_number",
            "product_name",
            "serial_number",
          ],
        },
        {
          model: AttachmentModel,
          as: "newAttachment",
          attributes: [
            "attachment_id",
            "attachment_number",
            "product_name",
            "serial_number",
          ],
        },
        {
          model: AttachmentDeliveryNoteModel,
          as: "deliveryNotes",
          include: [
            {
              model: AttachmentDeliveryNoteTripModel,
              as: "trips",
              include: [
                {
                  model: AttachmentDNAttachmentModel,
                  as: "attachment",
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        },
        {
          model: AttachmentOffHireNoteModel,
          as: "offHireNotes",
          include: [
            {
              model: AttachmentOffHireNoteTripModel,
              as: "trips",
              include: [
                {
                  model: AttachmentOHNAttachmentModel,
                  as: "attachment",
                },
              ],
            },
          ],
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!attachmentSwap) {
      return res.status(404).json({ message: "Attachment swap not found" });
    }

    res.status(200).json({
      attachmentSwap,
    });
  } catch (error) {
    console.error("Error fetching attachment swap:", error);
    res.status(500).json({
      message: "Error fetching attachment swap",
      error: error.message,
    });
  }
};

const getPendingAttachmentSwapRequests = async (req, res) => {
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

    const attachmentSwaps = await AttachmentSwapModel.findAll({
      where,
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["id", "so_number", "client", "project_name"],
        },
        {
          model: AttachmentModel,
          as: "previousAttachment",
          attributes: [
            "attachment_id",
            "attachment_number",
            "product_name",
            "serial_number",
          ],
        },
        {
          model: AttachmentModel,
          as: "newAttachment",
          attributes: [
            "attachment_id",
            "attachment_number",
            "product_name",
            "serial_number",
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Count pending requests
    const pendingCount = attachmentSwaps.filter(
      (swap) => swap.swap_status === "Swap Request",
    ).length;

    const resubmitCount = attachmentSwaps.filter(
      (swap) => swap.swap_status === "Resubmit",
    ).length;

    res.status(200).json({
      success: true,
      totalCount: attachmentSwaps.length,
      pendingCount,
      resubmitCount,
      attachmentSwaps,
    });
  } catch (error) {
    console.error("Error fetching pending attachment swap requests:", error);
    res.status(500).json({
      message: "Error fetching pending attachment swap requests",
      error: error.message,
    });
  }
};

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

    const equipmentSwapModel = require("../../models/fleet-management/EquipmentSwapModel");
    const equipmentCount = await equipmentSwapModel.count({ where });
    const attachmentCount = await AttachmentSwapModel.count({ where });

    res.status(200).json({
      success: true,
      equipmentSwapCount: equipmentCount,
      attachmentSwapCount: attachmentCount,
      totalSwapCount: equipmentCount + attachmentCount,
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

/**
 * Create attachment delivery note with trips and resources
 */
const createAttachmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_swap_id } = req.params;
    const { remarks, trips } = req.body;

    // Get attachment swap
    const attachmentSwap = await AttachmentSwapModel.findByPk(
      attachment_swap_id,
      {
        include: [
          {
            model: AttachmentModel,
            as: "newAttachment",
            attributes: ["attachment_id", "attachment_number", "product_name"],
          },
          {
            model: SalesOrdersModel,
            as: "salesOrder",
            attributes: ["so_number", "client", "project_name"],
          },
        ],
        transaction,
      },
    );

    if (!attachmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Attachment swap not found" });
    }

    // Generate DN number
    const dn_number = await generateAttachmentDNNumber();

    // Get logged in user
    let username = await getUsername(req);

    // Create delivery note
    const deliveryNote = await AttachmentDeliveryNoteModel.create(
      {
        attachment_swap_id,
        dn_number,
        new_attachment_id: attachmentSwap.new_attachment_id,
        new_attachment_no: attachmentSwap.new_attachment_no,
        status: "Creation",
        remarks,
        created_by: username,
      },
      { transaction },
    );

    // Create trips if provided
    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const newTrip = await AttachmentDeliveryNoteTripModel.create(
          {
            attachment_dn_id: deliveryNote.attachment_dn_id,
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

        // Add attachment resources to this trip
        if (trip.attachment && trip.attachment.length > 0) {
          for (const attach of trip.attachment) {
            await AttachmentDNAttachmentModel.create(
              {
                attachment_dn_id: deliveryNote.attachment_dn_id,
                trip_id: newTrip.trip_id,
                attachment_id: attach.attachment_id,
                attachment_number: attach.attachment_number,
                attachment_type: attach.attachment_type || null,
              },
              { transaction },
            );
          }
        }
      }
    }

    // Update delivery_note_status for this swap and its group
    await updateSwapGroupStatuses(
      attachmentSwap.swap_group_id,
      "DELIVERY",
      "In Progress",
      transaction,
    );

    const sameGroupSwapData = await AttachmentSwapModel.findAll({
      where: {
        overall_status: "Partially completed",
        swap_group_id: attachmentSwap.swap_group_id,
      },
    });

    if (attachmentSwap.overall_status === "In progress") {
      if (sameGroupSwapData.length > 0) {
        const attachmentGroupSwapData = await AttachmentSwapModel.findAll({
          where: {
            swap_group_id: attachmentSwap.swap_group_id,
          },
        });

        const ids = attachmentGroupSwapData.map((data) =>
          data.getDataValue("attachment_swap_id"),
        );
        for (const data of attachmentGroupSwapData) {
          await AttachmentSwapModel.update(
            { overall_status: "Completed" },
            {
              where: { attachment_swap_id: { [Op.in]: ids } },
              transaction,
            },
          );
        }
      } else {
        await AttachmentSwapModel.update(
          { overall_status: "Partially completed" },
          {
            where: { attachment_swap_id: attachmentSwap.attachment_swap_id },
            transaction,
          },
        );
      }
    }

    await transaction.commit();

    // Fetch created delivery note with trips
    const createdDeliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      deliveryNote.attachment_dn_id,
      {
        include: [
          {
            model: AttachmentDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: AttachmentDNAttachmentModel,
                as: "attachment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
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
      message: "Attachment delivery note created successfully",
      deliveryNote: createdDeliveryNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating attachment delivery note:", error);
    res.status(500).json({
      message: "Error creating attachment delivery note",
      error: error.message,
    });
  }
};

// ==================== OFF-HIRE NOTE FUNCTIONS (Enhanced) ====================

/**
 * Create attachment off hire note with trips and resources
 */
const createAttachmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_swap_id } = req.params;
    const { remarks, trips } = req.body;

    // Get attachment swap
    const attachmentSwap = await AttachmentSwapModel.findByPk(
      attachment_swap_id,
      {
        include: [
          {
            model: AttachmentModel,
            as: "previousAttachment",
            attributes: ["attachment_id", "attachment_number", "product_name"],
          },
          {
            model: SalesOrdersModel,
            as: "salesOrder",
            attributes: ["so_number", "client", "project_name"],
          },
        ],
        transaction,
      },
    );

    if (!attachmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Attachment swap not found" });
    }

    // Generate OHN number
    const ohn_number = await generateAttachmentOHNNumber();

    // Get logged in user
    let username = await getUsername(req);

    // Create off hire note
    const offHireNote = await AttachmentOffHireNoteModel.create(
      {
        attachment_swap_id,
        ohn_number,
        previous_attachment_id: attachmentSwap.previous_attachment_id,
        previous_attachment_no: attachmentSwap.previous_attachment_no,
        status: "Creation",
        remarks,
        created_by: username,
      },
      { transaction },
    );

    // Create trips if provided
    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const newTrip = await AttachmentOffHireNoteTripModel.create(
          {
            attachment_ohn_id: offHireNote.attachment_ohn_id,
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

        // Add attachment resources to this trip
        if (trip.attachment && trip.attachment.length > 0) {
          for (const attach of trip.attachment) {
            await AttachmentOHNAttachmentModel.create(
              {
                attachment_ohn_id: offHireNote.attachment_ohn_id,
                trip_id: newTrip.trip_id,
                attachment_id: attach.attachment_id,
                attachment_number: attach.attachment_number,
                attachment_type: attach.attachment_type || null,
              },
              { transaction },
            );
          }
        }
      }
    }

    // Update off_hire_note_status for this swap and its group
    await updateSwapGroupStatuses(
      attachmentSwap.swap_group_id,
      "OFF_HIRE",
      "In Progress",
      transaction,
    );

    const sameGroupSwapData = await AttachmentSwapModel.findAll({
      where: {
        overall_status: "Partially completed",
        swap_group_id: attachmentSwap.swap_group_id,
      },
    });

    if (attachmentSwap.overall_status === "In progress") {
      if (sameGroupSwapData.length > 0) {
        const attachmentGroupSwapData = await AttachmentSwapModel.findAll({
          where: {
            swap_group_id: attachmentSwap.swap_group_id,
          },
        });

        const ids = attachmentGroupSwapData.map((data) =>
          data.getDataValue("attachment_swap_id"),
        );
        for (const data of attachmentGroupSwapData) {
          await AttachmentSwapModel.update(
            { overall_status: "Completed" },
            {
              where: { attachment_swap_id: { [Op.in]: ids } },
              transaction,
            },
          );
        }
      } else {
        await AttachmentSwapModel.update(
          { overall_status: "Partially completed" },
          {
            where: { attachment_swap_id: attachmentSwap.attachment_swap_id },
            transaction,
          },
        );
      }
    }

    await transaction.commit();

    // Fetch created off hire note with trips
    const createdOffHireNote = await AttachmentOffHireNoteModel.findByPk(
      offHireNote.attachment_ohn_id,
      {
        include: [
          {
            model: AttachmentOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: AttachmentOHNAttachmentModel,
                as: "attachment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
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
      message: "Attachment off hire note created successfully",
      offHireNote: createdOffHireNote,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating attachment off hire note:", error);
    res.status(500).json({
      message: "Error creating attachment off hire note",
      error: error.message,
    });
  }
};

// ==================== GET FUNCTIONS ====================

/**
 * Get attachment delivery note by ID with trips and resources
 */
const getAttachmentDeliveryNoteById = async (req, res) => {
  try {
    const { attachment_dn_id } = req.params;

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [
          {
            model: AttachmentDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: AttachmentDNAttachmentModel,
                as: "attachment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
            include: [
              { model: SalesOrdersModel, as: "salesOrder" },
              {
                model: AttachmentModel,
                as: "newAttachment",
                attributes: [
                  "attachment_id",
                  "attachment_number",
                  "product_name",
                  "serial_number",
                ],
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
    console.error("Error fetching attachment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get attachment off hire note by ID with trips and resources
 */
const getAttachmentOffHireNoteById = async (req, res) => {
  try {
    const { attachment_ohn_id } = req.params;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [
          {
            model: AttachmentOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: AttachmentOHNAttachmentModel,
                as: "attachment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
            include: [
              { model: SalesOrdersModel, as: "salesOrder" },
              {
                model: AttachmentModel,
                as: "previousAttachment",
                attributes: [
                  "attachment_id",
                  "attachment_number",
                  "product_name",
                  "serial_number",
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

    res.status(200).json({ offHireNote });
  } catch (error) {
    console.error("Error fetching attachment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get latest attachment delivery note for a swap
 */
const getLatestAttachmentDeliveryNote = async (req, res) => {
  try {
    const { attachment_swap_id } = req.params;

    const deliveryNote = await AttachmentDeliveryNoteModel.findOne({
      where: { attachment_swap_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: AttachmentDeliveryNoteTripModel,
          as: "trips",
          include: [
            {
              model: AttachmentDNAttachmentModel,
              as: "attachment",
            },
          ],
          order: [["trip_number", "ASC"]],
        },
        {
          model: AttachmentSwapModel,
          as: "attachmentSwap",
          include: [
            { model: SalesOrdersModel, as: "salesOrder" },
            {
              model: AttachmentModel,
              as: "newAttachment",
              attributes: [
                "attachment_id",
                "attachment_number",
                "product_name",
                "serial_number",
              ],
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
    console.error("Error fetching latest attachment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get latest attachment off hire note for a swap
 */
const getLatestAttachmentOffHireNote = async (req, res) => {
  try {
    const { attachment_swap_id } = req.params;

    const offHireNote = await AttachmentOffHireNoteModel.findOne({
      where: { attachment_swap_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          model: AttachmentOffHireNoteTripModel,
          as: "trips",
          include: [
            {
              model: AttachmentOHNAttachmentModel,
              as: "attachment",
            },
          ],
          order: [["trip_number", "ASC"]],
        },
        {
          model: AttachmentSwapModel,
          as: "attachmentSwap",
          include: [
            { model: SalesOrdersModel, as: "salesOrder" },
            {
              model: AttachmentModel,
              as: "previousAttachment",
              attributes: [
                "attachment_id",
                "attachment_number",
                "product_name",
                "serial_number",
              ],
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
    console.error("Error fetching latest attachment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get attachment delivery note summary
 */
const getAttachmentDeliveryNoteSummary = async (req, res) => {
  try {
    const { attachment_dn_id } = req.params;

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [
          {
            model: AttachmentDeliveryNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: ["so_number", "client", "project_name"],
              },
              {
                model: AttachmentModel,
                as: "newAttachment",
                attributes: [
                  "attachment_id",
                  "attachment_number",
                  "product_name",
                  "serial_number",
                ],
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
      attachment: deliveryNote.attachmentSwap.newAttachment,
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
 * Get attachment off hire note summary
 */
const getAttachmentOffHireNoteSummary = async (req, res) => {
  try {
    const { attachment_ohn_id } = req.params;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [
          {
            model: AttachmentOffHireNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
            include: [
              {
                model: SalesOrdersModel,
                as: "salesOrder",
                attributes: ["so_number", "client", "project_name"],
              },
              {
                model: AttachmentModel,
                as: "previousAttachment",
                attributes: [
                  "attachment_id",
                  "attachment_number",
                  "product_name",
                  "serial_number",
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

    // Format summary data
    const summaryData = {
      ohn_number: offHireNote.ohn_number,
      attachment: offHireNote.attachmentSwap.previousAttachment,
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
 * Submit attachment delivery note for approval
 */
const submitAttachmentDNForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_dn_id } = req.params;

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update delivery_note_status for this swap and its group
    await updateSwapGroupStatuses(
      deliveryNote.attachmentSwap?.swap_group_id,
      "DELIVERY",
      "Under Approval",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Submitted for approval successfully",
      deliveryNote:
        await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting attachment DN for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Submit attachment off hire note for approval
 */
const submitAttachmentOHNForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_ohn_id } = req.params;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update off_hire_note_status for this swap and its group
    await updateSwapGroupStatuses(
      offHireNote.attachmentSwap?.swap_group_id,
      "OFF_HIRE",
      "Under Approval",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Submitted for approval successfully",
      offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting attachment OHN for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve attachment delivery note
 */
const approveAttachmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_dn_id } = req.params;
    const username = await getUsername(req);

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update delivery_note_status for this swap and its group
    await updateSwapGroupStatuses(
      deliveryNote.attachmentSwap?.swap_group_id,
      "DELIVERY",
      "Approved",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note approved successfully",
      deliveryNote:
        await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving attachment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve attachment off hire note
 */
const approveAttachmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_ohn_id } = req.params;
    const username = await getUsername(req);

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update off_hire_note_status for this swap and its group
    await updateSwapGroupStatuses(
      offHireNote.attachmentSwap?.swap_group_id,
      "OFF_HIRE",
      "Approved",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note approved successfully",
      offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving attachment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject attachment delivery note
 */
const rejectAttachmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_dn_id } = req.params;
    const { reason } = req.body;

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update delivery_note_status for this swap and its group
    await updateSwapGroupStatuses(
      deliveryNote.attachmentSwap?.swap_group_id,
      "DELIVERY",
      "Rejected",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note rejected successfully",
      deliveryNote:
        await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting attachment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject attachment off hire note
 */
const rejectAttachmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_ohn_id } = req.params;
    const { reason } = req.body;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update off_hire_note_status for this swap and its group
    await updateSwapGroupStatuses(
      offHireNote.attachmentSwap?.swap_group_id,
      "OFF_HIRE",
      "Rejected",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note rejected successfully",
      offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting attachment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate attachment delivery note PDF data (for frontend)
 */
const generateAttachmentDNPDF = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_dn_id } = req.params;

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [
          {
            model: AttachmentDeliveryNoteTripModel,
            as: "trips",
            include: [
              {
                model: AttachmentDNAttachmentModel,
                as: "attachment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
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
                model: AttachmentModel,
                as: "newAttachment",
                attributes: [
                  "attachment_id",
                  "attachment_number",
                  "product_name",
                  "serial_number",
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

      // Update delivery_note_status for this swap and its group
      await updateSwapGroupStatuses(
        deliveryNote.attachmentSwap?.swap_group_id,
        "DELIVERY",
        "In Progress",
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
    console.error("Error generating attachment DN PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate attachment off hire note PDF data (for frontend)
 */
const generateAttachmentOHNPDF = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_ohn_id } = req.params;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [
          {
            model: AttachmentOffHireNoteTripModel,
            as: "trips",
            include: [
              {
                model: AttachmentOHNAttachmentModel,
                as: "attachment",
              },
            ],
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
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
                model: AttachmentModel,
                as: "previousAttachment",
                attributes: [
                  "attachment_id",
                  "attachment_number",
                  "product_name",
                  "serial_number",
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

      // Update off_hire_note_status for this swap and its group
      await updateSwapGroupStatuses(
        offHireNote.attachmentSwap?.swap_group_id,
        "OFF_HIRE",
        "In Progress",
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
    console.error("Error generating attachment OHN PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close attachment delivery note
 */
const closeAttachmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_dn_id } = req.params;

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update delivery_note_status for this swap and its group
    await updateSwapGroupStatuses(
      deliveryNote.attachmentSwap?.swap_group_id,
      "DELIVERY",
      "Close",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note closed successfully",
      deliveryNote:
        await AttachmentDeliveryNoteModel.findByPk(attachment_dn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing attachment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close attachment off hire note
 */
const closeAttachmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_ohn_id } = req.params;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update off_hire_note_status for this swap and its group
    await updateSwapGroupStatuses(
      offHireNote.attachmentSwap?.swap_group_id,
      "OFF_HIRE",
      "Close",
      transaction,
    );

    await transaction.commit();

    res.status(200).json({
      message: "Off hire note closed successfully",
      offHireNote: await AttachmentOffHireNoteModel.findByPk(attachment_ohn_id),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing attachment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== TRIP MANAGEMENT FUNCTIONS ====================

/**
 * Add trip to attachment delivery note
 */
// const addTripToAttachmentDeliveryNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_dn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       attachment,
//       remarks,
//     } = req.body;

//     const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
//       attachment_dn_id,
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

//     const existingTrips = await AttachmentDeliveryNoteTripModel.findAll({
//       where: { attachment_dn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per delivery note" });
//     }

//     const newTrip = await AttachmentDeliveryNoteTripModel.create(
//       {
//         attachment_dn_id,
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

//     // Add attachment resources
//     if (attachment && attachment.length > 0) {
//       for (const attach of attachment) {
//         await AttachmentDNAttachmentModel.create(
//           {
//             attachment_dn_id,
//             trip_id: newTrip.trip_id,
//             attachment_id: attach.attachment_id,
//             attachment_number: attach.attachment_number,
//             attachment_type: attach.attachment_type || null,
//           },
//           { transaction },
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await AttachmentDeliveryNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to attachment delivery note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

/**
 * Add trip to attachment off hire note
 */
// const addTripToAttachmentOffHireNote = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { attachment_ohn_id } = req.params;
//     const {
//       transportation_company,
//       driver_name,
//       driver_contact,
//       vehicle_type,
//       vehicle_number,
//       recovery_vehicle_number,
//       chargeable_type,
//       trip_date,
//       attachment,
//       remarks,
//     } = req.body;

//     const offHireNote = await AttachmentOffHireNoteModel.findByPk(
//       attachment_ohn_id,
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

//     const existingTrips = await AttachmentOffHireNoteTripModel.findAll({
//       where: { attachment_ohn_id },
//       transaction,
//     });

//     if (existingTrips.length >= 7) {
//       await transaction.rollback();
//       return res
//         .status(400)
//         .json({ message: "Maximum 7 trips allowed per off hire note" });
//     }

//     const newTrip = await AttachmentOffHireNoteTripModel.create(
//       {
//         attachment_ohn_id,
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

//     // Add attachment resources
//     if (attachment && attachment.length > 0) {
//       for (const attach of attachment) {
//         await AttachmentOHNAttachmentModel.create(
//           {
//             attachment_ohn_id,
//             trip_id: newTrip.trip_id,
//             attachment_id: attach.attachment_id,
//             attachment_number: attach.attachment_number,
//             attachment_type: attach.attachment_type || null,
//           },
//           { transaction },
//         );
//       }
//     }

//     await transaction.commit();

//     res.status(201).json({
//       message: "Trip added successfully",
//       trip: await AttachmentOffHireNoteTripModel.findByPk(newTrip.trip_id, {
//         include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
//       }),
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error adding trip to attachment off hire note:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const addTripToAttachmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();
 
  try {
    const { attachment_dn_id } = req.params;
    const { trips } = req.body; // array of trip objects
 
    if (!trips || !Array.isArray(trips) || trips.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "trips array is required" });
    }
 
    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      { transaction },
    );
 
    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }
 
    const existingTrips = await AttachmentDeliveryNoteTripModel.findAll({
      where: { attachment_dn_id },
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
        attachment,
        remarks,
      } = trips[i];
 
      const newTrip = await AttachmentDeliveryNoteTripModel.create(
        {
          attachment_dn_id,
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
 
      if (attachment && attachment.length > 0) {
        for (const attach of attachment) {
          await AttachmentDNAttachmentModel.create(
            {
              attachment_dn_id,
              trip_id: newTrip.trip_id,
              attachment_id: attach.attachment_id,
              attachment_number: attach.attachment_number,
              attachment_type: attach.attachment_type || null,
            },
            { transaction },
          );
        }
      }
 
      createdTrips.push(newTrip.trip_id);
    }
 
    await transaction.commit();
 
    const result = await AttachmentDeliveryNoteTripModel.findAll({
      where: { trip_id: createdTrips },
      include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
    });
 
    res.status(201).json({
      message: "Trips added successfully",
      trips: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trips to attachment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const addTripToAttachmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();
 
  try {
    const { attachment_ohn_id } = req.params;
    const { trips } = req.body;
 
    if (!trips || !Array.isArray(trips) || trips.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "trips array is required" });
    }
 
    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      { transaction },
    );
 
    if (!offHireNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off hire note not found" });
    }
 
    const existingTrips = await AttachmentOffHireNoteTripModel.findAll({
      where: { attachment_ohn_id },
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
        attachment,
        remarks,
      } = trips[i];
 
      const newTrip = await AttachmentOffHireNoteTripModel.create(
        {
          attachment_ohn_id,
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
 
      if (attachment && attachment.length > 0) {
        for (const attach of attachment) {
          await AttachmentOHNAttachmentModel.create(
            {
              attachment_ohn_id,
              trip_id: newTrip.trip_id,
              attachment_id: attach.attachment_id,
              attachment_number: attach.attachment_number,
              attachment_type: attach.attachment_type || null,
            },
            { transaction },
          );
        }
      }
 
      createdTrips.push(newTrip.trip_id);
    }
 
    await transaction.commit();
 
    const result = await AttachmentOffHireNoteTripModel.findAll({
      where: { trip_id: createdTrips },
      include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
    });
 
    res.status(201).json({
      message: "Trips added successfully",
      trips: result,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trips to attachment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update trip in attachment delivery note
 */
const updateTripInAttachmentDN = async (req, res) => {
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
      attachment,
      remarks,
    } = req.body;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
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

    // Replace attachment resources
    if (attachment !== undefined) {
      await AttachmentDNAttachmentModel.destroy({
        where: { trip_id },
        transaction,
      });

      if (attachment.length > 0) {
        for (const attach of attachment) {
          await AttachmentDNAttachmentModel.create(
            {
              attachment_dn_id: trip.attachment_dn_id,
              trip_id,
              attachment_id: attach.attachment_id,
              attachment_number: attach.attachment_number,
              attachment_type: attach.attachment_type || null,
            },
            { transaction },
          );
        }
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in attachment DN:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update trip in attachment off hire note
 */
const updateTripInAttachmentOHN = async (req, res) => {
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
      attachment,
      remarks,
    } = req.body;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
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

    // Replace attachment resources
    if (attachment !== undefined) {
      await AttachmentOHNAttachmentModel.destroy({
        where: { trip_id },
        transaction,
      });

      if (attachment.length > 0) {
        for (const attach of attachment) {
          await AttachmentOHNAttachmentModel.create(
            {
              attachment_ohn_id: trip.attachment_ohn_id,
              trip_id,
              attachment_id: attach.attachment_id,
              attachment_number: attach.attachment_number,
              attachment_type: attach.attachment_type || null,
            },
            { transaction },
          );
        }
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in attachment OHN:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete trip from attachment delivery note
 */
const deleteTripFromAttachmentDN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
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

    await trip.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete trip from attachment off hire note
 */
const deleteTripFromAttachmentOHN = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
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

    await trip.destroy({ transaction });
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
 * Upload attachment delivery note attachment
 */
const uploadAttachmentDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_dn_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    const deliveryNote = await AttachmentDeliveryNoteModel.findByPk(
      attachment_dn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update delivery_note_status for this swap and its group
    await updateSwapGroupStatuses(
      deliveryNote.attachmentSwap?.swap_group_id,
      "DELIVERY",
      "Completed",
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
    console.error("Error uploading attachment delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload attachment off hire note attachment
 */
const uploadAttachmentOffHireNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_ohn_id } = req.params;
    const username = await getUsername(req);

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.filename;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [{ model: AttachmentSwapModel, as: "attachmentSwap" }],
        transaction,
      },
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

    // Update off_hire_note_status for this swap and its group
    await updateSwapGroupStatuses(
      offHireNote.attachmentSwap?.swap_group_id,
      "OFF_HIRE",
      "Completed",
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
    console.error("Error uploading attachment off hire note:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload attachment delivery note checklist
 */
const uploadAttachmentDNChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id, resource_id } = req.params;
    const file = req.file;
    const username = await getUsername(req);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resource = await AttachmentDNAttachmentModel.findOne({
      where: { id: resource_id, trip_id },
      transaction,
    });

    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Attachment resource not found in this trip" });
    }

    await AttachmentDNAttachmentModel.update(
      {
        checklist_file_path: file.path,
        checklist_file_name: file.originalname,
        checklist_uploaded_at: new Date(),
        checklist_uploaded_by: username || "System",
      },
      { where: { id: resource_id, trip_id }, transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Checklist uploaded successfully",
      file: {
        path: file.path,
        name: file.originalname,
        uploaded_at: new Date(),
        uploaded_by: user?.username || "System",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading attachment DN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload attachment off hire note checklist
 */
const uploadAttachmentOHNChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id, resource_id } = req.params;
    const file = req.file;
    const username = await getUsername(req);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const resource = await AttachmentOHNAttachmentModel.findOne({
      where: { id: resource_id, trip_id },
      transaction,
    });

    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "Attachment resource not found in this trip" });
    }

    await AttachmentOHNAttachmentModel.update(
      {
        checklist_file_path: file.path,
        checklist_file_name: file.originalname,
        checklist_uploaded_at: new Date(),
        checklist_uploaded_by: username || "System",
      },
      { where: { id: resource_id, trip_id }, transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Checklist uploaded successfully",
      file: {
        path: file.path,
        name: file.originalname,
        uploaded_at: new Date(),
        uploaded_by: user?.username || "System",
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading attachment OHN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Download attachment delivery note checklist
 */
const downloadAttachmentDNChecklist = async (req, res) => {
  try {
    const { trip_id, resource_id } = req.params;

    const resource = await AttachmentDNAttachmentModel.findOne({
      where: { id: resource_id, trip_id },
    });

    if (!resource) {
      return res.status(404).json({ message: "Attachment resource not found" });
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
    console.error("Error downloading attachment DN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Download attachment off hire note checklist
 */
const downloadAttachmentOHNChecklist = async (req, res) => {
  try {
    const { trip_id, resource_id } = req.params;

    const resource = await AttachmentOHNAttachmentModel.findOne({
      where: { id: resource_id, trip_id },
    });

    if (!resource) {
      return res.status(404).json({ message: "Attachment resource not found" });
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
    console.error("Error downloading attachment OHN checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== SWAP REQUEST MANAGEMENT ====================

const submitAttachmentSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_swap_id } = req.params;
    const { mobilization_charge, demobilization_charge } = req.body;

    if (!mobilization_charge || !demobilization_charge) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Mobilization and demobilization charges are mandatory",
      });
    }

    const attachmentSwap = await AttachmentSwapModel.findByPk(
      attachment_swap_id,
      {
        transaction,
      },
    );

    if (!attachmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Attachment swap not found" });
    }

    await attachmentSwap.update(
      {
        swap_status:
          attachmentSwap.swap_status === "Return" ? "Resubmit" : "Swap Request",
        mobilization_charge: parseFloat(mobilization_charge),
        demobilization_charge: parseFloat(demobilization_charge),
        return_reason: null,
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Attachment swap submitted successfully",
      attachmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting attachment swap:", error);
    res.status(500).json({
      message: "Error submitting attachment swap",
      error: error.message,
    });
  }
};

const returnAttachmentSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_swap_id } = req.params;
    const { return_reason } = req.body;

    if (!return_reason || !return_reason.trim()) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Return reason is required",
      });
    }

    const attachmentSwap = await AttachmentSwapModel.findByPk(
      attachment_swap_id,
      {
        transaction,
      },
    );

    if (!attachmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Attachment swap not found" });
    }

    await attachmentSwap.update(
      {
        swap_status: "Return",
        return_reason: return_reason.trim(),
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Attachment swap returned successfully",
      attachmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error returning attachment swap:", error);
    res.status(500).json({
      message: "Error returning attachment swap",
      error: error.message,
    });
  }
};

const approveAttachmentSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_swap_id } = req.params;

    const attachmentSwap = await AttachmentSwapModel.findByPk(
      attachment_swap_id,
      {
        transaction,
      },
    );

    if (!attachmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Attachment swap not found" });
    }

    await attachmentSwap.update(
      {
        swap_status: "Approved",
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Attachment swap approved successfully",
      attachmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving attachment swap:", error);
    res.status(500).json({
      message: "Error approving attachment swap",
      error: error.message,
    });
  }
};

const rejectAttachmentSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { attachment_swap_id } = req.params;
    const { rejection_reason } = req.body;

    const attachmentSwap = await AttachmentSwapModel.findByPk(
      attachment_swap_id,
      {
        transaction,
      },
    );

    if (!attachmentSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Attachment swap not found" });
    }

    await attachmentSwap.update(
      {
        swap_status: "Rejected",
        return_reason: rejection_reason || "Rejected by approver",
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Attachment swap rejected successfully",
      attachmentSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting attachment swap:", error);
    res.status(500).json({
      message: "Error rejecting attachment swap",
      error: error.message,
    });
  }
};

// ==================== LEGACY PDF GENERATION (keep for backward compatibility) ====================

const generateAttachmentDeliveryNotePDF = async (req, res) => {
  // Legacy function - delegates to the newer implementation
  return generateAttachmentDNPDF(req, res);
};

const generateAttachmentOffHireNotePDF = async (req, res) => {
  // Legacy function - keep existing implementation
  try {
    const { attachment_ohn_id } = req.params;

    const offHireNote = await AttachmentOffHireNoteModel.findByPk(
      attachment_ohn_id,
      {
        include: [
          {
            model: AttachmentOffHireNoteTripModel,
            as: "trips",
            order: [["trip_number", "ASC"]],
          },
          {
            model: AttachmentSwapModel,
            as: "attachmentSwap",
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
                model: AttachmentModel,
                as: "previousAttachment",
                attributes: [
                  "attachment_id",
                  "attachment_number",
                  "product_name",
                  "serial_number",
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

    // Update off_hire_note_status for this swap and its group
    await updateSwapGroupStatuses(
      offHireNote.attachmentSwap?.swap_group_id,
      "OFF_HIRE",
      "In Progress",
    );

    // Also update trips status
    await AttachmentOffHireNoteTripModel.update(
      { trip_status: "In Progress" },
      {
        where: { attachment_ohn_id, trip_status: "Creation" },
      },
    );

    // Generate PDF
    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="AT-OH-${offHireNote.ohn_number}.pdf"`,
    );

    doc.pipe(res);

    // Add border to page
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

    // Company Header with Indigo Background
    doc.rect(40, 40, pageWidth - 80, 80).fillAndStroke("#4F46E5", "#4F46E5");

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
      .fillColor("#4F46E5")
      .text("ATTACHMENT OFF HIRE NOTE", { align: "center" })
      .fillColor("#000000");

    doc.moveDown(1);
    doc
      .moveTo(100, doc.y)
      .lineTo(pageWidth - 100, doc.y)
      .stroke("#4F46E5");
    doc.moveDown(1);

    // Two Column Layout for Details
    const leftX = 50;
    const rightX = 320;
    const startY = doc.y;

    // Left Column - Client Information
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
    doc.text("CLIENT INFORMATION", leftX, startY);
    doc.fillColor("#000000");

    doc.rect(leftX, startY + 20, 240, 60).stroke("#CCCCCC");
    doc.fontSize(10).font("Helvetica");
    doc.text(
      offHireNote.attachmentSwap.salesOrder.client,
      leftX + 10,
      startY + 30,
      { width: 220 },
    );

    // Right Column - Document Details
    doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
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
      offHireNote.attachmentSwap.salesOrder.so_number,
      rightX + 130,
      detailsY + 50,
    );
    doc.text(
      offHireNote.attachmentSwap.salesOrder.project_name || "N/A",
      rightX + 130,
      detailsY + 70,
      { width: 100 },
    );

    doc.y = startY + 120;
    doc.moveDown(1);

    // Attachment Details Section
    doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
    doc
      .rect(leftX, doc.y, pageWidth - 100, 20)
      .fillAndStroke("#4F46E5", "#4F46E5");
    doc.text("ATTACHMENT DETAILS", leftX + 10, doc.y + 5);

    doc.fillColor("#000000");
    doc.moveDown(1.5);

    const attachY = doc.y;
    const attachHeight = offHireNote.attachmentSwap.previousAttachment
      .serial_number
      ? 70
      : 50;
    doc.rect(leftX, attachY, pageWidth - 100, attachHeight).stroke("#CCCCCC");

    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Attachment Number:", leftX + 10, attachY + 10);
    doc.text("Product Name:", leftX + 10, attachY + 30);

    doc.font("Helvetica");
    doc.text(
      offHireNote.attachmentSwap.previousAttachment.attachment_number,
      leftX + 130,
      attachY + 10,
    );
    doc.text(
      offHireNote.attachmentSwap.previousAttachment.product_name,
      leftX + 130,
      attachY + 30,
      { width: 350 },
    );

    if (offHireNote.attachmentSwap.previousAttachment.serial_number) {
      doc.font("Helvetica-Bold");
      doc.text("Serial Number:", leftX + 10, attachY + 50);
      doc.font("Helvetica");
      doc.text(
        offHireNote.attachmentSwap.previousAttachment.serial_number,
        leftX + 130,
        attachY + 50,
      );
    }

    doc.y = attachY + attachHeight + 10;
    doc.moveDown(1);

    // Transportation Details
    if (offHireNote.trips && offHireNote.trips.length > 0) {
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc
        .rect(leftX, doc.y, pageWidth - 100, 20)
        .fillAndStroke("#4F46E5", "#4F46E5");
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

        doc.rect(leftX, doc.y, pageWidth - 100, tripHeight).stroke("#CCCCCC");

        doc.fontSize(10).font("Helvetica-Bold").fillColor("#4F46E5");
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
      doc.fontSize(11).font("Helvetica-Bold").fillColor("#4F46E5");
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
    doc
      .rect(leftX, doc.y, pageWidth - 100, 30)
      .fillAndStroke("#E0E7FF", "#CCCCCC");
    doc.fontSize(9).font("Helvetica-Oblique").fillColor("#000000");
    doc.text(
      "We acknowledge that the attachment has been returned in good condition.",
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

// ─── DN TRIP STATUS FUNCTIONS ─────────────────────────────────────────────────

/**
 * Submit a single Attachment DN trip for approval
 */
const submitAttachmentDNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip can only be submitted from 'Creation' status. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Under Approval" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment DN Trip submitted for approval successfully",
      trip: await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting attachment DN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve a single Attachment DN trip
 */
const approveAttachmentDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to approve. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Approved" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment DN Trip approved successfully",
      trip: await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving attachment DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject a single Attachment DN trip
 */
const rejectAttachmentDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to reject. Current: ${trip.trip_status}`,
      });
    }

    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction },
    );
    await transaction.commit();

    res.status(200).json({
      message: "Attachment DN Trip rejected successfully",
      trip: await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting attachment DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate PDF data for a single Attachment DN trip (Approved → In Progress)
 */
const generateAttachmentDNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        { model: AttachmentDNAttachmentModel, as: "attachment" },
        {
          model: AttachmentDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: AttachmentSwapModel,
              as: "attachmentSwap",
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
                  model: AttachmentModel,
                  as: "newAttachment",
                  attributes: [
                    "attachment_id",
                    "attachment_number",
                    "product_name",
                    "serial_number",
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
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating attachment DN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Complete a single Attachment DN trip (In Progress → Completed)
 */
const completeAttachmentDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'In Progress' to complete. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Completed" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment DN Trip completed successfully",
      trip: await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing attachment DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close a single Attachment DN trip (Completed/Rejected → Close)
 */
const closeAttachmentDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentDeliveryNoteModel, as: "deliveryNote" }],
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
        message: `Only 'Completed' or 'Rejected' trips can be closed. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment DN Trip closed successfully",
      trip: await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentDNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing attachment DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ─── OHN TRIP STATUS FUNCTIONS ────────────────────────────────────────────────

/**
 * Submit a single Attachment OHN trip for approval
 */
const submitAttachmentOHNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip can only be submitted from 'Creation' status. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Under Approval" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment OHN Trip submitted for approval successfully",
      trip: await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting attachment OHN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Approve a single Attachment OHN trip
 */
const approveAttachmentOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to approve. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Approved" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment OHN Trip approved successfully",
      trip: await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving attachment OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Reject a single Attachment OHN trip
 */
const rejectAttachmentOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'Under Approval' to reject. Current: ${trip.trip_status}`,
      });
    }

    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction },
    );
    await transaction.commit();

    res.status(200).json({
      message: "Attachment OHN Trip rejected successfully",
      trip: await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting attachment OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate PDF data for a single Attachment OHN trip (Approved → In Progress)
 */
const generateAttachmentOHNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        { model: AttachmentOHNAttachmentModel, as: "attachment" },
        {
          model: AttachmentOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: AttachmentSwapModel,
              as: "attachmentSwap",
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
                  model: AttachmentModel,
                  as: "previousAttachment",
                  attributes: [
                    "attachment_id",
                    "attachment_number",
                    "product_name",
                    "serial_number",
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
    }

    await transaction.commit();

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating attachment OHN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Complete a single Attachment OHN trip (In Progress → Completed)
 */
const completeAttachmentOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "In Progress") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Trip must be 'In Progress' to complete. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Completed" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment OHN Trip completed successfully",
      trip: await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing attachment OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Close a single Attachment OHN trip (Completed/Rejected → Close)
 */
const closeAttachmentOHNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [{ model: AttachmentOffHireNoteModel, as: "offHireNote" }],
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
        message: `Only 'Completed' or 'Rejected' trips can be closed. Current: ${trip.trip_status}`,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Attachment OHN Trip closed successfully",
      trip: await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
        include: [{ model: AttachmentOHNAttachmentModel, as: "attachment" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing attachment OHN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Upload delivery note document to a specific attachment DN trip
 */
const uploadAttachmentDeliveryNoteToTrip = async (req, res) => {
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
    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: AttachmentDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: AttachmentSwapModel,
              as: "attachmentSwap"
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

    // Update attachment swap statuses
    if (trip.deliveryNote && trip.deliveryNote.attachmentSwap) {
      await updateSwapGroupStatuses(
        trip.deliveryNote.attachmentSwap.swap_group_id,
        "DELIVERY",
        "Completed",
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
 * Upload off hire note document to a specific attachment OHN trip
 */
const uploadAttachmentOffHireNoteToTrip = async (req, res) => {
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
    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: AttachmentOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: AttachmentSwapModel,
              as: "attachmentSwap"
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

    // Update attachment swap statuses
    if (trip.offHireNote && trip.offHireNote.attachmentSwap) {
      await updateSwapGroupStatuses(
        trip.offHireNote.attachmentSwap.swap_group_id,
        "OFF_HIRE",
        "Completed",
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
 * Generate delivery note PDF for a specific attachment DN trip
 */
const generateAttachmentDeliveryNotePDFForTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentDeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: AttachmentDNAttachmentModel,
          as: "attachment",
        },
        {
          model: AttachmentDeliveryNoteModel,
          as: "deliveryNote",
          include: [
            {
              model: AttachmentSwapModel,
              as: "attachmentSwap",
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
                  model: AttachmentModel,
                  as: "newAttachment",
                  attributes: [
                    "attachment_id",
                    "attachment_number",
                    "product_name",
                    "serial_number",
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
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error generating attachment DN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Generate off hire note PDF for a specific attachment OHN trip
 */
const generateAttachmentOffHireNotePDFForTrip = async (req, res) => {
  try {
    const { trip_id } = req.params;

    const trip = await AttachmentOffHireNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: AttachmentOHNAttachmentModel,
          as: "attachment",
        },
        {
          model: AttachmentOffHireNoteModel,
          as: "offHireNote",
          include: [
            {
              model: AttachmentSwapModel,
              as: "attachmentSwap",
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
                  model: AttachmentModel,
                  as: "previousAttachment",
                  attributes: [
                    "attachment_id",
                    "attachment_number",
                    "product_name",
                    "serial_number",
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
    }

    res.status(200).json({
      success: true,
      data: trip,
    });
  } catch (error) {
    console.error("Error generating attachment OHN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXPORTS ====================

module.exports = {
  // Attachment Numbers
  getAllAttachmentNumbers,
  getAttachmentSwapReasons,

  // Swap Creation & Retrieval
  createAttachmentSwap,
  getAttachmentSwapsBySalesOrder,
  getAttachmentSwapById,

  // Delivery Note Functions
  createAttachmentDeliveryNote,
  getAttachmentDeliveryNoteById,
  getLatestAttachmentDeliveryNote,
  getAttachmentDeliveryNoteSummary,
  submitAttachmentDNForApproval,
  approveAttachmentDeliveryNote,
  rejectAttachmentDeliveryNote,
  generateAttachmentDeliveryNotePDF,
  generateAttachmentDNPDF,
  closeAttachmentDeliveryNote,
  uploadAttachmentDeliveryNote,
  addTripToAttachmentDeliveryNote,
  updateTripInAttachmentDN,
  deleteTripFromAttachmentDN,
  uploadAttachmentDNChecklist,
  downloadAttachmentDNChecklist,

  // Off Hire Note Functions (Enhanced)
  createAttachmentOffHireNote,
  getAttachmentOffHireNoteById,
  getLatestAttachmentOffHireNote,
  getAttachmentOffHireNoteSummary,
  submitAttachmentOHNForApproval,
  approveAttachmentOffHireNote,
  rejectAttachmentOffHireNote,
  generateAttachmentOffHireNotePDF,
  generateAttachmentOHNPDF,
  closeAttachmentOffHireNote,
  uploadAttachmentOffHireNote,
  addTripToAttachmentOffHireNote,
  updateTripInAttachmentOHN,
  deleteTripFromAttachmentOHN,
  uploadAttachmentOHNChecklist,
  downloadAttachmentOHNChecklist,

  // Swap Request Management
  submitAttachmentSwapRequest,
  returnAttachmentSwapRequest,
  approveAttachmentSwap,
  rejectAttachmentSwap,
  getPendingAttachmentSwapRequests,
  getSwapRequestCounts,

  // DN Trip Status
  submitAttachmentDNTripForApproval,
  approveAttachmentDNTrip,
  rejectAttachmentDNTrip,
  generateAttachmentDNTripPDF,
  completeAttachmentDNTrip,
  closeAttachmentDNTrip,
  generateAttachmentDeliveryNotePDFForTrip,
  uploadAttachmentDeliveryNoteToTrip,

  // OHN Trip Status
  submitAttachmentOHNTripForApproval,
  approveAttachmentOHNTrip,
  rejectAttachmentOHNTrip,
  generateAttachmentOHNTripPDF,
  completeAttachmentOHNTrip,
  closeAttachmentOHNTrip,
  generateAttachmentOffHireNotePDFForTrip,
  uploadAttachmentOffHireNoteToTrip,
};
