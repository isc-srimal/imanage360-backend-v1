// controllers/fleet-management/subProductAttachmentAssignmentController.js
const SubProductAttachmentAssignmentModel = require("../models/SubProductAttachmentAssignmentModel");
const AttachmentSwapModel = require("../models/AttachmentSwapModel");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");

/**
 * Save (upsert) sub product → attachment number assignments for a sales order.
 * Body: { sales_order_id, assignments: [{ product_id, attachment_number }] }
 */
// const saveAssignments = async (req, res) => {
//   const transaction = await sequelize.transaction();

//   try {
//     const { sales_order_id, assignments } = req.body;

//     if (!sales_order_id || !Array.isArray(assignments) || assignments.length === 0) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: "sales_order_id and a non-empty assignments array are required",
//       });
//     }

//     // Validate sales order exists
//     const salesOrder = await SalesOrdersModel.findByPk(sales_order_id);
//     if (!salesOrder) {
//       await transaction.rollback();
//       return res.status(404).json({ message: "Sales order not found" });
//     }

//     // Collect attachment numbers that belong to swaps for this sales order
//     const swaps = await AttachmentSwapModel.findAll({
//       where: { sales_order_id },
//       attributes: ["previous_attachment_no", "new_attachment_no"],
//     });

//     const validAttachmentNumbers = new Set();
//     swaps.forEach((swap) => {
//       if (swap.previous_attachment_no) validAttachmentNumbers.add(swap.previous_attachment_no);
//       if (swap.new_attachment_no) validAttachmentNumbers.add(swap.new_attachment_no);
//     });

//     // Validate each assignment references a swapped attachment
//     for (const a of assignments) {
//       if (!a.product_id || !a.attachment_number) {
//         await transaction.rollback();
//         return res.status(400).json({
//           message: "Each assignment must have product_id and attachment_number",
//         });
//       }
//       if (!validAttachmentNumbers.has(a.attachment_number)) {
//         await transaction.rollback();
//         return res.status(400).json({
//           message: `Attachment number "${a.attachment_number}" is not part of any swap for this sales order`,
//         });
//       }
//     }

//     // Check for duplicate attachment_number in the request (one attachment per product rule)
//     const attachmentCounts = {};
//     for (const a of assignments) {
//       attachmentCounts[a.attachment_number] = (attachmentCounts[a.attachment_number] || 0) + 1;
//     }
//     const duplicates = Object.entries(attachmentCounts)
//       .filter(([, count]) => count > 1)
//       .map(([num]) => num);

//     if (duplicates.length > 0) {
//       await transaction.rollback();
//       return res.status(400).json({
//         message: `Attachment number(s) assigned to multiple products: ${duplicates.join(", ")}`,
//       });
//     }

//     // Get username
//     let username = "System";
//     if (req.user?.uid) {
//       const user = await UsersModel.findByPk(req.user.uid);
//       if (user) username = user.username;
//     }

//     // Upsert each assignment (insert or update if already exists)
//     const upserted = [];
//     for (const a of assignments) {
//       const [record] = await SubProductAttachmentAssignmentModel.upsert(
//         {
//           sales_order_id,
//           product_id: a.product_id,
//           attachment_number: a.attachment_number,
//           created_by: username,
//         },
//         {
//           conflictFields: ["sales_order_id", "product_id"],
//           transaction,
//         },
//       );
//       upserted.push(record);
//     }

//     await transaction.commit();

//     res.status(200).json({
//       message: "Sub product attachment assignments saved successfully",
//       count: upserted.length,
//       assignments: upserted,
//     });
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Error saving sub product attachment assignments:", error);
//     res.status(500).json({
//       message: "Error saving assignments",
//       error: error.message,
//     });
//   }
// };

const saveAssignments = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { sales_order_id, assignments } = req.body;

    if (!sales_order_id || !Array.isArray(assignments)) {
      await transaction.rollback();
      return res.status(400).json({ message: "Invalid data format" });
    }

    // Username එක ලබා ගැනීම
    let username = "System";
    if (req.user && req.user.username) {
      username = req.user.username;
    }

    // එකින් එක save (upsert) කිරීම
    for (const a of assignments) {
      if (a.attachment_number) { // attachment number එකක් තෝරා ඇත්නම් පමණක්
        await SubProductAttachmentAssignmentModel.upsert(
          {
            sales_order_id,
            product_id: a.product_id,
            attachment_number: a.attachment_number,
            created_by: username,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    res.status(200).json({ success: true, message: "Assignments saved successfully" });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Get all assignments for a sales order.
 * Used by the frontend to restore previously saved selections.
 */
const getAssignmentsBySalesOrder = async (req, res) => {
  try {
    const { sales_order_id } = req.params;

    const assignments = await SubProductAttachmentAssignmentModel.findAll({
      where: { sales_order_id },
      order: [["product_id", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments,
    });
  } catch (error) {
    console.error("Error fetching sub product attachment assignments:", error);
    res.status(500).json({
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};

/**
 * Delete a single assignment by assignment_id.
 */
const deleteAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const assignment = await SubProductAttachmentAssignmentModel.findByPk(assignment_id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await assignment.destroy();

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Error deleting assignment:", error);
    res.status(500).json({
      message: "Error deleting assignment",
      error: error.message,
    });
  }
};

module.exports = {
  saveAssignments,
  getAssignmentsBySalesOrder,
  deleteAssignment,
};