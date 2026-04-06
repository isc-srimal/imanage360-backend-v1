const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
const EquipmentModel = require("./EquipmentModel");
const AttachmentModel = require("./AttachmentModel");
const EmployeeModel = sequelize.define(
  "tbl_employees",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    personalDetails: {
      type: DataTypes.JSON,
      allowNull: true,
      get() {
        const value = this.getDataValue("personalDetails");
        return value
          ? {
              profileImage: value.profileImage || "",
              employeeNo: value.employeeNo || "",
              fullNameEnglish: value.fullNameEnglish || "",
              fullNameArabic: value.fullNameArabic || "",
              qidNumber: value.qidNumber || 0,
              passportNumber: value.passportNumber || "",
              qidExpireDate: value.qidExpireDate || "",
              passportExpireDate: value.passportExpireDate || "",
              recruitementType: value.recruitementType || "",
              visaNumber: value.visaNumber || "",
              nationality: value.nationality || "",
              mobileNumber: value.mobileNumber || 0,
              email: value.email || "",
              gender: value.gender || "",
              dateOfBirth: value.dateOfBirth || "",
              currentAddress: value.currentAddress || "",
              permanentAddress: value.permanentAddress || "",
              maritalStatus: value.maritalStatus || "",
            }
          : {};
      },
      set(value) {
        // Validate expiry dates - allow any future date, reject past dates
        const validateExpiryDate = (dateValue, fieldName) => {
          if (dateValue) {
            const selectedDate = new Date(dateValue);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (selectedDate < today) {
              throw new Error(`${fieldName} cannot be in the past`);
            }
          }
        };

        // Validate QID and Passport expiry dates
        validateExpiryDate(value.qidExpireDate, "QID Expire Date");
        validateExpiryDate(value.passportExpireDate, "Passport Expire Date");

        this.setDataValue("personalDetails", {
          profileImage: value.profileImage || "",
          employeeNo: value.employeeNo || "",
          fullNameEnglish: value.fullNameEnglish || "",
          fullNameArabic: value.fullNameArabic || "",
          qidNumber: value.qidNumber || 0,
          passportNumber: value.passportNumber || "",
          qidExpireDate: value.qidExpireDate || "",
          passportExpireDate: value.passportExpireDate || "",
          recruitementType: value.recruitementType || "",
          visaNumber: value.visaNumber || "",
          nationality: value.nationality || "",
          mobileNumber: value.mobileNumber || 0,
          email: value.email || "",
          gender: value.gender || "",
          dateOfBirth: value.dateOfBirth || "",
          currentAddress: value.currentAddress || "",
          permanentAddress: value.permanentAddress || "",
          maritalStatus: value.maritalStatus || "",
        });
      },
    },
    drivingLicenseDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("drivingLicenseDetails");
        return value
          ? {
              isAvailableLicense: value.isAvailableLicense || false,
              drivingLicenseCopy: value.drivingLicenseCopy
                ? `services/hr-service/public/uploads/drivingLicenseDocuments/${value.drivingLicenseCopy}`
                : "",
              licenseNumber: value.licenseNumber || "",
              firstIssueDate: value.firstIssueDate || "",
              licenseExpireDate: value.licenseExpireDate || "",
              licenseCategory: value.licenseCategory || [],
              licenseNotes: value.licenseNotes || [],
            }
          : {
              isAvailableLicense: false,
              drivingLicenseCopy: "",
              licenseNumber: "",
              firstIssueDate: "",
              licenseExpireDate: "",
              licenseCategory: [],
              licenseNotes: [],
            };
      },
      set(value) {
        // Store only the filename, not the full path
        const drivingLicenseCopy = value.drivingLicenseCopy;
        let filename = "";

        if (drivingLicenseCopy) {
          if (typeof drivingLicenseCopy === "string") {
            // Extract filename from full path if it's a path
            filename = drivingLicenseCopy
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/drivingLicenseDocuments\//, "");
          } else {
            // If it's a File object or already a filename, handle appropriately
            filename = drivingLicenseCopy;
          }
        }

        this.setDataValue("drivingLicenseDetails", {
          isAvailableLicense: value.isAvailableLicense || false,
          drivingLicenseCopy: filename,
          licenseNumber: value.licenseNumber || "",
          firstIssueDate: value.firstIssueDate || "",
          licenseExpireDate: value.licenseExpireDate || "",
          licenseCategory: Array.isArray(value.licenseCategory)
            ? value.licenseCategory
            : [],
          licenseNotes: Array.isArray(value.licenseNotes)
            ? value.licenseNotes
            : [],
        });
      },
    },
    bankDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("bankDetails");
        return value
          ? {
              bankName: value.bankName || "",
              accountHolderName: value.accountHolderName || "",
              accountNumber: value.accountNumber || 0,
              branchName: value.branchName || "",
              IBAN: value.IBAN || "",
              swiftCode: value.swiftCode || 0,
              shortCode: value.shortCode || 0,
            }
          : {};
      },
      set(value) {
        this.setDataValue("bankDetails", {
          bankName: value.bankName || "",
          accountHolderName: value.accountHolderName || "",
          accountNumber: value.accountNumber || 0,
          branchName: value.branchName || "",
          IBAN: value.IBAN || "",
          swiftCode: value.swiftCode || 0,
          shortCode: value.shortCode || 0,
        });
      },
    },
    sponserDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("sponserDetails");
        return value
          ? {
              sponserName: value.sponserName || "",
              employeeContractCopy: value.employeeContractCopy
                ? `services/hr-service/public/uploads/sponsorDetailsDocuments/${value.employeeContractCopy}`
                : "",
              contractExpireDate: value.contractExpireDate || "",
              companyCRCopyExpireDate: value.companyCRCopyExpireDate || "",
              computerCardCopy: value.computerCardCopy
                ? `services/hr-service/public/uploads/sponsorDetailsDocuments/${value.computerCardCopy}`
                : "",
              computerCardExpireDate: value.computerCardExpireDate || "",
              NOC: value.NOC
                ? `services/hr-service/public/uploads/sponsorDetailsDocuments/${value.NOC}`
                : "",
              companyCRCopy: value.companyCRCopy
                ? `services/hr-service/public/uploads/sponsorDetailsDocuments/${value.companyCRCopy}`
                : "",
            }
          : {};
      },
      set(value) {
        const fields = [
          "employeeContractCopy",
          "companyCRCopy",
          "computerCardCopy",
          "NOC",
        ];
        const sponserDetails = {
          sponserName: value.sponserName || "",
          contractExpireDate: value.contractExpireDate || "",
          companyCRCopyExpireDate: value.companyCRCopyExpireDate || "",
          computerCardExpireDate: value.computerCardExpireDate || "",
        };

        fields.forEach((field) => {
          const file = value[field];
          let filename = "";

          if (file) {
            if (typeof file === "string") {
              filename = file
                .replace(/^.*[\\\/]/, "")
                .replace(/^\/services\/hr-service\/public\/uploads\/sponsorDetailsDocuments\//, "");
            } else {
              filename = file;
            }
          }

          sponserDetails[field] = filename;
        });

        this.setDataValue("sponserDetails", sponserDetails);
      },
    },
    documentDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("documentDetails");
        return value
          ? {
              image: value.image
                ? `services/hr-service/public/uploads/otherDocuments/${value.image}`
                : "",
              copyOfQID: value.copyOfQID
                ? `services/hr-service/public/uploads/otherDocuments/${value.copyOfQID}`
                : "",
              copyOfPassport: value.copyOfPassport
                ? `services/hr-service/public/uploads/otherDocuments/${value.copyOfPassport}`
                : "",
              resume: value.resume
                ? `services/hr-service/public/uploads/otherDocuments/${value.resume}`
                : "",
              qualificationCertificate: value.qualificationCertificate
                ? `services/hr-service/public/uploads/otherDocuments/${value.qualificationCertificate}`
                : "",
              otherDocuments: value.otherDocuments
                ? `services/hr-service/public/uploads/otherDocuments/${value.otherDocuments}`
                : "",
            }
          : {};
      },
      set(value) {
        const fields = [
          "image",
          "copyOfQID",
          "copyOfPassport",
          "resume",
          "qualificationCertificate",
          "otherDocuments",
        ];
        const documentDetails = {};

        fields.forEach((field) => {
          const file = value[field];
          let filename = "";

          if (file) {
            if (typeof file === "string") {
              filename = file
                .replace(/^.*[\\\/]/, "")
                .replace(/^\/services\/hr-service\/public\/uploads\/otherDocuments\//, "");
            } else {
              filename = file;
            }
          }

          documentDetails[field] = filename;
        });

        this.setDataValue("documentDetails", documentDetails);
      },
    },
    insuranceDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("insuranceDetails");
        return value
          ? {
              healthCardNumber: value.healthCardNumber || "",
              issuingAuthority: value.issuingAuthority || "",
              expireDate: value.expireDate || "",
              knownMedicalConditions: value.knownMedicalConditions || "",
              allergies: value.allergies || "",
              notesOrRemarks: value.notesOrRemarks || "",
              policyNumber: value.policyNumber || "",
              coverageDetails: value.coverageDetails || "",
              compensationExpireDate: value.compensationExpireDate || "",
              insuranceProvider: value.insuranceProvider || "",
              additionalPolicyDetails: value.additionalPolicyDetails || "",
              attachments: value.attachments
                ? `services/hr-service/public/uploads/insuranceDocuments/${value.attachments}`
                : "",
            }
          : {
              healthCardNumber: "",
              issuingAuthority: "",
              expireDate: "",
              knownMedicalConditions: "",
              allergies: "",
              notesOrRemarks: "",
              policyNumber: "",
              coverageDetails: "",
              compensationExpireDate: "",
              insuranceProvider: "",
              additionalPolicyDetails: "",
              attachments: "",
            };
      },
      set(value) {
        // Store only the filename, not the full path
        const attachments = value.attachments;
        let filename = "";

        if (attachments) {
          if (typeof attachments === "string") {
            // Extract filename from full path if it's a path
            filename = attachments
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/insuranceDocuments\//, "");
          } else {
            // If it's a File object or already a filename, handle appropriately
            filename = attachments;
          }
        }

        this.setDataValue("insuranceDetails", {
          healthCardNumber: value.healthCardNumber || "",
          issuingAuthority: value.issuingAuthority || "",
          expireDate: value.expireDate || "",
          knownMedicalConditions: value.knownMedicalConditions || "",
          allergies: value.allergies || "",
          notesOrRemarks: value.notesOrRemarks || "",
          policyNumber: value.policyNumber || "",
          coverageDetails: value.coverageDetails || "",
          compensationExpireDate: value.compensationExpireDate || "",
          insuranceProvider: value.insuranceProvider || "",
          additionalPolicyDetails: value.additionalPolicyDetails || "",
          attachments: filename,
        });
      },
    },
    fleetDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("fleetDetails");
        return value
          ? {
              operatorType: value.operatorType || "",
              equipmentDetails: value.equipmentDetails || "",
              month: value.month || "",
              gatePassNumber: value.gatePassNumber || "",
              gatePassLocation: value.gatePassLocation || "",
              gateAccessNo: value.gateAccessNo || "",
              appHashNumber: value.appHashNumber || "",
              gatePassIssueDate: value.gatePassIssueDate || "",
              gatePassExpireDate: value.gatePassExpireDate || "",
              gatePassAttachment: value.gatePassAttachment
                ? `services/hr-service/public/uploads/employeeGatePasses/${value.gatePassAttachment}`
                : "",
              gatePassExpireStatus: value.gatePassExpireStatus || "",
              fleetStatus: value.fleetStatus || "",
            }
          : {
              operatorType: "",
              equipmentDetails: "",
              month: "",
              gatePassNumber: "",
              gatePassNumber: "",
              gateAccessNo: "",
              appHashNumber: "",
              gatePassIssueDate: "",
              gatePassExpireDate: "",
              gatePassAttachment: "",
              gatePassExpireStatus: "",
              fleetStatus: "",
            };
      },
      set(value) {
        // Store only the filename, not the full path
        const gatePassAttachment = value.gatePassAttachment;
        let filename = "";

        if (gatePassAttachment) {
          if (typeof gatePassAttachment === "string") {
            // Extract filename from full path if it's a path
            filename = gatePassAttachment
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/employeeGatePasses\//, "");
          } else {
            // If it's a File object or already a filename, handle appropriately
            filename = gatePassAttachment;
          }
        }

        this.setDataValue("fleetDetails", {
          operatorType: value.operatorType || "",
          equipmentDetails: value.equipmentDetails || "",
          month: value.month || "",
          gatePassNumber: value.gatePassNumber || "",
          gatePassLocation: value.gatePassLocation || "",
          gateAccessNo: value.gateAccessNo || "",
          appHashNumber: value.appHashNumber || "",
          gatePassIssueDate: value.gatePassIssueDate || "",
          gatePassExpireDate: value.gatePassExpireDate || "",
          gatePassAttachment: value.gatePassAttachment || "",
          gatePassExpireStatus: value.gatePassExpireStatus || "",
          fleetStatus: value.fleetStatus || "",
        });
      },
    },
    trainingCertificationsDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("trainingCertificationsDetails");
        return value
          ? {
              trainingTitle: value.trainingTitle || "",
              issueDate: value.issueDate || "",
              expiryDate: value.expiryDate || "",
              idIqamaNo: value.idIqamaNo || "",
              companyName: value.companyName || "",
              description: value.description || "",
              certifiedAs: value.certifiedAs || "",
              trainingCertificate: value.trainingCertificate
                ? `services/hr-service/public/uploads/trainingCertifications/${value.trainingCertificate}`
                : "",
            }
          : {
              trainingTitle: "",
              issueDate: "",
              expiryDate: "",
              idIqamaNo: "",
              companyName: "",
              description: "",
              certifiedAs: "",
              trainingCertificate: "",
            };
      },
      set(value) {
        // Store only the filename, not the full path
        const trainingCertificate = value.trainingCertificate;
        let filename = "";

        if (trainingCertificate) {
          if (typeof trainingCertificate === "string") {
            // Extract filename from full path if it's a path
            filename = trainingCertificate
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/trainingCertifications\//, "");
          } else {
            // If it's a File object or already a filename, handle appropriately
            filename = trainingCertificate;
          }
        }

        this.setDataValue("trainingCertificationsDetails", {
          trainingTitle: value.trainingTitle || "",
          issueDate: value.issueDate || "",
          expiryDate: value.expiryDate || "",
          idIqamaNo: value.idIqamaNo || "",
          companyName: value.companyName || "",
          description: value.description || "",
          certifiedAs: value.certifiedAs || "",
          trainingCertificate: value.trainingCertificate || "",
        });
      },
    },
    otherDetails: {
      type: DataTypes.JSON,
      allowNull: false,
      get() {
        const value = this.getDataValue("otherDetails");
        return value
          ? {
              dateOfJoin: value.dateOfJoin || "",
              // yearsOfService: value.yearsOfService || 0,
              designation: value.designation || "",
              employeeType: value.employeeType || "",
              status: value.status,
              workPlace: value.workPlace || "",
              departmentName: value.departmentName || "",
              annualLeaveCount: value.annualLeaveCount || 0,
              destinationCountry: value.destinationCountry || "",
            }
          : {};
      },
      set(value) {
        this.setDataValue("otherDetails", {
          dateOfJoin: value.dateOfJoin || "",
          // yearsOfService: value.yearsOfService || 0,
          designation: value.designation || "",
          employeeType: value.employeeType || "",
          status: value.status,
          workPlace: value.workPlace || "",
          departmentName: value.departmentName || "",
          annualLeaveCount: value.annualLeaveCount || 0,
          destinationCountry: value.destinationCountry || "",
        });
      },
    },
    completionStatuses: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    familyDetailsId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    workExperienceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_employees",
    timestamps: true,
    hooks: {
      // Add this hook to auto-generate employee number before creating
      beforeCreate: async (employee) => {
        try {
          // Get the last employee number
          const lastEmployee = await EmployeeModel.findOne({
            order: [["id", "DESC"]],
            attributes: ["personalDetails"],
          });

          let nextNumber = 1;

          if (
            lastEmployee &&
            lastEmployee.personalDetails &&
            lastEmployee.personalDetails.employeeNo
          ) {
            // Extract number from format like "AX-0003"
            const employeeNo = lastEmployee.personalDetails.employeeNo;
            const parts = employeeNo.split("-");
            if (parts.length === 2) {
              const lastNumber = parseInt(parts[1]);
              if (!isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
              }
            }
          }

          // Format with leading zeros (e.g., AX-0001, AX-0002)
          const newEmployeeNo = `AX-${String(nextNumber).padStart(4, "0")}`;

          // Update the employee's personalDetails with the new employee number
          const currentPersonalDetails = employee.personalDetails || {};
          employee.personalDetails = {
            ...currentPersonalDetails,
            employeeNo: newEmployeeNo,
          };
        } catch (error) {
          console.error("Error generating employee number:", error);
          throw error;
        }
      },
    },
  }
);

/**
 * OperationalShiftAllocationModel
 *
 * This model stores per-shift allocation records linked to a Sales Order.
 * Each record represents one shift's operational assignment (Day or Night)
 * for a given date, along with its operational status.
 *
 * Shift windows (defined by system rules):
 *   Day Shift  : 06:00 – 17:59
 *   Night Shift: 18:00 – 05:59 (next day)
 */
const OperationalShiftAllocationModel = sequelize.define(
  "tbl_operational_shift_allocation",
  {
    shift_allocation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    so_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrdersModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      comment: "Linked Sales Order",
    },
    shift_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "The calendar date for this shift allocation (YYYY-MM-DD)",
    },
    shift_type: {
      type: DataTypes.ENUM("Day", "Night"),
      allowNull: false,
      comment: "Day = 06:00-17:59, Night = 18:00-05:59",
    },
    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment:
        "The scheduled start date set during equipment allocation. Determines when the order becomes active.",
    },
    operational_status: {
      type: DataTypes.ENUM(
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled"
      ),
      allowNull: false,
      defaultValue: "Pending",
      comment:
        "Operational status for this shift. 'Completed' moves the order to Completed Orders list.",
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
    },
  },
  {
    tableName: "tbl_operational_shift_allocation",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

/**
 * OperationalShiftEquipmentModel
 * Equipment allocated to a specific shift allocation.
 */
const OperationalShiftEquipmentModel = sequelize.define(
  "tbl_operational_shift_equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shift_allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperationalShiftAllocationModel,
        key: "shift_allocation_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    serial_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EquipmentModel,
        key: "serial_number",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_operational_shift_equipment",
    timestamps: true,
  }
);

/**
 * OperationalShiftManpowerModel
 * Manpower (employees) allocated to a specific shift allocation.
 */
const OperationalShiftManpowerModel = sequelize.define(
  "tbl_operational_shift_manpower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shift_allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperationalShiftAllocationModel,
        key: "shift_allocation_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EmployeeModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_operational_shift_manpower",
    timestamps: true,
  }
);

/**
 * OperationalShiftAttachmentModel
 * Attachments allocated to a specific shift allocation.
 */
const OperationalShiftAttachmentModel = sequelize.define(
  "tbl_operational_shift_attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shift_allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: OperationalShiftAllocationModel,
        key: "shift_allocation_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    attachment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AttachmentModel,
        key: "attachment_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_operational_shift_attachment",
    timestamps: true,
  }
);

// ─── Associations ────────────────────────────────────────────────────────────

// ShiftAllocation <-> SalesOrder
OperationalShiftAllocationModel.belongsTo(SalesOrdersModel, {
  foreignKey: "so_id",
  as: "salesOrder",
});
SalesOrdersModel.hasMany(OperationalShiftAllocationModel, {
  foreignKey: "so_id",
  as: "shiftAllocations",
});

// ShiftAllocation <-> Equipment
OperationalShiftAllocationModel.hasMany(OperationalShiftEquipmentModel, {
  foreignKey: "shift_allocation_id",
  as: "equipmentAllocations",
  sourceKey: "shift_allocation_id",
});
OperationalShiftEquipmentModel.belongsTo(OperationalShiftAllocationModel, {
  foreignKey: "shift_allocation_id",
  as: "shiftAllocation",
  targetKey: "shift_allocation_id",
});
OperationalShiftEquipmentModel.belongsTo(EquipmentModel, {
  foreignKey: "serial_number",
  as: "equipment",
});
EquipmentModel.hasMany(OperationalShiftEquipmentModel, {
  foreignKey: "serial_number",
  as: "shiftEquipmentAllocations",
});

// ShiftAllocation <-> Manpower
OperationalShiftAllocationModel.hasMany(OperationalShiftManpowerModel, {
  foreignKey: "shift_allocation_id",
  as: "manpowerAllocations",
  sourceKey: "shift_allocation_id",
});
OperationalShiftManpowerModel.belongsTo(OperationalShiftAllocationModel, {
  foreignKey: "shift_allocation_id",
  as: "shiftAllocation",
  targetKey: "shift_allocation_id",
});
OperationalShiftManpowerModel.belongsTo(EmployeeModel, {
  foreignKey: "employee_id",
  as: "employee",
});
EmployeeModel.hasMany(OperationalShiftManpowerModel, {
  foreignKey: "employee_id",
  as: "shiftManpowerAllocations",
});

// ShiftAllocation <-> Attachment
OperationalShiftAllocationModel.hasMany(OperationalShiftAttachmentModel, {
  foreignKey: "shift_allocation_id",
  as: "attachmentAllocations",
  sourceKey: "shift_allocation_id",
});
OperationalShiftAttachmentModel.belongsTo(OperationalShiftAllocationModel, {
  foreignKey: "shift_allocation_id",
  as: "shiftAllocation",
  targetKey: "shift_allocation_id",
});
OperationalShiftAttachmentModel.belongsTo(AttachmentModel, {
  foreignKey: "attachment_id",
  as: "attachment",
});
AttachmentModel.hasMany(OperationalShiftAttachmentModel, {
  foreignKey: "attachment_id",
  as: "shiftAttachmentAllocations",
});

module.exports = {
  OperationalShiftAllocationModel,
  OperationalShiftEquipmentModel,
  OperationalShiftManpowerModel,
  OperationalShiftAttachmentModel,
};