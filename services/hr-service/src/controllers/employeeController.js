const bcrypt = require("bcryptjs");
const { Parser } = require("json2csv");
const PdfPrinter = require("pdfmake");
const Employee = require("../models/employees/EmployeeModel");
const Payroll = require("../models/PayrollModel");
const Settings = require("../models/SettingsModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const FamilyDetailsModel = require("../models/employees/FamilyDetailsModel");
const WorkExperienceModel = require("../models/employees/WorkExperienceModel");
const PayrollDetailsModel = require("../models/employees/EmployeePayrollModel");
const CertificationsModel = require("../models/employees/CertificationsModel");
const AcademicQualificationsModel = require("../models/employees/AcademicQualificationsModel");
const ManpowerModel = require("../../../fleet-management-service/src/models/ManpowerModel");
const EmployeeContractModel = require("../models/employees/EmployeeContractModel");
const OperatorTypeModel = require("../../../fleet-management-service/src/models/OperatorTypeModel");

const sourceDir = path.join(__dirname, "..", "..", "assets", "fonts");

//---------------------------------File Upload Handling------------------------------------
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const fieldName = file.fieldname;
      let folder = "public/uploads/documents/";
      if (
        [
          "employeeContractCopy",
          "computerCardCopy",
          "NOC",
          "companyCRCopy",
        ].includes(fieldName)
      ) {
        folder = "public/uploads/sponsorDetailsDocuments/";
      } else if (fieldName === "drivingLicenseCopy") {
        folder = "public/uploads/drivingLicenseDocuments/";
      } else if (fieldName === "attachments") {
        folder = "public/uploads/insuranceDocuments/";
      } else if (fieldName === "gatePassAttachment") {
        folder = "public/uploads/employeeGatePasses/";
      } else if (fieldName === "trainingCertificate") {
        folder = "public/uploads/trainingCertifications/";
      } else if (fieldName === "documents") {
        folder = "public/uploads/careerDetailsDocuments/";
      } else if (fieldName === "contractAttachment") {
        folder = "public/uploads/contractAttachmentDocuments/";
      } else if (
        [
          "image",
          "copyOfQID",
          "copyOfPassport",
          "resume",
          "qualificationCertificate",
          "otherDocuments",
        ].includes(fieldName)
      ) {
        folder = "public/uploads/otherDocuments/";
      }
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 20, fieldSize: 1024 * 1024 * 50 },
}).fields([
  { name: "employeeContractCopy", maxCount: 1 },
  { name: "drivingLicenseCopy", maxCount: 1 },
  { name: "computerCardCopy", maxCount: 1 },
  { name: "NOC", maxCount: 1 },
  { name: "companyCRCopy", maxCount: 1 },
  { name: "contractAttachment", maxCount: 10 },
  { name: "documents", maxCount: 10 },
  { name: "image", maxCount: 1 },
  { name: "copyOfQID", maxCount: 1 },
  { name: "copyOfPassport", maxCount: 1 },
  { name: "resume", maxCount: 1 },
  { name: "qualificationCertificate", maxCount: 1 },
  { name: "otherDocuments", maxCount: 1 },
  { name: "attachments", maxCount: 1 },
  { name: "gatePassAttachment", maxCount: 1 },
  { name: "trainingCertificate", maxCount: 1 },
]);

const uploadDrivingLicense = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/drivingLicenseDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 20 },
}).any();

const uploadSponsor = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/sponsorDetailsDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

const uploadCertification = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/careerDetailsDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(
        null,
        `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
      );
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
}).single("documents");

const uploadContract = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/contractAttachmentDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(
        null,
        `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
      );
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  fileFilter: (req, file, cb) => {
    cb(null, true);
  },
}).single("contractAttachment");

const uploadDocument = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/otherDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

const uploadInsurance = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/insuranceDocuments/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

const uploadGatePass = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/employeeGatePasses/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

const uploadTrainingCertificate = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads/trainingCertifications/");
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${file.fieldname}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 50 },
}).any();

const createEmployee = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    let parsedData;

    try {
      if (!req.body.data) {
        return res
          .status(400)
          .json({ message: "Missing employee form data in 'data' field" });
      }

      parsedData =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;
    } catch (err) {
      return res.status(400).json({
        message: "Invalid JSON format in 'data' field",
        error: err.message,
      });
    }

    const {
      personalDetails,
      drivingLicenseDetails,
      bankDetails,
      sponserDetails,
      documentDetails,
      insuranceDetails,
      fleetDetails,
      trainingCertificationsDetails,
      otherDetails,
      employeeContracts,
      workExperience,
      certifications,
      academicQualifications,
      familyDetails,
      payrollDetails,
      completionStatuses,
    } = parsedData;

    // Handle allowance logic
    if (payrollDetails.accommodationAllowance !== "Accommodation by Company") {
      payrollDetails.fullPackageAllowance =
        payrollDetails.fullPackageAllowance || 0;
    } else {
      payrollDetails.fullPackageAllowance = 0;
    }

    if (payrollDetails.foodAllowance !== "Food allowance by Company") {
      payrollDetails.fullPackageFoodAllowance =
        payrollDetails.fullPackageFoodAllowance || 0;
    } else {
      payrollDetails.fullPackageFoodAllowance = 0;
    }

    if (
      payrollDetails.transportationAllowance !==
      "Transportation allowance by Company"
    ) {
      payrollDetails.fullPackageTransportationAllowance =
        payrollDetails.fullPackageTransportationAllowance || 0;
    } else {
      payrollDetails.fullPackageTransportationAllowance = 0;
    }

    const uploadedFiles = req.files || {};

    // Map uploaded files to respective document paths
    const uploadedDocumentDetails = {
      image: uploadedFiles.image?.[0]?.filename
        ? path
          .join("/uploads/otherDocuments", uploadedFiles.image[0].filename)
          .replace(/\\/g, "/")
        : "",
      copyOfQID: uploadedFiles.copyOfQID?.[0]?.filename
        ? path
          .join(
            "/uploads/otherDocuments",
            uploadedFiles.copyOfQID[0].filename
          )
          .replace(/\\/g, "/")
        : "",
      copyOfPassport: uploadedFiles.copyOfPassport?.[0]?.filename
        ? path
          .join(
            "/uploads/otherDocuments",
            uploadedFiles.copyOfPassport[0].filename
          )
          .replace(/\\/g, "/")
        : "",
      resume: uploadedFiles.resume?.[0]?.filename
        ? path
          .join("/uploads/otherDocuments", uploadedFiles.resume[0].filename)
          .replace(/\\/g, "/")
        : "",
      qualificationCertificate: uploadedFiles.qualificationCertificate?.[0]
        ?.filename
        ? path
          .join(
            "/uploads/otherDocuments",
            uploadedFiles.qualificationCertificate[0].filename
          )
          .replace(/\\/g, "/")
        : "",
      otherDocuments: uploadedFiles.otherDocuments?.[0]?.filename
        ? path
          .join(
            "/uploads/otherDocuments",
            uploadedFiles.otherDocuments[0].filename
          )
          .replace(/\\/g, "/")
        : "",
    };

    const uploadedSponserDetails = {
      sponserName: sponserDetails.sponserName || "",
      employeeContractCopy: uploadedFiles.employeeContractCopy?.[0]?.filename
        ? path
          .join(
            "/uploads/sponsorDetailsDocuments",
            uploadedFiles.employeeContractCopy[0].filename
          )
          .replace(/\\/g, "/")
        : "",
      contractExpireDate: sponserDetails.contractExpireDate || "",
      companyCRCopyExpireDate: sponserDetails.companyCRCopyExpireDate || "",
      computerCardCopy: uploadedFiles.computerCardCopy?.[0]?.filename
        ? path
          .join(
            "/uploads/sponsorDetailsDocuments",
            uploadedFiles.computerCardCopy[0].filename
          )
          .replace(/\\/g, "/")
        : "",
      computerCardExpireDate: sponserDetails.computerCardExpireDate || "",
      NOC: uploadedFiles.NOC?.[0]?.filename
        ? path
          .join(
            "/uploads/sponsorDetailsDocuments",
            uploadedFiles.NOC[0].filename
          )
          .replace(/\\/g, "/")
        : "",
      companyCRCopy: uploadedFiles.companyCRCopy?.[0]?.filename
        ? path
          .join(
            "/uploads/sponsorDetailsDocuments",
            uploadedFiles.companyCRCopy[0].filename
          )
          .replace(/\\/g, "/")
        : "",
    };

    // Handle multiple documents for certifications
    const uploadedCareerDetails = {
      documents: uploadedFiles.documents
        ? uploadedFiles.documents.map((file) =>
          path
            .join("/uploads/careerDetailsDocuments", file.filename)
            .replace(/\\/g, "/")
        )
        : [],
    };

    const uploadedContractDetails = {
      contractAttachment: uploadedFiles.contractAttachment?.[0]?.filename
        ? path
          .join(
            "/uploads/contractAttachmentDocuments",
            uploadedFiles.contractAttachment[0].filename
          )
          .replace(/\\/g, "/")
        : "",
    };

    const uploadedDrivingLicenseDetails = {
      drivingLicenseCopy: uploadedFiles.drivingLicenseCopy?.[0]?.filename
        ? path
          .join(
            "/uploads/drivingLicenseDocuments",
            uploadedFiles.drivingLicenseCopy[0].filename
          )
          .replace(/\\/g, "/")
        : "",
    };

    const uploadedInsuranceDetails = {
      attachments: uploadedFiles.attachments?.[0]?.filename
        ? path
          .join(
            "/uploads/insuranceDocuments",
            uploadedFiles.attachments[0].filename
          )
          .replace(/\\/g, "/")
        : "",
    };

    const uploadedGatePassDetails = {
      gatePassAttachment: uploadedFiles.gatePassAttachment?.[0]?.filename
        ? path
          .join(
            "/uploads/employeeGatePasses",
            uploadedFiles.gatePassAttachment[0].filename
          )
          .replace(/\\/g, "/")
        : "",
    };

    const uploadedTrainingCertificationDetails = {
      trainingCertificate: uploadedFiles.trainingCertificate?.[0]?.filename
        ? path
          .join(
            "/uploads/trainingCertifications",
            uploadedFiles.trainingCertificate[0].filename
          )
          .replace(/\\/g, "/")
        : "",
    };

    try {
      const employee = await Employee.create({
        personalDetails: {
          profileImage: personalDetails.profileImage || "",
          employeeNo: personalDetails.employeeNo || "",
          fullNameEnglish: personalDetails.fullNameEnglish || "",
          fullNameArabic: personalDetails.fullNameArabic || "",
          qidNumber: personalDetails.qidNumber || 0,
          passportNumber: personalDetails.passportNumber || "",
          qidExpireDate: personalDetails.qidExpireDate || "",
          passportExpireDate: personalDetails.passportExpireDate || "",
          recruitementType: personalDetails.recruitementType || "",
          visaNumber: personalDetails.visaNumber || "",
          nationality: personalDetails.nationality || "",
          mobileNumber: personalDetails.mobileNumber || 0,
          email: personalDetails.email || "",
          gender: personalDetails.gender || "",
          dateOfBirth: personalDetails.dateOfBirth || "",
          currentAddress: personalDetails.currentAddress || "",
          permanentAddress: personalDetails.permanentAddress || "",
          maritalStatus: personalDetails.maritalStatus || "",
        },
        drivingLicenseDetails: {
          isAvailableLicense:
            drivingLicenseDetails?.isAvailableLicense || false,
          drivingLicenseCopy: uploadedDrivingLicenseDetails.drivingLicenseCopy,
          licenseNumber: drivingLicenseDetails?.licenseNumber || "",
          firstIssueDate: drivingLicenseDetails?.firstIssueDate || "",
          licenseExpireDate: drivingLicenseDetails?.licenseExpireDate || "",
          licenseCategory: Array.isArray(drivingLicenseDetails?.licenseCategory)
            ? drivingLicenseDetails.licenseCategory
            : [],
          licenseNotes: Array.isArray(drivingLicenseDetails?.licenseNotes)
            ? drivingLicenseDetails.licenseNotes
            : [],
        },
        insuranceDetails: {
          healthCardNumber: insuranceDetails?.healthCardNumber || "",
          issuingAuthority: insuranceDetails?.issuingAuthority || "",
          expireDate: insuranceDetails?.expireDate || "",
          knownMedicalConditions:
            insuranceDetails?.knownMedicalConditions || "",
          allergies: insuranceDetails?.allergies || "",
          notesOrRemarks: insuranceDetails?.notesOrRemarks || "",
          policyNumber: insuranceDetails?.policyNumber || "",
          coverageDetails: insuranceDetails?.coverageDetails || "",
          compensationExpireDate:
            insuranceDetails?.compensationExpireDate || "",
          insuranceProvider: insuranceDetails?.insuranceProvider || "",
          additionalPolicyDetails:
            insuranceDetails?.additionalPolicyDetails || "",
          attachments: uploadedInsuranceDetails.attachments,
        },
        bankDetails: {
          bankName: bankDetails.bankName || "",
          accountHolderName: bankDetails.accountHolderName || "",
          accountNumber: bankDetails.accountNumber || 0,
          branchName: bankDetails.branchName || "",
          IBAN: bankDetails.IBAN || "",
          swiftCode: bankDetails.swiftCode || 0,
          shortCode: bankDetails.shortCode || 0,
        },
        sponserDetails: uploadedSponserDetails,
        documentDetails: uploadedDocumentDetails,
        fleetDetails: {
          operatorType: fleetDetails.operatorType || "",
          equipmentDetails: fleetDetails.equipmentDetails || "",
          month: fleetDetails.month || "",
          gatePassNumber: fleetDetails.gatePassNumber || "",
          gatePassLocation: fleetDetails.gatePassLocation || "",
          gateAccessNo: fleetDetails.gateAccessNo || "",
          appHashNumber: fleetDetails.appHashNumber || "",
          gatePassIssueDate: fleetDetails.gatePassIssueDate || "",
          gatePassExpireDate: fleetDetails.gatePassExpireDate || "",
          gatePassAttachment: uploadedGatePassDetails.gatePassAttachment,
          gatePassExpireStatus: fleetDetails.gatePassExpireStatus || "",
          fleetStatus: fleetDetails.fleetStatus || "",
        },
        trainingCertificationsDetails: {
          trainingTitle: trainingCertificationsDetails.trainingTitle || "",
          issueDate: trainingCertificationsDetails.issueDate || "",
          expiryDate: trainingCertificationsDetails.expiryDate || "",
          idIqamaNo: trainingCertificationsDetails.idIqamaNo || "",
          companyName: trainingCertificationsDetails.companyName || "",
          description: trainingCertificationsDetails.description || "",
          certifiedAs: trainingCertificationsDetails.certifiedAs || "",
          trainingCertificate: uploadedTrainingCertificationDetails.trainingCertificate,
        },
        otherDetails: {
          dateOfJoin: otherDetails.dateOfJoin || "",
          designation: otherDetails.designation || "",
          employeeType: otherDetails.employeeType || "",
          status: otherDetails.status,
          workPlace: otherDetails.workPlace || "",
          departmentName: otherDetails.departmentName || "",
          annualLeaveCount: otherDetails.annualLeaveCount || 0,
          destinationCountry: otherDetails.destinationCountry || "",
        },
        completionStatuses,
      });

      // Handle employee contracts
      let createdContracts = [];
      if (Array.isArray(employeeContracts) && employeeContracts.length > 0) {
        const contractPayload = employeeContracts.map((contract) => {
          const attachment = uploadedContractDetails.contractAttachment || "";

          return {
            contractType: contract.contractType || "",
            contractNumber: contract.contractNumber || "",
            contractAttachment: attachment,
            contractStartDate: contract.contractStartDate || "",
            contractEndDate: contract.contractEndDate || "",
            contractStatus: contract.contractStatus || "Active",
            employeeId: employee.id,
          };
        });

        createdContracts = await EmployeeContractModel.bulkCreate(
          contractPayload
        );
      }

      // Create manpower record if employeeType is Office, Operation
      if (["Office", "Operation"].includes(otherDetails.employeeType)) {
        await employee.reload();

        let operatorTypeId = null;
        if (fleetDetails.operatorType) {
          const operatorType = await OperatorTypeModel.findOne({
            where: {
              operator_type: fleetDetails.operatorType,
              status: "Active"
            }
          });
          operatorTypeId = operatorType?.operator_type_id || null;
        }

        await ManpowerModel.create({
          employeeId: employee.id,
          employeeNo: employee.personalDetails.employeeNo || "",
          contractNo: createdContracts[0]?.contractNumber || "",
          employeeFullName: employee.personalDetails.fullNameEnglish || "",
          operator_type_id: operatorTypeId,
          contractType: createdContracts[0]?.contractType || "",
          employeeType: otherDetails.employeeType || "",
          employeeStatus: otherDetails.status || "",
          serial_number: null,
          equipmentDetails: null,
          month: null,
          gatePassNumber: null,
          gatePassIssueDate: null,
          gatePassExpiryDate: null,
          gatePassAttachment: null,
          gatePassExpiryStatus: null,
          status: null,
        });
      }

      // Handle family details
      if (
        Array.isArray(familyDetails?.members) &&
        familyDetails.members.length > 0
      ) {
        const familyPayload = familyDetails.members.map((member) => ({
          emergencyName: familyDetails.members[0].emergencyName || "",
          emergencyRelationship:
            familyDetails.members[0].emergencyRelationship || "",
          numberOfFamilyMembers:
            familyDetails.members[0].numberOfFamilyMembers || 0,
          familyInQatar: !!familyDetails.members[0].familyInQatar,
          emergencyContactNumber:
            familyDetails.members[0].emergencyContactNumber || "",
          name: member.name || "",
          relationship: member.relationship || "",
          dob: member.dob || "",
          passportNo: member.passportNo || "",
          passportExpiry: member.passportExpiry || "",
          qidNo: member.qidNo || 0,
          qidExpiry: member.qidExpiry || "",
          location: member.location || "",
          airTicket: member.airTicket === "Yes",
          insurance: member.insurance === "Yes",
          schoolBenefit: member.schoolBenefit === "Yes",
          employeeId: employee.id,
        }));

        await FamilyDetailsModel.bulkCreate(familyPayload);
      }

      // Handle work experience
      if (Array.isArray(workExperience) && workExperience.length > 0) {
        const workPayload = workExperience.map((work) => {
          const endDate = work.endDate ? new Date(work.endDate) : null;

          if (endDate && isNaN(endDate.getTime())) {
            throw new Error(
              `Invalid endDate for work experience: ${work.companyName}`
            );
          }

          return {
            companyName: work.companyName || "",
            companyLocation: work.companyLocation || "",
            industry: work.industry || "",
            designation: work.designation || "",
            startDate: work.startDate || "",
            endDate: endDate,
            employeeId: employee.id,
          };
        });

        await WorkExperienceModel.bulkCreate(workPayload);
      }

      // Handle certifications
      if (Array.isArray(certifications) && certifications.length > 0) {
        const certificationsPayload = certifications.map((certifies, index) => {
          // Assign the corresponding document from uploadedCareerDetails.documents
          const document = uploadedCareerDetails.documents[index] || "";

          return {
            certificationType: certifies.certificationType || "",
            certificationName: certifies.certificationName || "",
            otherYear: certifies.otherYear || "",
            otherLocation: certifies.otherLocation || "",
            certificationExpireDate: certifies.certificationExpireDate || "",
            certificationBody: certifies.certificationBody || "",
            documents: document,
            employeeId: employee.id,
          };
        });

        await CertificationsModel.bulkCreate(certificationsPayload);
      }

      // Handle academic qualifications
      if (
        Array.isArray(academicQualifications) &&
        academicQualifications.length > 0
      ) {
        const academicQualificationsPayload = academicQualifications.map(
          (qualifies) => ({
            qualification: qualifies.qualification || "",
            qualificationType: qualifies.qualificationType || "",
            year: qualifies.year || "",
            location: qualifies.location || "",
            employeeId: employee.id,
          })
        );

        await AcademicQualificationsModel.bulkCreate(
          academicQualificationsPayload
        );
      }

      // Handle payroll details
      if (
        Array.isArray(payrollDetails?.payrolls) &&
        payrollDetails.payrolls.length > 0
      ) {
        const payrollPayload = payrollDetails.payrolls.map((payroll) => ({
          basicSalary: payroll.basicSalary || 0,
          accommodationAllowance: payroll.accommodationAllowance || 0,
          foodAllowance: payroll.foodAllowance || 0,
          transportationAllowance: payroll.transportationAllowance || 0,
          nationalAccreditationBonus: payroll.nationalAccreditationBonus || 0,
          natureOfWorkAllowance: payroll.natureOfWorkAllowance || 0,
          socialBonus: payroll.socialBonus || 0,
          relocationAllowance: payroll.relocationAllowance || 0,
          otherBonuses: payroll.otherBonuses || 0,
          overTimeApplicable: !!payrollDetails.payrolls[0].overTimeApplicable,
          otRate: payrollDetails.payrolls[0].otRate || 0,
          startDate: payroll.startDate || "",
          endDate: payroll.endDate || "",
          fullPackageAllowance: payroll.fullPackageAllowance || 0,
          fullPackageFoodAllowance: payroll.fullPackageFoodAllowance || 0,
          fullPackageTransportationAllowance:
            payroll.fullPackageTransportationAllowance || 0,
          totalSalary: payroll.totalSalary || 0,
          employeeId: employee.id,
        }));

        await PayrollDetailsModel.bulkCreate(payrollPayload);
      }

      // Handle employee contracts
      // if (Array.isArray(employeeContracts) && employeeContracts.length > 0) {
      //   const contractPayload = employeeContracts.map((contract, index) => {
      //     // Assign the corresponding document from uploadedContractDetails
      //     const attachment = uploadedContractDetails.contractAttachment || "";

      //     return {
      //       contractType: contract.contractType || "",
      //       contractNumber: contract.contractNumber || "",
      //       contractAttachment: attachment,
      //       contractStartDate: contract.contractStartDate || "",
      //       contractEndDate: contract.contractEndDate || "",
      //       contractStatus: contract.contractStatus || "Active",
      //       employeeId: employee.id,
      //     };
      //   });

      //   await EmployeeContractModel.bulkCreate(contractPayload);
      // }

      res.status(201).json({
        message: "Employee created successfully",
        employee: {
          ...parsedData,
          familyDetails: familyDetails?.members || [],
          certifications: certifications || [],
          academicQualifications: academicQualifications || [],
          workExperience: workExperience || [],
          payrollDetails: payrollDetails?.payrolls || [],
          employeeContracts: employeeContracts || [],
        },
        employeeId: employee.id,
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: error.message });
    }
  });
};

const deleteOldFile = (filePath) => {
  if (!filePath) return;

  try {
    const actualPath = filePath.replace(/^\/public\//, "public/");
    const fullPath = path.join(__dirname, "..", "..", actualPath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Deleted old file: ${fullPath}`);
    }
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

const updatePersonelDetails = async (req, res) => {
  const { id } = req.params;
  let parsedPersonelData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing employee form data in 'data' field" });
    }

    parsedPersonelData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { personalDetails, completionStatus } = parsedPersonelData;

  try {
    const employeePersonelToUpdate = await Employee.findByPk(id);

    if (!employeePersonelToUpdate) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employeePersonelToUpdate.personalDetails = {
      profileImage:
        personalDetails?.profileImage ||
        employeePersonelToUpdate.personalDetails.profileImage,
      employeeNo:
        personalDetails?.employeeNo ||
        employeePersonelToUpdate.personalDetails.employeeNo,
      fullNameEnglish:
        personalDetails?.fullNameEnglish ||
        employeePersonelToUpdate.personalDetails.fullNameEnglish,
      fullNameArabic:
        personalDetails?.fullNameArabic ||
        employeePersonelToUpdate.personalDetails.fullNameArabic,
      qidNumber:
        personalDetails?.qidNumber ||
        employeePersonelToUpdate.personalDetails.qidNumber,
      passportNumber:
        personalDetails?.passportNumber ||
        employeePersonelToUpdate.personalDetails.passportNumber,
      qidExpireDate:
        personalDetails?.qidExpireDate ||
        employeePersonelToUpdate.personalDetails.qidExpireDate,
      passportExpireDate:
        personalDetails?.passportExpireDate ||
        employeePersonelToUpdate.personalDetails.passportExpireDate,
      recruitementType:
        personalDetails?.recruitementType ||
        employeePersonelToUpdate.personalDetails.recruitementType,
      visaNumber:
        personalDetails?.visaNumber ||
        employeePersonelToUpdate.personalDetails.visaNumber,
      nationality:
        personalDetails?.nationality ||
        employeePersonelToUpdate.personalDetails.nationality,
      mobileNumber:
        personalDetails?.mobileNumber ||
        employeePersonelToUpdate.personalDetails.mobileNumber,
      email:
        personalDetails?.email ||
        employeePersonelToUpdate.personalDetails.email,
      gender:
        personalDetails?.gender ||
        employeePersonelToUpdate.personalDetails.gender,
      dateOfBirth:
        personalDetails?.dateOfBirth ||
        employeePersonelToUpdate.personalDetails.dateOfBirth,
      currentAddress:
        personalDetails?.currentAddress ||
        employeePersonelToUpdate.personalDetails.currentAddress,
      permanentAddress:
        personalDetails?.permanentAddress ||
        employeePersonelToUpdate.personalDetails.permanentAddress,
      maritalStatus:
        personalDetails?.maritalStatus ||
        employeePersonelToUpdate.personalDetails.maritalStatus,
    };

    // Update completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employeePersonelToUpdate.completionStatuses || {};
      employeePersonelToUpdate.completionStatuses = {
        ...currentStatuses,
        personal: completionStatus,
      };
    }

    await employeePersonelToUpdate.save();
    res.status(200).json({
      message: "Employee personel details updated successfully",
      employee: {
        ...parsedPersonelData,
      },
    });
  } catch (error) {
    console.error("Error updating personel details of employee:", error);
    res.status(500).json({
      message: "Error updating personel details of employee",
      error: error.message,
    });
  }
};

const updateFamilyDetails = async (req, res) => {
  const { id } = req.params; // This is the family details record ID
  let parsedFamilyData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing family details data in 'data' field" });
    }

    parsedFamilyData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { familyDetails, completionStatus } = parsedFamilyData;

  try {
    // Find the family details record by ID
    const familyRecord = await FamilyDetailsModel.findByPk(id);

    if (!familyRecord) {
      return res
        .status(404)
        .json({ message: "Family details record not found" });
    }

    // Verify that the employee exists
    const employee = await Employee.findByPk(familyRecord.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Associated employee not found" });
    }

    // Update the family details record
    await familyRecord.update({
      name: familyDetails.name || familyRecord.name,
      emergencyContactNumber:
        familyDetails.emergencyContactNumber ||
        familyRecord.emergencyContactNumber,
      emergencyName: familyDetails.emergencyName || familyRecord.emergencyName,
      emergencyRelationship:
        familyDetails.emergencyRelationship ||
        familyRecord.emergencyRelationship,
      numberOfFamilyMembers:
        familyDetails.numberOfFamilyMembers ||
        familyRecord.numberOfFamilyMembers,
      familyInQatar:
        familyDetails.familyInQatar !== undefined
          ? !!familyDetails.familyInQatar
          : familyRecord.familyInQatar,
      relationship: familyDetails.relationship || familyRecord.relationship,
      dob: familyDetails.dob || familyRecord.dob,
      passportNo: familyDetails.passportNo || familyRecord.passportNo,
      passportExpiry:
        familyDetails.passportExpiry || familyRecord.passportExpiry,
      qidNo: familyDetails.qidNo || familyRecord.qidNo,
      qidExpiry: familyDetails.qidExpiry || familyRecord.qidExpiry,
      location: familyDetails.location || familyRecord.location,
      airTicket:
        familyDetails.airTicket !== undefined
          ? familyDetails.airTicket === "Yes" ||
          familyDetails.airTicket === true
          : familyRecord.airTicket,
      insurance:
        familyDetails.insurance !== undefined
          ? familyDetails.insurance === "Yes" ||
          familyDetails.insurance === true
          : familyRecord.insurance,
      schoolBenefit:
        familyDetails.schoolBenefit !== undefined
          ? familyDetails.schoolBenefit === "Yes" ||
          familyDetails.schoolBenefit === true
          : familyRecord.schoolBenefit,
    });

    // Update employee's completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          family: completionStatus,
        },
      });
    }

    res.status(200).json({
      message: "Family details updated successfully",
      familyDetails: familyRecord,
    });
  } catch (error) {
    console.error("Error updating family details:", error);
    res.status(500).json({
      message: "Error updating family details",
      error: error.message,
    });
  }
};


// Add this controller function in your employee controller
const updateFamilyCompletionStatus = async (req, res) => {
  const { employeeId } = req.params;
  let parsedData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing data in 'data' field" });
    }

    parsedData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { completionStatus } = parsedData;

  try {
    // Find the employee
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the completion status
    const currentStatuses = employee.completionStatuses || {};
    employee.completionStatuses = {
      ...currentStatuses,
      family: completionStatus,
    };

    await employee.save();

    res.status(200).json({
      message: "Family completion status updated successfully",
      completionStatus: employee.completionStatuses.family,
    });
  } catch (error) {
    console.error("Error updating family completion status:", error);
    res.status(500).json({
      message: "Error updating family completion status",
      error: error.message,
    });
  }
};



const createFamilyDetails = async (req, res) => {
  let parsedFamilyData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing family details data in 'data' field" });
    }

    parsedFamilyData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { familyDetails, employeeId, completionStatus } = parsedFamilyData;

  try {
    // Verify that the employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Create new family member record
    const newFamilyMember = await FamilyDetailsModel.create({
      name: familyDetails.name,
      emergencyContactNumber: familyDetails.emergencyContactNumber,
      emergencyName: familyDetails.emergencyName,
      emergencyRelationship: familyDetails.emergencyRelationship,
      numberOfFamilyMembers: familyDetails.numberOfFamilyMembers,
      familyInQatar:
        familyDetails.familyInQatar === "Yes" ||
        familyDetails.familyInQatar === true,
      relationship: familyDetails.relationship,
      dob: familyDetails.dob,
      passportNo: familyDetails.passportNo,
      passportExpiry: familyDetails.passportExpiry,
      qidNo: familyDetails.qidNo || null,
      qidExpiry: familyDetails.qidExpiry || null,
      location: familyDetails.location,
      airTicket:
        familyDetails.airTicket === "Yes" || familyDetails.airTicket === true,
      insurance:
        familyDetails.insurance === "Yes" || familyDetails.insurance === true,
      schoolBenefit:
        familyDetails.schoolBenefit === "Yes" ||
        familyDetails.schoolBenefit === true,
      employeeId: employeeId,
    });

    // Update employee's completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          family: completionStatus,
        },
      });
    }

    res.status(201).json({
      message: "Family member created successfully",
      familyDetails: newFamilyMember,
    });
  } catch (error) {
    console.error("Error creating family member:", error);
    res.status(500).json({
      message: "Error creating family member",
      error: error.message,
    });
  }
};

const updateEmergencyContactInfo = async (req, res) => {
  const { employeeId } = req.params;
  let parsedData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing emergency contact data in 'data' field" });
    }

    parsedData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { emergencyContactInfo } = parsedData;

  try {
    // Verify that the employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update all family members for this employee with the emergency contact info
    const familyMembers = await FamilyDetailsModel.findAll({
      where: { employeeId: employeeId },
    });

    if (!familyMembers || familyMembers.length === 0) {
      return res.status(404).json({
        message: "No family members found for this employee",
      });
    }

    // Update all family members with the new emergency contact information
    await FamilyDetailsModel.update(
      {
        emergencyContactNumber: emergencyContactInfo.emergencyContactNumber,
        emergencyName: emergencyContactInfo.emergencyName,
        emergencyRelationship: emergencyContactInfo.emergencyRelationship,
        numberOfFamilyMembers: emergencyContactInfo.numberOfFamilyMembers,
        familyInQatar:
          emergencyContactInfo.familyInQatar === "Yes" ||
          emergencyContactInfo.familyInQatar === true,
      },
      {
        where: { employeeId: employeeId },
      }
    );

    // Fetch updated records
    const updatedFamilyMembers = await FamilyDetailsModel.findAll({
      where: { employeeId: employeeId },
    });

    res.status(200).json({
      message: "Emergency contact information updated successfully",
      familyMembers: updatedFamilyMembers,
    });
  } catch (error) {
    console.error("Error updating emergency contact information:", error);
    res.status(500).json({
      message: "Error updating emergency contact information",
      error: error.message,
    });
  }
};

const updateDrivingLicenseDetails = async (req, res) => {
  uploadDrivingLicense(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    const { id } = req.params;
    let parsedDrivingLicenseData;

    try {
      // Check if 'data' came as a file instead of form field
      const dataFile = req.files?.find((f) => f.fieldname === "data");

      if (dataFile) {
        // Read the JSON from the uploaded file
        const fileContent = await fs.readFile(dataFile.path, "utf8");
        parsedDrivingLicenseData = JSON.parse(fileContent);

        // Delete the temporary data file
        await fs.unlink(dataFile.path);
      } else if (req.body.data) {
        // Normal case - data as string in body
        parsedDrivingLicenseData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({
          message: "Missing employee form data in 'data' field",
        });
      }

      const { drivingLicenseDetails, completionStatus } = parsedDrivingLicenseData;

      const employeeDrivingLicenseToUpdate = await Employee.findByPk(id);

      if (!employeeDrivingLicenseToUpdate) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Get only the actual file uploads (exclude the 'data' file)
      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            if (!acc[file.fieldname]) {
              acc[file.fieldname] = [];
            }
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      let uploadedDrivingLicenseDetails = {
        isAvailableLicense:
          drivingLicenseDetails?.isAvailableLicense ??
          employeeDrivingLicenseToUpdate.drivingLicenseDetails
            .isAvailableLicense,
        licenseNumber:
          drivingLicenseDetails?.licenseNumber ||
          employeeDrivingLicenseToUpdate.drivingLicenseDetails.licenseNumber,
        firstIssueDate:
          drivingLicenseDetails?.firstIssueDate ||
          employeeDrivingLicenseToUpdate.drivingLicenseDetails.firstIssueDate,
        licenseExpireDate:
          drivingLicenseDetails?.licenseExpireDate ||
          employeeDrivingLicenseToUpdate.drivingLicenseDetails
            .licenseExpireDate,
        licenseCategory: Array.isArray(drivingLicenseDetails?.licenseCategory)
          ? drivingLicenseDetails.licenseCategory
          : employeeDrivingLicenseToUpdate.drivingLicenseDetails
            .licenseCategory,
        licenseNotes: Array.isArray(drivingLicenseDetails?.licenseNotes)
          ? drivingLicenseDetails.licenseNotes
          : employeeDrivingLicenseToUpdate.drivingLicenseDetails.licenseNotes,
        drivingLicenseCopy:
          employeeDrivingLicenseToUpdate.drivingLicenseDetails
            .drivingLicenseCopy || "",
      };

      // Handle driving license copy file upload
      if (uploadedFiles.drivingLicenseCopy?.[0]?.filename) {
        if (
          employeeDrivingLicenseToUpdate.drivingLicenseDetails
            .drivingLicenseCopy
        ) {
          deleteOldFile(
            employeeDrivingLicenseToUpdate.drivingLicenseDetails
              .drivingLicenseCopy
          );
        }
        uploadedDrivingLicenseDetails.drivingLicenseCopy =
          uploadedFiles.drivingLicenseCopy[0].filename;
      }

      // Update completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employeeDrivingLicenseToUpdate.completionStatuses || {};
        employeeDrivingLicenseToUpdate.completionStatuses = {
          ...currentStatuses,
          license: completionStatus,
        };
      }

      employeeDrivingLicenseToUpdate.drivingLicenseDetails =
        uploadedDrivingLicenseDetails;

      await employeeDrivingLicenseToUpdate.save();

      res.status(200).json({
        message: "Employee driving license details updated successfully",
        employee: {
          ...parsedDrivingLicenseData,
        },
      });
    } catch (error) {
      console.error(
        "Error updating driving license details of employee:",
        error
      );
      res.status(500).json({
        message: "Error updating driving license details of employee",
        error: error.message,
      });
    }
  });
};

const updatePayrollDetails = async (req, res) => {
  const { id } = req.params; // This is the payroll details record ID
  let parsedPayrollData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing payroll details data in 'data' field" });
    }

    parsedPayrollData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { payrollDetails, completionStatus } = parsedPayrollData;

  try {
    // Find the payroll details record by ID
    const payrollRecord = await PayrollDetailsModel.findByPk(id);

    if (!payrollRecord) {
      return res
        .status(404)
        .json({ message: "Payroll details record not found" });
    }

    // Verify that the employee exists
    const employee = await Employee.findByPk(payrollRecord.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Associated employee not found" });
    }

    // Validate dates if provided
    if (payrollDetails.startDate) {
      const startDate = new Date(payrollDetails.startDate);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
    }

    if (payrollDetails.endDate) {
      const endDate = new Date(payrollDetails.endDate);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
    }

    // Update the payroll details record
    await payrollRecord.update({
      basicSalary:
        payrollDetails.basicSalary !== undefined
          ? parseFloat(payrollDetails.basicSalary)
          : payrollRecord.basicSalary,
      accommodationAllowance:
        payrollDetails.accommodationAllowance ||
        payrollRecord.accommodationAllowance,
      foodAllowance:
        payrollDetails.foodAllowance || payrollRecord.foodAllowance,
      transportationAllowance:
        payrollDetails.transportationAllowance ||
        payrollRecord.transportationAllowance,
      nationalAccreditationBonus:
        payrollDetails.nationalAccreditationBonus !== undefined
          ? parseFloat(payrollDetails.nationalAccreditationBonus)
          : payrollRecord.nationalAccreditationBonus,
      natureOfWorkAllowance:
        payrollDetails.natureOfWorkAllowance !== undefined
          ? parseFloat(payrollDetails.natureOfWorkAllowance)
          : payrollRecord.natureOfWorkAllowance,
      socialBonus:
        payrollDetails.socialBonus !== undefined
          ? parseFloat(payrollDetails.socialBonus)
          : payrollRecord.socialBonus,
      relocationAllowance:
        payrollDetails.relocationAllowance !== undefined
          ? parseFloat(payrollDetails.relocationAllowance)
          : payrollRecord.relocationAllowance,
      otherBonuses:
        payrollDetails.otherBonuses !== undefined
          ? parseFloat(payrollDetails.otherBonuses)
          : payrollRecord.otherBonuses,
      overTimeApplicable:
        payrollDetails.overTimeApplicable !== undefined
          ? payrollDetails.overTimeApplicable === "Yes" ||
          payrollDetails.overTimeApplicable === true
          : payrollRecord.overTimeApplicable,
      otRate:
        payrollDetails.otRate !== undefined
          ? parseFloat(payrollDetails.otRate)
          : payrollRecord.otRate,
      startDate: payrollDetails.startDate || payrollRecord.startDate,
      endDate:
        payrollDetails.endDate !== undefined
          ? payrollDetails.endDate || null
          : payrollRecord.endDate,
      fullPackageAllowance:
        payrollDetails.fullPackageAllowance !== undefined
          ? parseFloat(payrollDetails.fullPackageAllowance)
          : payrollRecord.fullPackageAllowance,
      fullPackageFoodAllowance:
        payrollDetails.fullPackageFoodAllowance !== undefined
          ? parseFloat(payrollDetails.fullPackageFoodAllowance)
          : payrollRecord.fullPackageFoodAllowance,
      fullPackageTransportationAllowance:
        payrollDetails.fullPackageTransportationAllowance !== undefined
          ? parseFloat(payrollDetails.fullPackageTransportationAllowance)
          : payrollRecord.fullPackageTransportationAllowance,
      totalSalary:
        payrollDetails.totalSalary !== undefined
          ? parseFloat(payrollDetails.totalSalary)
          : payrollRecord.totalSalary,
      status: payrollDetails.status || payrollRecord.status,
    });

    // Update completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          payroll: completionStatus,
        },
      });
    }

    res.status(200).json({
      message: "Payroll details updated successfully",
      payrollDetails: payrollRecord,
    });
  } catch (error) {
    console.error("Error updating payroll details:", error);
    res.status(500).json({
      message: "Error updating payroll details",
      error: error.message,
    });
  }
};




// Add this controller function in your employee controller
const updatePayrollCompletionStatus = async (req, res) => {
  const { employeeId } = req.params;
  let parsedData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing data in 'data' field" });
    }

    parsedData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { completionStatus } = parsedData;

  try {
    // Find the employee
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the completion status
    const currentStatuses = employee.completionStatuses || {};
    employee.completionStatuses = {
      ...currentStatuses,
      payroll: completionStatus,
    };

    await employee.save();

    res.status(200).json({
      message: "Payroll completion status updated successfully",
      completionStatus: employee.completionStatuses.payroll,
    });
  } catch (error) {
    console.error("Error updating payroll completion status:", error);
    res.status(500).json({
      message: "Error updating payroll completion status",
      error: error.message,
    });
  }
};




const addPayroll = async (req, res) => {
  try {
    const { employeeId, payrollDetails, completionStatus } = req.body;

    // Validate request body
    if (!employeeId || !payrollDetails) {
      return res.status(400).json({
        message: "Missing employeeId or payrollDetails in request body",
      });
    }

    // Verify that the employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Validate numeric fields
    const numericFields = [
      "basicSalary",
      "fullPackageAllowance",
      "fullPackageFoodAllowance",
      "fullPackageTransportationAllowance",
      "nationalAccreditationBonus",
      "natureOfWorkAllowance",
      "socialBonus",
      "relocationAllowance",
      "otherBonuses",
      "otRate",
      "totalSalary",
    ];

    for (const field of numericFields) {
      if (
        payrollDetails[field] !== undefined &&
        isNaN(parseFloat(payrollDetails[field]))
      ) {
        return res
          .status(400)
          .json({ message: `Invalid value for ${field}. Must be a number.` });
      }
    }

    // Validate date fields
    if (!payrollDetails.startDate) {
      return res.status(400).json({ message: "Start date is required" });
    }

    const startDate = new Date(payrollDetails.startDate);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ message: "Invalid start date format" });
    }

    if (payrollDetails.endDate) {
      const endDate = new Date(payrollDetails.endDate);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
      if (endDate <= startDate) {
        return res
          .status(400)
          .json({ message: "End date must be after start date" });
      }
    }

    // Validate date ranges against existing payroll records
    const existingPayrolls = await PayrollDetailsModel.findAll({
      where: { employeeId },
    });
    const newStartDate = startDate;
    const newEndDate = payrollDetails.endDate
      ? new Date(payrollDetails.endDate)
      : null;

    for (const payroll of existingPayrolls) {
      const existingStart = new Date(payroll.startDate);
      const existingEnd = payroll.endDate ? new Date(payroll.endDate) : null;

      if (
        (newStartDate >= existingStart &&
          (!existingEnd || newStartDate <= existingEnd)) ||
        (newEndDate &&
          existingStart >= newStartDate &&
          (!existingEnd || existingStart <= newEndDate))
      ) {
        return res.status(400).json({
          message: "Date ranges cannot overlap with existing payroll records",
        });
      }
    }

    // Validate overTimeApplicable
    if (payrollDetails.overTimeApplicable === undefined) {
      return res
        .status(400)
        .json({ message: "overTimeApplicable is required" });
    }
    const overTimeApplicable =
      payrollDetails.overTimeApplicable === true ||
      payrollDetails.overTimeApplicable === "Yes";

    // Validate otRate if overTimeApplicable is true
    if (overTimeApplicable && !payrollDetails.otRate) {
      return res.status(400).json({
        message: "Overtime rate is required when overtime is applicable",
      });
    }

    // Create new payroll record
    const newPayroll = await PayrollDetailsModel.create({
      employeeId,
      basicSalary: parseFloat(payrollDetails.basicSalary) || 0,
      accommodationAllowance: payrollDetails.accommodationAllowance,
      fullPackageAllowance:
        parseFloat(payrollDetails.fullPackageAllowance) || 0,
      foodAllowance: payrollDetails.foodAllowance,
      fullPackageFoodAllowance:
        parseFloat(payrollDetails.fullPackageFoodAllowance) || 0,
      transportationAllowance: payrollDetails.transportationAllowance,
      fullPackageTransportationAllowance:
        parseFloat(payrollDetails.fullPackageTransportationAllowance) || 0,
      nationalAccreditationBonus:
        parseFloat(payrollDetails.nationalAccreditationBonus) || 0,
      natureOfWorkAllowance:
        parseFloat(payrollDetails.natureOfWorkAllowance) || 0,
      socialBonus: parseFloat(payrollDetails.socialBonus) || 0,
      relocationAllowance: parseFloat(payrollDetails.relocationAllowance) || 0,
      otherBonuses: parseFloat(payrollDetails.otherBonuses) || 0,
      overTimeApplicable,
      otRate: parseFloat(payrollDetails.otRate) || 0,
      startDate: payrollDetails.startDate,
      endDate: payrollDetails.endDate || null,
      totalSalary: parseFloat(payrollDetails.totalSalary) || 0,
      status: payrollDetails.status || "Active",
    });

    // Update completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          payroll: completionStatus,
        },
      });
    }

    res.status(201).json({
      message: "Payroll record created successfully",
      payrollId: newPayroll.id,
    });
  } catch (error) {
    console.error("Error creating payroll record:", error);
    res.status(500).json({
      message: "Error creating payroll record",
      error: error.message,
    });
  }
};

const updateBankDetails = async (req, res) => {
  const { id } = req.params;
  let parsedBankData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing employee form data in 'data' field" });
    }

    parsedBankData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { bankDetails, completionStatus } = parsedBankData;

  try {
    const employeeBankToUpdate = await Employee.findByPk(id);

    if (!employeeBankToUpdate) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employeeBankToUpdate.bankDetails = {
      bankName:
        bankDetails?.bankName || employeeBankToUpdate.bankDetails.bankName,
      accountHolderName:
        bankDetails?.accountHolderName ||
        employeeBankToUpdate.bankDetails.accountHolderName,
      accountNumber:
        bankDetails?.accountNumber ||
        employeeBankToUpdate.bankDetails.accountNumber,
      branchName:
        bankDetails?.branchName || employeeBankToUpdate.bankDetails.branchName,
      IBAN: bankDetails?.IBAN || employeeBankToUpdate.bankDetails.IBAN,
      swiftCode:
        bankDetails?.swiftCode || employeeBankToUpdate.bankDetails.swiftCode,
      shortCode:
        bankDetails?.shortCode || employeeBankToUpdate.bankDetails.shortCode,
    };

    // Update completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employeeBankToUpdate.completionStatuses || {};
      employeeBankToUpdate.completionStatuses = {
        ...currentStatuses,
        bank: completionStatus,
      };
    }

    await employeeBankToUpdate.save();
    res.status(200).json({
      message: "Employee bank details updated successfully",
      employee: {
        ...parsedBankData,
      },
    });
  } catch (error) {
    console.error("Error updating bank details of employee:", error);
    res.status(500).json({
      message: "Error updating bank details of employee",
      error: error.message,
    });
  }
};

const updateSponsorDetails = async (req, res) => {
  uploadSponsor(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    const { id } = req.params;
    let parsedSponsorData;

    try {
      // Check if 'data' came as a file instead of form field
      const dataFile = req.files?.find((f) => f.fieldname === "data");

      if (dataFile) {
        // Read the JSON from the uploaded file
        const fileContent = await fs.readFile(dataFile.path, "utf8");
        parsedSponsorData = JSON.parse(fileContent);

        // Delete the temporary data file
        await fs.unlink(dataFile.path);
      } else if (req.body.data) {
        // Normal case - data as string in body
        parsedSponsorData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({
          message: "Missing employee form data in 'data' field",
        });
      }

      const { sponserDetails, completionStatus } = parsedSponsorData;

      const employeeSponsorToUpdate = await Employee.findByPk(id);

      if (!employeeSponsorToUpdate) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Get only the actual file uploads (exclude the 'data' file)
      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            if (!acc[file.fieldname]) {
              acc[file.fieldname] = [];
            }
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      let uploadedSponserDetails = {
        sponserName:
          sponserDetails?.sponserName ||
          employeeSponsorToUpdate.sponserDetails.sponserName ||
          "",
        contractExpireDate:
          sponserDetails?.contractExpireDate ||
          employeeSponsorToUpdate.sponserDetails.contractExpireDate ||
          "",
        companyCRCopyExpireDate:
          sponserDetails?.companyCRCopyExpireDate ||
          employeeSponsorToUpdate.sponserDetails.companyCRCopyExpireDate ||
          "",
        computerCardExpireDate:
          sponserDetails?.computerCardExpireDate ||
          employeeSponsorToUpdate.sponserDetails.computerCardExpireDate ||
          "",
        employeeContractCopy:
          employeeSponsorToUpdate.sponserDetails.employeeContractCopy || "",
        companyCRCopy:
          employeeSponsorToUpdate.sponserDetails.companyCRCopy || "",
        computerCardCopy:
          employeeSponsorToUpdate.sponserDetails.computerCardCopy || "",
        NOC: employeeSponsorToUpdate.sponserDetails.NOC || "",
      };

      if (uploadedFiles.employeeContractCopy?.[0]?.filename) {
        if (employeeSponsorToUpdate.sponserDetails.employeeContractCopy) {
          deleteOldFile(
            employeeSponsorToUpdate.sponserDetails.employeeContractCopy
          );
        }
        uploadedSponserDetails.employeeContractCopy =
          uploadedFiles.employeeContractCopy[0].filename;
      }

      if (uploadedFiles.companyCRCopy?.[0]?.filename) {
        if (employeeSponsorToUpdate.sponserDetails.companyCRCopy) {
          deleteOldFile(employeeSponsorToUpdate.sponserDetails.companyCRCopy);
        }
        uploadedSponserDetails.companyCRCopy =
          uploadedFiles.companyCRCopy[0].filename;
      }

      if (uploadedFiles.computerCardCopy?.[0]?.filename) {
        if (employeeSponsorToUpdate.sponserDetails.computerCardCopy) {
          deleteOldFile(
            employeeSponsorToUpdate.sponserDetails.computerCardCopy
          );
        }
        uploadedSponserDetails.computerCardCopy =
          uploadedFiles.computerCardCopy[0].filename;
      }

      if (uploadedFiles.NOC?.[0]?.filename) {
        if (employeeSponsorToUpdate.sponserDetails.NOC) {
          deleteOldFile(employeeSponsorToUpdate.sponserDetails.NOC);
        }
        uploadedSponserDetails.NOC = uploadedFiles.NOC[0].filename;
      }

      // Update completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employeeSponsorToUpdate.completionStatuses || {};
        employeeSponsorToUpdate.completionStatuses = {
          ...currentStatuses,
          sponsor: completionStatus,
        };
      }

      employeeSponsorToUpdate.sponserDetails = uploadedSponserDetails;

      await employeeSponsorToUpdate.save();

      res.status(200).json({
        message: "Employee sponsor details updated successfully",
        employee: {
          ...parsedSponsorData,
        },
      });
    } catch (error) {
      console.error("Error updating sponsor details of employee:", error);
      res.status(500).json({
        message: "Error updating sponsor details of employee",
        error: error.message,
      });
    }
  });
};

const updateAcademicQualificationsDetails = async (req, res) => {
  const { id } = req.params; // This is the academic qualifications details record ID
  let parsedAcademicData;

  try {
    if (!req.body.data) {
      return res.status(400).json({
        message: "Missing academic qualifications data in 'data' field",
      });
    }

    parsedAcademicData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { academicQualifications, completionStatus } = parsedAcademicData;

  try {
    // Find the academic qualifications record by ID
    const academicRecord = await AcademicQualificationsModel.findByPk(id);

    if (!academicRecord) {
      return res
        .status(404)
        .json({ message: "Academic qualifications record not found" });
    }

    // Verify that the employee exists
    const employee = await Employee.findByPk(academicRecord.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Associated employee not found" });
    }

    // Prepare update data object
    const updateData = {};

    if (academicQualifications.qualification !== undefined) {
      updateData.qualification = String(academicQualifications.qualification);
    }

    if (academicQualifications.qualificationType !== undefined) {
      updateData.qualificationType = String(
        academicQualifications.qualificationType
      );
    }

    if (academicQualifications.year !== undefined) {
      updateData.year = String(academicQualifications.year);
    }

    if (academicQualifications.location !== undefined) {
      updateData.location = String(academicQualifications.location);
    }

    // Update the academic qualifications record
    await academicRecord.update(updateData);

    // Update employee's completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          career: completionStatus,
        },
      });
    }

    res.status(200).json({
      message: "Academic qualifications updated successfully",
      academicQualifications: academicRecord,
    });
  } catch (error) {
    console.error("Error updating academic qualifications:", error);
    res.status(500).json({
      message: "Error updating academic qualifications",
      error: error.message,
    });
  }
};

// Add this controller function in your employee controller
const updateCareerCompletionStatus = async (req, res) => {
  const { employeeId } = req.params;
  let parsedData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing data in 'data' field" });
    }

    parsedData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { completionStatus } = parsedData;

  try {
    // Find the employee
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the completion status
    const currentStatuses = employee.completionStatuses || {};
    employee.completionStatuses = {
      ...currentStatuses,
      career: completionStatus,
    };

    await employee.save();

    res.status(200).json({
      message: "Career completion status updated successfully",
      completionStatus: employee.completionStatuses.career,
    });
  } catch (error) {
    console.error("Error updating career completion status:", error);
    res.status(500).json({
      message: "Error updating career completion status",
      error: error.message,
    });
  }
};

const updateCertificationsDetails = async (req, res) => {
  uploadCertification(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size too large. Maximum 50MB allowed.",
          error: err.message,
        });
      }
      if (err.code === "LIMIT_FILE_COUNT") {
        return res.status(400).json({
          message: "Only one file can be uploaded for documents.",
          error: err.message,
        });
      }
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    }

    const { id } = req.params;
    let parsedCertificationData;

    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      // Parse the 'data' field from the form body
      if (!req.body.data) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing certification data in 'data' field",
        });
      }

      parsedCertificationData =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;

      const { certifications, completionStatus } = parsedCertificationData;

      if (!certifications) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing certifications object in data",
        });
      }

      // Find the certification record by ID
      const certificationRecord = await CertificationsModel.findByPk(id);

      if (!certificationRecord) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res
          .status(404)
          .json({ message: "Certification record not found" });
      }

      // Verify that the employee exists
      const employee = await Employee.findByPk(certificationRecord.employeeId);
      if (!employee) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res
          .status(404)
          .json({ message: "Associated employee not found" });
      }

      // Prepare update data object
      const updateData = {};

      if (certifications.certificationType !== undefined) {
        updateData.certificationType = String(certifications.certificationType);
      }

      if (certifications.certificationName !== undefined) {
        updateData.certificationName = String(certifications.certificationName);
      }

      if (certifications.otherYear !== undefined) {
        updateData.otherYear = String(certifications.otherYear);
      }

      if (certifications.otherLocation !== undefined) {
        updateData.otherLocation = String(certifications.otherLocation);
      }

      if (certifications.certificationExpireDate !== undefined) {
        updateData.certificationExpireDate = String(
          certifications.certificationExpireDate
        );
      }

      if (certifications.certificationBody !== undefined) {
        updateData.certificationBody = String(certifications.certificationBody);
      }

      // Handle single document file upload
      if (req.file) {
        // Delete old file if it exists
        if (certificationRecord.documents) {
          const existingDoc = certificationRecord.getDataValue("documents");
          if (existingDoc) {
            const oldFilePath = path.join(
              __dirname,
              "../../public/uploads/careerDetailsDocuments",
              existingDoc.trim()
            );
            try {
              if (fs.existsSync(oldFilePath)) {
                await fs.unlink(oldFilePath);
                console.log("Deleted old file:", existingDoc.trim());
              }
            } catch (unlinkErr) {
              console.warn(
                "Could not delete old file:",
                oldFilePath,
                unlinkErr
              );
            }
          }
        }

        // Store single filename
        updateData.documents = req.file.filename;
        console.log("New document uploaded:", req.file.filename);
      }

      // Update the certification record
      await certificationRecord.update(updateData);

      // Update employee's completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employee.completionStatuses || {};
        await employee.update({
          completionStatuses: {
            ...currentStatuses,
            career: completionStatus,
          },
        });
      }

      await certificationRecord.reload();

      res.status(200).json({
        message: "Certification details updated successfully",
        certifications: certificationRecord,
        documentUploaded: !!req.file,
      });
    } catch (error) {
      console.error("Error updating certification details:", error);

      // Clean up uploaded file on error
      if (req.file) {
        await fs
          .unlink(req.file.path)
          .catch((err) => console.warn("Could not delete file on error:", err));
      }

      res.status(500).json({
        message: "Error updating certification details",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
};

const updateWorkExperienceDetails = async (req, res) => {
  const { id } = req.params; // This is the work experience details record ID
  let parsedWorkExperienceData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing work experience data in 'data' field" });
    }

    parsedWorkExperienceData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { workExperience, completionStatus } = parsedWorkExperienceData;

  try {
    // Find the work experience record by ID
    const workExperienceRecord = await WorkExperienceModel.findByPk(id);

    if (!workExperienceRecord) {
      return res
        .status(404)
        .json({ message: "Work experience record not found" });
    }

    // Verify that the employee exists
    const employee = await Employee.findByPk(workExperienceRecord.employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Associated employee not found" });
    }

    // Validate dates if provided
    if (workExperience.startDate) {
      const startDate = new Date(workExperience.startDate);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
    }

    if (workExperience.endDate) {
      const endDate = new Date(workExperience.endDate);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
    }

    // Update the work experience details record
    await workExperienceRecord.update({
      companyName: workExperience.companyName || workExperience.companyName,
      companyLocation:
        workExperience.companyLocation || workExperienceRecord.companyLocation,
      industry: workExperience.industry || workExperienceRecord.industry,
      designation:
        workExperience.designation || workExperienceRecord.designation,
      startDate: workExperience.startDate || workExperienceRecord.startDate,
      endDate:
        workExperience.endDate !== undefined
          ? workExperience.endDate || null
          : workExperienceRecord.endDate,
    });

    // Update employee's completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          career: completionStatus,
        },
      });
    }

    res.status(200).json({
      message: "Work experience details updated successfully",
      workExperience: workExperienceRecord,
    });
  } catch (error) {
    console.error("Error updating work experience details:", error);
    res.status(500).json({
      message: "Error updating work experience details",
      error: error.message,
    });
  }
};

const createAcademicQualifications = async (req, res) => {
  let parsedAcademicData;

  try {
    if (!req.body.data) {
      return res.status(400).json({
        message: "Missing academic qualifications data in 'data' field",
      });
    }

    parsedAcademicData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { employeeId, academicQualifications, completionStatus } = parsedAcademicData;

  if (!employeeId) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  try {
    // Verify that the employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Create new academic qualification record
    const newAcademicQualification = await AcademicQualificationsModel.create({
      qualification: String(academicQualifications.qualification),
      qualificationType: String(academicQualifications.qualificationType),
      year: String(academicQualifications.year),
      location: String(academicQualifications.location),
      employeeId: employeeId,
    });

    // Update employee's completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          career: completionStatus,
        },
      });
    }

    res.status(201).json({
      message: "Academic qualification created successfully",
      academicQualifications: newAcademicQualification,
    });
  } catch (error) {
    console.error("Error creating academic qualification:", error);
    res.status(500).json({
      message: "Error creating academic qualification",
      error: error.message,
    });
  }
};

const createCertifications = async (req, res) => {
  uploadCertification(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size too large. Maximum 50MB allowed.",
          error: err.message,
        });
      }
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    }

    let parsedCertificationData;

    try {
      if (!req.body.data) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing certification data in 'data' field",
        });
      }

      parsedCertificationData =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body.data;

      const { employeeId, certifications, completionStatus } = parsedCertificationData;

      if (!employeeId) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({ message: "Employee ID is required" });
      }

      if (!certifications) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing certifications object in data",
        });
      }

      // Verify that the employee exists
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        if (req.file) {
          await fs
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(404).json({ message: "Employee not found" });
      }

      // Create new certification record
      const newCertification = await CertificationsModel.create({
        certificationType: String(certifications.certificationType),
        certificationName: String(certifications.certificationName),
        otherYear: String(certifications.otherYear),
        otherLocation: String(certifications.otherLocation),
        certificationExpireDate: String(certifications.certificationExpireDate),
        certificationBody: String(certifications.certificationBody),
        documents: req.file ? req.file.filename : "",
        employeeId: employeeId,
      });

      // Update employee's completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employee.completionStatuses || {};
        await employee.update({
          completionStatuses: {
            ...currentStatuses,
            career: completionStatus,
          },
        });
      }

      await newCertification.reload();

      res.status(201).json({
        message: "Certification created successfully",
        certifications: newCertification,
        documentUploaded: !!req.file,
      });
    } catch (error) {
      console.error("Error creating certification:", error);

      // Clean up uploaded file on error
      if (req.file) {
        await fs
          .unlink(req.file.path)
          .catch((err) => console.warn("Could not delete file on error:", err));
      }

      res.status(500).json({
        message: "Error creating certification",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
};

const createWorkExperience = async (req, res) => {
  let parsedWorkExperienceData;

  try {
    if (!req.body.data) {
      return res.status(400).json({
        message: "Missing work experience data in 'data' field",
      });
    }

    parsedWorkExperienceData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { employeeId, workExperience, completionStatus } = parsedWorkExperienceData;

  if (!employeeId) {
    return res.status(400).json({ message: "Employee ID is required" });
  }

  try {
    // Verify that the employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Validate dates if provided
    if (workExperience.startDate) {
      const startDate = new Date(workExperience.startDate);
      if (isNaN(startDate.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
    }

    if (workExperience.endDate) {
      const endDate = new Date(workExperience.endDate);
      if (isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
    }

    // Create new work experience record
    const newWorkExperience = await WorkExperienceModel.create({
      companyName: String(workExperience.companyName),
      companyLocation: String(workExperience.companyLocation),
      industry: String(workExperience.industry),
      designation: String(workExperience.designation),
      startDate: workExperience.startDate || null,
      endDate: workExperience.endDate || null,
      employeeId: employeeId,
    });

    // Update employee's completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employee.completionStatuses || {};
      await employee.update({
        completionStatuses: {
          ...currentStatuses,
          career: completionStatus,
        },
      });
    }

    res.status(201).json({
      message: "Work experience created successfully",
      workExperience: newWorkExperience,
    });
  } catch (error) {
    console.error("Error creating work experience:", error);
    res.status(500).json({
      message: "Error creating work experience",
      error: error.message,
    });
  }
};

const updateDocumentDetails = async (req, res) => {
  uploadDocument(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    const { id } = req.params;
    let parsedDocumentData;

    try {
      // Check if 'data' came as a file instead of form field
      const dataFile = req.files?.find((f) => f.fieldname === "data");

      if (dataFile) {
        // Read the JSON from the uploaded file
        const fileContent = await fs.readFile(dataFile.path, "utf8");
        parsedDocumentData = JSON.parse(fileContent);

        // Delete the temporary data file
        await fs.unlink(dataFile.path);
      } else if (req.body.data) {
        // Normal case - data as string in body
        parsedDocumentData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({
          message: "Missing employee form data in 'data' field",
        });
      }

      const { documentDetails, completionStatus } = parsedDocumentData;

      const employeeDocumentToUpdate = await Employee.findByPk(id);

      if (!employeeDocumentToUpdate) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Get only the actual file uploads (exclude the 'data' file)
      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            if (!acc[file.fieldname]) {
              acc[file.fieldname] = [];
            }
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      let uploadedDocumentDetails = {
        image:
          documentDetails?.image ||
          employeeDocumentToUpdate.documentDetails.image ||
          "",
        copyOfQID:
          documentDetails?.copyOfQID ||
          employeeDocumentToUpdate.documentDetails.copyOfQID ||
          "",
        copyOfPassport:
          documentDetails?.copyOfPassport ||
          employeeDocumentToUpdate.documentDetails.copyOfPassport ||
          "",
        resume:
          documentDetails?.resume ||
          employeeDocumentToUpdate.documentDetails.resume ||
          "",
        qualificationCertificate:
          documentDetails?.qualificationCertificate ||
          employeeDocumentToUpdate.documentDetails.qualificationCertificate ||
          "",
        otherDocuments: Array.isArray(documentDetails?.otherDocuments)
          ? documentDetails.otherDocuments
          : employeeDocumentToUpdate.documentDetails.otherDocuments || "",
      };

      // Handle document file uploads one by one
      if (uploadedFiles.image?.[0]?.filename) {
        if (employeeDocumentToUpdate.documentDetails.image) {
          deleteOldFile(employeeDocumentToUpdate.documentDetails.image);
        }
        uploadedDocumentDetails.image = uploadedFiles.image[0].filename;
      }

      if (uploadedFiles.copyOfQID?.[0]?.filename) {
        if (employeeDocumentToUpdate.documentDetails.copyOfQID) {
          deleteOldFile(employeeDocumentToUpdate.documentDetails.copyOfQID);
        }
        uploadedDocumentDetails.copyOfQID = uploadedFiles.copyOfQID[0].filename;
      }

      if (uploadedFiles.copyOfPassport?.[0]?.filename) {
        if (employeeDocumentToUpdate.documentDetails.copyOfPassport) {
          deleteOldFile(
            employeeDocumentToUpdate.documentDetails.copyOfPassport
          );
        }
        uploadedDocumentDetails.copyOfPassport =
          uploadedFiles.copyOfPassport[0].filename;
      }

      if (uploadedFiles.resume?.[0]?.filename) {
        if (employeeDocumentToUpdate.documentDetails.resume) {
          deleteOldFile(employeeDocumentToUpdate.documentDetails.resume);
        }
        uploadedDocumentDetails.resume = uploadedFiles.resume[0].filename;
      }

      if (uploadedFiles.qualificationCertificate?.[0]?.filename) {
        if (employeeDocumentToUpdate.documentDetails.qualificationCertificate) {
          deleteOldFile(
            employeeDocumentToUpdate.documentDetails.qualificationCertificate
          );
        }
        uploadedDocumentDetails.qualificationCertificate =
          uploadedFiles.qualificationCertificate[0].filename;
      }

      if (uploadedFiles.otherDocuments?.[0]?.filename) {
        if (employeeDocumentToUpdate.documentDetails.otherDocuments) {
          deleteOldFile(
            employeeDocumentToUpdate.documentDetails.otherDocuments
          );
        }
        uploadedDocumentDetails.otherDocuments =
          uploadedFiles.otherDocuments[0].filename;
      }

      // Update completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employeeDocumentToUpdate.completionStatuses || {};
        employeeDocumentToUpdate.completionStatuses = {
          ...currentStatuses,
          documents: completionStatus,
        };
      }

      employeeDocumentToUpdate.documentDetails = uploadedDocumentDetails;

      await employeeDocumentToUpdate.save();

      res.status(200).json({
        message: "Employee document details updated successfully",
        employee: {
          ...parsedDocumentData,
        },
      });
    } catch (error) {
      console.error("Error updating document details of employee:", error);
      res.status(500).json({
        message: "Error updating document details of employee",
        error: error.message,
      });
    }
  });
};

const updateInsuranceDetails = async (req, res) => {
  uploadInsurance(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    const { id } = req.params;
    let parsedInsuranceData;

    try {
      // Check if 'data' came as a file instead of form field
      const dataFile = req.files?.find((f) => f.fieldname === "data");

      if (dataFile) {
        // Read the JSON from the uploaded file
        const fileContent = await fs.readFile(dataFile.path, "utf8");
        parsedInsuranceData = JSON.parse(fileContent);

        // Delete the temporary data file
        await fs.unlink(dataFile.path);
      } else if (req.body.data) {
        // Normal case - data as string in body
        parsedInsuranceData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({
          message: "Missing employee form data in 'data' field",
        });
      }

      const { insuranceDetails, completionStatus } = parsedInsuranceData;

      const employeeInsuranceToUpdate = await Employee.findByPk(id);

      if (!employeeInsuranceToUpdate) {
        return res.status(404).json({ message: "Employee not found" });
      }

      // Get only the actual file uploads (exclude the 'data' file)
      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            if (!acc[file.fieldname]) {
              acc[file.fieldname] = [];
            }
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      let uploadedInsuranceDetails = {
        healthCardNumber:
          insuranceDetails?.healthCardNumber ||
          employeeInsuranceToUpdate.insuranceDetails.healthCardNumber,
        issuingAuthority:
          insuranceDetails?.issuingAuthority ||
          employeeInsuranceToUpdate.insuranceDetails.issuingAuthority,
        expireDate:
          insuranceDetails?.expireDate ||
          employeeInsuranceToUpdate.insuranceDetails.expireDate,
        knownMedicalConditions:
          insuranceDetails?.knownMedicalConditions ||
          employeeInsuranceToUpdate.insuranceDetails.knownMedicalConditions,
        allergies:
          insuranceDetails?.allergies ||
          employeeInsuranceToUpdate.insuranceDetails.allergies,
        notesOrRemarks:
          insuranceDetails?.notesOrRemarks ||
          employeeInsuranceToUpdate.insuranceDetails.notesOrRemarks,
        policyNumber:
          insuranceDetails?.policyNumber ||
          employeeInsuranceToUpdate.insuranceDetails.policyNumber,
        coverageDetails:
          insuranceDetails?.coverageDetails ||
          employeeInsuranceToUpdate.insuranceDetails.coverageDetails,
        compensationExpireDate:
          insuranceDetails?.compensationExpireDate ||
          employeeInsuranceToUpdate.insuranceDetails.compensationExpireDate,
        insuranceProvider:
          insuranceDetails?.insuranceProvider ||
          employeeInsuranceToUpdate.insuranceDetails.insuranceProvider,
        additionalPolicyDetails:
          insuranceDetails?.additionalPolicyDetails ||
          employeeInsuranceToUpdate.insuranceDetails.additionalPolicyDetails,
        attachments:
          employeeInsuranceToUpdate.insuranceDetails.attachments || "",
      };

      // Handle insurance attachment file upload (unchanged)
      if (uploadedFiles.attachments?.[0]?.filename) {
        if (employeeInsuranceToUpdate.insuranceDetails.attachments) {
          deleteOldFile(employeeInsuranceToUpdate.insuranceDetails.attachments);
        }
        uploadedInsuranceDetails.attachments =
          uploadedFiles.attachments[0].filename;
      }

      // Update completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employeeInsuranceToUpdate.completionStatuses || {};
        employeeInsuranceToUpdate.completionStatuses = {
          ...currentStatuses,
          insurance: completionStatus,
        };
      }

      employeeInsuranceToUpdate.insuranceDetails = uploadedInsuranceDetails;

      await employeeInsuranceToUpdate.save();

      res.status(200).json({
        message: "Employee insurance details updated successfully",
        employee: {
          ...parsedInsuranceData,
        },
      });
    } catch (error) {
      console.error("Error updating insurance details of employee:", error);
      res.status(500).json({
        message: "Error updating insurance details of employee",
        error: error.message,
      });
    }
  });
};

// Add this new function for updating contract details
// const updateContractDetails = async (req, res) => {
//   uploadContract(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       console.error("Multer error:", err);
//       if (err.code === "LIMIT_FILE_SIZE") {
//         return res.status(400).json({
//           message: "File size too large. Maximum 50MB allowed.",
//           error: err.message,
//         });
//       }
//       return res.status(400).json({
//         message: "File upload error",
//         error: err.message,
//       });
//     } else if (err) {
//       console.error("Upload error:", err);
//       return res.status(400).json({
//         message: "File upload error",
//         error: err.message,
//       });
//     }

//     const { id } = req.params; // Contract record ID
//     let parsedContractData;

//     try {
//       console.log("Request body:", req.body);
//       console.log("Request file:", req.file);

//       if (!req.body.data) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(400).json({
//           message: "Missing contract data in 'data' field",
//         });
//       }

//       parsedContractData =
//         typeof req.body.data === "string"
//           ? JSON.parse(req.body.data)
//           : req.body.data;

//       const { employeeContracts } = parsedContractData;

//       if (!employeeContracts) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(400).json({
//           message: "Missing contractDetails object in data",
//         });
//       }

//       // Find the contract record by ID
//       const contractRecord = await EmployeeContractModel.findByPk(id);

//       if (!contractRecord) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(404).json({ message: "Contract record not found" });
//       }

//       // Verify that the employee exists
//       const employee = await Employee.findByPk(contractRecord.employeeId);
//       if (!employee) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res
//           .status(404)
//           .json({ message: "Associated employee not found" });
//       }

//       // Prepare update data object
//       const updateData = {};

//       if (employeeContracts.contractType !== undefined) {
//         updateData.contractType = String(employeeContracts.contractType);
//       }

//       if (employeeContracts.contractNumber !== undefined) {
//         updateData.contractNumber = String(employeeContracts.contractNumber);
//       }

//       if (employeeContracts.contractStartDate !== undefined) {
//         updateData.contractStartDate = employeeContracts.contractStartDate;
//       }

//       if (employeeContracts.contractEndDate !== undefined) {
//         updateData.contractEndDate = employeeContracts.contractEndDate;
//       }

//       if (employeeContracts.contractStatus !== undefined) {
//         updateData.contractStatus = String(employeeContracts.contractStatus);
//       }

//       // Handle contract attachment file upload
//       if (req.file) {
//         // Delete old file if it exists
//         if (contractRecord.contractAttachment) {
//           const existingDoc = contractRecord.getDataValue("contractAttachment");
//           if (existingDoc) {
//             const oldFilePath = path.join(
//               __dirname,
//               "../../public/uploads/contractAttachmentDocuments",
//               existingDoc.trim()
//             );
//             try {
//               if (fs.existsSync(oldFilePath)) {
//                 await fs.unlink(oldFilePath);
//                 console.log("Deleted old file:", existingDoc.trim());
//               }
//             } catch (unlinkErr) {
//               console.warn(
//                 "Could not delete old file:",
//                 oldFilePath,
//                 unlinkErr
//               );
//             }
//           }
//         }

//         updateData.contractAttachment = req.file.filename;
//         console.log("New contract document uploaded:", req.file.filename);
//       }

//       // Update the contract record
//       await contractRecord.update(updateData);

//       // Reload to get formatted data
//       await contractRecord.reload();

//       res.status(200).json({
//         message: "Contract details updated successfully",
//         employeeContracts: contractRecord,
//         documentUploaded: !!req.file,
//       });
//     } catch (error) {
//       console.error("Error updating contract details:", error);

//       // Clean up uploaded file on error
//       if (req.file) {
//         await fs
//           .unlink(req.file.path)
//           .catch((err) => console.warn("Could not delete file on error:", err));
//       }

//       res.status(500).json({
//         message: "Error updating contract details",
//         error: error.message,
//         stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//       });
//     }
//   });
// };

// // Add this new function for creating contract records
// const createContractDetails = async (req, res) => {
//   uploadContract(req, res, async (err) => {
//     if (err instanceof multer.MulterError) {
//       console.error("Multer error:", err);
//       if (err.code === "LIMIT_FILE_SIZE") {
//         return res.status(400).json({
//           message: "File size too large. Maximum 50MB allowed.",
//           error: err.message,
//         });
//       }
//       return res.status(400).json({
//         message: "File upload error",
//         error: err.message,
//       });
//     } else if (err) {
//       console.error("Upload error:", err);
//       return res.status(400).json({
//         message: "File upload error",
//         error: err.message,
//       });
//     }

//     let parsedContractData;

//     try {
//       if (!req.body.data) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(400).json({
//           message: "Missing contract data in 'data' field",
//         });
//       }

//       parsedContractData =
//         typeof req.body.data === "string"
//           ? JSON.parse(req.body.data)
//           : req.body.data;

//       const { employeeId, employeeContracts } = parsedContractData;

//       if (!employeeId) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(400).json({ message: "Employee ID is required" });
//       }

//       if (!employeeContracts) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(400).json({
//           message: "Missing contractDetails object in data",
//         });
//       }

//       // Verify that the employee exists
//       const employee = await Employee.findByPk(employeeId);
//       if (!employee) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(404).json({ message: "Employee not found" });
//       }

//       // Validate required fields
//       if (
//         !employeeContracts.contractType ||
//         !employeeContracts.contractNumber ||
//         !employeeContracts.contractStartDate ||
//         !employeeContracts.contractEndDate ||
//         !employeeContracts.contractStatus
//       ) {
//         if (req.file) {
//           await fs
//             .unlink(req.file.path)
//             .catch((err) => console.warn("Could not delete file:", err));
//         }
//         return res.status(400).json({
//           message:
//             "All contract fields are required (contractType, contractNumber, contractStartDate, contractEndDate, contractStatus)",
//         });
//       }

//       // Create new contract record
//       const newContract = await EmployeeContractModel.create({
//         contractType: String(employeeContracts.contractType),
//         contractNumber: String(employeeContracts.contractNumber),
//         contractAttachment: req.file ? req.file.filename : "",
//         contractStartDate: employeeContracts.contractStartDate,
//         contractEndDate: employeeContracts.contractEndDate,
//         contractStatus: String(employeeContracts.contractStatus),
//         employeeId: employeeId,
//       });

//       await newContract.reload();

//       res.status(201).json({
//         message: "Contract created successfully",
//         employeeContracts: newContract,
//         documentUploaded: !!req.file,
//       });
//     } catch (error) {
//       console.error("Error creating contract:", error);

//       // Clean up uploaded file on error
//       if (req.file) {
//         await fs
//           .unlink(req.file.path)
//           .catch((err) => console.warn("Could not delete file on error:", err));
//       }

//       res.status(500).json({
//         message: "Error creating contract",
//         error: error.message,
//         stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
//       });
//     }
//   });
// };

const updateContractDetails = async (req, res) => {
  uploadContract(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size too large. Maximum 50MB allowed.",
          error: err.message,
        });
      }
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    }

    const { id } = req.params; // Contract record ID
    let parsedContractData;

    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      // Parse the data field - it's coming as FormData
      if (!req.body) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing contract data in request body",
        });
      }

      // The data is directly in req.body, not in a 'data' field
      parsedContractData = {
        employeeContracts: req.body,
      };

      const { employeeContracts, completionStatus } = parsedContractData;

      if (!employeeContracts) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing contract details in data",
        });
      }

      // Find the contract record by ID
      const contractRecord = await EmployeeContractModel.findByPk(id);

      if (!contractRecord) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(404).json({ message: "Contract record not found" });
      }

      // Verify that the employee exists
      const employee = await Employee.findByPk(contractRecord.employeeId);
      if (!employee) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res
          .status(404)
          .json({ message: "Associated employee not found" });
      }

      // Prepare update data object
      const updateData = {};

      if (employeeContracts.contractType !== undefined) {
        updateData.contractType = String(employeeContracts.contractType);
      }

      if (employeeContracts.contractNumber !== undefined) {
        updateData.contractNumber = String(employeeContracts.contractNumber);
      }

      if (employeeContracts.contractStartDate !== undefined) {
        updateData.contractStartDate = employeeContracts.contractStartDate;
      }

      if (employeeContracts.contractEndDate !== undefined) {
        updateData.contractEndDate = employeeContracts.contractEndDate;
      }

      if (employeeContracts.contractStatus !== undefined) {
        updateData.contractStatus = String(employeeContracts.contractStatus);
      }

      // Handle contract attachment file upload
      if (req.file) {
        // Delete old file if it exists
        if (contractRecord.contractAttachment) {
          const existingDoc = contractRecord.getDataValue("contractAttachment");
          if (existingDoc) {
            const oldFilePath = path.join(
              __dirname,
              "../../public/uploads/contractAttachmentDocuments",
              path.basename(existingDoc)
            );
            try {
              if (fs.existsSync(oldFilePath)) {
                await fs.promises.unlink(oldFilePath);
                console.log("Deleted old file:", path.basename(existingDoc));
              }
            } catch (unlinkErr) {
              console.warn(
                "Could not delete old file:",
                oldFilePath,
                unlinkErr
              );
            }
          }
        }

        // Store the path with forward slashes
        updateData.contractAttachment = path
          .join("/uploads/contractAttachmentDocuments", req.file.filename)
          .replace(/\\/g, "/");
        console.log("New contract document uploaded:", req.file.filename);
      }

      // Update the contract record
      await contractRecord.update(updateData);

      // Update employee's completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employee.completionStatuses || {};
        await employee.update({
          completionStatuses: {
            ...currentStatuses,
            contract: completionStatus,
          },
        });
      }

      // Reload to get formatted data
      await contractRecord.reload();

      res.status(200).json({
        message: "Contract details updated successfully",
        employeeContracts: contractRecord,
        documentUploaded: !!req.file,
      });
    } catch (error) {
      console.error("Error updating contract details:", error);

      // Clean up uploaded file on error
      if (req.file) {
        await fs.promises
          .unlink(req.file.path)
          .catch((err) => console.warn("Could not delete file on error:", err));
      }

      res.status(500).json({
        message: "Error updating contract details",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
};


// Add this controller function in your employee controller
const updateContractCompletionStatus = async (req, res) => {
  const { employeeId } = req.params;
  let parsedData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing data in 'data' field" });
    }

    parsedData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { completionStatus } = parsedData;

  try {
    // Find the employee
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Update the completion status
    const currentStatuses = employee.completionStatuses || {};
    employee.completionStatuses = {
      ...currentStatuses,
      contract: completionStatus,
    };

    await employee.save();

    res.status(200).json({
      message: "Contract completion status updated successfully",
      completionStatus: employee.completionStatuses.contract,
    });
  } catch (error) {
    console.error("Error updating contract completion status:", error);
    res.status(500).json({
      message: "Error updating contract completion status",
      error: error.message,
    });
  }
};


const createContractDetails = async (req, res) => {
  uploadContract(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size too large. Maximum 50MB allowed.",
          error: err.message,
        });
      }
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    } else if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    }

    let parsedContractData;

    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      if (!req.body) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing contract data in request body",
        });
      }

      // Parse data from FormData
      const employeeId = req.body.employeeId;
      const completionStatus = req.body.completionStatus;
      const employeeContracts = {
        contractType: req.body.contractType,
        contractNumber: req.body.contractNumber,
        contractStartDate: req.body.contractStartDate,
        contractEndDate: req.body.contractEndDate,
        contractStatus: req.body.contractStatus,
      };

      if (!employeeId) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({ message: "Employee ID is required" });
      }

      if (
        !employeeContracts.contractType ||
        !employeeContracts.contractNumber
      ) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message: "Missing required contract fields",
        });
      }

      // Verify that the employee exists
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(404).json({ message: "Employee not found" });
      }

      // Validate required fields
      if (
        !employeeContracts.contractType ||
        !employeeContracts.contractNumber ||
        !employeeContracts.contractStartDate ||
        !employeeContracts.contractEndDate ||
        !employeeContracts.contractStatus
      ) {
        if (req.file) {
          await fs.promises
            .unlink(req.file.path)
            .catch((err) => console.warn("Could not delete file:", err));
        }
        return res.status(400).json({
          message:
            "All contract fields are required (contractType, contractNumber, contractStartDate, contractEndDate, contractStatus)",
        });
      }

      // Create new contract record
      const newContract = await EmployeeContractModel.create({
        contractType: String(employeeContracts.contractType),
        contractNumber: String(employeeContracts.contractNumber),
        contractAttachment: req.file
          ? path
            .join("/uploads/contractAttachmentDocuments", req.file.filename)
            .replace(/\\/g, "/")
          : "",
        contractStartDate: employeeContracts.contractStartDate,
        contractEndDate: employeeContracts.contractEndDate,
        contractStatus: String(employeeContracts.contractStatus),
        employeeId: employeeId,
      });

      // Update employee's completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employee.completionStatuses || {};
        await employee.update({
          completionStatuses: {
            ...currentStatuses,
            contract: completionStatus,
          },
        });
      }

      await newContract.reload();

      res.status(201).json({
        message: "Contract created successfully",
        employeeContracts: newContract,
        contractDetails: newContract, // Add this for frontend compatibility
        id: newContract.id, // Add this for frontend compatibility
        documentUploaded: !!req.file,
      });
    } catch (error) {
      console.error("Error creating contract:", error);

      // Clean up uploaded file on error
      if (req.file) {
        await fs.promises
          .unlink(req.file.path)
          .catch((err) => console.warn("Could not delete file on error:", err));
      }

      res.status(500).json({
        message: "Error creating contract",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  });
};

// Add this new function for updating fleet details
const updateFleetDetails = async (req, res) => {
  uploadGatePass(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    const { id } = req.params;
    let parsedFleetData;

    try {
      const dataFile = req.files?.find((f) => f.fieldname === "data");

      if (dataFile) {
        const fileContent = await fs.readFile(dataFile.path, "utf8");
        parsedFleetData = JSON.parse(fileContent);
        await fs.unlink(dataFile.path);
      } else if (req.body.data) {
        parsedFleetData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({
          message: "Missing employee form data in 'data' field",
        });
      }

      const { fleetDetails, completionStatus } = parsedFleetData;

      const employeeFleetToUpdate = await Employee.findByPk(id);

      if (!employeeFleetToUpdate) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            if (!acc[file.fieldname]) {
              acc[file.fieldname] = [];
            }
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      let uploadedFleetDetails = {
        operatorType:
          fleetDetails?.operatorType ||
          employeeFleetToUpdate.fleetDetails.operatorType ||
          "",
        equipmentDetails:
          fleetDetails?.equipmentDetails ||
          employeeFleetToUpdate.fleetDetails.equipmentDetails ||
          "",
        month:
          fleetDetails?.month || employeeFleetToUpdate.fleetDetails.month || "",
        gatePassNumber:
          fleetDetails?.gatePassNumber ||
          employeeFleetToUpdate.fleetDetails.gatePassNumber ||
          "",
        gatePassLocation:
          fleetDetails?.gatePassLocation ||
          employeeFleetToUpdate.fleetDetails.gatePassLocation ||
          "",
        gateAccessNo:
          fleetDetails?.gateAccessNo ||
          employeeFleetToUpdate.fleetDetails.gateAccessNo ||
          "",
        appHashNumber:
          fleetDetails?.appHashNumber ||
          employeeFleetToUpdate.fleetDetails.appHashNumber ||
          "",
        gatePassIssueDate:
          fleetDetails?.gatePassIssueDate ||
          employeeFleetToUpdate.fleetDetails.gatePassIssueDate ||
          "",
        gatePassExpireDate:
          fleetDetails?.gatePassExpireDate ||
          employeeFleetToUpdate.fleetDetails.gatePassExpireDate ||
          "",
        gatePassAttachment:
          employeeFleetToUpdate.fleetDetails.gatePassAttachment || "",
        gatePassExpireStatus:
          fleetDetails?.gatePassExpireStatus ||
          employeeFleetToUpdate.fleetDetails.gatePassExpireStatus ||
          "",
        fleetStatus:
          fleetDetails?.fleetStatus ||
          employeeFleetToUpdate.fleetDetails.fleetStatus ||
          "",
      };

      if (uploadedFiles.gatePassAttachment?.[0]?.filename) {
        if (employeeFleetToUpdate.fleetDetails.gatePassAttachment) {
          deleteOldFile(employeeFleetToUpdate.fleetDetails.gatePassAttachment);
        }
        uploadedFleetDetails.gatePassAttachment =
          uploadedFiles.gatePassAttachment[0].filename;
      }

      // Update completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employeeFleetToUpdate.completionStatuses || {};
        employeeFleetToUpdate.completionStatuses = {
          ...currentStatuses,
          fleet: completionStatus,
        };
      }

      employeeFleetToUpdate.fleetDetails = uploadedFleetDetails;

      await employeeFleetToUpdate.save();

      res.status(200).json({
        message: "Employee fleet details updated successfully",
        employee: {
          ...parsedFleetData,
        },
      });
    } catch (error) {
      console.error("Error updating fleet details of employee:", error);
      res.status(500).json({
        message: "Error updating fleet details of employee",
        error: error.message,
      });
    }
  });
};

const updateTrainingCertificationDetails = async (req, res) => {
  uploadTrainingCertificate(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: "File upload error", error: err.message });
    }

    const { id } = req.params;
    let parsedTrainingData;

    try {
      const dataFile = req.files?.find((f) => f.fieldname === "data");

      if (dataFile) {
        const fileContent = await fs.readFile(dataFile.path, "utf8");
        parsedTrainingData = JSON.parse(fileContent);
        await fs.unlink(dataFile.path);
      } else if (req.body.data) {
        parsedTrainingData =
          typeof req.body.data === "string"
            ? JSON.parse(req.body.data)
            : req.body.data;
      } else {
        return res.status(400).json({
          message: "Missing employee form data in 'data' field",
        });
      }

      const { trainingCertificationsDetails, completionStatus } = parsedTrainingData;

      const employeeTrainingToUpdate = await Employee.findByPk(id);

      if (!employeeTrainingToUpdate) {
        return res.status(404).json({ message: "Employee not found" });
      }

      const uploadedFiles =
        req.files?.reduce((acc, file) => {
          if (file.fieldname !== "data") {
            if (!acc[file.fieldname]) {
              acc[file.fieldname] = [];
            }
            acc[file.fieldname].push(file);
          }
          return acc;
        }, {}) || {};

      let uploadedTrainingCertificationDetails = {
        trainingTitle:
          trainingCertificationsDetails?.trainingTitle ||
          employeeTrainingToUpdate.trainingCertificationsDetails.trainingTitle ||
          "",
        issueDate:
          trainingCertificationsDetails?.issueDate ||
          employeeTrainingToUpdate.trainingCertificationsDetails.issueDate ||
          "",
        expiryDate:
          trainingCertificationsDetails?.expiryDate || employeeTrainingToUpdate.trainingCertificationsDetails.expiryDate || "",
        idIqamaNo:
          trainingCertificationsDetails?.idIqamaNo ||
          employeeTrainingToUpdate.trainingCertificationsDetails.idIqamaNo ||
          "",
        companyName:
          trainingCertificationsDetails?.companyName ||
          employeeTrainingToUpdate.trainingCertificationsDetails.companyName ||
          "",
        description:
          trainingCertificationsDetails?.description ||
          employeeTrainingToUpdate.trainingCertificationsDetails.description ||
          "",
        certifiedAs:
          trainingCertificationsDetails?.certifiedAs ||
          employeeTrainingToUpdate.trainingCertificationsDetails.certifiedAs ||
          "",
        trainingCertificate:
          trainingCertificationsDetails?.trainingCertificate ||
          employeeTrainingToUpdate.trainingCertificationsDetails.trainingCertificate ||
          "",
      };

      if (uploadedFiles.trainingCertificate?.[0]?.filename) {
        if (employeeTrainingToUpdate.trainingCertificationsDetails.trainingCertificate) {
          deleteOldFile(employeeTrainingToUpdate.trainingCertificationsDetails.trainingCertificate);
        }
        uploadedTrainingCertificationDetails.trainingCertificate =
          uploadedFiles.trainingCertificate[0].filename;
      }

      // Update completion status
      if (completionStatus !== undefined) {
        const currentStatuses = employeeTrainingToUpdate.completionStatuses || {};
        employeeTrainingToUpdate.completionStatuses = {
          ...currentStatuses,
          training: completionStatus,
        };
      }

      employeeTrainingToUpdate.trainingCertificationsDetails = uploadedTrainingCertificationDetails;

      await employeeTrainingToUpdate.save();

      res.status(200).json({
        message: "Employee training certification details updated successfully",
        employee: {
          ...parsedTrainingData,
        },
      });
    } catch (error) {
      console.error("Error updating training certification details of employee:", error);
      res.status(500).json({
        message: "Error updating training certification details of employee",
        error: error.message,
      });
    }
  });
};

const updateOtherDetails = async (req, res) => {
  const { id } = req.params;
  let parsedOtherData;

  try {
    if (!req.body.data) {
      return res
        .status(400)
        .json({ message: "Missing employee form data in 'data' field" });
    }

    parsedOtherData =
      typeof req.body.data === "string"
        ? JSON.parse(req.body.data)
        : req.body.data;
  } catch (err) {
    return res.status(400).json({
      message: "Invalid JSON format in 'data' field",
      error: err.message,
    });
  }

  const { otherDetails, completionStatus } = parsedOtherData;

  try {
    const employeeOtherDetailsToUpdate = await Employee.findByPk(id);

    if (!employeeOtherDetailsToUpdate) {
      return res.status(404).json({ message: "Employee not found" });
    }

    employeeOtherDetailsToUpdate.otherDetails = {
      dateOfJoin:
        otherDetails?.dateOfJoin ||
        employeeOtherDetailsToUpdate.otherDetails.dateOfJoin,
      designation:
        otherDetails?.designation ||
        employeeOtherDetailsToUpdate.otherDetails.designation,
      employeeType:
        otherDetails?.employeeType ||
        employeeOtherDetailsToUpdate.otherDetails.employeeType,
      status:
        otherDetails?.status ||
        employeeOtherDetailsToUpdate.otherDetails.status,
      workPlace:
        otherDetails?.workPlace ||
        employeeOtherDetailsToUpdate.otherDetails.workPlace,
      departmentName:
        otherDetails?.departmentName ||
        employeeOtherDetailsToUpdate.otherDetails.departmentName,
      annualLeaveCount:
        otherDetails?.annualLeaveCount ||
        employeeOtherDetailsToUpdate.otherDetails.annualLeaveCount,
      destinationCountry:
        otherDetails?.destinationCountry ||
        employeeOtherDetailsToUpdate.otherDetails.destinationCountry,
    };

    // Update completion status
    if (completionStatus !== undefined) {
      const currentStatuses = employeeOtherDetailsToUpdate.completionStatuses || {};
      employeeOtherDetailsToUpdate.completionStatuses = {
        ...currentStatuses,
        other: completionStatus,
      };
    }

    await employeeOtherDetailsToUpdate.save();
    res.status(200).json({
      message: "Employee other details updated successfully",
      employee: {
        ...parsedOtherData,
      },
    });
  } catch (error) {
    console.error("Error updating other details of employee:", error);
    res.status(500).json({
      message: "Error updating other details of employee",
      error: error.message,
    });
  }
};

const serveEmployeeFile = (req, res) => {
  const validFolders = [
    "sponsorDetailsDocuments",
    "drivingLicenseDocuments",
    "careerDetailsDocuments",
    "insuranceDocuments",
    "otherDocuments",
    "contractAttachmentDocuments",
    "employeeGatePasses",
    "trainingCertifications",
  ];
  const { folder, filename } = req.params;

  if (!validFolders.includes(folder)) {
    return res.status(400).json({ message: "Invalid folder" });
  }

  const basePath = path.join(__dirname, "..", "..", "public", "uploads");
  const safePath = path.join(basePath, folder, filename);

  if (!safePath.startsWith(basePath)) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (fs.existsSync(safePath)) {
    const ext = path.extname(safePath).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xls": "application/vnd.ms-excel",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    if ([".pdf", ".doc", ".docx", ".xlsx", ".xls"].includes(ext)) {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
    } else {
      res.setHeader("Content-Disposition", "inline");
    }

    res.setHeader("Content-Type", contentType);
    fs.createReadStream(safePath).pipe(res);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  try {
    const employeeToDelete = await Employee.findByPk(id);

    if (!employeeToDelete) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employeeToDelete.destroy();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting employee", error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: FamilyDetailsModel,
          as: "familyDetails",
        },
        {
          model: WorkExperienceModel,
          as: "workExperience",
        },
        {
          model: PayrollDetailsModel,
          as: "payrollDetails",
        },
        {
          model: CertificationsModel,
          as: "certifications",
        },
        {
          model: AcademicQualificationsModel,
          as: "academicQualifications",
        },
        {
          model: EmployeeContractModel,
          as: "employeeContracts",
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      personalDetails: employee.personalDetails,
      familyDetails: { members: employee.familyDetails },
      drivingLicenseDetails: employee.drivingLicenseDetails,
      payrollDetails: employee.payrollDetails,
      bankDetails: employee.bankDetails,
      sponserDetails: employee.sponserDetails,
      documentDetails: employee.documentDetails,
      insuranceDetails: employee.insuranceDetails,
      fleetDetails: employee.fleetDetails,
      trainingCertificationsDetails: employee.trainingCertificationsDetails,
      otherDetails: employee.otherDetails,
      workExperience: employee.workExperience,
      certifications: employee.certifications,
      academicQualifications: employee.academicQualifications,
      employeeContracts: employee.employeeContracts,
      completionStatuses: employee.completionStatuses,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving employee",
      error: error.message,
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalEmployees, rows: employees } =
      await Employee.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: FamilyDetailsModel,
            as: "familyDetails",
          },
          {
            model: WorkExperienceModel,
            as: "workExperience",
          },
          {
            model: PayrollDetailsModel,
            as: "payrollDetails",
          },
          {
            model: CertificationsModel,
            as: "certifications",
          },
          {
            model: AcademicQualificationsModel,
            as: "academicQualifications",
          },
          {
            model: EmployeeContractModel,
            as: "employeeContracts",
          },
        ],
      });

    res.status(200).json({
      totalEmployees,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEmployees / limit),
      employees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving employees",
      error: error.message,
    });
  }
};

const getEmployeesWithExpiringDocuments = async (req, res) => {
  try {
    const { daysAhead = 180 } = req.query; // Default to 6 months (180 days)

    const employees = await Employee.findAll({
      include: [
        {
          model: FamilyDetailsModel,
          as: "familyDetails",
        },
        {
          model: WorkExperienceModel,
          as: "workExperience",
        },
        {
          model: PayrollDetailsModel,
          as: "payrollDetails",
        },
        {
          model: CertificationsModel,
          as: "certifications",
        },
        {
          model: AcademicQualificationsModel,
          as: "academicQualifications",
        },
        {
          model: EmployeeContractModel,
          as: "employeeContracts",
        },
      ],
    });

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(daysAhead));

    const employeesWithExpiringDocs = employees
      .filter((employee) => {
        const personalDetails = employee.personalDetails;
        if (!personalDetails) return false;

        const qidExpiry = personalDetails.qidExpireDate
          ? new Date(personalDetails.qidExpireDate)
          : null;
        const passportExpiry = personalDetails.passportExpireDate
          ? new Date(personalDetails.passportExpireDate)
          : null;

        const isQidExpiring =
          qidExpiry && qidExpiry >= today && qidExpiry <= futureDate;
        const isPassportExpiring =
          passportExpiry &&
          passportExpiry >= today &&
          passportExpiry <= futureDate;

        return isQidExpiring || isPassportExpiring;
      })
      .map((employee) => {
        const personalDetails = employee.personalDetails;
        const qidExpiry = personalDetails.qidExpireDate
          ? new Date(personalDetails.qidExpireDate)
          : null;
        const passportExpiry = personalDetails.passportExpireDate
          ? new Date(personalDetails.passportExpireDate)
          : null;

        // Calculate days left
        const qidDaysLeft = qidExpiry
          ? Math.ceil((qidExpiry - today) / (1000 * 60 * 60 * 24))
          : null;
        const passportDaysLeft = passportExpiry
          ? Math.ceil((passportExpiry - today) / (1000 * 60 * 60 * 24))
          : null;

        // Determine urgency status
        let status = "Nearing Expiry";
        const minDaysLeft = Math.min(
          qidDaysLeft !== null ? qidDaysLeft : Infinity,
          passportDaysLeft !== null ? passportDaysLeft : Infinity
        );

        if (minDaysLeft <= 30) {
          status = "Urgent";
        } else if (minDaysLeft <= 90) {
          status = "Nearing Expiry";
        }

        return {
          id: employee.id,
          employeeName: personalDetails.fullNameEnglish || "Unknown",
          qidExpiry: qidExpiry ? qidExpiry.toISOString().split("T")[0] : null,
          passportExpiry: passportExpiry
            ? passportExpiry.toISOString().split("T")[0]
            : null,
          qidDaysLeft,
          passportDaysLeft,
          minDaysLeft: minDaysLeft === Infinity ? null : minDaysLeft,
          status,
          personalDetails: employee.personalDetails,
          otherDetails: employee.otherDetails,
        };
      });

    // Sort by urgency (least days left first)
    employeesWithExpiringDocs.sort((a, b) => {
      if (a.minDaysLeft === null) return 1;
      if (b.minDaysLeft === null) return -1;
      return a.minDaysLeft - b.minDaysLeft;
    });

    res.status(200).json({
      totalCount: employeesWithExpiringDocs.length,
      employees: employeesWithExpiringDocs,
      summary: {
        urgent: employeesWithExpiringDocs.filter(
          (emp) => emp.status === "Urgent"
        ).length,
        nearingExpiry: employeesWithExpiringDocs.filter(
          (emp) => emp.status === "Nearing Expiry"
        ).length,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving employees with expiring documents",
      error: error.message,
    });
  }
};

const getEmployeesWithExpiringInsuranceDocuments = async (req, res) => {
  try {
    const { daysAhead = 180 } = req.query; // Default to 6 months (180 days)

    const employees = await Employee.findAll({
      include: [
        {
          model: FamilyDetailsModel,
          as: "familyDetails",
        },
        {
          model: WorkExperienceModel,
          as: "workExperience",
        },
        {
          model: PayrollDetailsModel,
          as: "payrollDetails",
        },
        {
          model: CertificationsModel,
          as: "certifications",
        },
        {
          model: AcademicQualificationsModel,
          as: "academicQualifications",
        },
        {
          model: EmployeeContractModel,
          as: "employeeContracts",
        },
      ],
    });

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + parseInt(daysAhead));

    const employeesWithExpiringInsuranceDocs = employees
      .filter((employee) => {
        const insuranceDetails = employee.insuranceDetails;
        if (!insuranceDetails) return false;

        // Check Health Card expiry
        const healthCardExpiry = insuranceDetails.expireDate
          ? new Date(insuranceDetails.expireDate)
          : null;

        // Check Workmen's Compensation expiry
        const compensationExpiry = insuranceDetails.compensationExpireDate
          ? new Date(insuranceDetails.compensationExpireDate)
          : null;

        const isHealthCardExpiring =
          healthCardExpiry &&
          healthCardExpiry >= today &&
          healthCardExpiry <= futureDate;

        const isCompensationExpiring =
          compensationExpiry &&
          compensationExpiry >= today &&
          compensationExpiry <= futureDate;

        return isHealthCardExpiring || isCompensationExpiring;
      })
      .map((employee) => {
        const insuranceDetails = employee.insuranceDetails;
        const personalDetails = employee.personalDetails;

        const healthCardExpiry = insuranceDetails.expireDate
          ? new Date(insuranceDetails.expireDate)
          : null;
        const compensationExpiry = insuranceDetails.compensationExpireDate
          ? new Date(insuranceDetails.compensationExpireDate)
          : null;

        // Calculate days left
        const healthCardDaysLeft = healthCardExpiry
          ? Math.ceil((healthCardExpiry - today) / (1000 * 60 * 60 * 24))
          : null;
        const compensationDaysLeft = compensationExpiry
          ? Math.ceil((compensationExpiry - today) / (1000 * 60 * 60 * 24))
          : null;

        // Determine urgency status
        let status = "Nearing Expiry";
        const minDaysLeft = Math.min(
          healthCardDaysLeft !== null ? healthCardDaysLeft : Infinity,
          compensationDaysLeft !== null ? compensationDaysLeft : Infinity
        );

        if (minDaysLeft <= 30) {
          status = "Urgent";
        } else if (minDaysLeft <= 90) {
          status = "Nearing Expiry";
        }

        // Check which documents are expiring
        const hasHealthCardExpiring =
          healthCardExpiry &&
          healthCardExpiry >= today &&
          healthCardExpiry <= futureDate;
        const hasCompensationExpiring =
          compensationExpiry &&
          compensationExpiry >= today &&
          compensationExpiry <= futureDate;

        return {
          id: employee.id,
          employeeName: personalDetails?.fullNameEnglish || "Unknown",
          healthCardExpiry: healthCardExpiry
            ? healthCardExpiry.toISOString().split("T")[0]
            : null,
          compensationExpiry: compensationExpiry
            ? compensationExpiry.toISOString().split("T")[0]
            : null,
          healthCardDaysLeft,
          compensationDaysLeft,
          minDaysLeft: minDaysLeft === Infinity ? null : minDaysLeft,
          status,
          hasHealthCardExpiring,
          hasCompensationExpiring,
          insuranceDetails: {
            healthCardNumber: insuranceDetails.healthCardNumber,
            issuingAuthority: insuranceDetails.issuingAuthority,
            policyNumber: insuranceDetails.policyNumber,
            insuranceProvider: insuranceDetails.insuranceProvider,
            coverageDetails: insuranceDetails.coverageDetails,
          },
          personalDetails: employee.personalDetails,
          otherDetails: employee.otherDetails,
        };
      });

    // Sort by urgency (least days left first)
    employeesWithExpiringInsuranceDocs.sort((a, b) => {
      if (a.minDaysLeft === null) return 1;
      if (b.minDaysLeft === null) return -1;
      return a.minDaysLeft - b.minDaysLeft;
    });

    // Calculate summary statistics
    const summary = {
      urgent: employeesWithExpiringInsuranceDocs.filter(
        (emp) => emp.status === "Urgent"
      ).length,
      nearingExpiry: employeesWithExpiringInsuranceDocs.filter(
        (emp) => emp.status === "Nearing Expiry"
      ).length,
      healthCardExpiring: employeesWithExpiringInsuranceDocs.filter(
        (emp) => emp.hasHealthCardExpiring
      ).length,
      compensationExpiring: employeesWithExpiringInsuranceDocs.filter(
        (emp) => emp.hasCompensationExpiring
      ).length,
    };

    res.status(200).json({
      totalCount: employeesWithExpiringInsuranceDocs.length,
      employees: employeesWithExpiringInsuranceDocs,
      summary,
    });
  } catch (error) {
    console.error(
      "Error retrieving employees with expiring insurance documents:",
      error
    );
    res.status(500).json({
      message: "Error retrieving employees with expiring insurance documents",
      error: error.message,
    });
  }
};

const getAllEmployeesWithSalaryDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const { count: totalEmployees, rows: employees } =
      await Employee.findAndCountAll({
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: Payroll,
            as: "tbl_payroll",
            attributes: [
              "salaryAmount",
              "bonusAmount",
              "deductions",
              "paymentMethod",
              "paymentDate",
            ],
          },
        ],
      });

    res.status(200).json({
      totalEmployees,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEmployees / limit),
      employees,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving employees with salary details",
      error: error.message,
    });
  }
};

const manualSalaryCalculation = async (req, res) => {
  const { employeeId, salaryAmount, bonusAmount, deductions, paymentMethod } =
    req.body;

  try {
    const totalSalary = salaryAmount + bonusAmount;
    const netSalary = totalSalary - deductions;

    const payroll = await Payroll.create({
      salaryAmount,
      bonusAmount,
      deductions,
      paymentMethod,
      paymentDate: new Date(),
      employeeId,
    });

    res.status(200).json({
      message: "Manual salary calculated successfully",
      data: { totalSalary, deductions, netSalary },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approvePayroll = async (req, res) => {
  const { payrollId, isApproved } = req.body;

  try {
    const payroll = await Payroll.findByPk(payrollId);

    if (!payroll) {
      return res.status(404).json({ message: "Payroll not found" });
    }

    payroll.isApproved = isApproved;
    await payroll.save();

    res.status(200).json({
      message: `Payroll ${isApproved ? "approved" : "rejected"} successfully`,
      payroll,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const filterEmployees = async (req, res) => {
  try {
    const {
      gender = "All",
      contractType = "All",
      departmentName = "All",
      designation = "All",
      maritalStatus = "All",
      familyInQatar = "All",
      workExperience = "All",
      status = "All",
      workPlace = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (gender !== "All") {
      where["personalDetails.gender"] = gender;
    }

    if (contractType !== "All") {
      where["otherDetails.contractType"] = contractType;
    }

    if (departmentName !== "All") {
      where["otherDetails.departmentName"] = departmentName;
    }

    if (designation !== "All") {
      where["otherDetails.designation"] = designation;
    }

    if (maritalStatus !== "All") {
      where["personalDetails.maritalStatus"] = maritalStatus;
    }

    if (familyInQatar !== "All") {
      where["personalDetails.familyInQatar"] =
        familyInQatar === "true"
          ? true
          : familyInQatar === "false"
            ? false
            : undefined;
    }

    if (workExperience !== "All") {
      where["careerDetails.workExperience"] = workExperience;
    }

    if (status !== "All") {
      where["otherDetails.status"] = status;
    }

    if (workPlace !== "All") {
      where["otherDetails.workPlace"] = workPlace;
    }

    const { count: totalEmployees, rows: employees } =
      await Employee.findAndCountAll({
        where,
        offset,
        limit: parseInt(limit),
        include: [
          {
            model: FamilyDetailsModel,
            as: "familyDetails",
          },
          {
            model: WorkExperienceModel,
            as: "workExperience",
          },
          {
            model: PayrollDetailsModel,
            as: "payrollDetails",
          },
          {
            model: CertificationsModel,
            as: "certifications",
          },
          {
            model: AcademicQualificationsModel,
            as: "academicQualifications",
          },
          {
            model: EmployeeContractModel,
            as: "employeeContracts",
          },
        ],
      });

    res.status(200).json({
      totalEmployees,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEmployees / limit),
      employees,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error filtering employees", error: error.message });
  }
};

const exportFilteredEmployeesToCSV = async (req, res) => {
  try {
    const {
      gender = "All",
      contractType = "All",
      departmentName = "All",
      designation = "All",
      maritalStatus = "All",
      familyInQatar = "All",
      workExperience = "All",
      status = "All",
      workPlace = "All",
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * parseInt(limit);

    const where = {};

    if (gender !== "All") {
      where["personalDetails.gender"] = gender;
    }

    if (contractType !== "All") {
      where["otherDetails.contractType"] = contractType;
    }

    if (departmentName !== "All") {
      where["otherDetails.departmentName"] = departmentName;
    }

    if (designation !== "All") {
      where["otherDetails.designation"] = designation;
    }

    if (maritalStatus !== "All") {
      where["personalDetails.maritalStatus"] = maritalStatus;
    }

    if (familyInQatar !== "All") {
      where["personalDetails.familyInQatar"] =
        familyInQatar === "true"
          ? true
          : familyInQatar === "false"
            ? false
            : undefined;
    }

    if (workExperience !== "All") {
      where["careerDetails.workExperience"] = workExperience;
    }

    if (status !== "All") {
      where["otherDetails.status"] = status;
    }

    if (workPlace !== "All") {
      where["otherDetails.workPlace"] = workPlace;
    }

    const { rows: employees } = await Employee.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: FamilyDetailsModel,
          as: "familyDetails",
        },
        {
          model: WorkExperienceModel,
          as: "workExperience",
        },
        {
          model: PayrollDetailsModel,
          as: "payrollDetails",
        },
        {
          model: CertificationsModel,
          as: "certifications",
        },
        {
          model: AcademicQualificationsModel,
          as: "academicQualifications",
        },
        {
          model: EmployeeContractModel,
          as: "employeeContracts",
        },
      ],
    });

    console.log(employees);

    if (!employees || employees.length === 0) {
      return res.status(404).json({
        message: "No employees found matching the filters",
      });
    }

    const employeeIds = employees.map((e) => e.id);
    const familyDetails = await FamilyDetailsModel.findAll({
      where: { employeeId: employeeIds },
    });
    const workExperiences = await WorkExperienceModel.findAll({
      where: { employeeId: employeeIds },
    });
    const payrollDetails = await PayrollDetailsModel.findAll({
      where: { employeeId: employeeIds },
    });
    const certifications = await CertificationsModel.findAll({
      where: { employeeId: employeeIds },
    });
    const academicQualifications = await AcademicQualificationsModel.findAll({
      where: { employeeId: employeeIds },
    });
    const employeeContracts = await EmployeeContractModel.findAll({
      where: { employeeId: employeeIds },
    });

    const employeeContractsMap = {};
    employeeContracts.forEach((contrac) => {
      if (!employeeContractsMap[contrac.employeeId])
        employeeContractsMap[contrac.employeeId] = [];
      employeeContractsMap[contrac.employeeId].push({
        contractType: contrac.contractType,
        contractNumber: contrac.contractNumber,
        contractAttachment: contrac.contractAttachment,
        contractStartDate: contrac.contractStartDate,
        contractEndDate: contrac.contractEndDate,
        contractStatus: contrac.contractStatus,
      });
    });

    const familyMap = {};
    familyDetails.forEach((member) => {
      if (!familyMap[member.employeeId]) familyMap[member.employeeId] = [];
      familyMap[member.employeeId].push({
        name: member.name,
        emergencyContactNumber: member.emergencyContactNumber,
        emergencyName: member.emergencyName,
        emergencyRelationship: member.emergencyRelationship,
        numberOfFamilyMembers: member.numberOfFamilyMembers,
        familyInQatar: member.familyInQatar,
        relationship: member.relationship,
        dob: member.dob,
        passportNo: member.passportNo,
        passportExpiry: member.passportExpiry,
        qidNo: member.qidNo,
        qidExpiry: member.qidExpiry,
        location: member.location,
        airTicket: member.airTicket,
        insurance: member.insurance,
        schoolBenefit: member.schoolBenefit,
      });
    });

    const certificationsMap = {};
    certifications.forEach((certify) => {
      if (!certificationsMap[certify.employeeId])
        certificationsMap[certify.employeeId] = [];
      certificationsMap[certify.employeeId].push({
        certificationType: certify.certificationType,
        certificationName: certify.certificationName,
        otherYear: certify.otherYear,
        otherLocation: certify.otherLocation,
        certificationExpireDate: certify.certificationExpireDate,
        certificationBody: certify.certificationBody,
        documents: certify.documents,
      });
    });

    const academicMap = {};
    academicQualifications.forEach((qualify) => {
      if (!academicMap[qualify.employeeId])
        academicMap[qualify.employeeId] = [];
      academicMap[qualify.employeeId].push({
        qualification: qualify.qualification,
        qualificationType: qualify.qualificationType,
        year: qualify.year,
        location: qualify.location,
      });
    });

    const workExperienceMap = {};
    workExperiences.forEach((work) => {
      if (!workExperienceMap[work.employeeId])
        workExperienceMap[work.employeeId] = [];
      workExperienceMap[work.employeeId].push({
        companyName: work.companyName,
        companyLocation: work.companyLocation,
        industry: work.industry,
        designation: work.designation,
        startDate: work.startDate,
        endDate: work.endDate,
      });
    });

    const payrollMap = {};
    payrollDetails.forEach((payroll) => {
      if (!payrollMap[payroll.employeeId]) payrollMap[payroll.employeeId] = [];
      payrollMap[payroll.employeeId].push({
        basicSalary: payroll.basicSalary,
        accommodationAllowance: payroll.accommodationAllowance,
        foodAllowance: payroll.foodAllowance,
        transportationAllowance: payroll.transportationAllowance,
        nationalAccreditationBonus: payroll.nationalAccreditationBonus,
        natureOfWorkAllowance: payroll.natureOfWorkAllowance,
        socialBonus: payroll.socialBonus,
        relocationAllowance: payroll.relocationAllowance,
        otherBonuses: payroll.otherBonuses,
        overTimeApplicable: payroll.overTimeApplicable,
        otRate: payroll.otRate,
        startDate: payroll.startDate,
        endDate: payroll.endDate,
        fullPackageAllowance: payroll.fullPackageAllowance,
        fullPackageFoodAllowance: payroll.fullPackageFoodAllowance,
        fullPackageTransportationAllowance:
          payroll.fullPackageTransportationAllowance,
        totalSalary: payroll.totalSalary,
      });
    });

    const employeesData = employees.map((employee) => {
      const data = {
        employeeId: employee.id,
        employeeNo: employee.personalDetails.employeeNo,
        fullNameEnglish: employee.personalDetails.fullNameEnglish,
        fullNameArabic: employee.personalDetails.fullNameArabic,
        qidNumber: employee.personalDetails.qidNumber,
        passportNumber: employee.personalDetails.passportNumber,
        qidExpireDate: employee.personalDetails.qidExpireDate,
        passportExpireDate: employee.personalDetails.passportExpireDate,
        recruitementType: employee.personalDetails.recruitementType,
        visaNumber: employee.personalDetails.visaNumber,
        nationality: employee.personalDetails.nationality,
        mobileNumber: employee.personalDetails.mobileNumber,
        email: employee.personalDetails.email,
        gender: employee.personalDetails.gender,
        dateOfBirth: employee.personalDetails.dateOfBirth,
        currentAddress: employee.personalDetails.currentAddress,
        permanentAddress: employee.personalDetails.permanentAddress,
        maritalStatus: employee.personalDetails.maritalStatus,
        isAvailableLicense: employee.drivingLicenseDetails.isAvailableLicense,
        drivingLicenseCopy: employee.drivingLicenseDetails.drivingLicenseCopy,
        licenseNumber: employee.drivingLicenseDetails.licenseNumber,
        firstIssueDate: employee.drivingLicenseDetails.firstIssueDate,
        licenseExpireDate: employee.drivingLicenseDetails.licenseExpireDate,
        licenseCategory: employee.drivingLicenseDetails.licenseCategory,
        licenseNotes: employee.drivingLicenseDetails.licenseNotes,
        bankName: employee.bankDetails.bankName,
        accountHolderName: employee.bankDetails.accountHolderName,
        bankaccountNumberName: employee.bankDetails.accountNumber,
        branchName: employee.bankDetails.branchName,
        IBAN: employee.bankDetails.IBAN,
        swiftCode: employee.bankDetails.swiftCode,
        shortCode: employee.bankDetails.shortCode,
        sponserName: employee.sponserDetails.sponserName,
        employeeContractCopy: employee.sponserDetails.employeeContractCopy,
        computerCardCopy: employee.sponserDetails.computerCardCopy,
        computerCardExpireDate: employee.sponserDetails.computerCardExpireDate,
        NOC: employee.sponserDetails.NOC,
        companyCRCopy: employee.sponserDetails.companyCRCopy,
        image: employee.documentDetails.image,
        copyOfQID: employee.documentDetails.copyOfQID,
        copyOfPassport: employee.documentDetails.copyOfPassport,
        resume: employee.documentDetails.resume,
        qualificationCertificate:
          employee.documentDetails.qualificationCertificate,
        otherDocuments: employee.documentDetails.otherDocuments,
        healthCardNumber: employee.insuranceDetails.healthCardNumber,
        issuingAuthority: employee.insuranceDetails.issuingAuthority,
        expireDate: employee.insuranceDetails.expireDate,
        knownMedicalConditions:
          employee.insuranceDetails.knownMedicalConditions,
        allergies: employee.insuranceDetails.allergies,
        notesOrRemarks: employee.insuranceDetails.notesOrRemarks,
        policyNumber: employee.insuranceDetails.policyNumber,
        coverageDetails: employee.insuranceDetails.coverageDetails,
        compensationExpireDate:
          employee.insuranceDetails.compensationExpireDate,
        insuranceProvider: employee.insuranceDetails.insuranceProvider,
        additionalPolicyDetails:
          employee.insuranceDetails.additionalPolicyDetails,
        attachments: employee.insuranceDetails.attachments,
        operatorType: employee.fleetDetails.operatorType,
        equipmentDetails: employee.fleetDetails.equipmentDetails,
        month: employee.fleetDetails.month,
        gatePassNumber: employee.fleetDetails.gatePassNumber,
        gatePassLocation: employee.fleetDetails.gatePassLocation,
        gateAccessNo: employee.fleetDetails.gateAccessNo,
        appHashNumber: employee.fleetDetails.appHashNumber,
        gatePassIssueDate: employee.fleetDetails.gatePassIssueDate,
        gatePassExpireDate: employee.fleetDetails.gatePassExpireDate,
        gatePassAttachment: employee.fleetDetails.gatePassAttachment,
        gatePassExpireStatus: employee.fleetDetails.gatePassExpireStatus,
        fleetStatus: employee.fleetDetails.fleetStatus,
        trainingTitle: employee.trainingCertificationsDetails.trainingTitle,
        issueDate: employee.trainingCertificationsDetails.issueDate,
        expiryDate: employee.trainingCertificationsDetails.expiryDate,
        idIqamaNo: employee.trainingCertificationsDetails.idIqamaNo,
        companyName: employee.trainingCertificationsDetails.companyName,
        description: employee.trainingCertificationsDetails.description,
        certifiedAs: employee.trainingCertificationsDetails.certifiedAs,
        trainingCertificate: employee.trainingCertificationsDetails.trainingCertificate,
        designation: employee.otherDetails.designation,
        employeeType: employee.otherDetails.employeeType,
        status: employee.otherDetails.status,
        departmentName: employee.otherDetails.departmentName,
        dateOfJoin: employee.otherDetails.dateOfJoin,
        annualLeaveCount: employee.otherDetails.annualLeaveCount,
        destinationCountry: employee.otherDetails.destinationCountry,
        workPlace: employee.otherDetails.workPlace,
        familyDetails: JSON.stringify(familyMap[employee.id] || []),
        workExperience: JSON.stringify(workExperienceMap[employee.id] || []),
        payrollDetails: JSON.stringify(payrollMap[employee.id] || []),
        certifications: JSON.stringify(certificationsMap[employee.id] || []),
        academicQualifications: JSON.stringify(academicMap[employee.id] || []),
        employeeContracts: JSON.stringify(
          employeeContractsMap[employee.id] || []
        ),
      };
      return data;
    });

    const json2csvParser = new Parser();
    const csv = "\uFEFF" + json2csvParser.parse(employeesData);

    res.header("Content-Type", "text/csv; charset=utf-8");
    res.attachment("filtered_employees.csv");

    res.send(csv);
  } catch (error) {
    console.error("Error exporting employees to CSV:", error);
    res.status(500).json({
      message: "Error exporting employees to CSV",
      error: error.message,
    });
  }
};

const exportFilteredEmployeesToPDF = async (req, res) => {
  try {
    const {
      gender = "All",
      contractType = "All",
      departmentName = "All",
      designation = "All",
      maritalStatus = "All",
      familyInQatar = "All",
      workExperience = "All",
      status = "All",
      workPlace = "All",
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * parseInt(limit);
    const where = {};

    if (gender !== "All") where["personalDetails.gender"] = gender;
    if (contractType !== "All")
      where["otherDetails.contractType"] = contractType;
    if (departmentName !== "All")
      where["otherDetails.departmentName"] = departmentName;
    if (designation !== "All") where["otherDetails.designation"] = designation;
    if (maritalStatus !== "All")
      where["personalDetails.maritalStatus"] = maritalStatus;
    if (familyInQatar !== "All")
      where["personalDetails.familyInQatar"] = familyInQatar === "true";
    if (workExperience !== "All")
      where["careerDetails.workExperience"] = workExperience;
    if (status !== "All") {
      where["otherDetails.status"] = status;
    }
    if (workPlace !== "All") where["otherDetails.workPlace"] = workPlace;

    const { rows: employees } = await Employee.findAndCountAll({
      where,
      offset,
      limit: parseInt(limit),
      include: [
        {
          model: FamilyDetailsModel,
          as: "familyDetails",
        },
        {
          model: WorkExperienceModel,
          as: "workExperience",
        },
        {
          model: PayrollDetailsModel,
          as: "payrollDetails",
        },
        {
          model: CertificationsModel,
          as: "certifications",
        },
        {
          model: AcademicQualificationsModel,
          as: "academicQualifications",
        },
        {
          model: EmployeeContractModel,
          as: "employeeContracts",
        },
      ],
    });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json({ message: "No employees found matching the filters" });
    }

    const employeesData = employees.map((employee) => [
      employee.id || "N/A",
      employee.personalDetails?.fullNameEnglish || "N/A",
      {
        text: employee.personalDetails?.fullNameArabic || "N/A",
        font: "Amiri",
        alignment: "right",
      },
      employee.personalDetails?.qidNumber || "N/A",
      employee.personalDetails?.passportNumber || "N/A",
      employee.personalDetails?.nationality || "N/A",
      employee.personalDetails?.mobileNumber || "N/A",
    ]);

    const docDefinition = {
      content: [
        { text: "Employee Data", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: [100, "*", "*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Employee ID",
                "Full Name English",
                "Full Name Arabic",
                "QID Number",
                "Passport Number",
                "Nationality",
                "Mobile Number",
              ],
              ...employeesData,
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        body: {
          fontSize: 8,
          bold: true,
        },
      },
      defaultStyle: {
        fontSize: 8,
      },
    };

    const printer = new PdfPrinter({
      Roboto: {
        normal: path.join(sourceDir, "Roboto-Regular.ttf"),
        bold: path.join(sourceDir, "Roboto-Medium.ttf"),
        italics: path.join(sourceDir, "Roboto-Italic.ttf"),
        bolditalics: path.join(sourceDir, "Roboto-MediumItalic.ttf"),
      },
      Amiri: {
        normal: path.join(sourceDir, "Amiri-Regular.ttf"),
        bold: path.join(sourceDir, "Amiri-Bold.ttf"),
      },
    });

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    res.header("Content-Type", "application/pdf");
    res.attachment("employee_data.pdf");
    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error("Error exporting employees to PDF:", error);
    res.status(500).json({
      message: "Error exporting employees to PDF",
      error: error.message,
    });
  }
};

module.exports = {
  upload,
  uploadDrivingLicense,
  uploadSponsor,
  uploadCertification,
  uploadDocument,
  uploadInsurance,
  uploadContract,
  uploadGatePass,
  uploadTrainingCertificate,
  createEmployee,
  updatePersonelDetails,
  updateFamilyDetails,
  updateFamilyCompletionStatus,
  createFamilyDetails,
  updateEmergencyContactInfo,
  updateDrivingLicenseDetails,
  updatePayrollDetails,
  updatePayrollCompletionStatus,
  addPayroll,
  updateBankDetails,
  updateSponsorDetails,
  updateAcademicQualificationsDetails,
  updateCertificationsDetails,
  updateWorkExperienceDetails,
  createAcademicQualifications,
  updateCareerCompletionStatus,
  createCertifications,
  createWorkExperience,
  updateDocumentDetails,
  updateInsuranceDetails,
  updateContractDetails,
  updateContractCompletionStatus,
  createContractDetails,
  updateFleetDetails,
  updateTrainingCertificationDetails,
  updateOtherDetails,
  serveEmployeeFile,
  deleteEmployee,
  getEmployeeById,
  getAllEmployees,
  getEmployeesWithExpiringDocuments,
  getEmployeesWithExpiringInsuranceDocuments,
  getAllEmployeesWithSalaryDetails,
  manualSalaryCalculation,
  approvePayroll,
  filterEmployees,
  exportFilteredEmployeesToCSV,
  exportFilteredEmployeesToPDF,
};
