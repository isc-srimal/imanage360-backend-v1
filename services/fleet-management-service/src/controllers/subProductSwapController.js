// controllers/fleet-management/subProductSwapController.js
const SubProductSwapModel = require("../models/SubProductSwapModel");
const ProductModel = require("../models/ProductModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const SwapReasonModel = require("../models/swapReasonModel");

const getAllSubProductsByAttachmentId = async (req, res) => {
  try {
    const { attachmentNumber } = req.params; // grab from URL param

    // If attachmentNumber is provided, filter by it
    const whereClause = attachmentNumber
      ? { attachment_number: attachmentNumber }
      : {};

    const subProducts = await SubProductSwapModel.findAll({
      where: whereClause,
      attributes: [
        "product_id",
        "product_name",
        "unit_price",
        "income_account",
        "attachment_number",
      ],
    });

    return res.status(200).json({
      message: "Sub products fetched successfully",
      data: subProducts,
    });
  } catch (error) {
    console.error("Error fetching sub products:", error);
    return res.status(500).json({ message: "Failed to fetch sub products" });
  }
};

// Get all sub products for dropdown
const getAllSubProducts = async (req, res) => {
  try {
    const subProducts = await ProductModel.findAll({
      where: { status: "Active" },
      attributes: ["product_id", "product_name", "product_category"],
      order: [["product_name", "ASC"]],
    });

    res.status(200).json({
      success: true,
      subProducts: subProducts.map((product) => ({
        product_id: product.product_id,
        product_name: product.product_name,
        product_category: product.product_category,
      })),
    });
  } catch (error) {
    console.error("Error fetching sub products:", error);
    res.status(500).json({ error: error.message });
  }
};

const getSubProductSwapReasons = async (req, res) => {
  try {
    const swapReasons = await SwapReasonModel.findAll({
      where: {
        category: "Sub Product",
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
    console.error("Error fetching sub product swap reasons:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create sub product swap
const createSubProductSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      sales_order_id,
      allocation_id,
      previous_sub_product_name,
      new_sub_product_name,
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
      !previous_sub_product_name ||
      !new_sub_product_name ||
      !swap_date ||
      !swap_reason
    ) {
      await transaction.rollback();
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    // Check if new sub product exists
    const newSubProduct = await ProductModel.findOne({
      where: { product_name: new_sub_product_name, status: "Active" },
    });

    if (!newSubProduct) {
      await transaction.rollback();
      return res.status(400).json({
        message: "New sub product does not exist in product table",
      });
    }

    // Get sales order
    const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
    if (!salesOrder) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sales order not found" });
    }

    // Get previous sub product details
    const previousSubProduct = await ProductModel.findOne({
      where: { product_name: previous_sub_product_name },
    });

    if (!previousSubProduct) {
      await transaction.rollback();
      return res.status(404).json({ message: "Previous sub product not found" });
    }

    // Get logged in user
    let username = "System";
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        username = user.username;
      }
    }

    // Create sub product swap record
    const subProductSwap = await SubProductSwapModel.create(
      {
        sales_order_id,
        allocation_id: allocation_id || null,
        previous_sub_product_id: previousSubProduct.product_id,
        previous_sub_product_name,
        new_sub_product_id: newSubProduct.product_id,
        new_sub_product_name,
        swap_date,
        swap_reason,
        swap_estimated_recovery_cost: swap_estimated_recovery_cost || null,
        swap_mobilization_trips: swap_mobilization_trips || null,
        swap_demobilization_trips: swap_demobilization_trips || null,
        swap_remark: swap_remark || null,
        delivery_note_status: "Pending",
        off_hire_note_status: "Pending",
        overall_status: "Created",
        created_by: username,
      },
      { transaction }
    );

    // Update allocation sub product if allocation_id exists
    if (allocation_id) {
      await SalesOrdersModel.update(
        {
          sub_product_id: newSubProduct.product_id,
          updated_at: new Date(),
        },
        {
          where: {
            id: sales_order_id,
          },
          transaction,
        }
      );
    }

    await transaction.commit();

    res.status(201).json({
      message: "Sub Product is Changed",
      subProductSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating sub product swap:", error);
    res.status(500).json({
      message: "Error creating sub product swap",
      error: error.message,
    });
  }
};

// Get all sub product swaps for sales order
const getSubProductSwapsBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const subProductSwaps = await SubProductSwapModel.findAll({
      where: { sales_order_id },
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: ProductModel,
          as: "previousSubProduct",
          attributes: ["product_id", "product_name", "product_category"],
        },
        {
          model: ProductModel,
          as: "newSubProduct",
          attributes: ["product_id", "product_name", "product_category"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      totalCount: subProductSwaps.length,
      subProductSwaps,
    });
  } catch (error) {
    console.error("Error fetching sub product swaps:", error);
    res.status(500).json({
      message: "Error fetching sub product swaps",
      error: error.message,
    });
  }
};

// Get sub product swap by ID with details
const getSubProductSwapById = async (req, res) => {
  try {
    const { id } = req.params;

    const subProductSwap = await SubProductSwapModel.findByPk(id, {
      include: [
        {
          model: SalesOrdersModel,
          as: "salesOrder",
          attributes: ["so_number", "client", "project_name"],
        },
        {
          model: ProductModel,
          as: "previousSubProduct",
          attributes: ["product_id", "product_name", "product_category"],
        },
        {
          model: ProductModel,
          as: "newSubProduct",
          attributes: ["product_id", "product_name", "product_category"],
        },
      ],
    });

    if (!subProductSwap) {
      return res.status(404).json({ message: "Sub product swap not found" });
    }

    res.status(200).json({
      subProductSwap,
    });
  } catch (error) {
    console.error("Error fetching sub product swap:", error);
    res.status(500).json({
      message: "Error fetching sub product swap",
      error: error.message,
    });
  }
};

const submitSubProductSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sub_product_swap_id } = req.params;
    const { mobilization_charge, demobilization_charge } = req.body;

    if (!mobilization_charge || !demobilization_charge) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Mobilization and demobilization charges are mandatory",
      });
    }

    const subProductSwap = await SubProductSwapModel.findByPk(sub_product_swap_id, {
      transaction,
    });

    if (!subProductSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sub product swap not found" });
    }

    await subProductSwap.update(
      {
        swap_status: subProductSwap.swap_status === "Return" ? "Resubmit" : "Swap Request",
        mobilization_charge: parseFloat(mobilization_charge),
        demobilization_charge: parseFloat(demobilization_charge),
        return_reason: null,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: "Sub product swap submitted successfully",
      subProductSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error submitting sub product swap:", error);
    res.status(500).json({
      message: "Error submitting sub product swap",
      error: error.message,
    });
  }
};

const returnSubProductSwapRequest = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sub_product_swap_id } = req.params;
    const { return_reason } = req.body;

    if (!return_reason || !return_reason.trim()) {
      await transaction.rollback();
      return res.status(400).json({
        message: "Return reason is required",
      });
    }

    const subProductSwap = await SubProductSwapModel.findByPk(sub_product_swap_id, {
      transaction,
    });

    if (!subProductSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sub product swap not found" });
    }

    await subProductSwap.update(
      {
        swap_status: "Return",
        return_reason: return_reason.trim(),
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: "Sub product swap returned successfully",
      subProductSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error returning sub product swap:", error);
    res.status(500).json({
      message: "Error returning sub product swap",
      error: error.message,
    });
  }
};

const approveSubProductSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sub_product_swap_id } = req.params;

    const subProductSwap = await SubProductSwapModel.findByPk(sub_product_swap_id, {
      transaction,
    });

    if (!subProductSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sub product swap not found" });
    }

    await subProductSwap.update(
      {
        swap_status: "Approved",
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: "Sub product swap approved successfully",
      subProductSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error approving sub product swap:", error);
    res.status(500).json({
      message: "Error approving sub product swap",
      error: error.message,
    });
  }
};

const rejectSubProductSwap = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sub_product_swap_id } = req.params;
    const { rejection_reason } = req.body;

    const subProductSwap = await SubProductSwapModel.findByPk(sub_product_swap_id, {
      transaction,
    });

    if (!subProductSwap) {
      await transaction.rollback();
      return res.status(404).json({ message: "Sub product swap not found" });
    }

    await subProductSwap.update(
      {
        swap_status: "Rejected",
        return_reason: rejection_reason || "Rejected by approver",
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: "Sub product swap rejected successfully",
      subProductSwap,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error rejecting sub product swap:", error);
    res.status(500).json({
      message: "Error rejecting sub product swap",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSubProductsByAttachmentId,
  getAllSubProducts,
  getSubProductSwapReasons,
  createSubProductSwap,
  getSubProductSwapsBySalesOrder,
  getSubProductSwapById,
  submitSubProductSwapRequest,
  returnSubProductSwapRequest,
  approveSubProductSwap,
  rejectSubProductSwap,
};