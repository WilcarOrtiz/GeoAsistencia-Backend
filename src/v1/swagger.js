const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GeoAsistencia API",
      version: "1.0.0",
      description: "Documentación de la API para el sistema de GeoAsistencia",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./src/v1/routes/userRoutes.js",
    "./src/v1/routes/docentesRoutes.js",
    "./src/v1/routes/estudianteRoutes.js",
    "./src/v1/routes/asignaturaRoutes.js",
    "./src/schemas/asignaturaSchema.js",
    "./src/schemas/userSchema.js",
    "./src/schemas/grupoSchema.js",
    "./src/v1/routes/grupoRoutes.js",
    "./src/schemas/diaSchema.js",
    "./src/schemas/horarioSchema.js",
    "./src/schemas/historialSchema.js",
    "./src/v1/routes/asistenciaRoutes.js",
    "./src/v1/routes/historialRoutes.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app, port) => {
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api/v1/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `✅ Documentación disponible en: http://localhost:${port}/api/v1/docs`
  );
};

module.exports = { swaggerDocs };
