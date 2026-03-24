const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const AssetModel = require("./AssetModel");

const AssetDisposalModel = sequelize.define(
  "tbl_asset_disposals",
  {
    disposal_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AssetModel,
        key: "asset_id",
      },
    },
    sub_asset_descriptions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [], // Explicitly set default to empty array
      get() {
        // Ensure sub_asset_descriptions is always returned as an array
        const value = this.getDataValue("sub_asset_descriptions");
        return value ? value : [];
      },
      set(value) {
        // Ensure sub_asset_descriptions is stored as a JSON array
        this.setDataValue(
          "sub_asset_descriptions",
          Array.isArray(value) ? value : []
        );
      },
    },
    disposal_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    disposal_type: {
      type: DataTypes.ENUM("sale", "scrap", "donation", "write_off"),
      allowNull: false,
    },
    disposal_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    net_book_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    gain_loss: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    document_proof: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const value = this.getDataValue("document_proof");
        return value ? `services/fixed-assets-service/public/uploads/assetDisposalDocuments/${value}` : "";
      },
      set(value) {
        // Store only the filename, not the full path
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            // Extract filename from full path if it's a path
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(/^services\/fixed-assets-service\/public\/uploads\/assetDisposalDocuments\//, "");
          } else {
            // If it's a File object or already a filename
            filename = value;
          }
        }
        this.setDataValue("document_proof", filename);
      },
    },
    approved_by_gm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approved_by_fm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    disposal_reason: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    journal_entry_id: {
      type: DataTypes.STRING(20),
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
    tableName: "tbl_asset_disposals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Relationship with AssetModel
AssetDisposalModel.belongsTo(AssetModel, {
  foreignKey: "asset_id",
  as: "asset",
});

module.exports = AssetDisposalModel;
