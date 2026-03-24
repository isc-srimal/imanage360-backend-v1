const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const baseUrl = process.env.BACKEND_URL || "http://localhost:4000"; 

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "iManage360 API Document",
      version: "1.0.0",
      description:
        "This is the API documentation for iManage360 ERP system. It includes routes for authentication, user management, and other ERP-related functionalities.",
    },
    servers: [{ url: baseUrl }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT", // Specify the type of token (JWT in this case)
        },
      },
    },
    security: [
      {
        BearerAuth: [], // This tells Swagger that authentication is required for every endpoint
      },
    ],
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
    "../services/user-management-service/src/routes/*.js"
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
