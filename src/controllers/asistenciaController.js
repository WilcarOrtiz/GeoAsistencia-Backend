const asistenciaService = require("../services/asistenciaService");

async function registrarAsistencia(req, res) {
  try {
    const datos = req.body;
    const id_estudiante = req.user.uid;
    const resultado = await asistenciaService.registrarAsistencia(
      datos,
      id_estudiante
    );
    res.status(200).json({
      success: true,
      message: resultado.mensaje,
      docentes: resultado.docentes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

async function cambiarEstadoAsistencia(req, res) {
  try {
    const datos = req.body;
    const resultado = await asistenciaService.cambiarEstadoAsistencia(datos);
    res.status(200).json({
      success: true,
      message: resultado.mensaje,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

module.exports = {
  registrarAsistencia,
  cambiarEstadoAsistencia,
};
