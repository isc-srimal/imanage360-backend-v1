// routes/fleet-management/sub-product-swap-routes.js
const express = require("express");
const {
  getAllSubProducts,
  getSubProductSwapReasons,
  createSubProductSwap,
  getSubProductSwapsBySalesOrder,
  getSubProductSwapById,
  submitSubProductSwapRequest,
  returnSubProductSwapRequest,
  approveSubProductSwap,
  rejectSubProductSwap,
  getAllSubProductsByAttachmentId,
} = require("../../controllers/fleet-management/subProductSwapController");
const { verifyToken } = require("../../middleware/authMiddleware");
const SubProductSwapModel = require("../../models/fleet-management/SubProductSwapModel");

const router = express.Router();

/**
 * @swagger
 * /api/sub-product-swaps/attachments/{attachmentNumber}/subproducts:
 *   get:
 *     summary: Get all sub products for a specific attachment
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: attachmentNumber
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of sub products
 *       500:
 *         description: Server error
 */
router.get("/attachments/:attachmentNumber/subproducts",verifyToken,getAllSubProductsByAttachmentId);

/**
 * @swagger
 * /api/sub-product-swaps/sub-products:
 *   get:
 *     summary: Get all sub products for dropdown
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sub products
 *       500:
 *         description: Server error
 */
router.get("/sub-products", verifyToken, getAllSubProducts);

/**
 * @swagger
 * /api/sub-product-swaps/swap-reasons:
 *   get:
 *     summary: Get swap reasons for sub products
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of swap reasons
 *       500:
 *         description: Server error
 */
router.get("/swap-reasons", verifyToken, getSubProductSwapReasons);

/**
 * @swagger
 * /api/sub-product-swaps/create:
 *   post:
 *     summary: Create a sub product swap
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - previous_sub_product_name
 *               - new_sub_product_name
 *               - swap_date
 *               - swap_reason
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *               allocation_id:
 *                 type: integer
 *               previous_sub_product_name:
 *                 type: string
 *               new_sub_product_name:
 *                 type: string
 *               swap_date:
 *                 type: string
 *                 format: date
 *               swap_reason:
 *                 type: string
 *               swap_estimated_recovery_cost:
 *                 type: number
 *               swap_mobilization_trips:
 *                 type: integer
 *               swap_demobilization_trips:
 *                 type: integer
 *               swap_remark:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sub product swap created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Sales order or sub product not found
 */
router.post("/create", verifyToken, createSubProductSwap);

/**
 * @swagger
 * /api/sub-product-swaps/{id}:
 *   get:
 *     summary: Get sub product swap by ID
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sub product swap details
 *       404:
 *         description: Sub product swap not found
 */
router.get("/:id", verifyToken, getSubProductSwapById);

/**
 * @swagger
 * /api/sub-product-swaps/sales-order/{sales_order_id}:
 *   get:
 *     summary: Get all sub product swaps for sales order
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sales_order_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of sub product swaps
 *       500:
 *         description: Server error
 */
router.get("/sales-order/:sales_order_id", verifyToken, getSubProductSwapsBySalesOrder);

/**
 * @swagger
 * /api/sub-product-swaps/submit/{sub_product_swap_id}:
 *   put:
 *     summary: Submit sub product swap request with charges
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sub_product_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mobilization_charge
 *               - demobilization_charge
 *             properties:
 *               mobilization_charge:
 *                 type: number
 *               demobilization_charge:
 *                 type: number
 *     responses:
 *       200:
 *         description: Sub product swap submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Sub product swap not found
 */
router.put("/submit/:sub_product_swap_id", verifyToken, submitSubProductSwapRequest);

/**
 * @swagger
 * /api/sub-product-swaps/return/{sub_product_swap_id}:
 *   put:
 *     summary: Return sub product swap request with reason
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sub_product_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - return_reason
 *             properties:
 *               return_reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sub product swap returned successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Sub product swap not found
 */
router.put("/return/:sub_product_swap_id", verifyToken, returnSubProductSwapRequest);

/**
 * @swagger
 * /api/sub-product-swaps/approve/{sub_product_swap_id}:
 *   put:
 *     summary: Approve sub product swap request
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sub_product_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sub product swap approved successfully
 *       404:
 *         description: Sub product swap not found
 */
router.put("/approve/:sub_product_swap_id", verifyToken, approveSubProductSwap);

/**
 * @swagger
 * /api/sub-product-swaps/reject/{sub_product_swap_id}:
 *   put:
 *     summary: Reject sub product swap request
 *     tags: [Sub Product Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sub_product_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejection_reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sub product swap rejected successfully
 *       404:
 *         description: Sub product swap not found
 */
router.put("/reject/:sub_product_swap_id", verifyToken, rejectSubProductSwap);

/**
 * @swagger
 * /api/subproduct-swaps/{subproduct_swap_id}/swap-request:
 *   post:
 *     summary: Submit subproduct swap request
 *     tags: [Subproduct Swaps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: subproduct_swap_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sales_order_id
 *               - estimated_cost
 *               - remark
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *               swap_type:
 *                 type: string
 *                 enum: [equipment, attachment, subproduct]
 *               swap_id:
 *                 type: integer
 *               estimated_cost:
 *                 type: number
 *               remark:
 *                 type: string
 *               mobilization_charge:
 *                 type: number
 *               demobilization_charge:
 *                 type: number
 *     responses:
 *       200:
 *         description: Swap request submitted successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subproduct swap not found
 */
router.post("/:subproduct_swap_id/swap-request", verifyToken, async (req, res) => {
  try {
    const { subproduct_swap_id } = req.params;
    const {
      sales_order_id,
      estimated_cost,
      remark,
      mobilization_charge,
      demobilization_charge
    } = req.body;

    // Find the subproduct swap
    const subproductSwap = await SubProductSwapModel.findByPk(subproduct_swap_id);
    if (!subproductSwap) {
      return res.status(404).json({ message: "Subproduct swap not found" });
    }

    // Update swap status
    await subproductSwap.update({
      swap_status: "Swap Request",
      swap_estimated_recovery_cost: estimated_cost,
      swap_remark: remark,
      swap_mobilization_charge: mobilization_charge,
      swap_demobilization_charge: demobilization_charge,
      swap_request_date: new Date()
    });

    // Create swap request record
    const SwapRequestModel = require("../../models/fleet-management/SwapRequestModel");
    const swapRequest = await SwapRequestModel.create({
      sales_order_id,
      swap_type: "subproduct",
      swap_id: subproduct_swap_id,
      status: "Swap Request",
      estimated_cost,
      remark,
      mobilization_charge,
      demobilization_charge,
      created_at: new Date()
    });

    res.status(200).json({
      message: "Subproduct swap request submitted successfully",
      swapRequest,
      subproductSwap
    });
  } catch (error) {
    console.error("Error submitting subproduct swap request:", error);
    res.status(500).json({ message: "Failed to submit swap request" });
  }
});

module.exports = router;