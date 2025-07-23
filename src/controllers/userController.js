const userService = require("../services/userService");
const manejarError = require("../utils/handlers/manejadorError");
const xlsx = require("xlsx");

async function registrarUsuario(req, res) {
  try {
    const datos = req.body;
    const resultado = await userService.crearUsuario(datos);
    return res.status(201).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function cambiarEstadoUsuario(req, res) {
  try {
    const { id_usuario } = req.params;
    const resultado = await userService.cambiarEstadoUsuario(id_usuario);
    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function crearUsuarioMasivamente(req, res) {
  try {
    const archivo = req.file;
    const workbook = xlsx.read(archivo.buffer, { type: "buffer" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = xlsx.utils.sheet_to_json(hoja);
    const resultado = await userService.crearUsuarioMasivamente(datos);

    res.status(201).json({
      success: true,
      mensaje: "Carga masiva finalizada.",
      resumen: resultado,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

async function editarUsuario(req, res) {
  try {
    const { id_usuario } = req.params;
    const datosActualizados = req.body;
    const resultado = await userService.editarUsuario(
      datosActualizados,
      id_usuario
    );
    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

async function obtenerUsuarios(req, res) {
  try {
    const filtros = req.query;
    const resultado = await userService.obtenerUsuarios(filtros);
    return res.status(200).json(resultado);
  } catch (error) {
    return manejarError(res, error);
  }
}

module.exports = {
  registrarUsuario,
  cambiarEstadoUsuario,
  crearUsuarioMasivamente,
  editarUsuario,
  obtenerUsuarios,
};
