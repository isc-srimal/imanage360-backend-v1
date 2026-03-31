// // models/fleet-management/MasterChecklistModel.js
// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");

// const MasterChecklistModel = sequelize.define(
//   "tbl_master_checklist",
//   {
//     checklist_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     checklist_name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     checklist_type: {
//       type: DataTypes.ENUM("Prechecklist from Auto Xpert", "Checklist to be signed from Client"),
//       allowNull: false,
//     },
//     is_active: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//     created_by: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },
//   },
//   {
//     tableName: "tbl_master_checklist",
//     timestamps: true,
//   }
// );

// const ChecklistItemModel = sequelize.define(
//   "tbl_checklist_item",
//   {
//     item_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     checklist_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: MasterChecklistModel,
//         key: "checklist_id",
//       },
//       onDelete: "CASCADE",
//     },
//     item_name: {
//       type: DataTypes.STRING(500),
//       allowNull: false,
//     },
//     is_checked: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: false,
//     },
//     sort_order: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//   },
//   {
//     tableName: "tbl_checklist_item",
//     timestamps: true,
//   }
// );

// // Associations
// MasterChecklistModel.hasMany(ChecklistItemModel, {
//   foreignKey: "checklist_id",
//   as: "items",
// });

// ChecklistItemModel.belongsTo(MasterChecklistModel, {
//   foreignKey: "checklist_id",
//   as: "checklist",
// });

// module.exports = {
//   MasterChecklistModel,
//   ChecklistItemModel,
// };

// models/fleet-management/MasterChecklistModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const EquipmentModel = require("./EquipmentModel");
const AttachmentModel = require("./AttachmentModel");
const ManpowerModel = require("./ManpowerModel");

const MasterChecklistModel = sequelize.define(
  "tbl_master_checklist",
  {
    checklist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    checklist_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: {
      type: DataTypes.ENUM("Equipment", "Attachment", "Manpower"),
      allowNull: false,
    },
    checklist_type: {
      type: DataTypes.ENUM(
        "Daily checklist Prior Before start the work",
        "Daily checklist Post After completing the shift",
        "Weekly checklist",
        "Monthly checklist",
        "Delivery note checklist By client",
        "Off hire note checklist By client",
        "Pre checklist by Auto Expert Delivery note",
        "Pre checklist by Auto Expert Off hire note"
      ),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_master_checklist",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

const ChecklistTemplateModel = sequelize.define(
  "tbl_checklist_template",
  {
    template_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    checklist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MasterChecklistModel,
        key: "checklist_id",
      },
      onDelete: "CASCADE",
    },
    header_info: {
      type: DataTypes.JSON,
      defaultValue: {
        week_of: true,
        plate_no: true,
        operator_name: true,
        project: true,
        custom_fields: [],
      },
    },
    footer_info: {
      type: DataTypes.JSON,
      defaultValue: {
        comments: true,
        reference_number: true,
        page_number: true,
      },
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    columns: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    // ADD THIS NEW FIELD
    template_file_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: "Path to uploaded template file (PDF/DOCX/XLSX)",
    },
    template_file_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Original filename of uploaded template",
    },
    template_file_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "File size in bytes",
    },
    // ADD THIS FIELD to ChecklistTemplateModel definition (after template_file_size)
    reference_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      comment:
        "Unique reference number for the template (e.g., TMPL-EQ-2024-001)",
    },
    document_code: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "AXTS.OPS.WDC.23- Rev - 0",
      comment: "Document code displayed in footer",
    },

  },
  {
    tableName: "tbl_checklist_template",
    timestamps: true,
  }
);
// const ChecklistTemplateModel = sequelize.define(
//   "tbl_checklist_template",
//   {
//     template_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     checklist_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: MasterChecklistModel,
//         key: "checklist_id",
//       },
//       onDelete: "CASCADE",
//     },
//     header_info: {
//       type: DataTypes.JSON,
//       defaultValue: {
//         week_of: true,
//         plate_no: true,
//         operator_name: true,
//         project: true,
//         custom_fields: [],
//       },
//     },
//     footer_info: {
//       type: DataTypes.JSON,
//       defaultValue: {
//         comments: true,
//         reference_number: true,
//         page_number: true,
//       },
//     },
//     instructions: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     columns: {
//       type: DataTypes.JSON,
//       defaultValue: [],
//     },
//   },
//   {
//     tableName: "tbl_checklist_template",
//     timestamps: true,
//   }
// );

const ChecklistCategoryModel = sequelize.define(
  "tbl_checklist_category",
  {
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChecklistTemplateModel,
        key: "template_id",
      },
      onDelete: "CASCADE",
    },
    category_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "tbl_checklist_category",
    timestamps: true,
  }
);

const ChecklistItemModel = sequelize.define(
  "tbl_checklist_item",
  {
    item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChecklistCategoryModel,
        key: "category_id",
      },
      onDelete: "CASCADE",
    },
    item_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "tbl_checklist_item",
    timestamps: true,
  }
);

const AssignedChecklistModel = sequelize.define(
  "tbl_assigned_checklist",
  {
    assignment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    checklist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: MasterChecklistModel,
        key: "checklist_id",
      },
      onDelete: "CASCADE",
    },
    template_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ChecklistTemplateModel,
        key: "template_id",
      },
      onDelete: "CASCADE",
    },
    resource_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    resource_type: {
      type: DataTypes.ENUM("Equipment", "Attachment", "Manpower"),
      allowNull: false,
    },
    // ADD THIS FIELD to track checklist type
    checklist_type: {
      type: DataTypes.ENUM(
        "Daily checklist Prior Before start the work",
        "Daily checklist Post After completing the shift",
        "Weekly checklist",
        "Monthly checklist",
        "Delivery note checklist By client",
        "Off hire note checklist By client",
        "Pre checklist by Auto Expert Delivery note",
        "Pre checklist by Auto Expert Off hire note"
      ),
      allowNull: false,
    },
    assigned_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    assigned_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    replaced_assignment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "References the assignment_id that this assignment replaced",
    },
  },
  {
    tableName: "tbl_assigned_checklist",
    timestamps: true,
  }
);

// const AssignedChecklistModel = sequelize.define(
//   "tbl_assigned_checklist",
//   {
//     assignment_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     checklist_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: MasterChecklistModel,
//         key: "checklist_id",
//       },
//       onDelete: "CASCADE",
//     },
//     template_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: ChecklistTemplateModel,
//         key: "template_id",
//       },
//       onDelete: "CASCADE",
//     },
//     serial_number: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: EquipmentModel,
//         key: "serial_number",
//       },
//       onDelete: "CASCADE",
//     },

//      attachment_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: AttachmentModel,
//         key: "attachment_id",
//       },
//       onDelete: "CASCADE",
//     },

//     manpower_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: ManpowerModel,
//         key: "manpower_id",
//       },
//       onDelete: "CASCADE",
//     },

//     resource_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     resource_type: {
//       type: DataTypes.ENUM("Equipment", "Attachment", "Manpower"),
//       allowNull: false,
//     },
//     assigned_by: {
//       type: DataTypes.STRING(100),
//       allowNull: true,
//     },
//     is_active: {
//       type: DataTypes.BOOLEAN,
//       defaultValue: true,
//     },
//   },
//   {
//     tableName: "tbl_assigned_checklist",
//     timestamps: true,
//   }
// );

// Associations
// MasterChecklist <-> ChecklistTemplate (One-to-One)
MasterChecklistModel.hasOne(ChecklistTemplateModel, {
  foreignKey: "checklist_id",
  as: "template",
});

ChecklistTemplateModel.belongsTo(MasterChecklistModel, {
  foreignKey: "checklist_id",
  as: "checklist",
});

// ChecklistTemplate <-> ChecklistCategory (One-to-Many)
ChecklistTemplateModel.hasMany(ChecklistCategoryModel, {
  foreignKey: "template_id",
  as: "categories",
});

ChecklistCategoryModel.belongsTo(ChecklistTemplateModel, {
  foreignKey: "template_id",
  as: "template",
});

// ChecklistCategory <-> ChecklistItem (One-to-Many)
ChecklistCategoryModel.hasMany(ChecklistItemModel, {
  foreignKey: "category_id",
  as: "items",
});

ChecklistItemModel.belongsTo(ChecklistCategoryModel, {
  foreignKey: "category_id",
  as: "category",
});

// MasterChecklist <-> AssignedChecklist (One-to-Many)
MasterChecklistModel.hasMany(AssignedChecklistModel, {
  foreignKey: "checklist_id",
  as: "assignments",
});

AssignedChecklistModel.belongsTo(MasterChecklistModel, {
  foreignKey: "checklist_id",
  as: "checklist",
});

// ============ FIX: AssignedChecklist <-> ChecklistTemplate ============
// CORRECTED: AssignedChecklist belongs to Template (Many-to-One)
AssignedChecklistModel.belongsTo(ChecklistTemplateModel, {
  foreignKey: "template_id",
  as: "template",
});

ChecklistTemplateModel.hasMany(AssignedChecklistModel, {
  foreignKey: "template_id",
  as: "assignments",
});

// AssignedChecklistModel.hasMany(EquipmentModel, {
//   foreignKey: "serial_number",
//   as: "equipment",
// });

// EquipmentModel.belongsTo(AssignedChecklistModel, {
//   foreignKey: "serial_number",
//   as: "assignments",
// });

// AssignedChecklistModel.hasMany(AttachmentModel, {
//   foreignKey: "attachment_id",
//   as: "attachment",
// });

// AttachmentModel.belongsTo(AssignedChecklistModel, {
//   foreignKey: "attachment_id",
//   as: "assignments",
// });

// AssignedChecklistModel.hasMany(ManpowerModel, {
//   foreignKey: "manpower_id",
//   as: "manpower",
// });

// ManpowerModel.belongsTo(AssignedChecklistModel, {
//   foreignKey: "manpower_id",
//   as: "assignments",
// });

module.exports = {
  MasterChecklistModel,
  ChecklistTemplateModel,
  ChecklistCategoryModel,
  ChecklistItemModel,
  AssignedChecklistModel,
};
