const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");
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
const DepartmentModel = sequelize.define('tbl_department', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    departmentNo: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    departmentName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    departmentDescription: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    departmentHead: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_department',
    timestamps: false,
});
const AssetCategoryModel = sequelize.define('tbl_asset_categories', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
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
}, {
    tableName: 'tbl_asset_categories',
    timestamps: false,
});
const AssetSubcategoryModel = sequelize.define('tbl_asset_subcategories', {
    subcategory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subcategory_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCategoryModel,
            key: 'category_id',
        },
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
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
}, {
    tableName: 'tbl_asset_subcategories',
    timestamps: false,
});
const AssetCapacityModel = sequelize.define('tbl_asset_capacities', {
    capacity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    capacity_value: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCategoryModel,
            key: 'category_id',
        },
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetSubcategoryModel,
            key: 'subcategory_id',
        },
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
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
}, {
    tableName: 'tbl_asset_capacities',
    timestamps: false,
});
const ManufacturerModel = sequelize.define('tbl_asset_manufacturer', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    manufacturer: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_asset_manufacturer',
    timestamps: true,
});
const ModelAssetModel = sequelize.define('tbl_asset_model', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    manufacturer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ManufacturerModel,
        key: "id",
      },
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },
}, {
    tableName: 'tbl_asset_model',
    timestamps: true,
});
const AssetClassificationModel = sequelize.define('tbl_asset_classifications', {
    classification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCategoryModel,
            key: 'category_id',
        },
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetSubcategoryModel,
            key: 'subcategory_id',
        },
    },
    capacity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCapacityModel,
            key: 'capacity_id',
        },
    },
    default_dep_method: {
        type: DataTypes.ENUM('straight_line', 'declining_balance', 'units_of_production'),
        allowNull: false,
    },
    default_dep_rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    default_useful_life: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    gl_account_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    // New fields for Units of Production method
    units_of_measurement: {
        type: DataTypes.ENUM('Km', 'Hrs', 'Units'),
        allowNull: true,
    },
    total_output: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
        },
    },
    classification_name: {
        type: DataTypes.STRING(250),
        allowNull: false,
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
}, {
    tableName: 'tbl_asset_classifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});
const LocationIDModel = sequelize.define('tbl_location', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    location_name: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_location',
    timestamps: false,
});
const CostCenterIDModel = sequelize.define('tbl_cost_center', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    cost_center_name: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_cost_center',
    timestamps: false,
});
const SupplierIDModel = sequelize.define('tbl_supplier', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    supplier_name: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_supplier',
    timestamps: false,
});
const CustodianIDModel = sequelize.define('tbl_custodian', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    custodian_name: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive'),
        allowNull: false,
        defaultValue: 'Active',
    },
}, {
    tableName: 'tbl_custodian',
    timestamps: false,
});
const AssetModel = sequelize.define('tbl_assets', {
    asset_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    asset_number: {
        type: DataTypes.STRING(255),
        unique: true,
        allowNull: false,
    },
    tag_number: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true,
    },
    serial_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
    },
    engine_number: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    year_of_manufacture: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    manufacturer_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ManufacturerModel,
            key: 'id',
        },
    },
    model_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: ModelAssetModel,
            key: 'id',
        },
    },
    vehicle_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    VIN: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    classification_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetClassificationModel,
            key: 'classification_id',
        },
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetCategoryModel,
            key: 'category_id',
        },
    },
    subcategory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AssetSubcategoryModel,
            key: 'subcategory_id',
        },
    },
    capacity_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: AssetCapacityModel,
            key: 'capacity_id',
        },
    },
    location_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: LocationIDModel,
            key: 'location_name',
        },
    },
    cost_center_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: CostCenterIDModel,
            key: 'cost_center_name',
        },
    },
    departmentName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: DepartmentModel,
            key: 'departmentName',
        },
    },
    custodian_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: CustodianIDModel,
            key: 'custodian_name',
        },
    },
    acquisition_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    acquisition_cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    accumulated_depreciation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        // No references here, as this is the column being referenced by DepreciationScheduleModel
    },
    monthly_depreciation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        // No references here
    },
    yearly_depreciation: {
        type: DataTypes.FLOAT,
        allowNull: true,
        // No references here
    },
    is_depreciation_calculated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
    },
    supplier_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
        references: {
            model: SupplierIDModel,
            key: 'supplier_name',
        },
    },
    purchase_order_id: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    useful_life: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    default_dep_rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    residual_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    current_value: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'disposed', 'transferred', 'in_construction'),
        defaultValue: 'active',
    },
    barcode: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    rfid_tag: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    journal_entry_id: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    photo_attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    document_attachments: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
    },
    warranty_details: {
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
}, {
    tableName: 'tbl_assets',
    timestamps: false,
});
const VehicleOwnerModel = require("./VehicleOwnerModel");

const EquipmentModel = sequelize.define(
  "tbl_equipment",
  {
    serial_number: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    asset_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Changed from false to true
      references: {
        model: "tbl_assets",
        key: "asset_id",
      },
    },
    // asset_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: "tbl_assets",
    //     key: "asset_id",
    //   },
    // },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tbl_vehicle_owner",
        key: "vehicle_owner_id",
      },
    },
    // schedule_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   comment: "Reference to schedule record",
    // },
    reg_number: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    serial_numbers: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
    },
    engine_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    // category_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    // subcategory_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for custom categories
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for custom subcategories
    },
    capacity_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Nullable for custom subcategories
    },
    manufacturer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // Add these new fields to store custom names
    asset_number_custom: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Custom asset number if not from master list",
    },
    category_name_custom: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Custom category name if not from master list",
    },
    subcategory_name_custom: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "Custom subcategory name if not from master list",
    },
    vehicle_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    VIN: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    year_of_manufacture: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    departmentName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      references: {
        model: DepartmentModel,
        key: "departmentName",
      },
    },
    // customer_name: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
    // },
    employeeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tbl_employees",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      allowNull: false,
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    rfid_tag: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    photo_attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    document_attachments: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    equipment_status: {
      type: DataTypes.ENUM(
        "day-off",
        "idle",
        "major-breakdown",
        "minor-breakdown",
        "inspection",
        "public-holiday",
        "asset-defleet",
        "new-asset",
        "allocated",
      ),
      allowNull: false,
      defaultValue: "idle",
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: true,
      defaultValue: "Active",
    },
    equipment_status_note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment:
        "Note for statuses that require explanation (e.g., breakdown details)",
    },
    // project_name: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
    // },
    // schedule_name: {
    //   type: DataTypes.STRING(255),
    //   allowNull: false,
    // },
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
    tableName: "tbl_equipment",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

EquipmentModel.belongsTo(EmployeeModel, {
  foreignKey: "employeeId",
  as: "employee",
});
EmployeeModel.hasMany(EquipmentModel, {
  foreignKey: "employeeId",
  as: "equipment",
});

EquipmentModel.belongsTo(AssetModel, {
  foreignKey: "asset_id",
  as: "asset",
});
AssetModel.hasMany(EquipmentModel, {
  foreignKey: "asset_id",
  as: "equipment",
});

EquipmentModel.belongsTo(AssetCategoryModel, {
  foreignKey: "category_id",
  as: "category",
});
EquipmentModel.belongsTo(AssetSubcategoryModel, {
  foreignKey: "subcategory_id",
  as: "subcategory",
});
EquipmentModel.belongsTo(AssetCapacityModel, {
  foreignKey: "capacity_id",
  as: "capacity",
});
EquipmentModel.belongsTo(ManufacturerModel, {
  foreignKey: "manufacturer_id",
  as: "manufacturer",
});
EquipmentModel.belongsTo(ModelAssetModel, {
  foreignKey: "model_id",
  as: "model",
});

EquipmentModel.belongsTo(VehicleOwnerModel, {
  foreignKey: "owner_id",
  as: "owner",
});
VehicleOwnerModel.hasMany(EquipmentModel, {
  foreignKey: "owner_id",
  as: "equipment",
});

EquipmentModel.belongsTo(DepartmentModel, {
  foreignKey: "departmentName",
  as: "department",
});
DepartmentModel.hasMany(EquipmentModel, {
  foreignKey: "departmentName",
  as: "equipment",
});

module.exports = EquipmentModel;
