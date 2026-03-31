// controllers/fleet-management/offHireNoteSubSalesOrderController.js
const OffHireNoteSubSalesOrderModel = require("../models/OffHireNoteSubSalesOrderModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const {
  ActiveAllocationModel,
  AllocationEquipmentModel,
  AllocationManpowerModel,
  AllocationAttachmentModel,
} = require("../models/ActiveAllocationsOriginalModel");
const sequelize = require("../../src/config/dbSync");

// ── 1. Get all Sales Orders available for Sub SO creation ──────────────────
// Returns SO list so the frontend dropdown can be populated
const getAvailableSalesOrders = async (req, res) => {
  try {
    const salesOrders = await SalesOrdersModel.findAll({
      attributes: ["id", "so_number", "client", "project_name", "delivery_address"],
      order: [["so_number", "ASC"]],
    });

    res.status(200).json({ success: true, salesOrders });
  } catch (error) {
    console.error("Error fetching available sales orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 2. Get resources (equipment / manpower / attachments) for a Sales Order ─
// Used to populate the checkbox tables in the "Create OHN for Another Sub SO" UI
const getResourcesBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id, {
      attributes: ["id", "so_number", "client", "project_name"],
    });

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Fetch the active allocation for this SO (is_selected resources only)
    const allocation = await ActiveAllocationModel.findOne({
      where: { sales_order_id },
      include: [
        {
          model: AllocationEquipmentModel,
          as: "equipmentAllocations",
          where: { is_selected: true },
          required: false,
          attributes: [
            "id",
            "serial_number",
            "reg_number",
            "equipment_type",
            "is_selected",
          ],
        },
        {
          model: AllocationManpowerModel,
          as: "manpowerAllocations",
          where: { is_selected: true },
          required: false,
          attributes: [
            "id",
            "employee_id",
            "employee_no",
            "employee_name",
            "is_selected",
          ],
        },
        {
          model: AllocationAttachmentModel,
          as: "attachmentAllocations",
          where: { is_selected: true },
          required: false,
          attributes: [
            "id",
            "attachment_id",
            "attachment_number",
            "attachment_type",
            "is_selected",
          ],
        },
      ],
    });

    if (!allocation) {
      return res.status(404).json({
        message: "No active allocation found for this sales order",
        salesOrder,
        equipment: [],
        manpower: [],
        attachments: [],
      });
    }

    res.status(200).json({
      success: true,
      salesOrder,
      allocation_id: allocation.allocation_id,
      equipment: allocation.equipmentAllocations || [],
      manpower: allocation.manpowerAllocations || [],
      attachments: allocation.attachmentAllocations || [],
    });
  } catch (error) {
    console.error("Error fetching resources by sales order:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 3. Create a Sub Sales Order with selected resources ─────────────────────
// Saves manpower_id[], attachment_id[], serial_number[] as JSON arrays
const createSubSalesOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      sales_order_id,
      manpower_ids,    // array of employee_id values
      attachment_ids,  // array of attachment_id values
      serial_numbers,  // array of serial_number values (equipment)
    } = req.body;

    if (!sales_order_id) {
      await transaction.rollback();
      return res.status(400).json({ message: "sales_order_id is required" });
    }

    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    const subSO = await OffHireNoteSubSalesOrderModel.create(
      {
        sales_order_id,
        manpower_id: manpower_ids || [],
        attachment_id: attachment_ids || [],
        serial_number: serial_numbers || [],
        status: "Active",
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: "Off Hire Sub Sales Order created successfully",
      subSalesOrder: subSO,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating Off Hire Sub Sales Order:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 4. Get Sub SO by ID ──────────────────────────────────────────────────────
const getSubSalesOrderById = async (req, res) => {
  try {
    const { sub_so_id } = req.params;

    const subSO = await OffHireNoteSubSalesOrderModel.findByPk(sub_so_id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["id", "so_number", "client", "project_name", "delivery_address"],
        },
      ],
    });

    if (!subSO) {
      return res.status(404).json({ message: "Off Hire Sub Sales Order not found" });
    }

    res.status(200).json({ success: true, subSalesOrder: subSO });
  } catch (error) {
    console.error("Error fetching Off Hire Sub Sales Order:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 5. Get all Sub SOs (optionally filter by sales_order_id) ─────────────────
const getAllSubSalesOrders = async (req, res) => {
  try {
    const { sales_order_id } = req.query;

    const whereClause = {};
    if (sales_order_id) whereClause.sales_order_id = sales_order_id;

    const subSOs = await OffHireNoteSubSalesOrderModel.findAll({
      where: whereClause,
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["id", "so_number", "client", "project_name"],
        },
      ],
      order: [["sub_so_id", "DESC"]],
    });

    res.status(200).json({ success: true, subSalesOrders: subSOs });
  } catch (error) {
    console.error("Error fetching Off Hire Sub Sales Orders:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 6. Update Sub SO selected resources ─────────────────────────────────────
const updateSubSalesOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { sub_so_id } = req.params;
    const { manpower_ids, attachment_ids, serial_numbers, status } = req.body;

    const subSO = await OffHireNoteSubSalesOrderModel.findByPk(sub_so_id, {
      transaction,
    });

    if (!subSO) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off Hire Sub Sales Order not found" });
    }

    const updatePayload = {};
    if (manpower_ids !== undefined) updatePayload.manpower_id = manpower_ids;
    if (attachment_ids !== undefined) updatePayload.attachment_id = attachment_ids;
    if (serial_numbers !== undefined) updatePayload.serial_number = serial_numbers;
    if (status !== undefined) updatePayload.status = status;

    await subSO.update(updatePayload, { transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Off Hire Sub Sales Order updated successfully",
      subSalesOrder: await OffHireNoteSubSalesOrderModel.findByPk(sub_so_id, {
        include: [{ model: SalesOrdersModel, as: "salesOrder" }],
      }),
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating Off Hire Sub Sales Order:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 7. Delete Sub SO ─────────────────────────────────────────────────────────
const deleteSubSalesOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { sub_so_id } = req.params;

    const subSO = await OffHireNoteSubSalesOrderModel.findByPk(sub_so_id, {
      transaction,
    });

    if (!subSO) {
      await transaction.rollback();
      return res.status(404).json({ message: "Off Hire Sub Sales Order not found" });
    }

    await subSO.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: "Off Hire Sub Sales Order deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting Off Hire Sub Sales Order:", error);
    res.status(500).json({ error: error.message });
  }
};

// ── 8. Get OHN Trip Summary data for a Sub SO ───────────────────────────────
// Returns the selected resources in the format needed for the OHN Trip Summary Table
const getSubSOTripSummary = async (req, res) => {
  try {
    const { sub_so_id } = req.params;

    const subSO = await OffHireNoteSubSalesOrderModel.findByPk(sub_so_id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["id", "so_number", "client", "project_name", "delivery_address"],
        },
      ],
    });

    if (!subSO) {
      return res.status(404).json({ message: "Off Hire Sub Sales Order not found" });
    }

    // Fetch the allocation for this SO to resolve IDs → full resource details
    const allocation = await ActiveAllocationModel.findOne({
      where: { sales_order_id: subSO.sales_order_id },
      include: [
        { model: AllocationEquipmentModel,  as: "equipmentAllocations",  required: false },
        { model: AllocationManpowerModel,   as: "manpowerAllocations",   required: false },
        { model: AllocationAttachmentModel, as: "attachmentAllocations", required: false },
      ],
    });

    // Resolve saved JSON arrays → full resource objects for the summary table
    const selectedSerialNumbers = subSO.serial_number  || [];
    const selectedManpowerIds   = subSO.manpower_id    || [];
    const selectedAttachmentIds = subSO.attachment_id  || [];

    const equipment = allocation
      ? (allocation.equipmentAllocations || [])
          .filter((e) => selectedSerialNumbers.includes(e.serial_number))
          .map((e) => ({
            type: "Equipment",
            serial_number: e.serial_number,
            reg_number: e.reg_number,
            equipment_type: e.equipment_type,
          }))
      : [];

    const manpower = allocation
      ? (allocation.manpowerAllocations || [])
          .filter((m) => selectedManpowerIds.includes(m.employee_id))
          .map((m) => ({
            type: "Manpower",
            employee_id: m.employee_id,
            employee_no: m.employee_no,
            employee_name: m.employee_name,
          }))
      : [];

    const attachments = allocation
      ? (allocation.attachmentAllocations || [])
          .filter((a) => selectedAttachmentIds.includes(a.attachment_id))
          .map((a) => ({
            type: "Attachment",
            attachment_id: a.attachment_id,
            attachment_number: a.attachment_number,
            attachment_type: a.attachment_type,
          }))
      : [];

    res.status(200).json({
      success: true,
      summary: {
        sub_so_id: subSO.sub_so_id,
        sales_order_id: subSO.sales_order_id,
        so_number: subSO.salesOrder?.so_number,
        client: subSO.salesOrder?.client,
        project_name: subSO.salesOrder?.project_name,
        delivery_address: subSO.salesOrder?.delivery_address,
        status: subSO.status,
        equipment,
        manpower,
        attachments,
        // Raw ID arrays (for re-populating checkboxes on edit)
        selected_serial_numbers: selectedSerialNumbers,
        selected_manpower_ids: selectedManpowerIds,
        selected_attachment_ids: selectedAttachmentIds,
      },
    });
  } catch (error) {
    console.error("Error fetching Off Hire Sub SO trip summary:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAvailableSalesOrders,
  getResourcesBySalesOrder,
  createSubSalesOrder,
  getSubSalesOrderById,
  getAllSubSalesOrders,
  updateSubSalesOrder,
  deleteSubSalesOrder,
  getSubSOTripSummary,
};