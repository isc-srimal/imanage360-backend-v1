const express = require("express");
const {
  upload,
  createEmployee,
  updatePersonelDetails,
  updateFamilyDetails,
  updateFamilyCompletionStatus,
  updatePayrollCompletionStatus,
  updateCareerCompletionStatus,
  updateContractCompletionStatus,
  createFamilyDetails,
  updateEmergencyContactInfo,
  updateDrivingLicenseDetails,
  updatePayrollDetails,
  addPayroll,
  updateBankDetails,
  updateSponsorDetails,
  updateAcademicQualificationsDetails,
  updateCertificationsDetails,
  updateWorkExperienceDetails,
  updateDocumentDetails,
  updateInsuranceDetails,
  updateContractDetails,
  createContractDetails,
  updateFleetDetails,
  updateTrainingCertificationDetails,
  updateOtherDetails,
  createAcademicQualifications,
  createCertifications,
  createWorkExperience,
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
} = require("../controllers/employeeController");
const { verifyToken } = require("../../../../api-gateway/src/middleware/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * /api/manageEmployee/files/{folder}/{filename}:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Serve an employee file
 *     parameters:
 *       - in: path
 *         name: folder
 *         required: true
 *         schema:
 *           type: string
 *           enum: [sponsorDetailsDocuments, drivingLicenseDocuments, careerDetailsDocuments, otherDocuments, insuranceDocuments, contractAttachmentDocuments, employeeGatePasses, trainingCertifications]
 *         description: Folder containing the file
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to serve
 *     responses:
 *       200:
 *         description: File served successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/msword:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.wordprocessingml.document:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *           application/vnd.ms-excel:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid folder
 *       403:
 *         description: Access denied
 *       404:
 *         description: File not found
 */
router.get("/files/:folder/:filename", verifyToken, serveEmployeeFile);

/**
 * @swagger
 * /api/manageEmployee/updateFleetDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update fleet details of an existing employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing fleet details
 *                 example: '{"fleetDetails":{"operatorType":"Heavy Equipment","equipmentDetails":"Excavator CAT 320","month":"January 2025","gatePassNumber":"GP-2024-001","gatePassIssueDate":"2024-01-01","gatePassExpireDate":"2024-12-31","gatePassExpireStatus":"Valid","fleetStatus":"Active"}}'
 *               gatePassAttachment:
 *                 type: string
 *                 format: binary
 *                 description: Gate pass document file (optional)
 *     responses:
 *       200:
 *         description: Employee fleet details updated successfully
 *       400:
 *         description: File upload error or missing data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error updating fleet details
 */
router.put("/updateFleetDetails/:id", verifyToken, updateFleetDetails);

/**
 * @swagger
 * /api/manageEmployee/updateTrainingCertificationDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update training certification details of an existing employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing training certification details
 *               trainingCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Training Cerificate document file 
 *     responses:
 *       200:
 *         description: Employee training certification details updated successfully
 *       400:
 *         description: File upload error or missing data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error updating training certification details
 */
router.put("/updateTrainingCertificationDetails/:id", verifyToken, updateTrainingCertificationDetails);

/**
 * @swagger
 * /api/manageEmployee/createEmployee:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Register a new employee
 *     description: This endpoint allows to register a new employee in the ERP system.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               personalDetails:
 *                 type: object
 *                 required:  # ⭐ Required fields for personalDetails
 *                   - fullNameEnglish
 *                   - qidNumber
 *                   - passportNumber
 *                   - mobileNumber
 *                   - email
 *                   - dateOfBirth
 *                   - maritalStatus
 *                   - currentAddress
 *                   - permanentAddress
 *                 properties:
 *                   profileImage: { type: string, example: "profile.jpg" }
 *                   employeeNo: { type: string, example: "AX-0001" }
 *                   fullNameEnglish: { type: string, example: "John Doe" }
 *                   fullNameArabic: { type: string, example: "جون دو" }
 *                   qidNumber: { type: string }
 *                   passportNumber: { type: string }
 *                   qidExpireDate: { type: string, format: date }
 *                   passportExpireDate: { type: string, format: date }
 *                   recruitementType: { type: string }
 *                   visaNumber: { type: string }
 *                   nationality: { type: string }
 *                   mobileNumber: { type: string }
 *                   email: { type: string, format: email }
 *                   gender: { type: string }
 *                   dateOfBirth: { type: string, format: date }
 *                   currentAddress: { type: string }
 *                   permanentAddress: { type: string }
 *                   maritalStatus: { type: string }
 *               drivingLicenseDetails:
 *                 type: object
 *                 properties:
 *                   isAvailableLicense: { type: boolean }
 *                   licenseNumber: { type: string }
 *                   firstIssueDate: { type: string, format: date }
 *                   licenseExpireDate: { type: string, format: date }
 *                   licenseCategory:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: ['Excavator', 'Crane', 'Loader', 'Forklift', 'Other']
 *                   licenseNotes:
 *                     type: array
 *                     items:
 *                       type: string
 *                       enum: ['Glasses', 'Lenses', 'Automatic', 'Handicaps', 'Hearing Disability', 'Organ Donation']
 *                     minItems: 1
 *               bankDetails:
 *                 type: object
 *                 properties:
 *                   bankName: { type: string }
 *                   accountHolderName: { type: string }
 *                   accountNumber: { type: string }
 *                   branchName: { type: string }
 *                   IBAN: { type: string }
 *                   swiftCode: { type: string }
 *                   shortCode: { type: string }
 *               sponserDetails:
 *                 type: object
 *                 properties:
 *                   sponserName: { type: string }
 *                   contractExpireDate: { type: string, format: date }
 *                   companyCRCopyExpireDate: { type: string, format: date }
 *                   computerCardExpireDate: { type: string, format: date }
 *               insuranceDetails:
 *                 type: object
 *                 properties:
 *                   healthCardNumber: { type: string }
 *                   issuingAuthority: { type: string }
 *                   expireDate: { type: string }
 *                   knownMedicalConditions: { type: string }
 *                   allergies: { type: string }
 *                   notesOrRemarks: { type: string }
 *                   policyNumber: { type: string }
 *                   coverageDetails: { type: string }
 *                   compensationExpireDate: { type: string }
 *                   insuranceProvider: { type: string }
 *                   additionalPolicyDetails: { type: string }
 *               fleetDetails:
 *                 type: object
 *                 properties:
 *                   operatorType: { type: string }
 *                   equipmentDetails: { type: string }
 *                   month: { type: string }
 *                   gatePassNumber: { type: string }
 *                   gatePassIssueDate: { type: string, format: date }
 *                   gatePassExpireDate: { type: string, format: date }
 *                   gatePassExpireStatus: { type: string }
 *                   fleetStatus: { type: string }
 *               trainingCertificationsDetails:
 *                 type: object
 *                 properties:
 *                   trainingTitle: { type: string }
 *                   issueDate: { type: string, format: date }
 *                   expiryDate: { type: string, format: date }
 *                   idIqamaNo: { type: string }
 *                   companyName: { type: string }
 *                   description: { type: string }
 *                   certifiedAs: { type: string }
 *               otherDetails:
 *                 type: object
 *                 properties:
 *                   dateOfJoin: { type: string, format: date }
 *                   designation: { type: string }
 *                   employeeType: { type: string }
 *                   status: { type: string }
 *                   workPlace: { type: string }
 *                   departmentName: { type: string }
 *                   annualLeaveCount: { type: number }
 *                   destinationCountry: { type: string }
 *               familyDetailsId:
 *                 type: integer
 *               workExperienceId:
 *                 type: integer
 *               departmentId:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *               resume:
 *                 type: string
 *                 format: binary
 *               employeeContractCopy:
 *                 type: string
 *                 format: binary
 *               drivingLicenseCopy:
 *                 type: string
 *                 format: binary
 *               copyOfQID:
 *                 type: string
 *                 format: binary
 *               copyOfPassport:
 *                 type: string
 *                 format: binary
 *               qualificationCertificate:
 *                 type: string
 *                 format: binary
 *               otherDocuments:
 *                 type: string
 *                 format: binary
 *               documents:
 *                 type: string
 *                 format: binary
 *               NOC:
 *                 type: string
 *                 format: binary
 *               companyCRCopy:
 *                 type: string
 *                 format: binary
 *               computerCardCopy:
 *                 type: string
 *                 format: binary
 *               attachments:
 *                 type: string
 *                 format: binary
 *               gatePassAttachment:
 *                 type: string
 *                 format: binary
 *               trainingCertificate:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Employee registered successfully
 *       400:
 *         description: Bad Request (File upload error or invalid data)
 *       403:
 *         description: You must be an admin to register a new employee
 *       500:
 *         description: Internal Server Error
 */
router.post("/createEmployee", verifyToken, createEmployee);

/**
 * @swagger
 * /api/manageEmployee/updatePersonelDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update personal details of an existing employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   personalDetails:
 *                     type: object
 *                     properties:
 *                       profileImage:
 *                         type: string
 *                       employeeNo:
 *                         type: string
 *                       fullNameEnglish:
 *                         type: string
 *                       fullNameArabic:
 *                         type: string
 *                       qidNumber:
 *                         type: integer
 *                       passportNumber:
 *                         type: string
 *                       qidExpireDate:
 *                         type: string
 *                         format: date
 *                         description: Must be a future date
 *                       passportExpireDate:
 *                         type: string
 *                         format: date
 *                         description: Must be a future date
 *                       recruitementType:
 *                         type: string
 *                       visaNumber:
 *                         type: string
 *                       nationality:
 *                         type: string
 *                       mobileNumber:
 *                         type: integer
 *                       email:
 *                         type: string
 *                         format: email
 *                       gender:
 *                         type: string
 *                       dateOfBirth:
 *                         type: string
 *                         format: date
 *                       currentAddress:
 *                         type: string
 *                       permanentAddress:
 *                         type: string
 *                       maritalStatus:
 *                         type: string
 *     responses:
 *       200:
 *         description: Employee personal details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 employee:
 *                   type: object
 *       400:
 *         description: Missing or invalid data format
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error updating personal details of employee
 */
router.put("/updatePersonelDetails/:id", verifyToken, updatePersonelDetails);

/**
 * @swagger
 * /api/manageEmployee/updateFamilyDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update a specific family member details record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the family details record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   familyDetails:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Family member name
 *                       emergencyContactNumber:
 *                         type: string
 *                         description: Emergency contact phone number
 *                       emergencyName:
 *                         type: string
 *                         description: Name of emergency contact person
 *                       emergencyRelationship:
 *                         type: string
 *                         description: Relationship with emergency contact
 *                       numberOfFamilyMembers:
 *                         type: integer
 *                         description: Total number of family members
 *                       familyInQatar:
 *                         type: boolean
 *                         description: Whether family is in Qatar
 *                       relationship:
 *                         type: string
 *                         description: Relationship to employee
 *                       dob:
 *                         type: string
 *                         format: date
 *                         description: Date of birth
 *                       passportNo:
 *                         type: string
 *                         description: Passport number
 *                       passportExpiry:
 *                         type: string
 *                         format: date
 *                         description: Passport expiry date
 *                       qidNo:
 *                         type: integer
 *                         description: QID number
 *                       qidExpiry:
 *                         type: string
 *                         format: date
 *                         description: QID expiry date
 *                       location:
 *                         type: string
 *                         description: Current location
 *                       airTicket:
 *                         type: string
 *                         enum: [Yes, No]
 *                         description: Air ticket benefit
 *                       insurance:
 *                         type: string
 *                         enum: [Yes, No]
 *                         description: Insurance benefit
 *                       schoolBenefit:
 *                         type: string
 *                         enum: [Yes, No]
 *                         description: School benefit eligibility
 *     responses:
 *       200:
 *         description: Family details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 familyDetails:
 *                   type: object
 *       400:
 *         description: Missing or invalid data format
 *       404:
 *         description: Family details record not found
 *       500:
 *         description: Error updating family details
 */
router.put("/updateFamilyDetails/:id", verifyToken, updateFamilyDetails);


/**
 * @swagger
 * /api/manageEmployee/updateFamilyCompletionStatus/{employeeId}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update family details completion status only
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   completionStatus:
 *                     type: string
 *                     enum: [Yes, No, Not Available Now]
 *     responses:
 *       200:
 *         description: Completion status updated successfully
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error updating completion status
 */
router.put("/updateFamilyCompletionStatus/:employeeId", verifyToken, updateFamilyCompletionStatus);


/**
 * @swagger
 * /api/manageEmployee/updatePayrollCompletionStatus/{employeeId}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update payroll details completion status only
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   completionStatus:
 *                     type: string
 *                     enum: [Yes, No, Not Available Now]
 *     responses:
 *       200:
 *         description: Completion status updated successfully
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error updating completion status
 */
router.put("/updatePayrollCompletionStatus/:employeeId", verifyToken, updatePayrollCompletionStatus);

/**
 * @swagger
 * /api/manageEmployee/updateCareerCompletionStatus/{employeeId}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update career details completion status only
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   completionStatus:
 *                     type: string
 *                     enum: [Yes, No, Not Available Now]
 *     responses:
 *       200:
 *         description: Completion status updated successfully
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error updating completion status
 */
router.put("/updateCareerCompletionStatus/:employeeId", verifyToken, updateCareerCompletionStatus);

/**
 * @swagger
 * /api/manageEmployee/updateContractCompletionStatus/{employeeId}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update contract details completion status only
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   completionStatus:
 *                     type: string
 *                     enum: [Yes, No, Not Available Now]
 *     responses:
 *       200:
 *         description: Completion status updated successfully
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error updating completion status
 */
router.put("/updateContractCompletionStatus/:employeeId", verifyToken, updateContractCompletionStatus);


/**
 * @swagger
 * /api/manageEmployee/createFamilyDetails:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Create a new family member record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   employeeId:
 *                     type: integer
 *                     description: ID of the employee
 *                   familyDetails:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       emergencyContactNumber:
 *                         type: string
 *                       emergencyName:
 *                         type: string
 *                       emergencyRelationship:
 *                         type: string
 *                       numberOfFamilyMembers:
 *                         type: integer
 *                       familyInQatar:
 *                         type: string
 *                         enum: [Yes, No]
 *                       relationship:
 *                         type: string
 *                       dob:
 *                         type: string
 *                         format: date
 *                       passportNo:
 *                         type: string
 *                       passportExpiry:
 *                         type: string
 *                         format: date
 *                       qidNo:
 *                         type: integer
 *                       qidExpiry:
 *                         type: string
 *                         format: date
 *                       location:
 *                         type: string
 *                       airTicket:
 *                         type: string
 *                         enum: [Yes, No]
 *                       insurance:
 *                         type: string
 *                         enum: [Yes, No]
 *                       schoolBenefit:
 *                         type: string
 *                         enum: [Yes, No]
 *     responses:
 *       201:
 *         description: Family member created successfully
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error creating family member
 */
router.post("/createFamilyDetails", verifyToken, createFamilyDetails);

/**
 * @swagger
 * /api/manageEmployee/updateEmergencyContactInfo/{employeeId}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update emergency contact information for all family members of an employee
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   emergencyContactInfo:
 *                     type: object
 *                     properties:
 *                       emergencyContactNumber:
 *                         type: string
 *                         description: Emergency contact phone number
 *                       emergencyName:
 *                         type: string
 *                         description: Name of emergency contact person
 *                       emergencyRelationship:
 *                         type: string
 *                         description: Relationship with emergency contact
 *                       numberOfFamilyMembers:
 *                         type: string
 *                         description: Total number of family members
 *                       familyInQatar:
 *                         type: string
 *                         enum: [Yes, No]
 *                         description: Whether family is in Qatar
 *     responses:
 *       200:
 *         description: Emergency contact information updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 familyMembers:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing or invalid data format
 *       404:
 *         description: Employee or family members not found
 *       500:
 *         description: Error updating emergency contact information
 */
router.put("/updateEmergencyContactInfo/:employeeId", verifyToken, updateEmergencyContactInfo);

/**
 * @swagger
 * /api/manageEmployee/updateDrivingLicenseDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update driving license details of an existing employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing driving license details
 *                 example: '{"drivingLicenseDetails":{"isAvailableLicense":true,"licenseNumber":"DL123456","firstIssueDate":"2020-01-15","licenseExpireDate":"2025-01-15","licenseCategory":["Light Vehicle","Heavy Vehicle"],"licenseNotes":["Note 1","Note 2"]}}'
 *               drivingLicenseCopy:
 *                 type: string
 *                 format: binary
 *                 description: Driving license document file (optional)
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       200:
 *         description: Employee driving license details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee driving license details updated successfully
 *                 employee:
 *                   type: object
 *                   properties:
 *                     drivingLicenseDetails:
 *                       type: object
 *                       properties:
 *                         isAvailableLicense:
 *                           type: boolean
 *                         drivingLicenseCopy:
 *                           type: string
 *                         licenseNumber:
 *                           type: string
 *                         firstIssueDate:
 *                           type: string
 *                           format: date
 *                         licenseExpireDate:
 *                           type: string
 *                           format: date
 *                         licenseCategory:
 *                           type: array
 *                           items:
 *                             type: string
 *                         licenseNotes:
 *                           type: array
 *                           items:
 *                             type: string
 *       400:
 *         description: File upload error or missing/invalid data format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *       500:
 *         description: Error updating driving license details of employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put("/updateDrivingLicenseDetails/:id", verifyToken, updateDrivingLicenseDetails);

/**
 * @swagger
 * /api/manageEmployee/updatePayrollDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update a specific payroll details record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the payroll details record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   payrollDetails:
 *                     type: object
 *                     properties:
 *                       basicSalary:
 *                         type: integer
 *                         description: Basic salary amount
 *                       accommodationAllowance:
 *                         type: string
 *                         description: Accommodation allowance type
 *                       foodAllowance:
 *                         type: string
 *                         description: Food allowance type
 *                       transportationAllowance:
 *                         type: string
 *                         description: Transportation allowance type
 *                       nationalAccreditationBonus:
 *                         type: integer
 *                         description: National accreditation bonus amount
 *                       natureOfWorkAllowance:
 *                         type: integer
 *                         description: Nature of work allowance amount
 *                       socialBonus:
 *                         type: integer
 *                         description: Social bonus amount
 *                       relocationAllowance:
 *                         type: integer
 *                         description: Relocation allowance amount
 *                       otherBonuses:
 *                         type: integer
 *                         description: Other bonuses amount
 *                       overTimeApplicable:
 *                         type: boolean
 *                         description: Whether overtime is applicable
 *                       otRate:
 *                         type: integer
 *                         description: Overtime rate
 *                       startDate:
 *                         type: string
 *                         format: date
 *                         description: Payroll start date
 *                       endDate:
 *                         type: string
 *                         format: date
 *                         description: Payroll end date (optional)
 *                       fullPackageAllowance:
 *                         type: integer
 *                         description: Full package accommodation allowance
 *                       fullPackageFoodAllowance:
 *                         type: integer
 *                         description: Full package food allowance
 *                       fullPackageTransportationAllowance:
 *                         type: integer
 *                         description: Full package transportation allowance
 *                       totalSalary:
 *                         type: integer
 *                         description: Total salary amount
 *                       status:
 *                         type: string
 *                         enum: [Active, Inactive]
 *                         description: Payroll status
 *     responses:
 *       200:
 *         description: Payroll details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payrollDetails:
 *                   type: object
 *       400:
 *         description: Missing or invalid data format
 *       404:
 *         description: Payroll details record not found
 *       500:
 *         description: Error updating payroll details
 */
router.put("/updatePayrollDetails/:id", verifyToken, updatePayrollDetails);

/**
 * @swagger
 * /api/manageEmployee/addPayroll:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Create a new payroll record for an employee
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *                 description: ID of the employee
 *               payrollDetails:
 *                 type: object
 *                 properties:
 *                   basicSalary:
 *                     type: integer
 *                     description: Basic salary amount
 *                   accommodationAllowance:
 *                     type: string
 *                     description: Accommodation allowance type
 *                   foodAllowance:
 *                     type: string
 *                     description: Food allowance type
 *                   transportationAllowance:
 *                     type: string
 *                     description: Transportation allowance type
 *                   nationalAccreditationBonus:
 *                     type: integer
 *                     description: National accreditation bonus amount
 *                   natureOfWorkAllowance:
 *                     type: integer
 *                     description: Nature of work allowance amount
 *                   socialBonus:
 *                     type: integer
 *                     description: Social bonus amount
 *                   relocationAllowance:
 *                     type: integer
 *                     description: Relocation allowance amount
 *                   otherBonuses:
 *                     type: integer
 *                     description: Other bonuses amount
 *                   overTimeApplicable:
 *                     type: boolean
 *                     description: Whether overtime is applicable
 *                   otRate:
 *                     type: integer
 *                     description: Overtime rate
 *                   startDate:
 *                     type: string
 *                     description: Payroll start date
 *                   endDate:
 *                     type: string
 *                     format: date
 *                     description: Payroll end date (optional)
 *                   fullPackageAllowance:
 *                     type: integer
 *                     description: Full package accommodation allowance
 *                   fullPackageFoodAllowance:
 *                     type: integer
 *                     description: Full package food allowance
 *                   fullPackageTransportationAllowance:
 *                     type: integer
 *                     description: Full package transportation allowance
 *                   totalSalary:
 *                     type: integer
 *                     description: Total salary amount
 *                   status:
 *                     type: string
 *                     enum: [Active, Inactive]
 *                     description: Payroll status
 *     responses:
 *       201:
 *         description: Payroll record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payrollId:
 *                   type: integer
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error creating payroll record
 */
router.post("/addPayroll", verifyToken, addPayroll);

/**
 * @swagger
 * /api/manageEmployee/updateBankDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update bank details of an existing employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   bankDetails:
 *                     type: object
 *                     properties:
 *                       bankName:
 *                         type: string
 *                         description: Name of the bank
 *                       accountHolderName:
 *                         type: string
 *                         description: Name of the account holder
 *                       accountNumber:
 *                         type: integer
 *                         description: Bank account number
 *                       branchName:
 *                         type: string
 *                         description: Branch name of the bank
 *                       IBAN:
 *                         type: string
 *                         description: International Bank Account Number
 *                       swiftCode:
 *                         type: integer
 *                         description: SWIFT/BIC code
 *                       shortCode:
 *                         type: integer
 *                         description: Bank short code
 *     responses:
 *       200:
 *         description: Employee bank details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee bank details updated successfully
 *                 employee:
 *                   type: object
 *       400:
 *         description: Missing or invalid data format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *       500:
 *         description: Error updating bank details of employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put("/updateBankDetails/:id", verifyToken, updateBankDetails);

/**
 * @swagger
 * /api/manageEmployee/updateSponsorDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update sponsor details of an existing employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing sponsor details
 *                 example: '{"sponserDetails":{"sponserName":"ABC Company","contractExpireDate":"2025-12-31","companyCRCopyExpireDate":"2026-06-30","computerCardExpireDate":"2025-08-15"}}'
 *               employeeContractCopy:
 *                 type: string
 *                 format: binary
 *                 description: Employee contract document file (optional)
 *               companyCRCopy:
 *                 type: string
 *                 format: binary
 *                 description: Company CR copy document file (optional)
 *               computerCardCopy:
 *                 type: string
 *                 format: binary
 *                 description: Computer card copy document file (optional)
 *               NOC:
 *                 type: string
 *                 format: binary
 *                 description: NOC (No Objection Certificate) document file (optional)
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       200:
 *         description: Employee sponsor details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee sponsor details updated successfully
 *                 employee:
 *                   type: object
 *                   properties:
 *                     sponserDetails:
 *                       type: object
 *                       properties:
 *                         sponserName:
 *                           type: string
 *                         employeeContractCopy:
 *                           type: string
 *                         contractExpireDate:
 *                           type: string
 *                           format: date
 *                         companyCRCopyExpireDate:
 *                           type: string
 *                           format: date
 *                         computerCardCopy:
 *                           type: string
 *                         computerCardExpireDate:
 *                           type: string
 *                           format: date
 *                         NOC:
 *                           type: string
 *                         companyCRCopy:
 *                           type: string
 *       400:
 *         description: File upload error or missing employee form data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *       500:
 *         description: Error updating sponsor details of employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put("/updateSponsorDetails/:id", verifyToken, updateSponsorDetails);

/**
 * @swagger
 * /api/manageEmployee/updateAcademicQualifications/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update a specific academic qualification record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the academic qualification record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   academicQualifications:
 *                     type: object
 *                     properties:
 *                       qualification:
 *                         type: string
 *                         description: Qualification name or degree
 *                       qualificationType:
 *                         type: string
 *                         description: Type of qualification (e.g., Bachelor, Master, PhD)
 *                       year:
 *                         type: string
 *                         description: Year of completion
 *                       location:
 *                         type: string
 *                         description: Institution location or name
 *     responses:
 *       200:
 *         description: Academic qualifications updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 academicQualifications:
 *                   type: object
 *       400:
 *         description: Missing or invalid data format
 *       404:
 *         description: Academic qualifications record not found
 *       500:
 *         description: Error updating academic qualifications
 */
router.put("/updateAcademicQualifications/:id", verifyToken, updateAcademicQualificationsDetails);

/**
 * @swagger
 * /api/manageEmployee/updateCertifications/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update a specific certification record with a single document
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the certification record to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing certification details
 *                 example: '{"certifications":{"certificationType":"Professional","certificationName":"PMP","otherYear":"2023","otherLocation":"USA","certificationExpireDate":"2026-12-31","certificationBody":"PMI"}}'
 *               documents:
 *                 type: string
 *                 format: binary
 *                 description: Single certification document file (optional, max 50MB)
 *     responses:
 *       200:
 *         description: Certification details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Certification details updated successfully
 *                 certifications:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     certificationType:
 *                       type: string
 *                     certificationName:
 *                       type: string
 *                     otherYear:
 *                       type: string
 *                     otherLocation:
 *                       type: string
 *                     certificationExpireDate:
 *                       type: string
 *                     certificationBody:
 *                       type: string
 *                     documents:
 *                       type: string
 *                       description: Path to the document file
 *                     employeeId:
 *                       type: integer
 *                 documentUploaded:
 *                   type: boolean
 *                   description: Indicates whether a new document was uploaded
 *       400:
 *         description: File upload error or missing/invalid data format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       404:
 *         description: Certification record not found or associated employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Certification record not found
 *       500:
 *         description: Error updating certification details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put("/updateCertifications/:id", verifyToken, updateCertificationsDetails);

/**
* @swagger
* /api/manageEmployee/updateWorkExperience/{id}:
*   put:
*     tags:
*       - Manage Employee
*     summary: Update a specific work experience record
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID of the work experience record to update
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   workExperience:
*                     type: object
*                     properties:
*                       companyName:
*                         type: string
*                         description: Name of the company
*                       companyLocation:
*                         type: string
*                         description: Location of the company
*                       industry:
*                         type: string
*                         description: Industry or sector of the company
*                       designation:
*                         type: string
*                         description: Job title or position held
*                       startDate:
*                         type: string
*                         format: date
*                         description: Start date of employment (YYYY-MM-DD)
*                       endDate:
*                         type: string
*                         format: date
*                         description: End date of employment (YYYY-MM-DD), null if currently employed
*     responses:
*       200:
*         description: Work experience details updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 workExperience:
*                   type: object
*       400:
*         description: Missing or invalid data format
*       404:
*         description: Work experience record not found or associated employee not found
*       500:
*         description: Error updating work experience details
*/
router.put("/updateWorkExperience/:id", verifyToken, updateWorkExperienceDetails);

/**
 * @swagger
 * /api/manageEmployee/updateDocumentDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update document details of an existing employee
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the employee to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing document details
 *                 example: '{"documentDetails":{"image":"","copyOfQID":"","copyOfPassport":"","resume":"","qualificationCertificate":"","otherDocuments":""}}'
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Employee image file (optional)
 *               copyOfQID:
 *                 type: string
 *                 format: binary
 *                 description: QID copy document file (optional)
 *               copyOfPassport:
 *                 type: string
 *                 format: binary
 *                 description: Passport copy document file (optional)
 *               resume:
 *                 type: string
 *                 format: binary
 *                 description: Resume document file (optional)
 *               qualificationCertificate:
 *                 type: string
 *                 format: binary
 *                 description: Qualification certificate document file (optional)
 *               otherDocuments:
 *                 type: string
 *                 format: binary
 *                 description: Other documents file (optional)
 *           encoding:
 *             data:
 *               contentType: application/json
 *     responses:
 *       200:
 *         description: Employee document details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee document details updated successfully
 *                 employee:
 *                   type: object
 *                   properties:
 *                     documentDetails:
 *                       type: object
 *                       properties:
 *                         image:
 *                           type: string
 *                         copyOfQID:
 *                           type: string
 *                         copyOfPassport:
 *                           type: string
 *                         resume:
 *                           type: string
 *                         qualificationCertificate:
 *                           type: string
 *                         otherDocuments:
 *                           type: string
 *       400:
 *         description: File upload error or missing employee form data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *       500:
 *         description: Error updating document details of employee
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: string
 */
router.put("/updateDocumentDetails/:id", verifyToken, updateDocumentDetails);

/**
* @swagger
* /api/manageEmployee/updateInsuranceDetails/{id}:
*   put:
*     tags:
*       - Manage Employee
*     summary: Update insurance details of an existing employee
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID of the employee to update
*     requestBody:
*       required: true
*       content:
*         multipart/form-data:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: string
*                 description: JSON string containing insurance details
*                 example: '{"insuranceDetails":{"healthCardNumber":"HC123456","issuingAuthority":"Ministry of Health","expireDate":"2025-12-31","knownMedicalConditions":"None","allergies":"None","notesOrRemarks":"Regular checkup required","policyNumber":"POL123456","coverageDetails":"Full coverage","compensationExpireDate":"2026-01-01","insuranceProvider":"XYZ Insurance","additionalPolicyDetails":"Premium plan"}}'
*               attachments:
*                 type: string
*                 format: binary
*                 description: Insurance document file (optional)
*           encoding:
*             data:
*               contentType: application/json
*     responses:
*       200:
*         description: Employee insurance details updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Employee insurance details updated successfully
*                 employee:
*                   type: object
*                   properties:
*                     insuranceDetails:
*                       type: object
*                       properties:
*                         healthCardNumber:
*                           type: string
*                         issuingAuthority:
*                           type: string
*                         expireDate:
*                           type: string
*                           format: date
*                         knownMedicalConditions:
*                           type: string
*                         allergies:
*                           type: string
*                         notesOrRemarks:
*                           type: string
*                         policyNumber:
*                           type: string
*                         coverageDetails:
*                           type: string
*                         compensationExpireDate:
*                           type: string
*                           format: date
*                         insuranceProvider:
*                           type: string
*                         additionalPolicyDetails:
*                           type: string
*                         attachments:
*                           type: string
*       400:
*         description: File upload error or missing/invalid data format
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 error:
*                   type: string
*       404:
*         description: Employee not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Employee not found
*       500:
*         description: Error updating insurance details of employee
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 error:
*                   type: string
*/
router.put("/updateInsuranceDetails/:id", verifyToken, updateInsuranceDetails);

/**
 * @swagger
 * /api/manageEmployee/updateContractDetails/{id}:
 *   put:
 *     tags:
 *       - Manage Employee
 *     summary: Update a specific employee contract record
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the contract record to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing contract details
 *                 example: '{"contractDetails":{"contractType":"Permanent","contractNumber":"CT-2024-001","contractStartDate":"2024-01-01","contractEndDate":"2026-01-01","contractStatus":"Active"}}'
 *               contractAttachment:
 *                 type: string
 *                 format: binary
 *                 description: Contract document file (optional, max 50MB)
 *     responses:
 *       200:
 *         description: Contract details updated successfully
 *       400:
 *         description: File upload error or missing/invalid data
 *       404:
 *         description: Contract record or employee not found
 *       500:
 *         description: Error updating contract details
 */
router.put("/updateContractDetails/:id", verifyToken, updateContractDetails);

/**
 * @swagger
 * /api/manageEmployee/createContractDetails:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Create a new employee contract record
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing contract details
 *                 example: '{"employeeId":1,"contractDetails":{"contractType":"Permanent","contractNumber":"CT-2024-001","contractStartDate":"2024-01-01","contractEndDate":"2026-01-01","contractStatus":"Active"}}'
 *               contractAttachment:
 *                 type: string
 *                 format: binary
 *                 description: Contract document file (optional, max 50MB)
 *     responses:
 *       201:
 *         description: Contract created successfully
 *       400:
 *         description: Missing or invalid data
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Error creating contract
 */
router.post("/createContractDetails", verifyToken, createContractDetails);

/**
* @swagger
* /api/manageEmployee/updateOtherDetails/{id}:
*   put:
*     tags:
*       - Manage Employee
*     summary: Update other details of an existing employee
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*         description: ID of the employee to update
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               data:
*                 type: object
*                 properties:
*                   otherDetails:
*                     type: object
*                     properties:
*                       dateOfJoin:
*                         type: string
*                         format: date
*                         description: Date when employee joined
*                       designation:
*                         type: string
*                         description: Employee designation/position
*                       employeeType:
*                         type: string
*                         description: Employee type (e.g., operation, office, officeAndoperation)
*                       status:
*                         type: boolean
*                         description: Employee active status
*                       workPlace:
*                         type: string
*                         description: Employee work location
*                       departmentName:
*                         type: string
*                         description: Name of the department
*                       annualLeaveCount:
*                         type: integer
*                         description: Number of annual leave days
*                       destinationCountry:
*                         type: string
*                         description: Destination country for leave
*     responses:
*       200:
*         description: Employee other details updated successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Employee other details updated successfully
*                 employee:
*                   type: object
*       400:
*         description: Missing or invalid data format
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 error:
*                   type: string
*       404:
*         description: Employee not found
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Employee not found
*       500:
*         description: Error updating other details of employee
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                 error:
*                   type: string
*/
router.put("/updateOtherDetails/:id", verifyToken, updateOtherDetails);

/**
 * @swagger
 * /api/manageEmployee/createAcademicQualifications:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Create a new academic qualification record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   employeeId:
 *                     type: integer
 *                   academicQualifications:
 *                     type: object
 *                     properties:
 *                       qualification:
 *                         type: string
 *                       qualificationType:
 *                         type: string
 *                       year:
 *                         type: string
 *                       location:
 *                         type: string
 *     responses:
 *       201:
 *         description: Academic qualification created successfully
 *       400:
 *         description: Missing or invalid data
 *       500:
 *         description: Error creating academic qualification
 */
router.post("/createAcademicQualifications", verifyToken, createAcademicQualifications);

/**
 * @swagger
 * /api/manageEmployee/createCertifications:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Create a new certification record
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: string
 *                 description: JSON string containing certification details
 *               documents:
 *                 type: string
 *                 format: binary
 *                 description: Certification document file
 *     responses:
 *       201:
 *         description: Certification created successfully
 *       400:
 *         description: Missing or invalid data
 *       500:
 *         description: Error creating certification
 */
router.post("/createCertifications", verifyToken, createCertifications);

/**
 * @swagger
 * /api/manageEmployee/createWorkExperience:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Create a new work experience record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 properties:
 *                   employeeId:
 *                     type: integer
 *                   workExperience:
 *                     type: object
 *                     properties:
 *                       companyName:
 *                         type: string
 *                       companyLocation:
 *                         type: string
 *                       industry:
 *                         type: string
 *                       designation:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date
 *                       endDate:
 *                         type: string
 *                         format: date
 *     responses:
 *       201:
 *         description: Work experience created successfully
 *       400:
 *         description: Missing or invalid data
 *       500:
 *         description: Error creating work experience
 */
router.post("/createWorkExperience", verifyToken, createWorkExperience);

/**
 * @swagger
 * /api/manageEmployee/deleteEmployee/{id}:
 *   delete:
 *     tags:
 *       - Manage Employee
 *     summary: Delete an existing employee
 *     description: This endpoint allows to delete a employee from the system.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the employee to delete
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete("/deleteEmployee/:id", verifyToken, deleteEmployee);

/**
 * @swagger
 * /api/manageEmployee/employee/{id}:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Get a single employee by ID
 *     description: This endpoint allows to retrieve a specific employee by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the employee to retrieve
 *     responses:
 *       200:
 *         description: Employee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     personalDetails:
 *                       type: object
 *                       properties:
 *                         profileImage:
 *                           type: string
 *                           description: URL of the employee's profile image
 *                         fullNameEnglish:
 *                           type: string
 *                         fullNameArabic:
 *                           type: string
 *                         qidNumber:
 *                           type: integer
 *                         passportNumber:
 *                           type: string
 *                         qidExpireDate:
 *                           type: date
 *                           format: date
 *                         passportExpireDate:
 *                           type: string
 *                           format: date
 *                         recruitementType:
 *                           type: string
 *                         visaNumber:
 *                           type: string
 *                         nationality:
 *                           type: string
 *                         mobileNumber:
 *                           type: integer
 *                         emergencyContactNumber:
 *                           type: integer
 *                         emergencyName:
 *                           type: string
 *                         emergencyRelationship:
 *                           type: string
 *                         email:
 *                           type: string
 *                         gender:
 *                           type: string
 *                         dateOfBirth:
 *                           type: string
 *                           format: date
 *                         numberOfFamilyMembers:
 *                           type: integer
 *                         currentAddress:
 *                           type: string
 *                         permanentAddress:
 *                           type: string
 *                         maritalStatus:
 *                           type: string
 *                         familyInQatar:
 *                           type: boolean
 *                     drivingLicenseDetails:
 *                         type: object
 *                         properties:
 *                           isAvailableLicense:
 *                             type: boolean
 *                           drivingLicenseCopy:
 *                             type: string
 *                             description: URL of the uploaded license copy (e.g. /documents/license.pdf)
 *                           licenseNumber:
 *                             type: string
 *                           firstIssueDate:
 *                             type: string
 *                             format: date
 *                           licenseExpireDate:
 *                             type: string
 *                             format: date
 *                           licenseCategory:
 *                             type: string
 *                           licenseNotes:
 *                             type: string
 *                     bankDetails:
 *                       type: object
 *                       properties:
 *                         bankName:
 *                           type: string
 *                         accountHolderName:
 *                           type: string
 *                         accountNumber:
 *                           type: integer
 *                         branchName:
 *                           type: string
 *                         IBAN:
 *                           type: string
 *                         swiftCode:
 *                           type: integer
 *                         shortCode:
 *                           type: string
 *                     sponserDetails:
 *                       type: object
 *                       properties:
 *                         sponserName:
 *                           type: string
 *                         employeeContractCopy:
 *                           type: string
 *                         contractExpireDate:
 *                           type: string
 *                         companyCRCopyExpireDate:
 *                           type: string
 *                         computerCardCopy:
 *                           type: string
 *                         computerCardExpireDate:
 *                           type: string
 *                         NOC:
 *                           type: string
 *                         companyCRCopy:
 *                           type: string
 *                     documentDetails:
 *                       type: object
 *                       properties:
 *                         image:
 *                           type: string
 *                         copyOfQID:
 *                           type: string
 *                         copyOfPassport:
 *                           type: string
 *                         resume:
 *                           type: string
 *                         qualificationCertificate:
 *                           type: string
 *                         otherDocuments:
 *                           type: string
 *                     insuranceDetails:
 *                       type: object
 *                       properties:
 *                         healthCardNumber:
 *                           type: string
 *                         issuingAuthority:
 *                           type: string
 *                         expireDate:
 *                           type: string
 *                         knownMedicalConditions:
 *                           type: string
 *                         allergies:
 *                           type: string
 *                         notesOrRemarks:
 *                           type: string
 *                         policyNumber:
 *                           type: string
 *                         coverageDetails:
 *                           type: string
 *                         compensationExpireDate:
 *                           type: string
 *                         insuranceProvider:
 *                           type: string
 *                         additionalPolicyDetails:
 *                           type: string
 *                         attachments:
 *                           type: string
 *                     fleetDetails:
 *                       type: object
 *                       properties:
 *                         operatorType:
 *                           type: string
 *                         equipmentDetails:
 *                           type: string
 *                         month:
 *                           type: string
 *                         gatePassNumber:
 *                           type: string
 *                         gatePassIssueDate:
 *                           type: string
 *                         gatePassExpireDate:
 *                           type: string
 *                         gatePassAttachment:
 *                           type: string
 *                         gatePassExpireStatus:
 *                           type: string
 *                         fleetStatus:
 *                           type: string
 *                     otherDetails:
 *                       type: object
 *                       properties:
 *                         password:
 *                           type: string
 *                           description: The employee's password (hashed)
 *                         dateOfJoin:
 *                           type: string
 *                           format: date
 *                         yearsOfService:
 *                           type: integer
 *                         designation:
 *                           type: string
 *                         employeeType:
 *                           type: string
 *                         status:
 *                           type: boolean
 *                         workPlace:
 *                           type: string
 *                         departmentName:
 *                          type: string
 *       404:
 *         description: Employee not found
 */
router.get("/employee/:id", verifyToken, getEmployeeById);

/**
 * @swagger
 * /api/manageEmployee/employees:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Get all employees with pagination
 *     description: This endpoint allows to retrieve all employees in the system with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (default is 1)
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of users per page (default is 10)
 *     responses:
 *       200:
 *         description: Employees retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *               properties:
 *                     id:
 *                       type: integer
 *                     personalDetails:
 *                       type: object
 *                       properties:
 *                         profileImage:
 *                           type: string
 *                           description: URL of the employee's profile image
 *                         fullNameEnglish:
 *                           type: string
 *                         fullNameArabic:
 *                           type: string
 *                         qidNumber:
 *                           type: integer
 *                         passportNumber:
 *                           type: string
 *                         qidExpireDate:
 *                           type: string
 *                           format: date
 *                           description: QID expiry date - accepts any future date
 *                         passportExpireDate:
 *                           type: string
 *                           format: date
 *                           description: Passport expiry date - accepts any future date
 *                         recruitementType:
 *                           type: string
 *                         visaNumber:
 *                           type: string
 *                         nationality:
 *                           type: string
 *                         mobileNumber:
 *                           type: integer
 *                         emergencyContactNumber:
 *                           type: integer
 *                         emergencyName:
 *                           type: string
 *                         emergencyRelationship:
 *                           type: string
 *                         email:
 *                           type: string
 *                         gender:
 *                           type: string
 *                         dateOfBirth:
 *                           type: string
 *                           format: date
 *                         numberOfFamilyMembers:
 *                           type: integer
 *                         currentAddress:
 *                           type: string
 *                         permanentAddress:
 *                           type: string
 *                         maritalStatus:
 *                           type: string
 *                         familyInQatar:
 *                           type: boolean
 *                     drivingLicenseDetails:
 *                         type: object
 *                         properties:
 *                           isAvailableLicense:
 *                             type: boolean
 *                           drivingLicenseCopy:
 *                             type: string
 *                             description: URL of the uploaded license copy (e.g. /documents/license.pdf)
 *                           licenseNumber:
 *                             type: string
 *                           firstIssueDate:
 *                             type: string
 *                             format: date
 *                           licenseExpireDate:
 *                             type: string
 *                             format: date
 *                           licenseCategory:
 *                             type: string
 *                           licenseNotes:
 *                             type: string
 *                     bankDetails:
 *                       type: object
 *                       properties:
 *                         bankName:
 *                           type: string
 *                         accountHolderName:
 *                           type: string
 *                         accountNumber:
 *                           type: integer
 *                         branchName:
 *                           type: string
 *                         IBAN:
 *                           type: string
 *                         swiftCode:
 *                           type: integer
 *                         shortCode:
 *                           type: string
 *                     sponserDetails:
 *                       type: object
 *                       properties:
 *                         sponserName:
 *                           type: string
 *                         employeeContractCopy:
 *                           type: string
 *                         contractExpireDate:
 *                           type: string
 *                         companyCRCopyExpireDate:
 *                           type: string
 *                         computerCardCopy:
 *                           type: string
 *                         computerCardExpireDate:
 *                           type: string
 *                         NOC:
 *                           type: string
 *                         companyCRCopy:
 *                           type: string
 *                     documentDetails:
 *                       type: object
 *                       properties:
 *                         image:
 *                           type: string
 *                         copyOfQID:
 *                           type: string
 *                         copyOfPassport:
 *                           type: string
 *                         resume:
 *                           type: string
 *                         qualificationCertificate:
 *                           type: string
 *                         otherDocuments:
 *                           type: string
 *                     insuranceDetails:
 *                       type: object
 *                       properties:
 *                         healthCardNumber:
 *                           type: string
 *                         issuingAuthority:
 *                           type: string
 *                         expireDate:
 *                           type: string
 *                         knownMedicalConditions:
 *                           type: string
 *                         allergies:
 *                           type: string
 *                         notesOrRemarks:
 *                           type: string
 *                         policyNumber:
 *                           type: string
 *                         coverageDetails:
 *                           type: string
 *                         compensationExpireDate:
 *                           type: string
 *                         insuranceProvider:
 *                           type: string
 *                         additionalPolicyDetails:
 *                           type: string
 *                         attachments:
 *                           type: string
 *                     fleetDetails:
 *                       type: object
 *                       properties:
 *                         operatorType:
 *                           type: string
 *                         equipmentDetails:
 *                           type: string
 *                         month:
 *                           type: string
 *                         gatePassNumber:
 *                           type: string
 *                         gatePassIssueDate:
 *                           type: string
 *                         gatePassExpireDate:
 *                           type: string
 *                         gatePassAttachment:
 *                           type: string
 *                         gatePassExpireStatus:
 *                           type: string
 *                         fleetStatus:
 *                           type: string
 *                     otherDetails:
 *                       type: object
 *                       properties:
 *                         password:
 *                           type: string
 *                           description: The employee's password (hashed)
 *                         dateOfJoin:
 *                           type: string
 *                           format: date
 *                         yearsOfService:
 *                           type: integer
 *                         designation:
 *                           type: string
 *                         employeeType:
 *                           type: string
 *                         status:
 *                           type: boolean
 *                         workPlace:
 *                           type: string
 *                         departmentName:
 *                          type: string
 *       500:
 *         description: Error retrieving employees
 */
router.get("/employees", verifyToken, getAllEmployees);

/**
 * @swagger
 * /api/manageEmployee/expiring-documents:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Get employees with expiring QID/Passport documents
 *     description: This endpoint retrieves employees whose QID or Passport documents are nearing expiry within a specified timeframe.
 *     parameters:
 *       - in: query
 *         name: daysAhead
 *         required: false
 *         schema:
 *           type: integer
 *           default: 180
 *         description: Number of days ahead to check for expiring documents (default is 180 days = 6 months)
 *     responses:
 *       200:
 *         description: Employees with expiring documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of employees with expiring documents
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       employeeName:
 *                         type: string
 *                       qidExpiry:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                       passportExpiry:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                       qidDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Days remaining until QID expires
 *                       passportDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Days remaining until passport expires
 *                       minDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Minimum days left between QID and passport
 *                       status:
 *                         type: string
 *                         enum: [Urgent, Nearing Expiry]
 *                         description: Urgency status based on days left
 *                 summary:
 *                   type: object
 *                   properties:
 *                     urgent:
 *                       type: integer
 *                       description: Number of employees with urgent expiry (≤30 days)
 *                     nearingExpiry:
 *                       type: integer
 *                       description: Number of employees with documents nearing expiry (31-90 days)
 *       500:
 *         description: Error retrieving employees with expiring documents
 */
router.get(
  "/expiring-documents",
  verifyToken,
  getEmployeesWithExpiringDocuments
);

/**
 * @swagger
 * /api/manageEmployee/expiring-insurance-documents:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Get employees with expiring insurance documents
 *     description: This endpoint retrieves employees whose insurance documents (Health Card or Workmen's Compensation) are nearing expiry within a specified timeframe.
 *     parameters:
 *       - in: query
 *         name: daysAhead
 *         required: false
 *         schema:
 *           type: integer
 *           default: 180
 *         description: Number of days ahead to check for expiring insurance documents (default is 180 days = 6 months)
 *     responses:
 *       200:
 *         description: Employees with expiring insurance documents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCount:
 *                   type: integer
 *                   description: Total number of employees with expiring insurance documents
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       employeeName:
 *                         type: string
 *                       healthCardExpiry:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                         description: Health card expiry date
 *                       compensationExpiry:
 *                         type: string
 *                         format: date
 *                         nullable: true
 *                         description: Workmen's compensation expiry date
 *                       healthCardDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Days remaining until health card expires
 *                       compensationDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Days remaining until compensation expires
 *                       minDaysLeft:
 *                         type: integer
 *                         nullable: true
 *                         description: Minimum days left between health card and compensation
 *                       status:
 *                         type: string
 *                         enum: [Urgent, Nearing Expiry]
 *                         description: Urgency status based on days left
 *                       hasHealthCardExpiring:
 *                         type: boolean
 *                         description: Whether health card is expiring
 *                       hasCompensationExpiring:
 *                         type: boolean
 *                         description: Whether workmen's compensation is expiring
 *                       insuranceDetails:
 *                         type: object
 *                         properties:
 *                           healthCardNumber:
 *                             type: string
 *                             nullable: true
 *                           issuingAuthority:
 *                             type: string
 *                             nullable: true
 *                           policyNumber:
 *                             type: string
 *                             nullable: true
 *                           insuranceProvider:
 *                             type: string
 *                             nullable: true
 *                           coverageDetails:
 *                             type: string
 *                             nullable: true
 *                 summary:
 *                   type: object
 *                   properties:
 *                     urgent:
 *                       type: integer
 *                       description: Number of employees with urgent insurance expiry (≤30 days)
 *                     nearingExpiry:
 *                       type: integer
 *                       description: Number of employees with insurance documents nearing expiry (31-90 days)
 *                     healthCardExpiring:
 *                       type: integer
 *                       description: Number of employees with health cards expiring
 *                     compensationExpiring:
 *                       type: integer
 *                       description: Number of employees with compensation expiring
 *       500:
 *         description: Error retrieving employees with expiring insurance documents
 */
router.get(
  "/expiring-insurance-documents",
  verifyToken,
  getEmployeesWithExpiringInsuranceDocuments
);

/**
 * @swagger
 * /api/manageEmployee/getEmployeesWithSalaryDetails:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Get all employees with their salary details
 *     description: This endpoint returns employee data along with their salary details including bonus, deductions, payment method, etc.
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of employees per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of employees with salary details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalEmployees:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 employees:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       personalDetails:
 *                         type: object
 *                         properties:
 *                           profileImage:
 *                             type: string
 *                           fullNameEnglish:
 *                             type: string
 *                           fullNameArabic:
 *                             type: string
 *                           qidNumber:
 *                             type: integer
 *                           passportNumber:
 *                             type: string
 *                           drivingLicense:
 *                             type: string
 *                           qidExpireDate:
 *                             type: date
 *                             format: date
 *                           passportExpireDate:
 *                             type: string
 *                             format: date
 *                           recruitementType:
 *                             type: string
 *                           visaNumber:
 *                             type: string
 *                           drivingLicenseExpireDate:
 *                             type: string
 *                             format: date
 *                           nationality:
 *                             type: string
 *                           mobileNumber:
 *                             type: integer
 *                           emergencyContactNumber:
 *                             type: integer
 *                           emergencyName:
 *                             type: string
 *                           emergencyRelationship:
 *                             type: string
 *                           email:
 *                             type: string
 *                           gender:
 *                             type: string
 *                           dateOfBirth:
 *                             type: string
 *                             format: date
 *                           numberOfFamilyMembers:
 *                             type: integer
 *                           currentAddress:
 *                             type: string
 *                           permanentAddress:
 *                             type: string
 *                           maritalStatus:
 *                             type: string
 *                           familyInQatar:
 *                             type: boolean
 *                       department:
 *                         type: object
 *                         properties:
 *                           departmentName:
 *                             type: string
 *                       role:
 *                         type: object
 *                         properties:
 *                           roleName:
 *                             type: string
 *                       tbl_payroll:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             salaryAmount:
 *                               type: number
 *                             bonusAmount:
 *                               type: number
 *                             deductions:
 *                               type: number
 *                             paymentMethod:
 *                               type: string
 *                             paymentDate:
 *                               type: string
 *                               format: date
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getEmployeesWithSalaryDetails",
  verifyToken,
  getAllEmployeesWithSalaryDetails
);

/**
 * @swagger
 * /api/manageEmployee/manualSalaryCalculation:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Manually calculate the employee's salary
 *     description: This endpoint allows the admin to manually calculate an employee's salary, including deductions and bonuses.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeId:
 *                 type: integer
 *               salaryAmount:
 *                 type: integer
 *               bonusAmount:
 *                 type: integer
 *               deductions:
 *                 type: integer
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Manual salary calculation successful
 *       500:
 *         description: Internal server error
 */
router.post("/manualSalaryCalculation", verifyToken, manualSalaryCalculation);

/**
 * @swagger
 * /api/manageEmployee/approvePayroll:
 *   post:
 *     tags:
 *       - Manage Employee
 *     summary: Approve or reject payroll
 *     description: This endpoint allows the admin to approve or reject the payroll for a specific employee.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payrollId:
 *                 type: integer
 *               isApproved:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Payroll approval/rejection successful
 *       404:
 *         description: Payroll not found
 *       500:
 *         description: Internal server error
 */
router.post("/approvePayroll", verifyToken, approvePayroll);

/**
 * @swagger
 * /api/manageEmployee/filterEmployees:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Get filtered employees by gender, contractType, and departmentName
 *     description: This endpoint allows filtering employees based on gender, contract type, and department name.
 *     parameters:
 *       - in: query
 *         name: gender
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Male, Female, Other]
 *         description: The gender of the employee to filter by
 *       - in: query
 *         name: contractType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Temporary, Deligated, Under Test, Proven Employee, Permanent]
 *         description: The contract type of the employee to filter by
 *       - in: query
 *         name: departmentName
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, IT Department, Finance Department, Academic, Administration, HR Department]
 *         description: The department of the employee to filter by
 *       - in: query
 *         name: designation
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Accountant, IT, Director, HR Manager, Manager]
 *         description: The designation of the employee to filter by
 *       - in: query
 *         name: maritalStatus
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Unmarried, Married, Divorced, Widowed]
 *         description: The marital status of the employee to filter by
 *       - in: query
 *         name: familyInQatar
 *         required: false
 *         schema:
 *           type: boolean
 *           enum: [All, Yes, No]
 *         description: The family in Qatar of the employee to filter by
 *       - in: query
 *         name: workExperience
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10+]
 *         description: The work experience of the employee to filter by
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Active, Inactive]
 *         description: The sponsered of the employee to filter by
 *       - in: query
 *         name: workPlace
 *         required: false
 *         schema:
 *           type: string
 *           enum: [All, Office, Work From Home]
 *         description: The work place of the employee to filter by
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *         description: The number of employees per page
 *     responses:
 *       200:
 *         description: A list of filtered employees
 *       500:
 *         description: Server error
 */
router.get("/filterEmployees", verifyToken, filterEmployees);

/**
 * @swagger
 * /api/manageEmployee/exportFilteredEmployees:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Export filtered employee data as CSV
 *     description: This endpoint allows you to export filtered employee data in CSV format.
 *     parameters:
 *       - in: query
 *         name: gender
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter employees by gender
 *       - in: query
 *         name: contractType
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter employees by contract type
 *       - in: query
 *         name: departmentName
 *         required: false
 *         schema:
 *           type: string
 *           description: Filter employees by department name
 *       - in: query
 *         name: designation
 *         required: false
 *         schema:
 *           type: string
 *           description: The designation of the employee to filter by
 *       - in: query
 *         name: maritalStatus
 *         required: false
 *         schema:
 *           type: string
 *           description: The marital status of the employee to filter by
 *       - in: query
 *         name: familyInQatar
 *         required: false
 *         schema:
 *           type: string
 *           description: The family in Qatar of the employee to filter by
 *       - in: query
 *         name: workExperience
 *         required: false
 *         schema:
 *           type: string
 *           description: The work experience of the employee to filter by
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           description: The status of the employee to filter by
 *       - in: query
 *         name: workPlace
 *         required: false
 *         schema:
 *           type: string
 *           description: The work place of the employee to filter by
 *     responses:
 *       200:
 *         description: CSV file containing filtered employee data
 *       500:
 *         description: Error exporting employees to CSV
 */
router.get(
  "/exportFilteredEmployees",
  verifyToken,
  exportFilteredEmployeesToCSV
);

/**
 * @swagger
 * /api/manageEmployee/exportFilteredEmployeesToPDF:
 *   get:
 *     tags:
 *       - Manage Employee
 *     summary: Export filtered employee data to PDF
 *     description: This endpoint allows exporting employee data based on filters to a PDF file.
 *     parameters:
 *       - name: gender
 *         in: query
 *         description: Filter by gender
 *         required: false
 *         schema:
 *           type: string
 *       - name: contractType
 *         in: query
 *         description: Filter by contract type
 *         required: false
 *         schema:
 *           type: string
 *       - name: departmentName
 *         in: query
 *         description: Filter by department name
 *         required: false
 *         schema:
 *           type: string
 *       - name: designation
 *         in: query
 *         description: Filter by designation
 *         required: false
 *         schema:
 *           type: string
 *       - name: maritalStatus
 *         in: query
 *         description: Filter by marital status
 *         required: false
 *         schema:
 *           type: string
 *       - name: familyInQatar
 *         in: query
 *         description: Filter by family in Qatar
 *         required: false
 *         schema:
 *           type: string
 *       - name: workExperience
 *         in: query
 *         description: Filter by work Experience
 *         required: false
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter by status
 *         required: false
 *         schema:
 *           type: string
 *       - name: workPlace
 *         in: query
 *         description: Filter by work place
 *         required: false
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Limit number of records per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF file with employee data
 *       404:
 *         description: No employees found matching the filters
 *       500:
 *         description: Internal server error
 */
router.get(
  "/exportFilteredEmployeesToPDF",
  verifyToken,
  exportFilteredEmployeesToPDF
);

module.exports = router;
