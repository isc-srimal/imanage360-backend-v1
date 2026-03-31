// api-gateway/src/index.js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./middleware/authMiddleware");
const { swaggerUi, swaggerSpec } = require("../swagger/swaggerConfig");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(helmet());
app.use(morgan("combined"));
// app.use(
//   cors({
//     origin: [
//       process.env.FRONTEND_URL,
//       process.env.BACKEND_URL || "http://localhost:4000", // Allow Swagger UI
//       process.env.USER_SERVICE_URL || "http://localhost:4001",
//       process.env.HR_SERVICE_URL || "http://localhost:4002",
//       process.env.CRM_SERVICE_URL || "http://localhost:4003",
//       process.env.FLEET_SERVICE_URL || "http://localhost:4004",
//       process.env.ASSETS_SERVICE_URL || "http://localhost:4005",
//     ],
//     methods: "GET,POST,PUT,DELETE,PATCH",
//     credentials: true,
//   }),
// );
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, true); // allow all origins
    },
    methods: "GET,POST,PUT,DELETE,PATCH",
    credentials: true,
  }),
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// JWT Middleware
const authenticateToken = (req, res, next) => {
  // Public routes - skip auth
  const publicRoutes = [
    "/api/auth",
    "/api/manageUser",
    "/api/manageCompany",
    "/api/users",
    "/api/user-types",
    "/api/user-groups",
    "/api/roles",
    "/api/permissions",
    "/api/password-rules",
    "/api/role-permissions",
    "/api/choicesList",
    "/api/organizations",
    "/api/tenants",
    "/api/branches",
    "/api/modules",
    "/api/subscription-plans",
    "/api/manageEmployee",
    "/api/department",
    "/api/contractType",
    "/api/designation",
    "/api/leaveType",
    "/api/workplace",
    "/api/bank",
    "/api/penalties",
    "/api/air",
    "/api/payroll",
    "/api/attendence",
    "/api/jobPosting",
    "/api/leave",
    "/api/applyLeave",
    "/api/loan",
    "/api/loanApproval",
    "/api/penalty",
    "/api/commissions",
    "/api/performance",
    "/api/goal",
    "/api/kpi",
    "/api/trainingDevelopment",
    "/api/countries",
    "/api/gratuity",
    "/api/provision",
    "/api/payroll-deductions",
    "/api/trainingDetails",
    "/api/jobOnboarding",
    "/api/contracts",
    "/api/gatepass",
    "/api/certifications-types",
    "/api/certifications-names",
    "/api/certifications-bodies",
    "/api/industries",
    "/api/crm/leads",
    "/api/crm/sales-pipelines",
    "/api/crm/prospects",
    "/api/crm/forms",
    "/api/crm/form-fields",
    "/api/assets",
    "/api/sub-assets",
    "/api/asset-transfers",
    "/api/asset-disposals",
    "/api/asset-categories",
    "/api/depreciation-schedules",
    "/api/manufacturers",
    "/api/asset-subcategories",
    "/api/asset-capacities",
    "/api/asset-classifications",
    "/api/locations",
    "/api/custodians",
    "/api/costcenters",
    "/api/suppliers",
    "/api/model-assets",
    "/api-docs",
    "/swagger.json",
  ];

  if (publicRoutes.some((route) => req.path.startsWith(route))) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

app.use(authenticateToken);

// ─── Service URLs ──────────────────────────────────────────────────────────
const SERVICES = {
  USER: process.env.USER_SERVICE_URL || "http://localhost:4001",
  HR: process.env.HR_SERVICE_URL || "http://localhost:4002",
  CRM: process.env.CRM_SERVICE_URL || "http://localhost:4003",
  FLEET: process.env.FLEET_SERVICE_URL || "http://localhost:4004",
  ASSETS: process.env.ASSETS_SERVICE_URL || "http://localhost:4005",
};

// ─── Proxy Helper ──────────────────────────────────────────────────────────
const proxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error(`Proxy error to ${target}:`, err.message);
        res.status(503).json({ message: "Service temporarily unavailable" });
      },
    },
  });

// File Upload (If applicable)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Route Mappings ────────────────────────────────────────────────────────

// Auth & User Management
app.use("/api/auth", proxy(SERVICES.USER));
app.use("/api/manageUser", proxy(SERVICES.USER));
app.use("/api/manageCompany", proxy(SERVICES.USER));
app.use("/api/users", proxy(SERVICES.USER));
app.use("/api/user-types", proxy(SERVICES.USER));
app.use("/api/user-groups", proxy(SERVICES.USER));
app.use("/api/roles", proxy(SERVICES.USER));
app.use("/api/permissions", proxy(SERVICES.USER));
app.use("/api/password-rules", proxy(SERVICES.USER));
app.use("/api/role-permissions", proxy(SERVICES.USER));
app.use("/api/choicesList", proxy(SERVICES.USER));
app.use("/api/organizations", proxy(SERVICES.USER));
app.use("/api/tenants", proxy(SERVICES.USER));
app.use("/api/branches", proxy(SERVICES.USER));
app.use("/api/modules", proxy(SERVICES.USER));
app.use("/api/subscription-plans", proxy(SERVICES.USER));

// HR
app.use("/api/manageEmployee", proxy(SERVICES.HR));
app.use("/api/department", proxy(SERVICES.HR));
app.use("/api/contractType", proxy(SERVICES.HR));
app.use("/api/designation", proxy(SERVICES.HR));
app.use("/api/leaveType", proxy(SERVICES.HR));
app.use("/api/workplace", proxy(SERVICES.HR));
app.use("/api/bank", proxy(SERVICES.HR));
app.use("/api/penalties", proxy(SERVICES.HR));
app.use("/api/air", proxy(SERVICES.HR));
app.use("/api/payroll", proxy(SERVICES.HR));
app.use("/api/attendence", proxy(SERVICES.HR));
app.use("/api/jobPosting", proxy(SERVICES.HR));
app.use("/api/leave", proxy(SERVICES.HR));
app.use("/api/applyLeave", proxy(SERVICES.HR));
app.use("/api/loan", proxy(SERVICES.HR));
app.use("/api/loanApproval", proxy(SERVICES.HR));
app.use("/api/penalty", proxy(SERVICES.HR));
app.use("/api/commissions", proxy(SERVICES.HR));
app.use("/api/performance", proxy(SERVICES.HR));
app.use("/api/goal", proxy(SERVICES.HR));
app.use("/api/kpi", proxy(SERVICES.HR));
app.use("/api/trainingDevelopment", proxy(SERVICES.HR));
app.use("/api/countries", proxy(SERVICES.HR));
app.use("/api/gratuity", proxy(SERVICES.HR));
app.use("/api/provision", proxy(SERVICES.HR));
app.use("/api/payroll-deductions", proxy(SERVICES.HR));
app.use("/api/trainingDetails", proxy(SERVICES.HR));
app.use("/api/jobOnboarding", proxy(SERVICES.HR));
app.use("/api/contracts", proxy(SERVICES.HR));
app.use("/api/gatepass", proxy(SERVICES.HR));
app.use("/api/certifications-types", proxy(SERVICES.HR));
app.use("/api/certifications-names", proxy(SERVICES.HR));
app.use("/api/certifications-bodies", proxy(SERVICES.HR));
app.use("/api/industries", proxy(SERVICES.HR));

// CRM
app.use("/api/crm/leads", proxy(SERVICES.CRM));
app.use("/api/crm/sales-pipelines", proxy(SERVICES.CRM));
app.use("/api/crm/prospects", proxy(SERVICES.CRM));
app.use("/api/crm/forms", proxy(SERVICES.CRM));
app.use("/api/crm/form-fields", proxy(SERVICES.CRM));

// Fleet
app.use("/api/schedules", proxy(SERVICES.FLEET));
app.use("/api/equipment", proxy(SERVICES.FLEET));
app.use("/api/joblocations", proxy(SERVICES.FLEET));
app.use("/api/main-categories", proxy(SERVICES.FLEET));
app.use("/api/sales-orders", proxy(SERVICES.FLEET));
app.use("/api/operational-handling", proxy(SERVICES.FLEET));
app.use("/api/vehicle-owners", proxy(SERVICES.FLEET));
app.use("/api/manpower", proxy(SERVICES.FLEET));
app.use("/api/maintenance", proxy(SERVICES.FLEET));
app.use("/api/delivery-notes", proxy(SERVICES.FLEET));
app.use("/api/swap-requests", proxy(SERVICES.FLEET));
app.use("/api/off-hire-notes", proxy(SERVICES.FLEET));
app.use("/api/push", proxy(SERVICES.FLEET));

// Assets
app.use("/api/assets", proxy(SERVICES.ASSETS));
app.use("/api/sub-assets", proxy(SERVICES.ASSETS));
app.use("/api/asset-transfers", proxy(SERVICES.ASSETS));
app.use("/api/asset-disposals", proxy(SERVICES.ASSETS));
app.use("/api/asset-categories", proxy(SERVICES.ASSETS));
app.use("/api/depreciation-schedules", proxy(SERVICES.ASSETS));
app.use("/api/manufacturers", proxy(SERVICES.ASSETS));
app.use("/api/asset-subcategories", proxy(SERVICES.ASSETS));
app.use("/api/asset-capacities", proxy(SERVICES.ASSETS));
app.use("/api/asset-classifications", proxy(SERVICES.ASSETS));
app.use("/api/locations", proxy(SERVICES.ASSETS));
app.use("/api/custodians", proxy(SERVICES.ASSETS));
app.use("/api/costcenters", proxy(SERVICES.ASSETS));
app.use("/api/suppliers", proxy(SERVICES.ASSETS));
app.use("/api/model-assets", proxy(SERVICES.ASSETS));

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: Object.keys(SERVICES),
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
});
