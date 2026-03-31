const OperationalModificationModel = require("../models/OperationalModificationModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const sequelize = require("../../src/config/dbSync");

const createShiftChange = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sales_order_id, allocation_id, new_shift, shift_change_date, shift_change_reason } = req.body;

    // Validate required fields
    if (!sales_order_id || !new_shift || !shift_change_date || !shift_change_reason) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: "Sales order ID, new shift, date, and reason are required" 
      });
    }

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Check if shift is Day and Night or Full
    if (salesOrder.shift === "Day and Night" || salesOrder.shift === "Full") {
      await transaction.rollback();
      return res.status(400).json({ 
        message: "Cannot change shift for Day and Night or Full shift sales orders" 
      });
    }

    // Get logged in user
    let username = "System";
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        username = user.username;
      }
    }

    // Store the previous shift before updating
    const previousShift = salesOrder.shift;

    // Create modification record
    const modification = await OperationalModificationModel.create(
      {
        sales_order_id,
        allocation_id: allocation_id || null,
        modification_type: "shift_change",
        previous_shift: previousShift,
        new_shift,
        shift_change_date,
        shift_change_reason,
        created_by: username,
        status: "Active",
      },
      { transaction }
    );

    await salesOrder.update(
      { shift: new_shift },
      { transaction }
    );

    await transaction.commit();

    res.status(201).json({
      message: "Shift change recorded and sales order updated successfully",
      modification,
      updatedShift: new_shift,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating shift change:", error);
    res.status(500).json({
      message: "Error creating shift change",
      error: error.message,
    });
  }
};

// Get all modifications for a sales order
const getModificationsBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const modifications = await OperationalModificationModel.findAll({
      where: { sales_order_id },
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "shift"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      totalCount: modifications.length,
      modifications,
    });
  } catch (error) {
    console.error("Error fetching modifications:", error);
    res.status(500).json({
      message: "Error fetching modifications",
      error: error.message,
    });
  }
};

// Get shift changes for a sales order
const getShiftChangesBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const shiftChanges = await OperationalModificationModel.findAll({
      where: { 
        sales_order_id,
        modification_type: "shift_change"
      },
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "shift"],
        },
      ],
      order: [["shift_change_date", "DESC"]],
    });

    res.status(200).json({
      totalCount: shiftChanges.length,
      shiftChanges,
    });
  } catch (error) {
    console.error("Error fetching shift changes:", error);
    res.status(500).json({
      message: "Error fetching shift changes",
      error: error.message,
    });
  }
};

// Delete modification - UPDATED to revert shift change
const deleteModification = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const modification = await OperationalModificationModel.findByPk(id, {
      transaction
    });

    if (!modification) {
      await transaction.rollback();
      return res.status(404).json({ message: "Modification not found" });
    }

    if (modification.modification_type === "shift_change") {
      const salesOrder = await SalesOrdersModel.findByPk(
        modification.sales_order_id,
        { transaction }
      );

      if (salesOrder) {
        // Revert to the previous shift
        await salesOrder.update(
          { shift: modification.previous_shift },
          { transaction }
        );
      }
    }

    await modification.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Modification deleted and shift reverted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting modification:", error);
    res.status(500).json({
      message: "Error deleting modification",
      error: error.message,
    });
  }
};

module.exports = {
  createShiftChange,
  getModificationsBySalesOrder,
  getShiftChangesBySalesOrder,
  deleteModification,
};