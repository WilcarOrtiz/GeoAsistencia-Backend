// index.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");
const { sequelize } = require("./models");

const userRoutes = require("./v1/routes/userRoutes");

async function main() {
  try {
    await sequelize.authenticate();
    const app = express();
    app.use(cookieParser());
    app.use(bodyParser.json());

    app.use("/api/v1", userRoutes);

    app.use(
      cors({
        credentials: true,
        origin: (origin, callback) => {
          // Permitir cualquier origen durante desarrollo (lo restringimos más adelante)
          callback(null, true);
        },
      })
    );

    const PORT = process.env.PORT || 3006;

    app.listen(PORT, () => {
      console.log(`✅ API is listening on port ${PORT}`);
      V1SwaggerDocs(app, PORT);
    });
  } catch (error) {
    console.error(`❌ Error al iniciar el servidor: ${error.message}`);
    console.error("Stack trace:", error.stack);

    if (error.message.includes("ENOTFOUND")) {
      console.error("\n📝 Sugerencias para resolver el problema:");
      console.error("1. Verifica que tu proyecto de Supabase esté activo");
      console.error("2. Revisa la URL de conexión en tu dashboard de Supabase");
      console.error("3. Asegúrate de tener acceso a internet");
      console.error("4. Verifica que no hay firewall bloqueando la conexión");
    }

    process.exit(1);
  }
}

main();
