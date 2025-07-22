const validarParametros = require("../utils/validaciones/validarParametros");
const historialService = require("../services/historialService");

async function consultarEstudiantesPorIdHistorial(req, res) {
  try {
    const { id_historial_asistencia } = req.params;
    if (!validarParametros(req, res, ["id_historial_asistencia"])) return;
    const estudiantes = await historialService.consultarEstudiantesPorIdHistorial(id_historial_asistencia);
    return res.status(200).json(estudiantes);
  } catch (error) {
     return manejarError(res, error);
  }
}

module.exports = { consultarEstudiantesPorIdHistorial };