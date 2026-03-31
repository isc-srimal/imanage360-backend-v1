const {
  ActiveAllocationModel,
  AllocationEquipmentModel,
  AllocationManpowerModel,
  AllocationAttachmentModel,
  AllocationBackupEquipmentModel,
  AllocationBackupManpowerModel,
  AllocationRemarksHistoryModel,
} = require("../models/ActiveAllocationsOriginalModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const EquipmentModel = require("../models/EquipmentModel");
const ManpowerModel = require("../models/ManpowerModel");
const EmployeeModel = require("../../../hr-service/src/models/employees/EmployeeModel");
const DailyScheduleModel = require("../models/DailyScheduleModel");
const AttachmentModel = require("../models/AttachmentModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const JobLocationModel = require("../models/JobLocationModel");
const ServiceOptionsModel = require("../models/ServiceOptionsModel");
const EquipmentRentalServiceModel = require("../models/EquipmentRentalServiceModel");
const EquipmentScheduledModel = require("../models/EquipmentScheduledModel");
const ManpowerScheduledModel = require("../models/ManpowerScheduledModel");
const AttachmentScheduledModel = require("../models/AttachmentScheduledModel");
const SubProductAttachmentScheduledModel = require("../models/SubProductAttachmentScheduledModel");
const SalesOrderRecoveryModel = require("../models/SalesOrderRecoveryModel");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const AssignedOperatorsModel = require("../models/AssignedOperatorsModel");
const OperatorTypeModel = require("../models/OperatorTypeModel");

const createActiveAllocation = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      allocation_id,
      allocation_date,
      equipment,
      manpower,
      attachments,
      assigned_operators = [],
      bypassValidation = false,
    } = req.body;

    // Validate allocation exists
    const allocations = await ActiveAllocationModel.findByPk(allocation_id);
    if (!allocations) {
      await transaction.rollback();
      return res.status(404).json({ message: "Allocation not found" });
    }

    let conflicts = [];

    if (equipment && equipment.length > 0) {
      for (const equip of equipment) {
        const existingEquipmentAllocation =
          await AllocationEquipmentModel.findOne({
            include: [
              {
                model: ActiveAllocationModel,
                as: "allocation",
                where: {
                  allocation_date: allocation_date,
                  status: "Active",
                  allocation_id: { [Op.ne]: allocation_id },
                },
              },
            ],
            where: {
              serial_number: equip.serial_number,
            },
            transaction,
          });

        if (
          existingEquipmentAllocation &&
          existingEquipmentAllocation.allocation
        ) {
          const conflictAllocation = existingEquipmentAllocation.allocation;
          const conflictSalesOrder = await SalesOrdersModel.findByPk(
            conflictAllocation.sales_order_id
          );
          conflicts.push({
            type: "equipment",
            serial_number: equip.serial_number,
            existing_client: conflictSalesOrder?.client || "Unknown Client",
            so_number: conflictSalesOrder?.so_number || "Unknown SO",
          });
        }
      }
    }

    if (manpower && manpower.length > 0) {
      for (const mp of manpower) {
        const existingManpowerAllocation =
          await AllocationManpowerModel.findOne({
            include: [
              {
                model: ActiveAllocationModel,
                as: "allocation",
                where: {
                  allocation_date: allocation_date,
                  status: "Active",
                  allocation_id: { [Op.ne]: allocation_id },
                },
              },
              {
                model: EmployeeModel,
                as: "employee",
                include: [
                  {
                    model: ManpowerModel,
                    as: "manpowerDetails",
                    include: [
                      {
                        model: OperatorTypeModel, 
                        as: "operator_type",
                      },
                    ],
                  },
                ],
              },
            ],
            where: {
              employee_id: mp.employee_id,
            },
            transaction,
          });

        if (
          existingManpowerAllocation &&
          existingManpowerAllocation.allocation
        ) {
          const allocation = existingManpowerAllocation.allocation;
          const conflictSalesOrder = await SalesOrdersModel.findByPk(
            allocation.sales_order_id
          );
          conflicts.push({
            type: "manpower",
            employee_id: mp.employee_id,
            operator_type:
              existingManpowerAllocation.employee?.manpowerDetails
                ?.operator_type?.operator_type || "N/A",
            existing_client: conflictSalesOrder?.client || "Unknown Client",
            so_number: conflictSalesOrder?.so_number || "Unknown SO",
          });
        }
      }
    }

    if (attachments && attachments.length > 0) {
      for (const attach of attachments) {
        const existingAttachmentAllocation =
          await AllocationAttachmentModel.findOne({
            include: [
              {
                model: ActiveAllocationModel,
                as: "allocation",
                where: {
                  allocation_date: allocation_date,
                  status: "Active",
                  allocation_id: { [Op.ne]: allocation_id },
                },
              },
            ],
            where: {
              attachment_id: attach.attachment_id,
            },
            transaction,
          });

        if (
          existingAttachmentAllocation &&
          existingAttachmentAllocation.allocation
        ) {
          const allocation = existingAttachmentAllocation.allocation;
          const conflictSalesOrder = await SalesOrdersModel.findByPk(
            allocation.sales_order_id
          );
          conflicts.push({
            type: "attachment",
            attachment_id: attach.attachment_id,
            existing_client: conflictSalesOrder?.client || "Unknown Client",
            so_number: conflictSalesOrder?.so_number || "Unknown SO",
          });
        }
      }
    }

    if (conflicts.length > 0 && !bypassValidation) {
      await transaction.rollback();
      return res.status(400).json({
        warning: true,
        message:
          "Same date already assigned to another client. Do you really want to still schedule this?",
        conflicts: conflicts,
      });
    }

    await ActiveAllocationModel.update(
      { allocation_date: allocation_date },
      { where: { allocation_id }, transaction }
    );

    if (equipment && equipment.length > 0) {
      for (const equip of equipment) {
        await AllocationEquipmentModel.update(
          {
            status: JSON.stringify(equip.status),
            note: equip.note || null,
          },
          {
            where: {
              allocation_id,
              serial_number: equip.serial_number,
            },
            transaction,
          }
        );
      }
    }

    if (manpower && manpower.length > 0) {
      for (const mp of manpower) {
        await AllocationManpowerModel.update(
          {
            status: JSON.stringify(mp.status),
            note: mp.note || null,
          },
          {
            where: {
              allocation_id,
              employee_id: mp.employee_id,
            },
            transaction,
          }
        );
      }
    }

    if (attachments && attachments.length > 0) {
      for (const attach of attachments) {
        await AllocationAttachmentModel.update(
          {
            status: JSON.stringify(attach.status),
            note: attach.note || null,
          },
          {
            where: {
              allocation_id,
              attachment_id: attach.attachment_id,
            },
            transaction,
          }
        );
      }
    }

    if (assigned_operators && assigned_operators.length > 0) {
      await AssignedOperatorsModel.destroy({
        where: { allocation_id },
        transaction,
      });

      for (const assignedOp of assigned_operators) {
        if (
          assignedOp.full_shift_operator ||
          assignedOp.day_shift_operator ||
          assignedOp.night_shift_operator ||
          assignedOp.reliever_operator
        ) {
          await AssignedOperatorsModel.create(
            {
              allocation_id,
              equipment_serial_number: assignedOp.equipment_serial_number,
              full_shift_operator: assignedOp.full_shift_operator || null,
              day_shift_operator: assignedOp.day_shift_operator || null,
              night_shift_operator: assignedOp.night_shift_operator || null,
              reliever_operator: assignedOp.reliever_operator || null,
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Allocation updated successfully with assigned operators",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating allocation:", error);
    res.status(500).json({ error: error.message });
  }
};



const getAssignedOperators = async (req, res) => {
  try {
    const { allocation_id } = req.params;

    const assignedOperators = await AssignedOperatorsModel.findAll({
      where: { allocation_id },
      include: [
        {
          model: EquipmentModel,
          as: "equipment",
          attributes: ["serial_number", "reg_number", "vehicle_type"],
        },
      ],
    });

    res.status(200).json({
      assignedOperators,
    });
  } catch (error) {
    console.error("Error fetching assigned operators:", error);
    res.status(500).json({
      message: "Error fetching assigned operators",
      error: error.message,
    });
  }
};

const getAllActiveAllocations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalAllocations, rows: allocations } =
      await ActiveAllocationModel.findAndCountAll({
        include: [
          {
            model: SalesOrdersModel,
            as: "salesOrder",
          },
          {
            model: AllocationEquipmentModel,
            as: "equipmentAllocations",
            include: [{ model: EquipmentModel, as: "equipment" }],
          },
          {
            model: AllocationManpowerModel,
            as: "manpowerAllocations",
            include: [{ model: EmployeeModel, as: "employee" }],
          },
          {
            model: AllocationAttachmentModel,
            as: "attachmentAllocations",
            include: [{ model: AttachmentModel, as: "attachment" }],
          },
          {
            model: AssignedOperatorsModel,
            as: "assignedOperators",
            include: [
              {
                model: EquipmentModel,
                as: "equipment",
                attributes: ["serial_number", "reg_number", "vehicle_type"],
              },
            ],
          },
        ],
        offset,
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
      });

    res.status(200).json({
      totalAllocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAllocations / limit),
      allocations,
    });
  } catch (error) {
    console.error("Error retrieving active allocations:", error);
    res.status(500).json({
      message: "Error retrieving active allocations",
      error: error.message,
    });
  }
};

const getActiveAllocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const allocation = await ActiveAllocationModel.findByPk(id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
        },
        {
          model: AllocationEquipmentModel,
          as: "equipmentAllocations",
          include: [{ model: EquipmentModel, as: "equipment" }],
        },
        {
          model: AllocationManpowerModel,
          as: "manpowerAllocations",
          include: [{ model: EmployeeModel, as: "employee" }],
        },
        {
          model: AllocationAttachmentModel,
          as: "attachmentAllocations",
          include: [{ model: AttachmentModel, as: "attachment" }],
        },
      ],
    });

    if (!allocation) {
      return res.status(404).json({ message: "Active allocation not found" });
    }

    res.status(200).json(allocation);
  } catch (error) {
    console.error("Error retrieving active allocation:", error);
    res.status(500).json({
      message: "Error retrieving active allocation",
      error: error.message,
    });
  }
};

const getTodayActiveAllocations = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    // Get today's date in YYYY-MM-DD format (local timezone)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    console.log("Fetching allocations for date:", todayStr);

    const { count: totalAllocations, rows: allocations } =
      await ActiveAllocationModel.findAndCountAll({
        where: {
          allocation_date: todayStr,
          status: "Active",
        },
        include: [
          {
            model: SalesOrdersModel,
            as: "salesOrder",
          },
          {
            model: AllocationEquipmentModel,
            as: "equipmentAllocations",
            include: [{ model: EquipmentModel, as: "equipment" }],
          },
          {
            model: AllocationManpowerModel,
            as: "manpowerAllocations",
            include: [{ model: EmployeeModel, as: "employee" }],
          },
          {
            model: AllocationAttachmentModel,
            as: "attachmentAllocations",
            include: [{ model: AttachmentModel, as: "attachment" }],
          },
        ],
        offset,
        limit: parseInt(limit),
        order: [["createdAt", "DESC"]],
      });

    res.status(200).json({
      totalAllocations,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalAllocations / limit),
      allocations,
      date: todayStr,
    });
  } catch (error) {
    console.error("Error retrieving today's active allocations:", error);
    res.status(500).json({
      message: "Error retrieving today's active allocations",
      error: error.message,
    });
  }
};

const updateResourceStatusAfterAllocation = async (
  equipmentIds,
  manpowerIds,
  attachmentIds,
  transaction
) => {
  try {
    // Update equipment status to "allocated" in main EquipmentModel
    if (equipmentIds && equipmentIds.length > 0) {
      await EquipmentModel.update(
        {
          equipment_status: "allocated",
          equipment_status_note: "Allocated to active allocation",
        },
        {
          where: {
            serial_number: {
              [Op.in]: equipmentIds,
            },
          },
          transaction,
        }
      );
    }

    // Update manpower status to "allocated" in main ManpowerModel
    if (manpowerIds && manpowerIds.length > 0) {
      await ManpowerModel.update(
        {
          manpower_status: "allocated",
          manpower_status_note: "Allocated to active allocation",
        },
        {
          where: {
            employeeId: {
              [Op.in]: manpowerIds,
            },
          },
          transaction,
        }
      );
    }

    // Update attachment status to "allocated" in main AttachmentModel
    if (attachmentIds && attachmentIds.length > 0) {
      await AttachmentModel.update(
        {
          attachment_status: "allocated",
          attachment_status_note: "Allocated to active allocation",
        },
        {
          where: {
            attachment_id: {
              [Op.in]: attachmentIds,
            },
          },
          transaction,
        }
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating resource status:", error);
    throw error;
  }
};

// Add endpoint to check resource availability
const checkResourceAvailability = async (req, res) => {
  try {
    const { date, equipment, manpower } = req.body;
    const conflicts = [];

    // Check equipment conflicts
    if (equipment && equipment.length > 0) {
      for (const serialNumber of equipment) {
        const existingAllocation = await AllocationEquipmentModel.findOne({
          include: [
            {
              model: ActiveAllocationModel,
              as: "allocation",
              where: {
                allocation_date: date,
                status: "Active",
              },
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: ["so_number", "client"],
                },
              ],
            },
          ],
          where: { serial_number: serialNumber },
        });

        if (existingAllocation) {
          const equipment = await EquipmentModel.findByPk(serialNumber);
          conflicts.push({
            type: "Equipment",
            identifier: equipment?.reg_number || serialNumber,
            salesOrderNumber:
              existingAllocation.allocation.salesOrder.so_number,
            client: existingAllocation.allocation.salesOrder.client,
            status: equipment?.equipment_status || "Unknown",
          });
        }
      }
    }

    // Check manpower conflicts
    if (manpower && manpower.length > 0) {
      for (const employeeId of manpower) {
        const existingAllocation = await AllocationManpowerModel.findOne({
          include: [
            {
              model: ActiveAllocationModel,
              as: "allocation",
              where: {
                allocation_date: date,
                status: "Active",
              },
              include: [
                {
                  model: SalesOrdersModel,
                  as: "salesOrder",
                  attributes: ["so_number", "client"],
                },
              ],
            },
          ],
          where: { employee_id: employeeId },
        });

        if (existingAllocation) {
          const employee = await EmployeeModel.findByPk(employeeId);
          conflicts.push({
            type: "Employee",
            identifier:
              employee?.personalDetails?.fullNameEnglish || employeeId,
            salesOrderNumber:
              existingAllocation.allocation.salesOrder.so_number,
            client: existingAllocation.allocation.salesOrder.client,
            status: "Assigned",
          });
        }
      }
    }

    res.status(200).json({ conflicts });
  } catch (error) {
    console.error("Error checking resource availability:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSalesOrdersForAllocation = async (req, res) => {
  try {
    const { page = 1, limit = 10, searchTerm = "" } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const whereClause = {
      so_status: {
        [Op.in]: [
          "Approved",
          "Revision Rejected",
          "Revision Under Approval"
        ],
      },
    };

    if (searchTerm && searchTerm.trim() !== "") {
      whereClause[Op.or] = [
        { so_number: { [Op.like]: `%${searchTerm}%` } },
        { client: { [Op.like]: `%${searchTerm}%` } },
        { lpo_number: { [Op.like]: `%${searchTerm}%` } },
      ];
    }

    const { count, rows } = await SalesOrdersModel.findAndCountAll({
      where: whereClause,
      attributes: {
        exclude: [
          "unit_rate",
          "day_unit_rate",
          "night_unit_rate",
          "mobilization_unit_rate",
          "demobilization_unit_rate",
          "other_charges_unit_rate",
          "ot_rate_qar",
          "supportAttachment",
          "lpoEndDateSupportAttachment",
        ],
      },
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
      ],
      offset,
      limit: parseInt(limit),
    });

    res.status(200).json({
      totalOrders: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      salesOrders: rows,
    });
  } catch (error) {
    console.error("Error retrieving sales orders for allocation:", error);
    res.status(500).json({
      message: "Error retrieving sales orders",
      error: error.message,
    });
  }
};

const getSalesOrderForAllocation = async (req, res) => {
  try {
    const { id } = req.params;

    const salesOrder = await SalesOrdersModel.findByPk(id, {
      attributes: {
        exclude: [
          "unit_rate",
          "day_unit_rate",
          "night_unit_rate",
          "mobilization_unit_rate",
          "demobilization_unit_rate",
          "other_charges_unit_rate",
          "ot_rate_qar",
          "supportAttachment",
          "lpoEndDateSupportAttachment",
        ],
      },
      include: [
        { model: JobLocationModel, as: "jobLocation" },
        { model: EmployeeModel, as: "employee" },
        { model: ServiceOptionsModel, as: "serviceOptions" },
        { model: EquipmentRentalServiceModel, as: "rentalService" },
      ],
    });

    if (!salesOrder) {
      return res.status(404).json({ message: "Sales order not found" });
    }

    res.status(200).json(salesOrder);
  } catch (error) {
    console.error("Error retrieving sales order:", error);
    res.status(500).json({
      message: "Error retrieving sales order",
      error: error.message,
    });
  }
};

const updateSalesOrderStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sales_order_id, new_status } = req.body;

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Update sales order status
    await SalesOrdersModel.updateOrderStatus(
      sales_order_id,
      new_status,
      transaction
    );

    await transaction.commit();

    res.status(200).json({
      message: `Sales order status updated to ${new_status} successfully`,
      soStatus: new_status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating sales order status:", error);
    res.status(500).json({ error: error.message });
  }
};

const getRemarksHistory = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const remarks = await AllocationRemarksHistoryModel.findAll({
      where: { sales_order_id },
      order: [["createdAt", "DESC"]],
      attributes: ["remark_id", "remark_text", "created_by", "createdAt"],
    });

    res.status(200).json({
      totalRemarks: remarks.length,
      remarks,
    });
  } catch (error) {
    console.error("Error retrieving remarks history:", error);
    res.status(500).json({
      message: "Error retrieving remarks history",
      error: error.message,
    });
  }
};

// Helper function to check for date conflicts
const checkScheduleDateConflicts = async (scheduledData, transaction) => {
  const conflicts = {
    equipment: [],
    manpower: [],
    attachment: [],
    subProduct: [],
    backupEquipment: [],
    backupManpower: [],
  };

  // Check equipment conflicts
  if (
    scheduledData.equipment_schedules &&
    scheduledData.equipment_schedules.length > 0
  ) {
    for (const schedule of scheduledData.equipment_schedules) {
      const existing = await EquipmentScheduledModel.findOne({
        where: {
          equipment_id: schedule.equipment_id,
          scheduled_date: schedule.scheduled_date,
          so_id: { [Op.ne]: scheduledData.sales_order_id },
        },
        include: [
          {
            model: SalesOrdersModel,
            as: "sales_order",
            attributes: ["so_number", "client"],
          },
        ],
        transaction,
      });

      if (existing) {
        conflicts.equipment.push({
          equipment_id: schedule.equipment_id,
          scheduled_date: schedule.scheduled_date,
          existing_so: existing.sales_order.so_number,
          existing_client: existing.sales_order.client,
        });
      }
    }
  }

  // Check manpower conflicts
  if (
    scheduledData.manpower_schedules &&
    scheduledData.manpower_schedules.length > 0
  ) {
    for (const schedule of scheduledData.manpower_schedules) {
      const existing = await ManpowerScheduledModel.findOne({
        where: {
          manpower_id: schedule.manpower_id,
          scheduled_date: schedule.scheduled_date,
          so_id: { [Op.ne]: scheduledData.sales_order_id },
        },
        include: [
          {
            model: SalesOrdersModel,
            as: "sales_order",
            attributes: ["so_number", "client"],
          },
        ],
        transaction,
      });

      if (existing) {
        conflicts.manpower.push({
          manpower_id: schedule.manpower_id,
          scheduled_date: schedule.scheduled_date,
          existing_so: existing.sales_order.so_number,
          existing_client: existing.sales_order.client,
        });
      }
    }
  }

  // Check attachment conflicts
  if (
    scheduledData.attachment_schedules &&
    scheduledData.attachment_schedules.length > 0
  ) {
    for (const schedule of scheduledData.attachment_schedules) {
      const existing = await AttachmentScheduledModel.findOne({
        where: {
          attachment_id: schedule.attachment_id,
          scheduled_date: schedule.scheduled_date,
          so_id: { [Op.ne]: scheduledData.sales_order_id },
        },
        include: [
          {
            model: SalesOrdersModel,
            as: "sales_order",
            attributes: ["so_number", "client"],
          },
        ],
        transaction,
      });

      if (existing) {
        conflicts.attachment.push({
          attachment_id: schedule.attachment_id,
          scheduled_date: schedule.scheduled_date,
          existing_so: existing.sales_order.so_number,
          existing_client: existing.sales_order.client,
        });
      }
    }
  }

  // Check sub product conflicts
  if (
    scheduledData.sub_product_schedules &&
    scheduledData.sub_product_schedules.length > 0
  ) {
    for (const schedule of scheduledData.sub_product_schedules) {
      const existing = await SubProductAttachmentScheduledModel.findOne({
        where: {
          product_id: schedule.product_id,
          scheduled_date: schedule.scheduled_date,
          so_id: { [Op.ne]: scheduledData.sales_order_id },
        },
        include: [
          {
            model: SalesOrdersModel,
            as: "sales_order",
            attributes: ["so_number", "client"],
          },
        ],
        transaction,
      });

      if (existing) {
        conflicts.subProduct.push({
          product_id: schedule.product_id,
          scheduled_date: schedule.scheduled_date,
          existing_so: existing.sales_order.so_number,
          existing_client: existing.sales_order.client,
        });
      }
    }
  }

  // Check backup equipment conflicts
  if (
    scheduledData.backup_equipment_schedules &&
    scheduledData.backup_equipment_schedules.length > 0
  ) {
    for (const schedule of scheduledData.backup_equipment_schedules) {
      const existing = await EquipmentScheduledModel.findOne({
        where: {
          equipment_id: schedule.equipment_id,
          scheduled_date: schedule.scheduled_date,
          so_id: { [Op.ne]: scheduledData.sales_order_id },
        },
        include: [
          {
            model: SalesOrdersModel,
            as: "sales_order",
            attributes: ["so_number", "client"],
          },
        ],
        transaction,
      });

      if (existing) {
        conflicts.backupEquipment.push({
          equipment_id: schedule.equipment_id,
          scheduled_date: schedule.scheduled_date,
          existing_so: existing.sales_order.so_number,
          existing_client: existing.sales_order.client,
        });
      }
    }
  }

  // Check backup manpower conflicts
  if (
    scheduledData.backup_manpower_schedules &&
    scheduledData.backup_manpower_schedules.length > 0
  ) {
    for (const schedule of scheduledData.backup_manpower_schedules) {
      const existing = await ManpowerScheduledModel.findOne({
        where: {
          manpower_id: schedule.manpower_id,
          scheduled_date: schedule.scheduled_date,
          so_id: { [Op.ne]: scheduledData.sales_order_id },
        },
        include: [
          {
            model: SalesOrdersModel,
            as: "sales_order",
            attributes: ["so_number", "client"],
          },
        ],
        transaction,
      });

      if (existing) {
        conflicts.backupManpower.push({
          manpower_id: schedule.manpower_id,
          scheduled_date: schedule.scheduled_date,
          existing_so: existing.sales_order.so_number,
          existing_client: existing.sales_order.client,
        });
      }
    }
  }

  return conflicts;
};

// Save scheduled dates when confirming selection
const saveScheduledDates = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      sales_order_id,
      equipment_schedules,
      manpower_schedules,
      attachment_schedules,
      recovery_schedules,
      sub_product_schedules,
      backup_equipment_schedules,
      backup_manpower_schedules,
      bypass_conflict_check = false,
    } = req.body;

    // Check for conflicts
    if (!bypass_conflict_check) {
      const conflicts = await checkScheduleDateConflicts(
        {
          sales_order_id,
          equipment_schedules,
          manpower_schedules,
          attachment_schedules,
          sub_product_schedules,
          backup_equipment_schedules,
          backup_manpower_schedules,
        },
        transaction
      );

      const hasConflicts = Object.values(conflicts).some(
        (arr) => arr.length > 0
      );

      if (hasConflicts) {
        await transaction.rollback();
        return res.status(409).json({
          warning: true,
          message:
            "Same date already assigned to another client. Please provide remarks to proceed.",
          conflicts,
        });
      }
    }

    // Save equipment schedules with remarks
    if (equipment_schedules && equipment_schedules.length > 0) {
      for (const schedule of equipment_schedules) {
        await EquipmentScheduledModel.upsert(
          {
            equipment_id: schedule.equipment_id,
            so_id: sales_order_id,
            scheduled_date: schedule.scheduled_date,
            is_selected:
              schedule.is_selected !== undefined ? schedule.is_selected : true,
            remark: schedule.remark || null,
          },
          {
            transaction,
            conflictFields: ["equipment_id", "so_id"],
          }
        );
      }
    }

    // Save manpower schedules with remarks
    if (manpower_schedules && manpower_schedules.length > 0) {
      for (const schedule of manpower_schedules) {
        await ManpowerScheduledModel.upsert(
          {
            manpower_id: schedule.manpower_id,
            so_id: sales_order_id,
            scheduled_date: schedule.scheduled_date,
            is_selected:
              schedule.is_selected !== undefined ? schedule.is_selected : true,
            remark: schedule.remark || null,
          },
          {
            transaction,
            conflictFields: ["manpower_id", "so_id"],
          }
        );
      }
    }

    // Save attachment schedules with remarks
    if (attachment_schedules && attachment_schedules.length > 0) {
      for (const schedule of attachment_schedules) {
        await AttachmentScheduledModel.upsert(
          {
            attachment_id: schedule.attachment_id,
            so_id: sales_order_id,
            scheduled_date: schedule.scheduled_date,
            is_selected:
              schedule.is_selected !== undefined ? schedule.is_selected : true,
            remark: schedule.remark || null,
          },
          {
            transaction,
            conflictFields: ["attachment_id", "so_id"],
          }
        );
      }
    }

    // Save sub product schedules with remarks
    if (sub_product_schedules && sub_product_schedules.length > 0) {
      for (const schedule of sub_product_schedules) {
        await SubProductAttachmentScheduledModel.upsert(
          {
            product_id: schedule.product_id,
            so_id: sales_order_id,
            scheduled_date: schedule.scheduled_date,
            is_selected:
              schedule.is_selected !== undefined ? schedule.is_selected : true,
            remark: schedule.remark || null,
          },
          {
            transaction,
            conflictFields: ["product_id", "so_id"],
          }
        );
      }
    }

    // Save backup equipment schedules with remarks
    if (backup_equipment_schedules && backup_equipment_schedules.length > 0) {
      for (const schedule of backup_equipment_schedules) {
        await AllocationBackupEquipmentModel.upsert(
          {
            allocation_id: schedule.allocation_id,
            serial_number: schedule.equipment_id,
            scheduled_date: schedule.scheduled_date,
            remark: schedule.remark || null,
          },
          {
            transaction,
            conflictFields: ["allocation_id", "serial_number"],
          }
        );
      }
    }

    // Save backup manpower schedules with remarks
    if (backup_manpower_schedules && backup_manpower_schedules.length > 0) {
      for (const schedule of backup_manpower_schedules) {
        await AllocationBackupManpowerModel.upsert(
          {
            allocation_id: schedule.allocation_id,
            employee_id: schedule.manpower_id,
            scheduled_date: schedule.scheduled_date,
            remark: schedule.remark || null,
          },
          {
            transaction,
            conflictFields: ["allocation_id", "employee_id"],
          }
        );
      }
    }

    // Save recovery schedules
    if (recovery_schedules && recovery_schedules.length > 0) {
      for (const schedule of recovery_schedules) {
        await SalesOrderRecoveryModel.update(
          {
            is_selected:
              schedule.is_selected !== undefined ? schedule.is_selected : true,
          },
          {
            where: { so_recovery_id: schedule.recovery_id },
            transaction,
          }
        );
      }
    }

    await transaction.commit();

    res.status(200).json({
      message: "Scheduled dates saved successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving scheduled dates:", error);
    res.status(500).json({
      message: "Error saving scheduled dates",
      error: error.message,
    });
  }
};

// Get scheduled dates for a sales order
const getScheduledDates = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const equipmentSchedules = await EquipmentScheduledModel.findAll({
      where: { so_id: sales_order_id },
      attributes: ["equipment_id", "scheduled_date", "is_selected"], 
    });

    const manpowerSchedules = await ManpowerScheduledModel.findAll({
      where: { so_id: sales_order_id },
      attributes: ["manpower_id", "scheduled_date", "is_selected"], 
    });

    const attachmentSchedules = await AttachmentScheduledModel.findAll({
      where: { so_id: sales_order_id },
      attributes: ["attachment_id", "scheduled_date", "is_selected"], 
    });
     const productSchedules = await SubProductAttachmentScheduledModel.findAll({
      where: { so_id: sales_order_id },
      attributes: ["product_id", "scheduled_date", "is_selected"], 
    });

    // NEW: Get recovery schedules with is_selected
    const recoverySchedules = await SalesOrderRecoveryModel.findAll({
      where: { so_id: sales_order_id },
      attributes: ["so_recovery_id", "is_selected"],
    });

    res.status(200).json({
      equipment_schedules: equipmentSchedules,
      manpower_schedules: manpowerSchedules,
      attachment_schedules: attachmentSchedules,
      product_schedules: productSchedules,
      recovery_schedules: recoverySchedules,
    });
  } catch (error) {
    console.error("Error fetching scheduled dates:", error);
    res.status(500).json({
      message: "Error fetching scheduled dates",
      error: error.message,
    });
  }
};

const saveAllocationRemarks = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sales_order_id, remark_text } = req.body;

    if (!remark_text || !remark_text.trim()) {
      await transaction.rollback();
      return res.status(400).json({ message: "Remark text is required" });
    }

    // Get sales order to verify it exists
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Get logged in user's username from UsersModel
    let username = "System";

    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        username = user.username;
      }
    }

    // Save remark to history
    const remark = await AllocationRemarksHistoryModel.create(
      {
        sales_order_id: sales_order_id,
        remark_text: remark_text.trim(),
        created_by: username,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Remark saved successfully",
      remark,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving remark:", error);
    res.status(500).json({
      message: "Error saving remark",
      error: error.message,
    });
  }
};

const saveConfirmedSelections = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      sales_order_id,
      service_option,
      allocation_date,
      equipment,
      manpower,
      attachments,
    } = req.body;

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Create active allocation record
    const allocation = await ActiveAllocationModel.create(
      {
        sales_order_id,
        service_option,
        allocation_date:
          allocation_date || new Date().toISOString().split("T")[0],
        status: "Active",
      },
      { transaction }
    );

    // Create equipment allocations with "allocated" status
    const equipmentIds = [];
    if (equipment && equipment.length > 0) {
      for (const equip of equipment) {
        await AllocationEquipmentModel.create(
          {
            allocation_id: allocation.allocation_id,
            serial_number: equip.serial_number,
            status: JSON.stringify([]), // Empty status array initially
            eqt_stu: "allocated",
            note: equip.note || null,
            is_selected:
              equip.is_selected !== undefined ? equip.is_selected : true,
          },
          { transaction }
        );
        equipmentIds.push(equip.serial_number);
      }
    }

    // Create manpower allocations with "allocated" status
    const manpowerIds = [];
    if (manpower && manpower.length > 0) {
      for (const mp of manpower) {
        await AllocationManpowerModel.create(
          {
            allocation_id: allocation.allocation_id,
            employee_id: mp.employee_id,
            status: JSON.stringify([]), // Empty status array initially
            man_stu: "allocated",
            note: mp.note || null,
            is_selected: mp.is_selected !== undefined ? mp.is_selected : true,
          },
          { transaction }
        );
        manpowerIds.push(mp.employee_id);
      }
    }

    // Create attachment allocations with "allocated" status
    const attachmentIds = [];
    if (attachments && attachments.length > 0) {
      for (const attach of attachments) {
        await AllocationAttachmentModel.create(
          {
            allocation_id: allocation.allocation_id,
            attachment_id: attach.attachment_id,
            status: JSON.stringify([]), // Empty status array initially
            att_stu: "allocated",
            note: attach.note || null,
            is_selected:
              attach.is_selected !== undefined ? attach.is_selected : true,
          },
          { transaction }
        );
        attachmentIds.push(attach.attachment_id);
      }
    }

    // Update main resource tables status to "allocated"
    await updateResourceStatusAfterAllocation(
      equipmentIds,
      manpowerIds,
      attachmentIds,
      transaction
    );

    await transaction.commit();

    res.status(201).json({
      message: "Resources confirmed and allocated successfully",
      allocation_id: allocation.allocation_id,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving confirmed selections:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllocationBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const allocation = await ActiveAllocationModel.findOne({
      where: { sales_order_id },
      attributes: ['allocation_id', 'sales_order_id', 'status'],
      include: [
        {
          model: SalesOrdersModel,
          as: 'salesOrder',
          attributes: ['so_number', 'so_status']
        }
      ]
    });

    if (!allocation) {
      return res.status(404).json({
        message: "No allocation found for this sales order",
        exists: false
      });
    }

    res.status(200).json({
      exists: true,
      allocation_id: allocation.allocation_id,
      sales_order_id: allocation.sales_order_id,
      status: allocation.status,
      so_status: allocation.salesOrder?.so_status
    });
  } catch (error) {
    console.error("Error fetching allocation by sales order:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get allocated equipment for a sales order
const getAllocatedEquipmentBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    // Find the active allocation for this sales order
    const allocation = await ActiveAllocationModel.findOne({
      where: {
        sales_order_id,
        status: "Active"
      },
      attributes: ['allocation_id']
    });

    if (!allocation) {
      return res.status(404).json({
        message: "No active allocation found for this sales order",
        equipment: []
      });
    }

    // Get all equipment allocations for this allocation
    const equipmentAllocations = await AllocationEquipmentModel.findAll({
      where: { allocation_id: allocation.allocation_id },
      include: [
        {
          model: EquipmentModel,
          as: "equipment",
          attributes: ['serial_number', 'reg_number', 'vehicle_type', 'equipment_status']
        }
      ],
      attributes: ['allocation_id', 'serial_number', 'status', 'note', 'is_selected']
    });

    res.status(200).json({
      equipment: equipmentAllocations
    });
  } catch (error) {
    console.error("Error fetching allocated equipment:", error);
    res.status(500).json({
      message: "Error fetching allocated equipment",
      error: error.message,
    });
  }
};

// Get allocated manpower for a sales order
const getAllocatedManpowerBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    // Find the active allocation for this sales order
    const allocation = await ActiveAllocationModel.findOne({
      where: {
        sales_order_id,
        status: "Active"
      },
      attributes: ['allocation_id']
    });

    if (!allocation) {
      return res.status(404).json({
        message: "No active allocation found for this sales order",
        manpower: []
      });
    }

    // Get all manpower allocations for this allocation
    const manpowerAllocations = await AllocationManpowerModel.findAll({
      where: { allocation_id: allocation.allocation_id },
      include: [
        {
          model: EmployeeModel,
          as: "employee",
          attributes: ['id', 'personalDetails'],
          include: [
            {
              model: ManpowerModel,
              as: "manpower",
              attributes: ['employeeNo', 'manpower_status'],
              include: [
                {
                  model: OperatorTypeModel,
                  as: "operator_type",
                  attributes: ['operator_type']
                }
              ]
            }
          ]
        }
      ],
      attributes: ['allocation_id', 'employee_id', 'status', 'note', 'is_selected']
    });

    res.status(200).json({
      manpower: manpowerAllocations
    });
  } catch (error) {
    console.error("Error fetching allocated manpower:", error);
    res.status(500).json({
      message: "Error fetching allocated manpower",
      error: error.message,
    });
  }
};

// Get allocated attachments for a sales order
const getAllocatedAttachmentsBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    // Find the active allocation for this sales order
    const allocation = await ActiveAllocationModel.findOne({
      where: {
        sales_order_id,
        status: "Active"
      },
      attributes: ['allocation_id']
    });

    if (!allocation) {
      return res.status(404).json({
        message: "No active allocation found for this sales order",
        attachment: []
      });
    }

    // Get all attachment allocations for this allocation
    const attachmentAllocations = await AllocationAttachmentModel.findAll({
      where: { allocation_id: allocation.allocation_id },
      include: [
        {
          model: AttachmentModel,
          as: "attachment",
          attributes: ['attachment_id', 'attachment_number', 'product_name', 'serial_number', 'attachment_status']
        }
      ],
      attributes: ['allocation_id', 'attachment_id', 'status', 'note', 'is_selected']
    });

    res.status(200).json({
      attachment: attachmentAllocations
    });
  } catch (error) {
    console.error("Error fetching allocated attachments:", error);
    res.status(500).json({
      message: "Error fetching allocated attachments",
      error: error.message,
    });
  }
};

// Update OPS status
const updateOpsStatus = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sales_order_id, new_ops_status } = req.body;

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Update sales order ops_status
    await SalesOrdersModel.update(
      { ops_status: new_ops_status },
      {
        where: { id: sales_order_id },
        transaction
      }
    );

    await transaction.commit();

    res.status(200).json({
      message: `Sales order ops_status updated to ${new_ops_status} successfully`,
      ops_status: new_ops_status,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating ops status:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createActiveAllocation,
  getAllActiveAllocations,
  getActiveAllocationById,
  getTodayActiveAllocations,
  checkResourceAvailability,
  updateResourceStatusAfterAllocation,
  getSalesOrdersForAllocation,
  getSalesOrderForAllocation,
  updateSalesOrderStatus,
  getRemarksHistory,
  saveScheduledDates,
  getScheduledDates,
  saveAllocationRemarks,
  saveConfirmedSelections,
  getAllocationBySalesOrder,
  getAssignedOperators,
  getAllocatedEquipmentBySalesOrder,
  getAllocatedManpowerBySalesOrder,
  getAllocatedAttachmentsBySalesOrder,
  updateOpsStatus,
};
