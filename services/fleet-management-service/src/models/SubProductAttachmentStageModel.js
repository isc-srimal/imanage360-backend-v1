// const { DataTypes } = require("sequelize");
// const sequelize = require("../../config/dbSync");
// const SalesOrderModel = require("../fleet-management/SalesOrdersModel");
// const AttachmentModel = require("../fleet-management/AttachmentModel");

// const SubProductAttachmentStageModel = sequelize.define(
//   "tbl_sub_product_attachment_stage",
//   {
//     sub_product_attachment_stage_id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     so_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: SalesOrderModel,
//         key: "id",
//       },
//     },
//     attachment_id: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//       references: {
//         model: AttachmentModel,
//         key: "attachment_id",
//       },
//     },
//     stage_name: {
//       type: DataTypes.STRING(255),
//       allowNull: false,
//     },
//     closure_status: {
//       type: DataTypes.STRING(255),
//       allowNull: true,
//     },
//     completion_date: {
//       type: DataTypes.DATEONLY,
//       allowNull: true,
//     },
//     remarks: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     created_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//     },
//     updated_at: {
//       type: DataTypes.DATE,
//       defaultValue: DataTypes.NOW,
//       onUpdate: DataTypes.NOW,
//     },
//   },
//   {
//     tableName: "tbl_sub_product_attachment_stage",
//     timestamps: true,
//     createdAt: "created_at",
//     updatedAt: "updated_at",
//   }
// );

// SubProductAttachmentStageModel.belongsTo(SalesOrderModel, {
//   foreignKey: "so_id",
//   as: "sales_order",
// });
// SalesOrderModel.hasMany(SubProductAttachmentStageModel, {
//   foreignKey: "so_id",
//   as: "sub_product_attachment_stage",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

// SubProductAttachmentStageModel.belongsTo(AttachmentModel, {
//   foreignKey: "attachment_id",
//   as: "attachment",
// });

// AttachmentModel.hasMany(SubProductAttachmentStageModel, {
//   foreignKey: "attachment_id",
//   as: "sub_product_attachment_stage",
//   onDelete: "CASCADE",
//   onUpdate: "CASCADE",
// });

// module.exports = SubProductAttachmentStageModel;

const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrderModel = require("./SalesOrdersModel");
const ProductModel = require("./ProductModel");

const SubProductAttachmentStageModel = sequelize.define(
  "tbl_sub_product_attachment_stage",
  {
    sub_product_attachment_stage_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    so_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrderModel,
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductModel,
        key: "product_id",
      },
    },
    stage_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    closure_status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW,
    },
  },
  {
    tableName: "tbl_sub_product_attachment_stage",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

SubProductAttachmentStageModel.belongsTo(SalesOrderModel, {
  foreignKey: "so_id",
  as: "sales_order",
});
SalesOrderModel.hasMany(SubProductAttachmentStageModel, {
  foreignKey: "so_id",
  as: "sub_product_attachment_stage",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

SubProductAttachmentStageModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
  as: "product",
});
ProductModel.hasMany(SubProductAttachmentStageModel, {
  foreignKey: "product_id",
  as: "sub_product_attachment_stage",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

module.exports = SubProductAttachmentStageModel;