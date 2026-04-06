// controllers/fleet-management/masterChecklistController.js
const UsersModel = require("../../../user-management-service/src/models/UsersModel");
const {
  MasterChecklistModel,
  ChecklistTemplateModel,
  ChecklistCategoryModel,
  ChecklistItemModel,
  AssignedChecklistModel,
} = require("../models/MasterChecklistModel");
const sequelize = require("../../src/config/dbSync");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const { jsPDF } = require("jspdf");
require("jspdf-autotable");

// ADD THIS HELPER FUNCTION after imports
const generateReferenceNumber = async (category, checklistType) => {
  try {
    // Get year and month
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Category prefix mapping
    const categoryPrefix = {
      Equipment: "EQ",
      Attachment: "AT",
      Manpower: "MP",
    };

    // Type prefix mapping
    const typePrefix = {
      "Daily checklist Prior Before start the work": "DP",
      "Daily checklist Post After completing the shift": "DPS",
      "Weekly checklist": "WK",
      "Monthly checklist": "MN",
      "Delivery note checklist By client": "DNC",
      "Off hire note checklist By client": "OHC",
      "Pre checklist by Auto Expert Delivery note": "PDN",
      "Pre checklist by Auto Expert Off hire note": "POH",
    };

    const catPrefix = categoryPrefix[category] || "XX";
    const typeCode = typePrefix[checklistType] || "XX";

    // Find the latest reference number for this category/type/year/month
    const latestTemplate = await ChecklistTemplateModel.findOne({
      where: {
        reference_number: {
          [Op.like]: `TMPL-${catPrefix}-${typeCode}-${year}${month}%`,
        },
      },
      order: [["reference_number", "DESC"]],
    });

    let sequenceNumber = 1;

    if (latestTemplate && latestTemplate.reference_number) {
      // Extract sequence number from the last reference
      const parts = latestTemplate.reference_number.split("-");
      const lastSequence = parseInt(parts[parts.length - 1]);
      sequenceNumber = lastSequence + 1;
    }

    // Format: TMPL-EQ-DP-202401-001
    const referenceNumber = `TMPL-${catPrefix}-${typeCode}-${year}${month}-${String(
      sequenceNumber,
    ).padStart(3, "0")}`;

    return referenceNumber;
  } catch (error) {
    console.error("Error generating reference number:", error);
    throw error;
  }
};

// Get all master checklists with filters

const getAllMasterChecklists = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      checklist_type,
      search,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    let whereClause = {};

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (checklist_type && checklist_type !== "all") {
      whereClause.checklist_type = checklist_type;
    }

    if (search) {
      whereClause.checklist_name = {
        [Op.like]: `%${search}%`,
      };
    }

    const { count, rows } = await MasterChecklistModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          attributes: ["template_id", "columns", "reference_number"],
          required: false, // LEFT JOIN to include checklists without templates
        },
      ],
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "ASC"]],
    });

    // Add has_template flag to each checklist
    const checklistsWithTemplateFlag = rows.map((checklist) => {
      const checklistData = checklist.toJSON();
      return {
        ...checklistData,
        has_template: !!checklistData.template, // true if template exists
      };
    });

    res.status(200).json({
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      checklists: checklistsWithTemplateFlag,
    });
  } catch (error) {
    console.error("Error fetching master checklists:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all templates with pagination
const getAllTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * parseInt(limit);

    let whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        sequelize.where(
          sequelize.fn("JSON_EXTRACT", sequelize.col("columns"), "$"),
          { [Op.like]: `%${search}%` },
        ),
        { "$checklist.checklist_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await ChecklistTemplateModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          attributes: [
            "checklist_id",
            "checklist_name",
            "category",
            "checklist_type",
          ],
        },
      ],
      offset,
      limit: parseInt(limit),
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      templates: rows,
    });
  } catch (error) {
    console.error("Error fetching all templates:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get template by ID with detailed information
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;

    const template = await ChecklistTemplateModel.findByPk(id, {
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          attributes: ["checklist_id", "category", "checklist_type"],
        },
        {
          model: ChecklistCategoryModel,
          as: "categories",
          include: [
            {
              model: ChecklistItemModel,
              as: "items",
              order: [["sort_order", "ASC"]],
            },
          ],
          order: [["sort_order", "ASC"]],
        },
      ],
      attributes: [
        "template_id",
        "reference_number",
        "document_code",
        "header_info",
        "footer_info",
        "instructions",
        "columns",
        "template_file_path",
        "template_file_name",
      ],
    });

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.status(200).json(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update template (partial update)
const updateTemplate = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Parse JSON strings from FormData if they exist
    let header_info,
      footer_info,
      instructions,
      columns,
      categories,
      update_mode;

    try {
      // Check if data is already parsed or needs parsing
      header_info =
        typeof req.body.header_info === "string"
          ? JSON.parse(req.body.header_info)
          : req.body.header_info;

      footer_info =
        typeof req.body.footer_info === "string"
          ? JSON.parse(req.body.footer_info)
          : req.body.footer_info;

      instructions = req.body.instructions || "";

      columns =
        typeof req.body.columns === "string"
          ? JSON.parse(req.body.columns)
          : req.body.columns;

      categories =
        typeof req.body.categories === "string"
          ? JSON.parse(req.body.categories)
          : req.body.categories;

      update_mode = req.body.update_mode || "full";

      console.log("Parsed categories:", categories);
      console.log("Categories is array:", Array.isArray(categories));
    } catch (parseError) {
      console.error("Parse error:", parseError);
      await transaction.rollback();
      return res.status(400).json({
        message: "Invalid JSON data in request",
        error: parseError.message,
      });
    }

    const template = await ChecklistTemplateModel.findByPk(id, {
      transaction,
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
        },
      ],
    });

    if (!template) {
      await transaction.rollback();
      return res.status(404).json({ message: "Template not found" });
    }

    // Update template fields
    const updateData = {};

    if (header_info !== undefined) {
      updateData.header_info = header_info;
    }

    if (footer_info !== undefined) {
      updateData.footer_info = footer_info;
    }

    if (instructions !== undefined) {
      updateData.instructions = instructions;
    }

    if (columns !== undefined) {
      updateData.columns = columns;
    }

    if (req.body.document_code !== undefined) {
      updateData.document_code =
        req.body.document_code || "AXTS.OPS.WDC.23- Rev - 0";
    }

    // Handle file upload
    if (req.file) {
      // Determine the correct path based on checklist category
      let uploadFolder;
      if (template.checklist.category === "Attachment") {
        uploadFolder = "checklist-attachment-templates";
      } else if (template.checklist.category === "Manpower") {
        uploadFolder = "checklist-manpower-templates";
      } else {
        uploadFolder = "checklist-templates";
      }

      updateData.template_file_path = `/uploads/${uploadFolder}/${req.file.filename}`;
      updateData.template_file_name = req.file.originalname;
      updateData.template_file_size = req.file.size;

      // Delete old file if exists
      if (template.template_file_path) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          template.template_file_path,
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    if (Object.keys(updateData).length > 0) {
      await template.update(updateData, { transaction });
    }

    // Handle categories based on update mode
    if (categories !== undefined && Array.isArray(categories)) {
      if (update_mode === "full") {
        // Remove existing categories and items
        const existingCategories = await ChecklistCategoryModel.findAll({
          where: { template_id: id },
          transaction,
        });

        for (const category of existingCategories) {
          await ChecklistItemModel.destroy({
            where: { category_id: category.category_id },
            transaction,
          });
        }

        await ChecklistCategoryModel.destroy({
          where: { template_id: id },
          transaction,
        });

        // Create new categories and items
        if (categories.length > 0) {
          for (const [index, categoryData] of categories.entries()) {
            const category = await ChecklistCategoryModel.create(
              {
                template_id: id,
                category_name: categoryData.category_name || categoryData.name,
                sort_order: categoryData.sort_order || index,
              },
              { transaction },
            );

            if (categoryData.items && categoryData.items.length > 0) {
              const items = categoryData.items.map((item, itemIndex) => ({
                category_id: category.category_id,
                item_name: item.item_name || item.name,
                sort_order: item.sort_order || itemIndex,
              }));

              await ChecklistItemModel.bulkCreate(items, { transaction });
            }
          }
        }
      } else if (update_mode === "partial") {
        // Handle partial updates to categories and items
        for (const categoryData of categories) {
          if (categoryData.category_id) {
            // Update existing category
            const category = await ChecklistCategoryModel.findByPk(
              categoryData.category_id,
              { transaction },
            );

            if (category) {
              await category.update(
                {
                  category_name:
                    categoryData.category_name || category.category_name,
                  sort_order:
                    categoryData.sort_order !== undefined
                      ? categoryData.sort_order
                      : category.sort_order,
                },
                { transaction },
              );

              // Handle items within the category
              if (categoryData.items && Array.isArray(categoryData.items)) {
                for (const itemData of categoryData.items) {
                  if (itemData.item_id) {
                    // Update existing item
                    const item = await ChecklistItemModel.findByPk(
                      itemData.item_id,
                      { transaction },
                    );

                    if (item) {
                      await item.update(
                        {
                          item_name: itemData.item_name || item.item_name,
                          sort_order:
                            itemData.sort_order !== undefined
                              ? itemData.sort_order
                              : item.sort_order,
                        },
                        { transaction },
                      );
                    }
                  } else {
                    // Create new item
                    await ChecklistItemModel.create(
                      {
                        category_id: category.category_id,
                        item_name: itemData.item_name,
                        sort_order: itemData.sort_order || 0,
                      },
                      { transaction },
                    );
                  }
                }
              }
            }
          } else {
            // Create new category
            const category = await ChecklistCategoryModel.create(
              {
                template_id: id,
                category_name: categoryData.category_name || categoryData.name,
                sort_order: categoryData.sort_order || 0,
              },
              { transaction },
            );

            // Create items for new category
            if (categoryData.items && categoryData.items.length > 0) {
              const items = categoryData.items.map((item, itemIndex) => ({
                category_id: category.category_id,
                item_name: item.item_name || item.name,
                sort_order: item.sort_order || itemIndex,
              }));

              await ChecklistItemModel.bulkCreate(items, { transaction });
            }
          }
        }
      }
    }

    await transaction.commit();

    const updatedTemplate = await ChecklistTemplateModel.findByPk(id, {
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          attributes: [
            "checklist_id",
            "checklist_name",
            "category",
            "checklist_type",
          ],
        },
        {
          model: ChecklistCategoryModel,
          as: "categories",
          include: [
            {
              model: ChecklistItemModel,
              as: "items",
              order: [["sort_order", "ASC"]],
            },
          ],
          order: [["sort_order", "ASC"]],
        },
      ],
      attributes: [
        "template_id",
        "reference_number",
        "document_code",
        "header_info",
        "footer_info",
        "instructions",
        "columns",
        "template_file_path",
        "template_file_name",
      ],
    });

    res.status(200).json({
      message: "Template updated successfully",
      template: updatedTemplate,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating template:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create new checklist
const createMasterChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { checklist_name, category, checklist_type } = req.body;

    if (!checklist_name || !category || !checklist_type) {
      await transaction.rollback();
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        username = user.username;
      }
    }

    // Create checklist
    const checklist = await MasterChecklistModel.create(
      {
        checklist_name,
        category,
        checklist_type,
        created_by: username || "System",
      },
      { transaction },
    );

    await transaction.commit();

    const createdChecklist = await MasterChecklistModel.findByPk(
      checklist.checklist_id,
      {
        include: [
          {
            model: ChecklistTemplateModel,
            as: "template",
          },
        ],
      },
    );

    res.status(201).json({
      message: "Master checklist created successfully",
      checklist: createdChecklist,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error creating master checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get checklist by ID
const getMasterChecklistById = async (req, res) => {
  try {
    const { id } = req.params;

    const checklist = await MasterChecklistModel.findByPk(id, {
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          include: [
            {
              model: ChecklistCategoryModel,
              as: "categories",
              include: [
                {
                  model: ChecklistItemModel,
                  as: "items",
                  order: [["sort_order", "ASC"]],
                },
              ],
              order: [["sort_order", "ASC"]],
            },
          ],
        },
      ],
    });

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.status(200).json(checklist);
  } catch (error) {
    console.error("Error fetching checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update checklist
const updateMasterChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      checklist_name,
      category,
      checklist_type,
      is_active,
      is_published,
    } = req.body;

    const checklist = await MasterChecklistModel.findByPk(id, { transaction });

    if (!checklist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Checklist not found" });
    }

    await checklist.update(
      {
        checklist_name: checklist_name || checklist.checklist_name,
        category: category || checklist.category,
        checklist_type: checklist_type || checklist.checklist_type,
        template_type: template_type || checklist.template_type,
        is_active: is_active !== undefined ? is_active : checklist.is_active,
        is_published:
          is_published !== undefined ? is_published : checklist.is_published,
      },
      { transaction },
    );

    await transaction.commit();

    const updatedChecklist = await MasterChecklistModel.findByPk(id, {
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
        },
      ],
    });

    res.status(200).json({
      message: "Checklist updated successfully",
      checklist: updatedChecklist,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error updating checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete checklist
const deleteMasterChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const checklist = await MasterChecklistModel.findByPk(id, { transaction });

    if (!checklist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Checklist not found" });
    }

    await checklist.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      message: "Checklist deleted successfully",
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error deleting checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// Duplicate checklist
const duplicateMasterChecklist = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { new_checklist_name } = req.body;

    if (!new_checklist_name) {
      await transaction.rollback();
      return res.status(400).json({
        message: "New checklist name is required",
      });
    }

    const originalChecklist = await MasterChecklistModel.findByPk(id, {
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          include: [
            {
              model: ChecklistCategoryModel,
              as: "categories",
              include: [
                {
                  model: ChecklistItemModel,
                  as: "items",
                },
              ],
            },
          ],
        },
      ],
      transaction,
    });

    if (!originalChecklist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Checklist not found" });
    }

    let username = "System";
    if (req.user?.uid) {
      const user = await UsersModel.findByPk(req.user.uid);
      if (user) {
        username = user.username;
      }
    }

    // Create new checklist - IMPORTANT: Set is_published to false
    const newChecklist = await MasterChecklistModel.create(
      {
        checklist_name: new_checklist_name,
        category: originalChecklist.category,
        checklist_type: originalChecklist.checklist_type,
        is_active: true,
        is_published: false, // START AS UNPUBLISHED
        created_by: username,
      },
      { transaction },
    );

    // Duplicate template if exists
    if (originalChecklist.template) {
      // Generate new reference number for the duplicated template
      const referenceNumber = await generateReferenceNumber(
        originalChecklist.category,
        originalChecklist.checklist_type,
      );

      const newTemplate = await ChecklistTemplateModel.create(
        {
          checklist_id: newChecklist.checklist_id,
          header_info: originalChecklist.template.header_info,
          footer_info: originalChecklist.template.footer_info,
          instructions: originalChecklist.template.instructions,
          columns: originalChecklist.template.columns,
          reference_number: referenceNumber,
          document_code: originalChecklist.template.document_code,
          template_file_path: originalChecklist.template.template_file_path,
          template_file_name: originalChecklist.template.template_file_name,
          template_file_size: originalChecklist.template.template_file_size,
        },
        { transaction },
      );

      // Duplicate categories and items
      if (
        originalChecklist.template.categories &&
        originalChecklist.template.categories.length > 0
      ) {
        for (const category of originalChecklist.template.categories) {
          const newCategory = await ChecklistCategoryModel.create(
            {
              template_id: newTemplate.template_id,
              category_name: category.category_name,
              sort_order: category.sort_order,
            },
            { transaction },
          );

          if (category.items && category.items.length > 0) {
            const newItems = category.items.map((item) => ({
              category_id: newCategory.category_id,
              item_name: item.item_name,
              sort_order: item.sort_order,
            }));

            await ChecklistItemModel.bulkCreate(newItems, { transaction });
          }
        }
      }
    }

    await transaction.commit();

    const duplicatedChecklist = await MasterChecklistModel.findByPk(
      newChecklist.checklist_id,
      {
        include: [
          {
            model: ChecklistTemplateModel,
            as: "template",
            attributes: ["template_id", "reference_number"],
          },
        ],
      },
    );

    res.status(201).json({
      message: "Checklist duplicated successfully. Template is ready to edit.",
      checklist: {
        ...duplicatedChecklist.toJSON(),
        has_template: !!duplicatedChecklist.template,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error duplicating checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

const saveChecklistTemplate = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    console.log("=== TEMPLATE SAVE REQUEST ===");
    console.log("Checklist ID:", id);
    console.log("Has file:", !!req.file);
    console.log("Body keys:", Object.keys(req.body));

    // Parse JSON strings from FormData
    let header_info, footer_info, instructions, columns, categories;

    try {
      header_info = req.body.header_info
        ? JSON.parse(req.body.header_info)
        : null;
      footer_info = req.body.footer_info
        ? JSON.parse(req.body.footer_info)
        : null;
      instructions = req.body.instructions || "";
      columns = req.body.columns ? JSON.parse(req.body.columns) : [];
      categories = req.body.categories ? JSON.parse(req.body.categories) : [];

      console.log("Parsed successfully");
      console.log("Categories count:", categories.length);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      await transaction.rollback();
      return res.status(400).json({
        message: "Invalid JSON data in request",
        error: parseError.message,
      });
    }

    const checklist = await MasterChecklistModel.findByPk(id, { transaction });

    if (!checklist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Checklist not found" });
    }

    // Check if template already exists
    let template = await ChecklistTemplateModel.findOne({
      where: { checklist_id: id },
      transaction,
    });

    let referenceNumber;
    if (!template) {
      // Only generate for new templates
      referenceNumber = await generateReferenceNumber(
        checklist.category,
        checklist.checklist_type,
      );
    }

    // Handle file upload - MODIFIED to use different paths based on category
    let templateFileData = {};
    if (req.file) {
      console.log("File uploaded:", req.file.filename);

      // Determine the correct path based on checklist category
      let uploadFolder;
      if (checklist.category === "Attachment") {
        uploadFolder = "checklist-attachment-templates";
      } else if (checklist.category === "Manpower") {
        uploadFolder = "checklist-manpower-templates";
      } else {
        uploadFolder = "checklist-templates";
      }

      templateFileData = {
        template_file_path: `/uploads/${uploadFolder}/${req.file.filename}`,
        template_file_name: req.file.originalname,
        template_file_size: req.file.size,
      };

      // Delete old file if exists
      if (template && template.template_file_path) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          template.template_file_path,
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
          console.log("Old file deleted");
        }
      }
    } else {
      console.warn("WARNING: No file uploaded!");
    }

    if (template) {
      // Update existing template
      await template.update(
        {
          header_info,
          footer_info,
          instructions,
          columns,
          document_code: req.body.document_code || "AXTS.OPS.WDC.23- Rev - 0",
          ...templateFileData,
        },
        { transaction },
      );
      console.log("Template updated");

      // Remove existing categories and items
      const existingCategories = await ChecklistCategoryModel.findAll({
        where: { template_id: template.template_id },
        transaction,
      });

      for (const category of existingCategories) {
        await ChecklistItemModel.destroy({
          where: { category_id: category.category_id },
          transaction,
        });
      }

      await ChecklistCategoryModel.destroy({
        where: { template_id: template.template_id },
        transaction,
      });
    } else {
      // Create new template
      template = await ChecklistTemplateModel.create(
        {
          checklist_id: id,
          header_info,
          footer_info,
          instructions,
          columns,
          reference_number: referenceNumber,
          document_code: req.body.document_code || "AXTS.OPS.WDC.23- Rev - 0", // ADD THIS LINE
          ...templateFileData,
        },
        { transaction },
      );
      console.log("New template created, ID:", template.template_id);
    }

    // Create new categories and items
    if (categories && Array.isArray(categories) && categories.length > 0) {
      for (const [index, categoryData] of categories.entries()) {
        const category = await ChecklistCategoryModel.create(
          {
            template_id: template.template_id,
            category_name: categoryData.name,
            sort_order: index,
          },
          { transaction },
        );

        if (
          categoryData.items &&
          Array.isArray(categoryData.items) &&
          categoryData.items.length > 0
        ) {
          const items = categoryData.items.map((item, itemIndex) => ({
            category_id: category.category_id,
            item_name: item.item_name,
            sort_order: itemIndex,
          }));

          await ChecklistItemModel.bulkCreate(items, { transaction });
        }
      }
      console.log("Categories and items created");
    }

    await transaction.commit();
    console.log("Transaction committed successfully");

    const updatedChecklist = await MasterChecklistModel.findByPk(id, {
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          attributes: [
            "template_id",
            "reference_number",
            "document_code",
            "header_info",
            "footer_info",
            "instructions",
            "columns",
            "template_file_path",
            "template_file_name",
            "template_file_size",
          ],
          include: [
            {
              model: ChecklistCategoryModel,
              as: "categories",
              include: [
                {
                  model: ChecklistItemModel,
                  as: "items",
                  order: [["sort_order", "ASC"]],
                },
              ],
              order: [["sort_order", "ASC"]],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message:
        "Template saved successfully. You can now publish it from the checklist list.",
      checklist: updatedChecklist,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving template:", error);
    res.status(500).json({ error: error.message });
  }
};

const assignChecklistToResources = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { resources } = req.body;

    console.log("=== ASSIGN CHECKLIST ===");
    console.log("Checklist ID:", id);
    console.log("Resources to assign:", resources);

    const checklist = await MasterChecklistModel.findByPk(id, {
      transaction,
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          required: true,
        },
      ],
    });

    if (!checklist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Checklist not found" });
    }

    if (!checklist.template) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ message: "Checklist must have a template before assignment" });
    }

    console.log("Template ID:", checklist.template.template_id);
    console.log("Template file path:", checklist.template.template_file_path);

    if (!resources || !Array.isArray(resources) || resources.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Resources are required" });
    }

    const assignmentResults = [];
    const replacedAssignments = [];

    for (const resource of resources) {
      console.log("Processing resource:", resource.id);

      // Check if there's an existing assignment of the same checklist_type for this resource
      const existingAssignment = await AssignedChecklistModel.findOne({
        where: {
          resource_id: resource.id,
          resource_type: checklist.category,
          checklist_type: checklist.checklist_type,
          is_active: true,
        },
        include: [
          {
            model: MasterChecklistModel,
            as: "checklist",
            attributes: ["checklist_name", "checklist_type"],
          },
        ],
        transaction,
      });

      if (existingAssignment) {
        // Deactivate the old assignment
        await existingAssignment.update(
          {
            is_active: false,
          },
          { transaction },
        );

        console.log(
          "Deactivated old assignment:",
          existingAssignment.assignment_id,
        );

        replacedAssignments.push({
          resource_id: resource.id,
          old_checklist: existingAssignment.checklist.checklist_name,
          old_assignment_id: existingAssignment.assignment_id,
        });
      }

      if (req.user?.uid) {
        const user = await UsersModel.findByPk(req.user.uid);
        if (user) {
          username = user.username;
        }
      }

      // Create new assignment with template_id
      const newAssignment = await AssignedChecklistModel.create(
        {
          checklist_id: id,
          template_id: checklist.template.template_id, // IMPORTANT: Include template_id
          resource_id: resource.id,
          resource_type: checklist.category,
          checklist_type: checklist.checklist_type,
          assigned_by: username || "System",
          replaced_assignment_id: existingAssignment
            ? existingAssignment.assignment_id
            : null,
        },
        { transaction },
      );

      console.log("Created new assignment:", newAssignment.assignment_id);

      assignmentResults.push(newAssignment);
    }

    await transaction.commit();
    console.log("Assignment completed successfully");

    const responseMessage =
      replacedAssignments.length > 0
        ? `Checklist assigned to ${
            resources.length
          } ${checklist.category.toLowerCase()}(s). ${
            replacedAssignments.length
          } previous assignment(s) of the same type were replaced.`
        : `Checklist assigned to ${
            resources.length
          } ${checklist.category.toLowerCase()}(s) successfully`;

    res.status(200).json({
      message: responseMessage,
      assignments: assignmentResults.length,
      replaced: replacedAssignments.length,
      replacementDetails: replacedAssignments,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error assigning checklist:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW FUNCTION: Get assigned checklists for a specific equipment
const getEquipmentAssignedChecklists = async (req, res) => {
  try {
    const { serial_number } = req.params;

    // Verify equipment exists
    const EquipmentModel = require("../models/EquipmentModel");
    const equipment = await EquipmentModel.findByPk(serial_number);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Get all active assignments for this equipment
    const assignments = await AssignedChecklistModel.findAll({
      where: {
        resource_id: serial_number,
        resource_type: "Equipment",
        is_active: true,
      },
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          attributes: [
            "checklist_id",
            "checklist_name",
            "category",
            "checklist_type",
          ],
        },
        {
          model: ChecklistTemplateModel,
          as: "template",
          attributes: ["template_id", "header_info", "columns"],
        },
      ],
      order: [["assigned_at", "DESC"]],
    });

    // Group by checklist type for easy display
    const groupedAssignments = assignments.reduce((acc, assignment) => {
      const type = assignment.checklist_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        assignment_id: assignment.assignment_id,
        checklist_id: assignment.checklist_id,
        checklist_name: assignment.checklist.checklist_name,
        template_id: assignment.template_id,
        assigned_by: assignment.assigned_by,
        assigned_at: assignment.assigned_at,
        checklist_type: assignment.checklist_type,
      });
      return acc;
    }, {});

    res.status(200).json({
      equipment_id: serial_number,
      total_assignments: assignments.length,
      assignments: assignments,
      grouped_by_type: groupedAssignments,
    });
  } catch (error) {
    console.error("Error fetching equipment assigned checklists:", error);
    res.status(500).json({ error: error.message });
  }
};

// NEW FUNCTION: Download/Print checklist template for equipment
const getEquipmentChecklistTemplate = async (req, res) => {
  try {
    const { serial_number, assignment_id } = req.params;

    const assignment = await AssignedChecklistModel.findOne({
      where: {
        assignment_id: assignment_id,
        resource_id: serial_number,
        resource_type: "Equipment",
        is_active: true,
      },
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
        },
        {
          model: ChecklistTemplateModel,
          as: "template",
          include: [
            {
              model: ChecklistCategoryModel,
              as: "categories",
              include: [
                {
                  model: ChecklistItemModel,
                  as: "items",
                  order: [["sort_order", "ASC"]],
                },
              ],
              order: [["sort_order", "ASC"]],
            },
          ],
        },
      ],
    });

    if (!assignment) {
      return res
        .status(404)
        .json({ message: "Assignment not found or inactive" });
    }

    // Get equipment details
    const EquipmentModel = require("../models/EquipmentModel");
    const equipment = await EquipmentModel.findByPk(serial_number, {
      include: [
        {
          model: require("../../../hr-service/src/models/employees/EmployeeModel"),
          as: "employee",
          attributes: ["id", "personalDetails"],
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetCategoryModel"),
          as: "category",
        },
        {
          model: require("../../../fixed-assets-service/src/models/AssetSubcategoryModel"),
          as: "subcategory",
        },
      ],
    });

    res.status(200).json({
      assignment: {
        assignment_id: assignment.assignment_id,
        assigned_at: assignment.assigned_at,
        assigned_by: assignment.assigned_by,
      },
      checklist: assignment.checklist,
      template: assignment.template,
      equipment: {
        serial_number: equipment.serial_number,
        reg_number: equipment.reg_number,
        description: equipment.description,
        category:
          equipment.category?.category_name || equipment.category_name_custom,
        subcategory:
          equipment.subcategory?.subcategory_name ||
          equipment.subcategory_name_custom,
        operator: equipment.employee?.personalDetails?.fullNameEnglish,
      },
    });
  } catch (error) {
    console.error("Error fetching checklist template:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get assigned resources for a checklist
const getAssignedResources = async (req, res) => {
  try {
    const { id } = req.params;

    const assignments = await AssignedChecklistModel.findAll({
      where: { checklist_id: id },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      assignments,
    });
  } catch (error) {
    console.error("Error fetching assigned resources:", error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle checklist publish status
const togglePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    const checklist = await MasterChecklistModel.findByPk(id);

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    await checklist.update({
      is_published:
        is_published !== undefined ? is_published : !checklist.is_published,
    });

    res.status(200).json({
      message: `Checklist ${
        checklist.is_published ? "published" : "unpublished"
      } successfully`,
      checklist,
    });
  } catch (error) {
    console.error("Error toggling publish status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Toggle checklist active status
const toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    const checklist = await MasterChecklistModel.findByPk(id);

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    await checklist.update({
      is_active: is_active !== undefined ? is_active : !checklist.is_active,
    });

    res.status(200).json({
      message: `Checklist ${
        checklist.is_active ? "activated" : "deactivated"
      } successfully`,
      checklist,
    });
  } catch (error) {
    console.error("Error toggling active status:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all assignable equipment with filtering
const getAllAssignableEquipment = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category_id,
      subcategory_id,
      status,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const EquipmentModel = require("../models/EquipmentModel");
    const AssignedChecklistModel =
      require("../models/MasterChecklistModel").AssignedChecklistModel;
    const AssetCategoryModel = require("../../../fixed-assets-service/src/models/AssetCategoryModel");
    const AssetSubcategoryModel = require("../../../fixed-assets-service/src/models/AssetSubcategoryModel");

    let whereClause = {
      status: "Active",
    };

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { reg_number: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { VIN: { [Op.like]: `%${search}%` } },
        { "$category.category_name$": { [Op.like]: `%${search}%` } },
        { "$subcategory.subcategory_name$": { [Op.like]: `%${search}%` } },
      ];
    }

    // Category filter
    if (category_id && category_id !== "all") {
      whereClause.category_id = category_id;
    }

    // Subcategory filter
    if (subcategory_id && subcategory_id !== "all") {
      whereClause.subcategory_id = subcategory_id;
    }

    // Status filter
    if (status && status !== "all") {
      whereClause.equipment_status = status;
    }

    const { count, rows } = await EquipmentModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: AssetCategoryModel,
          as: "category",
          attributes: ["category_id", "category_name"],
        },
        {
          model: AssetSubcategoryModel,
          as: "subcategory",
          attributes: ["subcategory_id", "subcategory_name"],
        },
      ],
      attributes: [
        "serial_number",
        "reg_number",
        "description",
        "VIN",
        "vehicle_type",
        "year_of_manufacture",
        "equipment_status",
        "status",
        "created_at",
      ],
      offset,
      limit: parseInt(limit),
      order: [["reg_number", "ASC"]],
    });

    // Get assignment counts for each equipment
    const equipmentWithAssignments = await Promise.all(
      rows.map(async (equipment) => {
        const assignmentCount = await AssignedChecklistModel.count({
          where: {
            resource_id: equipment.serial_number,
            resource_type: "Equipment",
            is_active: true,
          },
        });

        return {
          ...equipment.toJSON(),
          assignment_count: assignmentCount,
        };
      }),
    );

    res.status(200).json({
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      equipment: equipmentWithAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignable equipment:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get assignable equipment categories for filtering
const getAssignableEquipmentCategories = async (req, res) => {
  try {
    const AssetCategoryModel = require("../../../fixed-assets-service/src/models/AssetCategoryModel");
    const AssetSubcategoryModel = require("../../../fixed-assets-service/src/models/AssetSubcategoryModel");
    const EquipmentModel = require("../models/EquipmentModel");
    const sequelize = require("../../src/config/dbSync");

    // Get categories with their subcategories
    const categories = await AssetCategoryModel.findAll({
      where: { status: "Active" },
      include: [
        {
          model: AssetSubcategoryModel,
          as: "subcategories",
          attributes: ["subcategory_id", "subcategory_name"],
          where: { status: "Active" },
          required: false,
        },
      ],
      order: [["category_name", "ASC"]],
    });

    // Get unique equipment statuses
    const statuses = await EquipmentModel.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("equipment_status")),
          "equipment_status",
        ],
      ],
      where: {
        status: "Active",
      },
      raw: true,
    });

    res.status(200).json({
      categories,
      statuses: statuses.map((s) => s.equipment_status).filter((s) => s),
    });
  } catch (error) {
    console.error("Error fetching equipment categories:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllAssignableManpower = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      employeeNo,
      employeeType,
      status,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
    const AssignedChecklistModel =
      require("../../models/fleet-management/MasterChecklistModel").AssignedChecklistModel;

    let whereClause = {
      status: "Active",
    };

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { employeeFullName: { [Op.like]: `%${search}%` } },
        { employeeNo: { [Op.like]: `%${search}%` } },
        { contractNo: { [Op.like]: `%${search}%` } },
      ];
    }

    // Employee No filter
    if (employeeNo && employeeNo !== "all") {
      whereClause.employeeNo = employeeNo;
    }

    // Employee Type filter
    if (employeeType && employeeType !== "all") {
      whereClause.employeeType = employeeType;
    }

    // Status filter
    if (status && status !== "all") {
      whereClause.manpower_status = status;
    }

    // REMOVED: Don't exclude assigned manpower anymore
    // Manpower can have multiple checklists assigned

    const { count, rows } = await ManpowerModel.findAndCountAll({
      where: whereClause,
      attributes: [
        "manpower_id",
        "employeeNo",
        "employeeFullName",
        "contractNo",
        "contractType",
        "employeeType",
        "employeeStatus",
        "manpower_status",
        "status",
        "created_at",
      ],
      offset,
      limit: parseInt(limit),
      order: [["employeeFullName", "ASC"]],
    });

    // Get assignment counts for each manpower
    const manpowerWithAssignments = await Promise.all(
      rows.map(async (manpower) => {
        const assignmentCount = await AssignedChecklistModel.count({
          where: {
            resource_id: manpower.manpower_id,
            resource_type: "Manpower",
            is_active: true,
          },
        });

        return {
          ...manpower.toJSON(),
          assignment_count: assignmentCount,
        };
      }),
    );

    res.status(200).json({
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      manpower: manpowerWithAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignable manpower:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get assignable manpower filters
const getAssignableManpowerFilters = async (req, res) => {
  try {
    const ManpowerModel = require("../../models/fleet-management/ManpowerModel");

    // Get unique employee numbers
    const employeeNos = await ManpowerModel.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("employeeNo")), "employeeNo"],
      ],
      where: {
        status: "Active",
      },
      order: [["employeeNo", "ASC"]],
      raw: true,
    });

    // Get unique employee types
    const employeeTypes = await ManpowerModel.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("employeeType")),
          "employeeType",
        ],
      ],
      where: {
        status: "Active",
      },
      order: [["employeeType", "ASC"]],
      raw: true,
    });

    // Get unique manpower statuses
    const statuses = await ManpowerModel.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("manpower_status")),
          "manpower_status",
        ],
      ],
      where: {
        status: "Active",
      },
      raw: true,
    });

    res.status(200).json({
      employeeNos: employeeNos.map((e) => e.employeeNo).filter((e) => e),
      employeeTypes: employeeTypes.map((e) => e.employeeType).filter((e) => e),
      statuses: statuses.map((s) => s.manpower_status).filter((s) => s),
    });
  } catch (error) {
    console.error("Error fetching manpower filters:", error);
    res.status(500).json({ error: error.message });
  }
};

// // Get all assignable attachments with filtering
const getAllAssignableAttachments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, product_name, status } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
    const AssignedChecklistModel =
      require("../../models/fleet-management/MasterChecklistModel").AssignedChecklistModel;

    let whereClause = {
      status: "Active",
    };

    // Search filter
    if (search) {
      whereClause[Op.or] = [
        { attachment_number: { [Op.like]: `%${search}%` } },
        { product_name: { [Op.like]: `%${search}%` } },
        { serial_number: { [Op.like]: `%${search}%` } },
        { equipment_type_compatibility: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { plate_number: { [Op.like]: `%${search}%` } },
      ];
    }

    // Product name filter
    if (product_name && product_name !== "all") {
      whereClause.product_name = product_name;
    }

    // Status filter
    if (status && status !== "all") {
      whereClause.attachment_status = status;
    }

    const { count, rows } = await AttachmentModel.findAndCountAll({
      where: whereClause,
      attributes: [
        "attachment_id",
        "attachment_number",
        "product_name",
        "serial_number",
        "equipment_type_compatibility",
        "location",
        "plate_number",
        "purchase_date",
        "status",
        "attachment_status",
        "created_at",
      ],
      offset,
      limit: parseInt(limit),
      order: [["attachment_number", "ASC"]],
    });

    // Get assignment counts for each attachment
    const attachmentsWithAssignments = await Promise.all(
      rows.map(async (attachment) => {
        const assignmentCount = await AssignedChecklistModel.count({
          where: {
            resource_id: attachment.attachment_id,
            resource_type: "Attachment",
            is_active: true,
          },
        });

        return {
          ...attachment.toJSON(),
          assignment_count: assignmentCount,
        };
      }),
    );

    res.status(200).json({
      totalCount: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
      attachments: attachmentsWithAssignments,
    });
  } catch (error) {
    console.error("Error fetching assignable attachments:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get assignable attachment filters
const getAssignableAttachmentFilters = async (req, res) => {
  try {
    const AttachmentModel = require("../../models/fleet-management/AttachmentModel");

    // Get unique product names
    const productNames = await AttachmentModel.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("product_name")),
          "product_name",
        ],
      ],
      where: {
        status: "Active",
      },
      order: [["product_name", "ASC"]],
      raw: true,
    });

    // Get unique attachment statuses
    const statuses = await AttachmentModel.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("attachment_status")),
          "attachment_status",
        ],
      ],
      where: {
        status: "Active",
      },
      raw: true,
    });

    res.status(200).json({
      productNames: productNames.map((p) => p.product_name).filter((p) => p),
      statuses: statuses.map((s) => s.attachment_status).filter((s) => s),
    });
  } catch (error) {
    console.error("Error fetching attachment filters:", error);
    res.status(500).json({ error: error.message });
  }
};
const saveChecklistTemplateWithFile = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { header_info, footer_info, instructions, columns, categories } =
      req.body;

    const checklist = await MasterChecklistModel.findByPk(id, { transaction });

    if (!checklist) {
      await transaction.rollback();
      return res.status(404).json({ message: "Checklist not found" });
    }

    // Check if template already exists
    let template = await ChecklistTemplateModel.findOne({
      where: { checklist_id: id },
      transaction,
    });

    // Handle file upload
    let templateFileData = {};
    if (req.file) {
      templateFileData = {
        template_file_path: `/uploads/checklist-templates/${req.file.filename}`,
        template_file_name: req.file.originalname,
        template_file_size: req.file.size,
      };

      // Delete old file if exists
      if (template && template.template_file_path) {
        const oldFilePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          template.template_file_path,
        );
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
    }

    if (template) {
      // Update existing template
      await template.update(
        {
          header_info,
          footer_info,
          instructions,
          columns,
          ...templateFileData,
        },
        { transaction },
      );

      // Remove existing categories and items
      const existingCategories = await ChecklistCategoryModel.findAll({
        where: { template_id: template.template_id },
        transaction,
      });

      for (const category of existingCategories) {
        await ChecklistItemModel.destroy({
          where: { category_id: category.category_id },
          transaction,
        });
      }

      await ChecklistCategoryModel.destroy({
        where: { template_id: template.template_id },
        transaction,
      });
    } else {
      // Create new template
      template = await ChecklistTemplateModel.create(
        {
          checklist_id: id,
          header_info,
          footer_info,
          instructions,
          columns,
          ...templateFileData,
        },
        { transaction },
      );
    }

    // Create new categories and items
    if (categories && categories.length > 0) {
      for (const [index, categoryData] of categories.entries()) {
        const category = await ChecklistCategoryModel.create(
          {
            template_id: template.template_id,
            category_name: categoryData.name,
            sort_order: index,
          },
          { transaction },
        );

        if (categoryData.items && categoryData.items.length > 0) {
          const items = categoryData.items.map((item, itemIndex) => ({
            category_id: category.category_id,
            item_name: item.item_name,
            sort_order: itemIndex,
          }));

          await ChecklistItemModel.bulkCreate(items, { transaction });
        }
      }
    }

    await transaction.commit();

    const updatedChecklist = await MasterChecklistModel.findByPk(id, {
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          include: [
            {
              model: ChecklistCategoryModel,
              as: "categories",
              include: [
                {
                  model: ChecklistItemModel,
                  as: "items",
                  order: [["sort_order", "ASC"]],
                },
              ],
              order: [["sort_order", "ASC"]],
            },
          ],
        },
      ],
    });

    res.status(200).json({
      message:
        "Template saved successfully. You can now publish it from the checklist list.",
      checklist: updatedChecklist,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saving template:", error);
    res.status(500).json({ error: error.message });
  }
};

// Serve template file
const serveTemplateFile = (req, res) => {
  const { filename } = req.params;

  const basePath = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "uploads",
    "checklist-templates",
  );
  const safePath = path.join(basePath, filename);

  // Security check to prevent directory traversal
  if (!safePath.startsWith(basePath)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (fs.existsSync(safePath)) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xls": "application/vnd.ms-excel",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

const generateEquipmentTemplatePDF = async ({
  assignment,
  equipment,
  template,
  checklist,
}) => {
  try {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = margin;

    // ===== HEADER SECTION =====
    // Border around header
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 50);

    // Logo (you can add actual logo if needed)
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 0, 0); // Red color for "A"
    doc.text("A", margin + 5, yPos + 10);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text("UTO XPERT", margin + 13, yPos + 10);

    // Title - "bbn" (checklist name)
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(checklist.checklist_name);
    doc.text(checklist.checklist_name, (pageWidth - titleWidth) / 2, yPos + 15);

    // Subtitle
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    const subtitle = "Report all problems immediately to supervisor";
    const subtitleWidth = doc.getTextWidth(subtitle);
    doc.text(subtitle, (pageWidth - subtitleWidth) / 2, yPos + 22);

    // Instructions
    yPos += 28;
    doc.setFontSize(9);
    const instructions =
      template.instructions ||
      "Please initial each day of use. Turn completed form in to Supervisor at the end of each week\n✓ - Satisfactory X - Unsatisfactory N/A - Not Applicable";

    const instructionLines = doc.splitTextToSize(
      instructions,
      pageWidth - 2 * margin - 10,
    );
    doc.text(instructionLines, margin + 5, yPos);
    yPos += instructionLines.length * 4;

    // Horizontal line separator
    doc.line(margin + 5, yPos, pageWidth - margin - 5, yPos);
    yPos += 5;

    // Dynamic Header Fields (Lable 1, Lable 2, etc.)
    if (template.header_info && template.header_info.custom_fields) {
      const fields = template.header_info.custom_fields.filter(
        (f) => f.enabled,
      );
      const fieldsPerRow = 2;
      const fieldWidth = (pageWidth - 2 * margin - 20) / fieldsPerRow;

      for (let i = 0; i < fields.length; i += fieldsPerRow) {
        let xPos = margin + 5;

        for (let j = 0; j < fieldsPerRow && i + j < fields.length; j++) {
          const field = fields[i + j];
          doc.setFont("helvetica", "bold");
          doc.text(`${field.label}:`, xPos, yPos);

          // Draw line for value
          const labelWidth = doc.getTextWidth(`${field.label}:`);
          doc.line(
            xPos + labelWidth + 2,
            yPos + 1,
            xPos + fieldWidth - 5,
            yPos + 1,
          );

          xPos += fieldWidth + 10;
        }
        yPos += 7;
      }
    }

    // ===== CHECKLIST TABLE =====
    yPos += 5;

    // Prepare table data
    const tableColumns = [
      { header: "#", dataKey: "num" },
      { header: "Item", dataKey: "item" },
    ];

    // Add dynamic columns (Mon, Tue, Wed, etc.)
    if (template.columns && Array.isArray(template.columns)) {
      template.columns.forEach((col) => {
        tableColumns.push({
          header: col.name,
          dataKey: col.id,
        });
      });
    }

    const tableData = [];
    let itemNumber = 1;

    // Process categories and items
    if (template.categories && Array.isArray(template.categories)) {
      template.categories.forEach((category) => {
        // Add category header row
        tableData.push({
          num: "",
          item: category.category_name,
          isCategory: true,
        });

        // Add items
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item) => {
            const rowData = {
              num: itemNumber.toString(),
              item: item.item_name,
              isCategory: false,
            };

            // Add empty cells for checkboxes
            if (template.columns) {
              template.columns.forEach((col) => {
                rowData[col.id] = "☐"; // Checkbox symbol
              });
            }

            tableData.push(rowData);
            itemNumber++;
          });
        }
      });
    }

    // Draw table with autoTable
    doc.autoTable({
      startY: yPos,
      columns: tableColumns,
      body: tableData,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [0, 0, 0],
        lineWidth: 0.5,
      },
      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: "bold",
        halign: "center",
        lineWidth: 0.5,
      },
      columnStyles: {
        num: { cellWidth: 15, halign: "center" },
        item: { cellWidth: 100, halign: "left" },
        // Checkbox columns
        ...Object.fromEntries(
          (template.columns || []).map((col) => [
            col.id,
            {
              cellWidth:
                (pageWidth - margin * 2 - 115) /
                (template.columns?.length || 1),
              halign: "center",
            },
          ]),
        ),
      },
      didParseCell: function (data) {
        // Style category rows
        if (data.row.raw.isCategory) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.fillColor = [240, 240, 240];
        }
      },
      didDrawCell: function (data) {
        // Draw checkboxes
        if (
          !data.row.raw.isCategory &&
          data.column.dataKey !== "num" &&
          data.column.dataKey !== "item"
        ) {
          const checkboxSize = 4;
          const x = data.cell.x + (data.cell.width - checkboxSize) / 2;
          const y = data.cell.y + (data.cell.height - checkboxSize) / 2;
          doc.setLineWidth(0.3);
          doc.rect(x, y, checkboxSize, checkboxSize);
        }
      },
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // ===== COMMENTS SECTION =====
    if (template.footer_info && template.footer_info.comments) {
      // Check if we need a new page
      if (yPos + 40 > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
      }

      doc.setLineWidth(0.5);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 35);

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Comments", margin + 3, yPos + 6);

      // Draw line under "Comments"
      doc.setLineWidth(0.3);
      doc.line(margin + 3, yPos + 8, pageWidth - margin - 3, yPos + 8);

      yPos += 35;
    }

    // ===== FOOTER SECTION =====
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 15);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    // Left: Reference number
    if (template.footer_info && template.footer_info.reference_number) {
      doc.text("Ref-Ops-Veh/Eqp-CL-MC80", margin + 3, yPos + 10);
    }

    // Center: Document code
    const centerText = "AXTS.OPS.WDC.23- Rev - 0";
    const centerTextWidth = doc.getTextWidth(centerText);
    doc.text(centerText, (pageWidth - centerTextWidth) / 2, yPos + 10);

    // Right: Page number
    if (template.footer_info && template.footer_info.page_number) {
      const pageText = `Page 1 of 2`;
      const pageTextWidth = doc.getTextWidth(pageText);
      doc.text(pageText, pageWidth - margin - pageTextWidth - 3, yPos + 10);
    }

    // Return PDF as buffer
    return Buffer.from(doc.output("arraybuffer"));
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

// Download template file for equipment - SIMPLIFIED VERSION (No PDF Generation)
const downloadEquipmentTemplate = async (req, res) => {
  try {
    const { serial_number, assignment_id } = req.params;

    console.log("=== DOWNLOAD TEMPLATE REQUEST ===");
    console.log("Equipment:", serial_number);
    console.log("Assignment:", assignment_id);

    const assignment = await AssignedChecklistModel.findOne({
      where: {
        assignment_id: assignment_id,
        resource_id: serial_number,
        resource_type: "Equipment",
        is_active: true,
      },
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
        },
        {
          model: MasterChecklistModel,
          as: "checklist",
        },
      ],
    });

    if (!assignment) {
      console.log("Assignment not found");
      return res.status(404).json({
        message: "Assignment not found or inactive",
      });
    }

    if (!assignment.template) {
      console.log("Template not found");
      return res.status(404).json({ message: "Template not found" });
    }

    if (!assignment.template.template_file_path) {
      console.log("No template file uploaded");
      return res.status(404).json({ message: "No template file uploaded" });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      assignment.template.template_file_path,
    );

    if (!fs.existsSync(filePath)) {
      console.log("File not found on disk");
      return res.status(404).json({
        message: "Template file not found on server",
        path: assignment.template.template_file_path,
      });
    }

    console.log("Streaming uploaded template file...");

    // Set proper headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${
        assignment.template.template_file_name || "template.pdf"
      }"`,
    );

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error downloading file" });
      }
    });

    fileStream.on("end", () => {
      console.log("File streamed successfully");
    });
  } catch (error) {
    console.error("Error downloading template:", error);

    if (!res.headersSent) {
      res.status(500).json({
        error: error.message,
        message: "Failed to download template",
      });
    }
  }
};

const downloadAttachmentTemplate = async (req, res) => {
  try {
    const { attachment_id, assignment_id } = req.params;

    console.log("=== DOWNLOAD ATTACHMENT TEMPLATE ===");
    console.log("Attachment ID:", attachment_id);
    console.log("Assignment ID:", assignment_id);

    const assignment = await AssignedChecklistModel.findOne({
      where: {
        assignment_id: assignment_id,
        resource_id: attachment_id,
        resource_type: "Attachment",
        is_active: true,
      },
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
        },
        {
          model: MasterChecklistModel,
          as: "checklist",
        },
      ],
    });

    console.log("Assignment found:", !!assignment);

    if (!assignment) {
      console.log("Assignment not found or inactive");
      return res
        .status(404)
        .json({ message: "Assignment not found or inactive" });
    }

    console.log("Template ID:", assignment.template_id);
    console.log("Template object:", !!assignment.template);

    if (!assignment.template) {
      console.log("Template not found in assignment");
      return res.status(404).json({ message: "Template not found" });
    }

    console.log("Template file path:", assignment.template.template_file_path);

    if (!assignment.template.template_file_path) {
      console.log("No template file uploaded");
      return res.status(404).json({ message: "No template file uploaded" });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      assignment.template.template_file_path,
    );

    console.log("Full file path:", filePath);
    console.log("File exists:", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      console.log("File not found on disk");
      return res.status(404).json({
        message: "Template file not found on server",
        path: assignment.template.template_file_path,
      });
    }

    // Set proper headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${
        assignment.template.template_file_name || "template.pdf"
      }"`,
    );

    console.log("Streaming file...");

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error downloading file" });
      }
    });

    fileStream.on("end", () => {
      console.log("File streamed successfully");
    });
  } catch (error) {
    console.error("Error downloading attachment template:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

const getAttachmentAssignedChecklists = async (req, res) => {
  try {
    const { attachment_id } = req.params;

    // Verify attachment exists
    const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
    const attachment = await AttachmentModel.findByPk(attachment_id);

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    // Get all active assignments for this attachment
    const assignments = await AssignedChecklistModel.findAll({
      where: {
        resource_id: attachment_id,
        resource_type: "Attachment",
        is_active: true,
      },
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          attributes: [
            "checklist_id",
            "checklist_name",
            "category",
            "checklist_type",
          ],
        },
        {
          model: ChecklistTemplateModel,
          as: "template",
          attributes: ["template_id", "header_info", "columns"],
        },
      ],
      order: [["assigned_at", "DESC"]],
    });

    // Group by checklist type
    const groupedAssignments = assignments.reduce((acc, assignment) => {
      const type = assignment.checklist_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        assignment_id: assignment.assignment_id,
        checklist_id: assignment.checklist_id,
        checklist_name: assignment.checklist.checklist_name,
        template_id: assignment.template_id,
        assigned_by: assignment.assigned_by,
        assigned_at: assignment.assigned_at,
        checklist_type: assignment.checklist_type,
      });
      return acc;
    }, {});

    res.status(200).json({
      attachment_id: attachment_id,
      total_assignments: assignments.length,
      assignments: assignments,
      grouped_by_type: groupedAssignments,
    });
  } catch (error) {
    console.error("Error fetching attachment assigned checklists:", error);
    res.status(500).json({ error: error.message });
  }
};
const getManpowerAssignedChecklists = async (req, res) => {
  try {
    const { manpower_id } = req.params;

    // Verify manpower exists
    const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
    const manpower = await ManpowerModel.findByPk(manpower_id);

    if (!manpower) {
      return res.status(404).json({ message: "Manpower not found" });
    }

    // Get all active assignments for this manpower
    const assignments = await AssignedChecklistModel.findAll({
      where: {
        resource_id: manpower_id,
        resource_type: "Manpower",
        is_active: true,
      },
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          attributes: [
            "checklist_id",
            "checklist_name",
            "category",
            "checklist_type",
          ],
        },
        {
          model: ChecklistTemplateModel,
          as: "template",
          attributes: ["template_id", "header_info", "columns"],
        },
      ],
      order: [["assigned_at", "DESC"]],
    });

    // Group by checklist type
    const groupedAssignments = assignments.reduce((acc, assignment) => {
      const type = assignment.checklist_type;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        assignment_id: assignment.assignment_id,
        checklist_id: assignment.checklist_id,
        checklist_name: assignment.checklist.checklist_name,
        template_id: assignment.template_id,
        assigned_by: assignment.assigned_by,
        assigned_at: assignment.assigned_at,
        checklist_type: assignment.checklist_type,
      });
      return acc;
    }, {});

    res.status(200).json({
      manpower_id: manpower_id,
      total_assignments: assignments.length,
      assignments: assignments,
      grouped_by_type: groupedAssignments,
    });
  } catch (error) {
    console.error("Error fetching manpower assigned checklists:", error);
    res.status(500).json({ error: error.message });
  }
};
const downloadManpowerTemplate = async (req, res) => {
  try {
    const { manpower_id, assignment_id } = req.params;

    console.log("=== DOWNLOAD MANPOWER TEMPLATE ===");
    console.log("Manpower ID:", manpower_id);
    console.log("Assignment ID:", assignment_id);

    const assignment = await AssignedChecklistModel.findOne({
      where: {
        assignment_id: assignment_id,
        resource_id: manpower_id,
        resource_type: "Manpower",
        is_active: true,
      },
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
        },
        {
          model: MasterChecklistModel,
          as: "checklist",
        },
      ],
    });

    console.log("Assignment found:", !!assignment);

    if (!assignment) {
      console.log("Assignment not found or inactive");
      return res
        .status(404)
        .json({ message: "Assignment not found or inactive" });
    }

    console.log("Template ID:", assignment.template_id);
    console.log("Template object:", !!assignment.template);

    if (!assignment.template) {
      console.log("Template not found in assignment");
      return res.status(404).json({ message: "Template not found" });
    }

    console.log("Template file path:", assignment.template.template_file_path);

    if (!assignment.template.template_file_path) {
      console.log("No template file uploaded");
      return res.status(404).json({ message: "No template file uploaded" });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      assignment.template.template_file_path,
    );

    console.log("Full file path:", filePath);
    console.log("File exists:", fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
      console.log("File not found on disk");
      return res.status(404).json({
        message: "Template file not found on server",
        path: assignment.template.template_file_path,
      });
    }

    // Set proper headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${
        assignment.template.template_file_name || "template.pdf"
      }"`,
    );

    console.log("Streaming file...");

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error downloading file" });
      }
    });

    fileStream.on("end", () => {
      console.log("File streamed successfully");
    });
  } catch (error) {
    console.error("Error downloading manpower template:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
};

// Get assignment count for a checklist
const getChecklistAssignmentCount = async (req, res) => {
  try {
    const { checklist_id } = req.params;

    console.log("=== GET ASSIGNMENT COUNT ===");
    console.log("Checklist ID:", checklist_id);

    // Count active assignments for this checklist
    const count = await AssignedChecklistModel.count({
      where: {
        checklist_id: checklist_id,
        is_active: true,
      },
    });

    console.log("Assignment count:", count);

    res.status(200).json({
      checklist_id: parseInt(checklist_id),
      count: count,
    });
  } catch (error) {
    console.error("Error fetching assignment count:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get assigned checklists for specific resources in a delivery note (filtered by delivery note types)
const getDeliveryNoteChecklists = async (req, res) => {
  try {
    const { resource_type, resource_ids } = req.body;

    console.log("📥 Request received:", { resource_type, resource_ids });

    if (!resource_type || !resource_ids || !Array.isArray(resource_ids)) {
      return res.status(400).json({
        message: "resource_type and resource_ids (array) are required",
      });
    }

    // EXACT checklist types as they appear in your database
    const deliveryNoteChecklistTypes = [
      "Pre checklist by Auto Expert Delivery note",
      "Delivery note checklist By client",
    ];

    console.log("🔍 Searching for exact types:", deliveryNoteChecklistTypes);

    // Fetch ALL assignments for these resources first
    const allAssignments = await AssignedChecklistModel.findAll({
      where: {
        resource_type: resource_type,
        resource_id: {
          [Op.in]: resource_ids,
        },
        is_active: true,
      },
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          where: {
            is_active: true,
            is_published: true,
          },
          required: true,
        },
        {
          model: ChecklistTemplateModel,
          as: "template",
          required: false,
        },
      ],
    });

    console.log("📋 Total assignments found:", allAssignments.length);
    console.log(
      "📋 All checklist types:",
      allAssignments.map((a) => a.checklist.checklist_type),
    );

    // Filter for ONLY the 2 delivery note types
    const filteredAssignments = allAssignments.filter((assignment) => {
      return deliveryNoteChecklistTypes.includes(
        assignment.checklist.checklist_type,
      );
    });

    console.log(
      "✅ Filtered delivery note assignments:",
      filteredAssignments.length,
    );
    console.log(
      "✅ Filtered types:",
      filteredAssignments.map((a) => a.checklist.checklist_type),
    );

    // Group by resource_id
    const groupedByResource = {};

    filteredAssignments.forEach((assignment) => {
      const resourceId = assignment.resource_id;

      if (!groupedByResource[resourceId]) {
        groupedByResource[resourceId] = [];
      }

      groupedByResource[resourceId].push({
        assignment_id: assignment.assignment_id,
        checklist_id: assignment.checklist_id,
        checklist_name: assignment.checklist.checklist_name,
        checklist_type: assignment.checklist.checklist_type,
        category: assignment.checklist.category,
        template_id: assignment.template_id,
        reference_number: assignment.template?.reference_number || null,
        has_template: !!assignment.template_id,
        assigned_at: assignment.assigned_at,
        assigned_by: assignment.assigned_by,
      });
    });

    console.log(
      "📦 Grouped result:",
      JSON.stringify(groupedByResource, null, 2),
    );

    res.status(200).json({
      message: "Delivery note checklists retrieved successfully",
      resource_type,
      checklists_by_resource: groupedByResource,
      total_found: filteredAssignments.length,
      searched_ids: resource_ids,
    });
  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      message: "Failed to fetch delivery note checklists",
      error: error.message,
    });
  }
};

// Download template for delivery note checklist assignment
const downloadDeliveryNoteTemplate = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const assignment = await AssignedChecklistModel.findOne({
      where: { assignment_id, is_active: true },
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          required: true,
        },
        {
          model: MasterChecklistModel,
          as: "checklist",
          required: true,
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (!assignment.template || !assignment.template.template_file_path) {
      return res.status(404).json({ message: "Template file not found" });
    }

    // Verify this is a delivery note checklist type
    const deliveryNoteChecklistTypes = [
      "Delivery note checklist – By client",
      "Pre checklist by Auto Expert – Delivery note",
    ];

    if (
      !deliveryNoteChecklistTypes.includes(assignment.checklist.checklist_type)
    ) {
      return res.status(403).json({
        message: "This template is not a delivery note checklist",
      });
    }

    const filePath = path.join(
      __dirname,
      "../../",
      assignment.template.template_file_path,
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Template file not found on server" });
    }

    const fileName =
      assignment.template.template_file_name ||
      `${assignment.checklist.checklist_name}_Template.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("Error downloading delivery note template:", error);
    res.status(500).json({
      message: "Failed to download template",
      error: error.message,
    });
  }
};

const getAllChecklistTypes = async (req, res) => {
  try {
    const checklists = await MasterChecklistModel.findAll({
      attributes: [
        "checklist_id",
        "checklist_name",
        "checklist_type",
        "category",
        "is_published",
      ],
      where: {
        is_active: true,
      },
    });

    console.log(
      "📋 All checklist types in database:",
      checklists.map((c) => c.checklist_type),
    );

    res.status(200).json({
      checklists: checklists.map((c) => ({
        id: c.checklist_id,
        name: c.checklist_name,
        type: c.checklist_type,
        category: c.category,
        is_published: c.is_published,
      })),
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get detailed assigned resources for a specific checklist
const getDetailedAssignedResources = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("=== GET DETAILED ASSIGNED RESOURCES ===");
    console.log("Checklist ID:", id);

    // Verify checklist exists
    const checklist = await MasterChecklistModel.findByPk(id);

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    // Fetch all active assignments for this checklist
    const assignments = await AssignedChecklistModel.findAll({
      where: {
        checklist_id: id,
        is_active: true,
      },
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          attributes: [
            "checklist_id",
            "checklist_name",
            "category",
            "checklist_type",
          ],
        },
        {
          model: ChecklistTemplateModel,
          as: "template",
          attributes: ["template_id", "reference_number"],
        },
      ],
      order: [["assigned_at", "DESC"]],
    });

    console.log("Total assignments found:", assignments.length);

    // Fetch detailed resource information based on category
    const detailedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        let resourceDetails = null;

        if (assignment.resource_type === "Equipment") {
          const EquipmentModel = require("../../models/fleet-management/EquipmentModel");
          const equipment = await EquipmentModel.findByPk(
            assignment.resource_id,
            {
              include: [
                {
                  model: require("../../models/fixed-assests-management/AssetCategoryModel"),
                  as: "category",
                  attributes: ["category_name"],
                },
                {
                  model: require("../../models/fixed-assests-management/AssetSubcategoryModel"),
                  as: "subcategory",
                  attributes: ["subcategory_name"],
                },
                {
                  model: require("../../models/hr/employees/EmployeeModel"),
                  as: "employee",
                  attributes: ["id", "personalDetails"],
                },
              ],
            },
          );

          if (equipment) {
            resourceDetails = {
              resource_id: equipment.serial_number,
              resource_code: equipment.reg_number,
              resource_name: equipment.description || equipment.reg_number,
              category:
                equipment.category?.category_name ||
                equipment.category_name_custom,
              subcategory:
                equipment.subcategory?.subcategory_name ||
                equipment.subcategory_name_custom,
              status: equipment.status,
              equipment_status: equipment.equipment_status,
              operator:
                equipment.employee?.personalDetails?.fullNameEnglish ||
                "Not Assigned",
              details: `${equipment.vehicle_type} - ${equipment.year_of_manufacture}`,
            };
          }
        } else if (assignment.resource_type === "Attachment") {
          const AttachmentModel = require("../../models/fleet-management/AttachmentModel");
          const attachment = await AttachmentModel.findByPk(
            assignment.resource_id,
          );

          if (attachment) {
            resourceDetails = {
              resource_id: attachment.attachment_id,
              resource_code: attachment.attachment_number,
              resource_name: attachment.product_name,
              serial_number: attachment.serial_number,
              status: attachment.status,
              attachment_status: attachment.attachment_status,
              location: attachment.location,
              details: `SN: ${attachment.serial_number} - ${attachment.equipment_type_compatibility}`,
            };
          }
        } else if (assignment.resource_type === "Manpower") {
          const ManpowerModel = require("../../models/fleet-management/ManpowerModel");
          const manpower = await ManpowerModel.findByPk(assignment.resource_id);

          if (manpower) {
            resourceDetails = {
              resource_id: manpower.manpower_id,
              resource_code: manpower.employeeNo,
              resource_name: manpower.employeeFullName,
              employee_type: manpower.employeeType,
              contract_type: manpower.contractType,
              status: manpower.status,
              manpower_status: manpower.manpower_status,
              details: `${manpower.employeeType} - ${manpower.contractType}`,
            };
          }
        }

        return {
          assignment_id: assignment.assignment_id,
          resource_type: assignment.resource_type,
          checklist_type: assignment.checklist_type,
          assigned_by: assignment.assigned_by,
          assigned_at: assignment.assigned_at,
          template_id: assignment.template_id,
          reference_number: assignment.template?.reference_number,
          resource_details: resourceDetails,
        };
      }),
    );

    // Filter out any null resource details (in case resource was deleted)
    const validAssignments = detailedAssignments.filter(
      (a) => a.resource_details !== null,
    );

    console.log("Valid assignments:", validAssignments.length);

    res.status(200).json({
      checklist_id: parseInt(id),
      checklist_name: checklist.checklist_name,
      category: checklist.category,
      checklist_type: checklist.checklist_type,
      total_assignments: validAssignments.length,
      assignments: validAssignments,
    });
  } catch (error) {
    console.error("Error fetching detailed assigned resources:", error);
    res.status(500).json({ error: error.message });
  }
};

const getOffHireNoteChecklists = async (req, res) => {
  try {
    const { resource_type, resource_ids } = req.body;

    console.log("📥 [OHN] Request received:", { resource_type, resource_ids });

    if (!resource_type || !resource_ids || !Array.isArray(resource_ids)) {
      return res.status(400).json({
        message: "resource_type and resource_ids (array) are required",
      });
    }

    // EXACT checklist types for Off Hire Notes (matching the ENUM in MasterChecklistModel)
    const offHireNoteChecklistTypes = [
      "Pre checklist by Auto Expert Off hire note",
      "Off hire note checklist By client",
    ];

    console.log("🔍 [OHN] Searching for types:", offHireNoteChecklistTypes);

    // Fetch ALL active assignments for these resources
    const allAssignments = await AssignedChecklistModel.findAll({
      where: {
        resource_type: resource_type,
        resource_id: {
          [Op.in]: resource_ids,
        },
        is_active: true,
      },
      include: [
        {
          model: MasterChecklistModel,
          as: "checklist",
          where: {
            is_active: true,
            is_published: true,
          },
          required: true,
        },
        {
          model: ChecklistTemplateModel,
          as: "template",
          required: false,
        },
      ],
    });

    console.log("📋 [OHN] Total assignments found:", allAssignments.length);

    // Filter for ONLY the 2 off hire note types
    const filteredAssignments = allAssignments.filter((assignment) =>
      offHireNoteChecklistTypes.includes(assignment.checklist.checklist_type),
    );

    console.log(
      "✅ [OHN] Filtered off hire note assignments:",
      filteredAssignments.length,
    );

    // Group by resource_id
    const groupedByResource = {};

    filteredAssignments.forEach((assignment) => {
      const resourceId = assignment.resource_id;

      if (!groupedByResource[resourceId]) {
        groupedByResource[resourceId] = [];
      }

      groupedByResource[resourceId].push({
        assignment_id: assignment.assignment_id,
        checklist_id: assignment.checklist_id,
        checklist_name: assignment.checklist.checklist_name,
        checklist_type: assignment.checklist.checklist_type,
        category: assignment.checklist.category,
        template_id: assignment.template_id,
        reference_number: assignment.template?.reference_number || null,
        has_template: !!assignment.template_id,
        assigned_at: assignment.assigned_at,
        assigned_by: assignment.assigned_by,
      });
    });

    console.log(
      "📦 [OHN] Grouped result:",
      JSON.stringify(groupedByResource, null, 2),
    );

    res.status(200).json({
      message: "Off hire note checklists retrieved successfully",
      resource_type,
      checklists_by_resource: groupedByResource,
      total_found: filteredAssignments.length,
      searched_ids: resource_ids,
    });
  } catch (error) {
    console.error("❌ [OHN] Error:", error);
    res.status(500).json({
      message: "Failed to fetch off hire note checklists",
      error: error.message,
    });
  }
};

const downloadOffHireNoteTemplate = async (req, res) => {
  try {
    const { assignment_id } = req.params;

    const assignment = await AssignedChecklistModel.findOne({
      where: { assignment_id, is_active: true },
      include: [
        {
          model: ChecklistTemplateModel,
          as: "template",
          required: true,
        },
        {
          model: MasterChecklistModel,
          as: "checklist",
          required: true,
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (!assignment.template || !assignment.template.template_file_path) {
      return res.status(404).json({ message: "Template file not found" });
    }

    // Verify this is an off hire note checklist type
    const offHireNoteChecklistTypes = [
      "Pre checklist by Auto Expert Off hire note",
      "Off hire note checklist By client",
    ];

    if (
      !offHireNoteChecklistTypes.includes(assignment.checklist.checklist_type)
    ) {
      return res.status(403).json({
        message: "This template is not an off hire note checklist",
      });
    }

    const filePath = path.join(
      __dirname,
      "../../",
      "public",
      assignment.template.template_file_path,
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Template file not found on server" });
    }

    const fileName =
      assignment.template.template_file_name ||
      `${assignment.checklist.checklist_name}_Template.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on("error", (error) => {
      console.error("Error streaming OHN template file:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Error downloading off hire note template:", error);
    res.status(500).json({
      message: "Failed to download template",
      error: error.message,
    });
  }
};

// ── Download OHN checklist template for Equipment ────────────────────────────
const downloadOHNEquipmentTemplate = async (req, res) => {
  try {
    const { serial_number, assignment_id } = req.params;

    console.log("=== DOWNLOAD OHN EQUIPMENT TEMPLATE ===");
    console.log("Serial Number:", serial_number);
    console.log("Assignment ID:", assignment_id);

    const assignment = await AssignedChecklistModel.findOne({
      where: {
        assignment_id: assignment_id,
        resource_id: serial_number,
        resource_type: "Equipment",
        is_active: true,
      },
      include: [
        { model: ChecklistTemplateModel, as: "template" },
        { model: MasterChecklistModel, as: "checklist" },
      ],
    });

    if (!assignment) {
      return res
        .status(404)
        .json({ message: "Assignment not found or inactive" });
    }

    if (!assignment.template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (!assignment.template.template_file_path) {
      return res.status(404).json({ message: "No template file uploaded" });
    }

    // Verify this belongs to an OHN checklist type
    const ohnChecklistTypes = [
      "Pre checklist by Auto Expert Off hire note",
      "Off hire note checklist By client",
    ];
    if (!ohnChecklistTypes.includes(assignment.checklist.checklist_type)) {
      return res.status(403).json({
        message: "This template is not an off hire note checklist",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      assignment.template.template_file_path,
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Template file not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${assignment.template.template_file_name || "template.pdf"}"`,
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    fileStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent)
        res.status(500).json({ message: "Error downloading file" });
    });
  } catch (error) {
    console.error("Error downloading OHN equipment template:", error);
    if (!res.headersSent)
      res
        .status(500)
        .json({ message: "Failed to download template", error: error.message });
  }
};

// ── Download OHN checklist template for Manpower ─────────────────────────────
const downloadOHNManpowerTemplate = async (req, res) => {
  try {
    const { manpower_id, assignment_id } = req.params;

    console.log("=== DOWNLOAD OHN MANPOWER TEMPLATE ===");
    console.log("Manpower ID:", manpower_id);
    console.log("Assignment ID:", assignment_id);

    const assignment = await AssignedChecklistModel.findOne({
      where: {
        assignment_id: assignment_id,
        resource_id: manpower_id,
        resource_type: "Manpower",
        is_active: true,
      },
      include: [
        { model: ChecklistTemplateModel, as: "template" },
        { model: MasterChecklistModel, as: "checklist" },
      ],
    });

    if (!assignment) {
      return res
        .status(404)
        .json({ message: "Assignment not found or inactive" });
    }

    if (!assignment.template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (!assignment.template.template_file_path) {
      return res.status(404).json({ message: "No template file uploaded" });
    }

    const ohnChecklistTypes = [
      "Pre checklist by Auto Expert Off hire note",
      "Off hire note checklist By client",
    ];
    if (!ohnChecklistTypes.includes(assignment.checklist.checklist_type)) {
      return res.status(403).json({
        message: "This template is not an off hire note checklist",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      assignment.template.template_file_path,
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Template file not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${assignment.template.template_file_name || "template.pdf"}"`,
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    fileStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent)
        res.status(500).json({ message: "Error downloading file" });
    });
  } catch (error) {
    console.error("Error downloading OHN manpower template:", error);
    if (!res.headersSent)
      res
        .status(500)
        .json({ message: "Failed to download template", error: error.message });
  }
};

// ── Download OHN checklist template for Attachment ───────────────────────────
const downloadOHNAttachmentTemplate = async (req, res) => {
  try {
    const { attachment_id, assignment_id } = req.params;

    console.log("=== DOWNLOAD OHN ATTACHMENT TEMPLATE ===");
    console.log("Attachment ID:", attachment_id);
    console.log("Assignment ID:", assignment_id);

    const assignment = await AssignedChecklistModel.findOne({
      where: {
        assignment_id: assignment_id,
        resource_id: attachment_id,
        resource_type: "Attachment",
        is_active: true,
      },
      include: [
        { model: ChecklistTemplateModel, as: "template" },
        { model: MasterChecklistModel, as: "checklist" },
      ],
    });

    if (!assignment) {
      return res
        .status(404)
        .json({ message: "Assignment not found or inactive" });
    }

    if (!assignment.template) {
      return res.status(404).json({ message: "Template not found" });
    }

    if (!assignment.template.template_file_path) {
      return res.status(404).json({ message: "No template file uploaded" });
    }

    const ohnChecklistTypes = [
      "Pre checklist by Auto Expert Off hire note",
      "Off hire note checklist By client",
    ];
    if (!ohnChecklistTypes.includes(assignment.checklist.checklist_type)) {
      return res.status(403).json({
        message: "This template is not an off hire note checklist",
      });
    }

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      assignment.template.template_file_path,
    );

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "Template file not found on server" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${assignment.template.template_file_name || "template.pdf"}"`,
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    fileStream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent)
        res.status(500).json({ message: "Error downloading file" });
    });
  } catch (error) {
    console.error("Error downloading OHN attachment template:", error);
    if (!res.headersSent)
      res
        .status(500)
        .json({ message: "Failed to download template", error: error.message });
  }
};

module.exports = {
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
  generateEquipmentTemplatePDF,
  downloadAttachmentTemplate,
  getAttachmentAssignedChecklists,
  getManpowerAssignedChecklists,
  downloadManpowerTemplate,
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
};
