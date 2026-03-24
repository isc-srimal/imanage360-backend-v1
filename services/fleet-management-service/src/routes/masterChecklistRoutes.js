// // routes/fleet-management/masterChecklistRoutes.js
// const express = require("express");
// const {
//   getAllMasterChecklists,
//   createMasterChecklist,
//   getMasterChecklistById,
//   updateMasterChecklist,
//   deleteMasterChecklist,
//   addChecklistItems,
// } = require("../../controllers/fleet-management/masterChecklistController");
// const { verifyToken } = require("../../middleware/authMiddleware");

// const router = express.Router();

// /**
//  * @swagger
//  * /api/master-checklist/all:
//  *   get:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Get all master checklists
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *       - in: query
//  *         name: type
//  *         schema:
//  *           type: string
//  *           enum: [Prechecklist from Auto Xpert, Checklist to be signed from Client]
//  */
// router.get("/all", verifyToken, getAllMasterChecklists);

// /**
//  * @swagger
//  * /api/master-checklist/create:
//  *   post:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Create new master checklist
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - checklist_name
//  *               - checklist_type
//  *             properties:
//  *               checklist_name:
//  *                 type: string
//  *               checklist_type:
//  *                 type: string
//  *                 enum: [Prechecklist from Auto Xpert, Checklist to be signed from Client]
//  *               items:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     item_name:
//  *                       type: string
//  */
// router.post("/create", verifyToken, createMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/{id}:
//  *   get:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Get checklist by ID
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.get("/:id", verifyToken, getMasterChecklistById);

// /**
//  * @swagger
//  * /api/master-checklist/update/{id}:
//  *   put:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Update master checklist
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.put("/update/:id", verifyToken, updateMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/delete/{id}:
//  *   delete:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Delete master checklist
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.delete("/delete/:id", verifyToken, deleteMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/add-items/{id}:
//  *   post:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Add items to existing checklist
//  */
// router.post("/add-items/:id", verifyToken, addChecklistItems);

// module.exports = router;

//Original Code

// // routes/fleet-management/masterChecklistRoutes.js
// const express = require("express");
// const {
//   getAllMasterChecklists,
//   createMasterChecklist,
//   getMasterChecklistById,
//   updateMasterChecklist,
//   deleteMasterChecklist,
//   duplicateMasterChecklist,
//   saveChecklistTemplate,
//   assignChecklistToResources,
//   getAssignedResources,
//   togglePublishStatus,
//   toggleActiveStatus,
//   getAllTemplates,
//   getTemplateById,
//   updateTemplate,
// } = require("../../controllers/fleet-management/masterChecklistController");
// const { verifyToken } = require("../../middleware/authMiddleware");

// const router = express.Router();

// /**
//  * @swagger
//  * /api/master-checklist/all:
//  *   get:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Get all master checklists with filters
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *       - in: query
//  *         name: category
//  *         schema:
//  *           type: string
//  *           enum: [Equipment, Attachment, Manpower]
//  *       - in: query
//  *         name: checklist_type
//  *         schema:
//  *           type: string
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  */
// router.get("/all", verifyToken, getAllMasterChecklists);

// /**
//  * @swagger
//  * /api/master-checklist/create:
//  *   post:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Create new master checklist
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - checklist_name
//  *               - category
//  *               - checklist_type

//  *             properties:
//  *               checklist_name:
//  *                 type: string
//  *               category:
//  *                 type: string
//  *                 enum: [Equipment, Attachment, Manpower]
//  *               checklist_type:
//  *                 type: string
//  *                 enum: [columns_2, columns_5, columns_7]
//  */
// router.post("/create", verifyToken, createMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/templates/all:
//  *   get:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Get all templates with pagination
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *           default: 1
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *           default: 10
//  *       - in: query
//  *         name: search
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: List of templates retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 totalCount:
//  *                   type: integer
//  *                 currentPage:
//  *                   type: integer
//  *                 totalPages:
//  *                   type: integer
//  *                 templates:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/ChecklistTemplate'
//  */
// router.get("/templates/all", verifyToken, getAllTemplates);

// /**
//  * @swagger
//  * /api/master-checklist/template/details/{id}:
//  *   get:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Get template by ID with detailed information
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Template retrieved successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/ChecklistTemplate'
//  *       404:
//  *         description: Template not found
//  */
// router.get("/template/details/:id", verifyToken, getTemplateById);

// /**
//  * @swagger
//  * /api/master-checklist/template/update/{id}:
//  *   put:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Update template (partial or full update)
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               header_info:
//  *                 type: object
//  *               footer_info:
//  *                 type: object
//  *               instructions:
//  *                 type: string
//  *               columns:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *               categories:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *               update_mode:
//  *                 type: string
//  *                 enum: [full, partial]
//  *                 default: full
//  *     responses:
//  *       200:
//  *         description: Template updated successfully
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                 template:
//  *                   $ref: '#/components/schemas/ChecklistTemplate'
//  *       404:
//  *         description: Template not found
//  */
// router.put("/template/update/:id", verifyToken, updateTemplate);

// /**
//  * @swagger
//  * /api/master-checklist/template/{id}:
//  *   post:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Create/Update checklist template
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.post("/template/:id", verifyToken, saveChecklistTemplate);

// /**
//  * @swagger
//  * /api/master-checklist/duplicate/{id}:
//  *   post:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Duplicate master checklist
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - new_checklist_name
//  *             properties:
//  *               new_checklist_name:
//  *                 type: string
//  */
// router.post("/duplicate/:id", verifyToken, duplicateMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/duplicate/{id}:
//  *   post:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Duplicate master checklist
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - new_checklist_name
//  *             properties:
//  *               new_checklist_name:
//  *                 type: string
//  */
// router.post("/duplicate/:id", verifyToken, duplicateMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/assign/{id}:
//  *   post:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Assign checklist to resources
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - resources
//  *             properties:
//  *               resources:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     id:
//  *                       type: integer
//  */
// router.post("/assign/:id", verifyToken, assignChecklistToResources);

// /**
//  * @swagger
//  * /api/master-checklist/assignments/{id}:
//  *   get:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Get assigned resources for a checklist
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.get("/assignments/:id", verifyToken, getAssignedResources);

// /**
//  * @swagger
//  * /api/master-checklist/publish/{id}:
//  *   put:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Toggle checklist publish status
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.put("/publish/:id", verifyToken, togglePublishStatus);

// /**
//  * @swagger
//  * /api/master-checklist/active/{id}:
//  *   put:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Toggle checklist active status
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.put("/active/:id", verifyToken, toggleActiveStatus);

// /**
//  * @swagger
//  * /api/master-checklist/update/{id}:
//  *   put:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Update master checklist
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.put("/update/:id", verifyToken, updateMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/delete/{id}:
//  *   delete:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Delete master checklist
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.delete("/delete/:id", verifyToken, deleteMasterChecklist);

// /**
//  * @swagger
//  * /api/master-checklist/{id}:
//  *   get:
//  *     tags:
//  *       - Master Checklist
//  *     summary: Get checklist by ID with template details
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.get("/:id", verifyToken, getMasterChecklistById);

// module.exports = router;

// routes/fleet-management/masterChecklistRoutes.js
const express = require("express");
const {
  getAllMasterChecklists,
  createMasterChecklist,
  getMasterChecklistById,
  updateMasterChecklist,
  deleteMasterChecklist,
  duplicateMasterChecklist,
  saveChecklistTemplate,
  assignChecklistToResources,
  getAssignedResources,
  togglePublishStatus,
  toggleActiveStatus,
  getAllTemplates,
  getTemplateById,
  updateTemplate,
  getAllAssignableEquipment,
  getAssignableEquipmentCategories,
  getAllAssignableManpower,
  getAssignableManpowerFilters,
  getAllAssignableAttachments,
  getAssignableAttachmentFilters,
  getEquipmentAssignedChecklists,
  getEquipmentChecklistTemplate,
  saveChecklistTemplateWithFile,
  serveTemplateFile,
  downloadEquipmentTemplate,
  downloadAttachmentTemplate,
  getAttachmentAssignedChecklists,
  downloadManpowerTemplate,
  getManpowerAssignedChecklists,
  getChecklistAssignmentCount,
  getDeliveryNoteChecklists,
  downloadDeliveryNoteTemplate,
  getAllChecklistTypes,
  getDetailedAssignedResources,
  getOffHireNoteChecklists,
  downloadOffHireNoteTemplate,
  downloadOHNEquipmentTemplate,
  downloadOHNManpowerTemplate,
  downloadOHNAttachmentTemplate,
} = require("../../controllers/fleet-management/masterChecklistController");
const { verifyToken } = require("../../middleware/authMiddleware");
const { 
  uploadChecklistTemplate, 
  uploadAttachmentChecklistTemplate,
  uploadManpowerChecklistTemplate 
} = require("../../config/multerConfig");
const router = express.Router();
const {
  MasterChecklistModel,
  ChecklistTemplateModel,
  ChecklistCategoryModel,
  ChecklistItemModel,
  AssignedChecklistModel,
} = require("../../models/fleet-management/MasterChecklistModel");

// Middleware to dynamically select the correct multer uploader

const dynamicTemplateUpload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Fetch checklist to determine category
    const checklist = await MasterChecklistModel.findByPk(id);
    
    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    // Choose the appropriate uploader based on category
    let uploader;
    if (checklist.category === 'Attachment') {
      uploader = uploadAttachmentChecklistTemplate;
    } else if (checklist.category === 'Manpower') {
      uploader = uploadManpowerChecklistTemplate; // ADD THIS
    } else {
      uploader = uploadChecklistTemplate;
    }
    
    // Apply the selected uploader
    uploader.single("template_file")(req, res, next);
  } catch (error) {
    console.error('Error in dynamic upload middleware:', error);
    next(error);
  }
};
// const dynamicTemplateUpload = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const token = req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//       return res.status(401).json({ message: "Authentication required" });
//     }

//     // Fetch checklist to determine category
//     const checklist = await MasterChecklistModel.findByPk(id);
    
//     if (!checklist) {
//       return res.status(404).json({ message: "Checklist not found" });
//     }

//     // Choose the appropriate uploader based on category
//     const uploader = checklist.category === 'Attachment' 
//       ? uploadAttachmentChecklistTemplate 
//       : uploadChecklistTemplate;
    
//     // Apply the selected uploader
//     uploader.single("template_file")(req, res, next);
//   } catch (error) {
//     console.error('Error in dynamic upload middleware:', error);
//     next(error);
//   }
// };

// ==================== CHECKLIST ROUTES ====================

/**
 * @swagger
 * /api/master-checklist/all:
 *   get:
 *     tags:
 *       - Master Checklist
 *     summary: Get all master checklists with filters
 *     parameters:
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
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Equipment, Attachment, Manpower]
 *       - in: query
 *         name: checklist_type
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 */
router.get("/all", verifyToken, getAllMasterChecklists);

/**
 * @swagger
 * /api/master-checklist/create:
 *   post:
 *     tags:
 *       - Master Checklist
 *     summary: Create new master checklist
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - checklist_name
 *               - category
 *               - checklist_type
 *             properties:
 *               checklist_name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [Equipment, Attachment, Manpower]
 *               checklist_type:
 *                 type: string
 */
router.post("/create", verifyToken, createMasterChecklist);

/**
 * @swagger
 * /api/master-checklist/duplicate/{id}:
 *   post:
 *     tags:
 *       - Master Checklist
 *     summary: Duplicate master checklist
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - new_checklist_name
 *             properties:
 *               new_checklist_name:
 *                 type: string
 */
router.post("/duplicate/:id", verifyToken, duplicateMasterChecklist);

/**
 * @swagger
 * /api/master-checklist/publish/{id}:
 *   put:
 *     tags:
 *       - Master Checklist
 *     summary: Toggle checklist publish status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/publish/:id", verifyToken, togglePublishStatus);

/**
 * @swagger
 * /api/master-checklist/active/{id}:
 *   put:
 *     tags:
 *       - Master Checklist
 *     summary: Toggle checklist active status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/active/:id", verifyToken, toggleActiveStatus);

/**
 * @swagger
 * /api/master-checklist/update/{id}:
 *   put:
 *     tags:
 *       - Master Checklist
 *     summary: Update master checklist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.put("/update/:id", verifyToken, updateMasterChecklist);

/**
 * @swagger
 * /api/master-checklist/delete/{id}:
 *   delete:
 *     tags:
 *       - Master Checklist
 *     summary: Delete master checklist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/delete/:id", verifyToken, deleteMasterChecklist);

/**
 * @swagger
 * /api/master-checklist/{id}:
 *   get:
 *     tags:
 *       - Master Checklist
 *     summary: Get checklist by ID with template details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id", verifyToken, getMasterChecklistById);

// ==================== TEMPLATE ROUTES ====================

/**
 * @swagger
 * /api/master-checklist/templates/all:
 *   get:
 *     tags:
 *       - Master Checklist Templates
 *     summary: Get all templates with pagination
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of templates retrieved successfully
 */
router.get("/templates/all", verifyToken, getAllTemplates);

/**
 * @swagger
 * /api/master-checklist/template/{id}:
 *   get:
 *     tags:
 *       - Master Checklist Templates
 *     summary: Get template by checklist ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The checklist ID to get template for
 */
router.get("/template/:id", verifyToken, getTemplateById);

/**
 * @swagger
 * /api/master-checklist/template/details/{id}:
 *   get:
 *     tags:
 *       - Master Checklist Templates
 *     summary: Get template by ID with detailed information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The checklist ID or template ID
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *       404:
 *         description: Template not found
 */
router.get("/template/details/:id", verifyToken, getTemplateById);

/**
 * @swagger
 * /api/master-checklist/template/{id}:
 *   post:
 *     tags:
 *       - Master Checklist Templates
 *     summary: Create/Save checklist template
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The checklist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               header_info:
 *                 type: object
 *               footer_info:
 *                 type: object
 *               instructions:
 *                 type: string
 *               columns:
 *                 type: array
 *               categories:
 *                 type: array
 */
router.post(
  "/template/:id",
  verifyToken,
  // uploadChecklistTemplate.single("template_file"),
  dynamicTemplateUpload,
  saveChecklistTemplate
);

/**
 * @swagger
 * /api/master-checklist/template/update/{id}:
 *   put:
 *     tags:
 *       - Master Checklist Templates
 *     summary: Update template (partial or full update)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               header_info:
 *                 type: object
 *               footer_info:
 *                 type: object
 *               instructions:
 *                 type: string
 *               columns:
 *                 type: array
 *               categories:
 *                 type: array
 *               update_mode:
 *                 type: string
 *                 enum: [full, partial]
 *                 default: full
 *     responses:
 *       200:
 *         description: Template updated successfully
 *       404:
 *         description: Template not found
 */
router.put(
  "/template/update/:id",
  verifyToken,
  // uploadChecklistTemplate.single("template_file"),
  dynamicTemplateUpload,
  updateTemplate
);

router.get(
  "/attachment/:attachment_id/download-template/:assignment_id",
  verifyToken,
  downloadAttachmentTemplate
);

router.get(
  "/attachment/:attachment_id/assigned-checklists",
  verifyToken,
  getAttachmentAssignedChecklists
);

/**
 * @swagger
 * /api/master-checklist/equipment/{serial_number}/download-template/{assignment_id}:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Download template file for equipment assignment
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: assignment_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get(
  "/equipment/:serial_number/download-template/:assignment_id",
  verifyToken,
  downloadEquipmentTemplate
);

// ==================== ASSIGNMENT ROUTES ====================

/**
 * @swagger
 * /api/master-checklist/assign/{id}:
 *   post:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Assign checklist to resources
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - resources
 *             properties:
 *               resources:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 */
router.post("/assign/:id", verifyToken, assignChecklistToResources);

/**
 * @swagger
 * /api/master-checklist/assignments/{id}:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get assigned resources for a checklist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/assignments/:id", verifyToken, getAssignedResources);

// ==================== ASSIGNABLE RESOURCES ROUTES ====================

/**
 * @swagger
 * /api/master-checklist/assignable/equipment:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get all assignable equipment with filtering
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by registration number, description, VIN, category or subcategory
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *       - in: query
 *         name: subcategory_id
 *         schema:
 *           type: integer
 *         description: Filter by subcategory ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [day-off, idle, major-breakdown, minor-breakdown, inspection, public-holiday, asset-defleet, new-asset, allocated]
 *         description: Filter by equipment status
 *     responses:
 *       200:
 *         description: List of assignable equipment retrieved successfully
 */
router.get("/assignable/equipment", verifyToken, getAllAssignableEquipment);

/**
 * @swagger
 * /api/master-checklist/assignable/equipment/filters:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get equipment filter options (categories and statuses)
 *     responses:
 *       200:
 *         description: Filter options retrieved successfully
 */
router.get(
  "/assignable/equipment/filters",
  verifyToken,
  getAssignableEquipmentCategories
);

/**
 * @swagger
 * /api/master-checklist/assignable/manpower:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get all assignable manpower with filtering
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by employee name, number, contract or operator type
 *       - in: query
 *         name: employeeNo
 *         schema:
 *           type: string
 *         description: Filter by employee number
 *       - in: query
 *         name: employeeType
 *         schema:
 *           type: string
 *         description: Filter by employee type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [day-off, idle, annual-leave, sick-leave, training, public-holiday, employee-resigned, new-employee, allocated]
 *         description: Filter by manpower status
 *     responses:
 *       200:
 *         description: List of assignable manpower retrieved successfully
 */
router.get("/assignable/manpower", verifyToken, getAllAssignableManpower);

/**
 * @swagger
 * /api/master-checklist/assignable/manpower/filters:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get manpower filter options (employee numbers, types and statuses)
 *     responses:
 *       200:
 *         description: Filter options retrieved successfully
 */
router.get(
  "/assignable/manpower/filters",
  verifyToken,
  getAssignableManpowerFilters
);

/**
 * @swagger
 * /api/master-checklist/assignable/attachments:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get all assignable attachments with filtering
 *     parameters:
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
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by attachment number, product name, serial number, etc.
 *       - in: query
 *         name: product_name
 *         schema:
 *           type: string
 *         description: Filter by product name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [day-off, idle, major-breakdown, minor-breakdown, inspection, public-holiday, asset-defleet, new-asset, allocated]
 *         description: Filter by attachment status
 *     responses:
 *       200:
 *         description: List of assignable attachments retrieved successfully
 */
router.get("/assignable/attachments", verifyToken, getAllAssignableAttachments);

/**
 * @swagger
 * /api/master-checklist/assignable/attachments/filters:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get attachment filter options (product names and statuses)
 *     responses:
 *       200:
 *         description: Filter options retrieved successfully
 */
router.get(
  "/assignable/attachments/filters",
  verifyToken,
  getAssignableAttachmentFilters
);

/**
 * @swagger
 * /api/master-checklist/equipment/{serial_number}/assigned-checklists:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get all assigned checklists for specific equipment
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: integer
 */
router.get(
  "/equipment/:serial_number/assigned-checklists",
  verifyToken,
  getEquipmentAssignedChecklists
);

/**
 * @swagger
 * /api/master-checklist/equipment/{serial_number}/template/{assignment_id}:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get checklist template details for equipment assignment
 *     parameters:
 *       - in: path
 *         name: serial_number
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: assignment_id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get(
  "/equipment/:serial_number/template/:assignment_id",
  verifyToken,
  getEquipmentChecklistTemplate
);
// Update the template save route to handle file upload
router.post(
  "/template/:id",
  verifyToken,
  uploadChecklistTemplate.single("template_file"),
  saveChecklistTemplateWithFile
);

// Add route to serve template files
router.get("/template-file/:filename", verifyToken, serveTemplateFile);

// // Add route to download template for equipment
// router.get(
//   "/equipment/:serial_number/download-template/:assignment_id",
//   verifyToken,
//   downloadEquipmentTemplate
// );
router.get(
  "/manpower/:manpower_id/download-template/:assignment_id",
  verifyToken,
  downloadManpowerTemplate
);

router.get(
  "/manpower/:manpower_id/assigned-checklists",
  verifyToken,
  getManpowerAssignedChecklists
);

// Get assignment count for a checklist (must be before /:id routes)
router.get(
  "/assignments/count/:checklist_id",
  verifyToken,
  getChecklistAssignmentCount
);

/**
 * @swagger
 * /master-checklist/delivery-note-checklists:
 *   post:
 *     summary: Get assigned delivery note checklists for specific resources
 *     tags: [Master Checklist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resource_type
 *               - resource_ids
 *             properties:
 *               resource_type:
 *                 type: string
 *                 enum: [Equipment, Manpower, Attachment]
 *               resource_ids:
 *                 type: array
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                     - type: number
 *     responses:
 *       200:
 *         description: Delivery note checklists retrieved successfully
 */
router.post(
  '/delivery-note-checklists',
  verifyToken,
  getDeliveryNoteChecklists
);

/**
 * @swagger
 * /master-checklist/delivery-note-template/download/{assignment_id}:
 *   get:
 *     summary: Download delivery note checklist template
 *     tags: [Master Checklist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignment_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Template file downloaded
 */
router.get(
  '/delivery-note-template/download/:assignment_id',
  verifyToken,
  downloadDeliveryNoteTemplate
);

router.get('/debug/checklist-types', verifyToken, getAllChecklistTypes);


/**
 * @swagger
 * /api/master-checklist/assignments/detailed/{id}:
 *   get:
 *     tags:
 *       - Master Checklist Assignments
 *     summary: Get detailed assigned resources for a checklist
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Checklist ID
 *     responses:
 *       200:
 *         description: Detailed assignments retrieved successfully
 */
router.get("/assignments/detailed/:id", verifyToken, getDetailedAssignedResources);

router.post(
  '/off-hire-checklists',
  verifyToken,
  getOffHireNoteChecklists
);

router.get(
  '/off-hire-template/download/:assignment_id',
  verifyToken,
  downloadOffHireNoteTemplate
);

router.get(
  "/equipment/:serial_number/download-template/:assignment_id",
  verifyToken,
  downloadOHNEquipmentTemplate   // NOTE: this route already exists for DN (downloadEquipmentTemplate)
                                  // → the existing route already works for equipment!
                                  // Only manpower & attachment need new OHN-specific routes IF
                                  // they share the same URL pattern. See note below.
);

router.get(
  "/manpower/:manpower_id/download-template/:assignment_id",
  verifyToken,
  downloadOHNManpowerTemplate    // replaces / supplements downloadManpowerTemplate
);

router.get(
  "/attachment/:attachment_id/download-template/:assignment_id",
  verifyToken,
  downloadOHNAttachmentTemplate  // replaces / supplements downloadAttachmentTemplate
);

module.exports = router;
