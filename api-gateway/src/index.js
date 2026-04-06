// api-gateway/src/index.js
// ─────────────────────────────────────────────────────────────────────────────
// COMBINED MODE: Runs all microservices in-process AND exposes them on their
// individual ports (4001-4005) while the API Gateway runs on port 4000.
//
//  Port 4000  →  API Gateway  (JWT auth + rate limiting + all routes)
//  Port 4001  →  User Management Service  (direct access, no auth)
//  Port 4002  →  HR Service               (direct access, no auth)
//  Port 4003  →  Sales CRM Service        (direct access, no auth)
//  Port 4004  →  Fleet Management Service (direct access, no auth)
//  Port 4005  →  Fixed Assets Service     (direct access, no auth)
// ─────────────────────────────────────────────────────────────────────────────

const express   = require("express");
const cors      = require("cors");
const path      = require("path");
const helmet    = require("helmet");
const morgan    = require("morgan");
const rateLimit = require("express-rate-limit");
const jwt       = require("jsonwebtoken");
const cron      = require("node-cron");
const { swaggerUi, swaggerSpec } = require("../swagger/swaggerConfig");
const dotenv    = require("dotenv");

dotenv.config();

// ─── Shared middleware helper ─────────────────────────────────────────────────
const applyCommon = (app, label) => {
  app.use(helmet());
  app.use(morgan(`${label} :method :url :status :response-time ms`));
  app.use(cors({ origin: "*", methods: "GET,POST,PUT,DELETE,PATCH", credentials: true }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
};

// ═════════════════════════════════════════════════════════════════════════════
// ROUTE IMPORTS
// Imported once and reused across both the individual service servers
// AND the gateway — no HTTP proxy hop, everything stays in-process.
// ═════════════════════════════════════════════════════════════════════════════

// ── User Management ──────────────────────────────────────────────────────────
const authRoutes              = require("../../services/user-management-service/src/routes/authRoutes");
const manageUserRoutes        = require("../../services/user-management-service/src/routes/manageUserRoutes");
const choicesListRoutes       = require("../../services/user-management-service/src/routes/choicesListRoutes");
const companySettingsRoutes   = require("../../services/user-management-service/src/routes/companySettingsRoutes");
const usersManagement         = require("../../services/user-management-service/src/routes/usersRoutes");
const usersTypes              = require("../../services/user-management-service/src/routes/userTypesRoutes");
const userGroupsRoutes        = require("../../services/user-management-service/src/routes/userGroupsRoutes");
const userRolesRoutes         = require("../../services/user-management-service/src/routes/rolesRoutes");
const permissionRoutes        = require("../../services/user-management-service/src/routes/permissionsRoutes");
const passwordRulesRoutes     = require("../../services/user-management-service/src/routes/passwordRulesRoutes");
const rolePermissionsRoutes   = require("../../services/user-management-service/src/routes/rolePermissionsRoutes");
const organizations           = require("../../services/user-management-service/src/routes/organizationsRoutes");
const tenants                 = require("../../services/user-management-service/src/routes/tenantsRoutes");
const branchesRoutes          = require("../../services/user-management-service/src/routes/branchesRoutes");
const modulesRoutes           = require("../../services/user-management-service/src/routes/modulesRoutes");
const subscriptionPlansRoutes = require("../../services/user-management-service/src/routes/subscriptionPlansRoutes");

// ── HR ───────────────────────────────────────────────────────────────────────
const employeeRoutes          = require("../../services/hr-service/src/routes/employeeRoutes");
const departmentRoutes        = require("../../services/hr-service/src/routes/departmentRoutes");
const contractTypeRoutes      = require("../../services/hr-service/src/routes/contractTypeRoutes");
const designationRoutes       = require("../../services/hr-service/src/routes/designationRoutes");
const leaveTypeRoutes         = require("../../services/hr-service/src/routes/leaveTypeRoutes");
const workplaceRoutes         = require("../../services/hr-service/src/routes/workplaceRoutes");
const bankDetailsRoutes       = require("../../services/hr-service/src/routes/bankDetailsRoutes");
const penaltyTypesRoutes      = require("../../services/hr-service/src/routes/penaltyTypeRoutes");
const airTicketsRoutes        = require("../../services/hr-service/src/routes/airTicketRoutes");
const payrollRoutes           = require("../../services/hr-service/src/routes/payrollRoutes");
const attendenceRoutes        = require("../../services/hr-service/src/routes/attendenceRoutes");
const jobPostingRoutes        = require("../../services/hr-service/src/routes/jobPostingRoutes");
const leaveRequestRoutes      = require("../../services/hr-service/src/routes/leaveRequestRoutes");
const leaveApprovalRoutes     = require("../../services/hr-service/src/routes/leaveApprovalRoutes");
const loanRequestRoutes       = require("../../services/hr-service/src/routes/loanRequestRoutes");
const loanApprovalRoutes      = require("../../services/hr-service/src/routes/loanApprovalRoutes");
const penaltyRoutes           = require("../../services/hr-service/src/routes/penaltyRoutes");
const commissionRoutes        = require("../../services/hr-service/src/routes/commissionRoutes");
const performanceManagement   = require("../../services/hr-service/src/routes/performanceManagementRoutes");
const trainingAndDevelopment  = require("../../services/hr-service/src/routes/trainingAndDevelopmentRoutes");
const countries               = require("../../services/hr-service/src/routes/countriesRoutes");
const gratuity                = require("../../services/hr-service/src/routes/gratuityRoutes");
const provisions              = require("../../services/hr-service/src/routes/provisionRoutes");
const payrollsDeductions      = require("../../services/hr-service/src/routes/payrollDeductionRoutes");
const certificationTypeRoutes = require("../../services/hr-service/src/routes/certificationTypeRoutes");
const certificationNameRoutes = require("../../services/hr-service/src/routes/certificationNameRoutes");
const certificationBodyRoutes = require("../../services/hr-service/src/routes/certificationBodyRoutes");
const industryRoutes          = require("../../services/hr-service/src/routes/industryRoutes");
const trainingDetailsRoutes   = require("../../services/hr-service/src/routes/trainingDetailsRoutes");
const jobOnboardingRoutes     = require("../../services/hr-service/src/routes/jobOnboardingRoutes");
const employeeContractRoutes  = require("../../services/hr-service/src/routes/employeeContractRoutes");
const gatePassLocationRoutes  = require("../../services/hr-service/src/routes/gatePassLocationRoutes");

const { schedulePayrollCalculation } = require("../../services/hr-service/src/cronJobs/payrollScheduler");
schedulePayrollCalculation();

// ── Sales CRM ────────────────────────────────────────────────────────────────
const crmLeadsRoutes         = require("../../services/sales-crm-service/src/routes/leadRoutes");
const crmSalesPipelineRoutes = require("../../services/sales-crm-service/src/routes/salesPipelineRoutes");
const crmProspectRoutes      = require("../../services/sales-crm-service/src/routes/prospectRoutes");
const crmFormRoutes          = require("../../services/sales-crm-service/src/routes/formRoutes");
const crmFormFieldRoutes     = require("../../services/sales-crm-service/src/routes/formFieldRoutes");

// ── Fleet Management ──────────────────────────────────────────────────────────
const dailyScheduleRoutes                  = require("../../services/fleet-management-service/src/routes/dailyScheduleRoutes");
const equipmentRoutes                      = require("../../services/fleet-management-service/src/routes/equipmentRoutes");
const jobLocationRoutes                    = require("../../services/fleet-management-service/src/routes/jobLocationRoutes");
const mainCategoryRoutes                   = require("../../services/fleet-management-service/src/routes/mainCategoryRoutes");
const nextServiceTypeRoutes                = require("../../services/fleet-management-service/src/routes/nextServiceTypeRoutes");
const operatorTypeRoutes                   = require("../../services/fleet-management-service/src/routes/operatorTypeRoutes");
const serviceCategoryRoutes                = require("../../services/fleet-management-service/src/routes/serviceCategoryRoutes");
const serviceProviderRoutes                = require("../../services/fleet-management-service/src/routes/serviceProviderRoutes");
const servicesRoutes                       = require("../../services/fleet-management-service/src/routes/servicesRoutes");
const serviceTypeOneRoutes                 = require("../../services/fleet-management-service/src/routes/serviceTypeOneRoutes");
const serviceTypeTwoRoutes                 = require("../../services/fleet-management-service/src/routes/serviceTypeTwoRoutes");
const fleetMaintenanceRoutes               = require("../../services/fleet-management-service/src/routes/maintenanceRoutes");
const salesOrderOld                        = require("../../services/fleet-management-service/src/routes/SalesOrderOld");
const salesOrdersRoutes                    = require("../../services/fleet-management-service/src/routes/salesOrdersRoutes");
const operationalHandlingRoutes            = require("../../services/fleet-management-service/src/routes/operationalHandlingRoutes");
const vehicleOwnerRoutes                   = require("../../services/fleet-management-service/src/routes/vehicleOwnerRoutes");
const manpowerRoutes                       = require("../../services/fleet-management-service/src/routes/manpowerRoutes");
const activeAllocationsOriginalRoutes      = require("../../services/fleet-management-service/src/routes/activeAllocationsOriginalRoutes");
const serviceEntryTypeRoutes               = require("../../services/fleet-management-service/src/routes/serviceEntryTypeRoutes");
const vehicleTypeRoutes                    = require("../../services/fleet-management-service/src/routes/vehicleTypeRoutes");
const fleetProductRoutes                   = require("../../services/fleet-management-service/src/routes/productRoutes");
const fleetAttachmentRoutes                = require("../../services/fleet-management-service/src/routes/attachmentRoutes");
const attachmentLocationRoutes             = require("../../services/fleet-management-service/src/routes/attachmentLocationRoutes");
const salesOrderRecoveryRoutes             = require("../../services/fleet-management-service/src/routes/salesOrderRecoveryRoutes");
const attachmentStageRoutes                = require("../../services/fleet-management-service/src/routes/attachmentStageRoutes");
const equipmentStageRoutes                 = require("../../services/fleet-management-service/src/routes/equipmentStageRoutes");
const manpowerStageRoutes                  = require("../../services/fleet-management-service/src/routes/manpowerStageRoutes");
const recoveryStageRoutes                  = require("../../services/fleet-management-service/src/routes/recoveryStageRoutes");
const backupEquipmentStageRoutes           = require("../../services/fleet-management-service/src/routes/backupEquipmentStageRoutes");
const backupManpowerStageRoutes            = require("../../services/fleet-management-service/src/routes/backupManpowerStageRoutes");
const subProductAttachmentStageRoutes      = require("../../services/fleet-management-service/src/routes/subProductAttachmentStageRoutes");
const deliveryNoteRoutes                   = require("../../services/fleet-management-service/src/routes/deliveryNoteRoutes");
const masterChecklistRoutes                = require("../../services/fleet-management-service/src/routes/masterChecklistRoutes");
const operationalModificationRoutes        = require("../../services/fleet-management-service/src/routes/operationalModificationRoutes");
const attachmentSwapRoutes                 = require("../../services/fleet-management-service/src/routes/attachmentSwapRoutes");
const equipmentSwapRoutes                  = require("../../services/fleet-management-service/src/routes/equipmentSwapRoutes");
const operatorChangeRoutes                 = require("../../services/fleet-management-service/src/routes/operatorChangeRoutes");
const swapReasonRoutes                     = require("../../services/fleet-management-service/src/routes/swapReasonRoutes");
const subProductSwapRoutes                 = require("../../services/fleet-management-service/src/routes/sub-product-swap-routes");
const OffHireNotesRoutes                   = require("../../services/fleet-management-service/src/routes/offHireNoteRoutes");
const ChargeableTypeRoutes                 = require("../../services/fleet-management-service/src/routes/chargeableTypeRoutes");
const SwapRequestRoutes                    = require("../../services/fleet-management-service/src/routes/swap-requests-routes");
const subProductAttachmentAssignmentRoutes = require("../../services/fleet-management-service/src/routes/sub-product-attachment-assignment-routes");
const pushRoutes                           = require("../../services/fleet-management-service/src/routes/pushRoutes");

const { sendLPOReminderNotifications } = require("../../services/fleet-management-service/src/controllers/pushSubscriptionController");

const _runLPOReminderJob = () =>
  new Promise((resolve, reject) => {
    const fakeRes = { status: () => ({ json: (d) => { console.log("📬 [LPO] Result:", d); resolve(d); } }) };
    sendLPOReminderNotifications({}, fakeRes).catch(reject);
  });

cron.schedule("0 9 * * *", async () => {
  console.log("🔔 [CRON] Running LPO reminder push notifications...");
  try   { await _runLPOReminderJob(); console.log("✅ [CRON] LPO reminder completed."); }
  catch (err) { console.error("❌ [CRON] LPO reminder error:", err); }
});
console.log("⏰ LPO reminder cron scheduled (daily 9:00 AM)");

// ── Fixed Assets ──────────────────────────────────────────────────────────────
const assests               = require("../../services/fixed-assets-service/src/routes/assetRoutes");
const assetTransfers        = require("../../services/fixed-assets-service/src/routes/assetTransferRoutes");
const assetDisposals        = require("../../services/fixed-assets-service/src/routes/assetDisposalRoutes");
const assetCategories       = require("../../services/fixed-assets-service/src/routes/assetCategoryRoutes");
const depreciationSchedules = require("../../services/fixed-assets-service/src/routes/depreciationScheduleRoutes");
const assetSubCategories    = require("../../services/fixed-assets-service/src/routes/assetSubcategoryRoutes");
const assetCapacities       = require("../../services/fixed-assets-service/src/routes/assetCapacityRoutes");
const assetClassifications  = require("../../services/fixed-assets-service/src/routes/assetClassificationRoutes");
const locationID            = require("../../services/fixed-assets-service/src/routes/locationIDRoutes");
const custodianID           = require("../../services/fixed-assets-service/src/routes/custodianIdRoutes");
const costCenterID          = require("../../services/fixed-assets-service/src/routes/costCenterIDRoutes");
const supplierID            = require("../../services/fixed-assets-service/src/routes/supplierIdRoutes");
const subAssets             = require("../../services/fixed-assets-service/src/routes/subAssetRoutes");
const modelAssetRoutes      = require("../../services/fixed-assets-service/src/routes/modelAssetRoutes");
const manufacturerRoutes    = require("../../services/fixed-assets-service/src/routes/manufacturerRoutes");

// ═════════════════════════════════════════════════════════════════════════════
// ROUTE MOUNTING HELPER
// Applies a list of [path, router] pairs to any Express app.
// ═════════════════════════════════════════════════════════════════════════════
const mountRoutes = (app, pairs) => pairs.forEach(([p, r]) => app.use(p, r));

const USER_ROUTES = [
  ["/api/auth",               authRoutes],
  ["/api/manageUser",         manageUserRoutes],
  ["/api/choicesList",        choicesListRoutes],
  ["/api/manageCompany",      companySettingsRoutes],
  ["/api/users",              usersManagement],
  ["/api/user-types",         usersTypes],
  ["/api/user-groups",        userGroupsRoutes],
  ["/api/roles",              userRolesRoutes],
  ["/api/permissions",        permissionRoutes],
  ["/api/password-rules",     passwordRulesRoutes],
  ["/api/role-permissions",   rolePermissionsRoutes],
  ["/api/organizations",      organizations],
  ["/api/tenants",            tenants],
  ["/api/branches",           branchesRoutes],
  ["/api/modules",            modulesRoutes],
  ["/api/subscription-plans", subscriptionPlansRoutes],
];

const HR_ROUTES = [
  ["/api/manageEmployee",        employeeRoutes],
  ["/api/department",            departmentRoutes],
  ["/api/contractType",          contractTypeRoutes],
  ["/api/designation",           designationRoutes],
  ["/api/leaveType",             leaveTypeRoutes],
  ["/api/workplace",             workplaceRoutes],
  ["/api/bank",                  bankDetailsRoutes],
  ["/api/penalties",             penaltyTypesRoutes],
  ["/api/air",                   airTicketsRoutes],
  ["/api/payroll",               payrollRoutes],
  ["/api/attendence",            attendenceRoutes],
  ["/api/jobPosting",            jobPostingRoutes],
  ["/api/leave",                 leaveRequestRoutes],
  ["/api/applyLeave",            leaveApprovalRoutes],
  ["/api/loan",                  loanRequestRoutes],
  ["/api/loanApproval",          loanApprovalRoutes],
  ["/api/penalty",               penaltyRoutes],
  ["/api/commissions",           commissionRoutes],
  ["/api/performance",           performanceManagement],
  ["/api/goal",                  performanceManagement],
  ["/api/kpi",                   performanceManagement],
  ["/api/trainingDevelopment",   trainingAndDevelopment],
  ["/api/countries",             countries],
  ["/api/gratuity",              gratuity],
  ["/api/provision",             provisions],
  ["/api/payroll-deductions",    payrollsDeductions],
  ["/api/certifications-types",  certificationTypeRoutes],
  ["/api/certifications-names",  certificationNameRoutes],
  ["/api/certifications-bodies", certificationBodyRoutes],
  ["/api/industries",            industryRoutes],
  ["/api/trainingDetails",       trainingDetailsRoutes],
  ["/api/jobOnboarding",         jobOnboardingRoutes],
  ["/api/contracts",             employeeContractRoutes],
  ["/api/gatepass",              gatePassLocationRoutes],
];

const CRM_ROUTES = [
  ["/api/crm/leads",            crmLeadsRoutes],
  ["/api/crm/sales-pipelines",  crmSalesPipelineRoutes],
  ["/api/crm/prospects",        crmProspectRoutes],
  ["/api/crm/forms",            crmFormRoutes],
  ["/api/crm/form-fields",      crmFormFieldRoutes],
];

const FLEET_ROUTES = [
  ["/api/schedules",                          dailyScheduleRoutes],
  ["/api/equipment",                          equipmentRoutes],
  ["/api/joblocations",                       jobLocationRoutes],
  ["/api/main-categories",                    mainCategoryRoutes],
  ["/api/nextservicetypes",                   nextServiceTypeRoutes],
  ["/api/operatortypes",                      operatorTypeRoutes],
  ["/api/servicecategories",                  serviceCategoryRoutes],
  ["/api/serviceproviders",                   serviceProviderRoutes],
  ["/api/services",                           servicesRoutes],
  ["/api/servicetypeones",                    serviceTypeOneRoutes],
  ["/api/servicetypetwos",                    serviceTypeTwoRoutes],
  ["/api/maintenance",                        fleetMaintenanceRoutes],
  ["/api/sales-order-old",                    salesOrderOld],
  ["/api/sales-orders",                       salesOrdersRoutes],
  ["/api/operational-handling",               operationalHandlingRoutes],
  ["/api/vehicle-owners",                     vehicleOwnerRoutes],
  ["/api/manpower",                           manpowerRoutes],
  ["/api/active-allocations",                 activeAllocationsOriginalRoutes],
  ["/api/service-entry-types",                serviceEntryTypeRoutes],
  ["/api/vehicle-types",                      vehicleTypeRoutes],
  ["/api/products",                           fleetProductRoutes],
  ["/api/attachments",                        fleetAttachmentRoutes],
  ["/api/attachment-locations",               attachmentLocationRoutes],
  ["/api/sales-order-recoveries",             salesOrderRecoveryRoutes],
  ["/api/attachment-stages",                  attachmentStageRoutes],
  ["/api/equipment-stages",                   equipmentStageRoutes],
  ["/api/manpower-stages",                    manpowerStageRoutes],
  ["/api/recovery-stages",                    recoveryStageRoutes],
  ["/api/backup-equipment-stages",            backupEquipmentStageRoutes],
  ["/api/backup-manpower-stages",             backupManpowerStageRoutes],
  ["/api/sub-product-attachment-stages",      subProductAttachmentStageRoutes],
  ["/api/delivery-notes",                     deliveryNoteRoutes],
  ["/api/master-checklist",                   masterChecklistRoutes],
  ["/api/operational-modifications",          operationalModificationRoutes],
  ["/api/attachment-swaps",                   attachmentSwapRoutes],
  ["/api/equipment-swaps",                    equipmentSwapRoutes],
  ["/api/operator-changes",                   operatorChangeRoutes],
  ["/api/swapreasons",                        swapReasonRoutes],
  ["/api/sub-product-swaps",                  subProductSwapRoutes],
  ["/api/off-hire-notes",                     OffHireNotesRoutes],
  ["/api/chargeable-types",                   ChargeableTypeRoutes],
  ["/api/swap-requests",                      SwapRequestRoutes],
  ["/api/sub-product-attachment-assignments", subProductAttachmentAssignmentRoutes],
  ["/api/push",                               pushRoutes],
];

const ASSETS_ROUTES = [
  ["/api/assets",                  assests],
  ["/api/sub-assets",              subAssets],
  ["/api/asset-transfers",         assetTransfers],
  ["/api/asset-disposals",         assetDisposals],
  ["/api/asset-categories",        assetCategories],
  ["/api/depreciation-schedules",  depreciationSchedules],
  ["/api/asset-subcategories",     assetSubCategories],
  ["/api/asset-capacities",        assetCapacities],
  ["/api/asset-classifications",   assetClassifications],
  ["/api/locations",               locationID],
  ["/api/custodians",              custodianID],
  ["/api/costcenters",             costCenterID],
  ["/api/suppliers",               supplierID],
  ["/api/model-assets",            modelAssetRoutes],
  ["/api/manufacturers",           manufacturerRoutes],
];

// ═════════════════════════════════════════════════════════════════════════════
// 1. USER MANAGEMENT SERVICE  — port 4001
// ═════════════════════════════════════════════════════════════════════════════
const userApp = express();
applyCommon(userApp, "[USER]");
userApp.use("/uploads", express.static(path.join(__dirname, "../../services/user-management-service/uploads")));
mountRoutes(userApp, USER_ROUTES);
userApp.get("/health", (_req, res) => res.json({ service: "user-management-service", status: "OK" }));

const USER_PORT = process.env.USER_PORT || 4001;
userApp.listen(USER_PORT, () => console.log(`🔐 User Management Service  → http://localhost:${USER_PORT}`));

// ═════════════════════════════════════════════════════════════════════════════
// 2. HR SERVICE  — port 4002
// ═════════════════════════════════════════════════════════════════════════════
const hrApp = express();
applyCommon(hrApp, "[HR]");
hrApp.use("/uploads", express.static(path.join(__dirname, "../../services/hr-service/src/uploads")));
mountRoutes(hrApp, HR_ROUTES);
hrApp.get("/health", (_req, res) => res.json({ service: "hr-service", status: "OK" }));

const HR_PORT = process.env.HR_PORT || 4002;
hrApp.listen(HR_PORT, () => console.log(`👥 HR Service               → http://localhost:${HR_PORT}`));

// ═════════════════════════════════════════════════════════════════════════════
// 3. SALES CRM SERVICE  — port 4003
// ═════════════════════════════════════════════════════════════════════════════
const crmApp = express();
applyCommon(crmApp, "[CRM]");
mountRoutes(crmApp, CRM_ROUTES);
crmApp.get("/health", (_req, res) => res.json({ service: "sales-crm-service", status: "OK" }));

const CRM_PORT = process.env.CRM_PORT || 4003;
crmApp.listen(CRM_PORT, () => console.log(`📊 Sales CRM Service        → http://localhost:${CRM_PORT}`));

// ═════════════════════════════════════════════════════════════════════════════
// 4. FLEET MANAGEMENT SERVICE  — port 4004
// ═════════════════════════════════════════════════════════════════════════════
const fleetApp = express();
applyCommon(fleetApp, "[FLEET]");
fleetApp.use("/uploads", express.static(path.join(__dirname, "../../services/fleet-management-service/src/uploads")));
mountRoutes(fleetApp, FLEET_ROUTES);
fleetApp.get("/health", (_req, res) => res.json({ service: "fleet-management-service", status: "OK" }));

const FLEET_PORT = process.env.FLEET_PORT || 4004;
fleetApp.listen(FLEET_PORT, async () => {
  console.log(`🚛 Fleet Management Service → http://localhost:${FLEET_PORT}`);
  console.log("🧪 Running initial LPO reminder check...");
  try   { await _runLPOReminderJob(); }
  catch (err) { console.error("❌ Initial LPO push check failed:", err.message); }
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. FIXED ASSETS SERVICE  — port 4005
// ═════════════════════════════════════════════════════════════════════════════
const assetsApp = express();
applyCommon(assetsApp, "[ASSETS]");
assetsApp.use("/uploads", express.static(path.join(__dirname, "../../services/fixed-assets-service/src/uploads")));
mountRoutes(assetsApp, ASSETS_ROUTES);
assetsApp.get("/health", (_req, res) => res.json({ service: "fixed-assets-service", status: "OK" }));

const ASSETS_PORT = process.env.ASSETS_PORT || 4005;
assetsApp.listen(ASSETS_PORT, () => console.log(`🏢 Fixed Assets Service     → http://localhost:${ASSETS_PORT}`));

// ═════════════════════════════════════════════════════════════════════════════
// 6. API GATEWAY  — port 4000
//    JWT auth + rate limiting, then delegates to the same in-process routers.
//    No HTTP proxy hop — all services share the same Node.js process.
// ═════════════════════════════════════════════════════════════════════════════
const gatewayApp = express();

gatewayApp.use(helmet());
gatewayApp.use(morgan("combined"));
gatewayApp.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  })
);
gatewayApp.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

gatewayApp.use(express.json({ limit: "50mb" }));
gatewayApp.use(express.urlencoded({ limit: "50mb", extended: true }));

// ── JWT Middleware ─────────────────────────────────────────────────────────
const PUBLIC_ROUTES = [
  "/api/auth", "/api/manageUser", "/api/manageCompany", "/api/users",
  "/api/user-types", "/api/user-groups", "/api/roles", "/api/permissions",
  "/api/password-rules", "/api/role-permissions", "/api/choicesList",
  "/api/organizations", "/api/tenants", "/api/branches", "/api/modules",
  "/api/subscription-plans", "/api/manageEmployee", "/api/department",
  "/api/contractType", "/api/designation", "/api/leaveType", "/api/workplace",
  "/api/bank", "/api/penalties", "/api/air", "/api/payroll", "/api/attendence",
  "/api/jobPosting", "/api/leave", "/api/applyLeave", "/api/loan",
  "/api/loanApproval", "/api/penalty", "/api/commissions", "/api/performance",
  "/api/goal", "/api/kpi", "/api/trainingDevelopment", "/api/countries",
  "/api/gratuity", "/api/provision", "/api/payroll-deductions",
  "/api/trainingDetails", "/api/jobOnboarding", "/api/contracts",
  "/api/gatepass", "/api/certifications-types", "/api/certifications-names",
  "/api/certifications-bodies", "/api/industries", "/api/crm/leads",
  "/api/crm/sales-pipelines", "/api/crm/prospects", "/api/crm/forms",
  "/api/crm/form-fields", "/api/schedules", "/api/equipment",
  "/api/joblocations", "/api/main-categories", "/api/nextservicetypes",
  "/api/operatortypes", "/api/servicecategories", "/api/serviceproviders",
  "/api/services", "/api/servicetypeones", "/api/servicetypetwos",
  "/api/maintenance", "/api/sales-order-old", "/api/sales-orders",
  "/api/operational-handling", "/api/vehicle-owners", "/api/manpower",
  "/api/active-allocations", "/api/service-entry-types", "/api/vehicle-types",
  "/api/products", "/api/attachments", "/api/attachment-locations",
  "/api/sales-order-recoveries", "/api/attachment-stages",
  "/api/equipment-stages", "/api/manpower-stages", "/api/recovery-stages",
  "/api/backup-equipment-stages", "/api/backup-manpower-stages",
  "/api/sub-product-attachment-stages", "/api/delivery-notes",
  "/api/master-checklist", "/api/operational-modifications",
  "/api/attachment-swaps", "/api/equipment-swaps", "/api/operator-changes",
  "/api/swapreasons", "/api/sub-product-swaps", "/api/off-hire-notes",
  "/api/chargeable-types", "/api/swap-requests",
  "/api/sub-product-attachment-assignments", "/api/push", "/api/assets",
  "/api/sub-assets", "/api/asset-transfers", "/api/asset-disposals",
  "/api/asset-categories", "/api/depreciation-schedules", "/api/manufacturers",
  "/api/asset-subcategories", "/api/asset-capacities",
  "/api/asset-classifications", "/api/locations", "/api/custodians",
  "/api/costcenters", "/api/suppliers", "/api/model-assets",
  "/api-docs", "/swagger.json",
];

gatewayApp.use((req, res, next) => {
  if (PUBLIC_ROUTES.some((r) => req.path.startsWith(r))) return next();
  const token = (req.headers["authorization"] || "").split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access token required" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
});

// ── Static uploads ─────────────────────────────────────────────────────────
gatewayApp.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Mount all service routes ───────────────────────────────────────────────
mountRoutes(gatewayApp, [
  ...USER_ROUTES,
  ...HR_ROUTES,
  ...CRM_ROUTES,
  ...FLEET_ROUTES,
  ...ASSETS_ROUTES,
]);

// ── Swagger ────────────────────────────────────────────────────────────────
gatewayApp.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health check ───────────────────────────────────────────────────────────
gatewayApp.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    gateway: `http://localhost:${process.env.PORT || 4000}`,
    services: {
      "user-management":  `http://localhost:${USER_PORT}`,
      "hr":               `http://localhost:${HR_PORT}`,
      "sales-crm":        `http://localhost:${CRM_PORT}`,
      "fleet-management": `http://localhost:${FLEET_PORT}`,
      "fixed-assets":     `http://localhost:${ASSETS_PORT}`,
    },
  });
});

// ── Start Gateway ──────────────────────────────────────────────────────────
const GATEWAY_PORT = process.env.PORT || 4000;
gatewayApp.listen(GATEWAY_PORT, () => {
  console.log(`\n🚀 API Gateway              → http://localhost:${GATEWAY_PORT}`);
  console.log("─".repeat(55));
  console.log(`   User Management          → http://localhost:${USER_PORT}`);
  console.log(`   HR Service               → http://localhost:${HR_PORT}`);
  console.log(`   Sales CRM                → http://localhost:${CRM_PORT}`);
  console.log(`   Fleet Management         → http://localhost:${FLEET_PORT}`);
  console.log(`   Fixed Assets             → http://localhost:${ASSETS_PORT}`);
  console.log("─".repeat(55) + "\n");
});