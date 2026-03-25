const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Parse all unique ports from env URLs
const getServers = () => {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  // Primary server (API Gateway)
  const servers = [
    {
      url: backendUrl,
      description: `API Gateway (Port ${new URL(backendUrl).port || 4000})`,
    },
  ];

  // Optionally expose individual microservices too
  const serviceUrls = [
    { url: process.env.USER_SERVICE_URL || "http://localhost:4001", description: "User Management Service" },
    { url: process.env.HR_SERVICE_URL || "http://localhost:4002", description: "HR Service" },
    { url: process.env.CRM_SERVICE_URL || "http://localhost:4003", description: "Sales CRM Service" },
    { url: process.env.FLEET_SERVICE_URL || "http://localhost:4004", description: "Fleet Management Service" },
    { url: process.env.ASSETS_SERVICE_URL || "http://localhost:4005", description: "Fixed Assets Service" },
  ];

  serviceUrls.forEach(({ url, description }) => {
    if (url) {
      try {
        const parsed = new URL(url);
        // Replace internal docker hostnames with localhost for Swagger UI access
        const localUrl = `http://localhost:${parsed.port}`;
        servers.push({ url: localUrl, description });
      } catch (_) {}
    }
  });

  return servers;
};

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "iManage360 API Document",
      version: "1.0.0",
      description:
        "This is the API documentation for iManage360 ERP system. It includes routes for authentication, user management, and other ERP-related functionalities.",
    },
    servers: getServers(),   // ← dynamic, multi-server
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: [
    "./routes/*.js",
    "./routes/user/*.js",
    "./routes/crm/*.js",
    "./routes/hr/*.js",
    "./routes/fixed-assests-management/*.js",
    "./routes/user-security-management/*.js",
    "./routes/subscription/*.js",
    "./routes/fleet-management/*.js",
    "../services/fixed-assets-service/src/routes/*.js",
    "../services/fleet-management-service/src/routes/*.js",
    "../services/hr-service/src/routes/*.js",
    "../services/sales-crm-service/src/routes/*.js",
    "../services/user-management-service/src/routes/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };