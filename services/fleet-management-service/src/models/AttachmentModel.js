const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const ProductModel = require("./ProductModel");

const AttachmentModel = sequelize.define(
  "tbl_fleet_attachment",
  {
    attachment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: SalesOrdersModel,
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
    attachment_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    product_details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    serial_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    equipment_type_compatibility: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    plate_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    vehicle_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Auto-filled from equipment table based on plate number",
    },
    purchase_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Retired", "Repaired", "Lost"),
      allowNull: true, // under the create form automatically display "Active" (Add form status always active by default)
      defaultValue: "Active",
    },
    supportDocument: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const value = this.getDataValue("supportDocument");
        return value ? `services/fleet-management-service/public/uploads/supportDocuments/${value}` : "";
      },
      set(value) {
        // Store only the filename, not the full path
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            // Extract filename from full path if it's a path
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/fleet-management-service\/public\/uploads\/supportDocuments\//, "");
          } else {
            // If it's a File object or already a filename
            filename = value;
          }
        }
        this.setDataValue("supportDocument", filename);
      },
    },
    photo_attachments: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    attachment_status: {
      type: DataTypes.ENUM(
        "day-off",
        "idle",
        "major-breakdown",
        "minor-breakdown",
        "inspection",
        "public-holiday",
        "asset-defleet",
        "new-asset",
        "allocated"
      ),
      allowNull: false,
      defaultValue: "idle",
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
    tableName: "tbl_fleet_attachment",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

AttachmentModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "sales_order",
});
SalesOrdersModel.hasMany(AttachmentModel, {
  foreignKey: "sales_order_id",
  as: "tbl_fleet_attachment",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

AttachmentModel.belongsTo(ProductModel, {
  foreignKey: "product_id",
  as: "product",
});
ProductModel.hasMany(AttachmentModel, {
  foreignKey: "product_id",
  as: "tbl_fleet_attachment",
});

module.exports = AttachmentModel;
