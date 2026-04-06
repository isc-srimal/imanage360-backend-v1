const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
const SalesPipelineModel = require("./SalesPipelineModel");
const PipelineStageModel = require("./PipelineStageModel");
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
              .replace(
                /^\/services\/hr-service\/public\/uploads\/drivingLicenseDocuments\//,
                "",
              );
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
                .replace(
                  /^\/services\/hr-service\/public\/uploads\/sponsorDetailsDocuments\//,
                  "",
                );
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
                .replace(
                  /^\/services\/hr-service\/public\/uploads\/otherDocuments\//,
                  "",
                );
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
              .replace(
                /^\/services\/hr-service\/public\/uploads\/insuranceDocuments\//,
                "",
              );
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
              .replace(
                /^\/services\/hr-service\/public\/uploads\/employeeGatePasses\//,
                "",
              );
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
              .replace(
                /^\/services\/hr-service\/public\/uploads\/trainingCertifications\//,
                "",
              );
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
  },
);

const LeadModel = sequelize.define("tbl_leads", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  phone: DataTypes.STRING,
  email: DataTypes.STRING,
  designation: DataTypes.STRING,
  lead_subject: DataTypes.STRING,
  additional_desc: DataTypes.TEXT,
  label_id: DataTypes.STRING,
  custom_field: DataTypes.STRING,
  sales_pipeline_id: DataTypes.INTEGER,
  pipeline_stages_id: DataTypes.INTEGER,
  prospect_id: DataTypes.INTEGER,
  sales_person: DataTypes.STRING, // This will store the employee's full name
  sales_person_id: {
    // Optional: if you want to also store the employee ID
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "tbl_employees",
      key: "id",
    },
  },
  lead_source: {
    // Add this new field
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "Website",
  },
});

LeadModel.belongsTo(SalesPipelineModel, {
  foreignKey: "sales_pipeline_id",
  as: "salesPipeline",
});

LeadModel.belongsTo(PipelineStageModel, {
  foreignKey: "pipeline_stages_id",
  as: "pipelineStage",
});

LeadModel.belongsTo(EmployeeModel, {
  foreignKey: "sales_person_id",
  as: "salesPersonEmployee",
  constraints: false, // Since this is optional
});

module.exports = LeadModel;
