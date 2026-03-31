const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const JobLocationModel = require("./JobLocationModel");
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
const ProductModel = require("./ProductModel");
const ServiceOptionsModel = require("./ServiceOptionsModel");
const EquipmentRentalServiceModel = require("./EquipmentRentalServiceModel");
const OtherChargesModel = require("./OtherChargesModel");

const SalesOrdersModel = sequelize.define(
  "tbl_sales_order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    so_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    ordered_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    client: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: JobLocationModel,
        key: "job_location_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    sales_person_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: EmployeeModel,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    quotation_number: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    has_delivery_note: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment:
        "Indicates if at least one delivery note has been created for this order",
    },
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    delivery_address: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lpo_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    lpo_start_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lpo_validity_start_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lpo_validity_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lpo_extension_issue_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lpo_extension_start_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lpoEndDateSupportAttachment: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const value = this.getDataValue("lpoEndDateSupportAttachment");
        return value
          ? `services/fleet-management-service/public/uploads/lpoEndDateSupportAttachmentDocuments/${value}`
          : "";
      },
      set(value) {
        // Store only the filename, not the full path
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            // Extract filename from full path if it's a path
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(
                /^\/services\/fleet-management-service\/public\/uploads\/lpoEndDateSupportAttachmentDocuments\//,
                "",
              );
          } else {
            // If it's a File object or already a filename
            filename = value;
          }
        }
        this.setDataValue("lpoEndDateSupportAttachment", filename);
      },
    },
    extended_lpo_validity_date: {
      type: DataTypes.DATEONLY,
      allowNull: true, // Only for edit form
    },
    revised_lpo_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    supportAttachment: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      get() {
        const value = this.getDataValue("supportAttachment");
        return value
          ? `services/fleet-management-service/public/uploads/supportAttachmentDocuments/${value}`
          : "";
      },
      set(value) {
        // Store only the filename, not the full path
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            // Extract filename from full path if it's a path
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/fleet-management-service\/public\/uploads\/supportAttachmentDocuments\//, "");
          } else {
            // If it's a File object or already a filename
            filename = value;
          }
        }
        this.setDataValue("supportAttachment", filename);
      },
    },
    supportAttachmentHistory: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of previous support attachment filenames with timestamps",
    },
    no_lpo_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Remarks for not obtaining LPO",
    },
    no_lpo_last_reminder_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Last date when reminder was sent for LPO remarks",
    },
    no_lpo_reminder_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Number of reminders sent for LPO remarks",
    },

    lpo_expired_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Remarks for not obtaining LPO extension",
    },
    lpo_expired_last_reminder_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Last date when reminder was sent for expired LPO remarks",
    },
    lpo_expired_reminder_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Number of reminders sent for expired LPO remarks",
    },

    manager_notified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Whether manager has been notified about remarks",
    },
    manager_notification_date: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Date when manager was notified",
    },
    product_service_option: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    product_type_vehicle_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    billing_type: {
      type: DataTypes.ENUM("daily", "weekly", "monthly"),
      allowNull: false,
    },
    recovery_remarks: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    no_of_equipment: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    operator_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    no_of_operator: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // sub_product: {
    //   type: DataTypes.STRING(100),
    //   allowNull: true,
    // },
    mobilization_unit_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    demobilization_unit_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mobilization_no_of_trips: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    demobilization_no_of_trips: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // other_charges: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
    // other_charges_description: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    // },
    // other_charges_unit_rate: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    // },
    engine_hours_limit: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    additional_charges: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // chargeable_types: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    //   defaultValue: [],
    //   comment: "Array of selected chargeable type IDs",
    // },
    // chargeable_types: {
    //   type: DataTypes.JSON,
    //   allowNull: true,
    //   defaultValue: [],
    //   comment:
    //     "Array of chargeable type objects with name, is_selected and effective_start_date",
    //   get() {
    //     const rawValue = this.getDataValue("chargeable_types");
    //     if (!rawValue || !Array.isArray(rawValue)) return [];

    //     return rawValue.map((item) => {
    //       // Ensure backward compatibility
    //       if (typeof item === "number" || typeof item === "string") {
    //         return {
    //           id: item,
    //           name: `Chargeable Type ${item}`,
    //           is_selected: true,
    //           effective_start_date: null,
    //         };
    //       }
    //       return item;
    //     });
    //   },
    //   set(value) {
    //     if (Array.isArray(value)) {
    //       // Transform to store only necessary data
    //       const transformed = value.map((item) => {
    //         if (typeof item === "object" && item !== null) {
    //           return {
    //             id: item.id || null,
    //             name: item.name || `Chargeable Type ${item.id}`,
    //             is_selected:
    //               item.is_selected !== undefined ? item.is_selected : true,
    //             effective_start_date: item.effective_start_date || null,
    //           };
    //         }
    //         return item;
    //       });
    //       this.setDataValue("chargeable_types", transformed);
    //     } else {
    //       this.setDataValue("chargeable_types", value);
    //     }
    //   },
    // },
    chargeable_types_selected: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of selected chargeable types with their details",
    },

    chargeable_type_effective_start_date: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Effective start date for chargeable types",
    },

    // Keep existing chargeable_types field for backward compatibility
    chargeable_types: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of selected chargeable type IDs (legacy)",
    },
    chargeable_types_table: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment:
        "Array of chargeable types with name, selected status and effective date",
    },
    is_chargeble_demobilization: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_chargeble_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_chargeble_idle_hours: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_chargeble_public_holiday: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_chargeble_training: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_chargeble_under_inspection: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    sub_product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: ProductModel,
        key: "product_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    // select_product: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    // },
    // unit_price: {
    //   type: DataTypes.DECIMAL(10, 2),
    //   allowNull: true,
    // },
    // income_account: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    // },
    // fuel: {
    //   type: DataTypes.ENUM("Client", "Company"),
    //   allowNull: false,
    // },
    // food: {
    //   type: DataTypes.ENUM("Client", "Company"),
    //   allowNull: false,
    // },
    // accommodation: {
    //   type: DataTypes.ENUM("Client", "Company"),
    //   allowNull: false,
    // },
    // transportation: {
    //   type: DataTypes.ENUM("Client", "Company"),
    //   allowNull: false,
    // },
    shift: {
      type: DataTypes.ENUM("Day", "Night", "Full", "Day and Night"),
      allowNull: false,
    },
    unit_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    day_unit_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    night_unit_rate: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    quantity_trips_or_days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    is_friday_off: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_public_holiday_off: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    // order_status: {
    //   type: DataTypes.ENUM(
    //     "Pending",
    //     "Confirmed",
    //     "In Progress",
    //     "Delivery Note",
    //     "Completed",
    //     "Cancelled",
    //     "Under Approval",
    //     "Under Review",
    //     "Rejected",
    //     "Off Hire Note"
    //   ),
    //   allowNull: true,
    //   defaultValue: "Pending",
    // },
    so_status: {
      type: DataTypes.ENUM(
        "Draft",
        "Under Approval",
        "Rejected",
        "Closed",
        "Revision Rejected",
        "Approved",
        "Revision Under Approval",
      ),
      allowNull: true,
    },
    ops_status: {
      type: DataTypes.ENUM(
        "Pending resource Allocation",
        "Pending Delivery Note",
        "Partially Delivered",
        "In Operation",
        "Partially Off Hired",
        "Completed",
      ),
      allowNull: true,
    },
    approval_remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    needs_approval: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    previous_so_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    edited_fields: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    expected_mobilization_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expected_demobilization_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    normal_working_hrs_equipment: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    normal_working_hrs_manpower: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    // ot_applicable: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: false,
    // },
    // ot_rate_qar: {
    //   type: DataTypes.DECIMAL(10, 2),
    //   allowNull: true,
    // },
    day_ot_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Day shift overtime rate (QAR per hour)",
    },
    night_ot_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Night shift overtime rate (QAR per hour)",
    },
    full_ot_rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Full shift overtime rate (QAR per hour)",
    },
    service_entry_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    recovery_is_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    recovery_cost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gate_pass_location: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    gate_access_no: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    effective_start_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    effective_end_date: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    billing_history: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of billing history records with rates and dates",
    },
    // type_of_recovery_vehicle: {
    //   type: DataTypes.STRING(255),
    //   allowNull: true,
    // },
    description_remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // status: {
    //   type: DataTypes.ENUM("Active", "Inactive"),
    //   allowNull: false,
    //   defaultValue: "Active",
    // },
    completionStatuses: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    is_draft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Indicates if this is a draft (not submitted)",
    },
    draft_data: {
      type: DataTypes.JSON,
      allowNull: true,
      comment:
        "Stores draft form data including all fields and completion statuses",
    },
    last_auto_saved_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Last auto-save timestamp",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "User ID who created this draft/order",
    },
    swap_mobilization_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    swap_demobilization_charge: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    swap_estimated_transfer_cost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    swap_sales_remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    return_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    swap_status: {
      type: DataTypes.ENUM(
        "Swap Request",
        "Approved",
        "Rejected",
        "Return",
        "Resubmit",
      ),
      allowNull: true,
      defaultValue: "Swap Request",
    },
    has_pending_swap_request: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment:
        "Indicates if there are any pending swap requests for this sales order",
    },
  },

  {
    tableName: "tbl_sales_order",
    timestamps: true,

    getterMethods: {
      getUnitRateLabel() {
        const billingType = this.getDataValue("billing_type");
        const shiftType = this.getDataValue("shift");

        const billingLabels = {
          daily: "Daily",
          weekly: "Weekly",
          monthly: "Monthly",
        };

        const shiftLabels = {
          Day: "Day",
          Night: "Night",
          Full: "Full",
          "Day and Night": "Day and Night",
        };

        const billingPrefix = billingLabels[billingType] || "";
        const shiftSuffix = shiftLabels[shiftType] || "";

        if (shiftType === "Day and Night") {
          return ""; // Not used for Day and Night shift
        }

        return (
          `${billingPrefix} Rate-Single Shift (QAR)`.trim() || "Unit Rate (QAR)"
        );
      },

      getDayUnitRateLabel() {
        const billingType = this.getDataValue("billing_type");
        const labels = {
          daily: "Daily Rate-Single Shift (QAR)",
          weekly: "Weekly Rate-Single Shift (QAR)",
          monthly: "Monthly Rate-Single Shift(QAR)",
        };
        return labels[billingType] || "Day Unit Rate (QAR)";
      },

      getNightUnitRateLabel() {
        const billingType = this.getDataValue("billing_type");
        const labels = {
          daily: "Daily Rate-Second Shift(QAR)",
          weekly: "Weekly Rate-Second Shift (QAR)",
          monthly: "Monthly Rate-Second Shift(QAR)",
        };
        return labels[billingType] || "Night Unit Rate (QAR)";
      },
    },
  },
);

SalesOrdersModel.associate = () => {
  const { tbl_other_charges } = sequelize.models;

  SalesOrdersModel.hasMany(tbl_other_charges, {
    foreignKey: "sales_order_id",
    as: "otherCharges",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};

SalesOrdersModel.belongsTo(JobLocationModel, {
  foreignKey: "location_id",
  as: "jobLocation",
});
JobLocationModel.hasMany(SalesOrdersModel, {
  foreignKey: "location_id",
  as: "salesOrders",
});

SalesOrdersModel.belongsTo(EmployeeModel, {
  foreignKey: "sales_person_id",
  as: "employee",
});
EmployeeModel.hasMany(SalesOrdersModel, {
  foreignKey: "sales_person_id",
  as: "salesOrders",
});

SalesOrdersModel.belongsTo(ProductModel, {
  foreignKey: "sub_product_id",
  as: "subProduct",
});
ProductModel.hasMany(SalesOrdersModel, {
  foreignKey: "sub_product_id",
  as: "salesOrders",
});

SalesOrdersModel.hasMany(ServiceOptionsModel, {
  foreignKey: "sales_order_id",
  as: "serviceOptions",
  onDelete: "CASCADE",
});

ServiceOptionsModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrders",
});

SalesOrdersModel.hasMany(EquipmentRentalServiceModel, {
  foreignKey: "sales_order_id",
  as: "rentalService",
  onDelete: "CASCADE",
});

EquipmentRentalServiceModel.belongsTo(SalesOrdersModel, {
  foreignKey: "sales_order_id",
  as: "salesOrders",
});

if (typeof OtherChargesModel.associate === "function") {
  OtherChargesModel.associate();
}
if (typeof SalesOrdersModel.associate === "function") {
  SalesOrdersModel.associate();
}

// Helper method to check LPO status
SalesOrdersModel.checkLPOStatus = async (salesOrder) => {
  const today = new Date();
  const lpoValidityDate = salesOrder.lpo_validity_date
    ? new Date(salesOrder.lpo_validity_date)
    : null;
  const extendedLpoValidityDate = salesOrder.extended_lpo_validity_date
    ? new Date(salesOrder.extended_lpo_validity_date)
    : null;

  const hasLPO = !!salesOrder.lpo_number;
  const isLPOExpired =
    (lpoValidityDate && lpoValidityDate < today) ||
    (extendedLpoValidityDate && extendedLpoValidityDate < today);

  return {
    hasLPO,
    isLPOExpired,
    lpoValidityDate,
    extendedLpoValidityDate,
  };
};

SalesOrdersModel.updateOrderStatus = async (
  salesOrderId,
  newStatus,
  transaction = null,
) => {
  try {
    const salesOrder = await SalesOrdersModel.findByPk(salesOrderId, {
      transaction,
    });
    if (!salesOrder) {
      throw new Error("Sales order not found");
    }

    await salesOrder.update({ so_status: newStatus }, { transaction });
    return salesOrder;
  } catch (error) {
    throw error;
  }
};

// Generate unique SO number
SalesOrdersModel.generateSONumber = async () => {
  try {
    const lastOrder = await SalesOrdersModel.findOne({
      order: [["id", "DESC"]],
    });

    let nextNumber = 1;
    if (lastOrder && lastOrder.so_number) {
      const lastNum = parseInt(lastOrder.so_number.split("-")[1]);
      nextNumber = lastNum + 1;
    }

    return `SO-${String(nextNumber).padStart(4, "0")}`;
  } catch (error) {
    throw error;
  }
};

module.exports = SalesOrdersModel;
