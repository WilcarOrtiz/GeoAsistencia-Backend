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
      return res
        .status(400)
        .json({ success: false, error: "No se envió archivo Excel." });
    }

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

module.exports = {
  registrarUsuario,
  cambiarEstadoUsuario,
  crearUsuarioMasivamente,
};
