// routes/fleet-management/swap-requests-routes.js
const express = require("express");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const { Op } = require("sequelize");
const EquipmentSwapModel = require("../models/EquipmentSwapModel");
const AttachmentSwapModel = require("../models/AttachmentSwapModel");
const SubProductSwapModel = require("../models/SubProductSwapModel");
const OperatorChangeModel = require("../models/OperatorChangeModel");

const router = express.Router();

/**
 * @swagger
 * /api/swap-requests/counts:
 *   get:
 *     summary: Get counts of pending swap requests for notification badge
 *     tags: [Swap Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sales_order_id
 *         schema:
 *           type: integer
 *         description: Filter by sales order ID (optional)
 *     responses:
 *       200:
 *         description: Swap request counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 equipmentSwapCount:
 *                   type: integer
 *                 attachmentSwapCount:
 *                   type: integer
 *                 subproductSwapCount:
 *                   type: integer
 *                 operatorChangeCount:
 *                   type: integer
 *                 totalSwapCount:
 *                   type: integer
 */
router.get("/counts", verifyToken, async (req, res) => {
  try {
    const { sales_order_id } = req.query;
    
    // Build where clause
    const whereClause = {
      [Op.or]: [
        { swap_status: "Swap Request" },
        { swap_status: "Return" },
        { swap_status: "Resubmit" }
      ]
    };

    // If sales_order_id is provided, filter by it
    if (sales_order_id) {
      whereClause.sales_order_id = sales_order_id;
    }

    // Count equipment swaps
    const equipmentSwapCount = await EquipmentSwapModel.count({
      where: whereClause
    });

    // Count attachment swaps
    const attachmentSwapCount = await AttachmentSwapModel.count({
      where: whereClause
    });

    // Count subproduct swaps
    // const subproductSwapCount = await SubProductSwapModel.count({
    //   where: whereClause
    // });

    // Count operator changes
    const operatorChangeCount = await OperatorChangeModel.count({
      where: {
        [Op.or]: [
          { change_status: "Swap Request" },
          { change_status: "Return" },
          { change_status: "Resubmit" }
        ],
        ...(sales_order_id && { sales_order_id })
      }
    });

    const totalSwapCount = equipmentSwapCount + attachmentSwapCount + operatorChangeCount;

    res.status(200).json({
      success: true,
      equipmentSwapCount,
      attachmentSwapCount,
      operatorChangeCount,
      totalSwapCount,
      message: `Total ${totalSwapCount} pending swap requests`
    });
  } catch (error) {
    console.error("Error fetching swap request counts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch swap request counts",
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/swap-requests/sales-order/{sales_order_id}:
 *   get:
 *     summary: Get swap requests for specific sales order
 *     tags: [Swap Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales order ID
 *     responses:
 *       200:
 *         description: Swap requests for sales order
 */
router.get("/sales-order/:sales_order_id", verifyToken, async (req, res) => {
  try {
    const { sales_order_id } = req.params;
    
    const whereClause = {
      sales_order_id,
      [Op.or]: [
        { swap_status: "Swap Request" },
        { swap_status: "Return" },
        { swap_status: "Resubmit" }
      ]
    };

    const [equipmentSwaps, attachmentSwaps, subproductSwaps, operatorChanges] = await Promise.all([
      EquipmentSwapModel.findAll({ where: whereClause }),
      AttachmentSwapModel.findAll({ where: whereClause }),
      SubProductSwapModel.findAll({ where: whereClause }),
      OperatorChangeModel.findAll({
        where: {
          sales_order_id,
          [Op.or]: [
            { change_status: "Swap Request" },
            { change_status: "Return" },
            { change_status: "Resubmit" }
          ]
        }
      })
    ]);

    const totalCount = equipmentSwaps.length + attachmentSwaps.length + 
                      subproductSwaps.length + operatorChanges.length;

    res.status(200).json({
      success: true,
      totalCount,
      equipmentSwaps,
      attachmentSwaps,
      subproductSwaps,
      operatorChanges,
      message: `Found ${totalCount} swap requests for sales order ${sales_order_id}`
    });
  } catch (error) {
    console.error("Error fetching swap requests for sales order:", error);
    // res.status(500).json({
    //   success: false,
    //   message: "Failed to fetch swap requests",
    //   error: error.message
    // });
  }
});

module.exports = router;