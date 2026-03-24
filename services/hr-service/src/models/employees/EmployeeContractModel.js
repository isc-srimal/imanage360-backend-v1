const { DataTypes } = require("sequelize");
const sequelize = require("../../../src/config/dbSync");

const EmployeeContractModel = sequelize.define(
  "tbl_employee_contracts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contractType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractAttachment: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
      get() {
        const value = this.getDataValue("contractAttachment");
        return value ? `services/hr-service/public/uploads/contractAttachmentDocuments/${value}` : "";
      },
      set(value) {
        // Store only the filename, not the full path
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            // Extract filename from full path if it's a path
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/contractAttachmentDocuments\//, "");
          } else {
            // If it's a File object or already a filename
            filename = value;
          }
        }
        this.setDataValue("contractAttachment", filename);
      },
    },
    contractStartDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractEndDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractStatus: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "tbl_employee_contracts",
    timestamps: false,
  }
);

module.exports = EmployeeContractModel;
