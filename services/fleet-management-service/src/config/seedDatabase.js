const bcrypt = require("bcrypt");
const sequelize = require("../config/dbSync");
const Department = require("../models/DepartmentModel");
const Employee = require("../models/EquipmentModel").associations.employee.target;
const Assets = require("../models/EquipmentModel").associations.asset.target;
const AssetCategory = require("../models/EquipmentModel").associations.category.target;
const AssetSubCategory = require("../models/EquipmentModel").associations.subcategory.target;
const AssetCapacity = require("../models/EquipmentModel").associations.capacity.target;
const AssetClassification = require("../models/EquipmentModel").associations.classification.target;
const LocationID = require("../models/EquipmentModel").associations.location.target;
const CustodianID = require("../models/EquipmentModel").associations.custodian.target;
const CostCenterID = require("../models/EquipmentModel").associations.costCenter.target;
const SupplierID = require("../models/EquipmentModel").associations.supplier.target;
const ModelAssetModel = require("../models/EquipmentModel").associations.model.target;
const ManufacturerModel = require("../models/EquipmentModel").associations.manufacturer.target;
// const EmployeeContractModel = require("../../../hr-service/src/models/employees/EmployeeContractModel");
const DailySchedule = require("../models/DailyScheduleModel");
const Equipment = require("../models/EquipmentModel");
const JobLocation = require("../models/JobLocationModel");
const FleetMainCategory = require("../models/MainCategoryModel");
const NextServiceType = require("../models/NextServiceTypeModel");
const OperatorType = require("../models/OperatorTypeModel");
const ServiceCategory = require("../models/ServiceCategoryModel");
const ServiceProvider = require("../models/ServiceProviderModel");
const FleetServices = require("../models/ServicesModel");
const ServiceTypeOne = require("../models/ServiceTypeOneModel");
const ServiceTypeTwo = require("../models/ServiceTypeTwoModel");
const MaintenanceModel = require("../models/maintenance/MaintenanceModel");
const JobCardDetailsModel = require("../models/maintenance/JobCardDetailsModel");
const JobTimelineModel = require("../models/maintenance/JobTimelineModel");
const ServiceDetailsModel = require("../models/maintenance/ServiceDetailsModel");
const ServicePlanModel = require("../models/maintenance/ServicePlanModel");
const SalesOrderModelOld = require("../models/SalesOrderModelOld");
const SalesOrdersModel = require("../models/SalesOrdersModel");
const BreakdownModel = require("../models/BreakdownModel");
const HandheldEventModel = require("../models/HandheldEventModel");
const CoordinatorTaskModel = require("../models/CoordinatorTaskModel");
const ActiveAllocationsModel = require("../models/ActiveAllocationsModel");
const VehicleOwnerModel = require("../models/VehicleOwnerModel");
const ManpowerModel = require("../models/ManpowerModel");
const {
  ActiveAllocationModel,
  AllocationEquipmentModel,
  AllocationManpowerModel,
  AllocationAttachmentModel,
  AllocationBackupEquipmentModel,
  AllocationBackupManpowerModel,
  AllocationRemarksHistoryModel,
} = require("../models/ActiveAllocationsOriginalModel");
const ServiceEntryTypeModel = require("../models/ServiceEntryTypeModel");
const VehicleTypeModel = require("../models/VehicleTypeModel");
const ProductModel = require("../models/ProductModel");
const AttachmentModel = require("../models/AttachmentModel");
const ServiceOptionsModel = require("../models/ServiceOptionsModel");
const EquipmentRentalServiceModel = require("../models/EquipmentRentalServiceModel");
const AttachmentStatusHistoryModel = require("../models/AttachmentStatusHistoryModel");
const EquipmentScheduledModel = require("../models/EquipmentScheduledModel");
const ManpowerScheduledModel = require("../models/ManpowerScheduledModel");
const AttachmentScheduledModel = require("../models//AttachmentScheduledModel");
const AttachmentLocationModel = require("../models/AttachmentLocationModel");
const SalesOrderRecoveryModel = require("../models/SalesOrderRecoveryModel");
const AttachmentStageModel = require("../models//AttachmentStageModel");
const EquipmentStageModel = require("../models/EquipmentStageModel");
const ManpowerStageModel = require("../models/ManpowerStageModel");
const RecoveryStageModel = require("../models/RecoveryStageModel");
const SubProductAttachmentStageModel = require("../models/SubProductAttachmentStageModel");
const BackupEquipmentStageModel = require("../models/BackupEquipmentStageModel");
const BackupManpowerStageModel = require("../models/BackupManpowerStageModel");
const AssignedOperatorsModel = require("../models/AssignedOperatorsModel");
const SubProductAttachmentScheduledModel = require("../models/SubProductAttachmentScheduledModel");
const {
  DeliveryNoteModel,
  DeliveryNoteTripModel,
  DeliveryNoteEquipmentModel,
  DeliveryNoteManpowerModel,
  DeliveryNoteAttachmentModel,
  DeliveryNoteSubProductModel,
  TripCounterModel,
} = require("../models/DeliveryNoteModel");
const {
  MasterChecklistModel,
  ChecklistTemplateModel,
  ChecklistCategoryModel,
  ChecklistItemModel,
  AssignedChecklistModel,
} = require("../models/MasterChecklistModel");
const OperationalModificationModel = require("../models/OperationalModificationModel");
const EquipmentSwapModel = require("../models/EquipmentSwapModel");
const AttachmentSwapModel = require("../models/AttachmentSwapModel");
const OperatorChangeModel = require("../models/OperatorChangeModel");
const {
  EquipmentDeliveryNoteModel,
  EquipmentDeliveryNoteTripModel,
  EquipmentDNEquipmentModel,
  TripEQDNCounterModel,
} = require("../models/EquipmentDeliveryNoteModel");
const {
  EquipmentOffHireNoteModel,
  EquipmentOffHireNoteTripModel,
  EquipmentOHNEquipmentModel,
  TripEQOHNCounterModel,
} = require("../models/EquipmentOffHireNoteModel");
const {
  AttachmentDeliveryNoteModel,
  AttachmentDeliveryNoteTripModel,
  AttachmentDNAttachmentModel,
  TripATDNCounterModel,
} = require("../models/AttachmentDeliveryNoteModel");
const {
  AttachmentOffHireNoteModel,
  AttachmentOffHireNoteTripModel,
  AttachmentOHNAttachmentModel,
  TripATOHNCounterModel,
} = require("../models/AttachmentOffHireNoteModel");
const {
  OperatorDeliveryNoteModel,
  OperatorDeliveryNoteTripModel,
  OperatorDNManpowerModel,
  TripOPDNCounterModel,
} = require("../models/OperatorDeliveryNoteModel");
const {
  OperatorOffHireNoteModel,
  OperatorOffHireNoteTripModel,
  OperatorOHNManpowerModel,
  TripOPOHNCounterModel,
} = require("../models/OperatorOffHireNoteModel");

const SwapReasonModel = require("../models/swapReasonModel");
const OtherChargesModel = require("../models/OtherChargesModel");
const {
  OffHireNoteModel,
  OffHireNoteTripModel,
  OffHireNoteEquipmentModel,
  OffHireNoteManpowerModel,
  OffHireNoteAttachmentModel,
  OffHireNoteSubProductModel,
  OffHireTripCounterModel,
} = require("../models/OffHireNoteModel");
const ChargeableTypeModel = require("../models/ChargeableTypeModel");
const SwapRequestModel = require("../models/SwapRequestModel");
const SubProductSwapModel = require("../models/SubProductSwapModel");
const SubProductAttachmentAssignmentModel = require("../models/SubProductAttachmentAssignmentModel");
const {
  OperationalShiftAllocationModel,
  OperationalShiftEquipmentModel,
  OperationalShiftManpowerModel,
  OperationalShiftAttachmentModel,
} = require("../models/OperationalHandlingModel");
const PushSubscriptionModel = require("../models/PushSubscriptionModel");
const DeliveryNoteSubSalesOrderModel = require("../models/DeliveryNoteSubSalesOrderModel");
const OffHireNoteSubSalesOrderModel = require("../models/OffHireNoteSubSalesOrderModel");

const seedDatabase = async (syncOption = { alter: true }) => {
  try {
    // Sync database
    await sequelize.sync(syncOption);
    console.log(`Database synced with ${JSON.stringify(syncOption)}`);

    //-----------------------------------------------------Fleet Management Module Seeds------------------------------------------------------------

    // Seed data for 1st employee
    const sampleEmployees = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0001",
          fullNameEnglish: "John Doe",
          fullNameArabic: "جون دو",
          qidNumber: 123456,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "john.doe@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "John Doe",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 23121,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC123456789",
          issuingAuthority: "Qatar Health Ministry",
          expireDate: "2025-12-31",
          knownMedicalConditions: "None",
          allergies: "Peanuts",
          notesOrRemarks: "Requires annual check-up",
          policyNumber: "POL123456",
          coverageDetails: "Comprehensive medical and dental coverage",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Doha Insurance",
          additionalPolicyDetails: "Includes emergency evacuation",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Forklift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-06",
          gatePassNumber: "GP789045",
          gatePassLocation: "Doha",
          gateAccessNo: "1, 12",
          appHashNumber: "App808706",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ799979",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Office",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 6,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees, { ignoreDuplicates: true });
    console.log("Employees 1 successfully seeded!");

    // Seed data for 2nd employee
    const sampleEmployees2 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0002",
          fullNameEnglish: "Alan Taylor",
          fullNameArabic: "جون دو",
          qidNumber: 232532,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "alan.taylor@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "John Doe",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees2, { ignoreDuplicates: true });
    console.log("Employees 2 successfully seeded!");

    // Seed data for 3rd employee
    const sampleEmployees3 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0003",
          fullNameEnglish: "Mathew Jackson",
          fullNameArabic: "جون دو",
          qidNumber: 785432,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "mathew.jackson@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "Mathew Jackson",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees3, { ignoreDuplicates: true });
    console.log("Employees 3 successfully seeded!");

    // Seed data for 4th employee
    const sampleEmployees4 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0004",
          fullNameEnglish: "William Smith",
          fullNameArabic: "جون دو",
          qidNumber: 678686,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "william.smith@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "William Smith",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees4, { ignoreDuplicates: true });
    console.log("Employees 4 successfully seeded!");

    // Seed data for 5th employee
    const sampleEmployees5 = [
      {
        personalDetails: {
          profileImage: "https://example.com/profile1.jpg",
          employeeNo: "AX-0005",
          fullNameEnglish: "Thomas Anderson",
          fullNameArabic: "جون دو",
          qidNumber: 7599457,
          passportNumber: "P1234567",
          qidExpireDate: "2026-12-31",
          passportExpireDate: "2026-12-31",
          recruitementType: "Local",
          visaNumber: "V1234567",
          nationality: "American",
          mobileNumber: "+97467895432",
          email: "thomas.anderson@example.com",
          gender: "Male",
          dateOfBirth: "1990-01-01",
          currentAddress: "123 Main St, City, Country",
          permanentAddress: "456 Permanent Rd, City, Country",
          maritalStatus: "Single",
        },
        drivingLicenseDetails: {
          isAvailableLicense: true,
          drivingLicenseCopy: null,
          licenseNumber: "DL12345",
          firstIssueDate: "2022-01-01",
          licenseExpireDate: "2023-01-01",
          licenseCategory: ["Excavator", "Crane"],
          licenseNotes: ["Glasses", "Automatic"],
        },
        bankDetails: {
          bankName: "ABC Bank",
          accountHolderName: "William Smith",
          accountNumber: 1234567890123456,
          branchName: "Main Branch",
          IBAN: "QA1234567890123456789",
          swiftCode: 1232333,
          shortCode: 12345,
        },
        sponserDetails: {
          sponserName: "Sponsored by Outside",
          employeeContractCopy: null,
          contractExpireDate: "2025-12-31",
          companyCRCopyExpireDate: "2025-12-31",
          computerCardCopy: null,
          computerCardExpireDate: "2025-12-31",
          NOC: null,
          companyCRCopy: null,
        },
        documentDetails: {
          image: null,
          copyOfQID: null,
          copyOfPassport: null,
          resume: null,
          qualificationCertificate: null,
          otherDocuments: null,
        },
        insuranceDetails: {
          healthCardNumber: "HC987654321",
          issuingAuthority: "Hamad Medical Corporation",
          expireDate: "2025-12-31",
          knownMedicalConditions: "Hypertension",
          allergies: "None",
          notesOrRemarks: "Requires monthly monitoring",
          policyNumber: "POL789123",
          coverageDetails: "Basic medical coverage, excludes dental",
          compensationExpireDate: "2026-12-31",
          insuranceProvider: "Al Koot Insurance",
          additionalPolicyDetails: "Excludes pre-existing conditions",
          attachments: null,
        },
        fleetDetails: {
          operatorType: "Manlift Operator",
          equipmentDetails: "LAP-121121221 - Heavy Type",
          month: "2025-07",
          gatePassNumber: "GP123456",
          gatePassLocation: "RL",
          gateAccessNo: "1, 14",
          appHashNumber: "App543555",
          gatePassIssueDate: "2023-01-01",
          gatePassExpireDate: "2025-12-31",
          gatePassAttachment: null,
          gatePassExpireStatus: "Valid",
          fleetStatus: "Active",
        },
        trainingCertificationsDetails: {
          trainingTitle: "Certified Trainer",
          issueDate: "2023-01-01",
          expiryDate: "2023-01-06",
          idIqamaNo: "IQ335655",
          companyName: "Auto-Expert",
          description: "Training Certification",
          certifiedAs: "James Dafoe",
          trainingCertificate: null,
        },
        otherDetails: {
          dateOfJoin: "2023-01-01",
          designation: "Software Engineer",
          employeeType: "Operation",
          status: "Active",
          workPlace: "Qatar",
          departmentName: "IT",
          annualLeaveCount: 10,
          destinationCountry: "Qatar",
        },
        completionStatuses: {
          bank: "Not Available Now",
          other: "Not Available Now",
          career: "Yes",
          family: "Yes",
          license: "No",
          payroll: "No",
          sponsor: "Not Available Now",
          personal: "Yes",
          documents: "No",
          insurance: "Yes",
          fleet: "Yes",
          training: "Yes",
          contract: "Yes",
        },
      },
    ];

    await Employee.bulkCreate(sampleEmployees5, { ignoreDuplicates: true });
    console.log("Employees 5 successfully seeded!");

    // // Seed Employee Contracts
    // const employeeContractsHR = [
    //   {
    //     contractType: "Permanent",
    //     contractNumber: "EA/10/1011",
    //     contractAttachment: null,
    //     contractStartDate: "2025-01-01",
    //     contractEndDate: "2025-12-31",
    //     contractStatus: "Active",
    //     employeeId: 1,
    //   },
    //   {
    //     contractType: "Permanent",
    //     contractNumber: "EA/10/2022",
    //     contractAttachment: null,
    //     contractStartDate: "2025-01-01",
    //     contractEndDate: "2025-12-31",
    //     contractStatus: "Active",
    //     employeeId: 2,
    //   },
    //   {
    //     contractType: "Permanent",
    //     contractNumber: "EA/10/2023",
    //     contractAttachment: null,
    //     contractStartDate: "2025-01-01",
    //     contractEndDate: "2025-12-31",
    //     contractStatus: "Active",
    //     employeeId: 3,
    //   },
    //   {
    //     contractType: "Permanent",
    //     contractNumber: "EA/10/2024",
    //     contractAttachment: null,
    //     contractStartDate: "2025-01-01",
    //     contractEndDate: "2025-12-31",
    //     contractStatus: "Active",
    //     employeeId: 4,
    //   },
    //   {
    //     contractType: "Permanent",
    //     contractNumber: "EA/10/2025",
    //     contractAttachment: null,
    //     contractStartDate: "2025-01-01",
    //     contractEndDate: "2025-12-31",
    //     contractStatus: "Active",
    //     employeeId: 5,
    //   },
    // ];

    // await EmployeeContractModel.bulkCreate(employeeContractsHR, {
    //   ignoreDuplicates: true,
    // });
    // console.log("Employee contracts successfully seeded!");

    // Seed Department Data
    const departments = [
      {
        departmentNo: 101,
        departmentName: "IT Department",
        departmentDescription:
          "Responsible for managing all IT infrastructure and software development",
        departmentHead: "John Doe",
        location: "Headquarters, Colombo",
        createdBy: "admin",
        status: "Active",
        staffName: "Jane Smith",
      },
      {
        departmentNo: 102,
        departmentName: "HR Department",
        departmentDescription:
          "Handles all human resources tasks including recruitment, payroll, and employee relations",
        departmentHead: "Mary Johnson",
        location: "Headquarters, Colombo",
        createdBy: "admin",
        status: "Active",
        staffName: "David Lee",
      },
      {
        departmentNo: 103,
        departmentName: "Sales Department",
        departmentDescription:
          "Handles sales and customer relationship management",
        departmentHead: "Robert Brown",
        location: "Headquarters, Colombo",
        createdBy: "admin",
        status: "Active",
        staffName: "Emily Davis",
      },
    ];

    await Department.bulkCreate(departments, { ignoreDuplicates: true });
    console.log("Departments successfully seeded!");

    // Seed AssetCategoryModel
    const categories = await AssetCategory.bulkCreate(
      [
        {
          category_name: "Heavy Equipment",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Light Vehicle",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_name: "Forklift",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetSubcategoryModel
    const subcategories = await AssetSubCategory.bulkCreate(
      [
        {
          subcategory_name: "Boom Truck",
          category_id: categories[0].category_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          subcategory_name: "Crane",
          category_id: categories[1].category_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          subcategory_name: "Forklift",
          category_id: categories[2].category_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetCapacityModel
    const capacities = await AssetCapacity.bulkCreate(
      [
        {
          capacity_value: "Seven Ton",
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          capacity_value: "Ten Ton",
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetClassificationModel
    const assetsClassifications = await AssetClassification.bulkCreate(
      [
        {
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          default_dep_method: "straight_line",
          default_dep_rate: 60.0,
          default_useful_life: 5,
          gl_account_id: "GL001",
          classification_name: "Heavy Equipment Boom Truck STRAIGHT LINE",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: categories[1].category_id,
          subcategory_id: subcategories[1].subcategory_id,
          capacity_id: capacities[1].capacity_id,
          default_dep_method: "declining_balance",
          default_dep_rate: 60.0,
          default_useful_life: 5,
          gl_account_id: "GL002",
          classification_name: "Light Vehicle Crane DECLINING BALANCE",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetLocationModel
    const locations = await LocationID.bulkCreate(
      [
        {
          location_name: "Qatar",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetSupplierModel
    const suppliers = await SupplierID.bulkCreate(
      [
        {
          supplier_name: "ABC Corp",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetCostCenterModel
    const costCenters = await CostCenterID.bulkCreate(
      [
        {
          cost_center_name: "Qatar",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetCustodianModel
    const custodians = await CustodianID.bulkCreate(
      [
        {
          custodian_name: "ABC Corp",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetManufacturerModel
    const manufacturers = await ManufacturerModel.bulkCreate(
      [
        {
          manufacturer: "Toyota",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer: "Nissan",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer: "Honda",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetModels
    const assetModels = await ModelAssetModel.bulkCreate(
      [
        {
          manufacturer_id: manufacturers[0].id,
          model: "Toyota Corolla",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[0].id,
          model: "Toyota Yaris",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[1].id,
          model: "Nissan Sunny",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[1].id,
          model: "Nissan Tida",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[2].id,
          model: "Honda Civic",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          manufacturer_id: manufacturers[2].id,
          model: "Honda Insight",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed VehicleTypeModel
    const vehicleTypeModels = await VehicleTypeModel.bulkCreate(
      [
        {
          category_id: categories[0].category_id,
          subcategory_id: subcategories[0].subcategory_id,
          capacity_id: capacities[0].capacity_id,
          vehicle_type_name: "Heavy Equipment Boom Truck Seven Ton",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          category_id: categories[1].category_id,
          subcategory_id: subcategories[1].subcategory_id,
          capacity_id: capacities[1].capacity_id,
          vehicle_type_name: "Light Vehicle Crane Ten Ton",
          status: "Active",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AssetModel
    // const createdAssets = await Assets.bulkCreate(
    //   [
    //     {
    //       asset_number: "AX-FA-001",
    //       tag_number: "LAP-121121221",
    //       serial_number: "SN123456789",
    //       engine_number: "N/A",
    //       year_of_manufacture: 2023,
    //       manufacturer_id: manufacturers[0].id,
    //       model_id: assetModels[0].id,
    //       vehicle_type: vehicleTypeModels[0].vehicle_type_name,
    //       VIN: "CAI-0880",
    //       description: "Dell XPS 13 Laptop for office use",
    //       classification_id: assetsClassifications[0].classification_id,
    //       category_id: categories[0].category_id,
    //       subcategory_id: subcategories[0].subcategory_id,
    //       capacity_id: capacities[0].capacity_id,
    //       location_name: locations[0].location_name,
    //       cost_center_name: costCenters[0].cost_center_name,
    //       departmentName: departments[0].departmentName,
    //       custodian_name: custodians[0].custodian_name,
    //       acquisition_date: "2025-06-24",
    //       acquisition_cost: 1299.99,
    //       supplier_name: suppliers[0].supplier_name,
    //       purchase_order_id: "PO-20250624-001",
    //       useful_life: 3,
    //       default_dep_rate: 20,
    //       residual_value: 100.0,
    //       current_value: 1099.99,
    //       accumulated_depreciation: 5000.0,
    //       monthly_depreciation: 150.0,
    //       yearly_depreciation: 3000.0,
    //       is_depreciation_calculated: true,
    //       status: "active",
    //       barcode: "BC-LAP121121221",
    //       rfid_tag: "RFID-LAP121121221",
    //       journal_entry_id: "JE-20250624-001",
    //       photo_attachments: null,
    //       document_attachments: null,
    //       warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
    //       created_at: new Date("2025-06-24T10:00:00Z"),
    //       updated_at: new Date("2025-07-05T13:50:00Z"),
    //     },
    //     {
    //       asset_number: "AX-FA-002",
    //       tag_number: "LAP-5475445",
    //       serial_number: "SN65545451",
    //       engine_number: "N/A",
    //       year_of_manufacture: 2023,
    //       manufacturer_id: manufacturers[0].id,
    //       model_id: assetModels[0].id,
    //       vehicle_type: vehicleTypeModels[0].vehicle_type_name,
    //       VIN: "CAI-0880",
    //       description: "Dell XPS 13 Laptop for office use",
    //       classification_id: assetsClassifications[0].classification_id,
    //       category_id: categories[0].category_id,
    //       subcategory_id: subcategories[0].subcategory_id,
    //       capacity_id: capacities[0].capacity_id,
    //       location_name: locations[0].location_name,
    //       cost_center_name: costCenters[0].cost_center_name,
    //       departmentName: departments[0].departmentName,
    //       custodian_name: custodians[0].custodian_name,
    //       acquisition_date: "2025-06-24",
    //       acquisition_cost: 1299.99,
    //       supplier_name: suppliers[0].supplier_name,
    //       purchase_order_id: "PO-20250624-001",
    //       useful_life: 3,
    //       default_dep_rate: 20,
    //       residual_value: 100.0,
    //       current_value: 1099.99,
    //       accumulated_depreciation: 5000.0,
    //       monthly_depreciation: 150.0,
    //       yearly_depreciation: 3000.0,
    //       is_depreciation_calculated: true,
    //       status: "active",
    //       barcode: "BC-LAP121121221",
    //       rfid_tag: "RFID-LAP121121221",
    //       journal_entry_id: "JE-20250624-001",
    //       photo_attachments: null,
    //       document_attachments: null,
    //       warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
    //       created_at: new Date("2025-06-24T10:00:00Z"),
    //       updated_at: new Date("2025-07-05T13:50:00Z"),
    //     },
    //     {
    //       asset_number: "AX-FA-003",
    //       tag_number: "TAG-121323323",
    //       serial_number: "SN745745545",
    //       engine_number: "N/A",
    //       year_of_manufacture: 2023,
    //       manufacturer_id: manufacturers[0].id,
    //       model_id: assetModels[0].id,
    //       vehicle_type: vehicleTypeModels[0].vehicle_type_name,
    //       VIN: "CAI-0880",
    //       description: "Dell XPS 13 Laptop for office use",
    //       classification_id: assetsClassifications[0].classification_id,
    //       category_id: categories[0].category_id,
    //       subcategory_id: subcategories[0].subcategory_id,
    //       capacity_id: capacities[0].capacity_id,
    //       location_name: locations[0].location_name,
    //       cost_center_name: costCenters[0].cost_center_name,
    //       departmentName: departments[0].departmentName,
    //       custodian_name: custodians[0].custodian_name,
    //       acquisition_date: "2025-06-24",
    //       acquisition_cost: 1299.99,
    //       supplier_name: suppliers[0].supplier_name,
    //       purchase_order_id: "PO-20250624-001",
    //       useful_life: 3,
    //       default_dep_rate: 20,
    //       residual_value: 100.0,
    //       current_value: 1099.99,
    //       accumulated_depreciation: 5000.0,
    //       monthly_depreciation: 150.0,
    //       yearly_depreciation: 3000.0,
    //       is_depreciation_calculated: true,
    //       status: "active",
    //       barcode: "BC-LAP121121221",
    //       rfid_tag: "RFID-LAP121121221",
    //       journal_entry_id: "JE-20250624-001",
    //       photo_attachments: null,
    //       document_attachments: null,
    //       warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
    //       created_at: new Date("2025-06-24T10:00:00Z"),
    //       updated_at: new Date("2025-07-05T13:50:00Z"),
    //     },
    //     {
    //       asset_number: "AX-FA-004",
    //       tag_number: "TAG-907765554",
    //       serial_number: "SN8765765443",
    //       engine_number: "N/A",
    //       year_of_manufacture: 2023,
    //       manufacturer_id: manufacturers[0].id,
    //       model_id: assetModels[0].id,
    //       vehicle_type: vehicleTypeModels[0].vehicle_type_name,
    //       VIN: "CAI-0880",
    //       description: "Dell XPS 13 Laptop for office use",
    //       classification_id: assetsClassifications[0].classification_id,
    //       category_id: categories[0].category_id,
    //       subcategory_id: subcategories[0].subcategory_id,
    //       capacity_id: capacities[0].capacity_id,
    //       location_name: locations[0].location_name,
    //       cost_center_name: costCenters[0].cost_center_name,
    //       departmentName: departments[0].departmentName,
    //       custodian_name: custodians[0].custodian_name,
    //       acquisition_date: "2025-06-24",
    //       acquisition_cost: 1299.99,
    //       supplier_name: suppliers[0].supplier_name,
    //       purchase_order_id: "PO-20250624-001",
    //       useful_life: 3,
    //       default_dep_rate: 20,
    //       residual_value: 100.0,
    //       current_value: 1099.99,
    //       accumulated_depreciation: 5000.0,
    //       monthly_depreciation: 150.0,
    //       yearly_depreciation: 3000.0,
    //       is_depreciation_calculated: true,
    //       status: "active",
    //       barcode: "BC-LAP121121221",
    //       rfid_tag: "RFID-LAP121121221",
    //       journal_entry_id: "JE-20250624-001",
    //       photo_attachments: null,
    //       document_attachments: null,
    //       warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
    //       created_at: new Date("2025-06-24T10:00:00Z"),
    //       updated_at: new Date("2025-07-05T13:50:00Z"),
    //     },
    //     {
    //       asset_number: "AX-FA-005",
    //       tag_number: "TAG-7857343432",
    //       serial_number: "SN65453523222",
    //       engine_number: "N/A",
    //       year_of_manufacture: 2023,
    //       manufacturer_id: manufacturers[0].id,
    //       model_id: assetModels[0].id,
    //       vehicle_type: vehicleTypeModels[0].vehicle_type_name,
    //       VIN: "CAI-0880",
    //       description: "Dell XPS 13 Laptop for office use",
    //       classification_id: assetsClassifications[0].classification_id,
    //       category_id: categories[0].category_id,
    //       subcategory_id: subcategories[0].subcategory_id,
    //       capacity_id: capacities[0].capacity_id,
    //       location_name: locations[0].location_name,
    //       cost_center_name: costCenters[0].cost_center_name,
    //       departmentName: departments[0].departmentName,
    //       custodian_name: custodians[0].custodian_name,
    //       acquisition_date: "2025-06-24",
    //       acquisition_cost: 1299.99,
    //       supplier_name: suppliers[0].supplier_name,
    //       purchase_order_id: "PO-20250624-001",
    //       useful_life: 3,
    //       default_dep_rate: 20,
    //       residual_value: 100.0,
    //       current_value: 1099.99,
    //       accumulated_depreciation: 5000.0,
    //       monthly_depreciation: 150.0,
    //       yearly_depreciation: 3000.0,
    //       is_depreciation_calculated: true,
    //       status: "active",
    //       barcode: "BC-LAP121121221",
    //       rfid_tag: "RFID-LAP121121221",
    //       journal_entry_id: "JE-20250624-001",
    //       photo_attachments: null,
    //       document_attachments: null,
    //       warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
    //       created_at: new Date("2025-06-24T10:00:00Z"),
    //       updated_at: new Date("2025-07-05T13:50:00Z"),
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // Seed EquipmentStageModel
    const equipmentStage = [
      {
        stage_name: "Initial Inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Rectification",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Re-inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Approved date for mobilization by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await EquipmentStageModel.bulkCreate(equipmentStage, {
      ignoreDuplicates: true,
    });
    console.log("Equipment stage successfully seeded!");

    // Seed BackupEquipmentStageModel
    const backupEquipmentStage = [
      {
        stage_name: "Initial Inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Rectification",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Re-inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Approved date for mobilization by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await BackupEquipmentStageModel.bulkCreate(backupEquipmentStage, {
      ignoreDuplicates: true,
    });
    console.log("Backup Equipment stage successfully seeded!");

    // Seed ManpowerStageModel
    const manpowerStage = [
      {
        stage_name: "DVC Submitted to Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Medical Examination Date",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Re-medical Examination Date",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Gate Issued Date",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Induction Day 1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Induction Day 2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Induction Day 3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Project ID Received from Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Camp Allocation confirmed by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Approved date for mobilization by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await ManpowerStageModel.bulkCreate(manpowerStage, {
      ignoreDuplicates: true,
    });
    console.log("Manpower stage successfully seeded!");

    // Seed BackupManpowerStageModel
    const backupManpowerStage = [
      {
        stage_name: "DVC Submitted to Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Medical Examination Date",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Re-medical Examination Date",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Gate Issued Date",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Induction Day 1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Induction Day 2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Induction Day 3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Project ID Received from Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Camp Allocation confirmed by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Approved date for mobilization by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await BackupManpowerStageModel.bulkCreate(backupManpowerStage, {
      ignoreDuplicates: true,
    });
    console.log("Backup Manpower stage successfully seeded!");

    // Seed AttachmentStageModel
    const attachmentStage = [
      {
        stage_name: "Initial Inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Rectification",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Re-inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Approved date for mobilization by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await AttachmentStageModel.bulkCreate(attachmentStage, {
      ignoreDuplicates: true,
    });
    console.log("Attachment stage successfully seeded!");

    // Seed SubProductAttachmentStageModel
    const subProductAttachmentStage = [
      {
        stage_name: "Initial Inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Rectification",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Re-inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Approved date for mobilization by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await SubProductAttachmentStageModel.bulkCreate(subProductAttachmentStage, {
      ignoreDuplicates: true,
    });
    console.log("Sub Product Attachment stage successfully seeded!");

    // Seed RecoveryStageModel
    const recoveryStage = [
      {
        stage_name: "Initial Inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Rectification",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Re-inspection by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        stage_name: "Approved date for mobilization by Client",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await RecoveryStageModel.bulkCreate(recoveryStage, {
      ignoreDuplicates: true,
    });
    console.log("Recovery stage successfully seeded!");

    // Seed VehicleOwnerModel
    // const vehicleOwner = await VehicleOwnerModel.bulkCreate(
    //   [
    //     {
    //       name: "Auto Xpert",
    //       own_vehicle: true,
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       name: "National Crane",
    //       own_vehicle: false,
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       name: "Qfab",
    //       own_vehicle: false,
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       name: "Al Awaida",
    //       own_vehicle: false,
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // Seed OperatorTypeModel
    // const operatorType = await OperatorType.bulkCreate(
    //   [
    //     {
    //       operator_type: "Manlift Operator",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       operator_type: "Forklift Operator",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       operator_type: "Multi Type Operator",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       operator_type: "Common Operator",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // Seed ChargeableTypeModel
    const chargeableType = [
      {
        chargeble_type_name: "Mobilization",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Demobilization",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Active",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Idle Hours",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Public Holiday",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Training",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Under Inspection",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Is Friday Off",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        chargeble_type_name: "Is Public Holiday Off",
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    await ChargeableTypeModel.bulkCreate(chargeableType, {
      ignoreDuplicates: true,
    });
    console.log("Chargeable type successfully seeded!");

    // Seed ServiceEntryTypeModel
    // const serviceEntryType = await ServiceEntryTypeModel.bulkCreate(
    //   [
    //     {
    //       service_entry_type: "Handle Device",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // Seed EquipmentModel
    // const equipment = await Equipment.bulkCreate(
    //   [
    //     {
    //       asset_id: createdAssets[0].asset_id,
    //       owner_id: vehicleOwner[0].vehicle_owner_id,
    //       reg_number: createdAssets[0].tag_number,
    //       serial_numbers: createdAssets[0].serial_number,
    //       engine_number: createdAssets[0].engine_number,
    //       category_id: createdAssets[0].category_id,
    //       subcategory_id: createdAssets[0].subcategory_id,
    //       capacity_id: createdAssets[0].capacity_id,
    //       manufacturer_id: createdAssets[0].manufacturer_id,
    //       model_id: createdAssets[0].model_id,
    //       vehicle_type: createdAssets[0].vehicle_type || "N/A",
    //       VIN: createdAssets[0].VIN || "N/A",
    //       description: createdAssets[0].description || "N/A",
    //       year_of_manufacture:
    //         createdAssets[0].year_of_manufacture || new Date().getFullYear(),
    //       departmentName: departments[0].departmentName,
    //       employeeId: 1,
    //       barcode: createdAssets[0].barcode,
    //       rfid_tag: createdAssets[0].rfid_tag,
    //       photo_attachments: null,
    //       equipment_status: "idle",
    //       status: "Active",
    //       equipment_status_note: null,
    //       document_attachments: null,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       asset_id: createdAssets[1].asset_id,
    //       owner_id: vehicleOwner[0].vehicle_owner_id,
    //       reg_number: createdAssets[1].tag_number,
    //       serial_numbers: createdAssets[1].serial_number,
    //       engine_number: createdAssets[0].engine_number,
    //       category_id: createdAssets[0].category_id,
    //       subcategory_id: createdAssets[0].subcategory_id,
    //       capacity_id: createdAssets[0].capacity_id,
    //       manufacturer_id: createdAssets[0].manufacturer_id,
    //       model_id: createdAssets[0].model_id,
    //       vehicle_type: createdAssets[0].vehicle_type || "N/A",
    //       VIN: createdAssets[0].VIN || "N/A",
    //       description: createdAssets[0].description || "N/A",
    //       year_of_manufacture:
    //         createdAssets[0].year_of_manufacture || new Date().getFullYear(),
    //       departmentName: departments[0].departmentName,
    //       employeeId: 2,
    //       barcode: createdAssets[0].barcode,
    //       rfid_tag: createdAssets[0].rfid_tag,
    //       photo_attachments: null,
    //       equipment_status: "idle",
    //       status: "Active",
    //       equipment_status_note: null,
    //       document_attachments: null,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       asset_id: createdAssets[2].asset_id,
    //       owner_id: vehicleOwner[0].vehicle_owner_id,
    //       reg_number: createdAssets[2].tag_number,
    //       serial_numbers: createdAssets[2].serial_number,
    //       engine_number: createdAssets[0].engine_number,
    //       category_id: createdAssets[0].category_id,
    //       subcategory_id: createdAssets[0].subcategory_id,
    //       capacity_id: createdAssets[0].capacity_id,
    //       manufacturer_id: createdAssets[0].manufacturer_id,
    //       model_id: createdAssets[0].model_id,
    //       vehicle_type: createdAssets[0].vehicle_type || "N/A",
    //       VIN: createdAssets[0].VIN || "N/A",
    //       description: createdAssets[0].description || "N/A",
    //       year_of_manufacture:
    //         createdAssets[0].year_of_manufacture || new Date().getFullYear(),
    //       departmentName: departments[0].departmentName,
    //       employeeId: 3,
    //       barcode: createdAssets[0].barcode,
    //       rfid_tag: createdAssets[0].rfid_tag,
    //       photo_attachments: null,
    //       equipment_status: "idle",
    //       status: "Active",
    //       equipment_status_note: null,
    //       document_attachments: null,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       asset_id: createdAssets[3].asset_id,
    //       owner_id: vehicleOwner[0].vehicle_owner_id,
    //       reg_number: createdAssets[3].tag_number,
    //       serial_numbers: createdAssets[3].serial_number,
    //       engine_number: createdAssets[0].engine_number,
    //       category_id: createdAssets[0].category_id,
    //       subcategory_id: createdAssets[0].subcategory_id,
    //       capacity_id: createdAssets[0].capacity_id,
    //       manufacturer_id: createdAssets[0].manufacturer_id,
    //       model_id: createdAssets[0].model_id,
    //       vehicle_type: createdAssets[0].vehicle_type || "N/A",
    //       VIN: createdAssets[0].VIN || "N/A",
    //       description: createdAssets[0].description || "N/A",
    //       year_of_manufacture:
    //         createdAssets[0].year_of_manufacture || new Date().getFullYear(),
    //       departmentName: departments[0].departmentName,
    //       employeeId: 4,
    //       barcode: createdAssets[0].barcode,
    //       rfid_tag: createdAssets[0].rfid_tag,
    //       photo_attachments: null,
    //       equipment_status: "idle",
    //       status: "Active",
    //       equipment_status_note: null,
    //       document_attachments: null,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       asset_id: createdAssets[4].asset_id,
    //       owner_id: vehicleOwner[0].vehicle_owner_id,
    //       reg_number: createdAssets[4].tag_number,
    //       serial_numbers: createdAssets[4].serial_number,
    //       engine_number: createdAssets[0].engine_number,
    //       category_id: createdAssets[0].category_id,
    //       subcategory_id: createdAssets[0].subcategory_id,
    //       capacity_id: createdAssets[0].capacity_id,
    //       manufacturer_id: createdAssets[0].manufacturer_id,
    //       model_id: createdAssets[0].model_id,
    //       vehicle_type: createdAssets[0].vehicle_type || "N/A",
    //       VIN: createdAssets[0].VIN || "N/A",
    //       description: createdAssets[0].description || "N/A",
    //       year_of_manufacture:
    //         createdAssets[0].year_of_manufacture || new Date().getFullYear(),
    //       departmentName: departments[0].departmentName,
    //       employeeId: 5,
    //       barcode: createdAssets[0].barcode,
    //       rfid_tag: createdAssets[0].rfid_tag,
    //       photo_attachments: null,
    //       equipment_status: "idle",
    //       status: "Active",
    //       equipment_status_note: null,
    //       document_attachments: null,
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // ---- Safe Asset fetch/create ----
    const assetDataList = [
      {
        asset_number: "AX-FA-001",
        tag_number: "LAP-121121221",
        serial_number: "SN123456789",
        engine_number: "N/A",
        year_of_manufacture: 2023,
        manufacturer_id: manufacturers[0].id,
        model_id: assetModels[0].id,
        vehicle_type: vehicleTypeModels[0].vehicle_type_name,
        VIN: "CAI-0880",
        description: "Dell XPS 13 Laptop for office use",
        classification_id: assetsClassifications[0].classification_id,
        category_id: categories[0].category_id,
        subcategory_id: subcategories[0].subcategory_id,
        capacity_id: capacities[0].capacity_id,
        location_name: locations[0].location_name,
        cost_center_name: costCenters[0].cost_center_name,
        departmentName: departments[0].departmentName,
        custodian_name: custodians[0].custodian_name,
        acquisition_date: "2025-06-24",
        acquisition_cost: 1299.99,
        supplier_name: suppliers[0].supplier_name,
        purchase_order_id: "PO-20250624-001",
        useful_life: 3,
        default_dep_rate: 20,
        residual_value: 100.0,
        current_value: 1099.99,
        accumulated_depreciation: 5000.0,
        monthly_depreciation: 150.0,
        yearly_depreciation: 3000.0,
        is_depreciation_calculated: true,
        status: "active",
        barcode: "BC-LAP121121221",
        rfid_tag: "RFID-LAP121121221",
        journal_entry_id: "JE-20250624-001",
        photo_attachments: [],
        document_attachments: [],
        warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
        created_at: new Date("2025-06-24T10:00:00Z"),
        updated_at: new Date("2025-07-05T13:50:00Z"),
      },
      {
        asset_number: "AX-FA-002",
        tag_number: "LAP-5475445",
        serial_number: "SN65545451",
        engine_number: "N/A",
        year_of_manufacture: 2023,
        manufacturer_id: manufacturers[0].id,
        model_id: assetModels[0].id,
        vehicle_type: vehicleTypeModels[0].vehicle_type_name,
        VIN: "CAI-0880",
        description: "Dell XPS 13 Laptop for office use",
        classification_id: assetsClassifications[0].classification_id,
        category_id: categories[0].category_id,
        subcategory_id: subcategories[0].subcategory_id,
        capacity_id: capacities[0].capacity_id,
        location_name: locations[0].location_name,
        cost_center_name: costCenters[0].cost_center_name,
        departmentName: departments[0].departmentName,
        custodian_name: custodians[0].custodian_name,
        acquisition_date: "2025-06-24",
        acquisition_cost: 1299.99,
        supplier_name: suppliers[0].supplier_name,
        purchase_order_id: "PO-20250624-001",
        useful_life: 3,
        default_dep_rate: 20,
        residual_value: 100.0,
        current_value: 1099.99,
        accumulated_depreciation: 5000.0,
        monthly_depreciation: 150.0,
        yearly_depreciation: 3000.0,
        is_depreciation_calculated: true,
        status: "active",
        barcode: "BC-LAP5475445",
        rfid_tag: "RFID-LAP5475445",
        journal_entry_id: "JE-20250624-002",
        photo_attachments: [],
        document_attachments: [],
        warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
        created_at: new Date("2025-06-24T10:00:00Z"),
        updated_at: new Date("2025-07-05T13:50:00Z"),
      },
      {
        asset_number: "AX-FA-003",
        tag_number: "TAG-121323323",
        serial_number: "SN745745545",
        engine_number: "N/A",
        year_of_manufacture: 2023,
        manufacturer_id: manufacturers[0].id,
        model_id: assetModels[0].id,
        vehicle_type: vehicleTypeModels[0].vehicle_type_name,
        VIN: "CAI-0880",
        description: "Dell XPS 13 Laptop for office use",
        classification_id: assetsClassifications[0].classification_id,
        category_id: categories[0].category_id,
        subcategory_id: subcategories[0].subcategory_id,
        capacity_id: capacities[0].capacity_id,
        location_name: locations[0].location_name,
        cost_center_name: costCenters[0].cost_center_name,
        departmentName: departments[0].departmentName,
        custodian_name: custodians[0].custodian_name,
        acquisition_date: "2025-06-24",
        acquisition_cost: 1299.99,
        supplier_name: suppliers[0].supplier_name,
        purchase_order_id: "PO-20250624-001",
        useful_life: 3,
        default_dep_rate: 20,
        residual_value: 100.0,
        current_value: 1099.99,
        accumulated_depreciation: 5000.0,
        monthly_depreciation: 150.0,
        yearly_depreciation: 3000.0,
        is_depreciation_calculated: true,
        status: "active",
        barcode: "BC-TAG121323323",
        rfid_tag: "RFID-TAG121323323",
        journal_entry_id: "JE-20250624-003",
        photo_attachments: [],
        document_attachments: [],
        warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
        created_at: new Date("2025-06-24T10:00:00Z"),
        updated_at: new Date("2025-07-05T13:50:00Z"),
      },
      {
        asset_number: "AX-FA-004",
        tag_number: "TAG-907765554",
        serial_number: "SN8765765443",
        engine_number: "N/A",
        year_of_manufacture: 2023,
        manufacturer_id: manufacturers[0].id,
        model_id: assetModels[0].id,
        vehicle_type: vehicleTypeModels[0].vehicle_type_name,
        VIN: "CAI-0880",
        description: "Dell XPS 13 Laptop for office use",
        classification_id: assetsClassifications[0].classification_id,
        category_id: categories[0].category_id,
        subcategory_id: subcategories[0].subcategory_id,
        capacity_id: capacities[0].capacity_id,
        location_name: locations[0].location_name,
        cost_center_name: costCenters[0].cost_center_name,
        departmentName: departments[0].departmentName,
        custodian_name: custodians[0].custodian_name,
        acquisition_date: "2025-06-24",
        acquisition_cost: 1299.99,
        supplier_name: suppliers[0].supplier_name,
        purchase_order_id: "PO-20250624-001",
        useful_life: 3,
        default_dep_rate: 20,
        residual_value: 100.0,
        current_value: 1099.99,
        accumulated_depreciation: 5000.0,
        monthly_depreciation: 150.0,
        yearly_depreciation: 3000.0,
        is_depreciation_calculated: true,
        status: "active",
        barcode: "BC-TAG907765554",
        rfid_tag: "RFID-TAG907765554",
        journal_entry_id: "JE-20250624-004",
        photo_attachments: [],
        document_attachments: [],
        warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
        created_at: new Date("2025-06-24T10:00:00Z"),
        updated_at: new Date("2025-07-05T13:50:00Z"),
      },
      {
        asset_number: "AX-FA-005",
        tag_number: "TAG-7857343432",
        serial_number: "SN65453523222",
        engine_number: "N/A",
        year_of_manufacture: 2023,
        manufacturer_id: manufacturers[0].id,
        model_id: assetModels[0].id,
        vehicle_type: vehicleTypeModels[0].vehicle_type_name,
        VIN: "CAI-0880",
        description: "Dell XPS 13 Laptop for office use",
        classification_id: assetsClassifications[0].classification_id,
        category_id: categories[0].category_id,
        subcategory_id: subcategories[0].subcategory_id,
        capacity_id: capacities[0].capacity_id,
        location_name: locations[0].location_name,
        cost_center_name: costCenters[0].cost_center_name,
        departmentName: departments[0].departmentName,
        custodian_name: custodians[0].custodian_name,
        acquisition_date: "2025-06-24",
        acquisition_cost: 1299.99,
        supplier_name: suppliers[0].supplier_name,
        purchase_order_id: "PO-20250624-001",
        useful_life: 3,
        default_dep_rate: 20,
        residual_value: 100.0,
        current_value: 1099.99,
        accumulated_depreciation: 5000.0,
        monthly_depreciation: 150.0,
        yearly_depreciation: 3000.0,
        is_depreciation_calculated: true,
        status: "active",
        barcode: "BC-TAG7857343432",
        rfid_tag: "RFID-TAG7857343432",
        journal_entry_id: "JE-20250624-005",
        photo_attachments: [],
        document_attachments: [],
        warranty_details: "2-year manufacturer warranty, expires 2027-06-24",
        created_at: new Date("2025-06-24T10:00:00Z"),
        updated_at: new Date("2025-07-05T13:50:00Z"),
      },
    ];

    const createdAssets = [];
for (const assetData of assetDataList) {
  const [asset, created] = await Assets.findOrCreate({
    where: { asset_number: assetData.asset_number },
    defaults: assetData,
  });
  createdAssets.push(asset);
  console.log(`Asset ${asset.asset_number} -> asset_id: ${asset.asset_id}, created: ${created}`);
}

// Verify assets have valid IDs before seeding equipment
if (createdAssets.some(a => !a.asset_id)) {
  throw new Error("Some assets were not created properly — missing asset_id");
}

    // const createdAssets = [];
    // for (const assetData of assetDataList) {
    //   const [asset] = await Assets.findOrCreate({
    //     where: { asset_number: assetData.asset_number },
    //     defaults: assetData,
    //   });
    //   createdAssets.push(asset);
    // }
    // console.log("Assets successfully seeded!");

    // ---- Also fix VehicleOwner, OperatorType, ServiceEntryType, JobLocation, AttachmentLocation ----
    // Replace bulkCreate+ignoreDuplicates with findOrCreate for each:

    const vehicleOwnerData = [
      { name: "Auto Xpert", own_vehicle: true, status: "Active" },
      { name: "National Crane", own_vehicle: false, status: "Active" },
      { name: "Qfab", own_vehicle: false, status: "Active" },
      { name: "Al Awaida", own_vehicle: false, status: "Active" },
    ];
    const vehicleOwner = [];
    for (const d of vehicleOwnerData) {
      const [rec] = await VehicleOwnerModel.findOrCreate({
        where: { name: d.name },
        defaults: d,
      });
      vehicleOwner.push(rec);
    }

    const operatorTypeData = [
      { operator_type: "Manlift Operator", status: "Active" },
      { operator_type: "Forklift Operator", status: "Active" },
      { operator_type: "Multi Type Operator", status: "Active" },
      { operator_type: "Common Operator", status: "Active" },
    ];
    const operatorType = [];
    for (const d of operatorTypeData) {
      const [rec] = await OperatorType.findOrCreate({
        where: { operator_type: d.operator_type },
        defaults: d,
      });
      operatorType.push(rec);
    }

    const [serviceEntryTypeRec] = await ServiceEntryTypeModel.findOrCreate({
      where: { service_entry_type: "Handle Device" },
      defaults: { service_entry_type: "Handle Device", status: "Active" },
    });
    const serviceEntryType = [serviceEntryTypeRec];

    const jobLocationData = [
      { job_location_name: "Doha", status: "Active" },
      { job_location_name: "Tokyo", status: "Active" },
      { job_location_name: "Newyork", status: "Active" },
    ];
    const jobLocation = [];
    for (const d of jobLocationData) {
      const [rec] = await JobLocation.findOrCreate({
        where: { job_location_name: d.job_location_name },
        defaults: d,
      });
      jobLocation.push(rec);
    }

    const attachmentLocationData = [
      { attachment_location: "Doha", status: "Active" },
      { attachment_location: "Tokyo", status: "Active" },
      { attachment_location: "Newyork", status: "Active" },
    ];
    const attachmentLocation = [];
    for (const d of attachmentLocationData) {
      const [rec] = await AttachmentLocationModel.findOrCreate({
        where: { attachment_location: d.attachment_location },
        defaults: d,
      });
      attachmentLocation.push(rec);
    }

    // ---- Equipment seed (findOrCreate) ----
    const equipmentDataList = [
      { asset_id: createdAssets[0].asset_id, employeeId: 1 },
      { asset_id: createdAssets[1].asset_id, employeeId: 2 },
      { asset_id: createdAssets[2].asset_id, employeeId: 3 },
      { asset_id: createdAssets[3].asset_id, employeeId: 4 },
      { asset_id: createdAssets[4].asset_id, employeeId: 5 },
    ];

    const equipment = [];
    for (const d of equipmentDataList) {
      const assetRef = createdAssets.find((a) => a.asset_id === d.asset_id);
      const [rec] = await Equipment.findOrCreate({
        where: { asset_id: d.asset_id },
        defaults: {
          asset_id: assetRef.asset_id,
          owner_id: vehicleOwner[0].vehicle_owner_id,
          reg_number: assetRef.tag_number,
          serial_numbers: assetRef.serial_number,
          engine_number: assetRef.engine_number,
          category_id: assetRef.category_id,
          subcategory_id: assetRef.subcategory_id,
          capacity_id: assetRef.capacity_id,
          manufacturer_id: assetRef.manufacturer_id,
          model_id: assetRef.model_id,
          vehicle_type: assetRef.vehicle_type || "N/A",
          VIN: assetRef.VIN || "N/A",
          description: assetRef.description || "N/A",
          year_of_manufacture:
            assetRef.year_of_manufacture || new Date().getFullYear(),
          departmentName: departments[0].departmentName,
          employeeId: d.employeeId,
          barcode: assetRef.barcode,
          rfid_tag: assetRef.rfid_tag,
          photo_attachments: null,
          equipment_status: "idle",
          status: "Active",
          equipment_status_note: null,
          document_attachments: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      equipment.push(rec);
    }
    console.log("Equipment successfully seeded!");

    // Seed ManpowerModel
    const manpower = [
      {
        employeeId: 1,
        employeeNo:
          sampleEmployees[0]?.personalDetails?.employeeNo || "AX-0001",
        employeeFullName:
          sampleEmployees[0]?.personalDetails?.fullNameEnglish || "John Doe",
        contractNo: "CON12345",
        operator_type_id: operatorType[0]?.operator_type_id,
        contractType: "Permanent",
        employeeType:
          sampleEmployees[0]?.otherDetails?.employeeType || "Office",
        employeeStatus: sampleEmployees[0]?.otherDetails?.status || "Active",
        serial_number: 1,
        equipmentDetails: `${createdAssets[0]?.tag_number || "REG123"} - ${
          createdAssets[0]?.vehicle_type || "Excavator"
        }`,
        month: 10,
        gatePassNumber: "GP123456",
        gatePassIssueDate: "2025-01-01",
        gatePassExpiryDate: "2026-01-01",
        gatePassAttachment: null,
        gatePassExpiryStatus: "Valid",
        status: "Active",
        manpower_status: "idle",
        manpower_status_note: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employeeId: 2,
        employeeNo:
          sampleEmployees2[0]?.personalDetails?.employeeNo || "AX-0002",
        employeeFullName:
          sampleEmployees2[0]?.personalDetails?.fullNameEnglish ||
          "Alan Taylor",
        contractNo: "CON67890",
        operator_type_id: operatorType[1]?.operator_type_id,
        contractType: "Permanent",
        employeeType:
          sampleEmployees2[0]?.otherDetails?.employeeType || "Operation",
        employeeStatus: sampleEmployees2[0]?.otherDetails?.status || "Active",
        serial_number: 1,
        equipmentDetails: `${createdAssets[1]?.tag_number || "REG123"} - ${
          createdAssets[1]?.vehicle_type || "Excavator"
        }`,
        month: 10,
        gatePassNumber: "GP789012",
        gatePassIssueDate: "2025-01-01",
        gatePassExpiryDate: "2026-01-01",
        gatePassAttachment: null,
        gatePassExpiryStatus: "Valid",
        status: "Active",
        manpower_status: "idle",
        manpower_status_note: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employeeId: 3,
        employeeNo:
          sampleEmployees3[0]?.personalDetails?.employeeNo || "AX-0003",
        employeeFullName:
          sampleEmployees3[0]?.personalDetails?.fullNameEnglish ||
          "Mathew Jackson",
        contractNo: "CON67890",
        operator_type_id: operatorType[1]?.operator_type_id,
        contractType: "Permanent",
        employeeType:
          sampleEmployees3[0]?.otherDetails?.employeeType || "Operation",
        employeeStatus: sampleEmployees3[0]?.otherDetails?.status || "Active",
        serial_number: 1,
        equipmentDetails: `${createdAssets[2]?.tag_number || "REG123"} - ${
          createdAssets[2]?.vehicle_type || "Excavator"
        }`,
        month: 10,
        gatePassNumber: "GP789012",
        gatePassIssueDate: "2025-01-01",
        gatePassExpiryDate: "2026-01-01",
        gatePassAttachment: null,
        gatePassExpiryStatus: "Valid",
        status: "Active",
        manpower_status: "idle",
        manpower_status_note: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employeeId: 4,
        employeeNo:
          sampleEmployees4[0]?.personalDetails?.employeeNo || "AX-0004",
        employeeFullName:
          sampleEmployees4[0]?.personalDetails?.fullNameEnglish ||
          "William Smith",
        contractNo: "CON67890",
        operator_type_id: operatorType[1]?.operator_type_id,
        contractType: "Permanent",
        employeeType:
          sampleEmployees4[0]?.otherDetails?.employeeType || "Operation",
        employeeStatus: sampleEmployees4[0]?.otherDetails?.status || "Active",
        serial_number: 1,
        equipmentDetails: `${createdAssets[3]?.tag_number || "REG123"} - ${
          createdAssets[3]?.vehicle_type || "Excavator"
        }`,
        month: 10,
        gatePassNumber: "GP789012",
        gatePassIssueDate: "2025-01-01",
        gatePassExpiryDate: "2026-01-01",
        gatePassAttachment: null,
        gatePassExpiryStatus: "Valid",
        status: "Active",
        manpower_status: "idle",
        manpower_status_note: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        employeeId: 5,
        employeeNo:
          sampleEmployees5[0]?.personalDetails?.employeeNo || "AX-0005",
        employeeFullName:
          sampleEmployees5[0]?.personalDetails?.fullNameEnglish ||
          "Thomas Anderson",
        contractNo: "CON67890",
        operator_type_id: operatorType[1]?.operator_type_id,
        contractType: "Permanent",
        employeeType:
          sampleEmployees5[0]?.otherDetails?.employeeType || "Operation",
        employeeStatus: sampleEmployees5[0]?.otherDetails?.status || "Active",
        serial_number: 1,
        equipmentDetails: `${createdAssets[4]?.tag_number || "REG123"} - ${
          createdAssets[4]?.vehicle_type || "Excavator"
        }`,
        month: 10,
        gatePassNumber: "GP789012",
        gatePassIssueDate: "2025-01-01",
        gatePassExpiryDate: "2026-01-01",
        gatePassAttachment: null,
        gatePassExpiryStatus: "Valid",
        status: "Active",
        manpower_status: "idle",
        manpower_status_note: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await ManpowerModel.bulkCreate(manpower, { ignoreDuplicates: true });
    console.log("Manpower successfully seeded!");

    // // Seed GatePassLocationModel
    // const gatePass = await GatePassLocationModel.bulkCreate(
    //   [
    //     {
    //       gatePassLocation: "Doha",
    //       status: "Active",
    //     },
    //     {
    //       gatePassLocation: "Raas Laffan",
    //       status: "Active",
    //     },
    //     {
    //       gatePassLocation: "Aljazeera",
    //       status: "Active",
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // // Seed JobLocationModel
    // const jobLocation = await JobLocation.bulkCreate(
    //   [
    //     {
    //       job_location_name: "Doha",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       job_location_name: "Tokyo",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       job_location_name: "Newyork",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // // Seed AttachmentLocationModel
    // const attachmentLocation = await AttachmentLocationModel.bulkCreate(
    //   [
    //     {
    //       attachment_location: "Doha",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       attachment_location: "Tokyo",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //     {
    //       attachment_location: "Newyork",
    //       status: "Active",
    //       created_at: new Date(),
    //       updated_at: new Date(),
    //     },
    //   ],
    //   { ignoreDuplicates: true },
    // );

    // Seed ProductModel
    await ProductModel.bulkCreate(
      [
        {
          product_name: "Excavator",
          description: "Excavator Description",
          unit_price: 1000,
          sell_this: true,
          income_account: "Account 1",
          attachment_number: "AT12333",
          product_photo_attachments: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_name: "Mobile Skid Loader",
          description: "Mobile Skid Loader Description",
          unit_price: 4000,
          sell_this: true,
          income_account: "Account 2",
          attachment_number: "AT15776",
          product_photo_attachments: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed AttachmentModel
    await AttachmentModel.bulkCreate(
      [
        {
          product_id: null,
          attachment_number: "AT143545",
          product_name: "Crane",
          product_details: "Crane Details",
          serial_number: "CRN12345",
          equipment_type_compatibility: "Crane Type 1",
          location: attachmentLocation[0]?.attachment_location,
          plate_number: equipment[0]?.reg_number,
          vehicle_type: equipment[0]?.vehicle_type,
          purchase_date: "2022-01-01",
          status: "Active",
          supportDocument: null,
          photo_attachments: null,
          date: "2022-01-01",
          remarks: "Remarks",
          attachment_status: "idle",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: null,
          attachment_number: "AT577575",
          product_name: "Boom Truck",
          product_details: "Boom Truck Details",
          serial_number: "TRU64367",
          equipment_type_compatibility: "Boom Truck Type 1",
          location: attachmentLocation[1]?.attachment_location,
          plate_number: equipment[1]?.reg_number,
          vehicle_type: equipment[1]?.vehicle_type,
          purchase_date: "2024-01-01",
          status: "Active",
          supportDocument: null,
          photo_attachments: null,
          date: "2024-01-01",
          remarks: "Remarks II",
          attachment_status: "idle",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: null,
          attachment_number: "AT998812",
          product_name: "Forklift",
          product_details: "Forklift Attachment Details",
          serial_number: "FRK88221",
          equipment_type_compatibility: "Forklift Type A",
          location: attachmentLocation[2]?.attachment_location,
          plate_number: equipment[2]?.reg_number,
          vehicle_type: equipment[2]?.vehicle_type,
          purchase_date: "2023-03-15",
          status: "Active",
          supportDocument: null,
          photo_attachments: null,
          date: "2023-03-15",
          remarks: "General forklift attachment",
          attachment_status: "idle",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: null,
          attachment_number: "AT664421",
          product_name: "Excavator Bucket",
          product_details: "Excavator Bucket Details",
          serial_number: "EXB44219",
          equipment_type_compatibility: "Excavator Type B",
          location: attachmentLocation[2]?.attachment_location,
          plate_number: equipment[3]?.reg_number,
          vehicle_type: equipment[3]?.vehicle_type,
          purchase_date: "2021-09-10",
          status: "Active",
          supportDocument: null,
          photo_attachments: null,
          date: "2021-09-10",
          remarks: "Heavy-duty bucket",
          attachment_status: "idle",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          product_id: null,
          attachment_number: "AT553210",
          product_name: "Loader Shovel",
          product_details: "Shovel Attachment Details",
          serial_number: "SHV53109",
          equipment_type_compatibility: "Loader Type C",
          location: attachmentLocation[2]?.attachment_location,
          plate_number: equipment[4]?.reg_number,
          vehicle_type: equipment[4]?.vehicle_type,
          purchase_date: "2020-07-20",
          status: "Active",
          supportDocument: null,
          photo_attachments: null,
          date: "2020-07-20",
          remarks: "Used shovel attachment",
          attachment_status: "idle",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed ServiceOptionsModel
    await ServiceOptionsModel.bulkCreate(
      [
        {
          details: "Equipment Maintenance Service",
          provider: "Company",
          target_cost_amount: "1500.00",
        },
        {
          details: "Operator Training Program",
          provider: "Client",
          target_cost_amount: null,
        },
        {
          details: "Site Safety Supervision",
          provider: "Company",
          target_cost_amount: "2000.00",
        },
        {
          details: "Equipment Transportation",
          provider: "Company",
          target_cost_amount: "1200.00",
        },
        {
          details: "Technical Support Service",
          provider: "Company",
          target_cost_amount: "1800.00",
        },
        {
          details: "Fuel Management",
          provider: "Client",
          target_cost_amount: null,
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed EquipmentRentalServiceModel
    await EquipmentRentalServiceModel.bulkCreate(
      [
        {
          product: "Excavator XT-2000",
          unit_price: 2500.0,
          income_account: "Equipment Rental Income",
        },
        {
          product: "Mobile Crane 50T",
          unit_price: 3500.0,
          income_account: "Crane Rental Income",
        },
        {
          product: "Skid Steer Loader",
          unit_price: 1800.0,
          income_account: "Loader Rental Income",
        },
        {
          product: "Boom Truck 30T",
          unit_price: 2800.0,
          income_account: "Truck Rental Income",
        },
        {
          product: "Backhoe Loader",
          unit_price: 2200.0,
          income_account: "Equipment Rental Income",
        },
        {
          product: "Forklift 5T",
          unit_price: 1500.0,
          income_account: "Forklift Rental Income",
        },
        {
          product: "Generator 100KVA",
          unit_price: 1200.0,
          income_account: "Generator Rental Income",
        },
      ],
      { ignoreDuplicates: true },
    );

    // Seed SalesOrdersModel
    const SO = [
      {
        so_number: "SO-0001",
        ordered_date: new Date(),
        client: "Gulfar",
        location_id: jobLocation[0]?.job_location_id,
        sales_person_id: 1,
        quotation_number: "QT-001",
        project_name: "West Coast Project",
        delivery_address: "Industrial Area, Doha",
        lpo_number: "LPO-2024-001",
        lpo_start_date: "2024-01-01",
        lpo_validity_start_date: "2024-01-02",
        lpo_validity_date: "2024-12-31",
        lpoEndDateSupportAttachment: null,
        product_service_option: "Equipment with Operator",
        product_type_vehicle_type: vehicleTypeModels[0]?.vehicle_type_name,
        billing_type: "daily",
        no_of_equipment: 1,
        operator_type: operatorType[0]?.operator_type,
        no_of_operator: 1,
        mobilization_unit_rate: 500,
        demobilization_unit_rate: 500,
        mobilization_no_of_trips: 1,
        demobilization_no_of_trips: 1,
        other_charges: "During delivery note",
        other_charges_description: "Site transportation charges",
        other_charges_unit_rate: 200,
        engine_hours_limit: "8 hours",
        additional_charges: 1000,
        shift: "Day",
        unit_rate: 1500,
        day_unit_rate: null,
        night_unit_rate: null,
        quantity_trips_or_days: 30,
        is_friday_off: true,
        is_public_holiday_off: true,
        so_status: "Under Approval",
        needs_approval: false,
        expected_mobilization_date: "2025-02-01",
        expected_demobilization_date: "2025-03-01",
        normal_working_hrs_equipment: 8.0,
        normal_working_hrs_manpower: 8.0,
        ot_applicable: true,
        ot_rate_qar: 250.0,
        service_entry_type: serviceEntryType[0]?.service_entry_type,
        recovery_is_required: true,
        recovery_cost: 3500,
        gate_pass_location: "Doha Qatar",
        gate_access_no: "GA-001",
        effective_start_date: null,
        effective_end_date: null,
        description_remarks:
          "Initial equipment rental for construction project",
        completionStatuses: {
          basic: "Yes",
          product: "Yes",
          subProduct: "Yes",
          rental: "Yes",
          workingHours: "Yes",
          service: "Yes",
          additional: "Yes",
          other: "Yes",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        so_number: "SO-0002",
        ordered_date: new Date(),
        client: "Gulf Asia",
        location_id: jobLocation[1]?.job_location_id,
        sales_person_id: 1,
        quotation_number: "QT-002",
        project_name: "East Plant Maintenance",
        delivery_address: "Ras Laffan Industrial City",
        lpo_number: "LPO-2024-002",
        lpo_start_date: "2024-02-01",
        lpo_validity_start_date: "2024-02-02",
        lpo_validity_date: "2024-06-30",
        lpoEndDateSupportAttachment: null,
        product_service_option: "Equipment with Operator",
        product_type_vehicle_type: vehicleTypeModels[0]?.vehicle_type_name,
        billing_type: "monthly",
        no_of_equipment: 1,
        operator_type: operatorType[0]?.operator_type,
        no_of_operator: 1,
        mobilization_unit_rate: 300,
        demobilization_unit_rate: 300,
        mobilization_no_of_trips: 2,
        demobilization_no_of_trips: 2,
        other_charges: "During delivery note",
        other_charges_description: "Worker accommodation",
        other_charges_unit_rate: 500,
        engine_hours_limit: null,
        additional_charges: 2000,
        shift: "Day and Night",
        unit_rate: null,
        day_unit_rate: 1200,
        night_unit_rate: 1800,
        quantity_trips_or_days: 90,
        is_friday_off: false,
        is_public_holiday_off: false,
        so_status: "Under Approval",
        needs_approval: true,
        expected_mobilization_date: "2025-03-01",
        expected_demobilization_date: "2025-05-31",
        normal_working_hrs_equipment: 9.0,
        normal_working_hrs_manpower: 9.0,
        ot_applicable: true,
        ot_rate_qar: 150.0,
        service_entry_type: serviceEntryType[0]?.service_entry_type,
        recovery_is_required: true,
        recovery_cost: 1500,
        gate_pass_location: "Doha Qatar",
        gate_access_no: "GA-002",
        eeffective_start_date: null,
        effective_end_date: null,
        description_remarks: "Skilled manpower for plant maintenance",
        completionStatuses: {
          basic: "Yes",
          product: "Yes",
          subProduct: "Yes",
          rental: "Yes",
          workingHours: "Yes",
          service: "Yes",
          additional: "Yes",
          other: "Yes",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        so_number: "SO-0003",
        ordered_date: new Date(),
        client: "Stream",
        location_id: jobLocation[2]?.job_location_id,
        sales_person_id: 2,
        quotation_number: "QT-003",
        project_name: "City Tower Project",
        delivery_address: "West Bay, Doha",
        lpo_number: "LPO-2024-003",
        lpo_start_date: "2024-03-01",
        lpo_validity_start_date: "2024-03-02",
        lpo_validity_date: "2024-09-30",
        lpoEndDateSupportAttachment: null,
        product_service_option: "Equipment with Operator",
        product_type_vehicle_type: vehicleTypeModels[0]?.vehicle_type_name,
        billing_type: "weekly",
        no_of_equipment: 1,
        operator_type: operatorType[0]?.operator_type,
        no_of_operator: 1,
        mobilization_unit_rate: 800,
        demobilization_unit_rate: 800,
        mobilization_no_of_trips: 1,
        demobilization_no_of_trips: 1,
        other_charges: "During delivery note",
        other_charges_description: "Equipment fuel charges",
        other_charges_unit_rate: 300,
        engine_hours_limit: "10 hours",
        additional_charges: 1500,
        shift: "Full",
        unit_rate: 5000,
        day_unit_rate: null,
        night_unit_rate: null,
        quantity_trips_or_days: 52,
        is_friday_off: true,
        is_public_holiday_off: true,
        so_status: "Under Approval",
        needs_approval: true,
        approval_remark: "Waiting for management approval",
        expected_mobilization_date: "2025-04-01",
        expected_demobilization_date: "2025-10-01",
        normal_working_hrs_equipment: 10.0,
        normal_working_hrs_manpower: 10.0,
        ot_applicable: false,
        service_entry_type: serviceEntryType[0]?.service_entry_type,
        recovery_is_required: true,
        recovery_cost: 6500,
        gate_pass_location: "Doha Qatar",
        gate_access_no: "GA-003",
        effective_start_date: null,
        effective_end_date: null,
        description_remarks: "Crane operations for high-rise construction",
        completionStatuses: {
          basic: "Yes",
          product: "Yes",
          subProduct: "Yes",
          rental: "Yes",
          workingHours: "Yes",
          service: "Yes",
          additional: "Yes",
          other: "Yes",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await SalesOrdersModel.bulkCreate(SO, { ignoreDuplicates: true });
    console.log("Sales Order successfully seeded!");

    console.log(
      "Fleet Management Database seeded successfully with ITEQ Solution data.",
    );
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
};

module.exports = seedDatabase;
