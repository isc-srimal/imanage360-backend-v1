const express = require("express");
const {
  createServiceEntryType,
  updateServiceEntryType,
  deleteServiceEntryType,
  getServiceEntryTypeById,
  getAllServiceEntryTypes,
  filterServiceEntryTypes,
  exportFilteredServiceEntryTypesToCSV,
  exportFilteredServiceEntryTypesToPDF,
} = require("../controllers/serviceEntryTypeController");

const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");

const router = express.Router();


/**
 * @swagger
 * /api/service-entry-types/filterServiceEntryTypes:
 *   get:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Filter service entry types by status
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
 *         description: Filtered service entry types retrieved successfully
 *       500:
 *         description: Error filtering service entry types
 */
router.get("/filterServiceEntryTypes", verifyToken, filterServiceEntryTypes);


/**
 * @swagger
 * /api/service-entry-types/createServiceEntryType:
 *   post:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Create a new service entry type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_entry_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: Service entry type created successfully
 *       500:
 *         description: Error creating service entry type
 */
router.post("/createServiceEntryType", verifyToken, createServiceEntryType);

/**
 * @swagger
 * /api/service-entry-types/updateServiceEntryType/{id}:
 *   put:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Update an existing service entry type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service entry type to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_entry_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Service entry type updated successfully
 *       404:
 *         description: Service entry type not found
 *       500:
 *         description: Error updating service entry type
 */
router.put("/updateServiceEntryType/:id", verifyToken, updateServiceEntryType);

/**
 * @swagger
 * /api/service-entry-types/deleteServiceEntryType/{id}:
 *   delete:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Delete a service entry type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service entry type to delete
 *     responses:
 *       200:
 *         description: Service entry type deleted successfully
 *       404:
 *         description: Service entry type not found
 *       500:
 *         description: Error deleting service entry type
 */
router.delete("/deleteServiceEntryType/:id", verifyToken, deleteServiceEntryType);

/**
 * @swagger
 * /api/service-entry-types/serviceEntryType/{id}:
 *   get:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Get a single service entry type by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the service entry type
 *     responses:
 *       200:
 *         description: Service entry type retrieved successfully
 *       404:
 *         description: Service entry type not found
 */
router.get("/serviceEntryType/:id", verifyToken, getServiceEntryTypeById);

/**
 * @swagger
 * /api/service-entry-types/serviceEntryTypes:
 *   get:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Get all service entry types with pagination
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
 *         description: Service entry types retrieved successfully
 *       500:
 *         description: Error retrieving service entry types
 */
router.get("/serviceEntryTypes", verifyToken, getAllServiceEntryTypes);


/**
 * @swagger
 * /api/service-entry-types/exportFilteredServiceEntryTypesToCSV:
 *   get:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Export filtered service entry types to CSV
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredServiceEntryTypesToCSV", verifyToken, exportFilteredServiceEntryTypesToCSV);

/**
 * @swagger
 * /api/service-entry-types/exportFilteredServiceEntryTypesToPDF:
 *   get:
 *     tags:
 *       - Manage Service Entry Types
 *     summary: Export filtered service entry types to PDF
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
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
router.get("/exportFilteredServiceEntryTypesToPDF", verifyToken, exportFilteredServiceEntryTypesToPDF);

module.exports = router;