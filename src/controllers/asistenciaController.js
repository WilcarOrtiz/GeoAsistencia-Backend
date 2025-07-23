const asistenciaService = require("../services/asistenciaService");

async function registrarAsistencia(req, res) {
  try {
    const { id_grupo } = req.body;
    const id_estudiante = req.user.uid;
    const resultado = await asistenciaService.registrarAsistencia(
      id_grupo,
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
    const { id_grupo, id_estudiante } = req.body;
    const resultado = await asistenciaService.cambiarEstadoAsistencia(
      id_grupo,
      id_estudiante
    );
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

async function validarUbicacion(req, res) {
  try {
    const { latitud, longitud } = req.body;

    const resultado = await asistenciaService.validarUbicacion(
      latitud,
      longitud
    );
    res.status(200).json({
      success: true,
      ...resultado,
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
  validarUbicacion,
};
