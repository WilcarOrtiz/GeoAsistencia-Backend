const userService = require("../services/userService");
const path = require("path");

async function registrarUsuario(req, res) {
  try {
    const datos = req.body;
    const resultado = await userService.crearUsuario(datos);
    res.status(201).json({
      success: true,
      message: resultado.mensaje,
      idUsuario: resultado.idUsuario,
      rol: resultado.rol,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

async function cambiarEstadoUsuario(req, res) {
  try {
    const { id_usuario } = req.body;
    const resultado = await userService.cambiarEstadoUsuario(id_usuario);
    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      estado: resultado.estado,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

async function crearUsuarioMasivamente(req, res) {
  try {
    const archivo = req.file;
    if (!archivo) {
      return res.status(400).json({ error: "No se envió archivo Excel." });
    }

    const filePath = path.resolve(archivo.path);
    const resultado = await userService.crearUsuarioMasivamente(filePath);

    res.status(200).json({
      success: true,
      mensaje: "Carga masiva finalizada.",
      resumen: resultado,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  registrarUsuario,
  cambiarEstadoUsuario,
  crearUsuarioMasivamente,
};
