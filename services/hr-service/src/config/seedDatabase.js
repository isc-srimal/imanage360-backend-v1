const bcrypt = require("bcrypt");
const sequelize = require("../config/dbSync");
const Department = require("../models/DepartmentModel");
const Employee = require("../models/employees/EmployeeModel");
const EmployeePayrollDetails = require("../models/employees/EmployeePayrollModel");
const FamilyDetails = require("../models/employees/FamilyDetailsModel");
const WorkExperience = require("../models/employees/WorkExperienceModel");
const Certification = require("../models/employees/CertificationsModel");
const AcademicQualification = require("../models/employees/AcademicQualificationsModel");
const EmployeeContractModel = require("../models/employees/EmployeeContractModel");

const seedDatabase = async (syncOption = { alter: true }) => {
  try {
    // Sync database
    await sequelize.sync(syncOption);
    console.log(`Database synced with ${JSON.stringify(syncOption)}`);

    //-----------------------------------------------------HR Module Seeds------------------------------------------------------------

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

    // Seed data for familyDetails
    const familyDetails = [
      {
        name: "Jane Doe",
        emergencyContactNumber: "+97467895432",
        emergencyName: "Jane Doe",
        emergencyRelationship: "Spouse",
        numberOfFamilyMembers: 3,
        familyInQatar: false,
        relationship: "Wife",
        dob: "1992-05-10",
        qidNo: 789654123,
        qidExpiry: "2026-12-31",
        passportNo: "X9876543",
        passportExpiry: "2027-01-15",
        location: "Qatar",
        airTicket: true,
        insurance: true,
        schoolBenefit: false,
        employeeId: 2,
      },
      {
        name: "Jack Doe",
        emergencyContactNumber: "+97467895432",
        emergencyName: "Jane Doe",
        emergencyRelationship: "Spouse",
        numberOfFamilyMembers: 3,
        familyInQatar: false,
        relationship: "Son",
        dob: "2015-08-22",
        qidNo: 789654124,
        qidExpiry: "2026-12-31",
        passportNo: "X9876544",
        passportExpiry: "2027-03-10",
        location: "Qatar",
        airTicket: true,
        insurance: true,
        schoolBenefit: true,
        employeeId: 2,
      },
      {
        name: "Emma Doe",
        emergencyContactNumber: "+97467895432",
        emergencyName: "Jane Doe",
        emergencyRelationship: "Spouse",
        numberOfFamilyMembers: 3,
        familyInQatar: false,
        relationship: "Daughter",
        dob: "2018-03-15",
        qidNo: 789654125,
        qidExpiry: "2026-12-31",
        passportNo: "X9876545",
        passportExpiry: "2027-04-20",
        location: "Qatar",
        airTicket: true,
        insurance: true,
        schoolBenefit: true,
        employeeId: 2,
      },
    ];

    await FamilyDetails.bulkCreate(familyDetails, { ignoreDuplicates: true });
    console.log("Family Details successfully seeded!");

    // Seed data for Payroll for 1st employee
    const payrollDetails1 = [
      {
        basicSalary: 5200,
        accommodationAllowance: "fullPackageAllowance",
        foodAllowance: "fullPackageFoodAllowance",
        transportationAllowance: "fullPackageTransportationAllowance",
        nationalAccreditationBonus: 250,
        natureOfWorkAllowance: 350,
        socialBonus: 200,
        relocationAllowance: 600,
        otherBonuses: 120,
        overTimeApplicable: false,
        otRate: 0,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        fullPackageAllowance: 2200,
        fullPackageFoodAllowance: 950,
        fullPackageTransportationAllowance: 850,
        totalSalary: 11200,
        status: "Active",
        employeeId: 1,
      },
    ];

    await EmployeePayrollDetails.bulkCreate(payrollDetails1, {
      ignoreDuplicates: true,
    });
    console.log("Payroll Details 1 successfully seeded!");

    // Seed data for Payroll for 2nd employee
    const payrollDetails2 = [
      {
        basicSalary: 5200,
        accommodationAllowance: "fullPackageAllowance",
        foodAllowance: "fullPackageFoodAllowance",
        transportationAllowance: "fullPackageTransportationAllowance",
        nationalAccreditationBonus: 250,
        natureOfWorkAllowance: 350,
        socialBonus: 200,
        relocationAllowance: 600,
        otherBonuses: 120,
        overTimeApplicable: false,
        otRate: 0,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        fullPackageAllowance: 2200,
        fullPackageFoodAllowance: 950,
        fullPackageTransportationAllowance: 850,
        totalSalary: 11200,
        status: "Active",
        employeeId: 2,
      },
    ];

    await EmployeePayrollDetails.bulkCreate(payrollDetails2, {
      ignoreDuplicates: true,
    });
    console.log("Payroll Details 2 successfully seeded!");

    // Seed Academic Qualifications
    const qualify = [
      {
        qualification: "Bachelor of Science",
        qualificationType: "Degree",
        year: "2015",
        location: "Doha, Qatar",
        employeeId: 1,
      },
      {
        qualification: "Master of Business Administration",
        qualificationType: "Postgraduate",
        year: "2018",
        location: "London, UK",
        employeeId: 1,
      },
      {
        qualification: "PhD in Computer Science",
        qualificationType: "Doctorate",
        year: "2022",
        location: "Boston, USA",
        employeeId: 1,
      },
    ];

    await AcademicQualification.bulkCreate(qualify, { ignoreDuplicates: true });
    console.log("Academic Qualification Details successfully seeded!");

    // Seed Certifications
    const certify = [
      {
        certificationType: "Professional",
        certificationName: "Certified ScrumMaster",
        otherYear: "2023",
        otherLocation: "Doha, Qatar",
        certificationExpireDate: "2025-12-31",
        certificationBody: "Scrum Alliance",
        documents: null,
        employeeId: 1,
      },
      {
        certificationType: "Technical",
        certificationName: "AWS Certified Solutions Architect",
        otherYear: "2022",
        otherLocation: "London, UK",
        certificationExpireDate: "2025-06-30",
        certificationBody: "Amazon Web Services",
        documents: null,
        employeeId: 1,
      },
      {
        certificationType: "Management",
        certificationName: "PMP Certification",
        otherYear: "2021",
        otherLocation: "New York, USA",
        certificationExpireDate: "2024-11-30",
        certificationBody: "Project Management Institute",
        documents: null,
        employeeId: 1,
      },
    ];

    await Certification.bulkCreate(certify, { ignoreDuplicates: true });
    console.log("Certification Details successfully seeded!");

    // Seed Work Experience
    const workExperience = [
      {
        companyName: "ABC Corp",
        companyLocation: "Qatar",
        industry: "IT",
        designation: "Software Engineer",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        employeeId: 1,
      },
      {
        companyName: "ABC Corp",
        companyLocation: "Qatar",
        industry: "IT",
        designation: "Software Engineer",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        employeeId: 1,
      },
      {
        companyName: "ABC Corp",
        companyLocation: "Qatar",
        industry: "IT",
        designation: "Software Engineer",
        startDate: "2022-01-01",
        endDate: "2023-01-01",
        employeeId: 1,
      },
    ];

    await WorkExperience.bulkCreate(workExperience, { ignoreDuplicates: true });
    console.log("Work experience successfully seeded!");

    // Seed Employee Contracts
    const employeeContractsHR = [
      {
        contractType: "Permanent",
        contractNumber: "EA/10/1011",
        contractAttachment: null,
        contractStartDate: "2025-01-01",
        contractEndDate: "2025-12-31",
        contractStatus: "Active",
        employeeId: 1,
      },
      {
        contractType: "Permanent",
        contractNumber: "EA/10/2022",
        contractAttachment: null,
        contractStartDate: "2025-01-01",
        contractEndDate: "2025-12-31",
        contractStatus: "Active",
        employeeId: 2,
      },
      {
        contractType: "Permanent",
        contractNumber: "EA/10/2023",
        contractAttachment: null,
        contractStartDate: "2025-01-01",
        contractEndDate: "2025-12-31",
        contractStatus: "Active",
        employeeId: 3,
      },
      {
        contractType: "Permanent",
        contractNumber: "EA/10/2024",
        contractAttachment: null,
        contractStartDate: "2025-01-01",
        contractEndDate: "2025-12-31",
        contractStatus: "Active",
        employeeId: 4,
      },
      {
        contractType: "Permanent",
        contractNumber: "EA/10/2025",
        contractAttachment: null,
        contractStartDate: "2025-01-01",
        contractEndDate: "2025-12-31",
        contractStatus: "Active",
        employeeId: 5,
      },
    ];

    await EmployeeContractModel.bulkCreate(employeeContractsHR, {
      ignoreDuplicates: true,
    });
    console.log("Employee contracts successfully seeded!");

    console.log("Fixed Assets Database seeded successfully with ITEQ Solution data.");
  } catch (error) {
    console.error("Error inserting initial data:", error);
  }
};

module.exports = seedDatabase;
