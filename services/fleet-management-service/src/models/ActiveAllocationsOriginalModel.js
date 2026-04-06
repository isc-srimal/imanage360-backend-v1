const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesOrdersModel = require("./SalesOrdersModel");
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
const EquipmentModel = require("./EquipmentModel");
const AttachmentModel = require("./AttachmentModel");

const ActiveAllocationModel = sequelize.define(
  "tbl_active_allocation_original",
  {
    allocation_id: {
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
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    service_option: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    allocation_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Delivery Note Created", "Completed", "Cancelled", "Off Hire Note Created"),
      allowNull: false,
      defaultValue: "Active",
    },
    user_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_active_allocation_original",
    timestamps: true,
  }
);

const AllocationEquipmentModel = sequelize.define(
  "tbl_allocation_equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
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
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    eqt_stu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "tbl_allocation_equipment",
    timestamps: true,
  }
);

const AllocationManpowerModel = sequelize.define(
  "tbl_allocation_manpower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
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
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    man_stu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "tbl_allocation_manpower",
    timestamps: true,
  }
);

const AllocationAttachmentModel = sequelize.define(
  "tbl_allocation_attachment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
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
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    att_stu: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_selected: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "tbl_allocation_attachment",
    timestamps: true,
  }
);

const AllocationBackupEquipmentModel = sequelize.define(
  "tbl_allocation_backup_equipment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
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
    scheduled_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Remark for when backup equipment is already assigned to another SO on the same date",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    eqt_stu: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "backup",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_allocation_backup_equipment",
    timestamps: true,
  }
);

// NEW: Backup Manpower Model
const AllocationBackupManpowerModel = sequelize.define(
  "tbl_allocation_backup_manpower",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    allocation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ActiveAllocationModel,
        key: "allocation_id",
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
    scheduled_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Remark for when backup manpower is already assigned to another SO on the same date",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    man_stu: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "backup",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_allocation_backup_manpower",
    timestamps: true,
  }
);

const AllocationRemarksHistoryModel = sequelize.define(
  "tbl_allocation_remarks_history",
  {
    remark_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sales_order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SalesOrdersModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    remark_text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "tbl_allocation_remarks_history",
    timestamps: true,
    updatedAt: false, // Only track creation time
  }
);

// FIXED ASSOCIATIONS - Properly define both sides
ActiveAllocationModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

SalesOrdersModel.hasMany(ActiveAllocationModel, {
  foreignKey: "sales_order_id",
  as: "allocations",
});

// Equipment Associations
ActiveAllocationModel.hasMany(AllocationEquipmentModel, {
  foreignKey: "allocation_id",
  as: "equipmentAllocations",
  sourceKey: "allocation_id",
});

AllocationEquipmentModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
  targetKey: "allocation_id",
});

AllocationEquipmentModel.belongsTo(EquipmentModel, {
  foreignKey: "serial_number",
  as: "equipment",
});

EquipmentModel.hasMany(AllocationEquipmentModel, {
  foreignKey: "serial_number",
  as: "allocations",
});

// Manpower Associations
ActiveAllocationModel.hasMany(AllocationManpowerModel, {
  foreignKey: "allocation_id",
  as: "manpowerAllocations",
  sourceKey: "allocation_id",
});

AllocationManpowerModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
  targetKey: "allocation_id",
});

AllocationManpowerModel.belongsTo(EmployeeModel, {
  foreignKey: "employee_id",
  as: "employee",
});

EmployeeModel.hasMany(AllocationManpowerModel, {
  foreignKey: "employee_id",
  as: "allocations",
});

// Attachment Associations
ActiveAllocationModel.hasMany(AllocationAttachmentModel, {
  foreignKey: "allocation_id",
  as: "attachmentAllocations",
  sourceKey: "allocation_id",
});

AllocationAttachmentModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
  targetKey: "allocation_id",
});

AllocationAttachmentModel.belongsTo(AttachmentModel, {
  foreignKey: "attachment_id",
  as: "attachment",
});

AttachmentModel.hasMany(AllocationAttachmentModel, {
  foreignKey: "attachment_id",
  as: "allocations",
});

// Backup Equipment Associations
ActiveAllocationModel.hasMany(AllocationBackupEquipmentModel, {
  foreignKey: "allocation_id",
  as: "backupEquipmentAllocations",
  sourceKey: "allocation_id",
});

AllocationBackupEquipmentModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
  targetKey: "allocation_id",
});

AllocationBackupEquipmentModel.belongsTo(EquipmentModel, {
  foreignKey: "serial_number",
  as: "equipment",
});

EquipmentModel.hasMany(AllocationBackupEquipmentModel, {
  foreignKey: "serial_number",
  as: "backupAllocations",
});

// Backup Manpower Associations
ActiveAllocationModel.hasMany(AllocationBackupManpowerModel, {
  foreignKey: "allocation_id",
  as: "backupManpowerAllocations",
  sourceKey: "allocation_id",
});

AllocationBackupManpowerModel.belongsTo(ActiveAllocationModel, {
  foreignKey: "allocation_id",
  as: "allocation",
  targetKey: "allocation_id",
});

AllocationBackupManpowerModel.belongsTo(EmployeeModel, {
  foreignKey: "employee_id",
  as: "employee",
});

EmployeeModel.hasMany(AllocationBackupManpowerModel, {
  foreignKey: "employee_id",
  as: "backupAllocations",
});

SalesOrdersModel.hasMany(AllocationRemarksHistoryModel, {
  foreignKey: "sales_order_id",
  as: "remarksHistory",
});

AllocationRemarksHistoryModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrder",
});

module.exports = {
  ActiveAllocationModel,
  AllocationEquipmentModel,
  AllocationManpowerModel,
  AllocationAttachmentModel,
  AllocationBackupEquipmentModel,
  AllocationBackupManpowerModel,
  AllocationRemarksHistoryModel,
};