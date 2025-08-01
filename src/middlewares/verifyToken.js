const admin = require("firebase-admin");
const {
  validarExistencia,
} = require("../utils/validaciones/validarExistenciaModelo");

const { obtenerModeloPorRol } = require("../utils/helpers/modeloHelper");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    const rol = req.user.rol?.toUpperCase();
    const id = req.user.uid;

    if (!rol || !id) {
      return res.status(401).json({ error: "Token inválido: falta rol o ID" });
    }

    if (rol === "ADMINISTRADOR") {
      return next();
    }

    const modelo = await obtenerModeloPorRol(rol);
    const resultado = await validarExistencia(modelo, id, rol);

    if (!resultado.estado) {
      return res.status(403).json({ error: "Usuario inactivo" });
    }

    return next();
  } catch (err) {
    console.error("Error al verificar token:", err);
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = { verifyToken };
