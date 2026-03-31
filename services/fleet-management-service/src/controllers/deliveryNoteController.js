// controllers/fleet-management/deliveryNoteController.js
const {
  DeliveryNoteModel,
  DeliveryNoteTripModel,
  DeliveryNoteEquipmentModel,
  DeliveryNoteManpowerModel,
  DeliveryNoteAttachmentModel,
  DeliveryNoteSubProductModel,
} = require("../models/DeliveryNoteModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const {
  ActiveAllocationModel,
  AllocationEquipmentModel,
  AllocationManpowerModel,
  AllocationAttachmentModel,
} = require("../models/ActiveAllocationsOriginalModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");

// Generate DN Number
const generateDNNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `DN-${currentYear}-`;

  const lastDN = await DeliveryNoteModel.findOne({
    where: {
      dn_number: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["dn_number", "DESC"]],
  });

  let nextNumber = 1;
  if (lastDN) {
    const lastNumber = parseInt(lastDN.dn_number.split("-")[2]);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
};

const recalculateDNStatus = async (dn_id, transaction) => {
  const trips = await DeliveryNoteTripModel.findAll({
    where: { dn_id },
    attributes: ["trip_status"],
    transaction,
  });

  if (!trips.length) return; // No trips — nothing to derive

  const statuses = trips.map((t) => t.trip_status);

  const allRejected = statuses.every((s) => s === "Rejected");
  const allCompleted = statuses.every((s) => s === "Completed");
  const allUnderAppr = statuses.every((s) => s === "Under Approval");
  const anyInProgress = statuses.some((s) => s === "In Progress");
  const anyApproved = statuses.some((s) => s === "Approved");

  let newDNStatus;

  if (allRejected) {
    newDNStatus = "Rejected";
  } else if (allCompleted) {
    newDNStatus = "Completed";
  } else if (anyInProgress) {
    newDNStatus = "In Progress";
  } else if (anyApproved) {
    // At least one approved — could be mixed (some still Under Approval)
    newDNStatus = "Approved";
  } else if (allUnderAppr) {
    newDNStatus = "Under Approval";
  } else {
    newDNStatus = "Creation";
  }

  await DeliveryNoteModel.update(
    { status: newDNStatus },
    { where: { dn_id }, transaction },
  );
};

const createDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sales_order_id, allocation_id, trips, remarks } = req.body;

    const allocation = await ActiveAllocationModel.findByPk(allocation_id, {
      include: [
        {
          model: AllocationEquipmentModel,
          as: "equipmentAllocations",
          where: { is_selected: true },
          required: false,
        },
        {
          model: AllocationManpowerModel,
          as: "manpowerAllocations",
          where: { is_selected: true },
          required: false,
        },
        {
          model: AllocationAttachmentModel,
          as: "attachmentAllocations",
          where: { is_selected: true },
          required: false,
        },
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

    const dn_number = await generateDNNumber();

    let username;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) username = user.username;
    }

    const deliveryNote = await DeliveryNoteModel.create(
      {
        dn_number,
        sales_order_id,
        allocation_id,
        client_name: salesOrder.client,
        project_name: salesOrder.project_name,
        delivery_address: salesOrder.delivery_address,
        status: "Creation",
        remarks,
        created_by: username || "iteq-admin",
      },
      { transaction },
    );

    if (trips && trips.length > 0) {
      for (const trip of trips) {
        const tripRecord = await DeliveryNoteTripModel.create(
          {
            dn_id: deliveryNote.dn_id,
            trip_number: trip.trip_number,
            trip_date: trip.trip_date,
            transportation_company: trip.transportation_company,
            driver_name: trip.driver_name,
            driver_contact: trip.driver_contact,
            vehicle_type: trip.vehicle_type,
            vehicle_number: trip.vehicle_number,
            recovery_vehicle_number: trip.recovery_vehicle_number,
            trip_status: "Creation",
            remarks: trip.remarks,
            prechecklist_id: trip.prechecklist_id || null,
            client_checklist_id: trip.client_checklist_id || null,
            allocated_equipment_serial: trip.allocated_equipment_serial || null,
            chargeable_type: trip.chargeable_type,
          },
          { transaction },
        );

        if (trip.equipment && trip.equipment.length > 0) {
          for (const equip of trip.equipment) {
            await DeliveryNoteEquipmentModel.create(
              {
                dn_id: deliveryNote.dn_id,
                trip_id: tripRecord.trip_id,
                serial_number: equip.serial_number,
                reg_number: equip.reg_number,
                equipment_type: equip.equipment_type,
              },
              { transaction },
            );
          }
        }

        if (trip.manpower && trip.manpower.length > 0) {
          for (const mp of trip.manpower) {
            await DeliveryNoteManpowerModel.create(
              {
                dn_id: deliveryNote.dn_id,
                trip_id: tripRecord.trip_id,
                employee_id: mp.employee_id,
                employee_no: mp.employee_no,
                employee_name: mp.employee_name,
              },
              { transaction },
            );
          }
        }

        if (trip.attachments && trip.attachments.length > 0) {
          for (const attach of trip.attachments) {
            await DeliveryNoteAttachmentModel.create(
              {
                dn_id: deliveryNote.dn_id,
                trip_id: tripRecord.trip_id,
                attachment_id: attach.attachment_id,
                attachment_number: attach.attachment_number,
                attachment_type: attach.attachment_type,
              },
              { transaction },
            );
          }
        }

        if (trip.subProducts && trip.subProducts.length > 0) {
          for (const subProd of trip.subProducts) {
            await DeliveryNoteSubProductModel.create(
              {
                dn_id: deliveryNote.dn_id,
                trip_id: tripRecord.trip_id,
                product_id: subProd.product_id,
                attachment_number: subProd.attachment_number,
                product_name: subProd.product_name,
                unit_price: subProd.unit_price,
                income_account: subProd.income_account,
              },
              { transaction },
            );
          }
        }
      }
    }

    await SalesOrdersModel.update(
      {
        ops_status: "Pending Delivery Note",
        has_delivery_note: true,
      },
      { where: { id: sales_order_id }, transaction },
    );

    await ActiveAllocationModel.update(
      { status: "Delivery Note Created" },
      { where: { allocation_id }, transaction },
    );

    await transaction.commit();

    const createdDeliveryNote = await DeliveryNoteModel.findByPk(
      deliveryNote.dn_id,
      {
        include: [
          {
            model: DeliveryNoteTripModel,
            as: "trips",
            include: [
              { model: DeliveryNoteEquipmentModel, as: "equipment" },
              { model: DeliveryNoteManpowerModel, as: "manpower" },
              { model: DeliveryNoteAttachmentModel, as: "attachments" },
              { model: DeliveryNoteSubProductModel, as: "subProducts" },
            ],
          },
        ],
      },
    );

    res.status(201).json({
      message: "Delivery note created successfully",
      deliveryNote: createdDeliveryNote,
      updatedOrderStatus: "Delivery Note",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to generate trip reference number
const generateTripReferenceNumber = async (dn_number, trip_number) => {
  return `TRIP-${dn_number}-${String(trip_number).padStart(3, "0")}`;
};

// NEW FUNCTION: Get delivery note summary table
const getDeliveryNoteSummary = async (req, res) => {
  try {
    const { dn_id } = req.params;

    const deliveryNote = await DeliveryNoteModel.findByPk(dn_id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: DeliveryNoteTripModel,
          as: "trips",
          include: [
            {
              model: DeliveryNoteEquipmentModel,
              as: "equipment",
              attributes: [
                "id",
                "serial_number",
                "reg_number",
                "equipment_type",
              ],
            },
            {
              model: DeliveryNoteManpowerModel,
              as: "manpower",
              attributes: ["id", "employee_id", "employee_no", "employee_name"],
            },
            {
              model: DeliveryNoteAttachmentModel,
              as: "attachments",
              attributes: [
                "id",
                "attachment_id",
                "attachment_number",
                "attachment_type",
              ],
            },
            {
              model: DeliveryNoteSubProductModel,
              as: "subProducts",
              attributes: [
                "id",
                "product_id",
                "attachment_number",
                "product_name",
                "unit_price",
                "income_account",
              ],
            },
          ],
          order: [["trip_number", "ASC"]],
        },
      ],
    });

    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    const summaryData = {
      dn_number: deliveryNote.dn_number,
      client: deliveryNote.client_name,
      project: deliveryNote.project_name,
      status: deliveryNote.status,
      trips: deliveryNote.trips.map((trip) => ({
        trip_number: trip.trip_number,
        trip_date: trip.trip_date,
        trip_reference_number: trip.trip_reference_number,
        trip_status: trip.trip_status,
        equipment: trip.equipment.map((eq) => ({
          type: "Equipment",
          id: eq.serial_number,
          number: eq.reg_number,
          details: eq.equipment_type,
        })),
        manpower: trip.manpower.map((mp) => ({
          type: "Manpower",
          id: mp.employee_id,
          number: mp.employee_no,
          details: mp.employee_name,
        })),
        attachments: trip.attachments.map((at) => ({
          type: "Attachment",
          id: at.attachment_id,
          number: at.attachment_number,
          details: at.attachment_type,
        })),
        subProducts: trip.subProducts.map((sp) => ({
          type: "SubProduct",
          id: sp.product_id,
          number: sp.attachment_number,
          details: sp.product_name,
        })),
        transportation: {
          company: trip.transportation_company,
          driver: trip.driver_name,
          contact: trip.driver_contact,
          vehicle: trip.vehicle_number,
          recovery_vehicle: trip.recovery_vehicle_number,
        },
      })),
    };

    res.status(200).json({ success: true, summary: summaryData });
  } catch (error) {
    console.error("Error fetching delivery note summary:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW FUNCTION: Add trip to existing delivery note
const addTripToDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { dn_id } = req.params;
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
      manpower,
      attachments,
      subProducts,
      remarks,
    } = req.body;

    const deliveryNote = await DeliveryNoteModel.findByPk(dn_id, {
      transaction,
    });
    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    const existingTrips = await DeliveryNoteTripModel.findAll({
      where: { dn_id },
      transaction,
    });

    const nextTripNumber = existingTrips.length + 1;
    if (nextTripNumber > 7) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Maximum 7 trips allowed per delivery note" });
    }

    const newTrip = await DeliveryNoteTripModel.create(
      {
        dn_id,
        trip_number: nextTripNumber,
        transportation_company,
        trip_date,
        driver_name,
        driver_contact,
        vehicle_type,
        vehicle_number,
        recovery_vehicle_number,
        chargeable_type,
        trip_status: "Creation",
        remarks,
      },
      { transaction },
    );

    if (equipment && equipment.length > 0) {
      for (const equip of equipment) {
        await DeliveryNoteEquipmentModel.create(
          {
            dn_id,
            trip_id: newTrip.trip_id,
            serial_number: equip.serial_number,
            reg_number: equip.reg_number,
            equipment_type: equip.equipment_type,
          },
          { transaction },
        );
      }
    }

    if (manpower && manpower.length > 0) {
      for (const mp of manpower) {
        await DeliveryNoteManpowerModel.create(
          {
            dn_id,
            trip_id: newTrip.trip_id,
            employee_id: mp.employee_id,
            employee_no: mp.employee_no,
            employee_name: mp.employee_name,
          },
          { transaction },
        );
      }
    }

    if (attachments && attachments.length > 0) {
      for (const attach of attachments) {
        await DeliveryNoteAttachmentModel.create(
          {
            dn_id,
            trip_id: newTrip.trip_id,
            attachment_id: attach.attachment_id,
            attachment_number: attach.attachment_number,
            attachment_type: attach.attachment_type,
          },
          { transaction },
        );
      }
    }

    if (subProducts && subProducts.length > 0) {
      for (const sp of subProducts) {
        await DeliveryNoteSubProductModel.create(
          {
            dn_id,
            trip_id: newTrip.trip_id,
            product_id: sp.product_id,
            product_name: sp.product_name,
            attachment_number: sp.attachment_number,
            unit_price: sp.unit_price,
            income_account: sp.income_account,
          },
          { transaction },
        );
      }
    }

    await transaction.commit();

    res.status(201).json({
      message: "Trip added successfully to delivery note",
      trip: await DeliveryNoteTripModel.findByPk(newTrip.trip_id, {
        include: [
          { model: DeliveryNoteEquipmentModel, as: "equipment" },
          { model: DeliveryNoteManpowerModel, as: "manpower" },
          { model: DeliveryNoteAttachmentModel, as: "attachments" },
          { model: DeliveryNoteSubProductModel, as: "subProducts" },
        ],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error adding trip to delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

// const uploadDeliveryNoteAttachment = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { dn_id } = req.params;
//     // Optional: target a single trip
//     const { trip_id } = req.query;
//     // const user = req.user;

//     if (!req.file) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "Delivery attachment file is required",
//       });
//     }

//     const fileName = req.file.filename;
//     const filePath = `/uploads/delivery-notes/${fileName}`;

//     const deliveryNote = await DeliveryNoteModel.findByPk(dn_id, {
//       include: [{ model: SalesOrdersModel, as: "salesOrder" }],
//       transaction,
//     });

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     let username;
//     if (req.user?.uid) {
//       const userRecord = await UsersModel.findByPk(req.user.uid);
//       if (userRecord) username = userRecord.username;
//     }

//     if (trip_id) {
//       // ── Complete a single trip ───────────────────────────────────────────
//       const trip = await DeliveryNoteTripModel.findOne({
//         where: { trip_id, dn_id },
//         transaction,
//       });

//       if (!trip) {
//         await transaction.rollback();
//         return res
//           .status(404)
//           .json({ message: "Trip not found in this delivery note" });
//       }

//       if (trip.trip_status !== "In Progress") {
//         await transaction.rollback();
//         return res.status(400).json({
//           message: `Cannot complete trip — trip must be 'In Progress'`,
//           currentTripStatus: trip.trip_status,
//           tripReference: trip.trip_reference_number,
//         });
//       }

//       await trip.update({ trip_status: "Completed" }, { transaction });

//       // Recalculate DN status (may or may not become Completed)
//       await recalculateDNStatus(dn_id, transaction);

//       // Store attachment on the DN header
//       await deliveryNote.update(
//         {
//           delivery_attachment: fileName,
//           uploaded_by: username || "iteq-admin",
//           uploaded_at: new Date(),
//         },
//         { transaction },
//       );
//     } else {
//       // ── Complete ALL trips and the DN ────────────────────────────────────
//       await DeliveryNoteTripModel.update(
//         { trip_status: "Completed" },
//         { where: { dn_id }, transaction },
//       );

//       await deliveryNote.update(
//         {
//           delivery_attachment: fileName,
//           status: "Completed",
//           uploaded_by: username || "iteq-admin",
//           uploaded_at: new Date(),
//         },
//         { transaction },
//       );
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: trip_id
//         ? "Trip marked as Completed. DN status recalculated."
//         : "All trips and delivery note marked as Completed.",
//       deliveryNote: await DeliveryNoteModel.findByPk(dn_id, {
//         include: [{ model: DeliveryNoteTripModel, as: "trips" }],
//       }),
//       uploadedFile: {
//         filename: req.file.filename,
//         originalname: req.file.originalname,
//         path: filePath,
//       },
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error uploading delivery note attachment:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Get all delivery notes
const getAllDeliveryNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count, rows } = await DeliveryNoteModel.findAndCountAll({
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: DeliveryNoteTripModel,
          as: "trips",
          include: [
            { model: DeliveryNoteEquipmentModel, as: "equipment" },
            { model: DeliveryNoteManpowerModel, as: "manpower" },
            { model: DeliveryNoteAttachmentModel, as: "attachments" },
            { model: DeliveryNoteSubProductModel, as: "subProducts" },
          ],
        },
      ],
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      deliveryNotes: rows,
    });
  } catch (error) {
    console.error("Error fetching delivery notes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Helper function to get system allowed actions
const getSystemAllowedActions = (status) => {
  const actions = {
    Creation: ["Submit for approval", "Save draft", "Delete trip", "Add trip"],
    "Under Approval": [
      "Approve individual trips",
      "Reject individual trips",
      "Reject entire DN",
    ],
    Approved: ["Generate PDF per trip (moves trip to In Progress)"],
    "In Progress": [
      "Upload signed delivery note per trip (moves trip to Completed)",
    ],
    Completed: ["No further actions — delivery confirmed"],
    Rejected: ["No further actions"],
    Close: ["No further actions"],
  };
  return actions[status] || [];
};

const saveDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { trips, remarks } = req.body;

    const deliveryNote = await DeliveryNoteModel.findByPk(id, {
      include: [{ model: DeliveryNoteTripModel, as: "trips" }],
      transaction,
    });

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: "Cannot save — delivery note is not in 'Creation' status",
      });
    }

    await deliveryNote.update({ remarks, status: "Creation" }, { transaction });

    if (trips && trips.length > 0) {
      for (const tripData of trips) {
        const trip = await DeliveryNoteTripModel.findByPk(tripData.trip_id, {
          transaction,
        });
        if (trip) {
          await trip.update(
            {
              transportation_company: tripData.transportation_company,
              trip_date: tripData.trip_date,
              driver_name: tripData.driver_name,
              driver_contact: tripData.driver_contact,
              vehicle_type: tripData.vehicle_type,
              vehicle_number: tripData.vehicle_number,
              recovery_vehicle_number: tripData.recovery_vehicle_number,
              allocated_equipment_serial: tripData.allocated_equipment_serial,
              chargeable_type: tripData.chargeable_type,
              remarks: tripData.remarks,
            },
            { transaction },
          );
        }
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note saved successfully (Status: Creation)",
      deliveryNote: await DeliveryNoteModel.findByPk(id, {
        include: [{ model: DeliveryNoteTripModel, as: "trips" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteTripFromDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
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
          "Cannot delete trip — Delivery note is not in 'Creation' status",
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

// Approve Trip
const approveTripInDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
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

    // Approve this single trip
    await trip.update({ trip_status: "Approved" }, { transaction });

    // Recalculate DN status based on all trip statuses
    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    // Return updated trip + parent DN for UI refresh
    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} approved successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// Reject Trip
const rejectTripInDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
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

    // Reject this single trip (optionally store reason in remarks)
    await trip.update(
      {
        trip_status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : trip.remarks,
      },
      { transaction },
    );

    // Recalculate DN status based on all trip statuses
    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} rejected successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW FUNCTION: Submit for approval (status changes to "Under Approval")
const submitForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot submit trip — trip must be in 'Creation' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    // Update ONLY this trip's status
    await trip.update({ trip_status: "Under Approval" }, { transaction });

    // Recalculate parent DN status based on all trip statuses
    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} submitted for approval successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW FUNCTION: Approve delivery note
const approveDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const deliveryNote = await DeliveryNoteModel.findByPk(id, {
      include: [{ model: DeliveryNoteTripModel, as: "trips" }],
      transaction,
    });

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status === "Approved") {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Delivery note is already approved" });
    }

    if (!["Under Approval", "Approved"].includes(deliveryNote.status)) {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot approve — delivery note must be in 'Under Approval' status`,
        currentStatus: deliveryNote.status,
      });
    }

    // Verify all trips are approved before approving the DN header
    const nonApprovedTrips = deliveryNote.trips.filter(
      (t) => t.trip_status !== "Approved",
    );

    if (nonApprovedTrips.length > 0) {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Cannot approve delivery note — some trips are not yet approved",
        pendingTrips: nonApprovedTrips.map((t) => ({
          trip_id: t.trip_id,
          trip_reference_number: t.trip_reference_number,
          trip_status: t.trip_status,
        })),
      });
    }

    const finalDNNumber = await generateDNNumber();

    let username;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) username = user.username;
    }

    await deliveryNote.update(
      {
        dn_number: finalDNNumber,
        status: "Approved",
        approved_by: username || "Admin",
        approved_at: new Date(),
      },
      { transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note approved successfully",
      dn_number: finalDNNumber,
      deliveryNote: await DeliveryNoteModel.findByPk(id, {
        include: [{ model: DeliveryNoteTripModel, as: "trips" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW FUNCTION: Reject delivery note
const rejectDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { reason } = req.body;

    const deliveryNote = await DeliveryNoteModel.findByPk(id, { transaction });

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (deliveryNote.status !== "Under Approval") {
      await transaction.rollback();
      return res.status(400).json({
        message:
          "Cannot reject — delivery note is not in 'Under Approval' status",
        currentStatus: deliveryNote.status,
      });
    }

    await deliveryNote.update(
      {
        status: "Rejected",
        remarks: reason ? `Rejected: ${reason}` : deliveryNote.remarks,
      },
      { transaction },
    );

    // Bulk reject ALL trips
    await DeliveryNoteTripModel.update(
      { trip_status: "Rejected" },
      { where: { dn_id: id }, transaction },
    );

    await transaction.commit();

    res.status(200).json({
      message: "Delivery note and all associated trips rejected successfully",
      deliveryNote: await DeliveryNoteModel.findByPk(id, {
        include: [{ model: DeliveryNoteTripModel, as: "trips" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadResourceChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id, resource_type, resource_id } = req.params;
    const file = req.file;
    let username;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) username = user.username;
    }
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const validTypes = ["equipment", "manpower", "attachment"];
    if (!validTypes.includes(resource_type))
      return res.status(400).json({ message: "Invalid resource type" });

    const modelMap = {
      equipment: DeliveryNoteEquipmentModel,
      manpower: DeliveryNoteManpowerModel,
      attachment: DeliveryNoteAttachmentModel,
    };
    const Model = modelMap[resource_type];
    const whereCondition = { id: resource_id, trip_id };

    const resource = await Model.findOne({
      where: whereCondition,
      transaction,
    });
    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: `${resource_type} not found in this trip` });
    }

    await Model.update(
      {
        checklist_file_path: file.path,
        checklist_file_name: file.originalname,
        checklist_uploaded_at: new Date(),
        checklist_uploaded_by: username || "iteq-admin",
      },
      { where: whereCondition, transaction },
    );

    await transaction.commit();
    res.status(200).json({
      message: "Checklist uploaded successfully",
      file: { path: file.path, name: file.originalname },
    });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ message: "Failed to upload checklist", error: error.message });
  }
};

const downloadResourceChecklist = async (req, res) => {
  try {
    const { trip_id, resource_type, resource_id } = req.params;
    const validTypes = ["equipment", "manpower", "attachment"];
    if (!validTypes.includes(resource_type))
      return res.status(400).json({ message: "Invalid resource type" });

    const modelMap = {
      equipment: DeliveryNoteEquipmentModel,
      manpower: DeliveryNoteManpowerModel,
      attachment: DeliveryNoteAttachmentModel,
    };
    const Model = modelMap[resource_type];
    const resource = await Model.findOne({
      where: { id: resource_id, trip_id },
    });

    if (!resource)
      return res
        .status(404)
        .json({ message: `${resource_type} not found in this trip` });
    if (!resource.checklist_file_path)
      return res
        .status(404)
        .json({ message: "No checklist found for this resource" });
    if (!fs.existsSync(resource.checklist_file_path))
      return res
        .status(404)
        .json({ message: "Checklist file not found on server" });

    res.download(
      resource.checklist_file_path,
      resource.checklist_file_name,
      (err) => {
        if (err)
          res.status(500).json({ message: "Error downloading checklist file" });
      },
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to download checklist", error: error.message });
  }
};

// Delete checklist for a resource
const deleteResourceChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id, resource_type, resource_id } = req.params;
    const validTypes = ["equipment", "manpower", "attachment"];
    if (!validTypes.includes(resource_type))
      return res.status(400).json({ message: "Invalid resource type" });

    const modelMap = {
      equipment: DeliveryNoteEquipmentModel,
      manpower: DeliveryNoteManpowerModel,
      attachment: DeliveryNoteAttachmentModel,
    };
    const Model = modelMap[resource_type];
    const whereCondition = { id: resource_id, trip_id };
    const resource = await Model.findOne({
      where: whereCondition,
      transaction,
    });

    if (!resource) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: `${resource_type} not found in this trip` });
    }
    if (!resource.checklist_file_path) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ message: "No checklist found for this resource" });
    }

    if (fs.existsSync(resource.checklist_file_path))
      fs.unlinkSync(resource.checklist_file_path);

    await Model.update(
      {
        checklist_file_path: null,
        checklist_file_name: null,
        checklist_uploaded_at: null,
        checklist_uploaded_by: null,
      },
      { where: whereCondition, transaction },
    );

    await transaction.commit();
    res.status(200).json({ message: "Checklist deleted successfully" });
  } catch (error) {
    await transaction.rollback();
    res
      .status(500)
      .json({ message: "Failed to delete checklist", error: error.message });
  }
};

// Get delivery note by ID
const getDeliveryNoteById = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryNote = await DeliveryNoteModel.findByPk(id, {
      include: [
        { model: SalesOrdersModel, as: "salesOrder" },
        {
          model: DeliveryNoteTripModel,
          as: "trips",
          include: [
            { model: DeliveryNoteEquipmentModel, as: "equipment" },
            { model: DeliveryNoteManpowerModel, as: "manpower" },
            { model: DeliveryNoteAttachmentModel, as: "attachments" },
            { model: DeliveryNoteSubProductModel, as: "subProducts" },
          ],
        },
        { model: DeliveryNoteEquipmentModel, as: "equipment" },
        { model: DeliveryNoteManpowerModel, as: "manpower" },
        { model: DeliveryNoteAttachmentModel, as: "attachments" },
        { model: DeliveryNoteSubProductModel, as: "subProducts" },
      ],
    });

    if (!deliveryNote) {
      return res.status(404).json({ message: "Delivery note not found" });
    }

    res.status(200).json({
      ...deliveryNote.toJSON(),
      systemStatusInfo: {
        currentStatus: deliveryNote.status,
        allowedActions: getSystemAllowedActions(deliveryNote.status),
        tripStatuses: deliveryNote.trips?.map((t) => ({
          trip_id: t.trip_id,
          trip_reference_number: t.trip_reference_number,
          trip_status: t.trip_status,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get delivery note by allocation ID
const getDeliveryNoteByAllocation = async (req, res) => {
  try {
    const { allocation_id } = req.params;

    const deliveryNote = await DeliveryNoteModel.findOne({
      where: { allocation_id },
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: [
            "id",
            "so_number",
            "client",
            "so_status",
            "project_name",
          ],
        },
        {
          model: DeliveryNoteTripModel,
          as: "trips",
          include: [
            { model: DeliveryNoteEquipmentModel, as: "equipment" },
            { model: DeliveryNoteManpowerModel, as: "manpower" },
            {
              model: DeliveryNoteAttachmentModel,
              as: "attachments",
              attributes: [
                "id",
                "attachment_id",
                "attachment_number",
                "attachment_type",
                "checklist_file_path",
                "checklist_file_name",
                "checklist_uploaded_at",
                "checklist_uploaded_by",
              ],
            },
            { model: DeliveryNoteSubProductModel, as: "subProducts" },
          ],
        },
      ],
    });

    if (!deliveryNote) {
      return res.status(404).json({
        message: "No delivery note found for this allocation",
        exists: false,
      });
    }

    const allocationAttachments = await AllocationAttachmentModel.findAll({
      where: { allocation_id, is_selected: true },
      attributes: ["attachment_id"],
    });

    const operationalAttachmentIds = allocationAttachments.map(
      (a) => a.attachment_id,
    );

    res.status(200).json({
      ...deliveryNote.toJSON(),
      operational_attachment_ids: operationalAttachmentIds,
      orderStatusInfo: {
        currentOrderStatus: deliveryNote.salesOrder?.so_status,
        orderNumber: deliveryNote.salesOrder?.so_number,
        client: deliveryNote.salesOrder?.client,
      },
    });
  } catch (error) {
    console.error("Error fetching delivery note:", error);
    res.status(500).json({ error: error.message, exists: false });
  }
};

// Confirm delivery note
const confirmDeliveryNote = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const deliveryNote = await DeliveryNoteModel.findByPk(id);
    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }
    await deliveryNote.update({ status: "Confirmed" }, { transaction });
    await transaction.commit();
    res
      .status(200)
      .json({ message: "Delivery note confirmed successfully", deliveryNote });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Generate Delivery Note PDF - status eka "In Progress" wenawa
// const generateDeliveryNotePDF = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { id } = req.params;
//     // Optional: accept trip_id in query to generate for a specific trip
//     const { trip_id } = req.query;

//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       await transaction.rollback();
//       return res.status(401).json({
//         error: "Authentication token is required",
//       });
//     }

//     const deliveryNote = await DeliveryNoteModel.findByPk(id, {
//       include: [
//         { model: SalesOrdersModel, as: "salesOrder" },
//         {
//           model: DeliveryNoteTripModel,
//           as: "trips",
//           include: [
//             { model: DeliveryNoteEquipmentModel, as: "equipment" },
//             { model: DeliveryNoteManpowerModel, as: "manpower" },
//             { model: DeliveryNoteAttachmentModel, as: "attachments" },
//           ],
//         },
//       ],
//       transaction,
//     });

//     if (!deliveryNote) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Delivery note not found" });
//     }

//     if (trip_id) {
//       // ── Per-trip PDF generation ──────────────────────────────────────────
//       const trip = deliveryNote.trips.find(
//         (t) => t.trip_id === parseInt(trip_id),
//       );

//       if (!trip) {
//         await transaction.rollback();
//         return res
//           .status(404)
//           .json({ message: "Trip not found in this delivery note" });
//       }

//       if (trip.trip_status !== "Approved") {
//         await transaction.rollback();
//         return res.status(400).json({
//           message: `Cannot generate PDF — trip must be 'Approved' before going In Progress`,
//           currentTripStatus: trip.trip_status,
//           tripReference: trip.trip_reference_number,
//         });
//       }

//       // Move this specific trip to In Progress
//       await DeliveryNoteTripModel.update(
//         { trip_status: "In Progress" },
//         { where: { trip_id }, transaction },
//       );

//       // Recalculate DN status
//       await recalculateDNStatus(id, transaction);
//     } else {
//       // ── Legacy: move all Approved trips to In Progress ───────────────────
//       await DeliveryNoteTripModel.update(
//         { trip_status: "In Progress" },
//         { where: { dn_id: id, trip_status: "Approved" }, transaction },
//       );

//       await recalculateDNStatus(id, transaction);
//     }

//     await transaction.commit();

//     // Re-fetch with updated statuses
//     const updatedNote = await DeliveryNoteModel.findByPk(id, {
//       include: [
//         { model: SalesOrdersModel, as: "salesOrder" },
//         {
//           model: DeliveryNoteTripModel,
//           as: "trips",
//           include: [
//             { model: DeliveryNoteEquipmentModel, as: "equipment" },
//             { model: DeliveryNoteManpowerModel, as: "manpower" },
//             { model: DeliveryNoteAttachmentModel, as: "attachments" },
//           ],
//         },
//       ],
//     });

//     res.status(200).json({
//       success: true,
//       data: updatedNote,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error generating delivery note PDF:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// Update delivery note status - system defined logic only
const updateDeliveryNoteStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { delivery_attachment } = req.body;

    const deliveryNote = await DeliveryNoteModel.findByPk(id, {
      include: [{ model: SalesOrdersModel, as: "salesOrder" }],
      transaction,
    });

    if (!deliveryNote) {
      await transaction.rollback();
      return res.status(404).json({ message: "Delivery note not found" });
    }

    if (delivery_attachment) {
      await deliveryNote.update(
        { status: "Completed", delivery_attachment },
        { transaction },
      );
      await DeliveryNoteTripModel.update(
        { trip_status: "Completed" },
        { where: { dn_id: id }, transaction },
      );
    } else if (req.body.status === "Rejected") {
      await deliveryNote.update({ status: "Rejected" }, { transaction });
      await DeliveryNoteTripModel.update(
        { trip_status: "Rejected" },
        { where: { dn_id: id }, transaction },
      );
      if (deliveryNote.salesOrder) {
        await SalesOrdersModel.update(
          { so_status: "Closed" },
          { where: { id: deliveryNote.sales_order_id }, transaction },
        );
      }
      await ActiveAllocationModel.update(
        { status: "Rejected" },
        { where: { allocation_id: deliveryNote.allocation_id }, transaction },
      );
    } else {
      await transaction.rollback();
      return res.status(400).json({
        message: "Manual status changes not allowed. Use system-defined flows.",
      });
    }

    await transaction.commit();
    res.status(200).json({
      message: "Status updated",
      deliveryNote: await DeliveryNoteModel.findByPk(id),
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

// Update trip status - system defined only
const updateTripStatus = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const trip = await DeliveryNoteTripModel.findByPk(trip_id, { transaction });
    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }
    await transaction.rollback();
    return res.status(400).json({
      message:
        "Direct trip status changes are not allowed. Use approveTripInDeliveryNote or rejectTripInDeliveryNote endpoints.",
      availableEndpoints: [
        "POST /api/delivery-notes/trips/:trip_id/approve",
        "POST /api/delivery-notes/trips/:trip_id/reject",
      ],
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

const updateDNStatusGeneric = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const dn = await DeliveryNoteModel.findByPk(id);
    if (!dn)
      return res.status(404).json({ message: "Delivery Note not found" });
    await dn.update({ status });
    res.status(200).json({ message: `DN status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTripInDeliveryNote = async (req, res) => {
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
      manpower,
      attachments,
      subProducts,
      remarks,
    } = req.body;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.deliveryNote.status !== "Creation") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot edit trip — Delivery Note is in '${trip.deliveryNote.status}' status. Only 'Creation' status allows edits.`,
      });
    }

    await trip.update(
      {
        transportation_company,
        driver_name,
        driver_contact,
        vehicle_type,
        vehicle_number,
        recovery_vehicle_number,
        chargeable_type,
        trip_date: trip_date || trip.trip_date,
        remarks,
      },
      { transaction },
    );

    if (equipment !== undefined) {
      await DeliveryNoteEquipmentModel.destroy({
        where: { trip_id },
        transaction,
      });
      for (const equip of equipment) {
        await DeliveryNoteEquipmentModel.create(
          {
            dn_id: trip.dn_id,
            trip_id,
            serial_number: equip.serial_number,
            reg_number: equip.reg_number,
            equipment_type: equip.equipment_type,
          },
          { transaction },
        );
      }
    }

    if (manpower !== undefined) {
      await DeliveryNoteManpowerModel.destroy({
        where: { trip_id },
        transaction,
      });
      for (const mp of manpower) {
        await DeliveryNoteManpowerModel.create(
          {
            dn_id: trip.dn_id,
            trip_id,
            employee_id: mp.employee_id,
            employee_no: mp.employee_no,
            employee_name: mp.employee_name,
          },
          { transaction },
        );
      }
    }

    if (attachments !== undefined) {
      await DeliveryNoteAttachmentModel.destroy({
        where: { trip_id },
        transaction,
      });
      for (const attach of attachments) {
        await DeliveryNoteAttachmentModel.create(
          {
            dn_id: trip.dn_id,
            trip_id,
            attachment_id: attach.attachment_id,
            attachment_number: attach.attachment_number,
            attachment_type: attach.attachment_type,
          },
          { transaction },
        );
      }
    }

    if (subProducts !== undefined) {
      await DeliveryNoteSubProductModel.destroy({
        where: { trip_id },
        transaction,
      });
      for (const subProd of subProducts) {
        await DeliveryNoteSubProductModel.create(
          {
            dn_id: trip.dn_id,
            trip_id,
            product_id: subProd.product_id,
            attachment_number: subProd.attachment_number,
            product_name: subProd.product_name,
            unit_price: subProd.unit_price,
            income_account: subProd.income_account,
          },
          { transaction },
        );
      }
    }


    await transaction.commit();

    res.status(200).json({
      message: "Trip updated successfully",
      trip: await DeliveryNoteTripModel.findByPk(trip_id, {
        include: [
          { model: DeliveryNoteEquipmentModel, as: "equipment" },
          { model: DeliveryNoteManpowerModel, as: "manpower" },
          { model: DeliveryNoteAttachmentModel, as: "attachments" },
          { model: DeliveryNoteSubProductModel, as: "subProducts" },
        ],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating trip in delivery note:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── generateDeliveryNotePDF  (Approved → In Progress)  ───────────────────────
// Route: GET /api/delivery-notes/trip/:trip_id/generate-pdf
const generateDeliveryNotePDF = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: "Authentication token is required" });
    }

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: DeliveryNoteModel,
          as: "deliveryNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: DeliveryNoteEquipmentModel, as: "equipment" },
        { model: DeliveryNoteManpowerModel, as: "manpower" },
        { model: DeliveryNoteAttachmentModel, as: "attachments" },
        { model: DeliveryNoteSubProductModel, as: "subProducts" },
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

    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    // Re-fetch with updated statuses
    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: DeliveryNoteModel,
          as: "deliveryNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: DeliveryNoteEquipmentModel, as: "equipment" },
        { model: DeliveryNoteManpowerModel, as: "manpower" },
        { model: DeliveryNoteAttachmentModel, as: "attachments" },
        { model: DeliveryNoteSubProductModel, as: "subProducts" },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Trip ${trip.trip_reference_number} moved to In Progress. PDF data ready.`,
      data: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating delivery note PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── uploadDeliveryNoteAttachment  (In Progress → Completed)  ─────────────────
// Route: POST /api/delivery-notes/trip/:trip_id/upload-attachment
const uploadDeliveryNoteAttachment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { trip_id } = req.params;

    if (!req.file) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Delivery attachment file is required",
      });
    }

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: DeliveryNoteModel,
          as: "deliveryNote",
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

    let username;
    if (req.user?.uid) {
      const userRecord = await UsersModel.findByPk(req.user.uid);
      if (userRecord) username = userRecord.username;
    }

    const fileName = req.file.filename;
    const filePath = `/uploads/delivery-notes/${fileName}`;

    // Mark this specific trip as Completed
    await trip.update({ trip_status: "Completed" }, { transaction });

    // Store attachment on the DN header
    await DeliveryNoteModel.update(
      {
        delivery_attachment: fileName,
        uploaded_by: username || "iteq-admin",
        uploaded_at: new Date(),
      },
      { where: { dn_id: trip.dn_id }, transaction },
    );

    // Recalculate DN status from all trip statuses
    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} marked as Completed. DN status recalculated.`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
      uploadedFile: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: filePath,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error uploading delivery note attachment:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 1. submitDNTripForApproval  (Creation → Under Approval) ──────────────────
const submitDNTripForApproval = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
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

    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} submitted for approval successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting DN trip for approval:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 2. approveDNTrip  (Under Approval → Approved) ────────────────────────────
const approveDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
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

    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} approved successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 3. rejectDNTrip  (Under Approval → Rejected) ─────────────────────────────
const rejectDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;
    const { reason } = req.body;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
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
      { transaction },
    );

    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} rejected successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 4. generateDNTripPDF  (Approved → In Progress) ───────────────────────────
const generateDNTripPDF = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      await transaction.rollback();
      return res
        .status(401)
        .json({ error: "Authentication token is required" });
    }

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: DeliveryNoteModel,
          as: "deliveryNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: DeliveryNoteEquipmentModel, as: "equipment" },
        { model: DeliveryNoteManpowerModel, as: "manpower" },
        { model: DeliveryNoteAttachmentModel, as: "attachments" },
        { model: DeliveryNoteSubProductModel, as: "subProducts" },
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

    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [
        {
          model: DeliveryNoteModel,
          as: "deliveryNote",
          include: [{ model: SalesOrdersModel, as: "salesOrder" }],
        },
        { model: DeliveryNoteEquipmentModel, as: "equipment" },
        { model: DeliveryNoteManpowerModel, as: "manpower" },
        { model: DeliveryNoteAttachmentModel, as: "attachments" },
        { model: DeliveryNoteSubProductModel, as: "subProducts" },
      ],
    });

    res.status(200).json({
      success: true,
      message: `Trip ${trip.trip_reference_number} moved to In Progress. PDF data ready.`,
      data: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error generating DN trip PDF:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 5. completeDNTrip  (In Progress → Completed) ─────────────────────────────
const completeDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    if (!req.file) {
      await transaction.rollback();
      return res
        .status(400)
        .json({
          message: "Delivery attachment file is required to complete a trip",
        });
    }

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
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

    let username;
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) username = user.username;
    }

    const fileName = req.file.filename;
    const filePath = `/uploads/delivery-notes/${fileName}`;

    await trip.update({ trip_status: "Completed" }, { transaction });

    // Store attachment on the DN header
    await DeliveryNoteModel.update(
      {
        delivery_attachment: fileName,
        uploaded_by: username || "iteq-admin",
        uploaded_at: new Date(),
      },
      { where: { dn_id: trip.dn_id }, transaction },
    );

    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} completed successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
      uploadedFile: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        path: filePath,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error completing DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 6. closeDNTrip  (Completed → Close) ──────────────────────────────────────
const closeDNTrip = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { trip_id } = req.params;

    const trip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
      transaction,
    });

    if (!trip) {
      await transaction.rollback();
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.trip_status !== "Completed") {
      await transaction.rollback();
      return res.status(400).json({
        message: `Cannot close trip — trip must be in 'Completed' status`,
        currentTripStatus: trip.trip_status,
        tripReference: trip.trip_reference_number,
      });
    }

    await trip.update({ trip_status: "Close" }, { transaction });

    await recalculateDNStatus(trip.dn_id, transaction);

    await transaction.commit();

    const updatedTrip = await DeliveryNoteTripModel.findByPk(trip_id, {
      include: [{ model: DeliveryNoteModel, as: "deliveryNote" }],
    });

    res.status(200).json({
      message: `Trip ${trip.trip_reference_number} closed successfully`,
      trip: updatedTrip,
      parentDNStatus: updatedTrip.deliveryNote.status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error closing DN trip:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createDeliveryNote,
  getAllDeliveryNotes,
  getDeliveryNoteById,
  getDeliveryNoteByAllocation,
  confirmDeliveryNote,
  generateDeliveryNotePDF,
  updateDeliveryNoteStatus,
  updateTripStatus,
  getDeliveryNoteSummary,
  addTripToDeliveryNote,
  uploadDeliveryNoteAttachment,
  rejectDeliveryNote,
  saveDeliveryNote,
  submitForApproval,
  approveDeliveryNote,
  deleteTripFromDeliveryNote,
  approveTripInDeliveryNote,
  rejectTripInDeliveryNote,
  downloadResourceChecklist,
  deleteResourceChecklist,
  uploadResourceChecklist,
  updateDNStatusGeneric,
  updateTripInDeliveryNote,
  submitDNTripForApproval,
  approveDNTrip,
  rejectDNTrip,
  generateDNTripPDF,
  completeDNTrip,
  closeDNTrip,
};
