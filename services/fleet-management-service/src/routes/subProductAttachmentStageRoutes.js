// const express = require("express");
// const {
//   createSubProductAttachmentStage,
//   updateSubProductAttachmentStage,
//   deleteSubProductAttachmentStage,
//   getSubProductAttachmentStageById,
//   getAllSubProductAttachmentStages,
//   filterSubProductAttachmentStages,
//   getSubProductAttachmentStagesBySalesOrder,
//   exportFilteredSubProductAttachmentStagesToCSV,
//   exportFilteredSubProductAttachmentStagesToPDF,
//   getSubProductAttachmentStagesByAttcahmentId,
// } = require("../../controllers/fleet-management/subProductAttachmentStageController");
// const { verifyToken } = require("../../middleware/authMiddleware");

// const router = express.Router();

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/createSubProductAttachmentStage:
//  *   post:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Create a new sub product attachment stage
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               so_id:
//  *                 type: integer
//  *                 description: Sales Order ID
//  *               stage_name:
//  *                 type: string
//  *                 description: Name of the sub product attachment stage
//  *               closure_status:
//  *                 type: string
//  *                 description: Closure status of the stage
//  *               completion_date:
//  *                 type: string
//  *                 format: date
//  *                 description: Completion date of the stage
//  *               remarks:
//  *                 type: string
//  *                 description: Additional remarks
//  *     responses:
//  *       201:
//  *         description: Sub product attachment stage created successfully
//  *       500:
//  *         description: Error creating sub product attachment stage
//  */
// router.post("/createSubProductAttachmentStage", verifyToken, createSubProductAttachmentStage);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/updateSubProductAttachmentStage/{sub_product_attachment_stage_id}:
//  *   put:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Update an existing sub product attachment stage
//  *     parameters:
//  *       - in: path
//  *         name: sub_product_attachment_stage_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the sub product attachment stage to update
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               so_id:
//  *                 type: integer
//  *                 description: Sales Order ID
//  *               stage_name:
//  *                 type: string
//  *                 description: Name of the sub product attachment stage
//  *               closure_status:
//  *                 type: string
//  *                 description: Closure status of the stage
//  *               completion_date:
//  *                 type: string
//  *                 format: date
//  *                 description: Completion date of the stage
//  *               remarks:
//  *                 type: string
//  *                 description: Additional remarks
//  *     responses:
//  *       200:
//  *         description: Sub product attachment stage updated successfully
//  *       404:
//  *         description: Sub product attachment stage not found
//  *       500:
//  *         description: Error updating sub product attachment stage
//  */
// router.put("/updateSubProductAttachmentStage/:sub_product_attachment_stage_id", verifyToken, updateSubProductAttachmentStage);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/deleteSubProductAttachmentStage/{sub_product_attachment_stage_id}:
//  *   delete:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Delete a sub product attachment stage by ID
//  *     parameters:
//  *       - in: path
//  *         name: sub_product_attachment_stage_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the sub product attachment stage to delete
//  *     responses:
//  *       200:
//  *         description: Sub product attachment stage deleted successfully
//  *       404:
//  *         description: Sub product attachment stage not found
//  *       500:
//  *         description: Error deleting sub product attachment stage
//  */
// router.delete("/deleteSubProductAttachmentStage/:sub_product_attachment_stage_id", verifyToken, deleteSubProductAttachmentStage);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/subProductAttachmentStage/{sub_product_attachment_stage_id}:
//  *   get:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Get a single sub product attachment stage by ID
//  *     parameters:
//  *       - in: path
//  *         name: sub_product_attachment_stage_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the sub product attachment stage
//  *     responses:
//  *       200:
//  *         description: Sub product attachment stage retrieved successfully
//  *       404:
//  *         description: Sub product attachment stage not found
//  */
// router.get("/subProductAttachmentStage/:sub_product_attachment_stage_id", verifyToken, getSubProductAttachmentStageById);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/subProductAttachmentStages:
//  *   get:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Get all sub product attachment stages with pagination
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *     responses:
//  *       200:
//  *         description: Sub product attachment stages retrieved successfully
//  *       500:
//  *         description: Error retrieving sub product attachment stages
//  */
// router.get("/subProductAttachmentStages", verifyToken, getAllSubProductAttachmentStages);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/filterSubProductAttachmentStages:
//  *   get:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Filter sub product attachment stages by closure status and sales order
//  *     parameters:
//  *       - in: query
//  *         name: closure_status
//  *         required: false
//  *         schema:
//  *           type: string
//  *           enum: [All, Completed, Pending, In Progress]
//  *       - in: query
//  *         name: so_id
//  *         required: false
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: page
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *     responses:
//  *       200:
//  *         description: Filtered sub product attachment stages retrieved successfully
//  *       500:
//  *         description: Error filtering sub product attachment stages
//  */
// router.get("/filterSubProductAttachmentStages", verifyToken, filterSubProductAttachmentStages);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/salesOrder/{so_id}:
//  *   get:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Get all sub product attachment stages for a specific sales order
//  *     parameters:
//  *       - in: path
//  *         name: so_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Sales Order ID
//  *       - in: query
//  *         name: page
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *     responses:
//  *       200:
//  *         description: Sub product attachment stages for sales order retrieved successfully
//  *       500:
//  *         description: Error retrieving sub product attachment stages for sales order
//  */
// router.get("/salesOrder/:so_id", verifyToken, getSubProductAttachmentStagesBySalesOrder);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/exportFilteredSubProductAttachmentStagesToCSV:
//  *   get:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Export filtered sub product attachment stages to CSV
//  *     parameters:
//  *       - in: query
//  *         name: closure_status
//  *         schema:
//  *           type: string
//  *           enum: [All, Completed, Pending, In Progress]
//  *       - in: query
//  *         name: so_id
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: CSV file download
//  *       500:
//  *         description: Error exporting CSV
//  */
// router.get("/exportFilteredSubProductAttachmentStagesToCSV", verifyToken, exportFilteredSubProductAttachmentStagesToCSV);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/exportFilteredSubProductAttachmentStagesToPDF:
//  *   get:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Export filtered sub product attachment stages to PDF
//  *     parameters:
//  *       - in: query
//  *         name: closure_status
//  *         schema:
//  *           type: string
//  *           enum: [All, Completed, Pending, In Progress]
//  *       - in: query
//  *         name: so_id
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: PDF file download
//  *       500:
//  *         description: Error exporting PDF
//  */
// router.get("/exportFilteredSubProductAttachmentStagesToPDF", verifyToken, exportFilteredSubProductAttachmentStagesToPDF);

// /**
//  * @swagger
//  * /api/sub-product-attachment-stages/sub-product-attachment/{attachment_id}:
//  *   get:
//  *     tags:
//  *       - Manage Sub Product Attachment Stages
//  *     summary: Get all sub product attachment stages for a specific attachment ID
//  *     parameters:
//  *       - in: path
//  *         name: attachment_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Attachment ID
//  *       - in: query
//  *         name: page
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         required: false
//  *         schema:
//  *           type: integer
//  *           default: 100
//  *     responses:
//  *       200:
//  *         description: Sub product attachment stages for attachment ID retrieved successfully
//  *       500:
//  *         description: Error retrieving sub product attachment stages for attachment ID
//  */
// router.get("/sub-product-attachment/:attachment_id", verifyToken, getSubProductAttachmentStagesByAttcahmentId);

// module.exports = router;

const express = require("express");
const {
  createSubProductAttachmentStage,
  updateSubProductAttachmentStage,
  deleteSubProductAttachmentStage,
  getSubProductAttachmentStageById,
  getAllSubProductAttachmentStages,
  filterSubProductAttachmentStages,
  getSubProductAttachmentStagesBySalesOrder,
  exportFilteredSubProductAttachmentStagesToCSV,
  exportFilteredSubProductAttachmentStagesToPDF,
  getSubProductAttachmentStagesByProductId,
} = require("../controllers/subProductAttachmentStageController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/sub-product-attachment-stages/createSubProductAttachmentStage:
 *   post:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Create a new sub product attachment stage
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               so_id:
 *                 type: integer
 *                 description: Sales Order ID
 *               product_id:
 *                 type: integer
 *                 description: Product ID
 *               stage_name:
 *                 type: string
 *                 description: Name of the sub product attachment stage
 *               closure_status:
 *                 type: string
 *                 description: Closure status of the stage
 *               completion_date:
 *                 type: string
 *                 format: date
 *                 description: Completion date of the stage
 *               remarks:
 *                 type: string
 *                 description: Additional remarks
 *     responses:
 *       201:
 *         description: Sub product attachment stage created successfully
 *       404:
 *         description: Sales Order or Product not found
 *       500:
 *         description: Error creating sub product attachment stage
 */
router.post(
  "/createSubProductAttachmentStage",
  verifyToken,
  createSubProductAttachmentStage
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/updateSubProductAttachmentStage/{sub_product_attachment_stage_id}:
 *   put:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Update an existing sub product attachment stage
 *     parameters:
 *       - in: path
 *         name: sub_product_attachment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sub product attachment stage to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               so_id:
 *                 type: integer
 *                 description: Sales Order ID
 *               product_id:
 *                 type: integer
 *                 description: Product ID
 *               stage_name:
 *                 type: string
 *                 description: Name of the sub product attachment stage
 *               closure_status:
 *                 type: string
 *                 description: Closure status of the stage
 *               completion_date:
 *                 type: string
 *                 format: date
 *                 description: Completion date of the stage
 *               remarks:
 *                 type: string
 *                 description: Additional remarks
 *     responses:
 *       200:
 *         description: Sub product attachment stage updated successfully
 *       404:
 *         description: Sub product attachment stage not found
 *       500:
 *         description: Error updating sub product attachment stage
 */
router.put(
  "/updateSubProductAttachmentStage/:sub_product_attachment_stage_id",
  verifyToken,
  updateSubProductAttachmentStage
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/deleteSubProductAttachmentStage/{sub_product_attachment_stage_id}:
 *   delete:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Delete a sub product attachment stage by ID
 *     parameters:
 *       - in: path
 *         name: sub_product_attachment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sub product attachment stage to delete
 *     responses:
 *       200:
 *         description: Sub product attachment stage deleted successfully
 *       404:
 *         description: Sub product attachment stage not found
 *       500:
 *         description: Error deleting sub product attachment stage
 */
router.delete(
  "/deleteSubProductAttachmentStage/:sub_product_attachment_stage_id",
  verifyToken,
  deleteSubProductAttachmentStage
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/subProductAttachmentStage/{sub_product_attachment_stage_id}:
 *   get:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Get a single sub product attachment stage by ID
 *     parameters:
 *       - in: path
 *         name: sub_product_attachment_stage_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sub product attachment stage
 *     responses:
 *       200:
 *         description: Sub product attachment stage retrieved successfully
 *       404:
 *         description: Sub product attachment stage not found
 *       500:
 *         description: Error retrieving sub product attachment stage
 */
router.get(
  "/subProductAttachmentStage/:sub_product_attachment_stage_id",
  verifyToken,
  getSubProductAttachmentStageById
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/subProductAttachmentStages:
 *   get:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Get all sub product attachment stages with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Sub product attachment stages retrieved successfully
 *       500:
 *         description: Error retrieving sub product attachment stages
 */
router.get(
  "/subProductAttachmentStages",
  verifyToken,
  getAllSubProductAttachmentStages
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/filterSubProductAttachmentStages:
 *   get:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Filter sub product attachment stages by closure status and sales order
 *     parameters:
 *       - in: query
 *         name: closure_status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Completed, Pending, In Progress]
 *           default: All
 *       - in: query
 *         name: so_id
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Filtered sub product attachment stages retrieved successfully
 *       500:
 *         description: Error filtering sub product attachment stages
 */
router.get(
  "/filterSubProductAttachmentStages",
  verifyToken,
  filterSubProductAttachmentStages
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/salesOrder/{so_id}:
 *   get:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Get all sub product attachment stages for a specific sales order
 *     parameters:
 *       - in: path
 *         name: so_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Sales Order ID
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Sub product attachment stages for sales order retrieved successfully
 *       500:
 *         description: Error retrieving sub product attachment stages for sales order
 */
router.get(
  "/salesOrder/:so_id",
  verifyToken,
  getSubProductAttachmentStagesBySalesOrder
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/product/{product_id}:
 *   get:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Get all sub product attachment stages for a specific product
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 100
 *     responses:
 *       200:
 *         description: Sub product attachment stages for product retrieved successfully
 *       500:
 *         description: Error retrieving sub product attachment stages for product
 */
router.get(
  "/product/:product_id",
  verifyToken,
  getSubProductAttachmentStagesByProductId
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/exportFilteredSubProductAttachmentStagesToCSV:
 *   get:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Export filtered sub product attachment stages to CSV
 *     parameters:
 *       - in: query
 *         name: closure_status
 *         schema:
 *           type: string
 *           enum: [All, Completed, Pending, In Progress]
 *           default: All
 *       - in: query
 *         name: so_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: CSV file download
 *       404:
 *         description: No sub product attachment stages found matching the filters
 *       500:
 *         description: Error exporting CSV
 */
router.get(
  "/exportFilteredSubProductAttachmentStagesToCSV",
  verifyToken,
  exportFilteredSubProductAttachmentStagesToCSV
);

/**
 * @swagger
 * /api/sub-product-attachment-stages/exportFilteredSubProductAttachmentStagesToPDF:
 *   get:
 *     tags:
 *       - Manage Sub Product Attachment Stages
 *     summary: Export filtered sub product attachment stages to PDF
 *     parameters:
 *       - in: query
 *         name: closure_status
 *         schema:
 *           type: string
 *           enum: [All, Completed, Pending, In Progress]
 *           default: All
 *       - in: query
 *         name: so_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: PDF file download
 *       404:
 *         description: No sub product attachment stages found matching the filters
 *       500:
 *         description: Error exporting PDF
 */
router.get(
  "/exportFilteredSubProductAttachmentStagesToPDF",
  verifyToken,
  exportFilteredSubProductAttachmentStagesToPDF
);

module.exports = router;
