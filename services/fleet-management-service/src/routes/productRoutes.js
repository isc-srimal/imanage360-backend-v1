const express = require("express");
const {
  uploadProducts,
  createProduct,
  updateProduct,
  getProductPhotos,
  serveProductFile,
  deleteProduct,
  getProductById,
  getAllProducts,
  filterProducts,
  exportFilteredProductsToCSV,
  exportFilteredProductsToPDF,
  // updateAttachmentNumbers,
  // getRentalServicesBySalesOrder,
} = require("../../controllers/fleet-management/productController");
const { verifyToken } = require("../../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/products/product/{product_id}:
 *   get:
 *     tags:
 *       - Manage Products
 *     summary: Get a single product by ID
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *       404:
 *         description: Product not found
 */
router.get("/product/:product_id", verifyToken, getProductById);

/**
 * @swagger
 * /api/products/products:
 *   get:
 *     tags:
 *       - Manage Products
 *     summary: Get all products with pagination
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
 *         description: Products retrieved successfully
 *       500:
 *         description: Error retrieving products
 */
router.get("/products", verifyToken, getAllProducts);

/**
 * @swagger
 * /api/products/filterProducts:
 *   get:
 *     tags:
 *       - Manage Products
 *     summary: Filter products by sell_this status
 *     parameters:
 *       - in: query
 *         name: sell_this
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, true, false]
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
 *         description: Filtered products retrieved successfully
 *       500:
 *         description: Error filtering products
 */
router.get("/filterProducts", verifyToken, filterProducts);

/**
 * @swagger
 * /api/products/{product_id}/photos:
 *   get:
 *     tags:
 *       - Manage Products
 *     summary: Get photos for a product
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: Product photos retrieved successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error retrieving photos
 */
router.get("/:product_id/photos", verifyToken, getProductPhotos);

/**
 * @swagger
 * /api/products/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Manage Products
 *     summary: Serve an product file
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [productImages]
 *         description: Folder containing the file
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid folder
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", verifyToken, serveProductFile);

/**
 * @swagger
 * /api/products/createProduct:
 *   post:
 *     tags:
 *       - Manage Products
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *               product_name:
 *                 type: string
 *               description:
 *                 type: string
 *               unit_price:
 *                 type: number
 *                 format: decimal
 *               sell_this:
 *                 type: boolean
 *               income_account:
 *                 type: string
 *               photos:
 *                 type: array
 *                 maxItems: 4  
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Error creating product
 */
router.post("/createProduct", verifyToken, uploadProducts, createProduct);

/**
 * @swagger
 * /api/products/updateProduct/{product_id}:
 *   put:
 *     tags:
 *       - Manage Products
 *     summary: Update an existing product
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               sales_order_id:
 *                 type: integer
 *               product_name:
 *                 type: string
 *               description:
 *                 type: string
 *               unit_price:
 *                 type: number
 *                 format: decimal
 *               sell_this:
 *                 type: boolean
 *               income_account:
 *                 type: string
 *               existing_photos:
 *                 type: string
 *               photos:
 *                 type: array
 *                 maxItems: 4  
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error updating product
 */
router.put("/updateProduct/:product_id", verifyToken, uploadProducts, updateProduct);

/**
 * @swagger
 * /api/products/deleteProduct/{product_id}:
 *   delete:
 *     tags:
 *       - Manage Products
 *     summary: Delete a product by ID
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */
router.delete("/deleteProduct/:product_id", verifyToken, deleteProduct);

/**
 * @swagger
 * /api/products/exportFilteredProductsToCSV:
 *   get:
 *     tags:
 *       - Manage Products
 *     summary: Export filtered products to CSV
 *     parameters:
 *       - in: query
 *         name: sell_this
 *         schema:
 *           type: string
 *           enum: [All, true, false]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: CSV file download
 *       500:
 *         description: Error exporting CSV
 */
router.get("/exportFilteredProductsToCSV", verifyToken, exportFilteredProductsToCSV);

/**
 * @swagger
 * /api/products/exportFilteredProductsToPDF:
 *   get:
 *     tags:
 *       - Manage Products
 *     summary: Export filtered products to PDF
 *     parameters:
 *       - in: query
 *         name: sell_this
 *         schema:
 *           type: string
 *           enum: [All, true, false]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file download
 *       500:
 *         description: Error exporting PDF
 */
router.get("/exportFilteredProductsToPDF", verifyToken, exportFilteredProductsToPDF);

// /**
//  * @swagger
//  * /api/products/update-attachment-numbers:
//  *   post:
//  *     tags:
//  *       - Manage Products
//  *     summary: Update attachment numbers for sub product attachments
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - updates
//  *             properties:
//  *               updates:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   required:
//  *                     - product_id
//  *                   properties:
//  *                     product_id:
//  *                       type: integer
//  *                       description: ID of the rental service product
//  *                       example: 123
//  *                     attachment_number:
//  *                       type: string
//  *                       description: Attachment number to assign
//  *                       example: "ATT-001"
//  *     responses:
//  *       200:
//  *         description: Attachment numbers updated successfully
//  *       400:
//  *         description: Invalid request format
//  *       404:
//  *         description: Product not found
//  *       500:
//  *         description: Server error
//  */
// router.post("/update-attachment-numbers", verifyToken, updateAttachmentNumbers);

// /**
//  * @swagger
//  * /api/products/by-sales-order/{product_id}:
//  *   get:
//  *     tags:
//  *       - Manage Products
//  *     summary: Get rental services by sales order ID
//  *     parameters:
//  *       - in: path
//  *         name: product_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Sales Order ID
//  *     responses:
//  *       200:
//  *         description: Rental services retrieved successfully
//  *       400:
//  *         description: Sales order ID required
//  *       500:
//  *         description: Server error
//  */
// router.get("/by-sales-order/:product_id", verifyToken, getRentalServicesBySalesOrder);


module.exports = router;
