const userService = require("../services/userService");
const xlsx = require("xlsx");

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
    const { id_usuario } = req.params;
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
    const workbook = xlsx.read(archivo.buffer, { type: "buffer" });
    const hoja = workbook.Sheets[workbook.SheetNames[0]];
    const datos = xlsx.utils.sheet_to_json(hoja);
    const resultado = await userService.crearUsuarioMasivamente(datos);

    res.status(200).json({
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

    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      idUsuario: resultado.idUsuario,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

/*function obtenerUsuariosPorRol(nombreRol) {
  return async function (req, res) {
    try {
      const { id_usuario } = req.query;
      const usuarios = await userService.obtenerUsuarios(
        nombreRol,
        id_usuario || null
      );
      res.status(200).json({
        success: true,
        usuarios,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  };
} */

async function obtenerUsuarios(req, res) {
  try {
    const filtros = req.query; // Captura todos los query params
    const usuarios = await userService.obtenerUsuarios(filtros);

    res.status(200).json({
      success: true,
      usuarios,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  registrarUsuario,
  cambiarEstadoUsuario,
  crearUsuarioMasivamente,
  editarUsuario,
  obtenerUsuarios,
};
