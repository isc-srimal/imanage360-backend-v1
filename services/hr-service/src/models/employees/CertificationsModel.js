const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");

const CertificationsModel = sequelize.define(
  "tbl_certifications",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    certificationType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherYear: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otherLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificationExpireDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificationBody: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documents: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      get() {
        const value = this.getDataValue("documents");
        return value ? `services/hr-service/public/uploads/careerDetailsDocuments/${value}` : "";
      },
      set(value) {
        // Store only the filename, not the full path
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            // Extract filename from full path if it's a path
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/careerDetailsDocuments\//, "");
          } else {
            // If it's a File object or already a filename
            filename = value;
          }
        }
        this.setDataValue("documents", filename);
      },
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tbl_employees",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "tbl_certifications",
    timestamps: false,
  }
);

module.exports = CertificationsModel;
