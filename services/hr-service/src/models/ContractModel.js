// EmployeeContractTemplateModel.js
const { DataTypes } = require("sequelize");
const sequelize = require("../../src/config/dbSync");

const EmployeeContractTemplateModel = sequelize.define(
  "tbl_employee_contract_template",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    templateName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    jobTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contractPeriod: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'e.g., "three months", "six months"',
    },
    autoRenewal: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    autoRenewalPeriod: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'e.g., "three months"',
    },
    noticeRequirement: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'e.g., "30 days"',
    },
    basicSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fixedAllowance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    accommodationProvided: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    accommodationAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    foodProvided: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    foodAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    transportationProvided: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    transportationAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    workingDaysPerMonth: {
      type: DataTypes.INTEGER,
      defaultValue: 26,
    },
    workingHoursPerDay: {
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    overtimeRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Per hour OT rate",
    },
    workingPermitRequired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    workingPermitPeriod: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    terminationNoticeCompany: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'e.g., "one month"',
    },
    terminationNoticeEmployee: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'e.g., "one month"',
    },
    earlyTerminationCharges: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Description of charges if employee leaves early",
    },
    increment: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    incrementPeriod: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'e.g., "after completion of 3 months"',
    },
    additionalTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING(255),
      defaultValue: "Auto Xpert Trading and Services W.L.L",
    },
    companyAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    companyContact: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING(500),
      allowNull: true,
      get() {
        const value = this.getDataValue("logo");
        // Return filename only, frontend will construct the full URL
        return value || null;
      },
      set(value) {
        let filename = "";
        if (value) {
          // Handle various input formats
          filename = value
            .replace(/^.*[\\\/]/, "") // Remove path
            .replace(/^\/services\/hr-service\/public\/uploads\/contractsLogos\//, ""); // Remove prefix
        }
        this.setDataValue("logo", filename || null);
      },
    },
    signingAuthorityName: {
      type: DataTypes.STRING(255),
      defaultValue: "Sajee Kumaran Wickneswara",
    },
    signingAuthorityPosition: {
      type: DataTypes.STRING(255),
      defaultValue: "Finance Manager",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "tbl_employee_contract_template",
    timestamps: true,
  }
);

// EmployeeContractDetailsModel.js
const EmployeeContractDetailsModel = sequelize.define(
  "tbl_employee_contract_details",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contractNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    onboardingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    templateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    employeeName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    qidNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    passportNumber: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    jobTitle: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contractStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contractEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    basicSalary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fixedAllowance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    accommodationAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    foodAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    transportationAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    overtimeRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    contractFilePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      get() {
        const value = this.getDataValue("contractFilePath");
        return value ? `services/hr-service/public/uploads/contracts/${value}` : "";
      },
      set(value) {
        let filename = "";
        if (value) {
          if (typeof value === "string") {
            filename = value
              .replace(/^.*[\\\/]/, "")
              .replace(/^\/services\/hr-service\/public\/uploads\/contracts\//, "");
          } else {
            filename = value;
          }
        }
        this.setDataValue("contractFilePath", filename);
      },
    },
    status: {
      type: DataTypes.ENUM("draft", "active", "completed", "terminated"),
      defaultValue: "draft",
    },
    signedDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tbl_employee_contract_details",
    timestamps: true,
  }
);

// Note: Relationships should be defined after all models are loaded
// Add this in a separate file or after JobOnboardingModel is imported
const setupContractRelationships = (JobOnboardingModel) => {
  EmployeeContractDetailsModel.belongsTo(JobOnboardingModel, {
    foreignKey: "onboardingId",
    as: "onboarding",
  });
  JobOnboardingModel.hasMany(EmployeeContractDetailsModel, {
    foreignKey: "onboardingId",
    as: "contracts",
  });

  EmployeeContractDetailsModel.belongsTo(EmployeeContractTemplateModel, {
    foreignKey: "templateId",
    as: "template",
  });
  EmployeeContractTemplateModel.hasMany(EmployeeContractDetailsModel, {
    foreignKey: "templateId",
    as: "contracts",
  });
};

module.exports = {
  EmployeeContractTemplateModel,
  EmployeeContractDetailsModel,
  setupContractRelationships,
};
