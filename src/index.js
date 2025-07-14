// index.js

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");

async function main() {
  try {
    const app = express();

    app.use(cookieParser());
    app.use(bodyParser.json());

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
    console.error(`❌ Error al iniciar el servidor: ${error}`);
  }
}

main();
